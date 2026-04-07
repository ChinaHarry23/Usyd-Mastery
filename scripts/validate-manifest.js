#!/usr/bin/env node
"use strict";

/**
 * Validates chapter-manifest.js against actual HTML content.
 *
 * Checks:
 *   1. Manifest file exists and is syntactically valid
 *   2. manifest.sections[ch] matches the number of .section[data-track] elements
 *      in chapterN-study.html (for chapters that have study pages)
 *   3. No chapter has all-zero manifest values
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
  { dir: "5046NLP",        chapters: 6 },
  { dir: "9001Py",         chapters: 5 }
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

function countSectionsInHTML(filePath) {
  if (!fs.existsSync(filePath)) return -1;
  var content = fs.readFileSync(filePath, "utf8");
  var matches = content.match(/data-track/g);
  return matches ? matches.length : 0;
}

console.log("Validating chapter manifests against HTML...\n");

hubs.forEach(function(hub) {
  var manifest = loadManifest(hub.dir);
  if (!manifest) return;
  console.log("[" + hub.dir + "]");

  for (var ch = 1; ch <= hub.chapters; ch++) {
    var studyFile = path.join(root, hub.dir, "chapters", "chapter" + ch, "web", "chapter" + ch + "-study.html");

    var mSec = manifest.sections  ? (manifest.sections[ch]  || 0) : 0;
    var mChk = manifest.checks    ? (manifest.checks[ch]    || 0) : 0;
    var mTut = manifest.tutorials ? (manifest.tutorials[ch] || 0) : 0;

    var htmlSections = countSectionsInHTML(studyFile);
    var hasHTML = htmlSections >= 0;
    var sectionMatch = !hasHTML || htmlSections === 0 || htmlSections === mSec;

    if (hasHTML && htmlSections > 0 && htmlSections !== mSec) {
      errors.push({
        hub: hub.dir,
        ch: ch,
        msg: "sections mismatch: manifest=" + mSec + " HTML=" + htmlSections,
        file: studyFile,
        fatal: true
      });
    }

    if (mSec === 0 && mChk === 0 && mTut === 0) {
      errors.push({
        hub: hub.dir,
        ch: ch,
        msg: "all manifest values are 0 — likely missing data",
        fatal: true
      });
    }

    var status = sectionMatch ? "✓" : "✗";
    var detail = hasHTML && htmlSections > 0
      ? " (HTML=" + htmlSections + ")"
      : htmlSections === 0 ? " (empty study HTML)" : " (no study HTML)";
    console.log("  " + status + " Ch" + ch + ": sections=" + mSec + " checks=" + mChk + " tutorials=" + mTut + detail);
  }

  console.log("");
});

if (errors.length === 0) {
  console.log("All manifest validations passed! ✓");
  process.exit(0);
} else {
  console.log(errors.length + " error(s) found:");
  errors.forEach(function(e) {
    var prefix = e.fatal ? "✗" : "⚠";
    var loc = e.hub + (e.ch ? " ch" + e.ch : "");
    console.error("  " + prefix + " " + loc + ": " + e.msg);
  });
  process.exit(1);
}
