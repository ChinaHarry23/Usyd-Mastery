#!/usr/bin/env node
"use strict";

/**
 * Generator tests.
 *
 * The engine's promise is that a content pack renders to a working hub
 * deterministically. These tests hold it to that: build the sample pack twice
 * and demand identical bytes, then check the output is structurally sound.
 *
 * Run with: node tests/test-generator.js
 */

var assert = require("assert");
var fs = require("fs");
var os = require("os");
var path = require("path");
var crypto = require("crypto");
var execFileSync = require("child_process").execFileSync;

var ROOT = path.resolve(__dirname, "..");
var PACK = "content/demo";
var passed = 0;
var failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log("  \u2713 " + name);
  } catch (e) {
    failed++;
    console.error("  \u2717 " + name + ": " + e.message);
  }
}

function build(outDir) {
  execFileSync(process.execPath, [path.join(ROOT, "scripts", "build-hub.js"), PACK, "--out", outDir], {
    cwd: ROOT,
    stdio: "pipe"
  });
}

function walk(dir, acc) {
  acc = acc || [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    var p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  });
  return acc;
}

function hashTree(dir) {
  var h = crypto.createHash("sha256");
  walk(dir)
    .map(function (p) { return path.relative(dir, p); })
    .sort()
    .forEach(function (rel) {
      h.update(rel);
      h.update(fs.readFileSync(path.join(dir, rel)));
    });
  return h.digest("hex");
}

/* Build inside the repo: a hub is designed to sit one level under the root, so
   `../../shared/...` only resolves from there. Temp directories would report
   every engine reference as broken. */
var tmpA = fs.mkdtempSync(path.join(ROOT, ".gen-a-"));
var tmpB = fs.mkdtempSync(path.join(ROOT, ".gen-b-"));

console.log("\n\u2500\u2500 Generator \u2500\u2500");

test("the sample pack passes verification", function () {
  var out = execFileSync(process.execPath, [path.join(ROOT, "scripts", "verify-pack.js"), PACK], {
    cwd: ROOT, encoding: "utf8"
  });
  assert.ok(/Pack is valid/.test(out), "verify-pack did not report success:\n" + out);
});

test("an invalid pack is refused, not rendered", function () {
  var bad = fs.mkdtempSync(path.join(os.tmpdir(), "badpack-"));
  var src = path.join(ROOT, PACK);
  fs.cpSync(src, bad, { recursive: true });
  var kgPath = path.join(bad, "data", "kg.json");
  var kg = JSON.parse(fs.readFileSync(kgPath, "utf8"));
  kg.edges[0][2] = 1; // below the graph's own visibility threshold
  fs.writeFileSync(kgPath, JSON.stringify(kg));

  var refused = false;
  try {
    execFileSync(process.execPath, [path.join(ROOT, "scripts", "build-hub.js"), bad, "--out", path.join(bad, "out")], {
      cwd: ROOT, stdio: "pipe"
    });
  } catch (e) {
    refused = true;
  }
  assert.ok(refused, "the generator rendered a pack that fails verification");
  fs.rmSync(bad, { recursive: true, force: true });
});

test("two builds of the same pack are byte-identical", function () {
  build(tmpA);
  build(tmpB);
  assert.strictEqual(hashTree(tmpA), hashTree(tmpB),
    "the generator is not deterministic — a rebuild produced different bytes");
});

test("every generated page is exactly one document", function () {
  // A shell-extraction bug once emitted two complete documents per mind map
  // page, the first carrying the reference hub's stale content. Tag-balance
  // counting alone did not catch it, so assert the document count directly.
  var bad = [];
  walk(tmpA).filter(function (p) { return p.endsWith(".html"); }).forEach(function (p) {
    var t = fs.readFileSync(p, "utf8");
    var rel = path.relative(tmpA, p);
    var html = (t.match(/<html\b/gi) || []).length;
    var body = (t.match(/<body\b/gi) || []).length;
    var dv = (t.match(/<div\b/g) || []).length;
    var dc = (t.match(/<\/div>/g) || []).length;
    var sv = (t.match(/<section\b/g) || []).length;
    var sc = (t.match(/<\/section>/g) || []).length;
    if (html !== 1) bad.push(rel + " has " + html + " <html> tags");
    if (body !== 1) bad.push(rel + " has " + body + " <body> tags");
    if (dv !== dc) bad.push(rel + " div " + dv + "/" + dc);
    if (sv !== sc) bad.push(rel + " section " + sv + "/" + sc);
    // Literal examples live in <code>/<pre> (the demo teaches the markup by
    // showing it), so mask them before looking for real duplicate ids.
    var scannable = t
      .replace(/<pre\b[\s\S]*?<\/pre>/gi, " ")
      .replace(/<code\b[\s\S]*?<\/code>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ");
    var ids = scannable.match(/id="([^"]+)"/g) || [];
    var seen = {};
    ids.forEach(function (x) {
      var v = x.slice(4, -1);
      if (seen[v]) bad.push(rel + ' duplicate id "' + v + '"');
      seen[v] = 1;
    });
  });
  assert.deepStrictEqual(bad, [], "structural defects:\n  " + bad.join("\n  "));
});

