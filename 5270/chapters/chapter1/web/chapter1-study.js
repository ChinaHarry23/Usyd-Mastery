(function () {
  "use strict";
  var renderMath = window.chapterRenderMath || function () {};

  // ========== CARD DECK SIMULATION ==========
  const suits = ["s", "h", "d", "c"];
  const suitSymbols = { s: "\u2660", h: "\u2665", d: "\u2666", c: "\u2663" };
  const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  function makeDeck() {
    const deck = [];
    for (const s of suits) for (const r of ranks) deck.push({ rank: r, suit: s });
    return deck;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function countPairs(deck) {
    let count = 0;
    for (let i = 0; i < deck.length - 1; i++) {
      if (deck[i].suit === deck[i + 1].suit) count++;
    }
    return count;
  }

  let simTrials = 0;
  let simSum = 0;
  const histogram = {};

  function displayDeck(deck) {
    const container = document.getElementById("deckDisplay");
    container.innerHTML = "";
    const pairs = [];
    for (let i = 0; i < deck.length - 1; i++) {
      if (deck[i].suit === deck[i + 1].suit) {
        pairs.push(i);
        pairs.push(i + 1);
      }
    }
    deck.forEach((c, i) => {
      const chip = document.createElement("span");
      chip.className = "card-chip suit-" + c.suit;
      if (pairs.includes(i)) chip.classList.add("pair-match");
      chip.textContent = c.rank + suitSymbols[c.suit];
      container.appendChild(chip);
    });
  }

  function updateSimStats(pairsThisTrial) {
    document.getElementById("statPairs").textContent = pairsThisTrial;
    document.getElementById("statTrials").textContent = simTrials;
    document.getElementById("statMean").textContent = (
      simSum / simTrials
    ).toFixed(3);
  }

  function drawHistogram() {
    const canvas = document.getElementById("histCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    ctx.clearRect(0, 0, W, H);

    const keys = Object.keys(histogram)
      .map(Number)
      .sort((a, b) => a - b);
    if (keys.length === 0) return;
    const minK = Math.min(...keys);
    const maxK = Math.max(...keys);
    const range = maxK - minK + 1;
    const maxVal = Math.max(...Object.values(histogram));

    const pad = { l: 40, r: 10, t: 10, b: 30 };
    const plotW = W - pad.l - pad.r;
    const plotH = H - pad.t - pad.b;
    const barW = Math.max(2, plotW / range - 2);

    ctx.fillStyle = "#9299ac";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";

    for (let k = minK; k <= maxK; k++) {
      const val = histogram[k] || 0;
      const x = pad.l + ((k - minK) / range) * plotW + barW / 2;
      const h = (val / maxVal) * plotH;
      ctx.fillStyle = k === 12 ? "rgba(108,140,255,0.7)" : "rgba(108,140,255,0.35)";
      ctx.fillRect(x - barW / 2, pad.t + plotH - h, barW, h);
      if (range <= 30 || k % 2 === 0) {
        ctx.fillStyle = "#6b7280";
        ctx.fillText(k, x, H - 8);
      }
    }

    const meanX =
      pad.l + ((simSum / simTrials - minK) / range) * plotW + barW / 2;
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(meanX, pad.t);
    ctx.lineTo(meanX, pad.t + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#f87171";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("mean", meanX, pad.t + plotH + 16);
  }

  function runOneTrial(showDeck) {
    const deck = shuffle(makeDeck());
    const p = countPairs(deck);
    simTrials++;
    simSum += p;
    histogram[p] = (histogram[p] || 0) + 1;
    if (showDeck) displayDeck(deck);
    return p;
  }

  document.getElementById("btnShuffle").addEventListener("click", () => {
    const p = runOneTrial(true);
    updateSimStats(p);
    drawHistogram();
  });

  document.getElementById("btnRun1000").addEventListener("click", () => {
    let lastP = 0;
    for (let i = 0; i < 1000; i++) lastP = runOneTrial(false);
    updateSimStats(lastP);
    drawHistogram();
  });

  document.getElementById("btnResetSim").addEventListener("click", () => {
    simTrials = 0;
    simSum = 0;
    for (const k in histogram) delete histogram[k];
    document.getElementById("deckDisplay").innerHTML = "";
    document.getElementById("statPairs").textContent = "-";
    document.getElementById("statTrials").textContent = "0";
    document.getElementById("statMean").textContent = "-";
    const canvas = document.getElementById("histCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // ========== QUICKSORT VISUALIZER ==========
  let sortArray = [];
  let sortSteps = [];
  let sortStepIdx = 0;
  let sortComps = 0;
  let sortDepthMax = 0;
  let autoSortInterval = null;

  function generateArray(n) {
    const arr = [];
    for (let i = 1; i <= n; i++) arr.push(i);
    return shuffle(arr);
  }

  function renderSortViz(arr, highlights) {
    const viz = document.getElementById("sortViz");
    viz.innerHTML = "";
    const maxVal = Math.max(...arr);
    arr.forEach((v, i) => {
      const bar = document.createElement("div");
      bar.className = "sort-bar";
      bar.style.height = (v / maxVal) * 160 + "px";
      if (highlights && highlights.pivot === i)
        bar.style.background = "var(--red)";
      else if (highlights && highlights.left && highlights.left.includes(i))
        bar.style.background = "var(--blue)";
      else if (highlights && highlights.right && highlights.right.includes(i))
        bar.style.background = "var(--green)";
      else if (highlights && highlights.sorted && highlights.sorted.includes(i))
        bar.style.background = "var(--accent)";
      else bar.style.background = "rgba(108,140,255,0.3)";
      viz.appendChild(bar);
    });
  }

  function recordQuickSort(arr, lo, hi, depth, steps) {
    if (lo >= hi) {
      if (lo === hi)
        steps.push({
          arr: [...arr],
          highlights: { sorted: [lo] },
          comps: sortComps,
          depth,
        });
      return;
    }
    const pivotIdx = lo + Math.floor(Math.random() * (hi - lo + 1));
    [arr[pivotIdx], arr[hi]] = [arr[hi], arr[pivotIdx]];
    const pivot = arr[hi];
    let left = [];
    let right = [];
    for (let j = lo; j < hi; j++) {
      sortComps++;
      if (arr[j] <= pivot) left.push(j);
      else right.push(j);
    }

    steps.push({
      arr: [...arr],
      highlights: { pivot: hi, left, right },
      comps: sortComps,
      depth,
    });

    let storeIdx = lo;
    for (let j = lo; j < hi; j++) {
      if (arr[j] <= pivot) {
        [arr[storeIdx], arr[j]] = [arr[j], arr[storeIdx]];
        storeIdx++;
      }
    }
    [arr[storeIdx], arr[hi]] = [arr[hi], arr[storeIdx]];

    steps.push({ arr: [...arr], highlights: { pivot: storeIdx }, comps: sortComps, depth });

    if (depth > sortDepthMax) sortDepthMax = depth;

    recordQuickSort(arr, lo, storeIdx - 1, depth + 1, steps);
    recordQuickSort(arr, storeIdx + 1, hi, depth + 1, steps);
  }

  function initSort() {
    if (autoSortInterval) {
      clearInterval(autoSortInterval);
      autoSortInterval = null;
    }
    sortArray = generateArray(40);
    sortSteps = [];
    sortStepIdx = 0;
    sortComps = 0;
    sortDepthMax = 0;
    const arrCopy = [...sortArray];
    recordQuickSort(arrCopy, 0, arrCopy.length - 1, 0, sortSteps);
    sortSteps.push({
      arr: arrCopy,
      highlights: { sorted: arrCopy.map((_, i) => i) },
      comps: sortComps,
      depth: sortDepthMax,
    });
    sortStepIdx = 0;
    sortComps = 0;
    sortDepthMax = 0;
    renderSortViz(sortArray, {});
    document.getElementById("sortComparisons").textContent = "0";
    document.getElementById("sortDepth").textContent = "0";
  }

  function stepSort() {
    if (sortStepIdx >= sortSteps.length) return;
    const s = sortSteps[sortStepIdx];
    renderSortViz(s.arr, s.highlights);
    document.getElementById("sortComparisons").textContent = s.comps;
    document.getElementById("sortDepth").textContent = s.depth;
    sortStepIdx++;
  }

  document.getElementById("btnNewArray").addEventListener("click", initSort);
  document.getElementById("btnStepSort").addEventListener("click", stepSort);
  document.getElementById("btnAutoSort").addEventListener("click", () => {
    if (autoSortInterval) {
      clearInterval(autoSortInterval);
      autoSortInterval = null;
      return;
    }
    autoSortInterval = setInterval(() => {
      if (sortStepIdx >= sortSteps.length) {
        clearInterval(autoSortInterval);
        autoSortInterval = null;
        return;
      }
      stepSort();
    }, 200);
  });

  initSort();
})();
