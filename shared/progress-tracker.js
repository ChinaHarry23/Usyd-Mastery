(function() {
"use strict";
// Optional: set window.PROGRESS_TRACKER_CONFIG before this script (merged over URL auto-detect).
// Example: { storageKey: "comp5270_progress", splitQuickChecks: false }

function detectProgressTrackerConfig() {
  var path = (typeof location !== "undefined" && location.pathname) || "";
  if (/\/5318(?:\/|$)/.test(path) || path.indexOf("/5318/") !== -1) {
    return {
      storageKey: "comp5318_progress",
      splitQuickChecks: true,
      enhancedQuickChecks: true,
      accessibilityQuickChecks: false,
      progressUpdateEvent: "comp5318-progress-update",
      contentRefreshEvent: "comp5318-content-refresh",
      chapterProgressGetterName: "getComp5318ChapterProgress"
    };
  }
  if (/\/5270(?:\/|$)/.test(path) || path.indexOf("/5270/") !== -1) {
    return {
      storageKey: "comp5270_progress",
      splitQuickChecks: false,
      enhancedQuickChecks: false,
      accessibilityQuickChecks: false,
      progressUpdateEvent: null,
      contentRefreshEvent: null,
      chapterProgressGetterName: null
    };
  }
  var pathLower = path.toLowerCase();
  if (
    /comp5046|5046-nlp/i.test(path) ||
    pathLower.indexOf("comp5046") !== -1 ||
    pathLower.indexOf("5046-nlp") !== -1
  ) {
    return {
      storageKey: "comp5046_progress",
      splitQuickChecks: false,
      enhancedQuickChecks: false,
      accessibilityQuickChecks: true,
      progressUpdateEvent: null,
      contentRefreshEvent: null,
      chapterProgressGetterName: null
    };
  }
  if (/COMP9001|comp9001/i.test(path) || pathLower.indexOf("comp9001") !== -1) {
    return {
      storageKey: "comp9001_progress",
      splitQuickChecks: false,
      enhancedQuickChecks: false,
      accessibilityQuickChecks: false,
      progressUpdateEvent: null,
      contentRefreshEvent: null,
      chapterProgressGetterName: null
    };
  }
  if (
    /9123|comp9123/i.test(path) ||
    pathLower.indexOf("9123datastructurealgo") !== -1
  ) {
    return {
      storageKey: "comp9123_progress",
      splitQuickChecks: true,
      enhancedQuickChecks: true,
      accessibilityQuickChecks: false,
      progressUpdateEvent: null,
      contentRefreshEvent: null,
      chapterProgressGetterName: null
    };
  }
  return {
    storageKey: "studyhub_progress",
    splitQuickChecks: false,
    enhancedQuickChecks: false,
    accessibilityQuickChecks: false,
    progressUpdateEvent: null,
    contentRefreshEvent: null,
    chapterProgressGetterName: null
  };
}

var detected = detectProgressTrackerConfig();
var userCfg =
  typeof window !== "undefined" &&
  window.PROGRESS_TRACKER_CONFIG &&
  typeof window.PROGRESS_TRACKER_CONFIG === "object"
    ? window.PROGRESS_TRACKER_CONFIG
    : {};
var CONFIG = {};
var k;
for (k in detected) {
  if (Object.prototype.hasOwnProperty.call(detected, k)) {
    CONFIG[k] = detected[k];
  }
}
for (k in userCfg) {
  if (Object.prototype.hasOwnProperty.call(userCfg, k)) {
    CONFIG[k] = userCfg[k];
  }
}

var KEY = CONFIG.storageKey || detected.storageKey || "studyhub_progress";

function getProgress() {
  try {
    var r = localStorage.getItem(KEY);
    return r ? JSON.parse(r) : {};
  } catch (e) {
    return {};
  }
}

function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch (e) {}
}

function getChapter() {
  var m = location.pathname.match(/chapter(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// COMP9001 backward-compatibility shim — must be created before the chapter guard
// so it's available on non-chapter pages (e.g. progress-dashboard.html).
if (KEY === "comp9001_progress" && typeof window.COMP9001_PROGRESS === "undefined") {
  window.COMP9001_PROGRESS = {
    key: KEY,
    get: getProgress,
    save: function(data) { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_e) { /* quota */ } },
    markPage: function() { /* sections auto-tracked via IntersectionObserver on chapter pages */ },
    markQuiz: function(_chapter, correct, total) {
      if (typeof window._trackQuizScore === "function") {
        window._trackQuizScore(correct, total);
      }
    }
  };
}

var ch = getChapter();
if (!ch) return;

var chKey = "ch" + ch;

function notifyProgressUpdate() {
  if (typeof window.refreshChapterStudyProgress === "function") {
    window.refreshChapterStudyProgress();
  }
  if (CONFIG.progressUpdateEvent) {
    try {
      window.dispatchEvent(new CustomEvent(CONFIG.progressUpdateEvent));
    } catch (e) {}
  }
}

function trackQuickCheckSimple() {
  var p = getProgress();
  if (!p[chKey]) p[chKey] = {};
  p[chKey].quickChecks = (p[chKey].quickChecks || 0) + 1;
  saveProgress(p);
}

function trackQuickCheckContext(context) {
  var p = getProgress();
  if (!p[chKey]) p[chKey] = {};
  var ctx = context === "math" ? "math" : "study";
  if (ctx === "math") {
    p[chKey].quickChecksMath = (p[chKey].quickChecksMath || 0) + 1;
  } else {
    p[chKey].quickChecksStudy = (p[chKey].quickChecksStudy || 0) + 1;
  }
  p[chKey].quickChecks =
    (p[chKey].quickChecksStudy || 0) + (p[chKey].quickChecksMath || 0);
  saveProgress(p);
  notifyProgressUpdate();
}

function trackQuickCheckFromInteraction(context) {
  if (CONFIG.splitQuickChecks) {
    trackQuickCheckContext(context);
  } else {
    trackQuickCheckSimple();
  }
}

function trackSection(sectionId) {
  var p = getProgress();
  if (!p[chKey]) p[chKey] = {};
  if (!p[chKey].sections) p[chKey].sections = {};
  p[chKey].sections[sectionId] = Date.now();
  saveProgress(p);
}

function trackQuizScore(correct, total, type) {
  var p = getProgress();
  if (!p[chKey]) p[chKey] = {};
  var pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  if (!p[chKey].quizBest || pct > p[chKey].quizBest) {
    p[chKey].quizBest = pct;
  }

  if (!p.quizHistory) p.quizHistory = [];
  var d = new Date();
  var dateStr =
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0");
  p.quizHistory.push({
    date: dateStr,
    scope: "Ch" + ch + " " + (type || "study"),
    correct: correct,
    total: total,
    pct: pct
  });

  if (p.quizHistory.length > 100) p.quizHistory = p.quizHistory.slice(-100);

  saveProgress(p);
}

var sectionObs = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && e.target.dataset.track) {
        trackSection(e.target.dataset.track);
      }
    });
  },
  { rootMargin: "-20% 0px -60% 0px" }
);