test("no generated page leaks the reference hub", function () {
  var leaks = [];
  walk(tmpA).forEach(function (p) {
    var t = fs.readFileSync(p, "utf8");
    // The templates are extracted from a real hub; none of its values may
    // survive into a pack that is not that hub.
    ["COMP5047", "comp5047", "ubicomp", "Pervasive Computing"].forEach(function (needle) {
      if (t.indexOf(needle) !== -1) leaks.push(path.relative(tmpA, p) + " contains \"" + needle + "\"");
    });
  });
  assert.deepStrictEqual(leaks, [], "reference-hub values leaked:\n  " + leaks.join("\n  "));
});

test("declarative widgets use the keys the renderer reads", function () {
  // The gate once validated an invented contract that disagreed with
  // shared/interactive.js on six of eight types, so broken widgets passed.
  var REAL = {
    sequence: ["title", "steps"], matcher: ["title", "pairs"], timeline: ["title", "events"],
    hotspot: ["title", "points"], deck: ["title", "cards"], race: ["title", "max", "rows"],
    pipeline: ["title", "nodes"]
  };
  var WRONG = ["hotspots", "stages", "frames"];
  var bad = [];
  walk(tmpA).filter(function (p) { return p.endsWith(".html"); }).forEach(function (p) {
    var html = fs.readFileSync(p, "utf8");
    var re = /<div data-ix="([a-z]+)" data-ix-src="#([^"]+)"><\/div>/g;
    var m;
    while ((m = re.exec(html))) {
      var type = m[1], id = m[2];
      if (!REAL[type]) { bad.push(path.relative(tmpA, p) + ": stepper/unknown type " + type + " cannot be declarative"); continue; }
      var cm = html.match(new RegExp('<script type="application/json" id="' + id + '">([\\s\\S]*?)</script>'));
      if (!cm) { bad.push(id + ": no config"); continue; }
      var cfg;
      try { cfg = JSON.parse(cm[1]); } catch (e) { bad.push(id + ": bad JSON"); continue; }
      REAL[type].forEach(function (k) {
        if (!(k in cfg)) bad.push(id + " (" + type + ") missing \"" + k + "\"");
      });
      WRONG.forEach(function (k) {
        if (k in cfg) bad.push(id + " (" + type + ") uses \"" + k + "\", which the renderer ignores");
      });
    }
  });
  assert.deepStrictEqual(bad, [], "widget contract violations:\n  " + bad.join("\n  "));
});

test("no template token survives into the output", function () {
  var leftovers = [];
  walk(tmpA).forEach(function (p) {
    var m = fs.readFileSync(p, "utf8").match(/\{\{[A-Z_]+\}\}/g);
    if (m) leftovers.push(path.relative(tmpA, p) + " -> " + m.join(", "));
  });
  assert.deepStrictEqual(leftovers, [], "unfilled tokens:\n  " + leftovers.join("\n  "));
});

test("every local reference in the output resolves", function () {
  var missing = [];
  walk(tmpA).filter(function (p) { return p.endsWith(".html"); }).forEach(function (p) {
    var t = fs.readFileSync(p, "utf8");
    var base = path.dirname(p);
    var re = /(?:src|href)="([^"]+)"/g;
    var m;
    while ((m = re.exec(t))) {
      var u = m[1];
      if (/^(https?:|data:|#|mailto:)/.test(u)) continue;
      var abs = u.split("#")[0];
      if (abs.charAt(0) === "/") continue; // site-absolute, resolved at serve time
      if (!fs.existsSync(path.normalize(path.join(base, abs)))) {
        missing.push(path.relative(tmpA, p) + " -> " + u);
      }
    }
  });
  assert.deepStrictEqual(missing, [], "broken references:\n  " + missing.join("\n  "));
});

