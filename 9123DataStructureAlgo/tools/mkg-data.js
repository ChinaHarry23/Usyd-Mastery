/* COMP9123 — foundations graph data.
 * node: [id, chapter, difficulty(1-3), label, definition, href]
 * edge: [fromId, toId, strength]   // strength 4-9; the threshold slider
 *                                 // hides edges below its value (default 3)
 */
window.KG_CONFIG = {
  langKey: "comp9123_lang",
  fromParam: "mkg",
  numChapters: 10,
  chapterColors: {"1":"#0891b2","2":"#0ea5e9","3":"#2563eb","4":"#6366f1","5":"#7c3aed","6":"#a855f7","7":"#db2777","8":"#e11d48","9":"#ea580c","10":"#f59e0b"},
  chapterNames: {"1":"W1: Intro & analysis","2":"W2: Lists & sequences","3":"W3: Stacks, queues & linked lists","4":"W4: Trees","5":"W5: BSTs & AVL","6":"W6: Maps, heaps & priority queues","7":"W7: Hashing","8":"W8: Graphs","9":"W9: Graph algorithms","10":"W10: Greedy algorithms"},
  chapterNamesZh: {"1":"第1周","2":"第2周","3":"第3周","4":"第4周","5":"第5周","6":"第6周","7":"第7周","8":"第8周","9":"第9周","10":"第10周"},
  ui: {
    en: {
          "w1": "W1",
          "w2": "W2",
          "w3": "W3",
          "w4": "W4",
          "w5": "W5",
          "w6": "W6",
          "w7": "W7",
          "w8": "W8",
          "w9": "W9",
          "w10": "W10",
          "title": "Foundations Graph — COMP9123",
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
          "w6": "W6",
          "w7": "W7",
          "w8": "W8",
          "w9": "W9",
          "w10": "W10",
          "title": "Foundations Graph — COMP9123",
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
    // ── Week 1 — summation, discrete toolkit, loop / recurrence models ──
    ["m1-sigma", 1, 1, "Σ notation", "Summation notation and index shifting: split, shift, or subtract ranges instead of re-deriving a sum.", "../chapters/chapter1/web/chapter1-math.html#sec-m-summation"],
    ["m1-closed", 1, 2, "Closed forms ∑i, ∑i², ∑i³", "Triangular sums and the bonus-sheet identities n(n+1)/2, n(n+1)(2n+1)/6 and (n(n+1)/2)² for counting iterations.", "../chapters/chapter1/web/chapter1-math.html#sec-m-summation"],
    ["m1-logs", 1, 1, "Logs & exponents", "log(ab) = log a + log b and a^(m+n) = a^m·a^n; logarithms measure repeated halving.", "../chapters/chapter1/web/chapter1-math.html#sec-m-discrete"],
    ["m1-floor", 1, 2, "Floors & ceilings", "⌊x⌋ and ⌈x⌉ turn real-valued bounds such as n/2 into integer indices and recursion-tree level counts.", "../chapters/chapter1/web/chapter1-math.html#sec-m-discrete"],
    ["m1-proof", 1, 2, "Proof templates", "Counterexample, contrapositive, contradiction and induction; every induction needs a base case plus an inductive step.", "../chapters/chapter1/web/chapter1-math.html#sec-m-discrete"],
    ["m1-sets", 1, 1, "Sets & logic", "Membership x ∈ S, unions, intersections, Cartesian products and power sets — the language of specifications and invariants.", "../chapters/chapter1/web/chapter1-math.html#sec-m-discrete"],
    ["m1-prob", 1, 2, "Probability basics", "Sample spaces and equally likely events, Pr(A) = favourable/total, plus independence and conditional probability.", "../chapters/chapter1/web/chapter1-math.html#sec-m-discrete"],
    ["m1-recur", 1, 2, "Recurrences & recursion trees", "T(n) = 2T(n/2) + O(n) gives O(n log n) via linear work per level over log n levels; T(n) = T(n−1) + O(n) gives O(n²).", "../chapters/chapter1/web/chapter1-math.html#sec-m-asymptotic"],
    ["m1-loops", 1, 2, "Nested-loop models", "An inner bound that depends on i becomes a summation: ∑_{i<n} O(i) = Θ(n²).", "../chapters/chapter1/web/chapter1-math.html#sec-m-asymptotic"],
    ["m1-asym", 1, 1, "Asymptotic notation", "Big-O is an upper bound, Ω a lower bound and Θ a tight two-sided bound; constants and lower-order terms are suppressed.", "../chapters/chapter1/web/chapter1-study.html#sec-complexity"],

    // ── Week 2 — series behind shifting, amortised growth, pointer invariants ──
    ["m2-shift", 2, 2, "Suffix-shift series", "Moving everything after position i costs ∑_{j=i}^{n−1} 1 = Θ(n − i), which is why add(i, e) and remove(i) are O(n − i).", "../chapters/chapter2/web/chapter2-math.html#sec-m-series"],
    ["m2-triangular", 2, 2, "Front-insertion triangle", "Building a list by repeated head insertion into an array costs ∑_{k=1}^{n} k = Θ(n²).", "../chapters/chapter2/web/chapter2-math.html#sec-m-series"],
    ["m2-geometric", 2, 2, "Geometric capacity growth", "Doubling capacity copies 1 + 2 + 4 + … + 2^m = Θ(2^m) = Θ(n) elements in total, not quadratically many.", "../chapters/chapter2/web/chapter2-math.html#sec-m-series"],
    ["m2-worst", 2, 2, "Worst case vs amortised", "One resize is genuinely O(n); averaged over a long append sequence the extra cost per append is constant.", "../chapters/chapter2/web/chapter2-math.html#sec-m-amortised"],
    ["m2-amortised", 2, 3, "Amortised O(1) append", "The aggregate view: total copied elements over n appends is linear, so the average cost per operation stays constant.", "../chapters/chapter2/web/chapter2-math.html#sec-m-amortised"],
    ["m2-invariants", 2, 2, "Pointer invariants", "Head points at the first node, the last node's next is None, and every predecessor/successor pair agrees after each edit.", "../chapters/chapter2/web/chapter2-math.html#sec-m-invariants"],
    ["m2-index", 2, 1, "Index & address arithmetic", "Contiguous storage reaches element i by index arithmetic in O(1); a linked list turns indexing into a walk.", "../chapters/chapter2/web/chapter2-study.html#sec-arrays"],
    ["m2-rewire", 2, 2, "Rewiring insert/delete", "Both edits are a bounded number of pointer assignments once you hold references to the neighbouring nodes.", "../chapters/chapter2/web/chapter2-study.html#sec-operations"],

    // ── Week 3 — growth classes, time vs space, ADT augmentation ──
    ["m3-growthclass", 3, 2, "Growth-class ordering", "Rank √n, n, n log n, n², 2ⁿ, n!, nⁿ by family rather than by substituting one value of n.", "../chapters/chapter3/web/chapter3-math.html#sec-m-growth"],
    ["m3-const", 3, 1, "Constant vs input bound", "A loop bounded by a fixed 5 is O(1); a bound that scales with the input parameter is not.", "../chapters/chapter3/web/chapter3-math.html#sec-m-growth"],
    ["m3-stars", 3, 2, "Θ(n²) double loop", "Give both upper and lower reasoning for the tutorial's stars loop instead of only quoting O(n²).", "../chapters/chapter3/web/chapter3-math.html#sec-m-tutorial"],
    ["m3-space", 3, 2, "Time vs space", "Runtime measures work done; space complexity measures the extra information the algorithm must store.", "../chapters/chapter3/web/chapter3-math.html#sec-m-space"],
    ["m3-spaceclasses", 3, 2, "Space growth classes", "One helper record per item is O(n); all pairs is O(n²); generating all combinations can reach O(2ⁿ).", "../chapters/chapter3/web/chapter3-math.html#sec-m-space"],
    ["m3-ops", 3, 2, "O(1) stack & queue ops", "Push/pop and enqueue/dequeue stay constant time only while the right distinguished references (head/top, front/rear) are maintained.", "../chapters/chapter3/web/chapter3-math.html#sec-m-invariants"],
    ["m3-augment", 3, 3, "ADT augmentation", "Storing size together with a running sum turns getAverage() into an O(1) query instead of a full scan.", "../chapters/chapter3/web/chapter3-math.html#sec-m-invariants"],
    ["m3-twostacks", 3, 3, "Queue from two stacks", "Pouring the enqueue stack into the dequeue stack reverses order exactly once, so each element moves a bounded number of times.", "../chapters/chapter3/web/chapter3-math.html#sec-m-invariants"],

    // ── Week 4 — induction, tree counting identities, linear-time recursion ──
    ["m4-induction", 4, 2, "Induction on trees", "Prove the smallest case, then assume the claim for each child subtree and combine — the recursive call mirrors the inductive hypothesis.", "../chapters/chapter4/web/chapter4-math.html#sec-m-induction"],
    ["m4-geometric", 4, 2, "∑2^i = 2^(n+1) − 1", "The standard geometric warm-up used to prove tree counting bounds by induction.", "../chapters/chapter4/web/chapter4-math.html#sec-m-induction"],
    ["m4-fib", 4, 3, "Fibonacci bound F(n) < 2ⁿ", "A recurrence-shaped induction in which the current case is bounded from strictly smaller cases.", "../chapters/chapter4/web/chapter4-math.html#sec-m-induction"],
    ["m4-nodes", 4, 1, "n nodes ⇒ n − 1 edges", "A tree is connected and cycle-free, so it has exactly one fewer edge than node.", "../chapters/chapter4/web/chapter4-math.html#sec-m-counting"],
    ["m4-height", 4, 2, "Height h ⇒ ≤ 2^(h+1) − 1 nodes", "Each level at most doubles, so node count grows exponentially with height and balanced trees keep h logarithmic.", "../chapters/chapter4/web/chapter4-math.html#sec-m-counting"],
    ["m4-leaves", 4, 2, "Leaves = internal + 1", "In a proper (full) binary tree the number of leaves exceeds the number of internal nodes by exactly one.", "../chapters/chapter4/web/chapter4-math.html#sec-m-counting"],
    ["m4-lineartime", 4, 2, "Constant work per node ⇒ O(n)", "Summing O(1) work over n nodes is linear, while following at most one child per level costs O(height).", "../chapters/chapter4/web/chapter4-math.html#sec-m-recursion"],
    ["m4-bottomup", 4, 3, "Bottom-up aggregation", "Subtree size, height, balance factor and diameter all reuse child results instead of recomputing them from scratch.", "../chapters/chapter4/web/chapter4-math.html#sec-m-recursion"],
    ["m4-orders", 4, 2, "Traversal orders", "Preorder and postorder carry structural information: rebuild a shape, or read children before their parent.", "../chapters/chapter4/web/chapter4-study.html#sec-traversal"],

    // ── Week 5 — BST proof moves, height bounds, augmentation ──
    ["m5-inorder", 5, 2, "Inorder sortedness proof", "concat(inorder left, root, inorder right) is sorted once every left key is below and every right key above the root.", "../chapters/chapter5/web/chapter5-math.html#sec-m-bst-proof"],
    ["m5-global", 5, 3, "Global BST validation", "Comparing each node only with its children can accept an invalid tree; carry an ancestor key interval down the recursion instead.", "../chapters/chapter5/web/chapter5-math.html#sec-m-global"],
    ["m5-extremes", 5, 2, "largest / second-largest", "The rightmost path gives the maximum in O(h); the second largest needs case analysis of the maximum's left subtree and parent.", "../chapters/chapter5/web/chapter5-math.html#sec-m-global"],
    ["m5-heightbound", 5, 2, "n nodes ⇒ height ≥ log₂ n", "The maximum-node bound inverts into a logarithmic lower bound on the height of any BST.", "../chapters/chapter5/web/chapter5-math.html#sec-m-structure"],
    ["m5-external", 5, 2, "External nodes = n + 1", "A BST with n internal nodes has n + 1 external leaves, which bound where an unsuccessful search can end.", "../chapters/chapter5/web/chapter5-math.html#sec-m-structure"],
    ["m5-avlmin", 5, 3, "AVL minimum-size recurrence", "The smallest AVL tree of height h grows fast enough with h to force logarithmic height.", "../chapters/chapter5/web/chapter5-math.html#sec-m-structure"],
    ["m5-balance", 5, 3, "Balance factors & rotations", "Heights are maintained bottom-up so each balance factor stays in {−1, 0, 1} after a constant-time rotation.", "../chapters/chapter5/web/chapter5-study.html#sec-rotation"],
    ["m5-path", 5, 1, "Search-path length", "A BST search follows one root-to-leaf path, so the cost is O(h) and becomes O(log n) once the tree is balanced.", "../chapters/chapter5/web/chapter5-study.html#sec-search"],
    ["m5-augment", 5, 3, "Subtree-size augmentation", "Storing subtree size lets select/median choose left, root or right in O(1) per level, so rank queries cost O(h).", "../chapters/chapter5/web/chapter5-math.html#sec-m-augmentation"],
    ["m5-ranksum", 5, 3, "Rank sums & range deletion", "Cumulative key sums and weight sums support rank-sum and weighted-median queries; bulk pruning deletes a key range in O(h + s).", "../chapters/chapter5/web/chapter5-math.html#sec-m-augmentation"],

    // ── Week 6 — heap index arithmetic, linear build, PQ trade-offs ──
    ["m6-index0", 6, 1, "0-based heap indices", "Left child 2i + 1, right child 2i + 2, parent ⌊(i − 1)/2⌋ for i > 0.", "../chapters/chapter6/web/chapter6-math.html#sec-m-heap-index"],
    ["m6-index1", 6, 1, "1-based heap indices", "Left child 2i, right child 2i + 1, parent ⌊i/2⌋.", "../chapters/chapter6/web/chapter6-math.html#sec-m-heap-index"],
    ["m6-complete", 6, 2, "Completeness invariant", "The index formulas are a property of a complete tree with no gaps, not of binary trees in general.", "../chapters/chapter6/web/chapter6-math.html#sec-m-heap-index"],
    ["m6-build", 6, 3, "Linear bottom-up build-heap", "Heapifying from the bottom costs O(n) in total, while n repeated insertions cost O(n log n).", "../chapters/chapter6/web/chapter6-math.html#sec-m-build"],
    ["m6-levels", 6, 3, "Subtree-height distribution", "Few nodes sit high and many sit low, so many tiny repairs plus few large repairs sum to a total proportional to n.", "../chapters/chapter6/web/chapter6-math.html#sec-m-build"],
    ["m6-pqlens", 6, 2, "Sorting through a PQ lens", "Selection sort is cheap insert plus repeated remove_min; insertion sort is the reverse trade-off.", "../chapters/chapter6/web/chapter6-math.html#sec-m-sort"],
    ["m6-inversions", 6, 3, "Inversion count I", "An input-sensitive bound: insertion sort runs in O(n + I), where I counts out-of-order pairs.", "../chapters/chapter6/web/chapter6-math.html#sec-m-sort"],
    ["m6-topk", 6, 3, "k-th smallest in O(n log k)", "Keep only the k best candidates in a heap, and merge k sorted lists in O(mk log k) by holding one head per list.", "../chapters/chapter6/web/chapter6-math.html#sec-m-tradeoffs"],
    ["m6-pqcost", 6, 2, "Map & PQ cost tables", "Compare sorted and unsorted sequences against heaps on insert, remove-min and find-min before choosing an implementation.", "../chapters/chapter6/web/chapter6-study.html#sec-pq"],

    // ── Week 7 — load factor, collision arithmetic, expected probe counts ──
    ["m7-load", 7, 1, "Load factor α = n/N", "Stored entries over table capacity — the first diagnostic to inspect when a hash table slows down.", "../chapters/chapter7/web/chapter7-math.html#sec-m-load"],
    ["m7-chaincost", 7, 2, "Chaining cost O(1 + α)", "With separate chaining the expected operation cost tracks the average bucket size, and α may safely exceed 1.", "../chapters/chapter7/web/chapter7-math.html#sec-m-load"],
    ["m7-cluster", 7, 3, "Clustering near α → 1", "Open addressing degrades sharply as the table fills because probe sequences merge into long occupied runs.", "../chapters/chapter7/web/chapter7-math.html#sec-m-load"],
    ["m7-universal", 7, 3, "2-universal hashing", "For distinct keys i ≠ j, a random h drawn from H satisfies Pr[h(i) = h(j)] ≤ 1/N.", "../chapters/chapter7/web/chapter7-math.html#sec-m-hash-design"],
    ["m7-linearmod", 7, 3, "Random linear family", "h(k) = ((ak + b) mod p) mod N is the lecture's model 2-universal construction.", "../chapters/chapter7/web/chapter7-math.html#sec-m-hash-design"],
    ["m7-defunct", 7, 3, "DEFUNCT deletion invariant", "Lookup stops only at a genuinely EMPTY cell, so a deleted slot needs a DEFUNCT marker to keep probes correct while staying reusable.", "../chapters/chapter7/web/chapter7-math.html#sec-m-deletion"],
    ["m7-rehash", 7, 2, "Rehashing at a threshold", "Once α crosses a chosen bound the table is rebuilt larger so probe lengths or bucket lengths stop drifting upward.", "../chapters/chapter7/web/chapter7-math.html#sec-m-deletion"],
    ["m7-cuckoo", 7, 3, "Cuckoo guarantees", "Two candidate homes give worst-case O(1) lookup and removal; insertion is expected O(1) but can evict in a chain and rebuild.", "../chapters/chapter7/web/chapter7-math.html#sec-m-cuckoo"],
    ["m7-onepass", 7, 2, "One-pass hashing patterns", "Set intersection, frequency counts, k-gram counts and duplicate detection collapse into a single scan with expected O(1) updates.", "../chapters/chapter7/web/chapter7-math.html#sec-m-apps"],

    // ── Week 8 — graph counting identities, representation size, traversal proofs ──
    ["m8-handshake", 8, 2, "Handshake identity", "∑_{v∈V} deg(v) = 2m, because every undirected edge contributes to two endpoint degrees.", "../chapters/chapter8/web/chapter8-math.html#sec-m-counting"],
    ["m8-treeedges", 8, 1, "n vertices ⇒ n − 1 edges", "Trees are exactly the connected acyclic graphs with the minimum edge count, which validates spanning subgraphs.", "../chapters/chapter8/web/chapter8-math.html#sec-m-counting"],
    ["m8-maxedges", 8, 2, "m ≤ n(n − 1)/2", "A simple undirected graph takes at most one edge per unordered pair, which is why matrices suit dense graphs.", "../chapters/chapter8/web/chapter8-math.html#sec-m-counting"],
    ["m8-space", 8, 2, "Representation space", "Adjacency lists use O(n + m) space; an adjacency matrix always uses O(n²).", "../chapters/chapter8/web/chapter8-math.html#sec-m-representation"],
    ["m8-queries", 8, 2, "Representation query costs", "incidentEdges(v) is O(deg v) on lists but O(n) on a matrix; getEdge(u, v) is O(min(deg u, deg v)) versus O(1).", "../chapters/chapter8/web/chapter8-math.html#sec-m-representation"],
    ["m8-dfsforest", 8, 2, "DFS forest invariant", "Every discovery records a tree edge through the parent pointer, so a finished component's parent edges form a spanning tree.", "../chapters/chapter8/web/chapter8-math.html#sec-m-traversal"],
    ["m8-bfslayers", 8, 2, "BFS layer invariant", "A vertex first discovered in layer L_i has a path of exactly i edges from the source, and no shorter path exists.", "../chapters/chapter8/web/chapter8-math.html#sec-m-traversal"],
    ["m8-layerbound", 8, 3, "|d(u) − d(v)| ≤ 1", "Any edge joins vertices at most one BFS layer apart — the local fact behind bipartite and distance arguments.", "../chapters/chapter8/web/chapter8-math.html#sec-m-traversal"],
    ["m8-bridge", 8, 3, "Bridge criterion", "A DFS tree edge (u, v) with u = parent[v] is not a bridge exactly when down_and_up[v] ≤ level[u].", "../chapters/chapter8/web/chapter8-math.html#sec-m-bridges"],
    ["m8-bipartite", 8, 3, "Bipartite layer test", "BFS layers act as a two-colouring; an edge whose endpoints share a layer proves the graph is not bipartite.", "../chapters/chapter8/web/chapter8-math.html#sec-m-apps"],

    // ── Week 9 — relaxation, weight transforms, MST exchange arguments ──
    ["m9-relax", 9, 2, "Relaxation update", "If D[u] is a known route to u then D[u] + w(u, v) is a candidate for D[v]; relaxation keeps the smaller claim.", "../chapters/chapter9/web/chapter9-math.html#sec-m-relaxation"],
    ["m9-subpath", 9, 3, "Subpath property", "Every prefix of a shortest path is itself shortest, or the whole path could be improved by replacing that prefix.", "../chapters/chapter9/web/chapter9-math.html#sec-m-relaxation"],
    ["m9-settle", 9, 3, "Greedy settlement", "remove_min finalises the smallest tentative label — the commitment step whose safety needs non-negative weights.", "../chapters/chapter9/web/chapter9-math.html#sec-m-dijkstra"],
    ["m9-scans", 9, 3, "decrease_key & O(m) scans", "Adjacency scans total O(m) across the whole run, so the priority-queue implementation is the complexity lever.", "../chapters/chapter9/web/chapter9-math.html#sec-m-dijkstra"],
    ["m9-nonneg", 9, 2, "Non-negative weights", "Dijkstra still works on directed graphs, but a negative edge can invalidate an already-settled label.", "../chapters/chapter9/web/chapter9-math.html#sec-m-dijkstra"],
    ["m9-transform", 9, 3, "Weight transforms", "Scaling by α > 0 preserves shortest paths and MSTs; adding β breaks shortest paths but not MSTs; squaring preserves MSTs for positive weights.", "../chapters/chapter9/web/chapter9-math.html#sec-m-transform"],
    ["m9-cut", 9, 3, "Cut property & exchange", "The cheapest edge crossing a cut is safe: add it, close a cycle, and swap out another crossing edge without raising total cost.", "../chapters/chapter9/web/chapter9-math.html#sec-m-mst-proof"],
    ["m9-complexity", 9, 3, "Graph algorithm complexity", "Dijkstra and Prim both hinge on the priority-queue choice: heap-based O(m log n) against sequence-based O(n²) trade-offs.", "../chapters/chapter9/web/chapter9-study.html#sec-dijkstra"],
    ["m9-model", 9, 3, "Modeling tricks", "Vertex costs, fewest-edge tie-breaks and all-pairs bottleneck values are reshaped into standard shortest-path or MST instances.", "../chapters/chapter9/web/chapter9-math.html#sec-m-apps"],

    // ── Week 10 — greedy exchange arguments, lower bounds, Huffman cost ──
    ["m10-exchange", 10, 3, "Exchange argument", "Take an optimum that disagrees with the greedy choice, swap in the greedy choice, and show the objective cannot get worse.", "../chapters/chapter10/web/chapter10-math.html#sec-m-exchange"],
    ["m10-knapsack", 10, 2, "Fractional knapsack", "The exchange argument justifies taking items in decreasing value-to-weight ratio whenever items are divisible.", "../chapters/chapter10/web/chapter10-study.html#sec-knapsack"],
    ["m10-counter", 10, 2, "Tiny counterexample", "Reject a bad local rule with a three- or four-item witness in which the greedy move blocks a better global outcome.", "../chapters/chapter10/web/chapter10-math.html#sec-m-counterexamples"],
    ["m10-depth", 10, 2, "Interval depth lower bound", "If d intervals contain one time point then any schedule needs at least d rooms; matching that depth proves interval partitioning optimal.", "../chapters/chapter10/web/chapter10-math.html#sec-m-intervals"],
    ["m10-ratio", 10, 3, "Adjacent-swap ratio ordering", "Compare i-then-j with j-then-i; the sign of the weighted completion-time difference yields the t_j/w_j (Smith's rule) order.", "../chapters/chapter10/web/chapter10-math.html#sec-m-weighted"],
    ["m10-wpl", 10, 2, "Weighted path length", "Huffman coding minimises ∑ f(c)·depth(c), so frequent symbols must stay shallow in the code tree.", "../chapters/chapter10/web/chapter10-math.html#sec-m-huffman"],
    ["m10-merge", 10, 3, "Merge two least frequent", "The deepest sibling leaves can be the least frequent symbols; merging them and solving the contracted problem yields an optimal tree.", "../chapters/chapter10/web/chapter10-math.html#sec-m-huffman"],
    ["m10-prefix", 10, 2, "Prefix-free codes", "No codeword is a prefix of another, which is what makes a left/right tree walk uniquely decodable.", "../chapters/chapter10/web/chapter10-study.html#sec-huffman"],
    ["m10-limits", 10, 2, "Limits of greedy", "Supporting examples never prove a greedy rule; a single counterexample is enough to destroy the claim.", "../chapters/chapter10/web/chapter10-study.html#sec-limits"],
  ].map(function (n) {
    return { id: n[0], ch: n[1], diff: n[2], label: n[3], def: n[4], href: n[5] };
  }),
  edges: [
    // Week 1 — the notation stack itself
    ["m1-sigma", "m1-closed", 9], ["m1-sigma", "m1-loops", 8], ["m1-closed", "m1-recur", 7],
    ["m1-logs", "m1-floor", 6], ["m1-logs", "m1-recur", 7], ["m1-logs", "m1-asym", 6],
    ["m1-proof", "m1-recur", 6], ["m1-sets", "m1-prob", 7], ["m1-sets", "m1-proof", 5],
    ["m1-asym", "m1-loops", 7], ["m1-asym", "m1-recur", 7],

    // Week 2 — summations behind array costs, amortised growth, pointer invariants
    ["m2-index", "m2-shift", 7], ["m2-index", "m2-geometric", 6], ["m2-shift", "m2-triangular", 7],
    ["m2-shift", "m2-rewire", 5], ["m2-triangular", "m2-worst", 6], ["m2-geometric", "m2-amortised", 8],
    ["m2-worst", "m2-amortised", 9], ["m2-index", "m2-invariants", 5], ["m2-rewire", "m2-invariants", 7],

    // Week 3 — growth families, space axes, augmentation
    ["m3-growthclass", "m3-const", 6], ["m3-growthclass", "m3-stars", 7], ["m3-growthclass", "m3-space", 5],
    ["m3-const", "m3-space", 4], ["m3-space", "m3-spaceclasses", 8], ["m3-ops", "m3-augment", 7],
    ["m3-ops", "m3-twostacks", 6], ["m3-augment", "m3-twostacks", 5],

    // Week 4 — induction feeds every counting identity and the linear-time claim
    ["m4-induction", "m4-geometric", 8], ["m4-induction", "m4-fib", 8], ["m4-induction", "m4-nodes", 7],
    ["m4-induction", "m4-height", 8], ["m4-induction", "m4-leaves", 7], ["m4-geometric", "m4-height", 8],
    ["m4-nodes", "m4-leaves", 7], ["m4-nodes", "m4-lineartime", 6], ["m4-height", "m4-bottomup", 6],
    ["m4-lineartime", "m4-bottomup", 8], ["m4-orders", "m4-lineartime", 6], ["m4-orders", "m4-bottomup", 7],

    // Week 5 — proof templates, height arithmetic, augmentation
    ["m5-path", "m5-inorder", 6], ["m5-inorder", "m5-global", 7], ["m5-global", "m5-extremes", 7],
    ["m5-path", "m5-heightbound", 9], ["m5-heightbound", "m5-external", 7], ["m5-heightbound", "m5-avlmin", 8],
    ["m5-external", "m5-avlmin", 6], ["m5-avlmin", "m5-balance", 8], ["m5-path", "m5-balance", 7],
    ["m5-path", "m5-augment", 7], ["m5-augment", "m5-ranksum", 8], ["m5-augment", "m5-extremes", 5],

    // Week 6 — heap geometry, linear build, PQ trade-offs
    ["m6-complete", "m6-index0", 9], ["m6-complete", "m6-index1", 8], ["m6-index0", "m6-index1", 6],
    ["m6-index0", "m6-build", 7], ["m6-build", "m6-levels", 8], ["m6-build", "m6-pqcost", 6],
    ["m6-levels", "m6-topk", 5], ["m6-pqlens", "m6-inversions", 7], ["m6-pqlens", "m6-pqcost", 6],
    ["m6-pqlens", "m6-topk", 5], ["m6-pqcost", "m6-topk", 7],

    // Week 7 — load factor drives every expected-cost claim
    ["m7-load", "m7-chaincost", 9], ["m7-load", "m7-cluster", 8], ["m7-load", "m7-rehash", 7],
    ["m7-cluster", "m7-defunct", 7], ["m7-cluster", "m7-rehash", 8], ["m7-universal", "m7-linearmod", 8],
    ["m7-universal", "m7-chaincost", 7], ["m7-universal", "m7-cuckoo", 6], ["m7-defunct", "m7-cuckoo", 4],
    ["m7-cuckoo", "m7-rehash", 6], ["m7-onepass", "m7-load", 5],

    // Week 8 — counting identities, representation cost, traversal invariants
    ["m8-treeedges", "m8-maxedges", 6], ["m8-handshake", "m8-maxedges", 7], ["m8-handshake", "m8-space", 7],
    ["m8-handshake", "m8-queries", 5], ["m8-space", "m8-queries", 8], ["m8-space", "m8-treeedges", 4],
    ["m8-queries", "m8-treeedges", 5], ["m8-dfsforest", "m8-treeedges", 6], ["m8-dfsforest", "m8-bridge", 8],
    ["m8-bfslayers", "m8-layerbound", 9], ["m8-bfslayers", "m8-bipartite", 8], ["m8-layerbound", "m8-bipartite", 7],

    // Week 9 — relaxation, settlement, transforms, cut/exchange
    ["m9-relax", "m9-settle", 9], ["m9-relax", "m9-subpath", 7], ["m9-subpath", "m9-settle", 7],
    ["m9-settle", "m9-nonneg", 8], ["m9-settle", "m9-scans", 7], ["m9-relax", "m9-complexity", 6],
    ["m9-scans", "m9-complexity", 8], ["m9-cut", "m9-complexity", 6], ["m9-cut", "m9-subpath", 4],
    ["m9-transform", "m9-complexity", 5], ["m9-model", "m9-transform", 7], ["m9-model", "m9-complexity", 6],

    // Week 10 — the greedy proof toolkit
    ["m10-exchange", "m10-knapsack", 8], ["m10-exchange", "m10-ratio", 8], ["m10-exchange", "m10-counter", 6],
    ["m10-exchange", "m10-limits", 6], ["m10-counter", "m10-limits", 7], ["m10-depth", "m10-exchange", 6],
    ["m10-depth", "m10-ratio", 5], ["m10-ratio", "m10-limits", 5], ["m10-wpl", "m10-merge", 9],
    ["m10-wpl", "m10-prefix", 7], ["m10-merge", "m10-prefix", 7], ["m10-merge", "m10-exchange", 7],

    // Cross-chapter prerequisites: notation → the week that spends it
    ["m1-sigma", "m2-shift", 8], ["m1-closed", "m2-triangular", 8], ["m1-closed", "m4-geometric", 7],
    ["m1-closed", "m6-build", 7], ["m1-logs", "m5-heightbound", 7], ["m1-floor", "m4-height", 6],
    ["m1-proof", "m4-induction", 9], ["m1-proof", "m5-inorder", 6], ["m1-prob", "m7-universal", 8],
    ["m1-asym", "m3-growthclass", 8], ["m1-asym", "m6-build", 7], ["m1-loops", "m3-stars", 7],
    ["m1-recur", "m4-lineartime", 6], ["m2-amortised", "m3-twostacks", 8], ["m2-amortised", "m7-rehash", 7],
    ["m2-invariants", "m3-ops", 7], ["m2-index", "m6-index0", 6], ["m3-ops", "m8-dfsforest", 7],
    ["m3-ops", "m8-bfslayers", 7], ["m3-space", "m8-space", 6], ["m4-height", "m5-heightbound", 8],
    ["m4-nodes", "m8-treeedges", 6], ["m4-bottomup", "m5-balance", 8], ["m4-bottomup", "m5-augment", 6],
    ["m4-orders", "m5-inorder", 8], ["m4-geometric", "m6-build", 7], ["m4-induction", "m10-merge", 6],
    ["m6-pqcost", "m9-complexity", 8], ["m7-onepass", "m8-queries", 4], ["m8-bfslayers", "m9-relax", 7],
    ["m8-layerbound", "m9-settle", 5], ["m8-treeedges", "m9-cut", 7], ["m8-queries", "m9-complexity", 6],
    ["m9-cut", "m10-exchange", 8],
  ]
};
