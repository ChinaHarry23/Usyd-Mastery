(function () {
  "use strict";

  /* COMP5047 — Week 3 page behaviour.
   *
   * The declarative widgets (hotspot, pipeline, deck, race, timeline, sequence,
   * matcher) are mounted by shared/interactive.js from the JSON config blocks in
   * the page. This file owns the four animated canvas steppers — digital
   * sampling, Ohm's law, the breadboard build order and contact bounce — plus the
   * re-binding that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    mountSteppers();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every widget and
   * every quick-check inside a translated section is a brand-new node with the
   * same id. Re-mount the widgets and re-run the chrome bindings; the sidebar
   * toggle lives outside any section, so its old listener is dropped first to
   * avoid double-binding. */
  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    mountSteppers();
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
        window.console.error("[COMP5047 chapter 3] chapter chrome failed to initialise:", err);
      }
    }
  }

  function mountSteppers() {
    initSignalStepper();
    initOhmStepper();
    initBreadboardStepper();
    initDebounceStepper();
  }

  /* ── Shared drawing colours ─────────────────────────────────── */

  var ACCENT = "#0e7490";
  var ACCENT_SOFT = "rgba(8,145,178,0.12)";
  var LINE = "#94a3b8";
  var DIM = "#565d75";
  var GREEN = "#059669";
  var AMBER = "#f59e0b";
  var RED = "#dc2626";

  /* ── Stepper 1: analogue reality → digital reading ──────────── */

  /* A fixed, deterministic "physical" voltage trace. The point of the stepper is
   * that this trace never changes between frames — only the interpretation of it
   * does. */
  function analogAt(u) {
    return (
      0.5 +
      0.3 * Math.sin(u * Math.PI * 3.2) +
      0.09 * Math.sin(u * Math.PI * 11.7) +
      0.05 * Math.sin(u * Math.PI * 23.1)
    );
  }

  function initSignalStepper() {
    var host = document.getElementById("ix-signal");
    if (!host || !window.Interactive) return;

    var N = 26;
    var PAD_L = 58;
    var PAD_R = 24;
    var PAD_T = 30;
    var PAD_B = 40;

    function plot(w, h) {
      return {
        x0: PAD_L,
        x1: w - PAD_R,
        y0: PAD_T,
        y1: h - PAD_B
      };
    }

    function xOf(u, p) {
      return p.x0 + u * (p.x1 - p.x0);
    }

    function yOf(v, p) {
      return p.y1 - v * (p.y1 - p.y0);
    }

    function trace(k, p) {
      for (var i = 0; i <= 160; i++) {
        var u = i / 160;
        var x = xOf(u, p);
        var y = yOf(analogAt(u), p);
        if (i === 0) {
          // start the polyline with a one-pixel segment
          k.arrow(x, y, x + 0.6, yOf(analogAt(0.004), p), { color: ACCENT, lw: 2.4, head: 0.1 });
        } else {
          k.arrow(
            xOf((i - 1) / 160, p),
            yOf(analogAt((i - 1) / 160), p),
            x,
            y,
            { color: ACCENT, lw: 2.4, head: 0.1 }
          );
        }
      }
    }

    function axes(k, p) {
      k.arrow(p.x0, p.y1, p.x1, p.y1, { color: LINE, lw: 1.4 });
      k.arrow(p.x0, p.y1, p.x0, p.y0 - 6, { color: LINE, lw: 1.4 });
      k.label(p.x0 - 10, p.y0 - 6, "volts", { size: 10, align: "right", color: DIM, mono: true });
      k.label(p.x1, p.y1 + 18, "time", { size: 10, align: "right", color: DIM, mono: true });
    }

    /* Hysteresis: a sample only changes the stored level when it is clearly
     * above the HIGH threshold or clearly below the LOW one. */
    function bits() {
      var out = [];
      var level = 0;
      for (var i = 0; i < N; i++) {
        var v = analogAt((i + 0.5) / N);
        if (v >= 0.6) level = 1;
        else if (v <= 0.3) level = 0;
        out.push(level);
      }
      return out;
    }

    window.Interactive.stepper("ix-signal", {
      title: "From a physical voltage to a digital reading",
      titleZh: "从物理电压到数字读数",
      subtitle: "The same trace in every frame — what changes is how the hardware interprets it.",
      subtitleZh: "每一帧的曲线完全相同——改变的是硬件解释它的方式。",
      height: 250,
      frames: [
        {
          title: "The voltage itself is continuous",
          titleZh: "电压本身是连续的",
          caption: "Charge does not move in steps. At the pin there is a smoothly varying voltage, and an analogue input would report a number proportional to it.",
          captionZh: "电荷不会以台阶方式移动。引脚上的电压是平滑变化的，模拟输入会给出与它成正比的数值。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var p = plot(w, h);
            axes(k, p);
            trace(k, p);
            k.label(w / 2, h - 12, "an analogue reading would return a different number at every instant", {
              align: "center",
              size: 11,
              color: DIM
            });
          }
        },
        {
          title: "The receiver adds threshold bands",
          titleZh: "接收端加入阈值带",
          caption: "Below 0.3 x VCC is LOW, above 0.6 x VCC is HIGH. The strip between them is deliberately undefined, and that gap is the noise margin.",
          captionZh: "低于 0.3 × VCC 判为 LOW，高于 0.6 × VCC 判为 HIGH。两者之间的区间被有意留作未定义，这段间隔就是噪声容限。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var p = plot(w, h);
            var yHigh = yOf(0.6, p);
            var yLow = yOf(0.3, p);
            k.box(p.x0, p.y0, p.x1 - p.x0, yHigh - p.y0, { fill: "rgba(5,150,105,0.10)", stroke: null, r: 2 });
            k.box(p.x0, yLow, p.x1 - p.x0, p.y1 - yLow, { fill: "rgba(37,99,235,0.10)", stroke: null, r: 2 });
            k.box(p.x0, yHigh, p.x1 - p.x0, yLow - yHigh, { fill: "rgba(245,158,11,0.10)", stroke: null, r: 2 });
            k.arrow(p.x0, yHigh, p.x1, yHigh, { color: GREEN, lw: 1.3, dash: [6, 5], head: 0.1 });
            k.arrow(p.x0, yLow, p.x1, yLow, { color: "#2563eb", lw: 1.3, dash: [6, 5], head: 0.1 });
            k.label(p.x1, yHigh - 12, "HIGH  >= 3.0 V", { align: "right", size: 10, mono: true, color: GREEN });
            k.label(p.x1, (yHigh + yLow) / 2, "undefined", { align: "right", size: 10, mono: true, color: "#b45309" });
            k.label(p.x1, yLow + 14, "LOW  <= 1.5 V", { align: "right", size: 10, mono: true, color: "#2563eb" });
            axes(k, p);
            trace(k, p);
          }
        },
        {
          title: "The pin is sampled at fixed moments",
          titleZh: "引脚在固定时刻被采样",
          caption: "The firmware only ever sees the trace at the instants it calls digitalRead(). Everything between two samples is invisible to the program.",
          captionZh: "固件只能在调用 digitalRead() 的那些瞬间看到曲线。两次采样之间发生的一切对程序都是不可见的。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var p = plot(w, h);
            axes(k, p);
            trace(k, p);
            for (var i = 0; i < N; i++) {
              var u = (i + 0.5) / N;
              var x = xOf(u, p);
              var y = yOf(analogAt(u), p);
              k.arrow(x, p.y1, x, p.y0, { color: "rgba(148,163,184,0.45)", lw: 1, dash: [3, 4], head: 0.1 });
              k.dot(x, y, 3.6, { fill: "#ffffff", stroke: ACCENT, lw: 1.6 });
            }
            k.label(w / 2, h - 12, "one sample every pass of loop()", { align: "center", size: 11, color: DIM });
          }
        },
        {
          title: "Each sample becomes one bit",
          titleZh: "每个采样变成一个比特",
          caption: "A sample above the HIGH threshold stores a 1, below the LOW threshold a 0, and anything in between keeps the previous value. The result is a clean square wave.",
          captionZh: "高于 HIGH 阈值的采样记为 1，低于 LOW 阈值的记为 0，介于两者之间则保持原值。结果是一条干净的方波。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var p = plot(w, h);
            var b = bits();
            var yTop = yOf(0.78, p);
            var yBot = yOf(0.22, p);
            k.arrow(p.x0, p.y1, p.x1, p.y1, { color: LINE, lw: 1.4 });
            k.label(p.x0 - 10, yTop, "1", { align: "right", size: 11, mono: true, color: ACCENT });
            k.label(p.x0 - 10, yBot, "0", { align: "right", size: 11, mono: true, color: ACCENT });
            for (var i = 0; i < N; i++) {
              var xa = xOf(i / N, p);
              var xb = xOf((i + 1) / N, p);
              var y = b[i] ? yTop : yBot;
              k.arrow(xa, y, xb, y, { color: ACCENT, lw: 3, head: 0.1 });
              if (i > 0 && b[i] !== b[i - 1]) {
                k.arrow(xa, b[i - 1] ? yTop : yBot, xa, y, { color: ACCENT, lw: 3, head: 0.1 });
              }
            }
            k.label(w / 2, h - 12, "two states only — the noise margin absorbed the wiggle", {
              align: "center",
              size: 11,
              color: DIM
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: Ohm's law as a relationship ─────────────────── */

  function initOhmStepper() {
    var host = document.getElementById("ix-ohm");
    if (!host || !window.Interactive) return;

    function pairBars(k, w, h, cases) {
      var baseY = h - 62;
      var groupW = (w - 80) / cases.length;
      cases.forEach(function (c, i) {
        var cx = 40 + groupW * i + groupW / 2;
        k.label(cx, 30, c.caption, { align: "center", size: 12, weight: "700", color: ACCENT });
        k.bar(cx - 66, 56, 56, 16, c.volts, { max: 6, fill: "#2563eb", track: "rgba(148,163,184,0.25)" });
        k.label(cx - 66, 50, "V = " + c.volts.toFixed(1) + " V", { size: 10, mono: true, color: DIM });
        k.bar(cx - 66, 96, 56, 16, c.ohms, { max: 500, fill: AMBER, track: "rgba(148,163,184,0.25)" });
        k.label(cx - 66, 90, "R = " + c.ohms + " Ω", { size: 10, mono: true, color: DIM });
        k.bar(cx + 6, 76, Math.max(24, groupW / 2 - 30), 18, c.mA, { max: 30, fill: GREEN, track: "rgba(148,163,184,0.25)" });
        k.label(cx + 6, 68, "I = " + c.mA.toFixed(1) + " mA", { size: 10, mono: true, color: DIM });
      });
      k.label(w / 2, baseY + 34, "I = V / R  —  the current bar is the quotient of the other two", {
        align: "center",
        size: 11,
        color: DIM
      });
    }

    window.Interactive.stepper("ix-ohm", {
      title: "Ohm's law as a relationship, not a recipe",
      titleZh: "欧姆定律是一种关系，而不是一条配方",
      subtitle: "Fix two of the three quantities and the third is determined. Every calculation this week is one rearrangement.",
      subtitleZh: "三个量中固定任意两个，第三个就被确定。本周的每一次计算都只是它的变形。",
      height: 240,
      frames: [
        {
          title: "One equation, three arrangements",
          titleZh: "一个方程，三种变形",
          caption: "V = R x I solves for voltage; I = V / R solves for current; R = V / I solves for resistance. The deck starts from the first and reaches for the others as needed.",
          captionZh: "V = R × I 求电压；I = V / R 求电流；R = V / I 求电阻。讲义从第一式出发，按需取用其余两式。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            k.label(cx, 40, "V  =  R  ×  I", { align: "center", size: 26, weight: "700", mono: true, color: ACCENT });
            var rows = [
              ["V", "voltage", "volts", "#2563eb"],
              ["I", "current", "amperes", GREEN],
              ["R", "resistance", "ohms", AMBER]
            ];
            rows.forEach(function (r, i) {
              var y = 92 + i * 40;
              k.box(cx - 210, y - 16, 42, 32, { fill: r[3], stroke: null, r: 8 });
              k.label(cx - 189, y, r[0], { align: "center", size: 15, weight: "700", mono: true, color: "#ffffff" });
              k.label(cx - 154, y, r[1], { size: 12, color: DIM });
              k.label(cx + 210, y, r[2], { align: "right", size: 12, mono: true, color: DIM });
            });
          }
        },
        {
          title: "Double the voltage, double the current",
          titleZh: "电压加倍，电流加倍",
          caption: "The deck's own numbers: 1.5 V across 220 ohms gives 6.8 mA, and 3.0 V across the same resistor gives 13.6 mA. Current is proportional to voltage when R is fixed.",
          captionZh: "讲义中的数字：220 欧姆上施加 1.5 V 得到 6.8 mA；同样电阻上施加 3.0 V 得到 13.6 mA。R 固定时，电流与电压成正比。",
          draw: function (ctx, w, h, k) {
            k.clear();
            pairBars(k, w, h, [
              { caption: "the deck's 1.5 V cell", volts: 1.5, ohms: 220, mA: 6.8 },
              { caption: "twice the voltage", volts: 3.0, ohms: 220, mA: 13.6 }
            ]);
          }
        },
        {
          title: "Double the resistance, halve the current",
          titleZh: "电阻加倍，电流减半",
          caption: "Same 3 V supply, but now the loop contains 220 ohms and then 440 ohms. Current is inversely proportional to resistance, which is exactly how the deck's division rule behaves.",
          captionZh: "同样是 3 V 电源，但回路中先接 220 欧姆、再换 440 欧姆。电流与电阻成反比，这正是讲义中电流分配规律的体现。",
          draw: function (ctx, w, h, k) {
            k.clear();
            pairBars(k, w, h, [
              { caption: "R = 220 Ω", volts: 3.0, ohms: 220, mA: 13.6 },
              { caption: "R doubled", volts: 3.0, ohms: 440, mA: 6.8 }
            ]);
          }
        },
        {
          title: "Now remove the resistor",
          titleZh: "现在去掉电阻",
          caption: "As R approaches zero the current is limited only by the source and the wires: I = V / 0 → unbounded. That is the short circuit the deck demonstrates, and it is why no LED is ever wired without a series resistor.",
          captionZh: "当 R 趋近于零，电流只受电源与导线限制：I = V / 0 → 无穷大。这就是讲义演示的短路，也是任何 LED 都必须串联电阻的原因。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 6;
            k.box(30, cy - 34, 96, 68, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 1.8, r: 10 });
            k.label(78, cy - 8, "5 V", { align: "center", size: 13, mono: true, color: ACCENT });
            k.label(78, cy + 14, "supply", { align: "center", size: 10, color: DIM });
            k.arrow(126, cy, w - 60, cy, { color: RED, lw: 3 });
            k.label(w / 2, cy - 22, "R ~ 0 Ω  —  a plain wire", { align: "center", size: 12, mono: true, color: RED });
            k.box(w - 108, cy - 34, 80, 68, { fill: "rgba(220,38,38,0.10)", stroke: RED, lw: 1.8, r: 10 });
            k.label(w - 68, cy - 8, "GND", { align: "center", size: 13, mono: true, color: RED });
            k.label(w - 68, cy + 14, "0 V", { align: "center", size: 10, color: DIM });
            k.label(w / 2, h - 30, "I = V / R → unbounded current", {
              align: "center",
              size: 15,
              weight: "700",
              mono: true,
              color: RED
            });
            k.label(w / 2, h - 10, "melting tracks, dead components, fire", { align: "center", size: 11, color: DIM });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: building the first circuit ──────────────────── */

  function initBreadboardStepper() {
    var host = document.getElementById("ix-breadboard");
    if (!host || !window.Interactive) return;

    function board(k, w, h, opts) {
      opts = opts || {};
      var x = 104;
      var y = 22;
      var bw = w - 132;
      var bh = h - 62;
      k.box(x, y, bw, bh, { fill: "#f8fbfc", stroke: LINE, lw: 1.6, r: 12 });
      /* power rails */
      k.arrow(x + 12, y + 26, x + bw - 12, y + 26, { color: RED, lw: 2, head: 0.1 });
      k.arrow(x + 12, y + bh - 26, x + bw - 12, y + bh - 26, { color: "#2563eb", lw: 2, head: 0.1 });
      k.label(x + bw - 14, y + 16, "5 V rail", { align: "right", size: 10, mono: true, color: RED });
      k.label(x + bw - 14, y + bh - 36, "GND rail", { align: "right", size: 10, mono: true, color: "#2563eb" });
      /* centre channel */
      k.arrow(x + 12, y + bh / 2, x + bw - 12, y + bh / 2, {
        color: "rgba(148,163,184,0.7)",
        lw: 1.2,
        dash: [5, 5],
        head: 0.1
      });
      if (opts.channelLabel !== false) {
        k.label(x + 12, y + bh / 2 - 12, "centre channel", { size: 10, color: DIM });
      }
      return { x: x, y: y, w: bw, h: bh, mid: y + bh / 2, railTop: y + 26, railBot: y + bh - 26 };
    }

    function led(k, x, y, on) {
      k.arrow(x - 34, y, x - 4, y, { color: LINE, lw: 2, head: 0.1 });
      k.box(x - 4, y - 22, 46, 44, {
        fill: on ? "rgba(245,158,11,0.30)" : "rgba(245,158,11,0.12)",
        stroke: AMBER,
        lw: 2,
        r: 6
      });
      k.label(x + 19, y, "LED", { align: "center", size: 11, mono: true, color: "#b45309" });
      k.arrow(x + 42, y, x + 72, y, { color: LINE, lw: 2, head: 0.1 });
      if (on) {
        [0, 1, 2].forEach(function (i) {
          k.arrow(x + 19, y - 30 - i * 4, x + 34 + i * 6, y - 44 - i * 4, { color: AMBER, lw: 1.3 });
        });
      }
    }

    function resistor(k, x, y) {
      var pts = [
        [x, y],
        [x + 8, y - 16],
        [x + 22, y + 16],
        [x + 36, y - 16],
        [x + 50, y + 16],
        [x + 64, y - 16],
        [x + 72, y]
      ];
      for (var i = 1; i < pts.length; i++) {
        k.arrow(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], { color: AMBER, lw: 2.2, head: 0.1 });
      }
      k.label(x + 36, y + 34, "R = 330 Ω", { align: "center", size: 10, mono: true, color: "#b45309" });
    }

    window.Interactive.stepper("ix-breadboard", {
      title: "Building the LED circuit on a breadboard",
      titleZh: "在面包板上搭建 LED 电路",
      subtitle: "Five steps, in the order that avoids re-wiring: rails, LED, resistor, supply, signal.",
      subtitleZh: "五个步骤，按此顺序可避免返工：电源轨、LED、电阻、供电、信号。",
      height: 250,
      frames: [
        {
          title: "Step 1 — the board is a wiring pattern",
          titleZh: "第 1 步——面包板本身就是一种接线图案",
          caption: "Two rails run the whole length of the board, and the grid is split by a channel. Each column of five holes in the grid is one node; the rails are two more.",
          captionZh: "两条电源轨贯穿整块板，中间的沟槽把网格分成两半。网格中每一列五个孔是一个节点，两条电源轨又是另外两个节点。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var b = board(k, w, h);
            /* a few column markers */
            for (var i = 0; i < 8; i++) {
              var x = b.x + 40 + i * ((b.w - 70) / 8);
              k.arrow(x, b.mid - 34, x, b.mid - 6, { color: "rgba(148,163,184,0.8)", lw: 1.2, dash: [3, 3], head: 0.1 });
              k.arrow(x, b.mid + 6, x, b.mid + 34, { color: "rgba(148,163,184,0.8)", lw: 1.2, dash: [3, 3], head: 0.1 });
            }
            k.label(70, h / 2 - 26, "Arduino", { align: "center", size: 11, mono: true, color: ACCENT });
            k.box(16, h / 2 - 18, 76, 36, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 1.6, r: 8 });
            k.label(54, h / 2, "D9", { align: "center", size: 12, mono: true, color: ACCENT });
          }
        },
        {
          title: "Step 2 — the LED, straddling the channel",
          titleZh: "第 2 步——把 LED 跨在沟槽两侧",
          caption: "An LED is a diode, so orientation matters: the longer leg (anode) faces the signal side and the flat side (cathode) faces the return path. Reversing it produces a circuit that simply does nothing.",
          captionZh: "LED 是二极管，方向很重要：长脚（阳极）朝信号一侧，平边（阴极）朝回路一侧。装反了电路就完全不工作。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var b = board(k, w, h);
            led(k, b.x + b.w * 0.42, b.mid, false);
            k.highlight(b.x + b.w * 0.42 - 40, b.mid - 30, 116, 60, { color: AMBER });
          }
        },
        {
          title: "Step 3 — the series resistor completes the branch",
          titleZh: "第 3 步——串联电阻补全这一支路",
          caption: "R = (V_supply - V_f) / I. With a 5 V pin, a 2.0 V LED and a target near 9 mA, that is (5.0 - 2.0) / 0.009 = 333 ohms, so a standard 330 ohm resistor.",
          captionZh: "R = (V_supply − V_f) / I。5 V 引脚、2.0 V 的 LED、目标电流约 9 mA，则 (5.0 − 2.0) / 0.009 = 333 欧姆，取标准值 330 欧姆。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var b = board(k, w, h);
            led(k, b.x + b.w * 0.36, b.mid, false);
            resistor(k, b.x + b.w * 0.52, b.mid);
            k.highlight(b.x + b.w * 0.52 - 8, b.mid - 34, 90, 68, { color: AMBER });
          }
        },
        {
          title: "Step 4 — bring in 5 V and GND",
          titleZh: "第 4 步——引入 5 V 与 GND",
          caption: "Take 5 V and GND from the board's power header to the breadboard rails. Everything else in the circuit refers to those two rails, and the loop has to come back to GND or no current flows at all.",
          captionZh: "从开发板电源排针引出 5 V 与 GND 接到面包板电源轨。电路中其他一切都以这两条轨为参照，而且回路必须回到 GND，否则完全没有电流。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var b = board(k, w, h);
            led(k, b.x + b.w * 0.36, b.mid, false);
            resistor(k, b.x + b.w * 0.52, b.mid);
            k.arrow(92, b.railTop, b.x + 14, b.railTop, { color: RED, lw: 2 });
            k.arrow(92, b.railBot, b.x + 14, b.railBot, { color: "#2563eb", lw: 2 });
            k.box(16, b.railTop - 18, 76, 36, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 1.6, r: 8 });
            k.label(54, b.railTop, "5V", { align: "center", size: 12, mono: true, color: RED });
            k.box(16, b.railBot - 18, 76, 36, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 1.6, r: 8 });
            k.label(54, b.railBot, "GND", { align: "center", size: 12, mono: true, color: "#2563eb" });
          }
        },
        {
          title: "Step 5 — close the loop from a GPIO pin",
          titleZh: "第 5 步——用 GPIO 引脚闭合回路",
          caption: "digitalWrite(pin, HIGH) connects the pin to 5 V; the current then flows through the LED and the resistor and returns along the GND rail. Current in a series loop is the same at every point; the LED drops about 2.0 V and the resistor takes the remaining 3.0 V.",
          captionZh: "digitalWrite(pin, HIGH) 把引脚接到 5 V；电流随后经 LED 与电阻，沿 GND 轨返回。串联回路中各处电流相同；LED 分压约 2.0 V，电阻承担剩下的 3.0 V。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var b = board(k, w, h);
            led(k, b.x + b.w * 0.36, b.mid, true);
            resistor(k, b.x + b.w * 0.52, b.mid);
            k.box(16, b.mid - 18, 76, 36, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 1.6, r: 8 });
            k.label(54, b.mid, "D9 HIGH", { align: "center", size: 10, mono: true, color: ACCENT });
            k.arrow(92, b.mid, b.x + b.w * 0.36 - 40, b.mid, { color: RED, lw: 2 });
            k.arrow(b.x + b.w * 0.36 + 78, b.mid, b.x + b.w * 0.52 - 6, b.mid, { color: RED, lw: 2 });
            k.arrow(b.x + b.w * 0.52 + 78, b.mid, b.x + b.w - 20, b.mid, { color: RED, lw: 2 });
            k.arrow(b.x + b.w - 20, b.mid, b.x + b.w - 20, b.railBot - 4, { color: RED, lw: 2 });
            k.arrow(92, b.railBot, b.x + b.w - 22, b.railBot, { color: "#2563eb", lw: 2 });
            k.label(b.x + b.w * 0.36, b.mid + 52, "drops ~2.0 V", { align: "center", size: 10, mono: true, color: AMBER });
            k.label(b.x + b.w * 0.52 + 36, b.mid + 52, "drops 3.0 V", { align: "center", size: 10, mono: true, color: AMBER });
            k.label(w / 2, h - 12, "one path, one current: I = 3.0 V / 330 Ω = 9.1 mA", {
              align: "center",
              size: 11,
              mono: true,
              color: GREEN
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 4: contact bounce and the debounce window ──────── */

  var BOUNCE = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0];

  function bounceLevel(u) {
    if (u < 0.34) return 1;
    if (u >= 0.5) return 0;
    var i = Math.floor(((u - 0.34) / 0.16) * BOUNCE.length);
    return BOUNCE[Math.max(0, Math.min(BOUNCE.length - 1, i))];
  }

  function initDebounceStepper() {
    var host = document.getElementById("ix-debounce");
    if (!host || !window.Interactive) return;

    var PAD_L = 56;
    var PAD_R = 26;

    function xOf(u, w) {
      return PAD_L + u * (w - PAD_L - PAD_R);
    }

    function signal(k, w, h, steps) {
      var yTop = 62;
      var yBot = h - 76;
      k.arrow(PAD_L, yBot + 30, w - PAD_R, yBot + 30, { color: LINE, lw: 1.3 });
      k.label(PAD_L - 12, yTop, "HIGH", { align: "right", size: 10, mono: true, color: DIM });
      k.label(PAD_L - 12, yBot, "LOW", { align: "right", size: 10, mono: true, color: DIM });
      k.label(w - PAD_R, yBot + 48, "time →", { align: "right", size: 10, mono: true, color: DIM });
      var transitions = 0;
      for (var i = 0; i < steps; i++) {
        var ua = i / steps;
        var ub = (i + 1) / steps;
        var lv = bounceLevel(ua);
        var y = lv ? yTop : yBot;
        var xa = xOf(ua, w);
        var xb = xOf(ub, w);
        k.arrow(xa, y, xb, y, { color: ACCENT, lw: 3, head: 0.1 });
        if (i > 0 && lv !== bounceLevel((i - 0.5) / steps)) {
          k.arrow(xa, bounceLevel((i - 0.5) / steps) ? yTop : yBot, xa, y, { color: ACCENT, lw: 3, head: 0.1 });
          transitions++;
        }
      }
      return { yTop: yTop, yBot: yBot, transitions: transitions };
    }

    window.Interactive.stepper("ix-debounce", {
      title: "What the pin sees when a button is pressed",
      titleZh: "按下按键时引脚上真正发生了什么",
      subtitle: "The same press, viewed with more and more suspicion.",
      subtitleZh: "同一次按压，用越来越审慎的眼光去看。",
      height: 240,
      frames: [
        {
          title: "The datasheet version",
          titleZh: "数据手册里的版本",
          caption: "Ideally one press is one transition: HIGH while released, LOW the instant it is pressed, with a clean vertical edge and nothing in between.",
          captionZh: "理想情况下，一次按压就是一次跳变：松开时为 HIGH，按下的瞬间变为 LOW，边沿干净，中间没有任何过渡。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var yTop = 62;
            var yBot = h - 76;
            k.arrow(PAD_L, yBot + 30, w - PAD_R, yBot + 30, { color: LINE, lw: 1.3 });
            k.label(PAD_L - 12, yTop, "HIGH", { align: "right", size: 10, mono: true, color: DIM });
            k.label(PAD_L - 12, yBot, "LOW", { align: "right", size: 10, mono: true, color: DIM });
            var xd = xOf(0.45, w);
            k.arrow(xOf(0.05, w), yTop, xd, yTop, { color: ACCENT, lw: 3, head: 0.1 });
            k.arrow(xd, yTop, xd, yBot, { color: ACCENT, lw: 3, head: 0.1 });
            k.arrow(xd, yBot, xOf(0.95, w), yBot, { color: ACCENT, lw: 3, head: 0.1 });
            k.label(xd + 8, yBot + 50, "one press = one edge", { size: 11, color: DIM });
          }
        },
        {
          title: "What the metal actually does",
          titleZh: "金属触点实际的行为",
          caption: "The contacts rebound against each other, so between about 1 ms and 5 ms after the press the pin swings between the two levels several times. The firmware cannot tell these from genuine presses.",
          captionZh: "触点相互弹跳，因此在按下后约 1 至 5 毫秒之间，引脚在两个电平之间反复摆动。固件无法把它们与真正的按压区分开。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var s = signal(k, w, h, 260);
            k.highlight(xOf(0.34, w) - 4, s.yTop - 18, xOf(0.5, w) - xOf(0.34, w) + 8, s.yBot - s.yTop + 36, { color: RED });
            k.label((xOf(0.34, w) + xOf(0.5, w)) / 2, s.yTop - 28, "1-5 ms of bounce", {
              align: "center",
              size: 11,
              mono: true,
              color: RED
            });
          }
        },
        {
          title: "A fast loop() samples every rebound",
          titleZh: "高速的 loop() 会采到每一次弹跳",
          caption: "At roughly 50 microseconds per pass, a program counting LOW readings sees around twenty of them inside the bounce window. That is one press registering as twenty events.",
          captionZh: "若每轮约 50 微秒，统计 LOW 读数的程序会在弹跳窗口内看到约二十次。于是一次按压被记录成二十次事件。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var s = signal(k, w, h, 260);
            var n = 60;
            for (var i = 0; i < n; i++) {
              var u = (i + 0.5) / n;
              var x = xOf(u, w);
              var y = bounceLevel(u) ? s.yTop : s.yBot;
              k.dot(x, y, 2.6, { fill: "#ffffff", stroke: ACCENT, lw: 1.2 });
            }
            k.label(w / 2, h - 14, "each dot is one pass of loop() — every rebound looks like a separate press", {
              align: "center",
              size: 11,
              color: DIM
            });
          }
        },
        {
          title: "The debounce window fixes it",
          titleZh: "去抖窗口解决了这个问题",
          caption: "Ignore any change until the reading has held still for the window. The burst is discarded, the settled LOW is accepted once, and the LED toggles exactly one time.",
          captionZh: "在读数保持稳定达到窗口时长之前，忽略任何变化。抖动被丢弃，稳定后的 LOW 被接受一次，LED 正好翻转一次。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var s = signal(k, w, h, 260);
            var xa = xOf(0.34, w);
            var xb = xOf(0.5, w);
            k.box(xa, s.yTop - 22, xb - xa, s.yBot - s.yTop + 44, {
              fill: "rgba(245,158,11,0.12)",
              stroke: AMBER,
              lw: 1.4,
              r: 6
            });
            k.label((xa + xb) / 2, s.yTop - 32, "window = 5 ms", { align: "center", size: 11, mono: true, color: "#b45309" });
            k.arrow(xb, s.yBot + 6, xb, s.yBot + 24, { color: GREEN, lw: 2 });
            k.label(xb + 10, s.yBot + 24, "accepted: one falling edge", { size: 11, mono: true, color: GREEN });
            k.label(w / 2, h - 12, "5 ms of latency — invisible to the person, fatal to the bounce", {
              align: "center",
              size: 11,
              color: DIM
            });
          }
        }
      ]
    });
  }
})();