function bindSections() {
  sectionObs.disconnect();
  document.querySelectorAll(".section[data-track]").forEach(function(s) {
    sectionObs.observe(s);
  });
}

function isZh() {
  return typeof getLang === "function" && getLang() === "zh";
}

function renderMathInDoc() {
  if (typeof renderMathInElement === "function") {
    try {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
    } catch (e) {}
  }
}

function bindQuickChecksEnhanced() {
  document.querySelectorAll(".quick-check").forEach(function(qc) {
    if (qc.dataset.qcBound) return;
    qc.dataset.qcBound = "1";
    var correctIdx = parseInt(qc.dataset.answer, 10);
    var feedback = qc.querySelector(".qc-feedback");
    if (isNaN(correctIdx) || !feedback) return;
    var tracked = false;
    qc.querySelectorAll(".qc-opt").forEach(function(opt) {
      opt.addEventListener("click", function() {
        if (!tracked) {
          tracked = true;
          var ctx = qc.getAttribute("data-qc-context") || "study";
          trackQuickCheckFromInteraction(ctx);
        }
        var idx = parseInt(opt.dataset.idx, 10);
        qc.querySelectorAll(".qc-opt").forEach(function(o) {
          o.classList.add("chosen");
          if (parseInt(o.dataset.idx, 10) === correctIdx) o.classList.add("right");
          else o.classList.add("not-right");
        });
        var explanation =
          isZh() && qc.dataset.explanationZh
            ? qc.dataset.explanationZh
            : qc.dataset.explanation || "";
        if (idx === correctIdx) {
          feedback.textContent = (isZh() ? "正确！" : "Correct! ") + explanation;
          feedback.className = "qc-feedback show correct-fb";
        } else {
          feedback.textContent = (isZh() ? "再想想。" : "Not quite. ") + explanation;
          feedback.className = "qc-feedback show wrong-fb";
        }
        renderMathInDoc();
      });
    });
  });
}

