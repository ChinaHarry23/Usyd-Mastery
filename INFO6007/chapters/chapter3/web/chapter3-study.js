(function () {
  "use strict";

  /* INFO6007 — Week 3 (Time Management) page behaviour.
   *
   * The declarative widgets (sequence, matcher, timeline, hotspot, deck, race)
   * are mounted by shared/interactive.js from the JSON blocks in the pages.
   * This file owns the three imperative canvas animations and the re-binding the
   * language toggle requires.
   *
   * Animations:
   *   ix-cpm           the critical path: forward pass, backward pass, float
   *                    table (study page)
   *   ix-m-cpm         the same network drawn to scale as a timeline strip
   *                    (foundations page)
   *   ix-m-pert        PERT: the three estimates, the weighted average and the
   *                    spread (foundations page)
   *   ix-pert          PERT on a single uncertain activity (study page)
   *   ix-race-compress fast tracking versus crashing, animated bars (study page)
   *   ix-control-flow  the five control-schedule activities (study page)
   */

  var COLORS = {
    ink: "#141826",
    muted: "#565d75",
    dim: "#7b829a",
    slate: "#94a3b8",
    line: "#cbd5e1",
    accent: "#7c3aed",
    strong: "#6d28d9",
    red: "#dc2626",
    amber: "#f59e0b",
    amberDeep: "#b45309",
    green: "#059669",
    blue: "#2563eb",
    purple: "#a855f7",
    bg: "#fbf9fe",
    critFill: "#fee2e2",
    softFill: "#eef2ff",
    amberFill: "#fffbeb",
    greyFill: "#e2e8f0",
    redSoft: "#fca5a5"
  };

  /* The lecture's Activity-on-Node example, solved. Verified arithmetic:
   * T = 33 days, critical path A-B-D-E-I-J. */
  var NODES = {
    A: { d: 5, es: 0, ef: 5, ls: 0, lf: 5, f: 0, preds: [] },
    B: { d: 4, es: 5, ef: 9, ls: 5, lf: 9, f: 0, preds: ["A"] },
    C: { d: 5, es: 9, ef: 14, ls: 15, lf: 20, f: 6, preds: ["B"] },
    D: { d: 6, es: 9, ef: 15, ls: 9, lf: 15, f: 0, preds: ["B"] },
    E: { d: 7, es: 15, ef: 22, ls: 15, lf: 22, f: 0, preds: ["D"] },
    F: { d: 3, es: 15, ef: 18, ls: 20, lf: 23, f: 5, preds: ["C", "D"] },
    G: { d: 6, es: 15, ef: 21, ls: 16, lf: 22, f: 1, preds: ["D"] },
    H: { d: 7, es: 21, ef: 28, ls: 23, lf: 30, f: 2, preds: ["F", "G"] },
    I: { d: 8, es: 22, ef: 30, ls: 22, lf: 30, f: 0, preds: ["E", "G"] },
    J: { d: 3, es: 30, ef: 33, ls: 30, lf: 33, f: 0, preds: ["H", "I"] }
  };

  var EDGES = [
    ["A", "B"], ["B", "C"], ["B", "D"], ["D", "E"], ["D", "F"],
    ["D", "G"], ["C", "F"], ["E", "I"], ["G", "I"], ["F", "H"],
    ["G", "H"], ["H", "J"], ["I", "J"]
  ];

  var CRITICAL = ["A", "B", "D", "E", "I", "J"];

  var ORDER = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  /* Canvas coordinates. Four columns; J is nudged down and left of I so the
   * merge into the last node is visible. */
  var POS = {
    A: [90, 118], B: [251, 118], C: [412, 66], D: [412, 174],
    E: [412, 282], F: [412, 390], G: [573, 174], H: [573, 282],
    I: [573, 390], J: [500, 494]
  };
  var BW = 104;
  var BH = 42;
  var CANVAS_H = 560;

  var TEXT = {
    en: {
      cpmTitle: "The critical path, solved step by step",
      cpmSub: "The lecture's Activity-on-Node example: ten activities, nine dependencies, 33 days.",
      cpmFrames: [
        ["Forward pass — early start and early finish", "ES is 0 for activities with no predecessor, then EF = ES + duration. At a merge the early start is the maximum early finish of the predecessors: F has C at EF 14 and D at EF 15, so ES(F) = 15."],
        ["Backward pass — late start and late finish", "LF is the project duration T = 33 for activities with no successor, then LS = LF − duration. At a merge the late finish is the minimum late start of the successors: G feeds H (LS 23) and I (LS 22), so LF(G) = 22."],
        ["Float — which activities can move", "Float = LS − ES = LF − EF. Zero float defines the critical path A → B → D → E → I → J = 33 days. G has 1 day and H has 2, which makes them near-critical: they belong in every status report."]
      ],
      cpmFoot: "T = 33 days · red = critical (float 0) · amber = near-critical (float 1–2) · blue = float available",
      stripTitle: "The same network drawn to scale",
      stripSub: "Each bar is an activity placed on the calendar by its early dates. Bar length is duration; the dashed space after a bar is its float.",
      stripFrames: [
        ["Bars placed by early dates", "Every activity starts at its early start and runs for its duration. The critical chain is the one whose red bars touch end to end with nothing in between: A, B, D, E, I, J."],
        ["The gaps are float", "A dashed extension shows how far a bar can slide before it threatens a successor — G has 1 day, H has 2, F has 5, C has 6. Float is the schedule's shock absorber, not spare time."],
        ["F = LS − ES, read off the chart", "The value at the right of each row is the backward-pass float. Bars with no extension are the critical path, and every bar that has one is a candidate for lending resources to it."]
      ],
      project: "PROJECT DURATION  T = 33 DAYS",
      criticalWord: "CRITICAL PATH",
      pts: "pts",
      pertTitle: "PERT on one uncertain activity",
      pertSub: "Integration and security testing: O = 4, M = 8, P = 18 weeks. The estimate is a distribution, not a date.",
      pertFrames: [
        ["Step 1 — collect the three estimates", "Optimistic O = 4 weeks if everything goes well, most likely M = 8 weeks under normal conditions, pessimistic P = 18 weeks if things go wrong. The pessimistic tail reaches much further than the optimistic one."],
        ["Step 2 — weight the most likely value four times", "E = (O + 4M + P) / 6 = (4 + 32 + 18) / 6 = 54 / 6 = 9.0 weeks. The plain arithmetic mean of the three values would be 10.0 weeks; the four-fold weight on M pulls the expected duration back towards normal conditions."],
        ["Step 3 — quote a range, not a date", "σ = (P − O) / 6 = 14 / 6 = 2.33 weeks, so E ± 2σ is 4.3 to 13.7 weeks. Committing to nine weeks is committing to the expected value with essentially no contingency; a defensible commitment names the confidence level it assumes."]
      ],
      pertFoot: "E = 9.0 weeks · σ = 2.33 weeks · E ± 2σ = 4.3 – 13.7 weeks",
      tcTitle: "Fast tracking versus crashing",
      tcSub: "Both techniques shorten the schedule. Only one of them costs money, and both carry risk — which is why the choice is a trade, not a preference.",
      tcFrames: [
        ["Baseline — five activities in sequence", "Build 10 weeks, then integrate 6, then test 4, then pilot 3. Sequential, safe, and 23 weeks long."],
        ["Fast tracking — parallelise the sequential work", "The build takes 12 weeks instead of 10 (coordination and rework) while integration overlaps it. Re-sequencing discretionary dependencies, no new money, more risk."],
        ["Crashing — buy time on the critical path", "The integration activity is compressed by adding resources: 3 weeks instead of 6. The cost increases, the risk may increase, and the schedule shortens by the amount the critical path actually gives up."],
        ["The rule that decides between them", "Neither technique does anything to an activity with float. Compress only what is critical, then compare: fast tracking spends risk, crashing spends money."]
      ],
      tcFoot: "fast tracking: no cost, more risk · crashing: more cost, more risk · both: critical path only",
      cfTitle: "The five control-schedule activities",
      cfSub: "Control is a loop, not a report. Each turn ends with an approved change to the plan or an explicit decision to leave it alone.",
      cfFrames: [
        ["1. Update actual progress", "Reliable status on every activity: percent complete, remaining duration, and the actual start and finish dates where they exist. Without honest actuals the rest of the loop is decoration."],
        ["2. Compare with the baseline", "The approved schedule is the reference. Compare milestone dates planned versus actual and compute schedule variance; the Week 4 deck develops this as SPI and SV."],
        ["3. Analyse variance and forecast", "Work out what the variance does to the critical path, to float, and to the forecast finish date. Float is the leading indicator: it shrinks before the date moves."],
        ["4. Approve corrective action", "Re-sequence non-critical work, fast track or crash the critical path, or escalate a baseline change. Corrective action is approved, not assumed."],
        ["5. Update and communicate", "Publish the revised schedule and the approved change record. Control protects the target without hiding approved change."]
      ],
      cfFoot: "update → compare → analyse → act → communicate",
      wbs: ["1.1 Requirements", "1.2 Architecture", "2.1 Design", "3.1 Build app", "3.2 Interface", "3.3 Checker", "4.1 Testing", "4.2 Pilot", "4.3 Trials", "5.1 Release", "6.1 Launch"],
      wbsZh: ["1.1 需求", "1.2 架构", "2.1 设计", "3.1 应用构建", "3.2 接口", "3.3 查验方案", "4.1 测试", "4.2 试点", "4.3 扩大试验", "5.1 发布就绪", "6.1 上线"]
    },
    zh: {
      cpmTitle: "关键路径的逐步演算",
      cpmSub: "讲义中的节点式网络示例：十项活动、九条依赖、工期 33 天。",
      cpmFrames: [
        ["正推法——最早开始与最早完成", "无紧前活动的 ES 取 0，随后 EF = ES + 工期。汇合点多条路径取最大最早完成时间：F 的紧前活动 C 的 EF 为 14、D 的 EF 为 15，因此 ES(F) = 15。"],
        ["逆推法——最晚开始与最晚完成", "无紧后活动的 LF 取项目工期 T = 33，随后 LS = LF − 工期。汇合点取紧后活动最晚开始时间的最小值：G 的紧后活动为 H（LS 23）与 I（LS 22），因此 LF(G) = 22。"],
        ["浮动时间——哪些活动可以移动", "浮动时间 = LS − ES = LF − EF。浮动为零者构成关键路径 A → B → D → E → I → J = 33 天。G 有 1 天、H 有 2 天，属于接近关键的活动，必须写进每一次状态报告。"]
      ],
      cpmFoot: "T = 33 天 · 红色 = 关键（浮动 0）· 橙色 = 接近关键（浮动 1–2）· 蓝色 = 有浮动时间",
      stripTitle: "同一网络，按时间比例绘制",
      stripSub: "每根横条按最早日期放置在日历上。横条长度即工期，横条之后的虚线区间即其浮动时间。",
      stripFrames: [
        ["按最早日期放置的横条", "每项活动从最早开始时间起按工期延伸。关键链条就是红色横条首尾相接、中间没有空隙的那一条：A、B、D、E、I、J。"],
        ["空隙就是浮动时间", "虚线延展显示横条在威胁到紧后活动之前还能滑动多长——G 有 1 天、H 有 2 天、F 有 5 天、C 有 6 天。浮动时间是进度的缓冲，而不是空闲。"],
        ["F = LS − ES，可直接从图上读出", "每行右侧的数值即逆推得出的浮动时间。没有延展的横条构成关键路径，而有延展的每一条都是可以向它借调资源的候选。"]
      ],
      project: "项目工期  T = 33 天",
      criticalWord: "关键路径",
      pts: "分",
      pertTitle: "对一项不确定活动做 PERT 估算",
      pertSub: "集成与安全测试：O = 4、M = 8、P = 18 周。估算给出的是分布，而不是一个日期。",
      pertFrames: [
        ["第一步——收集三个估算值", "乐观值 O = 4 周（一切顺利），最可能值 M = 8 周（正常情况），悲观值 P = 18 周（出现问题时）。悲观一侧伸出的距离远大于乐观一侧。"],
        ["第二步——给最可能值四倍权重", "E =（O + 4M + P）/ 6 =（4 + 32 + 18）/ 6 = 54 / 6 = 9.0 周。三个数的算术平均为 10.0 周；对 M 的四倍权重把期望工期拉回正常情况。"],
        ["第三步——给出区间而不是日期", "σ =（P − O）/ 6 = 14 / 6 = 2.33 周，因此 E ± 2σ 为 4.3 至 13.7 周。承诺九周等于按期望值承诺而几乎不留余地；站得住脚的承诺会说明它所依据的置信水平。"]
      ],
      pertFoot: "E = 9.0 周 · σ = 2.33 周 · E ± 2σ = 4.3 – 13.7 周",
      tcTitle: "快速跟进与赶工",
      tcSub: "两种技术都能缩短进度。只有一种要花钱，而两种都会带来风险——因此这是取舍，而不是偏好。",
      tcFrames: [
        ["基准——五项活动依次进行", "构建 10 周，随后集成 6 周、测试 4 周、试点 3 周。顺序执行、风险最低，共 23 周。"],
        ["快速跟进——把顺序工作并行化", "构建因协调与返工从 10 周变为 12 周，同时集成与之并行。改变的是选择性依赖，不额外花钱，但风险上升。"],
        ["赶工——在关键路径上买时间", "为集成活动增加资源，使其由 6 周压缩到 3 周。成本上升，风险可能上升，进度缩短的量取决于关键路径真正让出的时间。"],
        ["决定二者取舍的规则", "对任何带浮动时间的活动，两种技术都无效。只压缩关键活动，然后比较：快速跟进花的是风险，赶工花的是钱。"]
      ],
      tcFoot: "快速跟进：不增成本、风险上升 · 赶工：成本上升、风险上升 · 二者都只对关键路径有效",
      cfTitle: "控制进度的五项活动",
      cfSub: "控制是一个回路，而不是一份报告。每一轮都以获批的计划变更或明确的不变更决定收尾。",
      cfFrames: [
        ["1. 更新实际进度", "为每项活动提供可靠状态：完成百分比、剩余工期，以及已有的实际开始与完成日期。没有诚实的实际数据，回路的其余部分只是摆设。"],
        ["2. 与基准对比", "获批的进度计划就是参照系。对比里程碑的计划日期与实际日期并计算进度偏差；第 4 周讲义将把它发展为 SPI 与 SV。"],
        ["3. 分析偏差并预测", "判断偏差对关键路径、浮动时间与预计完工日期的影响。浮动时间是先行指标：它在日期变动之前就先缩小。"],
        ["4. 批准纠正措施", "重新排列非关键工作的顺序、对关键路径快速跟进或赶工，或上报基准变更。纠正措施需要被批准，而不是被默认。"],
        ["5. 更新并沟通", "发布修订后的进度计划与获批的变更记录。控制既要守住目标，也不能隐藏已批准的变更。"]
      ],
      cfFoot: "更新 → 对比 → 分析 → 行动 → 沟通",
      wbs: ["1.1 需求", "1.2 架构", "2.1 设计", "3.1 应用构建", "3.2 接口", "3.3 查验方案", "4.1 测试", "4.2 试点", "4.3 扩大试验", "5.1 发布就绪", "6.1 上线"],
      wbsZh: ["1.1 需求", "1.2 架构", "2.1 设计", "3.1 应用构建", "3.2 接口", "3.3 查验方案", "4.1 测试", "4.2 试点", "4.3 扩大试验", "5.1 发布就绪", "6.1 上线"]
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    mountAll();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every canvas host
   * and every declarative widget inside a translated section is a new node.
   * Re-mount everything, then re-run the chrome bindings. The sidebar toggle
   * lives outside any section, so its stale listener is dropped first. */
  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    mountAll();
    rebindChrome();
  });

  var lastChromeLang = null;

  function currentLang() {
    return typeof window.getLang === "function" ? window.getLang() : "en";
  }

  function t() {
    return currentLang() === "zh" ? TEXT.zh : TEXT.en;
  }

  /* ── mounting ───────────────────────────────────────────────── */

  function framesKey(id) {
    return "ixFrame:" + id;
  }

  function savedFrame(id) {
    try {
      var raw = window.localStorage && window.localStorage.getItem(framesKey(id));
      var n = raw == null ? -1 : parseInt(raw, 10);
      return isNaN(n) ? -1 : n;
    } catch (e) {
      return -1;
    }
  }

  function saveFrame(id, index) {
    try {
      if (window.localStorage) window.localStorage.setItem(framesKey(id), String(index));
    } catch (e) {
      /* storage unavailable — the scrubber still works for this visit */
    }
  }

  /* Rebuild a stepper, preserving whatever frame the reader was on. */
  function remount(id, cfg, onApi) {
    var host = document.getElementById(id);
    if (!host || !window.Interactive || !window.Interactive.stepper) return;

    var previous = savedFrame(id);
    if (previous < 0 && host.dataset.ixFrame != null) {
      previous = parseInt(host.dataset.ixFrame, 10);
    }

    if (window.Interactive && window.Interactive.destroy) {
      window.Interactive.destroy(host);
    } else {
      host.innerHTML = "";
      host.classList.remove("ix");
    }

    var api = window.Interactive.stepper(id, cfg);
    if (!api) return;

    if (previous >= 0 && previous < cfg.frames.length) api.go(previous);

    function remember() {
      var i = api.index();
      host.dataset.ixFrame = String(i);
      saveFrame(id, i);
    }

    var transport = host.querySelector(".ix-transport");
    if (transport) {
      transport.addEventListener("click", function () {
        window.setTimeout(remember, 0);
      });
    }
    var scrub = host.querySelector(".ix-scrub");
    if (scrub) {
      scrub.addEventListener("input", function () {
        window.setTimeout(remember, 0);
      });
    }
    if (onApi) onApi(api, host, remember);
  }

  function mountAll() {
    mountCpm();
    mountTimelineStrip();
    mountPert();
    mountPertStudy();
    mountCompression();
    mountControlLoop();
    restoreRaces();
  }

  /* ── 1. Study page: the critical path ───────────────────────── */

  function mountCpm() {
    var copy = t();
    var frames = copy.cpmFrames.map(function (pair, i) {
      return {
        title: pair[0],
        caption: pair[1],
        draw: function (ctx, w, h, k) {
          drawNetwork(ctx, w, h, k, i, copy);
        }
      };
    });
    remount("ix-cpm", {
      title: copy.cpmTitle,
      subtitle: copy.cpmSub,
      height: CANVAS_H,
      frames: frames
    });
  }

  function drawNetwork(ctx, w, h, k, stage, copy) {
    k.clear(COLORS.bg);

    /* Edges first, so the nodes sit on top of them. */
    EDGES.forEach(function (edge, index) {
      var from = POS[edge[0]];
      var to = POS[edge[1]];
      var a = { x: from[0] + BW / 2, y: from[1] };
      var b = { x: to[0] - BW / 2, y: to[1] };
      var isCritical = CRITICAL.indexOf(edge[0]) !== -1 && CRITICAL.indexOf(edge[1]) !== -1;
      var revealed = stage > 0;
      var colour = isCritical && revealed ? COLORS.red : isCritical ? "#e8a0a0" : COLORS.line;
      k.arrow(a.x, a.y, b.x, b.y, { color: colour, lw: isCritical && revealed ? 2.2 : 1.4, head: 6 });
      if (!revealed && index === 0) {
        k.label(20, 26, "→ forward pass", { size: 11, mono: true, color: COLORS.dim });
      }
    });

    ORDER.forEach(function (id) {
      var node = NODES[id];
      var p = POS[id];
      var critical = node.f === 0;
      var near = !critical && node.f <= 2;
      var fill = critical ? COLORS.critFill : near ? COLORS.amberFill : COLORS.softFill;
      var stroke = critical ? COLORS.red : near ? COLORS.amberDeep : COLORS.accent;
      var ink = critical ? "#7f1d1d" : near ? "#78350f" : "#312e81";

      k.box(p[0] - BW / 2, p[1] - BH / 2, BW, BH, {
        fill: fill,
        stroke: stroke,
        lw: critical ? 2.4 : 1.7,
        r: 9
      });

      var line2 = "dur " + node.d + " · ES " + node.es;
      if (stage >= 1) line2 = "ES " + node.es + " · EF " + node.ef;
      if (stage >= 2) line2 = "EF " + node.ef + " · F " + node.f;

      k.label(p[0], p[1] - 9, id, { align: "center", size: 14, weight: "700", color: ink });
      k.label(p[0], p[1] + 10, line2, { align: "center", size: 10, color: ink });
    });

    /* Legend strip. */
    var y = h - 30;
    k.box(20, y - 10, w - 40, 22, { fill: "#ffffff", stroke: COLORS.line, lw: 1, r: 8 });
    k.label(32, y + 1, copy.cpmFoot, { size: 11, color: COLORS.muted });

    if (stage >= 1) {
      k.label(w - 30, 26, copy.criticalWord + "  A→B→D→E→I→J", {
        align: "right",
        size: 12,
        weight: "700",
        color: COLORS.red
      });
    }
    if (stage >= 2) {
      k.label(24, 52, copy.project, { size: 12, weight: "700", color: COLORS.strong });
    }
  }

  /* ── 2. Foundations: the same network as a timeline strip ───── */

  function mountTimelineStrip() {
    var copy = t();
    var rows = ORDER.map(function (id) {
      var n = NODES[id];
      return { id: id, es: n.es, ef: n.ef, f: n.f, critical: n.f === 0 };
    });
    var maxDay = 33;

    remount("ix-m-cpm", {
      title: copy.stripTitle,
      subtitle: copy.stripSub,
      height: 420,
      frames: [
        {
          title: copy.stripFrames[0][0],
          caption: copy.stripFrames[0][1],
          draw: function (ctx, w, h, k) {
            drawStrip(k, w, h, rows, maxDay, 0, copy);
          }
        },
        {
          title: copy.stripFrames[1][0],
          caption: copy.stripFrames[1][1],
          draw: function (ctx, w, h, k) {
            drawStrip(k, w, h, rows, maxDay, 1, copy);
          }
        },
        {
          title: copy.stripFrames[2][0],
          caption: copy.stripFrames[2][1],
          draw: function (ctx, w, h, k) {
            drawStrip(k, w, h, rows, maxDay, 2, copy);
          }
        }
      ]
    });
  }

  /* A plain rule with no arrowhead — used for axis ticks, where an
   * Interactive arrow would draw a head that reads as data. */
  function tick(k, px, y1, y2, colour) {
    k.box(px, y1, 1, Math.max(1, y2 - y1), { fill: colour });
  }

  function drawStrip(k, w, h, rows, maxDay, stage, copy) {
    k.clear(COLORS.bg);
    var left = 128;
    var right = w - 24;
    var top = 44;
    var rowH = 24;
    var plotW = right - left;

    function x(day) {
      return left + (day / maxDay) * plotW;
    }

    /* Day axis at multiples of five. */
    for (var day = 0; day <= maxDay; day += 5) {
      tick(k, x(day), top - 14, top + rows.length * rowH + 4, day === 0 ? COLORS.slate : "#eceef6");
      k.label(x(day), top - 24, String(day), { align: "center", size: 10, mono: true, color: COLORS.dim });
    }
    k.label(left, top - 40, "day", { size: 10, weight: "700", color: COLORS.slate });

    rows.forEach(function (row, i) {
      var y = top + i * rowH;
      var fill = row.critical ? COLORS.red : row.f === 1 ? COLORS.amber : row.f === 2 ? "#fcd34d" : COLORS.greyFill;
      var ink = row.critical ? "#ffffff" : COLORS.ink;

      k.label(left - 12, y + 8, row.id + " · " + (NODES[row.id].d + "d"), {
        align: "right",
        size: 11,
        weight: "700",
        color: row.critical ? COLORS.red : COLORS.muted
      });

      k.box(x(row.es), y, Math.max(14, x(row.ef) - x(row.es)), 17, { fill: fill, stroke: fill, lw: 1, r: 5 });

      if (stage >= 1 && row.f > 0) {
        k.highlight(x(row.ef), y - 1, Math.max(10, x(row.ef + row.f) - x(row.ef)), 19, {
          color: COLORS.amberDeep,
          lw: 1.4
        });
      }

      if (stage >= 2) {
          k.label(right + 6 - 96, y + 8, "F = " + row.f, {
          size: 11,
          weight: "700",
          color: row.f === 0 ? COLORS.red : COLORS.amberDeep
        });
      }
    });

    k.label(left + plotW / 2, h - 26, copy.project || "T = 33 days", {
      align: "center",
      size: 12,
      weight: "700",
      color: COLORS.strong
    });
  }

  /* ── 3. Study page: PERT on one activity ────────────────────── */

  function mountPertStudy() {
    var copy = t();
    var o = 4;
    var m = 8;
    var p = 18;
    var e = (o + 4 * m + p) / 6;
    var sd = (p - o) / 6;

    remount("ix-pert", {
      title: copy.pertTitle,
      subtitle: copy.pertSub,
      height: 250,
      frames: [
        {
          title: copy.pertFrames[0][0],
          caption: copy.pertFrames[0][1],
          draw: function (ctx, w, h, k) {
            drawPertLine(k, w, h, o, m, p, e, 0);
          }
        },
        {
          title: copy.pertFrames[1][0],
          caption: copy.pertFrames[1][1],
          draw: function (ctx, w, h, k) {
            drawPertLine(k, w, h, o, m, p, e, 1);
          }
        },
        {
          title: copy.pertFrames[2][0],
          caption: copy.pertFrames[2][1],
          draw: function (ctx, w, h, k) {
            drawPertLine(k, w, h, o, m, p, e, 2, sd);
          }
        }
      ]
    });
  }

  function drawPertLine(k, w, h, o, m, p, e, stage, sd) {
    k.clear(COLORS.bg);

    var left = 90;
    var right = w - 50;
    var min = 2;
    var max = 20;
    var y = 120;

    function x(v) {
      return left + ((v - min) / (max - min)) * (right - left);
    }

    k.arrow(left - 18, y, right + 16, y, { color: COLORS.slate, lw: 1.6, head: 7 });
    k.label(right + 16, y + 24, "weeks", { align: "right", size: 10, mono: true, color: COLORS.dim });
    for (var v = min; v <= max; v += 2) {
      tick(k, x(v), y - 5, y + 5, COLORS.line);
      k.label(x(v), y + 20, String(v), { align: "center", size: 10, mono: true, color: COLORS.dim });
    }

    /* The optimistic-to-pessimistic span. */
    k.box(x(o), y - 9, x(p) - x(o), 18, { fill: COLORS.softFill, stroke: COLORS.accent, lw: 1.4, r: 9 });
    k.label((x(o) + x(p)) / 2, y - 28, "O → P span = " + (p - o) + " weeks", {
      align: "center",
      size: 11,
      weight: "700",
      color: COLORS.accent
    });

    [
      { v: o, tag: "O", cap: "optimistic", colour: COLORS.green },
      { v: m, tag: "M", cap: "most likely", colour: COLORS.blue },
      { v: p, tag: "P", cap: "pessimistic", colour: COLORS.red }
    ].forEach(function (mark) {
      k.dot(x(mark.v), y, 8, { fill: mark.colour, stroke: "#ffffff", lw: 2 });
      k.label(x(mark.v), y - 26, mark.tag + " = " + mark.v, { align: "center", size: 12, weight: "700", color: mark.colour });
      k.label(x(mark.v), y + 42, mark.cap, { align: "center", size: 10, color: COLORS.muted });
    });

    if (stage === 0) {
      k.label(w / 2, h - 40, "Three estimates, one distribution: the pessimistic side reaches further.", {
        align: "center",
        size: 12,
        color: COLORS.muted
      });
      return;
    }

    k.dot(x(e), y, 9, { fill: COLORS.strong, stroke: "#ffffff", lw: 2.4 });
    k.label(x(e), y + 66, "E = " + e.toFixed(1), { align: "center", size: 12, weight: "700", color: COLORS.strong });

    var lines = [
      "E = (O + 4M + P) / 6 = (" + o + " + 4×" + m + " + " + p + ") / 6 = 54 / 6 = " + e.toFixed(1) + " weeks"
    ];
    if (stage === 2 && sd != null) {
      lines.push("σ = (P − O) / 6 = (" + p + " − " + o + ") / 6 = " + sd.toFixed(2) + " weeks");
      lines.push("E ± 2σ = " + (e - 2 * sd).toFixed(1) + " to " + (e + 2 * sd).toFixed(1) + " weeks");
    }
    k.code(w / 2 - 210, h - 46, lines, { size: 12.5, lh: 20, color: COLORS.ink });
  }

  /* ── 4. Foundations: the same PERT, three stages ─────────────── */

  function mountPert() {
    var copy = t();
    var o = 4;
    var m = 8;
    var p = 18;
    var e = (o + 4 * m + p) / 6;
    var sd = (p - o) / 6;

    function weighted(k, w, h) {
      var total = o + 4 * m + p;
      var parts = [
        { label: "O", value: o, weight: 1, colour: COLORS.green },
        { label: "M", value: m * 4, weight: 4, colour: COLORS.blue },
        { label: "P", value: p, weight: 1, colour: COLORS.red }
      ];
      var left = 90;
      var right = w - 60;
      var unit = (right - left) / total;
      var x = left;
      parts.forEach(function (part) {
        var width = part.value * unit;
        k.box(x, 70, width, 52, { fill: part.colour, stroke: "#ffffff", lw: 1.5, r: 8 });
        k.label(x + width / 2, 88, part.label, { align: "center", size: 15, weight: "700", color: "#ffffff" });
        k.label(x + width / 2, 106, part.weight + " weight", { align: "center", size: 10, color: "#ffffff" });
        x += width;
      });
      k.code(left, 168, [
        "E = (O + 4M + P) / 6",
        "  = (" + o + " + 4×" + m + " + " + p + ") / 6",
        "  = " + total + " / 6 = " + e.toFixed(1) + " weeks"
      ], { size: 13, lh: 22, color: COLORS.ink });
    }

    remount("ix-m-pert", {
      title: "PERT: from three estimates to one distribution",
      subtitle: "The same activity as the study page, opened up: where the weights come from, what the expected value means, and how wide the answer really is.",
      height: 250,
      frames: [
        {
          title: copy.pertFrames[0][0],
          caption: copy.pertFrames[0][1],
          draw: function (ctx, w, h, k) {
            drawPertLine(k, w, h, o, m, p, e, 0);
          }
        },
        {
          title: copy.pertFrames[1][0],
          caption: copy.pertFrames[1][1],
          draw: function (ctx, w, h, k) {
            weighted(k, w, h);
          }
        },
        {
          title: copy.pertFrames[2][0],
          caption: copy.pertFrames[2][1],
          draw: function (ctx, w, h, k) {
            drawPertLine(k, w, h, o, m, p, e, 2, sd);
          }
        }
      ]
    });
  }

  /* ── 5. Study page: fast tracking versus crashing ───────────── */

  function mountCompression() {
    var copy = t();
    var lanes = [
      { name: "Build", start: 0, dur: 10 },
      { name: "Integrate", start: 10, dur: 6 },
      { name: "Test", start: 16, dur: 4 },
      { name: "Pilot", start: 20, dur: 3 }
    ];

    remount("ix-race-compress", {
      title: copy.tcTitle,
      subtitle: copy.tcSub,
      height: 260,
      frames: [
        {
          title: copy.tcFrames[0][0],
          caption: copy.tcFrames[0][1],
          draw: function (ctx, w, h, k) {
            drawLanes(k, w, h, lanes, 23, copy.tcFoot, []);
          }
        },
        {
          title: copy.tcFrames[1][0],
          caption: copy.tcFrames[1][1],
          draw: function (ctx, w, h, k) {
            drawLanes(
              k,
              w,
              h,
              [
                { name: "Build", start: 0, dur: 12, over: true },
                { name: "Integrate", start: 10, dur: 6, overlap: true },
                { name: "Test", start: 16, dur: 4 },
                { name: "Pilot", start: 20, dur: 3 }
              ],
              23,
              copy.tcFoot,
              [22]
            );
          }
        },
        {
          title: copy.tcFrames[2][0],
          caption: copy.tcFrames[2][1],
          draw: function (ctx, w, h, k) {
            drawLanes(
              k,
              w,
              h,
              [
                { name: "Build", start: 0, dur: 10 },
                { name: "Integrate", start: 10, dur: 3, crashed: true },
                { name: "Test", start: 13, dur: 4 },
                { name: "Pilot", start: 17, dur: 3 }
              ],
              23,
              copy.tcFoot,
              [20]
            );
          }
        },
        {
          title: copy.tcFrames[3][0],
          caption: copy.tcFrames[3][1],
          draw: function (ctx, w, h, k) {
            drawLanes(k, w, h, lanes, 23, copy.tcFoot, [], true);
          }
        }
      ]
    });
  }

  function drawLanes(k, w, h, lanes, maxDay, foot, milestones, showFloatNote) {
    k.clear(COLORS.bg);

    var left = 112;
    var right = w - 34;
    var top = 54;
    var rowH = 36;

    function x(day) {
      return left + (day / maxDay) * (right - left);
    }

    for (var day = 0; day <= maxDay; day += 2) {
      k.box(x(day), top - 12, 1, Math.max(1, top + lanes.length * rowH - 6 - (top - 12)), {
        fill: day === 0 ? COLORS.slate : "#eceef6"
      });
      k.label(x(day), top - 24, String(day), { align: "center", size: 10, mono: true, color: COLORS.dim });
    }
    k.label(left, top - 40, "week", { size: 10, weight: "700", color: COLORS.slate });

    lanes.forEach(function (lane, i) {
      var y = top + i * rowH;
      var fill = lane.crashed ? COLORS.amber : lane.over ? COLORS.redSoft : COLORS.accent;
      k.label(left - 12, y + 9, lane.name, { align: "right", size: 11, weight: "700", color: COLORS.muted });
      k.box(x(lane.start), y, Math.max(16, x(lane.start + lane.dur) - x(lane.start)), 19, {
        fill: fill,
        stroke: fill,
        lw: 1,
        r: 5
      });
      k.label(x(lane.start + lane.dur) + 8, y + 9, lane.dur + "w", { size: 11, mono: true, color: COLORS.muted });
      if (lane.overlap) {
        k.highlight(x(lane.start), y - 2, x(lane.start + lane.dur) - x(lane.start), 23, {
          color: COLORS.red,
          lw: 1.6
        });
      }
      if (lane.crashed) {
        k.highlight(x(lane.start), y - 2, x(lane.start + lane.dur) - x(lane.start), 23, {
          color: COLORS.amberDeep,
          lw: 1.6
        });
      }
    });

    milestones.forEach(function (day) {
      k.arrow(x(day), top - 10, x(day), top + lanes.length * rowH - 4, {
        color: COLORS.green,
        lw: 2,
        dash: [5, 4],
        head: 8
      });
      k.label(x(day), top + lanes.length * rowH + 12, "day " + day, {
        align: "center",
        size: 10.5,
        weight: "700",
        color: COLORS.green
      });
    });

    if (showFloatNote) {
      k.label(w / 2, top - 40, "compress only what is critical — float absorbs everything else", {
        align: "center",
        size: 11.5,
        color: COLORS.amberDeep
      });
    }

    k.label(20, h - 22, foot, { size: 11, color: COLORS.muted });
  }

  /* ── 6. Study page: the control loop ───────────────────────── */

  function mountControlLoop() {
    var copy = t();
    var steps = copy.cfFrames;
    var total = steps.length;

    remount("ix-control-flow", {
      title: copy.cfTitle,
      subtitle: copy.cfSub,
      height: 230,
      frames: steps.map(function (pair, i) {
        return {
          title: pair[0],
          caption: pair[1],
          draw: function (ctx, w, h, k) {
            k.clear(COLORS.bg);
            var cx = w / 2;
            var cy = h / 2 - 6;
            var r = Math.min(w * 0.3, h * 0.42);

            k.dot(cx, cy, r, { fill: "rgba(124,58,237,0.06)", stroke: COLORS.line, lw: 1.5 });
            for (var s = 0; s < total; s++) {
              var angle = -Math.PI / 2 + (s / total) * Math.PI * 2;
              var x = cx + Math.cos(angle) * r;
              var y = cy + Math.sin(angle) * r;
              var live = s === i;
              k.dot(x, y, live ? 15 : 11, {
                fill: live ? COLORS.accent : "#ffffff",
                stroke: live ? COLORS.strong : COLORS.slate,
                lw: 2
              });
              k.label(x, y, String(s + 1), {
                align: "center",
                size: 11,
                weight: "700",
                color: live ? "#ffffff" : COLORS.muted
              });
            }

            /* The arrow of travel around the loop. */
            var a0 = -Math.PI / 2 + (i / total) * Math.PI * 2 + 0.5;
            var a1 = a0 + 0.55;
            k.arrow(
              cx + Math.cos(a0) * r,
              cy + Math.sin(a0) * r,
              cx + Math.cos(a1) * r,
              cy + Math.sin(a1) * r,
              { color: COLORS.accent, lw: 2, head: 8 }
            );

            k.label(cx, cy - 8, "step " + (i + 1) + " of " + total, {
              align: "center",
              size: 13,
              weight: "700",
              color: COLORS.strong
            });
            k.label(cx, cy + 12, copy.cfFoot, { align: "center", size: 10.5, color: COLORS.dim });
          }
        };
      })
    });
  }

  /* ── 7. Declarative races: adjust animation to the container ── */

  function restoreRaces() {
    if (!window.Interactive) return;
    ["ix-race-control", "ix-m-race"].forEach(function (id) {
      var host = document.getElementById(id);
      if (host && host._ixRefresh) host._ixRefresh();
    });
  }

  /* ── chrome ─────────────────────────────────────────────────── */

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
        window.console.error("[INFO6007 chapter 3] chapter chrome failed to initialise:", err);
      }
    }
  }
})();
