(function () {
  "use strict";

  if (window.COMP9001_PROGRESS) {
    window.COMP9001_PROGRESS.markPage("study");
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.initComp9001ChapterUI) {
      window.initComp9001ChapterUI();
    }
    initIdentifierInspector();
    initWetEvaluator();
  });

  function initIdentifierInspector() {
    var candidates = [
      {
        name: "num",
        verdict: "Valid",
        note: "Starts with a letter, has no spaces, and is not a reserved keyword."
      },
      {
        name: "5th_person",
        verdict: "Invalid",
        note: "Variable names must start with a letter — they cannot start with numbers."
      },
      {
        name: "mass_obj2",
        verdict: "Valid",
        note: "Lowercase words separated by underscores is exactly the readable style the lecture recommends. Digits are fine after the first character."
      },
      {
        name: "\\tallest",
        verdict: "Invalid",
        note: "A backslash is not a letter, so it cannot appear in an identifier."
      },
      {
        name: "_C",
        verdict: "Runs, but discouraged",
        note: "Python itself accepts a leading underscore, but the lecture's rules say to start with a letter and to name variables after the purpose of the value."
      },
      {
        name: "list",
        verdict: "Runs, but discouraged",
        note: "list already exists as a Python object attached to a built-in function — the lecture says avoid reusing such names because you would shadow it."
      }
    ];

    var pool = document.getElementById("namePool");
    var panel = document.getElementById("nameVerdict");
    var resetBtn = document.getElementById("btnResetNames");
    if (!pool || !panel || !resetBtn) return;

    function renderPool() {
      pool.innerHTML = "";
      candidates.forEach(function (candidate) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-outline";
        button.style.padding = "0.4rem 0.75rem";
        button.style.fontFamily = "var(--font-mono)";
        button.textContent = candidate.name;
        button.addEventListener("click", function () {
          button.className = "btn btn-secondary";
          button.style.padding = "0.4rem 0.75rem";
          panel.classList.add("open");
          panel.innerHTML = "";
          var line = document.createElement("p");
          var code = document.createElement("code");
          code.textContent = candidate.name;
          var strong = document.createElement("strong");
          strong.textContent = " — " + candidate.verdict + ". ";
          line.appendChild(code);
          line.appendChild(strong);
          line.appendChild(document.createTextNode(candidate.note));
          panel.appendChild(line);
        });
        pool.appendChild(button);
      });
    }

    resetBtn.addEventListener("click", function () {
      panel.classList.remove("open");
      panel.innerHTML = "";
      renderPool();
    });

    renderPool();
  }

  function initWetEvaluator() {
    var rainBtn = document.getElementById("btnToggleRain");
    var umbrellaBtn = document.getElementById("btnToggleUmbrella");
    var evalBtn = document.getElementById("btnEvalWet");
    var panel = document.getElementById("wetPanel");
    if (!rainBtn || !umbrellaBtn || !evalBtn || !panel) return;

    var isRaining = false;
    var haveUmbrella = false;

    function pyBool(value) {
      return value ? "True" : "False";
    }

    function renderLabels() {
      rainBtn.textContent = "is_raining = " + pyBool(isRaining);
      umbrellaBtn.textContent = "have_umbrella = " + pyBool(haveUmbrella);
    }

    rainBtn.addEventListener("click", function () {
      isRaining = !isRaining;
      renderLabels();
    });

    umbrellaBtn.addEventListener("click", function () {
      haveUmbrella = !haveUmbrella;
      renderLabels();
    });

    evalBtn.addEventListener("click", function () {
      var isWet = isRaining && !haveUmbrella;
      var explanation;
      if (isWet) {
        explanation = "It is raining and there is no umbrella, so is_wet is True — the only row of the truth table where the and expression succeeds.";
      } else if (!isRaining) {
        explanation = "It is not raining, so the left side of the and is False and the whole expression is False regardless of the umbrella.";
      } else {
        explanation = "It is raining, but not(have_umbrella) is False because there is an umbrella, so the and expression is False.";
      }

      panel.classList.add("open");
      panel.innerHTML = "";
      var codeBlock = document.createElement("div");
      codeBlock.className = "code-block";
      codeBlock.textContent =
        "is_wet = " + pyBool(isRaining) + " and not(" + pyBool(haveUmbrella) + ")\n" +
        "print(is_wet)   # " + pyBool(isWet);
      var text = document.createElement("p");
      text.textContent = explanation;
      panel.appendChild(codeBlock);
      panel.appendChild(text);
    });

    renderLabels();
  }
})();
