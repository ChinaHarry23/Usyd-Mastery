(function () {
  "use strict";

  /* COMP5047 — Week 7 page behaviour.
   *
   * The declarative widgets (matcher, race, timeline, hotspot, sequence, deck)
   * are mounted by shared/interactive.js from the JSON config blocks in the
   * page. This file owns the three animated canvas steppers and the re-binding
   * that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initReceptorStepper();
    initLimitsStepper();
    initMotorStepper();
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
    initReceptorStepper();
    initLimitsStepper();
    initMotorStepper();
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
        window.console.error("[COMP5047 chapter 7] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared helpers ─────────────────────────────────────────── */

  function logistic(x, mid, steep) {
    return 1 / (1 + Math.exp(-steep * (x - mid)));
  }

  function receptorKind(kind) {
    return (
      {
        mechano: { label: "MECHANO", fill: "#e6f2f5", stroke: "#0e7490", ink: "#0e7490" },
        thermo: { label: "THERMO", fill: "#fef3e2", stroke: "#f59e0b", ink: "#b45309" },
        noci: { label: "NOCI", fill: "#fdeaea", stroke: "#dc2626", ink: "#b91c1c" },
        proprio: { label: "PROPRIO", fill: "#f1ecfd", stroke: "#7c3aed", ink: "#6d28d9" }
      }[kind] || { label: "?", fill: "#ffffff", stroke: "#94a3b8", ink: "#565d75" }
    );
  }

  /* ── Stepper 1: the somatosensory receptors ─────────────────── */

  function initReceptorStepper() {
    var host = document.getElementById("ix-receptors");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-receptors", {
      title: "What we feel through touch",
      subtitle: "Four receptor classes, one skin. Every haptic device writes to one of them.",
      height: 280,
      frames: [
        {
          title: "Four receptor classes",
          caption: "Thermoreceptors report skin temperature change. Mechanoreceptors report pressure, vibration, slip and stretch. Nociceptors report pain — mechanical, thermal or chemical. Proprioceptors report muscle length and tension, and the position of limbs.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var items = [
              { kind: "thermo", title: "Thermoreceptors", note: "skin temperature" },
              { kind: "mechano", title: "Mechanoreceptors", note: "pressure, vibration, slip" },
              { kind: "noci", title: "Nociceptors", note: "pain — mech, thermal, chem" },
              { kind: "proprio", title: "Proprioceptors", note: "muscle length, limb position" }
            ];
            var gap = 12;
            var bw = (w - 48 - gap * 3) / 4;
            var y = h * 0.26;
            var bh = h * 0.42;
            items.forEach(function (it, i) {
              var st = receptorKind(it.kind);
              var x = 24 + i * (bw + gap);
              k.box(x, y, bw, bh, { fill: st.fill, stroke: st.stroke, lw: 2, r: 10 });
              k.label(x + bw / 2, y + 22, st.label, { align: "center", size: 11, mono: true, color: st.ink });
              k.label(x + bw / 2, y + bh * 0.52, it.title, { align: "center", size: 11, color: "#141826", weight: "600" });
              k.label(x + bw / 2, y + bh * 0.72, it.note, { align: "center", size: 10, color: "#565d75" });
            });
            k.label(w / 2, h - 22, "one device addresses one class — choosing the class is the first design decision", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "From skin to brain: the afferent signal",
          caption: "A stimulus is transduced at the receptor, carried as spikes along the afferent nerve, and coded by firing rate. Intensity is frequency: a stronger stimulus means more spikes per second on the same fibre.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(24, h * 0.2, w * 0.26, h * 0.58, { fill: "#e6f2f5", stroke: "#0e7490", lw: 2, r: 12 });
            k.label(24 + w * 0.13, h * 0.2 + 24, "SKIN", { align: "center", size: 11, mono: true, color: "#0e7490" });
            k.dot(24 + w * 0.13, h * 0.55, 10, { fill: "#ffffff", stroke: "#0e7490", lw: 2 });
            k.label(24 + w * 0.13, h * 0.2 + h * 0.58 - 14, "stimulus", { align: "center", size: 10, color: "#565d75" });

            var x1 = 24 + w * 0.26;
            var x2 = w - 24 - w * 0.22;
            var yMid = h * 0.49;
            k.arrow(x1 + 4, yMid, x2 - 6, yMid, { color: "#0891b2", lw: 1.6 });

            var spikeN = 13;
            for (var i = 0; i < spikeN; i++) {
              var t = i / (spikeN - 1);
              var px = x1 + 16 + t * (x2 - x1 - 34);
              k.arrow(px, yMid + 14, px, yMid - 14, { color: "#7c3aed", lw: 1.2 });
            }
            k.label((x1 + x2) / 2, yMid - 30, "afferent spikes — more spikes per second, stronger sensation", {
              align: "center",
              size: 10,
              color: "#7c3aed"
            });

            k.box(w - 24 - w * 0.22, h * 0.2, w * 0.22, h * 0.58, { fill: "#f1ecfd", stroke: "#7c3aed", lw: 2, r: 12 });
            k.label(w - 24 - w * 0.11, h * 0.2 + 26, "BRAIN", { align: "center", size: 11, mono: true, color: "#6d28d9" });
            k.label(w - 24 - w * 0.11, h * 0.2 + 52, "sensation", { align: "center", size: 10, color: "#565d75" });
            k.label(w / 2, h - 20, "acuity, sensitivity and adaptation all live along this pathway", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "Adaptation: a constant stimulus fades",
          caption: "Adaptation is how the response changes over time. A steady vibration decays out of perception; re-modulating it keeps it alive. This is why the deck lists duration and rhythm next to frequency and amplitude.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x0 = 74;
            var x1 = w - 34;
            var yBase = h - 46;
            var amp = h * 0.26;
            var mid = (x0 + x1) / 2;

            k.arrow(x0 - 8, yBase, x1, yBase, { color: "#94a3b8", lw: 1.4 });
            k.label(x1 - 4, yBase + 20, "time", { align: "right", size: 10, color: "#565d75" });
            k.label(x0 - 12, yBase - amp - 12, "felt intensity", { size: 10, color: "#565d75" });
            k.arrow(x0 - 8, yBase, x0 - 8, yBase - amp - 20, { color: "#94a3b8", lw: 1.4 });

            var steps = 96;
            for (var i = 0; i <= steps; i++) {
              var t = i / steps;
              var x = x0 + t * (x1 - x0);
              var v = Math.exp(-3.4 * t);
              k.dot(x, yBase - v * amp, 1.6, { fill: "#0e7490" });
            }
            k.label(mid, yBase - amp - 12, "a steady buzz: perceived intensity decays", {
              align: "center",
              size: 11,
              color: "#0e7490"
            });

            var y2 = yBase + 2;
            var pulse = 9;
            for (var p = 0; p < pulse; p++) {
              var cyc = (p % 3 === 0) ? 1 : (p % 3 === 1 ? 0.55 : 0.28);
              var xa = x0 + (p / pulse) * (x1 - x0) + 3;
              var xb = x0 + ((p + 0.72) / pulse) * (x1 - x0);
              k.box(xa, y2 - cyc * 20, Math.max(4, xb - xa), cyc * 20, {
                fill: "rgba(8,145,178,0.35)",
                stroke: "#0891b2",
                lw: 1,
                r: 2
              });
            }
            k.label(mid, yBase + 40, "a rhythm or envelope with attack and release: still felt at the end", {
              align: "center",
              size: 11,
              color: "#0891b2"
            });
          }
        },
        {
          title: "Acuity: two points, one or two sensations",
          caption: "Acuity is spatial resolution, measured with two-point discrimination. Fingertips resolve millimetres; the forearm needs tens of millimetres. The pitch of a tactile display cannot beat the acuity of the site it stimulates.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var panels = [
              { site: "fingertip", gap: 0.14 },
              { site: "palm", gap: 0.34 },
              { site: "forearm", gap: 0.62 },
              { site: "back", gap: 0.88 }
            ];
            var gap = 10;
            var pw = (w - 48 - gap * 3) / 4;
            var py = h * 0.26;
            var ph = h * 0.42;
            panels.forEach(function (p, i) {
              var x = 24 + i * (pw + gap);
              k.box(x, py, pw, ph, { fill: "#fbfdfe", stroke: "#94a3b8", lw: 1.4, r: 8 });
              var room = pw * 0.62;
              var d = room * p.gap;
              var cx = x + pw / 2;
              var cy = py + ph * 0.46;
              k.dot(cx - d / 2, cy, 6, { fill: "#0891b2", stroke: "#0e7490", lw: 1.4 });
              k.dot(cx + d / 2, cy, 6, { fill: "#0891b2", stroke: "#0e7490", lw: 1.4 });
              if (p.gap < 0.45) {
                k.highlight(cx - d / 2 - 10, cy - 16, d + 20, 32, { color: "#059669", lw: 1.4, dash: [4, 3] });
                k.label(cx, cy - 26, "felt as TWO", { align: "center", size: 9, color: "#059669" });
              } else {
                k.highlight(cx - d / 2 - 10, cy - 16, d + 20, 32, { color: "#dc2626", lw: 1.4, dash: [4, 3] });
                k.label(cx, cy - 26, "felt as ONE", { align: "center", size: 9, color: "#dc2626" });
              }
              k.label(cx, py + ph - 12, p.site, { align: "center", size: 10, mono: true, color: "#565d75" });
            });
            k.label(w / 2, h - 20, "same gap, different site: acuity is a property of the body, not of the device", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: thresholds measured with 2AFC ───────────────── */

  function initLimitsStepper() {
    var host = document.getElementById("ix-limits");
    if (!host || !window.Interactive) return;

    var MID = 14.5;
    var STEEP = 0.34;
    var samples = [0, 6, 12, 18, 24, 30];

    window.Interactive.stepper("ix-limits", {
      title: "Measuring the limit of touch: a 2AFC curve",
      subtitle: "The method behind the retargeting result — and the three properties every haptic design is bounded by.",
      height: 300,
      frames: [
        {
          title: "Step 1 — ask a two-alternative question",
          caption: "The deck's method: 2AFC, &ldquo;was there an offset? Yes / No.&rdquo; Each trial gives one binary answer, so a single trial tells you almost nothing. The information comes from repeating it across the whole range of offsets.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(w / 2 - 210, h * 0.2, 420, h * 0.34, { fill: "#e6f2f5", stroke: "#0e7490", lw: 2, r: 12, });
            k.label(w / 2, h * 0.2 + 34, "Was there an offset?   Yes / No", {
              align: "center",
              size: 15,
              weight: "600",
              color: "#0e7490"
            });
            k.label(w / 2, h * 0.2 + 62, "one trial, one binary answer", { align: "center", size: 11, color: "#565d75" });
            k.label(w / 2, h * 0.2 + 86, "forced choice: there is no “not sure” option", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
            k.arrow(w / 2, h * 0.56, w / 2, h * 0.72, { color: "#0891b2", lw: 2 });
            k.label(w / 2, h * 0.86, "repeat across offsets: 0, 6, 12, 18, 24, 30 degrees", {
              align: "center",
              size: 12,
              color: "#0891b2"
            });
          }
        },
        {
          title: "Step 2 — plot the probability of perceiving",
          caption: "With enough trials at each offset, the binary answers become a probability. The curve climbs with the size of the manipulation, and the point where it leaves the guessing rate is the detection threshold.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x0 = 76;
            var x1 = w - 40;
            var yb = h - 52;
            var yt = 34;
            k.arrow(x0 - 8, yb, x1, yb, { color: "#94a3b8", lw: 1.4 });
            k.arrow(x0 - 8, yb, x0 - 8, yt - 8, { color: "#94a3b8", lw: 1.4 });
            k.label(x1, yb + 22, "angular offset (deg)", { align: "right", size: 10, color: "#565d75" });

            [0.25, 0.5, 0.75].forEach(function (v) {
              var y = yb - v * (yb - yt);
              k.label(x0 - 10, y + 3, v.toFixed(2), { align: "right", size: 9, mono: true, color: "#94a3b8" });
            });
            k.label(x0 - 10, yt + 3, "1.00", { align: "right", size: 9, mono: true, color: "#94a3b8" });
            k.label(x0, yt - 12, "probability of perceiving the offset", { size: 10, color: "#565d75" });

            samples.forEach(function (s) {
              k.label(x0 + (s / 30) * (x1 - x0), yb + 16, String(s), {
                align: "center",
                size: 9,
                mono: true,
                color: "#94a3b8"
              });
            });

            var prev = null;
            for (var a = 0; a <= 30; a++) {
              var x = x0 + (a / 30) * (x1 - x0);
              var y = yb - logistic(a, MID, STEEP) * (yb - yt);
              if (prev) k.arrow(prev[0], prev[1], x, y, { color: "#0e7490", lw: 2.2 });
              prev = [x, y];
            }
            samples.forEach(function (s) {
              k.dot(x0 + (s / 30) * (x1 - x0), yb - logistic(s, MID, STEEP) * (yb - yt), 4.5, {
                fill: "#ffffff",
                stroke: "#0e7490",
                lw: 1.8
              });
            });
            k.label(x0 + (MID / 30) * (x1 - x0), yb - 0.5 * (yb - yt) - 12, "50% = threshold", {
              align: "center",
              size: 10,
              color: "#7c3aed"
            });
          }
        },
        {
          title: "Step 3 — the control condition is what makes it a result",
          caption: "The deck's graph carries two panels: the main experiment and a no-offset control. In the control there is nothing to detect, so the probability sits at the guessing rate, 0.5, all the way across the axis. Only the difference between the two panels is evidence.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var panels = [
              { title: "MAIN", kind: "main" },
              { title: "NON-DO / CONTROL", kind: "control" }
            ];
            var gap = 26;
            var pw = (w - 48 - gap) / 2;
            panels.forEach(function (p, i) {
              var x0 = 24 + i * (pw + gap) + 46;
              var x1 = 24 + (i + 1) * pw + i * gap - 12;
              var yb = h - 48;
              var yt = 40;
              k.label(x0 - 38, yt - 16, p.title, { size: 11, mono: true, color: "#0e7490" });
              k.arrow(x0 - 10, yb, x1, yb, { color: "#94a3b8", lw: 1.3 });
              k.arrow(x0 - 10, yb, x0 - 10, yt - 6, { color: "#94a3b8", lw: 1.3 });
              k.label(x0 - 12, yb - 0.5 * (yb - yt) + 3, "0.5", { align: "right", size: 9, mono: true, color: "#94a3b8" });
              k.label(x0 - 12, yt + 3, "1.0", { align: "right", size: 9, mono: true, color: "#94a3b8" });
              k.label(x0 - 12, yb + 3, "0.0", { align: "right", size: 9, mono: true, color: "#94a3b8" });

              if (p.kind === "control") {
                k.arrow(x0, yb - 0.5 * (yb - yt), x1, yb - 0.5 * (yb - yt), { color: "#94a3b8", lw: 2.2, dash: [6, 5] });
                samples.forEach(function (s) {
                  k.dot(x0 + (s / 30) * (x1 - x0), yb - 0.5 * (yb - yt), 4, { fill: "#ffffff", stroke: "#94a3b8", lw: 1.6 });
                });
                k.label((x0 + x1) / 2, yt + 18, "nothing to detect: flat at guessing", {
                  align: "center",
                  size: 10,
                  color: "#565d75"
                });
              } else {
                var prev = null;
                for (var a = 0; a <= 30; a++) {
                  var x = x0 + (a / 30) * (x1 - x0);
                  var y = yb - logistic(a, MID, STEEP) * (yb - yt);
                  if (prev) k.arrow(prev[0], prev[1], x, y, { color: "#0e7490", lw: 2.2 });
                  prev = [x, y];
                }
                samples.forEach(function (s) {
                  k.dot(x0 + (s / 30) * (x1 - x0), yb - logistic(s, MID, STEEP) * (yb - yt), 4, {
                    fill: "#ffffff",
                    stroke: "#0e7490",
                    lw: 1.6
                  });
                });
              }
            });
            k.label(w / 2, h - 18, "below threshold, the same manipulation goes unnoticed — that space is the design material", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "The three properties the curve depends on",
          caption: "Acuity sets how finely a stimulus can be placed, sensitivity sets how weak it can be, and adaptation sets how long it keeps working. A vibration that never changes drops below the detection threshold on its own.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cols = [
              { label: "ACUITY", note: "spatial resolution", extra: "how close can two points be?", color: "#0e7490", fill: "#e6f2f5" },
              { label: "SENSITIVITY", note: "detection threshold", extra: "how weak can a stimulus be?", color: "#2563eb", fill: "#e8eefc" },
              { label: "ADAPTATION", note: "response over time", extra: "how long is it still felt?", color: "#7c3aed", fill: "#f1ecfd" }
            ];
            var gap = 14;
            var cw = (w - 48 - gap * 2) / 3;
            var y = h * 0.22;
            var ch = h * 0.44;
            cols.forEach(function (c, i) {
              var x = 24 + i * (cw + gap);
              k.box(x, y, cw, ch, { fill: c.fill, stroke: c.color, lw: 2, r: 10 });
              k.label(x + cw / 2, y + 24, c.label, { align: "center", size: 11, mono: true, color: c.color });
              k.label(x + cw / 2, y + ch * 0.52, c.note, { align: "center", size: 12, color: "#141826", weight: "600" });
              k.label(x + cw / 2, y + ch * 0.75, c.extra, { align: "center", size: 10, color: "#565d75" });
              k.box(x + cw * 0.2, y + ch - 18, cw * 0.6, 6, { fill: c.color, stroke: c.color, lw: 1, r: 3 });
            });
            k.label(w / 2, h - 22, "all three are properties of the person and the site, not of the actuator", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: choosing and driving a motor ────────────────── */

  function initMotorStepper() {
    var host = document.getElementById("ix-motor-map");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-motor-map", {
      title: "Four motors, four jobs",
      subtitle: "Pick the actuator from the information you need to produce, then drive it safely.",
      height: 280,
      frames: [
        {
          title: "Servo — precise angles, about 180 degrees",
          caption: "A rotary actuator for precise control of angles: motor plus potentiometer plus control circuit in one package. Low-power servos can run straight from the microcontroller; more powerful ones, or several of them, need an external supply with only the red wire moved.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w * 0.36;
            var cy = h * 0.5;
            k.box(cx - 74, cy - 46, 148, 92, { fill: "#e6f2f5", stroke: "#0e7490", lw: 2, r: 10 });
            k.label(cx, cy - 22, "SERVO", { align: "center", size: 12, mono: true, color: "#0e7490" });
            k.label(cx, cy + 2, "motor + pot", { align: "center", size: 10, color: "#565d75" });
            k.label(cx, cy + 20, "+ control circuit", { align: "center", size: 10, color: "#565d75" });
            k.dot(cx, cy + 36, 7, { fill: "#ffffff", stroke: "#0e7490", lw: 1.8 });
            k.arrow(cx, cy - 46, cx + 52, cy - 96, { color: "#0e7490", lw: 4 });
            k.dot(cx, cy - 48, 6, { fill: "#0891b2", stroke: "#0e7490", lw: 1.6 });
            k.label(cx + 56, cy - 104, "0-180 deg", { size: 10, mono: true, color: "#0e7490" });

            var wires = [
              { c: "#dc2626", t: "red — Vcc" },
              { c: "#78350f", t: "brown — ground" },
              { c: "#f59e0b", t: "orange — control" }
            ];
            wires.forEach(function (wi, i) {
              var y = h * 0.72 + i * 20;
              k.arrow(cx + 96, y, cx + 150, y, { color: wi.c, lw: 2.4 });
              k.label(cx + 158, y + 4, wi.t, { size: 11, color: "#565d75" });
            });
            k.label(w / 2, h - 16, "three wires, one angle command — the workhorse of haptic prototypes", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "Stepper — 200 steps per rotation, open loop",
          caption: "Open loop, full rotation, precise control, driven by a motor driver: send a pulse and it rotates exactly one step. At 200 steps per rotation each step is 1.8 degrees. No feedback is needed because the motor cannot silently miss a step you counted.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h * 0.48;
            k.dot(cx, cy, 52, { fill: "#fef3e2", stroke: "#f59e0b", lw: 2.2 });
            k.label(cx, cy + 5, "STEPPER", { align: "center", size: 11, mono: true, color: "#b45309" });
            for (var i = 0; i < 12; i++) {
              var a = (i / 12) * Math.PI * 2;
              k.arrow(
                cx + Math.cos(a) * 60,
                cy + Math.sin(a) * 60,
                cx + Math.cos(a) * 74,
                cy + Math.sin(a) * 74,
                { color: "#f59e0b", lw: 2 }
              );
            }
            k.label(cx, cy - 84, "1.8 deg per step", { align: "center", size: 11, mono: true, color: "#b45309" });

            var px = 44;
            var pw = 22;
            for (var p = 0; p < 8; p++) {
              k.box(px + p * pw, h - 74, 12, 34, { fill: "rgba(245,158,11,0.35)", stroke: "#f59e0b", lw: 1.2, r: 3 });
            }
            k.label(px, h - 86, "pulse train from the driver", { size: 10, color: "#565d75" });
            k.arrow(px + 8 * pw + 6, h - 57, cx - 56, cy, { color: "#94a3b8", lw: 1.4, dash: [4, 4] });
          }
        },
        {
          title: "DC motor — turns, but you cannot aim it",
          caption: "The simplest electric motor: it rotates 360 degrees, but you cannot precisely control its angle. Use it where position is not crucial — fans, conveyors, and with an eccentric rotating mass, vibration. Two challenges follow: more current than a microcontroller can supply, and current that flows back as it powers down.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w * 0.46;
            var cy = h * 0.44;
            k.dot(cx, cy, 46, { fill: "#f1ecfd", stroke: "#7c3aed", lw: 2.2 });
            k.label(cx, cy + 5, "M", { align: "center", size: 22, mono: true, color: "#6d28d9" });
            k.arrow(cx + 56, cy - 18, cx + 56, cy + 18, { color: "#7c3aed", lw: 2 });
            k.label(cx + 74, cy + 4, "spins freely", { size: 11, color: "#565d75" });
            k.label(cx, cy - 62, "no angle to command", { align: "center", size: 11, mono: true, color: "#6d28d9" });

            k.box(24, h - 84, w - 48, 62, { fill: "#fdeaea", stroke: "#dc2626", lw: 1.6, r: 8 });
            k.label(38, h - 62, "1. needs more current than a microcontroller can provide", { size: 11, color: "#b91c1c" });
            k.label(38, h - 40, "2. current flows back as it powers down", { size: 11, color: "#b91c1c" });
          }
        },
        {
          title: "The drive circuit: transistor, diode, common ground",
          caption: "A transistor works like a switch controlled by the microcontroller, letting the battery's current flow to the motor. The flyback diode safely dissipates the back electromotive force when the motor powers down. Grounds are shared; VCC is never shared.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var railY = 48;
            k.arrow(40, railY, w - 40, railY, { color: "#dc2626", lw: 3 });
            k.label(w - 44, railY - 12, "external supply (9 V)", { align: "right", size: 10, mono: true, color: "#b91c1c" });

            var mcx = w * 0.68;
            k.dot(mcx, railY + 46, 30, { fill: "#f1ecfd", stroke: "#7c3aed", lw: 2.2 });
            k.label(mcx, railY + 51, "M", { align: "center", size: 18, mono: true, color: "#6d28d9" });
            k.arrow(mcx, railY, mcx, railY + 14, { color: "#dc2626", lw: 2.2 });
            k.arrow(mcx, railY + 78, mcx, h - 74, { color: "#0e7490", lw: 2.2 });

            var dx = w * 0.86;
            k.arrow(dx, railY, dx, railY + 30, { color: "#dc2626", lw: 1.8 });
            k.box(dx - 12, railY + 30, 24, 24, { fill: "#fef3e2", stroke: "#f59e0b", lw: 2, r: 4 });
            k.arrow(dx, railY + 54, dx, railY + 84, { color: "#0e7490", lw: 1.8 });
            k.label(dx + 20, railY + 46, "flyback diode", { size: 10, color: "#b45309" });

            var tx = w * 0.46;
            k.box(tx - 34, h * 0.5, 68, 46, { fill: "#fbfdfe", stroke: "#0e7490", lw: 2, r: 6 });
            k.label(tx, h * 0.5 + 22, "MOSFET", { align: "center", size: 11, mono: true, color: "#0e7490" });
            k.arrow(tx + 36, h * 0.5 + 22, mcx - 32, h * 0.5 + 22, { color: "#0e7490", lw: 1.8, dash: [4, 4] });

            k.box(24, h - 84, w * 0.3, 46, { fill: "#e6f2f5", stroke: "#0e7490", lw: 1.8, r: 6 });
            k.label(24 + w * 0.15, h - 56, "MCU", { align: "center", size: 11, mono: true, color: "#0e7490" });
            k.arrow(tx - 36, h * 0.5 + 22, 24 + w * 0.3, h * 0.5 + 22, { color: "#f59e0b", lw: 2 });
            k.label((tx + 24 + w * 0.3) / 2, h * 0.5 + 14, "gate signal", { align: "center", size: 10, color: "#b45309" });

            k.arrow(40, h - 40, w - 40, h - 40, { color: "#0e7490", lw: 3 });
            k.label(44, h - 26, "common ground — battery GND and MCU GND together, never the VCC", {
              size: 10,
              color: "#0e7490"
            });
          }
        }
      ]
    });
  }
})();
