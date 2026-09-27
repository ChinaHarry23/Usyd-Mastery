/**
 * shared/katex-loader.js — bootstrap KaTeX auto-render once the library loads.
 *
 * Replaces the ~17-line inline <script> block that was duplicated at the
 * bottom of every chapter HTML page (40+ copies). Every chapter page now
 * references this single file instead.
 *
 * Exposes window.renderKatex() for chapter-specific scripts that need to
 * re-render after dynamic DOM mutations (e.g. simulator output, tab switches).
 *
 * Load order: must come AFTER the KaTeX auto-render script tag but may be
 * placed anywhere in the document body.
 */
(function () {
  "use strict";

  function render() {
    if (typeof renderMathInElement === "function") {
      try {
        renderMathInElement(document.body, {
          delimiters: [
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false }
          ],
          throwOnError: false
        });
      } catch (e) { /* KaTeX parse error — non-fatal */ }
    } else {
      // KaTeX script may still be loading — retry shortly.
      setTimeout(render, 200);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }

  window.renderKatex = render;
})();