function bindQuickChecksSimple() {
  document.querySelectorAll(".quick-check .qc-opt").forEach(function(btn) {
    btn.addEventListener(
      "click",
      function handler() {
        trackQuickCheckFromInteraction("study");
        btn.removeEventListener("click", handler);
      },
      { once: true }
    );
  });
}

function bindQuickChecksAccessible() {
  document.querySelectorAll(".quick-check").forEach(function(container) {
    container.setAttribute("role", "listbox");
  });
  document.querySelectorAll(".quick-check .qc-opt").forEach(function(btn) {
    btn.setAttribute("role", "option");
    btn.setAttribute("tabindex", "0");
    btn.addEventListener(
      "click",
      function handler() {
        trackQuickCheckFromInteraction("study");
        btn.removeEventListener("click", handler);
      },
      { once: true }
    );
    btn.addEventListener("keydown", function(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

window._trackQuizScore = function(correct, total, type) {
  trackQuizScore(correct, total, type);
};

function trackTutorialUnderstood(problemId, understood) {
  var p = getProgress();
  if (!p[chKey]) p[chKey] = {};
  if (!p[chKey].tutorials) p[chKey].tutorials = {};
  p[chKey].tutorials[problemId] = understood === true;
  saveProgress(p);
}

function getTutorialState(problemId) {
  var p = getProgress();
  var t = p[chKey] && p[chKey].tutorials;
  if (!t) return undefined;
  return t[problemId];
}

function showTutorialDone(wrap) {
  var zh = isZh();
  wrap.innerHTML =
    '<div class="tutorial-self-check-inner tutorial-self-check-done">' +
    '<span class="tutorial-check-icon" aria-hidden="true">&#10003;</span> ' +
    (zh
      ? "\u5df2\u8bb0\u5f55\uff1a\u7406\u89e3\u89e3\u7b54\u4e14\u7ed3\u8bba\u4e00\u81f4\u3002"
      : "Saved: you understood the solution and matched the conclusion.") +
    "</div>";
}

function showTutorialPrompt(wrap, pid) {
  var zh = isZh();
  wrap.setAttribute("data-sol-id", pid);
  wrap.innerHTML =
    '<div class="tutorial-self-check-inner">' +
    '<p class="tutorial-self-check-q">' +
    (zh
      ? "\u4f60\u662f\u5426\u7406\u89e3\u4e86\u4e0a\u8ff0\u89e3\u7b54\uff0c\u5e76\u5f97\u5230\u4e0e\u4e4b\u76f8\u540c\u7684\u7ed3\u8bba\uff1f"
      : "Did you understand this solution and reach the same conclusion?") +
    "</p>" +
    '<div class="tutorial-self-check-actions">' +
    '<button type="button" class="btn btn-primary tutorial-self-yes">' +
    (zh ? "\u662f\uff0c\u7406\u89e3\u4e14\u4e00\u81f4" : "Yes, understood") +
    "</button>" +
    '<button type="button" class="btn btn-outline tutorial-self-no">' +
    (zh ? "\u6682\u672a" : "Not yet") +
    "</button>" +
    "</div></div>";

  wrap.querySelector(".tutorial-self-yes").addEventListener("click", function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    trackTutorialUnderstood(pid, true);
    showTutorialDone(wrap);
  });
  wrap.querySelector(".tutorial-self-no").addEventListener("click", function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    trackTutorialUnderstood(pid, false);
    var note = zh
      ? "\u5df2\u8bb0\u5f55\u3002\u968f\u65f6\u53ef\u518d\u6b21\u6253\u5f00\u89e3\u7b54\u5e76\u786e\u8ba4\u3002"
      : "Noted. Open the solution again when you are ready to confirm.";
    wrap.innerHTML =
      '<div class="tutorial-self-check-inner tutorial-self-check-muted-only"><p class="tutorial-self-check-muted">' +
      note +
      "</p></div>";
  });
}

function ensureTutorialWrapAfter(solEl, pid) {
  var next = solEl.nextElementSibling;
  if (next && next.classList && next.classList.contains("tutorial-self-check")) return next;
  var wrap = document.createElement("div");
  wrap.className = "tutorial-self-check";
  wrap.setAttribute("data-sol-id", pid);
  solEl.parentNode.insertBefore(wrap, solEl.nextSibling);
  return wrap;
}

function refreshTutorialPanel(pid, solEl) {
  if (!solEl || !solEl.classList.contains("open")) return;
  var wrap = ensureTutorialWrapAfter(solEl, pid);
  var st = getTutorialState(pid);
  if (st === true) showTutorialDone(wrap);
  else showTutorialPrompt(wrap, pid);
}

document.addEventListener(
  "click",
  function(ev) {
    var btn = ev.target.closest && ev.target.closest(".solution-toggle");
    if (!btn) return;
    setTimeout(function() {
      var pid = btn.dataset.target;
      if (!pid) return;
      var sol = document.getElementById(pid);
      if (!sol || !sol.classList.contains("open")) return;
      refreshTutorialPanel(pid, sol);
    }, 0);
  },
  false
);

window.addEventListener("langchange", function() {
  document.querySelectorAll(".tutorial-self-check[data-sol-id]").forEach(function(wrap) {
    var pid = wrap.getAttribute("data-sol-id");
    if (!pid) return;
    var sol = document.getElementById(pid);
    if (!sol || !sol.classList.contains("open")) return;
    refreshTutorialPanel(pid, sol);
  });
});

function getChapterProgressSnapshot() {
  var p = getProgress();
  var data = p[chKey] || {};
  var study = data.quickChecksStudy || 0;
  var math = data.quickChecksMath || 0;
  if (study === 0 && math === 0 && (data.quickChecks || 0) > 0) {
    study = data.quickChecks;
  }
  return {
    quickChecksStudy: study,
    quickChecksMath: math,
    quickChecks: study + math
  };
}

if (CONFIG.chapterProgressGetterName) {
  window[CONFIG.chapterProgressGetterName] = getChapterProgressSnapshot;
}

function refreshBindings() {
  bindSections();
  if (CONFIG.enhancedQuickChecks) {
    bindQuickChecksEnhanced();
  }
}

if (CONFIG.contentRefreshEvent) {
  refreshBindings();
  window.addEventListener(CONFIG.contentRefreshEvent, refreshBindings);
} else {
  document.querySelectorAll(".section[data-track]").forEach(function(s) {
    sectionObs.observe(s);
  });
  if (CONFIG.enhancedQuickChecks) {
    bindQuickChecksEnhanced();
  } else if (CONFIG.accessibilityQuickChecks) {
    bindQuickChecksAccessible();
  } else {
    bindQuickChecksSimple();
  }
}

if (typeof window.refreshChapterStudyProgress === "function") {
  window.refreshChapterStudyProgress();
}


})();
