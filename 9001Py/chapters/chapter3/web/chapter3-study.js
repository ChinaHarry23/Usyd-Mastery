(function () {
  "use strict";

  if (window.COMP9001_PROGRESS) {
    window.COMP9001_PROGRESS.markPage("study");
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.initComp9001ChapterUI) {
      window.initComp9001ChapterUI();
    }
    initConditionEvaluator();
    initFineTracer();
  });

  function initConditionEvaluator() {
    var container = document.getElementById("conditionButtons");
    var result = document.getElementById("conditionResult");
    if (!container || !result) return;

    var verdicts = [
      {
        value: true,
        why: "n is 15 and 15 < 20, so the comparison returns True."
      },
      {
        value: true,
        why: "and needs both operands True: x is True and n < 20 is True."
      },
      {
        value: true,
        why: "or needs only one True operand: y is False but x is True."
      },
      {
        value: false,
        why: "y is False, and n > 15 is also False because 15 is not greater than 15 — and fails on both counts."
      },
      {
        value: false,
        why: "(y or x) is True, but (y and n > 15) is False — and needs both sides True, so the slide's program never prints boo!."
      }
    ];

    var buttons = container.querySelectorAll("button[data-cond]");
    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener("click", function () {
        var idx = parseInt(button.getAttribute("data-cond"), 10);
        var verdict = verdicts[idx];
        if (!verdict) return;
        result.className = "quiz-result show " + (verdict.value ? "good" : "bad");
        result.textContent = button.textContent + "  →  " + (verdict.value ? "True. " : "False. ") + verdict.why;
      });
    });
  }

  function initFineTracer() {
    var container = document.getElementById("speedButtons");
    var result = document.getElementById("fineTraceResult");
    if (!container || !result) return;

    var thresholds = [
      { limit: 60, fine: 0 },
      { limit: 70, fine: 109 },
      { limit: 80, fine: 254 },
      { limit: 90, fine: 835 }
    ];

    var buttons = container.querySelectorAll("button[data-speed]");
    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener("click", function () {
        var speed = parseInt(button.getAttribute("data-speed"), 10);
        if (isNaN(speed)) return;
        var steps = [];
        var fine = null;
        for (var i = 0; i < thresholds.length; i++) {
          var label = (i === 0 ? "if" : "elif") + " speed <= " + thresholds[i].limit;
          if (speed <= thresholds[i].limit) {
            steps.push(label + " → True");
            fine = thresholds[i].fine;
            break;
          }
          steps.push(label + " → False");
        }
        if (fine === null) {
          steps.push("every condition False → else");
          fine = 2252;
        }
        result.className = "quiz-result show good";
        result.textContent = "speed = " + speed + ": " + steps.join("; ") + ". The chain stops there, so fine = " + fine + "." + (speed === -800 ? " Even a nonsense negative speed lands in the first branch — the chain does not validate input." : "");
      });
    });
  }
})();
