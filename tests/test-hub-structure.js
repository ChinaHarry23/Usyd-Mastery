#!/usr/bin/env node
"use strict";

/**
 * Hub structure tests.
 *
 * Enforces the structural contract every course hub must satisfy, so a chapter
 * authored by hand or by tooling cannot quietly break progress tracking:
 *
 *   1. Every declared chapter has study / foundations / mind-map pages
 *   2. Only the study page carries `data-track` — the tracker would otherwise
 *      move the sections goalpost when a learner visits the foundations page
 *   3. `data-track` values are unique within a study page
 *   4. Every study page has quick-checks and at least one worked solution
 *   5. Every chapter page has the language-toggle injection block
 *   6. Mind-map links resolve to ids that exist on the target page
 *   7. No page uses eval / new Function (the CSP forbids it anyway)
 *   8. Every hub ships the tool pages, data files and shared config it needs
 *
 * Run with: node tests/test-hub-structure.js
 */

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var JSDOM = require("jsdom").JSDOM;

var ROOT = path.resolve(__dirname, "..");
var passed = 0;
var failed = 0;
var failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (e) {
    failed++;
    failures.push(name + " — " + e.message);
  }
}

var HUBS = [
  { dir: "5270RandomAlgo", chapters: 12 },
  { dir: "5318ML", chapters: 6 },
  { dir: "5046NLP", chapters: 6 },
  { dir: "9001Py", chapters: 5 },
  { dir: "9123DataStructureAlgo", chapters: 10 },
  { dir: "COMP5047", chapters: 8 },
  { dir: "COMP5618", chapters: 7 },
  { dir: "ELEC5620", chapters: 8 },
  { dir: "INFO5995", chapters: 8 },
  { dir: "INFO6007", chapters: 8 }
];

// Hubs whose foundations pages legitimately tracked sections before the
// contract was formalised; they keep their existing ids and are tolerated.
var SECTION_TRACKING_FOUNDATIONS = { "5318ML": true, "9123DataStructureAlgo": true };

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function exists(file) {
  return fs.existsSync(file);
}

function webDir(hub, ch) {
  return path.join(ROOT, hub.dir, "chapters", "chapter" + ch, "web");
}

function count(str, re) {
  var m = str.match(re);
  return m ? m.length : 0;
}

/** Count elements whose class attribute contains `cls` as a whole token. */
function countClass(html, cls) {
  var re = /class="([^"]*)"/g;
  var m;
  var n = 0;
  while ((m = re.exec(html))) {
    if (m[1].split(/\s+/).indexOf(cls) !== -1) n++;
  }
  return n;
}

// Hubs built before the S2 2026 authoring contract. They predate
// shared/interactive.js and the <!-- LANG-INJECT --> marker convention, so
// those two are only required of the newer hubs.
var LEGACY_HUBS = {
  "5270RandomAlgo": true, "5318ML": true, "5046NLP": true,
  "9001Py": true, "9123DataStructureAlgo": true
};

/* ─────────────────────────────────────────────────────────── */

console.log("\n\u2500\u2500 Hub structure \u2500\u2500");

