/**
 * COMP5318 flashcards — themes from weekly study guides (Python→SVM/PCA).
 * Schema: { ch, front, back, front_zh, back_zh } — use \\( \\) for KaTeX.
 */
var FLASHCARD_DECK_VERSION = "5318-sg1";
var ALL_FLASHCARD_DATA = [
  // —— Ch1 ——
  { ch: 1, front: "What does vectorisation mean in NumPy?", back: "Express operations as array-wide primitives (ufuncs) so work happens in compiled loops over contiguous memory, not per-element Python.", front_zh: "NumPy 中的向量化指什么？", back_zh: "把运算写成数组级原语（ufuncs），在编译循环与连续内存上批量计算，而非逐元素 Python。" },
  { ch: 1, front: "pandas DataFrame: rows vs columns (typical convention).", back: "Rows are observations (samples); columns are variables (features). Index labels rows; column names label variables.", front_zh: "pandas DataFrame 中行与列（常见约定）？", back_zh: "行是样本；列是变量/特征。索引标行，列名标变量。" },
  { ch: 1, front: "Why use (n−1) in sample variance?", back: "Bessel’s correction: dividing by n−1 makes the sample variance an unbiased estimator of the population variance for i.i.d. samples.", front_zh: "样本方差为何除以 (n−1)？", back_zh: "贝塞尔校正：i.i.d. 下除以 n−1 使样本方差为总体方差的无偏估计。" },
  { ch: 1, front: "Dot product u·v = 0 means geometrically?", back: "Vectors are orthogonal (perpendicular) in Euclidean space.", front_zh: "点积 u·v = 0 的几何含义？", back_zh: "欧氏空间中两向量正交（垂直）。" },
  { ch: 1, front: "Shape of column-wise mean of X ∈ ℝ^{n×d}.", back: "(d,) or (1,d): one mean per feature after averaging over the n rows.", front_zh: "X∈ℝ^{n×d} 按列求均值后的形状？", back_zh: "(d,) 或 (1,d)：对每个特征在 n 行上求平均。" },
  { ch: 1, front: ".loc vs .iloc in pandas.", back: ".loc selects by label; .iloc selects by integer position (0-based).", front_zh: "pandas 中 .loc 与 .iloc？", back_zh: ".loc 按标签；.iloc 按整数位置（从 0 起）。" },
  { ch: 1, front: "What is broadcasting in NumPy?", back: "Stretching smaller arrays along dimensions of size 1 to align shapes for element-wise ops without copying full tensors (subject to rules).", front_zh: "NumPy 的 broadcasting？", back_zh: "在长度为 1 的维度上扩展较小数组以对齐形状做逐元素运算（遵循广播规则）。" },
  { ch: 1, front: "Empirical variance formula (sample).", back: "\\(\\frac{1}{n-1}\\sum_i (x_i-\\bar{x})^2\\) for unbiased estimate.", front_zh: "样本方差公式？", back_zh: "\\(\\frac{1}{n-1}\\sum_i (x_i-\\bar{x})^2\\)（无偏估计常用形式）。" },

  // —— Ch2 ——
  { ch: 2, front: "k-NN decision rule (classification).", back: "Majority vote among the k nearest training points by a chosen distance.", front_zh: "k-NN 分类的决策规则？", back_zh: "在所选距离下，取 k 个最近训练点的多数票。" },
  { ch: 2, front: "Why scale features for Euclidean k-NN?", back: "Otherwise large-magnitude features dominate the distance.", front_zh: "欧氏距离 k-NN 为何要缩放特征？", back_zh: "否则大尺度特征会主导距离。" },
  { ch: 2, front: "ℓ₁ vs ℓ₂ distance intuition.", back: "ℓ₁ (Manhattan) sums absolute coordinate differences; ℓ₂ (Euclidean) is straight-line length.", front_zh: "ℓ₁ 与 ℓ₂ 距离直观？", back_zh: "ℓ₁（曼哈顿）为坐标绝对差之和；ℓ₂（欧氏）为直线长度。" },
  { ch: 2, front: "Effect of larger k in k-NN.", back: "Smoother decision boundary; typically more bias, less variance.", front_zh: "k 增大对 k-NN 的影响？", back_zh: "决策边界更平滑；通常偏差更高、方差更低。" },
  { ch: 2, front: "Fit scaler on which split?", back: "Training data only; same transformation applied to validation/test to avoid leakage.", front_zh: "在哪些数据上 fit 缩放器？", back_zh: "仅用训练集拟合参数；同一变换用于验证/测试以防泄漏。" },
  { ch: 2, front: "Lazy learning vs eager learning.", back: "k-NN is lazy (stores data, computes at query); logistic regression is eager (fits weights up front).", front_zh: "懒惰学习与急切学习？", back_zh: "k-NN 懒惰（存数据、查询时算）；逻辑回归急切（先拟合权重）。" },
  { ch: 2, front: "Train/test split purpose.", back: "Estimate generalisation: fit on train, report unbiased performance on held-out test.", front_zh: "训练/测试划分的目的？", back_zh: "估计泛化：在训练集上拟合，在留出测试集上报告无偏性能。" },
  { ch: 2, front: "Curse of dimensionality (high-level).", back: "In high dimensions, distances become less informative and data sparse — k-NN and many methods need more data.", front_zh: "维数灾难（大意）？", back_zh: "高维下距离区分度下降、数据稀疏——k-NN 等方法更吃样本。" },

  // —— Ch3 ——
  { ch: 3, front: "OLS objective for linear regression.", back: "Minimise \\(\\sum_i (y_i - w^\\top x_i)^2\\).", front_zh: "线性回归 OLS 目标？", back_zh: "最小化 \\(\\sum_i (y_i - w^\\top x_i)^2\\)。" },
  { ch: 3, front: "Ridge penalty.", back: "Add \\(\\lambda\\|w\\|_2^2\\) to shrink weights and stabilise when features are correlated.", front_zh: "Ridge 惩罚项？", back_zh: "加 \\(\\lambda\\|w\\|_2^2\\) 收缩权重，在特征相关时更稳定。" },
  { ch: 3, front: "Lasso penalty and sparsity.", back: "\\(\\lambda\\|w\\|_1\\) can set some weights to exactly zero — feature selection.", front_zh: "Lasso 与稀疏性？", back_zh: "\\(\\lambda\\|w\\|_1\\) 可使部分权重恰为 0——特征选择。" },
  { ch: 3, front: "Logistic regression output interpretation.", back: "Sigmoid of linear score gives \\(P(y=1\\mid x)\\) for binary classification.", front_zh: "逻辑回归输出含义？", back_zh: "线性分数经 sigmoid 得二分类的 \\(P(y=1\\mid x)\\)。" },
  { ch: 3, front: "Cross-entropy loss for binary logistic regression.", back: "Matches Bernoulli negative log-likelihood; penalises confident wrong predictions.", front_zh: "二分类逻辑回归的交叉熵？", back_zh: "对应伯努利负对数似然；对自信的错误预测惩罚大。" },
  { ch: 3, front: "Ridge vs Lasso when interpretability matters.", back: "Lasso often preferred for sparse interpretable models; Ridge keeps all features with small weights.", front_zh: "重视可解释性时 Ridge 与 Lasso？", back_zh: "Lasso 常得稀疏可解释模型；Ridge 保留全部特征但权重缩小。" },
  { ch: 3, front: "Multicollinearity: OLS vs Ridge.", back: "OLS can be unstable (large variance); Ridge mitigates by penalising large weights.", front_zh: "多重共线性下 OLS 与 Ridge？", back_zh: "OLS 可能不稳定；Ridge 通过惩罚大权重缓解。" },
  { ch: 3, front: "Probabilistic view of logistic regression.", back: "Models log-odds as linear in features; MLE leads to cross-entropy minimisation.", front_zh: "逻辑回归的概率视角？", back_zh: "对数几率建模为特征的线性函数；MLE 对应最小化交叉熵。" },

  // —— Ch4 ——
  { ch: 4, front: "Naive Bayes: what is “naive”?", back: "Assumes features are conditionally independent given the class — rarely true but can work well (esp. text).", front_zh: "朴素贝叶斯的「朴素」指什么？", back_zh: "假设给定类别下特征条件独立——常不真但仍有效（尤其文本）。" },
  { ch: 4, front: "Precision vs recall (binary).", back: "Precision = TP/(TP+FP); recall = TP/(TP+FN).", front_zh: "精确率与召回率（二分类）？", back_zh: "精确率=TP/(TP+FP)；召回率=TP/(TP+FN)。" },
  { ch: 4, front: "F1 score.", back: "Harmonic mean of precision and recall: \\(2PR/(P+R)\\).", front_zh: "F1 分数？", back_zh: "精确率与召回率的调和平均：\\(2PR/(P+R)\\)。" },
  { ch: 4, front: "Confusion matrix: rows vs columns (typical).", back: "Rows often true class, columns predicted (or vice versa — always read the axis labels).", front_zh: "混淆矩阵行与列（常见）？", back_zh: "常行为真实类、列为预测（或相反——务必看轴标签）。" },
  { ch: 4, front: "Why k-fold CV?", back: "Uses data efficiently; estimates performance variance; tunes hyperparameters on validation folds, not test.", front_zh: "为何用 k 折交叉验证？", back_zh: "更高效用数据；估计性能波动；在验证折上调参而非测试集。" },
  { ch: 4, front: "Grid search.", back: "Exhaustive search over a discrete grid of hyperparameter combinations with a CV score.", front_zh: "网格搜索？", back_zh: "在离散超参数网格上穷举并用交叉验证分数选择。" },
  { ch: 4, front: "Bayes rule for classification.", back: "\\(P(c|x) \\propto P(x|c)P(c)\\); normalise over classes.", front_zh: "分类中的贝叶斯公式？", back_zh: "\\(P(c|x) \\propto P(x|c)P(c)\\)；对各类归一化。" },
  { ch: 4, front: "Accuracy can mislead when classes are imbalanced.", back: "Always check precision/recall/F1 or ROC-AUC depending on the cost of errors.", front_zh: "类别不平衡时准确率为何误导？", back_zh: "需看精确率/召回率/F1 或 ROC-AUC 等，视错分代价而定。" },

  // —— Ch5 ——
  { ch: 5, front: "Gini impurity (binary classification node).", back: "\\(1 - \\sum_c p_c^2\\); 0 when node is pure.", front_zh: "二分类节点基尼不纯度？", back_zh: "\\(1 - \\sum_c p_c^2\\)；纯节点时为 0。" },
  { ch: 5, front: "Entropy impurity (discrete).", back: "\\(-\\sum_c p_c \\log p_c\\); also 0 for a pure node.", front_zh: "离散熵不纯度？", back_zh: "\\(-\\sum_c p_c \\log p_c\\)；纯节点亦为 0。" },
  { ch: 5, front: "Bagging idea.", back: "Bootstrap samples + train diverse models; average (regression) or vote (classification) to reduce variance.", front_zh: "装袋（Bagging）思想？", back_zh: "自助抽样训练多个模型；回归取平均、分类投票以降低方差。" },
  { ch: 5, front: "Random Forest vs bagging only.", back: "Adds random feature subsets at each split to decorrelate trees.", front_zh: "随机森林与单纯装袋？", back_zh: "每次划分再随机特征子集，使树之间去相关。" },
  { ch: 5, front: "Boosting (high level).", back: "Sequentially add weak learners that correct residual errors / negative gradients of the loss.", front_zh: "Boosting（大意）？", back_zh: "顺序加入弱学习器，拟合残差/损失的负梯度。" },
  { ch: 5, front: "Tree depth vs overfitting.", back: "Deeper trees fit training data more closely — higher variance; pruning/limits help.", front_zh: "树深度与过拟合？", back_zh: "更深更贴训练——方差更高；剪枝/深度限制有助。" },
  { ch: 5, front: "Feature importance in tree ensembles.", back: "Often measured by impurity decrease or permutation importance — interpret with care.", front_zh: "树集成的特征重要性？", back_zh: "常用不纯度下降或置换重要性——解释需谨慎。" },
  { ch: 5, front: "Bias–variance tradeoff (trees vs ensembles).", back: "Deep trees: low bias, high variance; ensembles average many trees to cut variance.", front_zh: "偏差–方差（树与集成）？", back_zh: "深树偏差低方差高；集成平均多棵树降方差。" },

  // —— Ch6 ——
  { ch: 6, front: "SVM margin (soft margin).", back: "Balance between maximising margin and slack for misclassified / inside-margin points.", front_zh: "软间隔 SVM 的间隔？", back_zh: "在最大化间隔与对误分/落入间隔内点的松弛之间折中。" },
  { ch: 6, front: "Hinge loss role in SVM.", back: "Penalises predictions inside the margin or with wrong sign; linear penalty for violations.", front_zh: "SVM 中 hinge 损失的作用？", back_zh: "惩罚落在间隔内或符号错误的预测；对违反量线性惩罚。" },
  { ch: 6, front: "Kernel trick (idea).", back: "Replace dot products with \\(K(x,x')\\) so implicit high-dimensional \\(\\phi(x)\\) need not be computed.", front_zh: "核技巧（思想）？", back_zh: "用 \\(K(x,x')\\) 替代点积，隐式高维 \\(\\phi(x)\\) 不必显式计算。" },
  { ch: 6, front: "RBF kernel intuition.", back: "Similarity decays with distance in input space; smooth nonlinear boundaries.", front_zh: "RBF 核直观？", back_zh: "相似度随输入空间距离衰减；可得到平滑非线性边界。" },
  { ch: 6, front: "PCA: first principal component.", back: "Direction of maximum variance of centred data — eigenvector of covariance with largest eigenvalue.", front_zh: "PCA 第一主成分？", back_zh: "中心化数据方差最大的方向——协方差矩阵最大特征值对应的特征向量。" },
  { ch: 6, front: "PCA for dimensionality reduction.", back: "Project onto top-\\(k\\) eigenvectors; minimises reconstruction error under orthogonality (given \\(k\\)).", front_zh: "PCA 降维？", back_zh: "投影到前 k 个特征向量；在正交约束下最小化重构误差（给定 k）。" },
  { ch: 6, front: "PCA vs supervised LDA (conceptual).", back: "PCA ignores labels (max variance); LDA maximises class separation (uses labels).", front_zh: "PCA 与有监督 LDA（概念）？", back_zh: "PCA 不看标签（最大方差）；LDA 最大化类间分离（用标签）。" },
  { ch: 6, front: "Explained variance ratio (PCA).", back: "\\(\\lambda_j / \\sum_i \\lambda_i\\) — fraction of total variance along component \\(j\\).", front_zh: "PCA 的解释方差比？", back_zh: "\\(\\lambda_j / \\sum_i \\lambda_i\\)——第 j 个分量解释的方差比例。" },
];
