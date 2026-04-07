var QHUB_NAV_T = [
  { s: 'a.nav-link[data-section="sec-quiz-hub"]', t: "测验中心" },
  { s: 'a.nav-link[href^="../../../tools/flashcards.html?ch="]', t: "&#x1F4E6; 闪卡" },
];
var QHUB_STUDY_T = [
  { s: "#quizHubCalloutTitle", t: "本章测验" },
  {
    s: "#quizHubCalloutBody",
    t: "本章的自测与数学习题已统一到测验中心。可选择练习或考试模式。",
  },
  { s: "#quizHubCalloutBtn", t: "打开测验中心" },
  { s: "#flashcardsCalloutBtn", t: "本章闪卡" },
];
var QHUB_MATH_T = [
  { s: "#mathQuizHubCalloutTitle", t: "数学习题" },
  {
    s: "#mathQuizHubCalloutBody",
    t: "本章数学基础测验已移至测验中心。可按章节筛选并选择学习指南题 / 数学题。",
  },
  { s: "#mathQuizHubCalloutBtn", t: "打开测验中心" },
];

// ===================== STUDY PAGE TRANSLATIONS =====================
var STUDY_T = [
  // --- Home link ---
  { s: "[data-i18n-home]", t: "&larr; 课程主页" },

  // --- Sidebar nav ---
  { s: '[data-section="hero"]', t: "概览" },
  { s: '[data-section="sec-card-experiment"]', t: "扑克牌实验" },
  { s: '[data-section="sec-what-is-randomized"]', t: "什么是随机算法？" },
  { s: '[data-section="sec-lv-mc"]', t: "拉斯维加斯 vs 蒙特卡罗" },
  { s: '[data-section="sec-quicksort"]', t: "随机快速排序" },
  { s: '[data-section="sec-comparisons"]', t: "比较次数计数" },
  { s: '[data-section="sec-prob-facts"]', t: "概率工具箱" },
  { s: '[data-section="sec-tutorial"]', t: "习题练习" },

  // --- Math Foundations link ---
  { s: 'a.nav-link[href="chapter1-math.html"]', t: "&#x1F4D0; 数学基础" },
  { s: 'a.nav-link[href="chapter1-mindmap.html"]', t: "&#x1F5FA; 思维导图" },
  { s: 'a.btn[href="chapter1-math.html"]', t: "&#x1F4D0; 数学基础 &rarr;" },
  { s: 'a.btn[href="chapter1-mindmap.html"]', t: "&#x1F5FA; 思维导图 &rarr;" },

  // --- Solution buttons ---
  { s: '.solution-toggle[data-target="sol1"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol2"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol3"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol4"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol5"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol6"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol7"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol8"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol9"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol10"]', t: "查看解答" },

  // --- Hero ---
  { s: ".hero-course", t: "COMPX270 — 随机与高级算法" },
  { s: "#hero h1", t: "第一章：随机性、概率与算法" },
  {
    s: ".hero-subtitle",
    t: "一份涵盖随机算法、期望时间分析、快速排序以及基本概率工具的交互式学习指南。",
  },
  { s: ".hero-cards .hero-card:nth-child(1) span:last-child", t: "扑克牌实验" },
  { s: ".hero-cards .hero-card:nth-child(2) span:last-child", t: "快速排序分析" },
  { s: ".hero-cards .hero-card:nth-child(3) span:last-child", t: "概率工具箱" },
  { s: ".hero-cards .hero-card:nth-child(4) span:last-child", t: "习题与测验" },

  // --- Card Experiment ---
  { s: "#sec-card-experiment .section-title", t: "扑克牌实验" },
  {
    s: "#sec-card-experiment .concept-box p",
    t: '<strong>问题：</strong>取一副标准的52张扑克牌（每种花色13张）。将其均匀随机洗牌后，你期望得到多少对<em>连续相同花色</em>的牌？',
  },
  { s: "#sec-card-experiment .sim-container > h3", t: "交互模拟" },
  {
    s: "#sec-card-experiment .sim-container > p",
    t: '点击"洗牌并计数"来模拟洗牌并统计连续相同花色的对数。多次运行可以观察均值的收敛过程！',
  },
  { s: "#btnShuffle", t: "洗牌并计数" },
  { s: "#btnRun1000", t: "运行1,000次" },
  { s: "#btnResetSim", t: "重置" },
  { s: "#sec-card-experiment .stat-card:nth-child(1) .stat-label", t: "本次配对数" },
  { s: "#sec-card-experiment .stat-card:nth-child(2) .stat-label", t: "总试验次数" },
  { s: "#sec-card-experiment .stat-card:nth-child(3) .stat-label", t: "运行均值" },
  { s: "#sec-card-experiment .stat-card:nth-child(4) .stat-label", t: "理论答案" },
  {
    s: '[data-target="proof-cards"]',
    t: '<span class="toggle-icon">&#9654;</span> 证明：答案恰好是12',
  },
  {
    s: "#proof-cards .proof-step:nth-child(1) .step-body",
    t: '<p><strong>定义指示变量。</strong>设 \\(X_i\\) 为第 \\(i\\) 张牌的花色。定义 \\(Y_i = \\mathbf{1}\\{X_i = X_{i+1}\\}\\)，其中 \\(i = 1, \\ldots, 51\\)。</p><p>连续相同花色的总对数为 \\(Y = \\sum_{i=1}^{51} Y_i\\)。</p>',
  },
  {
    s: "#proof-cards .proof-step:nth-child(2) .step-body",
    t: '<p><strong>计算每个概率。</strong>对于任意位置 \\(i\\)，一旦第 \\(i\\) 张牌的花色确定，剩余51张牌中有12张是同花色的：</p><p>\\[\\Pr[Y_i = 1] = \\Pr[X_i = X_{i+1}] = \\frac{13 - 1}{52 - 1} = \\frac{12}{51}\\]</p>',
  },
  {
    s: "#proof-cards .proof-step:nth-child(3) .step-body",
    t: '<p><strong>应用期望的线性性。</strong>我们<em>不需要</em> \\(Y_i\\) 之间的独立性！</p><p>\\[\\mathbb{E}[Y] = \\sum_{i=1}^{51} \\mathbb{E}[Y_i] = 51 \\cdot \\frac{12}{51} = 12 \\quad \\blacksquare\\]</p>',
  },
  {
    s: "#proof-cards .insight-box",
    t: '<strong>关键洞察：</strong>这可以推广！对于一副 \\(4n\\) 张牌（每种花色 \\(n\\) 张）的牌组，连续相同花色对的期望数为 \\(\\frac{(4n-1)(n-1)}{4n-1} = n-1\\)。',
  },

  // --- What is Randomized ---
  { s: "#sec-what-is-randomized .section-title", t: "什么是随机算法？" },
  {
    s: "#sec-what-is-randomized .concept-box p",
    t: '<strong>随机算法</strong>是一种行为不仅取决于输入 \\(x\\)，还取决于随机比特 \\(R \\in \\{0,1\\}^*\\) 的算法。',
  },
  { s: "#sec-what-is-randomized .two-col .col-card:nth-child(1) h3", t: "确定性算法" },
  { s: "#sec-what-is-randomized .two-col .col-card:nth-child(1) > p", t: "相同输入 &rarr; 始终相同的输出和运行时间。" },
  { s: "#sec-what-is-randomized .two-col .col-card:nth-child(2) h3", t: "随机算法" },
  { s: "#sec-what-is-randomized .two-col .col-card:nth-child(2) > p", t: "相同输入 &rarr; 输出和/或运行时间可能<em>不同</em>。" },
  {
    s: "#sec-what-is-randomized .callout",
    t: '<strong>等价视角：</strong>随机算法是<em>确定性算法上的概率分布</em>。首先随机选取 \\(R\\)，然后在输入 \\(x\\) 上运行确定性算法 \\(A_R\\)。',
  },
  { s: "#sec-what-is-randomized > h3", t: "分析类型" },
  {
    s: ".styled-table thead th:nth-child(1)", t: "分析类型",
  },
  {
    s: ".styled-table thead th:nth-child(2)", t: "公式",
  },
  {
    s: ".styled-table thead th:nth-child(3)", t: "什么是随机的？",
  },
  {
    s: ".styled-table tbody tr:nth-child(1) td:nth-child(1)",
    t: "<strong>最坏情况</strong>",
  },
  { s: ".styled-table tbody tr:nth-child(1) td:nth-child(3)", t: "无随机性" },
  {
    s: ".styled-table tbody tr:nth-child(2) td:nth-child(1)",
    t: "<strong>期望（本课程！）</strong>",
  },
  {
    s: ".styled-table tbody tr:nth-child(2) td:nth-child(3)",
    t: "算法使用随机比特 \\(R\\)",
  },
  {
    s: ".styled-table tbody tr:nth-child(3) td:nth-child(1)",
    t: "<strong>平均情况</strong>",
  },
  { s: ".styled-table tbody tr:nth-child(3) td:nth-child(3)", t: "输入 \\(x\\) 是随机的" },
  {
    s: ".styled-table tbody tr:nth-child(4) td:nth-child(1)",
    t: "<strong>均摊</strong>",
  },
  { s: ".styled-table tbody tr:nth-child(4) td:nth-child(3)", t: "输入序列" },
  { s: ".why-card.pro h4", t: "为什么使用随机化？" },
  {
    s: ".why-card.pro ul",
    t: "<li>避免病态极端情况</li><li>更简单、更快的算法</li><li>避免可预测的结果</li><li>密码学与隐私保护</li><li>打破平局/不可能性结果</li>",
  },
  { s: ".why-card.con h4", t: "缺点" },
  {
    s: ".why-card.con ul",
    t: "<li>行为不确定</li><li>随机比特不是唾手可得的！</li><li>差的随机比特 &rarr; 差的输出</li>",
  },

  // --- Las Vegas vs Monte Carlo ---
  { s: "#sec-lv-mc .section-title", t: "拉斯维加斯算法 vs 蒙特卡罗算法" },
  { s: ".lv-card h3", t: "拉斯维加斯" },
  { s: ".lv-card .badge", t: "始终正确" },
  {
    s: ".lv-card > p",
    t: "输出<strong>始终正确</strong>，但运行时间仅在<em>期望意义下</em>有界。",
  },
  {
    s: ".lv-card .example-mini",
    t: '<strong>示例：</strong>在 \\(\\{1,\\ldots,n\\}\\) 的排列中查找偶数。随机选取一个索引——期望 \\(O(1)\\) 时间，始终正确。',
  },
  { s: ".mc-card h3", t: "蒙特卡罗" },
  { s: ".mc-card .badge", t: "时间有界" },
  {
    s: ".mc-card > p",
    t: "运行时间<strong>始终有界</strong>，但输出仅<em>以高概率</em>正确。",
  },
  {
    s: ".mc-card .example-mini",
    t: '<strong>示例：</strong>随机检查100个索引是否有偶数——最坏情况 \\(O(1)\\) 时间，成功概率 \\(\\geq 0.99\\)。',
  },
  { s: ".interactive-compare > h3", t: "探索：偶数查找" },
  {
    s: ".interactive-compare > p",
    t: '数组 \\(A\\) 的大小为 \\(n\\)，包含 \\(1\\) 到 \\(n\\) 的所有数字。找到一个存放偶数的索引。',
  },
  { s: '[data-tab="tab-det"]', t: "确定性" },
  { s: '[data-tab="tab-lv"]', t: "拉斯维加斯" },
  { s: '[data-tab="tab-mc"]', t: "蒙特卡罗" },
  {
    s: "#tab-det p",
    t: '<strong>最坏情况：</strong>\\(\\Omega(n)\\)。对手可以把所有偶数放在末尾。你必须线性扫描。',
  },
  {
    s: "#tab-lv p",
    t: '<strong>期望时间：</strong>\\(O(1)\\)。随机选取索引；一半的条目是偶数，所以期望2次尝试。',
  },
  {
    s: "#tab-mc p",
    t: '<strong>最坏情况时间：</strong>\\(O(1)\\)。尝试100个随机索引。失败概率 \\(\\leq (1/2)^{100}\\)。',
  },

  // --- QuickSort ---
  { s: "#sec-quicksort .section-title", t: "随机快速排序" },
  { s: ".algo-card h3", t: "算法：快速排序" },
  { s: ".algo-facts .fact-pill.green", t: "始终正确（拉斯维加斯）" },
  { s: ".algo-facts .fact-pill.blue", t: "期望 \\(O(n \\log n)\\)" },
  { s: ".algo-facts .fact-pill.red", t: "最坏情况 \\(O(n^2)\\)" },
  {
    s: '[data-target="proof-qs-recurrence"]',
    t: '<span class="toggle-icon">&#9654;</span> 证明：通过递推求解期望运行时间',
  },
  {
    s: "#proof-qs-recurrence .proof-step:nth-child(1) .step-body",
    t: '<p><strong>建立递推。</strong>设 \\(T(n)\\) 为期望运行时间。以 \\(1/n\\) 的概率选取第 \\(k\\) 大的元素作为基准：</p><p>\\[T(n) = cn + \\frac{1}{n}\\sum_{k=1}^{n}\\bigl(T(k-1) + T(n-k)\\bigr) = cn + \\frac{2}{n}\\sum_{k=0}^{n-1}T(k)\\]</p>',
  },
  {
    s: "#proof-qs-recurrence .proof-step:nth-child(2) .step-body",
    t: '<p><strong>转化为微分方程。</strong>利用求和可近似积分的性质，考虑连续版本：</p><p>\\[T(x) = cx + \\frac{2}{x}\\int_0^x T(u)\\,du\\]</p><p>令 \\(F(x) = \\int_0^x T(u)\\,du\\)，则 \\(F\'(x) = T(x)\\)。得到：</p><p>\\[F\'(x) = cx + \\frac{2}{x}F(x)\\]</p>',
  },
  {
    s: "#proof-qs-recurrence .proof-step:nth-child(3) .step-body",
    t: '<p><strong>求解常微分方程。</strong>两边除以 \\(x^2\\)：</p><p>\\[\\frac{F\'(x)}{x^2} - \\frac{2F(x)}{x^3} = \\frac{c}{x}\\]</p><p>识别左边为 \\(\\frac{d}{dx}\\!\\left[\\frac{F(x)}{x^2}\\right]\\)。积分得：</p><p>\\[\\frac{F(x)}{x^2} = c\\ln x + C \\implies F(x) = cx^2 \\ln x + Cx^2\\]</p>',
  },
  {
    s: "#proof-qs-recurrence .proof-step:nth-child(4) .step-body",
    t: '<p><strong>恢复 \\(T\\)。</strong></p><p>\\[T(x) = F\'(x) = 2cx\\ln x + (2C+c)x = O(x\\log x)\\]</p><p>因此 \\(T(n) = O(n\\log n)\\)。\\(\\blacksquare\\)</p>',
  },
  { s: ".visual-sorter h3", t: "可视化：随机快速排序" },
  {
    s: ".visual-sorter > p",
    t: '观察基准元素的选择如何影响划分过程。点击"步进"推进一层递归，或点击"自动排序"播放动画。',
  },
  { s: "#btnNewArray", t: "新数组" },
  { s: "#btnStepSort", t: "步进" },
  { s: "#btnAutoSort", t: "自动排序" },

  // --- Comparisons ---
  { s: "#sec-comparisons .section-title", t: "通过期望线性性计数比较次数" },
  {
    s: "#sec-comparisons .concept-box p",
    t: "无需求解递推式，我们可以利用<em>指示随机变量</em>优雅地计算<em>期望比较次数</em>。",
  },
  {
    s: '[data-target="proof-comparisons"]',
    t: '<span class="toggle-icon">&#9654;</span> 证明：\\(C(n) \\leq 2n\\ln n\\)',
  },
  {
    s: "#proof-comparisons .proof-step:nth-child(1) .step-body",
    t: '<p><strong>建立指示变量。</strong>设 \\(a_1 < a_2 < \\cdots < a_n\\) 为已排序的元素。定义 \\(X_{ij} \\in \\{0,1\\}\\) 为 \\(a_i\\) 与 \\(a_j\\) 是否被比较过的指示变量。</p><p>\\[C(n) = \\mathbb{E}\\!\\left[\\sum_{i=1}^{n-1}\\sum_{j=i+1}^{n} X_{ij}\\right] = \\sum_{i<j} \\Pr[a_i \\text{ 与 } a_j \\text{ 被比较}]\\]</p>',
  },
  {
    s: "#proof-comparisons .proof-step:nth-child(2) .step-body",
    t: '<p><strong>核心洞察：</strong>\\(a_i\\) 与 \\(a_j\\) 被比较<em>当且仅当</em>集合 \\(\\{a_i, a_{i+1}, \\ldots, a_j\\}\\) 中第一个被选为基准的元素是 \\(a_i\\) 或 \\(a_j\\) 本身。</p><p>如果先选中了某个 \\(a_k\\)（\\(i < k < j\\)）作为基准，则 \\(a_i\\) 和 \\(a_j\\) 将被分到不同子数组中，永远不会再相遇。</p><p>\\[\\Pr[a_i \\text{ 与 } a_j \\text{ 被比较}] = \\frac{2}{j - i + 1}\\]</p>',
  },
  {
    s: "#proof-comparisons .proof-step:nth-child(3) .step-body",
    t: '<p><strong>求和。</strong>令 \\(k = j - i\\)：</p><p>\\[C(n) = \\sum_{i=1}^{n-1}\\sum_{j=i+1}^{n} \\frac{2}{j-i+1} = 2\\sum_{i=1}^{n-1}\\sum_{k=1}^{n-i}\\frac{1}{k+1}\\]</p><p>利用调和数 \\(H_k = \\sum_{j=1}^k \\frac{1}{j} \\leq \\ln k + 1\\)：</p><p>\\[C(n) = 2\\sum_{i=1}^{n-1}(H_{n-i+1} - 1) = 2\\sum_{m=2}^{n}(H_m - 1) \\leq 2\\sum_{m=2}^{n}\\ln m \\leq 2n\\ln n\\]</p><p>\\(\\blacksquare\\)</p>',
  },
  {
    s: "#sec-comparisons .insight-box",
    t: '<strong>这个证明为什么优雅：</strong>无需求解递推式！只需定义恰当的指示变量，计算每个变量的简单概率，然后求和。这就是<strong>期望线性性</strong>的力量。',
  },

  // --- Probability Toolkit ---
  { s: "#sec-prob-facts .section-title", t: "概率工具箱" },
  {
    s: "#sec-prob-facts > p",
    t: "这些基本事实在整门课程中反复使用。点击每张卡片查看详情。",
  },
  { s: ".toolkit-card:nth-child(1) .toolkit-front h4", t: "尾和公式" },
  {
    s: ".toolkit-card:nth-child(1) .toolkit-front p",
    t: "计算非负整数随机变量 \\(\\mathbb{E}[X]\\) 的另一种方式。",
  },
  { s: ".toolkit-card:nth-child(1) .flip-hint", t: "点击翻转" },
  { s: ".toolkit-card:nth-child(2) .toolkit-front h4", t: "期望的线性性" },
  {
    s: ".toolkit-card:nth-child(2) .toolkit-front p",
    t: "本章最重要的工具。",
  },
  { s: ".toolkit-card:nth-child(2) .flip-hint", t: "点击翻转" },
  { s: ".toolkit-card:nth-child(3) .toolkit-front h4", t: "方差公式" },
  {
    s: ".toolkit-card:nth-child(3) .toolkit-front p",
    t: "随机变量的离散程度有多大？",
  },
  { s: ".toolkit-card:nth-child(3) .flip-hint", t: "点击翻转" },
  { s: ".toolkit-card:nth-child(4) .toolkit-front h4", t: "延森不等式" },
  {
    s: ".toolkit-card:nth-child(4) .toolkit-front p",
    t: "凸函数与期望。",
  },
  { s: ".toolkit-card:nth-child(4) .flip-hint", t: "点击翻转" },
  { s: ".toolkit-card:nth-child(5) .toolkit-front h4", t: "伯努利与二项分布" },
  {
    s: ".toolkit-card:nth-child(5) .toolkit-front p",
    t: "离散概率的基础构件。",
  },
  { s: ".toolkit-card:nth-child(5) .flip-hint", t: "点击翻转" },
  { s: ".toolkit-card:nth-child(6) .toolkit-front h4", t: "指示随机变量" },
  {
    s: ".toolkit-card:nth-child(6) .toolkit-front p",
    t: "本章大多数证明背后的技巧。",
  },
  { s: ".toolkit-card:nth-child(6) .flip-hint", t: "点击翻转" },

  // Toolkit backs
  {
    s: ".toolkit-card:nth-child(2) .toolkit-back",
    t: '<p>\\[\\mathbb{E}[aX + bY] = a\\,\\mathbb{E}[X] + b\\,\\mathbb{E}[Y]\\]</p><p>推广到任意求和：\\(\\mathbb{E}\\!\\left[\\sum_i X_i\\right] = \\sum_i \\mathbb{E}[X_i]\\)。</p><p><strong>不需要独立性！</strong></p>',
  },
  {
    s: ".toolkit-card:nth-child(3) .toolkit-back",
    t: '<p>\\[\\text{Var}[X] = \\mathbb{E}[X^2] - \\mathbb{E}[X]^2\\]</p><p>\\[\\text{Var}[aX] = a^2 \\text{Var}[X]\\]</p><p>若 \\(X_1,\\ldots,X_n\\) 两两独立：</p><p>\\[\\text{Var}\\!\\left[\\sum_i X_i\\right] = \\sum_i \\text{Var}[X_i]\\]</p>',
  },
  {
    s: ".toolkit-card:nth-child(6) .toolkit-back",
    t: '<p>对于事件 \\(E\\)，定义 \\(\\mathbf{1}_E\\)：</p><p>\\[\\mathbf{1}_E = \\begin{cases} 1 & \\text{若 } E \\text{ 发生} \\\\ 0 & \\text{否则}\\end{cases}\\]</p><p>\\(\\mathbb{E}[\\mathbf{1}_E] = \\Pr[E]\\)。与期望线性性结合，可计算"好事件"的期望数量！</p>',
  },

  // --- Tutorial ---
  { s: "#sec-tutorial .section-title", t: "习题练习" },
  {
    s: "#sec-tutorial > p",
    t: "先自行尝试每道题，再查看解答。先独立思考！",
  },
  { s: "#sec-tutorial .problem-card:nth-child(3) .problem-num", t: "题目 1" },
  { s: "#sec-tutorial .problem-card:nth-child(4) .problem-num", t: "题目 2" },
  { s: "#sec-tutorial .problem-card:nth-child(5) .problem-num", t: "题目 3" },
  { s: "#sec-tutorial .problem-card:nth-child(6) .problem-num", t: "题目 4" },
  { s: "#sec-tutorial .problem-card:nth-child(7) .problem-num", t: "题目 5" },
  { s: "#sec-tutorial .problem-card:nth-child(8) .problem-num", t: "题目 6" },
  { s: "#sec-tutorial .problem-card:nth-child(9) .problem-num", t: "题目 7" },
  { s: "#sec-tutorial .problem-card:nth-child(10) .problem-num", t: "题目 8" },
  { s: "#sec-tutorial .problem-card:nth-child(11) .problem-num", t: "题目 9" },
  { s: "#sec-tutorial .problem-card:nth-child(12) .problem-num", t: "题目 10" },
  { s: ".problem-tag.warm-up", i: 0, t: "热身" },
  { s: ".problem-tag.warm-up", i: 1, t: "热身" },
  { s: ".problem-tag.warm-up", i: 2, t: "热身" },
  { s: ".problem-tag.warm-up", i: 3, t: "热身" },
  { s: ".problem-tag.warm-up", i: 4, t: "热身" },
  { s: ".problem-tag.problem-solving", i: 0, t: "解题" },
  { s: ".problem-tag.problem-solving", i: 1, t: "解题" },
  { s: ".problem-tag.problem-solving", i: 2, t: "解题" },
  { s: ".problem-tag.problem-solving", i: 3, t: "解题" },
  { s: ".problem-tag.advanced", t: "进阶" },
  {
    s: "#sec-tutorial .problem-card:nth-child(3) .problem-body p",
    t: '考虑一副 \\(4n\\) 张牌，每种花色 \\(n\\) 张。均匀随机洗牌后，连续相同花色对的期望数量是多少？',
  },
  {
    s: "#sec-tutorial .problem-card:nth-child(4) .problem-body p",
    t: '计算机随机生成一个2024位的二进制串。连续出现3个1的期望次数是多少？',
  },
  {
    s: "#sec-tutorial .problem-card:nth-child(5) .problem-body p",
    t: '证明 \\(\\{1,\\ldots,n\\}\\) 的均匀随机排列的不动点期望数为1。方差是多少？',
  },
  {
    s: "#sec-tutorial .problem-card:nth-child(6) .problem-body p",
    t: '(1) 给出一个定义在 \\([0, \\infty)\\) 上且 \\(\\mathbb{E}[X] = \\infty\\) 的随机变量 \\(X\\)。(2) 给出一个定义在 \\(\\mathbb{N}\\) 上且 \\(\\mathbb{E}[X] = \\infty\\) 的随机变量 \\(X\\)。',
  },
  {
    s: "#sec-tutorial .problem-card:nth-child(7) .problem-body p",
    t: '证明课上的结论：若 \\(X\\) 的方差有限，则 \\(\\text{Var}[X] = \\mathbb{E}[X^2] - \\mathbb{E}[X]^2\\)。',
  },
  {
    s: "#sec-tutorial .problem-card:nth-child(8) .problem-body p",
    t: '证明课上的结论：若 \\(X\\) 取值于 \\(\\mathbb{N} = \\{0, 1, 2, \\ldots\\}\\) 且 \\(\\mathbb{E}[X]\\) 有限，则 \\(\\mathbb{E}[X] = \\sum_{n=1}^{\\infty} \\Pr[X \\geq n]\\)。',
  },
  {
    s: "#sec-tutorial .problem-card:nth-child(9) .problem-body p",
    t: '你有一枚偏置硬币，其偏置 \\(p = \\Pr[\\text{正面}] \\in (0,1)\\) 未知。仅使用这枚硬币，生成一次公平的抛硬币。期望需要多少次偏置抛掷？',
  },
  {
    s: "#sec-tutorial .problem-card:nth-child(10) .problem-body p",
    t: '一只老鼠(M)想到达奶酪(C)。有3条路径：上方(2条边)、中间(3条边)、下方(4条边)。每条边以概率 \\(p\\) 独立地被猫占据。老鼠仍有路径到达奶酪的概率是多少？',
  },
  {
    s: "#sec-tutorial .problem-card:nth-child(11) .problem-body p",
    t: '索引 \\(i\\) 是数组 \\(A\\) 的"前缀最大值"，如果 \\(A[i]\\) 是 \\(A[1],\\ldots,A[i]\\) 中最大的。若对 \\(A\\) 均匀随机排列，证明前缀最大值的期望数为 \\(H_n = O(\\log n)\\)。',
  },
  {
    s: "#sec-tutorial .problem-card:nth-child(12) .problem-body p",
    t: '设 \\(X_1,X_2,\\ldots\\) 为独立同分布的 Bernoulli(\\(p\\)) 随机变量，\\(Y_n = X_1 \\oplus X_2 \\oplus \\cdots \\oplus X_n\\)。求 \\(p_n = \\Pr[Y_n = 1]\\) 并证明其收敛到 \\(1/2\\)。',
  },
  {
    s: "#sol1",
    t: '<p><strong>答案：\\(n - 1\\)</strong></p><p>设 \\(Y_i = \\mathbf{1}\\{X_i = X_{i+1}\\}\\)。对于任意位置 \\(i\\)：</p><p>\\[\\Pr[X_i = X_{i+1}] = \\frac{n-1}{4n-1}\\]</p><p>由期望的线性性：</p><p>\\[\\mathbb{E}[Y] = (4n-1)\\cdot\\frac{n-1}{4n-1} = n - 1\\]</p><p>合理性检验：\\(n=13 \\Rightarrow 12\\)。&#10004;</p>',
  },
  {
    s: "#sol2",
    t: '<p><strong>答案：252.75</strong></p><p>定义 \\(Y_i = \\mathbf{1}\\{X_i = X_{i+1} = X_{i+2} = 1\\}\\)，\\(i=1,\\ldots,2022\\)。由各比特的独立性：</p><p>\\[\\mathbb{E}[Y_i] = \\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8}\\]</p><p>由线性性：\\(\\mathbb{E}[Y] = \\frac{2022}{8} = 252.75\\)。</p>',
  },
  {
    s: "#sol3",
    t: '<p><strong>期望 = 1，方差 = 1</strong></p><p>设 \\(X_i = \\mathbf{1}\\{\\pi(i)=i\\}\\)。则 \\(\\Pr[X_i=1]=\\frac{1}{n}\\)，故 \\(\\mathbb{E}[X]=\\sum_{i=1}^n \\frac{1}{n} = 1\\)。</p><p>方差：\\(\\text{Var}[X] = \\mathbb{E}[X^2] - 1\\)。展开 \\(X^2 = (\\sum_i X_i)^2\\)：</p><p>\\[\\mathbb{E}[X^2] = \\sum_i \\mathbb{E}[X_i] + \\sum_{i\\neq j}\\Pr[\\pi(i)=i \\text{ 且 } \\pi(j)=j]\\]</p><p>\\[= 1 + n(n-1)\\cdot\\frac{1}{n(n-1)} = 1 + 1 = 2\\]</p><p>所以 \\(\\text{Var}[X] = 2 - 1 = 1\\)。</p>',
  },
  {
    s: "#sol4",
    t: '<p><strong>(1) 连续情形：</strong>概率密度函数为 \\(f(x) = \\frac{2}{\\pi} \\cdot \\frac{1}{x^2 + 1}\\) 的随机变量（柯西分布）。因为 \\(\\int_0^\\infty \\frac{2x}{\\pi(x^2+1)}\\,dx\\) 发散，所以 \\(\\mathbb{E}[X] = \\infty\\)。</p><p><strong>(2) 离散情形：</strong>概率质量函数为 \\(p(n) = \\frac{6}{\\pi^2} \\cdot \\frac{1}{(n+1)^2}\\) 的随机变量。因为 \\(\\sum_{n=0}^{\\infty} \\frac{n}{(n+1)^2}\\) 发散，所以 \\(\\mathbb{E}[X] = \\infty\\)。</p>',
  },
  {
    s: "#sol5",
    t: '<p><strong>证明：</strong>设 \\(\\mu = \\mathbb{E}[X]\\)。根据定义：</p><p>\\[\\text{Var}[X] = \\mathbb{E}[(X - \\mu)^2] = \\mathbb{E}[X^2 - 2\\mu X + \\mu^2]\\]</p><p>应用期望的线性性：</p><p>\\[= \\mathbb{E}[X^2] - 2\\mu\\,\\mathbb{E}[X] + \\mu^2 = \\mathbb{E}[X^2] - 2\\mu^2 + \\mu^2 = \\mathbb{E}[X^2] - \\mu^2\\]</p><p>\\[= \\mathbb{E}[X^2] - \\mathbb{E}[X]^2 \\quad \\blacksquare\\]</p>',
  },
  {
    s: "#sol6",
    t: '<p><strong>证明（交换求和顺序）：</strong></p><p>\\[\\sum_{n=1}^{\\infty} \\Pr[X \\geq n] = \\sum_{n=1}^{\\infty} \\sum_{k=n}^{\\infty} \\Pr[X = k] = \\sum_{k=1}^{\\infty} \\sum_{n=1}^{k} \\Pr[X = k]\\]</p><p>内层求和有 \\(k\\) 个相同的项：</p><p>\\[= \\sum_{k=1}^{\\infty} k \\cdot \\Pr[X = k] = \\mathbb{E}[X] \\quad \\blacksquare\\]</p><p>交换求和的合理性由所有项非负且 \\(\\mathbb{E}[X]\\) 有限来保证。</p>',
  },
  {
    s: "#sol7",
    t: '<p><strong>冯·诺伊曼技巧：</strong></p><ol><li>抛偏置硬币两次。</li><li>若为正反 &rarr; 输出正面。若为反正 &rarr; 输出反面。</li><li>若为正正或反反 &rarr; 丢弃，重新开始。</li></ol><p>原理：\\(\\Pr[\\text{正反}] = p(1-p) = (1-p)p = \\Pr[\\text{反正}]\\)，两个结果等概率。</p><p><strong>期望抛掷次数：</strong>每次尝试成功概率为 \\(2p(1-p)\\)。期望尝试次数 = \\(\\frac{1}{2p(1-p)}\\)，每次尝试用2次抛掷：</p><p>\\[\\text{期望抛掷次数} = \\frac{2}{2p(1-p)} = \\frac{1}{p(1-p)}\\]</p>',
  },
  {
    s: "#sol8",
    t: '<p>路径通畅当且仅当其<em>所有</em>边都无猫。老鼠成功当且仅当<em>至少一条</em>路径通畅。</p><p>\\[\\Pr[\\text{有路}] = 1 - \\Pr[\\text{无路}]\\]</p><p>\\[= 1 - \\Pr[\\text{上方阻断}]\\cdot\\Pr[\\text{中间阻断}]\\cdot\\Pr[\\text{下方阻断}]\\]</p><p>\\[= 1 - \\bigl(1-(1-p)^2\\bigr)\\bigl(1-(1-p)^3\\bigr)\\bigl(1-(1-p)^4\\bigr)\\]</p><p><strong>(b) 部分：</strong>长度 \\(\\leq 3\\) 的路径：仅上方和中间。答案：\\(1 - (1-(1-p)^2)(1-(1-p)^3)\\)。</p><p><strong>(c) 部分：</strong>猫的期望数 = \\(9p\\)（9条边，每条有猫的概率为 \\(p\\)，由线性性得出）。</p>',
  },
  {
    s: "#sol9",
    t: '<p><strong>(a)</strong> 若 \\(A\\) 已排序（递增），每个元素都是前缀最大值，所以 \\(\\text{pf}(A) = n\\)。</p><p><strong>(b)</strong> 设 \\(X_i = \\mathbf{1}\\{B[i]\\text{ 是前缀最大值}\\}\\)。第 \\(i\\) 个元素是前缀最大值当且仅当它是前 \\(i\\) 个元素中最大的。由对称性：</p><p>\\[\\Pr[X_i = 1] = \\frac{1}{i}\\]</p><p>由期望的线性性：</p><p>\\[\\mathbb{E}[\\text{pf}(B)] = \\sum_{i=1}^n \\frac{1}{i} = H_n = O(\\log n) \\quad \\blacksquare\\]</p>',
  },
  {
    s: "#sol10",
    t: '<p><strong>递推：</strong>\\(p_{n+1} = (1-p)\\,p_n + p\\,(1-p_n) = (1-2p)\\,p_n + p\\)</p><p><strong>求解：</strong>令 \\(q_n = p_n - 1/2\\)。则 \\(q_{n+1} = (1-2p)\\,q_n\\)，故 \\(q_n = (1-2p)^n \\cdot q_0\\)，其中 \\(q_0 = -1/2\\)。</p><p>\\[\\boxed{p_n = \\frac{1}{2}\\bigl(1 - (1-2p)^n\\bigr)}\\]</p><p>由于 \\(p\\in(0,1)\\) 时 \\(|1-2p| < 1\\)，所以<strong>以指数速度</strong>收敛到 \\(1/2\\)。</p>',
  },

];

