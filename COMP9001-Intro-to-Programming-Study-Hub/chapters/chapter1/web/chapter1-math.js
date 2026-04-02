(function () {
  "use strict";

  var questions = [
    {
      prompt: "Which definition matches the lecture?",
      options: [
        "A program is a set of instructions for a computer to execute in sequence to perform a certain task.",
        "A program is any app icon you can click.",
        "A program is only a binary file with no human-readable form."
      ],
      answer: 0,
      explanation: "The lecture defines a program in terms of instructions, sequence, and task."
    },
    {
      prompt: "Why does sequence matter in programming?",
      options: [
        "Because computers guess the missing order",
        "Because steps often depend on earlier steps being done first",
        "Because order only matters in human conversation"
      ],
      answer: 1,
      explanation: "The lecture’s everyday examples show that executing the same actions in the wrong order may fail."
    },
    {
      prompt: "Which statement best describes a compiler?",
      options: [
        "It translates the whole source program before execution",
        "It is a folder navigation command",
        "It prints output to the terminal"
      ],
      answer: 0,
      explanation: "The lecture distinguishes compilers from interpreters by when translation happens."
    },
    {
      prompt: "Which command shows your current directory?",
      options: ["pwd", "touch", "mv"],
      answer: 0,
      explanation: "`pwd` answers the slide’s question: where am I?"
    },
    {
      prompt: "What does `touch hello.py` do in the lecture workflow?",
      options: [
        "Runs the Python program",
        "Creates the file",
        "Deletes the file"
      ],
      answer: 1,
      explanation: "The CLI section uses `touch [file]` to create a file."
    },
    {
      prompt: "What is `print()` introduced as?",
      options: [
        "A built-in Python function for output",
        "A compiler option",
        "A way to rename folders"
      ],
      answer: 0,
      explanation: "The lecture explicitly introduces `print()` as a built-in function."
    },
    {
      prompt: "Why use the Python interpreter?",
      options: [
        "To execute small pieces of code immediately and see the result",
        "To replace every text editor permanently",
        "To avoid writing code files forever"
      ],
      answer: 0,
      explanation: "The lecture highlights immediate execution and immediate feedback in the terminal."
    }
  ];

  if (window.COMP9001_PROGRESS) {
    window.COMP9001_PROGRESS.markPage("checks");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("checkRoot");
    var scoreEl = document.getElementById("checkScore");
    var correctCount = 0;
    var answeredCount = 0;

    questions.forEach(function (question, questionIndex) {
      var card = document.createElement("article");
      card.className = "check-card";
      card.innerHTML =
        "<h3>Check " + (questionIndex + 1) + "</h3>" +
        "<p>" + question.prompt + "</p>";

      var options = document.createElement("div");
      options.className = "check-options";

      var explanation = document.createElement("p");
      explanation.className = "feedback";

      question.options.forEach(function (option, optionIndex) {
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = option;
        button.addEventListener("click", function () {
          if (card.dataset.answered === "true") return;
          card.dataset.answered = "true";
          answeredCount += 1;
          var isCorrect = optionIndex === question.answer;
          if (isCorrect) correctCount += 1;

          options.querySelectorAll("button").forEach(function (btn, idx) {
            if (idx === question.answer) btn.classList.add("correct");
          });
          if (!isCorrect) {
            button.classList.add("incorrect");
          }

          explanation.className = "feedback " + (isCorrect ? "good" : "bad");
          explanation.textContent = question.explanation;
          scoreEl.textContent = correctCount + " / " + answeredCount;

          if (window.COMP9001_PROGRESS) {
            window.COMP9001_PROGRESS.markQuiz(1, isCorrect ? 1 : 0, 1);
          }
        });
        options.appendChild(button);
      });

      card.appendChild(options);
      card.appendChild(explanation);
      root.appendChild(card);
    });
  });
})();
