/**
 * ELEC5620 — Language toggle configuration adapter.
 *
 * Bridges translations.js (COMMON, CH, MINDMAP_UI) and section-translations.js
 * (ELEC5620_SECTION_TRANSLATIONS) to the universal lang-toggle module.
 *
 * Load order: translations.js -> section-translations.js -> lang-config.js -> ../../shared/lang-toggle.js
 */
(function () {
  "use strict";

  var m = location.pathname.match(/chapter(\d+)/);
  var ch = m ? m[1] : null;

  var T = {};
  if (typeof COMMON !== "undefined") {
    for (var c in COMMON) T[c] = COMMON[c];
  }
  if (typeof CH !== "undefined" && ch && CH[ch]) {
    for (var k in CH[ch]) T[k] = CH[ch][k];
  }
  var hasTranslations = Object.keys(T).length > 0;

  window.LANG_CONFIG = {
    storageKey: "elec5620_lang",
    translations: hasTranslations ? T : undefined,
    sectionTranslations:
      typeof ELEC5620_SECTION_TRANSLATIONS !== "undefined"
        ? ELEC5620_SECTION_TRANSLATIONS
        : undefined,
    mindmapTranslations:
      typeof MINDMAP_UI !== "undefined" ? MINDMAP_UI : undefined,
  };

  /* Backward-compatible shim — existing code may reference the per-course global */
  window.ELEC5620_LANG = {
    get: function () {
      return localStorage.getItem("elec5620_lang") || "en";
    },
    set: function (next) {
      if (typeof window.LangToggle !== "undefined") {
        window.LangToggle.set(next);
      } else {
        localStorage.setItem("elec5620_lang", next);
        window.dispatchEvent(
          new CustomEvent("langchange", { detail: { lang: next } })
        );
      }
    },
    toggle: function () {
      this.set(this.get() === "en" ? "zh" : "en");
    },
  };
})();
