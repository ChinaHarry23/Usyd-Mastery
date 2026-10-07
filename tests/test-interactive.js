#!/usr/bin/env node
"use strict";

/**
 * Interactive widget library tests (shared/interactive.js).
 *
 * Every study hub imports this library, so the declarative mount path, the
 * canvas stepper API, and the language-toggle refresh all need coverage.
 *
 * Run with: node tests/test-interactive.js
 */

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var JSDOM = require("jsdom").JSDOM;

var ROOT = path.resolve(__dirname, "..");
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

var IX_SRC = fs.readFileSync(path.join(ROOT, "shared", "interactive.js"), "utf8");

var FIXTURE = [
  "<!DOCTYPE html><html lang=\"en\"><body>",
  "<div data-ix=\"sequence\" data-ix-src=\"#c-seq\"></div>",
  "<script type=\"application/json\" id=\"c-seq\">",
  JSON.stringify({ title: "Order it", steps: ["one", "two", "three", "four"] }),
  "</scr" + "ipt>",
  "<div data-ix=\"matcher\" data-ix-src=\"#c-match\"></div>",
  "<script type=\"application/json\" id=\"c-match\">",
  JSON.stringify({ pairs: [["alpha", "1"], ["beta", "2"]] }),
  "</scr" + "ipt>",
  "<div data-ix=\"timeline\" data-ix-src=\"#c-time\"></div>",
  "<script type=\"application/json\" id=\"c-time\">",
  JSON.stringify({
    events: [
      { label: "t0", title: "Start", detail: "first" },
      { label: "t1", title: "Middle", detail: "second" },
      { label: "t2", title: "End", detail: "third" }
    ]
  }),
  "</scr" + "ipt>",
  "<div data-ix=\"deck\" data-ix-src=\"#c-deck\"></div>",
  "<script type=\"application/json\" id=\"c-deck\">",
  JSON.stringify({ cards: [{ front: "Front", back: "Back" }] }),
  "</scr" + "ipt>",
  "<div data-ix=\"race\" data-ix-src=\"#c-race\"></div>",
  "<script type=\"application/json\" id=\"c-race\">",
  JSON.stringify({ rows: [{ name: "n", value: 8 }, { name: "log n", value: 3 }] }),
  "</scr" + "ipt>",
  "<div data-ix=\"pipeline\" data-ix-src=\"#c-pipe\"></div>",
  "<script type=\"application/json\" id=\"c-pipe\">",
  JSON.stringify({ nodes: [{ label: "Sense", note: "input" }, { label: "Act", note: "output" }] }),
  "</scr" + "ipt>",
  "<div data-ix=\"hotspot\" data-ix-src=\"#c-hot\"></div>",
  "<script type=\"application/json\" id=\"c-hot\">",
  JSON.stringify({
    svg: "<svg viewBox=\"0 0 100 50\"><rect width=\"100\" height=\"50\"/></svg>",
    points: [{ x: 20, y: 40, label: "Sensor", detail: "reads the world" }]
  }),
  "</scr" + "ipt>",
  "<div id=\"stepMount\"></div>",
  "<div data-ix=\"sequence\"></div>",
  "</body></html>"
].join("\n");

function makeDOM() {
  var dom = new JSDOM(FIXTURE, {
    url: "http://localhost:8000/9001Py/chapters/chapter1/web/chapter1-study.html",
    pretendToBeVisual: true,
    runScripts: "dangerously"
  });
  if (!dom.window.IntersectionObserver) {
    dom.window.IntersectionObserver = function () {};
    dom.window.IntersectionObserver.prototype.observe = function () {};
    dom.window.IntersectionObserver.prototype.disconnect = function () {};
  }
  return dom;
}

function load(dom) {
  dom.window.eval(IX_SRC);
}

function ready(dom) {
  return new Promise(function (resolve) {
    if (dom.window.document.readyState !== "loading") {
      setTimeout(resolve, 0);
      return;
    }
    dom.window.document.addEventListener("DOMContentLoaded", function () {
      setTimeout(resolve, 0);
    });
  });
}

