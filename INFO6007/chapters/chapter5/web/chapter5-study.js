(function () {
  "use strict";

  /* INFO6007 — Week 5 (Quality Management) page behaviour.
   *
   * The declarative widgets (hotspot, pipeline, matcher, race, timeline) are
   * mounted by shared/interactive.js from the JSON config blocks in the page.
   * This file owns the two animated canvas steppers and the re-binding that a
   * whole-section language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initAssuranceStepper();
    initCriticalPathStepper();
    initTabs();
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
    initAssuranceStepper();
    initCriticalPathStepper();
    initTabs();
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
        window.console.error("[INFO6007 chapter 5] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Compare tabs (the four trade-offs / reading the mix) ───────
   * Small enough not to warrant a shared module: the buttons carry data-tab
   * and the panels carry the matching id. */

  function initTabs() {
    var buttons = document.querySelectorAll(".compare-tabs .tab-btn");
    if (!buttons.length) return;

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-tab");
        if (!target) return;
        var panel = document.getElementById(target);
        if (!panel) return;

        var group = btn.parentNode;
        Array.prototype.forEach.call(group.querySelectorAll(".tab-btn"), function (other) {
          other.classList.toggle("active", other === btn);
        });

        /* Panels are siblings of the tab strip in this page's markup. */
        var scope = group.parentNode;
        Array.prototype.forEach.call(scope.querySelectorAll(".tab-content"), function (content) {
          content.classList.toggle("active", content === panel);
        });
      });
    });
  }

  /* ── Stepper 1: the assurance cycle ───────────────────────────
   * The deck's Managing Quality example: audit processes, review findings,
   * improve, rehearse release. Prevention acts on the process, so the framing
   * is deliberately "what does this change about how we work". */

  function initAssuranceStepper() {
    var host = document.getElementById("ix-assurance");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-assurance", {
      title: "The assurance cycle: prevention acts on the process",
      subtitle: "Audit, review, improve, rehearse — the deck's Managing Quality activities, in the order they are normally run.",
      height: 290,
      intervalMs: 2100,
      frames: [
        {
          title: "1. Audit the process",
          caption: "A systematic review of whether teams are actually following the defined standards — secure coding, user stories with acceptance criteria, CI/CD logging test results. The audit inspects the process, not the deliverable.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var top = 30;
            var boxW = Math.min(360, w - 80);
            var x = cx - boxW / 2;

            k.box(x, top, boxW, 52, { fill: "#eef2ff", stroke: "#2563eb", lw: 2, r: 10 });
            k.label(cx, top + 20, "DEFINED PROCESS", { align: "center", size: 12, mono: true, color: "#2563eb" });
            k.label(cx, top + 38, "standard · policy · procedure", { align: "center", size: 11, color: "#565d75" });

            k.arrow(cx, top + 54, cx, top + 92, { color: "#2563eb", lw: 2 });

            k.box(x, top + 94, boxW, 52, { fill: "#ffffff", stroke: "#94a3b8", lw: 1.8, r: 10 });
            k.label(cx, top + 114, "THE WORK AS ACTUALLY DONE", { align: "center", size: 12, mono: true, color: "#565d75" });
            k.label(cx, top + 132, "commits · reviews · test runs", { align: "center", size: 11, color: "#7b829a" });

            k.label(cx, top + 172, "AUDIT: is the practice being followed?", {
              align: "center",
              size: 13,
              weight: "700",
              color: "#2563eb"
            });
            k.highlight(x - 8, top + 158, boxW + 16, 28, { color: "rgba(37,99,235,0.5)", dash: [6, 4], lw: 1.6 });

            k.label(cx, h - 26, "Finding: a non-conformity between the standard and the work", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "2. Review findings and assign closure",
          caption: "Every finding gets an owner, an action and closure evidence. An audit finding with no owner and no date is an observation, not a corrective action.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(20, 26, w - 40, 30, { fill: "#f1f5f9", stroke: "#94a3b8", lw: 1.4, r: 6 });
            k.label(32, 41, "FINDING", { size: 11, mono: true, color: "#565d75" });
            k.label(w * 0.42, 41, "OWNER", { size: 11, mono: true, color: "#565d75" });
            k.label(w * 0.62, 41, "ACTION", { size: 11, mono: true, color: "#565d75" });
            k.label(w - 32, 41, "DUE", { size: 11, mono: true, color: "#565d75", align: "right" });

            var rows = [
              ["Regression suite skipped in 3 of 10 deploys", "QA lead", "Gate the pipeline", "Fri"],
              ["User stories missing acceptance criteria", "Product owner", "Update the template", "Tue"],
              ["Static analysis not run on one service", "Dev lead", "Add to CI", "Thu"]
            ];
            rows.forEach(function (row, i) {
              var y = 64 + i * 40;
              k.box(20, y, w - 40, 32, { fill: "#ffffff", stroke: "#cbd5e1", lw: 1.2, r: 6 });
              k.label(32, y + 16, row[0], { size: 11, color: "#141826" });
              k.label(w * 0.42, y + 16, row[1], { size: 11, color: "#565d75" });
              k.label(w * 0.62, y + 16, row[2], { size: 11, color: "#565d75" });
              k.label(w - 32, y + 16, row[3], { size: 11, color: "#7b829a", align: "right" });
            });

            k.label(w / 2, h - 34, "Assurance outputs: quality report · corrective actions · updated process", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
            k.label(w / 2, h - 14, "The deliverable is untouched — the way it is produced has changed.", {
              align: "center",
              size: 11,
              color: "#2563eb"
            });
          }
        },
        {
          title: "3. Improve the process",
          caption: "Pilot feedback, defect trends and root-cause reviews feed PDCA or DMAIC. Prevention is cheaper here than at any later point, because the defect has not been created yet.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 + 4;
            var stages = [
              { t: "PLAN", d: "choose the change" },
              { t: "DO", d: "run it in a pilot" },
              { t: "CHECK", d: "measure the effect" },
              { t: "ACT", d: "make it standard" }
            ];
            var r = Math.min(w * 0.3, h * 0.34);
            stages.forEach(function (s, i) {
              var angle = -Math.PI / 2 + (i * Math.PI) / 2;
              var x = cx + Math.cos(angle) * r * 1.35;
              var y = cy + Math.sin(angle) * r;
              k.box(x - 58, y - 24, 116, 48, { fill: "#ecfdf5", stroke: "#059669", lw: 1.8, r: 8 });
              k.label(x, y - 6, s.t, { align: "center", size: 12, mono: true, color: "#059669" });
              k.label(x, y + 12, s.d, { align: "center", size: 10, color: "#565d75" });
            });
            k.label(cx, cy, "PDCA / DMAIC", { align: "center", size: 12, mono: true, color: "#059669" });
            k.label(cx, h - 20, "Prevention cost: the defect never exists.", {
              align: "center",
              size: 12,
              color: "#565d75"
            });
          }
        },
        {
          title: "4. Rehearse the release",
          caption: "Test load, recovery, support and rollout readiness before the real event. The enrolment-system case failed here because 'readiness' had been defined without a load criterion.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var checks = [
              ["Load", 0.86],
              ["Recovery", 0.62],
              ["Support", 0.9],
              ["Rollout", 0.48]
            ];
            var x = 30;
            var top = 34;
            var barW = Math.min(320, w - 190);
            checks.forEach(function (c, i) {
              var y = top + i * 46;
              k.label(x, y + 12, c[0], { size: 12, color: "#141826" });
              k.bar(x + 96, y + 2, barW, 20, c[1], { max: 1, fill: c[1] >= 0.8 ? "#059669" : "#f59e0b" });
              k.label(x + 96 + barW + 12, y + 12, Math.round(c[1] * 100) + "%", {
                size: 12,
                mono: true,
                color: "#565d75"
              });
            });
            k.label(30, h - 60, "Release rehearsal readiness — thresholds agreed in the QMP, not discovered on the night.", {
              size: 11,
              color: "#565d75"
            });
            k.label(30, h - 38, "Two gates are below target, so the release decision is 'conditional', not 'accept'.", {
              size: 11,
              color: "#b45309"
            });
            k.label(30, h - 16, "That decision is recorded and communicated — the fifth step of control.", {
              size: 11,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: quality work on the critical path ─────────────
   * A small Gantt for a quality-critical release, walked through the Week 3
   * arithmetic: durations, forward pass, float, then the critical path. The
   * point for Week 5 is that only task C has float — so testing and UAT are
   * the first casualties of any slip. */

  var CPM_TASKS = [
    { id: "A", label: "Kickoff & requirements", dur: 2, start: 0, float: 0, crit: true },
    { id: "B", label: "Backend API build", dur: 6, start: 2, float: 0, crit: true },
    { id: "C", label: "Frontend build", dur: 5, start: 2, float: 1, crit: false },
    { id: "D", label: "Security review", dur: 4, start: 8, float: 0, crit: true },
    { id: "E", label: "System & integration test", dur: 4, start: 12, float: 0, crit: true },
    { id: "F", label: "UAT (500 users)", dur: 3, start: 16, float: 0, crit: true },
    { id: "G", label: "Rollout & support shadowing", dur: 2, start: 19, float: 0, crit: true }
  ];
  var CPM_DAYS = 21;

  function initCriticalPathStepper() {
    var host = document.getElementById("ix-cpm");
    if (!host || !window.Interactive) return;

    /* Geometry shared by every frame so the bars do not jump between steps. */
    function layout(w) {
      return {
        left: Math.min(210, Math.max(140, w * 0.28)),
        right: 30,
        top: 42,
        rowH: 34
      };
    }

    function drawGrid(k, w, h, g, opts, taskState) {
      var plotW = w - g.left - g.right;
      var dayW = plotW / CPM_DAYS;

      /* Day gridlines every 3 days, labelled. */
      for (var d = 0; d <= CPM_DAYS; d += 3) {
        var x = g.left + d * dayW;
        k.arrow(x, g.top - 14, x, h - 30, { color: "rgba(148,163,184,0.35)", lw: 1, dash: [3, 5] });
        k.label(x, h - 16, "d" + d, { align: "center", size: 10, mono: true, color: "#7b829a" });
      }

      CPM_TASKS.forEach(function (t, i) {
        var y = g.top + i * g.rowH;
        var state = taskState ? taskState(t, i) : "idle";
        var barX = g.left + t.start * dayW;
        var barW = t.dur * dayW;
        var fill = "#e2e8f0";
        var stroke = "#94a3b8";

        if (state === "done") {
          fill = "#dbeafe";
          stroke = "#93c5fd";
        } else if (state === "active") {
          fill = t.crit && opts.showCritical ? "#fee2e2" : "#ede9fe";
          stroke = t.crit && opts.showCritical ? "#dc2626" : "#7c3aed";
        }

        k.label(g.left - 14, y + 13, t.id + "  " + t.label, {
          size: 11,
          align: "right",
          color: state === "idle" ? "#7b829a" : "#141826"
        });

        k.box(barX, y, barW, 22, { fill: fill, stroke: stroke, lw: 1.6, r: 5 });

        if (opts.showDurations) {
          k.label(barX + barW / 2, y + 11, t.dur + "d", {
            align: "center",
            size: 10,
            mono: true,
            color: "#565d75"
          });
        }
        if (opts.showFloat && t.float > 0) {
          k.highlight(barX + barW, y, t.float * dayW, 22, {
            color: "#f59e0b",
            dash: [4, 3],
            lw: 1.4
          });
          k.label(barX + barW + (t.float * dayW) / 2, y - 6, "float " + t.float + "d", {
            align: "center",
            size: 10,
            mono: true,
            color: "#b45309"
          });
        }
      });
    }

    function legend(k, w, h, lines, color) {
      lines.forEach(function (line, i) {
        k.label(w / 2, h - 58 + i * 18, line, {
          align: "center",
          size: 12,
          color: i === 0 ? color : "#565d75"
        });
      });
    }

    window.Interactive.stepper("ix-cpm", {
      title: "Quality work on the critical path",
      subtitle: "Seven activities, 21 days. Walk the Week 3 arithmetic: durations, forward pass, float, then the path that has none.",
      height: 350,
      intervalMs: 2400,
      frames: [
        {
          title: "1. The activities",
          caption: "Seven work packages with durations. Security review, system testing and UAT sit at the end of the chain — which is exactly why they are the first things a slipping schedule attacks.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = layout(w);
            drawGrid(k, w, h, g, { showDurations: true }, null);
            legend(k, w, h, [
              "Nothing is scheduled yet — only the durations are known.",
              "Indicative schedule for a quality-critical release."
            ], "#7c3aed");
          }
        },
        {
          title: "2. Forward pass — early start and finish",
          caption: "Each activity starts as soon as its predecessors finish: ES = max(EF of predecessors). D cannot begin until both B (day 8) and C (day 7) are complete, so D waits for B.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = layout(w);
            var prog = [0, 1, 2, 3, 4, 5, 6];
            drawGrid(k, w, h, g, { showDurations: true }, function (t, i) {
              return prog.indexOf(i) === -1 ? "idle" : "active";
            });
            legend(k, w, h, [
              "Day 8 is the earliest start for the security review.",
              "Duration so far: A + B = 8 days."
            ], "#7c3aed");
          }
        },
        {
          title: "3. Backward pass — where the float is",
          caption: "Working backwards from day 21, LS = LF − duration. Only the frontend build has spare time: 1 day. Every other activity has zero float.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = layout(w);
            drawGrid(k, w, h, g, { showDurations: true, showFloat: true }, function () {
              return "active";
            });
            legend(k, w, h, [
              "One day of float in the whole network.",
              "Six of the seven activities cannot move at all."
            ], "#b45309");
          }
        },
        {
          title: "4. The critical path",
          caption: "A → B → D → E → F → G, totalling 2 + 6 + 4 + 4 + 3 + 2 = 21 days. Add two days to the security review and the go-live date moves two days — unless testing or UAT is compressed.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = layout(w);
            drawGrid(k, w, h, g, { showDurations: true, showCritical: true }, function (t, i) {
              return t.crit ? "active" : "idle";
            });

            /* Mark the path itself, not just the bars. */
            var plotW = w - g.left - g.right;
            var dayW = plotW / CPM_DAYS;
            k.highlight(
              g.left,
              g.top - 12,
              21 * dayW,
              CPM_TASKS.length * g.rowH - 8,
              { color: "rgba(220,38,38,0.35)", dash: [7, 5], lw: 1.6 }
            );

            legend(k, w, h, [
              "Critical path: A → B → D → E → F → G = 21 days.",
              "C carries the only float, and it is upstream of everything."
            ], "#dc2626");
          }
        },
        {
          title: "5. What Week 5 adds to Week 3",
          caption: "The three quality activities on the path — security review, system testing, UAT — are 11 of the 21 days. The schedule is not something quality is fitted into; quality is most of the schedule.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = layout(w);
            var plotW = w - g.left - g.right;
            var dayW = plotW / CPM_DAYS;
            drawGrid(k, w, h, g, { showDurations: true, showCritical: true }, function (t, i) {
              return t.crit ? "active" : "idle";
            });
            [3, 4, 5].forEach(function (i) {
              var t = CPM_TASKS[i];
              k.highlight(g.left + t.start * dayW, g.top + i * g.rowH - 2, t.dur * dayW, 26, {
                color: "#dc2626",
                lw: 2
              });
            });
            legend(k, w, h, [
              "Security review + system testing + UAT = 11 of 21 days.",
              "Compressing them is compressing the project's quality assurance."
            ], "#dc2626");
          }
        }
      ]
    });
  }
})();
