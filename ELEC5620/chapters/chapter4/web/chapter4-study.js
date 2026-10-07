(function () {
  "use strict";

  /* ELEC5620 — Week 4 page behaviour.
   *
   * The declarative widgets (sequence, matcher, hotspot, pipeline, deck) are
   * mounted by shared/interactive.js from the JSON config blocks in the page.
   * This file owns the three animated canvas steppers, which draw the notation
   * rather than describing it:
   *
   *   ix-designspace  how an architecture prunes the solution space
   *   ix-runtime      design-time view versus run-time view
   *   ix-moc          structure-dominant, procedural and data-flow MoCs
   */

  var lastChromeLang = null;

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initDesignSpaceStepper();
    initRuntimeStepper();
    initMocStepper();
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
    initDesignSpaceStepper();
    initRuntimeStepper();
    initMocStepper();
    rebindChrome();
  });

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
    if (!window.initELEC5620ChapterUI) return;
    try {
      window.initELEC5620ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[ELEC5620 chapter 4] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared drawing helpers ─────────────────────────────────── */

  var INDIGO = "#4f46e5";
  var INDIGO_SOFT = "#eef2ff";
  var TEAL = "#0e7490";
  var TEAL_SOFT = "#e6f2f5";
  var GREY = "#94a3b8";
  var SLATE = "#475569";
  var MUTED = "#6b7280";
  var GREEN = "#059669";
  var GREEN_SOFT = "#ecfdf5";
  var AMBER = "#b45309";
  var AMBER_SOFT = "#fef3c7";

  /* Draw one class-box: name compartment plus an attribute/operation line. */
  function classBox(k, x, y, w, name, detail, opts) {
    opts = opts || {};
    var h = opts.h || 62;
    k.box(x, y, w, h, {
      fill: opts.fill || INDIGO_SOFT,
      stroke: opts.stroke || INDIGO,
      lw: opts.lw || 1.8,
      r: 6
    });
    k.label(x + 10, y + 18, name, {
      size: opts.size || 12.5,
      weight: "700",
      mono: true,
      color: opts.nameColor || "#312e81"
    });
    if (detail) {
      k.label(x + 10, y + 38, detail, {
        size: 10.5,
        mono: true,
        color: opts.detailColor || SLATE
      });
    }
    return h;
  }

  function frameTitle(k, w, text) {
    k.label(w / 2, 20, text, { align: "center", size: 12.5, weight: "700", color: "#312e81" });
  }

  /* ── Stepper 1: how an architecture prunes the solution space ─ */

  function initDesignSpaceStepper() {
    var host = document.getElementById("ix-designspace");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-designspace", {
      title: "Architecture reduces the available design space",
      subtitle:
        "One early decision removes whole families of solutions — and decides how expensive the next requirement will be.",
      height: 300,
      frames: [
        {
          title: "Requirements open a solution space",
          caption:
            "Requirements define what must be achieved. On their own they admit many solutions: a single-computer design, a distributed design, and several hybrids in between.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 6;
            k.box(20, cy - 54, 132, 108, { fill: "#ffffff", stroke: INDIGO, lw: 2, r: 10 });
            k.label(86, cy - 28, "Requirements", { align: "center", size: 12, weight: "700", color: "#312e81" });
            k.label(86, cy - 4, "R1  R2  R3", { align: "center", size: 10.5, mono: true, color: SLATE });
            k.label(86, cy + 18, "R4  R5", { align: "center", size: 10.5, mono: true, color: SLATE });

            k.arrow(156, cy, 196, cy, { color: INDIGO, lw: 2 });

            k.highlight(210, cy - 92, w - 232, 184, { color: "#c7d2fe", dash: [7, 6], r: 14 });
            k.label(224, cy - 76, "SOLUTION SPACE", { size: 10.5, mono: true, color: INDIGO });

            var spots = [
              [0.18, 0.2], [0.42, 0.62], [0.6, 0.24], [0.78, 0.66], [0.88, 0.28]
            ];
            spots.forEach(function (s, i) {
              var x = 210 + (w - 232) * s[0];
              var y = cy - 92 + 184 * s[1];
              k.box(x - 30, y - 16, 60, 32, { fill: "#ffffff", stroke: GREY, lw: 1.6, r: 6 });
              k.label(x, y, "Solution " + "ABCDE".charAt(i), {
                align: "center",
                size: 11,
                mono: true,
                color: SLATE
              });
            });
            k.label(w / 2, h - 16, "Everything is still possible — nothing has been decided", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "One architectural decision splits the space",
          caption:
            "Choosing where the computation lives — a single computer or a distributed system — is a high-level design decision that constrains and guides every more detailed decision that follows.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 10;
            k.box(20, cy - 40, 128, 80, { fill: "#ffffff", stroke: INDIGO, lw: 2, r: 10 });
            k.label(84, cy - 12, "Requirements", { align: "center", size: 12, weight: "700", color: "#312e81" });
            k.label(84, cy + 12, "must be met", { align: "center", size: 10.5, color: SLATE });

            k.arrow(152, cy, 196, cy - 52, { color: INDIGO, lw: 2 });
            k.arrow(152, cy, 196, cy + 52, { color: INDIGO, lw: 2 });

            k.box(200, cy - 96, 200, 78, { fill: TEAL_SOFT, stroke: TEAL, lw: 2, r: 10 });
            k.label(300, cy - 68, "ARCHITECTURE", { align: "center", size: 10.5, mono: true, color: TEAL });
            k.label(300, cy - 44, "single computer", { align: "center", size: 13, weight: "700", color: "#0f172a" });
            k.label(300, cy - 24, "family kept", { align: "center", size: 10.5, color: MUTED });

            k.box(200, cy + 22, 200, 78, { fill: AMBER_SOFT, stroke: AMBER, lw: 2, r: 10 });
            k.label(300, cy + 50, "ARCHITECTURE", { align: "center", size: 10.5, mono: true, color: AMBER });
            k.label(300, cy + 74, "distributed system", { align: "center", size: 13, weight: "700", color: "#0f172a" });
            k.label(300, cy + 94, "family kept", { align: "center", size: 10.5, color: MUTED });

            k.highlight(430, cy - 108, w - 452, 226, { color: "#fca5a5", dash: [6, 5], r: 14 });
            k.label(444, cy - 92, "now out of reach", { size: 10.5, mono: true, color: "#b91c1c" });
            var gone = [
              [0.34, 0.24], [0.62, 0.2], [0.3, 0.72], [0.66, 0.78], [0.86, 0.5]
            ];
            gone.forEach(function (s, i) {
              var x = 430 + (w - 452) * s[0];
              var y = cy - 108 + 226 * s[1];
              k.box(x - 30, y - 15, 60, 30, { fill: "#fef2f2", stroke: "#fca5a5", lw: 1.4, r: 6 });
              k.label(x, y, "removed " + (i + 1), { align: "center", size: 10, mono: true, color: "#b91c1c" });
            });
            k.label(w / 2, h - 14, "Fewer design choices — for consistency, and to reduce complexity", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Point-to-point: the cost is quadratic",
          caption:
            "Four participants, each potentially talking to every peer: six links. Add one participant and five more links appear, each of which must know every protocol it talks to.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 + 10;
            var r = Math.min(w * 0.28, h * 0.34);
            var pts = [];
            ["A", "B", "C", "X"].forEach(function (name, i) {
              var ang = -Math.PI / 2 + (i * 2 * Math.PI) / 4;
              pts.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang), name: name });
            });
            for (var i = 0; i < pts.length; i++) {
              for (var j = i + 1; j < pts.length; j++) {
                k.arrow(pts[i].x, pts[i].y, pts[j].x, pts[j].y, { color: "#c7d2fe", lw: 1.6 });
              }
            }
            pts.forEach(function (p) {
              k.dot(p.x, p.y, 20, { fill: "#ffffff", stroke: INDIGO, lw: 2.2 });
              k.label(p.x, p.y, p.name, { align: "center", size: 12, weight: "700", color: "#312e81" });
            });
            k.label(cx, 22, "n = 4  →  n(n−1)/2 = 6 links", {
              align: "center",
              size: 12.5,
              weight: "700",
              color: TEAL
            });
            k.label(cx, h - 16, "Every component knows every peer — a change ripples across the graph", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Mediator: the cost is linear, and the price is visible",
          caption:
            "The same four participants through a mediator: four links instead of six, and a seventh participant costs one connection instead of six. The mediator is now a critical component — a single point of failure and a bottleneck.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 + 12;
            var r = Math.min(w * 0.28, h * 0.34);
            var pts = [];
            ["A", "B", "C", "X"].forEach(function (name, i) {
              var ang = -Math.PI / 2 + (i * 2 * Math.PI) / 4;
              pts.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang), name: name });
            });
            pts.forEach(function (p) {
              k.arrow(p.x, p.y, cx, cy, { color: "#a5b4fc", lw: 1.8 });
              k.dot(p.x, p.y, 20, { fill: "#ffffff", stroke: INDIGO, lw: 2.2 });
              k.label(p.x, p.y, p.name, { align: "center", size: 12, weight: "700", color: "#312e81" });
            });
            k.box(cx - 62, cy - 30, 124, 60, { fill: TEAL_SOFT, stroke: TEAL, lw: 2.4, r: 10 });
            k.label(cx, cy - 8, "Mediator", { align: "center", size: 12.5, weight: "700", color: "#0f172a" });
            k.label(cx, cy + 14, "one interface", { align: "center", size: 10.5, mono: true, color: TEAL });
            k.label(cx, 22, "n = 4  →  4 links, and each component knows one interface", {
              align: "center",
              size: 12,
              weight: "700",
              color: TEAL
            });
            k.label(cx, h - 30, "Price: the mediator is on every path — replicate it, or route critical traffic around it", {
              align: "center",
              size: 11,
              color: MUTED
            });
            k.label(cx, h - 12, "and write that decision down as an architectural principle", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Then new requirements arrive",
          caption:
            "An architecture has a fundamental impact on a system's ability to support evolution. In a point-to-point design the new requirement touches every participant; behind a mediator it is one new connection. The cost of the next requirement was decided before that requirement existed.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 14;
            var leftX = w * 0.26;
            var rightX = w * 0.74;
            var r = Math.min(w * 0.15, h * 0.26);

            k.label(leftX, 22, "Point-to-point", { align: "center", size: 12, weight: "700", color: "#b91c1c" });
            var pPts = [];
            ["A", "B", "C"].forEach(function (name, i) {
              var ang = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
              pPts.push({ x: leftX + r * Math.cos(ang), y: cy + r * Math.sin(ang), name: name });
            });
            for (var i = 0; i < pPts.length; i++) {
              for (var j = i + 1; j < pPts.length; j++) {
                k.arrow(pPts[i].x, pPts[i].y, pPts[j].x, pPts[j].y, { color: "#fca5a5", lw: 2 });
                k.highlight(
                  Math.min(pPts[i].x, pPts[j].x) - 6,
                  Math.min(pPts[i].y, pPts[j].y) - 6,
                  Math.abs(pPts[j].x - pPts[i].x) + 12,
                  Math.abs(pPts[j].y - pPts[i].y) + 12,
                  { color: "#ef4444", dash: [4, 4], r: 8 }
                );
              }
            }
            pPts.forEach(function (p) {
              k.dot(p.x, p.y, 17, { fill: "#ffffff", stroke: "#b91c1c", lw: 2 });
              k.label(p.x, p.y, p.name, { align: "center", size: 11, weight: "700", color: "#7f1d1d" });
            });
            k.label(leftX, h - 16, "three links change", { align: "center", size: 11, color: MUTED });

            k.label(rightX, 22, "Behind a mediator", { align: "center", size: 12, weight: "700", color: GREEN });
            var qPts = [];
            ["A", "B", "C"].forEach(function (name, i) {
              var ang = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
              qPts.push({ x: rightX + r * Math.cos(ang), y: cy + r * Math.sin(ang), name: name });
            });
            qPts.forEach(function (p) {
              k.arrow(p.x, p.y, rightX, cy, { color: "#6ee7b7", lw: 2 });
              k.dot(p.x, p.y, 17, { fill: "#ffffff", stroke: GREEN, lw: 2 });
              k.label(p.x, p.y, p.name, { align: "center", size: 11, weight: "700", color: "#065f46" });
            });
            k.box(rightX - 40, cy - 20, 80, 40, { fill: GREEN_SOFT, stroke: GREEN, lw: 2.2, r: 8 });
            k.label(rightX, cy, "Mediator", { align: "center", size: 11.5, weight: "700", color: "#065f46" });
            k.highlight(rightX - 52, cy - 32, 104, 64, { color: GREEN, lw: 2, dash: [5, 4], r: 10 });
            k.label(rightX, h - 16, "one component changes", { align: "center", size: 11, color: MUTED });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: design-time view versus run-time view ────────── */

  function initRuntimeStepper() {
    var host = document.getElementById("ix-runtime");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-runtime", {
      title: "Design-time view versus run-time view",
      subtitle:
        "The static organisation of the specification in a repository, and the dynamic organisation of instances created by an executing program.",
      height: 300,
      frames: [
        {
          title: "Design-time view — the specification",
          caption:
            "Classes and associations with multiplicities, plus an «import» dependency between packages. This is what lives in the design repository; it says nothing about how many objects will exist.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 16;
            classBox(k, w * 0.06, cy - 46, 110, "A", "+ id : Id", { h: 58 });
            classBox(k, w * 0.42, cy - 74, 110, "B", "+ slot : Slot", { h: 58 });
            classBox(k, w * 0.78, cy - 46, 110, "C", "+ code : Code", { h: 58 });

            k.arrow(w * 0.06 + 110, cy - 17, w * 0.42, cy - 40, { color: INDIGO, lw: 1.8 });
            k.label(w * 0.32, cy - 52, "0..*", { align: "center", size: 10.5, mono: true, color: TEAL });
            k.arrow(w * 0.78, cy - 40, w * 0.42 + 110, cy - 17, { color: INDIGO, lw: 1.8 });
            k.label(w * 0.67, cy - 52, "0..1", { align: "center", size: 10.5, mono: true, color: TEAL });

            k.label(w / 2, 20, "DESIGN TIME — one specification", {
              align: "center",
              size: 12,
              weight: "700",
              color: "#312e81"
            });
            k.label(w / 2, h - 34, "static organisation of the system specification in a design repository", {
              align: "center",
              size: 11,
              color: MUTED
            });
            k.label(w / 2, h - 15, "«import» dependencies between packages are design-time artefacts too", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Run-time view — the instances",
          caption:
            "The program executes and creates objects: one a:A, two b:B and three c:C. Same specification, many instances — and the counts are a property of this execution, not of the model.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 20;
            var aX = w * 0.08;
            var bX = w * 0.4;
            var cX = w * 0.74;
            k.dot(aX + 30, cy, 20, { fill: "#ffffff", stroke: INDIGO, lw: 2.2 });
            k.label(aX + 30, cy, "a:A", { align: "center", size: 11.5, mono: true, color: "#312e81" });
            k.label(aX + 30, cy + 40, "1 instance", { align: "center", size: 10.5, color: MUTED });

            [cy - 54, cy + 54].forEach(function (y, i) {
              k.dot(bX + 30, y, 20, { fill: "#ffffff", stroke: TEAL, lw: 2.2 });
              k.label(bX + 30, y, "b" + (i + 1) + ":B", { align: "center", size: 11.5, mono: true, color: TEAL });
              k.arrow(aX + 30, cy, bX + 30, y, { color: "#a5b4fc", lw: 1.6, dash: [5, 4] });
            });
            k.label(bX + 30, cy + 96, "2 instances", { align: "center", size: 10.5, color: MUTED });

            [cy - 70, cy, cy + 70].forEach(function (y, i) {
              k.dot(cX + 30, y, 20, { fill: "#ffffff", stroke: GREEN, lw: 2.2 });
              k.label(cX + 30, y, "c" + (i + 1) + ":C", { align: "center", size: 11.5, mono: true, color: GREEN });
              k.arrow(bX + 30, y === cy ? cy : y, cX + 30, y, { color: "#6ee7b7", lw: 1.5, dash: [5, 4] });
            });
            k.label(cX + 30, cy + 106, "3 instances", { align: "center", size: 10.5, color: MUTED });

            k.label(w / 2, 20, "RUN TIME — instances of that specification", {
              align: "center",
              size: 12,
              weight: "700",
              color: TEAL
            });
            k.label(w / 2, h - 14, "dynamic organisation of instances created by an executing program", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "A second execution, a different configuration",
          caption:
            "Run the program again and the object graph changes shape: one a:A, one b:B, two c:C. The specification did not change. Anything you want to say about the system's structure has to say which of the two it is talking about.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 24;
            var aX = w * 0.08;
            var bX = w * 0.42;
            var cX = w * 0.76;

            k.dot(aX + 30, cy, 20, { fill: "#ffffff", stroke: INDIGO, lw: 2.2 });
            k.label(aX + 30, cy, "a:A", { align: "center", size: 11.5, mono: true, color: "#312e81" });

            k.dot(bX + 30, cy, 20, { fill: "#ffffff", stroke: TEAL, lw: 2.2 });
            k.label(bX + 30, cy, "b1:B", { align: "center", size: 11.5, mono: true, color: TEAL });
            k.arrow(aX + 30, cy, bX + 30, cy, { color: "#a5b4fc", lw: 1.6, dash: [5, 4] });

            [cy - 52, cy + 52].forEach(function (y, i) {
              k.dot(cX + 30, y, 20, { fill: "#ffffff", stroke: GREEN, lw: 2.2 });
              k.label(cX + 30, y, "c" + (i + 1) + ":C", { align: "center", size: 11.5, mono: true, color: GREEN });
              k.arrow(bX + 30, cy, cX + 30, y, { color: "#6ee7b7", lw: 1.5, dash: [5, 4] });
            });

            k.highlight(w * 0.06, 44, w * 0.88, h - 92, { color: GREEN, dash: [7, 6], r: 14 });
            k.label(w / 2, 24, "SAME SPECIFICATION, DIFFERENT INSTANCE GRAPH", {
              align: "center",
              size: 11.5,
              mono: true,
              color: GREEN
            });
            k.label(w / 2, h - 14, "1 × a:A, 1 × b:B, 2 × c:C — decided at run time, not in the repository", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Formally coupled, quite distinct",
          caption:
            "A change to the class changes every future execution; a change to a running instance does not change the class. The two views must agree, but they answer different questions — which is why the 4+1 model keeps them apart.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 16;
            k.box(w * 0.05, cy - 62, w * 0.38, 124, { fill: INDIGO_SOFT, stroke: INDIGO, lw: 2.2, r: 12 });
            k.label(w * 0.24, cy - 36, "DESIGN-TIME VIEW", {
              align: "center",
              size: 11,
              mono: true,
              color: INDIGO
            });
            k.label(w * 0.24, cy - 6, "class A  ·  class B  ·  class C", {
              align: "center",
              size: 12,
              weight: "700",
              color: "#312e81"
            });
            k.label(w * 0.24, cy + 22, "change here → every future", {
              align: "center",
              size: 10.5,
              color: SLATE
            });
            k.label(w * 0.24, cy + 40, "execution is affected", { align: "center", size: 10.5, color: SLATE });

            k.box(w * 0.57, cy - 62, w * 0.38, 124, { fill: GREEN_SOFT, stroke: GREEN, lw: 2.2, r: 12 });
            k.label(w * 0.76, cy - 36, "RUN-TIME VIEW", { align: "center", size: 11, mono: true, color: GREEN });
            k.label(w * 0.76, cy - 6, "a:A  ·  b1:B  ·  c1:C", {
              align: "center",
              size: 12,
              weight: "700",
              color: "#065f46"
            });
            k.label(w * 0.76, cy + 22, "change here → this execution", {
              align: "center",
              size: 10.5,
              color: SLATE
            });
            k.label(w * 0.76, cy + 40, "only; the class is untouched", {
              align: "center",
              size: 10.5,
              color: SLATE
            });

            k.arrow(w * 0.44, cy - 18, w * 0.56, cy - 18, { color: TEAL, lw: 2 });
            k.arrow(w * 0.56, cy + 22, w * 0.44, cy + 22, { color: TEAL, lw: 2 });
            k.label(w / 2, cy + 2, "instantiate", { align: "center", size: 10, mono: true, color: TEAL });
            k.label(w / 2, h - 14, "The two are formally coupled but quite distinct", {
              align: "center",
              size: 11.5,
              weight: "600",
              color: MUTED
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: the three models of computation ─────────────── */

  function initMocStepper() {
    var host = document.getElementById("ix-moc");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-moc", {
      title: "Three models of computation, one set of components",
      subtitle:
        "The Triage Agent's four activities — retrieve EHR context, retrieve medical knowledge, check appointments, decide — under three different rules for how components execute.",
      height: 300,
      frames: [
        {
          title: "Structure-dominant: components react to stimuli",
          caption:
            "Components are interconnected objects that act as containers of information and behaviour. They react in response to stimuli, the response may be a function of previous state, and they send and receive messages asynchronously.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 22;
            var nodes = [
              { x: w * 0.16, name: "Triage", state: "assessing" },
              { x: w * 0.5, name: "Knowledge", state: "idle" },
              { x: w * 0.84, name: "Scheduler", state: "reserved" }
            ];
            nodes.forEach(function (n) {
              k.box(n.x - 66, cy - 40, 132, 92, { fill: INDIGO_SOFT, stroke: INDIGO, lw: 2, r: 8 });
              k.label(n.x, cy - 16, n.name, { align: "center", size: 12.5, weight: "700", color: "#312e81" });
              k.box(n.x - 56, cy + 2, 112, 28, { fill: "#ffffff", stroke: GREY, lw: 1.4, r: 5 });
              k.label(n.x, cy + 16, "state: " + n.state, {
                align: "center",
                size: 10,
                mono: true,
                color: SLATE
              });
            });
            k.arrow(w * 0.16 + 66, cy - 12, w * 0.5 - 66, cy - 12, { color: TEAL, lw: 1.8 });
            k.arrow(w * 0.5 + 66, cy + 16, w * 0.84 - 66, cy + 16, { color: TEAL, lw: 1.8 });
            k.label(w * 0.33, cy - 26, "message", { align: "center", size: 10, mono: true, color: TEAL });
            k.label(w * 0.67, cy + 32, "message", { align: "center", size: 10, mono: true, color: TEAL });
            k.label(w / 2, 22, "STRUCTURE-DOMINANT — the response may depend on state", {
              align: "center",
              size: 11.5,
              mono: true,
              color: INDIGO
            });
            k.label(w / 2, h - 14, "System behaviour = the composite of individual component responses", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Procedural: functions in a controlled order",
          caption:
            "Components are algorithm fragments or functions triggered by the completion of predecessor components. Computation is modelled as functions mapping inputs to outputs, so the whole is a partially ordered sequence.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 16;
            var steps = ["Input", "Dbase", "Xform", "Output"];
            var bw = Math.min(140, (w - 120) / 4);
            steps.forEach(function (name, i) {
              var x = 30 + i * (bw + 26);
              k.box(x, cy - 34, bw, 68, {
                fill: i === 1 ? TEAL_SOFT : "#ffffff",
                stroke: i === 1 ? TEAL : INDIGO,
                lw: 2,
                r: 8
              });
              k.label(x + bw / 2, cy - 6, name, {
                align: "center",
                size: 12.5,
                weight: "700",
                color: "#312e81"
              });
              k.label(x + bw / 2, cy + 16, i === 0 ? "request" : i === 1 ? "read" : i === 2 ? "transform" : "response", {
                align: "center",
                size: 10,
                mono: true,
                color: SLATE
              });
              if (i < steps.length - 1) {
                k.arrow(x + bw, cy, x + bw + 26, cy, { color: INDIGO, lw: 2 });
              }
            });
            k.label(w / 2, 22, "PROCEDURAL (CONTROL FLOW) — triggered by predecessor completion", {
              align: "center",
              size: 11.5,
              mono: true,
              color: INDIGO
            });
            k.label(w / 2, h - 44, "System behaviour = the composite of (partially) ordered component executions", {
              align: "center",
              size: 11,
              color: MUTED
            });
            k.label(w / 2, h - 22, "and the order was fixed when the call graph was written", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Data flow: transforms fire when their inputs are ready",
          caption:
            "Components are functional transforms triggered by the availability of input data, so execution order is determined by data availability and fine-grained parallelism is possible. The deck's example: a house plan feeds plumbing, electricals and doors, which all feed construction.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var top = 62;
            var mid = 158;
            var bot = 248;
            k.box(w * 0.5 - 90, top - 26, 180, 52, { fill: INDIGO_SOFT, stroke: INDIGO, lw: 2, r: 8 });
            k.label(w * 0.5, top, "Design house plan", {
              align: "center",
              size: 12,
              weight: "700",
              color: "#312e81"
            });

            var lanes = ["Design plumbing", "Design electricals", "Design doors & windows"];
            lanes.forEach(function (name, i) {
              var x = w * (0.18 + i * 0.32);
              k.box(x - 76, mid - 24, 152, 48, { fill: TEAL_SOFT, stroke: TEAL, lw: 1.8, r: 8 });
              k.label(x, mid, name, { align: "center", size: 11, weight: "600", color: "#0f172a" });
              k.arrow(w * 0.5, top + 28, x, mid - 26, { color: "#a5b4fc", lw: 1.6, dash: [5, 4] });
              k.arrow(x, mid + 26, w * 0.5, bot - 26, { color: "#a5b4fc", lw: 1.6, dash: [5, 4] });
            });

            k.box(w * 0.5 - 90, bot - 26, 180, 52, { fill: GREEN_SOFT, stroke: GREEN, lw: 2.2, r: 8 });
            k.label(w * 0.5, bot, "Construct house", {
              align: "center",
              size: 12.5,
              weight: "700",
              color: "#065f46"
            });

            k.label(w / 2, 22, "DATA FLOW — execution order follows data availability", {
              align: "center",
              size: 11.5,
              mono: true,
              color: TEAL
            });
            k.label(w / 2, h - 14, "The three design steps run in any order, or at the same time", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Choosing for an agentic system",
          caption:
            "Agents perceive, reason and plan, act and coordinate, so the MoC has to support asynchronous interaction, concurrency and modularity. Structure-dominant suits autonomy and multi-agent interaction; data flow suits chaining perception, reasoning and action. Keep the two levels apart.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 20;
            k.box(w * 0.05, cy - 66, w * 0.42, 132, { fill: INDIGO_SOFT, stroke: INDIGO, lw: 2.2, r: 12 });
            k.label(w * 0.26, cy - 40, "STRUCTURE-DOMINANT", {
              align: "center",
              size: 11.5,
              mono: true,
              color: INDIGO
            });
            k.label(w * 0.26, cy - 10, "autonomy · concurrency", {
              align: "center",
              size: 12.5,
              weight: "700",
              color: "#312e81"
            });
            k.label(w * 0.26, cy + 14, "multi-agent interaction", {
              align: "center",
              size: 12.5,
              weight: "700",
              color: "#312e81"
            });
            k.label(w * 0.26, cy + 42, "the AI agent is the component", {
              align: "center",
              size: 10.5,
              color: SLATE
            });

            k.box(w * 0.53, cy - 66, w * 0.42, 132, { fill: TEAL_SOFT, stroke: TEAL, lw: 2.2, r: 12 });
            k.label(w * 0.74, cy - 40, "DATA FLOW", { align: "center", size: 11.5, mono: true, color: TEAL });
            k.label(w * 0.74, cy - 10, "chaining reasoning,", {
              align: "center",
              size: 12.5,
              weight: "700",
              color: "#0f172a"
            });
            k.label(w * 0.74, cy + 14, "perception and action", {
              align: "center",
              size: 12.5,
              weight: "700",
              color: "#0f172a"
            });
            k.label(w * 0.74, cy + 42, "functions triggered by inputs", {
              align: "center",
              size: 10.5,
              color: SLATE
            });

            k.highlight(w * 0.08, h - 62, w * 0.84, 44, { color: AMBER, dash: [6, 5], r: 10 });
            k.label(w / 2, h - 40, "Do not confuse an agent's reasoning loop with the model of computation", {
              align: "center",
              size: 11.5,
              weight: "600",
              color: AMBER
            });
            k.label(w / 2, h - 22, "of the whole software architecture — they are decisions at different levels", {
              align: "center",
              size: 11.5,
              color: AMBER
            });
          }
        }
      ]
    });
  }
})();
