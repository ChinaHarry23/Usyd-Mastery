/**
 * COMP9001 Intro to Programming flashcards — schema { ch, front, back, front_zh, back_zh }
 */
var FLASHCARD_DECK_VERSION = "comp9001-2";
var ALL_FLASHCARD_DATA = [

  /* ====== Chapter 1 — Programs, Ordering, Compilers vs Interpreters, REPL, print, Comments, CLI ====== */

  { ch: 1, front: "What is an algorithm?", back: "A clear, finite sequence of steps for solving a problem.", front_zh: "什么是算法？", back_zh: "一个清晰、有限的解决问题的步骤序列。" },

  { ch: 1, front: "What are the three high-level parts of many programs?", back: "Input, processing, and output.", front_zh: "许多程序的三个高层组成部分是什么？", back_zh: "输入、处理和输出。" },

  { ch: 1, front: "What is the main difference between a compiler and an interpreter?", back: "A compiler translates the whole program before it runs; an interpreter translates and executes code statement by statement.", front_zh: "编译器和解释器的主要区别是什么？", back_zh: "编译器在运行前翻译整个程序；解释器逐语句翻译并执行代码。" },

  { ch: 1, front: "What is source code?", back: "A text file containing commands written in a programming language, meant to be executed by a computer.", front_zh: "什么是源代码？", back_zh: "包含用编程语言编写的命令的文本文件，供计算机执行。" },

  { ch: 1, front: "What does `print()` do in Python?", back: "It outputs text or values to the console.", front_zh: "`print()` 在 Python 中做什么？", back_zh: "它将文本或值输出到控制台。" },

  { ch: 1, front: "What does the Python REPL let you do?", back: "Execute Python code interactively in the terminal and see results immediately.", front_zh: "Python REPL 允许你做什么？", back_zh: "在终端中交互式地执行 Python 代码并立即看到结果。" },

  { ch: 1, front: "What are comments and why are they useful?", back: "Lines starting with # that are ignored by the interpreter; they explain code to human readers.", front_zh: "什么是注释？为什么注释有用？", back_zh: "以 # 开头的行，解释器会忽略它们；它们向人类读者解释代码。" },

  /* ====== Chapter 2 — Variables, Data Types, Type Conversion, input, Strings, f-strings, Operators ====== */

  { ch: 2, front: "What is a variable in Python?", back: "A name that refers to a value stored in memory. Created by assignment (e.g., x = 5).", front_zh: "Python 中的变量是什么？", back_zh: "一个指向内存中存储的值的名称。通过赋值创建（例如 x = 5）。" },

  { ch: 2, front: "Name four basic data types in Python.", back: "int (integer), float (decimal number), str (string/text), bool (True/False).", front_zh: "列出 Python 中四种基本数据类型。", back_zh: "int（整数）、float（浮点数/小数）、str（字符串/文本）、bool（True/False）。" },

  { ch: 2, front: "What does `input()` return?", back: "Always returns a string. To use it as a number, you must convert it with int() or float().", front_zh: "`input()` 返回什么？", back_zh: "始终返回字符串。要将其用作数字，必须用 int() 或 float() 转换。" },

  { ch: 2, front: "How do you convert a string to an integer?", back: "Use int(), e.g., int(\"42\") returns the integer 42. Raises ValueError if the string is not a valid number.", front_zh: "如何将字符串转换为整数？", back_zh: "使用 int()，例如 int(\"42\") 返回整数 42。如果字符串不是有效数字，会抛出 ValueError。" },

  { ch: 2, front: "What is an f-string?", back: "A formatted string literal prefixed with f that lets you embed expressions in curly braces, e.g., f\"Hello {name}\".", front_zh: "什么是 f-string？", back_zh: "以 f 为前缀的格式化字符串字面量，允许在花括号中嵌入表达式，例如 f\"Hello {name}\"。" },

  { ch: 2, front: "What is the difference between `/` and `//` in Python?", back: "/ performs true division (returns float), // performs floor division (rounds down to nearest integer).", front_zh: "Python 中 `/` 和 `//` 有什么区别？", back_zh: "/ 执行真除法（返回浮点数），// 执行地板除法（向下取整到最近整数）。" },

  { ch: 2, front: "What is operator precedence?", back: "The rules that determine which operations are evaluated first. In Python: ** > unary - > *, /, //, % > +, -.", front_zh: "什么是运算符优先级？", back_zh: "决定哪些运算先执行的规则。在 Python 中：** > 一元 - > *, /, //, % > +, -。" },

  /* ====== Chapter 3 — Conditionals, Comparisons, Boolean Logic, Loops, range, break/continue ====== */

  { ch: 3, front: "What does an `if` statement do?", back: "Executes a block of code only when its condition evaluates to True.", front_zh: "`if` 语句做什么？", back_zh: "仅在条件求值为 True 时执行一段代码。" },

  { ch: 3, front: "What is the role of `elif`?", back: "It checks another condition when the preceding if (or elif) was False, allowing multi-way branching.", front_zh: "`elif` 的作用是什么？", back_zh: "当前面的 if（或 elif）为 False 时检查另一个条件，实现多分支判断。" },

  { ch: 3, front: "What do `and`, `or`, and `not` do?", back: "`and` returns True if both operands are True; `or` returns True if at least one is True; `not` inverts a boolean.", front_zh: "`and`、`or` 和 `not` 做什么？", back_zh: "`and` 在两个操作数都为 True 时返回 True；`or` 在至少一个为 True 时返回 True；`not` 反转布尔值。" },

  { ch: 3, front: "What is the difference between a `for` loop and a `while` loop?", back: "A for loop iterates over a known sequence; a while loop repeats as long as its condition is True.", front_zh: "`for` 循环和 `while` 循环有什么区别？", back_zh: "for 循环遍历一个已知序列；while 循环在条件为 True 时重复执行。" },

  { ch: 3, front: "What does `range(n)` produce?", back: "A sequence of integers from 0 to n−1 (n items total).", front_zh: "`range(n)` 产生什么？", back_zh: "从 0 到 n−1 的整数序列（共 n 个元素）。" },

  { ch: 3, front: "What does `break` do in a loop?", back: "Immediately exits the enclosing loop, skipping any remaining iterations.", front_zh: "`break` 在循环中做什么？", back_zh: "立即退出所在的循环，跳过所有剩余的迭代。" },

  { ch: 3, front: "What does `continue` do in a loop?", back: "Skips the rest of the current iteration and jumps to the next one.", front_zh: "`continue` 在循环中做什么？", back_zh: "跳过当前迭代的剩余部分，直接进入下一次迭代。" },

  /* ====== Chapter 4 — Functions (def, parameters, return), Scope, Default Arguments, Docstrings ====== */

  { ch: 4, front: "How do you define a function in Python?", back: "Use the `def` keyword: def function_name(parameters): followed by an indented body.", front_zh: "如何在 Python 中定义函数？", back_zh: "使用 `def` 关键字：def 函数名(参数): 后跟缩进的函数体。" },

  { ch: 4, front: "What is the difference between a parameter and an argument?", back: "A parameter is the variable in the function definition; an argument is the actual value passed when calling.", front_zh: "参数（parameter）和实参（argument）有什么区别？", back_zh: "参数是函数定义中的变量；实参是调用时传入的实际值。" },

  { ch: 4, front: "What does `return` do?", back: "Exits the function and sends a value back to the caller. Without return, the function returns None.", front_zh: "`return` 做什么？", back_zh: "退出函数并将值返回给调用者。没有 return 时，函数返回 None。" },

  { ch: 4, front: "What is variable scope?", back: "The region of code where a variable is accessible. Local scope = inside a function; global scope = module level.", front_zh: "什么是变量作用域？", back_zh: "代码中变量可访问的区域。局部作用域 = 函数内部；全局作用域 = 模块级别。" },

  { ch: 4, front: "What is a default argument?", back: "A parameter with a pre-set value used when the caller does not provide one, e.g., def greet(name=\"World\").", front_zh: "什么是默认参数？", back_zh: "当调用者未提供值时使用预设值的参数，例如 def greet(name=\"World\")。" },

  { ch: 4, front: "What is a docstring?", back: "A triple-quoted string on the first line of a function/class/module that documents its purpose. Accessed via help() or .__doc__.", front_zh: "什么是文档字符串？", back_zh: "函数/类/模块第一行的三引号字符串，用于记录其用途。可通过 help() 或 .__doc__ 访问。" },

  { ch: 4, front: "Can a function call another function?", back: "Yes. Functions can call other functions, enabling code reuse and modular design.", front_zh: "函数可以调用另一个函数吗？", back_zh: "可以。函数可以调用其他函数，实现代码复用和模块化设计。" },

  /* ====== Chapter 5 — Lists, Tuples, Dictionaries, Indexing/Slicing, Methods, Iteration, Comprehensions ====== */

  { ch: 5, front: "What is a list in Python?", back: "An ordered, mutable collection of items created with square brackets, e.g., [1, 2, 3].", front_zh: "Python 中的列表是什么？", back_zh: "用方括号创建的有序、可变的元素集合，例如 [1, 2, 3]。" },

  { ch: 5, front: "What is the difference between a list and a tuple?", back: "A list is mutable (can be changed); a tuple is immutable (cannot be changed after creation). Tuples use parentheses ().", front_zh: "列表和元组有什么区别？", back_zh: "列表是可变的（可以更改）；元组是不可变的（创建后不能更改）。元组使用圆括号 ()。" },

  { ch: 5, front: "How does indexing work in Python?", back: "Zero-based: the first element is at index 0. Negative indices count from the end (−1 is last).", front_zh: "Python 中的索引是怎样工作的？", back_zh: "从零开始：第一个元素在索引 0。负索引从末尾计数（-1 是最后一个）。" },

  { ch: 5, front: "What does slicing do?", back: "Extracts a sub-sequence: a[start:stop] returns elements from start up to (not including) stop.", front_zh: "切片做什么？", back_zh: "提取子序列：a[start:stop] 返回从 start 到 stop（不含 stop）的元素。" },

  { ch: 5, front: "Name three common list methods.", back: "append(x) — add to end; pop() — remove and return last item; sort() — sort in place.", front_zh: "列出三个常用的列表方法。", back_zh: "append(x)——添加到末尾；pop()——移除并返回最后一个元素；sort()——就地排序。" },

  { ch: 5, front: "What is a dictionary in Python?", back: "An unordered collection of key-value pairs created with curly braces, e.g., {\"name\": \"Alice\", \"age\": 20}.", front_zh: "Python 中的字典是什么？", back_zh: "用花括号创建的无序键值对集合，例如 {\"name\": \"Alice\", \"age\": 20}。" },

  { ch: 5, front: "What is a list comprehension?", back: "A concise syntax to create a new list: [expression for item in iterable], optionally with an if filter.", front_zh: "什么是列表推导式？", back_zh: "创建新列表的简洁语法：[表达式 for 元素 in 可迭代对象]，可选地带有 if 过滤条件。" }

];