// ===================== MATH PAGE TRANSLATIONS =====================
var MATH_T = [
  // --- Hero ---
  { s: ".hero-course", t: "COMPX270 — 第一章补充" },
  { s: "#sec-hero h1", t: "数学基础" },
  {
    s: "#sec-hero .hero-subtitle",
    t: "第一章中使用的每一个符号、表示法和概念——从零开始讲解，配有示例和即时练习。",
  },
  { s: '.back-bar a[href="chapter1-study.html"]', t: "&larr; 返回第一章学习指南" },
  { s: '.back-bar a[href="../../../index.html"]', t: "&larr; 课程主页" },
  { s: ".back-bar .page-title-bar", t: "数学基础" },

  // --- TOC sidebar ---
  { s: '.toc-sidebar .toc-group', i: 0, t: "符号表示" },
  { s: '.toc-sidebar .toc-group', i: 1, t: "概率论" },
  { s: '.toc-sidebar .toc-group', i: 2, t: "概率分布" },
  { s: '.toc-sidebar .toc-group', i: 3, t: "工具" },
  { s: '[href="#sec-sets"]', t: "集合与数系" },
  { s: '[href="#sec-notation"]', t: "求和与乘积" },
  { s: '[href="#sec-bigo"]', t: "大O表示法" },
  { s: '[href="#sec-log"]', t: "对数" },
  { s: '[href="#sec-prob-basics"]', t: "概率基础" },
  { s: '[href="#sec-rv"]', t: "随机变量" },
  { s: '[href="#sec-expectation"]', t: "期望" },
  { s: '[href="#sec-linearity"]', t: "期望的线性性" },
  { s: '[href="#sec-variance"]', t: "方差" },
  { s: '[href="#sec-indicator"]', t: "指示变量" },
  { s: '[href="#sec-independence"]', t: "独立性" },
  { s: '[href="#sec-bernoulli"]', t: "伯努利与二项分布" },
  { s: '[href="#sec-geometric"]', t: "几何分布" },
  { s: '[href="#sec-tailsum"]', t: "尾和公式" },
  { s: '[href="#sec-harmonic"]', t: "调和数" },
  { s: '[href="#sec-jensen"]', t: "延森不等式" },
  { s: '[href="#sec-permutations"]', t: "排列" },
  { s: '[href="#sec-recurrence"]', t: "递推与微分方程" },

  // --- Sets ---
  { s: "#sec-sets .section-title", t: "集合与数系" },
  {
    s: "#sec-sets .def-box:nth-of-type(1) .def-label",
    t: "定义 — 集合",
  },
  {
    s: "#sec-sets .def-box:nth-of-type(1) p",
    t: '<strong>集合</strong>是不同对象的无序集合。我们用 \\(x \\in S\\) 表示"\\(x\\) 是 \\(S\\) 的元素"，用 \\(x \\notin S\\) 表示相反。',
  },
  { s: "#sec-sets h3", t: "标准数系" },

  // Sets symbol table — "Meaning" column
  { s: "#sec-sets .symbol-grid:nth-of-type(1) .sym-cell:nth-child(6)", t: "包含元素1、2、3的集合" },
  { s: "#sec-sets .symbol-grid:nth-of-type(1) .sym-cell:nth-child(9)", t: '"属于" — 例如 \\(3 \\in \\{1,2,3\\}\\)' },
  { s: "#sec-sets .symbol-grid:nth-of-type(1) .sym-cell:nth-child(12)", t: '"不属于"' },
  { s: "#sec-sets .symbol-grid:nth-of-type(1) .sym-cell:nth-child(15)", t: '"是子集" — 左边每个元素都在右边' },
  { s: "#sec-sets .symbol-grid:nth-of-type(1) .sym-cell:nth-child(18)", t: "空集（不含任何元素）" },
  { s: "#sec-sets .symbol-grid:nth-of-type(1) .sym-cell:nth-child(21)", t: "基数 — \\(S\\) 中元素的个数" },
  { s: "#sec-sets .symbol-grid:nth-of-type(1) .sym-cell:nth-child(24)", t: "所有有限长二进制串（用于随机比特）" },

  // Number systems meanings
  { s: "#sec-sets .symbol-grid:nth-of-type(2) .sym-cell:nth-child(6)", t: "自然数 \\(\\{0, 1, 2, 3, \\ldots\\}\\)" },
  { s: "#sec-sets .symbol-grid:nth-of-type(2) .sym-cell:nth-child(9)", t: "整数 \\(\\{\\ldots, -2, -1, 0, 1, 2, \\ldots\\}\\)" },
  { s: "#sec-sets .symbol-grid:nth-of-type(2) .sym-cell:nth-child(12)", t: "实数（整个数轴）" },
  { s: "#sec-sets .symbol-grid:nth-of-type(2) .sym-cell:nth-child(15)", t: "闭区间：满足 \\(0 \\leq x \\leq 1\\) 的所有实数 \\(x\\)" },
  { s: "#sec-sets .symbol-grid:nth-of-type(2) .sym-cell:nth-child(18)", t: "开区间：满足 \\(0 < x < 1\\) 的所有实数 \\(x\\)" },

  // --- Summation ---
  { s: "#sec-notation .section-title", t: "求和与乘积" },
  { s: "#sec-notation .def-box:nth-of-type(1) .def-label", t: "定义 — 求和" },
  {
    s: "#sec-notation .def-box:nth-of-type(1) p",
    i: 0,
    t: '<strong>求和记号</strong> \\(\\displaystyle\\sum_{i=a}^{b} f(i)\\) 的意思是"将 \\(f(i)\\) 从整数 \\(a\\) 加到 \\(b\\)"：',
  },
  { s: "#sec-notation .def-box.example-box .def-label", t: "示例" },
  { s: "#sec-notation h3", t: "第一章中使用的关键求和公式" },

  // Summation table meanings
  { s: "#sec-notation .symbol-grid .sym-cell:nth-child(5)", t: "计数" },
  { s: "#sec-notation .symbol-grid .sym-cell:nth-child(8)", t: "等差" },
  { s: "#sec-notation .symbol-grid .sym-cell:nth-child(11)", t: "调和 (\\(H_n\\))" },
  { s: "#sec-notation .symbol-grid .sym-cell:nth-child(14)", t: "几何" },

  { s: "#sec-notation .def-box:nth-of-type(3) .def-label", t: "定义 — 双重求和" },
  {
    s: "#sec-notation .def-box:nth-of-type(3) p",
    i: 0,
    t: "当有两个下标时，我们对两者都进行迭代。快速排序分析中使用的形式：",
  },
  {
    s: "#sec-notation .def-box:nth-of-type(3) p",
    i: 1,
    t: '意思是：对于 \\(i\\) 从1到 \\(n{-}1\\) 的每个值，对于 \\(j\\) 从 \\(i{+}1\\) 到 \\(n\\) 的每个值，将 \\(f(i,j)\\) 加起来。它对所有满足 \\(i < j\\) 的 \\((i,j)\\) 对求和。',
  },

  // --- Big-O ---
  { s: "#sec-bigo .section-title", t: "大O表示法（渐近分析）" },
  {
    s: "#sec-bigo .def-box:nth-of-type(1) .def-label",
    t: "定义 — \\(O(\\cdot)\\)、\\(\\Omega(\\cdot)\\)、\\(\\Theta(\\cdot)\\)",
  },
  { s: "#sec-bigo .def-box.example-box .def-label", t: "第一章中的示例" },
  { s: "#sec-bigo h3", t: "常见增长率（从慢到快）" },

  // Big-O table names
  { s: "#sec-bigo .symbol-grid .sym-cell:nth-child(5)", t: "常数" },
  { s: "#sec-bigo .symbol-grid .sym-cell:nth-child(8)", t: "对数" },
  { s: "#sec-bigo .symbol-grid .sym-cell:nth-child(11)", t: "线性" },
  { s: "#sec-bigo .symbol-grid .sym-cell:nth-child(14)", t: "线性对数" },
  { s: "#sec-bigo .symbol-grid .sym-cell:nth-child(17)", t: "二次" },

  // --- Logarithms ---
  { s: "#sec-log .section-title", t: "对数" },
  { s: "#sec-log .def-box:nth-of-type(1) .def-label", t: "定义" },
  { s: "#sec-log h3", t: "关键性质" },

  // Log table meanings
  { s: "#sec-log .symbol-grid .sym-cell:nth-child(4)", t: "乘法" },
  { s: "#sec-log .symbol-grid .sym-cell:nth-child(7)", t: "除法" },
  { s: "#sec-log .symbol-grid .sym-cell:nth-child(10)", t: "幂" },
  { s: "#sec-log .symbol-grid .sym-cell:nth-child(13)", t: "导数" },
  { s: "#sec-log .symbol-grid .sym-cell:nth-child(15)", t: "用于快速排序的ODE证明" },
  { s: "#sec-log .symbol-grid .sym-cell:nth-child(16)", t: "积分" },
  { s: "#sec-log .symbol-grid .sym-cell:nth-child(18)", t: '用于求解 \\(F\'(x)/x^2\\)' },

  // --- Probability Basics ---
  { s: "#sec-prob-basics .section-title", t: "概率基础" },
  { s: "#sec-prob-basics .def-box:nth-of-type(1) .def-label", t: "定义 — 概率" },
  {
    s: "#sec-prob-basics .def-box:nth-of-type(1) p",
    t: '<strong>概率</strong> \\(\\Pr[E]\\)（或 \\(\\mathbb{P}[E]\\)）是一个介于0和1之间的数，描述事件 \\(E\\) 发生的可能性：',
  },

  // Prob symbol meanings
  { s: "#sec-prob-basics .symbol-grid .sym-cell:nth-child(6)", t: "事件 \\(E\\) 的概率" },
  { s: "#sec-prob-basics .symbol-grid .sym-cell:nth-child(9)", t: "在 \\(B\\) 已发生条件下 \\(A\\) 的概率" },
  { s: "#sec-prob-basics .symbol-grid .sym-cell:nth-child(12)", t: "\\(A\\) 和 \\(B\\) 同时发生的概率" },
  { s: "#sec-prob-basics .symbol-grid .sym-cell:nth-child(15)", t: "\\(A\\) 和 \\(B\\) 至少有一个发生的概率" },

  { s: "#sec-prob-basics .def-box.example-box .def-label", t: "示例 — 第一章中的用法" },
  {
    s: "#sec-prob-basics .def-box.example-box p",
    t: '在扑克牌问题中：\\(\\Pr[X_i = X_{i+1}] = \\frac{12}{51}\\)。读作："第 \\(i\\) 张牌与第 \\(i{+}1\\) 张牌花色相同的概率是 \\(12/51\\)。"',
  },

  // --- Random Variables ---
  { s: "#sec-rv .section-title", t: "随机变量" },
  { s: "#sec-rv .def-box:nth-of-type(1) .def-label", t: "定义" },
  { s: "#sec-rv .def-box.example-box .def-label", t: "示例" },
  {
    s: "#sec-rv .def-box.example-box p",
    t: '在扑克牌问题中，\\(Y_i \\in \\{0, 1\\}\\) 是一个离散随机变量：当第 \\(i\\) 张和第 \\(i{+}1\\) 张牌花色相同时等于1，否则等于0。',
  },

  // --- Expectation ---
  { s: "#sec-expectation .section-title", t: "期望（期望值）" },
  { s: "#sec-expectation .def-box:nth-of-type(1) .def-label", t: "定义 — \\(\\mathbb{E}[X]\\)" },
  {
    s: "#sec-expectation .def-box:nth-of-type(1) p",
    i: 0,
    t: '离散随机变量 \\(X\\) 的<strong>期望值</strong>（或<strong>均值</strong>）是其可能取值的加权平均：',
  },
  {
    s: "#sec-expectation .def-box:nth-of-type(1) p",
    i: 2,
    t: '可以理解为多次重复实验后的"长期平均值"。',
  },

  { s: "#sec-expectation .symbol-grid .sym-cell:nth-child(6)", t: "\\(X\\) 的期望值" },
  { s: "#sec-expectation .symbol-grid .sym-cell:nth-child(9)", t: "关于 \\(R\\) 的随机性取期望" },
  {
    s: "#sec-expectation .symbol-grid .sym-cell:nth-child(12)",
    t: "\\(X\\) 的平方的期望值（不是 \\(\\mathbb{E}[X]^2\\)！）",
  },

  { s: "#sec-expectation .def-box.example-box .def-label", t: "示例 — 公平骰子" },
  {
    s: "#sec-expectation .def-box.example-box p",
    i: 0,
    t: '\\(\\mathbb{E}[X] = \\sum_{k=1}^{6} k \\cdot \\frac{1}{6} = \\frac{1+2+3+4+5+6}{6} = 3.5\\)',
  },
  {
    s: "#sec-expectation .def-box.example-box p",
    i: 1,
    t: "你永远掷不出3.5，但如果你掷很多次，平均值会收敛到3.5。",
  },
  { s: "#sec-expectation .def-box.warning-box .def-label", t: "注意" },
  {
    s: "#sec-expectation .def-box.warning-box p",
    t: '并非每个随机变量都有明确定义的期望！讲义中给出了 \\(\\Pr[X = k] = \\frac{1}{C(1+k^2)}\\) 在 \\(\\mathbb{Z}\\) 上的例子，由于求和发散，它没有期望。',
  },

  // --- Linearity ---
  { s: "#sec-linearity .section-title", t: "期望的线性性" },
  { s: "#sec-linearity .def-box.theorem-box .def-label", t: "定理 — 最重要的工具" },
  {
    s: "#sec-linearity .callout",
    t: '<strong>为什么如此强大？</strong>它允许我们将一个复杂的随机量分解为简单的部分。我们不需要知道各部分之间的关系——即使它们是相关的（非独立的）！第一章中的每一个主要证明都使用了这一性质。',
  },
  { s: "#sec-linearity .def-box.example-box .def-label", t: "示例 — 扑克牌" },

  // --- Variance ---
  { s: "#sec-variance .section-title", t: "方差" },
  { s: "#sec-variance .def-box:nth-of-type(1) .def-label", t: "定义 — \\(\\text{Var}[X]\\)" },
  { s: "#sec-variance h3", t: "方差的性质" },

  // Variance table
  { s: "#sec-variance .symbol-grid .sym-cell:nth-child(4)", t: "非负性" },
  { s: "#sec-variance .symbol-grid .sym-cell:nth-child(6)", t: "始终成立！" },
  { s: "#sec-variance .symbol-grid .sym-cell:nth-child(7)", t: "缩放" },
  { s: "#sec-variance .symbol-grid .sym-cell:nth-child(9)", t: "常数取平方" },
  { s: "#sec-variance .symbol-grid .sym-cell:nth-child(10)", t: "平移" },
  { s: "#sec-variance .symbol-grid .sym-cell:nth-child(12)", t: "加常数不改变离散程度" },
  { s: "#sec-variance .symbol-grid .sym-cell:nth-child(13)", t: "求和（独立）" },
  { s: "#sec-variance .symbol-grid .sym-cell:nth-child(15)", t: "需要两两独立！" },

  { s: "#sec-variance .def-box.warning-box .def-label", t: "与期望的关键区别" },
  {
    s: "#sec-variance .def-box.warning-box p",
    t: "期望的线性性<em>不需要独立性</em>。方差的求和等于各方差之和<em>仅</em>在变量（两两）独立时成立。这个区别很重要！",
  },

  // --- Indicator ---
  { s: "#sec-indicator .section-title", t: "指示随机变量" },
  { s: "#sec-indicator .def-box:nth-of-type(1) .def-label", t: "定义 — \\(\\mathbf{1}_E\\)" },
  {
    s: "#sec-indicator .callout",
    t: '<strong>三步法（几乎所有题目都用到）：</strong><ol><li>将计数 \\(X\\) 分解为指示变量之和：\\(X = \\sum_i \\mathbf{1}_{E_i}\\)</li><li>计算每个 \\(\\mathbb{E}[\\mathbf{1}_{E_i}] = \\Pr[E_i]\\)（对单个事件通常很简单）</li><li>应用线性性：\\(\\mathbb{E}[X] = \\sum_i \\Pr[E_i]\\)</li></ol>',
  },
  { s: "#sec-indicator .def-box.example-box .def-label", t: "第一章中的示例" },

  // --- Independence ---
  { s: "#sec-independence .section-title", t: "独立性" },
  { s: "#sec-independence .def-box:nth-of-type(1) .def-label", t: "定义" },
  { s: "#sec-independence .col-card:nth-child(1) h3", t: "相互独立" },
  { s: "#sec-independence .col-card:nth-child(2) h3", t: "两两独立" },
  {
    s: "#sec-independence .col-card:nth-child(2) p:last-child",
    t: "这比相互独立<em>弱</em>，但对方差的求和已经足够！",
  },
  { s: "#sec-independence .def-box.warning-box .def-label", t: "何时重要" },

  // --- Bernoulli ---
  { s: "#sec-bernoulli .section-title", t: "伯努利与二项分布" },
  { s: "#sec-bernoulli .col-card:nth-child(1) .badge", t: "单次试验" },
  { s: "#sec-bernoulli .col-card:nth-child(2) .badge", t: "\\(n\\) 次独立试验" },
  { s: "#sec-bernoulli .def-box.example-box .def-label", t: "i.i.d. 解释" },
  {
    s: "#sec-bernoulli .def-box.example-box p",
    t: "<strong>i.i.d.</strong> 代表<strong>独立同分布</strong>（independent and identically distributed）。即每个 \\(X_i\\) 有相同的分布，且知道某一个的值不会告诉你任何关于其他变量的信息。",
  },

  // --- Geometric ---
  { s: "#sec-geometric .section-title", t: "几何分布" },
  { s: "#sec-geometric .def-box:nth-of-type(1) .def-label", t: "定义 — Geometric(\\(q\\))" },
  { s: "#sec-geometric .def-box.example-box .def-label", t: "示例 — 冯·诺伊曼技巧" },
  {
    s: "#sec-geometric .def-box.example-box p",
    t: '在偏置硬币转公平硬币问题中，每次尝试成功概率为 \\(q = 2p(1-p)\\)。尝试次数服从 Geometric(\\(q\\))，因此期望尝试次数为 \\(\\frac{1}{2p(1-p)}\\)。',
  },
  {
    s: "#sec-geometric .proof-toggle",
    t: '<span class="toggle-icon">&#9654;</span> 为什么 \\(\\mathbb{E}[\\text{Geometric}(q)] = 1/q\\)？',
  },

  // --- Tail-sum ---
  { s: "#sec-tailsum .section-title", t: "尾和公式" },
  { s: "#sec-tailsum .def-box.theorem-box .def-label", t: "定理" },
  { s: "#sec-tailsum .def-box.warning-box .def-label", t: "记忆技巧" },
  {
    s: "#sec-tailsum .def-box.warning-box p",
    t: '求和从 \\(n = 1\\) 开始，<em>不是</em> \\(n = 0\\)。验证：若 \\(X = 0\\) 恒成立，则 \\(\\mathbb{E}[X] = 0\\)。但 \\(\\Pr[X \\geq 0] = 1 \\neq 0\\)，所以必须跳过 \\(n = 0\\)。',
  },
  { s: "#sec-tailsum .def-box.example-box .def-label", t: "为什么有用" },
  {
    s: "#sec-tailsum .def-box.example-box p",
    t: "有时计算 \\(\\Pr[X \\geq n]\\) 比计算 \\(\\Pr[X = n]\\) 更容易。这个公式让你可以在两种方法之间切换来计算期望。",
  },

  // --- Harmonic ---
  { s: "#sec-harmonic .section-title", t: "调和数" },
  { s: "#sec-harmonic .def-box:nth-of-type(1) .def-label", t: "定义 — \\(H_n\\)" },
  { s: "#sec-harmonic h3", t: "关键界" },
  { s: "#sec-harmonic .def-box:nth-of-type(2) .def-label", t: "性质" },
  { s: "#sec-harmonic .def-box.example-box .def-label", t: "在第一章中的出现" },

  // --- Jensen ---
  { s: "#sec-jensen .section-title", t: "延森不等式" },
  { s: "#sec-jensen .def-box:nth-of-type(1) .def-label", t: "定义 — 凸函数" },
  { s: "#sec-jensen .def-box.theorem-box .def-label", t: "延森不等式" },
  { s: "#sec-jensen .def-box.example-box .def-label", t: "合理性验证" },

  // --- Permutations ---
  { s: "#sec-permutations .section-title", t: "排列与不动点" },
  { s: "#sec-permutations .def-box:nth-of-type(1) .def-label", t: "定义 — 排列" },
  {
    s: "#sec-permutations .def-box:nth-of-type(1) p",
    t: '\\(\\{1, 2, \\ldots, n\\}\\) 的<strong>排列</strong>是一种重排：双射 \\(\\pi: \\{1,\\ldots,n\\} \\to \\{1,\\ldots,n\\}\\)。\\(n\\) 个元素有 \\(n!\\) 种排列。',
  },
  { s: "#sec-permutations .def-box:nth-of-type(2) .def-label", t: "定义 — 不动点" },
  {
    s: "#sec-permutations .def-box:nth-of-type(2) p",
    t: '整数 \\(i\\) 是排列 \\(\\pi\\) 的<strong>不动点</strong>，如果 \\(\\pi(i) = i\\)——即该元素留在其原始位置。',
  },

  // Perm symbol meanings
  { s: "#sec-permutations .symbol-grid .sym-cell:nth-child(6)", t: "一个排列函数" },
  { s: "#sec-permutations .symbol-grid .sym-cell:nth-child(9)", t: "阶乘：\\(n! = n \\cdot (n-1) \\cdots 2 \\cdot 1\\)" },
  { s: "#sec-permutations .symbol-grid .sym-cell:nth-child(12)", t: '二项式系数：\\(\\frac{n!}{k!(n-k)!}\\)，"从n中选k"' },

  { s: "#sec-permutations .def-box.example-box .def-label", t: "重要结论" },
  {
    s: "#sec-permutations .def-box.example-box p",
    t: "<em>均匀随机</em>排列的不动点期望数恰好为1，与 \\(n\\) 无关。方差也是1！",
  },

  // --- Recurrence ---
  { s: "#sec-recurrence .section-title", t: "递推关系与微分方程" },
  { s: "#sec-recurrence .def-box:nth-of-type(1) .def-label", t: "定义 — 递推关系" },
  { s: "#sec-recurrence h3", t: "ODE 方法（快速排序证明中使用）" },
  { s: "#sec-recurrence .def-box:nth-of-type(2) .def-label", t: "核心思想" },

  // Recurrence symbol meanings
  { s: "#sec-recurrence .symbol-grid .sym-cell:nth-child(6)", t: "从 \\(a\\) 到 \\(b\\) 的定积分" },
  { s: "#sec-recurrence .symbol-grid .sym-cell:nth-child(9)", t: "\\(F\\) 关于 \\(x\\) 的导数" },
  { s: "#sec-recurrence .symbol-grid .sym-cell:nth-child(12)", t: "微分算子" },
  { s: "#sec-recurrence .symbol-grid .sym-cell:nth-child(15)", t: "异或：模2求和" },

  // --- Quick checks ---
  {
    s: "#sec-notation .qc-question",
    t: '快速检查：\\(\\displaystyle\\sum_{k=1}^{3} \\frac{1}{k+1}\\) 等于多少？',
  },
  {
    s: "#sec-log .qc-question",
    t: '快速检查：\\(\\ln(e^3)\\) 等于多少？',
  },
  {
    s: "#sec-prob-basics .qc-question",
    t: '快速检查：若 \\(\\Pr[\\text{下雨}] = 0.3\\)，\\(\\Pr[\\text{不下雨}]\\) 是多少？',
  },
  {
    s: "#sec-expectation .qc-question",
    t: '快速检查：若 \\(\\Pr[X=0]=1/4\\)，\\(\\Pr[X=1]=1/2\\)，\\(\\Pr[X=2]=1/4\\)，\\(\\mathbb{E}[X]\\) 是多少？',
  },
  {
    s: "#sec-variance .qc-question",
    t: '快速检查：若 \\(X \\in \\{0,1\\}\\) 且 \\(\\Pr[X=1] = 1/2\\)，\\(\\text{Var}[X]\\) 是多少？',
  },
  {
    s: "#sec-geometric .qc-question",
    t: '快速检查：掷一个公平骰子，你期望需要掷多少次才能得到6？',
  },
  {
    s: "#sec-harmonic .qc-question",
    t: '快速检查：\\(H_4 = 1 + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4}\\) 等于多少？',
  },

  // --- Math Quiz ---
  {
    t: "测试你对数学概念的理解。本测验涵盖第一章的表示法、概率和关键工具。",
  },
  {
    t: "&larr; 返回第一章学习指南",
  },
];

