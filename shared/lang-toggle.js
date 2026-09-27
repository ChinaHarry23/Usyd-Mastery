/**
 * Universal Language Toggle — shared/lang-toggle.js
 *
 * Configured via window.LANG_CONFIG (must be set before this script loads).
 *
 * Supports four translation strategies (all optional, mix-and-match):
 *   1. data-i18n attributes  → LANG_CONFIG.translations
 *   2. CSS selector arrays   → LANG_CONFIG.selectorTranslations  (5270 legacy)
 *   3. Section HTML replace  → LANG_CONFIG.sectionTranslations   (5318 style)
 *   4. Mindmap UI            → LANG_CONFIG.mindmapTranslations   (5318/5046)
 *
 * Exposed API:
 *   window.getLang()          — returns "en" or "zh"
 *   window.LangToggle.get()   — same
 *   window.LangToggle.set(l)  — set language, apply, fire event
 *   window.LangToggle.toggle()— flip en↔zh
 *   window.LangToggle.apply() — re-apply translations with current lang
 */
(function () {
  "use strict";

  var CFG = window.LANG_CONFIG || {};
  var KEY = CFG.storageKey || "lang";
  var lang = localStorage.getItem(KEY) || "en";
  var saved = {};
  var savedSections = {};
  var savedTitle = null;

  /* ── helpers ──────────────────────────────────────────── */

  function pageKey() {
    return location.pathname.split("/").pop() || "";
  }

  function chapterNum() {
    var m = location.pathname.match(/chapter(\d+)/);
    return m ? m[1] : null;
  }

  /* ── core API ────────────────────────────────────────── */

  function get() { return lang; }

  function set(next) {
    if (next !== "en" && next !== "zh") return;
    lang = next;
    localStorage.setItem(KEY, lang);
    updateButton();
    apply();
  }

  function toggle() {
    set(lang === "en" ? "zh" : "en");
  }

  /* ── button ──────────────────────────────────────────── */

  function updateButton() {
    var el =
      document.getElementById("langToggle") ||
      document.getElementById("langToggleHome");
    if (el) el.textContent = lang === "en" ? "中文" : "EN";
  }

  function ensureButton() {
    if (CFG.noButton) return;
    if (document.getElementById("langToggle")) return;
    if (document.getElementById("langToggleHome")) return;
    var btn = document.createElement("button");
    btn.id = "langToggle";
    btn.setAttribute("aria-label", "Toggle language");
    btn.addEventListener("click", toggle);
    document.body.appendChild(btn);
  }

  /* ── strategy 1: data-i18n attributes ────────────────── */

  function applyDataI18n() {
    var T = CFG.translations;
    if (!T || typeof T !== "object") return;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      var sk = key + "##" + (el.getAttribute("data-i18n-idx") || "0");
      if (!(sk in saved)) saved[sk] = el.innerHTML;
      el.innerHTML = lang === "zh" && T[key] ? T[key] : saved[sk];
    });

    document.querySelectorAll("[data-i18n-home]").forEach(function (el) {
      if (!el.dataset.en) el.dataset.en = el.innerHTML;
      el.innerHTML = lang === "zh" ? "\u2190 课程主页" : el.dataset.en;
    });
  }

  /* ── strategy 2: CSS selector arrays (5270 legacy) ───── */

  function applySelectorArrays() {
    var arrays = CFG.selectorTranslations;
    if (!arrays || !Array.isArray(arrays)) return;

    arrays.forEach(function (arr) {
      if (!Array.isArray(arr)) return;
      arr.forEach(function (entry) {
        var els = document.querySelectorAll(entry.s);
        var idx = entry.i || 0;
        var el = els[idx];
        if (!el) return;
        var k = entry.s + "##" + idx;
        if (!(k in saved)) saved[k] = el.innerHTML;
        el.innerHTML = lang === "zh" ? entry.t : saved[k];
      });
    });
  }

  /* ── strategy 3: section HTML replacement ────────────── */

  function applySectionTranslations() {
    var ST = CFG.sectionTranslations;
    if (!ST) return;

    var pk = pageKey();
    var pack = ST[pk];
    if (!pack) return;

    if (savedTitle === null) savedTitle = document.title;
    document.title = lang === "zh" && pack.title ? pack.title : savedTitle;

    Object.keys(pack.sections || {}).forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec) return;
      var sk = pk + "##" + id;
      if (!(sk in savedSections)) savedSections[sk] = sec.innerHTML;
      sec.innerHTML = lang === "zh" ? pack.sections[id] : savedSections[sk];
    });

    if (CFG.contentRefreshEvent) {
      window.dispatchEvent(
        new CustomEvent(CFG.contentRefreshEvent, {
          detail: { lang: lang, page: pk },
        })
      );
    }
  }

  /* ── strategy 4: mindmap UI ──────────────────────────── */

  function applyMindmapTranslations() {
    if (!document.body.classList.contains("mm-page")) return;
    var MT = CFG.mindmapTranslations;
    if (!MT) return;

    var ch = chapterNum();
    var ui = ch && MT[ch] ? MT[ch] : null;
    if (!ui) return;

    if (savedTitle === null) savedTitle = document.title;
    document.title = lang === "zh" ? ui.title : savedTitle;

    var bar = document.querySelector(".mm-back-bar");
    if (bar) {
      var links = bar.querySelectorAll("a");
      ["study", "math", "home"].forEach(function (prop, i) {
        if (links[i] && ui[prop]) {
          if (!links[i].dataset.en) links[i].dataset.en = links[i].textContent;
          links[i].textContent = lang === "zh" ? ui[prop] : links[i].dataset.en;
        }
      });
      var titleEl = bar.querySelector(".mm-title");
      if (titleEl) {
        if (!titleEl.dataset.en) titleEl.dataset.en = titleEl.textContent;
        titleEl.textContent = lang === "zh" ? ui.title : titleEl.dataset.en;
      }
    }

    var btnE = document.getElementById("btnExpandAll");
    var btnC = document.getElementById("btnCollapseAll");
    if (btnE) {
      if (!btnE.dataset.en) btnE.dataset.en = btnE.textContent;
      btnE.textContent = lang === "zh" ? ui.expand : btnE.dataset.en;
    }
    if (btnC) {
      if (!btnC.dataset.en) btnC.dataset.en = btnC.textContent;
      btnC.textContent = lang === "zh" ? ui.collapse : btnC.dataset.en;
    }

    var legend = document.querySelector(".mm-legend");
    if (legend && ui.legend) {
      legend.querySelectorAll(":scope > span").forEach(function (item, idx) {
        if (!item.dataset.enLabel) {
          item.dataset.enLabel = item.textContent.replace(/\s+/g, " ").trim();
        }
        if (lang === "zh" && ui.legend[idx]) {
          var dot = item.querySelector(".dot");
          item.innerHTML = dot
            ? dot.outerHTML + " " + ui.legend[idx]
            : ui.legend[idx];
        } else {
          var dotR = item.querySelector(".dot");
          item.innerHTML = dotR
            ? dotR.outerHTML + " " + item.dataset.enLabel
            : item.dataset.enLabel;
        }
      });
    }
  }

  /* ── main apply ──────────────────────────────────────── */

  function apply() {
    applySectionTranslations();
    applyDataI18n();
    applySelectorArrays();
    applyMindmapTranslations();

    if (typeof CFG.onApply === "function") CFG.onApply(lang);

    if (typeof renderMathInElement === "function") {
      try {
        renderMathInElement(document.body, {
          delimiters: [
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false },
          ],
          throwOnError: false,
        });
      } catch (e) { /* KaTeX unavailable or render error */ }
    }

    window.dispatchEvent(
      new CustomEvent("langchange", { detail: { lang: lang } })
    );
  }

  /* ── expose ──────────────────────────────────────────── */

  window.getLang = get;
  window.LangToggle = { get: get, set: set, toggle: toggle, apply: apply };

  /* ── init ────────────────────────────────────────────── */

  ensureButton();
  updateButton();

  if (lang === "zh") {
    if (document.readyState === "complete") {
      apply();
    } else {
      window.addEventListener("load", function () {
        setTimeout(apply, 120);
      });
    }
  }
})();
