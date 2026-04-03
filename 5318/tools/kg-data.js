window.KG_CONFIG = {
  langKey: "comp5318_lang",
  fromParam: "kg",
  numChapters: 6,
  chapterColors: { 1:"#6c8cff", 2:"#34d399", 3:"#fbbf24", 4:"#a78bfa", 5:"#f87171", 6:"#f472b6" },
  chapterNames: {
    1:"W1: Python & Data Tools", 2:"W2: k-Nearest Neighbours", 3:"W3: Linear & Logistic Regression",
    4:"W4: Naive Bayes & Evaluation", 5:"W5: Trees & Ensembles", 6:"W6: SVMs & PCA"
  },
  chapterNamesZh: {
    1:"第1周：Python 与数据工具", 2:"第2周：k近邻", 3:"第3周：线性/逻辑回归",
    4:"第4周：朴素贝叶斯与评估", 5:"第5周：树与集成", 6:"第6周：SVM 与 PCA"
  },
  diffLabelsZh: ["","入门","中等","有挑战","进阶","专家"],
  ui: {
    en: {
      title: "Knowledge Graph — COMP5318", navHome: "← Home", navMath: "Math concepts", pageTitle: "Knowledge Graph",
      search: "Search concepts...", threshold: "Threshold", diff: "Sort by Difficulty", chapter: "Group by Chapter", reset: "Reset View",
      weeks: "Weeks (Chapters)", w1: "W1 Python & tools", w2: "W2 k-NN", w3: "W3 Regression", w4: "W4 NB & evaluation", w5: "W5 Trees & ensembles", w6: "W6 SVM & PCA",
      legendDiff: "Difficulty", diffScale: "● small = easy   ⬤ large = hard", click: "Click node → go to source page",
      layout: "Layout", sort: "<strong>Sort by Difficulty</strong> &mdash; top = easier, bottom = harder", group: "<strong>Group by Chapter</strong> &mdash; W1 &larr; left &hellip; W6 &rarr; right",
      both: "You can enable <strong>both</strong> for a chapter &times; difficulty grid.", nodes: "nodes", edges: "edges", thresholdStats: "threshold ≥ "
    },
    zh: {
      title: "知识图谱 — COMP5318", navHome: "← 首页", navMath: "数学概念", pageTitle: "知识图谱",
      search: "搜索概念...", threshold: "阈值", diff: "按难度排序", chapter: "按章节分组", reset: "重置视图",
      weeks: "周次（章节）", w1: "第1周 Python 与工具", w2: "第2周 k近邻", w3: "第3周 回归", w4: "第4周 朴素贝叶斯与评估", w5: "第5周 决策树与集成", w6: "第6周 SVM 与 PCA",
      legendDiff: "难度", diffScale: "● 小 = 容易   ⬤ 大 = 困难", click: "点击节点 → 跳转到来源页面",
      layout: "布局", sort: "<strong>按难度排序</strong> &mdash; 上方更简单，下方更困难", group: "<strong>按章节分组</strong> &mdash; 第1周在左，…，第6周在右",
      both: "可同时开启<strong>两种</strong>布局，形成章节 × 难度网格。", nodes: "个节点", edges: "条边", thresholdStats: "阈值 ≥ "
    }
  },
  nodes: [
    ["w1-process",1,1,"Data-mining process","Problem framing, data collection, modelling, and evaluation as one workflow.","../chapters/chapter1/web/chapter1-study.html#sec-ml-context"],
    ["w1-task",1,1,"Prediction vs description","The course starts by separating predictive tasks from descriptive data analysis.","../chapters/chapter1/web/chapter1-study.html#sec-ml-context"],
    ["w1-python",1,1,"Python essentials","Lists, loops, functions, and reusable code patterns for the labs.","../chapters/chapter1/web/chapter1-study.html#sec-python"],
    ["w1-numpy",1,1,"NumPy arrays","Shapes, indexing, slicing, and array operations for ML-ready data.","../chapters/chapter1/web/chapter1-study.html#sec-numpy"],
    ["w1-pandas",1,1,"pandas DataFrames","Column-labelled tables for loading, filtering, and inspecting datasets.","../chapters/chapter1/web/chapter1-study.html#sec-pandas"],
    ["w1-workflow",1,1,"Notebook workflow","How to move between lecture ideas, Jupyter cells, and reproducible experiments.","../chapters/chapter1/web/chapter1-study.html#sec-workflow"],

    ["w2-knn",2,1,"k-NN classifier","Predicts a label from the closest stored training examples.","../chapters/chapter2/web/chapter2-study.html#sec-knn"],
    ["w2-neighborhood",2,2,"Neighbour vote","Classification changes with the local neighbourhood and the choice of k.","../chapters/chapter2/web/chapter2-study.html#sec-knn"],
    ["w2-iris",2,1,"Iris dataset workflow","The notebook uses iris to show loading, splitting, plotting, and prediction.","../chapters/chapter2/web/chapter2-study.html#sec-split"],
    ["w2-split",2,2,"Train/test split","Separates model building from honest evaluation on unseen data.","../chapters/chapter2/web/chapter2-study.html#sec-split"],
    ["w2-scale",2,2,"Scaling and leakage","Distance-based models need scaling, but the scaler must be fit only on training data.","../chapters/chapter2/web/chapter2-study.html#sec-norm"],
    ["w2-1r",2,2,"1R rules","Builds a one-attribute rule set by choosing the lowest-error attribute.","../chapters/chapter2/web/chapter2-study.html#sec-rules"],
    ["w2-prism",2,3,"PRISM","Learns separate high-precision rules for each class by growing conditions greedily.","../chapters/chapter2/web/chapter2-study.html#sec-rules"],
    ["w2-tutorial",2,2,"Tutorial reasoning","You should be able to compute distances, order neighbours, and justify the predicted class.","../chapters/chapter2/web/chapter2-study.html#sec-tutorial"],

    ["w3-linear",3,2,"Linear regression","Fits a linear relationship for numeric prediction tasks.","../chapters/chapter3/web/chapter3-study.html#sec-linear"],
    ["w3-r2",3,2,"Residuals and R^2","Model quality is read through prediction errors and goodness of fit.","../chapters/chapter3/web/chapter3-study.html#sec-linear"],
    ["w3-overfit",3,3,"Overfitting in linear models","Adding flexibility can improve training fit while hurting test performance.","../chapters/chapter3/web/chapter3-study.html#sec-linear"],
    ["w3-ridge",3,2,"Ridge regression","Uses L2 regularisation to shrink coefficients and improve generalisation.","../chapters/chapter3/web/chapter3-study.html#sec-reg"],
    ["w3-lasso",3,3,"Lasso regression","Uses L1 regularisation and can zero out weaker features.","../chapters/chapter3/web/chapter3-study.html#sec-reg"],
    ["w3-logistic",3,2,"Logistic regression","Turns a linear score into a probability for classification.","../chapters/chapter3/web/chapter3-study.html#sec-logistic"],
    ["w3-threshold",3,2,"Decision threshold","Probabilities become class labels only after choosing a cutoff.","../chapters/chapter3/web/chapter3-study.html#sec-logistic"],
    ["w3-regtune",3,3,"Regularisation tuning","Hyperparameters control the trade-off between fit and model restraint.","../chapters/chapter3/web/chapter3-study.html#sec-tutorial"],

    ["w4-bayes",4,2,"Bayes theorem","Posterior reasoning combines prior belief and observed evidence.","../chapters/chapter4/web/chapter4-study.html#sec-nb"],
    ["w4-nb",4,2,"Naive Bayes","Assumes conditional independence to make probabilistic classification tractable.","../chapters/chapter4/web/chapter4-study.html#sec-nb"],
    ["w4-nbtypes",4,3,"NB likelihood families","Gaussian, Bernoulli, Multinomial, and Categorical NB match different data types.","../chapters/chapter4/web/chapter4-study.html#sec-nb"],
    ["w4-confusion",4,2,"Confusion matrix","Breaks predictions into true and false positives and negatives.","../chapters/chapter4/web/chapter4-study.html#sec-metrics"],
    ["w4-precision",4,2,"Precision","Measures how reliable predicted positives are.","../chapters/chapter4/web/chapter4-study.html#sec-metrics"],
    ["w4-recallf1",4,2,"Recall and F1","Recall tracks missed positives; F1 balances recall with precision.","../chapters/chapter4/web/chapter4-study.html#sec-metrics"],
    ["w4-kfold",4,2,"k-fold cross-validation","Rotates the validation fold to get a more stable estimate of performance.","../chapters/chapter4/web/chapter4-study.html#sec-cv"],
    ["w4-loo",4,3,"Leave-one-out CV","Extreme cross-validation where each fold contains a single example.","../chapters/chapter4/web/chapter4-study.html#sec-cv"],
    ["w4-grid",4,3,"Grid search","Searches parameter combinations using validation performance rather than the test set.","../chapters/chapter4/web/chapter4-study.html#sec-cv"],

    ["w5-tree",5,2,"Decision tree induction","Recursively splits the data to create an interpretable classifier.","../chapters/chapter5/web/chapter5-study.html#sec-trees"],
    ["w5-purity",5,2,"Purity and split criteria","Tree growth depends on how much a split reduces class mixing.","../chapters/chapter5/web/chapter5-study.html#sec-trees"],
    ["w5-pruning",5,3,"Pruning","Cuts back over-specific branches to improve generalisation.","../chapters/chapter5/web/chapter5-study.html#sec-trees"],
    ["w5-bagging",5,2,"Bagging","Trains many models on bootstrap samples and averages their votes.","../chapters/chapter5/web/chapter5-study.html#sec-ens"],
    ["w5-rf",5,3,"Random Forest","Bagged trees plus random feature subsets to decorrelate the ensemble.","../chapters/chapter5/web/chapter5-study.html#sec-ens"],
    ["w5-ada",5,3,"AdaBoost","Sequentially reweights hard examples so later models focus on them.","../chapters/chapter5/web/chapter5-study.html#sec-ens"],
    ["w5-gboost",5,3,"Gradient boosting","Adds models stage by stage to correct the current ensemble's errors.","../chapters/chapter5/web/chapter5-study.html#sec-ens"],
    ["w5-enslogic",5,3,"Why ensembles win","Combining diverse models can reduce variance or bias more effectively than one model.","../chapters/chapter5/web/chapter5-study.html#sec-ens"],

    ["w6-svm",6,3,"Linear SVM","Separates classes with a maximum-margin hyperplane.","../chapters/chapter6/web/chapter6-study.html#sec-svm"],
    ["w6-margin",6,3,"Support vectors and margin","Only the boundary cases determine the maximum-margin separator.","../chapters/chapter6/web/chapter6-study.html#sec-svm"],
    ["w6-kernel",6,3,"Kernel SVM","Implicit feature mappings let SVM draw nonlinear boundaries.","../chapters/chapter6/web/chapter6-study.html#sec-svm"],
    ["w6-tune",6,4,"C and gamma tuning","SVM performance is highly sensitive to regularisation and kernel scale.","../chapters/chapter6/web/chapter6-study.html#sec-svm"],
    ["w6-pca",6,2,"Principal Component Analysis","Builds new axes that capture the largest variance in the data.","../chapters/chapter6/web/chapter6-study.html#sec-pca"],
    ["w6-variance",6,3,"Explained variance","Dimension choice is based on how much variation the kept components preserve.","../chapters/chapter6/web/chapter6-study.html#sec-pca"],
    ["w6-feature",6,3,"PCA for feature extraction","A lower-dimensional representation can make later models simpler and sometimes better.","../chapters/chapter6/web/chapter6-study.html#sec-pca"],
    ["w6-compress",6,3,"PCA for compression","Projection and inverse transform can shrink high-dimensional data while preserving structure.","../chapters/chapter6/web/chapter6-study.html#sec-pca"]
  ].map(function(n) {
    return { id:n[0], ch:n[1], diff:n[2], label:n[3], def:n[4], href:n[5] };
  }),
  edges: [
    ["w1-process","w1-task",8], ["w1-process","w1-workflow",6], ["w1-python","w1-numpy",9],
    ["w1-numpy","w1-pandas",8], ["w1-pandas","w1-workflow",7], ["w1-numpy","w2-iris",7],
    ["w1-pandas","w2-iris",7], ["w1-workflow","w2-iris",7], ["w1-task","w2-knn",6],

    ["w2-knn","w2-neighborhood",9], ["w2-knn","w2-iris",7], ["w2-iris","w2-split",8],
    ["w2-split","w2-scale",8], ["w2-knn","w2-scale",7], ["w2-1r","w2-prism",9],
    ["w2-prism","w2-tutorial",7], ["w2-knn","w2-tutorial",7], ["w2-split","w4-kfold",6],

    ["w3-linear","w3-r2",9], ["w3-linear","w3-overfit",7], ["w3-overfit","w3-ridge",8],
    ["w3-overfit","w3-lasso",8], ["w3-ridge","w3-lasso",7], ["w3-linear","w3-logistic",6],
    ["w3-logistic","w3-threshold",8], ["w3-ridge","w3-regtune",7], ["w3-lasso","w3-regtune",7],
    ["w3-logistic","w4-confusion",6], ["w3-regtune","w4-grid",6], ["w3-overfit","w5-enslogic",6],

    ["w4-bayes","w4-nb",9], ["w4-nb","w4-nbtypes",8], ["w4-confusion","w4-precision",9],
    ["w4-confusion","w4-recallf1",8], ["w4-precision","w4-recallf1",9], ["w4-kfold","w4-loo",7],
    ["w4-kfold","w4-grid",9], ["w4-nb","w4-kfold",6], ["w4-grid","w6-tune",6],

    ["w5-tree","w5-purity",9], ["w5-tree","w5-pruning",8], ["w5-bagging","w5-rf",8],
    ["w5-bagging","w5-enslogic",8], ["w5-ada","w5-gboost",7], ["w5-gboost","w5-enslogic",8],
    ["w5-tree","w5-rf",6], ["w5-purity","w5-rf",5],

    ["w6-svm","w6-margin",9], ["w6-svm","w6-kernel",7], ["w6-margin","w6-kernel",6],
    ["w6-kernel","w6-tune",8], ["w6-pca","w6-variance",9], ["w6-pca","w6-feature",8],
    ["w6-pca","w6-compress",8], ["w6-feature","w6-compress",5], ["w6-svm","w6-pca",4],

    ["w2-scale","w6-svm",5], ["w3-r2","w4-kfold",5], ["w4-grid","w5-rf",4]
  ]
};
