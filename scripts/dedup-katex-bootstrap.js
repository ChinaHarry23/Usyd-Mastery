#!/usr/bin/env node
"use strict";

/**
 * dedup-katex-bootstrap.js — replace inline KaTeX tryRender() blocks with
 * a single <script src="…/shared/katex-loader.js"> reference.
 *
 * The inline block we're replacing looks like:
 *
 *   <script>
 *   document.addEventListener("DOMContentLoaded", function() {
 *     function tryRender() { … renderMathInElement … setTimeout(tryRender,200) … }
 *     tryRender();
 *   });
 *   </script>
 *
 * Any variant matching /function tryRender\b/ in an inline <script>…</script>
 * block is considered equivalent and replaced.
 *
 * Usage:
 *   node scripts/dedup-katex-bootstrap.js          # apply
 *   node scripts/dedup-katex-bootstrap.js --dry    # preview
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DRY = process.argv.includes("--dry");

// Regex for an inline <script>...</script> block containing function tryRender.
// Non-greedy + [\s\S] to match across newlines.
const INLINE_BLOCK = /<script>\s*document\.addEventListener\(\s*["']DOMContentLoaded["'][\s\S]*?function\s+tryRender[\s\S]*?<\/script>\s*\n?/gi;

function relativeToRoot(filePath) {
  const rel = path.relative(ROOT, filePath);
  const depth = rel.split(path.sep).length - 1;
  return "../".repeat(depth) + "shared/katex-loader.js";
}

function walk(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === ".git" || e.name === "materials") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.isFile() && e.name.endsWith(".html")) out.push(full);
  }
}

const files = [];
walk(ROOT, files);

let totReplacements = 0;
let touched = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  let html = fs.readFileSync(file, "utf8");
  const orig = html;

  // Skip files that already reference the loader.
  if (html.indexOf("shared/katex-loader.js") !== -1) continue;

  const loaderPath = relativeToRoot(file);
  const loaderTag = `<script src="${loaderPath}" defer></script>`;

  let replacements = 0;
  html = html.replace(INLINE_BLOCK, function () {
    replacements++;
    return loaderTag + "\n";
  });

  if (replacements > 0 && html !== orig) {
    touched++;
    totReplacements += replacements;
    const suffix = DRY ? " (dry-run)" : "";
    console.log("  + " + rel + " — replaced " + replacements + " inline block(s)" + suffix);
    if (!DRY) fs.writeFileSync(file, html);
  }
}

console.log("");
console.log(
  "Done. " + touched + " file(s) touched — " + totReplacements + " inline block(s) replaced" +
  (DRY ? " (dry-run, no files written)" : "")
);
