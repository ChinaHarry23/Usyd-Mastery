(function () {
  "use strict";

  function site() {
    return window.COMP9001_SITE || { chapters: [] };
  }

  function chapterNumberFromPath() {
    var match = window.location.pathname.match(/chapter(\d+)/);
    return match ? Number(match[1]) : null;
  }

  function getChapter(number) {
    return site().chapters.find(function (chapter) {
      return chapter.number === number;
    });
  }

  function chapterOrCurrent(number) {
    return getChapter(number || chapterNumberFromPath());
  }

  function materialLinks(chapter, prefix) {
    return chapter.materials.map(function (material) {
      return (
        '<a class="resource-link" href="' +
        prefix + material.file +
        '" target="_blank" rel="noreferrer">' +
        material.label +
        " ↗</a>"
      );
    }).join("");
  }

  function chips(items) {
    return items.map(function (item) {
      return '<span class="chip">' + item + "</span>";
    }).join("");
  }

  function renderHome() {
    var mount = document.getElementById("chaptersGrid");
    var toolMount = document.getElementById("toolsGrid");
    if (!mount || !toolMount) return;

    mount.innerHTML = site().chapters.map(function (chapter) {
      return (
        '<article class="chapter-card">' +
          '<span class="chapter-number">Chapter ' + chapter.number + "</span>" +
          '<h3>' + chapter.title + "</h3>" +
          "<p>" + chapter.summary + "</p>" +
          '<div class="resource-list">' + chips(chapter.concepts.slice(0, 3)) + "</div>" +
          '<div class="card-actions">' +
            '<a href="chapters/chapter' + chapter.number + "/web/chapter" + chapter.number + '-study.html">Study Guide</a>' +
            '<a href="chapters/chapter' + chapter.number + "/web/chapter" + chapter.number + '-math.html">Checks</a>' +
            '<a href="chapters/chapter' + chapter.number + "/web/chapter" + chapter.number + '-mindmap.html">Mind Map</a>' +
          "</div>" +
        "</article>"
      );
    }).join("");

    toolMount.innerHTML = [
      { title: "Knowledge Graph", href: "tools/knowledge-graph.html", text: "Cross-chapter topics and study paths." },
      { title: "Foundations Graph", href: "tools/math-knowledge-graph.html", text: "Programming building blocks and prerequisite links." },
      { title: "Quiz Hub", href: "tools/quiz-hub.html", text: "Starter self-check questions from the scaffolded chapters." },
      { title: "Flashcards", href: "tools/flashcards.html", text: "Quick revision prompts for the early lectures." },
      { title: "Progress Dashboard", href: "tools/progress-dashboard.html", text: "Local progress based on visited pages and quiz attempts." }
    ].map(function (tool) {
      return (
        '<article class="tool-card">' +
          "<h3>" + tool.title + "</h3>" +
          "<p>" + tool.text + "</p>" +
          '<div class="card-actions"><a href="' + tool.href + '">Open</a></div>' +
        "</article>"
      );
    }).join("");
  }

  function renderStudyPage(mountId) {
    var chapter = chapterOrCurrent();
    var mount = document.getElementById(mountId);
    if (!chapter || !mount) return;

    if (window.COMP9001_PROGRESS) {
      window.COMP9001_PROGRESS.markPage("study");
    }

    mount.innerHTML =
      '<section class="page-hero hero-card">' +
        '<span class="eyebrow">Chapter ' + chapter.number + "</span>" +
        "<h1>" + chapter.title + "</h1>" +
        "<p>" + chapter.summary + "</p>" +
        '<div class="hero-actions">' +
          '<a class="button" href="../materials/' + chapter.materials[0].file + '" target="_blank" rel="noreferrer">Open lecture PDF</a>' +
          '<a class="button secondary" href="chapter' + chapter.number + '-math.html">Foundations & checks</a>' +
          '<a class="button ghost" href="chapter' + chapter.number + '-mindmap.html">Mind map</a>' +
        "</div>" +
      "</section>" +
      '<section class="page-grid">' +
        '<div class="stack">' +
          '<article class="panel">' +
            "<h2>Ready-for-content study page</h2>" +
            "<p>This chapter is wired up and ready for the next pass where we turn the lecture PDF into structured notes, worked examples, and interactive exercises.</p>" +
            '<div class="resource-list">' + materialLinks(chapter, "../materials/") + "</div>" +
          "</article>" +
          '<article class="panel">' +
            "<h2>Suggested extraction checklist</h2>" +
            "<ol>" +
              "<li>Read the lecture PDF and identify the main concepts.</li>" +
              "<li>Turn examples and explanations into short study sections.</li>" +
              "<li>Add code snippets, quiz questions, and flashcards.</li>" +
              "<li>Refine the chapter summary and mind map once the content is extracted.</li>" +
            "</ol>" +
          "</article>" +
        "</div>" +
        '<aside class="stack">' +
          '<article class="panel">' +
            "<h3>Concept seeds</h3>" +
            '<div class="chip-list">' + chips(chapter.concepts) + "</div>" +
          "</article>" +
          '<article class="panel">' +
            "<h3>Status</h3>" +
            '<p class="note">' + chapter.status + "</p>" +
          "</article>" +
        "</aside>" +
      "</section>";
  }

  function renderMathPage(mountId) {
    var chapter = chapterOrCurrent();
    var mount = document.getElementById(mountId);
    if (!chapter || !mount) return;

    if (window.COMP9001_PROGRESS) {
      window.COMP9001_PROGRESS.markPage("checks");
    }

    mount.innerHTML =
      '<section class="page-hero hero-card">' +
        '<span class="eyebrow">Chapter ' + chapter.number + ' checks</span>' +
        "<h1>" + chapter.shortTitle + " Foundations</h1>" +
        "<p>Use this page as the companion practice area for syntax, reasoning, and quick self-check prompts.</p>" +
      "</section>" +
      '<section class="page-grid">' +
        '<div class="stack">' +
          '<article class="panel">' +
            "<h2>Quick checks</h2>" +
            "<ol>" +
              chapter.checks.map(function (check) { return "<li>" + check + "</li>"; }).join("") +
            "</ol>" +
          "</article>" +
          '<article class="panel">' +
            "<h2>How to use this page</h2>" +
            "<p>Answer these questions after reviewing the lecture PDF. When we expand the site later, this page can become the place for mini drills, Parsons problems, tracing exercises, or short coding tasks.</p>" +
          "</article>" +
        "</div>" +
        '<aside class="stack">' +
          '<article class="panel">' +
            "<h3>Materials</h3>" +
            '<div class="resource-list">' + materialLinks(chapter, "../materials/") + "</div>" +
          "</article>" +
        "</aside>" +
      "</section>";
  }

  function renderMindmapPage(mountId) {
    var chapter = chapterOrCurrent();
    var mount = document.getElementById(mountId);
    if (!chapter || !mount) return;

    if (window.COMP9001_PROGRESS) {
      window.COMP9001_PROGRESS.markPage("mindmap");
    }

    mount.innerHTML =
      '<section class="page-hero hero-card">' +
        '<span class="eyebrow">Chapter ' + chapter.number + ' map</span>' +
        "<h1>" + chapter.shortTitle + " Mind Map</h1>" +
        "<p>A compact concept view for the chapter. This can later grow into a richer interactive map.</p>" +
      "</section>" +
      '<section class="mindmap-wrap">' +
        '<article class="mindmap-card">' +
          "<h3>Concept structure</h3>" +
          '<div id="mindmapCanvas"></div>' +
        "</article>" +
      "</section>";

    if (window.renderSimpleMindmap) {
      window.renderSimpleMindmap("mindmapCanvas", chapter.mindmap);
    }
  }

  function renderKnowledgeGraph(mountId) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    mount.innerHTML = site().chapters.map(function (chapter) {
      return (
        '<article class="resource-card">' +
          '<span class="chapter-number">Chapter ' + chapter.number + "</span>" +
          "<h3>" + chapter.title + "</h3>" +
          "<p>" + chapter.summary + "</p>" +
          '<div class="chip-list">' + chips(chapter.concepts) + "</div>" +
          '<div class="card-actions"><a href="../chapters/chapter' + chapter.number + "/web/chapter" + chapter.number + '-study.html">Open chapter</a></div>' +
        "</article>"
      );
    }).join("");
  }

  function renderFoundationsGraph(mountId) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    mount.innerHTML = [
      { title: "Programming mindset", links: ["problem solving", "algorithms", "input / output"] },
      { title: "Data representation", links: ["variables", "assignment", "data types"] },
      { title: "Decision making", links: ["conditions", "comparisons", "branching"] },
      { title: "Repetition", links: ["for loops", "while loops", "termination"] }
    ].map(function (group) {
      return (
        '<article class="mindmap-card">' +
          "<h3>" + group.title + "</h3>" +
          '<div class="chip-list">' + chips(group.links) + "</div>" +
        "</article>"
      );
    }).join("");
  }

  function renderProgress(mountId) {
    var mount = document.getElementById(mountId);
    if (!mount || !window.COMP9001_PROGRESS) return;

    var store = window.COMP9001_PROGRESS.get();
    var totalPages = site().chapters.length * 3;
    var visitedPages = 0;
    var chapterCards = site().chapters.map(function (chapter) {
      var entry = store["chapter" + chapter.number] || { pages: {}, quizzes: [] };
      var pages = Object.keys(entry.pages || {});
      visitedPages += pages.length;
      var best = (entry.quizzes || []).reduce(function (acc, quiz) {
        return Math.max(acc, quiz.score || 0);
      }, 0);
      return (
        '<article class="metric-card">' +
          "<h3>Chapter " + chapter.number + ": " + chapter.shortTitle + "</h3>" +
          "<p>Visited pages: " + pages.length + " / 3</p>" +
          "<p>Best quiz score: " + best + "%</p>" +
        "</article>"
      );
    }).join("");

    var overall = totalPages ? Math.round((visitedPages / totalPages) * 100) : 0;
    mount.innerHTML =
      '<section class="metrics-grid grid">' +
        '<article class="metric-card">' +
          "<strong>" + overall + "%</strong>" +
          "<span>Page scaffold explored</span>" +
          '<div class="progress-bar"><div class="progress-fill" style="width:' + overall + '%"></div></div>' +
          "<p>" + visitedPages + " of " + totalPages + " chapter pages visited in this browser.</p>" +
        "</article>" +
        chapterCards +
      "</section>";
  }

  window.COMP9001_HUB = {
    site: site,
    getChapter: getChapter,
    renderHome: renderHome,
    renderStudyPage: renderStudyPage,
    renderMathPage: renderMathPage,
    renderMindmapPage: renderMindmapPage,
    renderKnowledgeGraph: renderKnowledgeGraph,
    renderFoundationsGraph: renderFoundationsGraph,
    renderProgress: renderProgress
  };
})();
