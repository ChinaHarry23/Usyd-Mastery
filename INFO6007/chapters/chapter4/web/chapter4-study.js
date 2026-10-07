(function () {
  "use strict";

  /* INFO6007 — Week 4 (Cost Management) page behaviour.
   *
   * The declarative widgets (pipeline, matcher, hotspot, sequence, race,
   * timeline, deck) are mounted by shared/interactive.js from the JSON config
   * blocks in the page. This file owns the four animated canvas steppers and
   * the re-binding that a language swap requires:
   *
   *   ix-baseline       study page  — estimates → baseline → time-phased PV
   *   ix-evm-curves     study page  — PV / EV / AC over six months, then EAC
   *   ix-critical-path  math page   — the tutorial's AON chain, 17 → 19 weeks
   *   ix-evm-bars       math page   — the $100,000 example, step by step
   *
   * Each initialiser guards on its host element, so the math page can load the
   * same script without mounting the study page's widgets.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initSteppers();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every widget and
   * every quick-check inside a translated section is a brand-new node. Re-mount
   * the widgets, re-create the canvas steppers and re-run the chrome bindings;
   * the sidebar toggle lives outside any section, so its old listener is
   * dropped first to avoid double-binding. */
  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    initSteppers();
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
        window.console.error("[INFO6007 chapter 4] chapter chrome failed to initialise:", err);
      }
    }
  }

  function host(id) {
    var node = document.getElementById(id);
    if (!node || !window.Interactive) return null;
    return node;
  }

  function initSteppers() {
    initBaselineStepper();
    initEvmCurvesStepper();
    initCriticalPathStepper();
    initEvmBarsStepper();
  }

  /* ── Shared colour words, so all four steppers read as one family ── */

  var C = {
    pv: "#7c3aed",
    ev: "#059669",
    ac: "#dc2626",
    plan: "#94a3b8",
    ink: "#141826",
    muted: "#565d75",
    soft: "#f1eefb",
    band: "#ede9fe",
    warn: "#f59e0b"
  };

  /* Draw a polyline through [ [x,y], … ] without filling. */
  function line(ctx, pts, color, width, dash) {
    if (pts.length < 2) return;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 2;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
    ctx.restore();
  }

  /* Draw a vertical measuring gap with a label — used for CV and SV. */
  function gap(ctx, k, x, y1, y2, text, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
    ctx.restore();
    k.label(x + 8, (y1 + y2) / 2, text, { size: 11, color: color, weight: "700" });
  }

  /* ── Stepper 1: from estimates to a time-phased baseline ────────── */

  function initBaselineStepper() {
    var el = host("ix-baseline");
    if (!el) return;

    window.Interactive.stepper("ix-baseline", {
      title: "From work-package estimates to a time-phased baseline",
      titleZh: "从工作包估算到按时间分布的基准",
      subtitle: "Illustrative figures scaled to the NSW Digital Driver Licence project's publicly reported $16.3m budget.",
      subtitleZh: "数值为示意，按新州数字驾照项目公开披露的 $16.3m 预算缩放。",
      height: 250,
      frames: [
        {
          title: "1. Roll the work packages up",
          titleZh: "1. 将工作包自下而上汇总",
          caption: "Bottom-up estimating: each work package carries its own staff, supplier, technology and assurance cost. The four estimates add to a $14.8m base.",
          captionZh: "自下而上估算：每个工作包各自承担人员、供应商、技术与保障成本，四项相加得到 $14.8m 的估算基数。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var items = [
              ["App development", 6.2],
              ["System integration", 3.9],
              ["Security & assurance", 2.4],
              ["Trials & rollout", 2.3]
            ];
            var left = 28;
            var top = 46;
            var rowH = 30;
            var barMax = w - left - 150;
            items.forEach(function (it, i) {
              var y = top + i * rowH;
              k.label(left, y + 8, it[0], { size: 11.5, color: C.muted });
              k.bar(left + 140, y, barMax * 0.72, 15, it[1], { max: 6.5, fill: C.pv, track: C.soft });
              k.label(left + 148 + barMax * 0.72, y + 8, "$" + it[1].toFixed(1) + "m", {
                size: 11,
                mono: true,
                color: C.ink
              });
            });
            k.box(left, top + 4 * rowH + 4, w - left - 28, 34, { fill: C.band, stroke: C.pv, lw: 1.5, r: 9 });
            k.label(left + 12, top + 4 * rowH + 21, "Estimate base = $14.8m", {
              size: 12.5,
              weight: "700",
              color: "#5b21b6"
            });
          }
        },
        {
          title: "2. Add the contingency reserve",
          titleZh: "2. 加上应急储备",
          caption: "Contingency covers risk that was identified and partially planned for, so it sits inside the baseline. At 10% of the estimate base it adds $1.48m.",
          captionZh: "应急储备用于已识别并可部分预见的风险，因此包含在基准之内。按估算基数的 10% 计算，增加 $1.48m。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var left = 28;
            var top = 52;
            var barW = w - left - 150;
            k.label(left, top + 8, "Cost estimates", { size: 11.5, color: C.muted });
            k.bar(left + 140, top, barW * 0.72, 16, 14.8, { max: 17, fill: C.pv, track: C.soft });
            k.label(left + 148 + barW * 0.72, top + 8, "$14.8m", { size: 11, mono: true });

            k.label(left, top + 46, "Contingency 10%", { size: 11.5, color: C.muted });
            k.bar(left + 140, top + 38, barW * 0.72, 16, 1.48, { max: 17, fill: C.warn, track: C.soft });
            k.label(left + 148 + barW * 0.72, top + 46, "$1.48m", { size: 11, mono: true });

            k.box(left, top + 78, w - left - 28, 40, { fill: C.band, stroke: C.pv, lw: 1.6, r: 10 });
            k.label(left + 12, top + 98, "Cost baseline = $16.28m ≈ the $16.3m publicly reported budget", {
              size: 12,
              weight: "700",
              color: "#5b21b6"
            });
            k.label(left, h - 16, "Benchmark check: is the base inside the $150–$250 per migrated user range?", {
              size: 10.5,
              color: C.muted
            });
          }
        },
        {
          title: "3. Management reserve sits on top",
          titleZh: "3. 管理储备位于基准之上",
          caption: "The management reserve answers unpredictable situations, so it is not part of the baseline: baseline + management reserve = total project budget, released only by management.",
          captionZh: "管理储备应对不可预见的情形，因此不属于基准：基准 + 管理储备 = 项目总预算，且只能由管理层批准动用。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var left = 40;
            var base = h - 56;
            var colW = 92;
            var gapX = 30;
            var heights = [104, 62, 40];
            var labels = ["Cost estimates", "Contingency", "Total budget"];
            var values = ["$14.8m", "$1.48m", "$16.28m+"];
            var colors = [C.pv, C.warn, C.ev];
            for (var i = 0; i < 3; i++) {
              var x = left + i * (colW + gapX);
              k.box(x, base - heights[i], colW, heights[i], {
                fill: i === 2 ? "rgba(5,150,105,0.12)" : "rgba(124,58,237,0.12)",
                stroke: colors[i],
                lw: 1.8,
                r: 8
              });
              k.label(x + colW / 2, base - heights[i] - 12, values[i], {
                align: "center",
                size: 11.5,
                mono: true,
                color: colors[i]
              });
              k.label(x + colW / 2, base + 16, labels[i], { align: "center", size: 11, color: C.muted });
            }
            var xr = left + 3 * (colW + gapX) + 10;
            k.highlight(xr, base - 190, w - xr - 30, 190, { color: C.ev, lw: 2, dash: [6, 5], r: 10 });
            k.label(xr + 14, base - 166, "Management reserve", { size: 12, weight: "700", color: C.ev });
            k.label(xr + 14, base - 144, "unpredictable risk", { size: 11, color: C.muted });
            k.label(xr + 14, base - 120, "outside the baseline,", { size: 11, color: C.muted });
            k.label(xr + 14, base - 98, "inside the total budget", { size: 11, color: C.muted });
            k.label(xr + 14, base - 62, "not disclosed for this", { size: 10.5, color: C.muted });
            k.label(xr + 14, base - 42, "project — say so rather", { size: 10.5, color: C.muted });
            k.label(xr + 14, base - 22, "than inventing a figure", { size: 10.5, color: C.muted });
          }
        },
        {
          title: "4. Time-phase it and you have Planned Value",
          titleZh: "4. 按时间分布后就得到计划价值",
          caption: "Scheduling the baseline across the delivery phases produces cumulative PV — the line every future earned value comparison is measured against.",
          captionZh: "将基准按交付阶段排布，得到累计 PV——之后所有挣值比较都以这条线为基准。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var left = 54;
            var right = 26;
            var top = 34;
            var bottom = h - 40;
            var months = ["Build 1", "Build 2", "Trials", "Rollout 1", "Rollout 2", "Close"];
            var cum = [2.1, 5.4, 8.9, 12.0, 14.9, 16.3];
            var xAt = function (i) {
              return left + ((w - left - right) * i) / (cum.length - 1);
            };
            var yAt = function (v) {
              return bottom - (bottom - top) * (v / 18);
            };
            [0, 6, 12, 18].forEach(function (v) {
              k.label(left - 10, yAt(v), "$" + v + "m", { align: "right", size: 10.5, mono: true, color: C.muted });
              k.box(left, yAt(v) - 0.5, w - left - right, 1, { fill: "rgba(148,163,184,0.35)" });
            });
            var pts = cum.map(function (v, i) {
              return [xAt(i), yAt(v)];
            });
            line(ctx, pts, C.pv, 2.6);
            pts.forEach(function (p, i) {
              k.dot(p[0], p[1], 4.5, { fill: "#ffffff", stroke: C.pv, lw: 2 });
              k.label(p[0], p[1] - 14, "$" + cum[i].toFixed(1) + "m", {
                align: "center",
                size: 10,
                mono: true,
                color: C.pv
              });
              k.label(p[0], bottom + 16, months[i], { align: "center", size: 10, color: C.muted });
            });
            k.label(w - right, top - 12, "cumulative PV", { align: "right", size: 11.5, weight: "700", color: C.pv });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: the PV / EV / AC curves, then the forecast ──────── */

  function initEvmCurvesStepper() {
    var el = host("ix-evm-curves");
    if (!el) return;

    /* Lecture case study (online student portal): PV is given month by month;
     * EV and AC follow the case's end-of-month-3 position (PV 85k, EV 80k,
     * AC 85k) and then run to a finish at the CPI-based forecast. */
    var PV = [0, 20, 55, 85, 120, 150, 180];
    var EV = [0, 18, 50, 80, 112, 145, 180];
    var AC = [0, 21, 54, 85, 120, 152, 191];

    window.Interactive.stepper("ix-evm-curves", {
      title: "PV, EV and AC on one picture",
      titleZh: "把 PV、EV、AC 画在同一张图上",
      subtitle: "The lecture's student portal case: six months, a $180,000 plan, and a cost position read at the end of month 3.",
      subtitleZh: "讲义中的学生门户案例：为期六个月、计划 $180,000，在第 3 个月末读取成本状况。",
      height: 290,
      frames: [
        {
          title: "1. The plan — Planned Value",
          titleZh: "1. 计划——计划价值（PV）",
          caption: "PV is the time-phased cost baseline: what the project planned to have bought by each date. By the end of month 3 the plan says $85,000 of work should be complete.",
          captionZh: "PV 是按时间分布的成本基准：截至各日期计划应完成的价值。到第 3 个月末，计划应完成 $85,000 的工作量。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = chart(w, h, k);
            curve(ctx, k, g, PV, C.pv);
            mark(g, k, g.x(3), g.y(85), "PV $85,000", C.pv);
          }
        },
        {
          title: "2. The progress — Earned Value",
          titleZh: "2. 进展——挣值（EV）",
          caption: "EV is the budgeted cost of the work actually completed. At month 3 it is $80,000, so SV = EV − PV = −$5,000: the project is behind schedule.",
          captionZh: "EV 是实际完成工作的预算成本。第 3 个月为 $80,000，因此 SV = EV − PV = −$5,000：项目进度落后。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = chart(w, h, k);
            curve(ctx, k, g, PV, C.pv);
            curve(ctx, k, g, EV, C.ev);
            gap(ctx, k, g.x(3) + 16, g.y(80), g.y(85), "SV −$5,000", C.warn);
            mark(g, k, g.x(3), g.y(80), "EV $80,000", C.ev);
          }
        },
        {
          title: "3. The invoice — Actual Cost",
          titleZh: "3. 实际支出——实际成本（AC）",
          caption: "AC is the real expenditure for the work performed. At month 3 it is $85,000, so CV = EV − AC = −$5,000: the project is also over budget.",
          captionZh: "AC 是为已完成工作真实发生的支出。第 3 个月为 $85,000，因此 CV = EV − AC = −$5,000：项目同时超支。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = chart(w, h, k);
            curve(ctx, k, g, PV, C.pv);
            curve(ctx, k, g, EV, C.ev);
            curve(ctx, k, g, AC, C.ac);
            mark(g, k, g.x(3), g.y(85), "AC $85,000", C.ac);
          }
        },
        {
          title: "4. Read the gaps, not the balances",
          titleZh: "4. 看差距，而不是看余额",
          caption: "Two gaps at month 3 tell the whole story: EV below PV is schedule slippage, EV below AC is cost overrun. CPI and SPI are those same gaps expressed as ratios — 0.94 and 0.94.",
          captionZh: "第 3 个月的两处差距说明了一切：EV 低于 PV 是进度落后，EV 低于 AC 是成本超支。CPI 与 SPI 就是这两个差距的比值——0.94 与 0.94。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = chart(w, h, k);
            curve(ctx, k, g, PV, C.pv);
            curve(ctx, k, g, EV, C.ev);
            curve(ctx, k, g, AC, C.ac);
            gap(ctx, k, g.x(3) + 14, g.y(80), g.y(85), "CV −$5,000", C.ac);
            gap(ctx, k, g.x(3) - 14, g.y(80), g.y(85), "SV −$5,000", C.warn);
            k.label(g.x(3), g.y(85) - 26, "month 3 review", { align: "center", size: 11.5, weight: "700", color: C.ink });
            k.label(g.x(3), g.y(85) - 10, "CPI 0.94  •  SPI 0.94", { align: "center", size: 11, mono: true, color: C.muted });
          }
        },
        {
          title: "5. Then forecast: EAC",
          titleZh: "5. 然后预测：完工估算（EAC）",
          caption: "If the current cost performance continues, EAC = BAC ÷ CPI = $180,000 ÷ 0.94 = $191,250, so VAC = −$11,250. The forecast is visible months before the overrun lands.",
          captionZh: "若当前成本绩效持续，EAC = BAC ÷ CPI = $180,000 ÷ 0.94 = $191,250，因此 VAC = −$11,250。超支在真正发生前数月就已可见。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = chart(w, h, k);
            curve(ctx, k, g, PV, C.pv);
            curve(ctx, k, g, EV, C.ev);
            curve(ctx, k, g, AC, C.ac);
            var yb = g.y(180);
            var ye = g.y(191);
            line(ctx, [[g.x(3), ye], [g.x(6), ye]], C.ac, 2, [6, 5]);
            k.label(g.x(6), ye - 14, "EAC $191,250", { align: "right", size: 11.5, mono: true, weight: "700", color: C.ac });
            k.label(g.x(6), yb - 14, "BAC $180,000", { align: "right", size: 11.5, mono: true, color: C.pv });
            gap(ctx, k, g.x(5.4), ye, yb, "VAC −$11,250", C.warn);
          }
        }
      ]
    });

    /* Chart scaffolding shared by all five frames. */
    function chart(w, h, k) {
      var left = 62;
      var right = 26;
      var top = 30;
      var bottom = h - 38;
      var max = 200;
      [0, 50, 100, 150, 200].forEach(function (v) {
        var y = bottom - (bottom - top) * (v / max);
        k.label(left - 10, y, "$" + v + "k", { align: "right", size: 10.5, mono: true, color: C.muted });
        k.box(left, y - 0.5, w - left - right, 1, { fill: "rgba(148,163,184,0.3)" });
      });
      for (var m = 0; m <= 6; m++) {
        k.label(left + ((w - left - right) * m) / 6, bottom + 16, "M" + m, {
          align: "center",
          size: 10,
          color: C.muted
        });
      }
      k.label(left, top - 12, "cumulative cost", { size: 10.5, color: C.muted });
      return {
        x: function (m) {
          return left + ((w - left - right) * m) / 6;
        },
        y: function (v) {
          return bottom - (bottom - top) * (v / max);
        }
      };
    }

    function curve(ctx, k, g, series, color) {
      var pts = series.map(function (v, i) {
        return [g.x(i), g.y(v)];
      });
      line(ctx, pts.slice(1), color, 2.6);
      k.label(g.x(6) - 4, g.y(series[6]) - 12, series === PV ? "PV" : series === EV ? "EV" : "AC", {
        align: "right",
        size: 11,
        mono: true,
        weight: "700",
        color: color
      });
    }

    function mark(g, k, x, y, text, color) {
      k.dot(x, y, 5.5, { fill: "#ffffff", stroke: color, lw: 2.2 });
      k.label(x + 10, y - 14, text, { size: 11, mono: true, weight: "700", color: color });
    }
  }

  /* ── Stepper 3: the tutorial's critical path ────────────────────── */

  function initCriticalPathStepper() {
    var el = host("ix-critical-path");
    if (!el) return;

    var ACTS = [
      { id: "A", name: "Requirements", weeks: 2 },
      { id: "B", name: "Design", weeks: 3 },
      { id: "C", name: "Development", weeks: 6 },
      { id: "D", name: "Testing", weeks: 4 },
      { id: "E", name: "Deployment", weeks: 2 }
    ];

    function nodeLayout(w, acts) {
      var pad = 22;
      var gapX = 26;
      var bw = Math.min(126, (w - pad * 2 - gapX * (acts.length - 1)) / acts.length);
      var total = bw * acts.length + gapX * (acts.length - 1);
      var start = Math.max(pad, (w - total) / 2);
      return acts.map(function (a, i) {
        return { a: a, x: start + i * (bw + gapX), w: bw, y: 96, h: 62 };
      });
    }

    function chain(ctx, k, w, acts, opts) {
      opts = opts || {};
      var nodes = nodeLayout(w, acts);
      var es = 0;
      nodes.forEach(function (n, i) {
        var ef = es + n.a.weeks;
        if (opts.forward) {
          k.label(n.x + n.w / 2, n.y - 26, "ES " + es + "  EF " + ef, {
            align: "center",
            size: 10.5,
            mono: true,
            color: C.muted
          });
        }
        var fill = "rgba(124,58,237,0.10)";
        var stroke = C.pv;
        if (opts.criticalPath) {
          fill = "rgba(5,150,105,0.14)";
          stroke = C.ev;
        }
        if (opts.slipped && n.a.id === "C") {
          fill = "rgba(245,158,11,0.20)";
          stroke = C.warn;
        }
        k.box(n.x, n.y, n.w, n.h, { fill: fill, stroke: stroke, lw: 2, r: 10 });
        k.label(n.x + 10, n.y + 16, n.a.id, { size: 11, mono: true, weight: "700", color: stroke });
        k.label(n.x + n.w / 2, n.y + 30, n.a.name, { align: "center", size: 11.5, weight: "600", color: C.ink });
        k.label(n.x + n.w / 2, n.y + 48, n.a.weeks + " wks", { align: "center", size: 11, mono: true, color: stroke });

        if (opts.backward) {
          var lf = opts.total - (opts.cum[i + 1] || opts.total) + opts.cum[i];
          k.label(n.x + n.w / 2, n.y + n.h + 26, "LS " + (lf - n.a.weeks) + "  LF " + lf, {
            align: "center",
            size: 10.5,
            mono: true,
            color: C.muted
          });
          k.label(n.x + n.w / 2, n.y + n.h + 44, "float 0", {
            align: "center",
            size: 10.5,
            mono: true,
            weight: "700",
            color: C.ev
          });
        }
        if (i < nodes.length - 1) {
          k.arrow(n.x + n.w, n.y + n.h / 2, nodes[i + 1].x - 3, n.y + n.h / 2, { color: C.plan, lw: 2 });
        }
        es = ef;
      });
      return nodes;
    }

    function cum(acts) {
      var out = [0];
      acts.forEach(function (a) {
        out.push(out[out.length - 1] + a.weeks);
      });
      return out;
    }

    window.Interactive.stepper("ix-critical-path", {
      title: "Critical path on the tutorial's activity-on-node chain",
      titleZh: "辅导课活动节点图上的关键路径",
      subtitle: "Requirements → Design → Development → Testing → Deployment. One chain, so every activity is critical — and any slip moves the project end date.",
      subtitleZh: "需求 → 设计 → 开发 → 测试 → 部署。只有一条链条，因此每项活动都是关键活动——任何延误都会推动项目结束日期。",
      height: 280,
      frames: [
        {
          title: "1. Draw the network",
          titleZh: "1. 画出网络图",
          caption: "Five activities with finish-to-start dependencies. Activity-on-node puts the work in the box and the dependency on the arrow.",
          captionZh: "五项活动，均为完成—开始依赖。活动在节点法把工作放在方框内，把依赖关系放在箭线上。",
          draw: function (ctx, w, h, k) {
            k.clear();
            chain(ctx, k, w, ACTS, {});
            k.label(w / 2, 216, "A → B → C → D → E", { align: "center", size: 12, mono: true, color: C.muted });
          }
        },
        {
          title: "2. Forward pass: earliest start and finish",
          titleZh: "2. 正推法：最早开始与最早完成",
          caption: "Start at day zero and add each duration. The earliest finish of the last activity is the shortest possible project duration: 2 + 3 + 6 + 4 + 2 = 17 weeks.",
          captionZh: "从第 0 周开始逐项累加工期。最后一项活动的最早完成时间就是项目最短工期：2 + 3 + 6 + 4 + 2 = 17 周。",
          draw: function (ctx, w, h, k) {
            k.clear();
            chain(ctx, k, w, ACTS, { forward: true });
            k.label(w / 2, 216, "total duration = 17 weeks", {
              align: "center",
              size: 12.5,
              mono: true,
              weight: "700",
              color: C.ink
            });
            k.box(22, 228, w - 44, 30, { fill: C.soft, stroke: C.pv, lw: 1.2, r: 9 });
            k.label(w / 2, 243, "EF of the last activity = project duration", {
              align: "center",
              size: 11,
              color: C.muted
            });
          }
        },
        {
          title: "3. Backward pass: latest start and finish",
          titleZh: "3. 逆推法：最晚开始与最晚完成",
          caption: "Working back from week 17, subtract durations. Total float is LS − ES, and here it is zero for every activity, because there is only one chain.",
          captionZh: "从第 17 周反向推算并逐项减去工期。总浮动时间 = LS − ES，本例中每项活动都是 0，因为只有唯一一条链条。",
          draw: function (ctx, w, h, k) {
            k.clear();
            chain(ctx, k, w, ACTS, { backward: true, total: 17, cum: cum(ACTS) });
            k.label(w / 2, 226, "float = LS − ES = 0 on every activity", {
              align: "center",
              size: 12.5,
              mono: true,
              weight: "700",
              color: C.ev
            });
          }
        },
        {
          title: "4. The critical path",
          titleZh: "4. 关键路径",
          caption: "The longest path is the critical path, and zero float means it cannot slip without moving the launch date. In a branching network only the longest path is highlighted this way.",
          captionZh: "最长的路径就是关键路径，零浮动意味着它一旦延误就会推迟上线日期。在存在分支的网络中，只有最长路径会被如此标出。",
          draw: function (ctx, w, h, k) {
            k.clear();
            chain(ctx, k, w, ACTS, { forward: true, criticalPath: true });
            k.label(w / 2, 216, "critical path: A → B → C → D → E", {
              align: "center",
              size: 12.5,
              weight: "700",
              color: C.ev
            });
            k.label(w / 2, 238, "zero float — delay here delays the project", {
              align: "center",
              size: 11,
              color: C.muted
            });
          }
        },
        {
          title: "5. Development slips to 8 weeks",
          titleZh: "5. 开发延长至 8 周",
          caption: "Development takes 8 weeks instead of 6. The critical path is unchanged — it is still the only chain — but the duration becomes 2 + 3 + 8 + 4 + 2 = 19 weeks.",
          captionZh: "开发由 6 周变为 8 周。关键路径不变——仍是唯一链条——但总工期变为 2 + 3 + 8 + 4 + 2 = 19 周。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var acts = ACTS.map(function (a) {
              return a.id === "C" ? { id: "C", name: "Development", weeks: 8 } : a;
            });
            chain(ctx, k, w, acts, { forward: true, slipped: true, criticalPath: false });
            k.label(w / 2, 216, "total duration = 19 weeks", {
              align: "center",
              size: 12.5,
              mono: true,
              weight: "700",
              color: C.warn
            });
          }
        },
        {
          title: "6. Two weeks of schedule is two weeks of cost",
          titleZh: "6. 两周工期就是两周成本",
          caption: "The slip hits the critical path, so it cannot be absorbed. Six people at 40 hours a week and $60/hour cost 2 × 6 × 40 × $60 = $28,800 before any re-planning — and the baseline now needs a change request.",
          captionZh: "延误发生在关键路径上，无法被浮动吸收。按 6 人、每周 40 小时、每小时 $60 计算，增加 2 × 6 × 40 × $60 = $28,800，尚未计入重新规划——而且基准现在需要变更申请。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var left = 90;
            var barW = w - left - 120;
            k.label(left - 12, 84, "17 weeks", { align: "right", size: 11.5, mono: true, color: C.pv });
            k.bar(left, 70, barW, 20, 17, { max: 20, fill: C.pv, track: C.soft });
            k.label(left - 12, 128, "19 weeks", { align: "right", size: 11.5, mono: true, color: C.warn });
            k.bar(left, 114, barW, 20, 19, { max: 20, fill: C.warn, track: C.soft });
            k.label(left + 8, 176, "extra direct cost ≈ $28,800", { size: 12.5, weight: "700", color: C.ink });
            k.label(left + 8, 198, "2 weeks × 6 people × 40 h × $60/h", { size: 11, mono: true, color: C.muted });
            k.label(left + 8, 224, "corrective options: add people (cost), descope (value), or re-baseline (approval)", {
              size: 11,
              color: C.muted
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 4: the $100,000 example, one calculation at a time ─── */

  function initEvmBarsStepper() {
    var el = host("ix-evm-bars");
    if (!el) return;

    window.Interactive.stepper("ix-evm-bars", {
      title: "The lecture's $100,000 example, step by step",
      titleZh: "讲义的 $100,000 例题，逐步计算",
      subtitle: "BAC $100,000 over six months; after two months the team is 30% complete against a 35% plan, and has spent $40,000.",
      subtitleZh: "BAC 为 $100,000、工期六个月；两个月后团队完成 30%（计划 35%），已支出 $40,000。",
      height: 270,
      frames: [
        {
          title: "1. Turn percentages into money",
          titleZh: "1. 把百分比换算成金额",
          caption: "EV = 30% × $100,000 = $30,000 and PV = 35% × $100,000 = $35,000. The gap is SV = EV − PV = −$5,000: behind schedule.",
          captionZh: "EV = 30% × $100,000 = $30,000，PV = 35% × $100,000 = $35,000。差距 SV = EV − PV = −$5,000：进度落后。",
          draw: function (ctx, w, h, k) {
            k.clear();
            bars(ctx, k, w, [
              { label: "PV (planned)", value: 35, color: C.pv },
              { label: "EV (earned)", value: 30, color: C.ev }
            ], "SV = EV − PV = −$5,000");
          }
        },
        {
          title: "2. Add what it actually cost",
          titleZh: "2. 加上真实支出",
          caption: "AC = $40,000. Now CV = EV − AC = −$10,000: the project is over budget by $10,000 on work worth $30,000.",
          captionZh: "AC = $40,000。此时 CV = EV − AC = −$10,000：完成价值 $30,000 的工作却超支 $10,000。",
          draw: function (ctx, w, h, k) {
            k.clear();
            bars(ctx, k, w, [
              { label: "PV (planned)", value: 35, color: C.pv },
              { label: "EV (earned)", value: 30, color: C.ev },
              { label: "AC (actual)", value: 40, color: C.ac }
            ], "CV = EV − AC = −$10,000");
          }
        },
        {
          title: "3. Ratios instead of differences",
          titleZh: "3. 用比值代替差值",
          caption: "CPI = EV ÷ AC = 0.75, so each $1 buys only $0.75 of value. SPI = EV ÷ PV = 0.857, so work is progressing at 85.7% of the planned rate. The dashed line is 1.00.",
          captionZh: "CPI = EV ÷ AC = 0.75，即每支出 $1 只换回 $0.75 的价值。SPI = EV ÷ PV = 0.857，即工作仅按计划速度的 85.7% 推进。虚线表示 1.00。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var left = 120;
            var barW = w - left - 130;
            var rows = [
              { label: "CPI = 0.75", value: 0.75, color: C.ac },
              { label: "SPI = 0.857", value: 0.857, color: C.warn }
            ];
            rows.forEach(function (r, i) {
              var y = 74 + i * 54;
              k.label(24, y + 10, r.label, { size: 12, mono: true, weight: "700", color: r.color });
              k.bar(left, y, barW, 20, r.value, { max: 1, fill: r.color, track: C.soft });
              k.label(left + barW + 10, y + 10, r.value.toFixed(2), { size: 11.5, mono: true, color: C.ink });
            });
            var xOne = left + barW;
            ctx.save();
            ctx.strokeStyle = C.muted;
            ctx.lineWidth = 1.6;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(xOne, 54);
            ctx.lineTo(xOne, 176);
            ctx.stroke();
            ctx.restore();
            k.label(xOne, 44, "1.00", { align: "center", size: 10.5, mono: true, color: C.muted });
            k.label(24, 212, "Both indexes below 1.00 → over budget and behind schedule", {
              size: 12,
              weight: "700",
              color: C.ink
            });
          }
        },
        {
          title: "4. Forecast the finish",
          titleZh: "4. 预测最终成本",
          caption: "With current cost performance continuing, EAC = BAC ÷ CPI = $100,000 ÷ 0.75 = $133,333. VAC = BAC − EAC = −$33,333: that is the overrun the sponsor will be asked to fund.",
          captionZh: "若当前成本绩效持续，EAC = BAC ÷ CPI = $100,000 ÷ 0.75 = $133,333。VAC = BAC − EAC = −$33,333：这就是需要向发起人申请的超支金额。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var left = 100;
            var barW = w - left - 140;
            k.label(left - 12, 78, "BAC", { align: "right", size: 12, mono: true, color: C.pv });
            k.bar(left, 64, barW, 22, 100, { max: 140, fill: C.pv, track: C.soft });
            k.label(left + barW * (100 / 140) + 10, 75, "$100,000", { size: 11.5, mono: true, color: C.pv });
            k.label(left - 12, 122, "EAC", { align: "right", size: 12, mono: true, color: C.ac });
            k.bar(left, 108, barW, 22, 133.333, { max: 140, fill: C.ac, track: C.soft });
            k.label(left + barW * (133.333 / 140) + 10, 119, "$133,333", { size: 11.5, mono: true, color: C.ac });
            k.highlight(left + barW * (100 / 140), 96, barW * (33.333 / 140), 46, { color: C.warn, lw: 2 });
            k.label(left, 172, "VAC = BAC − EAC = −$33,333", { size: 12.5, weight: "700", color: C.warn });
            k.label(left, 196, "ETC = EAC − AC = $133,333 − $40,000 = $93,333 still to spend", {
              size: 11.5,
              mono: true,
              color: C.muted
            });
          }
        }
      ]
    });

    /* Horizontal comparison bars for the first two frames. */
    function bars(ctx, k, w, rows, note) {
      var left = 148;
      var barW = w - left - 130;
      var max = 45;
      rows.forEach(function (r, i) {
        var y = 66 + i * 46;
        k.label(24, y + 11, r.label, { size: 11.5, color: C.muted });
        k.bar(left, y, barW, 22, r.value, { max: max, fill: r.color, track: C.soft });
        k.label(left + barW * (r.value / max) + 10, y + 11, "$" + (r.value * 1000).toLocaleString("en-AU"), {
          size: 11.5,
          mono: true,
          color: r.color
        });
      });
      k.label(24, 66 + rows.length * 46 + 24, note, { size: 12.5, weight: "700", color: C.ink });
      k.label(24, 66 + rows.length * 46 + 46, "scale: 0 to $45,000", { size: 10.5, color: C.muted });
    }
  }
})();