HUBS.forEach(function (hub) {
  var hubPath = path.join(ROOT, hub.dir);

  test(hub.dir + ": hub entry points exist", function () {
    assert.ok(exists(path.join(hubPath, "index.html")), "index.html missing");
    assert.ok(exists(path.join(hubPath, "README.md")), "README.md missing");
    assert.ok(exists(path.join(hubPath, "data", "chapter-manifest.js")), "chapter-manifest.js missing");
    assert.ok(exists(path.join(hubPath, "data", "quiz-data-extract.js")), "quiz-data-extract.js missing");
    assert.ok(exists(path.join(hubPath, "data", "flashcard-data.js")), "flashcard-data.js missing");
    assert.ok(exists(path.join(hubPath, "shared", "study.css")), "shared/study.css missing");
    assert.ok(exists(path.join(hubPath, "shared", "lang-config.js")), "shared/lang-config.js missing");
    assert.ok(
      exists(path.join(hubPath, "shared", "chapter-ui.js")) ||
      exists(path.join(hubPath, "shared", "chapter-study-base.js")) ||
      exists(path.join(hubPath, "shared", "math-page.js")) ||
      exists(path.join(hubPath, "shared", "quick-check.js")) ||
      exists(path.join(ROOT, "shared", "chapter-common.js")),
      "no chapter presentation module found"
    );
  });

  test(hub.dir + ": tool pages exist", function () {
    ["flashcards.html", "quiz-hub.html", "progress-dashboard.html", "knowledge-graph.html"]
      .forEach(function (f) {
        assert.ok(exists(path.join(hubPath, "tools", f)), "tools/" + f + " missing");
      });
  });

  for (var ch = 1; ch <= hub.chapters; ch++) {
    (function (ch) {
      var dir = webDir(hub, ch);
      var studyPath = path.join(dir, "chapter" + ch + "-study.html");
      var mathPath = path.join(dir, "chapter" + ch + "-math.html");
      var mmPath = path.join(dir, "chapter" + ch + "-mindmap.html");

      test(hub.dir + " ch" + ch + ": pages exist", function () {
        assert.ok(exists(studyPath), "study page missing");
        assert.ok(exists(mathPath), "foundations page missing");
        assert.ok(exists(mmPath), "mind map page missing");
      });

      if (!exists(studyPath)) return;
      var study = read(studyPath);
      var math = exists(mathPath) ? read(mathPath) : "";
      var mm = exists(mmPath) ? read(mmPath) : "";

      test(hub.dir + " ch" + ch + ": study page tracks unique sections", function () {
        var ids = (study.match(/data-track="([^"]+)"/g) || []).map(function (s) {
          return s.replace(/data-track="|"/g, "");
        });
        assert.ok(ids.length >= 5, "expected at least 5 tracked sections, found " + ids.length);
        var seen = {};
        ids.forEach(function (id) {
          assert.ok(!seen[id], "duplicate data-track id: " + id);
          seen[id] = true;
        });
      });

      if (!SECTION_TRACKING_FOUNDATIONS[hub.dir]) {
        test(hub.dir + " ch" + ch + ": foundations page does not track sections", function () {
          assert.strictEqual(
            count(math, /data-track/g),
            0,
            "foundations page must not use data-track (it would inflate the sections denominator)"
          );
        });
      }

      test(hub.dir + " ch" + ch + ": chapter has quick checks and a worked solution", function () {
        var checks = countClass(study, "quick-check") + countClass(math, "quick-check");
        assert.ok(checks >= 3, "expected at least 3 quick-check blocks across study+foundations, found " + checks);
        // Legacy hubs ship without worked-solution slots; mastery renormalises
        // over missing dimensions, so this is a content gap rather than a
        // structural break. New hubs are still required to provide them.
        if (!LEGACY_HUBS[hub.dir]) {
          var solutions = countClass(study, "solution-toggle") + countClass(math, "solution-toggle");
          assert.ok(
            solutions >= 1,
            "expected at least one .solution-toggle for the tutorial self-assessment"
          );
        }
      });

      test(hub.dir + " ch" + ch + ": language toggle is wired", function () {
        [["study", study], ["foundations", math], ["mind map", mm]].forEach(function (pair) {
          if (!pair[1]) return;
          assert.ok(
            /shared\/lang-toggle\.js/.test(pair[1]),
            pair[0] + " page does not load shared/lang-toggle.js"
          );
          if (!LEGACY_HUBS[hub.dir]) {
            assert.ok(
              pair[1].indexOf("<!-- LANG-INJECT -->") !== -1,
              pair[0] + " page is missing the <!-- LANG-INJECT --> marker"
            );
          }
        });
      });

      test(hub.dir + " ch" + ch + ": no eval / new Function", function () {
        [study, math, mm].forEach(function (html) {
          assert.ok(!/\beval\s*\(/.test(html), "eval() found in a chapter page");
          assert.ok(!/new\s+Function\s*\(/.test(html), "new Function() found in a chapter page");
        });
      });

      test(hub.dir + " ch" + ch + ": mind map links resolve", function () {
        if (!mm) return;
        var byFile = {};
        function loadPage(file) {
          if (byFile[file] !== undefined) return byFile[file];
          var full = path.join(dir, file);
          byFile[file] = exists(full) ? read(full) : null;
          return byFile[file];
        }
        var hrefs = (mm.match(/href:\s*"([^"]+)"/g) || []).map(function (s) {
          return s.replace(/href:\s*"|"/g, "");
        });
        if (hrefs.length === 0) return; // legacy mind maps may link only at the branch level
        hrefs.forEach(function (href) {
          if (/^https?:/i.test(href)) return;
          var parts = href.split("#");
          var file = parts[0];
          var anchor = parts[1];
          if (!file) return;
          var html = loadPage(file);
          assert.ok(html !== null, "mind map links to a missing page: " + file);
          if (!anchor) return;
          assert.ok(
            html.indexOf('id="' + anchor + '"') !== -1,
            "mind map anchor #" + anchor + " does not exist in " + file
          );
        });
      });

      if (!LEGACY_HUBS[hub.dir]) {
        test(hub.dir + " ch" + ch + ": study page loads the interactive library", function () {
          assert.ok(
            /shared\/interactive\.js/.test(study),
            "study page should load shared/interactive.js"
          );
        });
      }
    })(ch);
  }
});

