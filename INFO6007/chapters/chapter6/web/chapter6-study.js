(function () {
  "use strict";

  /* INFO6007 — Week 6 page behaviour.
   *
   * The declarative widgets (sequence, pipeline, timeline, hotspot, matcher,
   * deck, race) are mounted by shared/interactive.js from the JSON config
   * blocks in the page. This file owns the three animated canvas steppers and
   * the re-binding that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initHistogramStepper();
    initCriticalPathStepper();
    initEvmStepper();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every widget and
   * every quick-check inside a translated section is a brand-new node. Re-mount
   * the widgets and re-run the chrome bindings; the sidebar toggle lives outside
   * any section, so its old listener is dropped first to avoid double-binding. */
  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    initHistogramStepper();
    initCriticalPathStepper();
    initEvmStepper();
    rebindChrome();
  });

  var lastChromeLang = null;

  function currentLang() {
    return typeof window.getLang === "function" ? window.getLang() : "en";
  }

  function rebindChrome() {
    var lang = currentLang();
    if (lang === lastChromeLang) return;
    lastChromeLang = lang;

    var toggle = document.getElementById("sidebarToggle");
    if (toggle && toggle.parentNode) {
      var fresh = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(fresh, toggle);
    }
    initChrome();
  }

  function initChrome() {
    if (!window.initINFO6007ChapterUI) return;
    try {
      window.initINFO6007ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[INFO6007 chapter 6] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared canvas helpers ──────────────────────────────────── */

  var INK = "#141826";
  var MUTED = "#565d75";
  var DIM = "#8b90a6";
  var ACCENT = "#7c3aed";
  var ACCENT_SOFT = "#c4b5fd";
  var BLUE = "#2563eb";
  var GREEN = "#059669";
  var RED = "#dc2626";
  var AMBER = "#f59e0b";
  var GRID = "#e5e7eb";

  function polyline(ctx, points, color, lw, dash) {
    if (!points.length) return;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw || 2;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.stroke();
    ctx.restore();
  }

  /* ── Stepper 1: resource histogram and levelling ────────────── */

  var WEEKS = ["6", "7", "8", "9", "10"];

  function histogramGeometry(w, h, withGantt) {
    return {
      x0: 78,
      x1: w - 30,
      colWidth: (w - 108) / WEEKS.length,
      base: h - 46,
      barMax: withGantt ? 92 : 150,
      cap: 2,
      scaleMax: 4
    };
  }

  function drawHistogramFrame(ctx, w, h, k, opts) {
    k.clear("#fdfcff");
    var g = histogramGeometry(w, h, !!opts.gantt);
    var bottom = g.base;
    var top = bottom - g.barMax;

    k.label(g.x0, top - 26, opts.leftTitle || "QA testers demanded per week", {
      size: 12,
      color: MUTED,
      weight: "600"
    });

    /* capacity grid line */
    var capY = bottom - (g.cap / g.scaleMax) * g.barMax;
    polyline(
      ctx,
      [
        [g.x0, capY],
        [g.x1, capY]
      ],
      GREEN,
      1.6,
      [6, 5]
    );
    k.label(g.x1, capY - 12, "capacity = 2 testers", { size: 11, color: GREEN, align: "right" });

    /* y axis */
    polyline(
      ctx,
      [
        [g.x0, top],
        [g.x0, bottom]
      ],
      DIM,
      1.4
    );
    polyline(
      ctx,
      [
        [g.x0, bottom],
        [g.x1, bottom]
      ],
      DIM,
      1.4
    );
    k.label(g.x0 - 12, bottom, "0", { size: 11, color: DIM, align: "right" });
    k.label(g.x0 - 12, bottom - (2 / g.scaleMax) * g.barMax, "2", { size: 11, color: DIM, align: "right" });
    k.label(g.x0 - 12, top, "4", { size: 11, color: DIM, align: "right" });

    /* Gantt rows when the frame talks about the schedule */
    if (opts.gantt) {
      var rows = [
        { name: "T1 module testing", from: 0, to: 2 },
        { name: "T2 regression", from: opts.t2From, to: opts.t2From + 2 },
        { name: "T3 UAT support", from: 2, to: 3 }
      ];
      rows.forEach(function (row, i) {
        var y = 40 + i * 22;
        k.label(g.x0 - 12, y + 8, row.name, { size: 10.5, color: MUTED, align: "right" });
        var bx = g.x0 + row.from * g.colWidth + 4;
        var bw = (row.to - row.from) * g.colWidth - 8;
        var c = row.name.indexOf("T2") === 0 ? (opts.t2Moved ? ACCENT : RED) : BLUE;
        k.box(bx, y, bw, 16, { fill: c + "22", stroke: c, lw: 1.6, r: 5 });
        k.label(bx + 6, y + 8, row.name.split(" ")[0], { size: 10, color: c, mono: true });
      });
    }

    /* bars */
    opts.demand.forEach(function (v, i) {
      var bx = g.x0 + i * g.colWidth + g.colWidth * 0.22;
      var bw = g.colWidth * 0.56;
      var bh = (v / g.scaleMax) * g.barMax;
      var over = v > g.cap;
      var fill = over ? RED : v === g.cap ? ACCENT : v === 0 ? GRID : ACCENT_SOFT;
      k.box(bx, bottom - bh, bw, bh, { fill: fill, stroke: over ? RED : ACCENT, lw: 1.6, r: 5 });
      k.label(bx + bw / 2, bottom - bh - 12, String(v), {
        size: 12,
        weight: "700",
        align: "center",
        color: over ? RED : INK
      });
      k.label(bx + bw / 2, bottom + 16, "wk " + WEEKS[i], { size: 11, color: MUTED, align: "center" });
      if (over) k.highlight(bx - 4, bottom - bh - 4, bw + 8, bh + 8, { color: RED, lw: 2, dash: [5, 4] });
    });

    if (opts.note) k.label(g.x0, h - 12, opts.note, { size: 11.5, color: opts.noteColor || MUTED });
  }

  function initHistogramStepper() {
    var host = document.getElementById("ix-histogram");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-histogram", {
      title: "Resource histogram: the peak is what breaks the plan",
      subtitle: "QA tester demand for weeks 6–10 of the mobile release, levelled two different ways.",
      titleZh: "资源直方图：压垮计划的是峰值",
      subtitleZh: "移动应用发布项目第 6–10 周的测试人员需求，以及两种资源平衡方式。",
      height: 320,
      frames: [
        {
          title: "The unlevelled histogram",
          caption:
            "All three test activities at their earliest start. Demand is 4 testers in week 7 against a capacity of 2 — the plan is infeasible as written.",
          titleZh: "未平衡的直方图",
          captionZh:
            "三项测试活动都按最早开始时间排布。第 7 周需求为 4 名测试人员，而产能只有 2 名——按此计划根本不可行。",
          draw: function (ctx, w, h, k) {
            drawHistogramFrame(ctx, w, h, k, {
              demand: [2, 4, 3, 0, 0],
              note: "Bars above the capacity line are over-allocation (U > 1)."
            });
          }
        },
        {
          title: "Read the peak, not the average",
          caption:
            "Average utilisation is 9 tester-weeks ÷ 10 tester-weeks = 90%, and the peak is 4 ÷ 2 = 200%. A comfortable average with an impossible peak is the normal shape of a resource problem.",
          titleZh: "要看峰值，不要看平均值",
          captionZh:
            "平均利用率为 9 个测试人周 ÷ 10 个测试人周 = 90%，而峰值是 4 ÷ 2 = 200%。平均值宽裕、峰值不可能，正是资源问题的典型形态。",
          draw: function (ctx, w, h, k) {
            drawHistogramFrame(ctx, w, h, k, {
              demand: [2, 4, 3, 0, 0],
              note: "U avg = 0.90   •   U max = 2.00   •   feasibility is decided by U max",
              noteColor: RED
            });
          }
        },
        {
          title: "Delay the activity with float",
          caption:
            "T2 has two weeks of float and no successor other than the integration test, so it moves to weeks 9–10. The peak falls to 100% and the finish date does not move.",
          titleZh: "推迟有浮时的活动",
          captionZh:
            "T2 拥有两周浮时，除集成测试外没有其他紧后活动，因此被移到第 9–10 周。峰值降到 100%，完成日期不变。",
          draw: function (ctx, w, h, k) {
            drawHistogramFrame(ctx, w, h, k, {
              demand: [2, 2, 1, 2, 2],
              gantt: true,
              t2From: 3,
              t2Moved: true,
              note: "Delay consumed both weeks of float: the levelled plan has no buffer left on that path.",
              noteColor: AMBER
            });
          }
        },
        {
          title: "Or split it into two windows",
          caption:
            "Splitting T2 into one week in period 9 and one in period 10 gives the same flat profile. It preserves the option to start earlier, but pays for a second test-environment set-up.",
          titleZh: "或者拆分成两个时间窗",
          captionZh:
            "把 T2 拆成第 9 周和第 10 周各一周，可得到同样平坦的需求曲线。它保留了提前开始的可能，但要多付一次测试环境的搭建成本。",
          draw: function (ctx, w, h, k) {
            drawHistogramFrame(ctx, w, h, k, {
              demand: [2, 2, 1, 2, 2],
              gantt: true,
              t2From: 3,
              t2Moved: true,
              note: "Same peak, different cost: split tasks trade set-up effort for flexibility.",
              noteColor: BLUE
            });
          }
        },
        {
          title: "Price the alternatives",
          caption:
            "Paying the peak instead: two tester-weeks of overtime at an illustrative $80/hour and a 38-hour week costs 2 × $3,040 × 0.5 = $3,040 in premium, plus the burnout risk. Float is the cheaper currency.",
          titleZh: "为各种方案定价",
          captionZh:
            "若改为用加班顶住峰值：按示意性的每小时 80 澳元、每周 38 小时计算，两个测试人周的加班溢价为 2 × 3,040 × 0.5 = 3,040 澳元，此外还有倦怠风险。浮时是更便宜的货币。",
          draw: function (ctx, w, h, k) {
            k.clear("#fdfcff");
            var g = histogramGeometry(w, h, false);
            var items = [
              { label: "Delay within float", cost: 0, note: "costs 2 weeks of float", color: GREEN },
              { label: "Split the task", cost: 1, note: "second set-up + baseline risk", color: BLUE },
              { label: "Reassign to another tester", cost: 2, note: "ramp-up; there is no spare tester", color: AMBER },
              { label: "Overtime for the peak week", cost: 3, note: "≈ $3,040 premium + burnout", color: RED }
            ];
            k.label(g.x0, 34, "Levelling techniques, cheapest first", { size: 12.5, color: MUTED, weight: "600" });
            items.forEach(function (item, i) {
              var y = 60 + i * 52;
              var bw = (w - 200) * ((4 - item.cost) / 4);
              k.box(g.x0, y, Math.max(60, bw), 26, { fill: item.color + "1f", stroke: item.color, lw: 1.6, r: 6 });
              k.label(g.x0 + 12, y + 13, item.label, { size: 12, color: INK });
              k.label(g.x0, y + 38, item.note, { size: 11, color: MUTED });
            });
            k.label(
              g.x0,
              h - 14,
              "Every technique costs something: choose the one whose cost lands on the activity with the most float.",
              {
                size: 11.5,
                color: MUTED
              }
            );
          }
        }
      ]
    });
  }

  /* ── Stepper 2: critical path and where levelling is allowed ── */

  var NETWORK = [
    { id: "A", es: 0, ef: 2, ls: 0, lf: 2 },
    { id: "B", es: 2, ef: 5, ls: 2, lf: 5 },
    { id: "C", es: 2, ef: 6, ls: 6, lf: 10 },
    { id: "D", es: 5, ef: 10, ls: 5, lf: 10 },
    { id: "T1", es: 5, ef: 7, ls: 7, lf: 9 },
    { id: "T2", es: 6, ef: 8, ls: 8, lf: 10 },
    { id: "T3", es: 7, ef: 8, ls: 9, lf: 10 },
    { id: "E", es: 10, ef: 13, ls: 10, lf: 13 },
    { id: "F", es: 13, ef: 14, ls: 13, lf: 14 }
  ];

  var LINKS = [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
    ["B", "T1"],
    ["C", "T2"],
    ["T1", "T3"],
    ["D", "E"],
    ["T2", "E"],
    ["T3", "E"],
    ["E", "F"]
  ];

  function networkGeometry(w, h) {
    return {
      x0: 74,
      span: w - 110,
      rowTop: 44,
      rowGap: (h - 96) / NETWORK.length,
      barH: Math.min(18, (h - 96) / NETWORK.length - 6),
      total: 14
    };
  }

  function netX(g, week) {
    return g.x0 + (week / g.total) * g.span;
  }

  function netRowY(g, id) {
    for (var i = 0; i < NETWORK.length; i++) {
      if (NETWORK[i].id === id) return g.rowTop + i * g.rowGap;
    }
    return g.rowTop;
  }

  function drawNetworkFrame(ctx, w, h, k, opts) {
    k.clear("#fdfcff");
    var g = networkGeometry(w, h);

    /* week grid */
    for (var wk = 0; wk <= g.total; wk += 2) {
      polyline(
        ctx,
        [
          [netX(g, wk), g.rowTop - 12],
          [netX(g, wk), h - 40]
        ],
        GRID,
        1
      );
      k.label(netX(g, wk), h - 26, String(wk), { size: 10.5, color: DIM, align: "center" });
    }
    k.label(g.x0 - 34, h - 26, "week", { size: 10.5, color: DIM, align: "left" });

    /* dependency arrows behind the bars */
    if (opts.links) {
      LINKS.forEach(function (link) {
        var a = null;
        var b = null;
        NETWORK.forEach(function (n) {
          if (n.id === link[0]) a = n;
          if (n.id === link[1]) b = n;
        });
        if (!a || !b) return;
        var y1 = netRowY(g, a.id) + g.barH;
        var y2 = netRowY(g, b.id);
        var x1 = netX(g, a.ef);
        var x2 = netX(g, b.es);
        k.arrow(x1, y1, x2, y2, { color: "rgba(148,163,184,0.55)", lw: 1.1, dash: [3, 4] });
      });
    }

    /* rows: float extension, then the early bar */
    NETWORK.forEach(function (n) {
      var y = netRowY(g, n.id);
      var critical = n.ls === n.es;
      var movable = opts.markMovable && !critical;
      var colour = critical ? ACCENT : movable ? AMBER : DIM;

      k.label(g.x0 - 14, y + g.barH / 2, n.id, {
        size: 11.5,
        mono: true,
        align: "right",
        color: colour,
        weight: "700"
      });

      if (n.lf > n.ef) {
        var fx = netX(g, n.ef);
        var fw = netX(g, n.lf) - fx;
        k.box(fx, y, fw, g.barH, { fill: "rgba(245,158,11,0.16)", stroke: AMBER, lw: 1.2, r: 5 });
        k.label(fx + fw / 2, y + g.barH / 2, "float " + (n.lf - n.ef), {
          size: 9.5,
          color: "#92400e",
          align: "center"
        });
      }

      k.box(netX(g, n.es), y, netX(g, n.ef) - netX(g, n.es), g.barH, {
        fill: critical ? "rgba(124,58,237,0.22)" : "rgba(148,163,184,0.22)",
        stroke: colour,
        lw: critical ? 2 : 1.4,
        r: 5
      });
      k.label(netX(g, n.es) + 6, y + g.barH / 2, opts.labelEarly ? "ES " + n.es + " → EF " + n.ef : "", {
        size: 9.5,
        color: critical ? "#4c1d95" : MUTED
      });
    });

    if (opts.note) k.label(g.x0 - 34, h - 8, opts.note, { size: 11.5, color: opts.noteColor || MUTED });
  }

  function initCriticalPathStepper() {
    var host = document.getElementById("ix-critical-path");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-critical-path", {
      title: "Critical path, float and what levelling may move",
      subtitle: "The same mobile release on a time axis: 14 weeks, five critical activities and four with float.",
      titleZh: "关键路径、浮时，以及资源平衡可以移动什么",
      subtitleZh: "同一条移动应用发布计划的时间轴：总工期 14 周，5 项关键活动，4 项带有浮时。",
      height: 340,
      frames: [
        {
          title: "Forward pass: earliest start and finish",
          caption:
            "ES = max EF of predecessors. D ends at week 10 and C at week 6, so integration testing cannot start before week 10 — that max is what creates C's float. Duration T = 14 weeks.",
          titleZh: "正向计算：最早开始与最早完成",
          captionZh:
            "ES = 紧前活动 EF 的最大值。D 在第 10 周结束、C 在第 6 周结束，因此集成测试最早只能在第 10 周开始——正是这个最大值造成了 C 的浮时。总工期 T = 14 周。",
          draw: function (ctx, w, h, k) {
            drawNetworkFrame(ctx, w, h, k, {
              labelEarly: true,
              note: "T = max EF = 14 weeks"
            });
          }
        },
        {
          title: "Backward pass: latest start and finish",
          caption:
            "LF = min LS of successors, LS = LF − duration. A floating activity's latest finish sits to the right of its earliest finish, and the gap is its total float.",
          titleZh: "反向计算：最晚开始与最晚完成",
          captionZh:
            "LF = 紧后活动 LS 的最小值，LS = LF − 工期。有浮时的活动，其最晚完成位于最早完成右侧，这段间隔就是总浮时。",
          draw: function (ctx, w, h, k) {
            drawNetworkFrame(ctx, w, h, k, {
              links: true,
              note: "Amber blocks are float: LS − ES = LF − EF"
            });
          }
        },
        {
          title: "Critical path: zero float from start to finish",
          caption:
            "A → B → D → E → F has float 0 on every activity. Delay any of them by a week and the project finishes a week later: there is nothing to absorb it.",
          titleZh: "关键路径：从开始到结束浮时为零",
          captionZh:
            "A → B → D → E → F 上每项活动的浮时都是 0。其中任何一项推迟一周，项目就晚一周完成：没有任何缓冲可以吸收。",
          draw: function (ctx, w, h, k) {
            drawNetworkFrame(ctx, w, h, k, {
              links: true,
              note: "Critical path A → B → D → E → F   •   duration 14 weeks",
              noteColor: ACCENT
            });
          }
        },
        {
          title: "Where resource levelling is allowed to work",
          caption:
            "Only C (4 weeks), T1, T2 and T3 (2 weeks each) can be delayed without moving the end date. Everything else has to be split, reassigned or re-planned.",
          titleZh: "资源平衡可以动手的地方",
          captionZh:
            "只有 C（4 周）以及 T1、T2、T3（各 2 周）可以在不推迟完工日期的前提下延后。其余活动只能拆分、改派或重新规划。",
          draw: function (ctx, w, h, k) {
            drawNetworkFrame(ctx, w, h, k, {
              links: true,
              markMovable: true,
              note: "Amber = movable within float   •   Purple = protect at all costs",
              noteColor: AMBER
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: resource cost performance (PV / EV / AC) ────── */

  var PV_SERIES = [6, 14, 24, 34, 43, 52, 61, 70, 79, 88, 95, 100];
  var EV_SERIES = [5, 12, 21, 30, 38, 44];
  var AC_SERIES = [7, 16, 27, 39, 49, 58];

  function evmGeometry(w, h) {
    return {
      x0: 74,
      x1: w - 30,
      yTop: 46,
      yBase: h - 52,
      yMax: 140,
      weeks: 12
    };
  }

  function evmX(g, week) {
    return g.x0 + ((week - 1) / (g.weeks - 1)) * (g.x1 - g.x0);
  }

  function evmY(g, cost) {
    return g.yBase - (cost / g.yMax) * (g.yBase - g.yTop);
  }

  function evmPoints(g, series) {
    return series.map(function (v, i) {
      return [evmX(g, i + 1), evmY(g, v)];
    });
  }

  function drawEvmFrame(ctx, w, h, k, opts) {
    k.clear("#fdfcff");
    var g = evmGeometry(w, h);

    /* axes and gridlines */
    [0, 35, 70, 105, 140].forEach(function (cost) {
      polyline(
        ctx,
        [
          [g.x0, evmY(g, cost)],
          [g.x1, evmY(g, cost)]
        ],
        GRID,
        1
      );
      k.label(g.x0 - 10, evmY(g, cost), "$" + cost + "k", { size: 10.5, color: DIM, align: "right" });
    });
    polyline(
      ctx,
      [
        [g.x0, g.yTop - 6],
        [g.x0, g.yBase]
      ],
      DIM,
      1.4
    );
    polyline(
      ctx,
      [
        [g.x0, g.yBase],
        [g.x1, g.yBase]
      ],
      DIM,
      1.4
    );
    for (var wk = 1; wk <= g.weeks; wk++) {
      k.label(evmX(g, wk), g.yBase + 16, String(wk), { size: 10.5, color: DIM, align: "center" });
    }
    k.label((g.x0 + g.x1) / 2, h - 14, "project week", { size: 11, color: MUTED, align: "center" });

    /* BAC line */
    polyline(
      ctx,
      [
        [g.x0, evmY(g, 100)],
        [g.x1, evmY(g, 100)]
      ],
      DIM,
      1.4,
      [6, 5]
    );
    k.label(g.x1, evmY(g, 100) - 12, "BAC $100k", { size: 10.5, color: MUTED, align: "right" });

    /* PV curve */
    polyline(
      ctx,
      evmPoints(g, PV_SERIES),
      opts.pvOnly ? ACCENT : DIM,
      opts.pvOnly ? 2.6 : 2,
      opts.pvOnly ? null : [7, 5]
    );
    k.label(evmX(g, 12), evmY(g, 100) - 26, "PV", {
      size: 11.5,
      color: opts.pvOnly ? ACCENT : DIM,
      align: "right",
      weight: "700"
    });

    /* EV and AC */
    if (opts.showEv) {
      polyline(ctx, evmPoints(g, EV_SERIES), GREEN, 2.6);
      k.dot(evmX(g, 6), evmY(g, 44), 5, { fill: GREEN, stroke: "#ffffff", lw: 1.6 });
      k.label(evmX(g, 6) - 6, evmY(g, 44) + 18, "EV $44k at week 6", { size: 11, color: GREEN, align: "right" });
    }
    if (opts.showAc) {
      polyline(ctx, evmPoints(g, AC_SERIES), RED, 2.6);
      k.dot(evmX(g, 6), evmY(g, 58), 5, { fill: RED, stroke: "#ffffff", lw: 1.6 });
      k.label(evmX(g, 6) - 6, evmY(g, 58) - 16, "AC $58k", { size: 11, color: RED, align: "right" });
    }
    if (opts.showPvMark) {
      k.dot(evmX(g, 6), evmY(g, 52), 5, { fill: ACCENT, stroke: "#ffffff", lw: 1.6 });
      k.label(evmX(g, 6) + 8, evmY(g, 52) - 14, "PV $52k", { size: 11, color: ACCENT });
    }

    /* variance brackets at week 6 */
    if (opts.showVariances) {
      var x6 = evmX(g, 6);
      polyline(
        ctx,
        [
          [x6, evmY(g, 52)],
          [x6, evmY(g, 58)]
        ],
        RED,
        2.4
      );
      k.label(x6 + 10, (evmY(g, 52) + evmY(g, 58)) / 2, "CV −$14k (EV vs AC)", { size: 10.5, color: RED });
      polyline(
        ctx,
        [
          [x6 + 46, evmY(g, 44)],
          [x6 + 46, evmY(g, 52)]
        ],
        AMBER,
        2.4
      );
      k.label(x6 + 56, (evmY(g, 44) + evmY(g, 52)) / 2 + 10, "SV −$8k (EV vs PV)", { size: 10.5, color: "#92400e" });
    }

    /* forecast */
    if (opts.showForecast) {
      var yEac = evmY(g, 131.8);
      polyline(
        ctx,
        [
          [evmX(g, 6), evmY(g, 58)],
          [g.x1, yEac]
        ],
        RED,
        2,
        [6, 5]
      );
      polyline(
        ctx,
        [
          [g.x0, yEac],
          [g.x1, yEac]
        ],
        RED,
        1.4,
        [3, 4]
      );
      k.label(g.x1, yEac - 12, "EAC $131.8k", { size: 11, color: RED, align: "right", weight: "700" });
      k.label(evmX(g, 6) + 8, evmY(g, 58) + 22, "no-change forecast: +32% over budget", { size: 10.5, color: RED });
    }

    if (opts.note) k.label(g.x0, g.yTop - 20, opts.note, { size: 11.5, color: opts.noteColor || MUTED });
  }

  function initEvmStepper() {
    var host = document.getElementById("ix-evm");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-evm", {
      title: "Resource cost performance: PV, EV and AC",
      subtitle:
        "The Cloud Banking case at week 6 of a 12-week, $100,000 project. Curves are illustrative figures consistent with the deck's case.",
      titleZh: "资源成本绩效：PV、EV 与 AC",
      subtitleZh: "云银行案例：12 周、10 万澳元预算的项目进行到第 6 周。曲线为依据讲义案例设定的一致性示意数据。",
      height: 330,
      frames: [
        {
          title: "Planned value: what should have been earned",
          caption:
            "PV is the budgeted cost of work scheduled. At week 6 the plan says $52,000 of the $100,000 should be complete.",
          titleZh: "计划价值：本应挣得多少",
          captionZh: "PV 是按计划应完成工作的预算成本。第 6 周时，计划要求 10 万澳元中的 5.2 万澳元应已完成。",
          draw: function (ctx, w, h, k) {
            drawEvmFrame(ctx, w, h, k, {
              pvOnly: true,
              showPvMark: true,
              note: "PV is a statement about the plan, not about performance."
            });
          }
        },
        {
          title: "Earned value: what the work is actually worth",
          caption:
            "EV is the budgeted cost of work performed. Only $44,000 of the plan has been earned, so $8,000 of planned work has not happened yet.",
          titleZh: "挣值：工作实际值多少",
          captionZh: "EV 是已完成工作的预算成本。目前只挣得 4.4 万澳元，说明还有 8,000 澳元的计划工作尚未完成。",
          draw: function (ctx, w, h, k) {
            drawEvmFrame(ctx, w, h, k, {
              pvOnly: true,
              showPvMark: true,
              showEv: true,
              note: "SV = EV − PV = $44k − $52k = −$8k"
            });
          }
        },
        {
          title: "Actual cost: what the resources cost",
          caption:
            "AC is the actual cost of the work performed. At $58,000 it sits above PV: the resources consumed cost more than the whole planned slice of work.",
          titleZh: "实际成本：资源花了多少钱",
          captionZh: "AC 是已完成工作的实际成本。5.8 万澳元高于 PV：所消耗资源的成本超过了计划中该完成工作的全部预算。",
          draw: function (ctx, w, h, k) {
            drawEvmFrame(ctx, w, h, k, {
              showPvMark: true,
              showEv: true,
              showAc: true,
              note: "AC above PV is over budget in absolute terms."
            });
          }
        },
        {
          title: "The two variances and the two indices",
          caption:
            "CV = −$14,000 and SV = −$8,000; CPI = 0.759 and SPI = 0.846. Because CPI < SPI, the binding constraint is the cost of resources, not the throughput of the team.",
          titleZh: "两个偏差与两个指数",
          captionZh:
            "CV = −14,000 澳元，SV = −8,000 澳元；CPI = 0.759，SPI = 0.846。由于 CPI < SPI，真正的约束是资源成本，而不是团队产出速度。",
          draw: function (ctx, w, h, k) {
            drawEvmFrame(ctx, w, h, k, {
              showPvMark: true,
              showEv: true,
              showAc: true,
              showVariances: true,
              note: "CPI = EV ÷ AC = 0.759   •   SPI = EV ÷ PV = 0.846",
              noteColor: RED
            });
          }
        },
        {
          title: "Forecast: EAC, and the efficiency needed to recover",
          caption:
            "EAC = BAC ÷ CPI = $131,818 if nothing changes. TCPI = (BAC − EV) ÷ (BAC − AC) = 1.33: every remaining dollar must deliver $1.33 of value.",
          titleZh: "预测：EAC，以及挽回所需的效率",
          captionZh:
            "若一切不变，EAC = BAC ÷ CPI = 131,818 澳元。TCPI = (BAC − EV) ÷ (BAC − AC) = 1.33：剩下的每一澳元都必须产出 1.33 澳元的价值。",
          draw: function (ctx, w, h, k) {
            drawEvmFrame(ctx, w, h, k, {
              showPvMark: true,
              showEv: true,
              showAc: true,
              showForecast: true,
              note: "Resource levers first: cloud capacity, tester multitasking, DevOps productivity.",
              noteColor: ACCENT
            });
          }
        }
      ]
    });
  }
})();
