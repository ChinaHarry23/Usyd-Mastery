/* COMP9001 — foundations graph data.
 * node: [id, chapter, difficulty(1-3), label, definition, href]
 * edge: [fromId, toId, strength]   // strength 4-9; the threshold slider
 *                                 // hides edges below its value (default 3)
 */
window.KG_CONFIG = {
  langKey: "comp9001_lang",
  fromParam: "mkg",
  numChapters: 5,
  chapterColors: {"1":"#0891b2","2":"#0ea5e9","3":"#2563eb","4":"#6366f1","5":"#7c3aed"},
  chapterNames: {"1":"W1: Intro to Programming","2":"W2: Variables & Data Types","3":"W3: Conditionals","4":"W4: Lecture 4 Materials","5":"W5: Loops"},
  chapterNamesZh: {"1":"第1周","2":"第2周","3":"第3周","4":"第4周","5":"第5周"},
  ui: {
    en: {
          "w1": "W1",
          "w2": "W2",
          "w3": "W3",
          "w4": "W4",
          "w5": "W5",
          "title": "Foundations Graph — COMP9001",
          "navHome": "← Home",
          "pageTitle": "Foundations Graph",
          "search": "Search foundations topics...",
          "threshold": "Threshold",
          "diff": "Sort by Difficulty",
          "chapter": "Group by Week",
          "reset": "Reset View",
          "weeks": "Weeks",
          "legendDiff": "Difficulty",
          "diffScale": "● small = easy",
          "click": "Click node → source",
          "layout": "Layout",
          "sort": "Sort by difficulty",
          "group": "Group by week",
          "both": "Combine filters.",
          "nodes": "nodes",
          "edges": "edges",
          "thresholdStats": "threshold ≥ "
    },
    zh: {
          "w1": "W1",
          "w2": "W2",
          "w3": "W3",
          "w4": "W4",
          "w5": "W5",
          "title": "Foundations Graph — COMP9001",
          "navHome": "← 首页",
          "pageTitle": "基础图谱",
          "search": "搜索…",
          "threshold": "阈值",
          "diff": "按难度",
          "chapter": "按周次",
          "reset": "重置",
          "weeks": "周次",
          "legendDiff": "难度",
          "diffScale": "● 小=易",
          "click": "点击跳转",
          "layout": "布局",
          "sort": "难度排序",
          "group": "周次分组",
          "both": "组合筛选",
          "nodes": "节点",
          "edges": "边",
          "thresholdStats": "阈值 ≥ "
    }
  },
  nodes: [
    // ===== W1: introduction and tooling notation =====
    ["m1-def", 1, 1, "Program definition", "A program is a set of instructions for a computer to execute in sequence to perform a certain task.", "../chapters/chapter1/web/chapter1-math.html#sec-definition"],
    ["m1-sequence", 1, 1, "Sequence and logic", "Joining class or following a recipe works only when the actions are ordered correctly.", "../chapters/chapter1/web/chapter1-math.html#sec-sequence"],
    ["m1-translation", 1, 2, "Source code translation", "How a source file becomes something the processor can run: the compiler and interpreter distinction.", "../chapters/chapter1/web/chapter1-math.html#sec-translation"],
    ["m1-tools", 1, 1, "Tools and commands", "The reference table of terminal commands and editor steps used to create, save and quit a file.", "../chapters/chapter1/web/chapter1-math.html#sec-tools"],
    ["m1-workflow", 1, 1, "First program workflow", "1. Create a .py file. 2. Write code into the file. 3. Run the file.", "../chapters/chapter1/web/chapter1-math.html#sec-first-program"],
    ["m1-output", 1, 1, "Output and interpreter", "print() is the built-in function for text output, and python3 opens the interpreter for immediate results.", "../chapters/chapter1/web/chapter1-math.html#sec-output"],
    ["m1-print", 1, 1, "print() signature", "The built-in call notation used for every early example of visible program output.", "../chapters/chapter1/web/chapter1-study.html#sec-interpreter"],
    ["m1-compiler", 1, 2, "Compiler vs interpreter table", "Whole-program translation ahead of time versus statement-by-statement execution while the program runs.", "../chapters/chapter1/web/chapter1-study.html#sec-translation"],

    // ===== W2: variable and type notation =====
    ["m2-vardef", 2, 1, "Variable definition", "A variable is a named container of data you would like to refer to in your program, so the data can be reused and reassigned.", "../chapters/chapter2/web/chapter2-math.html#sec-variable-def"],
    ["m2-naming", 2, 1, "Naming rules", "Names start with a letter, contain no spaces and are case sensitive; ALL CAPS marks a constant such as FIXED_COST.", "../chapters/chapter2/web/chapter2-math.html#sec-naming-rules"],
    ["m2-typetable", 2, 1, "The four basic types", "A type is a set of values plus a set of operations on them; primitive types use fixed memory and in Python everything is an object.", "../chapters/chapter2/web/chapter2-math.html#sec-type-table"],
    ["m2-casting", 2, 2, "Type casting", "Conversion between types invoked by function call: str(), int() and float().", "../chapters/chapter2/web/chapter2-math.html#sec-casting"],
    ["m2-implicit", 2, 3, "Implicit conversion", "Python converts automatically when appropriate: float with int division and int divided by int both produce a float.", "../chapters/chapter2/web/chapter2-math.html#sec-casting"],
    ["m2-boollogic", 2, 1, "Boolean logic notation", "Two possible values, False (0) and True (1); comparison operators return a bool and logical operators combine bools.", "../chapters/chapter2/web/chapter2-math.html#sec-bool-logic"],
    ["m2-compareops", 2, 1, "Comparison operators", "The notation == , != , < , <= , > , >= that turns two operand values into a Boolean result.", "../chapters/chapter2/web/chapter2-math.html#sec-bool-logic"],
    ["m2-io", 2, 2, "input() semantics", "Reads a line from standard input, converts it to a string and strips the newline, so numeric replies must be cast.", "../chapters/chapter2/web/chapter2-math.html#sec-io-format"],
    ["m2-format", 2, 2, "f-strings vs str.format()", "Two formatting notations: f-strings splice expressions inside braces, str.format() replaces the brackets, and format specs align columns.", "../chapters/chapter2/web/chapter2-math.html#sec-io-format"],
    ["m2-ops", 2, 2, "Expression notation", "An expression combines literals, variables and operators and Python evaluates it to produce a value.", "../chapters/chapter2/web/chapter2-study.html#sec-expressions"],
    ["m2-escapes", 2, 2, "Quoting and escapes", "Strings are enclosed in single or double quotes; the backslash escapes special characters and + or * concatenate and repeat.", "../chapters/chapter2/web/chapter2-study.html#sec-strings"],

    // ===== W3: condition notation and semantics =====
    ["m3-selection", 3, 1, "Selection statement kinds", "A program with decisions performs actions depending on whether a condition is fulfilled; the lecture names three selection statements.", "../chapters/chapter3/web/chapter3-math.html#sec-selection"],
    ["m3-comparison", 3, 1, "Comparison semantics", "A comparison takes operands of one type and returns another type: whatever the operands, the result is always a bool.", "../chapters/chapter3/web/chapter3-math.html#sec-comparison"],
    ["m3-truth", 3, 2, "Truth tables", "not P is True when P is False; P and Q is True only when both are True; P or Q is True when either is True.", "../chapters/chapter3/web/chapter3-math.html#sec-truth"],
    ["m3-syntax", 3, 1, "if / else syntax", "if followed by a Boolean expression and a colon runs the indented statement only when it is True; else takes no expression.", "../chapters/chapter3/web/chapter3-math.html#sec-syntax"],
    ["m3-indent", 3, 2, "Colon and indentation", "The colon opens a block and the indented statements form its body; putting an expression after else is a syntax error.", "../chapters/chapter3/web/chapter3-math.html#sec-syntax"],
    ["m3-elifrules", 3, 2, "elif rules", "elif abbreviates else-if, there is no limit on how many you write, and an optional else clause has to come last.", "../chapters/chapter3/web/chapter3-math.html#sec-rules"],
    ["m3-desk", 3, 2, "Desk check method", "Track each variable value and how it changes while walking through the code by hand.", "../chapters/chapter3/web/chapter3-math.html#sec-desk"],
    ["m3-boundary", 3, 3, "Normal, abnormal, boundary", "Test by picking values that are normal, abnormal, and on the boundary of each condition.", "../chapters/chapter3/web/chapter3-math.html#sec-desk"],
    ["m3-flowchart", 3, 1, "Flowchart notation", "Oval for start and end, parallelogram for input and output, rectangle for computation, diamond for a decision.", "../chapters/chapter3/web/chapter3-study.html#sec-flowcharts"],

    // ===== W4: container notation =====
    ["m4-containers", 4, 1, "Containers vs basic types", "A data structure organises data we wish to process; basic types hold a single value while containers hold many.", "../chapters/chapter4/web/chapter4-math.html#sec-containers"],
    ["m4-listdef", 4, 1, "List definition", "A contiguous block of memory containing multiple values, not all of the same type; Python list is not the same as an array.", "../chapters/chapter4/web/chapter4-math.html#sec-lists"],
    ["m4-zerobased", 4, 1, "Zero-based indexing", "With index-0 the last index is one less than the number of elements; index-1 languages start at one instead.", "../chapters/chapter4/web/chapter4-math.html#sec-indexing"],
    ["m4-ops", 4, 2, "Methods and slicing", "The list method table together with the slice operator notation list[start:end].", "../chapters/chapter4/web/chapter4-math.html#sec-operations"],
    ["m4-slice", 4, 2, "Slice semantics", "The start index is inclusive and the end index is exclusive, so a slice from i to j stops at j-1.", "../chapters/chapter4/web/chapter4-math.html#sec-operations"],
    ["m4-tuples", 4, 1, "Tuples", "A fixed list of elements written as comma-separated objects within parentheses; nothing can be added, deleted or replaced.", "../chapters/chapter4/web/chapter4-math.html#sec-tuples-strings"],
    ["m4-strings", 4, 2, "Strings as sequences", "A string is a sequence of characters addressed by index, and like a tuple it cannot be modified in place.", "../chapters/chapter4/web/chapter4-math.html#sec-tuples-strings"],
    ["m4-mutability", 4, 2, "Mutable vs immutable", "Lists are mutable, so elements can be modified after creation; tuples and strings are immutable.", "../chapters/chapter4/web/chapter4-math.html#sec-tuples-strings"],
    ["m4-len", 4, 1, "Shared reading operations", "len(), accessing the i-th item from origin 0, and slices from index i to j-1 work on lists, tuples and strings alike.", "../chapters/chapter4/web/chapter4-study.html#sec-tuples"],
    ["m4-dicts", 4, 2, "Dictionaries", "Data values stored in key:value pairs; ordered since Python 3.7, changeable, and duplicates are not allowed.", "../chapters/chapter4/web/chapter4-math.html#sec-dicts-args"],
    ["m4-argv", 4, 3, "sys.argv", "Command line inputs are stored in argv in the sys module as an array of string objects, with the script name first.", "../chapters/chapter4/web/chapter4-math.html#sec-dicts-args"],

    // ===== W5: loop notation and semantics =====
    ["m5-anatomy", 5, 1, "Loop anatomy", "Initialise the loop control variable, test it, execute the body, then modify it.", "../chapters/chapter5/web/chapter5-math.html#sec-anatomy"],
    ["m5-shorthand", 5, 1, "Augmented assignment", "The shorthand i += 1 means the same as i = i + 1 and is the usual notation for the modify step.", "../chapters/chapter5/web/chapter5-math.html#sec-anatomy"],
    ["m5-types", 5, 1, "Count vs event control", "Count-controlled loops repeat a known number of times; event-controlled loops repeat until an event ends them.", "../chapters/chapter5/web/chapter5-math.html#sec-types"],
    ["m5-while", 5, 1, "while syntax", "while followed by a boolean expression and a colon; the body runs while the expression is True.", "../chapters/chapter5/web/chapter5-math.html#sec-while"],
    ["m5-iterations", 5, 3, "Counting iterations", "Many ways implement the same number of known iterations; the start value and the comparison operator must be read together.", "../chapters/chapter5/web/chapter5-math.html#sec-iterations"],
    ["m5-infinite", 5, 2, "Infinite loop", "A loop that never exits because the condition is always True; a missing modification is a logic error.", "../chapters/chapter5/web/chapter5-math.html#sec-infinite"],
    ["m5-ctrlc", 5, 1, "KeyboardInterrupt", "The interrupt raised by CTRL-C, used to stop a loop that was not designed to be infinite.", "../chapters/chapter5/web/chapter5-math.html#sec-infinite"],
    ["m5-sentinel", 5, 2, "Sentinel value", "An unlikely value that the data can take; receiving it ends the loop and is never confused with normal input.", "../chapters/chapter5/web/chapter5-math.html#sec-event"],
    ["m5-flag", 5, 3, "Flag variable", "A boolean that controls the loop: initialise it False, loop on not stop_flag, and set it True in the body.", "../chapters/chapter5/web/chapter5-math.html#sec-event"],
    ["m5-for", 5, 1, "for over a sequence", "Iterates over the elements of a list or string, or over the indices produced by range().", "../chapters/chapter5/web/chapter5-study.html#sec-collections"],
    ["m5-range", 5, 2, "range() notation", "range(1, 6) generates five values, and range(0, len(x)) generates every valid zero-based index of a collection.", "../chapters/chapter5/web/chapter5-study.html#sec-collections"]
  ].map(function (n) {
    return { id: n[0], ch: n[1], diff: n[2], label: n[3], def: n[4], href: n[5] };
  }),
  edges: [
    // W1 notation
    ["m1-def", "m1-sequence", 9], ["m1-def", "m1-translation", 9], ["m1-def", "m1-tools", 9],
    ["m1-sequence", "m1-workflow", 9], ["m1-tools", "m1-workflow", 8],
    ["m1-workflow", "m1-output", 9], ["m1-translation", "m1-output", 9],
    ["m1-translation", "m1-compiler", 8], ["m1-output", "m1-print", 9],
    ["m1-tools", "m1-print", 8], ["m1-print", "m2-format", 8],
    // W1 -> W2
    ["m1-workflow", "m2-vardef", 7],
    // W2 notation
    ["m2-vardef", "m2-naming", 9], ["m2-vardef", "m2-typetable", 9],
    ["m2-typetable", "m2-casting", 9], ["m2-casting", "m2-implicit", 8],
    ["m2-typetable", "m2-ops", 9], ["m2-typetable", "m2-escapes", 9],
    ["m2-typetable", "m2-boollogic", 8], ["m2-boollogic", "m2-compareops", 9],
    ["m2-typetable", "m2-io", 9], ["m2-casting", "m2-io", 8],
    ["m2-io", "m2-format", 9], ["m2-ops", "m2-format", 9],
    // W2 -> W3
    ["m2-compareops", "m3-comparison", 9], ["m2-boollogic", "m3-truth", 9],
    // W3 notation
    ["m3-selection", "m3-syntax", 9], ["m3-comparison", "m3-selection", 9],
    ["m3-comparison", "m3-truth", 9], ["m3-truth", "m3-selection", 9],
    ["m3-syntax", "m3-indent", 9], ["m3-syntax", "m3-elifrules", 8],
    ["m3-elifrules", "m3-desk", 9], ["m3-desk", "m3-boundary", 9],
    ["m3-selection", "m3-flowchart", 9], ["m3-flowchart", "m3-desk", 9],
    // W4 notation
    ["m4-containers", "m4-listdef", 9], ["m4-containers", "m4-tuples", 8],
    ["m4-containers", "m4-strings", 8], ["m4-containers", "m4-dicts", 8],
    ["m4-listdef", "m4-zerobased", 9], ["m4-listdef", "m4-ops", 9], ["m4-listdef", "m4-len", 9],
    ["m4-zerobased", "m4-slice", 8], ["m4-ops", "m4-slice", 9],
    ["m4-tuples", "m4-mutability", 9], ["m4-strings", "m4-mutability", 8],
    ["m4-mutability", "m4-len", 8], ["m4-dicts", "m4-argv", 8],
    // W5 notation
    ["m5-types", "m5-anatomy", 9], ["m5-anatomy", "m5-shorthand", 8],
    ["m5-anatomy", "m5-while", 9], ["m5-anatomy", "m5-iterations", 9],
    ["m5-anatomy", "m5-for", 8], ["m5-while", "m5-infinite", 9],
    ["m5-while", "m5-for", 9], ["m5-infinite", "m5-ctrlc", 9],
    ["m5-types", "m5-sentinel", 8], ["m5-types", "m5-flag", 8],
    ["m5-sentinel", "m5-flag", 8], ["m5-for", "m5-range", 9],
    ["m5-iterations", "m5-range", 9], ["m5-shorthand", "m5-infinite", 9],
    // cross-chapter prerequisites
    ["m3-truth", "m5-while", 6], ["m3-indent", "m5-while", 6],
    ["m2-boollogic", "m5-flag", 6], ["m4-zerobased", "m5-iterations", 7],
    ["m4-len", "m5-range", 7]
  ]
};