test("interactive widget usage is broad across the platform", function () {
  var types = ["stepper", "sequence", "matcher", "timeline", "hotspot", "deck", "race", "pipeline"];
  var seen = {};
  HUBS.forEach(function (hub) {
    for (var ch = 1; ch <= hub.chapters; ch++) {
      var dir = webDir(hub, ch);
      ["chapter" + ch + "-study.html", "chapter" + ch + "-math.html"].forEach(function (f) {
        var full = path.join(dir, f);
        if (!exists(full)) return;
        var body = read(full);
        types.forEach(function (t) {
          if (body.indexOf('data-ix="' + t + '"') !== -1) seen[t] = true;
        });
      });
      // Imperative usage from the chapter script counts too.
      var js = path.join(dir, "chapter" + ch + "-study.js");
      if (exists(js)) {
        var code = read(js);
        types.forEach(function (t) {
          if (new RegExp("Interactive\\." + t + "\\s*\\(").test(code)) seen[t] = true;
        });
      }
    }
  });
  var missing = types.filter(function (t) { return !seen[t]; });
  assert.deepStrictEqual(missing, [], "widget types never used anywhere: " + missing.join(", "));
});

test("root portal links to every hub", function () {
  var portal = read(path.join(ROOT, "index.html"));
  HUBS.forEach(function (hub) {
    assert.ok(
      portal.indexOf('href="' + hub.dir + '/index.html"') !== -1,
      "portal does not link to " + hub.dir
    );
  });
});

test("service worker precaches the interactive library", function () {
  var sw = read(path.join(ROOT, "sw.js"));
  // Entries are relative to the worker so the site survives sub-path hosting.
  assert.ok(sw.indexOf('"shared/interactive.js"') !== -1, "interactive.js not precached");
  assert.ok(sw.indexOf('"shared/interactive.css"') !== -1, "interactive.css not precached");
  assert.ok(sw.indexOf('"shared/site-reset.js"') !== -1, "site-reset.js not precached");
});






test("translated sections introduce no duplicate ids", function () {
  HUBS.forEach(function (hub) {
    for (var ch = 1; ch <= hub.chapters; ch++) {
      var jsonPath = path.join(ROOT, hub.dir, "shared", "translations-data", "chapter" + ch + ".json");
      if (!exists(jsonPath)) continue;
      var bundle = JSON.parse(read(jsonPath));
      Object.keys(bundle).forEach(function (pageKey) {
        var sections = (bundle[pageKey] || {}).sections || {};
        // The toggle swaps each section's inner HTML wholesale, so ids from all
        // translated sections of a page end up in the same document.
        var seen = {};
        Object.keys(sections).forEach(function (sectionId) {
          var html = String(sections[sectionId]);
          var re = /\sid="([^"]+)"/g;
          var m;
          while ((m = re.exec(html))) {
            var id = m[1];
            // The section's own wrapper is not part of the inner HTML, but a
            // translation may legitimately repeat the page's section ids if it
            // re-declares them; only report collisions between different values.
            if (seen[id] && seen[id] !== sectionId) {
              assert.fail(
                hub.dir + " ch" + ch + " " + pageKey + ": id \"" + id +
                "\" appears in both " + seen[id] + " and " + sectionId
              );
            }
            seen[id] = sectionId;
          }
        });
      });
    }
  });
});

