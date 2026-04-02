(function () {
  "use strict";

  var KEY = "comp9001_study_progress";

  function getStore() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (err) {
      return {};
    }
  }

  function saveStore(store) {
    localStorage.setItem(KEY, JSON.stringify(store));
  }

  function chapterFromPath() {
    var match = window.location.pathname.match(/chapter(\d+)/);
    return match ? Number(match[1]) : null;
  }

  window.COMP9001_PROGRESS = {
    key: KEY,
    get: getStore,
    save: saveStore,
    markPage: function markPage(pageType) {
      var chapter = chapterFromPath();
      if (!chapter) return;
      var store = getStore();
      var chapterKey = "chapter" + chapter;
      if (!store[chapterKey]) store[chapterKey] = { pages: {}, quizzes: [] };
      store[chapterKey].pages[pageType] = Date.now();
      saveStore(store);
    },
    markQuiz: function markQuiz(chapter, correct, total) {
      var store = getStore();
      var chapterKey = "chapter" + chapter;
      if (!store[chapterKey]) store[chapterKey] = { pages: {}, quizzes: [] };
      store[chapterKey].quizzes.push({
        correct: correct,
        total: total,
        score: total ? Math.round((correct / total) * 100) : 0,
        timestamp: Date.now()
      });
      saveStore(store);
    }
  };
})();
