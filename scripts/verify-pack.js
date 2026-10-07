#!/usr/bin/env node
"use strict";

/**
 * verify-pack.js — the contract a content pack must satisfy before it is built.
 *
 *   node scripts/verify-pack.js content/demo
 *
 * This is the gate between authoring and publishing. A pack may be written by a
 * person or by an agent; either way it does not get rendered until it passes
 * every check here. Each failure names the file, the location and the rule, so
 * the fix is mechanical rather than a guess.
 *
 * Exit code 0 = safe to build. 1 = at least one hard failure.
 */

var fs = require("fs");
var path = require("path");

var ROOT = path.resolve(__dirname, "..");
var packArg = process.argv[2];
if (!packArg) {
  console.error("usage: node scripts/verify-pack.js <content-pack-dir>");
  process.exit(1);
}
var PACK = path.resolve(ROOT, packArg);

var problems = [];
var warnings = [];
var checked = { chapters: 0, sections: 0, widgets: 0, quiz: 0, cards: 0, nodes: 0, edges: 0 };

function fail(file, where, msg) {
  problems.push(file + (where ? " [" + where + "]" : "") + ": " + msg);
}
function warn(file, where, msg) {
  warnings.push(file + (where ? " [" + where + "]" : "") + ": " + msg);
}
function read(p) {
  return fs.readFileSync(p, "utf8");
}
function json(p, label) {
  try {
    return JSON.parse(read(p));
  } catch (e) {
    fail(label, "", "invalid JSON — " + e.message);
    return null;
  }
}

/* ── widget contract ───────────────────────────────────────────── */

/* The contract below is taken from shared/interactive.js — the renderer — and
   cross-checked against configs that demonstrably render on the existing hubs.
   An earlier version of this table was invented rather than read, and it
   disagreed with the renderer on six of the eight types: it demanded `stages`
   where the renderer reads `nodes`, `hotspots` where it reads `points`, and
   step objects where it reads plain strings. A validator that encodes the wrong
   contract is worse than none, because it certifies broken packs.

   stepper is absent by design: its frames carry `draw(ctx, k, w, h)` FUNCTIONS,
   so it cannot be expressed in JSON at all. Mount it from study.js instead. */
var WIDGETS = {
  sequence: { required: ["title", "steps"], array: "steps", item: "string" },
  matcher: { required: ["title", "pairs"], array: "pairs", item: "pair" },
  timeline: { required: ["title", "events"], array: "events", item: "event" },
  hotspot: { required: ["title", "points"], array: "points", item: "point", oneOf: ["svg", "img"] },
  deck: { required: ["title", "cards"], array: "cards", item: "card" },
  race: { required: ["title", "max", "rows"], array: "rows", item: "row" },
  pipeline: { required: ["title", "nodes"], array: "nodes", item: "node" }
};

var ITEM_RULES = {
  string: function (v) { return typeof v === "string" && v.trim() ? null : "must be a plain string"; },
  pair: function (v) {
    return Array.isArray(v) && v.length === 2 && v.every(function (x) { return typeof x === "string"; })
      ? null : "must be a two-element array [left, right]";
  },
  event: function (v) {
    return v && v.label && v.title && v.detail ? null : "needs label, title and detail";
  },
  point: function (v) {
    return v && typeof v.x === "number" && typeof v.y === "number" && v.label && v.detail
      ? null : "needs numeric x, numeric y, label and detail";
  },
  card: function (v) { return v && v.front && v.back ? null : "needs front and back"; },
  row: function (v) {
    return v && v.name && typeof v.value === "number" ? null : "needs name and a numeric value";
  },
  node: function (v) { return v && v.label ? null : "needs label"; }
};

/* Chapter 2 of the demo teaches the markup by showing it, so literal examples
   live inside <code> and <pre>. Scanning those as if they were real elements
   produces false "duplicate id" and "missing config" reports — the same class
   of mistake as counting LaTeX row-spacing as a maths delimiter. Mask literal
   blocks first, preserving length so offsets stay meaningful. */
