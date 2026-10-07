#!/usr/bin/env node
"use strict";

/**
 * Ground-truth auditor for chapter-manifest.js denominators.
 *
 * The manifests claim to be the "single source of truth" for the progress
 * percentages shown by Mission Control and the Progress Dashboard. They drift
 * whenever chapter HTML changes, which silently caps a chapter below 100%.
 *
 * Rather than guessing selector semantics, this script boots each chapter page
 * in jsdom with the real shared/progress-tracker.js, drives every trackable
 * interaction, and reads the resulting localStorage record. What the tracker
 * actually counts IS the denominator.
 *
 * Usage:
 *   node scripts/audit-denominators.js           # report drift
 *   node scripts/audit-denominators.js --check   # exit 1 on drift (CI mode)
 *   node scripts/audit-denominators.js --fix     # rewrite chapter-manifest.js
 *   node scripts/audit-denominators.js --json    # machine-readable output
 */

var fs = require("fs");
var path = require("path");
var JSDOM = require("jsdom").JSDOM;

var ROOT = path.resolve(__dirname, "..");

// dir -> { chapters, trackerPath } ; trackerPath mirrors the hub-mounted URL so
// that detectProgressTrackerConfig() resolves the same config as production.
var HUBS = [
  { dir: "5270RandomAlgo", chapters: 12, mount: "5270" },
  { dir: "5318ML", chapters: 6, mount: "5318" },
  { dir: "5046NLP", chapters: 6, mount: "5046" },
  { dir: "9001Py", chapters: 5, mount: "9001Py" },
  { dir: "9123DataStructureAlgo", chapters: 10, mount: "9123" },
  { dir: "COMP5047", chapters: 8, mount: "5047" },
  { dir: "COMP5618", chapters: 7, mount: "5618" },
  { dir: "ELEC5620", chapters: 8, mount: "5620" },
  { dir: "INFO5995", chapters: 8, mount: "5995" },
  { dir: "INFO6007", chapters: 8, mount: "6007" }
];

var args = process.argv.slice(2);
var MODE = args.indexOf("--fix") !== -1
  ? "fix"
  : args.indexOf("--check") !== -1
    ? "check"
    : args.indexOf("--json") !== -1
      ? "json"
      : "report";

function makeDOM(htmlBody, urlPath) {
  var dom = new JSDOM(
    "<!DOCTYPE html><html lang=\"en\"><head></head><body>" + htmlBody + "</body></html>",
    { url: "http://localhost:8000" + urlPath, pretendToBeVisual: true, runScripts: "dangerously" }
  );
  if (!dom.window.IntersectionObserver) {
    dom.window.IntersectionObserver = function IntersectionObserver(cb) {
      this._cb = cb;
    };
    dom.window.IntersectionObserver.prototype.observe = function(el) {
      this._cb([{ target: el, isIntersecting: true, intersectionRatio: 1 }], this);
    };
    dom.window.IntersectionObserver.prototype.unobserve = function() {};
    dom.window.IntersectionObserver.prototype.disconnect = function() {};
  }
  if (!dom.window.MutationObserver) {
    dom.window.MutationObserver = function MutationObserver() {};
    dom.window.MutationObserver.prototype.observe = function() {};
    dom.window.MutationObserver.prototype.disconnect = function() {};
  }
  return dom;
}

function tick(win, ms) {
  return new Promise(function(resolve) { win.setTimeout(resolve, ms || 0); });
}

