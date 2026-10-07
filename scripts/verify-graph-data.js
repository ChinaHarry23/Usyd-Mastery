#!/usr/bin/env node
"use strict";

/**
 * Knowledge-graph data validation for every hub.
 *
 * shared/knowledge-graph.js is unforgiving about its data: it walks
 * `KG_CONFIG.nodes` as objects ({id, ch, diff, label, def, href}) and drops any
 * edge whose third element is below the threshold slider's value (default 3).
 * A typo therefore fails silently — a node with a dead `href` does nothing when
 * clicked, and an edge tagged `[from, to, 1]` is simply never drawn.
 *
 * This script checks, for each hub's concept graph (kg-data.js) and foundations
 * graph (mkg-data.js):
 *
 *   1. The file parses and defines window.KG_CONFIG with nodes + edges
 *   2. Every node has a well-formed tuple: id, chapter, difficulty 1-3,
 *      label, definition, href
 *   3. Every href resolves to a file that exists AND an id="…" inside it
 *   4. Every edge endpoint exists in that file's node list
 *   5. Edge strengths (e[2]) are 4-9, so the default threshold of 3 shows them
 *   6. No duplicate node ids, no self-loops, no edges to unknown chapters
 *
 * Usage:
 *   node scripts/verify-graph-data.js            # report
 *   node scripts/verify-graph-data.js --check    # exit 1 on any failure (CI)
 */

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.resolve(__dirname, "..");
var CHECK = process.argv.indexOf("--check") !== -1;

var HUBS = [
  "5270RandomAlgo", "5318ML", "5046NLP", "9001Py", "9123DataStructureAlgo",
  "COMP5047", "COMP5618", "ELEC5620", "INFO5995", "INFO6007"
];

// Hubs whose graph data predates the strength convention. Their edges carry
// values the engine accepts, so they are reported but never blocked.
var LEGACY_STRENGTH = { "5270RandomAlgo": true, "5318ML": true, "5046NLP": true, "9001Py": true };

var problems = [];
var summary = [];

function fail(hub, file, msg) {
  problems.push(hub + " " + file + ": " + msg);
}

function loadConfig(hub, file) {
  var full = path.join(ROOT, hub, "tools", file);
  if (!fs.existsSync(full)) return null;
  var sandbox = { window: {}, document: undefined };
  try {
    vm.runInNewContext(fs.readFileSync(full, "utf8"), sandbox, { filename: full, timeout: 5000 });
  } catch (e) {
    fail(hub, file, "runtime error: " + e.message);
    return null;
  }
  return sandbox.window.KG_CONFIG || null;
}

function anchorsIn(file) {
  if (!fs.existsSync(file)) return null;
  var set = {};
  var re = /\bid="([^"]+)"/g;
  var src = fs.readFileSync(file, "utf8");
  var m;
  while ((m = re.exec(src))) set[m[1]] = true;
  return set;
}

function graphNodes(cfg) {
  return (cfg.nodes || []).map(function (n) {
    if (Array.isArray(n)) {
      return { id: n[0], ch: n[1], diff: n[2], label: n[3], def: n[4], href: n[5] };
    }
    return n;
  });
}

