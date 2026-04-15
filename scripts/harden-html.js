#!/usr/bin/env node
"use strict";

/**
 * harden-html.js — idempotent HTML hardening pass.
 *
 * For every .html file under the project root (excluding node_modules,
 * .git, and course /materials/ folders):
 *   1. Adds SRI integrity= + crossorigin="anonymous" to known CDN script/style
 *      tags that don't already have them.
 *   2. Inserts a Content-Security-Policy <meta> tag in <head> if absent.
 *   3. Inserts a <meta name="description"> + Open Graph tags if absent.
 *
 * Safe to re-run. Reports counts per file and a grand total.
 *
 * Usage:
 *   node scripts/harden-html.js           # apply in place
 *   node scripts/harden-html.js --dry     # preview changes, don't write
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DRY = process.argv.includes("--dry");

// ───── CDN resources with known SHA-384 hashes ─────────────────────────────
// Computed via: curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A
const SRI = {
  "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css":
    "sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV",
  "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js":
    "sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8",
  "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js":
    "sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05",
  "https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js":
    "sha384-eEu5CTj3qGvu9PdJuS+YlkNi7d2XxQROAFYOr59zgObtlcux1ae1Il3u7jvdCSWu",
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js":
    "sha384-/1qUCSGwTur9vjf/z9lmu/eCUYbpOTgSjmpbMQZ1/CtX2v/WcAIKqRv+U1DUCG6e",
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js":
    "sha384-SnzOobpRMLXZ52iJvZm/C0fYw0OQemTXzTjIsdsfMcrCtCEe9qgzxTd3RSklO5x2"
};

// ───── CSP template (chapter/tool pages that use KaTeX + localhost chat) ───
const CSP_CONTENT = [
  "default-src 'self'",
  "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'",
  "style-src 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com 'unsafe-inline'",
  "font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' http://localhost:* http://127.0.0.1:*",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join("; ");
const CSP_TAG = `<meta http-equiv="Content-Security-Policy" content="${CSP_CONTENT}">`;

// ───── Description templates ───────────────────────────────────────────────
function inferDescription(relPath, html) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "Usyd Mastery";
  // Pull first chapter hero subtitle if present — gives each chapter a distinct description.
  const subtitleMatch = html.match(/<p class="hero-subtitle"[^>]*>([^<]+)<\/p>/i);
  if (subtitleMatch) {
    return subtitleMatch[1].replace(/\s+/g, " ").trim().slice(0, 200);
  }
  if (/course\s*hub|home/i.test(title) || /index\.html$/i.test(relPath)) {
    return `${title} — Interactive bilingual study hub with chapter guides, quizzes, flashcards, knowledge graphs, and progress tracking.`;
  }
  if (/quiz-hub/i.test(relPath)) {
    return `${title} — Practice and exam-mode quizzes with chapter filters, missed-question stack, and per-chapter score tracking.`;
  }
  if (/flashcards/i.test(relPath)) {
    return `${title} — SM-2 spaced-repetition flashcards with per-chapter filters and review history.`;
  }
  if (/knowledge-graph/i.test(relPath)) {
    return `${title} — Interactive force-directed concept graph with chapter filtering, search, and difficulty sorting.`;
  }
  if (/progress-dashboard/i.test(relPath)) {
    return `${title} — Weighted mastery dashboard with chapter progress, quiz trend, activity heatmap, and flashcard schedule.`;
  }
  if (/mindmap/i.test(relPath)) {
    return `${title} — Hierarchical mind map of chapter concepts with expand/collapse navigation.`;
  }
  if (/-math/i.test(relPath)) {
    return `${title} — Dedicated formula reference and quick-check exercises for this chapter.`;
  }
  return `${title} — Interactive study guide with walkthroughs, math notation, and recall prompts.`;
}

// ───── Patchers ────────────────────────────────────────────────────────────

function patchSRI(html) {
  let changes = 0;
  for (const [url, hash] of Object.entries(SRI)) {
    // Find tags referencing this URL without integrity=.
    // Handle both <script src="url"> and <link href="url">.
    // `$&` refers to the whole match in a JS replacement string — so each
    // regex-special char is prefixed with a literal backslash.
    const esc = url.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
    const re = new RegExp(
      "<(script|link)([^>]*?\\s(?:src|href)=[\"']" + esc + "[\"'][^>]*?)(/?)>",
      "gi"
    );
    html = html.replace(re, function (match, tag, attrs, selfClose) {
      if (/\sintegrity\s*=/i.test(attrs)) return match; // already patched
      changes++;
      const newAttrs =
        attrs.replace(/\s+$/, "") +
        ' integrity="' + hash + '" crossorigin="anonymous" referrerpolicy="no-referrer"';
      return "<" + tag + newAttrs + selfClose + ">";
    });
  }
  return { html, changes };
}

function patchCSP(html) {
  if (/Content-Security-Policy/i.test(html)) return { html, changes: 0 };
  // Insert right after <meta charset=...> or after the opening <head>.
  const afterCharset = html.match(/<meta\s+charset=[^>]*>/i);
  if (afterCharset) {
    const idx = afterCharset.index + afterCharset[0].length;
    return {
      html: html.slice(0, idx) + "\n" + CSP_TAG + html.slice(idx),
      changes: 1
    };
  }
  const headOpen = html.match(/<head[^>]*>/i);
  if (headOpen) {
    const idx = headOpen.index + headOpen[0].length;
    return {
      html: html.slice(0, idx) + "\n" + CSP_TAG + html.slice(idx),
      changes: 1
    };
  }
  return { html, changes: 0 };
}

function patchDescription(html, relPath) {
  if (/<meta\s+name=["']description["']/i.test(html)) return { html, changes: 0 };
  const desc = inferDescription(relPath, html).replace(/"/g, "&quot;");
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = (titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "Usyd Mastery")
    .replace(/"/g, "&quot;");
  const block =
    `<meta name="description" content="${desc}">\n` +
    `<meta property="og:type" content="website">\n` +
    `<meta property="og:title" content="${title}">\n` +
    `<meta property="og:description" content="${desc}">\n` +
    `<meta property="og:locale" content="en_AU">`;
  // Insert before </head>.
  const headClose = html.match(/<\/head>/i);
  if (!headClose) return { html, changes: 0 };
  return {
    html: html.slice(0, headClose.index) + block + "\n" + html.slice(headClose.index),
    changes: 1
  };
}

// ───── Walk ────────────────────────────────────────────────────────────────

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

let totSri = 0, totCsp = 0, totDesc = 0, totFiles = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  let html = fs.readFileSync(file, "utf8");
  const orig = html;

  const a = patchSRI(html);      html = a.html;
  const b = patchCSP(html);      html = b.html;
  const c = patchDescription(html, rel); html = c.html;

  if (a.changes + b.changes + c.changes > 0) {
    totFiles++;
    totSri  += a.changes;
    totCsp  += b.changes;
    totDesc += c.changes;
    const suffix = DRY ? " (dry-run)" : "";
    console.log(
      "  + " + rel +
      " — sri:" + a.changes + " csp:" + b.changes + " desc:" + c.changes + suffix
    );
    if (!DRY && html !== orig) fs.writeFileSync(file, html);
  }
}

console.log("");
console.log(
  "Done. " + totFiles + " file(s) touched — " +
  "SRI tags added: " + totSri + ", CSP inserted: " + totCsp + ", descriptions inserted: " + totDesc +
  (DRY ? " (dry-run, no files written)" : "")
);