async function drivePage(filePath, urlPath, trackerSrc) {
  if (!fs.existsSync(filePath)) return null;
  var raw = fs.readFileSync(filePath, "utf8");
  var bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  var body = bodyMatch ? bodyMatch[1] : raw;
  // Strip <script> tags: we inject the tracker ourselves, and page-specific
  // scripts are irrelevant (and noisy) for denominator counting.
  body = body.replace(/<script[\s\S]*?<\/script>/gi, "");

  var dom = makeDOM(body, urlPath);
  var win = dom.window;
  var doc = win.document;
  try {
    win.eval(trackerSrc);
  } catch (e) {
    dom.window.close();
    throw new Error("progress-tracker failed to load for " + urlPath + ": " + e.message);
  }

  // Drive every quick-check option once (covers both per-option and
  // per-block tracker modes).
  var opts = Array.prototype.slice.call(doc.querySelectorAll(".quick-check .qc-opt"));
  opts.forEach(function(opt) {
    try { opt.click(); } catch (e) { /* ignore */ }
  });

  // Solution toggles: the tracker only offers a self-assessment once the
  // solution panel is open, so mirror the page script's class flip first.
  var toggles = Array.prototype.slice.call(doc.querySelectorAll(".solution-toggle"));
  toggles.forEach(function(btn) {
    var t = btn.getAttribute("data-target");
    var panel = t ? doc.getElementById(t) : null;
    if (panel) panel.classList.add("open");
    try { btn.click(); } catch (e) { /* ignore */ }
  });
  await tick(win, 5);

  // Confirm "Yes, understood" for every self-assessment the tracker injected.
  Array.prototype.slice.call(doc.querySelectorAll(".tutorial-self-check .tutorial-self-yes"))
    .forEach(function(yes) {
      try { yes.click(); } catch (e) { /* ignore */ }
    });
  await tick(win, 5);

  var key = null;
  for (var i = 0; i < win.localStorage.length; i++) {
    var k = win.localStorage.key(i);
    if (/_progress$/.test(k)) key = k;
  }
  var snapshot = { key: key, sections: [], study: 0, math: 0, tutorials: [] };
  if (key) {
    var data = {};
    try { data = JSON.parse(win.localStorage.getItem(key) || "{}"); } catch (e) { data = {}; }
    var chKey = urlPath.match(/chapter(\d+)/);
    var rec = (chKey && data["ch" + chKey[1]]) || {};
    snapshot.sections = Object.keys(rec.sections || {});
    snapshot.study = rec.quickChecksStudy || 0;
    // Simple/accessible tracker mode stores only an aggregate counter.
    snapshot.studySimple = rec.quickChecks || 0;
    snapshot.math = rec.quickChecksMath || 0;
    snapshot.tutorials = Object.keys(rec.tutorials || {}).filter(function(k) {
      return rec.tutorials[k] === true;
    });
  }
  dom.window.close();
  return snapshot;
}

async function measureChapter(hub, ch, trackerSrc) {
  var webDir = path.join(ROOT, hub.dir, "chapters", "chapter" + ch, "web");
  var studyFile = path.join(webDir, "chapter" + ch + "-study.html");
  var mathFile = path.join(webDir, "chapter" + ch + "-math.html");
  if (!fs.existsSync(studyFile)) return null;

  var study = await drivePage(
    studyFile,
    "/" + hub.mount + "/chapters/chapter" + ch + "/web/chapter" + ch + "-study.html",
    trackerSrc
  );
  var math = await drivePage(
    mathFile,
    "/" + hub.mount + "/chapters/chapter" + ch + "/web/chapter" + ch + "-math.html",
    trackerSrc
  );

  var checks = study.study + study.math + (math ? math.study + math.math : 0);
  // In simple/accessible mode splitQuickChecks is off, so the aggregate
  // counter holds the page total.
  if (checks === 0) {
    checks = (study.studySimple || 0) + (math ? math.studySimple || 0 : 0);
  }

  // Sections are stored as { "<data-track id>": timestamp } on the chapter's
  // shared progress record, so a foundations page that reuses the study page's
  // ids (5318, 9123) does not raise the maximum — only the union of ids does.
  var sectionIds = {};
  study.sections.forEach(function (id) {
    sectionIds[id] = 1;
  });
  if (math) {
    math.sections.forEach(function (id) {
      sectionIds[id] = 1;
    });
  }

  return {
    sections: Object.keys(sectionIds).length,
    checks: checks,
    tutorials: study.tutorials.length + (math ? math.tutorials.length : 0)
  };
}

function loadManifest(hubDir) {
  var file = path.join(ROOT, hubDir, "data", "chapter-manifest.js");
  if (!fs.existsSync(file)) return { file: file, data: null };
  var sandbox = { window: {} };
  /* eslint-disable-next-line no-new-func */
  new Function("window", fs.readFileSync(file, "utf8"))(sandbox.window);
  return { file: file, data: sandbox.window.CHAPTER_MANIFEST || null };
}

