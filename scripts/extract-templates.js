#!/usr/bin/env node
"use strict";

/**
 * extract-templates.js — developer tool. Run only when a page shell changes.
 *
 *   node scripts/extract-templates.js [referenceHub]
 *
 * The engine renders course hubs from a content pack (see docs/AUTHORING.md).
 * To keep generated pages structurally identical to the hand-built ones, the
 * shells are extracted from a reference hub rather than retyped, and every
 * course-specific value becomes a {{TOKEN}}.
 *
 * The three chapter page kinds have genuinely different shells:
 *
 *   study    <nav id="sidebar"> + <main id="mainContent"> + sections
 *   math     <nav class="toc-sidebar"> + sections (no <main>)
 *   mindmap  full-screen canvas: back bar, legend, canvas, inline data tree
 *
 * Writes templates/*.html
 */

var fs = require("fs");
var path = require("path");

var ROOT = path.resolve(__dirname, "..");
var OUT = path.join(ROOT, "templates");

function read(p) {
  return fs.readFileSync(path.join(ROOT, p), "utf8");
}

function findReferenceHub() {
  if (process.argv[2]) return process.argv[2];
  var candidates = fs
    .readdirSync(ROOT)
    .filter(function (d) {
      return (
        ["node_modules", "shared", "scripts", "templates", "content", "docs"].indexOf(d) === -1 &&
        fs.existsSync(path.join(ROOT, d, "chapters", "chapter1", "web"))
      );
    })
    .sort();
  var usable = candidates.filter(function (d) {
    return ["study", "math", "mindmap"].every(function (kind) {
      return fs.existsSync(
        path.join(ROOT, d, "chapters", "chapter1", "web", "chapter1-" + kind + ".html")
      );
    });
  });
  return usable[0] || candidates[0];
}

var HUB = findReferenceHub();
if (!HUB) {
  console.error("No reference hub found.");
  process.exit(1);
}
var SLUG = HUB.toLowerCase();
var BASE = "chapter1";

function tokenise(text) {
  return text
    /* chapter-ui.js is an engine module now — identical in every hub bar the
       course name in its header — so it must point at shared/, not at a hub
       copy that a generated hub does not have. This rule must come first,
       before the generic prefix rewrites below. */
    .replace(/\.\.\/\.\.\/\.\.\/shared\/chapter-ui\.js/g, "{{ENGINE}}/chapter-ui.js")
    .replace(/\.\.\/\.\.\/\.\.\/\.\.\/shared\//g, "{{ENGINE}}/")
    .replace(/\.\.\/\.\.\/\.\.\/shared\//g, "{{HUB_SHARED}}/")
    .replace(/\.\.\/\.\.\/\.\.\/index\.html/g, "{{HUB_ROOT}}/index.html")
    .replace(new RegExp(BASE, "g"), "{{CHAPTER_BASE}}");
}

function headOf(html, kind) {
  // Split on </head>, not on a literal "<body>": the mind map page opens with
  // <body class="mm-page">, and a missed match previously returned the whole
  // document as the head, duplicating it into every generated page.
  var headEnd = html.indexOf("</head>");
  if (headEnd === -1) throw new Error("no </head> in the reference page");
  var head = html.slice(0, headEnd);
  head = head.replace(/<title>[\s\S]*?<\/title>/, "<title>{{TITLE}}</title>");
  head = head.replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="{{DESC}}">'
  );
  head = head.replace(
    /<meta property="og:title" content="[^"]*">/,
    '<meta property="og:title" content="{{TITLE}}">'
  );
  head = head.replace(
    /<meta property="og:description" content="[^"]*">/,
    '<meta property="og:description" content="{{DESC}}">'
  );
  head = head.replace(
    /<link rel="stylesheet" href="\.\.\/\.\.\/\.\.\/shared\/[a-z-]+\.css">/,
    '<link rel="stylesheet" href="{{HUB_SHARED}}/{{HUB_CSS}}">'
  );
  head = head.replace(
    new RegExp('<script defer src="' + BASE + "-" + kind + '\\.js"></script>'),
    "{{PAGE_SCRIPT}}"
  );
  return tokenise(head);
}

/* Returns the index just past the opening <body ...> tag. The reference mind
   map page uses <body class="mm-page">, so matching the literal "<body>" gives
   -1 and every slice built from it silently returns nearly the whole document. */
function bodyStart(html) {
  var m = /<body\b[^>]*>/i.exec(html);
  if (!m) throw new Error("no <body> tag in the reference page");
  return m.index + m[0].length;
}

function tailOf(html, fromIndex) {
  return tokenise(html.slice(fromIndex));
}

