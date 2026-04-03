(function () {
  "use strict";

  var LANG_KEY = "comp5046_lang";
  var lang = localStorage.getItem(LANG_KEY) || "en";
  var saved = {};
  var savedSections = {};
  var savedTitle = null;

  var btn = document.createElement("button");
  btn.id = "langToggle";
  btn.setAttribute("aria-label", "Toggle language");
  document.body.appendChild(btn);

  function setBtnText() {
    btn.textContent = lang === "en" ? "中文" : "EN";
  }

  function getChapter() {
    var m = location.pathname.match(/chapter(\d+)/);
    return m ? m[1] : null;
  }

  function getPageKey() {
    var parts = location.pathname.split("/");
    return parts[parts.length - 1] || "";
  }

  window.getLang = function () {
    return lang;
  };

  function applyMindmapTranslations() {
    if (!document.body.classList.contains("mm-page")) return;
    var ch = getChapter();
    var ui = ch && MINDMAP_UI[ch] ? MINDMAP_UI[ch] : null;
    if (!ui) return;

    if (savedTitle === null) savedTitle = document.title;
    document.title = lang === "zh" ? ui.title : savedTitle;

    var bar = document.querySelector(".mm-back-bar");
    if (bar) {
      var links = bar.querySelectorAll("a");
      if (links[0]) {
        if (!links[0].dataset.en) links[0].dataset.en = links[0].textContent;
        links[0].textContent = lang === "zh" ? ui.study : links[0].dataset.en;
      }
      if (links[1]) {
        if (!links[1].dataset.en) links[1].dataset.en = links[1].textContent;
        links[1].textContent = lang === "zh" ? ui.math : links[1].dataset.en;
      }
      if (links[2]) {
        if (!links[2].dataset.en) links[2].dataset.en = links[2].textContent;
        links[2].textContent = lang === "zh" ? ui.home : links[2].dataset.en;
      }
      var titleEl = bar.querySelector(".mm-title");
      if (titleEl) {
        if (!titleEl.dataset.en) titleEl.dataset.en = titleEl.textContent;
        titleEl.textContent = lang === "zh" ? ui.title : titleEl.dataset.en;
      }
    }

    var btnExpand = document.getElementById("btnExpandAll");
    var btnCollapse = document.getElementById("btnCollapseAll");
    if (btnExpand) {
      if (!btnExpand.dataset.en) btnExpand.dataset.en = btnExpand.textContent;
      btnExpand.textContent = lang === "zh" ? ui.expand : btnExpand.dataset.en;
    }
    if (btnCollapse) {
      if (!btnCollapse.dataset.en) btnCollapse.dataset.en = btnCollapse.textContent;
      btnCollapse.textContent = lang === "zh" ? ui.collapse : btnCollapse.dataset.en;
    }

    var legend = document.querySelector(".mm-legend");
    if (legend && ui.legend) {
      var items = legend.querySelectorAll(":scope > span");
      items.forEach(function (item, idx) {
        if (!item.dataset.enLabel) {
          item.dataset.enLabel = item.textContent.replace(/\s+/g, " ").trim();
        }
        if (lang === "zh" && ui.legend[idx]) {
          var dot = item.querySelector(".dot");
          item.innerHTML = dot ? dot.outerHTML + " " + ui.legend[idx] : ui.legend[idx];
        } else {
          var dotRestore = item.querySelector(".dot");
          item.innerHTML = dotRestore
            ? dotRestore.outerHTML + " " + item.dataset.enLabel
            : item.dataset.enLabel;
        }
      });
    }
  }

  function applyTranslations() {
    var ch = getChapter();
    var T = {};
    if (ch && CH[ch]) {
      for (var k in CH[ch]) T[k] = CH[ch][k];
    }
    for (var c in COMMON) T[c] = COMMON[c];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      var sk = key + "##" + (el.getAttribute("data-i18n-idx") || "0");
      if (!(sk in saved)) saved[sk] = el.innerHTML;
      el.innerHTML = lang === "zh" && T[key] ? T[key] : saved[sk];
    });

    document.querySelectorAll("[data-i18n-home]").forEach(function (el) {
      if (!el.dataset.en) el.dataset.en = el.innerHTML;
      el.innerHTML = lang === "zh" ? "&larr; 课程主页" : el.dataset.en;
    });

    applyMindmapTranslations();

    if (typeof renderMathInElement === "function") {
      try {
        renderMathInElement(document.body, {
          delimiters: [
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false },
          ],
          throwOnError: false,
        });
      } catch (e) {}
    }
    window.dispatchEvent(
      new CustomEvent("langchange", { detail: { lang: lang } })
    );
  }

  btn.addEventListener("click", function () {
    lang = lang === "en" ? "zh" : "en";
    localStorage.setItem(LANG_KEY, lang);
    setBtnText();
    applyTranslations();
  });

  setBtnText();
  if (lang === "zh") applyTranslations();
})();
