(function () {
  "use strict";

  window.nextFlashcardIndex = function nextFlashcardIndex(current, total) {
    if (!total) return 0;
    return (current + 1) % total;
  };

  window.prevFlashcardIndex = function prevFlashcardIndex(current, total) {
    if (!total) return 0;
    return (current - 1 + total) % total;
  };
})();