function maskLiterals(html) {
  return html
    .replace(/<pre\b[\s\S]*?<\/pre>/gi, function (m) { return m.replace(/[^\n]/g, " "); })
    .replace(/<code\b[\s\S]*?<\/code>/gi, function (m) { return m.replace(/[^\n]/g, " "); })
    .replace(/<!--[\s\S]*?-->/g, function (m) { return m.replace(/[^\n]/g, " "); });
}

function parseSections(html) {
  var out = [];
  var re = /<section\b[^>]*\bid="([^"]+)"[^>]*>/g;
  var m;
  while ((m = re.exec(html))) {
    var rest = html.slice(m.index);
    var end = rest.indexOf("</section>");
    out.push({ tag: m[0], id: m[1], body: rest.slice(0, end === -1 ? rest.length : end) });
  }
  return out;
}

function checkContentPage(file, rel, expectHeroPrefix) {
  var html = maskLiterals(read(file));
  var sections = parseSections(html);

  if (!sections.length) {
    fail(rel, "", "no <section> blocks — a content page must contain at least a hero");
    return;
  }
  if (sections[0].id !== expectHeroPrefix) {
    fail(rel, sections[0].id, 'the first section must be id="' + expectHeroPrefix + '"');
  }

  var ids = {};
  var tracks = {};
  sections.forEach(function (s, i) {
    checked.sections++;
    if (ids[s.id]) fail(rel, s.id, "duplicate section id");
    ids[s.id] = 1;

    var track = (s.tag.match(/data-track="([^"]+)"/) || [])[1];
    if (!track) {
      fail(rel, s.id, 'missing data-track — the progress tracker needs it');
    } else if (tracks[track]) {
      fail(rel, s.id, 'data-track="' + track + '" is already used by another section');
    } else {
      tracks[track] = 1;
      if (track !== track.toLowerCase() || /\s/.test(track)) {
        fail(rel, s.id, 'data-track="' + track + '" must be lowercase with no spaces');
      }
    }

    if (i > 0 && !/<h2[^>]*class="[^"]*section-title/.test(s.body)) {
      fail(rel, s.id, 'non-hero sections need an <h2 class="section-title"> — the sidebar label comes from it');
    }
    if (/<html|<head|<body|<nav\b|<main\b/i.test(s.body)) {
      fail(rel, s.id, "a content fragment must not contain page-level markup");
    }
  });

  /* quick checks */
  var qcs = html.match(/class="quick-check"/g) || [];
  var blocks = html.split('class="quick-check"').slice(1);
  blocks.forEach(function (b, i) {
    var opts = b.match(/class="qc-opt"/g) || [];
    var correct = b.match(/data-correct="true"/g) || [];
    if (opts.length < 2) fail(rel, "quick-check " + (i + 1), "needs at least two options, found " + opts.length);
    if (correct.length !== 1) {
      fail(rel, "quick-check " + (i + 1), "must have exactly one data-correct=\"true\", found " + correct.length);
    }
  });

  /* widgets */
  var mounts = html.match(/<div data-ix="([a-z]+)" data-ix-src="#([^"]+)"><\/div>/g) || [];
  mounts.forEach(function (tag) {
    var type = tag.match(/data-ix="([a-z]+)"/)[1];
    var id = tag.match(/data-ix-src="#([^"]+)"/)[1];
    checked.widgets++;

    if (!WIDGETS[type]) {
      if (type === "stepper") {
        fail(rel, id, "stepper cannot be declarative — its frames carry draw() functions, " +
          "which JSON cannot express. Mount it from study.js with Interactive.stepper(...) " +
          "and give the placeholder a plain id instead of data-ix.");
      } else {
        fail(rel, id, 'unknown widget type "' + type + '" — valid types: ' +
          Object.keys(WIDGETS).join(", "));
      }
      return;
    }
    var spec = WIDGETS[type];
    var cfgRe = new RegExp('<script type="application/json" id="' + id + '">([\\s\\S]*?)</script>');
    var m = html.match(cfgRe);
    if (!m) {
      fail(rel, id, "no <script type=\"application/json\"> with that id — the widget will never mount");
      return;
    }
    var cfg;
    try {
      cfg = JSON.parse(m[1]);
    } catch (e) {
      fail(rel, id, "config is not valid JSON — " + e.message.split("\n")[0]);
      return;
    }
    spec.required.forEach(function (k) {
      if (!(k in cfg)) fail(rel, id, type + ' config is missing required key "' + k +
        '" (the renderer reads ' + spec.required.join(", ") + ")");
    });
    if (spec.oneOf) {
      var present = spec.oneOf.filter(function (k) { return k in cfg; });
      if (present.length !== 1) {
        fail(rel, id, type + " config needs exactly one of " + spec.oneOf.join(" / ") +
          ", found " + present.length);
      }
    }
    var arr = cfg[spec.array];
    if (arr !== undefined) {
      if (!Array.isArray(arr)) fail(rel, id, '"' + spec.array + '" must be an array');
      else if (!arr.length) fail(rel, id, '"' + spec.array + '" is empty — the widget renders nothing');
      else {
        arr.forEach(function (item, k) {
          var why = ITEM_RULES[spec.item](item);
          if (why) fail(rel, id, spec.array + "[" + k + "] " + why);
        });
      }
    }
    if (type === "race" && typeof cfg.max !== "number") {
      fail(rel, id, 'race "max" must be a number — it scales every bar');
    }
  });

  /* a widget id must not be reused */
  var allIds = html.match(/id="([^"]+)"/g) || [];
  var seen = {};
  allIds.forEach(function (t) {
    var v = t.slice(4, -1);
    if (seen[v]) fail(rel, v, "duplicate id on the page");
    seen[v] = 1;
  });

  /* KaTeX balance — \\[ is row spacing inside cases/aligned, not an opener */
  var open = (html.match(/(?<!\\)\\\(|(?<!\\)\\\[/g) || []).length;
  var close = (html.match(/(?<!\\)\\\)|(?<!\\)\\\]/g) || []).length;
  if (open !== close) {
    fail(rel, "", "unbalanced KaTeX delimiters: " + open + " open vs " + close + " close" +
      " — a stray opener swallows the rest of the page into maths mode");
  }

  /* solution toggles */
  var toggles = (html.match(/class="solution-toggle"/g) || []).length;
  var bodies = (html.match(/class="solution-body"/g) || []).length;
  if (toggles !== bodies) {
    fail(rel, "", toggles + " solution-toggle but " + bodies + " solution-body — every reveal needs a body");
  }

  if (/&(?!amp;|lt;|gt;|quot;|#\d+;|#x[0-9a-f]+;|[a-z]+;)/i.test(html)) {
    warn(rel, "", "contains a bare & — escape it as &amp;");
  }
  return { qcs: qcs.length };
}

