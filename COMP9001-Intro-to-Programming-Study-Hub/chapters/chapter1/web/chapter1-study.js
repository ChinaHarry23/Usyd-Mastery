(function () {
  "use strict";

  if (window.COMP9001_PROGRESS) {
    window.COMP9001_PROGRESS.markPage("study");
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.initComp9001ChapterUI) {
      window.initComp9001ChapterUI();
    }
    initSequenceChallenge();
    initOutputReveal();
  });

  function initSequenceChallenge() {
    var steps = [
      "Select Join",
      "Launch Zoom",
      "Turn on the computer",
      "Select the COMP9001 Canvas site",
      "Enter the Canvas URL",
      "Launch a web browser"
    ];
    var correct = [
      "Turn on the computer",
      "Launch a web browser",
      "Enter the Canvas URL",
      "Select the COMP9001 Canvas site",
      "Launch Zoom",
      "Select Join"
    ];

    var pool = document.getElementById("sequencePool");
    var chosen = document.getElementById("sequenceChosen");
    var feedback = document.getElementById("sequenceFeedback");
    var checkBtn = document.getElementById("btnCheckSequence");
    var resetBtn = document.getElementById("btnResetSequence");
    if (!pool || !chosen || !feedback || !checkBtn || !resetBtn) return;

    var current = [];

    function renderPool() {
      pool.innerHTML = "";
      steps.forEach(function (step) {
        var used = current.indexOf(step) !== -1;
        var button = document.createElement("button");
        button.type = "button";
        button.className = "btn " + (used ? "btn-secondary" : "btn-outline");
        button.style.padding = "0.4rem 0.75rem";
        button.textContent = step;
        button.disabled = used;
        button.addEventListener("click", function () {
          current.push(step);
          renderChosen();
          renderPool();
        });
        pool.appendChild(button);
      });
    }

    function renderChosen() {
      chosen.innerHTML = current.map(function (step) {
        return "<li>" + step + "</li>";
      }).join("");
    }

    checkBtn.addEventListener("click", function () {
      if (current.length !== correct.length) {
        feedback.className = "quiz-result show bad";
        feedback.textContent = "Add all six steps before checking the sequence.";
        return;
      }
      var ok = current.every(function (step, idx) {
        return step === correct[idx];
      });
      feedback.className = "quiz-result show " + (ok ? "good" : "bad");
      feedback.textContent = ok
        ? "Correct. The lecture uses examples like this to show that programming begins with executable order."
        : "Not quite. Think about prerequisites first: you need the computer on before browsing, and the course site before joining from it.";
    });

    resetBtn.addEventListener("click", function () {
      current = [];
      feedback.className = "quiz-result";
      feedback.textContent = "";
      renderChosen();
      renderPool();
    });

    renderPool();
  }

  function initOutputReveal() {
    var reveal = document.getElementById("btnRevealOutput");
    var hide = document.getElementById("btnHideOutput");
    var panel = document.getElementById("outputPanel");
    if (!reveal || !hide || !panel) return;

    reveal.addEventListener("click", function () {
      panel.classList.add("open");
    });

    hide.addEventListener("click", function () {
      panel.classList.remove("open");
    });
  }
})();