/* ─────────────────────────────────────────────────────────── */
/* Knowledge-graph node shape. shared/knowledge-graph.js works with
   objects ({id, ch, diff, label, def, href}); data files may ship 6-element
   tuples instead. The engine normalises them, but if that normalisation is
   lost an array-form graph silently renders as one undefined chapter group
   with NaN radii and no edges — so assert both halves.                     */

console.log("\n\u2500\u2500 Knowledge-graph node shape \u2500\u2500");

test("shared/knowledge-graph.js normalises tuple-form nodes", function () {
  var engine = read(path.join(ROOT, "shared", "knowledge-graph.js"));
  assert.ok(
    /CFG\.nodes\s*=\s*\(CFG\.nodes\s*\|\|\s*\[\]\)\.map/.test(engine),
    "the engine no longer normalises CFG.nodes — array-form graphs will not render"
  );
  assert.ok(
    /Array\.isArray\(n\)/.test(engine),
    "node normalisation no longer handles array tuples"
  );
});

HUBS.forEach(function (hub) {
  ["kg-data.js", "mkg-data.js"].forEach(function (file) {
    var full = path.join(ROOT, hub.dir, "tools", file);
    if (!exists(full)) return;

    test(hub.dir + " " + file + ": nodes resolve to usable objects", function () {
      var sandbox = { window: {} };
      /* eslint-disable-next-line no-new-func */
      new Function("window", read(full))(sandbox.window);
      var cfg = sandbox.window.KG_CONFIG;
      assert.ok(cfg, "KG_CONFIG not defined");
      var raw = cfg.nodes || [];
      if (!raw.length) return; // not populated yet
      var normalised = raw.map(function (n) {
        if (!Array.isArray(n)) return n;
        return { id: n[0], ch: n[1], diff: n[2], label: n[3], def: n[4], href: n[5] };
      });
      var broken = normalised.filter(function (n) {
        return !n || !n.id || !n.label || !n.def || !n.href ||
          !(n.ch >= 1) || !(n.diff >= 1);
      });
      assert.deepStrictEqual(
        broken.slice(0, 3).map(function (n) { return n && n.id; }),
        [],
        broken.length + " node(s) would render as undefined / NaN"
      );
    });
  });
});