// ===================== CHAPTER 2 STUDY PAGE TRANSLATIONS =====================
var STUDY2_T = [
  { s: "[data-i18n-home]", t: "&larr; 课程主页" },

  // Sidebar nav
  { s: '[data-section="hero"]', t: "概览" },
  { s: '[data-section="sec-why-concentration"]', t: "为什么需要集中？" },
  { s: '[data-section="sec-markov"]', t: "马尔可夫不等式" },
  { s: '[data-section="sec-chebyshev"]', t: "切比雪夫不等式" },
  { s: '[data-section="sec-union-bound"]', t: "联合界" },
  { s: '[data-section="sec-median"]', t: "随机中位数" },
  { s: '[data-section="sec-amplification"]', t: "概率放大" },
  { s: '[data-section="sec-chernoff"]', t: "切尔诺夫 & 霍夫丁" },
  { s: '[data-section="sec-summary"]', t: "界的总结" },
  { s: '[data-section="sec-tutorial"]', t: "习题练习" },
  { s: 'a.nav-link[href="chapter2-math.html"]', t: "&#x1F4D0; 数学基础" },
  { s: 'a.nav-link[href="chapter2-mindmap.html"]', t: "&#x1F5FA; 思维导图" },

  // Hero
  { s: ".hero-course", t: "COMPX270 — 随机与高级算法" },
  { s: "#hero h1", t: "第二章：集中不等式与技巧" },
  { s: ".hero-subtitle", t: "马尔可夫、切比雪夫、切尔诺夫与霍夫丁界；联合界；随机中位数算法；以及概率放大技术。" },
  { s: ".hero-cards .hero-card:nth-child(1) span:last-child", t: "集中不等式" },
  { s: ".hero-cards .hero-card:nth-child(2) span:last-child", t: "随机中位数" },
  { s: ".hero-cards .hero-card:nth-child(3) span:last-child", t: "概率放大" },
  { s: ".hero-cards .hero-card:nth-child(4) span:last-child", t: "习题与测验" },
  { s: 'a.btn[href="chapter2-math.html"]', t: "&#x1F4D0; 数学基础 &rarr;" },
  { s: 'a.btn[href="chapter2-mindmap.html"]', t: "&#x1F5FA; 思维导图 &rarr;" },

  // Why Concentration
  { s: "#sec-why-concentration .section-title", t: "为什么需要集中？" },
  { s: "#sec-why-concentration .concept-box > p", i: 0, t: "<strong>公交车类比：</strong>你在等公交车。有人告诉你平均每5分钟来一班。如果你等20分钟，公交到达的概率是多少？" },
  { s: "#sec-why-concentration .concept-box > p", i: 1, t: "仅知道期望（平均值），我们可以用<strong>马尔可夫不等式</strong>得出公交超过20分钟不来的概率至多为 \\(\\frac{5}{20} = \\frac{1}{4}\\)。所以至少有75%的概率等到公交！" },
  { s: "#sec-why-concentration h3", i: 0, t: "大局观" },
  { s: "#sec-why-concentration .info-card:nth-child(1) h4", t: "低方差" },
  { s: "#sec-why-concentration .info-card:nth-child(1) p", t: "随机变量紧密聚集在期望附近。可靠！" },
  { s: "#sec-why-concentration .info-card:nth-child(2) h4", t: "高方差" },
  { s: "#sec-why-concentration .info-card:nth-child(2) p", t: "随机变量可能远离期望。不可预测！" },

  // Markov
  { s: "#sec-markov .section-title", t: "马尔可夫不等式" },
  { s: "#sec-markov .theorem-box h3", t: "定理（马尔可夫不等式）" },
  { s: '#sec-markov [data-target="proof-markov"]', t: "显示证明" },
  { s: "#sec-markov .concept-box h3", t: "应用：拉斯维加斯 → 蒙特卡罗" },

  // Chebyshev
  { s: "#sec-chebyshev .section-title", t: "切比雪夫不等式" },
  { s: "#sec-chebyshev .theorem-box h3", t: "定理（切比雪夫不等式）" },
  { s: '#sec-chebyshev [data-target="proof-chebyshev"]', t: "显示证明" },
  { s: "#sec-chebyshev .concept-box h3", t: "马尔可夫 vs 切比雪夫：对比" },
  { s: '[data-tab="tab-markov-props"]', t: "马尔可夫" },
  { s: '[data-tab="tab-cheby-props"]', t: "切比雪夫" },

  // Union Bound
  { s: "#sec-union-bound .section-title", t: "联合界" },
  { s: "#sec-union-bound .theorem-box h3", t: "引理（联合界）" },
  { s: "#sec-union-bound .concept-box h3", t: "实用推论" },

  // Randomised Median
  { s: "#sec-median .section-title", t: "随机中位数" },
  { s: "#sec-median .algo-box h4", t: "算法 3：随机中位数（最坏情况线性时间）" },
  { s: "#sec-median .concept-box:nth-of-type(2) h3", t: "选择 \\(m\\)" },
  { s: "#sec-median .concept-box:nth-of-type(3) h3", t: "分析：三个坏事件" },
  { s: '#sec-median [data-target="proof-median"]', t: "显示完整分析" },
  { s: "#sec-median .theorem-box h3", t: "定理 7" },

  // Amplification
  { s: "#sec-amplification .section-title", t: "概率放大" },
  { s: "#sec-amplification .concept-box h3", t: "核心问题" },
  { s: '[data-tab="tab-amp-repeat"]', t: "重复放大" },
  { s: '[data-tab="tab-amp-majority"]', t: "多数表决" },
  { s: '[data-tab="tab-amp-lv"]', t: "MC → 拉斯维加斯" },

  // Chernoff & Hoeffding
  { s: "#sec-chernoff .section-title", t: "切尔诺夫与霍夫丁界" },
  { s: "#sec-chernoff .theorem-box:nth-of-type(1) h3", t: "定理（切尔诺夫界）" },
  { s: "#sec-chernoff .theorem-box:nth-of-type(2) h3", t: "定理（霍夫丁界）" },
  { s: "#sec-chernoff .concept-box h3", t: "切尔诺夫 vs 霍夫丁：何时使用？" },
  { s: '#sec-chernoff [data-target="proof-chernoff"]', t: "显示证明概要（切尔诺夫）" },

  // Summary
  { s: "#sec-summary .section-title", t: "集中不等式：总结" },
  { s: "#sec-summary .concept-box h3", t: "独立性层级" },

  // Tutorial
  { s: "#sec-tutorial .section-title", t: "习题练习" },
  { s: "#sec-tutorial > p", t: "通过这些习题巩固你对集中不等式和概率放大的理解。" },

  // Solution buttons
  { s: '.solution-toggle[data-target="sol1"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol2"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol3"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol4"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol5"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol6"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol7"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol8"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol9"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol10"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol11"]', t: "查看解答" },

  // Problem tags
  { s: ".problem-tag.warm-up", i: 0, t: "热身" },
  { s: ".problem-tag.warm-up", i: 1, t: "热身" },
  { s: ".problem-tag.warm-up", i: 2, t: "热身" },
  { s: ".problem-tag.warm-up", i: 3, t: "热身" },
  { s: ".problem-tag.problem-solving", i: 0, t: "解题" },
  { s: ".problem-tag.problem-solving", i: 1, t: "解题" },
  { s: ".problem-tag.problem-solving", i: 2, t: "解题" },
  { s: ".problem-tag.problem-solving", i: 3, t: "解题" },
  { s: ".problem-tag.advanced", i: 0, t: "进阶" },
  { s: ".problem-tag.advanced", i: 1, t: "进阶" },
  { s: ".problem-tag.advanced", i: 2, t: "进阶" },

  // Why Concentration — content
  { s: "#sec-why-concentration .concept-box:nth-of-type(2) > p", i: 0, t: "\u5728\u7b97\u6cd5\u5206\u6790\u4e2d\uff0c\u6211\u4eec\u7ecf\u5e38\u8bc1\u660e<em>\u671f\u671b</em>\u91cf\u7684\u754c\uff1a\u8fd0\u884c\u65f6\u95f4\u3001\u8f93\u51fa\u8d28\u91cf\u3001\u8d44\u6e90\u4f7f\u7528\u3002\u4f46\u4ec5\u77e5\u9053\u671f\u671b\u662f\u4e0d\u591f\u7684 \u2014 \u6211\u4eec\u9700\u8981\u77e5\u9053\u968f\u673a\u53d8\u91cf\u56f4\u7ed5\u5176\u671f\u671b\u7684<strong>\u96c6\u4e2d\u7a0b\u5ea6</strong>\u3002" },
  { s: "#sec-why-concentration .concept-box:nth-of-type(2) > p", i: 1, t: "<strong>\u96c6\u4e2d\u4e0d\u7b49\u5f0f</strong>\u7ed9\u6211\u4eec\u5de5\u5177\u6765\u51c6\u786e\u91cf\u5316\u968f\u673a\u53d8\u91cf\u504f\u79bb\u5176\u671f\u671b\u7684\u53ef\u80fd\u6027\uff0c\u800c\u4e14\u968f\u7740\u6211\u4eec\u5bf9\u5b83\u4e86\u89e3\u5f97\u8d8a\u591a\uff0c\u4fdd\u8bc1\u5c31\u8d8a\u5f3a\u3002" },

  // Why Concentration — simulator
  { s: "#sec-why-concentration .sim-container > h3", t: "\u4ea4\u4e92\uff1a\u5c3e\u90e8\u754c\u6bd4\u8f83" },
  { s: "#sec-why-concentration .sim-container > p", t: "\u8c03\u6574 \\(t\\) \u67e5\u770b\u5f53 \\(X \\sim \\text{Bin}(n, p)\\) \u65f6\uff0c\u9a6c\u5c14\u53ef\u592b\u3001\u5207\u6bd4\u96ea\u592b\u548c\u5207\u5c14\u8bfa\u592b\u5c3e\u90e8\u754c\u5bf9 \\(\\Pr[X \\geq t]\\) \u7684\u6bd4\u8f83\u3002" },

  // Markov — content
  { s: "#sec-markov .theorem-box p", t: "\u8bbe \\(X\\) \u662f\u4e00\u4e2a<strong>\u975e\u8d1f</strong>\u968f\u673a\u53d8\u91cf\uff0c\u4e14 \\(\\mathbb{E}[X] < \\infty\\)\u3002\u5bf9\u4efb\u610f \\(t > 0\\)\uff1a" },
  { s: "#sec-markov > p", t: "\u76f4\u89c9\uff1a\u201c\u4f60\u4e0d\u53ef\u80fd\u8d85\u8fc7\u671f\u671b\u768410\u500d\u8d85\u8fc710%\u7684\u65f6\u95f4\u3002\u201d" },
  { s: "#sec-markov .concept-box p", i: 0, t: "<strong>\u5f15\u7406 4.2\uff1a</strong>\u5982\u679c \\(A\\) \u662f\u4e00\u4e2a\u671f\u671b\u8fd0\u884c\u65f6\u95f4\u4e3a \\(T\\) \u7684\u62c9\u65af\u7ef4\u52a0\u65af\u7b97\u6cd5\uff0c\u90a3\u4e48\u5b58\u5728\u4e00\u4e2a\u6700\u574f\u60c5\u51b5\u8fd0\u884c\u65f6\u95f4\u4e3a \\(O(T)\\) \u4e14\u5931\u8d25\u6982\u7387\u4e3a \\(\\frac{1}{100}\\) \u7684\u8499\u7279\u5361\u6d1b\u7b97\u6cd5 \\(A'\\)\u3002" },
  { s: "#sec-markov .concept-box p", i: 1, t: "\u7531\u9a6c\u5c14\u53ef\u592b\u4e0d\u7b49\u5f0f\uff1a\\(\\Pr[\\text{\u8fd0\u884c\u65f6\u95f4} \\geq 100T] \\leq \\frac{T}{100T} = \\frac{1}{100}\\)\u3002\u5b8c\u6bd5\uff01" },
  { s: "#sec-markov .algo-block h4", t: "\u7b97\u6cd5 \\(A'\\)" },

  // Chebyshev — content
  { s: "#sec-chebyshev .theorem-box p", t: "\u8bbe \\(X\\) \u662f\u4e00\u4e2a \\(\\mathbb{E}[X^2] < \\infty\\) \u7684\u968f\u673a\u53d8\u91cf\u3002\u5bf9\u4efb\u610f \\(t > 0\\)\uff1a" },

  // Union Bound — content
  { s: "#sec-union-bound .theorem-box p", t: "\u5bf9\u4efb\u610f\uff08\u53ef\u80fd\u76f8\u5173\u3001\u53ef\u80fd\u53ef\u6570\u65e0\u7a77\u7684\uff09\u4e8b\u4ef6 \\(E_1, E_2, \\ldots\\)\uff1a" },
  { s: "#sec-union-bound > p", t: "\u8054\u5408\u754c\u770b\u4f3c\u7b80\u5355\u4f46\u5f02\u5e38\u5f3a\u5927\u3002\u5b83\u8ba9\u6211\u4eec\u53ef\u4ee5\u5bf9<em>\u4efb\u610f</em>\u574f\u4e8b\u4ef6\u53d1\u751f\u7684\u6982\u7387\u8fdb\u884c\u754c\u5b9a\uff0c<strong>\u65e0\u9700</strong>\u63a8\u7406\u4e8b\u4ef6\u95f4\u7684\u4f9d\u8d56\u5173\u7cfb\u3002" },
  { s: "#sec-union-bound .concept-box p", i: 0, t: "<strong>\u65e0</strong>\u574f\u4e8b\u4ef6\u53d1\u751f\u7684\u6982\u7387\u4e3a\uff1a" },
  { s: "#sec-union-bound .concept-box p", i: 1, t: "\u7b56\u7565\uff1a\u5206\u522b\u754c\u5b9a\u6bcf\u4e2a\u574f\u4e8b\u4ef6\uff0c\u7136\u540e\u52a0\u5728\u4e00\u8d77\u3002\u5982\u679c\u603b\u548c\u5f88\u5c0f\uff0c\u5c31\u6ca1\u95ee\u9898\uff01" },

  // Median — content
  { s: "#sec-median .concept-box:nth-of-type(1) p", i: 0, t: "<strong>\u95ee\u9898\uff1a</strong>\u7ed9\u5b9a\u4e00\u4e2a\u672a\u6392\u5e8f\u7684\u6570\u7ec4 \\(A\\)\uff0c\u5305\u542b \\(n\\) \u4e2a\u4e0d\u540c\u6574\u6570\uff0c\u627e\u5230\u4e2d\u4f4d\u6570\u3002" },
  { s: "#sec-median .concept-box:nth-of-type(1) p", i: 1, t: "<strong>\u6838\u5fc3\u601d\u60f3\uff1a</strong><em>\u91c7\u6837\u4f5c\u4e3a\u5411\u5bfc\u3002</em>\u5b50\u91c7\u6837\u4e00\u4e2a\u8f83\u5c0f\u7684\u6570\u7ec4 \\(B\\)\uff08\u5927\u5c0f\u4e3a \\(m \\ll n\\)\uff09\uff0c\u6392\u5e8f\uff0c\u5e76\u4f7f\u7528 \\(B\\) \u7684\u201c\u8fd1\u4f3c\u4e2d\u4f4d\u6570\u201d\u6765\u7f29\u5c0f \\(A\\) \u4e2d\u771f\u5b9e\u4e2d\u4f4d\u6570\u7684\u8303\u56f4\u3002" },
  { s: "#sec-median .algo-block h4", t: "\u7b97\u6cd5 3\uff1a\u968f\u673c\u4e2d\u4f4d\u6570\uff08\u6700\u574f\u60c5\u51b5\u7ebf\u6027\u65f6\u95f4\uff09" },
  { s: "#sec-median .concept-box:nth-of-type(2) p", t: "\u6211\u4eec\u9700\u8981 \\(O(m \\log m)\\) \u548c \\(O\\!\\left(\\frac{n}{\\sqrt{m}} \\log \\frac{n}{\\sqrt{m}}\\right)\\) \u90fd\u4e3a \\(O(n)\\)\u3002\u4ee4\u5b83\u4eec\u76f8\u7b49\uff1a\\(m = \\frac{n}{\\sqrt{m}}\\)\uff0c\u5f97 \\(m = n^{2/3}\\)\u3002" },
  { s: "#sec-median .concept-box:nth-of-type(3) p", i: 0, t: "\u7b97\u6cd5\u4ec5\u5728\u4e09\u4e2a\u4e8b\u4ef6\u4e4b\u4e00\u53d1\u751f\u65f6\u5931\u8d25\uff1a" },
  { s: "#sec-median .theorem-box p", t: "\u968f\u673c\u4e2d\u4f4d\u6570\uff08\u7b97\u6cd5 3\uff09\u662f\u4e00\u4e2a\u5931\u8d25\u6982\u7387\u81f3\u591a\u4e3a \\(\\frac{3}{16}\\) \u7684<strong>\u7ebf\u6027\u65f6\u95f4\u8499\u7279\u5361\u6d1b\u7b97\u6cd5</strong>\u3002" },

  // Median — simulator
  { s: "#sec-median .sim-container > h3", t: "\u4ea4\u4e92\uff1a\u968f\u673c\u4e2d\u4f4d\u6570\u6a21\u62df" },
  { s: "#sec-median .sim-container > p", t: "\u89c2\u5bdf\u7b97\u6cd5\u5728 \\(n = 10{,}001\\) \u4e2a\u4e0d\u540c\u6574\u6570\u7684\u6570\u7ec4\u4e0a\u9010\u6b65\u8fd0\u884c\u3002\u771f\u5b9e\u4e2d\u4f4d\u6570\u59cb\u7ec8\u4e3a <strong>5001</strong>\u3002" },
  { s: "#btnStepMedian", t: "\u9010\u6b65\u6267\u884c" },
  { s: "#btnRunMedian100", t: "\u8fd0\u884c 100 \u6b21" },
  { s: "#btnResetMedian", t: "\u91cd\u7f6e" },
  { s: "#sec-median .stat-card:nth-child(1) .stat-label", t: "\u7ed3\u679c" },
  { s: "#sec-median .stat-card:nth-child(2) .stat-label", t: "\u603b\u8bd5\u9a8c\u6b21\u6570" },
  { s: "#sec-median .stat-card:nth-child(3) .stat-label", t: "\u6210\u529f\u6b21\u6570" },
  { s: "#sec-median .stat-card:nth-child(4) .stat-label", t: "\u5931\u8d25\u6b21\u6570" },
  { s: "#sec-median .stat-card:nth-child(5) .stat-label", t: "\u6210\u529f\u7387" },

  // Amplification — content
  { s: "#sec-amplification .concept-box p", i: 0, t: "\u6211\u4eec\u7684\u968f\u673c\u4e2d\u4f4d\u6570\u7684\u5931\u8d25\u6982\u7387\u4e3a \\(\\frac{3}{16} \\approx 19\\%\\)\u3002\u6211\u4eec\u80fd\u5c06\u5b83\u964d\u5230 \\(1\\%\\)\u5417\uff1f\\(0.01\\%\\)\uff1f\u5bf9\u4efb\u610f \\(\\varepsilon > 0\\) \u964d\u5230 \\(\\varepsilon\\)\uff1f" },
  { s: "#sec-amplification .concept-box p", i: 1, t: "<strong>\u53ef\u4ee5\uff01</strong>\u800c\u4e14\u6211\u4eec\u4e0d\u9700\u8981\u91cd\u65b0\u63a8\u5bfc\u4efb\u4f55\u4e1c\u897f\u3002\u6211\u4eec\u53ef\u4ee5\u4ee5<em>\u9ed1\u7bb1</em>\u65b9\u5f0f\u653e\u5927\u6210\u529f\u6982\u7387\u3002" },

  // Amplification — simulator
  { s: "#sec-amplification .sim-container > h3", t: "\u4ea4\u4e92\uff1a\u653e\u5927\u6f14\u793a" },
  { s: "#sec-amplification .sim-container > p", t: "\u4ece\u4e00\u4e2a\u6210\u529f\u6982\u7387\u4e3a 60% \u7684\u7b97\u6cd5\u5f00\u59cb\u3002\u770b\u770b \\(T\\) \u6b21\u591a\u6570\u8868\u51b3\u5982\u4f55\u653e\u5927\u6210\u529f\u7387\u3002" },
  { s: "#btnRunAmp", t: "\u8fd0\u884c 1000 \u6b21\u8bd5\u9a8c" },
  { s: "#sec-amplification .stat-card:nth-child(1) .stat-label", t: "\u5207\u5c14\u8bfa\u592b\u754c" },
  { s: "#sec-amplification .stat-card:nth-child(2) .stat-label", t: "\u89c2\u6d4b\u8bef\u5dee" },

  // Chernoff — content
  { s: "#sec-chernoff .theorem-box:nth-of-type(1) p", t: "\u8bbe \\(X_1, \\ldots, X_n\\) \u662f\u53d6\u503c\u4e8e \\([0,1]\\) \u7684<strong>\u72ec\u7acb</strong>\u968f\u673a\u53d8\u91cf\uff0c\u4e14 \\(P := \\sum_{i=1}^{n} \\mathbb{E}[X_i]\\)\u3002\u5bf9\u4efb\u610f \\(\\delta \\in (0,1]\\)\uff1a" },
  { s: "#sec-chernoff .theorem-box:nth-of-type(2) p", t: "\u8bbe \\(X_1, \\ldots, X_n\\) \u662f<strong>\u72ec\u7acb</strong>\u968f\u673a\u53d8\u91cf\uff0c\\(X_i \\in [a_i, b_i]\\)\u3002\u5bf9\u4efb\u610f \\(t \\geq 0\\)\uff1a" },
  { s: "#sec-chernoff > p", i: 0, t: "\u5bf9 i.i.d. \\(X_i \\in [0,1]\\)\uff08\u5747\u503c \\(\\mu\\)\uff09\uff0c\u970d\u592b\u4e01\u7b80\u5316\u4e3a\uff1a" },

  // Summary — table
  { s: ".summary-table thead th", i: 0, t: "\u754c" },
  { s: ".summary-table thead th", i: 1, t: "\u8981\u6c42" },
  { s: ".summary-table thead th", i: 2, t: "\u7ed3\u679c" },
  { s: ".summary-table thead th", i: 3, t: "\u8870\u51cf" },
  { s: ".summary-table tbody tr:nth-child(2) td:nth-child(2)", t: "\u5df2\u77e5 \\(\\mathbb{E}[X]\\)\u3001\\(\\operatorname{Var}[X]\\)" },
  { s: ".summary-table tbody tr:nth-child(3) td:nth-child(2)", t: "\u72ec\u7acb \\(X_i \\in [0,1]\\) \u7684\u548c" },
  { s: ".summary-table tbody tr:nth-child(4) td:nth-child(2)", t: "\u72ec\u7acb\u6709\u754c\u968f\u673a\u53d8\u91cf\u7684\u548c" },

  // Summary — concept box
  { s: "#sec-summary .concept-box p", t: "\u968f\u7740\u72ec\u7acb\u6027\u8981\u6c42\u7684\u589e\u52a0\uff0c\u754c\u7684\u5f3a\u5ea6\u4e5f\u5728\u589e\u52a0\uff01" },

  // Tutorial — problem text
  { s: "#sec-tutorial .problem-card:nth-child(2) p", i: 0, t: "\u8bbe \\(E_1\\) \u548c \\(E_2\\) \u662f\u4e24\u4e2a\u72ec\u7acb\u4e8b\u4ef6\uff0c\u6bcf\u4e2a\u4ee5\u6982\u7387 \\(p\\) \u53d1\u751f\u3002\u81f3\u5c11\u4e00\u4e2a\u53d1\u751f\u7684\u6982\u7387\u662f\u591a\u5c11\uff1f\u4e0e\u8054\u5408\u754c\u7684\u7ed3\u679c\u6bd4\u8f83\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(2) p", i: 1, t: "\u63a8\u5e7f\u5230 \\(k\\) \u4e2a\u72ec\u7acb\u4e8b\u4ef6 \\(E_1, \\ldots, E_k\\)\uff0c\u6bcf\u4e2a\u4ee5\u6982\u7387 \\(p\\) \u53d1\u751f\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(3) p", t: "\u7528\u9a6c\u5c14\u53ef\u592b\u4e0d\u7b49\u5f0f\u8bc1\u660e\u5207\u6bd4\u96ea\u592b\u4e0d\u7b49\u5f0f\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(4) p", t: "\u8ba1\u7b97 \\(\\text{Poisson}(\\lambda)\\) \u968f\u673a\u53d8\u91cf\u7684\u671f\u671b\u548c\u65b9\u5dee\u3002\uff08\u56de\u987e\uff1a\u82e5 \\(X \\sim \\text{Poisson}(\\lambda)\\)\uff0c\u5219 \\(\\Pr[X = k] = \\frac{e^{-\\lambda}\\lambda^k}{k!}\\)\uff0c\\(k \\geq 0\\)\uff09" },
  { s: "#sec-tutorial .problem-card:nth-child(5) p", i: 0, t: "\u8bbe \\(X \\sim \\text{Bin}(n, p)\\)\u3002\u8ba1\u7b97\u5176\u671f\u671b\u548c\u65b9\u5dee\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(6) p", t: "\u8bc1\u660e\u5b9a\u7406 8\uff1a\u8bbe \\(A\\) \u662f\u4e00\u4e2a\u6700\u574f\u60c5\u51b5\u8fd0\u884c\u65f6\u95f4\u4e3a \\(T(n)\\) \u4e14\u5e38\u6570\u5931\u8d25\u6982\u7387\u4e3a \\(p \\in (0,1)\\) \u7684\u8499\u7279\u5361\u6d1b\u7b97\u6cd5\uff0c\u5176\u4e2d\u53ef\u4ee5\u5728 \\(O(1)\\) \u65f6\u95f4\u5185\u68c0\u6d4b\u9519\u8bef\u8f93\u51fa\u3002\u90a3\u4e48\u5b58\u5728\u4e00\u4e2a\u671f\u671b\u8fd0\u884c\u65f6\u95f4\u4e3a \\(O(T(n))\\) \u7684\u62c9\u65af\u7ef4\u52a0\u65af\u7b97\u6cd5 \\(A'\\)\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(7) p", i: 0, t: "\u7ed9\u5b9a\u4e24\u4e2a\u7528\u4e8e\u51b3\u7b56\u95ee\u9898 \\(P\\) \u7684\u8499\u7279\u5361\u6d1b\u7b97\u6cd5 \\(A\\) \u548c \\(B\\)\uff1a" },
  { s: "#sec-tutorial .problem-card:nth-child(7) p", i: 1, t: "\u4f7f\u7528 \\(A\\) \u548c \\(B\\) \u8bbe\u8ba1\u4e00\u4e2a\u62c9\u65af\u7ef4\u52a0\u65af\u7b97\u6cd5 \\(C\\)\u3002\u5206\u6790\u5176\u671f\u671b\u8fd0\u884c\u65f6\u95f4\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(8) p", t: "\u7b97\u6cd5 \\(A\\) \u8f93\u51fa\u201cgood\u201d\u6216\u201cbad\u201d\uff1a\u82e5 \\(x\\) \u4e3a good\uff0c\\(\\Pr[A(x) = \\text{good}] \\geq 9/10\\)\uff1b\u82e5 \\(x\\) \u4e3a bad\uff0c\\(\\Pr[A(x) = \\text{good}] \\leq 1/10\\)\u3002\u8bbe\u8ba1 \\(A'\\) \u4f7f\u5f97 \\(\\Pr[\\text{\u6b63\u786e}] \\geq 1-\\delta\\)\uff0c\u5e76\u754c\u5b9a\u8d44\u6e90\u6d88\u8017\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(9) p", t: "\u7c7b\u4f3c\u95ee\u9898 7\uff0c\u4f46\u5177\u6709<strong>\u5355\u4fa7\u8bef\u5dee</strong>\uff1a\u82e5 \\(x\\) \u4e3a good\uff0c\\(\\Pr[A(x) = \\text{good}] \\geq 1/10\\)\uff1b\u82e5 \\(x\\) \u4e3a bad\uff0c\\(\\Pr[A(x) = \\text{good}] = 0\\)\u3002\u8bbe\u8ba1 \\(A'\\) \u4f7f\u5f97 \\(\\Pr[\\text{good} | x \\text{ good}] \\geq 1-\\delta\\) \u4e14 \\(\\Pr[\\text{good} | x \\text{ bad}] = 0\\)\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(10) p", i: 0, t: "\u8bc1\u660e\u5207\u5c14\u8bfa\u592b\u754c\uff1a\u7ed9\u5b9a \\(X_1, \\ldots, X_n\\) \u662f i.i.d. \u7684 \\(\\{0,1\\}\\) \u53d6\u503c\u968f\u673a\u53d8\u91cf\uff0c\\(\\mathbb{E}[X_i] = p\\)\uff0c\\(X = \\sum X_i\\)\uff0c\u8bc1\u660e\u5bf9 \\(\\gamma \\in (0,1]\\)\uff1a" },
  { s: "#sec-tutorial .problem-card:nth-child(11) p", t: "\u8bc1\u660e\u5207\u5c14\u8bfa\u592b\u754c\u7684\u53e6\u4e00\u4fa7\uff1a\\(\\Pr[X < (1-\\gamma)\\mathbb{E}[X]] \\leq e^{-\\gamma^2 \\mathbb{E}[X]/2}\\)\uff0c\\(\\gamma \\in (0,1]\\)\u3002\u5982\u4f55\u63a8\u5e7f\u5230 \\(X_i \\in [0,1]\\)\uff08\u4e0d\u4e00\u5b9a\u540c\u5206\u5e03\uff09\uff1f" },
  { s: "#sec-tutorial .problem-card:nth-child(12) p", t: "<strong>\u4e2d\u4f4d\u6570\u6280\u5de7\uff1a</strong>\u7ed9\u5b9a\u7b97\u6cd5 \\(A\\) \u5bf9\u8f93\u5165 \\(x\\) \u8f93\u51fa\u201c\u597d\u503c\u201d\uff08\u5728\u67d0\u4e2a\u533a\u95f4 \\([a_x, b_x]\\) \u5185\uff09\u7684\u6982\u7387\u4fdd\u8bc1\u4e3a \\(\\Pr[A(x) < a_x] \\leq \\alpha\\) \u548c \\(\\Pr[A(x) > b_x] \\leq \\alpha\\)\uff0c\u5176\u4e2d \\(\\alpha < 1/2\\)\u3002\u72ec\u7acb\u8fd0\u884c \\(A\\) \\(k\\) \u6b21\u5e76\u8fd4\u56de\u4e2d\u4f4d\u6570\u3002\u5206\u6790\u6210\u529f\u6982\u7387\u5e76\u8bbe\u5b9a \\(k\\) \u4f7f\u5176\u8fbe\u5230 \\(1-\\delta\\)\u3002" },

  // Tutorial — solution text
  { s: "#sol1", t: '<p><strong>\u7cbe\u786e\u503c\uff1a</strong>\\(\\Pr[E_1 \\cup E_2] = 1 - (1-p)^2 = 2p - p^2\\)</p><p><strong>\u8054\u5408\u754c\uff1a</strong>\\(\\Pr[E_1 \\cup E_2] \\leq 2p\\)</p><p>\u5bf9 \\(k\\) \u4e2a\u4e8b\u4ef6\uff1a\u7cbe\u786e\u503c\u4e3a \\(1 - (1-p)^k\\)\uff0c\u8054\u5408\u754c\u7ed9\u51fa \\(kp\\)\u3002\u5f53 \\(p\\) \u5f88\u5c0f\u65f6\u5b83\u4eec\u6e10\u8fd1\u76f8\u540c\uff08\u9ad8\u9636\u9879\u53ef\u5ffd\u7565\uff09\u3002</p>' },
  { s: "#sol2", t: '<p>\u5bf9 \\(Y = (X - \\mathbb{E}[X])^2\\) \u5e94\u7528\u9a6c\u5c14\u53ef\u592b\u4e0d\u7b49\u5f0f\uff1a</p><p>\\[\\Pr[|X - \\mathbb{E}[X]| \\geq t] = \\Pr[Y \\geq t^2] \\leq \\frac{\\mathbb{E}[Y]}{t^2} = \\frac{\\operatorname{Var}[X]}{t^2} \\quad \\square\\]</p>' },
  { s: "#sol3", t: '<p><strong>\u671f\u671b\uff1a</strong></p><p>\\[\\mathbb{E}[X] = \\sum_{k=0}^{\\infty} k \\cdot \\frac{e^{-\\lambda}\\lambda^k}{k!} = \\lambda \\cdot e^{-\\lambda} \\sum_{\\ell=0}^{\\infty} \\frac{\\lambda^\\ell}{\\ell!} = \\lambda \\cdot e^{-\\lambda} \\cdot e^{\\lambda} = \\lambda\\]</p><p><strong>\u65b9\u5dee\uff1a</strong>\u7c7b\u4f3c\u5730\u8ba1\u7b97 \\(\\mathbb{E}[X^2]\\)\uff0c\u7136\u540e \\(\\operatorname{Var}[X] = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2 = \\lambda\\)\u3002</p><p>\u671f\u671b\u548c\u65b9\u5dee\u90fd\u7b49\u4e8e \\(\\lambda\\)\u3002</p>' },
  { s: "#sol4", t: '<p>\\(\\mathbb{E}[X] = np\\)\uff0c\\(\\operatorname{Var}[X] = np(1-p)\\)\u3002</p><p><strong>(a)</strong> \u7531\u5207\u6bd4\u96ea\u592b\uff1a\\(\\Pr[|X - np| > 2\\sqrt{np}] \\leq \\frac{np(1-p)}{4np} \\leq \\frac{1}{4}\\)\u3002</p><p><strong>(b)</strong> \\(p = 1/4\\)\uff0c\\(\\mathbb{E}[X] = n/4\\)\uff0c\\(\\operatorname{Var}[X] = 3n/16\\)\uff1a</p><ul><li>\u9a6c\u5c14\u53ef\u592b\uff1a\\(\\leq 1/2\\)</li><li>\u5207\u6bd4\u96ea\u592b\uff1a\\(\\leq 3/n\\)</li><li>\u5207\u5c14\u8bfa\u592b (\\(\\gamma=1\\))\uff1a\\(\\leq e^{-n/12}\\)</li><li>\u970d\u592b\u4e01 (\\(t=n/4\\))\uff1a\\(\\leq e^{-n/8}\\)</li></ul><p>\u9a6c\u5c14\u53ef\u592b\u6700\u5f31\uff08\u5e38\u6570\uff09\u3002\u5207\u6bd4\u96ea\u592b\u662f\u591a\u9879\u5f0f\u3002\u5207\u5c14\u8bfa\u592b\u548c\u970d\u592b\u4e01\u662f\u6307\u6570\u7ea7\u7684\u3002</p><p><strong>(c)</strong> \\(p = 1/(2n)\\)\uff1a\u9a6c\u5c14\u53ef\u592b\u7ed9\u51fa \\(1/2\\)\uff1b\u5207\u6bd4\u96ea\u592b\u7ed9\u51fa\u65e0\u6548\u754c \\(\\approx 2\\)\uff1b\u5207\u5c14\u8bfa\u592b\u7ed9\u51fa \\(e^{-1/6} \\approx 0.85\\)\u3002\u7cbe\u786e\u503c\u4e3a \\(\\approx 0.39\\)\u3002\u8fd9\u91cc\u9a6c\u5c14\u53ef\u592b\u5b9e\u9645\u4e0a\u662f\u6700\u597d\u7684\u754c\uff01</p>' },
  { s: "#sol5", t: '<p>\u91cd\u590d\uff1a\u8fd0\u884c \\(A\\)\uff0c\u68c0\u67e5\u8f93\u51fa\u3002\u5982\u679c\u6b63\u786e\uff0c\u8fd4\u56de\uff1b\u5426\u5219\u7528\u65b0\u7684\u968f\u673c\u6bd4\u7279\u518d\u6b21\u8fd0\u884c\u3002</p><p>\u6bcf\u6b21\u91cd\u590d\u82b1\u8d39 \\(T + O(1) = O(T)\\)\u3002\u91cd\u590d\u6b21\u6570 \\(K\\) \u670d\u4ece\u51e0\u4f55\u5206\u5e03\uff1a\\(\\Pr[K \\geq k] = p^{k-1}\\)\u3002</p><p>\\[\\mathbb{E}[\\text{\u8fd0\u884c\u65f6\u95f4}] = O(T) \\cdot \\frac{1}{1-p} = O(T) \\quad \\square\\]</p>' },
  { s: "#sol6", t: '<p>\u540c\u65f6\u8fd0\u884c \\(A\\) \u548c \\(B\\)\uff1a</p><ul><li>\\(A\\) \u8f93\u51fa\u201cyes\u201d \u2192 \u7b54\u6848\u662f\u201cyes\u201d\uff08\u56e0\u4e3a \\(A\\) \u5f53\u7b54\u6848\u4e3a no \u65f6\u7edd\u4e0d\u4f1a\u8bf4 yes\uff09</li><li>\\(B\\) \u8f93\u51fa\u201cno\u201d \u2192 \u7b54\u6848\u662f\u201cno\u201d\uff08\u56e0\u4e3a \\(B\\) \u5f53\u7b54\u6848\u4e3a yes \u65f6\u7edd\u4e0d\u4f1a\u8bf4 no\uff09</li><li>\\(A\\) \u8bf4\u201cno\u201d\u4e14 \\(B\\) \u8bf4\u201cyes\u201d \u2192 \u4e0d\u786e\u5b9a\uff0c\u91cd\u590d</li></ul><p>\u9700\u8981\u91cd\u590d\u7684\u6982\u7387\u81f3\u591a\u4e3a \\(1/2\\)\u3002\u56e0\u6b64\u671f\u671b\u8fd0\u884c\u65f6\u95f4\u4e3a \\(O(T(|x|))\\)\u3002</p>' },
  { s: "#sol7", t: "<p>\u91cd\u590d \\(k\\) \u6b21\u5e76\u53d6<strong>\u591a\u6570\u8868\u51b3</strong>\u3002\u5e94\u7528\u5207\u5c14\u8bfa\u592b/\u970d\u592b\u4e01\u754c\u8bc1\u660e\u5931\u8d25\u6982\u7387\u968f \\(k\\) \u6307\u6570\u8870\u51cf\u3002\u8bbe \\(k = O(\\log(1/\\delta))\\) \u5373\u53ef\u3002\u8d44\u6e90\uff1a\\(T\\prime = O(kT) = O(T\\log(1/\\delta))\\)\u3002</p>" },
  { s: "#sol8", t: '<p>\u91cd\u590d \\(k\\) \u6b21\u3002\u5982\u679c<em>\u4efb\u4f55</em>\u4e00\u6b21\u8fd4\u56de\u201cgood\u201d\u5219\u8fd4\u56de\u201cgood\u201d\uff08\u8fd9\u4fdd\u6301\u4e86\u96f6\u5047\u9633\u6027\u7387\uff09\u3002\u5f53 \\(x\\) \u771f\u6b63\u4e3a good \u65f6\u4ece\u672a\u770b\u5230\u201cgood\u201d\u7684\u6982\u7387\u81f3\u591a\u4e3a \\((9/10)^k\\)\u3002\u8bbe \\(k = O(\\log(1/\\delta))\\)\u3002</p>' },
  { s: "#sol9", t: "<p><strong>(a)</strong> \\(\\Pr[X > (1+\\gamma)\\mu] = \\Pr[e^{tX} > e^{t(1+\\gamma)\\mu}]\\)\uff0c\u5bf9\u4efb\u610f \\(t > 0\\)\u3002</p><p><strong>(b)</strong> \u7531\u9a6c\u5c14\u53ef\u592b + \u72ec\u7acb\u6027\uff1a\\(\\leq \\frac{(\\mathbb{E}[e^{tX_1}])^n}{e^{t(1+\\gamma)np}}\\)\u3002</p><p><strong>(c)</strong> \\(\\mathbb{E}[e^{tX_1}] = 1 + p(e^t - 1)\\)\uff0c\u5f97 \\(\\leq \\frac{(1 + p(e^t-1))^n}{e^{t(1+\\gamma)np}}\\)\u3002</p><p><strong>(d)</strong> \u7528 \\(\\ln(1+x) \\leq x\\)\uff1a\\(\\leq e^{-np \\cdot f(t)}\\)\uff0c\u5176\u4e2d \\(f(t) = (1+\\gamma)t - (e^t - 1)\\)\u3002</p><p><strong>(e)</strong> \u6700\u5927\u5316 \\(f\\)\uff1a\u4ee4 \\(f\\prime(t) = (1+\\gamma) - e^t = 0\\)\uff0c\u5f97 \\(t = \\ln(1+\\gamma)\\)\u3002\u4ee3\u5165\u5e76\u7528 \\((1+\\gamma)\\ln(1+\\gamma) - \\gamma \\geq \\gamma^2/3\\) \u5b8c\u6210\u8bc1\u660e\u3002</p>" },
  { s: "#sol10", t: '<p>\u65b9\u6cd5\u4e0e\u95ee\u9898 9 \u7c7b\u4f3c\uff0c\u4f46\u4f7f\u7528 \\(e^{-tX}\\)\uff08\u9012\u51cf\u51fd\u6570\uff09\u3002\u540c\u6837\u7684 MGF \u8ba1\u7b97\u9002\u7528\uff0c\u5bf9 \\(t\\) \u4f18\u5316\u5f97\u5230\u7565\u6709\u4e0d\u540c\u7684\u5e38\u6570\uff0c\u4ea7\u751f\u6307\u6570\u4e2d\u7684 \\(\\gamma^2/2\\)\u3002\u63a8\u5e7f\u5230 \\(X_i \\in [0,1]\\)\uff08\u975e i.i.d.\uff09\u6210\u7acb\uff0c\u56e0\u4e3a MGF \u754c \\(\\mathbb{E}[e^{tX_i}] \\leq 1 + \\mathbb{E}[X_i](e^t - 1)\\) \u7531\u6307\u6570\u51fd\u6570\u7684\u51f8\u6027\u4ecd\u7136\u6210\u7acb\u3002</p>' },
  { s: "#sol11", t: '<p><strong>(a)</strong> \u4e2d\u4f4d\u6570\u5c0f\u4e8e \\(a_x\\) \u5f53\u4e14\u4ec5\u5f53\u8d85\u8fc7 \\(k/2\\) \u4e2a\u8f93\u51fa\u4f4e\u4e8e \\(a_x\\)\u3002\u6bcf\u4e2a\u72ec\u7acb\u5730\u4f4e\u4e8e \\(a_x\\) \u7684\u6982\u7387 \\(\\leq \\alpha < 1/2\\)\u3002\u7531\u5207\u5c14\u8bfa\u592b/\u970d\u592b\u4e01\u754c\uff1a\\(\\Pr[\\text{\u4e2d\u4f4d\u6570} < a_x] \\leq e^{-\\Theta(k)}\\)\u3002\u8d85\u8fc7 \\(b_x\\) \u7684\u60c5\u51b5\u7c7b\u4f3c\u3002\u7531\u8054\u5408\u754c\uff0c\u603b\u5931\u8d25\u6982\u7387 \\(\\leq 2e^{-\\Theta(k)}\\)\u3002</p><p><strong>(b)</strong> \u8bbe \\(k \\geq C \\cdot \\log(2/\\delta)\\)\uff08\u5bf9\u9002\u5f53\u5e38\u6570 \\(C > 0\\)\uff0c\u53d6\u51b3\u4e8e \\(\\alpha\\)\uff09\u5373\u53ef\u8fbe\u5230\u5931\u8d25\u6982\u7387 \\(\\leq \\delta\\)\u3002</p>' },

  // Quiz
];

