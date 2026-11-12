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
      titleZh: "变量与数据类型",
      shortTitle: "Variables and Types",
      summary: "How programs store data, name values, and work with different kinds of information.",
      summaryZh: "程序如何存储数据、为值起名字，以及处理不同类型的信息。",
      status: "Scaffolded",
      statusZh: "已搭好脚手架",
      concepts: ["variables", "assignment", "integers", "floats", "strings", "booleans"],
      conceptsZh: ["变量", "赋值", "整数", "浮点数", "字符串", "布尔值"],
      materials: [
        { label: "Lecture 2 PDF", file: "comp9001-lecture2-variables-data-types.pdf" }
      ],
      checks: [
        "Describe what changes when a variable is reassigned.",
        "Compare numeric data with text data using one example each.",
        "Predict the result of a small expression before running code."
      ],
      checksZh: [
        "描述变量被重新赋值时发生了什么变化。",
        "用一个例子分别说明数值数据和文本数据的差异。",
        "在运行代码之前预测一个简单表达式的结果。"
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
      titleZh: "条件语句",
      shortTitle: "Conditionals",
      summary: "Decision making in code using conditions, comparisons, and branching logic.",
      summaryZh: "通过条件、比较与分支逻辑在代码中做出判断与选择。",
      status: "Scaffolded",
      statusZh: "已搭好脚手架",
      concepts: ["if statements", "comparison operators", "boolean expressions", "branching", "nested conditions"],
      conceptsZh: ["if 语句", "比较运算符", "布尔表达式", "分支控制", "嵌套条件"],
      materials: [
        { label: "Lecture 3 PDF", file: "comp9001-lecture3-conditionals.pdf" }
      ],
      checks: [
        "State when a branch in an `if` statement will run.",
        "Write one condition that checks whether a number is positive.",
        "Explain why order matters in chained conditions."
      ],
      checksZh: [
        "说明一个 `if` 语句的分支在什么情况下会执行。",
        "写出一个判断数字是否为正数的条件。",
        "解释为什么链式条件中顺序很重要。"
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
      titleZh: "第 4 讲资料",
      shortTitle: "Lecture 4",
      summary: "Placeholder chapter wired to the provided Lecture 4 PDF while the exact topic is confirmed from the slides.",
      summaryZh: "本章为占位页面，已挂上提供的第 4 讲 PDF；具体主题待从课件中确认后再补全。",
      status: "Needs topic extraction",
      statusZh: "待从讲稿中提取主题",
      concepts: ["lecture pdf review", "topic extraction pending", "chapter scaffold ready"],
      conceptsZh: ["复习讲稿 PDF", "待提取主题", "章节脚手架已就绪"],
      materials: [
        { label: "Lecture 4 PDF", file: "comp9001-lecture4.pdf" }
      ],
      checks: [
        "Review the Lecture 4 PDF and note the main topic heading.",
        "Write three key terms from the slides into your own notes.",
        "List one coding pattern or example that deserves an interactive demo later."
      ],
      checksZh: [
        "复习第 4 讲 PDF,记录主要的标题主题。",
        "从课件中挑出三个关键术语,记录到自己的笔记里。",
        "列出一个值得日后做成交互式演示的代码模式或例子。"
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
      titleZh: "循环",
      shortTitle: "Loops",
      summary: "Repeating work in code with counted and conditional iteration patterns.",
      summaryZh: "通过计数循环和条件循环在代码中重复执行工作。",
      status: "Scaffolded",
      statusZh: "已搭好脚手架",
      concepts: ["iteration", "for loops", "while loops", "loop variables", "termination"],
      conceptsZh: ["迭代", "for 循环", "while 循环", "循环变量", "终止条件"],
      materials: [
        { label: "Lecture 5 PDF", file: "comp9001-lecture5-loops.pdf" }
      ],
      checks: [
        "Explain the difference between a `for` loop and a `while` loop.",
        "Describe how a loop can accidentally become infinite.",
        "Predict how many times a simple counting loop runs."
      ],
      checksZh: [
        "解释 `for` 循环和 `while` 循环的区别。",
        "描述循环如何会意外地变成无限循环。",
        "预测一个简单计数循环会运行多少次。"
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