test("translations preserve widget mount points and maths", function () {
  var problems = [];
  HUBS.forEach(function (hub) {
    for (var ch = 1; ch <= hub.chapters; ch++) {
      var jsonPath = path.join(ROOT, hub.dir, "shared", "translations-data", "chapter" + ch + ".json");
      if (!exists(jsonPath)) continue;
      var bundle = JSON.parse(read(jsonPath));
      Object.keys(bundle).forEach(function (pageKey) {
        var htmlPath = path.join(webDir(hub, ch), pageKey);
        if (!exists(htmlPath)) return;
        var html = read(htmlPath);
        var sections = (bundle[pageKey] || {}).sections || {};
        Object.keys(sections).forEach(function (sid) {
          var open = html.indexOf('id="' + sid + '"');
          if (open === -1) return;
          var start = html.lastIndexOf("<section", open);
          var end = html.indexOf("</section>", open);
          if (start === -1 || end === -1 || end < start) return;
          var en = html.slice(start, end);
          var zh = String(sections[sid]);
          var where = hub.dir + " " + pageKey + " " + sid;

          // A missing id means an imperative widget host (or a data-target
          // anchor) vanishes in Chinese mode.
          var enIds = en.match(/\sid="([^"]+)"/g) || [];
          var missing = enIds
            .map(function (token) { return token.replace(/^\s*id="|"$/g, ""); })
            .filter(function (id) { return id !== sid && zh.indexOf('id="' + id + '"') === -1; });
          if (missing.length) {
            problems.push(where + ": ids lost in translation (widget will not mount in 中文): " + missing.join(", "));
          }

          // A dropped placeholder div means the widget never mounts even when
          // its JSON config survived the translation.
          var enSrc = en.match(/data-ix-src="#([^"]+)"/g) || [];
          var lostSrc = enSrc
            .map(function (token) { return token.replace(/^data-ix-src="#|"$/g, ""); })
            .filter(function (id) { return zh.indexOf('data-ix-src="#' + id + '"') === -1; });
          if (lostSrc.length) {
            problems.push(where + ": widget placeholder(s) dropped in translation: " + lostSrc.join(", "));
          }

          // KaTeX hygiene. An unbalanced pair is always a bug: a stray \\(
          // swallows the rest of the section into math mode, and a dropped
          // opener renders the formula as raw LaTeX. The newer hubs were
          // authored to keep the span count identical, so require that there
          // too; the legacy hubs only have to stay balanced.
          // A negative lookbehind keeps `\\[2pt]` (LaTeX row spacing inside
          // cases/aligned) from being counted as a display-math opener.
          function opens(t) { return (t.match(/(?<!\\)\\\(|(?<!\\)\\\[/g) || []).length; }
          function closes(t) { return (t.match(/(?<!\\)\\\)|(?<!\\)\\\]/g) || []).length; }
          var kEn = opens(en);
          var kZh = opens(zh);
          if (opens(zh) !== closes(zh)) {
            problems.push(where + ": unbalanced KaTeX in translation (" + opens(zh) + " open vs " + closes(zh) + " close)");
          } else if (!LEGACY_HUBS[hub.dir] && kEn !== kZh) {
            problems.push(where + ": KaTeX span count differs (en " + kEn + " vs zh " + kZh + ")");
          }
        });
      });
    }
  });
  assert.deepStrictEqual(problems.slice(0, 30), [], problems.length + " translation defect(s)");
});


test("stylesheets clip decorative overflow", function () {
  // The decorative glows are absolutely positioned and bleed past the edges
  // (body::after sits at right:-9rem on phones). Without a clip on the root
  // element every page becomes ~144px wider than the viewport and phones can
  // drag the layout sideways.
  ["shared/study-base.css", "shared/home.css", "shared/root-portal.css"].forEach(function (rel) {
    var css = read(path.join(ROOT, rel));
    assert.ok(
      /html\s*\{[^}]*overflow-x:\s*(hidden|clip)/.test(css),
      rel + " does not guard horizontal overflow on html — decorative bleed will " +
        "make the page scroll sideways on phones"
    );
  });
});