/* ── graph contract ────────────────────────────────────────────── */

function checkGraph(file, rel, label) {
  var g = json(file, rel);
  if (!g) return;
  var nodes = g.nodes || [];
  var edges = g.edges || [];
  if (!nodes.length) fail(rel, "", label + " has no nodes");

  var byId = {};
  nodes.forEach(function (n, i) {
    checked.nodes++;
    if (!Array.isArray(n) || n.length < 6) {
      fail(rel, "node " + i, "expected [id, chapter, difficulty, label, definition, href]");
      return;
    }
    if (byId[n[0]]) fail(rel, n[0], "duplicate node id");
    byId[n[0]] = n;
    if (!(n[1] >= 1)) fail(rel, n[0], "chapter must be a positive number");
    if (!(n[2] >= 1 && n[2] <= 3)) fail(rel, n[0], "difficulty must be 1-3, found " + n[2]);
    if (!n[3]) fail(rel, n[0], "missing label");
    if (!n[4]) fail(rel, n[0], "missing definition");
    if (!/^[a-z]+:\/\//i.test(String(n[5])) && !/#/.test(String(n[5]))) {
      fail(rel, n[0], 'href "' + n[5] + '" has no #anchor — a node must point at a section');
    }
  });

  var pairs = {};
  edges.forEach(function (e, i) {
    checked.edges++;
    if (!Array.isArray(e) || e.length < 3) {
      fail(rel, "edge " + i, "expected [fromId, toId, strength]");
      return;
    }
    if (!byId[e[0]]) fail(rel, "edge " + i, 'unknown from-node "' + e[0] + '"');
    if (!byId[e[1]]) fail(rel, "edge " + i, 'unknown to-node "' + e[1] + '"');
    if (e[0] === e[1]) fail(rel, "edge " + i, "self-loop on " + e[0]);
    var key = e[0] + ">" + e[1];
    if (pairs[key]) fail(rel, "edge " + i, "duplicate edge " + key);
    pairs[key] = 1;
    if (!(e[2] >= 4 && e[2] <= 9)) {
      fail(rel, "edge " + i, "strength " + e[2] + " is outside 4-9. Strength is not a chapter number: " +
        "the graph hides anything below the threshold (default 3), so 1 and 2 never draw.");
    }
  });

  var ratio = nodes.length ? edges.length / nodes.length : 0;
  if (ratio < 1.1) warn(rel, "", "edge/node ratio is " + ratio.toFixed(2) + " — a sparse graph reads as disconnected");
  if (ratio > 3) warn(rel, "", "edge/node ratio is " + ratio.toFixed(2) + " — a dense graph becomes unreadable");
}

