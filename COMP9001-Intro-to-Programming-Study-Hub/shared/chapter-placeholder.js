(function () {
  "use strict";

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

    nav.innerHTML = [
      ['hero', 'Overview'],
      ['sec-materials', 'Lecture Materials'],
      ['sec-concepts', 'Core Concepts'],
      ['sec-workflow', 'Study Workflow'],
      ['sec-build', 'Build Plan'],
      ['sec-next', 'Next Step']
    ].map(function (item, idx) {
      return '<li><a href="#' + item[0] + '" class="nav-link' + (idx === 0 ? ' active' : '') + '" data-section="' + item[0] + '">' + item[1] + '</a></li>';
    }).join("") +
    '<li style="margin-top:0.5rem; border-top:1px solid var(--border); padding-top:0.5rem;"><a href="chapter' + chapter.number + '-math.html" class="nav-link" style="color:var(--purple);">&#x1F4D0; Foundations</a></li>' +
    '<li><a href="chapter' + chapter.number + '-mindmap.html" class="nav-link" style="color:var(--green);">&#x1F5FA; Mind Map</a></li>' +
    '<li><a href="../../../tools/quiz-hub.html" class="nav-link" style="color:var(--accent);">&#x1F4DD; Quiz Hub</a></li>' +
    '<li><a href="../../../tools/flashcards.html" class="nav-link" style="color:#f97316;">&#x1F4E6; Flashcards</a></li>';

    main.innerHTML =
      '<section id="hero" class="section hero-section" data-track="hero">' +
        '<div class="hero-inner">' +
          '<p class="hero-course">COMP9001 — Intro to Programming</p>' +
          '<h1>Chapter ' + chapter.number + ': ' + chapter.title + '</h1>' +
          '<p class="hero-subtitle">' + chapter.summary + '</p>' +
          '<div class="hero-cards">' +
            '<div class="hero-card"><span class="hero-card-icon">&#x1F4D6;</span><span>Lecture review</span></div>' +
            '<div class="hero-card"><span class="hero-card-icon">&#x1F4A1;</span><span>Core ideas</span></div>' +
            '<div class="hero-card"><span class="hero-card-icon">&#x270D;</span><span>Checks & notes</span></div>' +
            '<div class="hero-card"><span class="hero-card-icon">&#x1F5FA;</span><span>Mind map</span></div>' +
          '</div>' +
          '<div style="margin-top: 2rem;">' +
            '<a href="chapter' + chapter.number + '-math.html" class="btn btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; padding: 0.75rem 2rem; font-size: 1rem;">&#x1F4D0; Foundations &rarr;</a>' +
            '<a href="chapter' + chapter.number + '-mindmap.html" class="btn btn-secondary" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; padding: 0.75rem 2rem; font-size: 1rem; margin-left:0.75rem;">&#x1F5FA; Mind Map &rarr;</a>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<section id="sec-materials" class="section" data-track="materials">' +
        '<h2 class="section-title">Lecture Materials</h2>' +
        '<div class="concept-box"><p>This chapter page is following the same site structure as the `x270` study pages. The full lecture-to-study-note extraction for this chapter is the next content pass, but the materials are already filed in the correct chapter folder.</p></div>' +
        '<div class="algo-card"><h3>Source PDFs</h3><div class="algo-facts">' +
          chapter.materials.map(function (material) {
            return '<a class="fact-pill blue" style="text-decoration:none;" href="../materials/' + material.file + '" target="_blank" rel="noreferrer">' + material.label + '</a>';
          }).join("") +
        '</div></div>' +
      '</section>' +
      '<section id="sec-concepts" class="section" data-track="concepts">' +
        '<h2 class="section-title">Core Concepts</h2>' +
        '<div class="toolkit-grid">' +
          chapter.concepts.map(function (concept) {
            return '<div class="toolkit-card"><div class="toolkit-front"><h4>' + concept + '</h4><p>Starter concept seed for Chapter ' + chapter.number + '. This is where the fully extracted study explanation will sit.</p><div class="flip-hint">Ready for expansion</div></div></div>';
          }).join("") +
        '</div>' +
      '</section>' +
      '<section id="sec-workflow" class="section" data-track="workflow">' +
        '<h2 class="section-title">Study Workflow</h2>' +
        '<div class="algo-block"><h4>Recommended pass for this chapter</h4><ol><li>Read the lecture PDF and identify the main topic headings.</li><li>Capture worked examples and code fragments.</li><li>Turn those into study sections, checks, flashcards, and quiz items.</li><li>Use the foundations page to rehearse definitions and syntax.</li></ol></div>' +
        '<div class="callout"><strong>Why this page looks different now:</strong> this chapter has been moved onto the same study-page shell as the `x270` site first, so the next pass can focus only on content extraction.</div>' +
      '</section>' +
      '<section id="sec-build" class="section" data-track="build-plan">' +
        '<h2 class="section-title">Build Plan</h2>' +
        '<div class="two-col"><div class="col-card"><h3>What is already done</h3><ul><li>Chapter folder and materials are in place</li><li>Study / foundations / mind map pages match the site family</li><li>Shared tools already link to this chapter</li></ul></div><div class="col-card"><h3>What comes next</h3><ul><li>Extract lecture structure from the PDF</li><li>Add explanation sections and code examples</li><li>Add chapter-specific quiz and flashcard items</li></ul></div></div>' +
      '</section>' +
      '<section id="sec-next" class="section" data-track="next">' +
        '<h2 class="section-title">Next Step</h2>' +
        '<div class="insight-box"><strong>Status:</strong> ' + chapter.status + '. This page is now visually aligned with the `x270` site structure and ready for a fuller content build.</div>' +
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

    toc.innerHTML = [
      ['sec-core', 'Core Reminder'],
      ['sec-terms', 'Key Terms'],
      ['sec-checks', 'Quick Checks'],
      ['sec-materials', 'Materials'],
      ['sec-next', 'Next Build Step']
    ].map(function (item, idx) {
      return '<li><a href="#' + item[0] + '" class="toc-link' + (idx === 0 ? ' active' : '') + '">' + item[1] + '</a></li>';
    }).join("");

    main.innerHTML =
      '<section class="section hero-section" id="sec-hero">' +
        '<div class="hero-inner">' +
          '<p class="hero-course">COMP9001 — Chapter ' + chapter.number + ' Supplement</p>' +
          '<h1>Foundations & Checks</h1>' +
          '<p class="hero-subtitle">A chapter companion page in the same format as the `x270` foundations pages. This one is currently a structured revision shell built from the chapter metadata and materials.</p>' +
        '</div>' +
      '</section>' +
      '<section class="section" id="sec-core">' +
        '<h2 class="section-title">Core Reminder</h2>' +
        '<div class="def-box"><div class="def-label">Chapter focus</div><p>' + chapter.summary + '</p></div>' +
      '</section>' +
      '<section class="section" id="sec-terms">' +
        '<h2 class="section-title">Key Terms</h2>' +
        '<div class="symbol-grid"><div class="sym-header">Item</div><div class="sym-header">Role</div><div class="sym-header">Use</div>' +
        chapter.concepts.slice(0, 6).map(function (concept) {
          return '<div class="sym-cell">' + concept + '</div><div class="sym-cell">Core idea</div><div class="sym-cell">Review this while reading the lecture slides</div>';
        }).join("") +
        '</div>' +
      '</section>' +
      '<section class="section" id="sec-checks">' +
        '<h2 class="section-title">Quick Checks</h2>' +
        chapter.checks.map(function (check, idx) {
          return '<div class="quick-check"><div class="qc-question">Check ' + (idx + 1) + ': ' + check + '</div><div class="qc-options"><div class="qc-opt" data-correct="true" data-good="Good. This is the exact kind of recall this page is meant to support." data-bad="Use this prompt as a self-check, then compare your answer to the lecture material.">I can answer this confidently</div><div class="qc-opt" data-correct="false" data-good="" data-bad="That is a useful signal: revisit the lecture PDF and chapter study page before moving on.">I need to review this</div></div><div class="qc-feedback"></div></div>';
        }).join("") +
      '</section>' +
      '<section class="section" id="sec-materials">' +
        '<h2 class="section-title">Materials</h2>' +
        '<div class="def-box example-box"><div class="def-label">Lecture file</div><p><a href="../materials/' + chapter.materials[0].file + '" target="_blank" rel="noreferrer" style="color:var(--accent); text-decoration:none;">Open ' + chapter.materials[0].label + '</a></p></div>' +
      '</section>' +
      '<section class="section" id="sec-next">' +
        '<h2 class="section-title">Next Build Step</h2>' +
        '<div class="def-box warning-box"><div class="def-label">Planned expansion</div><p>This page is ready to become a fuller chapter-specific foundations reference once the lecture’s exact examples, syntax points, and mini exercises are extracted.</p></div>' +
      '</section>';
  }

  function chapterMindmapData(chapter) {
    return {
      label: "Chapter " + chapter.number + ": " + chapter.title,
      color: "blue",
      children: [
        {
          label: "Core ideas",
          color: "blue",
          href: "chapter" + chapter.number + "-study.html#sec-concepts",
          children: chapter.concepts.slice(0, 6).map(function (concept) {
            return { label: concept };
          })
        },
        {
          label: "Materials",
          color: "green",
          href: "chapter" + chapter.number + "-study.html#sec-materials",
          children: chapter.materials.map(function (material) {
            return { label: material.label };
          })
        },
        {
          label: "Checks",
          color: "purple",
          href: "chapter" + chapter.number + "-math.html#sec-checks",
          children: chapter.checks.slice(0, 4).map(function (check, idx) {
            return { label: "Check " + (idx + 1) };
          })
        },
        {
          label: "Next content pass",
          color: "yellow",
          children: [
            { label: "extract slide sections" },
            { label: "add worked examples" },
            { label: "add flashcards and quiz items" }
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

  window.COMP9001_PLACEHOLDERS = {
    renderStudyPage: renderStudyPage,
    renderMathPage: renderMathPage,
    renderMindmapPage: renderMindmapPage
  };
})();
