(function () {
  "use strict";

  /* COMP5047 — Week 2 page behaviour.
   *
   * The declarative widgets (hotspot, pipeline, matcher, sequence, timeline,
   * race, deck) are mounted by shared/interactive.js from the JSON config
   * blocks in the page. This file owns the three animated canvas steppers and
   * the re-binding that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initDissectStepper();
    initStateStepper();
    initIntentStepper();
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
    initDissectStepper();
    initStateStepper();
    initIntentStepper();
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
    if (!window.initCOMP5047ChapterUI) return;
    try {
      window.initCOMP5047ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[COMP5047 chapter 2] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared drawing helper: a left-to-right row of states with
   *    labelled transitions above and below the row. ───────────── */

  function drawStates(k, w, h, nodes, links) {
    k.clear();
    var pad = 22;
    var n = nodes.length;
    var gap = 14;
    var bw = (w - pad * 2 - gap * (n - 1)) / n;
    var bh = 58;
    var by = h / 2 - bh / 2;
    var boxes = [];

    nodes.forEach(function (node, i) {
      var x = pad + i * (bw + gap);
      k.box(x, by, bw, bh, {
        fill: i === n - 1 ? "#e6f2f5" : "#ffffff",
        stroke: "#0e7490",
        lw: 2,
        r: 10
      });
      k.label(x + bw / 2, by + (node.sub ? 22 : bh / 2), node.t, {
        align: "center",
        size: 12,
        mono: true,
        color: "#0e7490"
      });
      if (node.sub) {
        k.label(x + bw / 2, by + 39, node.sub, {
          align: "center",
          size: 10,
          color: "#565d75"
        });
      }
      boxes.push({ x: x, cx: x + bw / 2, right: x + bw });
    });

    (links || []).forEach(function (link) {
      var a = boxes[link.from];
      var b = boxes[link.to];
      if (!a || !b) return;
      if (link.back) {
        var yb = by + bh + 30;
        k.arrow(b.right - bw * 0.25, yb, a.cx, yb, { color: "#94a3b8", lw: 1.5, dash: [5, 4] });
        k.label((a.cx + b.right) / 2, yb - 12, link.label, {
          align: "center",
          size: 10.5,
          color: "#565d75"
        });
        return;
      }
      var y = link.side === "bottom" ? by + bh + 20 : by - 20;
      var x1 = a.right;
      var x2 = b.x;
      k.arrow(x1, y, x2, y, { color: "#0891b2", lw: 1.6 });
      k.label((x1 + x2) / 2, link.side === "bottom" ? y + 14 : y - 12, link.label, {
        align: "center",
        size: 10.5,
        color: "#565d75"
      });
    });

    return boxes;
  }

  /* ── Stepper 1: dissecting a low-level task ─────────────────── */

  function initDissectStepper() {
    var host = document.getElementById("ix-dissect");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-dissect", {
      title: "Dissecting a low-level task: position",
      subtitle: "The same task — specify a position within a range — changes shape when the transducer changes.",
      height: 250,
      frames: [
        {
          title: "One task on a pointing device",
          caption: "Position means specifying a position within a range. A mouse or a tablet reports two dimensions at once, so the user performs it as a single low-level task.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var pad = 26;
            var panelW = Math.min(w * 0.36, 230);
            k.box(pad, 34, panelW, h - 76, { fill: "#e6f2f5", stroke: "#0e7490", lw: 2, r: 10 });
            k.label(pad + panelW / 2, 52, "display", {
              align: "center", size: 11, mono: true, color: "#0e7490"
            });
            var cx = pad + panelW / 2;
            var cy = 34 + (h - 76) / 2;
            k.arrow(cx - 44, cy, cx - 10, cy, { color: "#0891b2", lw: 1.6 });
            k.arrow(cx, cy - 34, cx, cy - 10, { color: "#0891b2", lw: 1.6 });
            k.dot(cx, cy, 6, { fill: "#0891b2", stroke: "#0e7490", lw: 1.5 });
            k.label(cx, cy + 24, "position (x, y)", {
              align: "center", size: 11, color: "#565d75"
            });

            var mx = pad + panelW + 52;
            k.box(mx, cy - 52, 48, 70, { fill: "#ffffff", stroke: "#0e7490", lw: 2, r: 24 });
            k.label(mx + 24, cy - 34, "2D", {
              align: "center", size: 11, mono: true, color: "#0e7490"
            });
            k.arrow(mx + 58, cy - 17, mx + 116, cy - 17, { color: "#94a3b8", lw: 1.8 });
            k.label(mx + 124, cy - 17, "one gesture", { size: 12, color: "#565d75" });
            k.label(mx + 24, cy + 34, "mouse or tablet", {
              align: "center", size: 11, mono: true, color: "#0e7490"
            });
            k.label(w / 2, h - 14, "the user thinks: put it there", {
              align: "center", size: 12, color: "#565d75"
            });
          }
        },
        {
          title: "Change the transducer and the task splits",
          caption: "The same coordinates entered on a QWERTY keyboard become two primitives: quantify X and quantify Y. The task did not change — the device did.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            k.box(cx - 70, 34, 140, 58, { fill: "#e6f2f5", stroke: "#0e7490", lw: 2, r: 10 });
            k.label(cx, 54, "target position", {
              align: "center", size: 11, mono: true, color: "#0e7490"
            });
            k.label(cx, 74, "x = 0.42, y = 0.71", {
              align: "center", size: 11, color: "#565d75"
            });

            var fields = [
              { x: cx - 130, label: "quantify X", value: "0.42" },
              { x: cx + 22, label: "quantify Y", value: "0.71" }
            ];
            fields.forEach(function (f) {
              k.box(f.x, h - 116, 108, 48, { fill: "#ffffff", stroke: "#0e7490", lw: 2, r: 8 });
              k.label(f.x + 54, h - 100, f.value, {
                align: "center", size: 13, mono: true, color: "#0e7490"
              });
              k.label(f.x + 54, h - 81, f.label, {
                align: "center", size: 10.5, color: "#565d75"
              });
              k.arrow(f.x + 54, h - 124, cx + (f.x < cx ? -46 : 46), 96, {
                color: "#94a3b8", lw: 1.5, dash: [5, 4]
              });
            });

            k.box(cx - 150, h - 52, 300, 30, { fill: "#ffffff", stroke: "#94a3b8", lw: 1.6, r: 6 });
            k.label(cx, h - 37, "keyboard — zero spatial dimensions", {
              align: "center", size: 11, mono: true, color: "#565d75"
            });
          }
        },
        {
          title: "Two dials, two one-dimensional positions",
          caption: "The Etch-a-Sketch: quantify X gives a 1D position and quantify Y gives a 1D position. A diagonal is now a coordination problem between two coupled quantities rather than a pointing problem.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var panelW = Math.min(w * 0.5, 300);
            k.box(cx - panelW / 2, 30, panelW, h - 116, {
              fill: "#f8fcfd", stroke: "#0e7490", lw: 2, r: 10
            });

            /* A path that only straight runs can express. */
            var px = cx - panelW / 2 + 26;
            var py = 48;
            k.arrow(px, py + 30, px + 90, py + 30, { color: "#0891b2", lw: 2 });
            k.arrow(px + 90, py + 30, px + 90, py + 76, { color: "#0891b2", lw: 2 });
            k.arrow(px + 90, py + 76, px + 168, py + 76, { color: "#0891b2", lw: 2 });

            var dy = 30 + (h - 116) - 44;
            var dials = [
              { x: cx - 54, label: "quantify X", sub: "1D position" },
              { x: cx + 54, label: "quantify Y", sub: "1D position" }
            ];
            dials.forEach(function (d) {
              k.dot(d.x, dy, 20, { fill: "#ffffff", stroke: "#0e7490", lw: 2 });
              k.label(d.x, dy, "dial", { align: "center", size: 10, color: "#0e7490" });
              k.label(d.x, dy + 34, d.label, {
                align: "center", size: 11, mono: true, color: "#0e7490"
              });
              k.label(d.x, dy + 50, d.sub, {
                align: "center", size: 10, color: "#565d75"
              });
            });
            k.label(w / 2, h - 14, "two coupled quantities, one hand", {
              align: "center", size: 12, color: "#565d75"
            });
          }
        },
        {
          title: "The punchline: pick the drawing to match the device",
          caption: "Neither device wins in the abstract. Choose the drawing whose structure matches the transducer you were given — straight runs for the dials, free curves for the pointing device.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var half = w / 2;
            k.box(20, 30, half - 32, h - 84, { fill: "#ffffff", stroke: "#cfe3e9", lw: 2, r: 12 });
            k.label(20 + (half - 32) / 2, 48, "dials win: straight runs", {
              align: "center", size: 11, mono: true, color: "#0e7490"
            });
            var bx = 44;
            var byy = 76;
            k.arrow(bx, byy, bx + 120, byy, { color: "#0891b2", lw: 2.4 });
            k.arrow(bx + 120, byy, bx + 120, byy + 60, { color: "#0891b2", lw: 2.4 });
            k.arrow(bx + 120, byy + 60, bx + 220, byy + 60, { color: "#0891b2", lw: 2.4 });
            k.label(bx, byy + 92, "no curves required", { size: 11, color: "#565d75" });

            var ox = half + 12;
            k.box(ox, 30, half - 32, h - 84, { fill: "#ffffff", stroke: "#cfe3e9", lw: 2, r: 12 });
            k.label(ox + (half - 32) / 2, 48, "a stylus wins: free curves", {
              align: "center", size: 11, mono: true, color: "#0e7490"
            });
            ctx.save();
            ctx.strokeStyle = "#0891b2";
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(ox + 24, byy + 60);
            ctx.bezierCurveTo(ox + 90, byy - 20, ox + 150, byy + 130, ox + 224, byy + 26);
            ctx.stroke();
            ctx.restore();
            k.label(ox + 24, byy + 92, "one continuous stroke", { size: 11, color: "#565d75" });
            k.label(w / 2, h - 12, "let your opponent pick the device, then pick the drawing", {
              align: "center", size: 12, color: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: the three device state machines ─────────────── */

  function initStateStepper() {
    var host = document.getElementById("ix-states");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-states", {
      title: "The three state machines from the lecture",
      subtitle: "Each device adds one more state — and each extra state is a new promise the interface can keep.",
      height: 250,
      frames: [
        {
          title: "Mouse — two states",
          caption: "Button up and button down. Holding the button is a temporary mode that turns movement into dragging, and the tension in your finger is the feedback that you are in it.",
          draw: function (ctx, w, h, k) {
            drawStates(k, w, h, [
              { t: "0", sub: "button up" },
              { t: "1", sub: "button down" }
            ], [
              { from: 0, to: 1, label: "button down" },
              { from: 1, to: 0, label: "button up", side: "bottom" }
            ]);
            k.label(w / 2, h - 12, "dragging is a state, not a separate device", {
              align: "center", size: 11, color: "#565d75"
            });
          }
        },
        {
          title: "Touch — a third condition appears",
          caption: "Touch and release are the two transitions, but the surface also has to handle contact leaving sensing range without a release event at all.",
          draw: function (ctx, w, h, k) {
            drawStates(k, w, h, [
              { t: "out of range" },
              { t: "0", sub: "touch" },
              { t: "1", sub: "tracking" }
            ], [
              { from: 1, to: 2, label: "moves" },
              { from: 2, to: 1, label: "release", side: "bottom" },
              { from: 2, to: 0, label: "contact lost — back to out of range", back: true }
            ]);
            k.label(w / 2, h - 12, "the system must distinguish release from loss of sensing", {
              align: "center", size: 11, color: "#565d75"
            });
          }
        },
        {
          title: "Stylus — hover, contact, drag",
          caption: "Out of range, hover, tip touches and dragging. Hover is what lets an interface preview a target before the user commits, which no mouse can offer.",
          draw: function (ctx, w, h, k) {
            drawStates(k, w, h, [
              { t: "out of range" },
              { t: "0", sub: "stylus hover" },
              { t: "1", sub: "tip touches" },
              { t: "2", sub: "dragging" }
            ], [
              { from: 1, to: 2, label: "tip touches" },
              { from: 2, to: 3, label: "tip stays down" },
              { from: 3, to: 1, label: "lift stylus / tip releases", back: true }
            ]);
            k.label(w / 2, h - 12, "four states, three transitions the application can act on", {
              align: "center", size: 11, color: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: the door, explicitly then implicitly ────────── */

  function initIntentStepper() {
    var host = document.getElementById("ix-intent");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-intent", {
      title: "The same door, three designs",
      subtitle: "The deck's unlocking-the-door example, read through intentionality and the expected / sensed / desired framework.",
      height: 250,
      frames: [
        {
          title: "Explicit: the user must issue a command",
          caption: "A keypad or a gesture: the door has states 0, 1 and 2, and the transitions fire on hand recognised and gesture recognised. The user stops, aims and performs.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var doorW = 120;
            var x = 40;
            k.box(x, 40, doorW, h - 96, { fill: "#e6f2f5", stroke: "#0e7490", lw: 2, r: 8 });
            k.dot(x + doorW - 16, (h - 96) / 2 + 40, 5, { fill: "#0e7490" });
            k.label(x + doorW / 2, h - 44, "LOCKED", {
              align: "center", size: 12, mono: true, color: "#0e7490"
            });

            k.box(x + doorW + 34, 74, 92, 60, { fill: "#ffffff", stroke: "#0e7490", lw: 2, r: 8 });
            k.label(x + doorW + 80, 94, "keypad", {
              align: "center", size: 11, mono: true, color: "#0e7490"
            });
            for (var r = 0; r < 2; r++) {
              for (var c = 0; c < 3; c++) {
                k.dot(x + doorW + 62 + c * 18, 116 + r * 14, 4, { fill: "#cbd5e1" });
              }
            }
            k.arrow(x + doorW + 130, 104, w - 60, 104, { color: "#94a3b8", lw: 1.8 });
            k.label(w - 56, 104, "UNLOCKED", { size: 12, mono: true, color: "#059669" });
            k.label(40, h - 22, "intentional action: the user's purpose is to make the door open", {
              size: 11.5, color: "#565d75"
            });
          }
        },
        {
          title: "What is missing from the state machine?",
          caption: "States and transitions say what the system distinguishes, not what it is for. The deck's three questions — what is expected, what is desired, what is sensed — are exactly what the diagram leaves out.",
          draw: function (ctx, w, h, k) {
            drawStates(k, w, h, [
              { t: "0" },
              { t: "1" },
              { t: "2" }
            ], [
              { from: 0, to: 1, label: "hand recognised" },
              { from: 1, to: 2, label: "gesture recognised" },
              { from: 2, to: 0, label: "hand off", side: "bottom" }
            ]);
            k.label(w / 2, h - 12, "expected?  desired?  sensed?  — the diagram is silent", {
              align: "center", size: 12, color: "#dc2626"
            });
          }
        },
        {
          title: "Implicit: the design moves into the handle",
          caption: "Expected: pull the handle. Desired: unlock when the right person pulls. Sensed: a fingerprint sensor built into the handle. Pulling a door is an action aimed at the door, not at a computer.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var labels = [
              { t: "expected", v: "pull the handle to open the door", fill: "#ffffff" },
              { t: "desired", v: "unlock when the right person pulls", fill: "#ffffff" },
              { t: "sensed", v: "fingerprint sensor in the handle", fill: "#e6f2f5" }
            ];
            var bh = 46;
            var gap = (h - 60 - labels.length * bh) / (labels.length - 1);
            labels.forEach(function (l, i) {
              var y = 30 + i * (bh + gap);
              k.box(26, y, w - 52, bh, { fill: l.fill, stroke: "#0e7490", lw: 1.8, r: 10 });
              k.label(44, y + bh / 2, l.t, {
                size: 12, mono: true, color: "#0e7490"
              });
              k.label(140, y + bh / 2, l.v, { size: 12, color: "#565d75" });
            });
            k.label(w / 2, h - 12, "no new surface to aim at — the interaction is the door itself", {
              align: "center", size: 11.5, color: "#565d75"
            });
          }
        },
        {
          title: "The intentionality spectrum",
          caption: "Intentional, expected, incidental. The further right you move, the shorter the dialogue — and the more the user needs a way to see what the system believes and to recover when it is wrong.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h / 2 - 10;
            var x0 = 46;
            var x1 = w - 46;
            k.arrow(x0, y, x1, y, { color: "#94a3b8", lw: 2 });

            var marks = [
              { f: 0, t: "intentional", d: "you press the light switch" },
              { f: 0.5, t: "expected", d: "you walk in knowing the lights come on" },
              { f: 1, t: "incidental", d: "the A/C changes and you never notice" }
            ];
            marks.forEach(function (m) {
              var x = x0 + (x1 - x0) * m.f;
              k.dot(x, y, 8, { fill: "#ffffff", stroke: "#0e7490", lw: 2 });
              k.label(x, y - 26, m.t, {
                align: "center", size: 12, mono: true, color: "#0e7490"
              });
              k.label(x, y + 26, m.d, {
                align: "center", size: 10.5, color: "#565d75"
              });
            });
            k.label(w / 2, h - 14, "more implicit  →  shorter dialogue, higher cost when the inference is wrong", {
              align: "center",
              size: 11.5,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }
})();
