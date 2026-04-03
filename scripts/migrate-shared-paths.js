#!/usr/bin/env node
"use strict";

/**
 * Migration script: Improvement #2 — Deduplicate hub shared file copies.
 *
 * Updates HTML <script src> and <link href> paths so chapter pages, tool pages,
 * and hub index pages reference the canonical root /shared/ instead of hub-level copies.
 *
 * Also handles Improvement #3 — Extracts inline <style> from math pages and replaces
 * with a <link> to shared/math.css.
 *
 * Usage: node scripts/migrate-shared-paths.js [--dry-run]
 */

var fs = require("fs");
var path = require("path");

var ROOT = path.resolve(__dirname, "..");
var DRY_RUN = process.argv.includes("--dry-run");

var HUBS = ["5270", "5318", "Comp5046-NLP-Study-Hub", "COMP9001-Intro-to-Programming-Study-Hub"];

var SYNC_FILES = [
  "chat-panel.js",
  "chat-panel.css",
  "mindmap.js",
  "mindmap.css",
  "flashcard-srs.js",
  "progress-tracker.js"
];

var stats = { filesScanned: 0, filesModified: 0, replacements: 0, mathCssExtracted: 0 };

function getAllHtmlFiles(dir) {
  var results = [];
  if (!fs.existsSync(dir)) return results;
  fs.readdirSync(dir).forEach(function (entry) {
    var full = path.join(dir, entry);
    var stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(full));
    } else if (entry.endsWith(".html")) {
      results.push(full);
    }
  });
  return results;
}

function classifyFile(filePath, hub) {
  var rel = path.relative(path.join(ROOT, hub), filePath).replace(/\\/g, "/");
  if (/^chapters\//.test(rel)) return "chapter";
  if (/^tools\//.test(rel)) return "tool";
  if (rel === "index.html") return "index";
  return "other";
}

function isMathPage(filePath) {
  return /-math\.html$/.test(filePath);
}

function isComp9001(hub) {
  return hub.indexOf("COMP9001") !== -1;
}

function replaceInContent(content, oldStr, newStr) {
  if (content.indexOf(oldStr) === -1) return content;
  stats.replacements++;
  return content.split(oldStr).join(newStr);
}

function processChapterPage(content, hub) {
  SYNC_FILES.forEach(function (file) {
    if (file === "progress-tracker.js" && isComp9001(hub)) return;

    var isCSS = file.endsWith(".css");
    if (isCSS) {
      content = replaceInContent(
        content,
        'href="../../../shared/' + file + '"',
        'href="../../../../shared/' + file + '"'
      );
    } else {
      content = replaceInContent(
        content,
        'src="../../../shared/' + file + '"',
        'src="../../../../shared/' + file + '"'
      );
    }
  });
  return content;
}

function processToolPage(content) {
  var toolSyncFiles = ["chat-panel.js", "chat-panel.css", "flashcard-srs.js"];
  toolSyncFiles.forEach(function (file) {
    var isCSS = file.endsWith(".css");
    if (isCSS) {
      content = replaceInContent(
        content,
        'href="../shared/' + file + '"',
        'href="../../shared/' + file + '"'
      );
    } else {
      content = replaceInContent(
        content,
        'src="../shared/' + file + '"',
        'src="../../shared/' + file + '"'
      );
    }
  });
  return content;
}

function processIndexPage(content) {
  var indexSyncFiles = ["chat-panel.js", "chat-panel.css"];
  indexSyncFiles.forEach(function (file) {
    var isCSS = file.endsWith(".css");
    if (isCSS) {
      content = replaceInContent(
        content,
        'href="shared/' + file + '"',
        'href="../shared/' + file + '"'
      );
    } else {
      content = replaceInContent(
        content,
        'src="shared/' + file + '"',
        'src="../shared/' + file + '"'
      );
    }
  });
  return content;
}

function extractMathCss(content, fileType) {
  var styleStart = content.indexOf("<style>");
  var styleEnd = content.indexOf("</style>");
  if (styleStart === -1 || styleEnd === -1) return content;

  var before = content.substring(0, styleStart);
  var after = content.substring(styleEnd + "</style>".length);

  var mathCssPath = fileType === "chapter" ? "../../../../shared/math.css" : "../../shared/math.css";
  var linkTag = '<link rel="stylesheet" href="' + mathCssPath + '">';

  stats.mathCssExtracted++;
  return before + linkTag + after;
}

HUBS.forEach(function (hub) {
  var hubDir = path.join(ROOT, hub);
  var htmlFiles = getAllHtmlFiles(hubDir);

  htmlFiles.forEach(function (filePath) {
    stats.filesScanned++;
    var fileType = classifyFile(filePath, hub);
    var content = fs.readFileSync(filePath, "utf8");
    var original = content;

    if (fileType === "chapter") {
      content = processChapterPage(content, hub);
    } else if (fileType === "tool") {
      content = processToolPage(content);
    } else if (fileType === "index") {
      content = processIndexPage(content);
    }

    if (isMathPage(filePath) && fileType === "chapter") {
      content = extractMathCss(content, fileType);
    }

    if (content !== original) {
      stats.filesModified++;
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, content, "utf8");
      }
      console.log("  " + (DRY_RUN ? "[dry] " : "✓ ") + path.relative(ROOT, filePath));
    }
  });
});

console.log("\n── Migration " + (DRY_RUN ? "(dry run) " : "") + "summary ──");
console.log("  Files scanned:      " + stats.filesScanned);
console.log("  Files modified:     " + stats.filesModified);
console.log("  Path replacements:  " + stats.replacements);
console.log("  Math CSS extracted: " + stats.mathCssExtracted);

if (DRY_RUN) {
  console.log("\nDry run — no files were changed. Remove --dry-run to apply.\n");
}
