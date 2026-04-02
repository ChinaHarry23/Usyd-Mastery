window.COMP9001_SITE = {
  courseCode: "COMP9001",
  courseName: "Intro to Programming",
  term: "Scaffold from provided lecture PDFs",
  subtitle: "A ready-to-build study hub with chapter pages, tools, and copied lecture materials.",
  chapters: [
    {
      number: 1,
      slug: "chapter1",
      title: "Introduction to Programming",
      shortTitle: "Intro to Programming",
      summary: "What a program is, why order and precision matter, how source code reaches machine code, and how to create and run a first Python program.",
      status: "Chapter 1 built from lecture material",
      concepts: ["programs", "sequence", "precision", "source code", "compiler", "interpreter", "CLI", "print()", "python shell"],
      materials: [
        { label: "Lecture 1 PDF", file: "comp9001-lecture1-intro.pdf" }
      ],
      checks: [
        "Define a program in one sentence using the lecture wording.",
        "Explain why instructions for computers must be precise and ordered.",
        "Compare a compiler with an interpreter.",
        "Describe the three-step workflow for writing and running a Python file.",
        "State what `pwd`, `ls`, `cd`, and `touch` are used for.",
        "Explain what `print()` does and what the Python interpreter is for."
      ],
      mindmap: {
        label: "Introduction to Programming",
        children: [
          {
            label: "What is a program?",
            children: [
              { label: "set of instructions" },
              { label: "executed in sequence" },
              { label: "performs a task" }
            ]
          },
          {
            label: "Why sequence matters",
            children: [
              { label: "ordered steps" },
              { label: "clear instructions" },
              { label: "human algorithm first" }
            ]
          },
          {
            label: "Talking to computers",
            children: [
              { label: "source code" },
              { label: "programming languages" },
              { label: "machine code" }
            ]
          },
          {
            label: "Translation layer",
            children: [
              { label: "compiler", children: [{ label: "whole program first" }, { label: "fails on syntax errors" }] },
              { label: "interpreter", children: [{ label: "statement by statement" }, { label: "runs while translating" }] }
            ]
          },
          {
            label: "Learning to program",
            children: [
              { label: "knowledge", children: [{ label: "input" }, { label: "output" }, { label: "conditionals" }, { label: "repetition" }] },
              { label: "actions", children: [{ label: "write" }, { label: "run" }, { label: "debug" }, { label: "test" }] },
              { label: "tools", children: [{ label: "text editor" }, { label: "terminal" }, { label: "pen and paper" }] }
            ]
          },
          {
            label: "First Python workflow",
            children: [
              { label: "create .py file" },
              { label: "write code" },
              { label: "run program" },
              { label: "use print()" },
              { label: "try python3 shell" }
            ]
          }
        ]
      }
    },
    {
      number: 2,
      slug: "chapter2",
      title: "Variables and Data Types",
      shortTitle: "Variables and Types",
      summary: "How programs store data, name values, and work with different kinds of information.",
      status: "Scaffolded",
      concepts: ["variables", "assignment", "integers", "floats", "strings", "booleans"],
      materials: [
        { label: "Lecture 2 PDF", file: "comp9001-lecture2-variables-data-types.pdf" }
      ],
      checks: [
        "Describe what changes when a variable is reassigned.",
        "Compare numeric data with text data using one example each.",
        "Predict the result of a small expression before running code."
      ],
      mindmap: {
        label: "Variables and Data Types",
        children: [
          { label: "Storing values", children: [{ label: "names" }, { label: "assignment" }, { label: "updating" }] },
          { label: "Data types", children: [{ label: "numbers" }, { label: "text" }, { label: "truth values" }] },
          { label: "Common mistakes", children: [{ label: "type mismatch" }, { label: "unintended overwrites" }] }
        ]
      }
    },
    {
      number: 3,
      slug: "chapter3",
      title: "Conditionals",
      shortTitle: "Conditionals",
      summary: "Decision making in code using conditions, comparisons, and branching logic.",
      status: "Scaffolded",
      concepts: ["if statements", "comparison operators", "boolean expressions", "branching", "nested conditions"],
      materials: [
        { label: "Lecture 3 PDF", file: "comp9001-lecture3-conditionals.pdf" }
      ],
      checks: [
        "State when a branch in an `if` statement will run.",
        "Write one condition that checks whether a number is positive.",
        "Explain why order matters in chained conditions."
      ],
      mindmap: {
        label: "Conditionals",
        children: [
          { label: "Boolean logic", children: [{ label: "true / false" }, { label: "comparisons" }, { label: "logical operators" }] },
          { label: "Control flow", children: [{ label: "if" }, { label: "if / else" }, { label: "elif chains" }] },
          { label: "Design choices", children: [{ label: "readability" }, { label: "edge cases" }] }
        ]
      }
    },
    {
      number: 4,
      slug: "chapter4",
      title: "Lecture 4 Materials",
      shortTitle: "Lecture 4",
      summary: "Placeholder chapter wired to the provided Lecture 4 PDF while the exact topic is confirmed from the slides.",
      status: "Needs topic extraction",
      concepts: ["lecture pdf review", "topic extraction pending", "chapter scaffold ready"],
      materials: [
        { label: "Lecture 4 PDF", file: "comp9001-lecture4.pdf" }
      ],
      checks: [
        "Review the Lecture 4 PDF and note the main topic heading.",
        "Write three key terms from the slides into your own notes.",
        "List one coding pattern or example that deserves an interactive demo later."
      ],
      mindmap: {
        label: "Lecture 4 Materials",
        children: [
          { label: "Source", children: [{ label: "provided lecture PDF" }] },
          { label: "Next pass", children: [{ label: "extract chapter title" }, { label: "summarise examples" }, { label: "add quizzes" }] }
        ]
      }
    },
    {
      number: 5,
      slug: "chapter5",
      title: "Loops",
      shortTitle: "Loops",
      summary: "Repeating work in code with counted and conditional iteration patterns.",
      status: "Scaffolded",
      concepts: ["iteration", "for loops", "while loops", "loop variables", "termination"],
      materials: [
        { label: "Lecture 5 PDF", file: "comp9001-lecture5-loops.pdf" }
      ],
      checks: [
        "Explain the difference between a `for` loop and a `while` loop.",
        "Describe how a loop can accidentally become infinite.",
        "Predict how many times a simple counting loop runs."
      ],
      mindmap: {
        label: "Loops",
        children: [
          { label: "Why loop?", children: [{ label: "repetition" }, { label: "automation" }] },
          { label: "Loop types", children: [{ label: "for" }, { label: "while" }] },
          { label: "Care points", children: [{ label: "termination" }, { label: "off-by-one errors" }, { label: "state updates" }] }
        ]
      }
    }
  ]
};
