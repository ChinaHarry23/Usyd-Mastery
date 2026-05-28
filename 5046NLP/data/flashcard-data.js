/**
 * COMP5046 NLP flashcards — schema { ch, front, back, front_zh, back_zh }
 */
var FLASHCARD_DECK_VERSION = "nlp5046-2";
var ALL_FLASHCARD_DATA = [

  /* ====== Chapter 1 — NLP Basics, Text Representation & Word Embeddings ====== */

  { ch: 1, front: "What is the goal of NLP?", back: "Enable computers to understand, interpret, generate, and manipulate human language for tasks such as translation, classification, question answering, and summarisation.", front_zh: "NLP 的目标是什么？", back_zh: "使计算机能够理解、解释、生成和操纵人类语言，用于翻译、分类、问答、摘要等任务。" },

  { ch: 1, front: "Define lexical ambiguity and give an example.", back: "A single word form has multiple distinct meanings. Example: 'bank' can mean a financial institution or a river bank — context disambiguates.", front_zh: "定义词汇歧义并举例。", back_zh: "同一词形有多个不同含义。例如：bank 可以指银行或河岸——需靠语境消歧。" },

  { ch: 1, front: "Write the TF-IDF formula.", back: "TF-IDF(t, d) = TF(t, d) × IDF(t), where IDF(t) = log(N / df_t). N = total documents, df_t = number of documents containing term t.", front_zh: "写出 TF-IDF 公式。", back_zh: "TF-IDF(t, d) = TF(t, d) × IDF(t)，其中 IDF(t) = log(N / df_t)。N 为总文档数，df_t 为包含词 t 的文档数。" },

  { ch: 1, front: "What does BM25 improve over basic TF-IDF?", back: "BM25 adds term frequency saturation (via parameter k₁) and document length normalisation (via parameter b), preventing long documents or high-frequency terms from dominating.", front_zh: "BM25 比基本 TF-IDF 改进了什么？", back_zh: "BM25 引入了词频饱和（通过参数 k₁）和文档长度归一化（通过参数 b），防止长文档或高频词占主导。" },

  { ch: 1, front: "State the distributional hypothesis.", back: "Words that occur in similar contexts tend to have similar meanings. ('You shall know a word by the company it keeps.' — Firth, 1957)", front_zh: "阐述分布假设。", back_zh: "出现在相似上下文中的词往往具有相似的含义。（「观其伴可知其义」——Firth, 1957）" },

  { ch: 1, front: "CBOW vs Skip-gram in word2vec.", back: "CBOW predicts the centre word from surrounding context words (faster, better for frequent words). Skip-gram predicts context words from the centre word (better for rare words).", front_zh: "word2vec 中 CBOW 与 Skip-gram 的对比。", back_zh: "CBOW 由上下文词预测中心词（更快，对高频词更好）。Skip-gram 由中心词预测上下文词（对低频词更好）。" },

  { ch: 1, front: "Write the cosine similarity formula.", back: "cos(a, b) = (a · b) / (‖a‖ · ‖b‖). Measures directional agreement between vectors; ranges from −1 to 1.", front_zh: "写出余弦相似度公式。", back_zh: "cos(a, b) = (a·b) / (‖a‖·‖b‖)。衡量向量间的方向一致性，取值范围 [−1, 1]。" },

  { ch: 1, front: "How is SVD used for word embeddings?", back: "Apply truncated SVD to a word-context co-occurrence matrix (or PPMI matrix) to obtain dense, low-dimensional word vectors that capture latent semantic structure.", front_zh: "SVD 如何用于词嵌入？", back_zh: "对词-上下文共现矩阵（或 PPMI 矩阵）做截断 SVD，得到捕捉潜在语义结构的稠密低维词向量。" },

  /* ====== Chapter 2 — Text Classification ====== */

  { ch: 2, front: "Name the five levels of linguistic analysis.", back: "Phonology (sounds), morphology (word structure), syntax (sentence structure), semantics (meaning), pragmatics (meaning in context).", front_zh: "列出语言学分析的五个层次。", back_zh: "语音学（声音）、形态学（词结构）、句法学（句子结构）、语义学（含义）、语用学（语境中的含义）。" },

  { ch: 2, front: "What is a linear classifier's decision rule?", back: "Predict class = sign(w · x + b). The weight vector w and bias b define a hyperplane; the score determines the side.", front_zh: "线性分类器的决策规则是什么？", back_zh: "预测类别 = sign(w·x + b)。权重向量 w 和偏置 b 定义超平面；分数决定所在侧。" },

  { ch: 2, front: "Write the sigmoid function and its range.", back: "σ(z) = 1 / (1 + e^(−z)). Output range: (0, 1). Used to convert a real-valued score to a probability.", front_zh: "写出 sigmoid 函数及其值域。", back_zh: "σ(z) = 1/(1+e^(−z))。值域 (0, 1)。用于将实值分数转换为概率。" },

  { ch: 2, front: "Write the cross-entropy loss for binary classification.", back: "L = −[y log(p) + (1−y) log(1−p)], where y ∈ {0,1} is the true label and p is the predicted probability of class 1.", front_zh: "写出二分类的交叉熵损失。", back_zh: "L = −[y log(p) + (1−y) log(1−p)]，其中 y∈{0,1} 为真实标签，p 为预测类别 1 的概率。" },

  { ch: 2, front: "Precision, recall, and F1 formulas.", back: "Precision = TP/(TP+FP). Recall = TP/(TP+FN). F1 = 2·P·R/(P+R) — the harmonic mean of precision and recall.", front_zh: "精确率、召回率和 F1 公式。", back_zh: "精确率 = TP/(TP+FP)。召回率 = TP/(TP+FN)。F1 = 2·P·R/(P+R)——精确率与召回率的调和平均。" },

  { ch: 2, front: "Train / dev / test split purpose.", back: "Train: learn parameters. Dev (validation): tune hyperparameters, model selection, early stopping. Test: final unbiased evaluation (used only once).", front_zh: "训练/开发/测试集各自的用途。", back_zh: "训练集：学习参数。开发集（验证集）：调超参数、模型选择、早停。测试集：最终无偏评估（仅使用一次）。" },

  { ch: 2, front: "Macro vs micro averaging for multi-class metrics.", back: "Macro: compute metric per class, then average (equal weight per class). Micro: aggregate all TP/FP/FN globally, then compute metric (equal weight per example).", front_zh: "多类别指标的宏平均与微平均。", back_zh: "宏平均：按类别分别计算指标再取均值（每类等权）。微平均：全局汇总 TP/FP/FN 后计算指标（每样本等权）。" },

  { ch: 2, front: "What does ROC-AUC measure?", back: "AUC is the probability that the classifier ranks a random positive higher than a random negative. AUC = 1.0 is perfect; 0.5 is random chance.", front_zh: "ROC-AUC 衡量什么？", back_zh: "AUC 是分类器将随机正例排在随机负例之前的概率。AUC = 1.0 为完美，0.5 为随机。" },

  /* ====== Chapter 3 — Neural Networks & RNNs ====== */

  { ch: 3, front: "MLP hidden layer computation.", back: "h = f(Wx + b), where W is the weight matrix, b is bias, and f is a non-linear activation (e.g. ReLU, sigmoid, tanh).", front_zh: "MLP 隐藏层计算。", back_zh: "h = f(Wx + b)，其中 W 为权重矩阵，b 为偏置，f 为非线性激活函数（如 ReLU、sigmoid、tanh）。" },

  { ch: 3, front: "Compare ReLU, sigmoid, and tanh activations.", back: "ReLU: max(0,x), sparse, avoids vanishing gradient for x>0 but has dead neurons. Sigmoid: (0,1), can saturate. Tanh: (−1,1), zero-centred but also saturates.", front_zh: "比较 ReLU、sigmoid 和 tanh 激活函数。", back_zh: "ReLU：max(0,x)，稀疏，x>0 时避免梯度消失但有死神经元。Sigmoid：(0,1)，可能饱和。Tanh：(−1,1)，零中心但也会饱和。" },

  { ch: 3, front: "What is backpropagation?", back: "An efficient algorithm for computing gradients of the loss w.r.t. all parameters by recursively applying the chain rule from the output layer back to earlier layers.", front_zh: "什么是反向传播？", back_zh: "一种高效算法，通过从输出层到前层递归应用链式法则，计算损失对所有参数的梯度。" },

  { ch: 3, front: "How does dropout regularise a neural network?", back: "During training, each neuron is randomly zeroed out with probability p. This prevents co-adaptation and acts like an implicit ensemble. At test time, weights are scaled by (1−p).", front_zh: "Dropout 如何正则化神经网络？", back_zh: "训练时以概率 p 随机将神经元置零，防止协同适应，相当于隐式集成。测试时权重乘以 (1−p)。" },

  { ch: 3, front: "RNN hidden state update equation.", back: "h_t = tanh(W_h h_{t−1} + W_x x_t + b). h_t depends on current input x_t and previous hidden state h_{t−1}.", front_zh: "RNN 隐状态更新公式。", back_zh: "h_t = tanh(W_h h_{t−1} + W_x x_t + b)。h_t 依赖当前输入 x_t 和前一隐状态 h_{t−1}。" },

  { ch: 3, front: "Name and describe the three LSTM gates.", back: "Forget gate (f_t): how much old cell state to keep. Input gate (i_t): how much new candidate to add. Output gate (o_t): how much cell state to expose as hidden state.", front_zh: "列出并描述 LSTM 的三个门。", back_zh: "遗忘门(f_t)：保留多少旧细胞状态。输入门(i_t)：加入多少新候选值。输出门(o_t)：将多少细胞状态暴露为隐状态。" },

  { ch: 3, front: "Vanishing vs exploding gradients in RNNs.", back: "Vanishing: gradients shrink exponentially over time → can't learn long-range dependencies. Exploding: gradients grow exponentially → unstable training. Solutions: LSTM/GRU (vanishing), gradient clipping (exploding).", front_zh: "RNN 中的梯度消失与梯度爆炸。", back_zh: "消失：梯度随时间指数级缩小→无法学习长程依赖。爆炸：梯度指数级增长→训练不稳定。解决方案：LSTM/GRU（消失）、梯度裁剪（爆炸）。" },

  { ch: 3, front: "L2 regularisation effect on training.", back: "Adds λ‖w‖² to the loss. Gradient contribution is 2λw, which shrinks weights toward zero each step (weight decay). Discourages large weights, reducing overfitting.", front_zh: "L2 正则化对训练的影响。", back_zh: "向损失添加 λ‖w‖²。梯度贡献为 2λw，每步将权重向零收缩（权重衰减）。抑制大权重，减少过拟合。" },

  /* ====== Chapter 4 — Decoding & Structured Prediction ====== */

  { ch: 4, front: "Greedy decoding vs beam search.", back: "Greedy: pick argmax token at each step — fast but locally optimal. Beam search (width B): keep top-B hypotheses at each step — better quality but slower.", front_zh: "贪心解码与束搜索对比。", back_zh: "贪心：每步选 argmax token——快但仅局部最优。束搜索（宽度 B）：每步保留 top-B 假设——质量更好但更慢。" },

  { ch: 4, front: "What does temperature T do in sampling?", back: "p_i = exp(z_i/T) / Σ exp(z_j/T). High T → flatter (more random). Low T → peakier (more deterministic). T=1 is the unmodified distribution.", front_zh: "采样中温度 T 的作用是什么？", back_zh: "p_i = exp(z_i/T)/Σexp(z_j/T)。T 大→更平坦（更随机）。T 小→更尖锐（更确定）。T=1 为未修改的分布。" },

  { ch: 4, front: "Explain top-p (nucleus) sampling.", back: "Sort tokens by descending probability; include the smallest set whose cumulative probability ≥ p; sample from this set. Dynamically adjusts candidate pool size.", front_zh: "解释 top-p（核）采样。", back_zh: "按概率降序排列 token；取累积概率 ≥ p 的最小集合；从中采样。动态调整候选池大小。" },

  { ch: 4, front: "Viterbi algorithm: idea and complexity.", back: "Dynamic programming for finding the highest-scoring label sequence in HMMs/CRFs. Complexity: O(T · L²), where T = sequence length, L = number of labels.", front_zh: "Viterbi 算法：思想与复杂度。", back_zh: "用于在 HMM/CRF 中找到最高分标签序列的动态规划。复杂度：O(T·L²)，T 为序列长度，L 为标签数。" },

  { ch: 4, front: "Explain the BIO tagging scheme.", back: "B-X: beginning of entity type X. I-X: inside/continuation of entity X. O: outside any entity. Ensures entity boundaries are unambiguous in sequence labelling.", front_zh: "解释 BIO 标注方案。", back_zh: "B-X：实体类型 X 的开始。I-X：实体 X 的内部/延续。O：不属于任何实体。确保序列标注中实体边界无歧义。" },

  { ch: 4, front: "Dependency parsing vs constituency parsing.", back: "Dependency: directed edges between words (head → dependent) with relation labels. Constituency: hierarchical tree with phrase-level non-terminals (NP, VP, etc.).", front_zh: "依存分析与成分分析对比。", back_zh: "依存分析：词之间的有向边（中心词→依存词）带关系标签。成分分析：带短语级非终结符（NP、VP 等）的层次树。" },

  { ch: 4, front: "What is coreference resolution?", back: "The task of identifying all mentions (pronouns, names, descriptions) in a text that refer to the same real-world entity and clustering them together.", front_zh: "什么是共指消解？", back_zh: "识别文本中所有指向同一真实世界实体的提及（代词、名称、描述）并将其聚类的任务。" },

  { ch: 4, front: "Exhaustive search complexity for sequence labelling.", back: "With L labels and sequence length T, there are L^T possible sequences. Exponential in T — intractable for non-trivial lengths, motivating DP (Viterbi) or greedy/beam methods.", front_zh: "序列标注穷举搜索的复杂度。", back_zh: "有 L 种标签和序列长度 T 时，共有 L^T 种可能序列。关于 T 指数级——对于非平凡长度不可行，需动态规划（Viterbi）或贪心/束搜索。" },

  /* ====== Chapter 5 — Seq2Seq, Attention & Evaluation Metrics ====== */

  { ch: 5, front: "Static vs contextual word embeddings.", back: "Static (word2vec, GloVe): one fixed vector per word type. Contextual (ELMo, BERT): vector varies per token occurrence based on surrounding context.", front_zh: "静态与上下文词嵌入对比。", back_zh: "静态（word2vec、GloVe）：每个词型一个固定向量。上下文（ELMo、BERT）：向量因每次出现的上下文而异。" },

  { ch: 5, front: "How does ELMo produce contextual embeddings?", back: "A deep bidirectional LSTM language model is pretrained. Each token's representation is a task-specific learned weighted sum of all BiLSTM layer outputs.", front_zh: "ELMo 如何生成上下文嵌入？", back_zh: "预训练深层双向 LSTM 语言模型。每个 token 的表示是所有 BiLSTM 层输出的任务特定学习加权和。" },

  { ch: 5, front: "Seq2seq encoder-decoder architecture.", back: "Encoder reads source → produces hidden states. Decoder generates target tokens autoregressively, initialised with encoder's final state (or attending to all encoder states with attention).", front_zh: "Seq2seq 编码器-解码器架构。", back_zh: "编码器读入源序列→产生隐状态。解码器自回归生成目标 token，用编码器最终状态初始化（或通过注意力关注所有编码器状态）。" },

  { ch: 5, front: "What is teacher forcing and its drawback?", back: "During training, feed ground-truth y_{t−1} as decoder input at step t (instead of the model's own prediction). Drawback: exposure bias — the model never learns to recover from its own errors.", front_zh: "什么是教师强制及其缺点？", back_zh: "训练时在第 t 步将真实 y_{t−1} 而非模型自身预测作为解码器输入。缺点：曝光偏差——模型从未学会从自身错误中恢复。" },

  { ch: 5, front: "Components of the BLEU score.", back: "BLEU = BP · exp(Σ w_n log p_n). p_n = modified n-gram precision (n=1..4 typically). BP = brevity penalty: exp(1−r/c) if c<r, else 1. Geometric mean of precisions.", front_zh: "BLEU 分数的组成部分。", back_zh: "BLEU = BP · exp(Σ w_n log p_n)。p_n = 修正 n-gram 精确率（通常 n=1..4）。BP = 简短惩罚：c<r 时 exp(1−r/c)，否则 1。精确率的几何平均。" },

  { ch: 5, front: "How does the BPE algorithm work?", back: "Start with a character-level vocabulary. Repeatedly find the most frequent adjacent pair, merge it into a new symbol, and add to vocab. Repeat until target vocab size is reached.", front_zh: "BPE 算法如何工作？", back_zh: "从字符级词表开始。反复找到最频繁的相邻对，合并为新符号并加入词表。重复直到达到目标词表大小。" },

  { ch: 5, front: "Why was the attention mechanism introduced?", back: "To solve the encoder bottleneck: without attention, all source information must pass through a single fixed-length vector. Attention lets the decoder attend to all encoder hidden states dynamically.", front_zh: "为什么引入注意力机制？", back_zh: "解决编码器瓶颈：无注意力时，所有源信息必须通过单一定长向量。注意力让解码器动态关注所有编码器隐状态。" },

  { ch: 5, front: "What is chrF and why use it?", back: "Character n-gram F-score between candidate and reference translations. More robust to morphological variation than word-level BLEU; useful for morphologically rich languages.", front_zh: "什么是 chrF，为什么使用它？", back_zh: "候选与参考翻译之间的字符 n-gram F 值。比词级 BLEU 对形态变化更鲁棒，适用于形态丰富的语言。" },

  /* ====== Chapter 6 — Transformers, BERT & GPT ====== */

  { ch: 6, front: "Write the scaled dot-product attention formula.", back: "Attention(Q,K,V) = softmax(QK^T / √d_k) V. Scaling by √d_k prevents large dot products from pushing softmax into saturated regions with tiny gradients.", front_zh: "写出缩放点积注意力公式。", back_zh: "Attention(Q,K,V) = softmax(QK^T / √d_k) V。除以 √d_k 防止大点积使 softmax 进入梯度极小的饱和区域。" },

  { ch: 6, front: "Why scale attention scores by √d_k?", back: "As d_k grows, the variance of QK^T dot products grows proportionally. Without scaling, softmax outputs become extremely peaked, leading to vanishingly small gradients.", front_zh: "为什么要将注意力分数除以 √d_k？", back_zh: "随着 d_k 增大，QK^T 点积的方差成比例增长。不缩放的话 softmax 输出会极其尖锐，导致梯度极小。" },

  { ch: 6, front: "Explain multi-head attention.", back: "Run h parallel attention heads, each with its own W_Q, W_K, W_V projections into d_k-dimensional subspaces. Concatenate outputs and apply a final linear projection W_O.", front_zh: "解释多头注意力。", back_zh: "运行 h 个并行注意力头，每个有自己的 W_Q、W_K、W_V 投影到 d_k 维子空间。拼接输出后施加最终线性投影 W_O。" },

  { ch: 6, front: "Positional encoding in transformers.", back: "Self-attention is permutation-invariant, so position information must be injected. Original transformer uses sinusoidal functions: PE(pos, 2i) = sin(pos/10000^(2i/d)), PE(pos, 2i+1) = cos(pos/10000^(2i/d)).", front_zh: "Transformer 中的位置编码。", back_zh: "自注意力具有置换不变性，需注入位置信息。原始 Transformer 使用正弦函数：PE(pos,2i) = sin(pos/10000^(2i/d))，PE(pos,2i+1) = cos(pos/10000^(2i/d))。" },

  { ch: 6, front: "What is causal masking and where is it used?", back: "Sets future positions to −∞ in the attention score matrix before softmax, ensuring each token only attends to itself and previous tokens. Used in transformer decoders (GPT) for autoregressive generation.", front_zh: "什么是因果掩码，用在哪里？", back_zh: "在 softmax 前将注意力分数矩阵中的未来位置设为 −∞，确保每个 token 只关注自身和之前的 token。用于 Transformer 解码器（GPT）的自回归生成。" },

  { ch: 6, front: "Structure of a transformer encoder layer.", back: "Two sub-layers each with residual connection + LayerNorm: (1) Multi-head self-attention → Add & Norm, (2) Position-wise FFN → Add & Norm.", front_zh: "Transformer 编码器层的结构。", back_zh: "两个子层，各有残差连接 + LayerNorm：(1) 多头自注意力 → Add & Norm，(2) 逐位置 FFN → Add & Norm。" },

  { ch: 6, front: "BERT pre-training objectives.", back: "1) Masked Language Model (MLM): randomly mask ~15% of tokens and predict them from bidirectional context. 2) Next Sentence Prediction (NSP): predict whether sentence B follows sentence A.", front_zh: "BERT 预训练目标。", back_zh: "1) 掩码语言模型（MLM）：随机掩码约 15% 的 token，利用双向上下文预测。2) 下一句预测（NSP）：预测句子 B 是否跟在句子 A 之后。" },

  { ch: 6, front: "GPT vs BERT: key architectural difference.", back: "GPT: autoregressive (left-to-right) transformer decoder with causal masking; optimised for generation. BERT: bidirectional transformer encoder with MLM; optimised for understanding/classification.", front_zh: "GPT 与 BERT 的关键架构差异。", back_zh: "GPT：自回归（从左到右）Transformer 解码器，带因果掩码，擅长生成。BERT：双向 Transformer 编码器，用 MLM，擅长理解/分类。" },

  // —— Ch7 ——
  { ch: 7, front: "Bigram language model.", back: "P(w_t | w_{t-1}); first-order Markov assumption on word sequences.", front_zh: "二元语言模型？", back_zh: "P(w_t | w_{t-1})；对词序列做一阶马尔可夫假设。" },
  { ch: 7, front: "Perplexity definition.", back: "\\(\\text{PP}(W) = P(w_1\\ldots w_N)^{-1/N}\\); equal to \\(\\exp(\\text{cross-entropy})\\). Lower is better.", front_zh: "困惑度定义？", back_zh: "\\(\\text{PP}(W) = P(w_1\\ldots w_N)^{-1/N}\\)；等于 \\(\\exp(\\text{交叉熵})\\)。越低越好。" },
  { ch: 7, front: "Why smoothing?", back: "MLE counts give 0 to unseen events; zero kills the product. Smoothing distributes probability mass.", front_zh: "为何需要平滑？", back_zh: "MLE 对未见事件给 0，乘积变 0。平滑分配少量质量。" },
  { ch: 7, front: "Add-k smoothing.", back: "\\(P(w_i | w_{i-1}) = (c(w_{i-1}, w_i) + k) / (c(w_{i-1}) + k|V|)\\).", front_zh: "加-k 平滑？", back_zh: "\\(P(w_i | w_{i-1}) = (c(w_{i-1}, w_i) + k) / (c(w_{i-1}) + k|V|)\\)。" },
  { ch: 7, front: "Neural LM components.", back: "Embedding lookup → hidden layers (RNN / Transformer / FFN) → softmax over vocabulary.", front_zh: "神经 LM 组成？", back_zh: "词嵌入 → 隐藏层（RNN/Transformer/FFN）→ 词表上的 softmax。" },
  { ch: 7, front: "Markov assumption (n-gram).", back: "Next word depends only on the previous n−1 words.", front_zh: "n-gram 的马尔可夫假设？", back_zh: "下一个词仅依赖前 n−1 个词。" },
  { ch: 7, front: "Why uniform LM has perplexity = |V|.", back: "Each token assigned probability 1/|V|; geometric mean^{−1} = |V|.", front_zh: "均匀 LM 困惑度为何 = |V|？", back_zh: "每词概率 1/|V|；几何平均的倒数即 |V|。" },
  { ch: 7, front: "Cross-entropy and perplexity link.", back: "PP = exp(H) where H = −(1/N) Σ log P(w_t | history). Lower H ↔ lower PP.", front_zh: "交叉熵与困惑度关系？", back_zh: "PP = exp(H)；H = −(1/N) Σ log P(w_t|历史)。H 越小困惑度越小。" },
  { ch: 7, front: "LMs frame translation as:", back: "argmax_target P(target | source) — pick the most probable target sequence given the source.", front_zh: "LM 框定翻译？", back_zh: "argmax_target P(target | source) —— 给定源句选最可能的目标序列。" },
  { ch: 7, front: "Kneser-Ney intuition.", back: "Discount counts of seen n-grams and back off to a continuation probability that favours words appearing in many diverse contexts.", front_zh: "Kneser-Ney 直觉？", back_zh: "对已见 n-gram 折扣并回退到延续概率，偏好在多样上下文中出现的词。" },

  // —— Ch8 ——
  { ch: 8, front: "Big pretraining corpora.", back: "Common Crawl, FineWeb, Wikipedia, books, code; each with different quality/licence/risk trade-offs.", front_zh: "主要预训练语料？", back_zh: "Common Crawl、FineWeb、Wikipedia、图书、代码；各有质量/许可/风险权衡。" },
  { ch: 8, front: "Penn Treebank.", back: "Hand-annotated syntactic trees of WSJ articles; classical NLP gold-standard dataset.", front_zh: "Penn Treebank？", back_zh: "对华尔街日报手工标注句法树；经典金标数据集。" },
  { ch: 8, front: "Cohen's kappa.", back: "\\((p_o - p_e) / (1 - p_e)\\) — agreement above chance.", front_zh: "Cohen kappa？", back_zh: "\\((p_o - p_e) / (1 - p_e)\\)——校正偶然后的一致性。" },
  { ch: 8, front: "Deduplication motivation.", back: "Avoid memorisation and inflated effective dataset size from repeated passages.", front_zh: "为何要去重？", back_zh: "避免记忆与因重复段落而虚增的有效数据规模。" },
  { ch: 8, front: "Datasheet / model card purpose.", back: "Document dataset composition, collection process, intended uses, and known limitations.", front_zh: "Datasheet / 模型卡的目的？", back_zh: "记录数据集组成、收集过程、预期用途与已知限制。" },
  { ch: 8, front: "Common annotation risks.", back: "Annotator bias, ambiguous guidelines, fatigue, low pay (crowdsourcing) compromising quality.", front_zh: "标注常见风险？", back_zh: "标注者偏见、规范模糊、疲劳、（众包）低薪降低质量。" },
  { ch: 8, front: "Crowdsourcing platforms used.", back: "Amazon Mechanical Turk, Prolific, custom panels; require quality control workflows.", front_zh: "众包平台？", back_zh: "Amazon Mechanical Turk、Prolific 或自建池；需要质量控制流程。" },
  { ch: 8, front: "Data risk: social bias.", back: "Training corpora reflect historical biases (gender, race, etc.) which can be amplified by models.", front_zh: "社会偏见风险？", back_zh: "训练语料反映历史偏见（性别、种族等），可能被模型放大。" },
  { ch: 8, front: "Why a small high-quality dataset can beat a huge noisy one.", back: "Models learn from signal; noisy data adds variance and may inject undesirable behaviour.", front_zh: "为何小而精数据有时胜大而杂？", back_zh: "模型从信号学习；噪声数据增大方差并可能植入不良行为。" },
  { ch: 8, front: "Inter-annotator agreement: when high vs low.", back: "High = task is clearly defined; low = guidelines need rework or task is inherently subjective.", front_zh: "标注者一致性高/低？", back_zh: "高 = 任务定义清晰；低 = 规范要重做或任务本就主观。" },

  // —— Ch9 ——
  { ch: 9, front: "What is PEFT?", back: "Parameter-Efficient Fine-Tuning — adapt a few extra params instead of all weights.", front_zh: "PEFT 是什么？", back_zh: "参数高效微调——仅适配少量参数而非全量权重。" },
  { ch: 9, front: "LoRA decomposition.", back: "ΔW = B A with B ∈ R^{d×r}, A ∈ R^{r×d}, rank r ≪ d; only A and B trained.", front_zh: "LoRA 分解？", back_zh: "ΔW = B A，B ∈ R^{d×r}，A ∈ R^{r×d}，r ≪ d；仅训练 A、B。" },
  { ch: 9, front: "QLoRA idea.", back: "Quantise base model to 4-bit and fine-tune only LoRA adapters in higher precision.", front_zh: "QLoRA 思想？", back_zh: "将基模型量化到 4-bit，仅以较高精度微调 LoRA 适配器。" },
  { ch: 9, front: "Adapter modules.", back: "Tiny down→nonlin→up bottlenecks inserted in each transformer block; freeze the rest.", front_zh: "适配器模块？", back_zh: "在每个 Transformer 块插入「下投影 → 非线性 → 上投影」小瓶颈；冻结其余。" },
  { ch: 9, front: "Prompt tuning.", back: "Learn soft-token embeddings prepended to the input; base weights frozen.", front_zh: "Prompt tuning？", back_zh: "学习拼在输入前的软 token 嵌入；基础权重冻结。" },
  { ch: 9, front: "Prefix tuning.", code: "", back: "Learn task-specific prefix activations injected at every transformer layer.", front_zh: "Prefix tuning？", back_zh: "在每层 Transformer 注入任务专属的前缀激活。" },
  { ch: 9, front: "LoRA parameter saving.", back: "Trainable 2dr vs full d² → ratio 2r/d. For r = 8, d = 4096 → 0.39% trainable.", front_zh: "LoRA 参数节省？", back_zh: "可训练 2dr 对全量 d²，比例 2r/d。r=8, d=4096 时约 0.39%。" },
  { ch: 9, front: "When PEFT helps most.", back: "Limited compute / memory, many task-specific adapters needed, or want to ship lightweight delta artifacts.", front_zh: "何时 PEFT 受益最大？", back_zh: "算力/内存有限、需多个任务适配器、或希望仅交付轻量增量。" },
  { ch: 9, front: "LoRA inference cost.", back: "Same as base model after merging \\(W + BA\\); no extra forward overhead.", front_zh: "LoRA 推理代价？", back_zh: "合并 \\(W + BA\\) 后与基模型相同；前向无额外开销。" },
  { ch: 9, front: "Typical LoRA rank r.", back: "Usually 4–64, often 8 or 16; small r works surprisingly well on many tasks.", front_zh: "LoRA 常用秩 r？", back_zh: "通常 4–64，常用 8 或 16；小 r 在很多任务上效果惊艳。" },

  // —— Ch10 ——
  { ch: 10, front: "RLHF acronym.", back: "Reinforcement Learning from Human Feedback.", front_zh: "RLHF 全称？", back_zh: "从人类反馈中的强化学习。" },
  { ch: 10, front: "RLHF three stages.", back: "Collect human preference data → train reward model → fine-tune LM with RL (PPO with KL penalty).", front_zh: "RLHF 三阶段？", back_zh: "收集偏好数据 → 训练奖励模型 → 用 RL（PPO 带 KL 罚）微调 LM。" },
  { ch: 10, front: "Bradley-Terry preference model.", back: "P(y_w preferred over y_l) = σ(r(y_w) − r(y_l)); train r to match human comparisons.", front_zh: "Bradley-Terry 偏好模型？", back_zh: "P(y_w 优于 y_l) = σ(r(y_w) − r(y_l))；训 r 拟合人类比较。" },
  { ch: 10, front: "Why KL penalty in PPO?", back: "Keeps policy close to SFT model; without it the LM exploits reward-model weaknesses.", front_zh: "PPO 为何加 KL？", back_zh: "让策略接近 SFT；否则 LM 会利用奖励模型缺陷。" },
  { ch: 10, front: "DPO key idea.", back: "Directly optimise log-ratios of policy probabilities on preference pairs; skip the explicit reward model.", front_zh: "DPO 核心思想？", back_zh: "直接在偏好对上优化策略对数比；省去显式奖励模型。" },
  { ch: 10, front: "Reward hacking.", back: "Model exploits proxy reward without becoming actually more helpful — Goodhart's law in RL.", front_zh: "奖励黑客？", back_zh: "模型利用代理奖励而非实质改进——RL 中的 Goodhart 法则。" },
  { ch: 10, front: "Mode collapse risk.", back: "RL fine-tuning can shrink output diversity; KL to reference and entropy bonuses help.", front_zh: "模式坍塌风险？", back_zh: "RL 微调可能降低多样性；对参考的 KL 与熵奖励可缓解。" },
  { ch: 10, front: "Why SFT alone insufficient.", back: "SFT teaches stylistic imitation; preferences are needed to pick between several plausible answers.", front_zh: "SFT 单独为何不够？", back_zh: "SFT 教会风格模仿；要在多种可行答案间选优需偏好。" },
  { ch: 10, front: "Reward-model training data.", back: "Pairs (prompt, y_w, y_l) where humans ranked y_w over y_l.", front_zh: "奖励模型训练数据？", back_zh: "三元组（提示，y_w，y_l），人类标注 y_w 优于 y_l。" },
  { ch: 10, front: "PPO objective shape.", back: "Maximise E[r(y) − β KL(π || π_SFT)]; clipped policy-gradient updates.", front_zh: "PPO 目标形式？", back_zh: "最大化 E[r(y) − β KL(π || π_SFT)]；带裁剪的策略梯度更新。" },

  // —— Ch12 ——
  { ch: 12, front: "What is an LLM agent?", back: "An LLM combined with tools and a loop that lets it reason, act in the world, and observe results.", front_zh: "什么是 LLM 智能体？", back_zh: "LLM 加上工具与循环，使其能推理、对环境采取行动并观察结果。" },
  { ch: 12, front: "Chain-of-Thought prompting.", back: "Ask the model to produce intermediate reasoning steps before the final answer.", front_zh: "思维链提示？", back_zh: "让模型在最终答案前给出中间推理步骤。" },
  { ch: 12, front: "ReAct pattern.", back: "Alternate Reasoning steps with Actions (e.g. tool calls) and Observations; just prompting, no training.", front_zh: "ReAct 模式？", back_zh: "在推理步骤间穿插动作（如工具调用）与观察；仅靠提示，无需训练。" },
  { ch: 12, front: "RAG (retrieval-augmented generation).", back: "Retrieve relevant documents from a corpus and condition the LM's generation on them.", front_zh: "检索增强生成（RAG）？", back_zh: "从语料检索相关文档，并据此条件化 LM 的生成。" },
  { ch: 12, front: "Tool use / function calling.", back: "LLM emits a structured call (e.g. JSON) that the runtime executes; the result is fed back as observation.", front_zh: "工具使用 / 函数调用？", back_zh: "LLM 发出结构化调用（如 JSON），由运行时执行后将结果反馈。" },
  { ch: 12, front: "Multi-agent system.", back: "Multiple LLMs (with different roles or models) communicate to solve a task; new failure modes from coordination.", front_zh: "多智能体系统？", back_zh: "多个 LLM（角色/模型各异）协作解决任务；引入协同失败模式。" },
  { ch: 12, front: "Prompt-injection attack.", back: "Malicious instructions hidden in retrieved or read content override the agent's original instructions.", front_zh: "Prompt 注入？", back_zh: "隐藏在检索/读入内容中的恶意指令覆盖智能体原始指令。" },
  { ch: 12, front: "Cosine similarity (for retrieval).", back: "\\(u \\cdot v / (\\|u\\|\\,\\|v\\|)\\); 1 = identical direction, 0 = orthogonal.", front_zh: "余弦相似度（检索）？", back_zh: "\\(u \\cdot v / (\\|u\\|\\,\\|v\\|)\\)；1 同向，0 正交。" },
  { ch: 12, front: "Dense vs sparse retrieval.", back: "Dense: embedding-based similarity (e.g. cosine). Sparse: TF-IDF / BM25 over tokens.", front_zh: "稠密 vs 稀疏检索？", back_zh: "稠密：基于嵌入相似度（如余弦）。稀疏：基于词项的 TF-IDF / BM25。" },
  { ch: 12, front: "Hallucination mitigation via tools.", back: "Ground the model in retrieved facts (RAG) or external calculators / search to verify claims before answering.", front_zh: "用工具缓解幻觉？", back_zh: "用 RAG 检索事实或调用计算/搜索等外部工具，回答前先验证主张。" },
];
