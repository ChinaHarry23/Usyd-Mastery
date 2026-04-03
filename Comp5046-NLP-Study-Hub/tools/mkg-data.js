window.KG_CONFIG = {
  langKey: "comp5046_lang",
  fromParam: "mkg",
  numChapters: 6,
  chapterColors: { 1:"#6c8cff", 2:"#34d399", 3:"#fbbf24", 4:"#a78bfa", 5:"#f87171", 6:"#f472b6" },
  chapterNames: {
    1:"L1 Foundations", 2:"L2 Foundations", 3:"L3 Foundations",
    4:"L4 Foundations", 5:"L5 Foundations", 6:"L6 Foundations"
  },
  clickHint: { en: "Click to open Math Foundations section", zh: "点击打开数学基础页面" },
  nodes: [
    // ===== CHAPTER 1 MATH =====
    { id:"m1-vocab",   ch:1, diff:1, label:"Vocabulary V & notation",  def:"V = finite word-type set; |V| = vocab size; corpus w₁…w_N with w_i ∈ V.",                 href:"../chapters/chapter1/web/chapter1-math.html#sec-sets" },
    { id:"m1-onehot",  ch:1, diff:1, label:"One-hot formula",          def:"e_w ∈ {0,1}^|V| with single 1 at index j; e_a · e_b = 0 for a≠b.",                        href:"../chapters/chapter1/web/chapter1-math.html#sec-onehot" },
    { id:"m1-tf",      ch:1, diff:2, label:"Log-scaled TF",            def:"tf = 1 + log₁₀(count) if count > 0, else 0; compresses high frequencies.",                 href:"../chapters/chapter1/web/chapter1-math.html#sec-tfidf" },
    { id:"m1-idf",     ch:1, diff:2, label:"IDF formula",              def:"idf_t = log₁₀(N/df(t)); if t in every doc → idf=0, no discriminative power.",              href:"../chapters/chapter1/web/chapter1-math.html#sec-tfidf" },
    { id:"m1-tfidf",   ch:1, diff:2, label:"TF-IDF combined",          def:"tf-idf = tf × idf; product of local and global weighting.",                                href:"../chapters/chapter1/web/chapter1-math.html#sec-tfidf" },
    { id:"m1-bm25",    ch:1, diff:3, label:"BM25 formula",             def:"Sum over query terms: IDF-like × length-normalised saturating TF; params a∈[0.1,4], b∈[0.1,1].", href:"../chapters/chapter1/web/chapter1-math.html#sec-bm25" },
    { id:"m1-cosine",  ch:1, diff:2, label:"Cosine similarity",        def:"cos(u,v) = u·v / (‖u‖‖v‖); range [-1,1]; 1=same direction, 0=orthogonal.",                href:"../chapters/chapter1/web/chapter1-math.html#sec-cosine" },
    { id:"m1-svd",     ch:1, diff:3, label:"Truncated SVD",            def:"M ≈ U_k Σ_k V_k^T; rows of U_kΣ_k give k-dim dense word vectors.",                        href:"../chapters/chapter1/web/chapter1-math.html#sec-svd" },
    { id:"m1-softmax", ch:1, diff:2, label:"Softmax function",         def:"softmax(z_i) = e^{z_i}/Σe^{z_j}; maps logits to probability distribution.",               href:"../chapters/chapter1/web/chapter1-math.html#sec-softmax" },
    { id:"m1-ce",      ch:1, diff:2, label:"Cross-entropy loss",       def:"L_CE = −log p̂_{y*}; minimise ≡ maximise log-prob of correct class.",                      href:"../chapters/chapter1/web/chapter1-math.html#sec-softmax" },
    { id:"m1-embed",   ch:1, diff:2, label:"Embedding matrix E",       def:"E ∈ ℝ^{|V|×d}; lookup e_w = E[w,:]; d ≪ |V|.",                                           href:"../chapters/chapter1/web/chapter1-math.html#sec-embed" },
    { id:"m1-dot",     ch:1, diff:1, label:"Dot product",             def:"u·v = Σu_iv_i; favours longer vectors; building block for cosine, attention, and scoring.",  href:"../chapters/chapter1/web/chapter1-math.html#sec-cosine" },

    // ===== CHAPTER 2 MATH =====
    { id:"m2-linscore",ch:2, diff:1, label:"Linear scoring",           def:"score = x·w + b; multi-class: ŷ = argmax_ℓ x·W_{:,ℓ}.",                                   href:"../chapters/chapter2/web/chapter2-math.html#sec-linear" },
    { id:"m2-sigmoid", ch:2, diff:1, label:"Sigmoid σ(z)",             def:"σ(z) = 1/(1+e^{-z}); maps ℝ → (0,1); derivative σ(1−σ).",                                 href:"../chapters/chapter2/web/chapter2-math.html#sec-sigmoid" },
    { id:"m2-01",      ch:2, diff:1, label:"0-1 loss",                 def:"𝟙[ŷ≠y]; non-differentiable — can't gradient-descend directly.",                           href:"../chapters/chapter2/web/chapter2-math.html#sec-losses" },
    { id:"m2-hinge",   ch:2, diff:2, label:"Hinge loss",               def:"max(0, 1−y·f(x)); margin-based, pushes correct score ≥ incorrect+1.",                      href:"../chapters/chapter2/web/chapter2-math.html#sec-losses" },
    { id:"m2-ce",      ch:2, diff:2, label:"Cross-entropy loss",       def:"−log(e^{s_y}/Σe^{s_ℓ}); smooth, differentiable, standard for NLP.",                       href:"../chapters/chapter2/web/chapter2-math.html#sec-losses" },
    { id:"m2-perc",    ch:2, diff:2, label:"Perceptron update",        def:"w_y += x, w_ŷ −= x on error; no learning rate; converges if linearly separable.",         href:"../chapters/chapter2/web/chapter2-math.html#sec-perceptron" },
    { id:"m2-loggrad", ch:2, diff:2, label:"Logistic gradient",        def:"∂L/∂w_j = (σ(x·w)−y)x_j; step: w_j ← w_j − η(p̂−y)x_j.",                               href:"../chapters/chapter2/web/chapter2-math.html#sec-logistic" },
    { id:"m2-prec",    ch:2, diff:1, label:"Precision & Recall",       def:"P = TP/(TP+FP); R = TP/(TP+FN).",                                                         href:"../chapters/chapter2/web/chapter2-math.html#sec-metrics" },
    { id:"m2-f1",      ch:2, diff:2, label:"F1 formula",               def:"F1 = 2PR/(P+R) = 2TP/(2TP+FP+FN); harmonic mean.",                                       href:"../chapters/chapter2/web/chapter2-math.html#sec-metrics" },
    { id:"m2-roc",     ch:2, diff:2, label:"ROC / AUC",                def:"TPR vs FPR curve; AUC 0.5=random, 1.0=perfect; PR curve for rare positives.",              href:"../chapters/chapter2/web/chapter2-math.html#sec-roc" },
    { id:"m2-sqerr",   ch:2, diff:1, label:"Squared error loss",      def:"(y−f(x))²; regression-style alternative; smooth but not standard for classification.",      href:"../chapters/chapter2/web/chapter2-math.html#sec-losses" },
    { id:"m2-acc",     ch:2, diff:1, label:"Accuracy formula",        def:"(TP+TN)/(TP+TN+FP+FN); misleading under class imbalance.",                                 href:"../chapters/chapter2/web/chapter2-math.html#sec-metrics" },

    // ===== CHAPTER 3 MATH =====
    { id:"m3-affine",  ch:3, diff:1, label:"Affine transform",         def:"z = xW + b; layer = affine + activation.",                                                 href:"../chapters/chapter3/web/chapter3-math.html#sec-affine" },
    { id:"m3-sig",     ch:3, diff:1, label:"Sigmoid & derivative",     def:"σ(z)=1/(1+e^{-z}); σ'=σ(1−σ); max derivative 0.25; saturates → vanishing grad.",          href:"../chapters/chapter3/web/chapter3-math.html#sec-act" },
    { id:"m3-tanh",    ch:3, diff:2, label:"Tanh & derivative",        def:"tanh(z)=(e^z−e^{-z})/(e^z+e^{-z}); tanh'=1−tanh²; zero-centred, still saturates.",       href:"../chapters/chapter3/web/chapter3-math.html#sec-act" },
    { id:"m3-relu",    ch:3, diff:1, label:"ReLU & derivative",        def:"max(0,z); derivative 1 if z>0, 0 otherwise; no saturation for positives.",                 href:"../chapters/chapter3/web/chapter3-math.html#sec-act" },
    { id:"m3-mlpeq",   ch:3, diff:2, label:"MLP equations",            def:"h=g(xW₁+b₁); ŷ=hW₂+b₂; without g → collapses to linear.",                               href:"../chapters/chapter3/web/chapter3-math.html#sec-mlp" },
    { id:"m3-gd",      ch:3, diff:1, label:"Gradient descent",         def:"θ ← θ − η∇_θL; SGD uses minibatch gradients.",                                           href:"../chapters/chapter3/web/chapter3-math.html#sec-sgd" },
    { id:"m3-chain",   ch:3, diff:2, label:"Chain rule",               def:"∂L/∂θ₁ = (∂L/∂f₃)(∂f₃/∂f₂)(∂f₂/∂f₁)(∂f₁/∂θ₁) for composed functions.",                href:"../chapters/chapter3/web/chapter3-math.html#sec-chain" },
    { id:"m3-bp",      ch:3, diff:3, label:"Backprop mechanism",       def:"Forward: cache intermediates. Backward: propagate grads via cached Jacobians.",            href:"../chapters/chapter3/web/chapter3-math.html#sec-chain" },
    { id:"m3-l2",      ch:3, diff:2, label:"L2 regularisation",        def:"L + λΣw_i²; penalises large weights; Gaussian prior; grad += 2λw_i.",                     href:"../chapters/chapter3/web/chapter3-math.html#sec-reg" },
    { id:"m3-l1",      ch:3, diff:2, label:"L1 regularisation",        def:"L + λΣ|w_i|; encourages exact zeros → feature selection.",                                 href:"../chapters/chapter3/web/chapter3-math.html#sec-reg" },
    { id:"m3-drop",    ch:3, diff:2, label:"Dropout math",             def:"Zero units with prob p in training; scale weights by (1−p) at test.",                      href:"../chapters/chapter3/web/chapter3-math.html#sec-reg" },
    { id:"m3-elman",   ch:3, diff:2, label:"Elman RNN equations",      def:"h_t=tanh(Wx_t+Vh_{t-1}+b_h); y_t=tanh(Uh_t+b_y); shared W,V,U.",                        href:"../chapters/chapter3/web/chapter3-math.html#sec-rnn" },
    { id:"m3-bptt",    ch:3, diff:3, label:"BPTT",                     def:"Unroll T steps; total gradient = sum of contributions from each step.",                    href:"../chapters/chapter3/web/chapter3-math.html#sec-rnn" },
    { id:"m3-gradprod",ch:3, diff:3, label:"Gradient product",         def:"Π diag(tanh'(·))V; <1 → vanishing, >1 → exploding.",                                     href:"../chapters/chapter3/web/chapter3-math.html#sec-grad-issues" },
    { id:"m3-clip",    ch:3, diff:2, label:"Gradient clipping",        def:"Cap ‖∇‖ to max norm; prevents exploding; gated arches fix vanishing.",                    href:"../chapters/chapter3/web/chapter3-math.html#sec-grad-issues" },

    // ===== CHAPTER 4 MATH =====
    { id:"m4-argmax",  ch:4, diff:1, label:"Argmax inference",         def:"ŷ = argmax_{y∈Y} s(x,y); find highest-scoring output.",                                   href:"../chapters/chapter4/web/chapter4-math.html#sec-argmax" },
    { id:"m4-comb",    ch:4, diff:2, label:"Combinatorial explosion",  def:"|T|^n tag sequences; exponential in length n.",                                            href:"../chapters/chapter4/web/chapter4-math.html#sec-comb" },
    { id:"m4-temp",    ch:4, diff:2, label:"Softmax temperature",      def:"p ∝ exp(s/τ); τ→0 = argmax, τ→∞ = uniform.",                                             href:"../chapters/chapter4/web/chapter4-math.html#sec-sampling" },
    { id:"m4-topkp",   ch:4, diff:2, label:"Top-k & top-p math",      def:"Top-k: fixed k tokens; top-p: smallest set with cumulative prob ≥ p.",                     href:"../chapters/chapter4/web/chapter4-math.html#sec-sampling" },
    { id:"m4-beamcx",  ch:4, diff:2, label:"Beam complexity",          def:"O(T·K·|V|) per step; length normalisation: score/|y|^α.",                                 href:"../chapters/chapter4/web/chapter4-math.html#sec-beam" },
    { id:"m4-vitscore",ch:4, diff:3, label:"Viterbi score decomposition", def:"s(y) = Σ[emit(y_t,x_t) + trans(y_{t-1},y_t)].",                                       href:"../chapters/chapter4/web/chapter4-math.html#sec-viterbi" },
    { id:"m4-vitdp",   ch:4, diff:3, label:"Viterbi DP recurrence",    def:"δ_t(j) = max_i[δ_{t-1}(i)+trans(i,j)+emit(j,x_t)]; O(n|T|²).",                          href:"../chapters/chapter4/web/chapter4-math.html#sec-viterbi" },

    // ===== CHAPTER 5 MATH =====
    { id:"m5-dot",     ch:5, diff:1, label:"Dot product",              def:"u·v = Σu_iv_i = ‖u‖‖v‖cosθ; mixes magnitude and direction.",                             href:"../chapters/chapter5/web/chapter5-math.html#sec-dot" },
    { id:"m5-cbow",    ch:5, diff:2, label:"CBOW objective",           def:"Maximise Σlog p(w_c|ctx); softmax over dot products of averaged context.",                 href:"../chapters/chapter5/web/chapter5-math.html#sec-cbow" },
    { id:"m5-sg",      ch:5, diff:2, label:"Skip-gram objective",      def:"Maximise Σ Σlog p(w_j|w_c) via softmax on centre-context dot products.",                  href:"../chapters/chapter5/web/chapter5-math.html#sec-skipgram" },
    { id:"m5-ns",      ch:5, diff:3, label:"Negative sampling",        def:"Approximate full softmax: contrast true pair vs K negatives from P_n ∝ f(w)^{3/4}.",      href:"../chapters/chapter5/web/chapter5-math.html#sec-skipgram" },
    { id:"m5-glove",   ch:5, diff:3, label:"GloVe objective",          def:"Minimise Σf(X_{ij})(w_i^T w̃_j+b+b̃−logX_{ij})² so dots ≈ log co-occurrence.",           href:"../chapters/chapter5/web/chapter5-math.html#sec-glove" },
    { id:"m5-s2seq",   ch:5, diff:2, label:"Seq2seq conditioning",     def:"p(y|x) = Π p(y_t|y_{<t},c); c = encoder context vector.",                                href:"../chapters/chapter5/web/chapter5-math.html#sec-seq2seq" },
    { id:"m5-fbeta",   ch:5, diff:2, label:"F-beta score",             def:"F_β = (1+β²)PR/(β²P+R); β=1→F1; chrF uses char n-gram P/R.",                             href:"../chapters/chapter5/web/chapter5-math.html#sec-fbeta" },
    { id:"m5-bleu",    ch:5, diff:3, label:"BLEU formula",             def:"BP·exp(Σ(1/N)log p_n); geometric mean of n-gram precisions + brevity penalty.",           href:"../chapters/chapter5/web/chapter5-math.html#sec-bleu" },
    { id:"m5-bpe",     ch:5, diff:2, label:"BPE algorithm",            def:"Start from chars; merge most frequent adjacent pair until vocab=K.",                       href:"../chapters/chapter5/web/chapter5-math.html#sec-bpe" },

    // ===== CHAPTER 6 MATH =====
    { id:"m6-dotattn", ch:6, diff:1, label:"Dot-product score",        def:"e = s^T h; simplest attention score function.",                                            href:"../chapters/chapter6/web/chapter6-math.html#sec-attn-scores" },
    { id:"m6-bilin",   ch:6, diff:2, label:"Bilinear score",           def:"e = s^T W h; learnable W weights dimensions differently.",                                 href:"../chapters/chapter6/web/chapter6-math.html#sec-attn-scores" },
    { id:"m6-addit",   ch:6, diff:2, label:"Additive (Bahdanau) score",def:"e = b^T tanh(W₁h + W₂s); project into shared space, score with b.",                      href:"../chapters/chapter6/web/chapter6-math.html#sec-attn-scores" },
    { id:"m6-scaled",  ch:6, diff:2, label:"Scaled dot-product",       def:"e = q^Tk/√d_k; dividing restores unit variance → non-saturated softmax.",                 href:"../chapters/chapter6/web/chapter6-math.html#sec-attn-scores" },
    { id:"m6-selfeq",  ch:6, diff:2, label:"Self-attention formula",   def:"e_{ij}=x_i^Tx_j; α=softmax; o_i=Σα_{ij}x_j; weighted avg of all positions.",             href:"../chapters/chapter6/web/chapter6-math.html#sec-self-attn" },
    { id:"m6-qkv",     ch:6, diff:2, label:"QKV projections",          def:"q=W^Qx, k=W^Kx, v=W^Vx; Attention(Q,K,V)=softmax(QK^T/√d_k)V.",                        href:"../chapters/chapter6/web/chapter6-math.html#sec-qkv" },
    { id:"m6-mh",      ch:6, diff:3, label:"Multi-head formula",       def:"head_h=Attn(XW_h^Q,XW_h^K,XW_h^V); concat all heads → W^O; d_k=d_model/H.",             href:"../chapters/chapter6/web/chapter6-math.html#sec-multihead" },
    { id:"m6-sinpe",   ch:6, diff:2, label:"Sinusoidal PE",            def:"PE(t,2i)=sin(t/10000^{2i/d}); PE(t,2i+1)=cos(…); different freq per dim.",               href:"../chapters/chapter6/web/chapter6-math.html#sec-pos" },
    { id:"m6-mask",    ch:6, diff:2, label:"Causal mask formula",      def:"e_{ij}=q^Tk/√d_k if j≤i, else −∞; α_{ij}=0 for future positions.",                       href:"../chapters/chapter6/web/chapter6-math.html#sec-mask" },
    { id:"m6-resid",   ch:6, diff:1, label:"Residual connection",      def:"x' = x + SubLayer(x); direct gradient path stabilises deep stacks.",                       href:"../chapters/chapter6/web/chapter6-math.html#sec-residual" },
    { id:"m6-ln",      ch:6, diff:2, label:"LayerNorm formula",        def:"γ⊙(x−μ)/(σ+ε)+β; μ,σ over features per token; learned γ,β.",                             href:"../chapters/chapter6/web/chapter6-math.html#sec-layernorm" },
    { id:"m6-encblk",  ch:6, diff:3, label:"Encoder block equations",  def:"a=LN(x+MHA(x)); h=LN(a+FFN(a)); FFN=ReLU(aW₁+b₁)W₂+b₂; stack N.",                     href:"../chapters/chapter6/web/chapter6-math.html#sec-enc-block" },
    { id:"m6-cross",   ch:6, diff:3, label:"Cross-attention formula",  def:"Q=decoder hidden, K=V=encoder output; replaces bottleneck vector.",                        href:"../chapters/chapter6/web/chapter6-math.html#sec-cross" }
  ],
  edges: [
    // Ch1 internal
    ["m1-vocab","m1-onehot",8], ["m1-onehot","m1-tf",7], ["m1-tf","m1-idf",9],
    ["m1-idf","m1-tfidf",9], ["m1-tfidf","m1-bm25",7], ["m1-cosine","m1-svd",6],
    ["m1-softmax","m1-ce",9], ["m1-onehot","m1-embed",7],
    // Ch2 internal
    ["m2-linscore","m2-sigmoid",7], ["m2-sigmoid","m2-loggrad",8],
    ["m2-01","m2-hinge",7], ["m2-hinge","m2-ce",8], ["m2-ce","m2-loggrad",7],
    ["m2-perc","m2-loggrad",6], ["m2-prec","m2-f1",9], ["m2-f1","m2-roc",6],
    // Ch3 internal
    ["m3-affine","m3-sig",7], ["m3-sig","m3-tanh",8], ["m3-tanh","m3-relu",7],
    ["m3-relu","m3-mlpeq",8], ["m3-gd","m3-chain",9], ["m3-chain","m3-bp",9],
    ["m3-l2","m3-l1",8], ["m3-l1","m3-drop",6],
    ["m3-mlpeq","m3-elman",7], ["m3-elman","m3-bptt",9],
    ["m3-bptt","m3-gradprod",9], ["m3-gradprod","m3-clip",8],
    // Ch4 internal
    ["m4-argmax","m4-comb",7], ["m4-comb","m4-temp",6],
    ["m4-temp","m4-topkp",8], ["m4-topkp","m4-beamcx",7],
    ["m4-vitscore","m4-vitdp",9],
    // Ch5 internal
    ["m5-dot","m5-cbow",8], ["m5-cbow","m5-sg",9], ["m5-sg","m5-ns",8],
    ["m5-dot","m5-glove",7], ["m5-s2seq","m5-fbeta",5],
    ["m5-fbeta","m5-bleu",7], ["m5-s2seq","m5-bpe",5],
    // Ch6 internal
    ["m6-dotattn","m6-bilin",8], ["m6-bilin","m6-addit",7],
    ["m6-addit","m6-scaled",8], ["m6-scaled","m6-selfeq",9],
    ["m6-selfeq","m6-qkv",9], ["m6-qkv","m6-mh",9],
    ["m6-sinpe","m6-mask",7], ["m6-resid","m6-ln",8],
    ["m6-ln","m6-encblk",9], ["m6-mh","m6-encblk",8], ["m6-encblk","m6-cross",9],
    // Cross-chapter links
    ["m1-embed","m2-linscore",7], ["m1-softmax","m2-ce",8], ["m1-cosine","m5-dot",8],
    ["m2-sigmoid","m3-sig",9], ["m2-loggrad","m3-chain",7], ["m2-ce","m3-gd",7],
    ["m3-relu","m6-encblk",5], ["m3-elman","m5-s2seq",7],
    ["m3-gradprod","m5-s2seq",6], ["m4-temp","m6-scaled",6],
    ["m4-vitdp","m4-argmax",7], ["m5-dot","m6-dotattn",9],
    ["m5-ns","m5-sg",8], ["m5-bleu","m5-fbeta",7],
    // New node edges
    ["m1-dot","m1-cosine",9], ["m1-dot","m1-embed",6],
    ["m2-sqerr","m2-hinge",6], ["m2-acc","m2-prec",7], ["m2-01","m2-sqerr",6]
  ]
};