// ===================== CHAPTER 2 MATH PAGE TRANSLATIONS =====================
var MATH2_T = [
  { s: '.back-bar a[href="chapter2-study.html"]', t: "&larr; 返回第二章学习指南" },
  { s: '.back-bar a[href="../../../index.html"]', t: "&larr; 课程主页" },
  { s: ".back-bar .page-title-bar", t: "数学基础 — 第二章" },

  // TOC groups
  { s: ".toc-group", i: 0, t: "基础" },
  { s: ".toc-group", i: 1, t: "分布" },
  { s: ".toc-group", i: 2, t: "不等式" },
  { s: ".toc-group", i: 3, t: "技巧" },
  { s: ".toc-group", i: 4, t: "测验" },

  // TOC links
  { s: '[href="#sec-mgf"]', t: "矩母函数" },
  { s: '[href="#sec-exp-properties"]', t: "指数与对数" },
  { s: '[href="#sec-series"]', t: "级数与收敛" },
  { s: '[href="#sec-poisson"]', t: "泊松分布" },
  { s: '[href="#sec-geometric"]', t: "几何分布" },
  { s: '[href="#sec-markov-deep"]', t: "马尔可夫深入" },
  { s: '[href="#sec-chebyshev-deep"]', t: "切比雪夫深入" },
  { s: '[href="#sec-chernoff-proof"]', t: "切尔诺夫证明" },
  { s: '[href="#sec-hoeffding-detail"]', t: "霍夫丁详解" },
  { s: '[href="#sec-optimization"]', t: "微积分优化" },
  { s: '[href="#sec-key-inequalities"]', t: "关键分析不等式" },

  // Section titles
  { s: "#sec-mgf .section-title", t: "矩母函数" },
  { s: "#sec-mgf h3", i: 0, t: "为什么需要矩母函数？" },
  { s: "#sec-mgf h3", i: 1, t: "关键性质" },
  { s: "#sec-exp-properties .section-title", t: "指数与对数性质" },
  { s: "#sec-exp-properties .concept-box h3", t: "关键不等式：\\(\\ln(1+x) \\leq x\\)" },
  { s: "#sec-series .section-title", t: "级数与收敛" },
  { s: "#sec-series .concept-box:nth-of-type(1) h3", t: "几何级数" },
  { s: "#sec-series .concept-box:nth-of-type(2) h3", t: "指数级数" },
  { s: "#sec-series .concept-box:nth-of-type(3) h3", t: "\\(\\ln(1+\\gamma)\\) 的泰勒展开" },
  { s: "#sec-poisson .section-title", t: "泊松分布" },
  { s: "#sec-geometric .section-title", t: "几何分布" },
  { s: "#sec-geometric .concept-box:nth-of-type(2) h3", t: "尾和公式" },
  { s: "#sec-markov-deep .section-title", t: "马尔可夫不等式：深入" },
  { s: "#sec-markov-deep .concept-box h3", t: "陈述" },
  { s: "#sec-markov-deep h3", i: 1, t: "证明（指示变量法）" },
  { s: "#sec-markov-deep h3", i: 2, t: "马尔可夫何时紧？" },
  { s: "#sec-markov-deep h3", i: 3, t: "\u2018一阶矩方法\u2019" },
  { s: "#sec-chebyshev-deep .section-title", t: "切比雪夫不等式：深入" },
  { s: "#sec-chebyshev-deep .concept-box h3", t: "陈述" },
  { s: "#sec-chebyshev-deep h3", i: 1, t: "从马尔可夫推导" },
  { s: "#sec-chebyshev-deep h3", i: 2, t: "标准差解读" },
  { s: "#sec-chebyshev-deep h3", i: 3, t: "两两独立即可" },
  { s: "#sec-chernoff-proof .section-title", t: "切尔诺夫界：完整证明" },
  { s: "#sec-chernoff-proof h3", i: 0, t: "步骤 1：指数变换" },
  { s: "#sec-chernoff-proof h3", i: 1, t: "步骤 2：马尔可夫不等式" },
  { s: "#sec-chernoff-proof h3", i: 2, t: "步骤 3：独立性 + 矩母函数" },
  { s: "#sec-chernoff-proof h3", i: 3, t: "步骤 4：应用 \\(\\ln(1+x) \\leq x\\)" },
  { s: "#sec-chernoff-proof h3", i: 4, t: "步骤 5：对 \\(t\\) 优化" },
  { s: "#sec-chernoff-proof h3", i: 5, t: "步骤 6：最终化简" },
  { s: "#sec-hoeffding-detail .section-title", t: "霍夫丁界：详解" },
  { s: "#sec-hoeffding-detail .concept-box:nth-of-type(1) h3", t: "一般形式" },
  { s: "#sec-hoeffding-detail .concept-box:nth-of-type(2) h3", t: "i.i.d. 简化形式" },
  { s: "#sec-hoeffding-detail .concept-box:nth-of-type(3) h3", t: "切尔诺夫 vs 霍夫丁" },
  { s: "#sec-optimization .section-title", t: "证明中的微积分优化" },
  { s: "#sec-optimization .concept-box h3", t: "\u2018自由参数\u2019技巧" },
  { s: "#sec-key-inequalities .section-title", t: "\u5173\u952e\u5206\u6790\u4e0d\u7b49\u5f0f" },

  // MGF content
  { s: "#sec-mgf .concept-box p", i: 0, t: "\u968f\u673a\u53d8\u91cf \\(X\\) \u7684<strong>\u77e9\u6bcd\u51fd\u6570\uff08MGF\uff09</strong>\u5b9a\u4e49\u4e3a\uff1a" },
  { s: "#sec-mgf .concept-box p", i: 1, t: "\u5f53\u6b64\u671f\u671b\u5728 0 \u7684\u90bb\u57df\u5185\u5bf9 \\(t\\) \u5b58\u5728\u65f6\u3002" },
  { s: "#sec-mgf > p", t: "MGF \u662f\u5207\u5c14\u8bfa\u592b\u754c\u80cc\u540e\u7684\u5173\u952e\u5de5\u5177\u3002\u5176\u601d\u60f3\u662f\u5c06\u4e8b\u4ef6 \\(\\{X \\geq a\\}\\) \u53d8\u6362\u4e3a \\(\\{e^{tX} \\geq e^{ta}\\}\\)\uff0c\u7136\u540e\u5bf9\u975e\u8d1f\u968f\u673a\u53d8\u91cf \\(e^{tX}\\) \u5e94\u7528\u9a6c\u5c14\u53ef\u592b\u4e0d\u7b49\u5f0f\u3002" },

  // Exp properties content
  { s: "#sec-exp-properties .concept-box p", i: 0, t: "\u8fd9\u53ef\u4ee5\u8bf4\u662f\u5207\u5c14\u8bfa\u592b\u8bc1\u660e\u4e2d\u6700\u91cd\u8981\u7684\u5355\u4e2a\u4e0d\u7b49\u5f0f\u3002\u5b83\u6765\u81ea \\(\\ln\\) \u7684\u51f9\u6027\uff1a\u5728 \\(x=0\\) \u5904\u7684\u5207\u7ebf\uff08\u5373 \\(y = x\\)\uff09\u4f4d\u4e8e\u66f2\u7ebf\u4e4b\u4e0a\u3002" },
  { s: "#sec-exp-properties .concept-box p", i: 1, t: "\u7b49\u4ef7\u5f62\u5f0f\uff1a\\(1 + x \\leq e^x\\)\uff0c\u5bf9\u6240\u6709 \\(x \\in \\mathbb{R}\\) \u6210\u7acb\u3002" },
  { s: "#sec-exp-properties .symbol-grid .sym-cell:nth-child(2)", t: "\u6307\u6570\u51fd\u6570" },
  { s: "#sec-exp-properties .symbol-grid .sym-cell:nth-child(3)", t: "\u59cb\u7ec8\u4e3a\u6b63\uff1b\u51f8\uff1b\\(\\frac{d}{dx}e^x = e^x\\)" },
  { s: "#sec-exp-properties .symbol-grid .sym-cell:nth-child(5)", t: "\u81ea\u7136\u5bf9\u6570" },
  { s: "#sec-exp-properties .symbol-grid .sym-cell:nth-child(6)", t: "\\(e^x\\) \u7684\u53cd\u51fd\u6570\uff1b\u51f9\uff1b\u5b9a\u4e49\u57df \\(x > 0\\)" },
  { s: "#sec-exp-properties .symbol-grid .sym-cell:nth-child(8)", t: "\u57fa\u672c\u4e0d\u7b49\u5f0f" },
  { s: "#sec-exp-properties .symbol-grid .sym-cell:nth-child(9)", t: "\u7528\u4e8e\u5207\u5c14\u8bfa\u592b\u8bc1\u660e\uff1b\u4ec5\u5728 \\(x=0\\) \u65f6\u53d6\u7b49" },
  { s: "#sec-exp-properties .symbol-grid .sym-cell:nth-child(11)", t: "\u7b49\u4ef7\u5f62\u5f0f" },
  { s: "#sec-exp-properties .symbol-grid .sym-cell:nth-child(12)", t: "\u5bf9 \\(\\ln(1+x) \\leq x\\) \u4e24\u8fb9\u53d6\u6307\u6570\u5f97\u5230" },

  // Series content
  { s: "#sec-series .concept-box:nth-of-type(1) p", i: 1, t: "\u5728\u7b97\u6cd5\u5206\u6790\u4e2d\u5e7f\u6cdb\u4f7f\u7528\uff08\u4f8b\u5982\uff0c\u754c\u5b9a\u51e0\u4f55\u91cd\u590d\u7684\u671f\u671b\u6b21\u6570\uff09\u3002" },
  { s: "#sec-series .concept-box:nth-of-type(2) p", t: "\u7528\u4e8e\u8ba1\u7b97 MGF \u548c\u6cca\u677e\u6982\u7387\u3002\u5bf9\u6240\u6709 \\(x \\in \\mathbb{R}\\) \u6536\u655b\u3002" },
  { s: "#sec-series .concept-box:nth-of-type(3) p", t: "\u5c55\u5f00 \\((1+\\gamma)\\ln(1+\\gamma) - \\gamma = \\frac{\\gamma^2}{2} - O(\\gamma^3)\\) \u663e\u793a\u4e86\u5207\u5c14\u8bfa\u592b\u6307\u6570\u4e2d\u51fa\u73b0\u7684\u4e8c\u6b21\u4f9d\u8d56\u6027\u3002" },

  // Poisson content
  { s: "#sec-poisson .concept-box p", i: 2, t: "<strong>\u6cca\u677e\u6781\u9650\u5b9a\u7406\uff1a</strong>\u82e5 \\(X \\sim \\text{Bin}(n, p)\\) \u4e14 \\(n \\to \\infty\\) \u65f6 \\(np \\to \\lambda\\)\uff0c\u5219 \\(X\\) \u4f9d\u5206\u5e03\u6536\u655b\u5230 \\(\\text{Poisson}(\\lambda)\\)\u3002" },

  // Geometric content
  { s: "#sec-geometric .concept-box:nth-of-type(1) p", i: 0, t: "\u51e0\u4f55\u5206\u5e03\u6a21\u62df\u76f4\u5230\u7b2c\u4e00\u6b21\u6210\u529f\u7684\u72ec\u7acb\u8bd5\u9a8c\u6b21\u6570\u3002\u82e5\u6bcf\u6b21\u8bd5\u9a8c\u4ee5\u6982\u7387 \\(p\\) \u6210\u529f\uff1a" },
  { s: "#sec-geometric .concept-box:nth-of-type(1) p", i: 2, t: "\u8fd9\u76f4\u63a5\u51fa\u73b0\u5728 MC \u2192 LV \u8f6c\u6362\u4e2d\uff1a\u76f4\u5230\u6210\u529f\u7684\u91cd\u590d\u6b21\u6570\u670d\u4ece\u51e0\u4f55\u5206\u5e03\u3002" },

  // Markov Deep — content
  { s: "#sec-markov-deep > p", i: 0, t: "\u6ce8\u610f \\(t \\cdot \\mathbf{1}[X \\geq t] \\leq X\\) \u9010\u70b9\u6210\u7acb\uff08\u56e0\u4e3a \\(X \\geq 0\\)\uff09\u3002\u53d6\u671f\u671b\uff1a" },
  { s: "#sec-markov-deep > p", i: 1, t: "\u9a6c\u5c14\u53ef\u592b\u5bf9\u4e8e\u5c06\u6240\u6709\u8d28\u91cf\u653e\u5728 0 \u548c\u67d0\u4e2a\u503c \\(a > 0\\) \u4e0a\u7684\u968f\u673a\u53d8\u91cf\u662f\u7d27\u7684\u3002\u4f8b\u5982\uff0c\\(\\Pr[X = a] = 1/a\\)\uff0c\\(\\Pr[X = 0] = 1 - 1/a\\)\uff0c\u5219 \\(\\mathbb{E}[X] = 1\\) \u4e14 \\(\\Pr[X \\geq a] = 1/a = \\mathbb{E}[X]/a\\)\u3002" },
  { s: "#sec-markov-deep > p", i: 2, t: "\u9a6c\u5c14\u53ef\u592b\u4e0d\u7b49\u5f0f\u6709\u65f6\u88ab\u79f0\u4e3a<strong>\u4e00\u9636\u77e9\u65b9\u6cd5</strong>\uff0c\u56e0\u4e3a\u5b83\u53ea\u4f7f\u7528\u4e00\u9636\u77e9\uff08\\(\\mathbb{E}[X]\\)\uff09\u3002\u5207\u6bd4\u96ea\u592b\u4f7f\u7528\u4e8c\u9636\u77e9\uff08\u65b9\u5dee\uff09\uff0c\u5207\u5c14\u8bfa\u592b/MGF\u65b9\u6cd5\u4f7f\u7528\u6240\u6709\u77e9\u3002" },

  // Chebyshev Deep — content
  { s: "#sec-chebyshev-deep > p", i: 0, t: "\u5bf9 \\(Y = (X - \\mathbb{E}[X])^2 \\geq 0\\) \u5e94\u7528\u9a6c\u5c14\u53ef\u592b\uff1a" },
  { s: "#sec-chebyshev-deep > p", i: 1, t: "\u4ee4 \\(t = k\\sigma\\)\uff0c\u5176\u4e2d \\(\\sigma = \\sqrt{\\operatorname{Var}[X]}\\)\uff1a" },
  { s: "#sec-chebyshev-deep > p", i: 2, t: "\u5207\u6bd4\u96ea\u592b\u53ea\u7528 \\(\\operatorname{Var}[X]\\)\u3002\u5bf9\u4e8e \\(X = \\sum X_i\\)\uff0c\u6211\u4eec\u9700\u8981 \\(\\operatorname{Var}[\\sum X_i] = \\sum \\operatorname{Var}[X_i]\\)\uff0c\u8fd9\u5728<strong>\u4e24\u4e24\u72ec\u7acb</strong>\u4e0b\u6210\u7acb\uff08\u4e0d\u9700\u8981\u5b8c\u5168\u72ec\u7acb\uff09\u3002\u8fd9\u6bd4\u5207\u5c14\u8bfa\u592b\u7684\u8981\u6c42\u4e25\u683c\u5f31\u3002" },

  // Chernoff proof content
  { s: "#sec-chernoff-proof .concept-box p", t: "\u6211\u4eec\u8bc1\u660e\uff1a\u5bf9 \\(X_1, \\ldots, X_n\\) i.i.d. \\(\\text{Bern}(p)\\)\uff0c\\(X = \\sum X_i\\)\uff0c\u4e14 \\(\\gamma \\in (0,1]\\)\uff1a" },

  // Hoeffding content
  { s: "#sec-hoeffding-detail .concept-box:nth-of-type(2) p", i: 1, t: "\u8fd9\u662f\u4e00\u4e2a<strong>\u52a0\u6027</strong>\u754c\uff1a\u504f\u5dee\u7528\u7edd\u5bf9\u91cf \\(\\varepsilon\\) \u5ea6\u91cf\uff0c\u800c\u4e0d\u662f\u76f8\u5bf9\u4e8e \\(\\mu\\)\u3002" },

  // Optimization content
  { s: "#sec-optimization .concept-box p", i: 0, t: "\u5728\u5207\u5c14\u8bfa\u592b\u8bc1\u660e\u4e2d\uff0c\u6211\u4eec\u63a8\u5bfc\u51fa\u5bf9<em>\u4efb\u610f</em> \\(t > 0\\) \u6210\u7acb\u7684\u754c\u3002\u7531\u4e8e\u6bcf\u4e2a \\(t\\) \u7684\u9009\u62e9\u90fd\u7ed9\u51fa\u4e00\u4e2a\u6709\u6548\u7684\u4e0a\u754c\uff0c\u6211\u4eec\u4f18\u5316\u4ee5\u627e\u5230\u6700\u7d27\u7684\u90a3\u4e2a\uff1a" },
  { s: "#sec-optimization .concept-box p", i: 1, t: "\u8fd9\u662f\u4e00\u79cd\u5728\u968f\u673c\u7b97\u6cd5\u5206\u6790\u4e2d\u53cd\u590d\u51fa\u73b0\u7684\u6807\u51c6\u6280\u672f\u3002" },

  // Key inequalities — grid
  { s: "#sec-key-inequalities .symbol-grid .sym-header", i: 0, t: "\u4e0d\u7b49\u5f0f" },
  { s: "#sec-key-inequalities .symbol-grid .sym-header", i: 1, t: "\u6761\u4ef6" },
  { s: "#sec-key-inequalities .symbol-grid .sym-header", i: 2, t: "\u7528\u9014" },
  { s: "#sec-key-inequalities .symbol-grid .sym-cell:nth-child(6)", t: "\u5207\u5c14\u8bfa\u592b\u754c\u8bc1\u660e\uff08\u6b65\u9aa4 4\uff09" },
  { s: "#sec-key-inequalities .symbol-grid .sym-cell:nth-child(9)", t: "\u7b49\u4ef7\u4e8e\u4e0a\u8ff0\uff1b\u754c\u5b9a\u4e58\u79ef" },
  { s: "#sec-key-inequalities .symbol-grid .sym-cell:nth-child(12)", t: "\u7b80\u5316\u5207\u5c14\u8bfa\u592b\u6307\u6570" },
  { s: "#sec-key-inequalities .symbol-grid .sym-cell:nth-child(15)", t: "\u4e0b\u5c3e\u5207\u5c14\u8bfa\u592b\u754c" },
  { s: "#sec-key-inequalities .symbol-grid .sym-cell:nth-child(18)", t: "\u8fd1\u4f3c\u4e8c\u9879\u5f0f\u5c3e\u90e8" },
  { s: "#sec-key-inequalities .symbol-grid .sym-cell:nth-child(21)", t: "\u4e0a\u8ff0\u7684\u7279\u4f8b\uff1b\u975e\u5e38\u5e38\u89c1" },

  // Math quiz buttons
  { s: "#btnMathQuizSubmit", t: "\u63d0\u4ea4\u7b54\u6848" },
];

