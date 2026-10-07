(function () {
  "use strict";

  /* INFO5995 — Week 3 (Mobile Security) page behaviour.
   *
   * The declarative widgets (race, sequence, matcher, timeline, hotspot,
   * pipeline, deck) are mounted by shared/interactive.js from the JSON config
   * blocks embedded in chapter3-study.html. This file owns the three animated
   * canvas steppers that need real drawing code, plus the re-binding that a
   * language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initEvolutionStepper();
    initGuardStepper();
    initAgentStepper();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every stepper host
   * and every quick-check inside a translated section is a brand-new node.
   * Re-mount the steppers and re-run the chrome bindings; the sidebar toggle
   * lives outside any section, so its old listener is dropped first to avoid
   * double-binding. */
  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    initEvolutionStepper();
    initGuardStepper();
    initAgentStepper();
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
    if (!window.initINFO5995ChapterUI) return;
    try {
      window.initINFO5995ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[INFO5995 chapter 3] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Stepper 1: how the mobile attack surface widened ───────── */

  function initEvolutionStepper() {
    var host = document.getElementById("ix-evolution");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-evolution", {
      title: "Four generations of mobile attack surface",
      subtitle: "Each generation added a boundary that had to be defended. The threat does not replace the previous one — it accumulates.",
      height: 280,
      frames: [
        {
          title: "The phone as an appliance",
          caption: "The device is a closed handset on a carrier network. The attack surface is the radio link and the physical object; the defence is the operator's network and physical custody.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            var bw = 92;
            var bh = 156;
            k.box(cx - bw / 2, cy - bh / 2, bw, bh, { fill: "#ffffff", stroke: "#047857", lw: 2, r: 14 });
            k.box(cx - bw / 2 + 10, cy - bh / 2 + 14, bw - 20, 52, { fill: "#eef7f4", stroke: "#94a3b8", lw: 1.2, r: 6 });
            k.label(cx, cy - bh / 2 + 40, "no store", { align: "center", size: 10, color: "#565d75" });
            k.box(cx - 20, cy + 26, 40, 18, { fill: "#e2e8f0", stroke: "#94a3b8", lw: 1.2, r: 5 });
            k.label(cx, cy + 35, "keypad", { align: "center", size: 9, mono: true, color: "#565d75" });
            k.label(cx, cy + bh / 2 + 26, "attack surface: the radio link and the hardware", {
              align: "center",
              size: 11.5,
              color: "#565d75"
            });
            k.arrow(cx - 170, cy, cx - bw / 2 - 12, cy, { color: "#94a3b8", dash: [5, 4], lw: 1.5 });
            k.label(cx - 176, cy - 14, "carrier network", { align: "right", size: 10.5, color: "#7b829a" });
          }
        },
        {
          title: "The phone as a platform",
          caption: "App stores and third-party apps arrive, so the device must decide what an app may do. The sandbox, the permission prompt and the signing chain become the load-bearing controls.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            k.box(cx - 150, cy - 78, 300, 156, { fill: "#f4fbf8", stroke: "#059669", lw: 2, r: 16 });
            k.label(cx, cy - 60, "SANDBOX", { align: "center", size: 11, mono: true, color: "#047857" });

            var slots = [-88, 0, 88];
            slots.forEach(function (dx, i) {
              k.box(cx + dx - 34, cy - 30, 68, 58, { fill: "#ffffff", stroke: "#94a3b8", lw: 1.6, r: 8 });
              k.label(cx + dx, cy - 4, "app", { align: "center", size: 11, color: "#141826" });
              k.label(cx + dx, cy + 14, "uid " + (i + 1), { align: "center", size: 9, mono: true, color: "#7b829a" });
            });

            k.box(cx - 150, cy + 44, 300, 24, { fill: "#eef7f4", stroke: "#059669", lw: 1.2, r: 8 });
            k.label(cx, cy + 56, "permissions checked before each crossing", {
              align: "center",
              size: 10.5,
              color: "#047857"
            });
            k.label(cx, cy - 96, "attack surface: apps, permissions and the store", {
              align: "center",
              size: 11.5,
              color: "#565d75"
            });
          }
        },
        {
          title: "The phone as an integration point",
          caption: "Deep links, exported components and rich inter-app messaging mean requests can arrive without a human composing them. Every entry point must validate its input and check the session.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            k.box(cx - 46, cy - 40, 92, 80, { fill: "#ffffff", stroke: "#059669", lw: 2, r: 12 });
            k.label(cx, cy - 8, "app", { align: "center", size: 13, color: "#141826" });
            k.label(cx, cy + 14, "exported = ?", { align: "center", size: 9.5, mono: true, color: "#7b829a" });

            var sources = [
              { x: 0.14, y: 0.2, t: "deep link" },
              { x: 0.14, y: 0.8, t: "other app" },
              { x: 0.86, y: 0.2, t: "web page" },
              { x: 0.86, y: 0.8, t: "intent filter" }
            ];
            sources.forEach(function (s) {
              var x = w * s.x;
              var y = h * s.y;
              k.box(x - 44, y - 15, 88, 30, { fill: "#f8fafc", stroke: "#94a3b8", lw: 1.4, r: 8 });
              k.label(x, y, s.t, { align: "center", size: 10.5, color: "#565d75" });
              k.arrow(x + (s.x < 0.5 ? 44 : -44), y, cx + (s.x < 0.5 ? -48 : 48), cy, {
                color: "#dc2626",
                dash: [4, 4],
                lw: 1.5
              });
            });
            k.label(cx, cy + 68, "untrusted input arrives from outside the app", {
              align: "center",
              size: 11.5,
              color: "#565d75"
            });
          }
        },
        {
          title: "The phone as a target for automation",
          caption: "An agent reads the UI tree and acts at machine speed. Anything the tree exposes can be enumerated, so UI metadata and automated actions join the attack surface.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var leftW = w * 0.44;
            k.box(24, 34, leftW, h - 68, { fill: "#ffffff", stroke: "#059669", lw: 1.8, r: 12 });
            k.label(24 + leftW / 2, 54, "UI TREE", { align: "center", size: 10.5, mono: true, color: "#047857" });
            var rows = [
              "TEXT      Gmail",
              "TYPE      Button",
              "CLICKABLE true",
              "BOUNDS    screen location"
            ];
            k.code(40, 86, rows, { size: 11.5, lh: 22, color: "#334155" });

            var rx = leftW + 60;
            k.box(rx, 34, w - rx - 24, h - 68, { fill: "#f4fbf8", stroke: "#94a3b8", lw: 1.6, r: 12 });
            k.label(rx + (w - rx - 24) / 2, 54, "AGENT LOOP", { align: "center", size: 10.5, mono: true, color: "#047857" });
            var steps = ["OBSERVE", "DECIDE", "ACT", "REPEAT"];
            steps.forEach(function (s, i) {
              var y = 88 + i * 34;
              k.box(rx + 22, y - 13, w - rx - 68, 26, { fill: "#ffffff", stroke: "#cbd5e1", lw: 1.2, r: 7 });
              k.label(rx + 34, y, s, { size: 10.5, mono: true, color: i === 3 ? "#059669" : "#334155" });
            });
            k.arrow(leftW + 34, h / 2, rx + 10, h / 2, { color: "#059669", lw: 1.8 });
            k.label(w / 2, h - 16, "structure becomes actionable data", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: three boundaries, three guards ──────────────── */

  function initGuardStepper() {
    var host = document.getElementById("ix-guards");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-guards", {
      title: "What each layer controls, and what it stops",
      subtitle: "Every layer controls access to the layer below it. To own the phone, code must cross all four boundaries.",
      height: 330,
      intervalMs: 2100,
      frames: [
        {
          title: "Layer 1 — the app runs in its own sandbox",
          caption: "Each app normally has its own user ID and its own sandbox. This is what stops one app from freely reading another app's private data.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 + 6;
            k.box(24, 24, w - 48, h - 48, { fill: "#f4fbf8", stroke: "#059669", lw: 2, r: 16 });
            k.label(40, 44, "SANDBOX", { size: 11, mono: true, color: "#047857" });
            k.box(cx - 200, cy - 46, 118, 92, { fill: "#ffffff", stroke: "#059669", lw: 2, r: 10 });
            k.label(cx - 141, cy - 12, "your app", { align: "center", size: 11.5, color: "#141826" });
            k.label(cx - 141, cy + 10, "uid 10121", { align: "center", size: 10, mono: true, color: "#7b829a" });
            k.box(cx + 82, cy - 46, 118, 92, { fill: "#ffffff", stroke: "#94a3b8", lw: 1.6, r: 10 });
            k.label(cx + 141, cy - 12, "other app", { align: "center", size: 11.5, color: "#565d75" });
            k.label(cx + 141, cy + 10, "uid 10134", { align: "center", size: 10, mono: true, color: "#7b829a" });
            k.box(cx - 44, cy - 16, 88, 32, { fill: "#fee2e2", stroke: "#dc2626", lw: 1.8, r: 8 });
            k.label(cx, cy, "blocked", { align: "center", size: 10.5, mono: true, color: "#b91c1c" });
            k.label(cx, cy + 82, "control: separate user IDs, separate data directories, no direct file access across apps", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "Layer 2 — permissions gate protected resources",
          caption: "Camera, location, files and microphone require controlled access. A permission is a decision made at the boundary, not a property of the app.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            k.box(cx - 300, cy - 40, 120, 80, { fill: "#ffffff", stroke: "#059669", lw: 2, r: 10 });
            k.label(cx - 240, cy, "app", { align: "center", size: 12, color: "#141826" });
            k.box(cx - 120, cy - 46, 240, 92, { fill: "#eef7f4", stroke: "#047857", lw: 2, r: 10 });
            k.label(cx, cy - 22, "PERMISSION CHECK", { align: "center", size: 11, mono: true, color: "#047857" });
            k.label(cx, cy + 2, "granted? scoped? while in use?", { align: "center", size: 10, color: "#565d75" });
            k.label(cx, cy + 22, "deny \u2192 nothing crosses", { align: "center", size: 10, mono: true, color: "#b91c1c" });
            k.arrow(cx - 180, cy, cx - 126, cy, { color: "#059669", lw: 1.8 });
            k.arrow(cx + 126, cy, cx + 176, cy, { color: "#059669", lw: 1.8 });

            var dest = [
              { dy: -34, t: "camera" },
              { dy: 0, t: "location" },
              { dy: 34, t: "files" }
            ];
            dest.forEach(function (d) {
              k.box(cx + 180, cy + d.dy - 14, 110, 28, { fill: "#ffffff", stroke: "#94a3b8", lw: 1.4, r: 7 });
              k.label(cx + 235, cy + d.dy, d.t, { align: "center", size: 10.5, color: "#565d75" });
            });
            k.label(cx, cy + 84, "control: an explicit grant per resource, checked at request time", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "Layer 3 — the framework and HAL translate the request",
          caption: "The app asks Android to perform an action; it never controls the device directly. The framework checks and manages the request, and the HAL translates it for the hardware.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2;
            var lanes = [
              { t: "APP", n: "requests a capability", c: "#ffffff", s: "#059669" },
              { t: "ANDROID API", n: "receives the request", c: "#f8fafc", s: "#94a3b8" },
              { t: "FRAMEWORK", n: "checks and manages it", c: "#eef7f4", s: "#047857" },
              { t: "HAL", n: "translates it", c: "#f8fafc", s: "#94a3b8" },
              { t: "HARDWARE", n: "camera, GPS, sensors", c: "#ffffff", s: "#059669" }
            ];
            var bw = Math.min(132, (w - 60) / lanes.length - 14);
            var total = lanes.length * bw + (lanes.length - 1) * 18;
            var x0 = (w - total) / 2;
            lanes.forEach(function (lane, i) {
              var x = x0 + i * (bw + 18);
              k.box(x, cy - 44, bw, 88, { fill: lane.c, stroke: lane.s, lw: 1.8, r: 10 });
              k.label(x + bw / 2, cy - 14, lane.t, { align: "center", size: 10.5, mono: true, color: "#047857" });
              k.label(x + bw / 2, cy + 8, lane.n, { align: "center", size: 9.5, color: "#565d75" });
              if (i < lanes.length - 1) {
                k.arrow(x + bw + 2, cy - 8, x + bw + 16, cy - 8, { color: "#94a3b8", lw: 1.5 });
                k.arrow(x + bw + 16, cy + 8, x + bw + 2, cy + 8, { color: "#cbd5e1", lw: 1.3 });
              }
            });
            k.label(w / 2, cy + 74, "example: camera app \u2192 camera API \u2192 permission check \u2192 camera hardware", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "Layer 4 — privilege decides the impact",
          caption: "Apps sit lowest in trust, framework services above them, native services and the HAL above that, and the kernel at the top. More privilege means more harm if the layer is compromised.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var tiers = [
              { t: "KERNEL", s: "highest trust \u2014 owns the device", v: 1 },
              { t: "NATIVE SERVICES / HAL", s: "high \u2014 drives the hardware", v: 0.75 },
              { t: "FRAMEWORK SERVICES", s: "medium \u2014 answers permission and intent checks", v: 0.5 },
              { t: "APPS", s: "lowest \u2014 one sandbox, one grant at a time", v: 0.25 }
            ];
            var barH = 30;
            var gap = 12;
            var top = 34;
            var x = 40;
            var maxW = w - 80;
            tiers.forEach(function (tier, i) {
              var y = top + i * (barH + gap);
              var bw = maxW * tier.v;
              var fill = i === 0 ? "#047857" : i === 1 ? "#0f9d76" : i === 2 ? "#7fd1b9" : "#d7ede6";
              k.box(x, y, bw, barH, { fill: fill, stroke: "#047857", lw: 1.2, r: 8 });
              k.label(x + 12, y + barH / 2, tier.t, {
                size: 10.5,
                mono: true,
                color: i < 2 ? "#ffffff" : "#065f46"
              });
              k.label(x + bw + 10, y + barH / 2, tier.s, { size: 10, color: "#565d75" });
            });
            k.box(x, top + 4 * (barH + gap) - 4, maxW, 20, { fill: "#f8fafc", stroke: "#cbd5e1", lw: 1, r: 6 });
            k.label(x + maxW / 2, top + 4 * (barH + gap) + 6, "each layer controls what the layer above can do", {
              align: "center",
              size: 10.5,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: the mobile agent loop ──────────────────────── */

  function initAgentStepper() {
    var host = document.getElementById("ix-agent");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-agent", {
      title: "A mobile agent repeats one simple loop",
      subtitle: "Observe \u2192 decide \u2192 act \u2192 repeat. The loop keeps running until the task is complete — and it now has a machine's patience.",
      height: 270,
      frames: [
        {
          title: "Observe — read the screen and its UI elements",
          caption: "The agent does not see pixels. It reads the UI tree: each element becomes structured data with text, type, clickability and bounds.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            k.box(cx - 300, cy - 78, 264, 156, { fill: "#ffffff", stroke: "#059669", lw: 1.8, r: 12 });
            k.label(cx - 168, cy - 58, "SCREEN", { align: "center", size: 10.5, mono: true, color: "#047857" });
            k.box(cx - 278, cy - 40, 220, 32, { fill: "#eef7f4", stroke: "#94a3b8", lw: 1.2, r: 7 });
            k.label(cx - 168, cy - 24, "Inbox", { align: "center", size: 11, color: "#141826" });
            k.box(cx - 278, cy + 2, 220, 32, { fill: "#f8fafc", stroke: "#94a3b8", lw: 1.2, r: 7 });
            k.label(cx - 168, cy + 18, "Compose", { align: "center", size: 11, color: "#565d75" });
            k.box(cx + 36, cy - 78, 264, 156, { fill: "#f4fbf8", stroke: "#059669", lw: 1.8, r: 12 });
            k.label(cx + 168, cy - 58, "UI TREE", { align: "center", size: 10.5, mono: true, color: "#047857" });
            k.code(cx + 52, cy - 32, ["TEXT      Inbox", "TYPE      Button", "CLICKABLE true", "BOUNDS    x,y,w,h"], {
              size: 10.5,
              lh: 21,
              color: "#334155"
            });
            k.arrow(cx - 30, cy, cx + 26, cy, { color: "#059669", lw: 1.8 });
          }
        },
        {
          title: "Decide — choose the next action",
          caption: "The agent picks from the actions the tree supports. The quality of the labels is what makes that choice reliable — and what makes it manipulable.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            k.box(cx - 250, cy - 60, 130, 120, { fill: "#ffffff", stroke: "#94a3b8", lw: 1.6, r: 12 });
            k.label(cx - 185, cy - 34, "goal", { align: "center", size: 10.5, mono: true, color: "#7b829a" });
            k.label(cx - 185, cy - 4, "open the", { align: "center", size: 11, color: "#565d75" });
            k.label(cx - 185, cy + 16, "coupon screen", { align: "center", size: 11, color: "#565d75" });

            var opts = ["tap Compose", "tap Inbox", "open deep link", "swipe back"];
            opts.forEach(function (o, i) {
              var y = cy - 54 + i * 38;
              var chosen = i === 2;
              k.box(cx - 40, y - 15, 250, 30, {
                fill: chosen ? "#eef7f4" : "#ffffff",
                stroke: chosen ? "#059669" : "#cbd5e1",
                lw: chosen ? 2 : 1.3,
                r: 8
              });
              k.label(cx - 28, y, o, { size: 11, color: chosen ? "#047857" : "#565d75" });
              if (chosen) k.highlight(cx - 40, y - 15, 250, 30, { color: "#059669" });
            });
            k.arrow(cx - 116, cy, cx - 46, cy, { color: "#059669", lw: 1.8 });
            k.label(cx, cy + 96, "the choice is only as good as the labels it reads", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "Act — tap, type, swipe or open",
          caption: "The agent performs the action the way a person would, through the same interface. Every action is subject to the same authorisation questions a human action faces.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            k.box(cx - 250, cy - 74, 220, 148, { fill: "#ffffff", stroke: "#059669", lw: 1.8, r: 12 });
            k.label(cx - 140, cy - 54, "ACTION", { align: "center", size: 10.5, mono: true, color: "#047857" });
            var actions = ["tap", "type", "swipe", "open"];
            actions.forEach(function (a, i) {
              var y = cy - 26 + i * 32;
              k.box(cx - 230, y - 12, 180, 24, { fill: i === 0 ? "#eef7f4" : "#f8fafc", stroke: "#cbd5e1", lw: 1.2, r: 6 });
              k.label(cx - 216, y, a, { size: 10.5, mono: true, color: i === 0 ? "#047857" : "#565d75" });
            });
            k.arrow(cx - 24, cy, cx + 26, cy, { color: "#059669", lw: 1.8 });
            k.box(cx + 32, cy - 74, 220, 148, { fill: "#f4fbf8", stroke: "#94a3b8", lw: 1.6, r: 12 });
            k.label(cx + 142, cy - 54, "WHAT MUST STILL HOLD", { align: "center", size: 10, mono: true, color: "#047857" });
            k.code(cx + 48, cy - 24, ["session valid?", "action authorised?", "user confirmed?", "input validated?"], {
              size: 10.5,
              lh: 22,
              color: "#334155"
            });
          }
        },
        {
          title: "Repeat — observe the result and continue",
          caption: "The agent keeps looping until the task is complete. Automation can inspect and operate the UI at scale, so UI metadata and automated actions belong to the app's attack surface.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            var r = Math.min(w * 0.28, h * 0.34);
            k.dot(cx, cy, r, { fill: "rgba(5,150,105,0.07)", stroke: "#059669", lw: 2 });
            var labels = ["OBSERVE", "DECIDE", "ACT", "REPEAT"];
            var positions = [
              { x: cx, y: cy - r },
              { x: cx + r, y: cy },
              { x: cx, y: cy + r },
              { x: cx - r, y: cy }
            ];
            positions.forEach(function (p, i) {
              k.dot(p.x, p.y, 26, { fill: "#ffffff", stroke: "#059669", lw: 2 });
              k.label(p.x, p.y, String(i + 1), { align: "center", size: 13, mono: true, color: "#047857" });
              var lx = p.x + (i === 1 ? 40 : i === 3 ? -40 : 0);
              var ly = p.y + (i === 2 ? 40 : i === 0 ? -40 : 0);
              k.label(lx, ly, labels[i], {
                align: i === 1 ? "left" : i === 3 ? "right" : "center",
                size: 10.5,
                mono: true,
                color: "#565d75"
              });
            });
            k.arrow(cx + r - 18, cy - 18, cx + 18, cy - r + 18, { color: "#059669", lw: 1.6 });
            k.arrow(cx + 18, cy + r - 18, cx + r - 18, cy + 18, { color: "#059669", lw: 1.6 });
            k.arrow(cx - 18, cy + r - 18, cx - r + 18, cy + 18, { color: "#059669", lw: 1.6 });
            k.arrow(cx - r + 18, cy - 18, cx - 18, cy - r + 18, { color: "#059669", lw: 1.6 });
            k.label(cx, cy + 6, "loop until", { align: "center", size: 10.5, color: "#7b829a" });
            k.label(cx, cy + 24, "the task is done", { align: "center", size: 10.5, color: "#7b829a" });
          }
        }
      ]
    });
  }
})();
