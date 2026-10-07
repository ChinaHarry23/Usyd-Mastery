#!/usr/bin/env node
"use strict";

/**
 * build-hub.js — render a course hub from a content pack.
 *
 *   node scripts/build-hub.js content/demo [--out demo]
 *
 * The content pack is what a human (or an agent) authors. This script is the
 * only thing that writes pages, so a rebuild is deterministic: same pack in,
 * same bytes out. See docs/AUTHORING.md for the pack format.
 *
 * Layout it emits, per hub:
 *
 *   index.html                      hub home (Mission Control)
 *   chapters/chapterN/web/…         study · foundations · mind map
 *   chapters/chapterN/materials/    empty — drop your own files here
 *   tools/…                         quiz, flashcards, both graphs, dashboard
 *   data/…                          manifest, quiz bank, flashcards, metadata
 *   shared/…                        theme + language adapter for this course
 */

var fs = require("fs");
var path = require("path");

var ROOT = path.resolve(__dirname, "..");
var TPL = path.join(ROOT, "templates");

/* ── helpers ───────────────────────────────────────────────────── */

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, "utf8");
  written.push(path.relative(ROOT, p));
}

var written = [];

function fill(template, tokens) {
  return template.replace(/\{\{([A-Z_]+)\}\}/g, function (whole, key) {
    return Object.prototype.hasOwnProperty.call(tokens, key) ? String(tokens[key]) : whole;
  });
}

function loadJSON(p, label) {
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(read(p));
  } catch (e) {
    throw new Error(label + ": invalid JSON — " + e.message);
  }
}

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

var ENTITIES = { "&amp;": "&", "&mdash;": "\u2014", "&ndash;": "\u2013", "&rarr;": "\u2192", "&middot;": "\u00b7", "&nbsp;": " " };

function plain(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, function (e) { return ENTITIES[e] || e; })
    .replace(/\s+/g, " ")
    .trim();
}

/* ── section parsing — the navigation is derived, never authored ── */

function parseSections(html) {
  var out = [];
  var re = /<section\b[^>]*\bid="([^"]+)"[^>]*>/g;
  var m;
  while ((m = re.exec(html))) {
    var id = m[1];
    var tag = m[0];
    if (/\bhidden\b/.test(tag)) continue;
    var track = (tag.match(/data-track="([^"]+)"/) || [])[1] || id.replace(/^sec-m?-?/, "");
    var isHero = id === "hero" || id === "sec-m-hero";
    var label = "Overview";
    if (!isHero) {
      var rest = html.slice(m.index);
      var h = rest.match(/<h2[^>]*class="[^"]*section-title[^"]*"[^>]*>([\s\S]*?)<\/h2>/);
      label = h ? plain(h[1]) : track;
      if (!label) label = track;
    }
    out.push({ id: id, track: track, label: label, hero: isHero });
  }
  return out;
}

/* ── hrefs: the pack addresses chapters logically, we resolve them ──

   Accepted in a pack (all equivalent, verified by tests/test-generator.js):

     chapter1/study#sec-x        01/study.html#sec-x
     1/study#sec-x               study.html#sec-x        (this chapter)
     chapters/01/math.html#a     ../chapters/01/math.html#a

   An earlier version of this comment claimed `chapter1/study#x` worked while
   the parser only matched a bare leading number, so that form threw at build
   time — after verify-pack had already said the pack was valid. Both the
   parser and the comment now agree.

   Emitted, relative to whichever page consumes the link:

     tools/…    ../chapters/chapter1/web/chapter1-study.html#sec-x
     chapters/  chapter1-study.html#sec-x                                */