function studyTemplate() {
  var html = read(HUB + "/chapters/" + BASE + "/web/" + BASE + "-study.html");
  var navStart = html.indexOf('<nav id="sidebar">');
  var navEnd = html.indexOf("</nav>") + "</nav>".length;
  var mainEnd = html.lastIndexOf("</main>");

  var nav = tokenise(html.slice(navStart, navEnd))
    .replace(/<span class="sidebar-icon">[^<]*<\/span>/, '<span class="sidebar-icon">{{CHAPTER_ICON}}</span>')
    .replace(/<h2>Week \d+<\/h2>/, "<h2>{{CHAPTER_LABEL}}</h2>")
    .replace(/<ul class="nav-links">[\s\S]*?<\/ul>/, '<ul class="nav-links">\n{{NAV_LINKS}}\n  </ul>')
    .replace(/<div class="progress-fill" style="width:\d+%"><\/div>/, '<div class="progress-fill" style="width:0%"></div>')
    .replace(/<div class="progress-text">[^<]*<\/div>/, '<div class="progress-text">{{PROGRESS_LABEL}}</div>');

  return (
    headOf(html, "study") +
    "<body>\n" +
    nav +
    '\n\n<button id="sidebarToggle" aria-label="Toggle sidebar">&#9776;</button>\n\n' +
    '<main id="mainContent">\n\n{{CONTENT}}\n\n</main>\n' +
    tailOf(html, mainEnd + "</main>".length)
  );
}

function mathTemplate() {
  var html = read(HUB + "/chapters/" + BASE + "/web/" + BASE + "-math.html");
  var bodyFrom = bodyStart(html);
  var navStart = html.indexOf('<nav class="toc-sidebar">');
  var navEnd = html.indexOf("</nav>", navStart) + "</nav>".length;
  var langInject = html.indexOf("<!-- LANG-INJECT -->");

  var nav = tokenise(html.slice(navStart, navEnd)).replace(
    /<ul[^>]*>[\s\S]*?<\/ul>/,
    "<ul>\n{{NAV_LINKS}}\n  </ul>"
  );

  return (
    headOf(html, "math") +
    "<body>\n" +
    tokenise(html.slice(bodyFrom, navStart)) +
    nav +
    "\n\n{{CONTENT}}\n\n" +
    tailOf(html, langInject)
  );
}

function mindmapTemplate() {
  var html = read(HUB + "/chapters/" + BASE + "/web/" + BASE + "-mindmap.html");
  var bodyFrom = bodyStart(html);
  var dataStart = html.indexOf("var data = {");
  var renderStart = html.indexOf("renderMindmap(");
  var langInject = html.indexOf("<!-- LANG-INJECT -->");

  var shellBefore = tokenise(html.slice(bodyFrom, dataStart))
    .replace(/<span class="mm-title">[^<]*<\/span>/, '<span class="mm-title">{{CHAPTER_LABEL}} mind map</span>')
    .replace(/<div class="mm-legend">[\s\S]*?<\/div>\n/, '<div class="mm-legend">\n{{LEGEND}}\n</div>\n');

  return (
    headOf(html, "mindmap") +
    "<body>\n" +
    shellBefore +
    "{{MINDMAP_DATA}}\n" +
    tokenise(html.slice(renderStart, langInject)) +
    tailOf(html, langInject)
  );
}

function toolTemplate(name) {
  var html = read(HUB + "/tools/" + name + ".html");
  html = html.replace(/<title>[^<]*<\/title>/, "<title>{{TITLE}}</title>");
  html = html.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="{{DESC}}">');
  html = html.replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="{{TITLE}}">');
  html = html.replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="{{DESC}}">');
  // Storage keys are stored as "<slug>_progress", "<slug>_flashcards", "<slug>_lang".
  html = html.replace(new RegExp(SLUG + "_", "g"), "{{STORAGE_KEY}}_");
  html = html.replace(new RegExp(HUB, "g"), "{{CODE}}");
  html = html.replace(/courseCode:\s*"[^"]*"/, 'courseCode: "{{STORAGE_KEY}}"');
  // Match to the first balanced closing brace so single-line literals are
  // caught too — the old multi-line-only regex let one through.
  function replaceObject(text, key, token) {
    var re = new RegExp(key + ":\\s*\\{");
    var m = re.exec(text);
    if (!m) return text;
    var i = m.index + m[0].length - 1;
    var depth = 0;
    for (var j = i; j < text.length; j++) {
      if (text[j] === "{") depth++;
      else if (text[j] === "}") {
        depth--;
        if (depth === 0) return text.slice(0, m.index) + key + ": " + token + text.slice(j + 1);
      }
    }
    return text;
  }
  html = html.replace(/numChapters:\s*\d+/, "numChapters: {{NUM_CHAPTERS}}");
  html = html.replace(/totalChapters:\s*\d+/, "totalChapters: {{NUM_CHAPTERS}}");
  html = replaceObject(html, "chapterNames", "{{CHAPTER_NAMES}}");
  html = replaceObject(html, "chapterNamesZh", "{{CHAPTER_NAMES_ZH}}");
  return html;
}

fs.mkdirSync(OUT, { recursive: true });
var written = [];
function write(name, content) {
  fs.writeFileSync(path.join(OUT, name), content, "utf8");
  written.push(name + "  (" + content.split("\n").length + " lines)");
}

write("chapter-study.html", studyTemplate());
write("chapter-math.html", mathTemplate());
write("chapter-mindmap.html", mindmapTemplate());

fs.readdirSync(path.join(ROOT, HUB, "tools"))
  .filter(function (f) { return f.endsWith(".html"); })
  .sort()
  .forEach(function (f) {
    write("tool-" + f, toolTemplate(f.replace(/\.html$/, "")));
  });

console.log("reference hub: " + HUB);
console.log("wrote templates/:");
written.forEach(function (w) { console.log("  " + w); });
console.log("\nStill authored by hand: templates/hub-home.html");
