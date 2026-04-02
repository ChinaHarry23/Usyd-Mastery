(function () {
  "use strict";

  var KEY = "comp9001_lang";

  function getLang() {
    return localStorage.getItem(KEY) || "en";
  }

  function setLang(next) {
    localStorage.setItem(KEY, next);
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: next } }));
  }

  window.COMP9001_LANG = {
    get: getLang,
    set: setLang,
    toggle: function toggle() {
      setLang(getLang() === "en" ? "zh" : "en");
    }
  };
})();
