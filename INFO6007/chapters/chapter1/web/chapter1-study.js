(function () {
  "use strict";

  /* INFO6007 — Week 1 page behaviour.
   *
   * The declarative widgets (matcher, sequence, hotspot, deck, pipeline) are
   * mounted by shared/interactive.js from the JSON config blocks in the page.
   * This file owns the three animated canvas steppers and the re-binding that a
   * language swap requires.
   */

  var ACCENT = "#7c3aed";
  var BLUE = "#2563eb";
  var GREEN = "#059669";
  var YELLOW = "#f59e0b";
  var RED = "#dc2626";
  var SLATE = "#94a3b8";
  var MUTED = "#565d75";
  var DIM = "#7b829a";

  var lastChromeLang = null;

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initTriangleStepper();
    initTiersStepper();
    initKnowledgeStepper();
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
    initTriangleStepper();
    initTiersStepper();
    initKnowledgeStepper();
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
    if (!window.initINFO6007ChapterUI) return;
    try {
      window.initINFO6007ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[INFO6007 chapter 1] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* Shared geometry helper: the three-vertex constraint triangle. */
  function trianglePoints(w, h) {
    var top = { x: w / 2, y: 52 };
    var right = { x: w * 0.8, y: h - 54 };
    var left = { x: w * 0.2, y: h - 54 };
    return { top: top, right: right, left: left };
  }

  function drawTriangleBase(k, w, h, opts) {
    var p = trianglePoints(w, h);
    opts = opts || {};
    /* The triangle is drawn as three edges through the kit's arrow helper so the
     * theme colours and line handling stay in one place. */
    k.arrow(p.top.x, p.top.y, p.right.x, p.right.y, { color: opts.edge || ACCENT, lw: 2.2 });
    k.arrow(p.right.x, p.right.y, p.left.x, p.left.y, { color: opts.edge || ACCENT, lw: 2.2 });
    k.arrow(p.left.x, p.left.y, p.top.x, p.top.y, { color: opts.edge || ACCENT, lw: 2.2 });
    return p;
  }

  /* ── Stepper 1: the triple constraint ───────────────────────── */

  function initTriangleStepper() {
    var host = document.getElementById("ix-triangle");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-triangle", {
      title: "The triple constraint under pressure",
      subtitle: "Scope, time and cost at the vertices; quality and risk in the interior, where an unabsorbed change ends up.",
      height: 280,
      frames: [
        {
          title: "The constraint as drawn",
          caption: "Scope, time and cost define and shape the project. They are treated as fixed for planning purposes, and every change request moves at least one of them.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var p = drawTriangleBase(k, w, h);
            k.label(p.top.x, p.top.y - 26, "SCOPE", { align: "center", size: 14, weight: "700", color: ACCENT });
            k.label(p.right.x, p.right.y + 26, "TIME", { align: "center", size: 14, weight: "700", color: ACCENT });
            k.label(p.left.x, p.left.y + 26, "COST", { align: "center", size: 14, weight: "700", color: ACCENT });
            k.box(w / 2 - 86, h / 2 - 12, 172, 46, { fill: "rgba(37,99,235,0.08)", stroke: BLUE, lw: 1.6, r: 10 });
            k.label(w / 2, h / 2 + 4, "QUALITY / RISK", { align: "center", size: 12, weight: "700", color: BLUE });
            k.label(w / 2, h / 2 + 24, "the interior absorbs what is left", { align: "center", size: 10, color: DIM });
          }
        },
        {
          title: "Scope increases",
          caption: "New features arrive without change control. Time and/or cost will usually increase — Aurora Tech asked for multiple new features during execution and finished four months late and 40% over budget.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var p = drawTriangleBase(k, w, h, { edge: SLATE });
            k.arrow(p.right.x + 26, p.top.y + 6, p.right.x + 26, p.top.y + 52, { color: RED, lw: 2.4 });
            k.label(p.right.x + 34, p.top.y + 30, "+ scope", { size: 11, weight: "700", color: RED });
            k.label(p.left.x, p.left.y + 26, "TIME", { align: "center", size: 13, weight: "700", color: SLATE });
            k.label(p.right.x, p.right.y + 26, "COST", { align: "center", size: 13, weight: "700", color: RED });
            k.box(w / 2 - 96, h / 2 - 12, 192, 46, { fill: "rgba(220,38,38,0.07)", stroke: RED, lw: 1.6, r: 10 });
            k.label(w / 2, h / 2 + 4, "TIME + COST RISE", { align: "center", size: 12, weight: "700", color: RED });
            k.label(w / 2, h / 2 + 24, "unless something is traded out", { align: "center", size: 10, color: DIM });
          }
        },
        {
          title: "Time is reduced",
          caption: "The date is pulled in. Cost may increase, scope may decrease, or delivery must become genuinely more efficient — the slide allows all three, but the manager has to say which one was chosen.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var p = drawTriangleBase(k, w, h, { edge: SLATE });
            k.arrow(p.right.x + 26, p.top.y + 52, p.right.x + 26, p.top.y + 6, { color: RED, lw: 2.4 });
            k.label(p.right.x + 34, p.top.y + 30, "− time", { size: 11, weight: "700", color: RED });
            k.label(p.top.x, p.top.y - 26, "SCOPE", { align: "center", size: 13, weight: "700", color: SLATE });
            k.label(p.left.x, p.left.y + 26, "COST", { align: "center", size: 13, weight: "700", color: RED });
            k.box(w / 2 - 128, h / 2 - 12, 256, 46, { fill: "rgba(245,158,11,0.10)", stroke: YELLOW, lw: 1.6, r: 10 });
            k.label(w / 2, h / 2 + 4, "CRASH, CUT OR AUTOMATE", { align: "center", size: 12, weight: "700", color: "#b45309" });
            k.label(w / 2, h / 2 + 24, "cost up · scope down · efficiency up", { align: "center", size: 10, color: DIM });
          }
        },
        {
          title: "Budget is reduced",
          caption: "The third rule is the interesting one: scope may decrease, time may increase, or quality and risk may be affected. The last option is the one that leaves no visible trace on the triangle.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var p = drawTriangleBase(k, w, h, { edge: SLATE });
            k.arrow(p.left.x - 26, p.top.y + 52, p.left.x - 26, p.top.y + 6, { color: RED, lw: 2.4 });
            k.label(p.left.x - 34, p.top.y + 30, "− budget", { size: 11, weight: "700", color: RED, align: "right" });
            k.label(p.left.x, p.left.y + 26, "COST", { align: "center", size: 13, weight: "700", color: SLATE });
            k.label(p.top.x, p.top.y - 26, "SCOPE", { align: "center", size: 13, weight: "700", color: YELLOW });
            k.box(w / 2 - 86, h / 2 - 12, 172, 46, { fill: "rgba(220,38,38,0.10)", stroke: RED, lw: 1.8, r: 10 });
            k.label(w / 2, h / 2 + 4, "QUALITY / RISK", { align: "center", size: 12, weight: "700", color: RED });
            k.label(w / 2, h / 2 + 24, "absorbs it silently", { align: "center", size: 10, color: DIM });
          }
        },
        {
          title: "The exam answer",
          caption: "Never answer with one constraint. A major late change is logged, impact-assessed, priced in time or cost, decided by the sponsor, re-baselined if approved, and communicated to everyone affected.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var p = trianglePoints(w, h);
            k.box(18, 18, w - 36, h - 36, { stroke: ACCENT, lw: 1.8, r: 14 });
            k.label(w / 2, 44, "log → impact → decide → re-baseline → communicate", {
              align: "center", size: 12, weight: "700", color: ACCENT
            });
            k.label(p.top.x, p.top.y + 26, "SCOPE", { align: "center", size: 13, weight: "700", color: MUTED });
            k.label(p.right.x, p.right.y - 8, "TIME", { align: "center", size: 13, weight: "700", color: MUTED });
            k.label(p.left.x, p.left.y - 8, "COST", { align: "center", size: 13, weight: "700", color: MUTED });
            k.box(w / 2 - 96, h / 2 - 4, 192, 42, { fill: "rgba(5,150,105,0.10)", stroke: GREEN, lw: 1.6, r: 10 });
            k.label(w / 2, h / 2 + 17, "no silent trade-offs", { align: "center", size: 12, weight: "700", color: GREEN });
            k.label(w / 2, h - 30, "every constraint moved is a sponsored decision", {
              align: "center", size: 11, color: DIM
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: the three tiers of management ───────────────── */

  function initTiersStepper() {
    var host = document.getElementById("ix-tiers");
    if (!host || !window.Interactive) return;

    function tierBox(k, x, y, bw, bh, o) {
      k.box(x, y, bw, bh, { fill: o.fill, stroke: o.stroke, lw: o.lw || 1.8, r: 10 });
      k.label(x + 14, y + 22, o.title, { size: 13, weight: "700", color: o.stroke });
      k.label(x + 14, y + 44, o.line1, { size: 11, color: MUTED });
      k.label(x + 14, y + 62, o.line2, { size: 11, color: DIM });
    }

    window.Interactive.stepper("ix-tiers", {
      title: "Three tiers, increasing strategic oversight",
      subtitle: "The lecture's progression: project management → program management → portfolio management.",
      height: 300,
      frames: [
        {
          title: "Project management — tactical execution",
          caption: "One project, one project manager, one set of triple constraints. The objective is to deliver a successful project: launching a new website, or developing a mobile app.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = Math.min(w - 80, 420);
            tierBox(k, (w - bw) / 2, 84, bw, 86, {
              fill: "rgba(124,58,237,0.09)", stroke: ACCENT,
              title: "PROJECT", line1: "one project · project manager", line2: "objective: deliver a successful project"
            });
            k.label(w / 2, 62, "scope · time · cost", { align: "center", size: 11, color: DIM });
            k.label(w / 2, 210, "the unit of work is a single deliverable", { align: "center", size: 11, color: MUTED });
            k.dot(w / 2, 246, 9, { fill: ACCENT });
            k.label(w / 2, 270, "1 project", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "Program management — strategic coordination",
          caption: "A program is a collection of related projects managed in a coordinated way to achieve benefits that managing them separately could not produce. The focus moves to interdependencies, shared risks and strategic alignment.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = Math.min(w - 80, 420);
            tierBox(k, (w - bw) / 2, 78, bw, 80, {
              fill: "rgba(37,99,235,0.09)", stroke: BLUE,
              title: "PROGRAM", line1: "related projects · program manager", line2: "objective: business value across projects"
            });
            var n = 3;
            var gap = Math.min(150, (w - 120) / n);
            for (var i = 0; i < n; i++) {
              var x = w / 2 + (i - (n - 1) / 2) * gap;
              k.box(x - 50, 210, 100, 44, { fill: "#ffffff", stroke: SLATE, lw: 1.5, r: 8 });
              k.label(x, 232, "project " + (i + 1), { align: "center", size: 11, color: MUTED });
              k.arrow(x, 208, x, 164, { color: BLUE, lw: 1.5, dash: [4, 4] });
            }
            k.label(w / 2, 278, "interdependencies and shared risk are the reason to group them", {
              align: "center", size: 11, color: DIM
            });
          }
        },
        {
          title: "Portfolio management — enterprise alignment",
          caption: "A portfolio is a collection of programs and projects grouped to meet strategic business goals. The work is investment decisions, resource allocation and prioritisation — an IT portfolio might hold cybersecurity, cloud, AI and productivity tools at once.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = Math.min(w - 80, 460);
            tierBox(k, (w - bw) / 2, 74, bw, 74, {
              fill: "rgba(5,150,105,0.09)", stroke: GREEN,
              title: "PORTFOLIO", line1: "programs + projects · portfolio manager / PMO", line2: "objective: maximise value and strategic alignment"
            });
            var items = ["cyber", "cloud", "AI", "tools"];
            var n = items.length;
            var gap = Math.min(120, (w - 100) / n);
            for (var i = 0; i < n; i++) {
              var x = w / 2 + (i - (n - 1) / 2) * gap;
              k.box(x - 44, 196, 88, 40, { fill: "#ffffff", stroke: SLATE, lw: 1.5, r: 8 });
              k.label(x, 216, items[i], { align: "center", size: 11, color: MUTED });
              k.arrow(x, 194, x, 154, { color: GREEN, lw: 1.4, dash: [4, 4] });
            }
            k.box(w / 2 - 130, 252, 260, 30, { fill: "rgba(5,150,105,0.08)", stroke: GREEN, lw: 1.4, r: 8 });
            k.label(w / 2, 267, "grouped by strategy, not by shared deliverable", {
              align: "center", size: 11, color: GREEN
            });
          }
        },
        {
          title: "Read the three tiers together",
          caption: "Increasing strategic oversight and coordination: one deliverable, then coordinated benefits, then the whole investment. Higher tiers do not replace the lower one — a portfolio with no delivered projects has no value.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var rows = [
              { t: "PORTFOLIO", s: "maximise strategic value", sc: GREEN },
              { t: "PROGRAM", s: "deliver coordinated benefit", sc: BLUE },
              { t: "PROJECT", s: "deliver the output", sc: ACCENT }
            ];
            var bw = Math.min(w - 80, 440);
            rows.forEach(function (r, i) {
              var y = 58 + i * 66;
              var width = bw - i * 54;
              var x = (w - width) / 2;
              k.box(x, y, width, 50, { fill: "rgba(148,163,184,0.08)", stroke: r.sc, lw: 1.8, r: 10 });
              k.label(x + 16, y + 21, r.t, { size: 12, weight: "700", color: r.sc });
              k.label(x + 16, y + 38, r.s, { size: 10.5, color: MUTED });
            });
            k.arrow(w / 2, 54, w / 2, 34, { color: DIM, lw: 1.4 });
            k.label(w / 2, 24, "increasing strategic oversight", { align: "center", size: 11, color: DIM });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: knowledge-area emphasis ─────────────────────── */

  function initKnowledgeStepper() {
    var host = document.getElementById("ix-ka-spread");
    if (!host || !window.Interactive) return;

    /* Illustrative 0–5 emphasis scores derived from the lecture's own ordering
     * of the seven key elements and from the weeks that follow. Not measured
     * data — the widget is a revision aid for where each area bites. */
    function rowsFrame(title, caption, vals) {
      return {
        title: title,
        caption: caption,
        draw: function (ctx, w, h, k) {
          k.clear();
          var labelW = 132;
          var valueW = 96;
          var barW = Math.max(80, w - labelW - valueW - 36);
          var rowH = Math.min(34, (h - 40) / vals.length);
          var top = 22;
          vals.forEach(function (v, i) {
            var y = top + i * rowH;
            k.label(14, y + rowH / 2, v.name, { size: 11.5, color: MUTED });
            k.bar(labelW, y + rowH / 2 - 7, barW, 14, v.value, {
              max: 5,
              fill: v.value >= 4 ? ACCENT : BLUE,
              track: "rgba(148,163,184,0.22)"
            });
            k.label(labelW + barW + 10, y + rowH / 2, v.display, { size: 10.5, color: DIM });
          });
        }
      };
    }

    window.Interactive.stepper("ix-ka-spread", {
      title: "Where the management effort actually goes",
      subtitle: "Illustrative 0–5 emphasis scores from the lecture's ordering of the seven key elements. A revision aid, not measured data.",
      height: 268,
      frames: [
        rowsFrame(
          "Planning-stage areas dominate the early weeks",
          "Scope, time and cost are the areas that produce baselines, and baselines are what every later control compares against.",
          [
            { name: "Scope", value: 5, display: "the baseline" },
            { name: "Time", value: 4, display: "schedule baseline" },
            { name: "Cost", value: 4, display: "cost baseline" },
            { name: "Quality", value: 3, display: "standards" },
            { name: "Risk", value: 3, display: "register" },
            { name: "Resources", value: 3, display: "who does it" },
            { name: "Communication", value: 3, display: "reporting" }
          ]
        ),
        rowsFrame(
          "Delivery-stage areas dominate once work starts",
          "During execution the balance shifts: communication, resources and risk consume the manager's attention because they are the areas where variance appears first.",
          [
            { name: "Scope", value: 3, display: "change control" },
            { name: "Time", value: 4, display: "progress vs plan" },
            { name: "Cost", value: 4, display: "spend vs budget" },
            { name: "Quality", value: 4, display: "defects, rework" },
            { name: "Risk", value: 5, display: "issues appear" },
            { name: "Resources", value: 5, display: "team and conflict" },
            { name: "Communication", value: 5, display: "the binding area" }
          ]
        ),
        rowsFrame(
          "Why communication sits at the centre",
          "Six of the lecture's failure patterns are coordination failures: requirements, alignment, governance, stakeholder involvement, estimation bias and dependencies all move through communication.",
          [
            { name: "Requirements", value: 5, display: "volatile or unclear" },
            { name: "Dependencies", value: 5, display: "underestimated" },
            { name: "Estimation bias", value: 4, display: "optimism" },
            { name: "Alignment", value: 5, display: "business vs tech" },
            { name: "Governance", value: 4, display: "decision rights" },
            { name: "Stakeholders", value: 5, display: "engaged late" },
            { name: "Technology", value: 2, display: "rarely the cause" }
          ]
        )
      ]
    });
  }
})();
