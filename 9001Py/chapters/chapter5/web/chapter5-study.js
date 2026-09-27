(function () {
  "use strict";

  if (window.COMP9001_PROGRESS) {
    window.COMP9001_PROGRESS.markPage("study");
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.initComp9001ChapterUI) {
      window.initComp9001ChapterUI();
    }
    initLoopTracer();
    initTraceReveal();
  });

  function initLoopTracer() {
    var stepBtn = document.getElementById("btnTraceStep");
    var resetBtn = document.getElementById("btnTraceReset");
    var log = document.getElementById("traceLog");
    var feedback = document.getElementById("traceFeedback");
    if (!stepBtn || !resetBtn || !log || !feedback) return;

    var steps = [];
    var round;
    for (round = 1; round <= 5; round++) {
      steps.push(
        "i = " + round + " — test i <= 5 is True — body prints \"Round " + round +
        ": RUN!!!\" — modify sets i to " + (round + 1)
      );
    }
    steps.push("i = 6 — test i <= 5 is False — the loop exits");
    steps.push("After the loop: print(f\"Round {i}: Stop!\") uses i = 6 and prints \"Round 6: Stop!\"");

    var position = 0;

    stepBtn.addEventListener("click", function () {
      if (position >= steps.length) return;
      var item = document.createElement("li");
      item.textContent = steps[position];
      log.appendChild(item);
      position += 1;
      if (position === steps.length) {
        feedback.className = "quiz-result show good";
        feedback.textContent = "Trace complete. Five RUN lines, one failed test, and the Stop line uses the surviving value i = 6 — exactly the lecture's flowchart walk.";
      }
    });

    resetBtn.addEventListener("click", function () {
      position = 0;
      log.innerHTML = "";
      feedback.className = "quiz-result";
      feedback.textContent = "";
    });
  }

  function initTraceReveal() {
    var reveal = document.getElementById("btnRevealTrace");
    var hide = document.getElementById("btnHideTrace");
    var panel = document.getElementById("tracePanel");
    if (!reveal || !hide || !panel) return;

    reveal.addEventListener("click", function () {
      panel.classList.add("open");
    });

    hide.addEventListener("click", function () {
      panel.classList.remove("open");
    });
  }
})();
