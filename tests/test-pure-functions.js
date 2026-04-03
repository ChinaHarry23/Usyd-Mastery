#!/usr/bin/env node
"use strict";

/**
 * Unit tests for pure business-logic functions extracted from shared modules.
 * Run with: node tests/test-pure-functions.js
 */

var assert = require("assert");
var passed = 0;
var failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log("  ✓ " + name); }
  catch (e) { failed++; console.error("  ✗ " + name + ": " + e.message); }
}

// ═══════════════════════════════════════════════════
// SM-2 Scheduling (from shared/flashcard-srs.js)
// ═══════════════════════════════════════════════════

var MIN_EF   = 1.3;
var MS_DAY   = 86400000;
var MS_10MIN = 600000;

function mapQuality(q) {
  if (q === 0) return 0;
  if (q === 1) return 3;
  if (q === 2) return 4;
  if (q === 3) return 5;
  return 4;
}

function nextEase(ef, q05) {
  var nf = ef + (0.1 - (5 - q05) * (0.08 + (5 - q05) * 0.02));
  return Math.max(MIN_EF, nf);
}

function schedule(card, quality) {
  var ef = typeof card.ef === "number" ? card.ef : 2.5;
  var reps = card.reps | 0;
  var now = Date.now();
  var out = { ef: ef, reps: reps, intervalDays: card.intervalDays || 0, nextDue: card.nextDue };

  if (quality === 0) {
    out.reps = 0;
    out.intervalDays = 0;
    out.ef = Math.max(MIN_EF, ef - 0.2);
    out.nextDue = now + MS_10MIN;
    return out;
  }

  var q5 = mapQuality(quality);
  ef = nextEase(ef, q5);
  reps += 1;

  var days;
  if (reps === 1) {
    days = quality === 1 ? 0.5 : quality === 2 ? 1 : 2;
  } else if (reps === 2) {
    days = quality === 1 ? 2 : quality === 2 ? 6 : 10;
  } else {
    var prev = card.intervalDays > 0 ? card.intervalDays : 1;
    var mult = quality === 1 ? 1.2 : quality === 2 ? ef : ef * 1.3;
    days = Math.max(1, Math.round(prev * mult));
  }

  out.reps = reps;
  out.ef = ef;
  out.intervalDays = days;
  out.nextDue = now + days * MS_DAY;
  return out;
}

function isDue(card, now) {
  now = now || Date.now();
  if (!card || card.nextDue == null) return true;
  return card.nextDue <= now;
}

console.log("\n── SM-2 Scheduling ──");

test("schedule: Again resets reps and lowers EF", function() {
  var result = schedule({ ef: 2.5, reps: 3, intervalDays: 10 }, 0);
  assert.strictEqual(result.reps, 0);
  assert.strictEqual(result.intervalDays, 0);
  assert.strictEqual(result.ef, 2.3);
});

test("schedule: Again never drops EF below MIN_EF", function() {
  var result = schedule({ ef: 1.3, reps: 1, intervalDays: 1 }, 0);
  assert.strictEqual(result.ef, MIN_EF);
});

test("schedule: Good on first rep gives 1-day interval", function() {
  var result = schedule({ ef: 2.5, reps: 0, intervalDays: 0 }, 2);
  assert.strictEqual(result.reps, 1);
  assert.strictEqual(result.intervalDays, 1);
});

test("schedule: Easy on first rep gives 2-day interval", function() {
  var result = schedule({ ef: 2.5, reps: 0, intervalDays: 0 }, 3);
  assert.strictEqual(result.reps, 1);
  assert.strictEqual(result.intervalDays, 2);
});

test("schedule: Hard on first rep gives 0.5-day interval", function() {
  var result = schedule({ ef: 2.5, reps: 0, intervalDays: 0 }, 1);
  assert.strictEqual(result.reps, 1);
  assert.strictEqual(result.intervalDays, 0.5);
});