async function main() {
  console.log("\n\u2500\u2500 Interactive library \u2500\u2500");

  var dom = makeDOM();
  await ready(dom);
  load(dom);
  await ready(dom);
  var win = dom.window;
  var doc = win.document;

  // Let the race widget commit its animated widths.
  await new Promise(function (resolve) {
    win.requestAnimationFrame(function () {
      win.requestAnimationFrame(resolve);
    });
  });

  test("exposes the widget API on window", function () {
    assert.ok(win.Interactive, "Interactive should be on window");
    [
      "stepper", "sequence", "matcher", "timeline", "hotspot",
      "deck", "race", "pipeline", "mount", "destroy", "refresh"
    ].forEach(function (key) {
      assert.strictEqual(typeof win.Interactive[key], "function", key + " should be a function");
    });
  });

  test("declaratively mounts every widget type", function () {
    ["sequence", "matcher", "timeline", "deck", "race", "pipeline", "hotspot"].forEach(function (type) {
      var node = doc.querySelector('[data-ix="' + type + '"]');
      assert.ok(node, type + " placeholder exists");
      assert.strictEqual(node.dataset.ixMounted, "1", type + " should be mounted");
      assert.ok(node.children.length > 0, type + " should render content");
      assert.ok(node.classList.contains("ix"), type + " should get the .ix shell class");
    });
  });

  test("widgets without a config are left alone", function () {
    var bare = Array.prototype.filter.call(
      doc.querySelectorAll('[data-ix="sequence"]'),
      function (n) { return !n.getAttribute("data-ix-src"); }
    )[0];
    assert.ok(bare, "bare placeholder exists");
    assert.notStrictEqual(bare.dataset.ixMounted, "1");
  });

  test("sequence widget fills slots and validates order", function () {
    var node = doc.querySelector('[data-ix="sequence"]');
    var chips = node.querySelectorAll(".ix-pool .ix-chip");
    assert.strictEqual(chips.length, 4, "four steps should start in the pool");
    var check = Array.prototype.filter.call(node.querySelectorAll(".ix-btn"), function (b) {
      return /Check|\u68c0\u67e5/.test(b.textContent);
    })[0];
    assert.ok(check, "check button exists");
    // Checking an empty sequence reports incompleteness rather than throwing.
    check.click();
    assert.ok(node.querySelector(".ix-feedback").textContent.length > 0, "feedback shown");
    // Place every step, then check.
    while (node.querySelectorAll(".ix-pool .ix-chip").length) {
      node.querySelector(".ix-pool .ix-chip").click();
    }
    assert.strictEqual(node.querySelectorAll(".ix-slots .ix-slot").length, 4);
    check.click();
    var rows = node.querySelectorAll(".ix-slots .ix-slot");
    var marked = 0;
    Array.prototype.forEach.call(rows, function (row) {
      if (row.classList.contains("right") || row.classList.contains("wrong")) marked++;
    });
    assert.strictEqual(marked, 4, "every slot should be graded");
  });

  test("sequence chips return to the pool when clicked in a slot", function () {
    var node = doc.querySelector('[data-ix="sequence"]');
    var before = node.querySelectorAll(".ix-pool .ix-chip").length;
    node.querySelector(".ix-slots .ix-chip").click();
    assert.strictEqual(node.querySelectorAll(".ix-pool .ix-chip").length, before + 1);
  });

  test("matcher widget pairs correct items and rejects wrong ones", function () {
    var node = doc.querySelector('[data-ix="matcher"]');
    var left = node.querySelectorAll(".ix-match-col")[0].children;
    var right = node.querySelectorAll(".ix-match-col")[1].children;
    assert.strictEqual(left.length, 2);
    assert.strictEqual(right.length, 2);

    // Wrong pairing first.
    left[0].click();
    var wrongTarget = right[0].dataset.pair === left[0].dataset.pair ? right[1] : right[0];
    wrongTarget.click();
    assert.ok(node.querySelector(".ix-feedback").textContent.length > 0, "mismatch feedback");

    // Correct pairing.
    left[0].click();
    var okTarget = right[0].dataset.pair === left[0].dataset.pair ? right[0] : right[1];
    okTarget.click();
    assert.ok(left[0].classList.contains("paired"), "left item paired");
    assert.ok(okTarget.classList.contains("paired"), "right item paired");
  });

  test("timeline advances through events and updates its caption", function () {
    var node = doc.querySelector('[data-ix="timeline"]');
    assert.strictEqual(node.querySelectorAll(".ix-mark").length, 3);
    var next = Array.prototype.filter.call(node.querySelectorAll(".ix-btn"), function (b) {
      return b.textContent === "\u25B6";
    })[0];
    next.click();
    assert.ok(/Middle/.test(node.querySelector(".ix-caption").textContent), "caption advanced");
    node.querySelectorAll(".ix-mark")[2].click();
    assert.ok(/End/.test(node.querySelector(".ix-caption").textContent), "marker jump works");
  });

  test("deck cards flip on click", function () {
    var card = doc.querySelector('[data-ix="deck"] .ix-flip');
    assert.ok(!card.classList.contains("flipped"));
    card.click();
    assert.ok(card.classList.contains("flipped"));
    assert.strictEqual(card.getAttribute("aria-pressed"), "true");
  });

  test("race widget scales bars against the maximum", function () {
    var fills = doc.querySelectorAll('[data-ix="race"] .ix-race-fill');
    assert.strictEqual(fills.length, 2);
    var widths = Array.prototype.map.call(fills, function (f) {
      return parseFloat(f.style.width) || 0;
    });
    assert.ok(widths[0] > widths[1], "larger value renders a wider bar");
    assert.ok(Math.abs(widths[0] - 100) < 1, "largest value fills the track");
  });

  test("race widget accepts programmatic updates", function () {
    var api = win.Interactive.race("raceProbe", { rows: [] });
    assert.strictEqual(api, null, "empty row list is a no-op");
  });

  test("pipeline widget lights nodes as it advances", function () {
    var node = doc.querySelector('[data-ix="pipeline"]');
    var next = Array.prototype.filter.call(node.querySelectorAll(".ix-btn"), function (b) {
      return b.textContent === "\u25B6";
    })[0];
    next.click();
    var nodes = node.querySelectorAll(".ix-pipe-node");
    assert.ok(nodes[0].classList.contains("live"), "first node lit");
    next.click();
    assert.ok(nodes[0].classList.contains("done"), "first node marked done");
    assert.ok(nodes[1].classList.contains("live"), "second node lit");
  });

  test("hotspot widget reveals detail on click", function () {
    var node = doc.querySelector('[data-ix="hotspot"]');
    var spot = node.querySelector(".ix-hotspot");
    assert.ok(spot, "hotspot rendered");
    spot.click();
    assert.ok(/Sensor/.test(node.querySelector(".ix-caption").textContent));
  });

  test("stepper builds a canvas stage with transport controls", function () {
    var api = win.Interactive.stepper("stepMount", {
      title: "Probe",
      height: 200,
      frames: [
        { title: "Frame one", caption: "first", draw: function (ctx, w, h, kit) { kit.clear(); } },
        { title: "Frame two", caption: "second" },
        { title: "Frame three", caption: "third" }
      ]
    });
    assert.ok(api, "stepper returns an api");
    var mount = doc.getElementById("stepMount");
    assert.ok(mount.querySelector("canvas"), "canvas created");
    assert.strictEqual(mount.querySelectorAll(".ix-dot").length, 3);
    assert.strictEqual(api.index(), 0);
    api.go(2);
    assert.strictEqual(api.index(), 2);
    assert.ok(/Frame three/.test(mount.querySelector(".ix-caption").textContent));
    api.go(99);
    assert.strictEqual(api.index(), 2, "index clamps to the last frame");
    api.go(-5);
    assert.strictEqual(api.index(), 0, "index clamps to the first frame");
  });

  test("stepper tolerates frames with no draw function", function () {
    var host = doc.createElement("div");
    host.id = "stepMount2";
    doc.body.appendChild(host);
    var api = win.Interactive.stepper("stepMount2", {
      frames: [{ title: "noop" }]
    });
    assert.ok(api, "still constructs");
    api.redraw();
  });

  test("destroy clears a widget so it can be re-mounted", function () {
    var node = doc.querySelector('[data-ix="deck"]');
    assert.strictEqual(node.dataset.ixMounted, "1");
    assert.ok(win.Interactive.destroy(node), "destroy reports work done");
    assert.strictEqual(node.dataset.ixMounted, undefined, "mount marker cleared");
    assert.strictEqual(node.children.length, 0, "content removed");
    assert.ok(!node.classList.contains("ix"), "shell class removed");
    // Re-mounting rebuilds the widget.
    win.Interactive.mount(doc);
    assert.strictEqual(node.dataset.ixMounted, "1");
    assert.ok(node.querySelector(".ix-flip"), "widget rebuilt");
  });

  test("destroy accepts an element id and reports unknown ids", function () {
    var host = doc.createElement("div");
    host.id = "destroyProbe";
    doc.body.appendChild(host);
    win.Interactive.stepper("destroyProbe", { frames: [{ title: "only" }] });
    assert.ok(host.querySelector("canvas"), "stepper built");
    assert.strictEqual(win.Interactive.destroy("destroyProbe"), true);
    assert.strictEqual(host.children.length, 0);
    assert.strictEqual(win.Interactive.destroy("doesNotExist"), false);
  });

  test("destroy tears down a running stepper without throwing", function () {
    var host = doc.createElement("div");
    host.id = "runningProbe";
    doc.body.appendChild(host);
    var api = win.Interactive.stepper("runningProbe", {
      frames: [{ title: "a" }, { title: "b" }]
    });
    api.play();
    assert.strictEqual(win.Interactive.destroy(host), true);
    // A second destroy is a no-op rather than an error.
    assert.strictEqual(win.Interactive.destroy(host), true);
  });

  test("mount is idempotent", function () {
    var node = doc.querySelector('[data-ix="deck"]');
    var before = node.children.length;
    win.Interactive.mount(doc);
    assert.strictEqual(node.children.length, before, "no duplicate render");
  });

  test("refresh survives the language toggle", function () {
    win.document.dispatchEvent(
      new win.CustomEvent("langchange", { detail: { lang: "zh" } })
    );
    win.Interactive.refresh();
    var node = doc.querySelector('[data-ix="sequence"]');
    assert.ok(node.querySelectorAll(".ix-btn").length >= 3);
  });

  test("rerender on langchange keeps widgets mounted", function () {
    load(dom); // re-evaluating must not throw
    win.Interactive.refresh();
    assert.strictEqual(doc.querySelector('[data-ix="timeline"]').dataset.ixMounted, "1");
  });

  test("labels expose both languages", function () {
    var labels = win.Interactive.labels;
    ["play", "pause", "check", "reset", "flipHint"].forEach(function (key) {
      assert.ok(labels[key], key + " label exists");
      assert.ok(labels[key].en && labels[key].zh, key + " has en + zh");
    });
  });

  test("prefers-reduced-motion is reported", function () {
    assert.strictEqual(typeof win.Interactive.reducedMotion, "boolean");
  });

  test("interactive.css wires into study-base.css", function () {
    var base = fs.readFileSync(path.join(ROOT, "shared", "study-base.css"), "utf8");
    assert.ok(
      /@import url\("\.\/interactive\.css"\)/.test(base),
      "study-base.css must import interactive.css so every hub inherits it"
    );
  });

  dom.window.close();

  console.log("\n\u2500\u2500 Results: " + passed + " passed, " + failed + " failed \u2500\u2500\n");
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(function (e) {
  console.error("test-interactive crashed:", e && e.stack ? e.stack : e);
  process.exit(2);
});