// ===================== CHAPTER 3 MATH PAGE TRANSLATIONS =====================
var MATH3_T = [
  { s: ".back-bar a:first-child", t: "\u2190 \u5b66\u4e60\u6307\u5357" },
  { s: ".page-title-bar", t: "\u7b2c\u4e09\u7ae0 \u00b7 \u6570\u5b66\u57fa\u7840" },
  { s: ".toc-sidebar .home-link", t: "\u2190 \u8bfe\u7a0b\u4e3b\u9875" },
  { s: ".toc-sidebar .sidebar-brand h2", t: "\u7b2c3\u7ae0\u6570\u5b66" },
  { s: 'a.toc-link[href="#sec-counting"]', t: "\u8ba1\u6570\u4e0e\u7ec4\u5408" },
  { s: 'a.toc-link[href="#sec-stirling"]', t: "Stirling \u8fd1\u4f3c" },
  { s: 'a.toc-link[href="#sec-harmonic"]', t: "\u8c10\u6ce2\u6570" },
  { s: 'a.toc-link[href="#sec-geometric"]', t: "\u51e0\u4f55\u5206\u5e03" },
  { s: 'a.toc-link[href="#sec-indicators"]', t: "\u6307\u793a\u53d8\u91cf\u4e0e\u65b9\u5dee" },
  { s: 'a.toc-link[href="#sec-moment"]', t: "\u77e9\u65b9\u6cd5" },
  { s: 'a.toc-link[href="#sec-poisson"]', t: "Poisson \u8fd1\u4f3c" },
  { s: 'a.toc-link[href="#sec-jensen"]', t: "Jensen \u4e0e MGF \u6280\u5de7" },
  { s: ".toc-sidebar .back-to-study", t: "\u2190 \u8fd4\u56de\u5b66\u4e60\u6307\u5357" },
  { s: "#hero h1", t: "\u6570\u5b66\u57fa\u7840\uff1a\u7403\u5165\u7bb1\u6a21\u578b" },
  { s: "#sec-counting .section-title", t: "\u8ba1\u6570\u4e0e\u7ec4\u5408\u6570\u5b66" },
  { s: "#sec-stirling .section-title", t: "Stirling \u8fd1\u4f3c\u516c\u5f0f" },
  { s: "#sec-harmonic .section-title", t: "\u8c10\u6ce2\u6570" },
  { s: "#sec-geometric .section-title", t: "\u51e0\u4f55\u5206\u5e03" },
  { s: "#sec-indicators .section-title", t: "\u6307\u793a\u53d8\u91cf\u4e0e\u65b9\u5dee\u8ba1\u7b97" },
  { s: "#sec-moment .section-title", t: "\u77e9\u65b9\u6cd5" },
  { s: "#sec-poisson .section-title", t: "Poisson \u8fd1\u4f3c" },
  { s: "#sec-jensen .section-title", t: "Jensen \u4e0d\u7b49\u5f0f\u4e0e MGF \u6280\u5de7" },

  // Hero content
  { s: ".hero-course", t: "COMPX270 \u2014 \u7b2c\u4e09\u7ae0\u8865\u5145" },
  { s: ".hero-subtitle", t: "\u751f\u65e5\u6096\u8bba\u3001\u8d60\u5238\u6536\u96c6\u8005\u548c\u8d1f\u8f7d\u5747\u8861\u80cc\u540e\u7684\u8ba1\u6570\u3001\u5206\u5e03\u7406\u8bba\u548c\u5206\u6790\u6280\u672f\u3002" },
  { s: '.back-bar a[href="../../../index.html"]', t: "&larr; \u8bfe\u7a0b\u4e3b\u9875" },

  // Counting content
  { s: "#sec-counting .def-box:nth-of-type(1) .def-label", t: "\u5b9a\u4e49 \u2014 \u4e8c\u9879\u5f0f\u7cfb\u6570" },
  { s: "#sec-counting .def-box.theorem-box .def-label", t: "\u4e8b\u5b9e 20.1 \u2014 \\(\\binom{n}{k}\\) \u7684\u5173\u952e\u754c" },
  { s: "#sec-counting h3", i: 0, t: "\u591a\u9879\u5f0f\u7cfb\u6570" },
  { s: "#sec-counting h3", i: 1, t: "\u8ba1\u6570\u5bf9\u6570" },
  { s: '#sec-counting [data-target="proof-upper-binom"]', t: "\u8bc1\u660e\u4e0a\u754c \\(\\binom{n}{k} \\leq (en/k)^k\\)" },

  // Stirling content
  { s: "#sec-stirling .def-box.theorem-box:nth-of-type(1) .def-label", t: "Stirling \u516c\u5f0f" },
  { s: "#sec-stirling h3", t: "\u751f\u65e5\u6096\u8bba\u7684\u5e94\u7528" },
  { s: "#sec-stirling .def-box.theorem-box:nth-of-type(2) .def-label", t: "\u5173\u952e\u6781\u9650" },
  { s: '#sec-stirling [data-target="proof-limit"]', t: "\u4e3a\u4ec0\u4e48 \\((1 - c/\\sqrt{n})^{\\sqrt{n}} \\to e^{-c}\\)" },

  // Harmonic content
  { s: "#sec-harmonic .def-box:nth-of-type(1) .def-label", t: "\u5b9a\u4e49 \u2014 \\(H_n\\)" },
  { s: "#sec-harmonic .def-box.theorem-box .def-label", t: "\u6e10\u8fd1\u5c55\u5f00" },
  { s: "#sec-harmonic h3", i: 0, t: "\u4e0e\u8d60\u5238\u6536\u96c6\u8005\u7684\u8054\u7cfb" },
  { s: "#sec-harmonic h3", i: 1, t: "Basel \u95ee\u9898" },

  // Geometric content
  { s: "#sec-geometric .def-box:nth-of-type(1) .def-label", t: "\u5b9a\u4e49 \u2014 Geometric(\\(p\\))" },
  { s: "#sec-geometric .col-card:nth-child(1) h3", t: "\u5747\u503c\u4e0e\u65b9\u5dee" },
  { s: "#sec-geometric .col-card:nth-child(2) h3", t: "\u65e0\u8bb0\u5fc6\u6027" },
  { s: "#sec-geometric h3", i: 0, t: "\u4e0e\u8d60\u5238\u6536\u96c6\u8005\u7684\u8054\u7cfb" },

  // Indicators content
  { s: "#sec-indicators .def-box:nth-of-type(1) .def-label", t: "\u56de\u987e \u2014 \u6307\u793a\u968f\u673c\u53d8\u91cf" },
  { s: "#sec-indicators h3", i: 0, t: "\u65b9\u5dee\u4f55\u65f6\u53ef\u52a0\uff1f" },
  { s: "#sec-indicators .def-box.warning-box .def-label", t: "\u4e24\u4e24\u72ec\u7acb vs \u5b8c\u5168\u72ec\u7acb" },
  { s: "#sec-indicators h3", i: 1, t: "\u78b0\u649e\u65b9\u5dee\u4e2d\u7684\u201c\u795e\u5947\u6d88\u9664\u201d" },

  // Moment content
  { s: "#sec-moment .def-box.theorem-box:nth-of-type(1) .def-label", t: "\u4e00\u9636\u77e9\u65b9\u6cd5\uff08\u6574\u6570\u968f\u673c\u53d8\u91cf\u7684\u9a6c\u5c14\u53ef\u592b\uff09" },
  { s: "#sec-moment .def-box.example-box:nth-of-type(1) .def-label", t: "\u5e94\u7528 \u2014 \u751f\u65e5\u4e0b\u754c" },
  { s: "#sec-moment .def-box.theorem-box:nth-of-type(2) .def-label", t: "\u4e8c\u9636\u77e9\u65b9\u6cd5" },
  { s: '#sec-moment [data-target="proof-second-moment"]', t: "\u4ece\u5207\u6bd4\u96ea\u592b\u63a8\u5bfc" },
  { s: "#sec-moment .def-box.example-box:nth-of-type(2) .def-label", t: "\u5e94\u7528 \u2014 \u751f\u65e5\u9608\u503c" },

  // Poisson content
  { s: "#sec-poisson .def-box.theorem-box .def-label", t: "\u6cca\u677e\u6781\u9650\u5b9a\u7406" },
  { s: "#sec-poisson .def-box:nth-of-type(2) .def-label", t: "Poisson PMF" },
  { s: "#sec-poisson h3", t: "\u6cca\u677e\u5316\u540e\u7684\u72ec\u7acb\u6027" },
  { s: "#sec-poisson .def-box.example-box .def-label", t: "\u8d1f\u8f7d\u5747\u8861\u4e2d\u7684\u5e94\u7528" },

  // Jensen content
  { s: "#sec-jensen .def-box.theorem-box .def-label", t: "Jensen \u4e0d\u7b49\u5f0f" },
  { s: "#sec-jensen .concept-box:nth-of-type(1) h3", t: "\u5173\u952e\u5b9e\u4f8b\uff1a\\(\\mathbb{E}[\\ln X] \\leq \\ln \\mathbb{E}[X]\\)" },
  { s: "#sec-jensen h3", i: 0, t: "MGF \u6280\u5de7\uff1a\u901a\u8fc7\u6307\u6570\u5316\u5c06 Max \u8f6c\u4e3a Sum" },
  { s: "#sec-jensen .def-box.example-box .def-label", t: "\u8d1f\u8f7d\u5747\u8861\u4e0a\u754c\u4e2d\u7684\u5e94\u7528" },
  { s: "#sec-jensen h3", i: 1, t: "\u81ea\u7531\u53c2\u6570\u4f18\u5316" },

  // Math quiz buttons
];

