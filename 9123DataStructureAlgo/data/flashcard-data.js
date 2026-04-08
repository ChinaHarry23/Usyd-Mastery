/**
 * COMP9123 flashcards — schema { ch, front, back }
 */
var FLASHCARD_DECK_VERSION = "comp9123-1";
var ALL_FLASHCARD_DATA = [
  { ch: 1, front: "What is Big-O?", back: "An asymptotic upper bound: f(n) is O(g(n)) if beyond some n0, f is bounded above by a constant times g(n)." },
  { ch: 1, front: "ADT vs implementation", back: "An ADT defines operations and semantics; implementations choose data structures to meet time/space bounds." },
  { ch: 1, front: "Θ notation", back: "Tight bound: same growth up to constants — both upper and lower." },
  { ch: 1, front: "Why amortised analysis?", back: "Average cost per operation over a sequence when some operations are occasionally expensive." },

  { ch: 2, front: "Dynamic array doubling", back: "When full, allocate ~2× capacity and copy; occasional O(n) resize amortises to O(1) append." },
  { ch: 2, front: "Singly vs doubly linked list", back: "Singly uses less memory; doubly allows O(1) delete given a node with predecessor link." },
  { ch: 2, front: "Triangular sum", back: "1+2+…+n = n(n+1)/2 = Θ(n²)." },
  { ch: 2, front: "Array vs linked list access", back: "Arrays: O(1) index access. Linked lists: O(n) to reach index without extra structure." },

  { ch: 3, front: "Stack operations", back: "push, pop — LIFO at one end." },
  { ch: 3, front: "Queue operations", back: "enqueue at rear, dequeue at front — FIFO." },
  { ch: 3, front: "DFS vs BFS", back: "DFS deep first (stack); BFS layer by layer (queue)." },
  { ch: 3, front: "Deque", back: "Double-ended queue: insert/delete at both ends." },

  { ch: 4, front: "Binary tree height", back: "Length of longest root-to-leaf path; skewed tree can be Θ(n)." },
  { ch: 4, front: "BST search", back: "Compare with root, recurse left/right — O(height)." },
  { ch: 4, front: "Tree edges formula", back: "Connected tree on n nodes has exactly n−1 edges." },
  { ch: 4, front: "Preorder traversal", back: "Visit root, then left subtree, then right subtree." },

  { ch: 5, front: "AVL balance factor", back: "Height difference between left and right child at most 1." },
  { ch: 5, front: "Tree rotation purpose", back: "Restructure while preserving BST ordering to restore balance." },
  { ch: 5, front: "BST worst case", back: "Height can be Θ(n) if keys insert in sorted order without balancing." },
  { ch: 5, front: "AVL height bound", back: "O(log n) nodes for n-node AVL tree." },

  { ch: 6, front: "Heap property (min-heap)", back: "Parent key ≤ children keys (for typical numeric keys)." },
  { ch: 6, front: "Heapify-down", back: "After replacing root, compare with children and swap with smaller until heap order holds — O(log n)." },
  { ch: 6, front: "Priority queue", back: "ADT supporting insert and extract-min (or max) efficiently — heaps are common." },
  { ch: 6, front: "Heapsort idea", back: "Build max-heap, repeatedly extract max to end, shrink heap — O(n log n)." },

  { ch: 7, front: "Hash table load", back: "α = n/m items per bucket on average for chaining." },
  { ch: 7, front: "Separate chaining", back: "Each bucket is a list; collisions go in the same bucket." },
  { ch: 7, front: "Open addressing", back: "All entries in table; collisions probe alternative slots." },
  { ch: 7, front: "Universal hashing", back: "Family of hash functions where collision probability is bounded for distinct keys." },

  { ch: 8, front: "Adjacency matrix", back: "V×V matrix; O(1) edge test but O(V²) space — good dense, poor sparse." },
  { ch: 8, front: "Graph DFS colours (CLRS)", back: "White unvisited, grey discovered, black finished." },
  { ch: 8, front: "Connected component", back: "Maximal connected subgraph; undirected graphs partition into components." },
  { ch: 8, front: "DAG", back: "Directed acyclic graph — admits topological sort." },

  { ch: 9, front: "Dijkstra greedy step", back: "Pick unsettled vertex with smallest tentative distance; relax neighbours." },
  { ch: 9, front: "Relaxation", back: "If d[v] > d[u] + w(u,v), improve d[v]." },
  { ch: 9, front: "Bellman–Ford rounds", back: "Up to |V|−1 passes over all edges; detect negative cycle with extra pass." },
  { ch: 9, front: "All-pairs shortest paths", back: "Floyd–Warshall dynamic programming over intermediate vertices — Θ(V³)." },

  { ch: 10, front: "Greedy vs DP", back: "Greedy commits locally; DP considers overlapping subproblems and optimal substructure with choices." },
  { ch: 10, front: "Exchange argument", back: "Show any optimal solution can be transformed to match greedy without worsening cost." },
  { ch: 10, front: "Huffman optimality", back: "Merging two least frequent subtrees is safe for prefix-free codes." },
  { ch: 10, front: "Matroid greedy", back: "On matroids, greedy finds maximum-weight independent set — unifies some problems." },
];
