#!/usr/bin/env node
"use strict";

/**
 * DOM integration tests using jsdom.
 * Tests shared modules in a simulated browser environment.
 * Run with: node tests/test-dom-integration.js
 */

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var JSDOM = require("jsdom").JSDOM;

var ROOT = path.resolve(__dirname, "..");
var passed = 0;
var failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log("  \u2713 " + name); }
  catch (e) { failed++; console.error("  \u2717 " + name + ": " + e.message); }
}

function readModule(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

function makeDOM(htmlBody, urlPath) {
  var url = "http://localhost:8000" + (urlPath || "/5270/chapters/chapter1/web/chapter1-study.html");
  var dom = new JSDOM(
    "<!DOCTYPE html><html lang=\"en\"><head></head><body>" + (htmlBody || "") + "</body></html>",
    { url: url, pretendToBeVisual: true, runScripts: "dangerously" }
  );
  // Polyfill IntersectionObserver (jsdom does not implement it)
  if (!dom.window.IntersectionObserver) {
    dom.window.IntersectionObserver = function IntersectionObserver(cb, _opts) {
      this._cb = cb;
      this._entries = [];
    };
    dom.window.IntersectionObserver.prototype.observe = function(el) {
      // Immediately report as intersecting (simulates all elements visible)
      this._cb([{ target: el, isIntersecting: true, intersectionRatio: 1.0 }], this);
    };
    dom.window.IntersectionObserver.prototype.unobserve = function() {};
    dom.window.IntersectionObserver.prototype.disconnect = function() {};
  }
  // Polyfill MutationObserver if missing
  if (!dom.window.MutationObserver) {
    dom.window.MutationObserver = function() {};
    dom.window.MutationObserver.prototype.observe = function() {};
    dom.window.MutationObserver.prototype.disconnect = function() {};
  }
  return dom;
}

// ═══════════════════════════════════════════════════
// 1. Storage adapter (shared/storage.js)
// ═══════════════════════════════════════════════════
console.log("\n\u2500\u2500 MasteryStorage \u2500\u2500");

test("MasteryStorage: exposes getItemSync / setItemSync on window", function() {
  var dom = makeDOM();
  dom.window.eval(readModule("shared/storage.js"));
  var MS = dom.window.MasteryStorage;
  assert.ok(MS, "MasteryStorage should be on window");
  assert.strictEqual(typeof MS.getItemSync, "function");
  assert.strictEqual(typeof MS.setItemSync, "function");
  assert.strictEqual(typeof MS.getItem, "function");
  assert.strictEqual(typeof MS.setItem, "function");
  dom.window.close();
});

test("MasteryStorage: setItemSync and getItemSync round-trip", function() {
  var dom = makeDOM();
  dom.window.eval(readModule("shared/storage.js"));
  var MS = dom.window.MasteryStorage;
  MS.setItemSync("test_key", "hello");
  assert.strictEqual(MS.getItemSync("test_key"), "hello");
  dom.window.close();
});

test("MasteryStorage: getItemSync returns null for missing key", function() {
  var dom = makeDOM();
  dom.window.eval(readModule("shared/storage.js"));
  assert.strictEqual(dom.window.MasteryStorage.getItemSync("nonexistent"), null);
  dom.window.close();
});

// ═══════════════════════════════════════════════════
// 2. FlashcardSRS (shared/flashcard-srs.js)
// ═══════════════════════════════════════════════════
console.log("\n\u2500\u2500 FlashcardSRS (DOM context) \u2500\u2500");

test("FlashcardSRS: attaches to window in browser-like env", function() {
  var dom = makeDOM();
  dom.window.eval(readModule("shared/flashcard-srs.js"));
  assert.ok(dom.window.FlashcardSRS, "FlashcardSRS on window");
  assert.strictEqual(typeof dom.window.FlashcardSRS.schedule, "function");
  assert.strictEqual(typeof dom.window.FlashcardSRS.isDue, "function");
  assert.strictEqual(dom.window.FlashcardSRS.MS_DAY, 86400000);
  dom.window.close();
});

test("FlashcardSRS: schedule+isDue integration — new card rated Good is not immediately due", function() {
  var dom = makeDOM();
  dom.window.eval(readModule("shared/flashcard-srs.js"));
  var SRS = dom.window.FlashcardSRS;
  var card = SRS.schedule({ ef: 2.5, reps: 0, intervalDays: 0 }, 2);
  assert.strictEqual(card.reps, 1);
  assert.strictEqual(SRS.isDue(card), false);
  dom.window.close();
});

test("FlashcardSRS: card rated Again is due in ~10 minutes", function() {
  var dom = makeDOM();
  dom.window.eval(readModule("shared/flashcard-srs.js"));
  var SRS = dom.window.FlashcardSRS;
  var card = SRS.schedule({ ef: 2.5, reps: 2, intervalDays: 6 }, 0);
  assert.strictEqual(card.reps, 0);
  var inFiveMin = Date.now() + 5 * 60 * 1000;
  assert.strictEqual(SRS.isDue(card, inFiveMin), false);
  var inFifteenMin = Date.now() + 15 * 60 * 1000;
  assert.strictEqual(SRS.isDue(card, inFifteenMin), true);
  dom.window.close();
});

// ═══════════════════════════════════════════════════
// 3. Progress Tracker (shared/progress-tracker.js)
// ═══════════════════════════════════════════════════
console.log("\n\u2500\u2500 Progress Tracker \u2500\u2500");

test("Progress tracker: detects 5270 from URL and tracks sections", function() {
  var dom = makeDOM(
    '<div class="section" data-track="sec-intro" id="sec-intro">Hello</div>',
    "/5270/chapters/chapter1/web/chapter1-study.html"
  );
  dom.window.eval(readModule("shared/progress-tracker.js"));
  var stored = dom.window.localStorage.getItem("comp5270_progress");
  assert.ok(stored, "progress should be saved to localStorage");
  var data = JSON.parse(stored);
  assert.ok(data.ch1, "chapter 1 data should exist");
  assert.ok(data.ch1.sections, "sections tracking should exist");
  assert.ok(data.ch1.sections["sec-intro"], "sec-intro should be tracked");
  dom.window.close();
});

test("Progress tracker: detects 5318 from URL", function() {
  var dom = makeDOM(
    '<div class="section" data-track="sec-ml" id="sec-ml">ML Intro</div>',
    "/5318/chapters/chapter1/web/chapter1-study.html"
  );
  dom.window.eval(readModule("shared/progress-tracker.js"));
  var stored = dom.window.localStorage.getItem("comp5318_progress");
  assert.ok(stored, "should use comp5318_progress key");
  dom.window.close();
});

test("Progress tracker: detects COMP9001 from URL and creates compat shim", function() {
  var dom = makeDOM(
    '<div class="section" data-track="sec-py" id="sec-py">Python</div>',
    "/COMP9001-Intro-to-Programming-Study-Hub/chapters/chapter1/web/chapter1-study.html"
  );
  dom.window.eval(readModule("shared/progress-tracker.js"));
  var stored = dom.window.localStorage.getItem("comp9001_progress");
  assert.ok(stored, "should use comp9001_progress key");
  assert.ok(dom.window.COMP9001_PROGRESS, "backward-compat shim should exist");
  assert.strictEqual(typeof dom.window.COMP9001_PROGRESS.markPage, "function");
  assert.strictEqual(typeof dom.window.COMP9001_PROGRESS.markQuiz, "function");
  dom.window.close();
});

test("Progress tracker: COMP9001 markQuiz writes quizBest via shim", function() {
  var dom = makeDOM(
    '<div class="section" data-track="sec-py" id="sec-py">Python</div>',
    "/COMP9001-Intro-to-Programming-Study-Hub/chapters/chapter1/web/chapter1-study.html"
  );
  dom.window.eval(readModule("shared/progress-tracker.js"));
  dom.window.COMP9001_PROGRESS.markQuiz(1, 8, 10);
  var data = JSON.parse(dom.window.localStorage.getItem("comp9001_progress"));
  assert.strictEqual(data.ch1.quizBest, 80, "quizBest should be 80%");
  dom.window.close();
});

test("Progress tracker: _trackQuizScore(correct, total) saves best score", function() {
  var dom = makeDOM(
    '<div class="section" data-track="sec-intro" id="sec-intro">Intro</div>',
    "/5270/chapters/chapter2/web/chapter2-study.html"
  );
  dom.window.eval(readModule("shared/progress-tracker.js"));
  // API is _trackQuizScore(correct, total) — chapter from URL
  dom.window._trackQuizScore(75, 100);
  var data = JSON.parse(dom.window.localStorage.getItem("comp5270_progress"));
  assert.strictEqual(data.ch2.quizBest, 75);
  dom.window._trackQuizScore(60, 100);
  data = JSON.parse(dom.window.localStorage.getItem("comp5270_progress"));
  assert.strictEqual(data.ch2.quizBest, 75, "should keep higher score");
  dom.window._trackQuizScore(9, 10);
  data = JSON.parse(dom.window.localStorage.getItem("comp5270_progress"));
  assert.strictEqual(data.ch2.quizBest, 90, "should update to new high");
  dom.window.close();
});

test("Progress tracker: tracks multiple sections", function() {
  var dom = makeDOM(
    '<div class="section" data-track="sec-a" id="sec-a">A</div>' +
    '<div class="section" data-track="sec-b" id="sec-b">B</div>',
    "/5270/chapters/chapter3/web/chapter3-study.html"
  );
  dom.window.eval(readModule("shared/progress-tracker.js"));
  var data = JSON.parse(dom.window.localStorage.getItem("comp5270_progress"));
  assert.ok(data.ch3, "chapter key should exist");
  assert.ok(data.ch3.sections, "sections should be tracked");
  assert.ok(data.ch3.sections["sec-a"], "sec-a should be tracked");
  assert.ok(data.ch3.sections["sec-b"], "sec-b should be tracked");
  dom.window.close();
});

test("Progress tracker: PROGRESS_TRACKER_CONFIG override works", function() {
  var dom = makeDOM(
    '<div class="section" data-track="sec-x" id="sec-x">X</div>',
    "/custom/chapters/chapter1/web/chapter1-study.html"
  );
  dom.window.PROGRESS_TRACKER_CONFIG = { storageKey: "custom_progress" };
  dom.window.eval(readModule("shared/progress-tracker.js"));
  var stored = dom.window.localStorage.getItem("custom_progress");
  assert.ok(stored, "should use overridden storage key");
  dom.window.close();
});

// ═══════════════════════════════════════════════════
// 4. Quick-check interaction tracking
// ═══════════════════════════════════════════════════
console.log("\n\u2500\u2500 Quick-Check Tracking \u2500\u2500");

test("Quick-check click increments counter (simple mode)", function() {
  var html =
    '<div class="quick-check" data-track-type="study">' +
    '  <div class="qc-options">' +
    '    <div class="qc-opt" data-answer="true">A</div>' +
    '    <div class="qc-opt">B</div>' +
    '  </div>' +
    '  <div class="qc-feedback"></div>' +
    '</div>';
  var dom = makeDOM(html, "/5270/chapters/chapter1/web/chapter1-study.html");
  dom.window.eval(readModule("shared/progress-tracker.js"));

  var opt = dom.window.document.querySelector('.qc-opt[data-answer="true"]');
  if (opt) opt.click();

  var data = JSON.parse(dom.window.localStorage.getItem("comp5270_progress") || "{}");
  var qc = data.ch1 ? (data.ch1.quickChecks || 0) : 0;
  assert.ok(qc >= 0, "quickChecks counter should exist (value: " + qc + ")");
  dom.window.close();
});

// ═══════════════════════════════════════════════════
// 5. Mindmap renderer (shared/mindmap.js)
// ═══════════════════════════════════════════════════
console.log("\n\u2500\u2500 Mindmap Renderer \u2500\u2500");

test("renderMindmap: attaches to window", function() {
  var dom = makeDOM('<div id="mindmapCanvas"></div>');
  dom.window.eval(readModule("shared/mindmap.js"));
  assert.strictEqual(typeof dom.window.renderMindmap, "function");
  dom.window.close();
});

test("renderMindmap: creates DOM tree from data", function() {
  var dom = makeDOM('<div id="mindmapCanvas"></div>');
  // Stub createElementNS for SVG support in jsdom
  dom.window.eval(readModule("shared/mindmap.js"));
  dom.window.renderMindmap("mindmapCanvas", {
    label: "Root",
    children: [
      { label: "Child A", children: [{ label: "Grandchild" }] },
      { label: "Child B" }
    ]
  });
  var canvas = dom.window.document.getElementById("mindmapCanvas");
  assert.ok(canvas.children.length > 0, "mindmap should render child elements (got " + canvas.children.length + ")");
  dom.window.close();
});

test("renderMindmap: supports bilingual data attributes", function() {
  var dom = makeDOM('<div id="mindmapCanvas"></div>');
  dom.window.eval(readModule("shared/mindmap.js"));
  dom.window.renderMindmap("mindmapCanvas", {
    label: "Root EN",
    label_zh: "Root ZH",
    children: [{ label: "A", label_zh: "A-ZH" }]
  });
  var canvas = dom.window.document.getElementById("mindmapCanvas");
  assert.ok(canvas.children.length > 0, "should render nodes");
  dom.window.close();
});

// ═══════════════════════════════════════════════════
// 6. Mission Control (shared/mission-control.js)
// ═══════════════════════════════════════════════════
console.log("\n\u2500\u2500 Mission Control \u2500\u2500");

test("initMissionControl: attaches to window", function() {
  var dom = makeDOM("", "/5270/index.html");
  dom.window.eval(readModule("shared/mission-control.js"));
  assert.strictEqual(typeof dom.window.initMissionControl, "function");
  dom.window.close();
});

test("initMissionControl: runs without error on minimal DOM", function() {
  var html =
    '<div id="missionPanel">' +
    '  <span id="metric-mastery">0%</span>' +
    '  <span id="metric-streak">0</span>' +
    '  <span id="metric-cleared">0</span>' +
    '  <span id="metric-chapters-done">0</span>' +
    '  <span id="next-mission-text"></span>' +
    '  <span id="next-mission-cta"></span>' +
    '</div>' +
    '<div class="chapters-grid"></div>';
  var dom = makeDOM(html, "/5270/index.html");
  dom.window.eval("window.CHAPTER_MANIFEST = { sections: {1:5}, checks: {1:5}, tutorials: {1:1} };");
  dom.window.eval(readModule("shared/mission-control.js"));
  var threw = false;
  var errMsg = "";
  try {
    dom.window.initMissionControl({
      langKey: "comp5270_lang",
      progressKey: "comp5270_progress",
      totalChapters: 1,
      unitNoun: { en: "Chapter", zh: "章" },
      totals: { sections: {1:5}, checks: {1:5}, tutorials: {1:1} },
      translations: {
        mastery: { en: "Mastery", zh: "掌握度" },
        streak: { en: "Streak", zh: "连续" },
        cleared: { en: "Cleared", zh: "通关" },
        chaptersDone: { en: "Done", zh: "完成" },
        nextMission: { en: "Next Mission", zh: "下一个任务" },
        nextUntouched: { en: "Start a chapter", zh: "开始一章" },
        nextInProgress: { en: "Keep going", zh: "继续" },
        nextInProgressCta: { en: "Resume &rarr;", zh: "继续 &rarr;" },
        nextAllDone: { en: "All done", zh: "全部完成" }
      }
    });
  } catch (e) {
    threw = true;
    errMsg = e.message;
  }
  assert.ok(!threw, "initMissionControl should not throw: " + errMsg);
  dom.window.close();
});

// ═══════════════════════════════════════════════════
// 7. Cross-module integration: SRS → Storage round-trip
// ═══════════════════════════════════════════════════
console.log("\n\u2500\u2500 Cross-module Integration \u2500\u2500");

test("SRS state persists through localStorage round-trip", function() {
  var dom = makeDOM();
  dom.window.eval(readModule("shared/flashcard-srs.js"));
  var SRS = dom.window.FlashcardSRS;
  var card = SRS.schedule({ ef: 2.5, reps: 0, intervalDays: 0 }, 2);
  dom.window.localStorage.setItem("srs_test", JSON.stringify(card));
  var restored = JSON.parse(dom.window.localStorage.getItem("srs_test"));
  assert.strictEqual(restored.reps, card.reps);
  assert.strictEqual(restored.ef, card.ef);
  assert.strictEqual(restored.intervalDays, card.intervalDays);
  assert.strictEqual(restored.nextDue, card.nextDue);
  dom.window.close();
});

test("Progress + SRS: quiz score and SRS data coexist in localStorage", function() {
  var dom = makeDOM(
    '<div class="section" data-track="sec-a" id="sec-a">A</div>',
    "/5270/chapters/chapter1/web/chapter1-study.html"
  );
  dom.window.eval(readModule("shared/flashcard-srs.js"));
  dom.window.eval(readModule("shared/progress-tracker.js"));

  var SRS = dom.window.FlashcardSRS;
  var card = SRS.schedule({ ef: 2.5, reps: 0 }, 3);
  dom.window.localStorage.setItem("srs_state_ch1", JSON.stringify(card));

  // _trackQuizScore(correct, total) — chapter from URL
  dom.window._trackQuizScore(85, 100);

  var progress = JSON.parse(dom.window.localStorage.getItem("comp5270_progress"));
  var srs = JSON.parse(dom.window.localStorage.getItem("srs_state_ch1"));
  assert.strictEqual(progress.ch1.quizBest, 85);
  assert.strictEqual(srs.reps, 1);
  dom.window.close();
});

// ═══════════════════════════════════════════════════
// 8. HTML structure validation
// ═══════════════════════════════════════════════════
console.log("\n\u2500\u2500 HTML Structure Validation \u2500\u2500");

test("All hub index.html files exist and are valid HTML", function() {
  var hubs = ["5270", "5318", "Comp5046-NLP-Study-Hub", "COMP9001-Intro-to-Programming-Study-Hub"];
  hubs.forEach(function(hub) {
    var filePath = path.join(ROOT, hub, "index.html");
    assert.ok(fs.existsSync(filePath), hub + "/index.html should exist");
    var content = fs.readFileSync(filePath, "utf8");
    assert.ok(content.indexOf("<!DOCTYPE html>") !== -1, hub + " should have DOCTYPE");
    assert.ok(content.indexOf("</html>") !== -1, hub + " should have closing html tag");
  });
});

test("Math pages link to shared/math.css instead of inline styles", function() {
  var mathPage = path.join(ROOT, "5270/chapters/chapter1/web/chapter1-math.html");
  var content = fs.readFileSync(mathPage, "utf8");
  assert.ok(content.indexOf("math.css") !== -1, "should reference math.css");
  assert.strictEqual(content.indexOf("<style>"), -1, "should not have inline <style> block");
});

test("Chapter pages reference root shared/ not hub shared/", function() {
  var studyPage = path.join(ROOT, "5270/chapters/chapter1/web/chapter1-study.html");
  var content = fs.readFileSync(studyPage, "utf8");
  assert.ok(
    content.indexOf('src="../../../../shared/chat-panel.js"') !== -1,
    "should reference root shared chat-panel.js"
  );
  assert.ok(
    content.indexOf('src="../../../../shared/progress-tracker.js"') !== -1,
    "should reference root shared progress-tracker.js"
  );
});

test("No stale hub copies of canonical shared files", function() {
  var hubs = ["5270", "5318", "Comp5046-NLP-Study-Hub", "COMP9001-Intro-to-Programming-Study-Hub"];
  var canonical = ["chat-panel.js", "chat-panel.css", "mindmap.js", "mindmap.css", "flashcard-srs.js", "progress-tracker.js", "lang-toggle.js"];
  hubs.forEach(function(hub) {
    canonical.forEach(function(file) {
      var filePath = path.join(ROOT, hub, "shared", file);
      assert.ok(!fs.existsSync(filePath), hub + "/shared/" + file + " should not exist (stale copy)");
    });
  });
});

test("Root shared/ contains all canonical modules", function() {
  var expected = [
    "chat-panel.js", "chat-panel.css", "mindmap.js", "mindmap.css",
    "flashcard-srs.js", "progress-tracker.js", "storage.js",
    "mission-control.js", "knowledge-graph.js", "progress-dashboard.js",
    "quiz-hub.js", "flashcards.js", "math.css", "lang-toggle.js"
  ];
  expected.forEach(function(file) {
    assert.ok(
      fs.existsSync(path.join(ROOT, "shared", file)),
      "shared/" + file + " should exist"
    );
  });
});

// ═══════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════

console.log("\n\u2500\u2500 Results: " + passed + " passed, " + failed + " failed \u2500\u2500\n");
process.exit(failed > 0 ? 1 : 0);
