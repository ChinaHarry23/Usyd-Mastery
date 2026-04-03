(function() {
  "use strict";

  /*
   * initMissionControl(config) — config.totals must stay in sync with real chapter content.
   *
   * totals.sections[ch]  — Denominator for progress["ch"+ch].sections (unique section ids tracked
   *                        via section[data-track] / progress-tracker; count those per chapter).
   * totals.checks[ch]    — Denominator for (quickChecksStudy + quickChecksMath) stored by the hub’s
   *                        progress-tracker (often equals clickable quick-check interactions or
   *                        `.quick-check` blocks — confirm against that hub’s tracker and HTML).
   * totals.tutorials[ch] — Denominator for boolean `tutorials` entries (typically `.solution-toggle`
   *                        or equivalent slots the tracker marks as understood).
   *
   * After editing chapter HTML, re-count selectors on the live pages and update the matching
   * `totals` object here and in tools/progress-dashboard.html (if that hub uses one) so both stay aligned.
   */

  window.initMissionControl = function(config) {
    var LANG_KEY     = config.langKey;
    var PROGRESS_KEY = config.progressKey;
    var TOTAL_CH     = config.totalChapters;
    var UNIT         = config.unitNoun;
    var manifest     = window.CHAPTER_MANIFEST || {};
    var TOTALS       = config.totals || {
      sections:  manifest.sections  || {},
      checks:    manifest.checks    || {},
      tutorials: manifest.tutorials || {}
    };
    var T            = config.translations;
    var NOTES        = config.notes || {};

    var lang  = localStorage.getItem(LANG_KEY) || "en";
    var btn   = document.getElementById("langToggleHome");
    var saved = {};

    var unitEn     = UNIT.en.toLowerCase();
    var unitZhFull = { "\u8BB2": "\u8BB2\u5EA7", "\u7AE0": "\u7AE0\u8282", "\u5468": "\u7AE0\u8282" }[UNIT.zh] || "\u7AE0\u8282";

    function L(key) {
      var obj = NOTES[key];
      if (!obj) return "";
      return lang === "zh" ? obj.zh : obj.en;
    }

    function setBtnText() {
      if (!btn) return;
      btn.textContent = lang === "en" ? "\u4E2D\u6587" : "EN";
      btn.setAttribute(
        "aria-label",
        lang === "en"
          ? "Switch interface language to Chinese"
          : "Switch interface language to English"
      );
    }

    function apply() {
      document.querySelectorAll("[data-i18n]").forEach(function(el) {
        var key = el.getAttribute("data-i18n");
        if (!saved[key]) saved[key] = el.innerHTML;
        el.innerHTML = lang === "zh" && T[key] ? T[key] : saved[key];
      });
    }

    function getProgress() {
      try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
      catch (e) { return {}; }
    }

    function ymdFromDate(d) {
      return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
    }

    function ymdFromTs(ts) { return ymdFromDate(new Date(ts)); }

    function countTrue(obj) {
      if (!obj || typeof obj !== "object") return 0;
      var n = 0;
      Object.keys(obj).forEach(function(k) { if (obj[k] === true) n += 1; });
      return n;
    }

    function chapterPercent(progress, ch) {
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

    function collectActivityDays(progress) {
      var days = {};
      Object.keys(progress).forEach(function(key) {
        if (!/^ch\d+$/.test(key)) return;
        var data = progress[key] || {};
        if (data.sections) {
          Object.keys(data.sections).forEach(function(sKey) {
            var ts = data.sections[sKey];
            if (typeof ts === "number") days[ymdFromTs(ts)] = true;
          });
        }
      });
      (progress.quizHistory || []).forEach(function(item) {
        if (item && item.date) days[item.date] = true;
      });
      (progress.flashcardHistory || []).forEach(function(item) {
        if (item && item.date) days[item.date] = true;
      });
      return Object.keys(days).sort().reverse();
    }

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

    function streakLabel(days) {
      if (!days.length) return lang === "zh" ? "\u8FD8\u6CA1\u6709\u8BB0\u5F55" : "No activity yet";
      var today     = ymdFromDate(new Date());
      var yesterday = ymdFromDate(new Date(Date.now() - 86400000));
      if (days[0] === today)     return lang === "zh" ? "\u4ECA\u5929\u5DF2\u6D3B\u8DC3" : "Active today";
      if (days[0] === yesterday) return lang === "zh" ? "\u6628\u5929\u6D3B\u8DC3" : "Active yesterday";
      return (lang === "zh" ? "\u6700\u8FD1\u6D3B\u8DC3\uFF1A" : "Last active: ") + days[0];
    }

    function masteryTier(pct) {
      if (pct >= 85) return lang === "zh" ? "\u7CBE\u901A" : "Mastery";
      if (pct >= 60) return lang === "zh" ? "\u51B2\u523A\u4E2D" : "Momentum";
      if (pct >= 30) return lang === "zh" ? "\u6784\u5EFA\u4E2D" : "Builder";
      return lang === "zh" ? "\u63A2\u7D22\u8005" : "Explorer";
    }

    function missionPillText(avg, streak) {
      if (avg >= 85)   return lang === "zh" ? "\u638C\u63E1\u56DE\u8DEF\u5728\u7EBF" : "Mastery loop live";
      if (streak >= 3) return lang === "zh" ? "\u8282\u594F\u5DF2\u5EFA\u7ACB" : "Momentum established";
      if (avg > 0)     return lang === "zh" ? "\u4EFB\u52A1\u8FDB\u884C\u4E2D" : "Mission in progress";
      return lang === "zh" ? "\u7B49\u5F85\u9996\u6B21\u884C\u52A8" : "Awaiting first move";
    }

    function nextMissionFor(chapters) {
      var inProgress = chapters
        .filter(function(ch) { return ch.pct > 0 && ch.pct < 85; })
        .sort(function(a, b) { return a.pct - b.pct; })[0];
      if (inProgress) {
        return {
          title: lang === "zh"
            ? "\u7EE7\u7EED\u7B2C " + inProgress.ch + " " + UNIT.zh
            : "Continue " + UNIT.en + " " + inProgress.ch,
          note: L("nextInProgress"),
          href: "chapters/chapter" + inProgress.ch + "/web/chapter" + inProgress.ch + "-study.html",
          cta: L("nextInProgressCta")
        };
      }
      var untouched = chapters.filter(function(ch) { return ch.pct === 0; })[0];
      if (untouched) {
        return {
          title: lang === "zh"
            ? "\u542F\u52A8\u7B2C " + untouched.ch + " " + UNIT.zh
            : "Start " + UNIT.en + " " + untouched.ch,
          note: L("nextUntouched"),
          href: "chapters/chapter" + untouched.ch + "/web/chapter" + untouched.ch + "-study.html",
          cta: lang === "zh" ? "\u542F\u52A8\u4EFB\u52A1 &rarr;" : "Launch mission &rarr;"
        };
      }
      return {
        title: lang === "zh" ? "\u8FD0\u884C\u6DF7\u5408\u6D4B\u9A8C" : "Run a mixed quiz",
        note: L("nextAllDone"),
        href: "tools/quiz-hub.html",
        cta: lang === "zh" ? "\u6253\u5F00\u6D4B\u9A8C\u5FAA\u73AF &rarr;" : "Open quiz loop &rarr;"
      };
    }

    function chapterState(pct) {
      if (pct >= 85) return {
        cls: "mastered",
        label: lang === "zh" ? "\u5DF2\u638C\u63E1" : "Mastered",
        note:  lang === "zh" ? "\u9605\u8BFB\u3001\u68C0\u67E5\u4E0E\u6D4B\u9A8C\u8986\u76D6\u90FD\u5F88\u5F3A\u3002" : "Strong reading, checks, and quiz coverage."
      };
      if (pct > 0) return {
        cls: "in-progress",
        label: lang === "zh" ? "\u8FDB\u884C\u4E2D" : "In progress",
        note: L("inProgress")
      };
      return {
        cls: "unstarted",
        label: lang === "zh" ? "\u672A\u5F00\u59CB" : "Unstarted",
        note:  lang === "zh" ? "\u6253\u5F00\u5B66\u4E60\u6307\u5357\u6765\u70B9\u4EAE\u8FD9\u6761\u5B66\u4E60\u8DEF\u7EBF\u3002" : "Open the study guide to light up this path."
      };
    }

    function ensureChapterProgress(card) {
      var existing = card.querySelector(".chapter-progress");
      if (existing) return existing;
      var links = card.querySelector(".chapter-links");
      var wrap = document.createElement("div");
      wrap.className = "chapter-progress";
      wrap.innerHTML =
        '<div class="chapter-progress-top">' +
        '<span class="chapter-status unstarted"></span>' +
        '<span class="chapter-pct">0%</span>' +
        '</div>' +
        '<div class="chapter-meter"><span></span></div>' +
        '<div class="chapter-progress-note"></div>';
      if (links && links.parentNode) links.parentNode.insertBefore(wrap, links);
      else card.appendChild(wrap);
      return wrap;
    }

    function renderProgressGamification() {
      var progress = getProgress();
      var chapters = [];
      for (var ch = 1; ch <= TOTAL_CH; ch += 1)
        chapters.push({ ch: ch, pct: chapterPercent(progress, ch) });
      var total = 0;
      chapters.forEach(function(item) { total += item.pct; });
      var avg     = Math.round(total / chapters.length);
      var cleared = chapters.filter(function(item) { return item.pct >= 85; }).length;
      var days    = collectActivityDays(progress);
      var streak  = streakFromDays(days);
      var mission = nextMissionFor(chapters);
      var inProgCount = chapters.filter(function(item) { return item.pct > 0 && item.pct < 85; }).length;

      var overallValue = document.getElementById("missionOverallValue");
      var overallFill  = document.getElementById("missionOverallFill");
      var overallNote  = document.getElementById("missionOverallNote");
      var overallTier  = document.getElementById("missionOverallTier");
      var streakValue  = document.getElementById("missionStreakValue");
      var streakNote   = document.getElementById("missionStreakNote");
      var clearValue   = document.getElementById("missionClearValue");
      var clearNote    = document.getElementById("missionClearNote");
      var nextValue    = document.getElementById("missionNextValue");
      var nextNote     = document.getElementById("missionNextNote");
      var nextLink     = document.getElementById("missionNextLink");
      var statusPill   = document.getElementById("missionStatusPill");

      if (overallValue) overallValue.textContent = avg + "%";
      if (overallFill) {
        overallFill.style.width = avg + "%";
        overallFill.setAttribute("role", "progressbar");
        overallFill.setAttribute("aria-valuenow", avg);
        overallFill.setAttribute("aria-valuemin", "0");
        overallFill.setAttribute("aria-valuemax", "100");
      }
      if (overallNote)  overallNote.textContent  = avg > 0
        ? (lang === "zh"
            ? "\u7EE7\u7EED\u4FDD\u6301\u3002\u638C\u63E1\u5EA6\u4F1A\u968F\u7740" + unitZhFull + "\u9605\u8BFB\u3001\u5C0F\u6D4B\u4E0E\u6D4B\u9A8C\u540C\u6B65\u63D0\u9AD8\u3002"
            : "Keep the loop moving. Mastery rises as section reading, checks, and quiz performance improve together.")
        : (lang === "zh"
            ? "\u6253\u5F00\u4EFB\u4E00" + unitZhFull + "\uFF0C\u5F00\u59CB\u79EF\u7D2F\u4F60\u7684\u5B66\u4E60\u8F68\u8FF9\u3002"
            : "Start a " + unitEn + " to build your progress trail.");
      if (overallTier)  overallTier.textContent  = masteryTier(avg);
      if (streakValue)  streakValue.textContent  = String(streak);
      if (streakNote)   streakNote.textContent   = streak > 0
        ? streakLabel(days)
        : (lang === "zh"
            ? "\u8FD8\u6CA1\u6709\u5B66\u4E60\u8FDE\u51FB\u3002\u5B8C\u6210\u4E00\u6B21" + unitZhFull + "\u4E92\u52A8\u5373\u53EF\u5F00\u59CB\u3002"
            : "No learning streak yet. Finish one " + unitEn + " interaction to start.");
      if (clearValue)   clearValue.textContent   = cleared + " / " + TOTAL_CH;
      if (clearNote)    clearNote.textContent    = lang === "zh"
        ? "\u8FBE\u5230 85% \u638C\u63E1\u5EA6\u5373\u53EF\u89C6\u4E3A\u901A\u5173\u3002\u5F53\u524D\u6709 " + inProgCount + " \u7AE0\u6B63\u5728\u63A8\u8FDB\u3002"
        : "A chapter counts as cleared at 85% mastery. " + inProgCount + " chapter(s) are currently in progress.";
      if (nextValue)    nextValue.textContent     = mission.title;
      if (nextNote)     nextNote.textContent      = mission.note;
      if (nextLink) {
        nextLink.href      = mission.href;
        nextLink.innerHTML = mission.cta;
      }
      if (statusPill)   statusPill.textContent    = missionPillText(avg, streak);

      document.querySelectorAll(".chapter-card[data-chapter]").forEach(function(card) {
        var chNum = parseInt(card.getAttribute("data-chapter") || "0", 10);
        if (!chNum) return;
        var pct   = chapterPercent(progress, chNum);
        var state = chapterState(pct);
        var block = ensureChapterProgress(card);
        var status = block.querySelector(".chapter-status");
        var pctEl  = block.querySelector(".chapter-pct");
        var fill   = block.querySelector(".chapter-meter span");
        var note   = block.querySelector(".chapter-progress-note");
        if (status) { status.className = "chapter-status " + state.cls; status.textContent = state.label; }
        if (pctEl)  pctEl.textContent  = pct + "%";
        if (fill) {
          fill.style.width = pct + "%";
          fill.setAttribute("role", "progressbar");
          fill.setAttribute("aria-valuenow", pct);
          fill.setAttribute("aria-valuemin", "0");
          fill.setAttribute("aria-valuemax", "100");
        }
        if (note)   note.textContent   = state.note;
      });
    }

    function attachCardSpotlight(el) {
      if (!el || el.dataset.fxBound) return;
      el.dataset.fxBound = "1";
      el.addEventListener("mousemove", function(ev) {
        var rect = el.getBoundingClientRect();
        var x = ((ev.clientX - rect.left) / rect.width)  * 100;
        var y = ((ev.clientY - rect.top)  / rect.height) * 100;
        el.style.setProperty("--card-x", x + "%");
        el.style.setProperty("--card-y", y + "%");
      });
      el.addEventListener("mouseleave", function() {
        el.style.removeProperty("--card-x");
        el.style.removeProperty("--card-y");
      });
    }

    document.querySelectorAll(".mission-card, .chapter-card").forEach(attachCardSpotlight);

    if (btn) {
      btn.addEventListener("click", function() {
        lang = lang === "en" ? "zh" : "en";
        localStorage.setItem(LANG_KEY, lang);
        setBtnText();
        apply();
        renderProgressGamification();
      });
    }

    setBtnText();
    if (lang === "zh") apply();
    renderProgressGamification();
  };
})();