/* ── run ───────────────────────────────────────────────────────── */

var course = json(path.join(PACK, "course.json"), "course.json");
if (!course) {
  console.error(problems.join("\n"));
  process.exit(1);
}
["code", "slug", "storageKey", "title", "chapters"].forEach(function (k) {
  if (!course[k]) fail("course.json", "", 'missing required key "' + k + '"');
});
if (!Array.isArray(course.chapters) || !course.chapters.length) {
  fail("course.json", "", "chapters must be a non-empty array");
}
if (course.storageKey && !/^[a-z0-9]+$/.test(course.storageKey)) {
  fail("course.json", "", "storageKey must be lowercase alphanumeric (it prefixes every localStorage key)");
}

(course.chapters || []).forEach(function (ch, i) {
  var n = ch.n || i + 1;
  checked.chapters++;
  ["title", "summary"].forEach(function (k) {
    if (!ch[k]) warn("course.json", "chapter " + n, 'no "' + k + '" — the hub home card will look thin');
  });
  var dir = path.join(PACK, "chapters", String(n).padStart(2, "0"));
  if (!fs.existsSync(dir)) {
    fail("course.json", "chapter " + n, "no chapters/" + String(n).padStart(2, "0") + "/ directory");
    return;
  }
  [["study.html", "hero"], ["math.html", "sec-m-hero"]].forEach(function (pair) {
    var f = path.join(dir, pair[0]);
    if (!fs.existsSync(f)) {
      fail("chapters/" + String(n).padStart(2, "0"), pair[0], "missing");
      return;
    }
    checkContentPage(f, "chapters/" + String(n).padStart(2, "0") + "/" + pair[0], pair[1]);
  });

  var mm = path.join(dir, "mindmap.json");
  if (!fs.existsSync(mm)) {
    fail("chapters/" + String(n).padStart(2, "0"), "mindmap.json", "missing");
  } else {
    var m = json(mm, "chapters/" + String(n).padStart(2, "0") + "/mindmap.json");
    if (m) {
      var okColors = ["accent", "blue", "green", "purple", "yellow", "orange", "cyan"];
      (m.legend || []).forEach(function (l, k) {
        if (okColors.indexOf(l.color) === -1) {
          fail("mindmap.json", "chapter " + n, 'legend[' + k + '] colour "' + l.color + '" is not one of ' + okColors.join(", "));
        }
      });
      var branches = (m.data && m.data.children) || [];
      if (branches.length < 2) fail("mindmap.json", "chapter " + n, "needs at least two top-level branches");
      if (branches.length > 6) warn("mindmap.json", "chapter " + n, branches.length + " branches — the canvas gets crowded");
      (function walk(node, d) {
        (node.children || []).forEach(function (c) {
          if (c.href && !/#/.test(c.href)) fail("mindmap.json", "chapter " + n, 'leaf "' + c.label + '" href has no #anchor');
          if (d < 3) walk(c, d + 1);
        });
      })(m.data || {}, 0);
    }
  }

  var js = path.join(dir, "study.js");
  if (fs.existsSync(js)) {
    try {
      new Function(read(js));
    } catch (e) {
      fail("chapters/" + String(n).padStart(2, "0"), "study.js", "does not parse — " + e.message);
    }
  }
});

checkGraph(path.join(PACK, "data", "kg.json"), "data/kg.json", "concept graph");
checkGraph(path.join(PACK, "data", "mkg.json"), "data/mkg.json", "foundations graph");

var quiz = json(path.join(PACK, "data", "quiz.json"), "data/quiz.json");
if (quiz) {
  if (!Array.isArray(quiz)) fail("data/quiz.json", "", "must be an array");
  else {
    var seenQ = {};
    quiz.forEach(function (q, i) {
      checked.quiz++;
      if (!q.q) fail("data/quiz.json", "entry " + i, "missing q");
      if (!Array.isArray(q.opts) || q.opts.length !== 4) {
        fail("data/quiz.json", "entry " + i, "needs exactly 4 options");
      } else if (new Set(q.opts).size !== 4) {
        fail("data/quiz.json", "entry " + i, "options are not unique");
      }
      if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3)) {
        fail("data/quiz.json", "entry " + i, "answer must be a 0-based index 0-3, found " + JSON.stringify(q.answer));
      }
      if (!q.exp) fail("data/quiz.json", "entry " + i, "missing exp — the explanation is the teaching moment");
      if (seenQ[q.q]) fail("data/quiz.json", "entry " + i, "duplicate question text");
      seenQ[q.q] = 1;
      if (["study", "math"].indexOf(q.type) === -1) {
        fail("data/quiz.json", "entry " + i, 'type must be "study" or "math"');
      }
    });
  }
}

