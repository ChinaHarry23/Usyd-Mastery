/**
 * Root-portal language toggle — shared/root-lang-toggle.js
 *
 * Self-contained EN / 中文 switcher for the top-level landing page
 * (index.html). The root page enforces a strict CSP with
 * `script-src 'self'`, so we cannot rely on the inline bootstrapping
 * pattern used by the per-course hubs. This module ships its own
 * translation table, toggle button, and apply/restore logic.
 *
 * Storage key: "root_lang"  (values: "en" | "zh")
 */
(function () {
  "use strict";

  var STORAGE_KEY = "root_lang";

  var TRANSLATIONS = {
    "skip-link": "跳到内容",
    "uni-badge": "悉尼大学",
    "tagline":
      "你的集中式学习指挥中心。为每门课程提供交互式指南、知识图谱、闪卡、测验和进度追踪。",
    "semester-badge": "第一学期 &middot; 2026 &middot; 共 5 门课程",

    /* ── COMP 5270 ─────────────────────────────────────── */
    "card-5270-badge": "COMP 5270 &middot; 第一学期 2026",
    "card-5270-title": "随机化与高级算法",
    "card-5270-desc":
      "概率分析、集中不等式、流式数据草图、哈希、LP 舍入与专家学习 —— 配有交互式模拟与中英双语支持。",
    "card-5270-stat-chapters-label": "章节",
    "card-5270-stat-chapters-value": "12 节深入课程",
    "card-5270-stat-toolkit-label": "工具箱",
    "card-5270-stat-toolkit-value": "证明、模拟、测验",
    "card-5270-stat-language-label": "语言",

    /* ── COMP 5046 ─────────────────────────────────────── */
    "card-5046-badge": "COMP 5046 &middot; NLP &middot; 2026",
    "card-5046-title": "自然语言处理",
    "card-5046-desc":
      "文本预处理、词向量、序列模型、Transformer、注意力机制与语言生成 —— 基于 2026 年讲义构建。",
    "card-5046-stat-chapters-label": "章节",
    "card-5046-stat-chapters-value": "6 个引导模块",
    "card-5046-stat-toolkit-label": "工具箱",
    "card-5046-stat-toolkit-value": "指南、数学、图谱",
    "card-5046-stat-language-label": "语言",

    /* ── COMP 5318 ─────────────────────────────────────── */
    "card-5318-badge": "COMP 5318 &middot; 第一学期 2026",
    "card-5318-title": "机器学习与数据挖掘",
    "card-5318-desc":
      "监督与非监督学习、神经网络、SVM、决策树、集成方法与评估 —— 配有任务中心和进度游戏化系统。",
    "card-5318-stat-coverage-label": "覆盖范围",
    "card-5318-stat-coverage-value": "6 个系统周次",
    "card-5318-stat-source-label": "来源",
    "card-5318-stat-source-value": "讲座 + 实验 + 习题",
    "card-5318-stat-language-label": "语言",

    /* ── COMP 9001 ─────────────────────────────────────── */
    "card-9001-badge": "COMP 9001 &middot; 编程入门",
    "card-9001-title": "编程入门",
    "card-9001-desc":
      "Python 基础、控制流、函数、数据结构、文件 I/O 与面向对象编程 —— 面向初学者的交互式指南。",
    "card-9001-stat-chapters-label": "章节",
    "card-9001-stat-chapters-value": "5 个完整模块",
    "card-9001-stat-level-label": "难度",
    "card-9001-stat-level-value": "初学者友好",
    "card-9001-stat-language-label": "语言",

    /* ── COMP 9123 ─────────────────────────────────────── */
    "card-9123-badge": "COMP 9123 &middot; DSA &middot; 第一学期 2026",
    "card-9123-title": "数据结构与算法",
    "card-9123-desc":
      "数组、链表、树、图、哈希表、堆、排序、查找与复杂度分析 —— 配有每周指南、测验、闪卡与概念图谱。",
    "card-9123-stat-coverage-label": "覆盖范围",
    "card-9123-stat-coverage-value": "10 个每周模块",
    "card-9123-stat-toolkit-label": "工具箱",
    "card-9123-stat-toolkit-value": "图谱、测验、闪卡",
    "card-9123-stat-materials-label": "材料",
    "card-9123-stat-materials-value": "PDF + Python 参考代码",

    /* ── Shared / Footer ───────────────────────────────── */
    "enter-course-hub": "进入课程中心 &rarr;",
    "footer": "Usyd Mastery &middot; 为专注、交互式学习而构建 &middot; 2026"
  };

  // Exposed so downstream tooling (or the console) can inspect / extend.
  window.LANG_CONFIG = {
    storageKey: STORAGE_KEY,
    translations: TRANSLATIONS
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) === "zh" ? "zh" : "en";
  }

  function setLang(next) {
    localStorage.setItem(STORAGE_KEY, next === "zh" ? "zh" : "en");
  }

  function applyTranslations() {
    var lang = getLang();
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-i18n");
      if (!key) continue;
      // Cache original EN HTML on first pass so we can restore it losslessly.
      if (typeof el.dataset.en !== "string") {
        el.dataset.en = el.innerHTML;
      }
      if (lang === "zh" && Object.prototype.hasOwnProperty.call(TRANSLATIONS, key)) {
        el.innerHTML = TRANSLATIONS[key];
      } else {
        el.innerHTML = el.dataset.en;
      }
    }
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
  }

  function createToggleButton() {
    if (document.getElementById("rootLangToggle")) return;
    var btn = document.createElement("button");
    btn.id = "rootLangToggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle language / 切换语言");
    // Inline styles keep us CSP-clean (no new stylesheet needed) and
    // visually consistent with the per-course hubs' dark/rounded toggle.
    btn.style.cssText = [
      "position:fixed",
      "right:18px",
      "bottom:18px",
      "z-index:9999",
      "padding:9px 14px",
      "font:600 13px/1 'Inter', system-ui, sans-serif",
      "letter-spacing:0.02em",
      "color:#f5f7fb",
      "background:rgba(12, 15, 25, 0.88)",
      "border:1px solid rgba(255, 255, 255, 0.14)",
      "border-radius:10px",
      "cursor:pointer",
      "backdrop-filter:blur(10px)",
      "-webkit-backdrop-filter:blur(10px)",
      "box-shadow:0 4px 14px rgba(0,0,0,0.35)",
      "transition:background 120ms ease, border-color 120ms ease, transform 120ms ease"
    ].join(";");

    btn.addEventListener("mouseenter", function () {
      btn.style.background = "rgba(28, 33, 48, 0.95)";
      btn.style.borderColor = "rgba(255, 255, 255, 0.24)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.background = "rgba(12, 15, 25, 0.88)";
      btn.style.borderColor = "rgba(255, 255, 255, 0.14)";
    });
    btn.addEventListener("mousedown", function () {
      btn.style.transform = "translateY(1px)";
    });
    btn.addEventListener("mouseup", function () {
      btn.style.transform = "translateY(0)";
    });

    btn.addEventListener("click", function () {
      setLang(getLang() === "en" ? "zh" : "en");
      applyTranslations();
      updateButtonLabel();
    });

    document.body.appendChild(btn);
    updateButtonLabel();
  }

  function updateButtonLabel() {
    var btn = document.getElementById("rootLangToggle");
    if (!btn) return;
    // Button shows the language the user would switch TO.
    btn.textContent = getLang() === "en" ? "中文" : "EN";
  }

  function init() {
    createToggleButton();
    if (getLang() === "zh") applyTranslations();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