function renderManifest(hubDir, manifest, measured) {
  var lines = [];
  lines.push("/**");
  lines.push(" * " + hubDir + " — Single source of truth for chapter progress denominators.");
  lines.push(" *");
  lines.push(" * sections  — .section[data-track] tracked on chapterN-study.html");
  lines.push(" * checks    — quick-check interactions (study + foundations pages)");
  lines.push(" * tutorials — solution-toggle self-assessments per chapter");
  lines.push(" *");
  lines.push(" * Generated from the live pages by scripts/audit-denominators.js — do not");
  lines.push(" * hand-edit. Re-run: node scripts/audit-denominators.js --fix");
  lines.push(" */");
  lines.push("window.CHAPTER_MANIFEST = {");

  ["sections", "checks", "tutorials"].forEach(function(dim) {
    var parts = Object.keys(measured)
      .sort(function(a, b) { return a - b; })
      .map(function(ch) { return ch + ": " + measured[ch][dim]; });
    lines.push("  " + dim + ": { " + parts.join(", ") + " }" + (dim === "tutorials" ? "" : ","));
  });

  lines.push("};");
  lines.push("");
  return lines.join("\n");
}

var trackerSrc = fs.readFileSync(path.join(ROOT, "shared", "progress-tracker.js"), "utf8");
var results = {};
var drift = [];

async function main() {
  for (var h = 0; h < HUBS.length; h++) {
    var hub = HUBS[h];
    var m = loadManifest(hub.dir);
    var measured = {};
    for (var ch = 1; ch <= hub.chapters; ch++) {
      var got = await measureChapter(hub, ch, trackerSrc);
      if (got) measured[ch] = got;
    }
    results[hub.dir] = { measured: measured, manifest: m.data, file: m.file };

    Object.keys(measured).forEach(function(ch) {
      var mm = measured[ch];
      var old = (m.data && m.data.sections && m.data.sections[ch]) || 0;
      var oldC = (m.data && m.data.checks && m.data.checks[ch]) || 0;
      var oldT = (m.data && m.data.tutorials && m.data.tutorials[ch]) || 0;
      if (old !== mm.sections || oldC !== mm.checks || oldT !== mm.tutorials) {
        drift.push({
          hub: hub.dir,
          ch: Number(ch),
          was: { sections: old, checks: oldC, tutorials: oldT },
          now: mm
        });
      }
    });
  }
  report();
}

function report() {
  if (MODE === "json") {
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  }

  var hubsWithDrift = {};
  drift.forEach(function(d) { hubsWithDrift[d.hub] = true; });

  HUBS.forEach(function(hub) {
    console.log("[" + hub.dir + "]");
    var measured = results[hub.dir].measured;
    Object.keys(measured)
      .sort(function(a, b) { return a - b; })
      .forEach(function(ch) {
        var mm = measured[ch];
        var d = drift.filter(function(x) {
          return x.hub === hub.dir && x.ch === Number(ch);
        })[0];
        if (d) {
          console.log(
            "  \u2717 Ch" + ch + ": sections=" + mm.sections + " checks=" + mm.checks +
            " tutorials=" + mm.tutorials + "  (manifest said " + d.was.sections + "/" +
            d.was.checks + "/" + d.was.tutorials + ")"
          );
        } else {
          console.log(
            "  \u2713 Ch" + ch + ": sections=" + mm.sections + " checks=" + mm.checks +
            " tutorials=" + mm.tutorials
          );
        }
      });
    console.log("");
  });

  if (MODE === "fix") {
    Object.keys(results).forEach(function(hubDir) {
      if (!hubsWithDrift[hubDir]) return;
      var r = results[hubDir];
      fs.writeFileSync(r.file, renderManifest(hubDir, r.manifest, r.measured), "utf8");
      console.log("rewrote " + path.relative(ROOT, r.file));
    });
    console.log("\n" + drift.length + " chapter(s) corrected.");
    process.exit(0);
  }

  if (drift.length === 0) {
    console.log("All chapter manifests match the live pages. \u2713");
    process.exit(0);
  }

  console.log(drift.length + " chapter(s) drifted:");
  drift.forEach(function(d) {
    console.error(
      "  \u2717 " + d.hub + " ch" + d.ch + ": manifest " + d.was.sections + "/" +
      d.was.checks + "/" + d.was.tutorials + " \u2192 live " + d.now.sections + "/" +
      d.now.checks + "/" + d.now.tutorials
    );
  });
  console.log("\nRun with --fix to regenerate the manifests.");
  process.exit(MODE === "check" ? 1 : 0);
}

main().catch(function(e) {
  console.error("audit failed: " + (e && e.stack ? e.stack : e));
  process.exit(2);
});
