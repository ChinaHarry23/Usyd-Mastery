(function () {
  "use strict";

  /* INFO6007 — Week 2 page behaviour.
   *
   * The declarative widgets (timeline, sequence, matcher, pipeline, hotspot,
   * deck, race) are mounted by shared/interactive.js from the JSON config
   * blocks in the pages. This file owns the three animated canvas steppers and
   * the re-binding that a language swap requires. It is loaded by both
   * chapter2-study.html and chapter2-math.html, and every entry point is
   * guarded by an element lookup, so a page without a given host is untouched.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initAll();
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
    initAll();
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
        window.console.error("[INFO6007 chapter 2] chapter chrome failed to initialise:", err);
      }
    }
  }

  function initAll() {
    initMethodFlowStepper();
    initCriticalPathStepper();
    initEvmStepper();
  }

  /* Exposed so the inline KaTeX bootstrap on the foundations page (and any
   * future caller) can re-mount after a dynamic DOM change. */
  window.INFO6007Chapter2 = { refresh: initAll };

  function boxWidth(w, max) {
    return Math.max(52, Math.min(max || 100, w * 0.14));
  }

  /* ── Stepper 1: three delivery rhythms ──────────────────────── */

  function initMethodFlowStepper() {
    var host = document.getElementById("ix-method-flow");
    if (!host || !window.Interactive) return;

    var ACCENT = "#7c3aed";
    var GREEN = "#059669";
    var GREY = "#94a3b8";

    window.Interactive.stepper("ix-method-flow", {
      title: "One pass, many passes, or a continuous flow",
      subtitle: "The deck's comparison of waterfall, agile and DevOps: what changes is the size of the batch and how fast feedback returns.",
      titleZh: "一次通过、多次迭代，还是持续流动",
      subtitleZh: "讲义对瀑布、敏捷与 DevOps 的比较：改变的是批量的规模与反馈回来的速度。",
      height: 260,
      frames: [
        {
          title: "Waterfall — Design, Code, Test, Deploy, once",
          caption: "Every phase completes before the next begins. The first real feedback arrives after deployment, when change is at its most expensive.",
          titleZh: "瀑布——设计、编码、测试、部署，各一次",
          captionZh: "每个阶段完成后才进入下一阶段。第一次真正的反馈出现在部署之后，而此时变更的代价最高。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var labels = ["Design", "Code", "Test", "Deploy"];
            var pad = 24;
            var gap = 10;
            var bw = (w - pad * 2 - gap * 3) / 4;
            var y = h / 2 - 38;
            labels.forEach(function (label, i) {
              var x = pad + i * (bw + gap);
              k.box(x, y, bw, 62, { fill: "#ede9fe", stroke: ACCENT, lw: 1.8, r: 8 });
              k.label(x + bw / 2, y + 26, label, { align: "center", size: 13, color: "#4c1d95" });
              k.label(x + bw / 2, y + 46, "phase " + (i + 1), { align: "center", size: 10, color: "#6b7280" });
              if (i < labels.length - 1) {
                k.arrow(x + bw + 1, y + 31, x + bw + gap - 1, y + 31, { color: ACCENT, lw: 1.8 });
              }
            });
            k.arrow(pad, y + 88, w - pad, y + 88, { color: GREY, lw: 1.6 });
            k.label(pad, y + 106, "one release, one feedback point", { size: 11, color: "#565d75" });
          }
        },
        {
          title: "Agile — Design, then Code and Test per increment",
          caption: "The same phases, repeated in small increments. Feedback returns every sprint instead of once at the end, so change is still affordable when it arrives.",
          titleZh: "敏捷——设计之后，按增量反复编码与测试",
          captionZh: "同样的阶段被拆成小增量反复进行。反馈每个冲刺就会回来一次，而不是只在最后回来，因此变更到来时仍然可承受。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var pad = 24;
            var y = h / 2 - 38;
            var designW = Math.max(58, w * 0.11);
            var deployW = designW;
            var middle = w - pad * 2 - designW - deployW - 3 * 8;
            var unit = middle / 3;
            k.box(pad, y, designW, 62, { fill: "#ede9fe", stroke: ACCENT, lw: 1.8, r: 8 });
            k.label(pad + designW / 2, y + 26, "Design", { align: "center", size: 12, color: "#4c1d95" });
            k.label(pad + designW / 2, y + 46, "once", { align: "center", size: 10, color: "#6b7280" });

            for (var i = 0; i < 3; i++) {
              var x = pad + designW + 8 + i * unit;
              var half = (unit - 14) / 2;
              k.box(x, y, half, 62, { fill: "#d1fae5", stroke: GREEN, lw: 1.6, r: 8 });
              k.label(x + half / 2, y + 26, "Code", { align: "center", size: 11, color: "#065f46" });
              k.label(x + half / 2, y + 46, "sprint " + (i + 1), { align: "center", size: 9, color: "#6b7280" });
              k.box(x + half + 6, y, half, 62, { fill: "#d1fae5", stroke: GREEN, lw: 1.6, r: 8 });
              k.label(x + half + 6 + half / 2, y + 26, "Test", { align: "center", size: 11, color: "#065f46" });
              k.label(x + half + 6 + half / 2, y + 46, "feedback", { align: "center", size: 9, color: "#6b7280" });
              if (i < 2) {
                k.arrow(x + unit - 9, y + 31, x + unit - 1, y + 31, { color: GREEN, lw: 1.6 });
              }
            }
            var dx = w - pad - deployW;
            k.arrow(pad + designW + 1, y + 31, pad + designW + 7, y + 31, { color: GREEN, lw: 1.6 });
            k.arrow(dx - 8, y + 31, dx - 1, y + 31, { color: GREEN, lw: 1.6 });
            k.box(dx, y, deployW, 62, { fill: "#ede9fe", stroke: ACCENT, lw: 1.8, r: 8 });
            k.label(dx + deployW / 2, y + 26, "Deploy", { align: "center", size: 12, color: "#4c1d95" });
            k.label(dx + deployW / 2, y + 46, "per release", { align: "center", size: 9, color: "#6b7280" });
            k.label(pad, y + 96, "batch = one sprint   ·   feedback = every sprint", { size: 11, color: "#565d75" });
          }
        },
        {
          title: "DevOps — the loop never stops",
          caption: "CI/CD, automated testing and monitoring turn delivery into a loop: plan, code, build, test, release, deploy, operate, monitor, and back to plan. Batches shrink to single changes.",
          titleZh: "DevOps——循环不停",
          captionZh: "CI/CD、自动化测试与监控把交付变成闭环：计划、编码、构建、测试、发布、部署、运维、监控，再回到计划。批量缩小到单个变更。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 - 2;
            var r = Math.min(w * 0.3, h * 0.4);
            var nodes = ["Plan", "Code", "Build", "Test", "Release", "Deploy", "Operate", "Monitor"];
            nodes.forEach(function (name, i) {
              var a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
              var x = cx + Math.cos(a) * r;
              var y = cy + Math.sin(a) * r;
              var a2 = ((i + 1) / nodes.length) * Math.PI * 2 - Math.PI / 2;
              var x2 = cx + Math.cos(a2) * r;
              var y2 = cy + Math.sin(a2) * r;
              k.arrow(
                x + Math.cos(a) * 36,
                y + Math.sin(a) * 20,
                x2 - Math.cos(a2) * 36,
                y2 - Math.sin(a2) * 20,
                { color: "rgba(5,150,105,0.7)", lw: 1.5 }
              );
              k.box(x - 32, y - 13, 64, 26, { fill: "#d1fae5", stroke: GREEN, lw: 1.5, r: 13 });
              k.label(x, y, name, { align: "center", size: 11, color: "#065f46" });
            });
            k.label(cx, cy - 10, "CI / CD", { align: "center", size: 13, mono: true, color: GREY });
            k.label(cx, cy + 10, "IaC · automated test", { align: "center", size: 10, color: GREY });
            k.label(cx, cy + 28, "monitoring", { align: "center", size: 10, color: GREY });
          }
        },
        {
          title: "Why it matters to the project manager",
          caption: "Smaller batches and faster feedback change what a plan can promise. The delivery model is a schedule and risk decision before it is a tooling decision.",
          titleZh: "为什么这对项目经理重要",
          captionZh: "更小的批量与更快的反馈改变了计划可以承诺的内容。交付模式首先是进度与风险决策，其次才是工具决策。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var rows = [
              { name: "Waterfall", batch: 1, fb: 0.08, note: "all at once; feedback after deployment" },
              { name: "Agile", batch: 0.25, fb: 0.4, note: "one increment; feedback per sprint" },
              { name: "DevOps", batch: 0.05, fb: 0.95, note: "single change; feedback from monitoring" }
            ];
            var barX = 140;
            var barW = (w - barX - 30) * 0.55;
            var secondX = barX + barW + 14;
            var secondW = (w - barX - 30) * 0.4;
            rows.forEach(function (row, i) {
              var y = 36 + i * 64;
              k.label(20, y, row.name, { size: 12, color: "#4c1d95" });
              k.label(barX, y - 18, "batch size", { size: 9.5, color: "#6b7280" });
              k.label(secondX, y - 18, "feedback speed", { size: 9.5, color: "#6b7280" });
              k.bar(barX, y - 6, barW, 12, row.batch, { max: 1, fill: ACCENT, track: "#ede9fe" });
              k.bar(secondX, y - 6, secondW, 12, row.fb, { max: 1, fill: GREEN, track: "#d1fae5" });
              k.label(barX, y + 16, row.note, { size: 9.5, color: "#6b7280" });
            });
            k.label(20, h - 12, "Illustrative emphasis, not measured data — the direction is the point.", {
              size: 10,
              color: GREY
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: the critical path ───────────────────────────── */

  function initCriticalPathStepper() {
    var host = document.getElementById("ix-critical-path");
    if (!host || !window.Interactive) return;

    var CRIT = "#7c3aed";
    var FLOATY = "#94a3b8";
    var GREEN = "#059669";
    var GREY_TEXT = "#64748b";

    /* The UniConnect release: WBS code, duration in weeks, and the ES/EF/LS/LF
     * from the forward and backward pass worked on the page. */
    var NODES = [
      { id: "1.1", d: 1, x: 0.07, y: 0.5, es: 0, ef: 1, ls: 0, lf: 1 },
      { id: "1.2", d: 2, x: 0.235, y: 0.5, es: 1, ef: 3, ls: 1, lf: 3 },
      { id: "1.3.1", d: 3, x: 0.44, y: 0.22, es: 3, ef: 6, ls: 4, lf: 7 },
      { id: "1.3.2", d: 2, x: 0.44, y: 0.74, es: 3, ef: 5, ls: 3, lf: 5 },
      { id: "1.3.3", d: 2, x: 0.625, y: 0.74, es: 5, ef: 7, ls: 5, lf: 7 },
      { id: "1.4.1", d: 4, x: 0.79, y: 0.5, es: 7, ef: 11, ls: 7, lf: 11 },
      { id: "1.4.2", d: 1, x: 0.93, y: 0.5, es: 11, ef: 12, ls: 11, lf: 12 }
    ];
    var EDGES = [
      [0, 1], [1, 2], [1, 3], [3, 4], [2, 5], [4, 5], [5, 6]
    ];

    function place(w, h, overrides) {
      var bw = boxWidth(w, 104);
      var bh = 58;
      var top = 26;
      var usable = h - top - 34;
      return NODES.map(function (n) {
        var o = (overrides && overrides[n.id]) || {};
        return {
          id: n.id,
          d: o.d == null ? n.d : o.d,
          x: n.x * w,
          y: top + n.y * usable,
          es: o.es == null ? n.es : o.es,
          ef: o.ef == null ? n.ef : o.ef,
          ls: o.ls == null ? n.ls : o.ls,
          lf: o.lf == null ? n.lf : o.lf,
          bw: bw,
          bh: bh
        };
      });
    }

    function paintNetwork(k, w, h, opts) {
      opts = opts || {};
      var pts = place(w, h, opts.overrides);
      var byId = {};
      pts.forEach(function (p) {
        byId[p.id] = p;
      });
      EDGES.forEach(function (e) {
        var a = pts[e[0]];
        var b = pts[e[1]];
        var dim = opts.dimEdges && opts.dimEdges.indexOf(e.join("-")) !== -1;
        k.arrow(a.x, a.y, b.x, b.y, {
          color: dim ? "rgba(148,163,184,0.45)" : "rgba(124,58,237,0.55)",
          lw: dim ? 1.3 : 1.9,
          dash: dim ? [4, 4] : null
        });
      });
      pts.forEach(function (p) {
        var deferred = opts.deferred && opts.deferred.indexOf(p.id) !== -1;
        var critical = opts.critical && opts.critical.indexOf(p.id) !== -1;
        var fill = deferred ? "#f1f5f9" : critical ? "#ede9fe" : "#ffffff";
        var stroke = deferred ? FLOATY : critical ? CRIT : "#cbd5e1";
        if (opts.floatHighlight === p.id) {
          k.highlight(p.x - p.bw / 2 - 5, p.y - p.bh / 2 - 5, p.bw + 10, p.bh + 10, { color: GREEN, lw: 2.2 });
        }
        k.box(p.x - p.bw / 2, p.y - p.bh / 2, p.bw, p.bh, { fill: fill, stroke: stroke, lw: 2, r: 9 });
        k.label(p.x, p.y - 20, p.id, { align: "center", size: 12, mono: true, color: deferred ? GREY_TEXT : "#4c1d95" });
        k.label(p.x, p.y - 4, "d = " + p.d + "w", { align: "center", size: 10, color: "#6b7280" });
        if (opts.showEarly) {
          k.label(p.x - p.bw / 2 + 8, p.y + 13, "ES " + p.es, { size: 9.5, color: "#334155" });
          k.label(p.x + p.bw / 2 - 8, p.y + 13, "EF " + p.ef, { size: 9.5, color: "#334155", align: "right" });
        }
        if (opts.showLate) {
          k.label(p.x - p.bw / 2 + 8, p.y + 26, "LS " + p.ls, { size: 9.5, color: CRIT });
          k.label(p.x + p.bw / 2 - 8, p.y + 26, "LF " + p.lf, { size: 9.5, color: CRIT, align: "right" });
        }
        if (opts.floatFor && opts.floatFor.indexOf(p.id) !== -1) {
          k.label(p.x, p.y + p.bh / 2 + 14, "TF = " + (p.ls - p.es) + "w", {
            align: "center",
            size: 10,
            color: GREEN
          });
        }
      });
      if (opts.note) {
        k.label(20, h - 10, opts.note, { size: 10.5, color: opts.noteColor || "#565d75" });
      }
      return byId;
    }

    var FULL_CP = ["1.1", "1.2", "1.3.2", "1.3.3", "1.4.1", "1.4.2"];

    window.Interactive.stepper("ix-critical-path", {
      title: "Critical path on the UniConnect release",
      subtitle: "Seven work packages, a 12-week deadline and one week of float — the arithmetic from the table above, animated.",
      titleZh: "UniConnect 版本的关键路径",
      subtitleZh: "七个工作包、12 周截止期限与一周浮动——把上表的算术动画化。",
      height: 300,
      frames: [
        {
          title: "1. Decompose and sequence",
          caption: "Each box is a work package with its WBS code and duration. Arrows are dependencies: 1.4.1 testing waits for both build packages before it can start.",
          titleZh: "1. 分解并排序",
          captionZh: "每个方框是一个工作包，标注 WBS 编号与工期。箭头表示依赖关系：1.4.1 测试需要等待两个构建包都完成才能开始。",
          draw: function (ctx, w, h, k) {
            k.clear();
            paintNetwork(k, w, h, { note: "duration in weeks   ·   no dates computed yet" });
          }
        },
        {
          title: "2. Forward pass — ES and EF",
          caption: "Start at zero and add durations. Where two paths meet, the later one wins: ES(1.4.1) = max(EF 1.3.1 = 6, EF 1.3.3 = 7) = 7. The project duration is max EF = 12 weeks.",
          titleZh: "2. 正推法——ES 与 EF",
          captionZh: "从 0 开始累加工期。两条路径汇合时取较晚者：ES(1.4.1) = max(EF 1.3.1 = 6, EF 1.3.3 = 7) = 7。项目工期为最大的 EF，即 12 周。",
          draw: function (ctx, w, h, k) {
            k.clear();
            paintNetwork(k, w, h, {
              showEarly: true,
              critical: FULL_CP,
              note: "ES / EF on every box   ·   project duration T = 12 weeks"
            });
          }
        },
        {
          title: "3. Backward pass — LF and LS",
          caption: "Set LF(1.4.2) = 12 and work right to left, subtracting durations. Where successors diverge, the earliest LS wins: LF(1.2) = min(LS 1.3.1 = 4, LS 1.3.2 = 3) = 3.",
          titleZh: "3. 逆推法——LF 与 LS",
          captionZh: "令 LF(1.4.2) = 12，自右向左减去工期。后继分叉时取最早的 LS：LF(1.2) = min(LS 1.3.1 = 4, LS 1.3.2 = 3) = 3。",
          draw: function (ctx, w, h, k) {
            k.clear();
            paintNetwork(k, w, h, {
              showEarly: true,
              showLate: true,
              note: "LS / LF added in purple   ·   late dates never precede early dates"
            });
          }
        },
        {
          title: "4. Float — where the slack lives",
          caption: "TF = LS − ES = LF − EF. Six of the seven packages have zero total float. Only 1.3.1, the timetable build, has TF = 1 week, and its free float is also 1 week.",
          titleZh: "4. 浮动——余量在哪里",
          captionZh: "TF = LS − ES = LF − EF。七个工作包中有六个总浮动为零。只有 1.3.1（课表构建）的 TF = 1 周，其自由浮动同样是 1 周。",
          draw: function (ctx, w, h, k) {
            k.clear();
            paintNetwork(k, w, h, {
              showEarly: true,
              showLate: true,
              floatFor: ["1.3.1"],
              floatHighlight: "1.3.1",
              critical: FULL_CP,
              note: "one week of cushion in the whole schedule",
              noteColor: GREEN
            });
          }
        },
        {
          title: "5. The critical path",
          caption: "1.1 → 1.2 → 1.3.2 → 1.3.3 → 1.4.1 → 1.4.2 has length 1 + 2 + 2 + 2 + 4 + 1 = 12 weeks. Every activity on it has zero float, so every week lost here is a week lost to the project.",
          titleZh: "5. 关键路径",
          captionZh: "1.1 → 1.2 → 1.3.2 → 1.3.3 → 1.4.1 → 1.4.2 的长度为 1 + 2 + 2 + 2 + 4 + 1 = 12 周。路径上每个活动的浮动均为零，因此此处损失一周就是项目损失一周。",
          draw: function (ctx, w, h, k) {
            k.clear();
            paintNetwork(k, w, h, {
              showEarly: true,
              critical: FULL_CP,
              floatFor: ["1.3.1"],
              note: "critical path = 12 weeks   ·   1.3.1 has 1 week of float",
              noteColor: CRIT
            });
          }
        },
        {
          title: "6. Compress to eight weeks (tutorial Change B)",
          caption: "Defer 1.3.3 and its path disappears, but the timetable build loses its float too, so T falls only from 12 to 11. A second test stream halves 1.4.1 (−2) and an extra contractor takes 1.3.1 from 3 weeks to 2 (−1). Four weeks, three actions.",
          titleZh: "6. 压缩到八周（辅导课变更 B）",
          captionZh: "推迟 1.3.3 后该路径消失，但课表构建也随之失去浮动，因此 T 只从 12 降到 11。第二条测试流使 1.4.1 减半（−2），再增派一名承包方把 1.3.1 从 3 周压到 2 周（−1）。四周，三个动作。",
          draw: function (ctx, w, h, k) {
            k.clear();
            paintNetwork(k, w, h, {
              showEarly: true,
              deferred: ["1.3.3"],
              critical: ["1.1", "1.2", "1.3.1", "1.3.2", "1.4.1", "1.4.2"],
              dimEdges: ["3-4", "4-5"],
              overrides: {
                "1.3.1": { d: 2, es: 3, ef: 5, ls: 3, lf: 5 },
                "1.3.2": { es: 3, ef: 5, ls: 3, lf: 5 },
                "1.4.1": { d: 2, es: 5, ef: 7, ls: 5, lf: 7 },
                "1.4.2": { es: 7, ef: 8, ls: 7, lf: 8 }
              },
              note: "12 − 1 (defer 1.3.3) − 2 (crash 1.4.1) − 1 (crash 1.3.1) = 8 weeks",
              noteColor: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: earned value curves ─────────────────────────── */

  function initEvmStepper() {
    var host = document.getElementById("ix-evm-curves");
    if (!host || !window.Interactive) return;

    var ACCENT = "#7c3aed";
    var GREEN = "#059669";
    var RED = "#dc2626";
    var GREY = "#94a3b8";

    var BAC = 180000;
    var MAXC = 240000;
    var WEEKS = 12;

    function axes(ctx, w, h, k) {
      var ox = 62;
      var oy = h - 40;
      var ax = w - 24;
      var ay = 22;
      k.arrow(ox, oy, ax, oy, { color: GREY, lw: 1.4 });
      k.arrow(ox, oy, ox, ay, { color: GREY, lw: 1.4 });
      var i;
      for (i = 0; i <= WEEKS; i += 2) {
        k.label(ox + ((ax - ox) * i) / WEEKS, oy + 14, String(i), { align: "center", size: 9.5, color: "#6b7280" });
      }
      for (i = 0; i <= 4; i++) {
        var v = i * 60000;
        k.label(ox - 8, oy - ((oy - ay) * v) / MAXC, "$" + v / 1000 + "k", {
          align: "right",
          size: 9.5,
          color: "#6b7280"
        });
      }
      k.label(ox, ay - 8, "cost", { size: 10, color: "#6b7280" });
      k.label(ax, oy + 30, "weeks", { align: "right", size: 10, color: "#6b7280" });
      return { ox: ox, oy: oy, ax: ax, ay: ay };
    }

    function px(g, week) {
      return g.ox + ((g.ax - g.ox) * week) / WEEKS;
    }

    function py(g, value) {
      return g.oy - ((g.oy - g.ay) * value) / MAXC;
    }

    function line(ctx, g, x1, v1, x2, v2, color, dash, lw) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = lw || 2.4;
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(px(g, x1), py(g, v1));
      ctx.lineTo(px(g, x2), py(g, v2));
      ctx.stroke();
      ctx.restore();
    }

    window.Interactive.stepper("ix-evm-curves", {
      title: "PV, EV and AC on the UniConnect release",
      subtitle: "The same three measurements apply whether the work runs in phases, in sprints or as a continuous flow.",
      titleZh: "UniConnect 版本的 PV、EV 与 AC",
      subtitleZh: "无论工作按阶段、按冲刺还是持续流动推进，度量方式都相同。",
      height: 300,
      frames: [
        {
          title: "1. The baseline: planned value",
          caption: "BAC = $180,000 over 12 weeks is $15,000 per week, so PV at week 6 is $90,000. PV is what the schedule says should have been earned by now.",
          titleZh: "1. 基线：计划价值",
          captionZh: "BAC = 180,000 美元、工期 12 周，即每周 15,000 美元，因此第 6 周的 PV 为 90,000 美元。PV 表示按进度此刻本应挣得多少价值。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = axes(ctx, w, h, k);
            line(ctx, g, 0, 0, 12, BAC, ACCENT, null, 2.6);
            line(ctx, g, 0, BAC, 12, BAC, GREY, [5, 5], 1.6);
            k.label(px(g, 12) - 6, py(g, BAC) - 12, "BAC $180k", { align: "right", size: 10.5, color: "#4c1d95" });
            k.label(px(g, 6) + 8, py(g, 90000) - 6, "PV(6) = $90k", { size: 11, color: ACCENT });
            k.dot(px(g, 6), py(g, 90000), 5, { fill: ACCENT, stroke: "#ffffff", lw: 1.6 });
          }
        },
        {
          title: "2. EV — the budget you have actually earned",
          caption: "At week 6 only $81,000 of the budget has been earned, so SV = EV − PV = 81,000 − 90,000 = −$9,000: behind schedule, measured in money.",
          titleZh: "2. EV——实际挣得的预算",
          captionZh: "到第 6 周只挣得 81,000 美元，因此 SV = EV − PV = 81,000 − 90,000 = −9,000 美元，即以金额衡量的进度落后。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = axes(ctx, w, h, k);
            line(ctx, g, 0, 0, 12, BAC, "rgba(124,58,237,0.35)", [6, 5], 1.8);
            line(ctx, g, 0, 0, 6, 81000, GREEN, null, 2.6);
            line(ctx, g, 6, 81000, 6, 90000, RED, [4, 4], 2);
            k.label(px(g, 6) + 10, py(g, 81000) - 6, "EV(6) = $81k", { size: 11, color: GREEN });
            k.label(px(g, 6) + 12, (py(g, 81000) + py(g, 90000)) / 2, "SV = −$9k", { size: 10.5, color: RED });
            k.dot(px(g, 6), py(g, 81000), 5, { fill: GREEN, stroke: "#ffffff", lw: 1.6 });
          }
        },
        {
          title: "3. AC — what it actually cost",
          caption: "$99,000 has been spent to earn $81,000, so CV = EV − AC = −$18,000. The gap between EV and AC is the over-run; the gap between EV and PV is the delay.",
          titleZh: "3. AC——实际花费",
          captionZh: "为了挣得 81,000 美元已花费 99,000 美元，因此 CV = EV − AC = −18,000 美元。EV 与 AC 之间的差距是超支，EV 与 PV 之间的差距是延误。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = axes(ctx, w, h, k);
            line(ctx, g, 0, 0, 12, BAC, "rgba(124,58,237,0.3)", [6, 5], 1.8);
            line(ctx, g, 0, 0, 6, 81000, GREEN, null, 2.4);
            line(ctx, g, 0, 0, 6, 99000, RED, null, 2.6);
            line(ctx, g, 6, 81000, 6, 99000, RED, [4, 4], 2);
            k.label(px(g, 6) + 10, py(g, 99000) + 12, "AC(6) = $99k", { size: 11, color: RED });
            k.label(px(g, 6) + 12, (py(g, 81000) + py(g, 99000)) / 2, "CV = −$18k", { size: 10.5, color: RED });
            k.dot(px(g, 6), py(g, 99000), 5, { fill: RED, stroke: "#ffffff", lw: 1.6 });
          }
        },
        {
          title: "4. The indices: CPI and SPI",
          caption: "CPI = 81,000 / 99,000 = 0.82: each dollar of earned value cost about $1.22. SPI = 81,000 / 90,000 = 0.90: work is being earned at 90% of the planned rate.",
          titleZh: "4. 指数：CPI 与 SPI",
          captionZh: "CPI = 81,000 / 99,000 = 0.82：每挣得 1 美元价值约花费 1.22 美元。SPI = 81,000 / 90,000 = 0.90：挣值速度只有计划的 90%。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = axes(ctx, w, h, k);
            line(ctx, g, 0, 0, 6, 90000, "rgba(124,58,237,0.45)", [5, 4], 2);
            line(ctx, g, 0, 0, 6, 81000, GREEN, null, 2.6);
            line(ctx, g, 0, 0, 6, 99000, RED, null, 2.6);
            k.label(20, 26, "CPI = EV / AC = 0.82", { size: 12, color: RED });
            k.label(20, 46, "SPI = EV / PV = 0.90", { size: 12, color: ACCENT });
            k.bar(w - 190, 20, 150, 12, 0.82, { max: 1, fill: RED, track: "#f1f5f9" });
            k.label(w - 188, 48, "cost efficiency 0.82", { size: 10, color: "#6b7280" });
            k.bar(w - 190, 62, 150, 12, 0.9, { max: 1, fill: ACCENT, track: "#f1f5f9" });
            k.label(w - 188, 90, "schedule efficiency 0.90", { size: 10, color: "#6b7280" });
            k.label(20, h - 12, "below 1.00 is bad on both indices, for different reasons", { size: 10.5, color: "#565d75" });
          }
        },
        {
          title: "5. Forecast: EAC, VAC and TCPI",
          caption: "EAC = BAC / CPI = 180,000 / 0.82 = $220,000, so VAC = −$40,000. TCPI = (BAC − EV) / (BAC − AC) = 99,000 / 81,000 = 1.22: the remaining work would need 122% efficiency to land on budget.",
          titleZh: "5. 预测：EAC、VAC 与 TCPI",
          captionZh: "EAC = BAC / CPI = 180,000 / 0.82 = 220,000 美元，故 VAC = −40,000 美元。TCPI = (BAC − EV) / (BAC − AC) = 99,000 / 81,000 = 1.22：剩余工作需达到 122% 的效率才能守住预算。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = axes(ctx, w, h, k);
            line(ctx, g, 0, 0, 6, 99000, RED, null, 2.4);
            line(ctx, g, 6, 99000, 12, 220000, RED, [7, 5], 2.4);
            line(ctx, g, 0, BAC, 12, BAC, ACCENT, [5, 5], 1.8);
            line(ctx, g, 12, BAC, 12, 220000, GREEN, [4, 4], 2);
            k.label(px(g, 12) - 8, py(g, 220000) - 12, "EAC $220k", { align: "right", size: 11, color: RED });
            k.label(px(g, 12) - 8, py(g, BAC) + 14, "BAC $180k", { align: "right", size: 10.5, color: "#4c1d95" });
            k.label(px(g, 12) - 18, (py(g, BAC) + py(g, 220000)) / 2, "VAC = −$40k", { align: "right", size: 10.5, color: GREEN });
            k.label(20, 26, "TCPI = 1.22", { size: 12, color: GREEN });
            k.label(20, h - 12, "the forecast assumes the efficiency achieved so far continues", { size: 10.5, color: "#565d75" });
          }
        }
      ]
    });
  }
})();
