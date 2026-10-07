(function () {
  "use strict";

  /* INFO6007 — Week 7 (Risk Management) page behaviour.
   *
   * This file is loaded by both chapter7-study.html and chapter7-math.html.
   * The declarative widgets (hotspot, sequence, pipeline, deck, timeline,
   * race, matcher) are mounted by shared/interactive.js from the JSON config
   * blocks in the pages. This file owns the five animated canvas steppers and
   * the re-binding that a language swap requires.
   *
   * Every stepper looks its host up by id and returns quietly when the id is
   * absent, so the same file can serve both pages.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initAppetiteStepper();
    initResponseStepsStepper();
    initRiskBurndownStepper();
    initEmvTreeStepper();
    initMonteCarloStepper();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every widget and
   * every quick-check inside a translated section is a brand-new node. The
   * shared module re-mounts the declarative widgets; we re-mount the canvas
   * steppers. The sidebar toggle lives outside any section, so its old
   * listener is dropped first to avoid double-binding. */
  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    initAppetiteStepper();
    initResponseStepsStepper();
    initRiskBurndownStepper();
    initEmvTreeStepper();
    initMonteCarloStepper();
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
        window.console.error("[INFO6007 chapter 7] chapter chrome failed to initialise:", err);
      }
    }
  }

  function host(id) {
    if (!window.Interactive || !window.Interactive.stepper) return null;
    var el = document.getElementById(id);
    if (!el || el.dataset.ixBound === "1") return null;
    el.dataset.ixBound = "1";
    return el;
  }

  /* Draw a smooth-enough curve by connecting closely spaced samples. The ctx
   * kit deliberately exposes only primitives, so polylines are drawn as many
   * short arrows, which keeps the arrow-head logic out of the way by passing
   * head: 0.
   */
  function polyline(k, pts, opts) {
    for (var i = 1; i < pts.length; i++) {
      k.arrow(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], {
        color: opts.color,
        lw: opts.lw || 2,
        dash: opts.dash,
        head: 0
      });
    }
  }

  /* ── Stepper 1: risk utility functions and preference ───────── */

  function initAppetiteStepper() {
    var el = host("ix-appetite");
    if (!el) return;

    var COL = { text: "#141826", muted: "#565d75", dim: "#7b829a" };

    window.Interactive.stepper("ix-appetite", {
      title: "Risk utility functions: three ways to value the same money",
      subtitle: "X-axis: monetary value or project benefit. Y-axis: utility — the satisfaction derived from it.",
      height: 300,
      frames: [
        {
          title: "Set up the axes",
          caption: "Utility is the y-axis and money is the x-axis. The shape of the curve, not the money, is what encodes a stakeholder's risk preference.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var pad = 52;
            axes(k, w, h, pad);
            k.label(w / 2, h - 14, "monetary value (or project benefit)", { align: "center", size: 12, color: COL.muted });
            k.label(w / 2, 18, "utility", { align: "center", size: 12, color: COL.muted });
            k.label(pad + 6, h - pad - 26, "more money", { size: 11, color: COL.dim });
            k.label(pad + 6, h - pad - 46, "still more utility — but the curve decides how much", { size: 11, color: COL.dim });
          }
        },
        {
          title: "Risk averse — the curve flattens",
          caption: "Each extra dollar buys less additional utility, so a certain lower payoff can beat a risky higher one. Concave curve.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var pad = 52;
            axes(k, w, h, pad);
            var pts = curvePoints(w, h, pad, function (t) {
              return Math.pow(t, 0.55);
            });
            polyline(k, pts, { color: "#059669", lw: 2.6 });
            k.label(w - 96, h * 0.34, "risk averse", { size: 12, color: "#059669" });
            k.label(pad + 10, h - pad - 22, "utility rises quickly, then levels off", { size: 11, color: COL.muted });
          }
        },
        {
          title: "Risk neutral — a straight line",
          caption: "Utility is proportional to money, so the only criterion is expected monetary value. This is the assumption every EMV calculation makes.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var pad = 52;
            axes(k, w, h, pad);
            polyline(k, curvePoints(w, h, pad, function (t) {
              return t;
            }), { color: "#2563eb", lw: 2.6 });
            k.label(w - 104, h * 0.52, "risk neutral", { size: 12, color: "#2563eb" });
            k.label(pad + 10, h - pad - 22, "decide on EMV alone", { size: 11, color: COL.muted });
          }
        },
        {
          title: "Risk seeking — the curve steepens",
          caption: "Extra money buys progressively more utility, so a gamble with a lower expected value can still be preferred. Convex curve.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var pad = 52;
            axes(k, w, h, pad);
            polyline(k, curvePoints(w, h, pad, function (t) {
              return Math.pow(t, 1.8);
            }), { color: "#a855f7", lw: 2.6 });
            k.label(w - 100, h * 0.66, "risk seeking", { size: 12, color: "#a855f7" });
            k.label(pad + 10, h - pad - 22, "a gamble can beat the certain payoff", { size: 11, color: COL.muted });
          }
        },
        {
          title: "The same odds, two different answers",
          caption: "A 50/50 gamble between a low and a high payoff has one EMV — and three different utilities. Neither answer is irrational; they follow from different curves.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var pad = 52;
            axes(k, w, h, pad);
            var averse = curvePoints(w, h, pad, function (t) { return Math.pow(t, 0.55); });
            var neutral = curvePoints(w, h, pad, function (t) { return t; });
            var seeking = curvePoints(w, h, pad, function (t) { return Math.pow(t, 1.8); });
            polyline(k, averse, { color: "#059669", lw: 2, dash: [5, 4] });
            polyline(k, neutral, { color: "#2563eb", lw: 2.6 });
            polyline(k, seeking, { color: "#a855f7", lw: 2, dash: [5, 4] });

            var x0 = pad + 8;
            var x1 = w - pad - 8;
            var lo = x0 + (x1 - x0) * 0.3;
            var hi = x0 + (x1 - x0) * 0.78;
            k.arrow(lo, h - pad, lo, pad + 6, { color: COL.dim, dash: [3, 4], lw: 1.2 });
            k.arrow(hi, h - pad, hi, pad + 6, { color: COL.dim, dash: [3, 4], lw: 1.2 });
            k.label(lo, h - pad + 16, "low payoff", { align: "center", size: 10.5, color: COL.dim });
            k.label(hi, h - pad + 16, "high payoff", { align: "center", size: 10.5, color: COL.dim });

            var util = function (pts, t) {
              var idx = Math.max(0, Math.min(pts.length - 1, Math.round(t * (pts.length - 1))));
              return pts[idx][1];
            };
            k.dot(lo, util(neutral, 0.3), 6, { fill: "#2563eb", stroke: "#1e40af", lw: 1.4 });
            k.dot(hi, util(neutral, 0.78), 6, { fill: "#2563eb", stroke: "#1e40af", lw: 1.4 });
            k.label(w / 2, pad + 4, "risk averse declines · risk neutral is indifferent · risk seeking accepts",
              { align: "center", size: 11.5, color: COL.muted });
          }
        }
      ]
    });
  }

  function axes(k, w, h, pad) {
    k.arrow(pad, h - pad, w - pad + 6, h - pad, { color: "rgba(148,163,184,0.9)", lw: 1.6 });
    k.arrow(pad, h - pad, pad, pad - 6, { color: "rgba(148,163,184,0.9)", lw: 1.6 });
    k.label(pad - 8, pad, "utility", { align: "right", size: 11, color: "#7b829a" });
    k.label(w - pad + 4, h - pad + 18, "value", { align: "right", size: 11, color: "#7b829a" });
  }

  function curvePoints(w, h, pad, fn) {
    var pts = [];
    var x0 = pad + 4;
    var x1 = w - pad - 6;
    var y0 = h - pad - 4;
    var y1 = pad + 8;
    var n = 34;
    for (var i = 0; i <= n; i++) {
      var t = i / n;
      pts.push([x0 + (x1 - x0) * t, y0 - (y0 - y1) * fn(t)]);
    }
    return pts;
  }

  /* ── Stepper 2: implementing risk responses ─────────────────── */

  function initResponseStepsStepper() {
    var el = host("ix-response-steps");
    if (!el) return;

    var STAGES = [
      ["1 Authorise", "The approved treatment is signed off — it exists as work, not as a register entry."],
      ["2 Scale and load-test", "Apply staged rollout, added capacity, security and integration fixes."],
      ["3 Resolve findings", "Defects and assurance findings are closed, not deferred into launch."],
      ["4 Support and comms", "Support scripts, fallback procedures and stakeholder communication are ready."],
      ["5 Record residual risk", "What is still exposed after the response is written back into the register."]
    ];

    window.Interactive.stepper("ix-response-steps", {
      title: "Implementing risk responses: five moves",
      subtitle: "Approved treatments become scheduled, owned work rather than remaining as entries in the risk register.",
      height: 260,
      frames: STAGES.map(function (stage, frameIndex) {
        return {
          title: stage[0],
          caption: stage[1],
          draw: function (ctx, w, h, k) {
            var i = frameIndex;
            k.clear();
            var pad = 20;
            var bw = (w - pad * 2 - 16 * (STAGES.length - 1)) / STAGES.length;
            var bh = 92;
            var y = 44;

            STAGES.forEach(function (s, j) {
              var x = pad + j * (bw + 16);
              var done = j < i;
              var here = j === i;
              k.box(x, y, bw, bh, {
                fill: here ? "#ede9fe" : done ? "#ecfdf5" : "#ffffff",
                stroke: here ? "#7c3aed" : done ? "#059669" : "#cbd5e1",
                lw: here ? 2.4 : 1.6,
                r: 10
              });
              var lines = splitLabel(s[0]);
              lines.forEach(function (line, li) {
                k.label(x + bw / 2, y + 26 + li * 18, line, {
                  align: "center",
                  size: 12,
                  color: here ? "#6d28d9" : done ? "#059669" : "#565d75"
                });
              });
              k.label(x + bw / 2, y + bh - 16, done ? "done" : here ? "now" : "queued", {
                align: "center",
                size: 10,
                mono: true,
                color: here ? "#7c3aed" : done ? "#059669" : "#94a3b8"
              });
              if (j < STAGES.length - 1) {
                k.arrow(x + bw + 2, y + bh / 2, x + bw + 14, y + bh / 2, {
                  color: j < i ? "#059669" : "#cbd5e1",
                  lw: 1.8
                });
              }
            });

            var py = y + bh + 22;
            k.box(pad, py, w - pad * 2, 68, { fill: "#f8fafc", stroke: "#e2e8f0", lw: 1.4, r: 10 });
            k.label(pad + 14, py + 20, "MONITOR", { size: 11, mono: true, color: "#6d28d9" });
            var items = ["action status", "named owner", "trigger reached?", "residual exposure"];
            var iw = (w - pad * 2 - 28) / items.length;
            items.forEach(function (item, j) {
              k.label(pad + 14 + j * iw, py + 46, "\u2022 " + item, { size: 11, color: "#565d75" });
            });
          }
        };
      })
    });
  }

  function splitLabel(text) {
    var m = text.match(/^(\d)\s+(.*)$/);
    if (!m) return [text];
    return [m[1] + ".", m[2]];
  }

  /* ── Stepper 3: risk burn-down over the lifecycle ───────────── */

  function initRiskBurndownStepper() {
    var el = host("ix-risk-burndown");
    if (!el) return;

    /* A$ thousands of threat exposure, from the NSW register. */
    var POINTS = [
      { label: "Start", residual: 545, note: "Initial exposure from the three rated threats." },
      { label: "R1 treated", residual: 305, note: "Peak launch demand mitigated: staged rollout, added capacity, load testing. −A$240k." },
      { label: "R2 treated", residual: 180, note: "Integration errors mitigated by assurance and integration testing. −A$125k." },
      { label: "R3 treated", residual: 60, note: "Privacy and security: fallback procedure and escalation rule applied. −A$120k." },
      { label: "Contingency", residual: 60, note: "Contingency held for the residual A$60k; the A$120k opportunity is tracked separately." }
    ];

    window.Interactive.stepper("ix-risk-burndown", {
      title: "Risk burn-down: exposure against responses applied",
      subtitle: "Threat exposure in A$ thousands as each planned response lands. Illustrative figures from the Week 7 register.",
      height: 300,
      frames: POINTS.map(function (pt, frameIndex) {
        return {
          title: pt.label + " — residual exposure A$" + pt.residual + "k",
          caption: pt.note,
          draw: function (ctx, w, h, k) {
            var i = frameIndex;
            k.clear();
            var pad = 58;
            var plotW = w - pad - 30;
            var plotH = h - pad - 40;
            var x0 = pad;
            var y0 = h - pad;
            var yTop = y0 - plotH;
            var maxV = 600;

            k.arrow(x0, y0, x0 + plotW + 8, y0, { color: "rgba(148,163,184,0.9)", lw: 1.5 });
            k.arrow(x0, y0, x0, yTop - 8, { color: "rgba(148,163,184,0.9)", lw: 1.5 });

            [0, 150, 300, 450, 600].forEach(function (g) {
              var y = y0 - (g / maxV) * plotH;
              k.arrow(x0, y, x0 + plotW, y, { color: "rgba(148,163,184,0.28)", lw: 1, dash: [3, 5], head: 0 });
              k.label(x0 - 8, y, "A$" + g + "k", { align: "right", size: 10, mono: true, color: "#7b829a" });
            });

            var step = plotW / (POINTS.length - 1);
            var pts = [];
            POINTS.forEach(function (p, j) {
              pts.push([x0 + j * step, y0 - (p.residual / maxV) * plotH]);
            });

            /* The line is drawn only up to the current frame. */
            var drawn = pts.slice(0, i + 1);
            polyline(k, drawn, { color: "#7c3aed", lw: 2.6 });

            pts.forEach(function (p, j) {
              var seen = j <= i;
              k.dot(p[0], p[1], seen ? 7 : 5, {
                fill: seen ? "#7c3aed" : "#ffffff",
                stroke: seen ? "#6d28d9" : "#cbd5e1",
                lw: 1.8
              });
              k.label(p[0], y0 + 18, POINTS[j].label, { align: "center", size: 10.5, color: seen ? "#565d75" : "#b6bccb" });
              if (seen && j > 0) {
                var drop = POINTS[j - 1].residual - POINTS[j].residual;
                if (drop > 0) {
                  k.label(p[0], p[1] - 16, "−" + drop + "k", { align: "center", size: 10, mono: true, color: "#059669" });
                }
              }
            });

            k.label(x0 + 4, yTop - 2, "threat exposure", { size: 11, color: "#565d75" });
            if (i === POINTS.length - 1) {
              k.box(x0 + plotW - 208, yTop + 6, 200, 46, { fill: "#f3e8ff", stroke: "#a855f7", lw: 1.6, r: 8 });
              k.label(x0 + plotW - 198, yTop + 24, "Residual A$60k + opportunity A$120k", { size: 10.5, color: "#6d28d9" });
              k.label(x0 + plotW - 198, yTop + 40, "= net expected exposure A$425k at the start", { size: 10.5, color: "#565d75" });
            }
          }
        };
      })
    });
  }

  /* ── Stepper 4: EMV on a decision tree ─────────────────────── */

  function initEmvTreeStepper() {
    var el = host("ix-emv-tree-f");
    if (!el) return;

    window.Interactive.stepper("ix-emv-tree-f", {
      title: "Decision tree: build in-house or outsource",
      subtitle: "Square = decision node, circles = chance nodes. EMV = probability × payoff, costs carried as negatives.",
      height: 330,
      frames: [
        {
          title: "The decision and its chance branches",
          caption: "One choice, two alternatives, and one uncertain outcome under each. The numbers are the worked example on this page.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var L = layout(w, h);
            drawTree(k, w, h, L, { share: false, inHouse: false, outsource: false, decision: false });
          }
        },
        {
          title: "In-house: weight the outcomes",
          caption: "EMV(A) = 0.70 × (−400k) + 0.30 × (−1,000k) = −A$580k. The 30% branch is what makes this risky: its own outcome is −A$1.0m.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var L = layout(w, h);
            drawTree(k, w, h, L, { share: true, inHouse: true, outsource: false, decision: false });
          }
        },
        {
          title: "Outsource: weight the outcomes",
          caption: "EMV(B) = 0.90 × (−600k) + 0.10 × (−800k) = −A$620k. The expected value is worse, but so is the tail: −A$800k versus −A$1.0m.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var L = layout(w, h);
            drawTree(k, w, h, L, { share: true, inHouse: true, outsource: true, decision: false });
          }
        },
        {
          title: "Decide, then check the downside",
          caption: "A risk-neutral decision maker builds in-house: −A$580k beats −A$620k. A risk-averse one may still transfer, paying A$40k of expected value for A$200k less downside — which is risk appetite deciding, not arithmetic.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var L = layout(w, h);
            drawTree(k, w, h, L, { share: true, inHouse: true, outsource: true, decision: true });
            k.box(L.rootX + 6, h - 52, w - L.rootX - 20, 42, { fill: "#ecfdf5", stroke: "#059669", lw: 1.6, r: 8 });
            k.label(L.rootX + 18, h - 31, "Decision: in-house on EMV (−A$580k) · flag the A$1.0m tail as a residual risk", {
              size: 11.5,
              color: "#059669"
            });
          }
        }
      ]
    });
  }

  function layout(w, h) {
    var rootX = Math.max(48, w * 0.08);
    var nodeX = w * 0.38;
    var chanceX = w * 0.66;
    var topY = h * 0.26;
    var botY = h * 0.68;
    return { rootX: rootX, nodeX: nodeX, chanceX: chanceX, topY: topY, botY: botY };
  }

  function drawTree(k, w, h, L, state) {
    var COL = { text: "#141826", muted: "#565d75", dim: "#7b829a" };

    /* Root: the decision. */
    k.box(L.rootX, h / 2 - 26, 96, 52, { fill: "#f3e8ff", stroke: "#7c3aed", lw: 2.2, r: 8 });
    k.label(L.rootX + 48, h / 2 - 6, "DECIDE", { align: "center", size: 11.5, mono: true, color: "#6d28d9" });
    k.label(L.rootX + 48, h / 2 + 12, "integration", { align: "center", size: 10.5, color: COL.muted });

    /* Decision branches. */
    k.arrow(L.rootX + 96, h / 2, L.nodeX - 4, L.topY, { color: "#7c3aed", lw: 2 });
    k.arrow(L.rootX + 96, h / 2, L.nodeX - 4, L.botY, { color: "#7c3aed", lw: 2 });
    k.label((L.rootX + 96 + L.nodeX) / 2 - 12, (h / 2 + L.topY) / 2 - 12, "A: in-house", { size: 11.5, color: "#6d28d9" });
    k.label((L.rootX + 96 + L.nodeX) / 2 - 12, (h / 2 + L.botY) / 2 + 16, "B: outsource", { size: 11.5, color: "#6d28d9" });

    /* Chance nodes. */
    chanceNode(k, L.nodeX, L.topY, "#2563eb");
    chanceNode(k, L.nodeX, L.botY, "#2563eb");
    k.label(L.nodeX, L.topY - 36, state.inHouse ? "EMV = −A$580k" : "chance node", {
      align: "center",
      size: 11.5,
      mono: true,
      color: state.inHouse ? "#059669" : COL.dim
    });
    k.label(L.nodeX, L.botY + 42, state.outsource ? "EMV = −A$620k" : "chance node", {
      align: "center",
      size: 11.5,
      mono: true,
      color: state.outsource ? "#059669" : COL.dim
    });

    /* Outcome leaves: in-house. */
    leaf(k, L.nodeX, L.topY, L.chanceX, h * 0.12, "0.70", "−A$400k", state.inHouse);
    leaf(k, L.nodeX, L.topY, L.chanceX, h * 0.42, "0.30", "−A$1,000k rework", state.inHouse);
    /* Outcome leaves: outsource. */
    leaf(k, L.nodeX, L.botY, L.chanceX, h * 0.58, "0.90", "−A$600k", state.outsource);
    leaf(k, L.nodeX, L.botY, L.chanceX, h * 0.88, "0.10", "−A$800k remediation", state.outsource);

    if (state.decision) {
      k.highlight(L.rootX - 6, h / 2 - 32, 108, 64, { color: "#059669" });
      k.highlight(L.nodeX - 30, L.topY - 30, 60, 60, { color: "#059669" });
    }
  }

  function chanceNode(k, x, y, color) {
    k.dot(x, y, 13, { fill: "#ffffff", stroke: color, lw: 2.2 });
    k.dot(x, y, 4, { fill: color });
  }

  function leaf(k, fromX, fromY, toX, toY, prob, payoff, active) {
    var color = active ? "#2563eb" : "#cbd5e1";
    k.arrow(fromX + 13, fromY, toX - 4, toY, { color: color, lw: active ? 1.9 : 1.3 });
    var boxW = 132;
    k.box(toX, toY - 16, boxW, 32, {
      fill: active ? "#eff6ff" : "#ffffff",
      stroke: color,
      lw: active ? 1.8 : 1.2,
      r: 6
    });
    k.label(toX + 10, toY, prob, { size: 11.5, mono: true, color: active ? "#1d4ed8" : "#94a3b8" });
    k.label(toX + 46, toY, payoff, { size: 11.5, color: active ? "#1e3a8a" : "#94a3b8" });
  }

  /* ── Stepper 5: Monte Carlo and the confidence level ────────── */

  function initMonteCarloStepper() {
    var el = host("ix-worked-mc");
    if (!el) return;

    /* A$ thousands. The histogram shape stands in for the sampled
     * distribution so that the reading task, not the sampling, is the point. */
    var MC = {
      mean: 2100,
      p90: 2292,
      shape: [0.06, 0.16, 0.34, 0.58, 0.83, 1.0, 1.0, 0.83, 0.58, 0.34, 0.16, 0.06],
      xMin: 1550,
      xMax: 2650
    };

    window.Interactive.stepper("ix-worked-mc", {
      title: "Monte Carlo: reading a confidence level off the distribution",
      subtitle: "A cost baseline of A$2.0m, simulated to a mean of A$2.1m with a standard deviation of A$150k.",
      height: 300,
      frames: [
        {
          title: "1,000 iterations produce a distribution",
          caption: "Each iteration samples every uncertain input and computes one completion cost. The output is a range of possible outcomes, not a single estimate.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var L = hist(w, h, MC);
            drawHistogram(k, L, MC, { curve: false, mean: false, p90: false });
          }
        },
        {
          title: "Read the mean: A$2.1m",
          caption: "The mean is A$100k above the baseline, so the baseline is already a 50/50 commitment: half the simulated outcomes cost more than it.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var L = hist(w, h, MC);
            drawHistogram(k, L, MC, { curve: true, mean: true, p90: false });
          }
        },
        {
          title: "Read the P90: A$2.29m",
          caption: "P90 = mean + 1.28σ = 2,100 + 192 = A$2,292k. Only 10% of iterations exceed it, which is what “90% confidence” means in money.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var L = hist(w, h, MC);
            drawHistogram(k, L, MC, { curve: true, mean: true, p90: true });
            k.label(L.x(MC.mean), L.y0 + 40, "90% of outcomes finish left of this line", { align: "center", size: 11, color: "#6d28d9" });
          }
        },
        {
          title: "Turn the percentile into a contingency",
          caption: "CR = 2,292 − 2,000 = A$292k against the baseline, or A$192k above the mean. Which one you commit to is the documented risk appetite deciding, not the simulation.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var L = hist(w, h);
            /* Shade the tail beyond P90 by re-drawing the bars in a warning tone. */
            drawHistogram(k, L, MC, { curve: true, mean: true, p90: true, tail: true });
            k.box(L.pad, 34, w - L.pad * 2 - 12, 46, { fill: "#f3e8ff", stroke: "#a855f7", lw: 1.6, r: 8 });
            k.label(L.pad + 12, 50, "Baseline A$2,000k · mean A$2,100k · P90 A$2,292k", { size: 11.5, color: "#6d28d9" });
            k.label(L.pad + 12, 68, "Contingency to 90% confidence = A$292k (A$100k drift + A$192k confidence)", {
              size: 11.5,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }

  function hist(w, h, MC) {
    var pad = 58;
    var plotH = h - pad - 56;
    return {
      pad: pad,
      y0: h - pad,
      plotH: plotH,
      x: function (v) {
        return pad + ((v - MC.xMin) / (MC.xMax - MC.xMin)) * (w - pad - 30);
      }
    };
  }

  function drawHistogram(k, L, MC, state) {
    var n = MC.shape.length;
    var stepW = (L.x(MC.xMax) - L.x(MC.xMin)) / n;
    var bw = Math.max(6, stepW - 6);
    var maxBar = L.plotH * 0.82;

    k.arrow(L.pad, L.y0, L.x(MC.xMax) + 10, L.y0, { color: "rgba(148,163,184,0.9)", lw: 1.5 });
    k.arrow(L.pad, L.y0, L.pad, L.y0 - L.plotH - 8, { color: "rgba(148,163,184,0.9)", lw: 1.5 });
    k.label(L.pad - 8, L.y0 - L.plotH - 4, "frequency", { align: "right", size: 10.5, color: "#7b829a" });
    k.label(L.x((MC.xMin + MC.xMax) / 2), L.y0 + 20, "simulated completion cost (A$ thousands)", {
      align: "center",
      size: 11,
      color: "#565d75"
    });

    [1600, 1900, 2200, 2500].forEach(function (v) {
      k.label(L.x(v), L.y0 + 36, v, { align: "center", size: 10, mono: true, color: "#94a3b8" });
    });

    for (var i = 0; i < n; i++) {
      var x = L.x(MC.xMin) + i * stepW + 3;
      var bh = maxBar * MC.shape[i];
      var beyond = state.p90 && L.x(MC.xMin) + i * stepW > L.x(MC.p90);
      k.box(x, L.y0 - bh, bw, bh, {
        fill: beyond && state.tail ? "#fecdd3" : "#ede9fe",
        stroke: beyond && state.tail ? "#e11d48" : "#a855f7",
        lw: 1.2,
        r: 3
      });
    }

    if (state.mean) {
      k.arrow(L.x(MC.mean), L.y0, L.x(MC.mean), 42, { color: "#2563eb", lw: 1.8, dash: [5, 4] });
      k.label(L.x(MC.mean), 36, "mean / P50 = 2,100", { align: "center", size: 11, color: "#2563eb" });
    }
    if (state.p90) {
      k.arrow(L.x(MC.p90), L.y0, L.x(MC.p90), 58, { color: "#dc2626", lw: 1.8, dash: [5, 4] });
      k.label(L.x(MC.p90), 52, "P90 = 2,292", { align: "center", size: 11, color: "#dc2626" });
    }
    if (state.curve) {
      /* A light outline over the bars, drawn as a polyline of bar tops. */
      var pts = [];
      for (var j = 0; j < n; j++) {
        pts.push([L.x(MC.xMin) + j * stepW + 3 + bw / 2, L.y0 - maxBar * MC.shape[j]]);
      }
      polyline(k, pts, { color: "rgba(109,40,217,0.55)", lw: 1.6 });
    }
  }
})();
