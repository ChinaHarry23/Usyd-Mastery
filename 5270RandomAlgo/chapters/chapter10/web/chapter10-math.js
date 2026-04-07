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

  var sidebar = document.getElementById("sidebar");
  var sidebarToggle = document.getElementById("sidebarToggle");
  var mainContent = document.getElementById("mainContent");
  if (sidebarToggle && sidebar && mainContent) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      mainContent.classList.toggle("sidebar-open");
    });
  }

  var navLinks = document.querySelectorAll(".toc-link, .nav-link");
  var allSections = document.querySelectorAll("section[id]");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id);
          });
        }
      });
    },
    { rootMargin: "-15% 0px -70% 0px" }
  );
  allSections.forEach(function (s) { observer.observe(s); });

  document.querySelectorAll(".proof-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.dataset.target);
      if (target) { target.classList.toggle("open"); btn.classList.toggle("open"); renderMath(); }
    });
  });

  document.querySelectorAll(".quick-check").forEach(function (qc) {
    var correctIdx = parseInt(qc.dataset.answer);
    var feedback = qc.querySelector(".qc-feedback");
    qc.querySelectorAll(".qc-opt").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.dataset.idx);
        qc.querySelectorAll(".qc-opt").forEach(function (b) {
          b.classList.add("chosen");
          if (parseInt(b.dataset.idx) === correctIdx) b.classList.add("right");
          else b.classList.add("not-right");
        });
        var zh = typeof getLang === "function" && getLang() === "zh";
        var explanation = zh && qc.dataset.explanationZh ? qc.dataset.explanationZh : qc.dataset.explanation;
        if (idx === correctIdx) {
          feedback.textContent = (zh ? "\u6b63\u786e\uff01" : "Correct! ") + explanation;
          feedback.className = "qc-feedback show correct-fb";
        } else {
          feedback.textContent = (zh ? "\u518d\u60f3\u60f3\u3002" : "Not quite. ") + explanation;
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