test("schedule: Good on second rep gives 6-day interval", function() {
  var result = schedule({ ef: 2.5, reps: 1, intervalDays: 1 }, 2);
  assert.strictEqual(result.reps, 2);
  assert.strictEqual(result.intervalDays, 6);
});

test("schedule: EF increases with Easy ratings", function() {
  var result = schedule({ ef: 2.5, reps: 1, intervalDays: 1 }, 3);
  assert.ok(result.ef > 2.5, "EF should increase: got " + result.ef);
});

test("schedule: EF decreases with Hard ratings", function() {
  var result = schedule({ ef: 2.5, reps: 1, intervalDays: 1 }, 1);
  assert.ok(result.ef < 2.5, "EF should decrease: got " + result.ef);
});

test("schedule: third+ rep uses prev interval * EF for Good", function() {
  var result = schedule({ ef: 2.5, reps: 2, intervalDays: 6 }, 2);
  assert.strictEqual(result.reps, 3);
  assert.strictEqual(result.intervalDays, Math.max(1, Math.round(6 * nextEase(2.5, 4))));
});

test("schedule: nextDue is set in the future", function() {
  var before = Date.now();
  var result = schedule({ ef: 2.5, reps: 0, intervalDays: 0 }, 2);
  assert.ok(result.nextDue >= before, "nextDue should be >= now");
});

test("isDue: null nextDue means due", function() {
  assert.strictEqual(isDue({ nextDue: null }), true);
});

test("isDue: past nextDue means due", function() {
  assert.strictEqual(isDue({ nextDue: Date.now() - 1000 }), true);
});

test("isDue: future nextDue means not due", function() {
  assert.strictEqual(isDue({ nextDue: Date.now() + 100000 }), false);
});

// ═══════════════════════════════════════════════════
// chapterPercent (from shared/mission-control.js)
// ═══════════════════════════════════════════════════

function countTrue(obj) {
  if (!obj || typeof obj !== "object") return 0;
  var n = 0;
  Object.keys(obj).forEach(function(k) { if (obj[k] === true) n += 1; });
  return n;
}

function chapterPercent(progress, ch, TOTALS) {
  var key  = "ch" + ch;
  var data = progress[key] || {};
  var secDone      = data.sections ? Object.keys(data.sections).length : 0;
  var secTotal     = TOTALS.sections[ch]  || 0;
  var splitChecks  = (data.quickChecksStudy || 0) + (data.quickChecksMath || 0);
  var checksDone   = splitChecks > 0 ? splitChecks : (data.quickChecks || 0);
  var checksTotal  = TOTALS.checks[ch]    || 0;
  var quizBest     = data.quizBest != null ? Math.max(0, Math.min(100, data.quizBest)) : 0;
  var tutorialDone = countTrue(data.tutorials);
  var tutorialTotal= TOTALS.tutorials[ch] || 0;
  var secR      = secTotal      ? Math.min(1, secDone / secTotal)           : 0;
  var checkR    = checksTotal   ? Math.min(1, checksDone / checksTotal)     : 0;
  var quizR     = Math.min(1, quizBest / 100);
  var tutorialR = tutorialTotal ? Math.min(1, tutorialDone / tutorialTotal) : 0;
  return Math.round(100 * (0.2 * secR + 0.25 * checkR + 0.25 * quizR + 0.3 * tutorialR));
}

console.log("\n── chapterPercent ──");

test("chapterPercent: empty progress returns 0", function() {
  var totals = { sections: { 1: 7 }, checks: { 1: 10 }, tutorials: { 1: 1 } };
  assert.strictEqual(chapterPercent({}, 1, totals), 0);
});

test("chapterPercent: full progress returns 100", function() {
  var totals = { sections: { 1: 2 }, checks: { 1: 3 }, tutorials: { 1: 1 } };
  var progress = {
    ch1: {
      sections: { a: 1, b: 2 },
      quickChecksStudy: 2, quickChecksMath: 1,
      quizBest: 100,
      tutorials: { t1: true }
    }
  };
  assert.strictEqual(chapterPercent(progress, 1, totals), 100);
});

