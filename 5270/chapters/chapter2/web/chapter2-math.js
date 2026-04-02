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

  // ========== TOC SCROLL SPY ==========
  var tocLinks = document.querySelectorAll(".toc-link");
  var allSections = document.querySelectorAll(".section[id]");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          tocLinks.forEach(function (l) {
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
  allSections.forEach(function (s) {
    observer.observe(s);
  });

  // ========== PROOF TOGGLES ==========
  document.querySelectorAll(".proof-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.dataset.target);
      target.classList.toggle("open");
      btn.classList.toggle("open");
      renderMath();
    });
  });

  // ========== QUICK-CHECK INLINE QUIZZES ==========
  document.querySelectorAll(".quick-check").forEach(function (qc) {
    var correctIdx = parseInt(qc.dataset.answer);
    var feedback = qc.querySelector(".qc-feedback");

    qc.querySelectorAll(".qc-opt").forEach(function (opt) {
      opt.addEventListener("click", function () {
        var idx = parseInt(opt.dataset.idx);
        qc.querySelectorAll(".qc-opt").forEach(function (o) {
          o.classList.add("chosen");
          if (parseInt(o.dataset.idx) === correctIdx) o.classList.add("right");
          else o.classList.add("not-right");
        });
        var zh =
          typeof getLang === "function" && getLang() === "zh";
        var explanation =
          zh && qc.dataset.explanationZh
            ? qc.dataset.explanationZh
            : qc.dataset.explanation;
        if (idx === correctIdx) {
          feedback.textContent = (zh ? "正确！" : "Correct! ") + explanation;
          feedback.className = "qc-feedback show correct-fb";
        } else {
          feedback.textContent = (zh ? "再想想。" : "Not quite. ") + explanation;
          feedback.className = "qc-feedback show wrong-fb";
        }
        renderMath();
      });
    });
  });

  window.addEventListener("load", renderMath);
  setTimeout(renderMath, 500);
  setTimeout(renderMath, 1500);
})();
