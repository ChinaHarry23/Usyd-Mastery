#!/usr/bin/env node
"use strict";

/**
 * Structural validation for chapter-manifest.js.
 *
 * Checks:
 *   1. Manifest file exists and is syntactically valid
 *   2. Every declared chapter has a manifest entry
 *   3. No chapter has all-zero manifest values
 *
 * NOTE: exact denominator values are NOT checked here. The authoritative
 * source is scripts/audit-denominators.js, which boots each chapter page with
 * the real shared/progress-tracker.js and drives every trackable interaction.
 * That accounts for section ids reused between a chapter's study and
 * foundations pages, which a plain selector count cannot.
 *
 * Regenerate the manifests with: node scripts/audit-denominators.js --fix
 *
 * Exit codes:
 *   0  — all checks pass
 *   1  — at least one hard failure
 */

var fs   = require("fs");
var path = require("path");
var vm   = require("vm");

var root   = path.resolve(__dirname, "..");
var errors = [];

var hubs = [
  { dir: "5270RandomAlgo", chapters: 12 },
  { dir: "5318ML",         chapters: 6  },
  { dir: "5046NLP",        chapters: 6  },
  { dir: "9001Py",         chapters: 5  },
  { dir: "9123DataStructureAlgo", chapters: 10 },
  { dir: "COMP5047",       chapters: 8  },
  { dir: "COMP5618",       chapters: 7  },
  { dir: "ELEC5620",       chapters: 8  },
  { dir: "INFO5995",       chapters: 8  },
  { dir: "INFO6007",       chapters: 8  }
];

function loadManifest(hubDir) {
  var file = path.join(root, hubDir, "data", "chapter-manifest.js");
  if (!fs.existsSync(file)) {
    errors.push({ hub: hubDir, msg: "chapter-manifest.js not found", fatal: true });
    return null;
  }
  var code = fs.readFileSync(file, "utf8");
  var sandbox = { window: {} };
  try {
    vm.runInNewContext(code, sandbox, { filename: file, timeout: 3000 });
  } catch (e) {
    errors.push({ hub: hubDir, msg: "chapter-manifest.js parse error: " + e.message, fatal: true });
    return null;
  }
  return sandbox.window.CHAPTER_MANIFEST;
}

console.log("Validating chapter manifest structure...\n");

hubs.forEach(function(hub) {
  var manifest = loadManifest(hub.dir);
  if (!manifest) return;
  console.log("[" + hub.dir + "]");

  for (var ch = 1; ch <= hub.chapters; ch++) {
    var mSec = manifest.sections  ? (manifest.sections[ch]  || 0) : 0;
    var mChk = manifest.checks    ? (manifest.checks[ch]    || 0) : 0;
    var mTut = manifest.tutorials ? (manifest.tutorials[ch] || 0) : 0;
    var empty = mSec === 0 && mChk === 0 && mTut === 0;

    var studyFile = path.join(
      root, hub.dir, "chapters", "chapter" + ch, "web", "chapter" + ch + "-study.html"
    );
    var hasPage = fs.existsSync(studyFile);

    if (empty) {
      errors.push({
        hub: hub.dir,
        ch: ch,
        msg: "all manifest values are 0 — likely missing data",
        fatal: true
      });
    }

    console.log(
      "  " + (empty ? "\u2717" : "\u2713") + " Ch" + ch + ": sections=" + mSec +
      " checks=" + mChk + " tutorials=" + mTut + (hasPage ? "" : " (no study HTML yet)")
    );
  }

  console.log("");
});

if (errors.length === 0) {
  console.log("All manifest structures valid! \u2713");
  console.log("Run `node scripts/audit-denominators.js` for exact denominators.\n");
  process.exit(0);
} else {
  console.log(errors.length + " error(s) found:");
  errors.forEach(function(e) {
    var prefix = e.fatal ? "\u2717" : "\u26a0";
    var loc = e.hub + (e.ch ? " ch" + e.ch : "");
    console.error("  " + prefix + " " + loc + ": " + e.msg);
  });
  process.exit(1);
}