function resolveHref(href, defaultChapter, opts) {
  if (!href) return href;
  var h = String(href).trim();
  if (/^[a-z]+:\/\//i.test(h)) return h;
  h = h.replace(/^(\.\.\/)+/, "").replace(/^chapters\//, "");

  var anchor = "";
  var hash = h.indexOf("#");
  if (hash !== -1) {
    anchor = h.slice(hash);
    h = h.slice(0, hash);
  }

  var ch = defaultChapter;
  // Accept "01/study", "1/study" and the "chapter1/study" spelling the docs use.
  var m = h.match(/^(?:chapter)?(\d+)\//i);
  if (m) {
    ch = parseInt(m[1], 10);
    h = h.slice(m[0].length);
  }

  var kind = h.replace(/\.html$/, "").replace(new RegExp("^chapter\\d+-"), "") || "study";
  if (["study", "math", "mindmap"].indexOf(kind) === -1) {
    throw new Error('unsupported href "' + href + '" — kind must be study, math or mindmap');
  }

  var file = "chapter" + ch + "-" + kind + ".html" + anchor;
  if (opts && opts.fromTool) return "../chapters/chapter" + ch + "/web/" + file;
  if (opts && opts.fromHubRoot) return "chapters/chapter" + ch + "/web/" + file;
  return file;
}

/* ── theme ─────────────────────────────────────────────────────── */

var DEFAULT_THEME = {
  bg: "#f7f8fc", card: "rgba(255,255,255,0.86)", cardHover: "rgba(255,255,255,0.97)",
  sidebar: "rgba(18,20,38,0.88)", border: "rgba(99,102,241,0.16)", text: "#141826",
  textMuted: "#565d75", textDim: "#7b829a", accent: "#6366f1", accentStrong: "#4f46e5",
  blue: "#2563eb", purple: "#7c3aed", green: "#059669", yellow: "#f59e0b", red: "#dc2626",
  darkBg: "#12142a", darkBg2: "#1e2148", lightBg: "#fbfbfe", grid: "#d8d8e0"
};

function hexToRgb(hex) {
  var h = hex.replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  var n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(", ");
}

function themeCSS(pack) {
  var t = Object.assign({}, DEFAULT_THEME, pack.theme || {});
  var a = hexToRgb(t.accent);
  var as = hexToRgb(t.accentStrong);
  var d = hexToRgb(t.darkBg);
  var d2 = hexToRgb(t.darkBg2);
  var b = hexToRgb(t.border.replace(/rgba?\([^)]*\)/, "#6366f1"));
  return [
    '@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");',
    '@import url("../../shared/study-base.css");',
    "",
    ":root {",
    "  --bg: " + t.bg + ";",
    "  --bg-card: " + t.card + ";",
    "  --bg-card-hover: " + t.cardHover + ";",
    "  --bg-sidebar: " + t.sidebar + ";",
    "  --border: " + t.border + ";",
    "  --border-light: rgba(255, 255, 255, 0.14);",
    "  --text: " + t.text + ";",
    "  --text-muted: " + t.textMuted + ";",
    "  --text-dim: " + t.textDim + ";",
    "  --text-inverse: #ffffff;",
    "  --accent: " + t.accent + ";",
    "  --accent-strong: " + t.accentStrong + ";",
    "  --accent-glow: rgba(" + a + ", 0.14);",
    "  --blue: " + t.blue + ";",
    "  --blue-bg: rgba(37, 99, 235, 0.1);",
    "  --purple: " + t.purple + ";",
    "  --green: " + t.green + ";",
    "  --green-bg: rgba(5, 150, 105, 0.12);",
    "  --yellow: " + t.yellow + ";",
    "  --yellow-bg: rgba(245, 158, 11, 0.13);",
    "  --red: " + t.red + ";",
    "  --red-bg: rgba(220, 38, 38, 0.1);",
    "  --shadow: 0 30px 90px rgba(" + d + ", 0.18);",
    "  --shadow-soft: 0 20px 44px rgba(" + d + ", 0.09);",
    "  --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
    "  --font-display: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;",
    "  --font-mono: 'JetBrains Mono', 'SFMono-Regular', 'Consolas', monospace;",
    "",
    "  --dark-bg: " + t.darkBg + ";",
    "  --dark-bg-2: " + t.darkBg2 + ";",
    "  --light-bg-1: " + t.lightBg + ";",
    "  --accent-rgb: " + a + ";",
    "  --accent-strong-rgb: " + as + ";",
    "  --secondary-rgb: 139, 92, 246;",
    "  --dark-rgb: " + d + ";",
    "  --dark-2-rgb: " + d2 + ";",
    "  --dark-shadow-rgb: " + d + ";",
    "  --shadow-medium-rgb: " + d + ";",
    "  --shadow-card-rgb: " + as + ";",
    "  --border-rgb: " + b + ";",
    "  --grid-line-rgb: " + hexToRgb(t.grid) + ";",
    "  --hero-highlight: " + t.accent + ";",
    "  --hero-highlight-rgb: " + a + ";",
    "  --hero-text: #ffffff;",
    "  --sidebar-link-accent: #c7d2fe;",
    "  --sidebar-text-rgb: 255, 255, 255;",
    "  --sidebar-border-rgb: 255, 255, 255;",
    "  --section-bg-rgb: 255, 255, 255;",
    "  --section-bg-2-rgb: 246, 247, 251;",
    "  --section-title-dark: " + t.text + ";",
    "  --hero-border-rgb: " + a + ";",
    "  --btn-primary-text: #ffffff;",
    "  --table-th-bg-rgb: 250, 250, 253;",
    "  --chip-bg-rgb: " + a + ";",
    "  --hero-img-opacity: 1;",
    "  --hero-before-opacity: 0.95;",
    "",
    pack.heroImage
      ? '  --course-hero-bg: url("' + pack.heroImage + '");'
      : "  --course-hero-bg: none;",
    "  --course-divider-display: none;",
    "}",
    "",
    "body::after {",
    "  background: radial-gradient(circle at 20% 30%, rgba(" + a + ", 0.09), transparent 42%),",
    "    radial-gradient(circle at 80% 18%, rgba(" + as + ", 0.11), transparent 38%);",
    "}",
    "",
    ".hero-section::before {",
    "  background-image: radial-gradient(circle at 14% 16%, rgba(" + a + ", 0.22), transparent 24%),",
    "    radial-gradient(circle at 88% 14%, rgba(" + as + ", 0.18), transparent 26%),",
    "    radial-gradient(ellipse at 90% 10%, rgba(" + a + ", 0.12), transparent 46%);",
    "}",
    ""
  ].join("\n");
}

/* ── language adapter (per course, no translations by default) ──── */

function langConfig(pack) {
  var globalName = pack.code.toUpperCase().replace(/[^A-Z0-9]/g, "") + "_SECTION_TRANSLATIONS";
  return [
    "/**",
    " * " + pack.code + " — language toggle configuration adapter.",
    " *",
    " * Bridges the per-course translation payloads (if the pack ships any) to the",
    " * universal engine module in ../../shared/lang-toggle.js.",
    " *",
    " * Generated by scripts/build-hub.js — edit the content pack, not this file.",
    " */",
    "(function () {",
    '  "use strict";',
    "",
    "  var m = location.pathname.match(/chapter(\\d+)/);",
    "  var ch = m ? m[1] : null;",
    "",
    "  var T = {};",
    '  if (typeof COMMON !== "undefined") {',
    "    for (var c in COMMON) T[c] = COMMON[c];",
    "  }",
    '  if (typeof CH !== "undefined" && ch && CH[ch]) {',
    "    for (var k in CH[ch]) T[k] = CH[ch][k];",
    "  }",
    "  var hasTranslations = Object.keys(T).length > 0;",
    "",
    "  window.LANG_CONFIG = {",
    '    storageKey: "' + pack.storageKey + '_lang",',
    "    translations: hasTranslations ? T : undefined,",
    "    sectionTranslations:",
    '      typeof ' + globalName + ' !== "undefined"',
    "        ? " + globalName + "",
    "        : undefined,",
    '    mindmapTranslations: typeof MINDMAP_UI !== "undefined" ? MINDMAP_UI : undefined',
    "  };",
    "",
    "  window." + pack.code.toUpperCase().replace(/[^A-Z0-9]/g, "") + "_LANG = {",
    '    get: function () { return localStorage.getItem("' + pack.storageKey + '_lang") || "en"; },',
    "    set: function (next) {",
    '      if (typeof window.LangToggle !== "undefined") { window.LangToggle.set(next); return; }',
    '      localStorage.setItem("' + pack.storageKey + '_lang", next);',
    '      window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: next } }));',
    "    },",
    '    toggle: function () { this.set(this.get() === "en" ? "zh" : "en"); }',
    "  };",
    "})();",
    ""
  ].join("\n");
}

/* ── knowledge-graph header ────────────────────────────────────── */

var KG_COLORS = ["#6366f1", "#0ea5e9", "#2563eb", "#7c3aed", "#a855f7", "#db2777", "#e11d48", "#f59e0b", "#059669", "#0891b2"];

function kgHeader(pack, kind, numChapters) {
  var colors = {};
  var names = {};
  var namesZh = {};
  for (var i = 1; i <= numChapters; i++) {
    colors[i] = KG_COLORS[(i - 1) % KG_COLORS.length];
    var c = pack.chapters[i - 1] || {};
    names[i] = "W" + i + ": " + (c.shortTitle || c.title || "");
    namesZh[i] = "\u7B2C" + i + "\u5468";
  }
  var isMkg = kind === "mkg";
  var title = (isMkg ? "Foundations Graph" : "Knowledge Graph") + " \u2014 " + pack.code;

  return [
    "/* " + pack.code + " \u2014 " + (isMkg ? "foundations" : "concept") + " graph data.",
    " * node: [id, chapter, difficulty(1-3), label, definition, href]",
    " * edge: [fromId, toId, strength 4-9]   <- strength, not a chapter number",
    ' * Generated by scripts/build-hub.js from the content pack.',
    " */",
    "window.KG_CONFIG = {",
    '  langKey: "' + pack.storageKey + '_lang",',
    '  fromParam: "' + kind + '",',
    "  numChapters: " + numChapters + ",",
    "  chapterColors: " + JSON.stringify(colors) + ",",
    "  chapterNames: " + JSON.stringify(names) + ",",
    "  chapterNamesZh: " + JSON.stringify(namesZh) + ",",
    "  ui: {",
    '    en: { "title": ' + JSON.stringify(title) + ', "navHome": "\u2190 Home", "pageTitle": ' + JSON.stringify(isMkg ? "Foundations Graph" : "Knowledge Graph") + ', "search": "Search concepts...", "threshold": "Threshold", "diff": "Sort by Difficulty", "chapter": "Group by Week", "reset": "Reset View", "weeks": "Weeks", "legendDiff": "Difficulty", "diffScale": "\u25cf small = easy", "click": "Click node \u2192 source", "layout": "Layout", "sort": "Sort by difficulty", "group": "Group by week", "both": "Combine filters.", "nodes": "nodes", "edges": "edges", "thresholdStats": "threshold \u2265 " },',
    '    zh: { "title": ' + JSON.stringify(title) + ', "navHome": "\u2190 \u9996\u9875", "pageTitle": ' + JSON.stringify(isMkg ? "\u57fa\u7840\u56fe\u8c31" : "\u77e5\u8bc6\u56fe\u8c31") + ', "search": "\u641c\u7d22\u6982\u5ff5\u2026", "threshold": "\u9608\u503c", "diff": "\u6309\u96be\u5ea6\u6392\u5e8f", "chapter": "\u6309\u5468\u5206\u7ec4", "reset": "\u91cd\u7f6e\u89c6\u56fe", "weeks": "\u5468\u6b21", "legendDiff": "\u96be\u5ea6", "diffScale": "\u25cf \u5c0f = \u7b80\u5355", "click": "\u70b9\u51fb\u8282\u70b9 \u2192 \u539f\u6587", "layout": "\u5e03\u5c40", "sort": "\u6309\u96be\u5ea6\u6392\u5e8f", "group": "\u6309\u5468\u5206\u7ec4", "both": "\u7ec4\u5408\u7b5b\u9009\u3002", "nodes": "\u8282\u70b9", "edges": "\u8fb9", "thresholdStats": "\u9608\u503c \u2265 " }',
    "  }"
  ].join("\n");
}

/* ── manifest: counted from the pages we just generated ────────── */

function countManifest(pages) {
  var sections = {}, checks = {}, tutorials = {};
  pages.forEach(function (p) {
    var n = p.chapter;
    sections[n] = (sections[n] || 0) + (p.html.match(/data-track="/g) || []).length;
    checks[n] = (checks[n] || 0) + (p.html.match(/class="quick-check"/g) || []).length;
    tutorials[n] = (tutorials[n] || 0) + (p.html.match(/class="solution-toggle"/g) || []).length;
  });
  return { sections: sections, checks: checks, tutorials: tutorials };
}

/* ── main ──────────────────────────────────────────────────────── */

function main() {
  var packArg = process.argv[2];
  if (!packArg) {
    console.error("usage: node scripts/build-hub.js <content-pack-dir> [--out <dir>]");
    process.exit(1);
  }
  var packDir = path.resolve(ROOT, packArg);
  var pack = loadJSON(path.join(packDir, "course.json"), "course.json");
  if (!pack) {
    console.error("no course.json in " + packArg);
    process.exit(1);
  }
  ["code", "slug", "storageKey", "title", "chapters"].forEach(function (k) {
    if (!pack[k]) throw new Error("course.json is missing required key: " + k);
  });

  // The validator is the gate between authoring and publishing. Never render a
  // pack that fails it unless the caller explicitly opts out.
  if (process.argv.indexOf("--skip-verify") === -1) {
    var v = require("child_process").spawnSync(process.execPath,
      [path.join(__dirname, "verify-pack.js"), packArg], { stdio: "inherit" });
    if (v.status !== 0) {
      console.error("\nbuild-hub: the content pack failed verification. Fix the problems above,");
      console.error("or pass --skip-verify to render anyway (not recommended).");
      process.exit(1);
    }
    console.log("");
  }

  var outIdx = process.argv.indexOf("--out");
  var outDir = path.resolve(ROOT, outIdx !== -1 ? process.argv[outIdx + 1] : pack.slug);
  var N = pack.chapters.length;

  console.log("building " + pack.code + " (" + N + " chapters) -> " + path.relative(ROOT, outDir));

  /* chapter page tokens that are the same for every chapter */
  function baseTokens(n) {
    return {
      CODE: pack.code,
      STORAGE_KEY: pack.storageKey,
      HUB_CSS: "study.css",
      HUB_SHARED: "../../../shared",
      ENGINE: "../../../../shared",
      HUB_ROOT: "../../..",
      CHAPTER_BASE: "chapter" + n,
      CHAPTER_ICON: pack.icon || "&#x1F4D8;",
      CHAPTER_LABEL: "Week " + ((pack.chapters[n - 1] || {}).week || n),
      NUM_CHAPTERS: N,
      LEGEND: ""
    };
  }

  var manifestPages = [];

  pack.chapters.forEach(function (ch, i) {
    var n = ch.n || i + 1;
    var dir = path.join(packDir, "chapters", String(n).padStart(2, "0"));
    var base = baseTokens(n);
    var nav = "chapter" + n;

    /* ── study ── */
    var studySrc = read(path.join(dir, "study.html"));
    var studySections = parseSections(studySrc);
    if (!studySections.length) throw new Error("chapter " + n + ": study.html has no <section> blocks");
    if (!studySections[0].hero) throw new Error("chapter " + n + ': the first section must have id="hero"');

    var navLinks = studySections.map(function (s, k) {
      return '    <li><a href="#' + s.id + '" class="nav-link' + (k === 0 ? " active" : "") +
        '" data-section="' + s.track + '">' + escapeHtml(s.label) + "</a></li>";
    }).join("\n");
    navLinks += [
      "",
      '    <li style="margin-top:0.5rem; border-top:1px solid var(--border); padding-top:0.5rem;">',
      '      <a href="' + nav + '-math.html" class="nav-link" style="color:var(--purple);">&#x1F4D0; Foundations</a>',
      "    </li>",
      "    <li>",
      '      <a href="' + nav + '-mindmap.html" class="nav-link" style="color:var(--green);">&#x1F5FA; Mind Map</a>',
      "    </li>",
      "    <li>",
      '      <a href="../../../tools/quiz-hub.html" class="nav-link" style="color:var(--accent);">&#x1F4DD; Quiz Hub</a>',
      "    </li>",
      "    <li>",
      '      <a href="../../../tools/flashcards.html" class="nav-link" style="color:#f97316;">&#x1F4E6; Flashcards</a>',
      "    </li>"
    ].join("\n");

    var trackerConfig = '<script>window.PROGRESS_TRACKER_CONFIG = { storageKey: "' +
      pack.storageKey + '", numChapters: ' + N + ', unitNoun: "Week" };<\/script>';

    var pageScript = fs.existsSync(path.join(dir, "study.js"))
      ? '<script defer src="' + nav + '-study.js"></script>'
      : "";

    var studyHtml = fill(read(path.join(TPL, "chapter-study.html")), Object.assign({}, base, {
      TITLE: ch.title + " \u2014 " + pack.code,
      DESC: ch.summary || ch.title,
      NAV_LINKS: navLinks,
      PROGRESS_LABEL: "Week " + n + " built",
      PAGE_SCRIPT: trackerConfig + (pageScript ? "\n" + pageScript : ""),
      CONTENT: studySrc.trim()
    }));
    write(path.join(outDir, "chapters", nav, "web", nav + "-study.html"), studyHtml);
    if (pageScript) write(path.join(outDir, "chapters", nav, "web", nav + "-study.js"), read(path.join(dir, "study.js")));
    manifestPages.push({ chapter: n, html: studyHtml });

    /* ── foundations ── */
    var mathSrc = read(path.join(dir, "math.html"));
    var mathSections = parseSections(mathSrc);
    var mathNav =
      '  <div class="toc-group">Contents</div>\n  <ul>\n' +
      mathSections.map(function (s) {
        return '    <li><a href="#' + s.id + '" class="toc-link">' + escapeHtml(s.label) + "</a></li>";
      }).join("\n") +
      "\n  </ul>";
    var mathHtml = fill(read(path.join(TPL, "chapter-math.html")), Object.assign({}, base, {
      TITLE: "Foundations \u2014 " + ch.title,
      DESC: ch.summary || ch.title,
      NAV_LINKS: mathNav,
      CONTENT: mathSrc.trim()
    }));
    write(path.join(outDir, "chapters", nav, "web", nav + "-math.html"), mathHtml);
    manifestPages.push({ chapter: n, html: mathHtml });

    /* ── mind map ── */
    var mm = loadJSON(path.join(dir, "mindmap.json"), "chapter " + n + " mindmap.json") || { legend: [], data: { label: ch.title, children: [] } };
    var legend = (mm.legend || []).map(function (l) {
      return '  <span><span class="dot" style="background:var(--' + l.color + ')"></span> ' + escapeHtml(l.label) + "</span>";
    }).join("\n");
    var mmData = JSON.parse(JSON.stringify(mm.data));
    (function rewrite(node) {
      if (node.href) node.href = resolveHref(node.href, n, {});
      (node.children || []).forEach(rewrite);
    })(mmData);
    var mmHtml = fill(read(path.join(TPL, "chapter-mindmap.html")), Object.assign({}, base, {
      TITLE: "Mind map \u2014 " + ch.title,
      DESC: "Mind map for " + ch.title,
      LEGEND: legend,
      MINDMAP_DATA: "var data = " + JSON.stringify(mmData, null, 2) + ";"
    }));
    write(path.join(outDir, "chapters", nav, "web", nav + "-mindmap.html"), mmHtml);

    /* materials folder — the learner drops their own files here */
    fs.mkdirSync(path.join(outDir, "chapters", nav, "materials"), { recursive: true });
  });

  /* ── hub home ── */
  var cards = pack.chapters.map(function (ch, i) {
    var n = ch.n || i + 1;
    return [
      '    <div class="chapter-card" data-chapter="' + n + '" onclick="location.href=\'chapters/chapter' + n + '/web/chapter' + n + '-study.html\'" style="cursor:pointer;">',
      '      <div class="chapter-num">Week ' + (ch.week || n) + "</div>",
      "      <h2>" + escapeHtml(ch.title) + "</h2>",
      '      <p class="desc">' + escapeHtml(ch.summary || "") + "</p>",
      '      <div class="tag-row">',
      '        <span class="tag green">' + escapeHtml(ch.status || "Ready") + "</span>",
      "      </div>",
      '      <div class="chapter-links">',
      '        <a href="chapters/chapter' + n + '/web/chapter' + n + '-study.html">Study Guide &rarr;</a>',
      '        <a href="chapters/chapter' + n + '/web/chapter' + n + '-math.html">Foundations &rarr;</a>',
      '        <a href="chapters/chapter' + n + '/web/chapter' + n + '-mindmap.html">Mind Map &rarr;</a>',
      "      </div>",
      "    </div>"
    ].join("\n");
  }).join("\n\n");

  var metrics = (pack.heroMetrics || []).map(function (m) {
    return '        <div class="hero-metric">\n          <span class="label">' + escapeHtml(m.label) +
      "</span>\n          <strong>" + escapeHtml(m.value) + "</strong>\n        </div>";
  }).join("\n");

  var steps = pack.chapters.slice(0, 4).map(function (ch, i) {
    return [
      '        <div class="pipeline-step">',
      '          <span class="step-index">' + String(i + 1).padStart(2, "0") + "</span>",
      "          <div>",
      "            <strong>" + escapeHtml(ch.shortTitle || ch.title) + "</strong>",
      "            <p>" + escapeHtml(ch.summary || "") + "</p>",
      "          </div>",
      "        </div>"
    ].join("\n");
  }).join("\n");

  // Chapter colours must follow the pack's length and the pack's palette;
  // hardcoding them meant any hub with more than eight chapters crashed the
  // dashboard on CHCOLORS[n] === undefined.
  var theme = Object.assign({}, DEFAULT_THEME, pack.theme || {});
  var palette = [theme.accent, theme.blue, theme.purple, theme.green, theme.yellow, theme.red,
                 theme.accentStrong, theme.darkBg2, "#0ea5e9", "#db2777", "#0891b2", "#a855f7"];
  var chapterColors = {};
  for (var ci = 1; ci <= N; ci++) chapterColors[ci] = palette[(ci - 1) % palette.length];

  var home = fill(read(path.join(TPL, "hub-home.html")), {
    NUM_CHAPTERS: N,
    CHAPTER_COLORS: JSON.stringify(chapterColors),
    HOME_TRANSLATIONS: JSON.stringify(pack.homeTranslations || {}),
    TITLE: pack.title + " \u2014 " + pack.code,
    DESC: pack.subtitle || pack.title,
    CODE: pack.code,
    TERM: pack.term || "",
    STORAGE_KEY: pack.storageKey,
    TITLE_TEXT: pack.title,
    SUBTITLE: pack.subtitle || "",
    HERO_IMAGE: pack.heroImage || "none",
    HERO_METRICS: metrics,
    PIPELINE_STEPS: steps,
    CHAPTER_CARDS: cards,
    FOOTER: pack.code + " Interactive Study Hub",
    FOOTER_NOTE: pack.footerNote ||
      "This hub was generated from a content pack by the Usyd Mastery engine. The course author is responsible for ensuring they have the right to use every item they load into it.",
    FOOTER_ZH: pack.code + " \u4EA4\u4E92\u5F0F\u5B66\u4E60\u4E2D\u5FC3",
    FOOTER_NOTE_ZH: "\u672C\u7AD9\u7531 Usyd Mastery \u5F15\u64CE\u4ECE\u5185\u5BB9\u5305\u751F\u6210\u3002\u5185\u5BB9\u4F5C\u8005\u9700\u81EA\u884C\u786E\u4FDD\u5176\u6240\u52A0\u8F7D\u7684\u6BCF\u4E00\u9879\u7D20\u6750\u5747\u5DF2\u83B7\u5F97\u6388\u6743\u3002"
  });
  write(path.join(outDir, "index.html"), home);

  /* ── tool pages ── */
  var chapterNames = {}, chapterNamesZh = {};
  pack.chapters.forEach(function (ch, i) {
    var n = ch.n || i + 1;
    chapterNames[n] = "W" + n + ": " + (ch.shortTitle || ch.title);
    chapterNamesZh[n] = "\u7B2C" + n + "\u5468";
  });

  var toolTokens = {
    CODE: pack.code,
    STORAGE_KEY: pack.storageKey,
    NUM_CHAPTERS: N,
    CHAPTER_COLORS: JSON.stringify(chapterColors),
    CHAPTER_NAMES: JSON.stringify(chapterNames),
    CHAPTER_NAMES_ZH: JSON.stringify(chapterNamesZh)
  };
  var TOOL_TITLES = {
    "quiz-hub": ["Quiz Hub", "Practice and exam-mode quizzes with week filters, missed-question stack and per-week scoring."],
    "flashcards": ["Flashcards", "SM-2 spaced-repetition flashcards with week filters and review history."],
    "knowledge-graph": ["Knowledge Graph", "Interactive force-directed concept graph with week filtering, search and difficulty sorting."],
    "math-knowledge-graph": ["Foundations Graph", "Interactive graph of the formulas, notation and definitions used across the course."],
    "progress-dashboard": ["Progress Dashboard", "Sections read, quick checks, quiz scores and flashcard scheduling in one view."]
  };
  Object.keys(TOOL_TITLES).forEach(function (name) {
    var tplPath = path.join(TPL, "tool-" + name + ".html");
    if (!fs.existsSync(tplPath)) return;
    var meta = TOOL_TITLES[name];
    write(path.join(outDir, "tools", name + ".html"), fill(read(tplPath), Object.assign({}, toolTokens, {
      TITLE: meta[0] + " \u2014 " + pack.code,
      DESC: meta[0] + " \u2014 " + pack.code + " \u2014 " + meta[1]
    })));
  });

  /* ── graph data ── */
  [["kg", "kg.json"], ["mkg", "mkg.json"]].forEach(function (pair) {
    var data = loadJSON(path.join(packDir, "data", pair[1]), pair[1]);
    if (!data) return;
    var nodes = (data.nodes || []).map(function (node) {
      var copy = node.slice();
      copy[5] = resolveHref(copy[5], copy[1], { fromTool: true });
      return copy;
    });
    var edges = (data.edges || []).map(function (e) {
      if (e.length < 3) throw new Error(pair[1] + ": every edge needs [from, to, strength]");
      var s = Number(e[2]);
      if (!(s >= 4 && s <= 9)) {
        throw new Error(pair[1] + ": edge " + e[0] + " -> " + e[1] + " has strength " + e[2] +
          ". Strength is 4-9, not a chapter number — the graph hides anything below the threshold (default 3).");
      }
      return [e[0], e[1], s];
    });
    // shared/knowledge-graph.js reads CFG.nodes / CFG.edges, so they belong
    // inside KG_CONFIG rather than as separate globals.
    // kgHeader returns the config up to and including the ui block; the caller
    // adds the data and closes the object.
    var header = kgHeader(pack, pair[0], N);
    var body = header +
      ",\n  nodes: [\n" + nodes.map(function (n) { return "    " + JSON.stringify(n); }).join(",\n") + "\n  ],\n" +
      "  edges: [\n" + edges.map(function (e) { return "    " + JSON.stringify(e); }).join(",\n") + "\n  ]\n};\n";
    write(path.join(outDir, "tools", pair[0] + "-data.js"), body);
  });

  /* ── practice data ── */
  var quiz = loadJSON(path.join(packDir, "data", "quiz.json"), "quiz.json") || [];
  write(path.join(outDir, "data", "quiz-data-extract.js"),
    "/* " + pack.code + " \u2014 quiz bank. Generated from the content pack. */\n" +
    "var ALL_QUIZ_DATA = " + JSON.stringify(quiz, null, 2) + ";\n");

  var cards2 = loadJSON(path.join(packDir, "data", "flashcards.json"), "flashcards.json") || [];
  write(path.join(outDir, "data", "flashcard-data.js"),
    "/* " + pack.code + " \u2014 spaced-repetition deck. Generated from the content pack. */\n" +
    'var FLASHCARD_DECK_VERSION = "' + pack.storageKey + '-1";\n' +
    "var ALL_FLASHCARD_DATA = " + JSON.stringify(cards2, null, 2) + ";\n");

  /* ── manifest + site data ── */
  var manifest = countManifest(manifestPages);
  function counts(obj) {
    return "{" + pack.chapters.map(function (ch, i) {
      var n = ch.n || i + 1;
      return " " + n + ": " + (obj[n] || 0);
    }).join(", ") + " }";
  }
  write(path.join(outDir, "data", "chapter-manifest.js"),
    "/**\n * " + pack.code + " \u2014 progress denominators, counted from the generated pages.\n" +
    " * Regenerate: node scripts/build-hub.js " + packArg + "\n */\n" +
    "window.CHAPTER_MANIFEST = {\n" +
    "  sections: " + counts(manifest.sections) + ",\n" +
    "  checks: " + counts(manifest.checks) + ",\n" +
    "  tutorials: " + counts(manifest.tutorials) + "\n};\n");

  write(path.join(outDir, "data", "site-data.js"),
    "/* " + pack.code + " \u2014 course metadata. Generated from the content pack. */\n" +
    "window." + pack.code.toUpperCase().replace(/[^A-Z0-9]/g, "") + "_SITE = " +
    JSON.stringify({
      courseCode: pack.code, courseName: pack.title, term: pack.term || "",
      subtitle: pack.subtitle || "",
      chapters: pack.chapters.map(function (ch, i) {
        var n = ch.n || i + 1;
        return {
          number: n, week: ch.week || n, slug: "chapter" + n, title: ch.title,
          shortTitle: ch.shortTitle || ch.title, summary: ch.summary || "",
          status: ch.status || "Ready", concepts: ch.concepts || []
        };
      })
    }, null, 2) + ";\n");

  /* ── hub shared/ ── */
  write(path.join(outDir, "shared", "study.css"), themeCSS(pack));
  write(path.join(outDir, "shared", "lang-config.js"), langConfig(pack));
  // A pack may ship its own translations. If it does, emit them; if it does
  // not, emit an empty stub. An earlier version always wrote the stub, so a
  // pack could not carry a translation at all — the build silently discarded it.
  var trDir = path.join(packDir, "translations");
  var strings = loadJSON(path.join(trDir, "strings.json"), "translations/strings.json");
  var sections = loadJSON(path.join(trDir, "sections.json"), "translations/sections.json");

  var stringsOut = [
    "/* " + pack.code + " \u2014 interface strings for the language toggle.",
    " * Written by scripts/build-hub.js from translations/strings.json. */"
  ];
  ["COMMON", "CH", "MINDMAP_UI"].forEach(function (g) {
    stringsOut.push("var " + g + " = " + JSON.stringify((strings && strings[g]) || {}, null, 2) + ";");
  });
  if (!strings) {
    stringsOut.push("/* No translations/strings.json in this pack \u2014 the toggle stays inert. */");
  }
  write(path.join(outDir, "shared", "translations.js"), stringsOut.join("\n\n") + "\n");

  var trGlobal = pack.code.toUpperCase().replace(/[^A-Z0-9]/g, "") + "_SECTION_TRANSLATIONS";
  write(path.join(outDir, "shared", "section-translations.js"),
    ["/* " + pack.code + " \u2014 whole-section translations.",
     " * Written by scripts/build-hub.js from translations/sections.json. */",
     "var " + trGlobal + " = " + JSON.stringify(sections || {}, null, 2) + ";",
     ""].join("\n"));

  /* ── .gitignore: never commit what you do not own ── */
  write(path.join(outDir, ".gitignore"),
    "# Drop your own course files into chapters/*/materials/.\n" +
    "# They are ignored by default so that lecture slides, tutorial solutions and\n" +
    "# any other third-party material are never committed by accident.\n" +
    "chapters/*/materials/*\n" +
    "!chapters/*/materials/.gitkeep\n");

  pack.chapters.forEach(function (ch, i) {
    var n = ch.n || i + 1;
    write(path.join(outDir, "chapters", "chapter" + n, "materials", ".gitkeep"), "");
  });

  console.log("wrote " + written.length + " files");
  console.log("  sections per chapter: " + pack.chapters.map(function (ch, i) {
    return (manifest.sections[ch.n || i + 1] || 0);
  }).join(", "));
  console.log("\nRun: node scripts/verify-pack.js " + packArg);
}

main();