test("chapterPercent: partial progress computes weighted average", function() {
  var totals = { sections: { 1: 10 }, checks: { 1: 10 }, tutorials: { 1: 2 } };
  var progress = {
    ch1: {
      sections: { a: 1, b: 2, c: 3, d: 4, e: 5 },
      quickChecksStudy: 5, quickChecksMath: 0,
      quizBest: 50,
      tutorials: { t1: true }
    }
  };
  var expected = Math.round(100 * (0.2 * 0.5 + 0.25 * 0.5 + 0.25 * 0.5 + 0.3 * 0.5));
  assert.strictEqual(chapterPercent(progress, 1, totals), expected);
});

test("chapterPercent: quizBest clamped to 100", function() {
  var totals = { sections: { 1: 1 }, checks: { 1: 1 }, tutorials: { 1: 1 } };
  var progress = { ch1: { quizBest: 200 } };
  var result = chapterPercent(progress, 1, totals);
  assert.ok(result <= 100, "should not exceed 100");
});

console.log("\n── chapterPercent quickChecks compatibility ──");

test("chapterPercent: reads combined quickChecks when split fields absent (5270 schema)", function() {
  var totals = { sections: { 1: 2 }, checks: { 1: 10 }, tutorials: { 1: 1 } };
  var progress = { ch1: { quickChecks: 5 } };
  var result = chapterPercent(progress, 1, totals);
  var expected = Math.round(100 * (0.25 * 0.5));
  assert.strictEqual(result, expected);
});

test("chapterPercent: prefers split fields over combined when both exist (5318 schema)", function() {
  var totals = { sections: { 1: 2 }, checks: { 1: 10 }, tutorials: { 1: 1 } };
  var progress = { ch1: { quickChecksStudy: 3, quickChecksMath: 2, quickChecks: 99 } };
  var result = chapterPercent(progress, 1, totals);
  var expected = Math.round(100 * (0.25 * 0.5));
  assert.strictEqual(result, expected);
});

test("chapterPercent: combined quickChecks=0 stays 0 (not falling through to split)", function() {
  var totals = { sections: { 1: 2 }, checks: { 1: 10 }, tutorials: { 1: 1 } };
  var progress = { ch1: { quickChecks: 0 } };
  assert.strictEqual(chapterPercent(progress, 1, totals), 0);
});

test("chapterPercent: neither split nor combined → 0 checks", function() {
  var totals = { sections: { 1: 2 }, checks: { 1: 10 }, tutorials: { 1: 1 } };
  var progress = { ch1: { quizBest: 80 } };
  var expected = Math.round(100 * (0.25 * 0.8));
  assert.strictEqual(chapterPercent(progress, 1, totals), expected);
});

// ═══════════════════════════════════════════════════
// weightedChapterPct (from shared/progress-dashboard.js)
// ═══════════════════════════════════════════════════

function weightedChapterPct(sv, st, qcd, qct, quizBestPct, tuDone, tuTotal) {
  var W = { sections: 0.20, qc: 0.25, quiz: 0.25, tutorials: 0.30 };
  var secR = st > 0 ? Math.min(1, sv / st) : 0;
  var qcR  = qct > 0 ? Math.min(1, qcd / qct) : 0;
  var qzR  = quizBestPct != null && quizBestPct >= 0 ? Math.min(1, quizBestPct / 100) : 0;
  var tutR = tuTotal > 0 ? Math.min(1, tuDone / tuTotal) : 0;
  return W.sections * secR + W.qc * qcR + W.quiz * qzR + W.tutorials * tutR;
}

console.log("\n── weightedChapterPct ──");

test("weightedChapterPct: all zeros returns 0", function() {
  assert.strictEqual(weightedChapterPct(0, 10, 0, 5, 0, 0, 2), 0);
});

test("weightedChapterPct: all complete returns 1.0", function() {
  assert.strictEqual(weightedChapterPct(10, 10, 5, 5, 100, 2, 2), 1.0);
});

