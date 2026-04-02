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

  document.querySelectorAll(".quick-check").forEach(function (qc) {
    var correctIdx = parseInt(qc.dataset.answer, 10);
    var feedback = qc.querySelector(".qc-feedback");

    qc.querySelectorAll(".qc-opt").forEach(function (opt) {
      opt.addEventListener("click", function () {
        var idx = parseInt(opt.dataset.idx, 10);

        qc.querySelectorAll(".qc-opt").forEach(function (o) {
          o.classList.add("chosen");
          if (parseInt(o.dataset.idx, 10) === correctIdx) o.classList.add("right");
          else o.classList.add("not-right");
        });

        if (!feedback) return;
        var explanation = qc.dataset.explanation || "";

        if (idx === correctIdx) {
          feedback.textContent = "Correct! " + explanation;
          feedback.className = "qc-feedback show correct-fb";
        } else {
          feedback.textContent = "Not quite. " + explanation;
          feedback.className = "qc-feedback show wrong-fb";
        }
        renderMath();
      });
    });
  });
})();