function checkGraph(hub, file) {
  var cfg = loadConfig(hub, file);
  if (!cfg) {
    if (fs.existsSync(path.join(ROOT, hub, "tools", file))) {
      fail(hub, file, "window.KG_CONFIG not defined");
    }
    return;
  }

  var nodes = graphNodes(cfg);
  var edges = cfg.edges || [];
  // The engine normalises 6-element tuple nodes, but every node must still
  // resolve to a usable object afterwards — a missing field renders as
  // "undefined" with a NaN radius.
  var usesTuples = Array.isArray(cfg.nodes) && cfg.nodes.length && Array.isArray(cfg.nodes[0]);
  var numCh = cfg.numChapters || 0;
  if (!nodes.length) {
    fail(hub, file, "no nodes");
    return;
  }

  var ids = {};
  var anchorCache = {};
  var byHref = {};

  nodes.forEach(function (n, i) {
    if (!n || typeof n !== "object") {
      fail(hub, file, "node " + i + " did not normalise to an object");
      return;
    }
    if (!n.id) {
      fail(hub, file, "node " + i + " has no id");
      return;
    }
    if (ids[n.id]) fail(hub, file, "duplicate node id: " + n.id);
    ids[n.id] = n;

    if (!(n.ch >= 1 && n.ch <= (numCh || Infinity))) {
      fail(hub, file, "node " + n.id + " has out-of-range chapter " + n.ch);
    }
    // Difficulty only scales the node radius (baseR = 3 + diff * 1.2), so the
    // older hubs use a wider 1-4 range. New hubs are authored on 1-3.
    var diffMax = LEGACY_STRENGTH[hub] ? 5 : 3;
    if (!(n.diff >= 1 && n.diff <= diffMax)) {
      fail(hub, file, "node " + n.id + " has difficulty outside 1-" + diffMax + ": " + n.diff);
    }
    if (!n.label) fail(hub, file, "node " + n.id + " has no label");
    if (!n.def) fail(hub, file, "node " + n.id + " has no definition");

    if (!n.href) {
      fail(hub, file, "node " + n.id + " has no href");
      return;
    }
    var parts = String(n.href).split("#");
    var rel = parts[0];
    var anchor = parts[1];
    if (!rel) return; // same-page anchor

    var target = path.resolve(path.join(ROOT, hub, "tools"), rel);
    if (!anchorCache[rel]) anchorCache[rel] = anchorsIn(target);
    var anchors = anchorCache[rel];
    if (anchors === null) {
      fail(hub, file, "node " + n.id + " href points at a missing file: " + rel);
      return;
    }
    if (anchor && !anchors[anchor]) {
      fail(hub, file, "node " + n.id + " anchor #" + anchor + " does not exist in " + rel);
    }
    var key = rel + "#" + (anchor || "");
    if (byHref[key]) byHref[key].push(n.id);
    else byHref[key] = [n.id];
  });

  var strengths = [];
  edges.forEach(function (e, i) {
    if (!Array.isArray(e) || e.length < 3) {
      fail(hub, file, "edge " + i + " is not [from, to, strength]");
      return;
    }
    if (e[0] === e[1]) fail(hub, file, "self-loop on " + e[0]);
    if (!ids[e[0]]) fail(hub, file, "edge " + i + " references unknown node " + e[0]);
    if (!ids[e[1]]) fail(hub, file, "edge " + i + " references unknown node " + e[1]);
    var s = Number(e[2]);
    strengths.push(s);
    if (!(s >= 4 && s <= 9) && !LEGACY_STRENGTH[hub]) {
      fail(hub, file, "edge " + i + " strength " + s + " is outside 4-9 (invisible at the default threshold)");
    }
  });

  summary.push({
    hub: hub,
    file: file,
    tuples: usesTuples,
    nodes: nodes.length,
    edges: edges.length,
    minStrength: strengths.length ? Math.min.apply(Math, strengths) : null,
    maxStrength: strengths.length ? Math.max.apply(Math, strengths) : null
  });
}

console.log("Validating knowledge-graph data...\n");

HUBS.forEach(function (hub) {
  console.log("[" + hub + "]");
  ["kg-data.js", "mkg-data.js"].forEach(function (f) {
    var before = problems.length;
    checkGraph(hub, f);
    var full = path.join(ROOT, hub, "tools", f);
    if (!fs.existsSync(full)) {
      console.log("  - " + f + " not present");
      return;
    }
    console.log("  " + (problems.length === before ? "\u2713" : "\u2717") + " " + f);
  });
  console.log("");
});

console.log("Graph summary:");
summary.forEach(function (s) {
  console.log(
    "  " + s.hub + "/" + s.file + " — " + s.nodes + " nodes, " + s.edges +
    " edges, strength " + s.minStrength + "-" + s.maxStrength +
    (s.tuples ? "  (tuple form — normalised by the engine)" : "")
  );
});

if (problems.length === 0) {
  console.log("\nAll graph data valid! \u2713");
  process.exit(0);
}

console.log("\n" + problems.length + " problem(s):");
problems.slice(0, 60).forEach(function (p) {
  console.error("  \u2717 " + p);
});
if (problems.length > 60) {
  console.error("  \u2026 and " + (problems.length - 60) + " more");
}
process.exit(CHECK ? 1 : 0);
