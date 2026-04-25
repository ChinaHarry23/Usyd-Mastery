(function () {
  "use strict";

  function getLang() {
    if (typeof window.getLang === "function") return window.getLang();
    return localStorage.getItem("comp9001_lang") || "en";
  }

  function isZh() { return getLang() === "zh"; }

  /* ── i18n strings used by the placeholder shells ─────────────────── */

  var UI = {
    en: {
      courseLine: "COMP9001 — Intro to Programming",
      chapterPrefix: "Chapter ",
      navOverview: "Overview",
      navMaterials: "Lecture Materials",
      navConcepts: "Core Concepts",
      navWorkflow: "Study Workflow",
      navBuild: "Build Plan",
      navNext: "Next Step",
      sideFoundations: "&#x1F4D0; Foundations",
      sideMindmap: "&#x1F5FA; Mind Map",
      sideQuiz: "&#x1F4DD; Quiz Hub",
      sideFc: "&#x1F4E6; Flashcards",
      cardLecture: "Lecture review",
      cardCore: "Core ideas",
      cardChecks: "Checks & notes",
      cardMindmap: "Mind map",
      btnFoundations: "&#x1F4D0; Foundations &rarr;",
      btnMindmap: "&#x1F5FA; Mind Map &rarr;",
      h2Materials: "Lecture Materials",
      pageStructureNote: "This chapter page is following the same site structure as the `x270` study pages. The full lecture-to-study-note extraction for this chapter is the next content pass, but the materials are already filed in the correct chapter folder.",
      h3SourcePdfs: "Source PDFs",
      h2Concepts: "Core Concepts",
      conceptSeed: "Starter concept seed for Chapter ",
      conceptTrail: ". This is where the fully extracted study explanation will sit.",
      flipHint: "Ready for expansion",
      h2Workflow: "Study Workflow",
      h4Recommended: "Recommended pass for this chapter",
      step1: "Read the lecture PDF and identify the main topic headings.",
      step2: "Capture worked examples and code fragments.",
      step3: "Turn those into study sections, checks, flashcards, and quiz items.",
      step4: "Use the foundations page to rehearse definitions and syntax.",
      whyDifferent: "<strong>Why this page looks different now:</strong> this chapter has been moved onto the same study-page shell as the `x270` site first, so the next pass can focus only on content extraction.",
      h2BuildPlan: "Build Plan",
      h3Done: "What is already done",
      doneA: "Chapter folder and materials are in place",
      doneB: "Study / foundations / mind map pages match the site family",
      doneC: "Shared tools already link to this chapter",
      h3Next: "What comes next",
      nextA: "Extract lecture structure from the PDF",
      nextB: "Add explanation sections and code examples",
      nextC: "Add chapter-specific quiz and flashcard items",
      h2NextStep: "Next Step",
      statusLabel: "Status:",
      statusTrail: ". This page is now visually aligned with the `x270` site structure and ready for a fuller content build.",
      // math page
      mathChapterSuffix: " Supplement",
      mathH1: "Foundations & Checks",
      mathHeroSub: "A chapter companion page in the same format as the `x270` foundations pages. This one is currently a structured revision shell built from the chapter metadata and materials.",
      mathTocCore: "Core Reminder",
      mathTocTerms: "Key Terms",
      mathTocChecks: "Quick Checks",
      mathTocMaterials: "Materials",
      mathTocNext: "Next Build Step",
      h2CoreReminder: "Core Reminder",
      defChapterFocus: "Chapter focus",
      h2KeyTerms: "Key Terms",
      symItem: "Item",
      symRole: "Role",
      symUse: "Use",
      symRoleVal: "Core idea",
      symUseVal: "Review this while reading the lecture slides",
      h2QuickChecks: "Quick Checks",
      checkPrefix: "Check ",
      qcGood1: "I can answer this confidently",
      qcGoodFb: "Good. This is the exact kind of recall this page is meant to support.",
      qcGoodBadFb: "Use this prompt as a self-check, then compare your answer to the lecture material.",
      qcReview: "I need to review this",
      qcReviewFb: "That is a useful signal: revisit the lecture PDF and chapter study page before moving on.",
      h2Materials2: "Materials",
      lectureFile: "Lecture file",
      open: "Open ",
      h2NextBuild: "Next Build Step",
      planned: "Planned expansion",
      plannedBody: "This page is ready to become a fuller chapter-specific foundations reference once the lecture\u2019s exact examples, syntax points, and mini exercises are extracted.",
      // mindmap node labels
      mmCore: "Core ideas",
      mmMaterials: "Materials",
      mmChecks: "Checks",
      mmCheck: "Check ",
      mmNext: "Next content pass",
      mmExtract: "extract slide sections",
      mmExamples: "add worked examples",
      mmFlash: "add flashcards and quiz items",
    },
    zh: {
      courseLine: "COMP9001 — 编程入门",
      chapterPrefix: "第 ",
      navOverview: "概览",
      navMaterials: "课程材料",
      navConcepts: "核心概念",
      navWorkflow: "学习流程",
      navBuild: "建设计划",
      navNext: "下一步",
      sideFoundations: "&#x1F4D0; 数学基础",
      sideMindmap: "&#x1F5FA; 思维导图",
      sideQuiz: "&#x1F4DD; 测验中心",
      sideFc: "&#x1F4E6; 闪卡",
      cardLecture: "讲稿复习",
      cardCore: "核心思想",
      cardChecks: "检查与笔记",
      cardMindmap: "思维导图",
      btnFoundations: "&#x1F4D0; 数学基础 &rarr;",
      btnMindmap: "&#x1F5FA; 思维导图 &rarr;",
      h2Materials: "课程材料",
      pageStructureNote: "本章页面采用与 `x270` 学习页相同的站点结构。完整的「讲稿到学习笔记」抽取将作为下一轮内容更新,目前材料已经归档在对应章节文件夹中。",
      h3SourcePdfs: "讲稿原文 PDF",
      h2Concepts: "核心概念",
      conceptSeed: "第 ",
      conceptTrail: " 章的概念种子。完整提取出来的学习讲解将会放在这里。",
      flipHint: "等待扩充",
      h2Workflow: "学习流程",
      h4Recommended: "本章推荐的学习顺序",
      step1: "阅读讲稿 PDF,识别主要的标题主题。",
      step2: "记录已写好的示例和代码片段。",
      step3: "把它们转化为学习小节、检查题、闪卡与测验题。",
      step4: "使用「数学基础」页面来复述定义与语法。",
      whyDifferent: "<strong>本页面为何看起来不同：</strong>本章已先迁移到与 `x270` 站点相同的学习页脚手架上,这样下一轮工作就可以专注于内容抽取。",
      h2BuildPlan: "建设计划",
      h3Done: "已经完成的工作",
      doneA: "章节文件夹与材料就位",
      doneB: "学习 / 基础 / 思维导图页面与站点风格一致",
      doneC: "共用的工具已经链接到本章",
      h3Next: "接下来要做的工作",
      nextA: "从 PDF 中抽取讲稿结构",
      nextB: "添加讲解段落与代码示例",
      nextC: "添加本章专属的测验题与闪卡",
      h2NextStep: "下一步",
      statusLabel: "状态:",
      statusTrail: "。本页面在视觉上已经与 `x270` 的站点结构对齐,准备好进行更完整的内容建设。",
      // math
      mathChapterSuffix: " 数学补充",
      mathH1: "数学基础与自检",
      mathHeroSub: "这是与 `x270` 数学基础页同款式的章节配套页面。目前是一份基于章节元数据与材料构建的结构化复习外壳。",
      mathTocCore: "核心要点",
      mathTocTerms: "关键术语",
      mathTocChecks: "快速自检",
      mathTocMaterials: "材料",
      mathTocNext: "下一步建设",
      h2CoreReminder: "核心要点",
      defChapterFocus: "章节焦点",
      h2KeyTerms: "关键术语",
      symItem: "项目",
      symRole: "角色",
      symUse: "用途",
      symRoleVal: "核心思想",
      symUseVal: "在阅读讲稿幻灯片时复习此项",
      h2QuickChecks: "快速自检",
      checkPrefix: "自检 ",
      qcGood1: "我能自信地回答",
      qcGoodFb: "很好。这正是本页希望支持的回忆方式。",
      qcGoodBadFb: "把这个问题作为自检,然后对照讲稿材料检查你的答案。",
      qcReview: "我需要复习",
      qcReviewFb: "这是一个有用的信号:在继续之前重新看一下讲稿 PDF 与本章学习页面。",
      h2Materials2: "材料",
      lectureFile: "讲稿文件",
      open: "打开 ",
      h2NextBuild: "下一步建设",
      planned: "计划中的扩充",
      plannedBody: "等讲稿中具体的示例、语法点与小练习被抽取出来后,本页可以发展为更完整的本章专属基础参考。",
      mmCore: "核心思想",
      mmMaterials: "材料",
      mmChecks: "自检",
      mmCheck: "自检 ",
      mmNext: "下一轮内容更新",
      mmExtract: "抽取幻灯片小节",
      mmExamples: "增加已解决的示例",
      mmFlash: "增加闪卡与测验题",
    },
  };

  function t() { return UI[isZh() ? "zh" : "en"]; }

  /* ── chapter-data accessors honour the active language ───────────── */

  function chapTitle(c) { return isZh() && c.titleZh ? c.titleZh : c.title; }
  function chapSummary(c) { return isZh() && c.summaryZh ? c.summaryZh : c.summary; }
  function chapStatus(c) { return isZh() && c.statusZh ? c.statusZh : c.status; }
  function chapConcepts(c) { return isZh() && c.conceptsZh ? c.conceptsZh : c.concepts; }
  function chapChecks(c) { return isZh() && c.checksZh ? c.checksZh : c.checks; }

  function getChapterNumber() {
    var match = window.location.pathname.match(/chapter(\d+)/);
    return match ? Number(match[1]) : null;
  }

  function getChapterData() {
    var number = getChapterNumber();
    var site = window.COMP9001_SITE || { chapters: [] };
    return site.chapters.find(function (chapter) {
      return chapter.number === number;
    });
  }

  function renderStudyPage() {
    var chapter = getChapterData();
    var nav = document.getElementById("placeholderNav");
    var main = document.getElementById("mainContent");
    if (!chapter || !nav || !main) return;

    if (window.COMP9001_PROGRESS) {
      window.COMP9001_PROGRESS.markPage("study");
    }
    var L = t();

    nav.innerHTML = [
      ['hero', L.navOverview],
      ['sec-materials', L.navMaterials],
      ['sec-concepts', L.navConcepts],
      ['sec-workflow', L.navWorkflow],
      ['sec-build', L.navBuild],
      ['sec-next', L.navNext]
    ].map(function (item, idx) {
      return '<li><a href="#' + item[0] + '" class="nav-link' + (idx === 0 ? ' active' : '') + '" data-section="' + item[0] + '">' + item[1] + '</a></li>';
    }).join("") +
    '<li style="margin-top:0.5rem; border-top:1px solid var(--border); padding-top:0.5rem;"><a href="chapter' + chapter.number + '-math.html" class="nav-link" style="color:var(--purple);">' + L.sideFoundations + '</a></li>' +
    '<li><a href="chapter' + chapter.number + '-mindmap.html" class="nav-link" style="color:var(--green);">' + L.sideMindmap + '</a></li>' +
    '<li><a href="../../../tools/quiz-hub.html" class="nav-link" style="color:var(--accent);">' + L.sideQuiz + '</a></li>' +
    '<li><a href="../../../tools/flashcards.html" class="nav-link" style="color:#f97316;">' + L.sideFc + '</a></li>';

    main.innerHTML =
      '<section id="hero" class="section hero-section" data-track="hero">' +
        '<div class="hero-inner">' +
          '<p class="hero-course">' + L.courseLine + '</p>' +
          '<h1>' + L.chapterPrefix + chapter.number + ': ' + chapTitle(chapter) + '</h1>' +
          '<p class="hero-subtitle">' + chapSummary(chapter) + '</p>' +
          '<div class="hero-cards">' +
            '<div class="hero-card"><span class="hero-card-icon">&#x1F4D6;</span><span>' + L.cardLecture + '</span></div>' +
            '<div class="hero-card"><span class="hero-card-icon">&#x1F4A1;</span><span>' + L.cardCore + '</span></div>' +
            '<div class="hero-card"><span class="hero-card-icon">&#x270D;</span><span>' + L.cardChecks + '</span></div>' +
            '<div class="hero-card"><span class="hero-card-icon">&#x1F5FA;</span><span>' + L.cardMindmap + '</span></div>' +
          '</div>' +
          '<div style="margin-top: 2rem;">' +
            '<a href="chapter' + chapter.number + '-math.html" class="btn btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; padding: 0.75rem 2rem; font-size: 1rem;">' + L.btnFoundations + '</a>' +
            '<a href="chapter' + chapter.number + '-mindmap.html" class="btn btn-secondary" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; padding: 0.75rem 2rem; font-size: 1rem; margin-left:0.75rem;">' + L.btnMindmap + '</a>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<section id="sec-materials" class="section" data-track="materials">' +
        '<h2 class="section-title">' + L.h2Materials + '</h2>' +
        '<div class="concept-box"><p>' + L.pageStructureNote + '</p></div>' +
        '<div class="algo-card"><h3>' + L.h3SourcePdfs + '</h3><div class="algo-facts">' +
          chapter.materials.map(function (material) {
            return '<a class="fact-pill blue" style="text-decoration:none;" href="../materials/' + material.file + '" target="_blank" rel="noreferrer">' + material.label + '</a>';
          }).join("") +
        '</div></div>' +
      '</section>' +
      '<section id="sec-concepts" class="section" data-track="concepts">' +
        '<h2 class="section-title">' + L.h2Concepts + '</h2>' +
        '<div class="toolkit-grid">' +
          chapConcepts(chapter).map(function (concept) {
            return '<div class="toolkit-card"><div class="toolkit-front"><h4>' + concept + '</h4><p>' + L.conceptSeed + chapter.number + L.conceptTrail + '</p><div class="flip-hint">' + L.flipHint + '</div></div></div>';
          }).join("") +
        '</div>' +
      '</section>' +
      '<section id="sec-workflow" class="section" data-track="workflow">' +
        '<h2 class="section-title">' + L.h2Workflow + '</h2>' +
        '<div class="algo-block"><h4>' + L.h4Recommended + '</h4><ol><li>' + L.step1 + '</li><li>' + L.step2 + '</li><li>' + L.step3 + '</li><li>' + L.step4 + '</li></ol></div>' +
        '<div class="callout">' + L.whyDifferent + '</div>' +
      '</section>' +
      '<section id="sec-build" class="section" data-track="build-plan">' +
        '<h2 class="section-title">' + L.h2BuildPlan + '</h2>' +
        '<div class="two-col"><div class="col-card"><h3>' + L.h3Done + '</h3><ul><li>' + L.doneA + '</li><li>' + L.doneB + '</li><li>' + L.doneC + '</li></ul></div><div class="col-card"><h3>' + L.h3Next + '</h3><ul><li>' + L.nextA + '</li><li>' + L.nextB + '</li><li>' + L.nextC + '</li></ul></div></div>' +
      '</section>' +
      '<section id="sec-next" class="section" data-track="next">' +
        '<h2 class="section-title">' + L.h2NextStep + '</h2>' +
        '<div class="insight-box"><strong>' + L.statusLabel + '</strong> ' + chapStatus(chapter) + L.statusTrail + '</div>' +
      '</section>';
  }

  function renderMathPage() {
    var chapter = getChapterData();
    var toc = document.getElementById("placeholderToc");
    var main = document.getElementById("mainContent");
    if (!chapter || !toc || !main) return;

    if (window.COMP9001_PROGRESS) {
      window.COMP9001_PROGRESS.markPage("checks");
    }
    var L = t();

    toc.innerHTML = [
      ['sec-core', L.mathTocCore],
      ['sec-terms', L.mathTocTerms],
      ['sec-checks', L.mathTocChecks],
      ['sec-materials', L.mathTocMaterials],
      ['sec-next', L.mathTocNext]
    ].map(function (item, idx) {
      return '<li><a href="#' + item[0] + '" class="toc-link' + (idx === 0 ? ' active' : '') + '">' + item[1] + '</a></li>';
    }).join("");

    main.innerHTML =
      '<section class="section hero-section" id="sec-hero">' +
        '<div class="hero-inner">' +
          '<p class="hero-course">' + L.courseLine + ' \u2014 ' + L.chapterPrefix + chapter.number + L.mathChapterSuffix + '</p>' +
          '<h1>' + L.mathH1 + '</h1>' +
          '<p class="hero-subtitle">' + L.mathHeroSub + '</p>' +
        '</div>' +
      '</section>' +
      '<section class="section" id="sec-core">' +
        '<h2 class="section-title">' + L.h2CoreReminder + '</h2>' +
        '<div class="def-box"><div class="def-label">' + L.defChapterFocus + '</div><p>' + chapSummary(chapter) + '</p></div>' +
      '</section>' +
      '<section class="section" id="sec-terms">' +
        '<h2 class="section-title">' + L.h2KeyTerms + '</h2>' +
        '<div class="symbol-grid"><div class="sym-header">' + L.symItem + '</div><div class="sym-header">' + L.symRole + '</div><div class="sym-header">' + L.symUse + '</div>' +
        chapConcepts(chapter).slice(0, 6).map(function (concept) {
          return '<div class="sym-cell">' + concept + '</div><div class="sym-cell">' + L.symRoleVal + '</div><div class="sym-cell">' + L.symUseVal + '</div>';
        }).join("") +
        '</div>' +
      '</section>' +
      '<section class="section" id="sec-checks">' +
        '<h2 class="section-title">' + L.h2QuickChecks + '</h2>' +
        chapChecks(chapter).map(function (check, idx) {
          return '<div class="quick-check"><div class="qc-question">' + L.checkPrefix + (idx + 1) + ': ' + check + '</div><div class="qc-options"><div class="qc-opt" data-correct="true" data-good="' + L.qcGoodFb + '" data-bad="' + L.qcGoodBadFb + '">' + L.qcGood1 + '</div><div class="qc-opt" data-correct="false" data-good="" data-bad="' + L.qcReviewFb + '">' + L.qcReview + '</div></div><div class="qc-feedback"></div></div>';
        }).join("") +
      '</section>' +
      '<section class="section" id="sec-materials">' +
        '<h2 class="section-title">' + L.h2Materials2 + '</h2>' +
        '<div class="def-box example-box"><div class="def-label">' + L.lectureFile + '</div><p><a href="../materials/' + chapter.materials[0].file + '" target="_blank" rel="noreferrer" style="color:var(--accent); text-decoration:none;">' + L.open + chapter.materials[0].label + '</a></p></div>' +
      '</section>' +
      '<section class="section" id="sec-next">' +
        '<h2 class="section-title">' + L.h2NextStep + '</h2>' +
        '<div class="def-box warning-box"><div class="def-label">' + L.planned + '</div><p>' + L.plannedBody + '</p></div>' +
      '</section>';
  }

  function chapterMindmapData(chapter) {
    var L = t();
    return {
      label: L.chapterPrefix + chapter.number + ": " + chapTitle(chapter),
      color: "blue",
      children: [
        {
          label: L.mmCore,
          color: "blue",
          href: "chapter" + chapter.number + "-study.html#sec-concepts",
          children: chapConcepts(chapter).slice(0, 6).map(function (concept) {
            return { label: concept };
          })
        },
        {
          label: L.mmMaterials,
          color: "green",
          href: "chapter" + chapter.number + "-study.html#sec-materials",
          children: chapter.materials.map(function (material) {
            return { label: material.label };
          })
        },
        {
          label: L.mmChecks,
          color: "purple",
          href: "chapter" + chapter.number + "-math.html#sec-checks",
          children: chapChecks(chapter).slice(0, 4).map(function (check, idx) {
            return { label: L.mmCheck + (idx + 1) };
          })
        },
        {
          label: L.mmNext,
          color: "yellow",
          children: [
            { label: L.mmExtract },
            { label: L.mmExamples },
            { label: L.mmFlash }
          ]
        }
      ]
    };
  }

  function renderMindmapPage() {
    var chapter = getChapterData();
    if (!chapter) return;
    if (window.COMP9001_PROGRESS) {
      window.COMP9001_PROGRESS.markPage("mindmap");
    }
    if (typeof window.renderMindmap === "function") {
      window.renderMindmap("mindmapCanvas", chapterMindmapData(chapter));
    }
  }

  /* ── re-render on language change so the placeholder shells update */
  function bindLangRerender(renderer) {
    window.addEventListener("langchange", function () {
      try { renderer(); } catch (e) { /* ignore */ }
    });
  }

  bindLangRerender(renderStudyPage);
  bindLangRerender(renderMathPage);
  bindLangRerender(renderMindmapPage);

  window.COMP9001_PLACEHOLDERS = {
    renderStudyPage: renderStudyPage,
    renderMathPage: renderMathPage,
    renderMindmapPage: renderMindmapPage
  };
})();
