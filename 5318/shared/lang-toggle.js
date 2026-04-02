(function () {
  "use strict";

  var LANG_KEY = "comp5318_lang";
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

  var COMMON = {
    nav_home: "&larr; 课程主页",
    math_back_study: "&larr; 返回学习指南",
    math_back_home: "&larr; 课程主页",
    math_label_bar: "数学基础",
    progress_label: "学习进度",
    link_math: "&#x1F4D0; 数学基础",
    link_mindmap: "&#x1F5FA; 思维导图",
    link_kg: "&#x1F578; 知识图谱",
    link_mkg: "&#x1F4D0; 数学知识图谱",
    link_fc: "&#x1F4E6; 闪卡",
    nav_quiz_hub: "测验中心",
    quiz_callout_title: "本章测验",
    quiz_callout_body:
      "本章的自测与数学习题已统一到测验中心。可选择练习或考试模式。",
    quiz_callout_btn: "打开测验中心",
    flash_callout_btn: "本章闪卡",
  };

  var CH = {
    "1": {
      math_hero: "COMP5318 — 第1周数学补充",
      math_h1: "数学基础（第1周）",
      math_sub: "矩阵布局、轴、均值/方差与点积——与 NumPy、pandas 及后续模型记号对齐。",
      hero_course: "COMP5318 — 应用机器学习",
      hero_title: "第1周：Python、NumPy 与 Pandas",
      hero_subtitle:
        "复习 Python 核心语法、NumPy 向量化与 pandas DataFrame，并结合 ML1 讲义中的数据、数据挖掘流程与学习范式，为后续实验打基础。",
      sidebar_h2: "第1周",
      nav_overview: "概览",
      nav_materials: "课程资料",
      nav_ml: "ML 与数据挖掘",
      nav_python: "Python 要点",
      nav_numpy: "NumPy",
      nav_pandas: "pandas",
      nav_workflow: "实验流程",
      sec_ml_title: "机器学习、数据与数据挖掘流程",
      sec_ml_lead:
        "与 ML1 周一致：数据无处不在；实例由属性描述；数据挖掘是在大数据中提取模式的过程。",
      sec_mat_title: "矩阵与数据布局",
      sec_stat_title: "均值、方差与无偏估计",
      sec_cov_title: "协方差与相关性（预习）",
    },
    "2": {
      math_hero: "COMP5318 — 第2周数学补充",
      math_h1: "数学基础（第2周）",
      math_sub: "距离、范数与训练/测试划分的数学含义。",
      hero_course: "COMP5318 — 应用机器学习",
      hero_title: "第2周：k 近邻分类",
      hero_subtitle:
        "基于距离的非参数分类器：多数表决、训练/测试划分与特征归一化。",
      sidebar_h2: "第2周",
      nav_overview: "概览",
      nav_materials: "课程资料",
      nav_knn: "k-NN 思想",
      nav_split: "训练与测试",
      nav_norm: "归一化",
      nav_rules: "1R 与 PRISM",
      nav_tutorial: "思考题",
    },
    "3": {
      math_hero: "COMP5318 — 第3周数学补充",
      math_h1: "数学基础（第3周）",
      math_sub: "最小二乘、正则化与对数几率（logit）。",
      hero_course: "COMP5318 — 应用机器学习",
      hero_title: "第3周：线性回归与逻辑回归",
      hero_subtitle:
        "最小二乘、Ridge/Lasso 正则化，以及用于分类的逻辑回归与交叉熵。",
      sidebar_h2: "第3周",
      nav_overview: "概览",
      nav_materials: "课程资料",
      nav_linear: "线性回归",
      nav_reg: "正则化",
      nav_logistic: "逻辑回归",
      nav_tutorial: "思考题",
    },
    "4": {
      math_hero: "COMP5318 — 第4周数学补充",
      math_h1: "数学基础（第4周）",
      math_sub: "贝叶斯公式、混淆矩阵与交叉验证。",
      hero_course: "COMP5318 — 应用机器学习",
      hero_title: "第4周：朴素贝叶斯与模型评估",
      hero_subtitle:
        "生成式分类、混淆矩阵与精确率/召回率，以及交叉验证与网格搜索。",
      sidebar_h2: "第4周",
      nav_overview: "概览",
      nav_materials: "课程资料",
      nav_nb: "朴素贝叶斯",
      nav_metrics: "评估指标",
      nav_cv: "交叉验证与调参",
      nav_tutorial: "思考题",
    },
    "5": {
      math_hero: "COMP5318 — 第5周数学补充",
      math_h1: "数学基础（第5周）",
      math_sub: "不纯度、方差与集成方差约简。",
      hero_course: "COMP5318 — 应用机器学习",
      hero_title: "第5周：决策树与集成方法",
      hero_subtitle:
        "树模型、不纯度、剪枝，以及 Bagging、随机森林与 Boosting。",
      sidebar_h2: "第5周",
      nav_overview: "概览",
      nav_materials: "课程资料",
      nav_trees: "决策树",
      nav_ens: "集成学习",
      nav_tutorial: "思考题",
    },
    "6": {
      math_hero: "COMP5318 — 第6周数学补充",
      math_h1: "数学基础（第6周）",
      math_sub: "间隔、核与特征值/主成分。",
      hero_course: "COMP5318 — 应用机器学习",
      hero_title: "第6周：SVM 与降维（PCA）",
      hero_subtitle:
        "最大间隔分类、核技巧，以及主成分分析与方差解释。",
      sidebar_h2: "第6周",
      nav_overview: "概览",
      nav_materials: "课程资料",
      nav_svm: "支持向量机",
      nav_pca: "PCA",
      nav_tutorial: "思考题",
    },
  };

  var MINDMAP_UI = {
    "1": {
      title: "第1周思维导图",
      study: "← 学习指南",
      math: "数学基础",
      home: "🏠 主页",
      expand: "全部展开",
      collapse: "全部收起",
      legend: ["核心", "工具", "数据"],
    },
    "2": {
      title: "第2周思维导图",
      study: "← 学习指南",
      math: "数学基础",
      home: "🏠 主页",
      expand: "全部展开",
      collapse: "全部收起",
      legend: ["k-NN", "数据"],
    },
    "3": {
      title: "第3周思维导图",
      study: "← 学习指南",
      math: "数学基础",
      home: "🏠 主页",
      expand: "全部展开",
      collapse: "全部收起",
    },
    "4": {
      title: "第4周思维导图",
      study: "← 学习指南",
      math: "数学基础",
      home: "🏠 主页",
      expand: "全部展开",
      collapse: "全部收起",
    },
    "5": {
      title: "第5周思维导图",
      study: "← 学习指南",
      math: "数学基础",
      home: "🏠 主页",
      expand: "全部展开",
      collapse: "全部收起",
    },
    "6": {
      title: "第6周思维导图",
      study: "← 学习指南",
      math: "数学基础",
      home: "🏠 主页",
      expand: "全部展开",
      collapse: "全部收起",
    },
  };

  function applySectionTranslations() {
    var pageKey = getPageKey();
    var pack =
      window.COMP5318_SECTION_TRANSLATIONS &&
      window.COMP5318_SECTION_TRANSLATIONS[pageKey];
    if (!pack) return;

    if (savedTitle === null) savedTitle = document.title;
    document.title = lang === "zh" && pack.title ? pack.title : savedTitle;

    Object.keys(pack.sections || {}).forEach(function (sectionId) {
      var section = document.getElementById(sectionId);
      if (!section) return;
      var saveKey = pageKey + "##" + sectionId;
      if (!(saveKey in savedSections)) {
        savedSections[saveKey] = section.innerHTML;
      }
      section.innerHTML =
        lang === "zh" ? pack.sections[sectionId] : savedSections[saveKey];
    });

    window.dispatchEvent(
      new CustomEvent("comp5318-content-refresh", {
        detail: { lang: lang, page: pageKey },
      })
    );
  }

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

    applySectionTranslations();

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
