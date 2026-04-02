/**
 * COMP5046 NLP flashcards — schema { ch, front, back, front_zh, back_zh }
 */
var FLASHCARD_DECK_VERSION = "nlp5046-1";
var ALL_FLASHCARD_DATA = [
  { ch: 1, front: "Name three major NLP task families.", back: "Examples: machine translation, information extraction (NER), sentiment analysis, question answering, summarisation, dialogue.", front_zh: "举出三类主要的 NLP 任务。", back_zh: "例如：机器翻译、信息抽取（NER）、情感分析、问答、摘要、对话等。" },
  { ch: 1, front: "What is structural ambiguity?", back: "Multiple valid parses or syntactic structures for one sentence (e.g. prepositional phrase attachment).", front_zh: "什么是结构歧义？", back_zh: "同一句子可有多种合法句法分析（如介词短语附着）。" },
  { ch: 1, front: "Why is tokenisation non-trivial?", back: "Languages differ; URLs, hashtags, compounds, and unsegmented scripts require rules or learned segmenters.", front_zh: "为何分词并不简单？", back_zh: "语言差异大；URL、话题标签、复合词、无空格书写等都需要规则或可学习的切分器。" },
  { ch: 2, front: "What is an n-gram?", back: "A contiguous sequence of n tokens; used as features or for Markov language models.", front_zh: "什么是 n-gram？", back_zh: "连续 n 个词元；可作特征或用于马尔可夫语言模型。" },
  { ch: 2, front: "Why use subword units (BPE, WordPiece)?", back: "Open vocabulary: represent rare/unknown words via smaller pieces; fewer OOV issues than word-only vocab.", front_zh: "为何使用子词（BPE、WordPiece）？", back_zh: "开放词表：用更小片段表示罕见/未知词，比纯词级词表更少 OOV。" },
  { ch: 2, front: "State Zipf’s law in one sentence.", back: "Word frequency ranks follow a heavy-tailed distribution: a few types dominate token counts.", front_zh: "用一句话描述齐普夫定律。", back_zh: "词频排名呈重尾分布：少数词型占据绝大部分词次。" },
  { ch: 3, front: "Naive Bayes independence assumption for text.", back: "Given class c, word features are conditionally independent (bag-of-words often multinomial or Bernoulli).", front_zh: "朴素贝叶斯对文本的独立性假设。", back_zh: "给定类别 c，词特征条件独立（词袋模型下常用多项式或伯努利）。" },
  { ch: 3, front: "Write perplexity formula for LM on tokens w_1..w_N.", back: "PP = exp(-(1/N) sum_i log P(w_i | context)).", front_zh: "写出语言模型在 w_1..w_N 上的困惑度公式。", back_zh: "PP = exp(-(1/N) Σ log P(w_i|上下文))。" },
  { ch: 3, front: "Why smooth n-gram counts?", back: "Unseen n-grams get probability zero without smoothing; smoothing reallocates mass.", front_zh: "为何要对 n-gram 做平滑？", back_zh: "未出现的 n-gram 在朴素估计下概率为 0；平滑重新分配概率质量。" },
  { ch: 4, front: "What does PMI measure?", back: "Association between two events vs independence: log P(w,c)/(P(w)P(c)) in PMI variants.", front_zh: "PMI 衡量什么？", back_zh: "两事件相对于独立假设的关联强度（PMI 变体中常见 log P(w,c)/(P(w)P(c))）。" },
  { ch: 4, front: "Skip-gram objective (idea).", back: "Predict context words from centre word; negative sampling approximates softmax.", front_zh: "skip-gram 目标（大意）。", back_zh: "由中心词预测上下文词；负采样近似 softmax。" },
  { ch: 4, front: "Why cosine vs Euclidean for word vectors?", back: "Direction often encodes meaning; L2 length can correlate with frequency; cosine focuses on orientation.", front_zh: "词向量为何常用余弦而非欧氏距离？", back_zh: "方向常编码语义；模长可能与频次相关；余弦关注朝向。" },
  { ch: 5, front: "LSTM gates (names).", back: "Forget, input, output gates plus cell state for long-range memory.", front_zh: "LSTM 有哪些门？", back_zh: "遗忘门、输入门、输出门，以及细胞状态以传递长程信息。" },
  { ch: 5, front: "Why BiLSTM for tagging?", back: "Tag at i may depend on both left and right context; bidirectional encoders capture both.", front_zh: "标注为何常用 BiLSTM？", back_zh: "位置 i 的标签可能依赖左右两侧上下文；双向编码器同时利用两侧。" },
  { ch: 5, front: "What does NER extract?", back: "Named entity spans with types (PER, ORG, LOC, …) — often sequence labelling with BIO tags.", front_zh: "NER 抽取什么？", back_zh: "命名实体片段及其类型（人名、机构、地点等），常用 BIO 序列标注。" },
  { ch: 6, front: "Self-attention in one line.", back: "Map input vectors to Q,K,V; score pairs with QK^T; softmax; weighted sum of V.", front_zh: "一句话说明自注意力。", back_zh: "将输入映射为 Q、K、V；用 QK^T 打分；softmax 后对 V 加权求和。" },
  { ch: 6, front: "Transformer vs RNN sequence modelling.", back: "Transformer relies on stacked self-attention + FFN; fully parallelisable over positions (no recurrent unroll).", front_zh: "Transformer 与 RNN 建模样例对比。", back_zh: "Transformer 用多层自注意力+FFN；各位置可并行，无逐步循环展开。" },
  { ch: 6, front: "BERT pretraining tasks (two).", back: "Masked LM + next sentence prediction (in original BERT).", front_zh: "BERT 的两项预训练任务。", back_zh: "掩码语言模型 + 下一句预测（原始 BERT）。" }
];