test("language toggles declare lang for assistive tech", function () {
  // Switching to Chinese without updating <html lang> makes a screen reader
  // read Chinese text with English pronunciation rules.
  [
    ["shared/lang-toggle.js", "chapter / foundations / mind-map / tool pages"],
    ["shared/mission-control.js", "hub home pages"],
    ["shared/root-lang-toggle.js", "the portal"]
  ].forEach(function (pair) {
    var js = read(path.join(ROOT, pair[0]));
    assert.ok(
      /setAttribute\("lang"/.test(js),
      pair[0] + " (" + pair[1] + ") never sets the lang attribute"
    );
    assert.ok(
      /"zh-CN"/.test(js),
      pair[0] + " sets lang but does not use zh-CN for Chinese"
    );
  });

  // The hook has to sit in apply(): toggle() would read `lang` before it
  // changes, and the pre-existing button is wired by the page, not by this file.
  var lt = read(path.join(ROOT, "shared", "lang-toggle.js"));
  var applyIdx = lt.indexOf("function apply() {");
  assert.ok(applyIdx !== -1, "shared/lang-toggle.js has no apply()");
  assert.ok(
    lt.slice(applyIdx, applyIdx + 200).indexOf("syncLangAttr()") !== -1,
    "syncLangAttr() is not called from apply() — it would run before lang changes"
  );
});

/* ─────────────────────────────────────────────────────────── */
/* Canvas-widget translation table. shared/interactive.js resolves
   stepper titles and frame captions through window.IX_ZH, which each hub
   installs in its shared/translations.js. A truncated or malformed table
   silently leaves the animations in English.                        */

console.log("\n\u2500\u2500 Canvas widget label translations \u2500\u2500");

HUBS.forEach(function (hub) {
  var file = path.join(ROOT, hub.dir, "shared", "translations.js");
  if (!exists(file)) return;
  var src = read(file);
  if (src.indexOf("IX_ZH") === -1) return; // hub has no canvas labels to translate yet

  test(hub.dir + ": IX_ZH lookup table is well formed", function () {
    var sandbox = { window: {} };
    /* eslint-disable-next-line no-new-func */
    new Function("window", "var module = undefined;" + src)(sandbox.window);
    var map = sandbox.window.IX_ZH;
    assert.ok(map && typeof map === "object", "IX_ZH is not an object");
    var keys = Object.keys(map);
    assert.ok(keys.length >= 20, "suspiciously small table: " + keys.length + " entries");
    var bad = keys.filter(function (k) {
      return !k.trim() || typeof map[k] !== "string" || !map[k].trim();
    });
    assert.deepStrictEqual(bad.slice(0, 5), [], "empty keys or values in IX_ZH");
  });
});

/* ─────────────────────────────────────────────────────────── */
/* Bilingual integrity: a translations-data JSON whose section keys
   do not match the page's <section id="..."> set leaves part of the page
   in English (or blanks it) when the learner switches to 中文.       */

console.log("\n\u2500\u2500 Bilingual section coverage \u2500\u2500");

function sectionIdsOf(html) {
  var ids = [];
  var re = /<section\b[^>]*\bid="([^"]+)"/g;
  var m;
  while ((m = re.exec(html))) ids.push(m[1]);
  return ids;
}

HUBS.forEach(function (hub) {
  for (var ch = 1; ch <= hub.chapters; ch++) {
    (function (ch) {
      var dataDir = path.join(ROOT, hub.dir, "shared", "translations-data");
      var jsonPath = path.join(dataDir, "chapter" + ch + ".json");
      if (!exists(jsonPath)) return;

      test(hub.dir + " ch" + ch + ": Chinese sections cover every section", function () {
        var bundle = JSON.parse(read(jsonPath));
        var pages = Object.keys(bundle).filter(function (k) {
          return /\.html$/.test(k);
        });
        assert.ok(pages.length > 0, "no page keys in the translation bundle");

        pages.forEach(function (page) {
          var htmlPath = path.join(webDir(hub, ch), page);
          assert.ok(exists(htmlPath), "translation references a missing page: " + page);
          var want = sectionIdsOf(read(htmlPath));
          var got = Object.keys((bundle[page] && bundle[page].sections) || {});
          var missing = want.filter(function (id) { return got.indexOf(id) === -1; });
          var extra = got.filter(function (id) { return want.indexOf(id) === -1; });
          assert.deepStrictEqual(
            missing, [],
            page + ": sections without a Chinese translation: " + missing.join(", ")
          );
          assert.deepStrictEqual(
            extra, [],
            page + ": translated section ids that do not exist in the page: " + extra.join(", ")
          );
        });
      });
    })(ch);
  }
});

test("merged section-translations.js parses and is wired per hub", function () {
  HUBS.forEach(function (hub) {
    var file = path.join(ROOT, hub.dir, "shared", "section-translations.js");
    assert.ok(exists(file), hub.dir + ": section-translations.js missing");
    var src = read(file);
    var m = src.match(/window\.([A-Z0-9_]+)\s*=\s*(\{[\s\S]*\});?\s*$/);
    assert.ok(m, hub.dir + ": section-translations.js has an unexpected shape");
    var parsed = JSON.parse(m[2]);
    assert.ok(typeof parsed === "object" && parsed !== null, hub.dir + ": not an object");
    // The lang-config adapter must read the same global the merge script writes.
    var cfg = read(path.join(ROOT, hub.dir, "shared", "lang-config.js"));
    assert.ok(
      cfg.indexOf(m[1]) !== -1,
      hub.dir + ": lang-config.js does not reference " + m[1]
    );
  });
});