// ===================== CHAPTER 3 STUDY PAGE TRANSLATIONS =====================
var STUDY3_T = [
  { s: "[data-i18n-home]", t: "&larr; 课程主页" },

  // Sidebar nav
  { s: '[data-section="hero"]', t: "概览" },
  { s: '[data-section="sec-intro"]', t: "球入箱框架" },
  { s: '[data-section="sec-birthday"]', t: "生日悖论" },
  { s: '[data-section="sec-coupon"]', t: "赠券收集者" },
  { s: '[data-section="sec-load"]', t: "负载均衡" },
  { s: '[data-section="sec-two-choices"]', t: "两次选择的力量" },
  { s: '[data-section="sec-tutorial"]', t: "习题练习" },
  { s: 'a.nav-link[href="chapter3-math.html"]', t: "&#x1F4D0; 数学基础" },
  { s: 'a.nav-link[href="chapter3-mindmap.html"]', t: "&#x1F5FA; 思维导图" },

  // Hero
  { s: ".hero-course", t: "COMPX270 — 随机与高级算法" },
  { s: "#hero h1", t: "第三章：球入箱模型" },
  { s: ".hero-subtitle", t: "生日悖论、赠券收集者问题、负载均衡，以及两次选择的力量。" },
  { s: ".hero-cards .hero-card:nth-child(1) span:last-child", t: "碰撞与生日" },
  { s: ".hero-cards .hero-card:nth-child(2) span:last-child", t: "赠券收集者" },
  { s: ".hero-cards .hero-card:nth-child(3) span:last-child", t: "负载均衡" },
  { s: ".hero-cards .hero-card:nth-child(4) span:last-child", t: "习题与测验" },
  { s: 'a.btn[href="chapter3-math.html"]', t: "&#x1F4D0; 数学基础 &rarr;" },
  { s: 'a.btn[href="chapter3-mindmap.html"]', t: "&#x1F5FA; 思维导图 &rarr;" },

  // Section titles
  { s: "#sec-intro .section-title", t: "球入箱框架" },
  { s: "#sec-birthday .section-title", t: "碰撞与生日悖论" },
  { s: "#sec-coupon .section-title", t: "赠券收集者问题" },
  { s: "#sec-load .section-title", t: "负载均衡" },
  { s: "#sec-two-choices .section-title", t: "两次选择的力量" },
  { s: "#sec-tutorial .section-title", t: "习题练习" },

  // Solution buttons
  { s: '.solution-toggle[data-target="sol1"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol2"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol3"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol4"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol5"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol6"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol7"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol8"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol9"]', t: "查看解答" },
  { s: '.solution-toggle[data-target="sol10"]', t: "查看解答" },

  // Problem tags
  { s: ".problem-tag.warm-up", i: 0, t: "热身" },
  { s: ".problem-tag.warm-up", i: 1, t: "热身" },
  { s: ".problem-tag.warm-up", i: 2, t: "热身" },
  { s: ".problem-tag.problem-solving", i: 0, t: "解题" },
  { s: ".problem-tag.problem-solving", i: 1, t: "解题" },
  { s: ".problem-tag.problem-solving", i: 2, t: "解题" },
  { s: ".problem-tag.problem-solving", i: 3, t: "解题" },
  { s: ".problem-tag.advanced", i: 0, t: "\u8fdb\u9636" },
  { s: ".problem-tag.advanced", i: 1, t: "\u8fdb\u9636" },

  // Intro — content
  { s: "#sec-intro .concept-box:nth-of-type(1) p", i: 0, t: "<strong>\u8bbe\u7f6e\uff1a</strong>\u6211\u4eec\u6709 \\(m\\) \u4e2a\u7403\u548c \\(n\\) \u4e2a\u7bb1\u5b50\u3002\u6bcf\u4e2a\u7403\u72ec\u7acb\u5730\u5747\u5300\u968f\u673c\u629b\u5165 \\(n\\) \u4e2a\u7bb1\u5b50\u4e4b\u4e00\u3002" },
  { s: "#sec-intro .concept-box:nth-of-type(1) p", i: 1, t: "\u5c3d\u7ba1\u7b80\u5355\uff0c\u6b64\u6a21\u578b\u6355\u6349\u4e86\u4ee4\u4eba\u60ca\u8bb6\u7684\u5e7f\u6cdb\u5b9e\u9645\u95ee\u9898\uff1a\u54c8\u5e0c\u3001\u4efb\u52a1\u8c03\u5ea6\u3001\u8d44\u6e90\u5206\u914d\u3001\u5206\u5e03\u68c0\u9a8c\u7b49\u3002" },
  { s: "#sec-intro .concept-box:nth-of-type(2) h3", t: "\u6211\u4eec\u5173\u5fc3\u7684\u4e09\u4ef6\u4e8b" },
  { s: "#sec-intro .info-card:nth-child(1) h4", t: "1. \u78b0\u649e" },
  { s: "#sec-intro .info-card:nth-child(1) p", t: "\u6709\u591a\u5c11\u5bf9\u7403\u843d\u5165\u540c\u4e00\u4e2a\u7bb1\u5b50\uff1f\u5bfc\u5411<strong>\u751f\u65e5\u6096\u8bba</strong>\u3002" },
  { s: "#sec-intro .info-card:nth-child(2) h4", t: "2. \u8986\u76d6" },
  { s: "#sec-intro .info-card:nth-child(2) p", t: "\u9700\u8981\u591a\u5c11\u4e2a\u7403\u624d\u80fd\u8ba9\u6bcf\u4e2a\u7bb1\u5b50\u81f3\u5c11\u6709\u4e00\u4e2a\uff1f<strong>\u8d60\u5238\u6536\u96c6\u8005</strong>\u95ee\u9898\u3002" },
  { s: "#sec-intro .info-card:nth-child(3) h4", t: "3. \u6700\u5927\u8d1f\u8f7d" },
  { s: "#sec-intro .info-card:nth-child(3) p", t: "\u4efb\u4e00\u7bb1\u5b50\u4e2d\u6700\u591a\u6709\u591a\u5c11\u4e2a\u7403\uff1f<strong>\u8d1f\u8f7d\u5747\u8861</strong>\u548c<strong>\u4e24\u6b21\u9009\u62e9\u7684\u529b\u91cf</strong>\u3002" },

  // Birthday — content
  { s: "#sec-birthday .theorem-box:nth-of-type(1) h3", t: "\u5b9a\u7406 15\uff08\u751f\u65e5\u6096\u8bba\uff09" },
  { s: "#sec-birthday .theorem-box:nth-of-type(1) p", t: "\u5982\u679c\u4f60\u53ec\u96c6 <strong>23 \u4eba</strong>\u5728\u4e00\u4e2a\u623f\u95f4\u91cc\uff0c\u90a3\u4e48\u81f3\u5c11\u6709 <strong>50%</strong> \u7684\u6982\u7387\u6709\u4e24\u4eba\u540c\u4e00\u5929\u751f\u65e5\u3002" },
  { s: "#sec-birthday .theorem-box:nth-of-type(2) h3", t: "\u5b9a\u7406 16\uff08\u7cbe\u786e\u78b0\u649e\u6982\u7387\uff09" },
  { s: "#sec-birthday .concept-box:nth-of-type(1) h3", t: "\u671f\u671b\u78b0\u649e\u6570" },
  { s: "#sec-birthday .concept-box:nth-of-type(2) h3", t: "\u65b9\u5dee\uff1a\u201c\u795e\u5947\u7684\u6d88\u6389\u201d" },
  { s: '#sec-birthday [data-target="proof-variance"]', t: "\u663e\u793a\u65b9\u5dee\u8bc1\u660e" },
  { s: "#sec-birthday .theorem-box:nth-of-type(3) h3", t: "\u5b9a\u7406 17\uff08\u78b0\u649e\u9608\u503c\uff09" },

  // Birthday — simulator
  { s: "#sec-birthday .sim-container > h3", t: "\u4ea4\u4e92\uff1a\u751f\u65e5\u6096\u8bba\u6a21\u62df" },
  { s: "#sec-birthday .sim-container > p", t: "\u9009\u62e9\u4eba\u6570\u5e76\u8fd0\u884c\u5b9e\u9a8c\uff0c\u89c2\u5bdf\u751f\u65e5\u78b0\u649e\u4f55\u65f6\u53d1\u751f\u3002" },
  { s: "#btnRunBday", t: "\u8fd0\u884c\u4e00\u6b21" },
  { s: "#btnRunBday1000", t: "\u8fd0\u884c 1000 \u6b21" },
  { s: "#btnResetBday", t: "\u91cd\u7f6e" },
  { s: "#sec-birthday .stat-card:nth-child(1) .stat-label", t: "\u4e0a\u6b21\u7ed3\u679c" },
  { s: "#sec-birthday .stat-card:nth-child(2) .stat-label", t: "\u603b\u8bd5\u9a8c\u6b21\u6570" },
  { s: "#sec-birthday .stat-card:nth-child(3) .stat-label", t: "\u78b0\u649e\u6b21\u6570" },
  { s: "#sec-birthday .stat-card:nth-child(4) .stat-label", t: "\u78b0\u649e\u7387" },
  { s: "#sec-birthday .stat-card:nth-child(5) .stat-label", t: "\u7406\u8bba\u503c" },

  // Coupon — content
  { s: "#sec-coupon .concept-box:nth-of-type(1) p", i: 0, t: "<strong>\u95ee\u9898\uff1a</strong>\u9700\u8981\u629b\u591a\u5c11\u4e2a\u7403 \\(M(n)\\)\uff08\u5747\u5300\u968f\u673c\u629b\u5165 \\(n\\) \u4e2a\u7bb1\u5b50\uff09\u624d\u80fd\u8ba9\u6bcf\u4e2a\u7bb1\u5b50\u90fd\u81f3\u5c11\u5305\u542b\u4e00\u4e2a\u7403\uff1f" },
  { s: "#sec-coupon .concept-box:nth-of-type(1) p", i: 1, t: "\u7b49\u4ef7\u5730\uff1a\u4f60\u9700\u8981\u4e70\u591a\u5c11\u76d2\u9ea6\u7247\u624d\u80fd\u6536\u96c6\u5230\u6240\u6709 \\(n\\) \u79cd\u4e0d\u540c\u7684\u8d60\u5238\uff1f" },
  { s: "#sec-coupon .theorem-box:nth-of-type(1) h3", t: "\u5b9a\u7406 18\uff08\u8d60\u5238\u6536\u96c6\u8005\uff09" },
  { s: '#sec-coupon [data-target="proof-coupon"]', t: "\u663e\u793a\u8bc1\u660e" },
  { s: "#sec-coupon .theorem-box:nth-of-type(2) h3", t: "\u5b9a\u7406 19\uff08\u65b9\u5dee\u754c\uff09" },
  { s: '#sec-coupon [data-target="proof-coupon-var"]', t: "\u663e\u793a\u8bc1\u660e" },

  // Coupon — simulator
  { s: "#sec-coupon .sim-container > h3", t: "\u4ea4\u4e92\uff1a\u8d60\u5238\u6536\u96c6\u8005\u6a21\u62df" },
  { s: "#sec-coupon .sim-container > p", t: "\u9009\u62e9\u7bb1\u5b50\u6570 \\(n\\)\uff0c\u7136\u540e\u8fd0\u884c\u5b9e\u9a8c\uff0c\u770b\u770b\u9700\u8981\u591a\u5c11\u4e2a\u7403\u624d\u80fd\u586b\u6ee1\u6240\u6709\u7bb1\u5b50\u3002" },
  { s: "#btnRunCoupon", t: "\u8fd0\u884c\u4e00\u6b21" },
  { s: "#btnRunCoupon100", t: "\u8fd0\u884c 100 \u6b21" },
  { s: "#btnResetCoupon", t: "\u91cd\u7f6e" },
  { s: "#sec-coupon .stat-card:nth-child(1) .stat-label", t: "\u4e0a\u6b21\u7ed3\u679c" },
  { s: "#sec-coupon .stat-card:nth-child(2) .stat-label", t: "\u8bd5\u9a8c\u6b21\u6570" },
  { s: "#sec-coupon .stat-card:nth-child(3) .stat-label", t: "\u5e73\u5747\u503c" },
  { s: "#sec-coupon .stat-card:nth-child(4) .stat-label", t: "\u7406\u8bba\u503c (nH_n)" },

  // Load — content
  { s: "#sec-load .concept-box:nth-of-type(1) p", i: 0, t: "<strong>\u95ee\u9898\uff1a</strong>\u5c06 \\(n\\) \u4e2a\u7403\u5747\u5300\u72ec\u7acb\u5730\u968f\u673c\u629b\u5165 \\(n\\) \u4e2a\u7bb1\u5b50\u3002\u671f\u671b\u6700\u5927\u8d1f\u8f7d \\(L(n) = \\mathbb{E}[\\max_{1 \\leq i \\leq n} L_i]\\) \u662f\u591a\u5c11\uff1f" },
  { s: "#sec-load .concept-box:nth-of-type(2) h3", t: "\u901a\u8fc7\u5207\u6bd4\u96ea\u592b + \u8054\u5408\u754c\u7684\u7b80\u5355\u754c" },
  { s: "#sec-load .theorem-box h3", t: "\u5b9a\u7406 20\uff08\u6700\u5927\u8d1f\u8f7d\uff09" },
  { s: '#sec-load [data-target="proof-load-upper"]', t: "\u663e\u793a\u4e0a\u754c\u8bc1\u660e" },
  { s: "#sec-load .concept-box:nth-of-type(3) h3", t: "\u66ff\u4ee3 MGF \u8bc1\u660e\uff08\u8fdb\u9636\uff09" },

  // Load — simulator
  { s: "#sec-load .sim-container > h3", t: "\u4ea4\u4e92\uff1a\u8d1f\u8f7d\u5747\u8861\u6a21\u62df" },
  { s: "#sec-load .sim-container > p", t: "\u5c06 \\(n\\) \u4e2a\u7403\u629b\u5165 \\(n\\) \u4e2a\u7bb1\u5b50\uff0c\u89c2\u5bdf\u6700\u5927\u8d1f\u8f7d\u3002" },
  { s: "#btnRunLoad", t: "\u8fd0\u884c\u4e00\u6b21" },
  { s: "#btnRunLoad100", t: "\u8fd0\u884c 100 \u6b21" },
  { s: "#btnResetLoad", t: "\u91cd\u7f6e" },
  { s: "#sec-load .stat-card:nth-child(1) .stat-label", t: "\u4e0a\u6b21\u6700\u5927\u8d1f\u8f7d" },
  { s: "#sec-load .stat-card:nth-child(2) .stat-label", t: "\u8bd5\u9a8c\u6b21\u6570" },
  { s: "#sec-load .stat-card:nth-child(3) .stat-label", t: "\u5e73\u5747\u6700\u5927\u8d1f\u8f7d" },
  { s: "#sec-load .stat-card:nth-child(4) .stat-label", t: "\u7406\u8bba\u754c" },

  // Two choices — content
  { s: "#sec-two-choices .concept-box:nth-of-type(1) p", i: 0, t: "<strong>\u7b56\u7565\uff1a</strong>\u6bcf\u4e2a\u7403\u4e0d\u662f\u968f\u673c\u9009\u4e00\u4e2a\u7bb1\u5b50\uff0c\u800c\u662f\u968f\u673c\u9009\u62e9<strong>\u4e24\u4e2a\u7bb1\u5b50</strong>\uff0c\u7136\u540e\u653e\u5165<strong>\u8d1f\u8f7d\u8f83\u5c0f</strong>\u7684\u90a3\u4e2a\uff08\u5e73\u5c40\u968f\u610f\u6253\u7834\uff09\u3002" },
  { s: "#sec-two-choices .concept-box:nth-of-type(1) p", i: 1, t: "\u8fd9\u4e2a\u770b\u4f3c\u5fae\u5c0f\u7684\u6539\u53d8\u5bf9\u6700\u5927\u8d1f\u8f7d\u6709\u5de8\u5927\u5f71\u54cd\u3002" },
  { s: "#sec-two-choices .theorem-box h3", t: "\u5b9a\u7406 21\uff08\u4e24\u6b21\u9009\u62e9\u7684\u529b\u91cf\uff09" },
  { s: "#sec-two-choices .concept-box:nth-of-type(2) h3", t: "\u76f4\u89c9\uff1a\u9012\u63a8\u5173\u7cfb" },

  // Two choices — comparison table
  { s: "#sec-two-choices .summary-table thead th", i: 0, t: "\u7b56\u7565" },
  { s: "#sec-two-choices .summary-table thead th", i: 1, t: "\u671f\u671b\u6700\u5927\u8d1f\u8f7d" },
  { s: "#sec-two-choices .summary-table thead th", i: 2, t: "\u589e\u957f" },
  { s: "#sec-two-choices .summary-table tbody td:nth-child(3)", i: 0, t: "\u6162" },
  { s: "#sec-two-choices .summary-table tbody td:nth-child(3)", i: 1, t: "\u975e\u5e38\u6162\uff08\u6307\u6570\u7ea7\u6539\u8fdb\uff01\uff09" },

  // Two choices — simulator
  { s: "#sec-two-choices .sim-container > h3", t: "\u4ea4\u4e92\uff1a\u5747\u5300 vs \u4e24\u6b21\u9009\u62e9\u5bf9\u6bd4" },
  { s: "#sec-two-choices .sim-container > p", t: "\u6bd4\u8f83\u5747\u5300\u968f\u673c\u5206\u914d\u4e0e\u4e24\u6b21\u9009\u62e9\u7b56\u7565\u4e0b\u7684\u6700\u5927\u8d1f\u8f7d\u3002" },
  { s: "#btnRunTwoChoice", t: "\u8fd0\u884c\u5bf9\u6bd4" },
  { s: "#sec-two-choices .stat-card:nth-child(1) .stat-label", t: "\u5747\u5300\u6700\u5927\u8d1f\u8f7d" },
  { s: "#sec-two-choices .stat-card:nth-child(2) .stat-label", t: "\u4e24\u6b21\u9009\u62e9\u6700\u5927\u8d1f\u8f7d" },
  { s: "#sec-two-choices .stat-card:nth-child(3) .stat-label", t: "\u6539\u8fdb\u500d\u6570" },

  // Tutorial — intro
  { s: "#sec-tutorial > p", t: "\u901a\u8fc7\u8fd9\u4e9b\u4e60\u9898\u5de9\u56fa\u4f60\u5bf9\u7403\u5165\u7bb1\u6a21\u578b\u7684\u7406\u89e3\u3002" },

  // Tutorial — problem text (summaries)
  { s: "#sec-tutorial .problem-card:nth-child(2) p", i: 0, t: "\u63a8\u5e7f\u8bb2\u4e49\u7b49\u5f0f (22) \u5230 \\(m > n\\) \u4e2a\u7403\uff0c\u8ba1\u7b97 \\(\\mathbb{E}[m \\text{ \u4e2a\u7403\u540e\u7684\u7a7a\u7bb1\u6570}]\\)\uff0c\u5e76\u6c42\u89e3 \\(m\\) \u4f7f\u8be5\u671f\u671b\u81f3\u591a\u4e3a \\(1/2\\)\u3002\u8bc1\u660e\u4f60\u5f97\u5230 \\(\\Theta(n \\log n)\\) \u7684\u754c\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(3) p", t: "\u7528\u5207\u6bd4\u96ea\u592b\u4e0d\u7b49\u5f0f\u754c\u5b9a \\(m(n)\\)\uff08\u6bcf\u4e2a\u7bb1\u5b50\u81f3\u5c11\u6709\u4e00\u4e2a\u7403\u6240\u9700\u7684\u7403\u6570\uff09\u5927\u4e8e \\(\\alpha n \\ln n\\)\uff08\\(\\alpha > 1\\)\uff09\u7684\u6982\u7387\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(4) p", t: "\u8bc1\u660e\u6bcf\u4e2a\u7bb1\u5b50\u81f3\u5c11\u5305\u542b<strong>\u4e24\u4e2a</strong>\u7403\u6240\u9700\u7684\u671f\u671b\u7403\u6570 \\(M_2(n)\\) \u4e3a \\(\\Theta(n \\log n)\\)\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(5) p", i: 0, t: "\u8bbe \\(c > 0\\) \u4e3a\u5e38\u6570\u3002\u5f53\u5c06 \\(m = cn\\ln n\\) \u4e2a\u7403\u629b\u5165 \\(n\\) \u4e2a\u7bb1\u5b50\u65f6\uff0c\u8bc1\u660e\u4ee5\u9ad8\u6982\u7387\u6bcf\u4e2a\u7bb1\u5b50\u6709 \\(\\Theta(\\ln n)\\) \u4e2a\u7403\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(6) p", i: 0, t: "\u5047\u8bbe\u7bb1\u5b50 \\(i\\) \u6709\u6982\u7387 \\(p_i\\)\uff08\\(\\sum p_i = 1\\)\uff09\u800c\u4e0d\u662f \\(1/n\\)\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(7) p", i: 0, t: "\uff08\u5f15\u5bfc\uff09\u8bc1\u660e\u5b9a\u7406 21\uff08\u4e24\u6b21\u9009\u62e9\u7684\u529b\u91cf\uff09\u7684\u8349\u56fe\uff1a" },
  { s: "#sec-tutorial .problem-card:nth-child(8) p", t: "\u8bc1\u660e\u5bf9\u4e8e\u8db3\u591f\u5927\u7684 \\(n\\)\uff0c\u5c06 \\(n\\) \u4e2a\u7403\u629b\u5165 \\(n\\) \u4e2a\u7bb1\u5b50\u65f6\u7a7a\u7bb1\u7684\u671f\u671b\u6570\u63a5\u8fd1 \\(n/e\\)\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(9) p", i: 0, t: "\u4f60\u73a9\u6fb3\u5927\u5229\u4e9a\u4e00\u7b49\u5956\u5f69\u7968\uff1a\u4ece 45 \u4e2a\u53f7\u7801\u4e2d\u731c 6 \u4e2a\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(10) p", i: 0, t: "<strong>\uff08\u6cca\u677e\u5316\uff09</strong>\u4e0d\u662f\u629b \\(m\\) \u4e2a\u7403\uff0c\u800c\u662f\u62bd\u53d6 \\(M \\sim \\text{Poi}(m)\\) \u5e76\u629b \\(M\\) \u4e2a\u7403\u3002\u8bbe \\(N_j\\) \u4e3a\u7bb1\u5b50 \\(j\\) \u4e2d\u7684\u8ba1\u6570\u3002" },
  { s: "#sec-tutorial .problem-card:nth-child(11) p", t: "\u4f7f\u7528\u8bb2\u4e49\u4e2d\u7684 MGF \u65b9\u6cd5\uff0c\u8bc1\u660e\u82e5 \\(X_1, \\ldots, X_n\\) \u662f\uff08\u4e0d\u4e00\u5b9a\u72ec\u7acb\u7684\uff09\u5747\u503c\u4e3a 0\u3001\u65b9\u5dee\u4e3a \\(\\sigma^2\\) \u7684\u9ad8\u65af\u968f\u673a\u53d8\u91cf\uff0c\u5219\uff1a" },

  // Tutorial — full solution text
  { s: "#sol1", t: "<p>\u7531\u671f\u671b\u7684\u7ebf\u6027\u6027\uff1a</p><p>\\[\\mathbb{E}[\\text{\u7a7a\u7bb1\u6570}] = n\\!\\left(1 - \\frac{1}{n}\\right)^m \\leq n \\cdot e^{-m/n}\\]</p><p>\u4ee4 \\(n \\cdot e^{-m/n} \\leq \\frac{1}{2}\\) \u5e76\u53d6\u5bf9\u6570\uff1a\\(m = \\Omega(n \\log n)\\)\u3002\u56e0\u6b64\u9700\u8981 \\(m = \\Theta(n \\log n)\\) \u4e2a\u7403\u624d\u80fd\u671f\u671b\u8986\u76d6\u6240\u6709\u7bb1\u5b50\u3002\\(\\square\\)</p>" },
  { s: "#sol2", t: "<p>\\(\\mathbb{E}[m(n)] = nH_n \\leq 2n\\log n\\)\uff0c\\(\\operatorname{Var}[m(n)] \\leq \\frac{\\pi^2}{6}n^2\\)\u3002</p><p>\u7531\u5207\u6bd4\u96ea\u592b\uff0c\u4ee4 \\(t = (\\alpha - 2)n\\log n\\)\uff1a</p><p>\\[\\Pr[m \\geq \\alpha n\\log n] \\leq \\frac{\\pi^2 n^2/6}{((\\alpha-2)n\\log n)^2} = O\\!\\left(\\frac{1}{\\log^2 n}\\right)\\]</p><p>\u8d8b\u5411\u4e8e\u96f6\uff0c\u4f46\u53ea\u662f \\(\\log n\\) \u7684\u591a\u9879\u5f0f\u901f\u5ea6\u3002\\(\\square\\)</p>" },
  { s: "#sol3", t: "<p><strong>\u4e0b\u754c\uff1a</strong>\\(M_2(n) \\geq M(n) = \\Theta(n\\log n)\\)\uff0c\u56e0\u4e3a\u8981\u6bcf\u4e2a\u7bb1\u5b50\u6709 2 \u4e2a\u7403\uff0c\u5148\u9700\u8981\u81f3\u5c11\u6709 1 \u4e2a\u3002</p><p><strong>\u4e0a\u754c\uff1a</strong>\u7b49\u5f85\u6bcf\u4e2a\u7bb1\u5b50\u81f3\u5c11\u6709\u4e00\u4e2a\u7403\uff08\u671f\u671b \\(M(n)\\)\uff09\u3002\u7136\u540e\u201c\u91cd\u65b0\u5f00\u59cb\u201d\u2014\u2014 \u5ffd\u7565\u5f53\u524d\u8d1f\u8f7d\uff0c\u7b49\u5f85\u6bcf\u4e2a\u7bb1\u5b50\u518d\u6536\u5230\u81f3\u5c11\u4e00\u4e2a<em>\u65b0</em>\u7403\u3002\u7b2c\u4e8c\u9636\u6bb5\u4e5f\u9700\u8981\u671f\u671b \\(M(n)\\)\u3002</p><p>\u56e0\u6b64 \\(M_2(n) \\leq 2M(n) = O(n\\log n)\\)\uff0c\u5f97 \\(M_2(n) = \\Theta(n\\log n)\\)\u3002\\(\\square\\)</p>" },
  { s: "#sol4", t: "<p>\\(L_i \\sim \\text{Bin}(m, 1/n)\\)\uff0c\\(\\mathbb{E}[L_i] = c\\ln n\\)\uff0c\\(\\operatorname{Var}[L_i] \\leq c\\ln n\\)\u3002</p><p><strong>(a)</strong> \u5207\u6bd4\u96ea\u592b\uff1a\\(\\Pr[|L_i - c\\ln n| \\geq \\frac{c}{2}\\ln n] \\leq \\frac{4}{c\\ln n}\\)\u3002\u8054\u5408\u754c\u540e\u5f97 \\(\\frac{4n}{c\\ln n}\\)\uff0c\u65e0\u6548\uff01</p><p><strong>(b)</strong> \u5207\u5c14\u8bfa\u592b\uff08\\(\\delta = 1/2\\)\uff09\uff1a\\(\\Pr[|L_i - c\\ln n| \\geq \\frac{c}{2}\\ln n] \\leq 2/n^{c/12}\\)\u3002</p><p><strong>(c)</strong> \u8054\u5408\u754c\uff1a\\(\\leq 2n/n^{c/12} = 2/n^{c/12 - 1}\\)\u3002\u53d6 \\(c = 24\\) \u5f97 \\(\\leq 2/n\\)\u3002\\(\\square\\)</p>" },
  { s: "#sol5", t: "<p><strong>(a)</strong> 2 \u4e2a\u7403\u78b0\u649e\u7684\u6982\u7387\uff1a\\(\\Pr[\\text{\u78b0\u649e}] = \\sum_{i=1}^{n} p_i^2 = \\|p\\|_2^2\\)</p><p><strong>(b)</strong> \u7531\u671f\u671b\u7684\u7ebf\u6027\u6027\uff0c\u5bf9\u6240\u6709 \\(\\binom{m}{2}\\) \u5bf9\uff1a\\(\\mathbb{E}[c(m,n)] = \\binom{m}{2} \\|p\\|_2^2\\)</p><p>\u5408\u7406\u6027\u68c0\u67e5\uff1a\u5bf9\u5747\u5300\u5206\u5e03 \\(p_i = 1/n\\)\uff0c\\(\\|p\\|_2^2 = 1/n\\)\uff0c\u6062\u590d\u6807\u51c6\u7ed3\u679c\u3002\\(\\square\\)</p>" },
  { s: "#sol6", t: "<p><strong>(a)</strong> \u82e5 \\(B_2 > n/2\\)\uff0c\u5219\u8d85\u8fc7 \\(n/2\\) \u4e2a\u7bb1\u5b50\u6709 \\(\\geq 2\\) \u4e2a\u7403\uff0c\u610f\u5473\u7740\u603b\u5171\u8d85\u8fc7 \\(n\\) \u4e2a\u7403\u3002\u77db\u76fe\u3002</p><p><strong>(b)</strong> \u6bcf\u4e2a\u6709 \\(\\geq i\\) \u4e2a\u7403\u7684\u7bb1\u5b50\u90fd\u6709\u4e00\u4e2a\u7403\u662f\u7b2c \\(i\\) \u4e2a\u6216\u66f4\u665a\u653e\u5165\u7684\uff0c\u6240\u4ee5 \\(B_i \\leq B_i^\\prime\\)\u3002</p><p><strong>(c)</strong> \u4efb\u4f55\u65f6\u523b\uff0c\u81f3\u591a \\(B_i\\) \u4e2a\u7bb1\u5b50\u6709 \\(\\geq i\\) \u4e2a\u7403\u3002\u4e24\u6b21\u9009\u62e9\u4e0b\uff0c\u7403\u8fdb\u5165\u8fd9\u6837\u7684\u7bb1\u5b50\u7684\u6982\u7387 \\(\\leq (B_i/n)^2\\)\u3002\u5bf9 \\(n\\) \u4e2a\u7403\u6c42\u548c\uff1a\\(\\mathbb{E}[B_{i+1}^\\prime] \\leq B_i^2/n\\)\u3002</p><p><strong>(d)-(e)</strong> \u9012\u63a8 \\(B_{i+1} \\leq B_i^2/n\\)\uff0c\\(B_2 \\leq n/2\\)\uff0c\u5f52\u7eb3\u5f97\uff1a\\(B_i \\leq n/2^{2^{i-2}}\\)\u3002</p><p><strong>(f)</strong> \u4ee4 \\(B_i \\geq 1\\)\uff1a\\(i \\leq \\log_2\\log_2 n + 2\\)\u3002\u6700\u5927\u8d1f\u8f7d\u81f3\u591a \\(\\log\\log n + O(1)\\)\u3002\\(\\square\\)</p>" },
  { s: "#sol7", t: "<p>\u7a7a\u7bb1\u7684\u671f\u671b\u6570\u4e3a \\(n(1 - 1/n)^n\\)\u3002\u9700\u8981\u8bc1\u660e\uff1a</p><p>\\[\\lim_{n \\to \\infty} \\left(1 - \\frac{1}{n}\\right)^n = e^{-1}\\]</p><p>\u5199\u6210 \\((1 - 1/n)^n = e^{n\\ln(1 - 1/n)}\\)\u3002\u4ee4 \\(f(x) = \\ln(1-x)\\)\uff0c\u9700\u8981 \\(\\lim_{n\\to\\infty} \\frac{\\ln(1-1/n)}{1/n} = f\\prime(0) = -1\\)\uff0c\u5f97\u6781\u9650 \\(e^{-1}\\)\u3002</p><p>\u56e0\u6b64 \\(\\mathbb{E}[\\text{\u7a7a\u7bb1}] = n(1 - 1/n)^n \\to n/e\\)\u3002\\(\\square\\)</p>" },
  { s: "#sol8", t: "<p><strong>(a)</strong> \\(p = 1/\\binom{45}{6} = 1/8{,}145{,}060\\)\u3002</p><p><strong>(b)</strong> 1 \u5f20\u7968\u7684\u671f\u671b\u5956\u52b1\uff1a\\(10^6 \\cdot p - 0.60 \\approx -\\$0.48\\)\u3002100 \u5f20\uff1a\\(\\approx -\\$48\\)\u3002\u671f\u671b\u6536\u76ca\u4e3a\u8d1f\uff08\u5982\u6240\u6709\u771f\u5b9e\u5f69\u7968\uff09\u3002</p><p><strong>(c)</strong> \u8981\u533a\u5206\u6240\u6709 \\(n = \\binom{45}{6}\\) \u7ed3\u679c\u7684\u5747\u5300\u5206\u5e03\u548c\u652f\u6301\u5728 \\(n/2\\) \u4e2a\u7ed3\u679c\u4e0a\u7684\u5206\u5e03\uff0c\u9700\u8981\u89c2\u5bdf\u78b0\u649e\uff08\u751f\u65e5\u6096\u8bba\uff09\u3002\u9700\u8981 \\(\\Omega(\\sqrt{n}) \\approx \\Omega(2{,}854)\\) \u5f20\u7968\u3002\\(\\square\\)</p>" },
  { s: "#sol9", t: "<p><strong>(a)</strong> \u7531\u591a\u9879\u5f0f\u5b9a\u7406\u548c\u6cca\u677e\u5206\u88c2\u6027\u8d28\uff1a\u82e5\u603b\u8ba1\u6570 \\(M \\sim \\text{Poi}(m)\\)\uff0c\u5219 \\(N_j \\sim \\text{Poi}(mp_j)\\) \u72ec\u7acb\u3002</p><p><strong>(b)</strong> \u7bb1\u5b50 \\(j\\) \u7684\u78b0\u649e\u6570\u4e3a \\(\\binom{N_j}{2}\\)\uff0c\u6240\u4ee5 \\(\\tilde{c}(m,n) = \\sum_j \\frac{N_j^2 - N_j}{2}\\)\u3002</p><p><strong>(c)</strong> \u7528\u6cca\u677e\u77e9\uff1a\\(\\mathbb{E}[\\tilde{c}] = \\frac{m^2}{2}\\|p\\|_2^2\\)\u3002</p><p><strong>(d)</strong> \u7531 \\(N_j\\) \u7684\u72ec\u7acb\u6027\uff1a\\(\\operatorname{Var}[\\tilde{c}] = \\frac{1}{4}m^4\\|p\\|_4^4 + m^3\\|p\\|_3^3 + \\frac{1}{4}m^2\\|p\\|_2^2\\)\u3002\\(\\square\\)</p>" },
  { s: "#sol10", t: "<p>\u6cbfJensen + MGF\u65b9\u6cd5\uff1a</p><p>\\[\\mathbb{E}\\!\\left[\\max_i X_i\\right] \\leq \\frac{\\ln n}{t} + \\frac{\\sigma^2 t}{2}\\]</p><p>\u5e73\u8861\u4e24\u9879\uff1a\u4ee4 \\(t = \\sqrt{2\\ln n/\\sigma^2}\\)\uff0c\u5f97\uff1a</p><p>\\[\\mathbb{E}\\!\\left[\\max_i X_i\\right] \\leq \\sqrt{2\\sigma^2 \\ln n}\\]</p><p><strong>\u63a8\u8bba\uff1a</strong>\\(\\max_i |X_i| = \\max_i \\max(X_i, -X_i)\\)\u3002\u7531\u4e8e \\(-X_i \\sim \\mathcal{N}(0, \\sigma^2)\\)\uff0c\u5bf9 \\(2n\\) \u4e2a\u53d8\u91cf\u5e94\u7528\u8be5\u754c\uff08\u4e0d\u9700\u72ec\u7acb\u6027\uff09\uff1a\\(\\mathbb{E}[\\max_i |X_i|] \\leq \\sqrt{2\\sigma^2 \\ln(2n)}\\)\u3002\\(\\square\\)</p>" },
];

