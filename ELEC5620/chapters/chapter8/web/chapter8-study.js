(function () {
  "use strict";

  /* ELEC5620 — Week 8 page behaviour.
   *
   * The declarative widgets (timeline, race, pipeline, hotspot) are mounted by
   * shared/interactive.js from the JSON config blocks in the page. This file
   * owns the three animated canvas steppers — the diagram-shaped interactivity
   * this unit is about — and the re-binding a language swap requires.
   */

  var INK = "#141826";
  var MUTED = "#565d75";
  var DIM = "#7b829a";
  var ACCENT = "#6366f1";
  var ACCENT_SOFT = "#eef0fe";
  var BLUE = "#2563eb";
  var BLUE_SOFT = "#e8f0fe";
  var PURPLE = "#7c3aed";
  var PURPLE_SOFT = "#f1e9fe";
  var GREEN = "#059669";
  var GREEN_SOFT = "#e3f6ef";
  var RED = "#dc2626";
  var RED_SOFT = "#fdeaea";
  var YELLOW = "#f59e0b";
  var YELLOW_SOFT = "#fdf3dd";
  var LINE = "#c9cede";

  document.addEventListener("DOMContentLoaded", function () {
    initModelShiftStepper();
    initLiveModelStepper();
    initStateMachineStepper();
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
    initModelShiftStepper();
    initLiveModelStepper();
    initStateMachineStepper();
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
    if (!window.initELEC5620ChapterUI) return;
    try {
      window.initELEC5620ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[ELEC5620 chapter 8] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Drawing helpers shared by the three steppers ───────────── */

  /* A UML class box: name compartment, attribute compartment, optional third
   * compartment. Heights are driven by the number of lines so that frames line
   * up with each other as compartments are added. */
  function classBox(k, x, y, w, name, attrs, ops, opts) {
    opts = opts || {};
    var head = 30;
    var lineH = 19;
    var pad = 16;
    var aH = attrs && attrs.length ? attrs.length * lineH + pad : 20;
    var oH = ops && ops.length ? ops.length * lineH + pad : 0;
    var h = head + aH + oH;

    k.box(x, y, w, h, { fill: "#ffffff", stroke: opts.stroke || ACCENT, lw: 2, r: 9 });
    k.label(x + w / 2, y + head / 2 + 1, name, {
      align: "center",
      size: 14,
      weight: "700",
      color: opts.nameColor || INK
    });
    k.arrow(x, y + head, x + w, y + head, { color: opts.stroke || ACCENT, lw: 1.2, head: 0.001 });

    var cursor = y + head + pad / 2 + 4;
    (attrs || []).forEach(function (a) {
      k.label(x + 12, cursor, a, { size: 11.5, mono: true, color: MUTED, weight: "500" });
      cursor += lineH;
    });
    if (ops && ops.length) {
      var sep = y + head + aH;
      k.arrow(x, sep, x + w, sep, { color: opts.stroke || ACCENT, lw: 1.2, head: 0.001 });
      cursor = sep + pad / 2 + 4;
      ops.forEach(function (o) {
        k.label(x + 12, cursor, o, { size: 11.5, mono: true, color: MUTED, weight: "500" });
        cursor += lineH;
      });
    }
    return h;
  }

  /* A one-line association with multiplicities at both ends and an optional
   * role name in the middle. */
  function association(k, x1, y1, x2, y2, endA, endB, role, opts) {
    opts = opts || {};
    var color = opts.color || BLUE;
    k.arrow(x1, y1, x2, y2, { color: color, lw: 2 });
    var dx = x2 - x1;
    var dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / len;
    var uy = dy / len;
    if (endA) {
      k.label(x1 + ux * 14, y1 + uy * 14 - 11, endA, { size: 11.5, mono: true, color: color });
    }
    if (endB) {
      k.label(x2 - ux * 14, y2 - uy * 14 - 11, endB, {
        size: 11.5,
        mono: true,
        color: color,
        align: "right"
      });
    }
    if (role) {
      k.label((x1 + x2) / 2, (y1 + y2) / 2 - 12, role, {
        align: "center",
        size: 11.5,
        color: MUTED
      });
    }
  }

  /* A small yellow UML note with a dog-eared corner and a dashed anchor. */
  function noteBox(k, x, y, w, h, text, anchorTo) {
    k.box(x, y, w, h, { fill: YELLOW_SOFT, stroke: YELLOW, lw: 1.6, r: 2 });
    if (anchorTo) {
      k.arrow(x + w / 2, y, anchorTo[0], anchorTo[1], {
        color: YELLOW,
        lw: 1.3,
        dash: [5, 4],
        head: 0.001
      });
    }
    k.label(x + 10, y + h / 2, text, { size: 11.5, color: "#8a5a00" });
  }

  /* ── Stepper 1: where the process weight sits ───────────────── */

  function initModelShiftStepper() {
    var host = document.getElementById("ix-model-shift");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-model-shift", {
      title: "Waterfall stages versus an agile iteration",
      subtitle: "The same project, organised on two different axes: stages through time, or a loop repeated every two to four weeks.",
      height: 300,
      frames: [
        {
          title: "Waterfall: activities through time",
          caption:
            "Separate teams of specialists, one per stage, and the work passed from team to team in documents. At the end of the stages there is a product ready to ship.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var stages = [
              ["Requirements", "business analysts", ACCENT_SOFT, ACCENT],
              ["Design", "architects", BLUE_SOFT, BLUE],
              ["Implementation", "developers", PURPLE_SOFT, PURPLE],
              ["Testing", "test engineers", GREEN_SOFT, GREEN]
            ];
            stages.forEach(function (s, i) {
              var y = 30 + i * 58;
              k.box(cx - 180, y, 360, 42, { fill: s[2], stroke: s[3], lw: 1.8, r: 8 });
              k.label(cx - 166, y + 16, s[0], { size: 13, weight: "700", color: INK });
              k.label(cx - 166, y + 31, s[1], { size: 11, color: MUTED });
              if (i < stages.length - 1) {
                k.arrow(cx - 120, y + 42, cx - 120, y + 58, { color: MUTED, lw: 1.8 });
                k.label(cx - 110, y + 50, "document", { size: 10.5, color: DIM, mono: true });
              }
            });
            k.label(w - 24, 24, "user sees it only at the end", {
              align: "right",
              size: 11,
              color: RED
            });
          }
        },
        {
          title: "Agile: one 2–4 week iteration",
          caption:
            "The same work inside one cross-functional team. Iteration planning at the start, development work in the middle, iteration review at the end, and a retrospective that feeds the next Sprint.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var top = 64;
            k.label(24, 26, "work for future iterations", { size: 11, color: DIM });
            k.box(24, 36, w - 48, 22, { fill: "#f3f4fb", stroke: LINE, lw: 1.4, r: 7 });

            k.label(24, top + 26, "this iteration", { size: 11, color: DIM });
            k.box(24, top + 36, w - 48, 76, { fill: "#fbfdff", stroke: ACCENT, lw: 2, r: 10 });
            k.label(w - 30, top + 26, "2 to 4 weeks", {
              align: "right",
              size: 11,
              color: ACCENT,
              mono: true
            });

            var inner = Math.min(w - 96, 560);
            var startX = (w - inner) / 2;
            var phases = [["planning", ACCENT], ["development", BLUE], ["review", GREEN]];
            var step = inner / phases.length;
            phases.forEach(function (p, i) {
              k.box(startX + i * step + 6, top + 48, step - 12, 52, {
                fill: "#ffffff",
                stroke: p[1],
                lw: 1.7,
                r: 8
              });
              k.label(startX + i * step + step / 2, top + 74, p[0], {
                align: "center",
                size: 12,
                color: p[1],
                weight: "700"
              });
            });

            k.arrow(40, top + 118, w - 40, top + 118, { color: PURPLE, lw: 1.8 });
            k.label(w / 2, top + 134, "retrospective — change one thing in the process", {
              align: "center",
              size: 11,
              color: PURPLE
            });
            k.arrow(w - 40, top + 112, w - 40, top + 42, {
              color: PURPLE,
              lw: 1.6,
              dash: [5, 4]
            });
            k.label(w / 2, h - 14, "each iteration produces real software the customer can use", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Where the models live in that loop",
          caption:
            "Modelling is not a stage that finishes. It is a step inside the iteration: model the slice the increment needs, generate and validate, learn, and fold the learning back into the model.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 6;
            var cx = w / 2;

            k.box(24, 30, 168, 84, { fill: "#f4f5fa", stroke: DIM, lw: 1.6, r: 10 });
            k.label(108, 54, "big design", { align: "center", size: 12.5, color: MUTED, weight: "700" });
            k.label(108, 72, "up front", { align: "center", size: 12.5, color: MUTED, weight: "700" });
            k.label(108, 96, "the waterfall reading", { align: "center", size: 10.5, color: DIM });

            k.arrow(200, 72, 268, 72, { color: LINE, lw: 2 });
            k.label(234, 56, "replaced by", { align: "center", size: 10.5, color: DIM });

            var labels = ["model", "generate", "test", "learn"];
            var colors = [ACCENT, BLUE, GREEN, PURPLE];
            var nodes = [
              [430, 74],
              [598, 74],
              [598, 206],
              [430, 206]
            ];
            var boxW = 116;
            var boxH = 46;
            nodes.forEach(function (p, i) {
              k.box(p[0] - boxW / 2, p[1] - boxH / 2, boxW, boxH, {
                fill: "#ffffff",
                stroke: colors[i],
                lw: 1.9,
                r: 9
              });
              k.label(p[0], p[1], labels[i], {
                align: "center",
                size: 13,
                color: colors[i],
                weight: "700"
              });
            });
            k.arrow(nodes[0][0] + boxW / 2, 74, nodes[1][0] - boxW / 2, 74, { color: LINE, lw: 2 });
            k.arrow(598, 74 + boxH / 2, 598, 206 - boxH / 2, { color: LINE, lw: 2 });
            k.arrow(nodes[2][0] - boxW / 2, 206, nodes[3][0] + boxW / 2, 206, { color: LINE, lw: 2 });
            k.arrow(430, 206 - boxH / 2, 430, 74 + boxH / 2, { color: LINE, lw: 2 });

            k.label(cx + 60, h - 16, "one turn of the loop per iteration", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: the smallest model that answers the question ── */

  function initLiveModelStepper() {
    var host = document.getElementById("ix-live-model");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-live-model", {
      title: "Growing the smallest model that answers the question",
      subtitle: "Start from the question a Sprint is actually asking, add one class, then add only the elements that change a decision.",
      height: 320,
      frames: [
        {
          title: "Start from the question, not from the notation",
          caption:
            "The Sprint asks whether a notification preference belongs to the user or to a separate object. Until that is answered, no class box is worth drawing.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            k.label(cx, 52, "?", { align: "center", size: 46, weight: "700", color: ACCENT });
            k.label(cx, 100, "what do we actually need to decide?", {
              align: "center",
              size: 13,
              color: INK,
              weight: "700"
            });
            k.label(cx, 124, "a preference per user, or per user and channel?", {
              align: "center",
              size: 12,
              color: MUTED
            });
            k.box(cx - 250, 160, 500, 44, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 1.5, r: 8 });
            k.label(cx, 182, "As a registered user, I want to manage my notification preferences", {
              align: "center",
              size: 12,
              color: INK
            });
            k.label(cx, 232, "one user story = one PBI, estimated by the team", {
              align: "center",
              size: 11,
              color: DIM
            });
            k.label(cx, h - 22, "the model exists to answer a question — not to be complete", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Add the class the question is about",
          caption:
            "One class box, name compartment only. The attributes are not needed to answer the question yet, so they are not in the model yet.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            classBox(k, cx - 110, 60, 220, "User", [], [], {});
            k.label(cx, 140, "name compartment only", { align: "center", size: 11, color: DIM });
            k.label(cx, 178, "purpose test: does this box change a decision?", {
              align: "center",
              size: 11.5,
              color: MUTED
            });
            k.label(cx, h - 22, "add the second class only if the first cannot hold the answer", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Add the second class and the association",
          caption:
            "Two boxes and one line now answer the question. The multiplicity is the part that carries the decision, so it appears with the line rather than in a separate document.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var left = { x: w / 2 - 260, y: 62, w: 200 };
            var right = { x: w / 2 + 60, y: 62, w: 200 };
            classBox(k, left.x, left.y, left.w, "User", ["email : String"], [], {});
            classBox(k, right.x, right.y, right.w, "NotificationPreference", ["channel", "enabled"], [], {});
            association(
              k,
              left.x + left.w,
              left.y + 34,
              right.x,
              right.y + 34,
              "1",
              "0..*",
              "prefers"
            );
            k.label(w / 2, 168, "1 user — 0..* preferences", {
              align: "center",
              size: 11.5,
              color: BLUE,
              mono: true
            });
            k.label(w / 2, 216, "the multiplicity is the decision: one row per user and channel", {
              align: "center",
              size: 11.5,
              color: MUTED
            });
            k.label(w / 2, h - 22, "two boxes, one line: that is the whole class model for this Sprint", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "Add only what carries a constraint",
          caption:
            "An invariant and a state machine, and nothing else. Each addition removes a question the team would otherwise argue about during the Sprint.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var left = { x: 24, y: 58, w: 210 };
            var right = { x: 24 + 210 + 40, y: 58, w: 230 };
            classBox(k, left.x, left.y, left.w, "User", ["email : String"], [], {});
            classBox(k, right.x, right.y, right.w, "NotificationPreference", ["channel", "enabled"], [], {});
            association(
              k,
              left.x + left.w,
              left.y + 34,
              right.x,
              right.y + 34,
              "1",
              "0..*",
              "prefers"
            );
            noteBox(
              k,
              right.x + right.w + 26,
              right.y + 4,
              250,
              78,
              "context NotificationPreference",
              [right.x + right.w, right.y + 30]
            );
            k.label(right.x + right.w + 36, right.y + 28, "inv: channel->isUnique(ch)", {
              size: 11,
              mono: true,
              color: "#8a5a00"
            });
            k.label(right.x + right.w + 36, right.y + 50, "enabled = false means muted", {
              size: 11,
              mono: true,
              color: "#8a5a00"
            });

            var my = 226;
            k.box(24, my - 26, 300, 62, { fill: "#fbfdff", stroke: LINE, lw: 1.4, r: 10 });
            k.label(34, my - 10, "state machine: preference lifecycle", {
              size: 10.5,
              color: DIM
            });
            var cy = my + 16;
            k.dot(52, cy, 6, { fill: INK });
            k.arrow(58, cy, 90, cy, { color: INK, lw: 1.8 });
            var states = [
              ["default", 132],
              ["customised", 236],
              ["muted", 330]
            ];
            states.forEach(function (s, i) {
              k.box(s[1] - 46, cy - 15, 92, 30, {
                fill: "#ffffff",
                stroke: i === 0 ? DIM : ACCENT,
                lw: 1.6,
                r: 15
              });
              k.label(s[1], cy, s[0], { align: "center", size: 10.5, color: INK });
              if (i < states.length - 1) {
                k.arrow(s[1] + 46, cy, states[i + 1][1] - 46, cy, { color: BLUE, lw: 1.7 });
                k.label((s[1] + states[i + 1][1]) / 2, cy - 12, "set", {
                  align: "center",
                  size: 10,
                  color: BLUE
                });
              }
            });
            k.label(24, my + 60, "guard on the return: [some channel stays enabled]", {
              size: 10.5,
              color: MUTED
            });

            k.label(w / 2, h - 20, "everything else is ceremony for this increment", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: a state machine that can be executed ────────── */

  function initStateMachineStepper() {
    var host = document.getElementById("ix-state-machine");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-state-machine", {
      title: "From a readable state machine to an executable one",
      subtitle: "Each frame adds the semantics a tool needs: states, transitions, triggers and guards, then a composite state, then the tests that fire it.",
      height: 410,
      frames: [
        {
          title: "Frame 1 — states only: readable, not executable",
          caption:
            "Three states. This is enough to talk about, and not enough to run: nothing says when the object moves.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 110;
            k.dot(56, cy, 7, { fill: INK });
            k.label(56, cy - 24, "start", { align: "center", size: 10, color: DIM });
            k.arrow(63, cy, 104, cy, { color: INK, lw: 2 });
            var states = [
              ["Draft", 190, DIM],
              ["In Review", 346, ACCENT],
              ["Approved", 502, GREEN]
            ];
            states.forEach(function (s) {
              k.box(s[1] - 62, cy - 22, 124, 44, {
                fill: "#ffffff",
                stroke: s[2],
                lw: 2,
                r: 22
              });
              k.label(s[1], cy, s[0], { align: "center", size: 13, color: INK, weight: "600" });
            });
            k.dot(586, cy, 12, { fill: "none", stroke: INK, lw: 2 });
            k.dot(586, cy, 7, { fill: INK });
            k.label(586, cy + 34, "end", { align: "center", size: 10, color: DIM });
            k.label(w / 2, 230, "no transitions: the machine cannot be executed", {
              align: "center",
              size: 12,
              color: MUTED
            });
          }
        },
        {
          title: "Frame 2 — add transitions with triggers",
          caption:
            "Each transition now names its trigger. A tool can determine when it fires, which is the difference between a picture and a machine.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 110;
            k.dot(56, cy, 7, { fill: INK });
            k.arrow(63, cy, 104, cy, { color: INK, lw: 2 });
            var states = [
              ["Draft", 190, DIM],
              ["In Review", 346, ACCENT],
              ["Approved", 502, GREEN]
            ];
            states.forEach(function (s) {
              k.box(s[1] - 62, cy - 22, 124, 44, {
                fill: "#ffffff",
                stroke: s[2],
                lw: 2,
                r: 22
              });
              k.label(s[1], cy, s[0], { align: "center", size: 13, color: INK, weight: "600" });
            });
            k.dot(586, cy, 12, { fill: "none", stroke: INK, lw: 2 });
            k.dot(586, cy, 7, { fill: INK });

            k.arrow(252, cy, 284, cy, { color: BLUE, lw: 2 });
            k.label(268, cy - 16, "submit", { align: "center", size: 11.5, color: BLUE });
            k.arrow(408, cy, 440, cy, { color: GREEN, lw: 2 });
            k.label(424, cy - 16, "approve", { align: "center", size: 11.5, color: GREEN });
            k.arrow(502, cy + 22, 502, cy + 74, { color: YELLOW, lw: 2 });
            k.arrow(502, cy + 74, 346, cy + 74, { color: YELLOW, lw: 2 });
            k.arrow(346, cy + 74, 346, cy + 22, { color: YELLOW, lw: 2 });
            k.label(424, cy + 62, "reject — back for changes", {
              align: "center",
              size: 11.5,
              color: "#b45309"
            });
            k.label(w / 2, 240, "triggers fire the machine", {
              align: "center",
              size: 12,
              color: MUTED
            });
          }
        },
        {
          title: "Frame 3 — add triggers, guards and effects",
          caption:
            "Every transition now carries a trigger, a guard that must hold, and an effect that records what happened. Executable, but the review states are still interleaved.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 106;
            k.dot(56, cy, 7, { fill: INK });
            k.arrow(63, cy, 104, cy, { color: INK, lw: 2 });
            var states = [
              ["Draft", 190, DIM],
              ["In Review", 346, ACCENT],
              ["Approved", 502, GREEN]
            ];
            states.forEach(function (s) {
              k.box(s[1] - 62, cy - 22, 124, 44, {
                fill: "#ffffff",
                stroke: s[2],
                lw: 2,
                r: 22
              });
              k.label(s[1], cy, s[0], { align: "center", size: 13, color: INK, weight: "600" });
            });
            k.dot(586, cy, 12, { fill: "none", stroke: INK, lw: 2 });
            k.dot(586, cy, 7, { fill: INK });

            k.arrow(252, cy, 284, cy, { color: BLUE, lw: 2 });
            k.label(268, cy - 40, "submit", { align: "center", size: 11.5, color: BLUE });
            k.label(268, cy - 24, "[complete]", { align: "center", size: 10.5, mono: true, color: BLUE });
            k.arrow(408, cy, 440, cy, { color: GREEN, lw: 2 });
            k.label(424, cy - 40, "approve", { align: "center", size: 11.5, color: GREEN });
            k.label(424, cy - 24, "[no blockers] / sign off", {
              align: "center",
              size: 10.5,
              mono: true,
              color: GREEN
            });
            k.arrow(502, cy + 22, 502, cy + 74, { color: YELLOW, lw: 2 });
            k.arrow(502, cy + 74, 346, cy + 74, { color: YELLOW, lw: 2 });
            k.arrow(346, cy + 74, 346, cy + 22, { color: YELLOW, lw: 2 });
            k.label(424, cy + 62, "reject", { align: "center", size: 11.5, color: "#b45309" });
            k.label(424, cy + 90, "[changes requested] / reset flags", {
              align: "center",
              size: 10.5,
              mono: true,
              color: "#b45309"
            });
            k.label(w / 2, 250, "trigger, guard and effect — now a tool can run it", {
              align: "center",
              size: 12,
              color: MUTED
            });
          }
        },
        {
          title: "Frame 4 — a composite state and a parallel region",
          caption:
            "The two review behaviours are separate concerns, so they are modelled in parallel regions that both finish before the machine can leave. Completing In Review while Testing is still Walking is now a modelling error the tool can catch.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var left = 40;
            var top = 44;
            var boxW = w - 80;
            var boxH = 272;

            k.box(left, top, boxW, boxH, { fill: "#fbfdff", stroke: ACCENT, lw: 2, r: 12 });
            k.label(left + 14, top + 18, "In Review", { size: 13, weight: "700", color: ACCENT });

            var inset = left + 12;
            var regionW = boxW - 24;
            var regionTop = top + 40;
            var regionH = boxH - 56;

            k.box(inset, regionTop, regionW, regionH / 2 - 6, {
              fill: "#ffffff",
              stroke: LINE,
              lw: 1.3,
              r: 8
            });
            k.box(inset, regionTop + regionH / 2 + 6, regionW, regionH / 2 - 6, {
              fill: "#ffffff",
              stroke: LINE,
              lw: 1.3,
              r: 8
            });
            k.arrow(inset, regionTop + regionH / 2, inset + regionW, regionTop + regionH / 2, {
              color: LINE,
              lw: 1.3,
              dash: [6, 5],
              head: 0.001
            });

            var r1y = regionTop + (regionH / 2 - 6) / 2;
            k.dot(inset + 34, r1y, 6, { fill: INK });
            k.arrow(inset + 41, r1y, inset + 74, r1y, { color: INK, lw: 1.8 });
            k.box(inset + 106, r1y - 18, 132, 36, { fill: "#ffffff", stroke: ACCENT, lw: 1.8, r: 18 });
            k.label(inset + 172, r1y, "Editorial", { align: "center", size: 12, color: INK });
            k.arrow(inset + 238, r1y, inset + 300, r1y, { color: BLUE, lw: 1.8 });
            k.label(inset + 269, r1y - 14, "escalate", { align: "center", size: 10.5, color: BLUE });
            k.box(inset + 300, r1y - 18, 132, 36, { fill: "#ffffff", stroke: ACCENT, lw: 1.8, r: 18 });
            k.label(inset + 366, r1y, "Ratified", { align: "center", size: 12, color: INK });
            k.dot(inset + 466, r1y, 11, { fill: "none", stroke: INK, lw: 1.8 });
            k.dot(inset + 466, r1y, 6, { fill: INK });
            k.arrow(inset + 432, r1y, inset + 455, r1y, { color: INK, lw: 1.8 });
            k.label(inset + 6, regionTop + 14, "editorial review", { size: 10.5, color: DIM });

            var r2y = regionTop + regionH / 2 + 6 + (regionH / 2 - 6) / 2;
            k.dot(inset + 34, r2y, 6, { fill: INK });
            k.arrow(inset + 41, r2y, inset + 74, r2y, { color: INK, lw: 1.8 });
            k.box(inset + 106, r2y - 18, 132, 36, { fill: "#ffffff", stroke: PURPLE, lw: 1.8, r: 18 });
            k.label(inset + 172, r2y, "Automated", { align: "center", size: 12, color: INK });
            k.arrow(inset + 238, r2y, inset + 300, r2y, { color: PURPLE, lw: 1.8 });
            k.label(inset + 269, r2y - 14, "checks pass", { align: "center", size: 10.5, color: PURPLE });
            k.box(inset + 300, r2y - 18, 132, 36, { fill: "#ffffff", stroke: PURPLE, lw: 1.8, r: 18 });
            k.label(inset + 366, r2y, "Green", { align: "center", size: 12, color: INK });
            k.dot(inset + 466, r2y, 11, { fill: "none", stroke: INK, lw: 1.8 });
            k.dot(inset + 466, r2y, 6, { fill: INK });
            k.arrow(inset + 432, r2y, inset + 455, r2y, { color: INK, lw: 1.8 });
            k.label(inset + 6, regionTop + regionH / 2 + 20, "automated checks", {
              size: 10.5,
              color: DIM
            });

            k.arrow(left + boxW / 2 + 60, top + boxH, left + boxW / 2 + 60, top + boxH + 26, {
              color: LINE,
              lw: 2
            });
            k.label(left + boxW / 2 + 72, top + boxH + 18, "both regions complete", {
              size: 11,
              color: MUTED
            });
            k.label(left + 20, top + boxH + 44, "then: approve / publish  →  Published", {
              size: 11.5,
              mono: true,
              color: GREEN
            });
          }
        }
      ]
    });
  }
})();
