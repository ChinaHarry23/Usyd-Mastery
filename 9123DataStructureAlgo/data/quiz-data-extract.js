// COMP9123 — quiz bank (study + math style), English UI
// Schema: { ch, type, q, opts, answer, exp }
var ALL_QUIZ_DATA = [

  /* Ch1 */
  { ch: 1, type: "study", q: "What does O(f(n)) describe?", opts: ["An upper bound on growth rate (asymptotic)", "Exact step count on your laptop", "Memory in bytes only", "Best-case time only"], answer: 0, exp: "Big-O classifies how runtime or space grows with input size, ignoring constants." },
  { ch: 1, type: "study", q: "Why separate ADT from implementation?", opts: ["Same interface can use different data structures", "ADTs always use less memory", "Implementations are never analysed", "Interfaces remove testing"], answer: 0, exp: "The ADT specifies operations; concrete structures trade off time and space." },
  { ch: 1, type: "math", q: "Typical solution of T(n)=2T(n/2)+Θ(n)?", opts: ["Θ(n log n)", "Θ(n²)", "Θ(log n)", "Θ(1)"], answer: 0, exp: "Balanced divide with linear combine is the Master-theorem style n log n case." },
  { ch: 1, type: "math", q: "Σ_{i=1}^{n} i is:", opts: ["Θ(n²)", "Θ(n)", "Θ(n log n)", "Θ(2^n)"], answer: 0, exp: "Triangular sum grows quadratically." },
  { ch: 1, type: "study", q: "Asymptotic analysis mainly ignores:", opts: ["Constant factors and lower-order terms", "Input size n", "All logarithms", "Worst case"], answer: 0, exp: "Constants and lower-order terms are dropped in big-O style bounds." },

  /* Ch2 */
  { ch: 2, type: "study", q: "Indexed access in a dynamic array (valid index) is typically:", opts: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: 0, exp: "Contiguous memory gives constant-time random access." },
  { ch: 2, type: "study", q: "Amortised append to a doubling array is:", opts: ["O(1) per append over a sequence", "O(n) every time", "O(log n)", "O(1) worst case every single append"], answer: 0, exp: "Expensive resizes are rare enough that average cost is constant." },
  { ch: 2, type: "math", q: "Geometric series Σ 2^{-i} for i≥0 converges to:", opts: ["2", "1", "∞", "0"], answer: 0, exp: "1 + 1/2 + 1/4 + … = 2." },
  { ch: 2, type: "math", q: "1+2+…+n equals:", opts: ["n(n+1)/2", "n²", "n log n", "2^n"], answer: 0, exp: "Closed form for triangular numbers." },
  { ch: 2, type: "study", q: "Singly linked list: insert after a node you already hold is:", opts: ["O(1) pointer updates", "O(n)", "O(log n)", "Impossible"], answer: 0, exp: "Splicing locally does not require scanning from head." },

  /* Ch3 */
  { ch: 3, type: "study", q: "Queue ADT processes elements in:", opts: ["FIFO order", "LIFO order", "Random order", "Sorted order always"], answer: 0, exp: "First-in-first-out is the defining invariant." },
  { ch: 3, type: "study", q: "DFS on a graph commonly uses:", opts: ["A stack (explicit or recursion)", "Only a queue", "A priority queue only", "A heap sort"], answer: 0, exp: "DFS goes deep before wide; recursion uses the call stack." },
  { ch: 3, type: "math", q: "BFS unweighted shortest path uses:", opts: ["Queue", "Stack only", "Deque only", "Sorted list"], answer: 0, exp: "Layer-by-layer exploration." },
  { ch: 3, type: "math", q: "Doubly linked list deletion given node pointer:", opts: ["O(1) with neighbour links", "O(n)", "O(log n)", "O(n²)"], answer: 0, exp: "Rewire prev/next without scanning from head." },
  { ch: 3, type: "study", q: "Stack is:", opts: ["LIFO", "FIFO", "Priority ordered", "Always sorted"], answer: 0, exp: "Last in, first out." },

  /* Ch4 */
  { ch: 4, type: "study", q: "In-order traversal of a BST visits keys in:", opts: ["Sorted order", "Random order", "Postorder of heap", "Level order only"], answer: 0, exp: "BST property + inorder yields sorted sequence." },
  { ch: 4, type: "study", q: "A tree with n nodes has how many edges?", opts: ["n−1", "n", "n+1", "2n"], answer: 0, exp: "Connected acyclic graph on n vertices has n−1 edges." },
  { ch: 4, type: "math", q: "Maximum height skewed binary tree with n nodes can be:", opts: ["Θ(n)", "Θ(log n) always", "Θ(1)", "Θ(n²)"], answer: 0, exp: "A chain achieves linear height." },
  { ch: 4, type: "math", q: "Level-order traversal uses:", opts: ["Queue", "Stack only", "Priority queue", "Union-find"], answer: 0, exp: "Process frontier layer by layer." },
  { ch: 4, type: "study", q: "Binary tree: internal nodes + leaves relationship (full binary tree context) — classic proofs use:", opts: ["Induction on structure", "Only simulation", "Sorting", "Hashing"], answer: 0, exp: "Structural induction is standard for tree claims." },

  /* Ch5 */
  { ch: 5, type: "study", q: "BST search time is O(height); balanced AVL height is:", opts: ["O(log n)", "O(n) always", "O(1)", "O(n²)"], answer: 0, exp: "AVL maintains logarithmic height." },
  { ch: 5, type: "study", q: "AVL rotations fix:", opts: ["Height imbalance while keeping BST order", "Hash collisions", "Graph connectivity", "Heap property"], answer: 0, exp: "Rotations preserve inorder ordering." },
  { ch: 5, type: "math", q: "Unbalanced BST worst-case search:", opts: ["O(n)", "O(log n)", "O(1)", "O(log log n)"], answer: 0, exp: "Skewed chain behaves like a linked list." },
  { ch: 5, type: "math", q: "Single tree rotation preserves:", opts: ["BST key ordering", "Arbitrary heap order", "Graph MST", "Hash bucket size"], answer: 0, exp: "Inorder walk order of keys stays valid." },
  { ch: 5, type: "study", q: "After BST insert, AVL may need to:", opts: ["Rotate along ancestor path", "Rehash table", "Run Dijkstra", "Sort array"], answer: 0, exp: "Fix balance bottom-up." },

  /* Ch6 */
  { ch: 6, type: "study", q: "Binary min-heap supports extract-min in:", opts: ["O(log n)", "O(1) always", "O(n)", "O(n²)"], answer: 0, exp: "Replace root and sift down." },
  { ch: 6, type: "study", q: "Heaps are often stored as:", opts: ["Array level-order", "Linked list only", "Adjacency matrix", "B-tree nodes"], answer: 0, exp: "Complete tree maps to compact array indices." },
  { ch: 6, type: "math", q: "Build-heap (bottom-up) runs in:", opts: ["O(n)", "O(n log n) only", "O(n²)", "O(log n)"], answer: 0, exp: "Linear-time heap construction is standard." },
  { ch: 6, type: "math", q: "Parent index (0-based) often:", opts: ["⌊(i−1)/2⌋", "2i", "i+1", "i/3"], answer: 0, exp: "Standard heap indexing." },
  { ch: 6, type: "study", q: "Priority queue ADT supports:", opts: ["Insert and extract by priority", "Only stack ops", "Only FIFO", "Only sorted array scan"], answer: 0, exp: "Heaps are a common implementation." },

  /* Ch7 */
  { ch: 7, type: "study", q: "Load factor α in chaining table (n items, m buckets) is about:", opts: ["n/m", "m/n", "log n", "n²"], answer: 0, exp: "Average chain length scales with α." },
  { ch: 7, type: "study", q: "Primary clustering is associated with:", opts: ["Linear probing", "Separate chaining only", "Perfect hashing only", "AVL trees"], answer: 0, exp: "Clusters of occupied slots grow under linear probing." },
  { ch: 7, type: "math", q: "Double hashing probe step uses:", opts: ["A second hash function", "Only sorting", "BST rotation", "BFS layers"], answer: 0, exp: "Step size varies per key." },
  { ch: 7, type: "math", q: "Universal hash families help:", opts: ["Reduce expected collisions", "Guarantee O(1) worst case always", "Eliminate memory", "Sort keys"], answer: 0, exp: "Randomised hashing spreads keys in expectation." },
  { ch: 7, type: "study", q: "Deletion in open addressing often uses:", opts: ["Tombstones / lazy delete", "Physical removal without care", "Always rebuild to size 1", "Never allowed"], answer: 0, exp: "Must not break probe sequences of other keys." },

  /* Ch8 */
  { ch: 8, type: "study", q: "Adjacency list space for directed graph:", opts: ["O(V+E)", "O(V²) always", "O(1)", "O(E²)"], answer: 0, exp: "Vertices plus edge records." },
  { ch: 8, type: "study", q: "BFS from s finds in unweighted graphs:", opts: ["Shortest path edge count", "MST weight", "Topological order always", "Strong components"], answer: 0, exp: "Unweighted shortest paths." },
  { ch: 8, type: "math", q: "Undirected graph: Σ deg(v) equals:", opts: ["2|E|", "|E|", "|V|", "|V|²"], answer: 0, exp: "Handshaking lemma." },
  { ch: 8, type: "math", q: "Topological ordering exists iff:", opts: ["Graph is a DAG", "Graph is complete", "Graph is undirected", "Graph has self-loops"], answer: 0, exp: "Cycles forbid a linear order respecting all edges." },
  { ch: 8, type: "study", q: "DFS on directed graph classifies edges into:", opts: ["Tree, back, forward, cross", "Only tree edges", "Only back edges", "MST edges"], answer: 0, exp: "Standard taxonomy for digraph DFS." },

  /* Ch9 */
  { ch: 9, type: "study", q: "Dijkstra requires:", opts: ["Non-negative edge weights (standard)", "Negative cycles", "Unweighted graph only", "Acyclic only"], answer: 0, exp: "Non-negativity makes the greedy relaxation safe." },
  { ch: 9, type: "study", q: "Bellman–Ford handles:", opts: ["Negative edges (no negative cycles reachable)", "Only non-negative weights", "Only unweighted", "Only trees"], answer: 0, exp: "Repeated relaxation up to |V|−1 rounds." },
  { ch: 9, type: "math", q: "Floyd–Warshall time:", opts: ["Θ(V³)", "Θ(V²)", "Θ(E log V)", "Θ(VE)"], answer: 0, exp: "Triple loop over k,i,j." },
  { ch: 9, type: "math", q: "If a negative cycle is reachable, shortest path cost can be:", opts: ["−∞ (undefined finite min)", "Always 0", "Always positive", "log n"], answer: 0, exp: "Can decrease cost indefinitely around the cycle." },
  { ch: 9, type: "study", q: "Dijkstra relaxation processes vertices in order of:", opts: ["Current best distance estimate", "Random", "Reverse topological", "Alphabetical id"], answer: 0, exp: "Greedy by smallest tentative distance." },

  /* Ch10 */
  { ch: 10, type: "study", q: "Greedy correctness usually needs:", opts: ["A proof (often exchange argument)", "Random choices", "Exhaustive search", "Dynamic programming always"], answer: 0, exp: "Greedy is not automatically optimal." },
  { ch: 10, type: "study", q: "Activity selection greedy picks by:", opts: ["Earliest finishing time", "Longest duration", "Random", "Largest weight only"], answer: 0, exp: "Leaves maximum room for later activities." },
  { ch: 10, type: "math", q: "Fractional knapsack greedy by value/weight is:", opts: ["Optimal", "Never optimal", "NP-hard", "Only for 0/1 knapsack"], answer: 0, exp: "Take fractions of best ratio items." },
  { ch: 10, type: "math", q: "0/1 knapsack greedy by ratio:", opts: ["Not always optimal", "Always optimal", "Solves in O(n)", "Same as fractional"], answer: 0, exp: "Discrete choices break simple greedy." },
  { ch: 10, type: "study", q: "Huffman coding merges:", opts: ["Two smallest frequency subtrees repeatedly", "Random pairs", "All leaves at once", "Largest first"], answer: 0, exp: "Build optimal prefix code bottom-up." },
];
