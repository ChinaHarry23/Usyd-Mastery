(function () {
  "use strict";

  function renderMath() {
    if (typeof renderMathInElement === "function") {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
      });
    }
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          document.querySelectorAll(".toc-link").forEach(function (l) {
            l.classList.toggle(
              "active",
              l.getAttribute("href") === "#" + e.target.id
            );
          });
        }
      });
    },
    { rootMargin: "-15% 0px -70% 0px" }
  );

  function bindMathPageContent() {
    observer.disconnect();
    document.querySelectorAll(".section[id]").forEach(function (s) {
      observer.observe(s);
    });
    document.querySelectorAll(".proof-toggle").forEach(function (btn) {
      if (btn.dataset.boundProof) return;
      btn.dataset.boundProof = "1";
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.dataset.target);
        if (!target) return;
        target.classList.toggle("open");
        btn.classList.toggle("open");
        renderMath();
      });
    });
  }

  bindMathPageContent();
  window.addEventListener("comp5318-content-refresh", bindMathPageContent);
  window.addEventListener("load", renderMath);
  setTimeout(renderMath, 400);
  setTimeout(renderMath, 1200);
})();
