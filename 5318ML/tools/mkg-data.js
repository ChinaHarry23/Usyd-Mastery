window.KG_CONFIG = {
  langKey: "comp5318_lang",
  fromParam: "mkg",
  numChapters: 6,
  chapterColors: { 1:"#6c8cff", 2:"#34d399", 3:"#fbbf24", 4:"#a78bfa", 5:"#f87171", 6:"#f472b6" },
  chapterNames: {
    1:"W1 Math", 2:"W2 Math", 3:"W3 Math", 4:"W4 Math", 5:"W5 Math", 6:"W6 Math"
  },
  chapterNamesZh: {
    1:"第1周数学", 2:"第2周数学", 3:"第3周数学", 4:"第4周数学", 5:"第5周数学", 6:"第6周数学"
  },
  clickHint: { en: "Click to open Math Foundations section", zh: "点击打开数学基础页面" },
  ui: {
    en: {
      title: "Math Foundations Knowledge Graph — COMP5318", navHome: "← Home", navCourse: "Course concepts", pageTitle: "Math Foundations Knowledge Graph",
      search: "Search math topics...", threshold: "Threshold", diff: "Sort by Difficulty", chapter: "Group by Chapter", reset: "Reset View",
      weeks: "Math pages (by week)", w1: "W1 Python / stats basics", w2: "W2 Distances & scaling", w3: "W3 Regression math", w4: "W4 Bayes & metrics", w5: "W5 Trees & ensembles", w6: "W6 SVM & PCA",
      legendDiff: "Difficulty", diffScale: "● small = easier   ⬤ larger = harder", click: "Click node → open Math Foundations section",
      layout: "Layout", sort: "<strong>Sort by Difficulty</strong> &mdash; top = easier, bottom = harder", group: "<strong>Group by Chapter</strong> &mdash; W1 &larr; left &hellip; W6 &rarr; right",
      both: "You can enable <strong>both</strong> for a chapter &times; difficulty grid.", nodes: "nodes", edges: "edges", thresholdStats: "threshold ≥ "
    },
    zh: {
      title: "数学基础知识图谱 — COMP5318", navHome: "← 首页", navCourse: "课程概念", pageTitle: "数学基础知识图谱",
      search: "搜索数学主题...", threshold: "阈值", diff: "按难度排序", chapter: "按章节分组", reset: "重置视图",
      weeks: "数学页面（按周）", w1: "第1周 Python / 统计基础", w2: "第2周 距离与缩放", w3: "第3周 回归数学", w4: "第4周 贝叶斯与指标", w5: "第5周 树与集成", w6: "第6周 SVM 与 PCA",
      legendDiff: "难度", diffScale: "● 小 = 更容易   ⬤ 大 = 更困难", click: "点击节点 → 打开数学基础对应部分",
      layout: "布局", sort: "<strong>按难度排序</strong> &mdash; 上方更简单，下方更困难", group: "<strong>按章节分组</strong> &mdash; 第1周在左，…，第6周在右",
      both: "可同时开启<strong>两种</strong>布局，形成章节 × 难度网格。", nodes: "个节点", edges: "条边", thresholdStats: "阈值 ≥ "
    }
  },
  nodes: [
    ["m1-matrix",1,1,"Data matrix X","Dataset as $X \\in \\mathbb{R}^{n \\times d}$ with examples as rows and features as columns.","../chapters/chapter1/web/chapter1-math.html#sec-layout"],
    ["m1-axis",1,1,"Axis reductions","With shape $(n,d)$, $axis=0$ returns one value per feature and $axis=1$ one value per example.","../chapters/chapter1/web/chapter1-math.html#sec-layout"],
    ["m1-mean",1,1,"Sample mean","Column-wise average $\\bar{x}=\\frac{1}{n}\\sum_i x_i$.","../chapters/chapter1/web/chapter1-math.html#sec-formulas"],
    ["m1-var",1,2,"Sample variance","Unbiased variance uses $s^2=\\frac{1}{n-1}\\sum_i (x_i-\\bar{x})^2$.","../chapters/chapter1/web/chapter1-math.html#sec-formulas"],
    ["m1-cov",1,2,"Covariance","Joint movement via $\\operatorname{cov}(a,b)=\\frac{1}{n-1}\\sum_i(a_i-\\bar a)(b_i-\\bar b)$.","../chapters/chapter1/web/chapter1-math.html#sec-formulas"],
    ["m1-corr",1,2,"Correlation","Normalises covariance by both standard deviations to stay in $[-1,1]$.","../chapters/chapter1/web/chapter1-math.html#sec-formulas"],
    ["m1-dot",1,1,"Dot product","Linear score building block $a^\\top b = \\sum_j a_j b_j$.","../chapters/chapter1/web/chapter1-math.html#sec-formulas"],

    ["m2-euclid",2,2,"Euclidean distance","$D_{L2}(A,B)=\\sqrt{\\sum_j(a_j-b_j)^2}$.","../chapters/chapter2/web/chapter2-math.html#sec-distance"],
    ["m2-manhattan",2,2,"Manhattan distance","$D_{L1}(A,B)=\\sum_j |a_j-b_j|$.","../chapters/chapter2/web/chapter2-math.html#sec-distance"],
    ["m2-nominal",2,2,"Nominal mismatch distance","For categorical features, match $=0$ and mismatch $=1$ before aggregation.","../chapters/chapter2/web/chapter2-math.html#sec-distance"],
    ["m2-scale",2,2,"Min-max scaling","$x' = \\frac{x-\\min(x)}{\\max(x)-\\min(x)}$ keeps features on comparable ranges.","../chapters/chapter2/web/chapter2-math.html#sec-scaling"],
    ["m2-1nn",2,1,"1-NN vote","Predict from the single closest labelled example.","../chapters/chapter2/web/chapter2-math.html#sec-example1"],
    ["m2-knn",2,2,"k-NN majority vote","Use the majority label among the $k$ closest neighbours.","../chapters/chapter2/web/chapter2-math.html#sec-example1"],
    ["m2-cost",2,3,"Prediction cost O(mn)","With $m$ training examples and $n$ features, naive lookup compares against every stored point.","../chapters/chapter2/web/chapter2-math.html#sec-traps"],

    ["m3-ols",3,2,"OLS objective","Minimise $\\|Xw-y\\|^2$ or equivalently the sum of squared residuals.","../chapters/chapter3/web/chapter3-math.html#sec-ols"],
    ["m3-normal",3,3,"Normal equations","Closed form $w=(X^\\top X)^{-1}X^\\top y$ when $X^\\top X$ is invertible.","../chapters/chapter3/web/chapter3-math.html#sec-ols"],
    ["m3-residual",3,2,"Residual","Per-example error $\\varepsilon_i = y_i - \\hat y_i$.","../chapters/chapter3/web/chapter3-math.html#sec-ols"],
    ["m3-sse",3,2,"SSE and R^2","$R^2=1-\\mathrm{SSE}/\\mathrm{SST}$ compares the model with predicting the mean.","../chapters/chapter3/web/chapter3-math.html#sec-ols"],
    ["m3-sigmoid",3,2,"Sigmoid","$\\sigma(z)=1/(1+e^{-z})$ maps any real score to $(0,1)$.","../chapters/chapter3/web/chapter3-math.html#sec-logit"],
    ["m3-logit",3,2,"Logit","$\\log\\frac{p}{1-p}=w^\\top x+b$ is the linear form behind logistic regression.","../chapters/chapter3/web/chapter3-math.html#sec-logit"],
    ["m3-ridge",3,3,"Ridge penalty","Adds $\\alpha \\sum_j w_j^2$ to shrink large coefficients smoothly.","../chapters/chapter3/web/chapter3-math.html#sec-regularisation"],
    ["m3-lasso",3,3,"Lasso penalty","Adds $\\alpha \\sum_j |w_j|$ and can set some weights exactly to zero.","../chapters/chapter3/web/chapter3-math.html#sec-regularisation"],

    ["m4-bayes",4,2,"Bayes theorem","$P(H|E)=\\frac{P(E|H)P(H)}{P(E)}$.","../chapters/chapter4/web/chapter4-math.html#sec-bayes"],
    ["m4-factor",4,2,"NB factorisation","$P(c|E_1,\\ldots,E_d) \\propto P(c)\\prod_j P(E_j|c)$.","../chapters/chapter4/web/chapter4-math.html#sec-bayes"],
    ["m4-gauss",4,3,"Gaussian likelihood","For numeric NB, likelihood is modelled with a normal density using class-specific $\\mu$ and $\\sigma$.","../chapters/chapter4/web/chapter4-math.html#sec-bayes"],
    ["m4-conf",4,2,"Confusion matrix","Stores TP, FP, FN, and TN counts for classification outcomes.","../chapters/chapter4/web/chapter4-math.html#sec-metrics"],
    ["m4-precision",4,2,"Precision","$\\frac{TP}{TP+FP}$ measures how trustworthy positive predictions are.","../chapters/chapter4/web/chapter4-math.html#sec-metrics"],
    ["m4-recall",4,2,"Recall","$\\frac{TP}{TP+FN}$ measures how many real positives are recovered.","../chapters/chapter4/web/chapter4-math.html#sec-metrics"],
    ["m4-f1",4,2,"F1 score","$\\frac{2PR}{P+R} = \\frac{2TP}{2TP+FP+FN}$.","../chapters/chapter4/web/chapter4-math.html#sec-metrics"],
    ["m4-kfold",4,2,"k-fold CV","Split the training data into $k$ folds and average validation performance across rotations.","../chapters/chapter4/web/chapter4-math.html#sec-cv"],

    ["m5-entropy",5,2,"Entropy","$H(S)=-\\sum_k p_k\\log_2 p_k$ measures node impurity.","../chapters/chapter5/web/chapter5-math.html#sec-impurity"],
    ["m5-child",5,3,"Weighted child entropy","$H(S|A)=\\sum_j \\frac{|S_j|}{|S|}H(S_j)$ after a split on attribute $A$.","../chapters/chapter5/web/chapter5-math.html#sec-impurity"],
    ["m5-ig",5,2,"Information gain","$\\mathrm{Gain}(S,A)=H(S)-H(S|A)$.","../chapters/chapter5/web/chapter5-math.html#sec-impurity"],
    ["m5-gini",5,2,"Gini impurity","$G(S)=1-\\sum_k p_k^2$.","../chapters/chapter5/web/chapter5-math.html#sec-impurity"],
    ["m5-bootstrap",5,3,"Bootstrap sample","Bagging resamples $n$ training examples with replacement from the original set.","../chapters/chapter5/web/chapter5-math.html#sec-ensembles"],
    ["m5-bag",5,2,"Bagging vote","Average or majority-vote over models trained on bootstrap samples.","../chapters/chapter5/web/chapter5-math.html#sec-ensembles"],
    ["m5-boost",5,3,"Boosting weights","Later models focus more on previously misclassified examples.","../chapters/chapter5/web/chapter5-math.html#sec-ensembles"],
    ["m5-err",5,4,"Ensemble error rate","Majority vote can cut error sharply when base models are better than random and not perfectly correlated.","../chapters/chapter5/web/chapter5-math.html#sec-ensembles"],

    ["m6-hyper",6,2,"Hyperplane score","Linear SVM evaluates $w^\\top x + b$.","../chapters/chapter6/web/chapter6-math.html#sec-svm"],
    ["m6-dist",6,3,"Point-hyperplane distance","Distance is $|w^\\top x+b|/\\|w\\|$.","../chapters/chapter6/web/chapter6-math.html#sec-svm"],
    ["m6-margin",6,3,"Margin width","Canonical full margin is $2/\\|w\\|$.","../chapters/chapter6/web/chapter6-math.html#sec-svm"],
    ["m6-kernel",6,3,"Kernel trick","Compute $K(x,x')=\\langle \\phi(x), \\phi(x')\\rangle$ without forming $\\phi$ explicitly.","../chapters/chapter6/web/chapter6-math.html#sec-svm"],
    ["m6-rbf",6,3,"RBF kernel","$K(x,x')=e^{-\\gamma\\|x-x'\\|^2}$ creates smooth nonlinear boundaries.","../chapters/chapter6/web/chapter6-math.html#sec-kernels"],
    ["m6-covmat",6,2,"Covariance matrix","PCA starts from the covariance of the centred data matrix.","../chapters/chapter6/web/chapter6-math.html#sec-pca"],
    ["m6-eig",6,3,"Eigenvalues and eigenvectors","Principal directions are eigenvectors ordered by descending eigenvalue.","../chapters/chapter6/web/chapter6-math.html#sec-pca"],
    ["m6-variance",6,3,"Explained variance ratio","Each component contributes $\\lambda_j / \\sum_k \\lambda_k$.","../chapters/chapter6/web/chapter6-math.html#sec-pca"],
    ["m6-proj",6,2,"PCA projection","Project data onto the top principal components to reduce dimension.","../chapters/chapter6/web/chapter6-math.html#sec-example2"],
    ["m6-svd",6,4,"SVD view of PCA","With $X=U\\Sigma V^\\top$, columns of $V$ define the principal directions.","../chapters/chapter6/web/chapter6-math.html#sec-pca"]
  ].map(function(n) {
    return { id:n[0], ch:n[1], diff:n[2], label:n[3], def:n[4], href:n[5] };
  }),
  edges: [
    ["m1-matrix","m1-axis",9], ["m1-axis","m1-mean",8], ["m1-mean","m1-var",9],
    ["m1-var","m1-cov",7], ["m1-cov","m1-corr",9], ["m1-matrix","m1-dot",6],
    ["m1-mean","m1-cov",6], ["m1-dot","m6-hyper",7], ["m1-cov","m6-covmat",8],

    ["m2-euclid","m2-manhattan",7], ["m2-euclid","m2-1nn",9], ["m2-1nn","m2-knn",9],
    ["m2-nominal","m2-1nn",7], ["m2-scale","m2-euclid",8], ["m2-scale","m2-knn",6],
    ["m2-knn","m2-cost",6], ["m2-scale","m2-cost",5], ["m1-matrix","m2-euclid",5],
    ["m2-scale","m6-hyper",5], ["m2-euclid","m6-rbf",5],

    ["m3-ols","m3-normal",9], ["m3-ols","m3-residual",8], ["m3-residual","m3-sse",9],
    ["m3-sigmoid","m3-logit",9], ["m3-ols","m3-ridge",7], ["m3-ols","m3-lasso",7],
    ["m3-ridge","m3-lasso",8], ["m3-sse","m4-kfold",5], ["m3-logit","m4-conf",5],

    ["m4-bayes","m4-factor",9], ["m4-factor","m4-gauss",7], ["m4-conf","m4-precision",9],
    ["m4-conf","m4-recall",9], ["m4-precision","m4-f1",8], ["m4-recall","m4-f1",8],
    ["m4-kfold","m4-conf",5], ["m4-kfold","m5-err",4],

    ["m5-entropy","m5-child",9], ["m5-child","m5-ig",9], ["m5-entropy","m5-gini",7],
    ["m5-bootstrap","m5-bag",9], ["m5-bag","m5-err",8], ["m5-boost","m5-err",7],
    ["m5-ig","m5-gini",6], ["m4-kfold","m5-boost",4],

    ["m6-hyper","m6-dist",9], ["m6-dist","m6-margin",9], ["m6-hyper","m6-kernel",7],
    ["m6-kernel","m6-rbf",9], ["m6-margin","m6-kernel",6], ["m6-covmat","m6-eig",9],
    ["m6-eig","m6-variance",9], ["m6-variance","m6-proj",9], ["m6-eig","m6-svd",8],
    ["m6-proj","m6-svd",6], ["m1-var","m6-variance",7]
  ]
};