var cards = json(path.join(PACK, "data", "flashcards.json"), "data/flashcards.json");
if (cards) {
  var seenF = {};
  cards.forEach(function (c, i) {
    checked.cards++;
    if (!c.front) fail("data/flashcards.json", "card " + i, "missing front");
    if (!c.back) fail("data/flashcards.json", "card " + i, "missing back");
    if (seenF[c.front]) fail("data/flashcards.json", "card " + i, "duplicate front");
    seenF[c.front] = 1;
    if (!(c.ch >= 1)) fail("data/flashcards.json", "card " + i, "missing chapter number");
  });
}

/* ── report ────────────────────────────────────────────────────── */

console.log("verify-pack: " + packArg);
console.log("  chapters " + checked.chapters + " · sections " + checked.sections + " · widgets " + checked.widgets +
  " · quiz " + checked.quiz + " · cards " + checked.cards + " · nodes " + checked.nodes + " · edges " + checked.edges);

if (warnings.length) {
  console.log("\n" + warnings.length + " warning(s):");
  warnings.forEach(function (w) { console.log("  ! " + w); });
}
if (problems.length) {
  console.log("\n" + problems.length + " problem(s) — the pack will not build:");
  problems.forEach(function (p) { console.log("  \u2717 " + p); });
  process.exit(1);
}
console.log("\nPack is valid. \u2713");
