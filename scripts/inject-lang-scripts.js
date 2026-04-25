#!/usr/bin/env node
/**
 * Injects the language-toggle script chain immediately before
 *   <script src=".../shared/chat-panel.js"></script>
 * (or before </body> if chat-panel.js is missing) in every chapter HTML.
 *
 * Idempotent: if the injection marker is already present in the file,
 * the file is left untouched.
 *
 * Usage:
 *   node scripts/inject-lang-scripts.js <courseDir> [--root]
 *
 *   <courseDir>  e.g. 5046NLP, 9001Py, 9123DataStructureAlgo
 *   --root       (optional) only inject path adjusted for tools/ pages
 *
 * The script auto-detects depth based on the existing chat-panel.js path.
 */
const fs = require("fs");
const path = require("path");

const courseDir = process.argv[2];
if (!courseDir) {
  console.error("Usage: node scripts/inject-lang-scripts.js <courseDir>");
  process.exit(1);
}

const MARKER = "<!-- LANG-INJECT -->";

function relPrefixToRoot(filePath) {
  // figure out how many "../" to get to repo root from a chapter html
  const fromRepoRoot = path.relative(
    path.dirname(filePath),
    path.resolve(__dirname, "..")
  );
  return fromRepoRoot === "" ? "./" : fromRepoRoot.replace(/\\/g, "/") + "/";
}

function relPrefixToCourse(filePath, courseRoot) {
  const fromCourseRoot = path.relative(path.dirname(filePath), courseRoot);
  return fromCourseRoot === "" ? "./" : fromCourseRoot.replace(/\\/g, "/") + "/";
}

function processFile(filePath, courseRoot) {
  let html = fs.readFileSync(filePath, "utf8");
  if (html.includes(MARKER)) {
    return { skipped: true };
  }

  const toRoot = relPrefixToRoot(filePath);
  const toCourse = relPrefixToCourse(filePath, courseRoot);

  // build script chain — translations.js may not exist for all courses; that's OK,
  // the browser will just 404 silently for missing scripts. We list optional ones too.
  const langChain = [
    MARKER,
    `<script src="${toCourse}shared/translations.js"></script>`,
    `<script src="${toCourse}shared/section-translations.js"></script>`,
    `<script src="${toCourse}shared/lang-config.js"></script>`,
    `<script src="${toRoot}shared/lang-toggle.js"></script>`,
  ].join("\n");

  // Inject before the last </body>.
  // Prefer to inject just before chat-panel.js if present (it's typically last);
  // otherwise just before </body>.
  const chatRe = /<script[^>]+chat-panel\.js[^>]*><\/script>/;
  if (chatRe.test(html)) {
    html = html.replace(chatRe, (m) => `${langChain}\n${m}`);
  } else {
    html = html.replace(/<\/body>/i, `${langChain}\n</body>`);
  }

  fs.writeFileSync(filePath, html, "utf8");
  return { written: true };
}

function findHtmlFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...findHtmlFiles(full));
    } else if (ent.isFile() && ent.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

const repoRoot = path.resolve(__dirname, "..");
const courseRoot = path.join(repoRoot, courseDir);
const chaptersDir = path.join(courseRoot, "chapters");

if (!fs.existsSync(chaptersDir)) {
  console.error(`No chapters directory: ${chaptersDir}`);
  process.exit(1);
}

const files = findHtmlFiles(chaptersDir);
let written = 0,
  skipped = 0;
for (const f of files) {
  const r = processFile(f, courseRoot);
  if (r.written) {
    console.log("inject", path.relative(repoRoot, f));
    written++;
  } else {
    skipped++;
  }
}
console.log(`Done. Wrote ${written}, skipped ${skipped}.`);
