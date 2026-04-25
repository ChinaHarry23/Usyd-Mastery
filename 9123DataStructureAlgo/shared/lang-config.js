/**
 * COMP9123 — Language toggle configuration adapter.
 *
 * Bridges translations.js (COMMON, CH, MINDMAP_UI) and section-translations.js
 * (COMP9123_SECTION_TRANSLATIONS) to the universal lang-toggle module.
 *
 * Load order: translations.js → section-translations.js → lang-config.js → /shared/lang-toggle.js
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
    storageKey: "comp9123_lang",
    translations: hasTranslations ? T : undefined,
    sectionTranslations:
      typeof COMP9123_SECTION_TRANSLATIONS !== "undefined"
        ? COMP9123_SECTION_TRANSLATIONS
        : undefined,
    mindmapTranslations:
      typeof MINDMAP_UI !== "undefined" ? MINDMAP_UI : undefined,
  };
})();