// ===================== CHAPTER 4 MATH PAGE TRANSLATIONS =====================
var MATH4_T = [
  { s: ".back-bar a:first-child", t: "\u2190 \u5b66\u4e60\u6307\u5357" },
  { s: ".page-title-bar", t: "\u7b2c\u56db\u7ae0 \u00b7 \u6570\u5b66\u57fa\u7840" },
  { s: ".toc-sidebar .home-link", t: "\u2190 \u8bfe\u7a0b\u4e3b\u9875" },
  { s: ".toc-sidebar .sidebar-brand h2", t: "\u7b2c4\u7ae0\u6570\u5b66" },
  { s: 'a.toc-link[href="#sec-graphs"]', t: "\u56fe\u8bba\u57fa\u7840" },
  { s: 'a.toc-link[href="#sec-randomness"]', t: "\u968f\u673a\u6027\u590d\u6742\u5ea6" },
  { s: 'a.toc-link[href="#sec-pairwise-math"]', t: "\u4e24\u4e24\u72ec\u7acb" },
  { s: 'a.toc-link[href="#sec-hash"]', t: "\u54c8\u5e0c\u65cf" },
  { s: 'a.toc-link[href="#sec-cond-exp"]', t: "\u6761\u4ef6\u671f\u671b" },
  { s: 'a.toc-link[href="#sec-prob-method-math"]', t: "\u6982\u7387\u65b9\u6cd5" },
  { s: 'a.toc-link[href="#sec-approx"]', t: "\u8fd1\u4f3c\u7b97\u6cd5" },
  { s: ".toc-sidebar .back-to-study", t: "\u2190 \u8fd4\u56de\u5b66\u4e60\u6307\u5357" },
  { s: "#hero h1", t: "\u6570\u5b66\u57fa\u7840\uff1a\u53bb\u968f\u673a\u5316" },
  { s: "#sec-graphs .section-title", t: "\u56fe\u8bba\u57fa\u7840" },
  { s: "#sec-randomness .section-title", t: "\u968f\u673a\u6027\u590d\u6742\u5ea6" },
  { s: "#sec-pairwise-math .section-title", t: "\u4e24\u4e24\u72ec\u7acb" },
  { s: "#sec-hash .section-title", t: "\u54c8\u5e0c\u51fd\u6570\u65cf" },
  { s: "#sec-cond-exp .section-title", t: "\u6761\u4ef6\u671f\u671b" },
  { s: "#sec-prob-method-math .section-title", t: "\u6982\u7387\u65b9\u6cd5" },
  { s: "#sec-approx .section-title", t: "\u8fd1\u4f3c\u7b97\u6cd5" },
];