test("weightedChapterPct: 50% across all dimensions", function() {
  var result = weightedChapterPct(5, 10, 3, 6, 50, 1, 2);
  var expected = 0.2 * 0.5 + 0.25 * 0.5 + 0.25 * 0.5 + 0.3 * 0.5;
  assert.ok(Math.abs(result - expected) < 0.001, "got " + result + " expected " + expected);
});

test("weightedChapterPct: null quizBest treated as 0", function() {
  var result = weightedChapterPct(10, 10, 5, 5, null, 2, 2);
  var expected = 0.2 * 1 + 0.25 * 1 + 0.25 * 0 + 0.3 * 1;
  assert.ok(Math.abs(result - expected) < 0.001);
});

test("weightedChapterPct: zero totals → 0 ratio, no division by zero", function() {
  var result = weightedChapterPct(0, 0, 0, 0, 50, 0, 0);
  assert.strictEqual(result, 0.25 * 0.5);
});

// ═══════════════════════════════════════════════════
// streakFromDays (from shared/mission-control.js)
// ═══════════════════════════════════════════════════

function parseYmd(s) {
  var p = s.split("-");
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}

function dayDiff(a, b) {
  return Math.round((parseYmd(a) - parseYmd(b)) / 86400000);
}

function streakFromDays(days) {
  if (!days.length) return 0;
  var streak = 1;
  for (var i = 1; i < days.length; i += 1) {
    if (dayDiff(days[i - 1], days[i]) === 1) streak += 1;
    else break;
  }
  return streak;
}

console.log("\n── streakFromDays ──");

test("streakFromDays: empty array returns 0", function() {
  assert.strictEqual(streakFromDays([]), 0);
});

test("streakFromDays: single day returns 1", function() {
  assert.strictEqual(streakFromDays(["2026-04-03"]), 1);
});

test("streakFromDays: consecutive days count correctly", function() {
  assert.strictEqual(streakFromDays(["2026-04-03", "2026-04-02", "2026-04-01"]), 3);
});

test("streakFromDays: gap breaks streak", function() {
  assert.strictEqual(streakFromDays(["2026-04-03", "2026-04-01"]), 1);
});

test("streakFromDays: streak then gap", function() {
  assert.strictEqual(streakFromDays(["2026-04-03", "2026-04-02", "2026-03-30"]), 2);
});

// ═══════════════════════════════════════════════════
// recordAnswerResult logic (from shared/quiz-hub.js)
// ═══════════════════════════════════════════════════

function recordAnswerResult(missedMap, qId, isCorrect) {
  var key = String(qId);
  var m = JSON.parse(JSON.stringify(missedMap));
  if (isCorrect) {
    if (m[key] !== undefined) {
      m[key]++;
      if (m[key] >= 2) delete m[key];
    }
  } else {
    m[key] = 0;
  }
  return m;
}

console.log("\n── recordAnswerResult ──");

test("recordAnswerResult: wrong answer adds to stack with count 0", function() {
  var m = recordAnswerResult({}, 42, false);
  assert.strictEqual(m["42"], 0);
});

test("recordAnswerResult: first correct on stacked item increments count", function() {
  var m = recordAnswerResult({ "42": 0 }, 42, true);
  assert.strictEqual(m["42"], 1);
});

test("recordAnswerResult: second correct removes from stack", function() {
  var m = recordAnswerResult({ "42": 1 }, 42, true);
  assert.strictEqual(m["42"], undefined);
});

test("recordAnswerResult: correct on non-stacked item is no-op", function() {
  var m = recordAnswerResult({}, 42, true);
  assert.strictEqual(m["42"], undefined);
});

test("recordAnswerResult: wrong after partial correct resets to 0", function() {
  var m = recordAnswerResult({ "42": 1 }, 42, false);
  assert.strictEqual(m["42"], 0);
});

// ═══════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════

console.log("\n── Results: " + passed + " passed, " + failed + " failed ──\n");
process.exit(failed > 0 ? 1 : 0);
