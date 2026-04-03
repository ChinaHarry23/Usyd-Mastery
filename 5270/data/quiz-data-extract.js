// Auto-extracted quiz data from all chapters
// Generated: 2026-03-28T10:48:36.158Z
// Total questions: 200
// Schema: { ch, type, q, q_zh, opts, opts_zh, answer, exp, exp_zh }

var ALL_QUIZ_DATA = [
  {
    "ch": 1,
    "type": "study",
    "q": "What type of algorithm is Randomized QuickSort?",
    "q_zh": "随机快速排序属于哪种类型的算法？",
    "opts": [
      "Las Vegas: always correct, expected bounded time",
      "Monte Carlo: always bounded time, possibly wrong output",
      "Deterministic: always correct, always bounded time",
      "Average-case: correct when input is random"
    ],
    "opts_zh": [
      "拉斯维加斯：始终正确，期望时间有界",
      "蒙特卡罗：时间始终有界，输出可能错误",
      "确定性：始终正确，时间始终有界",
      "平均情况：输入随机时正确"
    ],
    "answer": 0,
    "exp": "Randomized QuickSort always produces the correct sorted output (it's a Las Vegas algorithm). Its running time is \\(O(n \\log n)\\) in expectation, but \\(O(n^2)\\) in the worst case.",
    "exp_zh": "随机快速排序始终产生正确的排序结果（它是拉斯维加斯算法）。其运行时间在期望下为 \\(O(n \\log n)\\)，但最坏情况为 \\(O(n^2)\\)。"
  },
  {
    "ch": 1,
    "type": "study",
    "q": "What is the expected number of consecutive same-suit pairs in a shuffled standard 52-card deck?",
    "q_zh": "一副标准52张牌洗牌后，连续相同花色对的期望数量是多少？",
    "opts": [
      "\\(10\\)",
      "\\(12\\)",
      "\\(13\\)",
      "\\(15\\)"
    ],
    "opts_zh": [
      "\\(10\\)",
      "\\(12\\)",
      "\\(13\\)",
      "\\(15\\)"
    ],
    "answer": 1,
    "exp": "For a deck of \\(4n\\) cards with \\(n\\) of each suit, the answer is \\(n - 1\\). With \\(n = 13\\), that gives \\(12\\).",
    "exp_zh": "对于一副 \\(4n\\) 张牌（每种花色 \\(n\\) 张），答案是 \\(n - 1\\)。当 \\(n = 13\\) 时，即为 \\(12\\)。"
  },
  {
    "ch": 1,
    "type": "study",
    "q": "Linearity of expectation requires the random variables to be independent. True or false?",
    "q_zh": "期望的线性性要求随机变量相互独立。对还是错？",
    "opts": [
      "False: no independence is needed",
      "True: independence is required"
    ],
    "opts_zh": [
      "错：不需要独立性",
      "对：需要独立性"
    ],
    "answer": 0,
    "exp": "Linearity of expectation holds ALWAYS: \\(\\mathbb{E}[X + Y] = \\mathbb{E}[X] + \\mathbb{E}[Y]\\), regardless of any dependence between \\(X\\) and \\(Y\\). This is perhaps the most important fact in this chapter!",
    "exp_zh": "期望的线性性始终成立：\\(\\mathbb{E}[X + Y] = \\mathbb{E}[X] + \\mathbb{E}[Y]\\)，无论 \\(X\\) 和 \\(Y\\) 之间有何依赖关系。这可能是本章最重要的事实！"
  },
  {
    "ch": 1,
    "type": "study",
    "q": "In the comparison count analysis of Randomized QuickSort, what is \\(\\Pr[a_i \\text{ and } a_j \\text{ are compared}]\\)?",
    "q_zh": "在随机快速排序的比较次数分析中，\\(\\Pr[a_i \\text{ 与 } a_j \\text{ 被比较}]\\) 是多少？",
    "opts": [
      "\\(\\dfrac{1}{n}\\)",
      "\\(\\dfrac{2}{n}\\)",
      "\\(\\dfrac{1}{j - i}\\)",
      "\\(\\dfrac{2}{j - i + 1}\\)"
    ],
    "opts_zh": [
      "\\(\\dfrac{1}{n}\\)",
      "\\(\\dfrac{2}{n}\\)",
      "\\(\\dfrac{1}{j - i}\\)",
      "\\(\\dfrac{2}{j - i + 1}\\)"
    ],
    "answer": 3,
    "exp": "Two elements \\(a_i\\) and \\(a_j\\) (with \\(i < j\\)) are compared iff the first element from \\(\\{a_i, a_{i+1}, \\ldots, a_j\\}\\) chosen as pivot is \\(a_i\\) or \\(a_j\\). There are \\(j - i + 1\\) elements, and 2 are \"good\", so the probability is \\(\\dfrac{2}{j - i + 1}\\).",
    "exp_zh": "两个元素 \\(a_i\\) 和 \\(a_j\\)（\\(i < j\\)）被比较当且仅当 \\(\\{a_i, a_{i+1}, \\ldots, a_j\\}\\) 中第一个被选为基准的是 \\(a_i\\) 或 \\(a_j\\)。共有 \\(j - i + 1\\) 个元素，其中2个满足条件，所以概率为 \\(\\dfrac{2}{j - i + 1}\\)。"
  },
  {
    "ch": 1,
    "type": "study",
    "q": "What is the variance of the number of fixed points of a random permutation of \\(\\{1, \\ldots, n\\}\\)?",
    "q_zh": "\\(\\{1, \\ldots, n\\}\\) 的随机排列的不动点个数的方差是多少？",
    "opts": [
      "\\(1\\)",
      "\\(0\\)",
      "\\(n\\)",
      "\\(\\dfrac{1}{n}\\)"
    ],
    "opts_zh": [
      "\\(1\\)",
      "\\(0\\)",
      "\\(n\\)",
      "\\(\\dfrac{1}{n}\\)"
    ],
    "answer": 0,
    "exp": "Both the expected value and the variance equal \\(1\\), regardless of \\(n\\). The variance calculation uses \\(\\mathbb{E}[X^2] = 2\\) and \\(\\mathbb{E}[X]^2 = 1\\).",
    "exp_zh": "期望值和方差都等于 \\(1\\)，与 \\(n\\) 无关。方差的计算利用 \\(\\mathbb{E}[X^2] = 2\\) 和 \\(\\mathbb{E}[X]^2 = 1\\)。"
  },
  {
    "ch": 1,
    "type": "study",
    "q": "In the von Neumann trick for generating a fair coin from a biased one, how many tosses are expected when \\(p = \\tfrac{1}{2}\\)?",
    "q_zh": "在冯·诺伊曼技巧中用偏置硬币生成公平硬币，当 \\(p = \\tfrac{1}{2}\\) 时期望需要多少次抛掷？",
    "opts": [
      "\\(2\\)",
      "\\(4\\)",
      "\\(8\\)",
      "\\(\\infty\\)"
    ],
    "opts_zh": [
      "\\(2\\)",
      "\\(4\\)",
      "\\(8\\)",
      "\\(\\infty\\)"
    ],
    "answer": 1,
    "exp": "Expected tosses \\(= \\dfrac{1}{p(1-p)}\\). For \\(p = \\tfrac{1}{2}\\): \\(\\dfrac{1}{1/4} = 4\\). Each attempt needs 2 tosses, and each attempt succeeds with probability \\(2 \\cdot \\tfrac{1}{2} \\cdot \\tfrac{1}{2} = \\tfrac{1}{2}\\), so expected attempts \\(= 2\\), times 2 tosses \\(= 4\\).",
    "exp_zh": "期望抛掷次数 \\(= \\dfrac{1}{p(1-p)}\\)。当 \\(p = \\tfrac{1}{2}\\) 时：\\(\\dfrac{1}{1/4} = 4\\)。每次尝试需要2次抛掷，每次尝试成功概率为 \\(2 \\times \\tfrac{1}{2} \\times \\tfrac{1}{2} = \\tfrac{1}{2}\\)，故期望尝试次数 \\(= 2\\)，乘以2次抛掷 \\(= 4\\)。"
  },
  {
    "ch": 1,
    "type": "study",
    "q": "What is the expected number of prefix-maxima in a random permutation of \\(n\\) elements?",
    "q_zh": "\\(n\\) 个元素的随机排列中，前缀最大值的期望数量是多少？",
    "opts": [
      "\\(n\\)",
      "\\(\\dfrac{n}{2}\\)",
      "\\(H_n = 1 + \\tfrac{1}{2} + \\cdots + \\tfrac{1}{n} = O(\\log n)\\)",
      "\\(\\log_2 n\\)"
    ],
    "opts_zh": [
      "\\(n\\)",
      "\\(\\dfrac{n}{2}\\)",
      "\\(H_n = 1 + \\tfrac{1}{2} + \\cdots + \\tfrac{1}{n} = O(\\log n)\\)",
      "\\(\\log_2 n\\)"
    ],
    "answer": 2,
    "exp": "The \\(i\\)-th element is a prefix-max with probability \\(\\dfrac{1}{i}\\). By linearity of expectation: \\(\\mathbb{E}[\\text{pf}] = \\sum_{i=1}^{n} \\dfrac{1}{i} = H_n = O(\\log n)\\).",
    "exp_zh": "第 \\(i\\) 个元素是前缀最大值的概率为 \\(\\dfrac{1}{i}\\)。由期望的线性性：\\(\\mathbb{E}[\\text{pf}] = \\sum_{i=1}^{n} \\dfrac{1}{i} = H_n = O(\\log n)\\)。"
  },
  {
    "ch": 1,
    "type": "study",
    "q": "For a \\(\\text{Bernoulli}(p)\\) random variable \\(X\\), what is \\(\\text{Var}[X]\\)?",
    "q_zh": "对于 \\(\\text{Bernoulli}(p)\\) 随机变量 \\(X\\)，\\(\\text{Var}[X]\\) 是多少？",
    "opts": [
      "\\(p\\)",
      "\\(1 - p\\)",
      "\\(p^2\\)",
      "\\(p(1 - p)\\)"
    ],
    "opts_zh": [
      "\\(p\\)",
      "\\(1 - p\\)",
      "\\(p^2\\)",
      "\\(p(1 - p)\\)"
    ],
    "answer": 3,
    "exp": "For \\(X \\sim \\text{Bernoulli}(p)\\): \\(\\mathbb{E}[X] = p\\), \\(\\mathbb{E}[X^2] = p\\) (since \\(X^2 = X\\)), so \\(\\text{Var}[X] = p - p^2 = p(1 - p)\\). Maximum variance \\(\\tfrac{1}{4}\\) at \\(p = \\tfrac{1}{2}\\).",
    "exp_zh": "对于 \\(X \\sim \\text{Bernoulli}(p)\\)：\\(\\mathbb{E}[X] = p\\)，\\(\\mathbb{E}[X^2] = p\\)（因为 \\(X^2 = X\\)），所以 \\(\\text{Var}[X] = p - p^2 = p(1 - p)\\)。方差最大值为 \\(\\tfrac{1}{4}\\)，在 \\(p = \\tfrac{1}{2}\\) 时取到。"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "What does \\(\\mathbb{E}[X]\\) represent?",
    "q_zh": "\\(\\mathbb{E}[X]\\) 代表什么？",
    "opts": [
      "The long-run average (expected value) of X",
      "The most likely value of X",
      "The maximum possible value of X",
      "The variance of X"
    ],
    "opts_zh": [
      "X 的长期平均值（期望值）",
      "X 最可能的取值",
      "X 的最大可能值",
      "X 的方差"
    ],
    "answer": 0,
    "exp": "E[X] is the expected value — the weighted average of all possible outcomes, weighted by their probabilities.",
    "exp_zh": "E[X] 是期望值——所有可能结果的加权平均，权重为各自的概率。"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "What does the symbol \\(\\sum_{i=1}^{n}\\) mean?",
    "q_zh": "符号 \\(\\sum_{i=1}^{n}\\) 是什么意思？",
    "opts": [
      "Multiply values from 1 to n",
      "Add up values for i = 1, 2, ..., n",
      "Take the integral from 1 to n",
      "Choose n items from i"
    ],
    "opts_zh": [
      "将1到n的值相乘",
      "将 i = 1, 2, ..., n 的值相加",
      "从1到n取积分",
      "从 i 中选 n 个"
    ],
    "answer": 1,
    "exp": "The capital sigma (Σ) denotes summation. You evaluate the expression for each integer i from 1 to n and add them all up.",
    "exp_zh": "大写 Σ 表示求和。对每个整数 i 从1到 n 计算表达式的值并全部加起来。"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "Which property does linearity of expectation require?",
    "q_zh": "期望的线性性需要什么条件？",
    "opts": [
      "The variables must be independent",
      "The variables must be identically distributed",
      "No special property — it always holds",
      "The variables must be non-negative"
    ],
    "opts_zh": [
      "变量必须独立",
      "变量必须同分布",
      "无需任何特殊条件——始终成立",
      "变量必须非负"
    ],
    "answer": 2,
    "exp": "Linearity of expectation holds unconditionally: E[X+Y] = E[X]+E[Y] for ANY random variables X, Y. No independence or other conditions needed!",
    "exp_zh": "期望的线性性无条件成立：对于任意随机变量 X, Y 都有 E[X+Y] = E[X]+E[Y]。无需独立性或其他条件！"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "If \\(X \\sim \\text{Bernoulli}(0.3)\\), what is \\(\\text{Var}[X]\\)?",
    "q_zh": "若 \\(X \\sim \\text{Bernoulli}(0.3)\\)，\\(\\text{Var}[X]\\) 是多少？",
    "opts": [
      "\\(0.3\\)",
      "\\(0.09\\)",
      "\\(0.7\\)",
      "\\(0.21\\)"
    ],
    "opts_zh": [
      "\\(0.3\\)",
      "\\(0.09\\)",
      "\\(0.7\\)",
      "\\(0.21\\)"
    ],
    "answer": 3,
    "exp": "For Bernoulli(p): Var[X] = p(1-p) = 0.3 × 0.7 = 0.21.",
    "exp_zh": "对于 Bernoulli(p)：Var[X] = p(1-p) = 0.3 × 0.7 = 0.21。"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "What is the expected number of trials until the first success in a Geometric(\\(q\\)) distribution?",
    "q_zh": "几何分布 Geometric(\\(q\\)) 中首次成功的期望试验次数是多少？",
    "opts": [
      "\\(1/q\\)",
      "\\(1 - q\\)",
      "\\(q^2\\)",
      "\\(q\\)"
    ],
    "opts_zh": [
      "\\(1/q\\)",
      "\\(1 - q\\)",
      "\\(q^2\\)",
      "\\(q\\)"
    ],
    "answer": 0,
    "exp": "The expected value of a Geometric(q) random variable is 1/q. For example, if each trial succeeds with probability 1/6, you expect 6 trials.",
    "exp_zh": "几何分布 Geometric(q) 随机变量的期望为 1/q。例如，每次试验成功概率为 1/6，则期望6次试验。"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "What does \\(\\mathbf{1}_E\\) equal when event \\(E\\) does NOT occur?",
    "q_zh": "当事件 \\(E\\) 未发生时，\\(\\mathbf{1}_E\\) 等于多少？",
    "opts": [
      "\\(-1\\)",
      "\\(0\\)",
      "\\(1\\)",
      "\\(\\Pr[E]\\)"
    ],
    "opts_zh": [
      "\\(-1\\)",
      "\\(0\\)",
      "\\(1\\)",
      "\\(\\Pr[E]\\)"
    ],
    "answer": 1,
    "exp": "The indicator variable 1_E equals 1 when E occurs and 0 when it doesn't. Its expectation equals Pr[E].",
    "exp_zh": "指示变量 1_E 在 E 发生时等于1，不发生时等于0。其期望等于 Pr[E]。"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "Which statement about \\(O(n \\log n)\\) vs \\(O(n^2)\\) is correct?",
    "q_zh": "关于 \\(O(n \\log n)\\) 和 \\(O(n^2)\\)，哪个说法正确？",
    "opts": [
      "\\(O(n^2)\\) grows slower",
      "They grow at the same rate",
      "\\(O(n \\log n)\\) grows slower",
      "It depends on the constant factors"
    ],
    "opts_zh": [
      "\\(O(n^2)\\) 增长更慢",
      "它们增长速度相同",
      "\\(O(n \\log n)\\) 增长更慢",
      "取决于常数因子"
    ],
    "answer": 2,
    "exp": "n log n grows much slower than n² for large n. That's why Randomized QuickSort's O(n log n) expected time is much better than the O(n²) worst case.",
    "exp_zh": "当 n 较大时，n log n 的增长远慢于 n²。这就是为什么随机快速排序的 O(n log n) 期望时间远优于 O(n²) 最坏情况。"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "Which of these is the correct shortcut formula for variance?",
    "q_zh": "以下哪个是方差的正确快捷公式？",
    "opts": [
      "\\(\\text{Var}[X] = \\mathbb{E}[X]^2 - \\mathbb{E}[X^2]\\)",
      "\\(\\text{Var}[X] = \\mathbb{E}[X^2] \\cdot \\mathbb{E}[X]^2\\)",
      "\\(\\text{Var}[X] = \\mathbb{E}[X^2] + \\mathbb{E}[X]^2\\)",
      "\\(\\text{Var}[X] = \\mathbb{E}[X^2] - \\mathbb{E}[X]^2\\)"
    ],
    "opts_zh": [
      "\\(\\text{Var}[X] = \\mathbb{E}[X]^2 - \\mathbb{E}[X^2]\\)",
      "\\(\\text{Var}[X] = \\mathbb{E}[X^2] \\cdot \\mathbb{E}[X]^2\\)",
      "\\(\\text{Var}[X] = \\mathbb{E}[X^2] + \\mathbb{E}[X]^2\\)",
      "\\(\\text{Var}[X] = \\mathbb{E}[X^2] - \\mathbb{E}[X]^2\\)"
    ],
    "answer": 3,
    "exp": "Var[X] = E[X²] - E[X]². Note the order: E[X²] first, minus E[X]². Since Var ≥ 0, this means E[X²] ≥ E[X]².",
    "exp_zh": "Var[X] = E[X²] - E[X]²。注意顺序：先 E[X²]，减去 E[X]²。由于 Var ≥ 0，这意味着 E[X²] ≥ E[X]²。"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "The Harmonic number \\(H_n = 1 + 1/2 + \\cdots + 1/n\\) grows as:",
    "q_zh": "调和数 \\(H_n = 1 + 1/2 + \\cdots + 1/n\\) 的增长阶为：",
    "opts": [
      "\\(\\Theta(\\log n)\\)",
      "\\(\\Theta(\\sqrt{n})\\)",
      "\\(\\Theta(1)\\) — it converges",
      "\\(\\Theta(n)\\)"
    ],
    "opts_zh": [
      "\\(\\Theta(\\log n)\\)",
      "\\(\\Theta(\\sqrt{n})\\)",
      "\\(\\Theta(1)\\) — 收敛",
      "\\(\\Theta(n)\\)"
    ],
    "answer": 0,
    "exp": "H_n = Θ(log n). More precisely, H_n ≈ ln n + 0.577..., so it grows logarithmically — slowly but unboundedly.",
    "exp_zh": "H_n = Θ(log n)。更精确地，H_n ≈ ln n + 0.577...，因此它以对数速度增长——缓慢但无界。"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "Jensen's inequality for a convex function \\(f\\) states:",
    "q_zh": "对于凸函数 \\(f\\)，延森不等式表述为：",
    "opts": [
      "\\(f(\\mathbb{E}[X]) \\geq \\mathbb{E}[f(X)]\\)",
      "\\(f(\\mathbb{E}[X]) \\leq \\mathbb{E}[f(X)]\\)",
      "\\(f(\\mathbb{E}[X]) = \\mathbb{E}[f(X)]\\)",
      "None of the above"
    ],
    "opts_zh": [
      "\\(f(\\mathbb{E}[X]) \\geq \\mathbb{E}[f(X)]\\)",
      "\\(f(\\mathbb{E}[X]) \\leq \\mathbb{E}[f(X)]\\)",
      "\\(f(\\mathbb{E}[X]) = \\mathbb{E}[f(X)]\\)",
      "以上都不对"
    ],
    "answer": 1,
    "exp": "For convex f: f(E[X]) ≤ E[f(X)]. 'The function of the average is at most the average of the function.' For concave f, the direction reverses.",
    "exp_zh": "对于凸函数 f：f(E[X]) ≤ E[f(X)]。'平均值的函数不超过函数的平均值。'对于凹函数，不等号方向相反。"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "The tail-sum formula \\(\\mathbb{E}[X] = \\sum_{n=?}^{\\infty} \\Pr[X \\geq n]\\) starts the sum at:",
    "q_zh": "尾和公式 \\(\\mathbb{E}[X] = \\sum_{n=?}^{\\infty} \\Pr[X \\geq n]\\) 的求和从哪里开始？",
    "opts": [
      "\\(n = 0\\)",
      "\\(n = 2\\)",
      "\\(n = 1\\)",
      "It depends on \\(X\\)"
    ],
    "opts_zh": [
      "\\(n = 0\\)",
      "\\(n = 2\\)",
      "\\(n = 1\\)",
      "取决于 \\(X\\)"
    ],
    "answer": 2,
    "exp": "The sum starts at n = 1. If it started at n = 0, the constant random variable X = 0 would give E[X] = Pr[X ≥ 0] = 1 ≠ 0, which is wrong.",
    "exp_zh": "求和从 n = 1 开始。若从 n = 0 开始，常数随机变量 X = 0 会给出 E[X] = Pr[X ≥ 0] = 1 ≠ 0，这是错误的。"
  },
  {
    "ch": 1,
    "type": "math",
    "q": "If \\(X_1, \\ldots, X_n\\) are pairwise independent, which holds?",
    "q_zh": "若 \\(X_1, \\ldots, X_n\\) 两两独立，以下哪个成立？",
    "opts": [
      "Neither holds",
      "Only \\(\\mathbb{E}[\\sum X_i] = \\sum \\mathbb{E}[X_i]\\)",
      "Only \\(\\text{Var}[\\sum X_i] = \\sum \\text{Var}[X_i]\\)",
      "\\(\\text{Var}[\\sum X_i] = \\sum \\text{Var}[X_i]\\) and \\(\\mathbb{E}[\\sum X_i] = \\sum \\mathbb{E}[X_i]\\)"
    ],
    "opts_zh": [
      "都不成立",
      "仅 \\(\\mathbb{E}[\\sum X_i] = \\sum \\mathbb{E}[X_i]\\) 成立",
      "仅 \\(\\text{Var}[\\sum X_i] = \\sum \\text{Var}[X_i]\\) 成立",
      "\\(\\text{Var}[\\sum X_i] = \\sum \\text{Var}[X_i]\\) 和 \\(\\mathbb{E}[\\sum X_i] = \\sum \\mathbb{E}[X_i]\\) 都成立"
    ],
    "answer": 3,
    "exp": "Linearity of expectation always holds (no independence needed). Variance of sums equals sum of variances under pairwise independence. So both hold!",
    "exp_zh": "期望的线性性始终成立（无需独立性）。在两两独立条件下，方差的求和等于各方差之和。因此两者都成立！"
  },
  {
    "ch": 2,
    "type": "study",
    "q": "Markov's inequality requires that the random variable is:",
    "q_zh": "马尔可夫不等式要求随机变量满足什么条件？",
    "opts": [
      "Non-negative",
      "Normally distributed",
      "Has finite variance",
      "A sum of independent r.v.s"
    ],
    "opts_zh": [
      "非负",
      "服从正态分布",
      "具有有限方差",
      "是独立随机变量的和"
    ],
    "answer": 0,
    "exp": "Markov's inequality only requires \\(X \\geq 0\\) and \\(\\mathbb{E}[X] < \\infty\\).",
    "exp_zh": "马尔可夫不等式只要求 \\(X \\geq 0\\) 且 \\(\\mathbb{E}[X] < \\infty\\)。"
  },
  {
    "ch": 2,
    "type": "study",
    "q": "Chebyshev's inequality gives a tail bound that decays as:",
    "q_zh": "切比雪夫不等式给出的尾部界衰减速度为：",
    "opts": [
      "\\(1/t\\) (linear)",
      "\\(1/t^2\\) (quadratic)",
      "\\(e^{-t}\\) (exponential)",
      "\\(1/t^3\\) (cubic)"
    ],
    "opts_zh": [
      "\\(1/t\\)（线性）",
      "\\(1/t^2\\)（二次）",
      "\\(e^{-t}\\)（指数）",
      "\\(1/t^3\\)（三次）"
    ],
    "answer": 1,
    "exp": "Chebyshev's inequality bounds \\(\\Pr[|X - \\mathbb{E}[X]| \\geq t] \\leq \\operatorname{Var}[X] / t^2\\), a quadratic decay.",
    "exp_zh": "切比雪夫不等式给出 \\(\\Pr[|X - \\mathbb{E}[X]| \\geq t] \\leq \\operatorname{Var}[X] / t^2\\)，即二次衰减。"
  },
  {
    "ch": 2,
    "type": "study",
    "q": "The Union Bound states that \\(\\Pr[E_1 \\cup E_2 \\cup \\cdots \\cup E_k]\\) is at most:",
    "q_zh": "联合界（Union Bound）表明 \\(\\Pr[E_1 \\cup E_2 \\cup \\cdots \\cup E_k]\\) 至多为：",
    "opts": [
      "\\(\\Pr[E_1] \\cdot \\Pr[E_2] \\cdots \\Pr[E_k]\\)",
      "\\(\\max_i \\Pr[E_i]\\)",
      "\\(\\sum_{i=1}^{k} \\Pr[E_i]\\)",
      "\\(k \\cdot \\max_i \\Pr[E_i]\\)"
    ],
    "opts_zh": [
      "\\(\\Pr[E_1] \\cdot \\Pr[E_2] \\cdots \\Pr[E_k]\\)",
      "\\(\\max_i \\Pr[E_i]\\)",
      "\\(\\sum_{i=1}^{k} \\Pr[E_i]\\)",
      "\\(k \\cdot \\max_i \\Pr[E_i]\\)"
    ],
    "answer": 2,
    "exp": "The Union Bound: \\(\\Pr[\\bigcup E_i] \\leq \\sum \\Pr[E_i]\\). No independence assumptions needed!",
    "exp_zh": "联合界：\\(\\Pr[\\bigcup E_i] \\leq \\sum \\Pr[E_i]\\)。不需要独立性假设！"
  },
  {
    "ch": 2,
    "type": "study",
    "q": "In the Randomised Median algorithm, what is the optimal choice of \\(m\\)?",
    "q_zh": "在随机中位数算法中，\\(m\\) 的最优选取是什么？",
    "opts": [
      "\\(m = \\sqrt{n}\\)",
      "\\(m = \\log n\\)",
      "\\(m = n / \\log n\\)",
      "\\(m = n^{2/3}\\)"
    ],
    "opts_zh": [
      "\\(m = \\sqrt{n}\\)",
      "\\(m = \\log n\\)",
      "\\(m = n / \\log n\\)",
      "\\(m = n^{2/3}\\)"
    ],
    "answer": 3,
    "exp": "Balancing \\(m \\log m\\) and \\(\\frac{n}{\\sqrt{m}} \\log \\frac{n}{\\sqrt{m}}\\) gives \\(m = n^{2/3}\\).",
    "exp_zh": "平衡 \\(m \\log m\\) 和 \\(\\frac{n}{\\sqrt{m}} \\log \\frac{n}{\\sqrt{m}}\\) 得到 \\(m = n^{2/3}\\)。"
  },
  {
    "ch": 2,
    "type": "study",
    "q": "Probability amplification by repetition converts failure probability \\(p\\) into \\(p^T\\) using \\(T\\) independent runs. This requires:",
    "q_zh": "通过重复的概率放大将失败概率 \\(p\\) 降低为 \\(p^T\\)。这要求：",
    "opts": [
      "The algorithm can detect when it fails",
      "The algorithm has two-sided error",
      "The algorithm uses no random bits",
      "The algorithm runs in constant time"
    ],
    "opts_zh": [
      "算法能够检测自身的失败",
      "算法具有双侧错误",
      "算法不使用随机比特",
      "算法在常数时间内运行"
    ],
    "answer": 0,
    "exp": "Repetition-based amplification works when the algorithm reports FAIL explicitly, so we know when to re-run.",
    "exp_zh": "基于重复的概率放大在算法能明确报告 FAIL 时有效，这样我们知道何时重新运行。"
  },
  {
    "ch": 2,
    "type": "study",
    "q": "The Chernoff bound gives a tail probability that decays:",
    "q_zh": "切尔诺夫界给出的尾部概率衰减速度为：",
    "opts": [
      "Linearly in \\(n\\)",
      "Exponentially in \\(n\\)",
      "Quadratically in \\(n\\)",
      "Logarithmically in \\(n\\)"
    ],
    "opts_zh": [
      "关于 \\(n\\) 线性衰减",
      "关于 \\(n\\) 指数衰减",
      "关于 \\(n\\) 二次衰减",
      "关于 \\(n\\) 对数衰减"
    ],
    "answer": 1,
    "exp": "The Chernoff bound gives \\(\\exp(-\\Theta(n))\\) decay, exponential in the number of independent terms.",
    "exp_zh": "切尔诺夫界给出 \\(\\exp(-\\Theta(n))\\) 的衰减，关于独立项的数量呈指数衰减。"
  },
  {
    "ch": 2,
    "type": "study",
    "q": "To convert a Monte Carlo algorithm (with detectable failure) to a Las Vegas algorithm, the expected number of repetitions is:",
    "q_zh": "将一个（可检测失败的）蒙特卡罗算法转化为拉斯维加斯算法，期望重复次数为：",
    "opts": [
      "\\(O(\\log(1/p))\\)",
      "\\(\\dfrac{1}{p}\\)",
      "\\(\\dfrac{1}{1-p}\\)",
      "\\(O(n)\\)"
    ],
    "opts_zh": [
      "\\(O(\\log(1/p))\\)",
      "\\(\\dfrac{1}{p}\\)",
      "\\(\\dfrac{1}{1-p}\\)",
      "\\(O(n)\\)"
    ],
    "answer": 2,
    "exp": "The number of repetitions is geometric with success probability \\(1-p\\), so \\(\\mathbb{E}[K] = \\frac{1}{1-p}\\).",
    "exp_zh": "重复次数服从成功概率为 \\(1-p\\) 的几何分布，因此 \\(\\mathbb{E}[K] = \\frac{1}{1-p}\\)。"
  },
  {
    "ch": 2,
    "type": "study",
    "q": "The majority vote amplification technique requires the individual success probability to be:",
    "q_zh": "多数表决概率放大技术要求单次成功概率满足：",
    "opts": [
      "Exactly \\(\\dfrac{1}{2}\\)",
      "Any positive probability",
      "At least \\(\\dfrac{1}{n}\\)",
      "Strictly greater than \\(\\dfrac{1}{2}\\)"
    ],
    "opts_zh": [
      "恰好为 \\(\\dfrac{1}{2}\\)",
      "任意正概率",
      "至少为 \\(\\dfrac{1}{n}\\)",
      "严格大于 \\(\\dfrac{1}{2}\\)"
    ],
    "answer": 3,
    "exp": "Majority vote works when each trial is correct with probability \\(> 1/2\\) (e.g. 60%). With exactly \\(1/2\\), majority vote gives no improvement.",
    "exp_zh": "多数表决在每次试验正确概率 \\(> 1/2\\)（如 60%）时有效。恰好为 \\(1/2\\) 时无改进。"
  },
  {
    "ch": 2,
    "type": "study",
    "q": "What is the failure probability of the Randomised Median algorithm (Algorithm 3)?",
    "q_zh": "随机中位数算法（算法 3）的失败概率是多少？",
    "opts": [
      "\\(\\dfrac{3}{16}\\)",
      "\\(\\dfrac{1}{16}\\)",
      "\\(\\dfrac{1}{4}\\)",
      "\\(\\dfrac{1}{100}\\)"
    ],
    "opts_zh": [
      "\\(\\dfrac{3}{16}\\)",
      "\\(\\dfrac{1}{16}\\)",
      "\\(\\dfrac{1}{4}\\)",
      "\\(\\dfrac{1}{100}\\)"
    ],
    "answer": 0,
    "exp": "By union bound over three bad events, each bounded by \\(\\frac{1}{16}\\): failure \\(\\leq \\frac{3}{16}\\).",
    "exp_zh": "对三个坏事件取联合界，每个界为 \\(\\frac{1}{16}\\)：失败概率 \\(\\leq \\frac{3}{16}\\)。"
  },
  {
    "ch": 2,
    "type": "study",
    "q": "Which concentration inequality requires the strongest independence assumption?",
    "q_zh": "哪个集中不等式需要最强的独立性假设？",
    "opts": [
      "Markov's inequality",
      "Chernoff bound",
      "Chebyshev's inequality",
      "They all require the same"
    ],
    "opts_zh": [
      "马尔可夫不等式",
      "切尔诺夫界",
      "切比雪夫不等式",
      "它们要求相同的条件"
    ],
    "answer": 1,
    "exp": "Markov needs no independence. Chebyshev only needs pairwise independence. Chernoff/Hoeffding need full (mutual) independence.",
    "exp_zh": "马尔可夫不需要独立性。切比雪夫只需两两独立。切尔诺夫/霍夫丁需要完全（相互）独立。"
  },
  {
    "ch": 2,
    "type": "math",
    "q": "What is the MGF of a Bernoulli(\\(p\\)) random variable?",
    "q_zh": "Bernoulli(\\(p\\)) 随机变量的矩母函数是什么？",
    "opts": [
      "\\(pe^t\\)",
      "\\(e^{pt}\\)",
      "\\(1 + p(e^t - 1)\\)",
      "\\(p + (1-p)e^t\\)"
    ],
    "opts_zh": [
      "\\(pe^t\\)",
      "\\(e^{pt}\\)",
      "\\(1 + p(e^t - 1)\\)",
      "\\(p + (1-p)e^t\\)"
    ],
    "answer": 2,
    "exp": "\\(\\mathbb{E}[e^{tX}] = (1-p) \\cdot 1 + p \\cdot e^t = 1 + p(e^t - 1)\\).",
    "exp_zh": "\\(\\mathbb{E}[e^{tX}] = (1-p) \\cdot 1 + p \\cdot e^t = 1 + p(e^t - 1)\\)。"
  },
  {
    "ch": 2,
    "type": "math",
    "q": "The inequality \\(\\ln(1+x) \\leq x\\) is equivalent to:",
    "q_zh": "不等式 \\(\\ln(1+x) \\leq x\\) 等价于：",
    "opts": [
      "\\(e^x \\leq 1 + x\\)",
      "\\(x \\leq e^{x-1}\\)",
      "\\(\\ln(x) \\leq x\\)",
      "\\(1 + x \\leq e^x\\)"
    ],
    "opts_zh": [
      "\\(e^x \\leq 1 + x\\)",
      "\\(x \\leq e^{x-1}\\)",
      "\\(\\ln(x) \\leq x\\)",
      "\\(1 + x \\leq e^x\\)"
    ],
    "answer": 3,
    "exp": "Exponentiating both sides of \\(\\ln(1+x) \\leq x\\) gives \\(1+x \\leq e^x\\).",
    "exp_zh": "对 \\(\\ln(1+x) \\leq x\\) 两边取指数得 \\(1+x \\leq e^x\\)。"
  },
  {
    "ch": 2,
    "type": "math",
    "q": "The geometric series \\(\\sum_{k=0}^{\\infty} r^k\\) converges to \\(\\frac{1}{1-r}\\) when:",
    "q_zh": "几何级数 \\(\\sum_{k=0}^{\\infty} r^k\\) 收敛到 \\(\\frac{1}{1-r}\\) 的条件是：",
    "opts": [
      "\\(|r| < 1\\)",
      "\\(r > 0\\)",
      "\\(r < 1\\)",
      "\\(r \\neq 1\\)"
    ],
    "opts_zh": [
      "\\(|r| < 1\\)",
      "\\(r > 0\\)",
      "\\(r < 1\\)",
      "\\(r \\neq 1\\)"
    ],
    "answer": 0,
    "exp": "The geometric series converges if and only if \\(|r| < 1\\).",
    "exp_zh": "几何级数收敛当且仅当 \\(|r| < 1\\)。"
  },
  {
    "ch": 2,
    "type": "math",
    "q": "In the Chernoff proof, the optimal value of the free parameter \\(t\\) is:",
    "q_zh": "在切尔诺夫界的证明中，自由参数 \\(t\\) 的最优值为：",
    "opts": [
      "\\(t = \\gamma\\)",
      "\\(t = \\ln(1+\\gamma)\\)",
      "\\(t = 1/\\gamma\\)",
      "\\(t = \\gamma^2/3\\)"
    ],
    "opts_zh": [
      "\\(t = \\gamma\\)",
      "\\(t = \\ln(1+\\gamma)\\)",
      "\\(t = 1/\\gamma\\)",
      "\\(t = \\gamma^2/3\\)"
    ],
    "answer": 1,
    "exp": "Setting \\(f'(t) = (1+\\gamma) - e^t = 0\\) gives \\(t = \\ln(1+\\gamma)\\).",
    "exp_zh": "令 \\(f'(t) = (1+\\gamma) - e^t = 0\\) 得 \\(t = \\ln(1+\\gamma)\\)。"
  },
  {
    "ch": 2,
    "type": "math",
    "q": "For a Poisson(\\(\\lambda\\)) random variable, which is true?",
    "q_zh": "对于 Poisson(\\(\\lambda\\)) 随机变量，以下哪项正确？",
    "opts": [
      "\\(\\mathbb{E}[X] = \\lambda\\), \\(\\operatorname{Var}[X] = \\lambda^2\\)",
      "\\(\\mathbb{E}[X] = \\lambda^2\\), \\(\\operatorname{Var}[X] = \\lambda\\)",
      "\\(\\mathbb{E}[X] = \\lambda\\), \\(\\operatorname{Var}[X] = \\lambda\\)",
      "\\(\\mathbb{E}[X] = 1/\\lambda\\), \\(\\operatorname{Var}[X] = 1/\\lambda^2\\)"
    ],
    "opts_zh": [
      "\\(\\mathbb{E}[X] = \\lambda\\), \\(\\operatorname{Var}[X] = \\lambda^2\\)",
      "\\(\\mathbb{E}[X] = \\lambda^2\\), \\(\\operatorname{Var}[X] = \\lambda\\)",
      "\\(\\mathbb{E}[X] = \\lambda\\), \\(\\operatorname{Var}[X] = \\lambda\\)",
      "\\(\\mathbb{E}[X] = 1/\\lambda\\), \\(\\operatorname{Var}[X] = 1/\\lambda^2\\)"
    ],
    "answer": 2,
    "exp": "A Poisson random variable has both expectation and variance equal to \\(\\lambda\\).",
    "exp_zh": "泊松随机变量的期望和方差都等于 \\(\\lambda\\)。"
  },
  {
    "ch": 2,
    "type": "math",
    "q": "The MGF technique for proving tail bounds works because:",
    "q_zh": "用矩母函数技术证明尾部界的原理是：",
    "opts": [
      "\\(e^{tx}\\) is a decreasing function for \\(t > 0\\)",
      "It avoids the need for independence",
      "\\(e^{tx}\\) is bounded in \\([0,1]\\)",
      "\\(e^{tx}\\) is non-negative and increasing, enabling Markov's inequality"
    ],
    "opts_zh": [
      "\\(e^{tx}\\) 对 \\(t > 0\\) 是递减函数",
      "它不需要独立性假设",
      "\\(e^{tx}\\) 有界于 \\([0,1]\\)",
      "\\(e^{tx}\\) 非负且递增，可以应用马尔可夫不等式"
    ],
    "answer": 3,
    "exp": "The key insight is that \\(e^{tx}\\) is non-negative (so Markov applies) and strictly increasing (so it preserves the event \\(X \\geq a\\)).",
    "exp_zh": "关键在于 \\(e^{tx}\\) 非负（马尔可夫适用）且严格递增（保持事件 \\(X \\geq a\\)）。"
  },
  {
    "ch": 3,
    "type": "study",
    "q": "In the Birthday Paradox, approximately how many people are needed for a 50% chance of a shared birthday (365 days)?",
    "q_zh": "在生日悖论中，大约需要多少人才有 50% 的概率出现相同生日（365天）？",
    "opts": [
      "23",
      "10",
      "50",
      "183"
    ],
    "opts_zh": [
      "23",
      "10",
      "50",
      "183"
    ],
    "answer": 0,
    "exp": "The Birthday Paradox: with 23 people, \\(p_{23,365} \\approx 0.507 > 1/2\\).",
    "exp_zh": "生日悖论：23 人时，\\(p_{23,365} \\approx 0.507 > 1/2\\)。"
  },
  {
    "ch": 3,
    "type": "study",
    "q": "The expected number of collisions when throwing \\(m\\) balls into \\(n\\) bins uniformly is:",
    "q_zh": "将 \\(m\\) 个球均匀投入 \\(n\\) 个箱时，期望碰撞数为：",
    "opts": [
      "\\(m/n\\)",
      "\\(\\binom{m}{2}/n\\)",
      "\\(m^2/n\\)",
      "\\(m \\ln n\\)"
    ],
    "opts_zh": [
      "\\(m/n\\)",
      "\\(\\binom{m}{2}/n\\)",
      "\\(m^2/n\\)",
      "\\(m \\ln n\\)"
    ],
    "answer": 1,
    "exp": "By linearity of expectation: \\(c(m,n) = \\binom{m}{2} \\cdot \\frac{1}{n}\\).",
    "exp_zh": "由期望的线性性：\\(c(m,n) = \\binom{m}{2} \\cdot \\frac{1}{n}\\)。"
  },
  {
    "ch": 3,
    "type": "study",
    "q": "The collision threshold \\(m\\) for \\(n\\) bins (50% probability of at least one collision) is:",
    "q_zh": "\\(n\\) 个箱的碰撞阈值 \\(m\\)（50% 概率至少一次碰撞）为：",
    "opts": [
      "\\(\\Theta(\\log n)\\)",
      "\\(\\Theta(n)\\)",
      "\\(\\Theta(\\sqrt{n})\\)",
      "\\(\\Theta(n \\log n)\\)"
    ],
    "opts_zh": [
      "\\(\\Theta(\\log n)\\)",
      "\\(\\Theta(n)\\)",
      "\\(\\Theta(\\sqrt{n})\\)",
      "\\(\\Theta(n \\log n)\\)"
    ],
    "answer": 2,
    "exp": "Theorem 17: collisions start appearing when \\(m = \\Theta(\\sqrt{n})\\).",
    "exp_zh": "定理 17：当 \\(m = \\Theta(\\sqrt{n})\\) 时开始出现碰撞。"
  },
  {
    "ch": 3,
    "type": "study",
    "q": "The expected number of balls to collect all \\(n\\) coupons (Coupon Collector) is:",
    "q_zh": "收集所有 \\(n\\) 张赠券的期望投球数（赠券收集者）为：",
    "opts": [
      "\\(n\\)",
      "\\(n \\ln n\\)",
      "\\(n^2\\)",
      "\\(nH_n\\)"
    ],
    "opts_zh": [
      "\\(n\\)",
      "\\(n \\ln n\\)",
      "\\(n^2\\)",
      "\\(nH_n\\)"
    ],
    "answer": 3,
    "exp": "Theorem 18: \\(M(n) = nH_n = n\\ln n + \\gamma n + O(1)\\).",
    "exp_zh": "定理 18：\\(M(n) = nH_n = n\\ln n + \\gamma n + O(1)\\)。"
  },
  {
    "ch": 3,
    "type": "study",
    "q": "The variance of the Coupon Collector waiting time satisfies \\(\\operatorname{Var}[m(n)] \\leq\\):",
    "q_zh": "赠券收集者等待时间的方差满足 \\(\\operatorname{Var}[m(n)] \\leq\\)：",
    "opts": [
      "\\(\\pi^2 n^2 / 6\\)",
      "\\(n \\log n\\)",
      "\\(n\\)",
      "\\(n^3\\)"
    ],
    "opts_zh": [
      "\\(\\pi^2 n^2 / 6\\)",
      "\\(n \\log n\\)",
      "\\(n\\)",
      "\\(n^3\\)"
    ],
    "answer": 0,
    "exp": "Theorem 19: \\(\\operatorname{Var}[m(n)] \\leq \\frac{\\pi^2}{6}n^2\\), using independence of geometric stages.",
    "exp_zh": "定理 19：\\(\\operatorname{Var}[m(n)] \\leq \\frac{\\pi^2}{6}n^2\\)，利用了几何随机变量的独立性。"
  },
  {
    "ch": 3,
    "type": "study",
    "q": "When throwing \\(n\\) balls into \\(n\\) bins uniformly, the expected maximum load is:",
    "q_zh": "将 \\(n\\) 个球均匀投入 \\(n\\) 个箱，期望最大负载为：",
    "opts": [
      "\\(\\Theta(1)\\)",
      "\\(\\Theta(\\log n / \\log\\log n)\\)",
      "\\(\\Theta(\\sqrt{n})\\)",
      "\\(\\Theta(\\log n)\\)"
    ],
    "opts_zh": [
      "\\(\\Theta(1)\\)",
      "\\(\\Theta(\\log n / \\log\\log n)\\)",
      "\\(\\Theta(\\sqrt{n})\\)",
      "\\(\\Theta(\\log n)\\)"
    ],
    "answer": 1,
    "exp": "Theorem 20: \\(L(n) = \\Theta(\\log n / \\log\\log n)\\).",
    "exp_zh": "定理 20：\\(L(n) = \\Theta(\\log n / \\log\\log n)\\)。"
  },
  {
    "ch": 3,
    "type": "study",
    "q": "With the 'power of two choices' strategy, the expected maximum load becomes:",
    "q_zh": "使用“两次选择的力量”策略，期望最大负载变为：",
    "opts": [
      "\\(\\Theta(\\log n / \\log\\log n)\\)",
      "\\(\\Theta(\\sqrt{\\log n})\\)",
      "\\(\\log\\log n + O(1)\\)",
      "\\(O(1)\\)"
    ],
    "opts_zh": [
      "\\(\\Theta(\\log n / \\log\\log n)\\)",
      "\\(\\Theta(\\sqrt{\\log n})\\)",
      "\\(\\log\\log n + O(1)\\)",
      "\\(O(1)\\)"
    ],
    "answer": 2,
    "exp": "Theorem 21: the two-choices strategy reduces the max load to \\(\\log\\log n + O(1)\\), an exponential improvement.",
    "exp_zh": "定理 21：两次选择策略将最大负载降至 \\(\\log\\log n + O(1)\\)，这是指数级的改进。"
  },
  {
    "ch": 3,
    "type": "study",
    "q": "The key technique used to compute \\(\\mathbb{E}[C]\\) (expected collisions) is:",
    "q_zh": "计算 \\(\\mathbb{E}[C]\\)（期望碰撞数）的关键技术是：",
    "opts": [
      "Chernoff bound",
      "Stirling’s approximation",
      "Moment generating functions",
      "Linearity of expectation with indicator variables"
    ],
    "opts_zh": [
      "切尔诺夫界",
      "Stirling 近似",
      "矩生成函数",
      "期望的线性性与指示变量"
    ],
    "answer": 3,
    "exp": "We define indicators \\(\\mathbf{1}[X_i = X_j]\\) for each pair and sum using linearity of expectation.",
    "exp_zh": "我们对每对定义指示变量 \\(\\mathbf{1}[X_i = X_j]\\)，然后利用期望的线性性求和。"
  },
  {
    "ch": 3,
    "type": "study",
    "q": "In the Coupon Collector proof, the key property used is that \\(T_1, \\ldots, T_n\\) are:",
    "q_zh": "在赠券收集者证明中，关键性质是 \\(T_1, \\ldots, T_n\\) 是：",
    "opts": [
      "Independent geometric random variables",
      "Bernoulli random variables",
      "Identically distributed",
      "Negatively correlated"
    ],
    "opts_zh": [
      "独立的几何随机变量",
      "伯努利随机变量",
      "同分布的",
      "负相关的"
    ],
    "answer": 0,
    "exp": "Each \\(T_i\\) is geometric with parameter \\(p_i = (n-i+1)/n\\), and they are independent due to the memorylessness of the geometric distribution.",
    "exp_zh": "每个 \\(T_i\\) 是参数为 \\(p_i = (n-i+1)/n\\) 的几何随机变量，由于几何分布的无记忆性，它们是独立的。"
  },
  {
    "ch": 3,
    "type": "study",
    "q": "The variance of the collision count \\(C\\) equals \\(\\binom{m}{2}\\frac{1}{n}(1-\\frac{1}{n})\\). This is surprising because:",
    "q_zh": "碰撞计数 \\(C\\) 的方差等于 \\(\\binom{m}{2}\\frac{1}{n}(1-\\frac{1}{n})\\)。这很意外因为：",
    "opts": [
      "The indicators are independent",
      "The indicators are NOT independent, yet the variance matches the independent case",
      "We used Chernoff bounds",
      "The collision count is always constant"
    ],
    "opts_zh": [
      "指示变量是独立的",
      "指示变量不独立，但方差与独立情况一致",
      "我们使用了切尔诺夫界",
      "碰撞计数总是常数"
    ],
    "answer": 1,
    "exp": "The indicators are dependent (overlapping pairs share a ball), but the ‘magic cancellation’ in the variance calculation gives the same result as if they were independent.",
    "exp_zh": "指示变量是相关的（重叠的对共享一个球），但方差计算中的“神奇消除”给出了与独立情况相同的结果。"
  },
  {
    "ch": 3,
    "type": "math",
    "q": "What is \\(H_n\\) asymptotically?",
    "q_zh": "谐波数 \\(H_n\\) 的渐近展开是什么？",
    "opts": [
      "\\(n \\ln n\\)",
      "\\(\\ln n + 1\\)",
      "\\(\\ln n + \\gamma + O(1/n)\\)",
      "\\(n / \\ln n\\)"
    ],
    "opts_zh": [
      "\\(n \\ln n\\)",
      "\\(\\ln n + 1\\)",
      "\\(\\ln n + \\gamma + O(1/n)\\)",
      "\\(n / \\ln n\\)"
    ],
    "answer": 2,
    "exp": "The harmonic number satisfies \\(H_n = \\ln n + \\gamma + O(1/n)\\) where \\(\\gamma \\approx 0.5772\\) is the Euler–Mascheroni constant.",
    "exp_zh": "谐波数满足 \\(H_n = \\ln n + \\gamma + O(1/n)\\)，其中 \\(\\gamma \\approx 0.5772\\) 是欧拉–马斯切罗尼常数。"
  },
  {
    "ch": 3,
    "type": "math",
    "q": "What is Stirling’s approximation for \\(n!\\)?",
    "q_zh": "斯特林公式对 \\(n!\\) 的近似是什么？",
    "opts": [
      "\\(n^n\\)",
      "\\(e^n \\cdot n^2\\)",
      "\\(2^n / \\sqrt{n}\\)",
      "\\(\\sqrt{2\\pi n}\\,(n/e)^n\\)"
    ],
    "opts_zh": [
      "\\(n^n\\)",
      "\\(e^n \\cdot n^2\\)",
      "\\(2^n / \\sqrt{n}\\)",
      "\\(\\sqrt{2\\pi n}\\,(n/e)^n\\)"
    ],
    "answer": 3,
    "exp": "Stirling’s approximation states \\(n! \\sim \\sqrt{2\\pi n}\\,(n/e)^n\\), giving an excellent asymptotic estimate.",
    "exp_zh": "斯特林公式表明 \\(n! \\sim \\sqrt{2\\pi n}\\,(n/e)^n\\)，这是一个非常精确的渐近估计。"
  },
  {
    "ch": 3,
    "type": "math",
    "q": "What is the variance of a Geometric(\\(p\\)) random variable?",
    "q_zh": "Geometric(\\(p\\)) 随机变量的方差是多少？",
    "opts": [
      "\\((1-p)/p^2\\)",
      "\\(1/p\\)",
      "\\(p(1-p)\\)",
      "\\(1/p^2\\)"
    ],
    "opts_zh": [
      "\\((1-p)/p^2\\)",
      "\\(1/p\\)",
      "\\(p(1-p)\\)",
      "\\(1/p^2\\)"
    ],
    "answer": 0,
    "exp": "For a Geometric(\\(p\\)) variable, \\(\\operatorname{Var}[X] = (1-p)/p^2\\). The mean is \\(1/p\\).",
    "exp_zh": "对于 Geometric(\\(p\\)) 变量，\\(\\operatorname{Var}[X] = (1-p)/p^2\\)。期望为 \\(1/p\\)。"
  },
  {
    "ch": 3,
    "type": "math",
    "q": "Which is an upper bound on \\(\\binom{n}{k}\\)?",
    "q_zh": "\\(\\binom{n}{k}\\) 的上界是哪个？",
    "opts": [
      "\\(n^k\\)",
      "\\((en/k)^k\\)",
      "\\(2^n / n\\)",
      "\\(k^n\\)"
    ],
    "opts_zh": [
      "\\(n^k\\)",
      "\\((en/k)^k\\)",
      "\\(2^n / n\\)",
      "\\(k^n\\)"
    ],
    "answer": 1,
    "exp": "A standard bound is \\(\\binom{n}{k} \\leq (en/k)^k\\), derived from \\(\\binom{n}{k} \\leq (n/k)^k \\cdot e^k\\).",
    "exp_zh": "一个标准上界是 \\(\\binom{n}{k} \\leq (en/k)^k\\)，由 \\(\\binom{n}{k} \\leq (n/k)^k \\cdot e^k\\) 得出。"
  },
  {
    "ch": 3,
    "type": "math",
    "q": "\\(\\mathbb{E}[\\mathbf{1}_A]\\) equals:",
    "q_zh": "\\(\\mathbb{E}[\\mathbf{1}_A]\\) 等于：",
    "opts": [
      "\\(\\operatorname{Var}[A]\\)",
      "\\(1 - \\Pr[A]\\)",
      "\\(\\Pr[A]\\)",
      "\\(\\Pr[A]^2\\)"
    ],
    "opts_zh": [
      "\\(\\operatorname{Var}[A]\\)",
      "\\(1 - \\Pr[A]\\)",
      "\\(\\Pr[A]\\)",
      "\\(\\Pr[A]^2\\)"
    ],
    "answer": 2,
    "exp": "The indicator variable \\(\\mathbf{1}_A\\) takes value 1 with probability \\(\\Pr[A]\\) and 0 otherwise, so \\(\\mathbb{E}[\\mathbf{1}_A] = \\Pr[A]\\).",
    "exp_zh": "指示变量 \\(\\mathbf{1}_A\\) 以概率 \\(\\Pr[A]\\) 取值 1，否则取 0，因此 \\(\\mathbb{E}[\\mathbf{1}_A] = \\Pr[A]\\)。"
  },
  {
    "ch": 3,
    "type": "math",
    "q": "When does \\(\\operatorname{Var}[\\sum_i X_i] = \\sum_i \\operatorname{Var}[X_i]\\) hold?",
    "q_zh": "什么条件下 \\(\\operatorname{Var}[\\sum_i X_i] = \\sum_i \\operatorname{Var}[X_i]\\) 成立？",
    "opts": [
      "Always",
      "When \\(\\mathbb{E}[X_i] = 0\\) for all \\(i\\)",
      "Only for Bernoulli variables",
      "When the variables are (pairwise) independent"
    ],
    "opts_zh": [
      "总是成立",
      "当所有 \\(\\mathbb{E}[X_i] = 0\\) 时",
      "仅对伯努利变量成立",
      "当变量（两两）独立时"
    ],
    "answer": 3,
    "exp": "Variance of a sum equals the sum of variances when all covariance terms vanish, which is guaranteed by pairwise independence.",
    "exp_zh": "和的方差等于方差的和，当所有协方差项为零时成立，而两两独立可以保证这一点。"
  },
  {
    "ch": 3,
    "type": "math",
    "q": "What is the variance of a Poisson(\\(\\lambda\\)) random variable?",
    "q_zh": "Poisson(\\(\\lambda\\)) 随机变量的方差是多少？",
    "opts": [
      "\\(\\lambda\\)",
      "\\(\\lambda^2\\)",
      "\\(\\sqrt{\\lambda}\\)",
      "\\(1/\\lambda\\)"
    ],
    "opts_zh": [
      "\\(\\lambda\\)",
      "\\(\\lambda^2\\)",
      "\\(\\sqrt{\\lambda}\\)",
      "\\(1/\\lambda\\)"
    ],
    "answer": 0,
    "exp": "For a Poisson(\\(\\lambda\\)) variable, both the mean and variance equal \\(\\lambda\\).",
    "exp_zh": "对于 Poisson(\\(\\lambda\\)) 变量，期望和方差都等于 \\(\\lambda\\)。"
  },
  {
    "ch": 3,
    "type": "math",
    "q": "Jensen’s inequality for a concave function \\(f\\) states:",
    "q_zh": "对于凹函数 \\(f\\)，Jensen 不等式表明：",
    "opts": [
      "\\(\\mathbb{E}[f(X)] \\geq f(\\mathbb{E}[X])\\)",
      "\\(\\mathbb{E}[f(X)] \\leq f(\\mathbb{E}[X])\\)",
      "\\(f(\\mathbb{E}[X]) = \\mathbb{E}[f(X)]\\)",
      "\\(\\mathbb{E}[f(X)] \\geq \\mathbb{E}[X]^2\\)"
    ],
    "opts_zh": [
      "\\(\\mathbb{E}[f(X)] \\geq f(\\mathbb{E}[X])\\)",
      "\\(\\mathbb{E}[f(X)] \\leq f(\\mathbb{E}[X])\\)",
      "\\(f(\\mathbb{E}[X]) = \\mathbb{E}[f(X)]\\)",
      "\\(\\mathbb{E}[f(X)] \\geq \\mathbb{E}[X]^2\\)"
    ],
    "answer": 1,
    "exp": "For a concave function, Jensen’s inequality gives \\(\\mathbb{E}[f(X)] \\leq f(\\mathbb{E}[X])\\). The direction reverses for convex functions.",
    "exp_zh": "对于凹函数，Jensen 不等式给出 \\(\\mathbb{E}[f(X)] \\leq f(\\mathbb{E}[X])\\)。对于凸函数方向相反。"
  },
  {
    "ch": 4,
    "type": "study",
    "q": "What is the main goal of derandomisation?",
    "q_zh": "去随机化的主要目标是什么？",
    "opts": [
      "Make algorithms faster",
      "Reduce memory usage",
      "Convert randomised algorithms into deterministic ones with comparable guarantees",
      "Increase the probability of correctness to 1"
    ],
    "opts_zh": [
      "让算法更快",
      "减少内存使用",
      "将随机算法转换为具有类似保证的确定性算法",
      "将正确性概率提高到1"
    ],
    "answer": 2,
    "exp": "Derandomisation converts a randomised algorithm into a deterministic one while preserving the quality guarantee (e.g., approximation ratio).",
    "exp_zh": "去随机化将随机算法转换为确定性算法，同时保持质量保证（如近似比）。"
  },
  {
    "ch": 4,
    "type": "study",
    "q": "For the random partition algorithm (Algorithm 6) on Max-Cut, what is \\(\\mathbb{E}[c(A,B)]\\)?",
    "q_zh": "对于 Max-Cut 的随机划分算法（算法6），\\(\\mathbb{E}[c(A,B)]\\) 是多少？",
    "opts": [
      "\\(m\\)",
      "\\(\\text{OPT}\\)",
      "\\(m/4\\)",
      "\\(m/2\\)"
    ],
    "opts_zh": [
      "\\(m\\)",
      "\\(\\text{OPT}\\)",
      "\\(m/4\\)",
      "\\(m/2\\)"
    ],
    "answer": 3,
    "exp": "By linearity of expectation, each edge crosses the cut with probability 1/2, so \\(\\mathbb{E}[c(A,B)] = m/2\\).",
    "exp_zh": "根据期望的线性性，每条边以概率1/2被切割，所以 \\(\\mathbb{E}[c(A,B)] = m/2\\)。"
  },
  {
    "ch": 4,
    "type": "study",
    "q": "How many random bits does Algorithm 6 (random partition) use?",
    "q_zh": "算法6（随机划分）使用多少随机比特？",
    "opts": [
      "\\(n\\)",
      "\\(O(\\sqrt{n})\\)",
      "\\(O(\\log n)\\)",
      "\\(O(n \\log n)\\)"
    ],
    "opts_zh": [
      "\\(n\\)",
      "\\(O(\\sqrt{n})\\)",
      "\\(O(\\log n)\\)",
      "\\(O(n \\log n)\\)"
    ],
    "answer": 0,
    "exp": "One independent random bit per vertex, so \\(n\\) bits total. This is too many for brute-force enumeration.",
    "exp_zh": "每个顶点一个独立随机比特，共 \\(n\\) 比特。这对于暴力枚举来说太多了。"
  },
  {
    "ch": 4,
    "type": "study",
    "q": "What property of the random bits suffices for the proof of Theorem 22 (\\(\\mathbb{E}[c(A,B)] = m/2\\))?",
    "q_zh": "定理22的证明（\\(\\mathbb{E}[c(A,B)] = m/2\\)）需要随机比特的什么性质？",
    "opts": [
      "Full mutual independence",
      "Pairwise independence",
      "4-wise independence",
      "Identical distribution"
    ],
    "opts_zh": [
      "完全相互独立",
      "两两独立",
      "4-wise独立",
      "同分布"
    ],
    "answer": 1,
    "exp": "The proof only uses \\(\\Pr[X_u \\neq X_v] = 1/2\\) for each edge \\((u,v)\\), which requires only pairwise independence.",
    "exp_zh": "证明只用到每条边 \\((u,v)\\) 的 \\(\\Pr[X_u \\neq X_v] = 1/2\\)，这只需要两两独立。"
  },
  {
    "ch": 4,
    "type": "study",
    "q": "Using a pairwise independent hash family, how many random bits does Algorithm 8 need?",
    "q_zh": "使用两两独立哈希族，算法8需要多少随机比特？",
    "opts": [
      "\\(n\\)",
      "\\(n/2\\)",
      "\\(\\lceil \\log_2(n+1) \\rceil\\)",
      "\\(\\log_2 m\\)"
    ],
    "opts_zh": [
      "\\(n\\)",
      "\\(n/2\\)",
      "\\(\\lceil \\log_2(n+1) \\rceil\\)",
      "\\(\\log_2 m\\)"
    ],
    "answer": 2,
    "exp": "The strongly universal hash family has \\(2^{\\lceil \\log_2(n+1) \\rceil}\\) elements, so we need \\(\\lceil \\log_2(n+1) \\rceil = O(\\log n)\\) random bits.",
    "exp_zh": "强通用哈希族有 \\(2^{\\lceil \\log_2(n+1) \\rceil}\\) 个元素，所以需要 \\(\\lceil \\log_2(n+1) \\rceil = O(\\log n)\\) 个随机比特。"
  },
  {
    "ch": 4,
    "type": "study",
    "q": "In the method of conditional expectations (Algorithm 9), how is each vertex assigned?",
    "q_zh": "在条件期望法（算法9）中，每个顶点如何被分配？",
    "opts": [
      "Randomly with probability 1/2",
      "Using a hash function",
      "To the smaller side",
      "To the side that maximises the number of cut edges among already-placed neighbours"
    ],
    "opts_zh": [
      "以1/2的概率随机",
      "使用哈希函数",
      "分配到较小的一侧",
      "分配到使已放置邻居中切割边数最多的一侧"
    ],
    "answer": 3,
    "exp": "Each vertex is greedily placed on the side that maximises the conditional expected cut value, which is computed by counting neighbours already in A vs B.",
    "exp_zh": "每个顶点被贪心地放在使条件期望切割值最大化的一侧，通过计算已在A和B中的邻居数来决定。"
  },
  {
    "ch": 4,
    "type": "study",
    "q": "What is the running time of the deterministic Algorithm 9 (greedy Max-Cut)?",
    "q_zh": "确定性算法9（贪心 Max-Cut）的运行时间是多少？",
    "opts": [
      "\\(O(nm)\\)",
      "\\(O(m)\\)",
      "\\(O(n)\\)",
      "\\(O(n^2 m)\\)"
    ],
    "opts_zh": [
      "\\(O(nm)\\)",
      "\\(O(m)\\)",
      "\\(O(n)\\)",
      "\\(O(n^2 m)\\)"
    ],
    "answer": 0,
    "exp": "For each of the \\(n\\) vertices, we scan its edges to count neighbours in A and B. Total: \\(O(nm)\\).",
    "exp_zh": "对于每个 \\(n\\) 个顶点，扫描其边来计算A和B中的邻居数。总计：\\(O(nm)\\)。"
  },
  {
    "ch": 4,
    "type": "study",
    "q": "The probabilistic method proves existence of a good object by showing:",
    "q_zh": "概率方法通过证明什么来证明好对象的存在？",
    "opts": [
      "A constructive algorithm exists",
      "A random object is good with positive probability",
      "The expected value is good",
      "All random objects are good"
    ],
    "opts_zh": [
      "存在构造性算法",
      "随机对象以正概率是好的",
      "期望值是好的",
      "所有随机对象都是好的"
    ],
    "answer": 1,
    "exp": "If \\(\\Pr[\\text{good}] > 0\\), then at least one good object must exist in the sample space.",
    "exp_zh": "如果 \\(\\Pr[\\text{好}] > 0\\)，那么在样本空间中至少存在一个好的对象。"
  },
  {
    "ch": 4,
    "type": "study",
    "q": "Theorem 25 gives a lower bound on Ramsey numbers \\(R(k,k)\\) using:",
    "q_zh": "定理25使用什么方法给出了拉姆齐数 \\(R(k,k)\\) 的下界？",
    "opts": [
      "Constructive colouring",
      "Semidefinite programming",
      "Random colouring + union bound (probabilistic method)",
      "Conditional expectations"
    ],
    "opts_zh": [
      "构造性着色",
      "半定规划",
      "随机着色 + 联合界（概率方法）",
      "条件期望"
    ],
    "answer": 2,
    "exp": "Colour edges randomly and use a union bound over all \\(\\binom{n}{k}\\) subsets to show that the probability of any monochromatic \\(K_k\\) is less than 1.",
    "exp_zh": "随机着色边，然后对所有 \\(\\binom{n}{k}\\) 个子集使用联合界，证明出现单色 \\(K_k\\) 的概率小于1。"
  },
  {
    "ch": 4,
    "type": "study",
    "q": "The Goemans–Williamson algorithm achieves what approximation ratio for Max-Cut?",
    "q_zh": "Goemans-Williamson 算法对 Max-Cut 达到了什么近似比？",
    "opts": [
      "\\(1/2\\)",
      "\\(2/3\\)",
      "\\(1\\)",
      "\\(\\approx 0.878\\)"
    ],
    "opts_zh": [
      "\\(1/2\\)",
      "\\(2/3\\)",
      "\\(1\\)",
      "\\(\\approx 0.878\\)"
    ],
    "answer": 3,
    "exp": "Goemans–Williamson uses SDP relaxation to achieve a 0.878-approximation, which is optimal under the Unique Games Conjecture.",
    "exp_zh": "Goemans-Williamson 使用半定规划松弛达到0.878近似比，在唯一博弈猜想下这是最优的。"
  },
  {
    "ch": 4,
    "type": "math",
    "q": "How many edges does the complete graph \\(K_n\\) have?",
    "q_zh": "完全图 \\(K_n\\) 有多少条边？",
    "opts": [
      "\\(n(n-1)/2\\)",
      "\\(n^2\\)",
      "\\(2^n\\)",
      "\\(n \\log n\\)"
    ],
    "opts_zh": [
      "\\(n(n-1)/2\\)",
      "\\(n^2\\)",
      "\\(2^n\\)",
      "\\(n \\log n\\)"
    ],
    "answer": 0,
    "exp": "Each pair of vertices forms an edge, so \\(|E| = \\binom{n}{2} = n(n-1)/2\\).",
    "exp_zh": "每对顶点形成一条边，因此 \\(|E| = \\binom{n}{2} = n(n-1)/2\\)。"
  },
  {
    "ch": 4,
    "type": "math",
    "q": "How many random bits are needed to sample uniformly from \\(\\{1, \\ldots, k\\}\\)?",
    "q_zh": "从 \\(\\{1, \\ldots, k\\}\\) 中均匀采样需要多少个随机比特？",
    "opts": [
      "\\(k\\)",
      "\\(\\lceil \\log_2 k \\rceil\\)",
      "\\(\\log_2 k - 1\\)",
      "\\(2k\\)"
    ],
    "opts_zh": [
      "\\(k\\)",
      "\\(\\lceil \\log_2 k \\rceil\\)",
      "\\(\\log_2 k - 1\\)",
      "\\(2k\\)"
    ],
    "answer": 1,
    "exp": "We need \\(\\lceil \\log_2 k \\rceil\\) bits to represent \\(k\\) outcomes uniformly at random.",
    "exp_zh": "表示 \\(k\\) 个等概率结果需要 \\(\\lceil \\log_2 k \\rceil\\) 个比特。"
  },
  {
    "ch": 4,
    "type": "math",
    "q": "Pairwise independence of random variables \\(X_1, \\ldots, X_n\\) requires:",
    "q_zh": "随机变量 \\(X_1, \\ldots, X_n\\) 的两两独立要求：",
    "opts": [
      "All \\(X_i\\) are identically distributed",
      "\\(\\mathbb{E}[X_i X_j] = 0\\) for all \\(i,j\\)",
      "\\(\\Pr[X_i = a,\\, X_j = b] = \\Pr[X_i = a]\\Pr[X_j = b]\\) for all \\(i \\neq j\\)",
      "The joint distribution factors completely"
    ],
    "opts_zh": [
      "所有 \\(X_i\\) 同分布",
      "对所有 \\(i,j\\)，\\(\\mathbb{E}[X_i X_j] = 0\\)",
      "对所有 \\(i \\neq j\\)，\\(\\Pr[X_i = a,\\, X_j = b] = \\Pr[X_i = a]\\Pr[X_j = b]\\)",
      "联合分布完全可分解"
    ],
    "answer": 2,
    "exp": "Pairwise independence means every pair \\((X_i, X_j)\\) with \\(i \\neq j\\) is independent: \\(\\Pr[X_i = a,\\, X_j = b] = \\Pr[X_i = a]\\Pr[X_j = b]\\) for all \\(a, b\\).",
    "exp_zh": "两两独立意味着每对 \\((X_i, X_j)\\)（\\(i \\neq j\\)）独立：\\(\\Pr[X_i = a,\\, X_j = b] = \\Pr[X_i = a]\\Pr[X_j = b]\\)。"
  },
  {
    "ch": 4,
    "type": "math",
    "q": "A strongly universal (2-universal) hash family satisfies:",
    "q_zh": "强通用（2-通用）哈希族满足：",
    "opts": [
      "\\(\\Pr[h(x) = h(x\\u2019)] \\leq 1/|Y|\\)",
      "\\(\\Pr[h(x) = y] = 1/2\\) for every \\(y\\)",
      "\\(h\\) is injective with probability 1",
      "\\(\\Pr[h(x) = y,\\, h(x\\u2019) = y\\u2019] = 1/|Y|^2\\) for all \\(x \\neq x\\u2019\\)"
    ],
    "opts_zh": [
      "\\(\\Pr[h(x) = h(x’)] \\leq 1/|Y|\\)",
      "对每个 \\(y\\)，\\(\\Pr[h(x) = y] = 1/2\\)",
      "\\(h\\) 以概率 1 为单射",
      "对所有 \\(x \\neq x’\\)，\\(\\Pr[h(x) = y,\\, h(x’) = y’] = 1/|Y|^2\\)"
    ],
    "answer": 3,
    "exp": "Strong universality means for distinct keys \\(x \\neq x\\u2019\\) and any \\(y, y\\u2019 \\in Y\\), the hash outputs are jointly uniform: \\(\\Pr[h(x) = y,\\, h(x\\u2019) = y\\u2019] = 1/|Y|^2\\).",
    "exp_zh": "强通用性意味着对于不同的键 \\(x \\neq x’\\) 和任意 \\(y, y’ \\in Y\\)，哈希输出联合均匀：\\(\\Pr[h(x) = y,\\, h(x’) = y’] = 1/|Y|^2\\)。"
  },
  {
    "ch": 4,
    "type": "math",
    "q": "The law of total expectation states:",
    "q_zh": "全期望公式表明：",
    "opts": [
      "\\(\\mathbb{E}[X] = \\sum_i \\Pr[A_i] \\cdot \\mathbb{E}[X \\mid A_i]\\)",
      "\\(\\mathbb{E}[X] = \\sum_i \\Pr[X = i]\\)",
      "\\(\\mathbb{E}[XY] = \\mathbb{E}[X]\\mathbb{E}[Y]\\) always",
      "\\(\\mathbb{E}[X^2] = \\mathbb{E}[X]^2\\)"
    ],
    "opts_zh": [
      "\\(\\mathbb{E}[X] = \\sum_i \\Pr[A_i] \\cdot \\mathbb{E}[X \\mid A_i]\\)",
      "\\(\\mathbb{E}[X] = \\sum_i \\Pr[X = i]\\)",
      "\\(\\mathbb{E}[XY] = \\mathbb{E}[X]\\mathbb{E}[Y]\\) 总是成立",
      "\\(\\mathbb{E}[X^2] = \\mathbb{E}[X]^2\\)"
    ],
    "answer": 0,
    "exp": "If \\(A_1, \\ldots, A_k\\) partition the sample space, then \\(\\mathbb{E}[X] = \\sum_i \\Pr[A_i] \\cdot \\mathbb{E}[X \\mid A_i]\\).",
    "exp_zh": "若 \\(A_1, \\ldots, A_k\\) 是样本空间的一个划分，则 \\(\\mathbb{E}[X] = \\sum_i \\Pr[A_i] \\cdot \\mathbb{E}[X \\mid A_i]\\)。"
  },
  {
    "ch": 4,
    "type": "math",
    "q": "The probabilistic method proves:",
    "q_zh": "概率方法证明的是：",
    "opts": [
      "An explicit construction of the desired object",
      "Existence of an object without explicit construction",
      "A deterministic lower bound",
      "That randomized algorithms always outperform deterministic ones"
    ],
    "opts_zh": [
      "所需对象的显式构造",
      "对象的存在性，无需显式构造",
      "一个确定性下界",
      "随机算法总是优于确定性算法"
    ],
    "answer": 1,
    "exp": "The probabilistic method shows that if a random object has the desired property with positive probability, then such an object must exist — no explicit construction is given.",
    "exp_zh": "概率方法表明，若随机对象以正概率具有所需性质，则该对象必存在——但不给出显式构造。"
  },
  {
    "ch": 4,
    "type": "math",
    "q": "An \\(\\alpha\\)-approximation algorithm guarantees:",
    "q_zh": "\\(\\alpha\\)-近似算法保证：",
    "opts": [
      "The output is exactly \\(\\alpha \\cdot \\text{OPT}\\)",
      "The running time is \\(O(\\alpha \\cdot n)\\)",
      "The output is at least \\(\\alpha \\cdot \\text{OPT}\\) (for maximization)",
      "The algorithm uses at most \\(\\alpha\\) random bits"
    ],
    "opts_zh": [
      "输出恰好等于 \\(\\alpha \\cdot \\text{OPT}\\)",
      "运行时间为 \\(O(\\alpha \\cdot n)\\)",
      "输出至少为 \\(\\alpha \\cdot \\text{OPT}\\)（对于最大化问题）",
      "算法最多使用 \\(\\alpha\\) 个随机比特"
    ],
    "answer": 2,
    "exp": "For a maximization problem, an \\(\\alpha\\)-approximation algorithm produces a solution of value \\(\\geq \\alpha \\cdot \\text{OPT}\\), where \\(0 < \\alpha \\leq 1\\).",
    "exp_zh": "对于最大化问题，\\(\\alpha\\)-近似算法产生的解的值 \\(\\geq \\alpha \\cdot \\text{OPT}\\)，其中 \\(0 < \\alpha \\leq 1\\)。"
  },
  {
    "ch": 4,
    "type": "math",
    "q": "The Goemans–Williamson algorithm achieves:",
    "q_zh": "Goemans–Williamson 算法达到：",
    "opts": [
      "An exact solution for Max-Cut",
      "A PTAS for Max-Cut",
      "A 0.5-approximation for Max-Cut",
      "A 0.878-approximation for Max-Cut"
    ],
    "opts_zh": [
      "Max-Cut 的精确解",
      "Max-Cut 的 PTAS",
      "Max-Cut 的 0.5-近似",
      "Max-Cut 的 0.878-近似"
    ],
    "answer": 3,
    "exp": "The Goemans–Williamson algorithm uses SDP relaxation and randomized rounding to achieve a \\(\\approx 0.878\\)-approximation ratio for the Max-Cut problem.",
    "exp_zh": "Goemans–Williamson 算法使用 SDP 松弛和随机舍入，对 Max-Cut 问题达到了 \\(\\approx 0.878\\) 的近似比。"
  },
  {
    "ch": 5,
    "type": "study",
    "q": "What is the probability that a single run of Karger’s algorithm finds a specific minimum cut in an \\(n\\)-vertex graph?",
    "q_zh": "在一个 \\(n\\) 个顶点的图中，Karger算法单次运行找到特定最小割的概率是多少？",
    "opts": [
      "\\(\\geq 2/(n(n-1))\\)",
      "\\(\\geq 1/n\\)",
      "\\(\\geq 1/n^2\\)",
      "\\(\\geq 1/\\log n\\)"
    ],
    "opts_zh": [
      "\\(\\geq 2/(n(n-1))\\)",
      "\\(\\geq 1/n\\)",
      "\\(\\geq 1/n^2\\)",
      "\\(\\geq 1/\\log n\\)"
    ],
    "answer": 0,
    "exp": "Karger’s contraction algorithm preserves a specific minimum cut with probability at least \\(\\binom{n}{2}^{-1} = 2/(n(n-1))\\).",
    "exp_zh": "Karger的收缩算法保留特定最小割的概率至少为 \\(\\binom{n}{2}^{-1} = 2/(n(n-1))\\)。"
  },
  {
    "ch": 5,
    "type": "study",
    "q": "What is the running time of a single run of Karger’s contraction algorithm?",
    "q_zh": "Karger收缩算法单次运行的时间复杂度是多少？",
    "opts": [
      "\\(O(n)\\)",
      "\\(O(n^2)\\)",
      "\\(O(n \\log n)\\)",
      "\\(O(n^3)\\)"
    ],
    "opts_zh": [
      "\\(O(n)\\)",
      "\\(O(n^2)\\)",
      "\\(O(n \\log n)\\)",
      "\\(O(n^3)\\)"
    ],
    "answer": 1,
    "exp": "Each of the \\(n-2\\) contraction steps requires scanning edges, giving \\(O(n^2)\\) total time (with adjacency list representation).",
    "exp_zh": "每次 \\(n-2\\) 个收缩步骤需要扫描边，总时间为 \\(O(n^2)\\)（使用邻接表表示）。"
  },
  {
    "ch": 5,
    "type": "study",
    "q": "What fundamental operation does Karger’s algorithm use to reduce the graph?",
    "q_zh": "Karger算法使用什么基本操作来缩减图？",
    "opts": [
      "Vertex deletion",
      "Edge deletion",
      "Edge contraction",
      "Graph partitioning"
    ],
    "opts_zh": [
      "顶点删除",
      "边删除",
      "边收缩",
      "图分割"
    ],
    "answer": 2,
    "exp": "Karger’s algorithm repeatedly picks a random edge and contracts it (merges its two endpoints into one vertex, removing self-loops).",
    "exp_zh": "Karger算法重复选择一条随机边并收缩它（将两个端点合并为一个顶点，删除自环）。"
  },
  {
    "ch": 5,
    "type": "study",
    "q": "In the Karger–Stein algorithm, the graph is contracted down to how many vertices before branching?",
    "q_zh": "在Karger-Stein算法中，图在分支之前被收缩到多少个顶点？",
    "opts": [
      "\\(n/2\\)",
      "\\(\\log n\\)",
      "\\(\\sqrt{n}\\)",
      "\\(n/\\sqrt{2} + 1\\)"
    ],
    "opts_zh": [
      "\\(n/2\\)",
      "\\(\\log n\\)",
      "\\(\\sqrt{n}\\)",
      "\\(n/\\sqrt{2} + 1\\)"
    ],
    "answer": 3,
    "exp": "Karger–Stein contracts to \\(\\lceil n/\\sqrt{2} \\rceil + 1\\) vertices, then recurses on two independent copies.",
    "exp_zh": "Karger-Stein收缩到 \\(\\lceil n/\\sqrt{2} \\rceil + 1\\) 个顶点，然后对两个独立副本递归。"
  },
  {
    "ch": 5,
    "type": "study",
    "q": "What is the success probability of the Karger–Stein algorithm?",
    "q_zh": "Karger-Stein算法的成功概率是多少？",
    "opts": [
      "\\(\\Omega(1/\\log n)\\)",
      "\\(\\Omega(1/n)\\)",
      "\\(\\Omega(1/n^2)\\)",
      "\\(\\Omega(1)\\)"
    ],
    "opts_zh": [
      "\\(\\Omega(1/\\log n)\\)",
      "\\(\\Omega(1/n)\\)",
      "\\(\\Omega(1/n^2)\\)",
      "\\(\\Omega(1)\\)"
    ],
    "answer": 0,
    "exp": "The recursive structure of Karger–Stein boosts the success probability to \\(\\Omega(1/\\log n)\\).",
    "exp_zh": "Karger-Stein的递归结构将成功概率提升到 \\(\\Omega(1/\\log n)\\)。"
  },
  {
    "ch": 5,
    "type": "study",
    "q": "What is the running time of the Karger–Stein algorithm?",
    "q_zh": "Karger-Stein算法的运行时间是多少？",
    "opts": [
      "\\(O(n^2)\\)",
      "\\(O(n^2 \\log n)\\)",
      "\\(O(n^2 \\log^2 n)\\)",
      "\\(O(n^3)\\)"
    ],
    "opts_zh": [
      "\\(O(n^2)\\)",
      "\\(O(n^2 \\log n)\\)",
      "\\(O(n^2 \\log^2 n)\\)",
      "\\(O(n^3)\\)"
    ],
    "answer": 1,
    "exp": "The recurrence \\(T(n) = 2T(n/\\sqrt{2}) + O(n^2)\\) solves to \\(O(n^2 \\log n)\\).",
    "exp_zh": "递推式 \\(T(n) = 2T(n/\\sqrt{2}) + O(n^2)\\) 解为 \\(O(n^2 \\log n)\\)。"
  },
  {
    "ch": 5,
    "type": "study",
    "q": "What is the maximum number of distinct minimum cuts in an \\(n\\)-vertex graph?",
    "q_zh": "一个 \\(n\\) 个顶点的图中最多有多少个不同的最小割？",
    "opts": [
      "\\(n\\)",
      "\\(n^2\\)",
      "\\(\\binom{n}{2}\\)",
      "\\(2^n\\)"
    ],
    "opts_zh": [
      "\\(n\\)",
      "\\(n^2\\)",
      "\\(\\binom{n}{2}\\)",
      "\\(2^n\\)"
    ],
    "answer": 2,
    "exp": "Since each minimum cut is found with probability \\(\\geq 2/(n(n-1))\\) and all probabilities sum to at most 1, there are at most \\(\\binom{n}{2}\\) distinct minimum cuts.",
    "exp_zh": "由于每个最小割被找到的概率 \\(\\geq 2/(n(n-1))\\)，且所有概率之和至多为1，因此最多有 \\(\\binom{n}{2}\\) 个不同的最小割。"
  },
  {
    "ch": 5,
    "type": "study",
    "q": "Which graph achieves the maximum number \\(\\binom{n}{2}\\) of distinct minimum cuts?",
    "q_zh": "哪种图达到了 \\(\\binom{n}{2}\\) 个不同最小割的上界？",
    "opts": [
      "Complete graph \\(K_n\\)",
      "Star graph \\(S_n\\)",
      "Path graph \\(P_n\\)",
      "Cycle graph \\(C_n\\)"
    ],
    "opts_zh": [
      "完全图 \\(K_n\\)",
      "星图 \\(S_n\\)",
      "路径图 \\(P_n\\)",
      "环图 \\(C_n\\)"
    ],
    "answer": 3,
    "exp": "The cycle \\(C_n\\) has minimum cut value 2, and every pair of edges forms a distinct minimum cut, giving exactly \\(\\binom{n}{2}\\) minimum cuts.",
    "exp_zh": "环图 \\(C_n\\) 的最小割值为2，每对边形成一个不同的最小割，总共恰好 \\(\\binom{n}{2}\\) 个最小割。"
  },
  {
    "ch": 5,
    "type": "study",
    "q": "What is the expected running time of the KKT (Karger–Klein–Tarjan) randomised MST algorithm?",
    "q_zh": "KKT (Karger-Klein-Tarjan) 随机 MST 算法的期望运行时间是多少？",
    "opts": [
      "\\(O(m)\\)",
      "\\(O(m \\log \\log n)\\)",
      "\\(O(m \\log n)\\)",
      "\\(O(n^2)\\)"
    ],
    "opts_zh": [
      "\\(O(m)\\)",
      "\\(O(m \\log \\log n)\\)",
      "\\(O(m \\log n)\\)",
      "\\(O(n^2)\\)"
    ],
    "answer": 0,
    "exp": "The KKT algorithm achieves expected linear time \\(O(m)\\) for finding a minimum spanning tree using random sampling and verification.",
    "exp_zh": "KKT算法通过随机采样和验证，实现了期望线性时间 \\(O(m)\\) 的最小生成树算法。"
  },
  {
    "ch": 5,
    "type": "study",
    "q": "In the context of the KKT MST algorithm, what does it mean for an edge \\(e\\) to be \\(F\\)-heavy?",
    "q_zh": "在KKT MST算法的背景下，边 \\(e\\) 是 \\(F\\)-heavy 是什么意思？",
    "opts": [
      "\\(e\\) has the largest weight in the graph",
      "\\(e\\) is the maximum-weight edge in the cycle formed by adding \\(e\\) to \\(F\\)",
      "\\(e\\) is heavier than the average edge weight",
      "\\(e\\) is not in the forest \\(F\\)"
    ],
    "opts_zh": [
      "\\(e\\) 是图中权重最大的边",
      "\\(e\\) 是将 \\(e\\) 加入 \\(F\\) 后形成的环中权重最大的边",
      "\\(e\\) 的权重大于平均边权重",
      "\\(e\\) 不在森林 \\(F\\) 中"
    ],
    "answer": 1,
    "exp": "An edge \\(e\\) is \\(F\\)-heavy if it is the maximum-weight edge on the unique cycle created when \\(e\\) is added to the forest \\(F\\). Such edges can be safely discarded.",
    "exp_zh": "边 \\(e\\) 是 \\(F\\)-heavy 的，如果它是将 \\(e\\) 加入森林 \\(F\\) 后形成的唯一环上权重最大的边。这样的边可以被安全地丢弃。"
  },
  {
    "ch": 5,
    "type": "math",
    "q": "The Handshaking Lemma states \\(\\sum_{v} \\deg(v) = \\)?",
    "q_zh": "握手引理表明 \\(\\sum_{v} \\deg(v) = \\)？",
    "opts": [
      "\\(|E|\\)",
      "\\(|V|^2\\)",
      "\\(2|E|\\)",
      "\\(|V| + |E|\\)"
    ],
    "opts_zh": [
      "\\(|E|\\)",
      "\\(|V|^2\\)",
      "\\(2|E|\\)",
      "\\(|V| + |E|\\)"
    ],
    "answer": 2,
    "exp": "Each edge contributes 2 to the total degree sum, so \\(\\sum_{v} \\deg(v) = 2|E|\\).",
    "exp_zh": "每条边对度数总和贡献 2，因此 \\(\\sum_{v} \\deg(v) = 2|E|\\)。"
  },
  {
    "ch": 5,
    "type": "math",
    "q": "Edge contraction reduces the vertex count by:",
    "q_zh": "边收缩会将顶点数减少：",
    "opts": [
      "0",
      "It depends on the graph",
      "2",
      "1"
    ],
    "opts_zh": [
      "0",
      "取决于图的结构",
      "2",
      "1"
    ],
    "answer": 3,
    "exp": "Contracting an edge \\(\\{u,v\\}\\) merges \\(u\\) and \\(v\\) into a single vertex, reducing \\(|V|\\) by exactly 1.",
    "exp_zh": "收缩边 \\(\\{u,v\\}\\) 将 \\(u\\) 和 \\(v\\) 合并为一个顶点，\\(|V|\\) 恰好减少 1。"
  },
  {
    "ch": 5,
    "type": "math",
    "q": "By the chain rule, \\(\\Pr[E_1 \\cap E_2 \\cap \\cdots \\cap E_n] =\\)",
    "q_zh": "根据链式法则，\\(\\Pr[E_1 \\cap E_2 \\cap \\cdots \\cap E_n] =\\)",
    "opts": [
      "\\(\\prod_i \\Pr[E_i \\mid E_1 \\cap \\cdots \\cap E_{i-1}]\\)",
      "\\(\\prod_i \\Pr[E_i]\\)",
      "\\(\\sum_i \\Pr[E_i]\\)",
      "\\(\\Pr[E_1] \\cdot \\Pr[E_n \\mid E_1]\\)"
    ],
    "opts_zh": [
      "\\(\\prod_i \\Pr[E_i \\mid E_1 \\cap \\cdots \\cap E_{i-1}]\\)",
      "\\(\\prod_i \\Pr[E_i]\\)",
      "\\(\\sum_i \\Pr[E_i]\\)",
      "\\(\\Pr[E_1] \\cdot \\Pr[E_n \\mid E_1]\\)"
    ],
    "answer": 0,
    "exp": "The chain rule of probability decomposes a joint probability as \\(\\prod_{i=1}^{n} \\Pr[E_i \\mid E_1 \\cap \\cdots \\cap E_{i-1}]\\).",
    "exp_zh": "概率的链式法则将联合概率分解为 \\(\\prod_{i=1}^{n} \\Pr[E_i \\mid E_1 \\cap \\cdots \\cap E_{i-1}]\\)。"
  },
  {
    "ch": 5,
    "type": "math",
    "q": "\\(T(n) = 2T(n/\\sqrt{2}) + O(n^2)\\) solves to:",
    "q_zh": "\\(T(n) = 2T(n/\\sqrt{2}) + O(n^2)\\) 的解为：",
    "opts": [
      "\\(O(n^2)\\)",
      "\\(O(n^2 \\log n)\\)",
      "\\(O(n^3)\\)",
      "\\(O(n^2 \\log^2 n)\\)"
    ],
    "opts_zh": [
      "\\(O(n^2)\\)",
      "\\(O(n^2 \\log n)\\)",
      "\\(O(n^3)\\)",
      "\\(O(n^2 \\log^2 n)\\)"
    ],
    "answer": 1,
    "exp": "Substituting \\(n/\\sqrt{2} = n/2^{1/2}\\), we get \\(\\log_{\\sqrt{2}} n = 2\\log_2 n\\) levels, each costing \\(O(n^2)\\), giving \\(O(n^2 \\log n)\\).",
    "exp_zh": "代入 \\(n/\\sqrt{2} = n/2^{1/2}\\)，得 \\(\\log_{\\sqrt{2}} n = 2\\log_2 n\\) 层，每层代价 \\(O(n^2)\\)，总计 \\(O(n^2 \\log n)\\)。"
  },
  {
    "ch": 5,
    "type": "math",
    "q": "The Cut Property of MSTs states:",
    "q_zh": "MST 的割性质表明：",
    "opts": [
      "The heaviest edge crossing a cut is in the MST",
      "Every cut edge is in the MST",
      "The lightest edge crossing a cut is in the MST",
      "No cut edge is in the MST"
    ],
    "opts_zh": [
      "跨越割的最重边在 MST 中",
      "每条割边都在 MST 中",
      "跨越割的最轻边在 MST 中",
      "没有割边在 MST 中"
    ],
    "answer": 2,
    "exp": "The Cut Property says: for any cut, the unique lightest crossing edge belongs to every MST (assuming distinct weights).",
    "exp_zh": "割性质表明：对于任意割，唯一的最轻跨越边属于每个 MST（假设权重不同）。"
  },
  {
    "ch": 5,
    "type": "math",
    "q": "The Cycle Property of MSTs states:",
    "q_zh": "MST 的圈性质表明：",
    "opts": [
      "The lightest edge in a cycle is not in the MST",
      "Exactly one edge per cycle is in the MST",
      "All edges in a cycle are in the MST",
      "The heaviest edge in a cycle is not in the MST"
    ],
    "opts_zh": [
      "圈中最轻的边不在 MST 中",
      "每个圈恰好有一条边在 MST 中",
      "圈中所有边都在 MST 中",
      "圈中最重的边不在 MST 中"
    ],
    "answer": 3,
    "exp": "The Cycle Property says: for any cycle, the unique heaviest edge does not belong to any MST (assuming distinct weights).",
    "exp_zh": "圈性质表明：对于任意圈，唯一的最重边不属于任何 MST（假设权重不同）。"
  },
  {
    "ch": 5,
    "type": "math",
    "q": "An F-heavy edge is defined as:",
    "q_zh": "F-重边的定义是：",
    "opts": [
      "The max-weight edge in the cycle formed by adding e to F",
      "An edge heavier than the average weight in F",
      "Any edge not in the forest F",
      "An edge whose weight exceeds \\(|V|\\)"
    ],
    "opts_zh": [
      "将 e 加入 F 后形成的圈中权重最大的边",
      "比 F 中平均权重更大的边",
      "不在森林 F 中的任意边",
      "权重超过 \\(|V|\\) 的边"
    ],
    "answer": 0,
    "exp": "An edge e is F-heavy if it is the maximum-weight edge in the unique cycle created when e is added to the forest F.",
    "exp_zh": "边 e 是 F-重边，当且仅当它是将 e 加入森林 F 后产生的唯一圈中权重最大的边。"
  },
  {
    "ch": 5,
    "type": "math",
    "q": "The total number of distinct cuts in an \\(n\\)-vertex graph is:",
    "q_zh": "\\(n\\) 个顶点的图中不同割的总数为：",
    "opts": [
      "\\(2^n\\)",
      "\\(2^{n-1} - 1\\)",
      "\\(n(n-1)/2\\)",
      "\\(n!\\)"
    ],
    "opts_zh": [
      "\\(2^n\\)",
      "\\(2^{n-1} - 1\\)",
      "\\(n(n-1)/2\\)",
      "\\(n!\\)"
    ],
    "answer": 1,
    "exp": "A cut is a nontrivial partition \\((S, V \\setminus S)\\). There are \\(2^n\\) subsets, but \\(S\\) and \\(V \\setminus S\\) give the same cut, and we exclude \\(S = \\emptyset\\), yielding \\(2^{n-1} - 1\\).",
    "exp_zh": "割是一个非平凡划分 \\((S, V \\setminus S)\\)。共有 \\(2^n\\) 个子集，但 \\(S\\) 和 \\(V \\setminus S\\) 给出相同的割，且排除 \\(S = \\emptyset\\)，得 \\(2^{n-1} - 1\\)。"
  },
  {
    "ch": 6,
    "type": "study",
    "q": "Which data structure gives worst-case \\(O(1)\\) Lookup and Remove?",
    "q_zh": "哪种数据结构提供最坏情况 \\(O(1)\\) 的 Lookup 和 Remove？",
    "opts": [
      "Separate chaining hash table",
      "Open addressing hash table",
      "Cuckoo hash table",
      "Bloom filter"
    ],
    "opts_zh": [
      "链地址哈希表",
      "开放地址哈希表",
      "布谷鸟哈希表",
      "布隆过滤器"
    ],
    "answer": 2,
    "exp": "Cuckoo hashing stores each element in one of two possible locations, so Lookup and Remove each require checking exactly 2 slots — worst-case \\(O(1)\\).",
    "exp_zh": "布谷鸟哈希将每个元素存储在两个可能位置之一，因此 Lookup 和 Remove 只需检查 2 个槽位——最坏情况 \\(O(1)\\)。"
  },
  {
    "ch": 6,
    "type": "study",
    "q": "A universal hash family guarantees that for distinct \\(x \\neq x\\prime\\):",
    "q_zh": "全域哈希族保证对于不同的 \\(x \\neq x\\prime\\)：",
    "opts": [
      "\\(\\Pr[h(x)=h(x\\prime)] = 0\\)",
      "\\(\\Pr[h(x)=h(x\\prime)] \\leq 1/|X|\\)",
      "\\(\\Pr[h(x)=h(x\\prime)] = 1/|Y|\\)",
      "\\(\\Pr[h(x)=h(x\\prime)] \\leq 1/|Y|\\)"
    ],
    "opts_zh": [
      "\\(\\Pr[h(x)=h(x\\prime)] = 0\\)",
      "\\(\\Pr[h(x)=h(x\\prime)] \\leq 1/|X|\\)",
      "\\(\\Pr[h(x)=h(x\\prime)] = 1/|Y|\\)",
      "\\(\\Pr[h(x)=h(x\\prime)] \\leq 1/|Y|\\)"
    ],
    "answer": 3,
    "exp": "Universality requires the collision probability to be at most \\(1/|Y|\\) for any distinct pair, matching what a truly random function would give.",
    "exp_zh": "全域性要求任意不同对的碰撞概率至多为 \\(1/|Y|\\)，与完全随机函数的碰撞率一致。"
  },
  {
    "ch": 6,
    "type": "study",
    "q": "What is the load factor \\(\\alpha\\) in a hash table?",
    "q_zh": "哈希表中的负载因子 \\(\\alpha\\) 是什么？",
    "opts": [
      "\\(\\alpha = n / m\\prime\\)",
      "\\(\\alpha = m\\prime / n\\)",
      "\\(\\alpha = n \\cdot m\\prime\\)",
      "\\(\\alpha = \\log n / m\\prime\\)"
    ],
    "opts_zh": [
      "\\(\\alpha = n / m\\prime\\)",
      "\\(\\alpha = m\\prime / n\\)",
      "\\(\\alpha = n \\cdot m\\prime\\)",
      "\\(\\alpha = \\log n / m\\prime\\)"
    ],
    "answer": 0,
    "exp": "The load factor \\(\\alpha = n/m\\prime\\) is the ratio of stored elements to table size. It governs expected chain length and probe counts.",
    "exp_zh": "负载因子 \\(\\alpha = n/m\\prime\\) 是存储元素数与表大小的比率。它决定了期望链长和探测次数。"
  },
  {
    "ch": 6,
    "type": "study",
    "q": "Can a Bloom filter produce false negatives?",
    "q_zh": "布隆过滤器能产生假阴性吗？",
    "opts": [
      "Yes, with probability proportional to the load factor",
      "No, never",
      "Yes, but only after many insertions",
      "Only if the hash functions are not independent"
    ],
    "opts_zh": [
      "是的，概率与负载因子成正比",
      "不，永远不会",
      "是的，但仅在大量插入后",
      "仅当哈希函数不独立时"
    ],
    "answer": 1,
    "exp": "A Bloom filter never produces false negatives. If element \\(x\\) was inserted, all \\(T\\) bits were set to 1 and can never be unset, so Lookup(\\(x\\)) always returns true.",
    "exp_zh": "布隆过滤器永远不会产生假阴性。如果元素 \\(x\\) 已插入，所有 \\(T\\) 个位都被设为 1 且不会被取消，因此 Lookup(\\(x\\)) 总是返回 true。"
  },
  {
    "ch": 6,
    "type": "study",
    "q": "The false positive rate of a Bloom filter with \\(n\\) elements, \\(m\\prime\\) bits, and \\(T\\) hash functions is approximately:",
    "q_zh": "布隆过滤器的假阳性率（\\(n\\) 个元素、\\(m\\prime\\) 位、\\(T\\) 个哈希函数）约为：",
    "opts": [
      "\\((1 - e^{-n/m\\prime})^T\\)",
      "\\(e^{-nT/m\\prime}\\)",
      "\\((1 - e^{-nT/m\\prime})^T\\)",
      "\\(T \\cdot n / m\\prime\\)"
    ],
    "opts_zh": [
      "\\((1 - e^{-n/m\\prime})^T\\)",
      "\\(e^{-nT/m\\prime}\\)",
      "\\((1 - e^{-nT/m\\prime})^T\\)",
      "\\(T \\cdot n / m\\prime\\)"
    ],
    "answer": 2,
    "exp": "After \\(nT\\) random bit-settings in an \\(m\\prime\\)-bit array, each bit is 1 with probability \\(\\approx 1 - e^{-nT/m\\prime}\\). All \\(T\\) bits being 1 for a non-member gives FPR \\(\\approx (1 - e^{-nT/m\\prime})^T\\).",
    "exp_zh": "在 \\(m\\prime\\) 位数组中进行 \\(nT\\) 次随机置位后，每个位为 1 的概率 \\(\\approx 1 - e^{-nT/m\\prime}\\)。非成员的所有 \\(T\\) 个位均为 1 的概率即为 FPR。"
  },
  {
    "ch": 6,
    "type": "study",
    "q": "The optimal number of hash functions for a Bloom filter is:",
    "q_zh": "布隆过滤器的最优哈希函数数量为：",
    "opts": [
      "\\(T^* = n / m\\prime\\)",
      "\\(T^* = m\\prime \\ln 2\\)",
      "\\(T^* = \\sqrt{m\\prime / n}\\)",
      "\\(T^* = (m\\prime / n) \\ln 2\\)"
    ],
    "opts_zh": [
      "\\(T^* = n / m\\prime\\)",
      "\\(T^* = m\\prime \\ln 2\\)",
      "\\(T^* = \\sqrt{m\\prime / n}\\)",
      "\\(T^* = (m\\prime / n) \\ln 2\\)"
    ],
    "answer": 3,
    "exp": "Minimising the FPR with respect to \\(T\\) gives \\(T^* = (m\\prime / n) \\ln 2\\), which sets each bit to 1 with probability exactly \\(1/2\\).",
    "exp_zh": "对 \\(T\\) 求 FPR 的最小值得 \\(T^* = (m\\prime / n) \\ln 2\\)，此时每个位为 1 的概率恰好为 \\(1/2\\)。"
  },
  {
    "ch": 6,
    "type": "study",
    "q": "In separate chaining with a universal hash family, the expected lookup time is:",
    "q_zh": "在使用全域哈希族的链地址法中，期望查找时间为：",
    "opts": [
      "\\(O(1 + \\alpha)\\)",
      "\\(O(\\log n)\\)",
      "\\(O(n)\\)",
      "\\(O(1/(1-\\alpha))\\)"
    ],
    "opts_zh": [
      "\\(O(1 + \\alpha)\\)",
      "\\(O(\\log n)\\)",
      "\\(O(n)\\)",
      "\\(O(1/(1-\\alpha))\\)"
    ],
    "answer": 0,
    "exp": "By linearity of expectation and the universal hash property, the expected chain length is at most \\(1 + \\alpha\\), giving \\(O(1 + \\alpha)\\) lookup time.",
    "exp_zh": "通过期望的线性性和全域哈希性质，期望链长至多为 \\(1 + \\alpha\\)，因此查找时间为 \\(O(1 + \\alpha)\\)。"
  },
  {
    "ch": 6,
    "type": "study",
    "q": "Under the uniform hashing assumption, the expected number of probes for an unsuccessful lookup in open addressing is:",
    "q_zh": "在均匀哈希假设下，开放地址法中不成功查找的期望探测次数为：",
    "opts": [
      "\\(O(1 + \\alpha)\\)",
      "\\(O(1/(1-\\alpha))\\)",
      "\\(O(\\alpha)\\)",
      "\\(O(1/(1-\\alpha)^2)\\)"
    ],
    "opts_zh": [
      "\\(O(1 + \\alpha)\\)",
      "\\(O(1/(1-\\alpha))\\)",
      "\\(O(\\alpha)\\)",
      "\\(O(1/(1-\\alpha)^2)\\)"
    ],
    "answer": 1,
    "exp": "Each probe independently hits an occupied slot with probability \\(\\leq \\alpha\\). The expected number of probes is a geometric series summing to \\(1/(1-\\alpha)\\).",
    "exp_zh": "每次探测独立命中已占用槽的概率 \\(\\leq \\alpha\\)。期望探测次数为几何级数求和 \\(1/(1-\\alpha)\\)。"
  },
  {
    "ch": 6,
    "type": "study",
    "q": "Knuth’s analysis shows that linear probing has expected lookup time:",
    "q_zh": "Knuth的分析表明线性探测的期望查找时间为：",
    "opts": [
      "\\(O(1/(1-\\alpha))\\)",
      "\\(O(\\alpha \\log(1/\\alpha))\\)",
      "\\(O(1/(1-\\alpha)^2)\\)",
      "\\(O(\\log n)\\)"
    ],
    "opts_zh": [
      "\\(O(1/(1-\\alpha))\\)",
      "\\(O(\\alpha \\log(1/\\alpha))\\)",
      "\\(O(1/(1-\\alpha)^2)\\)",
      "\\(O(\\log n)\\)"
    ],
    "answer": 2,
    "exp": "Linear probing suffers from primary clustering. Knuth showed the expected time is \\(O(1/(1-\\alpha)^2)\\), worse than ideal open addressing’s \\(O(1/(1-\\alpha))\\).",
    "exp_zh": "线性探测受到主聚集的影响。Knuth 证明其期望时间为 \\(O(1/(1-\\alpha)^2)\\)，比理想开放地址的 \\(O(1/(1-\\alpha))\\) 更差。"
  },
  {
    "ch": 6,
    "type": "study",
    "q": "The construction \\(h_{a,b}(x) = ((ax+b) \\bmod p) \\bmod m\\prime\\) is:",
    "q_zh": "构造 \\(h_{a,b}(x) = ((ax+b) \\bmod p) \\bmod m\\prime\\) 是：",
    "opts": [
      "A strongly universal hash family",
      "Not a valid hash family",
      "A perfect hash function",
      "A universal hash family"
    ],
    "opts_zh": [
      "强全域哈希族",
      "无效的哈希族",
      "完美哈希函数",
      "全域哈希族"
    ],
    "answer": 3,
    "exp": "Theorem 32 states this construction (with the additional \\(\\bmod m\\prime\\)) is universal but not strongly universal (the second mod can introduce correlations).",
    "exp_zh": "定理 32 表明这种构造（加上额外的 \\(\\bmod m\\prime\\)）是全域的但不是强全域的（第二个取模可能引入相关性）。"
  },
  {
    "ch": 6,
    "type": "math",
    "q": "In \\(\\mathbb{Z}_p\\) with \\(p\\) prime, every non-zero element has a multiplicative inverse because:",
    "q_zh": "在素数 \\(p\\) 的 \\(\\mathbb{Z}_p\\) 中，每个非零元素都有乘法逆元，因为：",
    "opts": [
      "\\(\\mathbb{Z}_p\\) is a field (no zero divisors)",
      "\\(\\mathbb{Z}_p\\) is a group under addition",
      "All elements are odd",
      "\\(p\\) divides every element"
    ],
    "opts_zh": [
      "\\(\\mathbb{Z}_p\\) 是域（无零因子）",
      "\\(\\mathbb{Z}_p\\) 是加法群",
      "所有元素都是奇数",
      "\\(p\\) 整除每个元素"
    ],
    "answer": 0,
    "exp": "When \\(p\\) is prime, \\(\\mathbb{Z}_p\\) has no zero divisors, making it a field where every non-zero element has an inverse (by Fermat's Little Theorem: \\(a^{-1} = a^{p-2}\\)).",
    "exp_zh": "当 \\(p\\) 是素数时，\\(\\mathbb{Z}_p\\) 没有零因子，是一个域，每个非零元素都有逆元（由费马小定理：\\(a^{-1} = a^{p-2}\\)）。"
  },
  {
    "ch": 6,
    "type": "math",
    "q": "The Pigeonhole Principle implies that for any hash function \\(h: X \\to Y\\) with \\(|X| > |Y|\\):",
    "q_zh": "鸽巢原理表明，对于任何哈希函数 \\(h: X \\to Y\\)（\\(|X| > |Y|\\)）：",
    "opts": [
      "\\(h\\) is always injective",
      "There exist \\(x \\neq x\\prime\\) with \\(h(x) = h(x\\prime)\\)",
      "\\(h\\) is surjective",
      "Every slot has at least one element"
    ],
    "opts_zh": [
      "\\(h\\) 总是单射",
      "存在 \\(x \\neq x\\prime\\) 使得 \\(h(x) = h(x\\prime)\\)",
      "\\(h\\) 是满射",
      "每个槽至少有一个元素"
    ],
    "answer": 1,
    "exp": "If \\(|X| > |Y|\\), then by the Pigeonhole Principle, \\(h\\) cannot be injective: there must exist distinct \\(x, x\\prime\\) with \\(h(x) = h(x\\prime)\\).",
    "exp_zh": "如果 \\(|X| > |Y|\\)，由鸽巢原理，\\(h\\) 不可能是单射：必存在不同的 \\(x, x\\prime\\) 使得 \\(h(x) = h(x\\prime)\\)。"
  },
  {
    "ch": 6,
    "type": "math",
    "q": "For the hash family \\(h_{a,b}(x) = (ax+b) \\bmod p\\), strong universality holds because:",
    "q_zh": "对于哈希族 \\(h_{a,b}(x) = (ax+b) \\bmod p\\)，强全域性成立是因为：",
    "opts": [
      "\\(p\\) is always even",
      "All polynomials have degree 1",
      "The map \\((a,b) \\mapsto (ax+b, ax\\prime+b)\\) is a bijection on \\(\\mathbb{Z}_p^2\\)",
      "The function is invertible"
    ],
    "opts_zh": [
      "\\(p\\) 总是偶数",
      "所有多项式都是 1 次的",
      "映射 \\((a,b) \\mapsto (ax+b, ax\\prime+b)\\) 是 \\(\\mathbb{Z}_p^2\\) 上的双射",
      "函数是可逆的"
    ],
    "answer": 2,
    "exp": "For distinct \\(x \\neq x\\prime\\), the linear map \\((a,b) \\mapsto (ax+b, ax\\prime+b)\\) has determinant \\(x\\prime - x \\neq 0\\) in \\(\\mathbb{Z}_p\\), making it a bijection. So every output pair occurs exactly once.",
    "exp_zh": "对于不同的 \\(x \\neq x\\prime\\)，线性映射的行列式为 \\(x\\prime - x \\neq 0\\)，因此是双射。每个输出对恰好出现一次。"
  },
  {
    "ch": 6,
    "type": "math",
    "q": "The expected number of collisions with \\(n\\) elements in \\(m\\prime\\) slots (universal hashing) is:",
    "q_zh": "使用全域哈希将 \\(n\\) 个元素映射到 \\(m\\prime\\) 个槽的期望碰撞数为：",
    "opts": [
      "\\(n / m\\prime\\)",
      "\\(m\\prime / n\\)",
      "\\(n^2 / m\\prime\\)",
      "\\(n(n-1) / (2m\\prime)\\)"
    ],
    "opts_zh": [
      "\\(n / m\\prime\\)",
      "\\(m\\prime / n\\)",
      "\\(n^2 / m\\prime\\)",
      "\\(n(n-1) / (2m\\prime)\\)"
    ],
    "answer": 3,
    "exp": "There are \\(\\binom{n}{2} = n(n-1)/2\\) pairs, each colliding with probability \\(\\leq 1/m\\prime\\). By linearity: \\(\\mathbb{E}[C] \\leq n(n-1)/(2m\\prime)\\).",
    "exp_zh": "共有 \\(\\binom{n}{2} = n(n-1)/2\\) 对，每对碰撞概率 \\(\\leq 1/m\\prime\\)。由线性性：\\(\\mathbb{E}[C] \\leq n(n-1)/(2m\\prime)\\)。"
  },
  {
    "ch": 6,
    "type": "math",
    "q": "The birthday paradox says collisions are likely when \\(n\\) reaches:",
    "q_zh": "生日悖论表明当 \\(n\\) 达到以下值时碰撞变得很可能：",
    "opts": [
      "\\(\\Theta(\\sqrt{m\\prime})\\)",
      "\\(\\Theta(m\\prime)\\)",
      "\\(\\Theta(\\log m\\prime)\\)",
      "\\(\\Theta(m\\prime / 2)\\)"
    ],
    "opts_zh": [
      "\\(\\Theta(\\sqrt{m\\prime})\\)",
      "\\(\\Theta(m\\prime)\\)",
      "\\(\\Theta(\\log m\\prime)\\)",
      "\\(\\Theta(m\\prime / 2)\\)"
    ],
    "answer": 0,
    "exp": "The birthday bound: with \\(n = \\Theta(\\sqrt{m\\prime})\\) elements in \\(m\\prime\\) slots, the probability of at least one collision exceeds 50%.",
    "exp_zh": "生日界：当 \\(n = \\Theta(\\sqrt{m\\prime})\\) 个元素在 \\(m\\prime\\) 个槽中时，至少一次碰撞的概率超过 50%。"
  },
  {
    "ch": 6,
    "type": "math",
    "q": "After inserting \\(n\\) elements into a Bloom filter with \\(m\\prime\\) bits and \\(T\\) hash functions, the probability that a specific bit is still 0 is:",
    "q_zh": "将 \\(n\\) 个元素插入具有 \\(m\\prime\\) 位和 \\(T\\) 个哈希函数的布隆过滤器后，特定位仍为 0 的概率为：",
    "opts": [
      "\\(e^{-n/m\\prime}\\)",
      "\\((1 - 1/m\\prime)^{nT} \\approx e^{-nT/m\\prime}\\)",
      "\\(1 - T/m\\prime\\)",
      "\\(1/2^T\\)"
    ],
    "opts_zh": [
      "\\(e^{-n/m\\prime}\\)",
      "\\((1 - 1/m\\prime)^{nT} \\approx e^{-nT/m\\prime}\\)",
      "\\(1 - T/m\\prime\\)",
      "\\(1/2^T\\)"
    ],
    "answer": 1,
    "exp": "Each of \\(nT\\) hash operations misses bit \\(i\\) with probability \\(1 - 1/m\\prime\\). The probability that all miss is \\((1 - 1/m\\prime)^{nT} \\approx e^{-nT/m\\prime}\\).",
    "exp_zh": "\\(nT\\) 次哈希操作中每次未命中位 \\(i\\) 的概率为 \\(1 - 1/m\\prime\\)。全部未命中的概率为 \\((1 - 1/m\\prime)^{nT} \\approx e^{-nT/m\\prime}\\)。"
  },
  {
    "ch": 6,
    "type": "math",
    "q": "The optimal number of hash functions for a Bloom filter minimises FPR when the fraction of 0-bits equals:",
    "q_zh": "布隆过滤器的最优哈希函数数量使 FPR 最小，此时 0 位的比例为：",
    "opts": [
      "\\(1/T\\)",
      "\\(1/e\\)",
      "\\(1/2\\)",
      "\\(1/n\\)"
    ],
    "opts_zh": [
      "\\(1/T\\)",
      "\\(1/e\\)",
      "\\(1/2\\)",
      "\\(1/n\\)"
    ],
    "answer": 2,
    "exp": "The optimal \\(T\\) sets \\(e^{-nT/m\\prime} = 1/2\\), meaning exactly half the bits are 0. This gives \\(T^* = (m\\prime/n) \\ln 2\\).",
    "exp_zh": "最优 \\(T\\) 使得 \\(e^{-nT/m\\prime} = 1/2\\)，即恰好一半的位为 0。这给出 \\(T^* = (m\\prime/n) \\ln 2\\)。"
  },
  {
    "ch": 6,
    "type": "math",
    "q": "A degree-\\((k-1)\\) polynomial hash over \\(\\mathbb{Z}_p\\) achieves \\(k\\)-independence because of:",
    "q_zh": "\\(\\mathbb{Z}_p\\) 上的 \\((k-1)\\) 次多项式哈希实现 \\(k\\)-独立性是因为：",
    "opts": [
      "The Central Limit Theorem",
      "The Master Theorem",
      "The Pigeonhole Principle",
      "The Lagrange interpolation theorem"
    ],
    "opts_zh": [
      "中心极限定理",
      "主定理",
      "鸽巢原理",
      "拉格朗日插值定理"
    ],
    "answer": 3,
    "exp": "A degree-\\((k-1)\\) polynomial is uniquely determined by its values at \\(k\\) points (Lagrange interpolation). So for any \\(k\\) distinct inputs and any \\(k\\) target outputs, exactly one polynomial maps to those outputs.",
    "exp_zh": "\\((k-1)\\) 次多项式由其在 \\(k\\) 个点的值唯一确定（拉格朗日插值）。因此对于任意 \\(k\\) 个不同输入和 \\(k\\) 个目标输出，恰好有一个多项式映射到那些输出。"
  },
  {
    "ch": 7,
    "type": "study",
    "q": "Which of the following is NOT a property of a metric space?",
    "q_zh": "以下哪个不是度量空间的性质？",
    "opts": [
      "Sub-additivity: dist(x,z) \\(\\leq\\) max(dist(x,y), dist(y,z))",
      "Symmetry: dist(x,y) = dist(y,x)",
      "Reflexivity: dist(x,y) = 0 iff x = y",
      "Triangle inequality: dist(x,z) \\(\\leq\\) dist(x,y) + dist(y,z)"
    ],
    "opts_zh": [
      "次可加性：dist(x,z) \\(\\leq\\) max(dist(x,y), dist(y,z))",
      "对称性：dist(x,y) = dist(y,x)",
      "自反性：dist(x,y) = 0 当且仅当 x = y",
      "三角不等式：dist(x,z) \\(\\leq\\) dist(x,y) + dist(y,z)"
    ],
    "answer": 0,
    "exp": "Metric spaces require the triangle inequality (sum, not max). The max-based property is the ultrametric inequality, which is strictly stronger.",
    "exp_zh": "度量空间要求三角不等式（求和而非取最大值）。取最大值的性质是超度量不等式，它是更强的条件。"
  },
  {
    "ch": 7,
    "type": "study",
    "q": "The JL Lemma says that \\(n\\) points in \\(\\mathbb{R}^d\\) can be projected to \\(\\mathbb{R}^k\\) preserving all pairwise distances within \\((1 \\pm \\varepsilon)\\). What is \\(k\\)?",
    "q_zh": "JL引理说 \\(\\mathbb{R}^d\\) 中的 \\(n\\) 个点可以投影到 \\(\\mathbb{R}^k\\) 并保持所有成对距离在 \\((1 \\pm \\varepsilon)\\) 范围内。\\(k\\) 是多少？",
    "opts": [
      "\\(O(d / \\varepsilon^2)\\)",
      "\\(O(\\log n / \\varepsilon^2)\\)",
      "\\(O(n / \\varepsilon)\\)",
      "\\(O(\\sqrt{d} \\log n)\\)"
    ],
    "opts_zh": [
      "\\(O(d / \\varepsilon^2)\\)",
      "\\(O(\\log n / \\varepsilon^2)\\)",
      "\\(O(n / \\varepsilon)\\)",
      "\\(O(\\sqrt{d} \\log n)\\)"
    ],
    "answer": 1,
    "exp": "The JL Lemma requires \\(k = O(\\log n / \\varepsilon^2)\\). Remarkably, this depends only on \\(n\\) (number of points) and \\(\\varepsilon\\), not on the original dimension \\(d\\).",
    "exp_zh": "JL引理要求 \\(k = O(\\log n / \\varepsilon^2)\\)。值得注意的是，这只依赖于 \\(n\\)（点数）和 \\(\\varepsilon\\)，与原始维度 \\(d\\) 无关。"
  },
  {
    "ch": 7,
    "type": "study",
    "q": "In an LSH family, what does the condition \\(p > q\\) ensure?",
    "q_zh": "在LSH族中，条件 \\(p > q\\) 保证了什么？",
    "opts": [
      "All points have equal collision probability",
      "Far points collide more often than close points",
      "Close points collide more often than far points",
      "The hash function is injective"
    ],
    "opts_zh": [
      "所有点的碰撞概率相同",
      "远点比近点更容易碰撞",
      "近点比远点更容易碰撞",
      "哈希函数是单射的"
    ],
    "answer": 2,
    "exp": "In an (r, Cr, p, q)-sensitive LSH family, p is the collision probability for close points (dist ≤ r) and q for far points (dist ≥ Cr). We need p > q so that close points are more likely to collide.",
    "exp_zh": "在 (r, Cr, p, q)-敏感的LSH族中，p是近点的碰撞概率，q是远点的碰撞概率。我们需要 p > q 以保证近点更可能碰撞。"
  },
  {
    "ch": 7,
    "type": "study",
    "q": "The sensitivity parameter \\(\\rho\\) of an LSH family is defined as:",
    "q_zh": "LSH族的敏感性参数 \\(\\rho\\) 定义为：",
    "opts": [
      "\\(p / q\\)",
      "\\(1 - p/q\\)",
      "\\(q / p\\)",
      "\\(\\log(1/p) / \\log(1/q)\\)"
    ],
    "opts_zh": [
      "\\(p / q\\)",
      "\\(1 - p/q\\)",
      "\\(q / p\\)",
      "\\(\\log(1/p) / \\log(1/q)\\)"
    ],
    "answer": 3,
    "exp": "The sensitivity parameter is \\(\\rho = \\log(1/p) / \\log(1/q)\\). Since \\(p > q\\), we have \\(\\rho < 1\\). Smaller \\(\\rho\\) means better performance.",
    "exp_zh": "敏感性参数为 \\(\\rho = \\log(1/p) / \\log(1/q)\\)。由于 \\(p > q\\)，我们有 \\(\\rho < 1\\)。\\(\\rho\\) 越小性能越好。"
  },
  {
    "ch": 7,
    "type": "study",
    "q": "For Hamming LSH (bit sampling), what is the approximate value of \\(\\rho\\)?",
    "q_zh": "对于Hamming LSH（位采样），\\(\\rho\\) 的近似值是多少？",
    "opts": [
      "\\(1/C\\)",
      "\\(1/C^2\\)",
      "\\(C\\)",
      "\\(\\log C\\)"
    ],
    "opts_zh": [
      "\\(1/C\\)",
      "\\(1/C^2\\)",
      "\\(C\\)",
      "\\(\\log C\\)"
    ],
    "answer": 0,
    "exp": "Hamming LSH achieves \\(\\rho \\approx 1/C\\) for approximation factor \\(C\\). This follows from \\(\\log(1/(1-r/d)) / \\log(1/(1-Cr/d)) \\approx (r/d)/(Cr/d) = 1/C\\).",
    "exp_zh": "Hamming LSH实现 \\(\\rho \\approx 1/C\\)。这由 \\(\\log(1/(1-r/d)) / \\log(1/(1-Cr/d)) \\approx (r/d)/(Cr/d) = 1/C\\) 得出。"
  },
  {
    "ch": 7,
    "type": "study",
    "q": "SimHash for Euclidean space uses what type of random object?",
    "q_zh": "SimHash用于欧几里得空间时使用什么类型的随机对象？",
    "opts": [
      "Random bit vector",
      "Random Gaussian vector (hyperplane)",
      "Random permutation",
      "Random k-d tree split"
    ],
    "opts_zh": [
      "随机位向量",
      "随机高斯向量（超平面）",
      "随机排列",
      "随机 k-d 树分割"
    ],
    "answer": 1,
    "exp": "SimHash uses h_g(x) = sign(⟨g, x⟩) where g is a random Gaussian vector. This is equivalent to projecting onto a random hyperplane.",
    "exp_zh": "SimHash使用 h_g(x) = sign(⟨g, x⟩)，其中 g 是随机高斯向量。这等价于投影到随机超平面上。"
  },
  {
    "ch": 7,
    "type": "study",
    "q": "What is the query time of the LSH-based ANN data structure?",
    "q_zh": "基于LSH的ANN数据结构的查询时间是多少？",
    "opts": [
      "\\(O(nd)\\)",
      "\\(O(d \\log n)\\)",
      "\\(O(n^{\\rho} d)\\)",
      "\\(O(\\sqrt{n} \\cdot d)\\)"
    ],
    "opts_zh": [
      "\\(O(nd)\\)",
      "\\(O(d \\log n)\\)",
      "\\(O(n^{\\rho} d)\\)",
      "\\(O(\\sqrt{n} \\cdot d)\\)"
    ],
    "answer": 2,
    "exp": "LSH achieves query time \\(O(n^{\\rho} d)\\) where \\(\\rho < 1\\). This is sub-linear in \\(n\\), which is the key advantage over linear scan.",
    "exp_zh": "LSH实现查询时间 \\(O(n^{\\rho} d)\\)，其中 \\(\\rho < 1\\)。这是关于 \\(n\\) 的次线性时间，是相对于线性扫描的关键优势。"
  },
  {
    "ch": 7,
    "type": "study",
    "q": "In the Baby ANN problem, what does the algorithm return when no point is within distance \\(r\\)?",
    "q_zh": "在Baby ANN问题中，当没有点在距离 \\(r\\) 内时，算法返回什么？",
    "opts": [
      "A random point from S",
      "An error message",
      "The farthest point from x",
      "It certifies that no point is within distance r"
    ],
    "opts_zh": [
      "S中的一个随机点",
      "一个错误信息",
      "离 x 最远的点",
      "证明没有点在距离 r 内"
    ],
    "answer": 3,
    "exp": "Baby C-ANN either returns a point within distance Cr, or certifies that no point is within distance r. This two-outcome guarantee is key to the doubling search reduction.",
    "exp_zh": "Baby C-ANN要么返回距离 Cr 内的点，要么证明没有点在距离 r 内。这种双结果保证是倍增搜索规约的关键。"
  },
  {
    "ch": 7,
    "type": "study",
    "q": "What extra factor does the Baby ANN to General ANN reduction introduce?",
    "q_zh": "从Baby ANN到General ANN的规约引入了什么额外因子？",
    "opts": [
      "\\(O(\\log \\Delta)\\) where \\(\\Delta\\) is the aspect ratio",
      "\\(O(\\log n)\\)",
      "\\(O(d)\\)",
      "\\(O(n^{\\rho})\\)"
    ],
    "opts_zh": [
      "\\(O(\\log \\Delta)\\)，其中 \\(\\Delta\\) 是纵横比",
      "\\(O(\\log n)\\)",
      "\\(O(d)\\)",
      "\\(O(n^{\\rho})\\)"
    ],
    "answer": 0,
    "exp": "The doubling search over distance scales introduces a factor of \\(O(\\log \\Delta)\\) where \\(\\Delta\\) is the ratio of maximum to minimum pairwise distance.",
    "exp_zh": "对距离尺度的倍增搜索引入了 \\(O(\\log \\Delta)\\) 因子，其中 \\(\\Delta\\) 是最大与最小成对距离的比值。"
  },
  {
    "ch": 7,
    "type": "study",
    "q": "A false positive in LSH-based ANN refers to:",
    "q_zh": "LSH基于的ANN中的假阳性是指：",
    "opts": [
      "A close point that is not found by the hash",
      "A far point that collides with the query in a hash table",
      "A hash function that returns the wrong value",
      "A point that does not exist in the dataset"
    ],
    "opts_zh": [
      "一个未被哈希找到的近点",
      "一个在哈希表中与查询碰撞的远点",
      "一个返回错误值的哈希函数",
      "一个不存在于数据集中的点"
    ],
    "answer": 1,
    "exp": "A false positive occurs when a far point (dist ≥ Cr) ends up in the same hash bucket as the query. This costs extra distance computation but does not affect correctness (we just check and discard).",
    "exp_zh": "假阳性是指一个远点（距离 ≥ Cr）落入与查询相同的哈希桶中。这会增加额外的距离计算成本，但不影响正确性。"
  },
  {
    "ch": 7,
    "type": "math",
    "q": "Which of these is NOT a valid metric on \\(\\{0,1\\}^d\\)?",
    "q_zh": "以下哪个不是 \\(\\{0,1\\}^d\\) 上的有效度量？",
    "opts": [
      "Hamming distance",
      "Euclidean distance (treating bits as 0/1 coordinates)",
      "dist(x,y) = max(x) - min(y)",
      "dist(x,y) = 1 for all x ≠ y (discrete metric)"
    ],
    "opts_zh": [
      "Hamming距离",
      "欧几里得距离（将位视为 0/1 坐标）",
      "dist(x,y) = max(x) - min(y)",
      "离散度量：dist(x,y) = 1 对所有 x ≠ y"
    ],
    "answer": 2,
    "exp": "The function dist(x,y) = max(x) - min(y) is not even well-defined as a metric (it can be negative and does not satisfy symmetry or triangle inequality in general).",
    "exp_zh": "函数 dist(x,y) = max(x) - min(y) 甚至不是一个良好定义的度量（可能为负，且不满足对称性或三角不等式）。"
  },
  {
    "ch": 7,
    "type": "math",
    "q": "The \\(\\ell_2\\) norm of \\(x = (1, -2, 2)\\) is:",
    "q_zh": "\\(x = (1, -2, 2)\\) 的 \\(\\ell_2\\) 范数为：",
    "opts": [
      "\\(5\\)",
      "\\(9\\)",
      "\\(\\sqrt{5}\\)",
      "\\(3\\)"
    ],
    "opts_zh": [
      "\\(5\\)",
      "\\(9\\)",
      "\\(\\sqrt{5}\\)",
      "\\(3\\)"
    ],
    "answer": 3,
    "exp": "\\(\\|x\\|_2 = \\sqrt{1^2 + (-2)^2 + 2^2} = \\sqrt{1 + 4 + 4} = \\sqrt{9} = 3\\).",
    "exp_zh": "\\(\\|x\\|_2 = \\sqrt{1^2 + (-2)^2 + 2^2} = \\sqrt{1 + 4 + 4} = \\sqrt{9} = 3\\)。"
  },
  {
    "ch": 7,
    "type": "math",
    "q": "If \\(Z \\sim \\mathcal{N}(0, 1)\\), what is the distribution of \\(Z^2\\)?",
    "q_zh": "如果 \\(Z \\sim \\mathcal{N}(0, 1)\\)，\\(Z^2\\) 的分布是什么？",
    "opts": [
      "\\(\\chi^2(1)\\)",
      "\\(\\mathcal{N}(0, 1)\\)",
      "\\(\\text{Exp}(1)\\)",
      "\\(\\text{Uniform}(0, 1)\\)"
    ],
    "opts_zh": [
      "\\(\\chi^2(1)\\)",
      "\\(\\mathcal{N}(0, 1)\\)",
      "\\(\\text{Exp}(1)\\)",
      "\\(\\text{Uniform}(0, 1)\\)"
    ],
    "answer": 0,
    "exp": "By definition, \\(\\chi^2(k)\\) is the sum of \\(k\\) independent standard normal squares. So \\(Z^2 \\sim \\chi^2(1)\\).",
    "exp_zh": "根据定义，\\(\\chi^2(k)\\) 是 \\(k\\) 个独立标准正态平方的和。所以 \\(Z^2 \\sim \\chi^2(1)\\)。"
  },
  {
    "ch": 7,
    "type": "math",
    "q": "In the JL projection \\(Mu\\), what distribution do the matrix entries follow?",
    "q_zh": "在JL投影 \\(Mu\\) 中，矩阵元素服从什么分布？",
    "opts": [
      "\\(\\text{Uniform}(-1, 1)\\)",
      "\\(\\mathcal{N}(0, 1/k)\\)",
      "\\(\\text{Bernoulli}(1/2)\\)",
      "\\(\\mathcal{N}(0, 1)\\)"
    ],
    "opts_zh": [
      "\\(\\text{Uniform}(-1, 1)\\)",
      "\\(\\mathcal{N}(0, 1/k)\\)",
      "\\(\\text{Bernoulli}(1/2)\\)",
      "\\(\\mathcal{N}(0, 1)\\)"
    ],
    "answer": 1,
    "exp": "The standard JL construction uses entries i.i.d. from \\(\\mathcal{N}(0, 1/k)\\) where \\(k\\) is the target dimension. The \\(1/k\\) variance ensures unbiased norm preservation.",
    "exp_zh": "标准JL构造使用来自 \\(\\mathcal{N}(0, 1/k)\\) 的i.i.d.元素，其中 \\(k\\) 是目标维度。\\(1/k\\) 方差确保无偏范数保持。"
  },
  {
    "ch": 7,
    "type": "math",
    "q": "\\(\\mathbb{E}[\\chi^2(k)] = \\) ?",
    "q_zh": "\\(\\mathbb{E}[\\chi^2(k)] = \\) ?",
    "opts": [
      "\\(k^2\\)",
      "\\(2k\\)",
      "\\(k\\)",
      "\\(\\sqrt{k}\\)"
    ],
    "opts_zh": [
      "\\(k^2\\)",
      "\\(2k\\)",
      "\\(k\\)",
      "\\(\\sqrt{k}\\)"
    ],
    "answer": 2,
    "exp": "\\(\\chi^2(k)\\) is the sum of \\(k\\) independent \\(\\chi^2(1)\\) variables, each with mean 1. So \\(\\mathbb{E}[\\chi^2(k)] = k\\).",
    "exp_zh": "\\(\\chi^2(k)\\) 是 \\(k\\) 个独立的 \\(\\chi^2(1)\\) 变量的和，每个均值为1。所以 \\(\\mathbb{E}[\\chi^2(k)] = k\\)。"
  },
  {
    "ch": 7,
    "type": "math",
    "q": "The union bound over \\(\\binom{n}{2}\\) pairs with individual failure probability \\(\\delta\\) gives total failure probability at most:",
    "q_zh": "对 \\(\\binom{n}{2}\\) 对的联合界，每对失败概率为 \\(\\delta\\)，总失败概率至多为：",
    "opts": [
      "\\(\\delta^{n(n-1)/2}\\)",
      "\\(n^2 \\delta\\)",
      "\\(\\delta / \\binom{n}{2}\\)",
      "\\(\\binom{n}{2} \\delta\\)"
    ],
    "opts_zh": [
      "\\(\\delta^{n(n-1)/2}\\)",
      "\\(n^2 \\delta\\)",
      "\\(\\delta / \\binom{n}{2}\\)",
      "\\(\\binom{n}{2} \\delta\\)"
    ],
    "answer": 3,
    "exp": "The union bound sums the individual probabilities: \\(\\Pr[\\bigcup A_i] \\leq \\sum \\Pr[A_i] = \\binom{n}{2} \\cdot \\delta\\).",
    "exp_zh": "联合界将各个概率求和：\\(\\Pr[\\bigcup A_i] \\leq \\sum \\Pr[A_i] = \\binom{n}{2} \\cdot \\delta\\)。"
  },
  {
    "ch": 7,
    "type": "math",
    "q": "The \\(\\log n\\) in \\(k = O(\\log n / \\varepsilon^2)\\) comes from:",
    "q_zh": "\\(k = O(\\log n / \\varepsilon^2)\\) 中的 \\(\\log n\\) 来自：",
    "opts": [
      "The union bound over \\(O(n^2)\\) pairs combined with sub-exponential tails",
      "The number of hash functions needed",
      "The dimension of the original space",
      "The depth of a balanced binary tree"
    ],
    "opts_zh": [
      "对 \\(O(n^2)\\) 对的联合界与次指数尾的结合",
      "所需哈希函数的数量",
      "原始空间的维度",
      "平衡二叉树的深度"
    ],
    "answer": 0,
    "exp": "We need the per-pair failure probability \\(\\delta = O(1/n^2)\\) so that the union bound over \\(\\binom{n}{2}\\) pairs gives constant total failure. The sub-exponential tail gives \\(k = O(\\log(1/\\delta)/\\varepsilon^2) = O(\\log n/\\varepsilon^2)\\).",
    "exp_zh": "我们需要每对失败概率 \\(\\delta = O(1/n^2)\\)，以便对 \\(\\binom{n}{2}\\) 对的联合界给出常数总失败率。次指数尾给出 \\(k = O(\\log(1/\\delta)/\\varepsilon^2) = O(\\log n/\\varepsilon^2)\\)。"
  },
  {
    "ch": 7,
    "type": "math",
    "q": "For the inner product \\(\\langle g, u \\rangle\\) where \\(g \\sim \\mathcal{N}(0, I_d)\\), the result follows distribution:",
    "q_zh": "对于内积 \\(\\langle g, u \\rangle\\)，其中 \\(g \\sim \\mathcal{N}(0, I_d)\\)，结果服从分布：",
    "opts": [
      "\\(\\mathcal{N}(0, d)\\)",
      "\\(\\mathcal{N}(0, \\|u\\|^2)\\)",
      "\\(\\chi^2(d)\\)",
      "\\(\\text{Uniform}(-\\|u\\|, \\|u\\|)\\)"
    ],
    "opts_zh": [
      "\\(\\mathcal{N}(0, d)\\)",
      "\\(\\mathcal{N}(0, \\|u\\|^2)\\)",
      "\\(\\chi^2(d)\\)",
      "\\(\\text{Uniform}(-\\|u\\|, \\|u\\|)\\)"
    ],
    "answer": 1,
    "exp": "\\(\\langle g, u \\rangle = \\sum_i g_i u_i\\) is a linear combination of independent Gaussians, giving \\(\\mathcal{N}(0, \\sum_i u_i^2) = \\mathcal{N}(0, \\|u\\|^2)\\).",
    "exp_zh": "\\(\\langle g, u \\rangle = \\sum_i g_i u_i\\) 是独立高斯变量的线性组合，给出 \\(\\mathcal{N}(0, \\sum_i u_i^2) = \\mathcal{N}(0, \\|u\\|^2)\\)。"
  },
  {
    "ch": 8,
    "type": "study",
    "q": "In the streaming model, the algorithm makes how many passes over the data?",
    "q_zh": "在流式模型中，算法对数据进行多少次扫描？",
    "opts": [
      "\\(O(\\log n)\\) passes",
      "Two passes",
      "One pass",
      "As many as needed"
    ],
    "opts_zh": [
      "\\(O(\\log n)\\) 次",
      "两次",
      "一次",
      "根据需要"
    ],
    "answer": 2,
    "exp": "The streaming model allows only a single pass over the data. This is the defining constraint.",
    "exp_zh": "流式模型只允许对数据进行一次扫描。这是其定义特征。"
  },
  {
    "ch": 8,
    "type": "study",
    "q": "The Misra-Gries algorithm guarantees that its estimate \\(\\hat{f}_j\\) satisfies:",
    "q_zh": "Misra-Gries算法保证其估计值 \\(\\hat{f}_j\\) 满足：",
    "opts": [
      "\\(f_j \\leq \\hat{f}_j \\leq f_j + \\varepsilon m\\) (overestimates)",
      "\\(\\hat{f}_j = f_j\\) exactly",
      "\\(|\\hat{f}_j - f_j| \\leq \\varepsilon m\\) (symmetric)",
      "\\(f_j - \\varepsilon m \\leq \\hat{f}_j \\leq f_j\\) (underestimates)"
    ],
    "opts_zh": [
      "\\(f_j \\leq \\hat{f}_j \\leq f_j + \\varepsilon m\\) (高估)",
      "\\(\\hat{f}_j = f_j\\) 精确",
      "\\(|\\hat{f}_j - f_j| \\leq \\varepsilon m\\) (对称)",
      "\\(f_j - \\varepsilon m \\leq \\hat{f}_j \\leq f_j\\) (低估)"
    ],
    "answer": 3,
    "exp": "Misra-Gries never overestimates (\\(\\hat{f}_j \\leq f_j\\)) and underestimates by at most \\(\\varepsilon m\\).",
    "exp_zh": "Misra-Gries从不高估（\\(\\hat{f}_j \\leq f_j\\)），低估最多 \\(\\varepsilon m\\)。"
  },
  {
    "ch": 8,
    "type": "study",
    "q": "The Morris counter uses how much space to approximately count up to \\(m\\)?",
    "q_zh": "Morris计数器使用多少空间来近似计数到 \\(m\\)？",
    "opts": [
      "\\(O(\\log\\log m)\\) bits",
      "\\(O(\\log m)\\) bits",
      "\\(O(\\sqrt{m})\\) bits",
      "\\(O(1)\\) bits"
    ],
    "opts_zh": [
      "\\(O(\\log\\log m)\\) 位",
      "\\(O(\\log m)\\) 位",
      "\\(O(\\sqrt{m})\\) 位",
      "\\(O(1)\\) 位"
    ],
    "answer": 0,
    "exp": "The counter \\(x\\) only reaches about \\(\\log_2 m\\), and storing \\(x\\) takes \\(O(\\log\\log m)\\) bits.",
    "exp_zh": "计数器 \\(x\\) 只达到约 \\(\\log_2 m\\)，存储 \\(x\\) 需要 \\(O(\\log\\log m)\\) 位。"
  },
  {
    "ch": 8,
    "type": "study",
    "q": "What is the variance of a single Morris counter estimate \\(\\hat{d} = 2^x - 1\\) after \\(d\\) elements?",
    "q_zh": "在 \\(d\\) 个元素后，单个Morris计数器估计 \\(\\hat{d} = 2^x - 1\\) 的方差是多少？",
    "opts": [
      "\\(d\\)",
      "\\(d(d-1)/2\\)",
      "\\(d^2\\)",
      "\\(\\log d\\)"
    ],
    "opts_zh": [
      "\\(d\\)",
      "\\(d(d-1)/2\\)",
      "\\(d^2\\)",
      "\\(\\log d\\)"
    ],
    "answer": 1,
    "exp": "The variance is \\(d(d-1)/2 = \\Theta(d^2)\\), which is why a single counter is unreliable.",
    "exp_zh": "方差为 \\(d(d-1)/2 = \\Theta(d^2)\\)，这就是为什么单个计数器不可靠。"
  },
  {
    "ch": 8,
    "type": "study",
    "q": "In the median-of-means technique, what is the correct order of operations?",
    "q_zh": "在中位数-均值技术中，正确的操作顺序是什么？",
    "opts": [
      "Take median first, then average",
      "Take maximum of averages",
      "Average first, then take median",
      "Take minimum of medians"
    ],
    "opts_zh": [
      "先取中位数，再求平均",
      "取平均值的最大值",
      "先求平均，再取中位数",
      "取中位数的最小值"
    ],
    "answer": 2,
    "exp": "First average groups of copies to reduce variance (Chebyshev), then take the median of the group averages for high probability (Chernoff).",
    "exp_zh": "先对副本组求平均以减小方差（切比雪夫），然后取组平均值的中位数以获得高概率（切尔诺夫）。"
  },
  {
    "ch": 8,
    "type": "study",
    "q": "The Tidemark (AMS) algorithm for distinct elements uses what hash property?",
    "q_zh": "Tidemark (AMS) 不同元素算法使用什么哈希属性？",
    "opts": [
      "Number of leading ones in \\(h(a_i)\\)",
      "Most significant bit of \\(h(a_i)\\)",
      "Parity of \\(h(a_i)\\)",
      "Number of trailing zeros in \\(h(a_i)\\)"
    ],
    "opts_zh": [
      "\\(h(a_i)\\) 的前导1的个数",
      "\\(h(a_i)\\) 的最高有效位",
      "\\(h(a_i)\\) 的奇偶性",
      "\\(h(a_i)\\) 的尾随0的个数"
    ],
    "answer": 3,
    "exp": "Tidemark tracks the maximum number of trailing zeros across all hashed elements. More distinct elements means more trailing zeros observed.",
    "exp_zh": "Tidemark跟踪所有哈希元素中尾随0的最大数量。更多不同元素意味着观察到更多尾随0。"
  },
  {
    "ch": 8,
    "type": "study",
    "q": "Why is the BJKST algorithm better than Tidemark for distinct elements?",
    "q_zh": "为什么BJKST算法比Tidemark更好？",
    "opts": [
      "It gives a \\((1\\pm\\varepsilon)\\) estimate instead of constant-factor",
      "It uses less space",
      "It is deterministic",
      "It works in multiple passes"
    ],
    "opts_zh": [
      "它给出 \\((1\\pm\\varepsilon)\\) 估计而不是常数因子",
      "它使用更少空间",
      "它是确定性的",
      "它在多次扫描中工作"
    ],
    "answer": 0,
    "exp": "BJKST improves from a constant-factor approximation (Tidemark) to a \\((1\\pm\\varepsilon)\\) approximation by maintaining a buffer and using a secondary hash.",
    "exp_zh": "BJKST通过维护缓冲区和使用辅助哈希，将Tidemark的常数因子近似改进为 \\((1\\pm\\varepsilon)\\) 近似。"
  },
  {
    "ch": 8,
    "type": "study",
    "q": "Is the Misra-Gries algorithm deterministic or randomised?",
    "q_zh": "Misra-Gries算法是确定性的还是随机的？",
    "opts": [
      "Randomised (needs random hash)",
      "Deterministic",
      "Randomised (Monte Carlo)",
      "Las Vegas"
    ],
    "opts_zh": [
      "随机的（需要随机哈希）",
      "确定性的",
      "随机的（蒙特卡洛）",
      "拉斯维加斯"
    ],
    "answer": 1,
    "exp": "Misra-Gries is completely deterministic. No randomness is used. The guarantees hold for all inputs.",
    "exp_zh": "Misra-Gries是完全确定性的。不使用随机性。保证对所有输入成立。"
  },
  {
    "ch": 8,
    "type": "study",
    "q": "Which technique reduces failure probability from constant to \\(\\delta\\) in streaming algorithms?",
    "q_zh": "哪种技术将流式算法的失败概率从常数降低到 \\(\\delta\\)？",
    "opts": [
      "Running more passes",
      "Using a bigger hash family",
      "Median-of-means (or median trick)",
      "Increasing the stream length"
    ],
    "opts_zh": [
      "进行更多次扫描",
      "使用更大的哈希族",
      "中位数-均值技术（或中位数技巧）",
      "增加流长度"
    ],
    "answer": 2,
    "exp": "The median trick (running \\(O(\\log(1/\\delta))\\) copies and taking the median) reduces failure probability from constant to \\(\\delta\\).",
    "exp_zh": "中位数技巧（运行 \\(O(\\log(1/\\delta))\\) 个副本并取中位数）将失败概率从常数降低到 \\(\\delta\\)。"
  },
  {
    "ch": 8,
    "type": "study",
    "q": "What does \\(F_0\\) measure in a data stream?",
    "q_zh": "在数据流中，\\(F_0\\) 衡量什么？",
    "opts": [
      "Total stream length \\(m\\)",
      "Maximum frequency \\(\\max_j f_j\\)",
      "Sum of squared frequencies",
      "Number of distinct elements"
    ],
    "opts_zh": [
      "流的总长度 \\(m\\)",
      "最大频率 \\(\\max_j f_j\\)",
      "频率平方和",
      "不同元素的数量"
    ],
    "answer": 3,
    "exp": "\\(F_0 = |\\{j : f_j > 0\\}|\\) counts the number of distinct elements that appear at least once in the stream.",
    "exp_zh": "\\(F_0 = |\\{j : f_j > 0\\}|\\) 计算在流中至少出现一次的不同元素的数量。"
  },
  {
    "ch": 8,
    "type": "math",
    "q": "What is \\(\\log_2(\\log_2(2^{256}))\\)?",
    "q_zh": "\\(\\log_2(\\log_2(2^{256}))\\) 等于多少？",
    "opts": [
      "\\(8\\)",
      "\\(256\\)",
      "\\(16\\)",
      "\\(128\\)"
    ],
    "opts_zh": [
      "\\(8\\)",
      "\\(256\\)",
      "\\(16\\)",
      "\\(128\\)"
    ],
    "answer": 0,
    "exp": "\\(\\log_2(2^{256}) = 256\\), then \\(\\log_2(256) = 8\\).",
    "exp_zh": "\\(\\log_2(2^{256}) = 256\\)，然后 \\(\\log_2(256) = 8\\)。"
  },
  {
    "ch": 8,
    "type": "math",
    "q": "For \\(X \\sim \\text{Geometric}(1/4)\\), what is \\(\\mathbb{E}[X]\\)?",
    "q_zh": "对于 \\(X \\sim \\text{Geometric}(1/4)\\)，\\(\\mathbb{E}[X]\\) 是多少？",
    "opts": [
      "\\(1/4\\)",
      "\\(4\\)",
      "\\(16\\)",
      "\\(2\\)"
    ],
    "opts_zh": [
      "\\(1/4\\)",
      "\\(4\\)",
      "\\(16\\)",
      "\\(2\\)"
    ],
    "answer": 1,
    "exp": "\\(\\mathbb{E}[\\text{Geometric}(p)] = 1/p = 1/(1/4) = 4\\).",
    "exp_zh": "\\(\\mathbb{E}[\\text{Geometric}(p)] = 1/p = 1/(1/4) = 4\\)。"
  },
  {
    "ch": 8,
    "type": "math",
    "q": "The Law of Total Expectation states \\(\\mathbb{E}[X] = \\)",
    "q_zh": "全期望公式表明 \\(\\mathbb{E}[X] = \\)",
    "opts": [
      "\\(\\text{Var}[X] + \\mathbb{E}[X]^2\\)",
      "\\(\\mathbb{E}[X] \\cdot \\mathbb{E}[Y]\\)",
      "\\(\\mathbb{E}[\\mathbb{E}[X \\mid Y]]\\)",
      "\\(\\sum_x x \\cdot \\Pr[Y = x]\\)"
    ],
    "opts_zh": [
      "\\(\\text{Var}[X] + \\mathbb{E}[X]^2\\)",
      "\\(\\mathbb{E}[X] \\cdot \\mathbb{E}[Y]\\)",
      "\\(\\mathbb{E}[\\mathbb{E}[X \\mid Y]]\\)",
      "\\(\\sum_x x \\cdot \\Pr[Y = x]\\)"
    ],
    "answer": 2,
    "exp": "The tower property: \\(\\mathbb{E}[X] = \\mathbb{E}[\\mathbb{E}[X \\mid Y]]\\) for any \\(Y\\).",
    "exp_zh": "塔式性质：\\(\\mathbb{E}[X] = \\mathbb{E}[\\mathbb{E}[X \\mid Y]]\\)。"
  },
  {
    "ch": 8,
    "type": "math",
    "q": "The variance formula \\(\\text{Var}[X] = \\mathbb{E}[X^2] - \\mathbb{E}[X]^2\\) requires:",
    "q_zh": "方差公式 \\(\\text{Var}[X] = \\mathbb{E}[X^2] - \\mathbb{E}[X]^2\\) 需要：",
    "opts": [
      "\\(X\\) and \\(Y\\) to be independent",
      "Nothing beyond the definition",
      "\\(X\\) to be discrete",
      "\\(\\mathbb{E}[X^2] < \\infty\\)"
    ],
    "opts_zh": [
      "\\(X\\) 和 \\(Y\\) 独立",
      "仅需定义",
      "\\(X\\) 是离散的",
      "\\(\\mathbb{E}[X^2] < \\infty\\)"
    ],
    "answer": 3,
    "exp": "The formula requires \\(\\mathbb{E}[X^2] < \\infty\\) (finite second moment). It works for both discrete and continuous \\(X\\).",
    "exp_zh": "该公式需要 \\(\\mathbb{E}[X^2] < \\infty\\)（有限二阶矩）。对离散和连续 \\(X\\) 都成立。"
  },
  {
    "ch": 8,
    "type": "math",
    "q": "How many trailing zeros does \\(40 = 101000_2\\) have?",
    "q_zh": "\\(40 = 101000_2\\) 有多少个尾随零？",
    "opts": [
      "\\(3\\)",
      "\\(2\\)",
      "\\(4\\)",
      "\\(5\\)"
    ],
    "opts_zh": [
      "\\(3\\)",
      "\\(2\\)",
      "\\(4\\)",
      "\\(5\\)"
    ],
    "answer": 0,
    "exp": "\\(40 = 101000_2\\). The three rightmost bits are 000, so there are 3 trailing zeros.",
    "exp_zh": "\\(40 = 101000_2\\)。最右边三位是 000，所以有 3 个尾随零。"
  },
  {
    "ch": 8,
    "type": "math",
    "q": "In the median-of-means technique, after averaging \\(k\\) copies, the failure probability is at most:",
    "q_zh": "在中位数-均值技术中，对 \\(k\\) 个副本求平均后，失败概率至多为：",
    "opts": [
      "\\(\\delta\\)",
      "\\(1/4\\)",
      "\\(1/k\\)",
      "\\(e^{-k}\\)"
    ],
    "opts_zh": [
      "\\(\\delta\\)",
      "\\(1/4\\)",
      "\\(1/k\\)",
      "\\(e^{-k}\\)"
    ],
    "answer": 1,
    "exp": "By Chebyshev with \\(k = O(1/\\varepsilon^2)\\), the failure probability of the average is at most \\(1/4\\) (a constant). The median step then reduces it to \\(\\delta\\).",
    "exp_zh": "用切比雪夫与 \\(k = O(1/\\varepsilon^2)\\)，平均值的失败概率至多为 \\(1/4\\)（常数）。然后中位数步骤将其降低到 \\(\\delta\\)。"
  },
  {
    "ch": 8,
    "type": "math",
    "q": "If \\(h\\) is a random hash and we observe trailing zeros \\(\\text{zeros}(h(j)) \\geq r\\), the probability of this event is approximately:",
    "q_zh": "如果 \\(h\\) 是随机哈希且我们观察到尾随零 \\(\\text{zeros}(h(j)) \\geq r\\)，该事件的概率约为：",
    "opts": [
      "\\(r/n\\)",
      "\\(2^r/n\\)",
      "\\(1/2^r\\)",
      "\\(1/r\\)"
    ],
    "opts_zh": [
      "\\(r/n\\)",
      "\\(2^r/n\\)",
      "\\(1/2^r\\)",
      "\\(1/r\\)"
    ],
    "answer": 2,
    "exp": "A uniformly random value has \\(\\geq r\\) trailing zeros with probability \\(\\approx 1/2^r\\), since it must be divisible by \\(2^r\\).",
    "exp_zh": "均匀随机值有 \\(\\geq r\\) 个尾随零的概率约为 \\(1/2^r\\)，因为它必须能被 \\(2^r\\) 整除。"
  },
  {
    "ch": 8,
    "type": "math",
    "q": "Eve’s Law (Law of Total Variance) states:",
    "q_zh": "Eve定律（全方差公式）表明：",
    "opts": [
      "\\(\\text{Var}[X] = \\mathbb{E}[X^2]\\)",
      "\\(\\text{Var}[X] = \\text{Var}[Y] + \\text{Var}[X-Y]\\)",
      "\\(\\text{Var}[X+Y] = \\text{Var}[X] + \\text{Var}[Y]\\)",
      "\\(\\text{Var}[X] = \\mathbb{E}[\\text{Var}[X|Y]] + \\text{Var}[\\mathbb{E}[X|Y]]\\)"
    ],
    "opts_zh": [
      "\\(\\text{Var}[X] = \\mathbb{E}[X^2]\\)",
      "\\(\\text{Var}[X] = \\text{Var}[Y] + \\text{Var}[X-Y]\\)",
      "\\(\\text{Var}[X+Y] = \\text{Var}[X] + \\text{Var}[Y]\\)",
      "\\(\\text{Var}[X] = \\mathbb{E}[\\text{Var}[X|Y]] + \\text{Var}[\\mathbb{E}[X|Y]]\\)"
    ],
    "answer": 3,
    "exp": "Eve’s Law decomposes total variance into the expected conditional variance plus the variance of the conditional mean.",
    "exp_zh": "Eve定律将总方差分解为条件方差的期望加上条件均值的方差。"
  },
  {
    "ch": 9,
    "type": "study",
    "q": "A linear sketch satisfies \\(A(\\sigma_1 \\circ \\sigma_2) = \\)",
    "q_zh": "线性草图满足 \\(A(\\sigma_1 \\circ \\sigma_2) = \\)",
    "opts": [
      "\\(A(\\sigma_1) + A(\\sigma_2)\\)",
      "\\(A(\\sigma_1) \\cdot A(\\sigma_2)\\)",
      "\\(\\max(A(\\sigma_1), A(\\sigma_2))\\)",
      "\\(\\min(A(\\sigma_1), A(\\sigma_2))\\)"
    ],
    "opts_zh": [
      "\\(A(\\sigma_1) + A(\\sigma_2)\\)",
      "\\(A(\\sigma_1) \\cdot A(\\sigma_2)\\)",
      "\\(\\max(A(\\sigma_1), A(\\sigma_2))\\)",
      "\\(\\min(A(\\sigma_1), A(\\sigma_2))\\)"
    ],
    "answer": 0,
    "exp": "A linear sketch composes by pointwise addition of the internal state vectors.",
    "exp_zh": "线性草图通过内部状态向量的逐点加法进行组合。"
  },
  {
    "ch": 9,
    "type": "study",
    "q": "CountSketch provides an error guarantee in terms of which norm?",
    "q_zh": "CountSketch提供哪个范数的误差保证？",
    "opts": [
      "\\(\\ell_1\\) norm",
      "\\(\\ell_2\\) norm",
      "\\(\\ell_\\infty\\) norm",
      "\\(\\ell_0\\) norm"
    ],
    "opts_zh": [
      "\\(\\ell_1\\) 范数",
      "\\(\\ell_2\\) 范数",
      "\\(\\ell_\\infty\\) 范数",
      "\\(\\ell_0\\) 范数"
    ],
    "answer": 1,
    "exp": "CountSketch gives \\(|\\hat{f}_j - f_j| \\leq \\varepsilon\\|f_{-j}\\|_2\\), an \\(\\ell_2\\) guarantee.",
    "exp_zh": "CountSketch给出 \\(|\\hat{f}_j - f_j| \\leq \\varepsilon\\|f_{-j}\\|_2\\)，这是 \\(\\ell_2\\) 保证。"
  },
  {
    "ch": 9,
    "type": "study",
    "q": "In CountMinSketch, the estimate \\(\\hat{f}_j\\) satisfies:",
    "q_zh": "在CountMinSketch中，估计值 \\(\\hat{f}_j\\) 满足：",
    "opts": [
      "\\(\\hat{f}_j \\leq f_j\\) always",
      "\\(\\hat{f}_j = f_j\\) with high probability",
      "\\(\\hat{f}_j \\geq f_j\\) always",
      "\\(\\hat{f}_j\\) is unbiased"
    ],
    "opts_zh": [
      "总是 \\(\\hat{f}_j \\leq f_j\\)",
      "高概率 \\(\\hat{f}_j = f_j\\)",
      "总是 \\(\\hat{f}_j \\geq f_j\\)",
      "\\(\\hat{f}_j\\) 是无偏的"
    ],
    "answer": 2,
    "exp": "CountMinSketch always overestimates because collisions only add to the count. The minimum over rows gives the tightest overestimate.",
    "exp_zh": "CountMinSketch总是高估，因为碰撞只会增加计数。行之间取最小值给出最紧的高估。"
  },
  {
    "ch": 9,
    "type": "study",
    "q": "What role does the sign hash \\(g:[n]\\to\\{-1,+1\\}\\) play in CountSketch?",
    "q_zh": "符号哈希 \\(g:[n]\\to\\{-1,+1\\}\\) 在CountSketch中起什么作用？",
    "opts": [
      "Reduces space usage",
      "Maps elements to smaller universe",
      "Provides probability amplification",
      "Makes collisions cancel in expectation, giving an unbiased estimator"
    ],
    "opts_zh": [
      "减少空间使用",
      "将元素映射到更小的宇宙",
      "提供概率放大",
      "使碰撞在期望中抵消，给出无偏估计"
    ],
    "answer": 3,
    "exp": "The sign hash \\(g\\) ensures \\(\\mathbb{E}[g(i)g(j)] = 0\\) for \\(i \\neq j\\), so collisions cancel in expectation, making the estimator unbiased.",
    "exp_zh": "符号哈希 \\(g\\) 确保 \\(\\mathbb{E}[g(i)g(j)] = 0\\)(当 \\(i \\neq j\\))，因此碰撞在期望中抵消，使估计器无偏。"
  },
  {
    "ch": 9,
    "type": "study",
    "q": "Which streaming model does CountSketch support?",
    "q_zh": "CountSketch支持哪种流式模型？",
    "opts": [
      "General turnstile",
      "Strict turnstile only",
      "Cash register only",
      "Multi-pass model"
    ],
    "opts_zh": [
      "一般旋转门模型",
      "仅严格旋转门模型",
      "仅现金模型",
      "多次扫描模型"
    ],
    "answer": 0,
    "exp": "CountSketch works in the general turnstile model because the sign hash makes the estimator work even with negative frequencies.",
    "exp_zh": "CountSketch在一般旋转门模型中工作，因为符号哈希使估计器即使在负频率下也能工作。"
  },
  {
    "ch": 9,
    "type": "study",
    "q": "CountMinSketch achieves probability amplification via:",
    "q_zh": "CountMinSketch通过什么实现概率放大？",
    "opts": [
      "Median trick (median of T rows)",
      "Built-in: taking min over T independent rows",
      "Mean of T rows",
      "Chernoff bound on a single row"
    ],
    "opts_zh": [
      "中位数技巧（T行的中位数）",
      "内置：取T个独立行的最小值",
      "T行的均值",
      "单行的切尔诺夫界"
    ],
    "answer": 1,
    "exp": "CMS takes the minimum over \\(T\\) rows. The estimate is too large only if ALL rows overestimate, which happens with probability \\(\\leq (1/e)^T\\).",
    "exp_zh": "CMS取 \\(T\\) 行的最小值。估计过大仅当所有行都高估时才发生，概率 \\(\\leq (1/e)^T\\)。"
  },
  {
    "ch": 9,
    "type": "study",
    "q": "For the same space budget, CountSketch gives better estimates than CountMinSketch when:",
    "q_zh": "在相同空间预算下，CountSketch在什么情况下比CountMinSketch给出更好的估计？",
    "opts": [
      "Frequencies are concentrated on few heavy hitters",
      "The stream is very short",
      "Frequencies are spread out across many elements",
      "The universe size n is small"
    ],
    "opts_zh": [
      "频率集中在少数重击者上",
      "流非常短",
      "频率分布在许多元素上",
      "宇宙大小 n 很小"
    ],
    "answer": 2,
    "exp": "When frequencies are spread out, \\(\\|f\\|_2 \\ll \\|f\\|_1\\), so CountSketch’s \\(\\ell_2\\) guarantee is much tighter than CountMinSketch’s \\(\\ell_1\\) guarantee.",
    "exp_zh": "当频率分散时，\\(\\|f\\|_2 \\ll \\|f\\|_1\\)，所以CountSketch的 \\(\\ell_2\\) 保证比CountMinSketch的 \\(\\ell_1\\) 保证更紧。"
  },
  {
    "ch": 9,
    "type": "study",
    "q": "Is Misra-Gries a linear sketch?",
    "q_zh": "Misra-Gries是线性草图吗？",
    "opts": [
      "Yes, it is a linear sketch",
      "Yes, when combined with median trick",
      "No, it cannot be composed at all",
      "No, but it is a (non-linear) sketching algorithm"
    ],
    "opts_zh": [
      "是，它是线性草图",
      "是，当与中位数技巧结合时",
      "不是，它无法组合",
      "不是，但它是（非线性）草图算法"
    ],
    "answer": 3,
    "exp": "Misra-Gries outputs can be combined (add counts, prune to k), but this requires a non-linear step. It is a sketching algorithm but NOT a linear sketch.",
    "exp_zh": "Misra-Gries的输出可以组合（加计数，剪裁到k），但这需要非线性步骤。它是草图算法但不是线性草图。"
  },
  {
    "ch": 9,
    "type": "study",
    "q": "In the turnstile model, updates are of the form:",
    "q_zh": "在旋转门模型中，更新的形式是：",
    "opts": [
      "\\((j, c)\\) where \\(c \\in \\{-B, \\ldots, B\\}\\)",
      "\\((j, c)\\) where \\(c \\geq 0\\)",
      "\\((j, 1)\\) only (increment by 1)",
      "\\((j, c)\\) where \\(c \\in \\{0, 1\\}\\)"
    ],
    "opts_zh": [
      "\\((j, c)\\) 其中 \\(c \\in \\{-B, \\ldots, B\\}\\)",
      "\\((j, c)\\) 其中 \\(c \\geq 0\\)",
      "仅 \\((j, 1)\\)（加1）",
      "\\((j, c)\\) 其中 \\(c \\in \\{0, 1\\}\\)"
    ],
    "answer": 0,
    "exp": "The turnstile model allows both positive and negative updates: \\(c \\in \\{-B, \\ldots, B\\}\\).",
    "exp_zh": "旋转门模型允许正和负更新：\\(c \\in \\{-B, \\ldots, B\\}\\)。"
  },
  {
    "ch": 9,
    "type": "study",
    "q": "How does CountMinSketch achieve probability amplification without the median trick?",
    "q_zh": "CountMinSketch如何在不使用中位数技巧的情况下实现概率放大？",
    "opts": [
      "By averaging all rows",
      "By taking the min: failure requires all T rows to fail",
      "By using Chebyshev on the sum",
      "It cannot; it always has constant failure probability"
    ],
    "opts_zh": [
      "通过对所有行求平均",
      "通过取最小值：失败需要所有T行都失败",
      "通过对总和使用切比雪夫",
      "不能；它总是有常数失败概率"
    ],
    "answer": 1,
    "exp": "Since CMS always overestimates, taking the min of \\(T\\) rows means the estimate is too high only if ALL rows are too high. This probability is \\((1/e)^T \\leq \\delta\\).",
    "exp_zh": "由于CMS总是高估，取 \\(T\\) 行的最小值意味着估计过高仅当所有行都过高。此概率为 \\((1/e)^T \\leq \\delta\\)。"
  },
  {
    "ch": 9,
    "type": "math",
    "q": "A strongly universal hash family is the same as:",
    "q_zh": "强全域哈希族等同于：",
    "opts": [
      "1-wise independent",
      "Fully independent",
      "2-wise independent (pairwise)",
      "4-wise independent"
    ],
    "opts_zh": [
      "1-独立",
      "完全独立",
      "2-独立（成对）",
      "4-独立"
    ],
    "answer": 2,
    "exp": "Strongly universal = 2-wise independent. For any two distinct keys, the hash values are uniformly and independently distributed.",
    "exp_zh": "强全域 = 2-独立。对于任意两个不同的键，哈希值均匀且独立分布。"
  },
  {
    "ch": 9,
    "type": "math",
    "q": "For \\(g : [n] \\to \\{-1,+1\\}\\) from a strongly universal family and \\(x \\neq y\\), \\(\\mathbb{E}[g(x)g(y)] = \\)",
    "q_zh": "对于强全域族的 \\(g : [n] \\to \\{-1,+1\\}\\) 和 \\(x \\neq y\\)，\\(\\mathbb{E}[g(x)g(y)] = \\)",
    "opts": [
      "\\(1\\)",
      "\\(1/2\\)",
      "\\(-1\\)",
      "\\(0\\)"
    ],
    "opts_zh": [
      "\\(1\\)",
      "\\(1/2\\)",
      "\\(-1\\)",
      "\\(0\\)"
    ],
    "answer": 3,
    "exp": "By 2-independence, \\(g(x)\\) and \\(g(y)\\) are independent with \\(\\mathbb{E}[g(x)] = 0\\), so \\(\\mathbb{E}[g(x)g(y)] = 0\\).",
    "exp_zh": "由于2-独立性，\\(g(x)\\) 和 \\(g(y)\\) 独立且 \\(\\mathbb{E}[g(x)] = 0\\)，所以 \\(\\mathbb{E}[g(x)g(y)] = 0\\)。"
  },
  {
    "ch": 9,
    "type": "math",
    "q": "Which norm relationship is correct?",
    "q_zh": "哪个范数关系是正确的？",
    "opts": [
      "\\(\\|x\\|_\\infty \\leq \\|x\\|_2 \\leq \\|x\\|_1\\)",
      "\\(\\|x\\|_1 \\leq \\|x\\|_2 \\leq \\|x\\|_\\infty\\)",
      "\\(\\|x\\|_2 \\leq \\|x\\|_\\infty \\leq \\|x\\|_1\\)",
      "\\(\\|x\\|_1 \\leq \\|x\\|_\\infty \\leq \\|x\\|_2\\)"
    ],
    "opts_zh": [
      "\\(\\|x\\|_\\infty \\leq \\|x\\|_2 \\leq \\|x\\|_1\\)",
      "\\(\\|x\\|_1 \\leq \\|x\\|_2 \\leq \\|x\\|_\\infty\\)",
      "\\(\\|x\\|_2 \\leq \\|x\\|_\\infty \\leq \\|x\\|_1\\)",
      "\\(\\|x\\|_1 \\leq \\|x\\|_\\infty \\leq \\|x\\|_2\\)"
    ],
    "answer": 0,
    "exp": "The norms are monotonically decreasing in \\(p\\): \\(\\|x\\|_\\infty \\leq \\|x\\|_2 \\leq \\|x\\|_1\\).",
    "exp_zh": "范数关于 \\(p\\) 单调递减：\\(\\|x\\|_\\infty \\leq \\|x\\|_2 \\leq \\|x\\|_1\\)。"
  },
  {
    "ch": 9,
    "type": "math",
    "q": "CountSketch uses Chebyshev while CountMinSketch uses Markov because:",
    "q_zh": "CountSketch用Chebyshev而CountMinSketch用Markov因为：",
    "opts": [
      "CS has smaller space",
      "CMS estimator is non-negative (one-sided), CS estimator is unbiased (two-sided)",
      "Chebyshev is always better than Markov",
      "They use different hash families"
    ],
    "opts_zh": [
      "CS空间更小",
      "CMS估计器非负（单侧），CS估计器无偏（双侧）",
      "Chebyshev总是比Markov好",
      "它们使用不同的哈希族"
    ],
    "answer": 1,
    "exp": "CMS always overestimates (error is non-negative), so Markov applies. CS has zero-mean error due to the sign hash, so Chebyshev (which bounds two-sided deviation via variance) is appropriate.",
    "exp_zh": "CMS总是高估（误差非负），因此可用Markov。CS由于符号哈希有零均值误差，因此适合用Chebyshev。"
  },
  {
    "ch": 9,
    "type": "math",
    "q": "The variance of a single CountSketch row estimator is bounded by:",
    "q_zh": "单行CountSketch估计器的方差上界为：",
    "opts": [
      "\\(\\|f_{-j}\\|_1 / k\\)",
      "\\(\\|f_{-j}\\|_\\infty / k\\)",
      "\\(\\|f_{-j}\\|_2^2 / k\\)",
      "\\(m^2 / k\\)"
    ],
    "opts_zh": [
      "\\(\\|f_{-j}\\|_1 / k\\)",
      "\\(\\|f_{-j}\\|_\\infty / k\\)",
      "\\(\\|f_{-j}\\|_2^2 / k\\)",
      "\\(m^2 / k\\)"
    ],
    "answer": 2,
    "exp": "\\(\\text{Var}[X_t] = \\sum_{i \\neq j} f_i^2 / k = \\|f_{-j}\\|_2^2 / k\\).",
    "exp_zh": "\\(\\text{Var}[X_t] = \\sum_{i \\neq j} f_i^2 / k = \\|f_{-j}\\|_2^2 / k\\)。"
  },
  {
    "ch": 9,
    "type": "math",
    "q": "In CountMinSketch, setting \\(k = e/\\varepsilon\\) makes each row’s failure probability at most:",
    "q_zh": "在CountMinSketch中，设 \\(k = e/\\varepsilon\\) 使每行的失败概率至多为：",
    "opts": [
      "\\(\\varepsilon\\)",
      "\\(\\varepsilon^2\\)",
      "\\(1/2\\)",
      "\\(1/e\\)"
    ],
    "opts_zh": [
      "\\(\\varepsilon\\)",
      "\\(\\varepsilon^2\\)",
      "\\(1/2\\)",
      "\\(1/e\\)"
    ],
    "answer": 3,
    "exp": "By Markov: \\(\\Pr[\\text{bad}] \\leq 1/(k\\varepsilon) = 1/e \\approx 0.368\\).",
    "exp_zh": "由Markov：\\(\\Pr[\\text{bad}] \\leq 1/(k\\varepsilon) = 1/e \\approx 0.368\\)。"
  },
  {
    "ch": 9,
    "type": "math",
    "q": "The ratio \\(\\|x\\|_1 / \\|x\\|_2\\) is maximised when the vector is:",
    "q_zh": "比值 \\(\\|x\\|_1 / \\|x\\|_2\\) 在向量为什么时最大？",
    "opts": [
      "Uniformly spread across all coordinates",
      "All weight on one coordinate",
      "Half positive, half negative",
      "Exponentially decaying"
    ],
    "opts_zh": [
      "均匀分布在所有坐标上",
      "所有权重在一个坐标上",
      "一半正一半负",
      "指数衰减"
    ],
    "answer": 0,
    "exp": "By Cauchy-Schwarz, \\(\\|x\\|_1 / \\|x\\|_2 \\leq \\sqrt{d}\\), with equality when all \\(|x_i|\\) are equal (uniform distribution).",
    "exp_zh": "由Cauchy-Schwarz，\\(\\|x\\|_1 / \\|x\\|_2 \\leq \\sqrt{d}\\)，当所有 \\(|x_i|\\) 相等时取等号。"
  },
  {
    "ch": 9,
    "type": "math",
    "q": "CountMinSketch achieves failure probability \\(\\delta\\) by taking the min of \\(T\\) rows where \\(T = \\)",
    "q_zh": "CountMinSketch通过取 \\(T\\) 行的最小值实现失败概率 \\(\\delta\\)，其中 \\(T = \\)",
    "opts": [
      "\\(O(1/\\delta)\\)",
      "\\(\\lceil\\ln(1/\\delta)\\rceil\\)",
      "\\(O(1/\\delta^2)\\)",
      "\\(O(\\log\\log(1/\\delta))\\)"
    ],
    "opts_zh": [
      "\\(O(1/\\delta)\\)",
      "\\(\\lceil\\ln(1/\\delta)\\rceil\\)",
      "\\(O(1/\\delta^2)\\)",
      "\\(O(\\log\\log(1/\\delta))\\)"
    ],
    "answer": 1,
    "exp": "Failure probability \\(\\leq (1/e)^T = e^{-T}\\). Setting \\(e^{-T} = \\delta\\) gives \\(T = \\lceil\\ln(1/\\delta)\\rceil\\).",
    "exp_zh": "失败概率 \\(\\leq (1/e)^T = e^{-T}\\)。设 \\(e^{-T} = \\delta\\) 得 \\(T = \\lceil\\ln(1/\\delta)\\rceil\\)。"
  },
  {
    "ch": 10,
    "type": "study",
    "q": "The LP relaxation bound states that for a maximisation ILP:",
    "q_zh": "LP松弛界表明，对于最大化ILP：",
    "opts": [
      "\\(\\text{opt}_{ILP} = \\text{opt}_{LP}\\)",
      "\\(\\text{opt}_{ILP} \\geq \\text{opt}_{LP}\\)",
      "\\(\\text{opt}_{ILP} \\leq \\text{opt}_{LP}\\)",
      "No relation in general"
    ],
    "opts_zh": [
      "\\(\\text{opt}_{ILP} = \\text{opt}_{LP}\\)",
      "\\(\\text{opt}_{ILP} \\geq \\text{opt}_{LP}\\)",
      "\\(\\text{opt}_{ILP} \\leq \\text{opt}_{LP}\\)",
      "一般无关系"
    ],
    "answer": 2,
    "exp": "Relaxing constraints can only increase (or maintain) the optimum, so \\(\\text{opt}_{ILP} \\leq \\text{opt}_{LP}\\).",
    "exp_zh": "松弛约束只会增加（或保持）最优值，因此\\(\\text{opt}_{ILP} \\leq \\text{opt}_{LP}\\)。"
  },
  {
    "ch": 10,
    "type": "study",
    "q": "The naive random algorithm for Max-SAT achieves what approximation ratio?",
    "q_zh": "Max-SAT的简单随朼算法达到什么近似比？",
    "opts": [
      "\\(1/4\\)",
      "\\(3/4\\)",
      "\\(1-1/e\\)",
      "\\(1/2\\)"
    ],
    "opts_zh": [
      "\\(1/4\\)",
      "\\(3/4\\)",
      "\\(1-1/e\\)",
      "\\(1/2\\)"
    ],
    "answer": 3,
    "exp": "Each clause of length \\(\\ell\\) is satisfied with probability \\(1 - 1/2^\\ell \\geq 1/2\\).",
    "exp_zh": "每个长度为\\(\\ell\\)的子句被满足的概率为\\(1 - 1/2^\\ell \\geq 1/2\\)。"
  },
  {
    "ch": 10,
    "type": "study",
    "q": "What approximation ratio does LP rounding achieve for Max-SAT?",
    "q_zh": "LP舍入对Max-SAT达到什么近似比？",
    "opts": [
      "\\(1 - 1/e \\approx 0.632\\)",
      "\\(1/2\\)",
      "\\(3/4\\)",
      "\\(7/8\\)"
    ],
    "opts_zh": [
      "\\(1 - 1/e \\approx 0.632\\)",
      "\\(1/2\\)",
      "\\(3/4\\)",
      "\\(7/8\\)"
    ],
    "answer": 0,
    "exp": "LP relaxation + randomised rounding gives \\((1-1/e)\\)-approximation using AM-GM inequality.",
    "exp_zh": "LP松弛 + 随机舍入用AM-GM不等式给出\\((1-1/e)\\)近似。"
  },
  {
    "ch": 10,
    "type": "study",
    "q": "The best-of-two approach for Max-SAT combines which two algorithms?",
    "q_zh": "Max-SAT的最优取二方法组合了哪两个算法？",
    "opts": [
      "Two LP roundings with different seeds",
      "Naive random and LP rounding",
      "Greedy and LP rounding",
      "Two naive random with different seeds"
    ],
    "opts_zh": [
      "两个不同种子的LP舍入",
      "简单随朼和LP舍入",
      "贪心和LP舍入",
      "两个不同种子的简单随朼"
    ],
    "answer": 1,
    "exp": "Naive random is better for long clauses, LP rounding for short ones. Together they achieve 3/4.",
    "exp_zh": "简单随朼对长子句更好，LP舍入对短子句更好。组合达到3/4。"
  },
  {
    "ch": 10,
    "type": "study",
    "q": "For Min-Cut, randomised rounding achieves:",
    "q_zh": "对于Min-Cut，随朼舍入达到：",
    "opts": [
      "A \\(1/2\\)-approximation",
      "A \\((1-1/e)\\)-approximation",
      "The exact optimum (w.p. 1)",
      "A \\(3/4\\)-approximation"
    ],
    "opts_zh": [
      "\\(1/2\\)近似",
      "\\((1-1/e)\\)近似",
      "精确最优（概率为1）",
      "\\(3/4\\)近似"
    ],
    "answer": 2,
    "exp": "Remarkably, randomised rounding for Min-Cut achieves the exact optimum with probability 1.",
    "exp_zh": "令人惊讶的是，Min-Cut的随朼舍入以概率1达到精确最优。"
  },
  {
    "ch": 10,
    "type": "math",
    "q": "By AM-GM, for \\(a, b \\geq 0\\): \\(\\sqrt{ab} \\leq\\)",
    "q_zh": "由AM-GM，对于 \\(a, b \\geq 0\\)：\\(\\sqrt{ab} \\leq\\)",
    "opts": [
      "\\(a + b\\)",
      "\\(ab\\)",
      "\\(\\max(a,b)\\)",
      "\\((a+b)/2\\)"
    ],
    "opts_zh": [
      "\\(a + b\\)",
      "\\(ab\\)",
      "\\(\\max(a,b)\\)",
      "\\((a+b)/2\\)"
    ],
    "answer": 3,
    "exp": "AM-GM for \\(k=2\\): \\(\\sqrt{ab} \\leq (a+b)/2\\).",
    "exp_zh": "AM-GM当\\(k=2\\)：\\(\\sqrt{ab} \\leq (a+b)/2\\)。"
  },
  {
    "ch": 10,
    "type": "math",
    "q": "\\(\\left(1 - \\frac{1}{3}\\right)^3 = \\)",
    "q_zh": "\\(\\left(1 - \\frac{1}{3}\\right)^3 = \\)",
    "opts": [
      "\\(8/27\\)",
      "\\(2/3\\)",
      "\\(1/3\\)",
      "\\(4/9\\)"
    ],
    "opts_zh": [
      "\\(8/27\\)",
      "\\(2/3\\)",
      "\\(1/3\\)",
      "\\(4/9\\)"
    ],
    "answer": 0,
    "exp": "\\((2/3)^3 = 8/27 \\approx 0.296 < 1/e \\approx 0.368\\).",
    "exp_zh": "\\((2/3)^3 = 8/27 \\approx 0.296 < 1/e \\approx 0.368\\)。"
  },
  {
    "ch": 10,
    "type": "math",
    "q": "For Max-SAT with \\(\\ell_j = 1\\) (unit clause), the LP rounding approximation factor is:",
    "q_zh": "对于\\(\\ell_j = 1\\)（单元子句）的Max-SAT，LP舍入近似因子是：",
    "opts": [
      "\\(1/2\\)",
      "\\(1\\)",
      "\\(1 - 1/e\\)",
      "\\(3/4\\)"
    ],
    "opts_zh": [
      "\\(1/2\\)",
      "\\(1\\)",
      "\\(1 - 1/e\\)",
      "\\(3/4\\)"
    ],
    "answer": 1,
    "exp": "For \\(\\ell = 1\\): \\(1-(1-1/1)^1 = 1\\). LP rounding perfectly handles unit clauses.",
    "exp_zh": "当\\(\\ell = 1\\)：\\(1-(1-1/1)^1 = 1\\)。LP舍入完美处理单元子句。"
  },
  {
    "ch": 10,
    "type": "math",
    "q": "The golden ratio-based approximation \\(p = (\\sqrt{5}-1)/2\\) gives:",
    "q_zh": "基于黄金比的近似\\(p = (\\sqrt{5}-1)/2\\)给出：",
    "opts": [
      "\\(3/4\\)-approx",
      "\\(\\approx 0.632\\)-approx",
      "\\(\\approx 0.618\\)-approx",
      "\\(1/2\\)-approx"
    ],
    "opts_zh": [
      "\\(3/4\\)近似",
      "\\(\\approx 0.632\\)近似",
      "\\(\\approx 0.618\\)近似",
      "\\(1/2\\)近似"
    ],
    "answer": 2,
    "exp": "\\(p = (\\sqrt{5}-1)/2 \\approx 0.618\\). Slightly worse than \\(1-1/e \\approx 0.632\\).",
    "exp_zh": "\\(p = (\\sqrt{5}-1)/2 \\approx 0.618\\)。略差于\\(1-1/e \\approx 0.632\\)。"
  },
  {
    "ch": 10,
    "type": "math",
    "q": "An LP relaxation of a minimisation ILP satisfies:",
    "q_zh": "最小化ILP的LP松弛满足：",
    "opts": [
      "No general relation",
      "\\(\\text{opt}_{LP} \\geq \\text{opt}_{ILP}\\)",
      "\\(\\text{opt}_{LP} = \\text{opt}_{ILP}\\)",
      "\\(\\text{opt}_{LP} \\leq \\text{opt}_{ILP}\\)"
    ],
    "opts_zh": [
      "无一般关系",
      "\\(\\text{opt}_{LP} \\geq \\text{opt}_{ILP}\\)",
      "\\(\\text{opt}_{LP} = \\text{opt}_{ILP}\\)",
      "\\(\\text{opt}_{LP} \\leq \\text{opt}_{ILP}\\)"
    ],
    "answer": 3,
    "exp": "For minimisation, relaxing constraints can only decrease (or maintain) the optimum.",
    "exp_zh": "对于最小化，松弛约束只会减少（或保持）最优值。"
  },
  {
    "ch": 11,
    "type": "study",
    "q": "The total variation distance \\(d_{TV}(p,q)\\) equals:",
    "q_zh": "全变差距离 \\(d_{TV}(p,q)\\) 等于：",
    "opts": [
      "\\(\\frac{1}{2}\\|p - q\\|_1\\)",
      "\\(\\|p - q\\|_1\\)",
      "\\(\\|p - q\\|_2\\)",
      "\\(\\max_x |p(x) - q(x)|\\)"
    ],
    "opts_zh": [
      "\\(\\frac{1}{2}\\|p - q\\|_1\\)",
      "\\(\\|p - q\\|_1\\)",
      "\\(\\|p - q\\|_2\\)",
      "\\(\\max_x |p(x) - q(x)|\\)"
    ],
    "answer": 0,
    "exp": "By definition, \\(d_{TV}(p,q) = \\frac{1}{2}\\|p-q\\|_1 = \\frac{1}{2}\\sum_x|p(x)-q(x)|\\).",
    "exp_zh": "根据定义，\\(d_{TV}(p,q) = \\frac{1}{2}\\|p-q\\|_1 = \\frac{1}{2}\\sum_x|p(x)-q(x)|\\)。"
  },
  {
    "ch": 11,
    "type": "study",
    "q": "The Data Processing Inequality states that for any function \\(f\\):",
    "q_zh": "数据处理不等式表明对于任意函数 \\(f\\)：",
    "opts": [
      "\\(d_{TV}(f(p), f(q)) \\geq d_{TV}(p, q)\\)",
      "\\(d_{TV}(f(p), f(q)) \\leq d_{TV}(p, q)\\)",
      "\\(d_{TV}(f(p), f(q)) = d_{TV}(p, q)\\)",
      "\\(d_{TV}(f(p), f(q)) = 0\\)"
    ],
    "opts_zh": [
      "\\(d_{TV}(f(p), f(q)) \\geq d_{TV}(p, q)\\)",
      "\\(d_{TV}(f(p), f(q)) \\leq d_{TV}(p, q)\\)",
      "\\(d_{TV}(f(p), f(q)) = d_{TV}(p, q)\\)",
      "\\(d_{TV}(f(p), f(q)) = 0\\)"
    ],
    "answer": 1,
    "exp": "Post-processing can only decrease (or maintain) TV distance, never increase it.",
    "exp_zh": "后处理只能减少（或保持）TV距离，永远不会增加。"
  },
  {
    "ch": 11,
    "type": "study",
    "q": "In the Pearson-Neyman Lemma, the optimal test uses:",
    "q_zh": "在 Pearson-Neyman 引理中，最优检验使用：",
    "opts": [
      "The likelihood ratio test",
      "The empirical distribution",
      "The Scheff\\'{e} set \\(S^* = \\{x : q(x) > p(x)\\}\\)",
      "A random subset of \\(\\mathcal{X}\\)"
    ],
    "opts_zh": [
      "似然比检验",
      "经验分布",
      "Scheff\\'{e} 集 \\(S^* = \\{x : q(x) > p(x)\\}\\)",
      "\\(\\mathcal{X}\\) 的随机子集"
    ],
    "answer": 2,
    "exp": "The optimal test rejects \\(H_0\\) when \\(q(x) > p(x)\\), achieving \\(\\alpha + \\beta = 1 - d_{TV}(p,q)\\).",
    "exp_zh": "最优检验在 \\(q(x) > p(x)\\) 时拒绝 \\(H_0\\)，达到 \\(\\alpha + \\beta = 1 - d_{TV}(p,q)\\)。"
  },
  {
    "ch": 11,
    "type": "study",
    "q": "The sample complexity for learning a distribution over \\(k\\) elements is:",
    "q_zh": "学习 \\(k\\) 个元素上的分布的样本复杂度为：",
    "opts": [
      "\\(O(\\sqrt{k}/\\varepsilon^2)\\)",
      "\\(O(k/\\varepsilon)\\)",
      "\\(O(k^2/\\varepsilon^2)\\)",
      "\\(O(k/\\varepsilon^2)\\)"
    ],
    "opts_zh": [
      "\\(O(\\sqrt{k}/\\varepsilon^2)\\)",
      "\\(O(k/\\varepsilon)\\)",
      "\\(O(k^2/\\varepsilon^2)\\)",
      "\\(O(k/\\varepsilon^2)\\)"
    ],
    "answer": 3,
    "exp": "Learning requires \\(\\Theta(k/\\varepsilon^2)\\) samples -- linear in the domain size.",
    "exp_zh": "学习需要 \\(\\Theta(k/\\varepsilon^2)\\) 个样本 -- 与域大小成线性关系。"
  },
  {
    "ch": 11,
    "type": "study",
    "q": "The sample complexity for uniformity testing over \\(k\\) elements is:",
    "q_zh": "均匀性检验在 \\(k\\) 个元素上的样本复杂度为：",
    "opts": [
      "\\(O(\\sqrt{k}/\\varepsilon^2)\\)",
      "\\(O(k^2/\\varepsilon^2)\\)",
      "\\(O(k/\\varepsilon^2)\\)",
      "\\(O(\\log k/\\varepsilon^2)\\)"
    ],
    "opts_zh": [
      "\\(O(\\sqrt{k}/\\varepsilon^2)\\)",
      "\\(O(k^2/\\varepsilon^2)\\)",
      "\\(O(k/\\varepsilon^2)\\)",
      "\\(O(\\log k/\\varepsilon^2)\\)"
    ],
    "answer": 0,
    "exp": "Uniformity testing has \\(\\Theta(\\sqrt{k}/\\varepsilon^2)\\) sample complexity -- sublinear in \\(k\\) via the birthday paradox / collision counting.",
    "exp_zh": "均匀性检验的样本复杂度为 \\(\\Theta(\\sqrt{k}/\\varepsilon^2)\\) -- 通过生日悠论/碰撞计数实现了次线性。"
  },
  {
    "ch": 11,
    "type": "study",
    "q": "The collision-based uniformity tester (Algorithm 23) compares what to the threshold?",
    "q_zh": "基于碰撞的均匀性测试器（算法23）将什么与阈值比较？",
    "opts": [
      "The maximum frequency",
      "The number of collisions \\(Z\\)",
      "The number of distinct elements",
      "The TV distance estimate"
    ],
    "opts_zh": [
      "最大频率",
      "碰撞数 \\(Z\\)",
      "不同元素的数量",
      "TV距离估计"
    ],
    "answer": 1,
    "exp": "The tester counts the number of collisions (pairs with the same value) and rejects uniformity if \\(Z > \\tau\\).",
    "exp_zh": "测试器计算碰撞数（相同值的对数），如果 \\(Z > \\tau\\) 则拒绝均匀性。"
  },
  {
    "ch": 11,
    "type": "study",
    "q": "Why does the birthday paradox explain the \\(\\sqrt{k}\\) threshold?",
    "q_zh": "为什么生日悠论解释了 \\(\\sqrt{k}\\) 阈值？",
    "opts": [
      "Because \\(\\sqrt{k}\\) people are needed for a birthday collision",
      "Because \\(\\sqrt{k}\\) is the domain size after reduction",
      "Because with \\(n = \\Theta(\\sqrt{k})\\) samples from a uniform distribution on \\(k\\), we expect \\(\\Theta(1)\\) collisions",
      "Because the birthday paradox gives a lower bound"
    ],
    "opts_zh": [
      "因为需要 \\(\\sqrt{k}\\) 个人才能出现生日碰撞",
      "因为 \\(\\sqrt{k}\\) 是经过缩减后的域大小",
      "因为从 \\(k\\) 上的均匀分布中抽取 \\(n = \\Theta(\\sqrt{k})\\) 个样本时，期望碰撞数为 \\(\\Theta(1)\\)",
      "因为生日悠论给出了下界"
    ],
    "answer": 2,
    "exp": "With \\(n = \\Theta(\\sqrt{k})\\) samples from uniform on \\(k\\), the expected collisions \\(\\approx n^2/(2k) = \\Theta(1)\\). Non-uniform distributions create more collisions, which becomes detectable.",
    "exp_zh": "从 \\(k\\) 上的均匀分布中抽取 \\(n = \\Theta(\\sqrt{k})\\) 个样本时，期望碰撞数 \\(\\approx n^2/(2k) = \\Theta(1)\\)。非均匀分布会产生更多碰撞，可以被检测到。"
  },
  {
    "ch": 11,
    "type": "study",
    "q": "Identity testing reduces to uniformity testing. What is the key idea?",
    "q_zh": "身份检验归约为均匀性检验。关键思想是什么？",
    "opts": [
      "Map \\(q\\) to the empirical distribution",
      "Apply the DPI to reduce the domain",
      "Use the likelihood ratio test",
      "Flatten \\(q\\) into uniform by grouping elements"
    ],
    "opts_zh": [
      "将 \\(q\\) 映射到经验分布",
      "应用DPI来减少域",
      "使用似然比检验",
      "通过分组元素将 \\(q\\) 压平为均匀分布"
    ],
    "answer": 3,
    "exp": "The reduction partitions the domain and reweights so that \\(q\\) becomes (nearly) uniform, then applies a uniformity tester.",
    "exp_zh": "缩减通过分区域并重新赋权，使得 \\(q\\) 变成（几乎）均匀的，然后应用均匀性测试器。"
  },
  {
    "ch": 11,
    "type": "math",
    "q": "Which norm inequality is correct for \\(v \\in \\mathbb{R}^k\\)?",
    "q_zh": "对于 \\(v \\in \\mathbb{R}^k\\)，哪个范数不等式是正确的？",
    "opts": [
      "\\(\\|v\\|_\\infty \\leq \\|v\\|_2 \\leq \\|v\\|_1\\)",
      "\\(\\|v\\|_1 \\leq \\|v\\|_2 \\leq \\|v\\|_\\infty\\)",
      "\\(\\|v\\|_2 \\leq \\|v\\|_\\infty \\leq \\|v\\|_1\\)",
      "\\(\\|v\\|_1 \\leq \\|v\\|_\\infty \\leq \\|v\\|_2\\)"
    ],
    "opts_zh": [
      "\\(\\|v\\|_\\infty \\leq \\|v\\|_2 \\leq \\|v\\|_1\\)",
      "\\(\\|v\\|_1 \\leq \\|v\\|_2 \\leq \\|v\\|_\\infty\\)",
      "\\(\\|v\\|_2 \\leq \\|v\\|_\\infty \\leq \\|v\\|_1\\)",
      "\\(\\|v\\|_1 \\leq \\|v\\|_\\infty \\leq \\|v\\|_2\\)"
    ],
    "answer": 0,
    "exp": "The standard chain is \\(\\|v\\|_\\infty \\leq \\|v\\|_2 \\leq \\|v\\|_1\\).",
    "exp_zh": "标准链是 \\(\\|v\\|_\\infty \\leq \\|v\\|_2 \\leq \\|v\\|_1\\)。"
  },
  {
    "ch": 11,
    "type": "math",
    "q": "The chi-squared divergence \\(\\chi^2(p\\|q)\\) relates to TV distance via:",
    "q_zh": "\\(\\chi^2\\) 散度与TV距离的关系为：",
    "opts": [
      "\\(d_{TV}(p,q) \\leq \\chi^2(p\\|q)\\)",
      "\\(d_{TV}(p,q)^2 \\leq \\frac{1}{4}\\chi^2(p\\|q)\\)",
      "\\(\\chi^2(p\\|q) \\leq d_{TV}(p,q)\\)",
      "\\(d_{TV}(p,q) = \\sqrt{\\chi^2(p\\|q)}\\)"
    ],
    "opts_zh": [
      "\\(d_{TV}(p,q) \\leq \\chi^2(p\\|q)\\)",
      "\\(d_{TV}(p,q)^2 \\leq \\frac{1}{4}\\chi^2(p\\|q)\\)",
      "\\(\\chi^2(p\\|q) \\leq d_{TV}(p,q)\\)",
      "\\(d_{TV}(p,q) = \\sqrt{\\chi^2(p\\|q)}\\)"
    ],
    "answer": 1,
    "exp": "By Cauchy-Schwarz, \\(d_{TV}^2 \\leq \\frac{1}{4}\\chi^2\\). This is Pinsker-type for chi-squared.",
    "exp_zh": "由Cauchy-Schwarz，\\(d_{TV}^2 \\leq \\frac{1}{4}\\chi^2\\)。"
  },
  {
    "ch": 11,
    "type": "math",
    "q": "Hoeffding's inequality gives what type of tail bound?",
    "q_zh": "Hoeffding不等式给出什么类型的尾部界？",
    "opts": [
      "Polynomial: \\(O(1/t^2)\\)",
      "Logarithmic: \\(O(\\log n / t)\\)",
      "Exponential: \\(e^{-\\Omega(nt^2)}\\)",
      "Linear: \\(O(n/t)\\)"
    ],
    "opts_zh": [
      "多项式: \\(O(1/t^2)\\)",
      "对数级: \\(O(\\log n / t)\\)",
      "指数级: \\(e^{-\\Omega(nt^2)}\\)",
      "线性: \\(O(n/t)\\)"
    ],
    "answer": 2,
    "exp": "Hoeffding gives exponential tail decay \\(2e^{-2nt^2}\\) for bounded variables, much stronger than Chebyshev's polynomial bound.",
    "exp_zh": "Hoeffding对有界变量给出指数尾部衰减 \\(2e^{-2nt^2}\\)，比Chebyshev的多项式界强得多。"
  },
  {
    "ch": 11,
    "type": "math",
    "q": "In the birthday problem with \\(k\\) days, \\(\\Theta(\\sqrt{k})\\) people give:",
    "q_zh": "在生日问题中，\\(k\\) 天和 \\(\\Theta(\\sqrt{k})\\) 个人给出：",
    "opts": [
      "No collisions with high probability",
      "\\(\\Theta(\\sqrt{k})\\) expected collisions",
      "\\(\\Theta(k)\\) expected collisions",
      "\\(\\Theta(1)\\) expected collisions"
    ],
    "opts_zh": [
      "高概率无碰撞",
      "\\(\\Theta(\\sqrt{k})\\) 个期望碰撞",
      "\\(\\Theta(k)\\) 个期望碰撞",
      "\\(\\Theta(1)\\) 个期望碰撞"
    ],
    "answer": 3,
    "exp": "E[collisions] = n(n-1)/(2k). With n = c*sqrt(k): E[Z] = c^2*k/(2k) = c^2/2 = Theta(1).",
    "exp_zh": "E[碰撞数] = n(n-1)/(2k)。当 n = c*sqrt(k) 时：E[Z] = c^2/2 = Theta(1)。"
  },
  {
    "ch": 11,
    "type": "math",
    "q": "The covariance of counts \\(n_i, n_j\\) (\\(i \\neq j\\)) in the multinomial is:",
    "q_zh": "多项式分布中计数 \\(n_i, n_j\\) (\\(i \\neq j\\)) 的协方差为：",
    "opts": [
      "\\(-np_ip_j\\)",
      "\\(np_ip_j\\)",
      "\\(0\\) (independent)",
      "\\(np_i(1-p_j)\\)"
    ],
    "opts_zh": [
      "\\(-np_ip_j\\)",
      "\\(np_ip_j\\)",
      "\\(0\\)（独立）",
      "\\(np_i(1-p_j)\\)"
    ],
    "answer": 0,
    "exp": "Multinomial counts are negatively correlated: Cov[n_i, n_j] = -np_ip_j. This makes sense: if more samples fall in bin i, fewer can fall in bin j.",
    "exp_zh": "多项式计数负相关：Cov[n_i, n_j] = -np_ip_j。如果更多样本落入箱i，则更少落入箱j。"
  },
  {
    "ch": 11,
    "type": "math",
    "q": "For the Laplace estimator \\(\\hat{p}(i) = (n_i+1)/(n+k)\\), the chi-squared bound gives:",
    "q_zh": "对于Laplace估计器 \\(\\hat{p}(i) = (n_i+1)/(n+k)\\)，\\(\\chi^2\\) 界给出：",
    "opts": [
      "\\(\\mathbb{E}[\\chi^2(p\\|\\hat{p})] \\leq k/n\\)",
      "\\(\\mathbb{E}[\\chi^2(p\\|\\hat{p})] \\leq (k-1)/(n+1)\\)",
      "\\(\\mathbb{E}[\\chi^2(p\\|\\hat{p})] \\leq 1/n^2\\)",
      "\\(\\mathbb{E}[\\chi^2(p\\|\\hat{p})] \\leq k^2/n\\)"
    ],
    "opts_zh": [
      "\\(\\mathbb{E}[\\chi^2(p\\|\\hat{p})] \\leq k/n\\)",
      "\\(\\mathbb{E}[\\chi^2(p\\|\\hat{p})] \\leq (k-1)/(n+1)\\)",
      "\\(\\mathbb{E}[\\chi^2(p\\|\\hat{p})] \\leq 1/n^2\\)",
      "\\(\\mathbb{E}[\\chi^2(p\\|\\hat{p})] \\leq k^2/n\\)"
    ],
    "answer": 1,
    "exp": "The Laplace estimator achieves E[chi^2] <= (k-1)/(n+1), which via Markov gives the optimal O(k/eps^2) learning bound.",
    "exp_zh": "Laplace估计器达到 E[chi^2] <= (k-1)/(n+1)，通过Markov给出最优 O(k/eps^2) 学习界。"
  },
  {
    "ch": 12,
    "type": "study",
    "q": "In the expert advice setting, the adversary can choose the truth sequence:",
    "q_zh": "在专家建议设定中，对手可以选择真值序列：",
    "opts": [
      "Only from a fixed distribution",
      "Only i.i.d. coin flips",
      "Arbitrarily, with no assumptions",
      "Only from a Markov chain"
    ],
    "opts_zh": [
      "仅从固定分布中",
      "仅独立同分布抛硬币",
      "任意选择，没有任何假设",
      "仅从马尔可夫链中"
    ],
    "answer": 2,
    "exp": "The expert advice framework makes no assumptions on the truth sequence. It can be adversarially chosen.",
    "exp_zh": "专家建议框架对真值序列没有任何假设。它可以是对手选择的。"
  },
  {
    "ch": 12,
    "type": "study",
    "q": "The Halving algorithm achieves \\(C(T) \\leq \\log_2 n\\) by:",
    "q_zh": "减半算法通过什么实现 \\(C(T) \\leq \\log_2 n\\)？",
    "opts": [
      "Randomly eliminating half the experts",
      "Sampling experts proportionally to weights",
      "Penalising wrong experts by a factor of \\(1/2\\)",
      "Taking majority vote among surviving experts"
    ],
    "opts_zh": [
      "随机淘汰一半专家",
      "按权重比例采样专家",
      "将错误专家的权重乘以 \\(1/2\\)",
      "在存活专家中进行多数投票"
    ],
    "answer": 3,
    "exp": "Halving uses majority vote. When we err, the majority was wrong, so at least half the survivors are eliminated. This gives \\(\\log_2 n\\) mistakes.",
    "exp_zh": "减半算法使用多数投票。当我们出错时，多数派是错的，因此至少一半存活者被淘汰。这给出 \\(\\log_2 n\\) 次错误。"
  },
  {
    "ch": 12,
    "type": "study",
    "q": "In the Basic MWU (\\(\\beta = 1/2\\)), each mistake reduces the total weight \\(W_t\\) by a factor of:",
    "q_zh": "在基本MWU（\\(\\beta = 1/2\\)）中，每次错误将总权重 \\(W_t\\) 减少了：",
    "opts": [
      "At most \\(3/4\\)",
      "At most \\(1/2\\)",
      "At most \\(7/8\\)",
      "Exactly \\(1/2\\)"
    ],
    "opts_zh": [
      "至多 \\(3/4\\)",
      "至多 \\(1/2\\)",
      "至多 \\(7/8\\)",
      "恰好 \\(1/2\\)"
    ],
    "answer": 0,
    "exp": "When we err, wrong experts (weight \\(> W/2\\)) are halved. So \\(W\\) drops by at least \\(W/4\\), giving \\(W_{t+1} \\leq (3/4)W_t\\).",
    "exp_zh": "当我们出错时，错误专家（权重 \\(> W/2\\)）被减半。所以 \\(W\\) 至少减少 \\(W/4\\)，得到 \\(W_{t+1} \\leq (3/4)W_t\\)。"
  },
  {
    "ch": 12,
    "type": "study",
    "q": "Why does the Randomised MWU achieve a better bound than deterministic MWU?",
    "q_zh": "为什么随机化MWU比确定性MWU能获得更好的界？",
    "opts": [
      "It uses more memory",
      "It eliminates the factor of 2 that adversaries exploit against deterministic predictions",
      "It assumes the truth is random",
      "It uses a better potential function"
    ],
    "opts_zh": [
      "它使用更多内存",
      "它消除了对手利用确定性预测的因子2",
      "它假设真值是随机的",
      "它使用更好的势函数"
    ],
    "answer": 1,
    "exp": "Deterministic algorithms suffer a factor-2 lower bound (Fact 56.3). Randomised prediction avoids this because the adversary cannot predict our choice.",
    "exp_zh": "确定性算法受到因子2的下界限制（事实56.3）。随机化预测避免了这一点，因为对手无法预测我们的选择。"
  },
  {
    "ch": 12,
    "type": "study",
    "q": "The potential function used in the MWU analysis is:",
    "q_zh": "MWU分析中使用的势函数是：",
    "opts": [
      "The number of surviving experts",
      "The maximum weight \\(\\max_i w_{i,t}\\)",
      "The total weight \\(W_t = \\sum_i w_{i,t}\\)",
      "The regret \\(C(T) - C^*(T)\\)"
    ],
    "opts_zh": [
      "存活专家的数量",
      "最大权重 \\(\\max_i w_{i,t}\\)",
      "总权重 \\(W_t = \\sum_i w_{i,t}\\)",
      "后悔 \\(C(T) - C^*(T)\\)"
    ],
    "answer": 2,
    "exp": "The total weight \\(W_t\\) serves as the potential. It decreases geometrically with each mistake (upper bound) while being bounded below by the best expert's weight.",
    "exp_zh": "总权重 \\(W_t\\) 作为势函数。它随每次错误几何级减少（上界），同时被最佳专家的权重下界限制。"
  },
  {
    "ch": 12,
    "type": "study",
    "q": "Setting \\(\\beta = 1/2\\) in MWU(\\(\\beta\\)) gives a bound of approximately:",
    "q_zh": "在MWU(\\(\\beta\\))中设置 \\(\\beta = 1/2\\) 给出的界约为：",
    "opts": [
      "\\(C^* + \\log n\\)",
      "\\(C^* \\cdot \\log n\\)",
      "\\(4C^* + 2\\log n\\)",
      "\\(2.41(C^* + \\log_2 n)\\)"
    ],
    "opts_zh": [
      "\\(C^* + \\log n\\)",
      "\\(C^* \\cdot \\log n\\)",
      "\\(4C^* + 2\\log n\\)",
      "\\(2.41(C^* + \\log_2 n)\\)"
    ],
    "answer": 3,
    "exp": "With \\(\\beta = 1/2\\): \\(\\frac{\\log 2 + \\log n}{\\log(4/3)} \\approx 2.41\\) times \\((C^* + \\log_2 n)\\).",
    "exp_zh": "当 \\(\\beta = 1/2\\) 时：\\(\\frac{\\log 2 + \\log n}{\\log(4/3)} \\approx 2.41\\) 乘以 \\((C^* + \\log_2 n)\\)。"
  },
  {
    "ch": 12,
    "type": "study",
    "q": "The Consistent Expert algorithm requires what assumption?",
    "q_zh": "一致专家算法需要什么假设？",
    "opts": [
      "\\(C^*(T) = 0\\) (a perfect expert exists)",
      "\\(C^*(T) \\leq \\log n\\)",
      "All experts are equally good",
      "The truth is i.i.d."
    ],
    "opts_zh": [
      "\\(C^*(T) = 0\\)（存在完美专家）",
      "\\(C^*(T) \\leq \\log n\\)",
      "所有专家同样好",
      "真值是独立同分布的"
    ],
    "answer": 0,
    "exp": "The Consistent Expert algorithm assumes there exists at least one expert who never makes a mistake (\\(C^* = 0\\)).",
    "exp_zh": "一致专家算法假设至少存在一个从不犯错的专家（\\(C^* = 0\\)）。"
  },
  {
    "ch": 12,
    "type": "study",
    "q": "In the Randomised MWU, the expected cost at time \\(t\\) equals:",
    "q_zh": "在随机化MWU中，时间 \\(t\\) 的期望代价等于：",
    "opts": [
      "\\(1/2\\) always",
      "\\(F_t / W_t\\) where \\(F_t\\) is the total weight of wrong experts",
      "\\(1 - \\beta\\)",
      "\\(\\log(W_t)\\)"
    ],
    "opts_zh": [
      "始终为 \\(1/2\\)",
      "\\(F_t / W_t\\)，其中 \\(F_t\\) 是错误专家的总权重",
      "\\(1 - \\beta\\)",
      "\\(\\log(W_t)\\)"
    ],
    "answer": 1,
    "exp": "We sample an expert with probability proportional to weight. The probability of picking a wrong expert is \\(F_t/W_t\\).",
    "exp_zh": "我们按权重比例采样专家。选择错误专家的概率是 \\(F_t/W_t\\)。"
  },
  {
    "ch": 12,
    "type": "math",
    "q": "What is the potential function used in the Halving algorithm?",
    "q_zh": "减半算法中使用的势函数是什么？",
    "opts": [
      "Total weight \\(W_t\\)",
      "\\(\\log_2 n\\)",
      "\\(|S_t|\\) (surviving experts)",
      "Regret"
    ],
    "opts_zh": [
      "总权重 \\(W_t\\)",
      "\\(\\log_2 n\\)",
      "\\(|S_t|\\)（存活专家数）",
      "后悔"
    ],
    "answer": 2,
    "exp": "The Halving algorithm uses \\(|S_t|\\), the number of surviving experts, as its potential. It halves with each mistake.",
    "exp_zh": "减半算法使用 \\(|S_t|\\)（存活专家数）作为势函数。每次错误后减半。"
  },
  {
    "ch": 12,
    "type": "math",
    "q": "The inequality \\(1 - x \\leq -\\ln x\\) holds for:",
    "q_zh": "不等式 \\(1 - x \\leq -\\ln x\\) 对什么成立？",
    "opts": [
      "\\(x \\geq 1\\) only",
      "\\(0 < x \\leq 1\\) only",
      "All real \\(x\\)",
      "\\(x > 0\\) only"
    ],
    "opts_zh": [
      "仅 \\(x \\geq 1\\)",
      "仅 \\(0 < x \\leq 1\\)",
      "所有实数 \\(x\\)",
      "仅 \\(x > 0\\)"
    ],
    "answer": 3,
    "exp": "The inequality \\(1 - x \\leq -\\ln x\\) holds for all \\(x > 0\\), with equality at \\(x = 1\\). It follows from the concavity of \\(\\ln\\).",
    "exp_zh": "不等式 \\(1 - x \\leq -\\ln x\\) 对所有 \\(x > 0\\) 成立，在 \\(x = 1\\) 时取等。这来自 \\(\\ln\\) 的凹性。"
  },
  {
    "ch": 12,
    "type": "math",
    "q": "In MWU(\\(\\beta\\)), as \\(\\beta \\to 0\\), the bound approaches:",
    "q_zh": "在MWU(\\(\\beta\\))中，当 \\(\\beta \\to 0\\) 时，界趋近于：",
    "opts": [
      "\\(\\infty \\cdot C^* + \\log_2 n\\)",
      "\\(C^* + \\log n\\)",
      "\\(2C^*\\)",
      "\\(n\\)"
    ],
    "opts_zh": [
      "\\(\\infty \\cdot C^* + \\log_2 n\\)",
      "\\(C^* + \\log n\\)",
      "\\(2C^*\\)",
      "\\(n\\)"
    ],
    "answer": 0,
    "exp": "As \\(\\beta \\to 0\\), the multiplicative factor on \\(C^*\\) goes to \\(\\infty\\), but the additive term converges to \\(\\log_2 n\\). Good only when \\(C^* = 0\\).",
    "exp_zh": "当 \\(\\beta \\to 0\\) 时，\\(C^*\\) 上的乘法因子趋于 \\(\\infty\\)，但加法项收敛到 \\(\\log_2 n\\)。仅当 \\(C^* = 0\\) 时有用。"
  },
  {
    "ch": 12,
    "type": "math",
    "q": "The telescoping sum \\(\\sum_{t=1}^{T}\\ln(W_t/W_{t+1})\\) simplifies because:",
    "q_zh": "伸缩和 \\(\\sum_{t=1}^{T}\\ln(W_t/W_{t+1})\\) 简化是因为：",
    "opts": [
      "All \\(W_t\\) are equal",
      "\\(\\ln(a/b) = \\ln a - \\ln b\\), and consecutive terms cancel",
      "The logarithm is linear",
      "\\(W_t / W_{t+1} = \\beta\\) always"
    ],
    "opts_zh": [
      "所有 \\(W_t\\) 相等",
      "\\(\\ln(a/b) = \\ln a - \\ln b\\)，连续项抵消",
      "对数是线性的",
      "\\(W_t / W_{t+1} = \\beta\\) 始终成立"
    ],
    "answer": 1,
    "exp": "\\(\\sum \\ln(W_t/W_{t+1}) = \\sum (\\ln W_t - \\ln W_{t+1}) = \\ln W_1 - \\ln W_{T+1} = \\ln(W_1/W_{T+1})\\).",
    "exp_zh": "\\(\\sum \\ln(W_t/W_{t+1}) = \\sum (\\ln W_t - \\ln W_{t+1}) = \\ln W_1 - \\ln W_{T+1} = \\ln(W_1/W_{T+1})\\)。"
  },
  {
    "ch": 12,
    "type": "math",
    "q": "With \\(\\beta = 1-\\varepsilon\\) and \\(\\varepsilon = \\sqrt{\\log n / C^*}\\), the randomised MWU bound is approximately:",
    "q_zh": "当 \\(\\beta = 1-\\varepsilon\\)且 \\(\\varepsilon = \\sqrt{\\log n / C^*}\\) 时，随机化MWU的界约为：",
    "opts": [
      "\\(C^* \\cdot \\log n\\)",
      "\\(2C^* + \\log n\\)",
      "\\(C^* + 2\\sqrt{C^* \\ln n}\\)",
      "\\(\\sqrt{C^* \\cdot n}\\)"
    ],
    "opts_zh": [
      "\\(C^* \\cdot \\log n\\)",
      "\\(2C^* + \\log n\\)",
      "\\(C^* + 2\\sqrt{C^* \\ln n}\\)",
      "\\(\\sqrt{C^* \\cdot n}\\)"
    ],
    "answer": 2,
    "exp": "With the optimal \\(\\varepsilon\\), the randomised bound becomes \\(C^* + \\frac{\\ln n}{\\varepsilon} \\approx C^* + 2\\sqrt{C^* \\ln n}\\).",
    "exp_zh": "使用最优 \\(\\varepsilon\\)，随机化界变为 \\(C^* + \\frac{\\ln n}{\\varepsilon} \\approx C^* + 2\\sqrt{C^* \\ln n}\\)。"
  },
  {
    "ch": 12,
    "type": "math",
    "q": "In the potential argument for MWU, the lower bound comes from:",
    "q_zh": "在MWU的势函数论证中，下界来自：",
    "opts": [
      "The average expert",
      "The worst expert",
      "The initial weight (\\(W_1 = n\\))",
      "The best expert (\\(W \\geq \\beta^{C^*}\\))"
    ],
    "opts_zh": [
      "平均专家",
      "最差专家",
      "初始权重（\\(W_1 = n\\)）",
      "最佳专家（\\(W \\geq \\beta^{C^*}\\)）"
    ],
    "answer": 3,
    "exp": "The total weight is always at least the weight of any single expert. The best expert has weight \\(\\beta^{C^*}\\), giving the lower bound.",
    "exp_zh": "总权重始终至少等于任何单个专家的权重。最佳专家的权重为 \\(\\beta^{C^*}\\)，给出下界。"
  }
];
