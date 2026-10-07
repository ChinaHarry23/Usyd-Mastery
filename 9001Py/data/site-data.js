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
      title: "Containers: Lists, Tuples and Dictionaries",
      titleZh: "容器：列表、元组与字典",
      shortTitle: "Containers",
      summary: "Why container types exist, Python list syntax and zero-based indexing, list methods and slicing, two-dimensional lists, tuples and immutability, dictionaries, and command-line arguments.",
      summaryZh: "为什么需要容器类型、Python 列表语法与从零开始的索引、列表方法与切片、二维列表、元组与不可变性、字典，以及命令行参数。",
      status: "Built from lecture material",
      statusZh: "已基于讲义构建",
      concepts: ["containers vs basic types", "lists", "zero-based indexing", "list methods", "slicing", "2-D lists", "tuples & immutability", "dictionaries", "keys and values", "command-line arguments"],
      conceptsZh: ["容器与基本类型", "列表", "从零开始的索引", "列表方法", "切片", "二维列表", "元组与不可变性", "字典", "键与值", "命令行参数"],
      materials: [
        { label: "Lecture 4 PDF", file: "comp9001-lecture4.pdf" }
      ],
      checks: [
        "Explain when a container type is needed instead of a single variable.",
        "Trace what `nums[2]` refers to in a zero-based list and why.",
        "Describe what a slice like `nums[1:4]` returns.",
        "State why tuples are immutable while lists are not.",
        "Explain how a dictionary maps keys to values.",
        "Describe how command-line arguments reach a Python program."
      ],
      checksZh: [
        "解释什么时候需要容器类型而不是单个变量。",
        "说明在从零开始的列表中 `nums[2]` 指向哪个元素，以及为什么。",
        "描述 `nums[1:4]` 这样的切片会返回什么。",
        "说明为什么元组不可变而列表可变。",
        "解释字典如何把键映射到值。",
        "描述命令行参数如何传入 Python 程序。"
      ],
      mindmap: {
        label: "Containers",
        children: [
          { label: "Why containers", children: [{ label: "one name, many values" }, { label: "basic vs container types" }] },
          { label: "Lists", children: [{ label: "literal syntax" }, { label: "zero-based indexing" }, { label: "methods" }, { label: "slicing" }, { label: "2-D lists" }] },
          { label: "Tuples", children: [{ label: "immutability" }, { label: "strings as sequences" }] },
          { label: "Dictionaries", children: [{ label: "keys and values" }, { label: "lookup by key" }] },
          { label: "Program input", children: [{ label: "sys.argv" }, { label: "argument parsing" }] }
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