test("the sidebar navigation matches the sections on the page", function () {
  var study = path.join(tmpA, "chapters", "chapter1", "web", "chapter1-study.html");
  var html = fs.readFileSync(study, "utf8");
  var sectionIds = (html.match(/<section\b[^>]*\bid="([^"]+)"/g) || []).map(function (t) {
    return t.match(/id="([^"]+)"/)[1];
  });
  var navTargets = (html.match(/class="nav-link[^"]*" data-section="/g) || []).length;
  assert.strictEqual(navTargets, sectionIds.length,
    "the sidebar has " + navTargets + " tracked links for " + sectionIds.length + " sections");
  sectionIds.forEach(function (id) {
    assert.ok(html.indexOf('href="#' + id + '"') !== -1, "no nav link for section #" + id);
  });
});

test("generated graph data satisfies the engine's contract", function () {
  ["kg", "mkg"].forEach(function (kind) {
    var src = fs.readFileSync(path.join(tmpA, "tools", kind + "-data.js"), "utf8");
    var win = {};
    new Function("window", src)(win);
    var cfg = win.KG_CONFIG;
    assert.ok(cfg, kind + ": KG_CONFIG not defined");
    assert.ok(Array.isArray(cfg.nodes) && cfg.nodes.length, kind + ": no nodes on the config");
    assert.ok(Array.isArray(cfg.edges) && cfg.edges.length, kind + ": no edges on the config");
    assert.strictEqual(typeof cfg.langKey, "string", kind + ": langKey missing");
    cfg.edges.forEach(function (e) {
      assert.ok(e[2] >= 4 && e[2] <= 9, kind + ": edge strength " + e[2] + " outside 4-9");
    });
    cfg.nodes.forEach(function (n) {
      assert.strictEqual(n.length, 6, kind + ": node is not a 6-tuple");
      assert.ok(n[2] >= 1 && n[2] <= 3, kind + ": difficulty out of range");
      assert.ok(/\.html#/.test(n[5]), kind + ': href "' + n[5] + '" has no anchor');
    });
  });
});

/* The data files declare top-level `var`s, exactly as a browser sees them, so
   read them back by returning the bindings rather than expecting window props. */
function evalData(file, names) {
  var src = fs.readFileSync(file, "utf8");
  return new Function(src + "\nreturn {" + names.join(",") + "};")();
}

test("generated practice data loads and is well formed", function () {
  var win = evalData(path.join(tmpA, "data", "quiz-data-extract.js"), ["ALL_QUIZ_DATA"]);
  assert.ok(Array.isArray(win.ALL_QUIZ_DATA) && win.ALL_QUIZ_DATA.length, "no quiz data");
  win.ALL_QUIZ_DATA.forEach(function (q) {
    assert.strictEqual(q.opts.length, 4, "a question does not have 4 options");
    assert.ok(q.answer >= 0 && q.answer <= 3, "answer out of range");
  });

  var win2 = evalData(path.join(tmpA, "data", "flashcard-data.js"), ["ALL_FLASHCARD_DATA", "FLASHCARD_DECK_VERSION"]);
  assert.ok(Array.isArray(win2.ALL_FLASHCARD_DATA) && win2.ALL_FLASHCARD_DATA.length, "no flashcards");
  assert.ok(/^[a-z0-9]+-\d+$/.test(win2.FLASHCARD_DECK_VERSION), "deck version is not <storageKey>-<n>");
});

test("the manifest counts the pages that were actually generated", function () {
  var win = {};
  new Function("window", fs.readFileSync(path.join(tmpA, "data", "chapter-manifest.js"), "utf8"))(win);
  var m = win.CHAPTER_MANIFEST;
  // The tracker counts the union of tracked sections across a chapter's pages,
  // so study + foundations together is the denominator.
  var total = 0;
  ["study", "math"].forEach(function (kind) {
    var f = path.join(tmpA, "chapters", "chapter1", "web", "chapter1-" + kind + ".html");
    total += (fs.readFileSync(f, "utf8").match(/data-track="/g) || []).length;
  });
  assert.strictEqual(m.sections[1], total,
    "manifest says " + m.sections[1] + " sections for chapter 1 but its pages carry " + total);
  assert.ok(m.checks[1] > 0, "manifest reports no quick checks for chapter 1");
});

fs.rmSync(tmpA, { recursive: true, force: true });
fs.rmSync(tmpB, { recursive: true, force: true });

console.log("\n\u2500\u2500 Results: " + passed + " passed, " + failed + " failed \u2500\u2500\n");
process.exit(failed > 0 ? 1 : 0);
