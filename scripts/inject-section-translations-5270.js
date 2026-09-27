#!/usr/bin/env node
/**
 * Adds <script src=".../shared/section-translations.js"></script>
 * immediately AFTER the existing translations.js script tag in every
 * 5270 chapter HTML file (so it loads before lang-config.js).
 *
 * Idempotent.
 */
const fs = require("fs");
const path = require("path");

const TRANS_RE = /<script\s+src="([^"]*shared\/translations\.js)"><\/script>/;
const SECTION_TAG_TEMPLATE = (src) =>
  `<script src="${src.replace("translations.js", "section-translations.js")}"></script>`;

function findHtmlFiles(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...findHtmlFiles(full));
    else if (ent.isFile() && ent.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const repoRoot = path.resolve(__dirname, "..");
const chaptersDir = path.join(repoRoot, "5270RandomAlgo", "chapters");
const files = findHtmlFiles(chaptersDir);
let written = 0,
  skipped = 0;

for (const f of files) {
  let html = fs.readFileSync(f, "utf8");
  if (html.includes("section-translations.js")) {
    skipped++;
    continue;
  }
  const m = html.match(TRANS_RE);
  if (!m) {
    console.warn("no translations.js script in", path.relative(repoRoot, f));
    continue;
  }
  const sectionTag = SECTION_TAG_TEMPLATE(m[1]);
  html = html.replace(TRANS_RE, m[0] + "\n" + sectionTag);
  fs.writeFileSync(f, html, "utf8");
  console.log("inject", path.relative(repoRoot, f));
  written++;
}
console.log(`Done. Wrote ${written}, skipped ${skipped}.`);
