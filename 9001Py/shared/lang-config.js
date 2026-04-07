/**
 * COMP9001 — Language toggle configuration adapter.
 * Minimal config: provides storage key and backward-compatible
 * COMP9001_LANG shim for existing code that references it.
 */
(function () {
  "use strict";

  window.LANG_CONFIG = {
    storageKey: "comp9001_lang"
  };

  /* Backward-compatible shim — existing code may reference COMP9001_LANG */
  window.COMP9001_LANG = {
    get: function () { return localStorage.getItem("comp9001_lang") || "en"; },
    set: function (next) {
      if (typeof window.LangToggle !== "undefined") {
        window.LangToggle.set(next);
      } else {
        localStorage.setItem("comp9001_lang", next);
        window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: next } }));
      }
    },
    toggle: function () {
      this.set(this.get() === "en" ? "zh" : "en");
    }
  };
})();
