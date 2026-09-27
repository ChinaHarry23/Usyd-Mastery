(function () {
  "use strict";

  if (window.COMP9001_PROGRESS) {
    window.COMP9001_PROGRESS.markPage("study");
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.initComp9001ChapterUI) {
      window.initComp9001ChapterUI();
    }
    initListLab();
    initSlicePredictor();
  });

  function pyRepr(list) {
    return "['" + list.join("', '") + "']";
  }

  function initListLab() {
    var state = document.getElementById("labState");
    var log = document.getElementById("labLog");
    var btnAppend = document.getElementById("btnLabAppend");
    var btnInsert = document.getElementById("btnLabInsert");
    var btnPop = document.getElementById("btnLabPop");
    var btnRemove = document.getElementById("btnLabRemove");
    var btnSort = document.getElementById("btnLabSort");
    var btnReverse = document.getElementById("btnLabReverse");
    var btnReset = document.getElementById("btnLabReset");
    if (!state || !log || !btnAppend || !btnInsert || !btnPop ||
        !btnRemove || !btnSort || !btnReverse || !btnReset) return;

    var initial = ["thirst", "dragon"];
    var battles = initial.slice();

    function render(message, ok) {
      state.textContent = battles.length
        ? "battles = " + pyRepr(battles)
        : "battles = []";
      if (message) {
        log.className = "quiz-result show " + (ok ? "good" : "bad");
        log.textContent = message;
      } else {
        log.className = "quiz-result";
        log.textContent = "";
      }
    }

    btnAppend.addEventListener("click", function () {
      battles.push("temptress");
      render("append(x) adds 'temptress' to the END of the list. len(battles) is now " + battles.length + ".", true);
    });

    btnInsert.addEventListener("click", function () {
      battles.unshift("lion");
      render("insert(0, x) puts 'lion' at index 0 and shifts every other element one place right.", true);
    });

    btnPop.addEventListener("click", function () {
      if (!battles.length) {
        render("IndexError: pop from empty list — pop() needs at least one element.", false);
        return;
      }
      var popped = battles.pop();
      render("pop() with no index removes AND returns the last element: '" + popped + "'.", true);
    });

    btnRemove.addEventListener("click", function () {
      var idx = battles.indexOf("dragon");
      if (idx === -1) {
        render("ValueError: list.remove(x): x not in list — 'dragon' has already been removed.", false);
        return;
      }
      battles.splice(idx, 1);
      render("remove(x) deletes the FIRST occurrence of 'dragon'; later duplicates would stay.", true);
    });

    btnSort.addEventListener("click", function () {
      battles.sort();
      render("sort() reorders the list in ascending (alphabetical) order, in place.", true);
    });

    btnReverse.addEventListener("click", function () {
      battles.reverse();
      render("reverse() flips the element order in place — no sorting involved.", true);
    });

    btnReset.addEventListener("click", function () {
      battles = initial.slice();
      render("", true);
    });

    render("", true);
  }

  function initSlicePredictor() {
    var pool = document.getElementById("slicePool");
    var panel = document.getElementById("sliceResult");
    var output = document.getElementById("sliceOutput");
    if (!pool || !panel || !output) return;

    var cases = [
      { expr: "alphabet[2:5]", result: "['c', 'd', 'e']", note: "start 2 inclusive, end 5 exclusive" },
      { expr: "alphabet[2:]", result: "['c', 'd', 'e', 'f']", note: "no end means run to the end of the list" },
      { expr: "alphabet[:5]", result: "['a', 'b', 'c', 'd', 'e']", note: "no start means begin at index 0" },
      { expr: "alphabet[-1]", result: "'f'", note: "a single negative index counts from the end" },
      { expr: "alphabet[-3]", result: "'d'", note: "-3 means third element from the end" },
      { expr: "alphabet[-7]", result: "IndexError: list index out of range", note: "only 6 elements, so -7 does not exist", error: true },
      { expr: "alphabet[0:6:2]", result: "['a', 'c', 'e']", note: "step 2 takes every second element" },
      { expr: "alphabet[::2]", result: "['a', 'c', 'e']", note: "same slice with start and end left out" },
      { expr: "alphabet[::3]", result: "['a', 'd']", note: "step 3 takes every third element" },
      { expr: "alphabet[::-1]", result: "['f', 'e', 'd', 'c', 'b', 'a']", note: "step -1 walks the list backwards" }
    ];

    cases.forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-outline";
      button.style.padding = "0.4rem 0.75rem";
      button.textContent = item.expr;
      button.addEventListener("click", function () {
        panel.classList.add("open");
        output.textContent = ">>> " + item.expr + "\n" +
          item.result +
          (item.error ? "" : "\n# " + item.note);
      });
      pool.appendChild(button);
    });
  }
})();