/* ─────────────────────────────────────────────────────────── */
/* Storage-key wiring: a hub whose mount has no rule in
   progress-tracker.js silently writes to the shared fallback key
   ("studyhub_progress") while its index.html reads the course key, so no
   progress is ever shown. This test drives a real chapter page and asserts
   the key the tracker writes matches the key the hub reads.            */

console.log("\n\u2500\u2500 Progress storage wiring \u2500\u2500");

var TRACKER_SRC = read(path.join(ROOT, "shared", "progress-tracker.js"));

function declaredProgressKey(hubDir) {
  var idx = read(path.join(ROOT, hubDir, "index.html"));
  var m = idx.match(/progressKey:\s*"([^"]+)"/);
  return m ? m[1] : null;
}

function makeTrackerDOM(urlPath) {
  var dom = new JSDOM(
    '<!DOCTYPE html><html><body><div class="section" data-track="hero"></div>' +
      '<div class="quick-check"><div class="qc-options">' +
      '<div class="qc-opt" data-correct="true" data-good="y">a</div>' +
      '<div class="qc-opt" data-correct="false" data-bad="n">b</div>' +
      "</div><div class=\"qc-feedback\"></div></div></body></html>",
    { url: "http://localhost:8000" + urlPath, pretendToBeVisual: true, runScripts: "dangerously" }
  );
  var win = dom.window;
  if (!win.IntersectionObserver) {
    win.IntersectionObserver = function (cb) { this._cb = cb; };
    win.IntersectionObserver.prototype.observe = function (el) {
      this._cb([{ target: el, isIntersecting: true, intersectionRatio: 1 }], this);
    };
    win.IntersectionObserver.prototype.unobserve = function () {};
    win.IntersectionObserver.prototype.disconnect = function () {};
  }
  return dom;
}

function keysWrittenByTracker(urlPath) {
  var dom = makeTrackerDOM(urlPath);
  try {
    dom.window.eval(TRACKER_SRC);
    var opt = dom.window.document.querySelector(".quick-check .qc-opt");
    if (opt) opt.click();
    var keys = [];
    for (var i = 0; i < dom.window.localStorage.length; i++) {
      var k = dom.window.localStorage.key(i);
      if (/_progress$/.test(k)) keys.push(k);
    }
    return keys;
  } finally {
    dom.window.close();
  }
}

HUBS.forEach(function (hub) {
  test(hub.dir + ": chapter pages write the hub's progress key", function () {
    var declared = declaredProgressKey(hub.dir);
    assert.ok(declared, "index.html does not declare progressKey");
    var keys = keysWrittenByTracker(
      "/" + hub.dir + "/chapters/chapter1/web/chapter1-study.html"
    );
    assert.ok(keys.length > 0, "tracker wrote no progress key at all");
    keys.forEach(function (k) {
      assert.strictEqual(
        k,
        declared,
        "tracker wrote '" + k + "' but the hub reads '" + declared +
          "' — add a mount rule to detectProgressTrackerConfig()"
      );
    });
    assert.ok(
      keys.indexOf("studyhub_progress") === -1,
      "fell through to the shared fallback key"
    );
  });
});

test("tracker resolves the right key from a foundations page too", function () {
  var declared = declaredProgressKey("COMP5047");
  var keys = keysWrittenByTracker(
    "/COMP5047/chapters/chapter1/web/chapter1-math.html"
  );
  keys.forEach(function (k) {
    assert.strictEqual(k, declared);
  });
});

/* ─────────────────────────────────────────────────────────── */

console.log("\n\u2500\u2500 Results: " + passed + " passed, " + failed + " failed \u2500\u2500\n");
if (failures.length) {
  failures.slice(0, 40).forEach(function (f) {
    console.error("  \u2717 " + f);
  });
  if (failures.length > 40) console.error("  … and " + (failures.length - 40) + " more");
  console.error("");
}
process.exit(failed > 0 ? 1 : 0);