// ===================== CHAPTER 4 STUDY PAGE TRANSLATIONS =====================
var STUDY4_T = [
  { s: "[data-i18n-home]", t: "&larr; \u8bfe\u7a0b\u4e3b\u9875" },
  { s: '[data-section="hero"]', t: "\u6982\u89c8" },
  { s: '[data-section="sec-intro"]', t: "\u53bb\u968f\u673a\u5316\u95ee\u9898" },
  { s: '[data-section="sec-seed"]', t: "\u5c0f\u968f\u673a\u79cd\u5b50" },
  { s: '[data-section="sec-pairwise"]', t: "\u4e24\u4e24\u72ec\u7acb" },
  { s: '[data-section="sec-conditional"]', t: "\u6761\u4ef6\u671f\u671b\u6cd5" },
  { s: '[data-section="sec-prob-method"]', t: "\u6982\u7387\u65b9\u6cd5" },
  { s: '[data-section="sec-tutorial"]', t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: 'a.nav-link[href="chapter4-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840" },
  { s: 'a.nav-link[href="chapter4-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe" },
  { s: 'a.btn[href="chapter4-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe &rarr;" },
  { s: ".hero-course", t: "COMPX270 \u2014 \u968f\u673a\u4e0e\u9ad8\u7ea7\u7b97\u6cd5" },
  { s: "#hero h1", t: "\u7b2c\u56db\u7ae0\uff1a\u53bb\u968f\u673a\u5316" },
  { s: ".hero-subtitle", t: "\u5c06\u968f\u673a\u7b97\u6cd5\u8f6c\u5316\u4e3a\u786e\u5b9a\u6027\u7b97\u6cd5\uff1a\u5c0f\u968f\u673a\u79cd\u5b50\u3001\u4e24\u4e24\u72ec\u7acb\u6027\u548c\u6761\u4ef6\u671f\u671b\u6cd5\u3002" },
  { s: "#sec-intro .section-title", t: "\u53bb\u968f\u673a\u5316\u95ee\u9898" },
  { s: "#sec-seed .section-title", t: "\u65b9\u6cd5\u4e00\uff1a\u5c0f\u968f\u673a\u79cd\u5b50" },
  { s: "#sec-pairwise .section-title", t: "\u4e24\u4e24\u72ec\u7acb\u6027" },
  { s: "#sec-conditional .section-title", t: "\u65b9\u6cd5\u4e8c\uff1a\u6761\u4ef6\u671f\u671b\u6cd5" },
  { s: "#sec-prob-method .section-title", t: "\u6982\u7387\u65b9\u6cd5" },
  { s: "#sec-tutorial .section-title", t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: '.solution-toggle[data-target="sol1"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol2"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol3"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol4"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol5"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol6"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol7"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol8"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: ".problem-tag.warm-up", i: 0, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 1, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 2, t: "\u70ed\u8eab" },
  { s: ".problem-tag.problem-solving", i: 0, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 1, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 2, t: "\u89e3\u9898" },
  { s: ".problem-tag.advanced", i: 0, t: "\u8fdb\u9636" },
  { s: ".problem-tag.advanced", i: 1, t: "\u8fdb\u9636" },
];

// ===================== CHAPTER 5 STUDY PAGE TRANSLATIONS =====================
var STUDY5_T = [
  { s: "[data-i18n-home]", t: "&larr; \u8bfe\u7a0b\u4e3b\u9875" },
  { s: '[data-section="hero"]', t: "\u6982\u89c8" },
  { s: '[data-section="sec-karger"]', t: "Karger\u6700\u5c0f\u5272" },
  { s: '[data-section="sec-karger-stein"]', t: "Karger-Stein" },
  { s: '[data-section="sec-counting"]', t: "\u6700\u5c0f\u5272\u8ba1\u6570" },
  { s: '[data-section="sec-mst"]', t: "\u7ebf\u6027MST" },
  { s: '[data-section="sec-summary"]', t: "\u603b\u7ed3" },
  { s: '[data-section="sec-tutorial"]', t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: 'a.nav-link[href="chapter5-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840" },
  { s: 'a.nav-link[href="chapter5-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe" },
  { s: 'a.btn[href="chapter5-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe &rarr;" },
  { s: ".hero-course", t: "COMPX270 \u2014 \u968f\u673a\u4e0e\u9ad8\u7ea7\u7b97\u6cd5" },
  { s: "#hero h1", t: "\u7b2c\u4e94\u7ae0\uff1a\u56fe\u7b97\u6cd5" },
  { s: ".hero-subtitle", t: "Karger\u6700\u5c0f\u5272\u3001Karger-Stein\u6539\u8fdb\u7b97\u6cd5\u3001\u6700\u5c0f\u5272\u8ba1\u6570\u548c\u671f\u671b\u7ebf\u6027\u65f6\u95f4MST\u3002" },
  { s: "#sec-karger .section-title", t: "Karger\u6700\u5c0f\u5272\u7b97\u6cd5" },
  { s: "#sec-karger-stein .section-title", t: "Karger-Stein\u7b97\u6cd5" },
  { s: "#sec-counting .section-title", t: "\u6700\u5c0f\u5272\u6709\u591a\u5c11\u4e2a\uff1f" },
  { s: "#sec-mst .section-title", t: "\u671f\u671b\u7ebf\u6027\u65f6\u95f4\u7684\u6700\u5c0f\u751f\u6210\u6811" },
  { s: "#sec-summary .section-title", t: "\u603b\u7ed3\u4e0e\u5bf9\u6bd4" },
  { s: "#sec-tutorial .section-title", t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: '.solution-toggle[data-target="sol1"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol2"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol3"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol4"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol5"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol6"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol7"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: ".problem-tag.warm-up", i: 0, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 1, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 2, t: "\u70ed\u8eab" },
  { s: ".problem-tag.problem-solving", i: 0, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 1, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 2, t: "\u89e3\u9898" },
  { s: ".problem-tag.advanced", i: 0, t: "\u8fdb\u9636" },
];

// ===================== CHAPTER 5 MATH PAGE TRANSLATIONS =====================
var MATH5_T = [
  { s: ".back-link", i: 0, t: "&larr; \u8fd4\u56de\u5b66\u4e60\u6307\u5357" },
  { s: ".back-link", i: 1, t: "&#x1F3E0; \u8bfe\u7a0b\u4e3b\u9875" },
  { s: ".sidebar-brand span", t: "\u7b2c5\u7ae0\u6570\u5b66" },
  { s: "#hero h1", t: "\u6570\u5b66\u57fa\u7840\uff1a\u56fe\u7b97\u6cd5" },
  { s: "#sec-graph-review h2", t: "\u56fe\u8bba\u57fa\u7840" },
  { s: "#sec-contraction h2", t: "\u8fb9\u6536\u7f29" },
  { s: "#sec-conditional-prob h2", t: "\u6761\u4ef6\u6982\u7387\u4e0e\u4f38\u7f29\u79ef" },
  { s: "#sec-recurrences h2", t: "\u9012\u63a8\u5173\u7cfb" },
  { s: "#sec-mst-props h2", t: "MST\u6027\u8d28" },
  { s: "#sec-counting-math h2", t: "\u8ba1\u6570\u8bba\u8bc1" },
];

// ===================== CHAPTER 6 STUDY PAGE TRANSLATIONS =====================
var STUDY6_T = [
  { s: "[data-i18n-home]", t: "&larr; \u8bfe\u7a0b\u4e3b\u9875" },
  { s: '[data-section="hero"]', t: "\u6982\u89c8" },
  { s: '[data-section="sec-dictionary"]', t: "\u5b57\u5178ADT" },
  { s: '[data-section="sec-hash-tables"]', t: "\u54c8\u5e0c\u8868" },
  { s: '[data-section="sec-hash-families"]', t: "\u54c8\u5e0c\u65cf" },
  { s: '[data-section="sec-collision"]', t: "\u78b0\u649e\u5904\u7406" },
  { s: '[data-section="sec-cuckoo"]', t: "\u5e03\u8c37\u9e1f\u54c8\u5e0c" },
  { s: '[data-section="sec-bloom"]', t: "\u5e03\u9686\u8fc7\u6ee4\u5668" },
  { s: '[data-section="sec-summary"]', t: "\u603b\u7ed3" },
  { s: '[data-section="sec-tutorial"]', t: "\u6559\u7a0b\u95ee\u9898" },
  { s: 'a.nav-link[href="chapter6-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840" },
  { s: 'a.nav-link[href="chapter6-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe" },
  { s: 'a.btn[href="chapter6-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840 &rarr;" },
  { s: 'a.btn[href="chapter6-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe &rarr;" },
  { s: ".hero-course", t: "COMPX270 \u2014 \u968f\u673a\u4e0e\u9ad8\u7ea7\u7b97\u6cd5" },
  { s: "#hero h1", t: "\u7b2c\u516d\u7ae0\uff1a\u54c8\u5e0c\u4e0e\u76f8\u5173\u6280\u672f" },
  { s: ".hero-subtitle", t: "\u5b57\u5178ADT\u5b9e\u73b0\u3001\u5168\u57df\u4e0e\u5f3a\u5168\u57df\u54c8\u5e0c\u65cf\u3001\u78b0\u649e\u5904\u7406\uff08\u94fe\u5730\u5740\u6cd5\u3001\u5f00\u653e\u5730\u5740\u6cd5\u3001\u5e03\u8c37\u9e1f\u54c8\u5e0c\uff09\uff0c\u4ee5\u53ca\u5e03\u9686\u8fc7\u6ee4\u5668\u7684\u5047\u9633\u6027\u5206\u6790\u3002" },
  { s: ".hero-cards .hero-card:nth-child(1) span:last-child", t: "\u5b57\u5178ADT" },
  { s: ".hero-cards .hero-card:nth-child(2) span:last-child", t: "\u54c8\u5e0c\u65cf" },
  { s: ".hero-cards .hero-card:nth-child(3) span:last-child", t: "\u78b0\u649e\u5904\u7406" },
  { s: ".hero-cards .hero-card:nth-child(4) span:last-child", t: "\u5e03\u9686\u8fc7\u6ee4\u5668" },
  { s: "#sec-dictionary .section-title", t: "\u5b57\u5178\u62bd\u8c61\u6570\u636e\u7c7b\u578b" },
  { s: "#sec-hash-tables .section-title", t: "\u54c8\u5e0c\u8868" },
  { s: "#sec-hash-families .section-title", t: "\u54c8\u5e0c\u65cf" },
  { s: "#sec-collision .section-title", t: "\u78b0\u649e\u5904\u7406" },
  { s: "#sec-cuckoo .section-title", t: "\u5e03\u8c37\u9e1f\u54c8\u5e0c" },
  { s: "#sec-bloom .section-title", t: "\u5e03\u9686\u8fc7\u6ee4\u5668" },
  { s: "#sec-summary .section-title", t: "\u603b\u7ed3\u4e0e\u5bf9\u6bd4" },
  { s: "#sec-tutorial .section-title", t: "\u6559\u7a0b\u95ee\u9898" },
  { s: '.solution-toggle[data-target="sol1"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol2"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol3"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol4"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol5"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol6"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol7"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: ".problem-tag.warm-up", i: 0, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 1, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 2, t: "\u70ed\u8eab" },
  { s: ".problem-tag.problem-solving", i: 0, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 1, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 2, t: "\u89e3\u9898" },
  { s: ".problem-tag.advanced", i: 0, t: "\u8fdb\u9636" },
];

// ===================== CHAPTER 6 MATH PAGE TRANSLATIONS =====================
var MATH6_T = [
  { s: ".back-bar a:first-child", t: "\u2190 \u8fd4\u56de\u5b66\u4e60\u6307\u5357" },
  { s: ".page-title-bar", t: "\u7b2c\u516d\u7ae0 \u00b7 \u6570\u5b66\u57fa\u7840" },
  { s: ".toc-sidebar .home-link", t: "\u2190 \u8bfe\u7a0b\u4e3b\u9875" },
  { s: ".toc-sidebar .sidebar-brand h2", t: "\u7b2c6\u7ae0\u6570\u5b66" },
  { s: ".toc-group", i: 0, t: "\u6570\u8bba" },
  { s: ".toc-group", i: 1, t: "\u54c8\u5e0c\u6784\u9020" },
  { s: ".toc-group", i: 2, t: "\u6982\u7387\u5206\u6790" },
  { s: ".toc-group", i: 3, t: "\u6d4b\u9a8c" },
  { s: 'a.toc-link[href="#sec-modular"]', t: "\u6a21\u7b97\u672f" },
  { s: 'a.toc-link[href="#sec-pigeonhole"]', t: "\u9e3d\u5de2\u539f\u7406" },
  { s: 'a.toc-link[href="#sec-hash-construct"]', t: "\u54c8\u5e0c\u51fd\u6570\u6570\u5b66" },
  { s: 'a.toc-link[href="#sec-collisions"]', t: "\u671f\u671b\u78b0\u649e\u6570" },
  { s: 'a.toc-link[href="#sec-load-birthday"]', t: "\u8d1f\u8f7d\u56e0\u5b50\u4e0e\u751f\u65e5" },
  { s: 'a.toc-link[href="#sec-bloom-prob"]', t: "\u5e03\u9686\u8fc7\u6ee4\u5668\u5206\u6790" },
  { s: ".toc-sidebar .back-to-study", t: "\u2190 \u8fd4\u56de\u7b2c\u516d\u7ae0\u5b66\u4e60\u6307\u5357" },
  { s: "#hero h1", t: "\u6570\u5b66\u57fa\u7840\uff1a\u54c8\u5e0c" },
  { s: "#sec-modular .section-title", t: "\u6a21\u7b97\u672f\u4e0e\u6709\u9650\u57df" },
  { s: "#sec-pigeonhole .section-title", t: "\u9e3d\u5de2\u539f\u7406" },
  { s: "#sec-hash-construct .section-title", t: "\u54c8\u5e0c\u51fd\u6570\u6784\u9020" },
  { s: "#sec-collisions .section-title", t: "\u78b0\u649e\u7684\u671f\u671b\u503c" },
  { s: "#sec-load-birthday .section-title", t: "\u8d1f\u8f7d\u56e0\u5b50\u4e0e\u751f\u65e5\u6096\u8bba" },
  { s: "#sec-bloom-prob .section-title", t: "\u5e03\u9686\u8fc7\u6ee4\u5668\u6982\u7387\u5206\u6790" },
];

// ===================== CHAPTER 7 STUDY PAGE TRANSLATIONS =====================
var STUDY7_T = [
  { s: "[data-i18n-home]", t: "&larr; \u8bfe\u7a0b\u4e3b\u9875" },
  { s: '[data-section="hero"]', t: "\u6982\u89c8" },
  { s: '[data-section="sec-nn"]', t: "\u6700\u8fd1\u90bb\u95ee\u9898" },
  { s: '[data-section="sec-jl"]', t: "JL\u5f15\u7406" },
  { s: '[data-section="sec-lsh"]', t: "LSH\u6846\u67b6" },
  { s: '[data-section="sec-hamming"]', t: "\u6c49\u660e LSH" },
  { s: '[data-section="sec-euclidean"]', t: "\u6b27\u51e0\u91cc\u5f97LSH" },
  { s: '[data-section="sec-summary"]', t: "\u603b\u7ed3" },
  { s: '[data-section="sec-tutorial"]', t: "\u6559\u7a0b\u95ee\u9898" },
  { s: 'a.nav-link[href="chapter7-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840" },
  { s: 'a.nav-link[href="chapter7-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe" },
  { s: 'a.btn[href="chapter7-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840 &rarr;" },
  { s: 'a.btn[href="chapter7-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe &rarr;" },
  { s: ".hero-course", t: "COMPX270 \u2014 \u968f\u673a\u4e0e\u9ad8\u7ea7\u7b97\u6cd5" },
  { s: "#hero h1", t: "\u7b2c\u4e03\u7ae0\uff1a\u6700\u8fd1\u90bb\u4e0e\u964d\u7ef4" },
  { s: ".hero-subtitle", t: "\u9ad8\u7ef4\u6700\u8fd1\u90bb\u641c\u7d22\uff1a\u57fa\u7ebf\u65b9\u6cd5\u3001\u8fd1\u4f3c\u6700\u8fd1\u90bb\u3001Johnson\u2013Lindenstrauss\u968f\u673a\u6295\u5f71\u5f15\u7406\uff0c\u4ee5\u53ca\u5b9e\u73b0\u4e9a\u7ebf\u6027\u67e5\u8be2\u65f6\u95f4\u7684\u5c40\u90e8\u654f\u611f\u54c8\u5e0c\u3002" },
  { s: ".hero-cards .hero-card:nth-child(1) span:last-child", t: "\u6700\u8fd1\u90bb\u95ee\u9898" },
  { s: ".hero-cards .hero-card:nth-child(2) span:last-child", t: "JL\u5f15\u7406" },
  { s: ".hero-cards .hero-card:nth-child(3) span:last-child", t: "\u5c40\u90e8\u654f\u611f\u54c8\u5e0c" },
  { s: ".hero-cards .hero-card:nth-child(4) span:last-child", t: "ANN\u6570\u636e\u7ed3\u6784" },
  { s: "#sec-nn .section-title", t: "\u6700\u8fd1\u90bb\u95ee\u9898" },
  { s: "#sec-jl .section-title", t: "Johnson\u2013Lindenstrauss \u5f15\u7406" },
  { s: "#sec-lsh .section-title", t: "\u5c40\u90e8\u654f\u611f\u54c8\u5e0c (LSH)" },
  { s: "#sec-hamming .section-title", t: "\u6c49\u660e\u7a7a\u95f4\u7684LSH" },
  { s: "#sec-euclidean .section-title", t: "\u6b27\u51e0\u91cc\u5f97\u7a7a\u95f4\u7684LSH (SimHash)" },
  { s: "#sec-summary .section-title", t: "\u603b\u7ed3\u4e0e\u5bf9\u6bd4" },
  { s: "#sec-tutorial .section-title", t: "\u6559\u7a0b\u95ee\u9898" },
  { s: '.solution-toggle[data-target="sol1"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol2"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol3"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol4"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol5"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol6"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol7"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: ".problem-tag.warm-up", i: 0, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 1, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 2, t: "\u70ed\u8eab" },
  { s: ".problem-tag.problem-solving", i: 0, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 1, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 2, t: "\u89e3\u9898" },
  { s: ".problem-tag.advanced", i: 0, t: "\u8fdb\u9636" },
];

// ===================== CHAPTER 7 MATH PAGE TRANSLATIONS =====================
var MATH7_T = [
  { s: ".back-bar a:first-child", t: "\u2190 \u8fd4\u56de\u5b66\u4e60\u6307\u5357" },
  { s: ".page-title-bar", t: "\u7b2c\u4e03\u7ae0 \u00b7 \u6570\u5b66\u57fa\u7840" },
  { s: ".toc-sidebar .home-link", t: "\u2190 \u8bfe\u7a0b\u4e3b\u9875" },
  { s: ".toc-sidebar .sidebar-brand h2", t: "\u7b2c7\u7ae0\u6570\u5b66" },
  { s: ".toc-group", i: 0, t: "\u7a7a\u95f4\u4e0e\u8ddd\u79bb" },
  { s: ".toc-group", i: 1, t: "\u968f\u673a\u6295\u5f71" },
  { s: ".toc-group", i: 2, t: "\u6982\u7387\u5de5\u5177" },
  { s: ".toc-group", i: 3, t: "\u6d4b\u9a8c" },
  { s: 'a.toc-link[href="#sec-metric-spaces"]', t: "\u5ea6\u91cf\u7a7a\u95f4" },
  { s: 'a.toc-link[href="#sec-norms"]', t: "\u5185\u79ef\u4e0e\u8303\u6570" },
  { s: 'a.toc-link[href="#sec-gaussians"]', t: "\u9ad8\u65af\u5411\u91cf" },
  { s: 'a.toc-link[href="#sec-matrix"]', t: "\u77e9\u9635\u5411\u91cf\u4e58\u79ef" },
  { s: 'a.toc-link[href="#sec-chi-squared"]', t: "\u03c7\u00b2\u96c6\u4e2d" },
  { s: 'a.toc-link[href="#sec-union-bound"]', t: "\u5bf9\u6570\u4e0e\u8054\u5408\u754c" },
  { s: ".toc-sidebar .back-to-study", t: "\u2190 \u8fd4\u56de\u7b2c\u4e03\u7ae0\u5b66\u4e60\u6307\u5357" },
  { s: "#hero h1", t: "\u6570\u5b66\u57fa\u7840\uff1a\u6700\u8fd1\u90bb\u4e0e\u964d\u7ef4" },
  { s: "#sec-metric-spaces .section-title", t: "\u5ea6\u91cf\u7a7a\u95f4" },
  { s: "#sec-norms .section-title", t: "\u5185\u79ef\u4e0e\u8303\u6570" },
  { s: "#sec-gaussians .section-title", t: "\u968f\u673a\u9ad8\u65af\u5411\u91cf" },
  { s: "#sec-matrix .section-title", t: "\u77e9\u9635\u5411\u91cf\u4e58\u79ef\u4f5c\u4e3a\u6295\u5f71" },
  { s: "#sec-chi-squared .section-title", t: "\\(\\chi^2\\) \u968f\u673a\u53d8\u91cf\u7684\u96c6\u4e2d" },
  { s: "#sec-union-bound .section-title", t: "\u5bf9\u6570\u4e0e\u8054\u5408\u754c" },
];

// ===================== CHAPTER 8 STUDY PAGE TRANSLATIONS =====================
var STUDY8_T = [
  { s: "[data-i18n-home]", t: "&larr; \u8bfe\u7a0b\u4e3b\u9875" },
  { s: '[data-section="hero"]', t: "\u6982\u89c8" },
  { s: '[data-section="sec-model"]', t: "\u6d41\u6a21\u578b" },
  { s: '[data-section="sec-misra-gries"]', t: "Misra-Gries" },
  { s: '[data-section="sec-morris"]', t: "Morris\u8ba1\u6570\u5668" },
  { s: '[data-section="sec-distinct"]', t: "\u4e0d\u540c\u5143\u7d20" },
  { s: '[data-section="sec-bjkst"]', t: "BJKST\u7b97\u6cd5" },
  { s: '[data-section="sec-summary"]', t: "\u603b\u7ed3" },
  { s: '[data-section="sec-tutorial"]', t: "\u6559\u7a0b\u95ee\u9898" },
  { s: 'a.nav-link[href="chapter8-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840" },
  { s: 'a.nav-link[href="chapter8-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe" },
  { s: 'a.btn[href="chapter8-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840 &rarr;" },
  { s: 'a.btn[href="chapter8-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe &rarr;" },
  { s: ".hero-course", t: "COMPX270 \u2014 \u968f\u673a\u4e0e\u9ad8\u7ea7\u7b97\u6cd5" },
  { s: "#hero h1", t: "\u7b2c\u516b\u7ae0\uff1a\u6d41\u7b97\u6cd5\u4e0e\u8349\u56fe\uff08\u4e00\uff09" },
  { s: ".hero-subtitle", t: "\u6d77\u91cf\u6570\u636e\u6d41\u4e0a\u7684\u5355\u904d\u7b97\u6cd5\uff1aMisra-Gries\u9891\u7387\u4f30\u8ba1\u3001Morris\u8fd1\u4f3c\u8ba1\u6570\uff0c\u4ee5\u53ca\u4f7f\u7528Tidemark\u548cBJKST\u7684\u4e0d\u540c\u5143\u7d20\u4f30\u8ba1\u3002" },
  { s: ".hero-cards .hero-card:nth-child(1) span:last-child", t: "\u6d41\u6a21\u578b" },
  { s: ".hero-cards .hero-card:nth-child(2) span:last-child", t: "Misra-Gries" },
  { s: ".hero-cards .hero-card:nth-child(3) span:last-child", t: "Morris\u8ba1\u6570\u5668" },
  { s: ".hero-cards .hero-card:nth-child(4) span:last-child", t: "\u4e0d\u540c\u5143\u7d20" },
  { s: "#sec-model .section-title", t: "\u6d41\u6a21\u578b" },
  { s: "#sec-misra-gries .section-title", t: "Misra-Gries \u7b97\u6cd5" },
  { s: "#sec-morris .section-title", t: "Morris\u8ba1\u6570\u5668\uff1a\u8fd1\u4f3c\u8ba1\u6570" },
  { s: "#sec-distinct .section-title", t: "\u4e0d\u540c\u5143\u7d20\uff1aTidemark (AMS)" },
  { s: "#sec-bjkst .section-title", t: "BJKST \u7b97\u6cd5" },
  { s: "#sec-summary .section-title", t: "\u603b\u7ed3\u4e0e\u5bf9\u6bd4" },
  { s: "#sec-tutorial .section-title", t: "\u6559\u7a0b\u95ee\u9898" },
  { s: '.solution-toggle[data-target="sol1"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol2"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol3"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol4"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol5"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol6"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol7"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol8"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: ".problem-tag.warm-up", i: 0, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 1, t: "\u70ed\u8eab" },
  { s: ".problem-tag.problem-solving", i: 0, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 1, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 2, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 3, t: "\u89e3\u9898" },
  { s: ".problem-tag.advanced", i: 0, t: "\u8fdb\u9636" },
  { s: ".problem-tag.advanced", i: 1, t: "\u8fdb\u9636" },
];

// ===================== CHAPTER 8 MATH PAGE TRANSLATIONS =====================
var MATH8_T = [
  { s: ".back-bar a:first-child", t: "\u2190 \u8fd4\u56de\u5b66\u4e60\u6307\u5357" },
  { s: ".page-title-bar", t: "\u7b2c\u516b\u7ae0 \u00b7 \u6570\u5b66\u57fa\u7840" },
  { s: ".toc-sidebar .home-link", t: "\u2190 \u8bfe\u7a0b\u4e3b\u9875" },
  { s: ".toc-sidebar .sidebar-brand h2", t: "\u7b2c8\u7ae0\u6570\u5b66" },
  { s: ".toc-group", i: 0, t: "\u57fa\u7840" },
  { s: ".toc-group", i: 1, t: "\u671f\u671b\u4e0e\u65b9\u5dee" },
  { s: ".toc-group", i: 2, t: "\u6d41\u7b97\u6cd5\u6570\u5b66" },
  { s: ".toc-group", i: 3, t: "\u6d4b\u9a8c" },
  { s: 'a.toc-link[href="#sec-logarithms"]', t: "\u5bf9\u6570\u56de\u987e" },
  { s: 'a.toc-link[href="#sec-geometric"]', t: "\u51e0\u4f55\u968f\u673a\u53d8\u91cf" },
  { s: 'a.toc-link[href="#sec-total-expectation"]', t: "\u5168\u671f\u671b\u5b9a\u5f8b" },
  { s: 'a.toc-link[href="#sec-conditional-variance"]', t: "\u6761\u4ef6\u65b9\u5dee" },
  { s: 'a.toc-link[href="#sec-trailing-zeros"]', t: "\u5c3e\u968f\u96f6" },
  { s: 'a.toc-link[href="#sec-median-of-means"]', t: "\u5747\u503c\u4e2d\u4f4d\u6570" },
  { s: ".toc-sidebar .back-to-study", t: "\u2190 \u8fd4\u56de\u7b2c\u516b\u7ae0\u5b66\u4e60\u6307\u5357" },
  { s: "#hero h1", t: "\u6570\u5b66\u57fa\u7840\uff1a\u6d41\u7b97\u6cd5\u4e0e\u8349\u56fe" },
  { s: "#sec-logarithms .section-title", t: "\u5bf9\u6570\u56de\u987e" },
  { s: "#sec-geometric .section-title", t: "\u51e0\u4f55\u968f\u673a\u53d8\u91cf" },
  { s: "#sec-total-expectation .section-title", t: "\u5168\u671f\u671b\u5b9a\u5f8b" },
  { s: "#sec-conditional-variance .section-title", t: "\u6761\u4ef6\u671f\u671b\u4e0b\u7684\u65b9\u5dee" },
  { s: "#sec-trailing-zeros .section-title", t: "\u5c3e\u968f\u96f6\u4e0e\u6574\u9664\u6027" },
  { s: "#sec-median-of-means .section-title", t: "\u5747\u503c\u4e2d\u4f4d\u6570\u6280\u672f" },
];

// ===================== CHAPTER 9 TRANSLATIONS =====================
var STUDY9_T = [
  { s: "[data-i18n-home]", t: "&larr; \u8bfe\u7a0b\u4e3b\u9875" },
  { s: '[data-section="hero"]', t: "\u6982\u89c8" },
  { s: '[data-section="sec-sketching"]', t: "\u8349\u56fe\u7b97\u6cd5" },
  { s: '[data-section="sec-countsketch"]', t: "CountSketch" },
  { s: '[data-section="sec-countmin"]', t: "CountMinSketch" },
  { s: '[data-section="sec-comparison"]', t: "\u6bd4\u8f83" },
  { s: '[data-section="sec-tutorial"]', t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: 'a.nav-link[href="chapter9-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840" },
  { s: 'a.nav-link[href="chapter9-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe" },
  { s: 'a.btn[href="chapter9-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840 &rarr;" },
  { s: 'a.btn[href="chapter9-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe &rarr;" },
  { s: ".hero-course", t: "COMPX270 \u2014 \u968f\u673a\u4e0e\u9ad8\u7ea7\u7b97\u6cd5" },
  { s: "#hero h1", t: "\u7b2c\u4e5d\u7ae0\uff1a\u6d41\u7b97\u6cd5\u4e0e\u8349\u56fe II" },
  { s: ".hero-subtitle", t: "\u8349\u56fe\u7b97\u6cd5\u3001CountSketch\uff08\u2113\u2082\u4fdd\u8bc1\uff09\u3001CountMinSketch\uff08\u2113\u2081\u4fdd\u8bc1\uff09\u3001Turnstile\u6a21\u578b\u548c\u7ebf\u6027\u8349\u56fe\u3002" },
  { s: ".hero-cards .hero-card:nth-child(1) span:last-child", t: "\u8349\u56fe\u7b97\u6cd5" },
  { s: ".hero-cards .hero-card:nth-child(2) span:last-child", t: "CountSketch" },
  { s: ".hero-cards .hero-card:nth-child(3) span:last-child", t: "CountMinSketch" },
  { s: ".hero-cards .hero-card:nth-child(4) span:last-child", t: "\u6bd4\u8f83" },
  { s: "#sec-sketching .section-title", t: "\u8349\u56fe\u7b97\u6cd5" },
  { s: "#sec-countsketch .section-title", t: "CountSketch \u7b97\u6cd5" },
  { s: "#sec-countmin .section-title", t: "CountMinSketch \u7b97\u6cd5" },
  { s: "#sec-comparison .section-title", t: "\u7b97\u6cd5\u6bd4\u8f83" },
  { s: "#sec-tutorial .section-title", t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: '.solution-toggle[data-target="sol1"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol2"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol3"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol4"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol5"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol6"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol7"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: ".problem-tag.warm-up", i: 0, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 1, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 2, t: "\u70ed\u8eab" },
  { s: ".problem-tag.problem-solving", i: 0, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 1, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 2, t: "\u89e3\u9898" },
  { s: ".problem-tag.advanced", i: 0, t: "\u8fdb\u9636" },
];
var MATH9_T = [
  { s: ".back-bar a:first-child", t: "\u2190 \u8fd4\u56de\u5b66\u4e60\u6307\u5357" },
  { s: ".page-title-bar", t: "\u7b2c\u4e5d\u7ae0 \u00b7 \u6570\u5b66\u57fa\u7840" },
  { s: ".toc-sidebar .home-link", t: "\u2190 \u8bfe\u7a0b\u4e3b\u9875" },
  { s: ".toc-sidebar .sidebar-brand h2", t: "\u7b2c9\u7ae0\u6570\u5b66" },
  { s: ".toc-sidebar .back-to-study", t: "\u2190 \u8fd4\u56de\u7b2c\u4e5d\u7ae0\u5b66\u4e60\u6307\u5357" },
  { s: "#hero h1", t: "\u6570\u5b66\u57fa\u7840\uff1a\u6d41\u7b97\u6cd5\u4e0e\u8349\u56fe II" },
];

// ===================== CHAPTER 10 TRANSLATIONS =====================
var STUDY10_T = [
  { s: "[data-i18n-home]", t: "&larr; \u8bfe\u7a0b\u4e3b\u9875" },
  { s: '[data-section="hero"]', t: "\u6982\u89c8" },
  { s: '[data-section="sec-lp"]', t: "\u7ebf\u6027\u89c4\u5212" },
  { s: '[data-section="sec-ilp"]', t: "\u6574\u6570LP" },
  { s: '[data-section="sec-relax"]', t: "LP\u677e\u5f1b" },
  { s: '[data-section="sec-rounding"]', t: "\u968f\u673a\u820d\u5165" },
  { s: '[data-section="sec-maxsat"]', t: "Max-SAT" },
  { s: '[data-section="sec-bestof2"]', t: "\u6700\u4f18\u53d6\u4e8c" },
  { s: '[data-section="sec-tutorial"]', t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: 'a.nav-link[href="chapter10-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840" },
  { s: 'a.nav-link[href="chapter10-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe" },
  { s: 'a.btn[href="chapter10-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840 &rarr;" },
  { s: 'a.btn[href="chapter10-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe &rarr;" },
  { s: ".hero-course", t: "COMPX270 \u2014 \u968f\u673a\u4e0e\u9ad8\u7ea7\u7b97\u6cd5" },
  { s: "#hero h1", t: "\u7b2c\u5341\u7ae0\uff1a\u7ebf\u6027\u89c4\u5212\u4e0e\u968f\u673a\u820d\u5165" },
  { s: ".hero-subtitle", t: "LP\u677e\u5f1b\u3001ILP\u516c\u5f0f\u5316\u3001Min-Cut\u968f\u673a\u820d\u5165\u3001Max-SAT\u8fd1\u4f3c\uff081/2, 1-1/e, 3/4\uff09\u548cAM-GM\u4e0d\u7b49\u5f0f\u3002" },
  { s: ".hero-cards .hero-card:nth-child(1) span:last-child", t: "\u7ebf\u6027\u89c4\u5212" },
  { s: ".hero-cards .hero-card:nth-child(2) span:last-child", t: "LP\u677e\u5f1b" },
  { s: ".hero-cards .hero-card:nth-child(3) span:last-child", t: "\u968f\u673a\u820d\u5165" },
  { s: ".hero-cards .hero-card:nth-child(4) span:last-child", t: "Max-SAT" },
  { s: "#sec-lp .section-title", t: "\u7ebf\u6027\u89c4\u5212 (LP)" },
  { s: "#sec-ilp .section-title", t: "\u6574\u6570\u7ebf\u6027\u89c4\u5212 (ILP)" },
  { s: "#sec-relax .section-title", t: "LP\u677e\u5f1b" },
  { s: "#sec-rounding .section-title", t: "Min-Cut\u7684\u968f\u673a\u820d\u5165" },
  { s: "#sec-maxsat .section-title", t: "Max-SAT\u8fd1\u4f3c\u7b97\u6cd5" },
  { s: "#sec-bestof2 .section-title", t: "3/4\u8fd1\u4f3c\uff1a\u6700\u4f18\u53d6\u4e8c" },
  { s: "#sec-tutorial .section-title", t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: '.solution-toggle[data-target="sol1"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol2"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol3"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol4"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol5"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol6"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol7"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: ".problem-tag.warm-up", i: 0, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 1, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 2, t: "\u70ed\u8eab" },
  { s: ".problem-tag.problem-solving", i: 0, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 1, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 2, t: "\u89e3\u9898" },
  { s: ".problem-tag.advanced", i: 0, t: "\u8fdb\u9636" },
];
var MATH10_T = [
  { s: ".back-bar a:first-child", t: "\u2190 \u8fd4\u56de\u5b66\u4e60\u6307\u5357" },
  { s: ".page-title-bar", t: "\u7b2c\u5341\u7ae0 \u00b7 \u6570\u5b66\u57fa\u7840" },
  { s: ".toc-sidebar .home-link", t: "\u2190 \u8bfe\u7a0b\u4e3b\u9875" },
  { s: ".toc-sidebar .sidebar-brand h2", t: "\u7b2c10\u7ae0\u6570\u5b66" },
  { s: ".toc-sidebar .back-to-study", t: "\u2190 \u8fd4\u56de\u7b2c\u5341\u7ae0\u5b66\u4e60\u6307\u5357" },
  { s: "#hero h1", t: "\u6570\u5b66\u57fa\u7840\uff1aLP\u4e0e\u820d\u5165" },
  { s: "#sec-amgm .section-title", t: "AM-GM\u4e0d\u7b49\u5f0f" },
  { s: "#sec-concavity .section-title", t: "\u51f9\u6027\u4e0eJensen\u4e0d\u7b49\u5f0f" },
  { s: "#sec-approx .section-title", t: "\u8fd1\u4f3c\u6bd4" },
  { s: "#sec-1e .section-title", t: "\\(1 - 1/e\\) \u6781\u9650" },
];

// ===================== CHAPTER 11 TRANSLATIONS =====================
var STUDY11_T = [
  { s: "[data-i18n-home]", t: "&larr; \u8bfe\u7a0b\u4e3b\u9875" },
  { s: '[data-section="hero"]', t: "\u6982\u89c8" },
  { s: '[data-section="sec-tv"]', t: "\u5168\u53d8\u5dee\u8ddd\u79bb" },
  { s: '[data-section="sec-coin"]', t: "\u786c\u5e01\u504f\u5dee" },
  { s: '[data-section="sec-learning"]', t: "\u5206\u5e03\u5b66\u4e60" },
  { s: '[data-section="sec-uniformity"]', t: "\u5747\u5300\u6027\u68c0\u9a8c" },
  { s: '[data-section="sec-identity"]', t: "\u540c\u4e00\u6027\u68c0\u9a8c" },
  { s: '[data-section="sec-tutorial"]', t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: 'a.nav-link[href="chapter11-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840" },
  { s: 'a.nav-link[href="chapter11-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe" },
  { s: 'a.btn[href="chapter11-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840 &rarr;" },
  { s: 'a.btn[href="chapter11-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe &rarr;" },
  { s: ".hero-course", t: "COMPX270 \u2014 \u968f\u673a\u4e0e\u9ad8\u7ea7\u7b97\u6cd5" },
  { s: "#hero h1", t: "\u7b2c\u5341\u4e00\u7ae0\uff1a\u6982\u7387\u5206\u5e03\u7684\u5b66\u4e60\u4e0e\u68c0\u9a8c" },
  { s: ".hero-subtitle", t: "\u5168\u53d8\u5dee\u8ddd\u79bb\u3001O(k/\u03b5\u00b2)\u5206\u5e03\u5b66\u4e60\u3001O(\u221ak/\u03b5\u00b2)\u5747\u5300\u6027\u68c0\u9a8c\u3001\u78b0\u649e\u68c0\u9a8c\u5668\u548c\u540c\u4e00\u6027\u68c0\u9a8c\u3002" },
  { s: ".hero-cards .hero-card:nth-child(1) span:last-child", t: "\u5168\u53d8\u5dee\u8ddd\u79bb" },
  { s: ".hero-cards .hero-card:nth-child(2) span:last-child", t: "\u5206\u5e03\u5b66\u4e60" },
  { s: ".hero-cards .hero-card:nth-child(3) span:last-child", t: "\u5747\u5300\u6027\u68c0\u9a8c" },
  { s: ".hero-cards .hero-card:nth-child(4) span:last-child", t: "\u540c\u4e00\u6027\u68c0\u9a8c" },
  { s: "#sec-tv .section-title", t: "\u5168\u53d8\u5dee\u8ddd\u79bb" },
  { s: "#sec-coin .section-title", t: "\u786c\u5e01\u504f\u5dee\u4f30\u8ba1" },
  { s: "#sec-learning .section-title", t: "\u5206\u5e03\u5b66\u4e60" },
  { s: "#sec-uniformity .section-title", t: "\u5747\u5300\u6027\u68c0\u9a8c" },
  { s: "#sec-identity .section-title", t: "\u540c\u4e00\u6027\u68c0\u9a8c" },
  { s: "#sec-tutorial .section-title", t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: '.solution-toggle[data-target="sol1"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol2"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol3"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol4"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol5"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol6"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol7"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol8"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: ".problem-tag.warm-up", i: 0, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 1, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 2, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 3, t: "\u70ed\u8eab" },
  { s: ".problem-tag.problem-solving", i: 0, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 1, t: "\u89e3\u9898" },
  { s: ".problem-tag.problem-solving", i: 2, t: "\u89e3\u9898" },
  { s: ".problem-tag.advanced", i: 0, t: "\u8fdb\u9636" },
];
var MATH11_T = [
  { s: ".back-bar a:first-child", t: "\u2190 \u8fd4\u56de\u5b66\u4e60\u6307\u5357" },
  { s: ".page-title-bar", t: "\u7b2c\u5341\u4e00\u7ae0 \u00b7 \u6570\u5b66\u57fa\u7840" },
  { s: ".toc-sidebar .home-link", t: "\u2190 \u8bfe\u7a0b\u4e3b\u9875" },
  { s: ".toc-sidebar .sidebar-brand h2", t: "\u7b2c11\u7ae0\u6570\u5b66" },
  { s: ".toc-sidebar .back-to-study", t: "\u2190 \u8fd4\u56de\u7b2c\u5341\u4e00\u7ae0\u5b66\u4e60\u6307\u5357" },
  { s: "#hero h1", t: "\u6570\u5b66\u57fa\u7840\uff1a\u5206\u5e03\u5b66\u4e60\u4e0e\u68c0\u9a8c" },
];

// ===================== CHAPTER 12 TRANSLATIONS =====================
var STUDY12_T = [
  { s: "[data-i18n-home]", t: "&larr; \u8bfe\u7a0b\u4e3b\u9875" },
  { s: '[data-section="hero"]', t: "\u6982\u89c8" },
  { s: '[data-section="sec-setting"]', t: "\u95ee\u9898\u8bbe\u7f6e" },
  { s: '[data-section="sec-halving"]', t: "\u6298\u534a\u7b97\u6cd5" },
  { s: '[data-section="sec-mwu"]', t: "MWU\u7b97\u6cd5" },
  { s: '[data-section="sec-rmwu"]', t: "\u968f\u673cMWU" },
  { s: '[data-section="sec-tutorial"]', t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: 'a.nav-link[href="chapter12-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840" },
  { s: 'a.nav-link[href="chapter12-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe" },
  { s: 'a.btn[href="chapter12-math.html"]', t: "&#x1F4D0; \u6570\u5b66\u57fa\u7840 &rarr;" },
  { s: 'a.btn[href="chapter12-mindmap.html"]', t: "&#x1F5FA; \u601d\u7ef4\u5bfc\u56fe &rarr;" },
  { s: ".hero-course", t: "COMPX270 \u2014 \u968f\u673a\u4e0e\u9ad8\u7ea7\u7b97\u6cd5" },
  { s: "#hero h1", t: "\u7b2c\u5341\u4e8c\u7ae0\uff1a\u5411\u4e13\u5bb6\u5b66\u4e60" },
  { s: ".hero-subtitle", t: "\u4e13\u5bb6\u5efa\u8bae\u3001\u6298\u534a\u7b97\u6cd5\u3001\u4e58\u6cd5\u6743\u91cd\u66f4\u65b0\uff08MWU\uff09\u3001\u968f\u673cMWU\u3001\u52bf\u51fd\u6570\u8bba\u8bc1\u548c\u9057\u61be\u754c\u3002" },
  { s: ".hero-cards .hero-card:nth-child(1) span:last-child", t: "\u4e13\u5bb6\u5efa\u8bae" },
  { s: ".hero-cards .hero-card:nth-child(2) span:last-child", t: "\u6298\u534a\u7b97\u6cd5" },
  { s: ".hero-cards .hero-card:nth-child(3) span:last-child", t: "\u4e58\u6cd5\u6743\u91cd\u66f4\u65b0" },
  { s: ".hero-cards .hero-card:nth-child(4) span:last-child", t: "\u9057\u61be\u754c" },
  { s: "#sec-setting .section-title", t: "\u4e13\u5bb6\u5efa\u8bae\u95ee\u9898\u8bbe\u7f6e" },
  { s: "#sec-halving .section-title", t: "\u6298\u534a\u7b97\u6cd5" },
  { s: "#sec-mwu .section-title", t: "\u4e58\u6cd5\u6743\u91cd\u66f4\u65b0 (MWU)" },
  { s: "#sec-rmwu .section-title", t: "\u968f\u673c\u5316MWU" },
  { s: "#sec-tutorial .section-title", t: "\u4e60\u9898\u7ec3\u4e60" },
  { s: '.solution-toggle[data-target="sol1"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol2"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol3"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol4"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol5"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: '.solution-toggle[data-target="sol6"]', t: "\u67e5\u770b\u89e3\u7b54" },
  { s: ".problem-tag.warm-up", i: 0, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 1, t: "\u70ed\u8eab" },
  { s: ".problem-tag.warm-up", i: 2, t: "\u70ed\u8eab" },
  { s: ".problem-tag.problem-solving", i: 0, t: "\u89e3\u9898" },
  { s: ".problem-tag.advanced", i: 0, t: "\u8fdb\u9636" },
  { s: ".problem-tag.advanced", i: 1, t: "\u8fdb\u9636" },
];
var MATH12_T = [
  { s: ".back-bar a:first-child", t: "\u2190 \u8fd4\u56de\u5b66\u4e60\u6307\u5357" },
  { s: ".page-title-bar", t: "\u7b2c\u5341\u4e8c\u7ae0 \u00b7 \u6570\u5b66\u57fa\u7840" },
  { s: ".toc-sidebar .home-link", t: "\u2190 \u8bfe\u7a0b\u4e3b\u9875" },
  { s: ".toc-sidebar .sidebar-brand h2", t: "\u7b2c12\u7ae0\u6570\u5b66" },
  { s: ".toc-sidebar .back-to-study", t: "\u2190 \u8fd4\u56de\u7b2c\u5341\u4e8c\u7ae0\u5b66\u4e60\u6307\u5357" },
  { s: "#hero h1", t: "\u6570\u5b66\u57fa\u7840\uff1a\u5411\u4e13\u5bb6\u5b66\u4e60" },
];
