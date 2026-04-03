(function () {
  "use strict";

  var LANG_KEY = "comp5270_lang";
  var lang = localStorage.getItem(LANG_KEY) || "en";
  var saved = {};

  // ===================== TOGGLE BUTTON =====================
  var btn = document.createElement("button");
  btn.id = "langToggle";
  btn.setAttribute("aria-label", "Toggle language");
  setBtnText();
  btn.addEventListener("click", toggle);
  document.body.appendChild(btn);

  function setBtnText() {
    btn.innerHTML = lang === "en" ? "中文" : "EN";
  }

  function toggle() {
    lang = lang === "en" ? "zh" : "en";
    localStorage.setItem(LANG_KEY, lang);
    setBtnText();
    applyTranslations();
    window.dispatchEvent(
      new CustomEvent("langchange", { detail: { lang: lang } })
    );
  }

  window.getLang = function () {
    return lang;
  };

  // ===================== APPLY TRANSLATIONS =====================
  function applyTranslations() {
    var path = location.pathname;
    var isMath = path.indexOf("math") !== -1;
    var T;

    if (path.indexOf("chapter12") !== -1) {
      T = isMath ? MATH12_T : STUDY12_T;
    } else if (path.indexOf("chapter11") !== -1) {
      T = isMath ? MATH11_T : STUDY11_T;
    } else if (path.indexOf("chapter10") !== -1) {
      T = isMath ? MATH10_T : STUDY10_T;
    } else if (path.indexOf("chapter9") !== -1) {
      T = isMath ? MATH9_T : STUDY9_T;
    } else if (path.indexOf("chapter8") !== -1) {
      T = isMath ? MATH8_T : STUDY8_T;
    } else if (path.indexOf("chapter7") !== -1) {
      T = isMath ? MATH7_T : STUDY7_T;
    } else if (path.indexOf("chapter6") !== -1) {
      T = isMath ? MATH6_T : STUDY6_T;
    } else if (path.indexOf("chapter5") !== -1) {
      T = isMath ? MATH5_T : STUDY5_T;
    } else if (path.indexOf("chapter4") !== -1) {
      T = isMath ? MATH4_T : STUDY4_T;
    } else if (path.indexOf("chapter3") !== -1) {
      T = isMath ? MATH3_T : STUDY3_T;
    } else if (path.indexOf("chapter2") !== -1) {
      T = isMath ? MATH2_T : STUDY2_T;
    } else {
      T = isMath ? MATH_T : STUDY_T;
    }

    T.forEach(function (entry) {
      var els = document.querySelectorAll(entry.s);
      var idx = entry.i || 0;
      var el = els[idx];
      if (!el) return;
      var key = entry.s + "##" + idx;
      if (!(key in saved)) saved[key] = el.innerHTML;
      el.innerHTML = lang === "zh" ? entry.t : saved[key];
    });

    // Centralised Quiz Hub callouts (all chapters)
    if (!isMath) {
      QHUB_NAV_T.forEach(applyOne);
      if (document.getElementById("quizHubCalloutTitle")) {
        QHUB_STUDY_T.forEach(applyOne);
      }
    } else {
      if (document.getElementById("mathQuizHubCalloutTitle")) {
        QHUB_MATH_T.forEach(applyOne);
      }
    }

    reRenderMath();
  }

  function applyOne(entry) {
    var els = document.querySelectorAll(entry.s);
    var idx = entry.i || 0;
    var el = els[idx];
    if (!el) return;
    var key = entry.s + "##" + idx;
    if (!(key in saved)) saved[key] = el.innerHTML;
    el.innerHTML = lang === "zh" ? entry.t : saved[key];
  }


  function reRenderMath() {
    if (typeof renderMathInElement === "function") {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
      });
    }
  }

  // ===================== INIT =====================
  window.addEventListener("load", function () {
    setTimeout(function () {
      if (lang === "zh") applyTranslations();
    }, 800);

    // Knowledge Graph highlight: detect ?from=kg and highlight the target section
    if (location.search.indexOf("from=kg") !== -1 && location.hash) {
      var targetId = location.hash.replace("#", "");
      var target = document.getElementById(targetId);
      if (target) {
        setTimeout(function () {
          target.classList.add("kg-highlight");
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(function () {
            target.classList.remove("kg-highlight");
          }, 5000);
        }, 600);
      }
    }
  });
})();
