#!/usr/bin/env node
"use strict";

/**
 * Site-reset tests (shared/site-reset.js).
 *
 * The purge is the only code path that is allowed to delete a learner's data,
 * so it has to be precise: remove everything this app wrote, and nothing else
 * on the origin.
 *
 * Run with: node tests/test-site-reset.js
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

var SRC = fs.readFileSync(path.join(ROOT, "shared", "site-reset.js"), "utf8");

function makeDOM(url, seed) {
  var dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: url,
    runScripts: "dangerously",
    pretendToBeVisual: true
  });
  var win = dom.window;
  Object.keys(seed || {}).forEach(function (k) {
    win.localStorage.setItem(k, seed[k]);
  });
  // jsdom ships no IndexedDB; the module must degrade instead of throwing.
  win.eval(SRC);
  return dom;
}

console.log("\n\u2500\u2500 SiteReset \u2500\u2500");

test("exposes inspect / purgeAll / reloadFresh", function () {
  var dom = makeDOM("http://localhost:8000/index.html");
  ["inspect", "purgeAll", "reloadFresh"].forEach(function (k) {
    assert.strictEqual(typeof dom.window.SiteReset[k], "function", k + " missing");
  });
  dom.window.close();
});

test("inspect lists only this app's keys", function () {
  var dom = makeDOM("http://localhost:8000/index.html", {
    comp5047_progress: "{}",
    comp5047_lang: "zh",
    elec5620_flashcards: "{}",
    info6007_chat_config: "{}",
    root_lang: "en",
    studyhub_progress: "{}",
    srs_state_ch1: "{}",
    // Not ours:
    some_other_site_key: "keep me",
    theme: "dark"
  });
  return dom.window.SiteReset.inspect().then(function (state) {
    var keys = state.localStorage.slice().sort();
    assert.deepStrictEqual(keys, [
      "comp5047_lang",
      "comp5047_progress",
      "elec5620_flashcards",
      "info6007_chat_config",
      "root_lang",
      "srs_state_ch1",
      "studyhub_progress"
    ]);
    dom.window.close();
  });
});

test("purgeAll removes app keys and preserves foreign keys", function () {
  var dom = makeDOM("http://localhost:8000/index.html", {
    comp5270_progress: "{}",
    comp5270_lang: "en",
    root_lang: "zh",
    custom_progress: "{}",
    srs_test: "{}",
    keep_this: "unrelated"
  });
  return dom.window.SiteReset.purgeAll().then(function (result) {
    assert.strictEqual(dom.window.localStorage.getItem("keep_this"), "unrelated",
      "a key belonging to another app on the same origin was deleted");
    ["comp5270_progress", "comp5270_lang", "root_lang", "custom_progress", "srs_test"]
      .forEach(function (k) {
        assert.strictEqual(dom.window.localStorage.getItem(k), null, k + " survived the purge");
      });
    assert.strictEqual(result.removed.localStorage.length, 5);
    dom.window.close();
  });
});

test("purgeAll tolerates a missing IndexedDB and Cache Storage", function () {
  var dom = makeDOM("http://localhost:8000/index.html", { comp9001_progress: "{}" });
  assert.strictEqual(dom.window.indexedDB, undefined, "jsdom unexpectedly has IndexedDB");
  assert.strictEqual(dom.window.caches, undefined, "jsdom unexpectedly has Cache Storage");
  return dom.window.SiteReset.purgeAll().then(function (result) {
    assert.deepStrictEqual(result.removed.databases, []);
    assert.deepStrictEqual(result.removed.caches, []);
    assert.strictEqual(dom.window.localStorage.getItem("comp9001_progress"), null);
    dom.window.close();
  });
});

test("?fresh=1 triggers a purge and removes the parameter", function () {
  var dom = makeDOM("http://localhost:8000/COMP5047/index.html?fresh=1", {
    comp5047_progress: "{}"
  });
  // reloadFresh() calls location.replace(); jsdom will not navigate but the
  // purge runs first, which is the part that matters.
  return new Promise(function (resolve) {
    dom.window.setTimeout(resolve, 30);
  }).then(function () {
    assert.strictEqual(dom.window.localStorage.getItem("comp5047_progress"), null,
      "?fresh=1 did not purge");
    dom.window.close();
  });
});

test("?fresh=0 and no parameter leave state alone", function () {
  var dom = makeDOM("http://localhost:8000/COMP5047/index.html?fresh=0", {
    comp5047_progress: "{\"ch1\":1}"
  });
  return new Promise(function (resolve) {
    dom.window.setTimeout(resolve, 30);
  }).then(function () {
    assert.strictEqual(dom.window.localStorage.getItem("comp5047_progress"), "{\"ch1\":1}");
    dom.window.close();
  });
});

test("key patterns cover every namespace the app writes", function () {
  var dom = makeDOM("http://localhost:8000/index.html");
  var patterns = dom.window.SiteReset.keyPatterns;
  [
    "comp5270_progress", "comp5318_lang", "comp5046_flashcards", "comp9001_lang",
    "comp9123_progress", "comp5047_lang", "comp5618_chat_config",
    "elec5620_progress", "info5995_flashcards", "info6007_lang",
    "root_lang", "studyhub_progress", "custom_progress", "srs_state_ch1"
  ].forEach(function (key) {
    assert.ok(
      patterns.some(function (re) { return re.test(key); }),
      key + " is not matched by any purge pattern — it would survive a reset"
    );
  });
  ["keep_this", "theme", "some_other_site_key"].forEach(function (key) {
    assert.ok(
      !patterns.some(function (re) { return re.test(key); }),
      key + " is matched by a purge pattern — the purge is too broad"
    );
  });
  dom.window.close();
});

test("service worker purges every cache on activate and precaches the module", function () {
  var sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
  assert.ok(sw.indexOf('"shared/site-reset.js"') !== -1, "site-reset.js is not precached");
  // Precache entries must stay relative to the worker so the site survives
  // being hosted under a sub-path.
  var list = sw.slice(sw.indexOf("var PRECACHE_URLS"), sw.indexOf("];", sw.indexOf("var PRECACHE_URLS")));
  assert.ok(!/\n\s*"\//.test(list), "a precache entry is absolute — sub-path hosting would break");
  var activate = sw.slice(sw.indexOf('addEventListener("activate"'));
  assert.ok(
    /cacheNames\.map\(function\s*\(name\)\s*\{\s*return caches\.delete\(name\);/.test(activate),
    "activate() no longer deletes every cache"
  );
  assert.ok(activate.indexOf("cache.addAll(PRECACHE_URLS)") !== -1,
    "activate() deletes the caches but never refills the precache");
});

test("dashboard reset uses the full purge", function () {
  var js = fs.readFileSync(path.join(ROOT, "shared", "progress-dashboard.js"), "utf8");
  assert.ok(js.indexOf("window.SiteReset.purgeAll") !== -1,
    "the dashboard reset button still only clears two keys");
  assert.ok(js.indexOf("localStorage.removeItem(PROGRESS_KEY)") !== -1,
    "the two-key fallback was removed without a replacement guard");
});

console.log("\n\u2500\u2500 Results: " + passed + " passed, " + failed + " failed \u2500\u2500\n");
process.exit(failed > 0 ? 1 : 0);
