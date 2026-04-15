/* Root-portal behavior. Extracted from inline <script> in index.html
   so the root page can adopt a stricter CSP without 'unsafe-inline'. */
(function () {
  "use strict";

  document.querySelectorAll(".course-card").forEach(function (card) {
    var bg = card.querySelector(".card-bg");
    if (!bg) return;
    var origBg = getComputedStyle(bg).background;
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      bg.style.background =
        "radial-gradient(circle at " + x + "% " + y + "%, rgba(255,255,255,0.04), transparent 40%)," +
        origBg;
    });
    card.addEventListener("mouseleave", function () {
      bg.style.background = origBg;
    });
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(function () {});
  }
})();
