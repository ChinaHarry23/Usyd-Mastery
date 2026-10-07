(function () {
  "use strict";

  /* COMP5047 — Week 4 page behaviour.
   *
   * The declarative widgets (sequence, pipeline, hotspot, race, matcher, deck)
   * are mounted by shared/interactive.js from the JSON config blocks in the
   * page. This file owns the two animated canvas steppers and the re-binding
   * that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initBlockingStepper();
    initPwmStepper();
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
    initBlockingStepper();
    initPwmStepper();
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
        window.console.error("[COMP5047 chapter 4] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Stepper 1: blocking delay() versus millis() ─────────────── */

  function initBlockingStepper() {
    var host = document.getElementById("ix-blocking");
    if (!host || !window.Interactive) return;

    var C = {
      ink: "#141826",
      mute: "#565d75",
      accent: "#0e7490",
      red: "#dc2626",
      green: "#059669",
      amber: "#f59e0b",
      line: "#94a3b8",
      track: "#e6f2f5"
    };

    /* Timeline geometry: 0 … 2200 ms mapped across the canvas. */
    function axis(k, w, h, y) {
      var x0 = 58;
      var x1 = w - 46;
      var tMax = 2200;
      k.arrow(x0 - 14, y, x1 + 16, y, { color: C.line, lw: 1.4 });
      [0, 500, 1000, 1500, 2000].forEach(function (t) {
        var x = x0 + ((x1 - x0) * t) / tMax;
        k.box(x - 0.75, y - 6, 1.5, 12, { fill: C.line, r: 0 });
        k.label(x, y + 22, String(t), { align: "center", size: 10, mono: true, color: C.mute });
      });
      k.label(x1 + 8, y + 22, "ms", { align: "right", size: 10, mono: true, color: C.mute });
      return {
        x: function (t) {
          return x0 + ((x1 - x0) * t) / tMax;
        }
      };
    }

    window.Interactive.stepper("ix-blocking", {
      title: "Blocking and non-blocking timing",
      titleZh: "阻塞式与非阻塞式定时",
      subtitle: "The same two-second phase, watched by a loop that is either frozen or free.",
      subtitleZh: "同样的两秒阶段，分别由一个被冻结的循环和一个自由运行的循环来观察。",
      height: 260,
      frames: [
        {
          title: "delay(2000) — loop() is suspended",
          titleZh: "delay(2000)——loop() 被挂起",
          caption: "Inside delay() the microcontroller does nothing else: no inputs are read and no outputs are updated for the whole two seconds.",
          captionZh: "在 delay() 内部，微控制器什么也不做：整整两秒内既不读取输入，也不更新输出。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var a = axis(k, w, h, 150);
            var x = a.x(2000);
            k.box(58, 110, x - 58, 44, { fill: "#fde8e8", stroke: C.red, lw: 1.8, r: 8 });
            k.label((58 + x) / 2, 137, "delay(2000)  ·  loop() suspended", {
              align: "center",
              size: 12,
              color: C.red
            });
            k.dot(a.x(400), 150, 7, { fill: C.red, stroke: "#7f1d1d", lw: 1.4 });
            k.label(a.x(400), 62, "button pressed at 0.4 s", { align: "center", size: 11, color: C.red });
            k.arrow(a.x(400), 74, a.x(400), 140, { color: C.red, dash: [4, 4], lw: 1.4 });
            k.label(a.x(400), 196, "never read", { align: "center", size: 11, weight: "700", color: C.red });
            k.label(58, 226, "One pass of loop() takes 2000 ms. Anything that happens in between is lost.", {
              size: 11,
              color: C.mute
            });
          }
        },
        {
          title: "millis() — time is checked, not waited out",
          titleZh: "millis()——检视时间，而不是等待时间",
          caption: "The loop now runs thousands of times during the same phase. Each thin mark is one pass: the elapsed time is tested, nothing is blocked.",
          captionZh: "同一个阶段内，循环现在会运行数千次。每一道细线就是一趟：只是检查已流逝的时间，没有任何阻塞。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var a = axis(k, w, h, 170);
            for (var t = 0; t <= 2200; t += 55) {
              var x = a.x(t);
              k.box(x - 0.6, 148, 1.2, 44, { fill: "rgba(14,116,144,0.45)", r: 0 });
            }
            k.label(58, 128, "one pass of loop()", { size: 11, mono: true, color: C.accent });
            k.dot(a.x(400), 170, 7, { fill: C.green, stroke: "#065f46", lw: 1.4 });
            k.label(a.x(400), 62, "press detected at 0.4 s", { align: "center", size: 11, color: C.green });
            k.arrow(a.x(400), 74, a.x(400), 160, { color: C.green, dash: [4, 4], lw: 1.4 });
            k.arrow(a.x(2000), 210, a.x(2000), 120, { color: C.amber, dash: [5, 4], lw: 1.8 });
            k.label(a.x(2000), 108, "phase changes", { align: "center", size: 11, color: C.amber });
            k.label(58, 240, "The phase boundary is a timestamp compared on every pass, so the response time is one pass — microseconds.", {
              size: 11,
              color: C.mute
            });
          }
        },
        {
          title: "Two timelines, side by side",
          titleZh: "两条时间线并置",
          caption: "Blocking code can only ever do one thing at a time. Non-blocking code interleaves several behaviours inside one loop().",
          captionZh: "阻塞式代码一次只能做一件事。非阻塞式代码则在同一个 loop() 中交错执行多种行为。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x0 = 150;
            var x1 = w - 40;
            var lane = function (y, label) {
              k.label(x0 - 12, y + 5, label, { align: "right", size: 11, mono: true, color: C.mute });
              k.box(x0, y - 16, x1 - x0, 32, { fill: "#f6f7fb", stroke: C.line, lw: 1, r: 6 });
            };

            lane(64, "delay()");
            k.box(x0 + 4, 52, x1 - x0 - 8, 24, { fill: "#fde8e8", stroke: C.red, lw: 1.6, r: 5 });
            k.label((x0 + x1) / 2, 69, "frozen for 2000 ms", { align: "center", size: 11, color: C.red });

            lane(132, "millis()");
            var passes = 16;
            for (var i = 0; i < passes; i++) {
              var px = x0 + 4 + ((x1 - x0 - 8) * i) / passes;
              var pw = (x1 - x0 - 8) / passes - 3;
              k.box(px, 120, pw, 24, { fill: C.track, stroke: C.accent, lw: 1.2, r: 4 });
            }
            k.label((x0 + x1) / 2, 176, "button · sensor · serial · phase test, all inside the same loop()", {
              align: "center",
              size: 11,
              color: C.mute
            });

            lane(222, "what runs");
            [0.1, 0.3, 0.5, 0.7, 0.9].forEach(function (f) {
              var x = x0 + 4 + (x1 - x0 - 8) * f;
              k.dot(x, 222, 7, { fill: C.green, stroke: "#065f46", lw: 1.2 });
            });
            k.label(x1, 248, "each dot: an input read on every pass", { align: "right", size: 11, color: C.mute });
          }
        },
        {
          title: "Drift: where the lost milliseconds go",
          titleZh: "漂移：丢失的毫秒去了哪里",
          caption: "delay() adds the work time to every cycle, so the error accumulates. Re-arming millis() from the moment of detection bounds the error to one pass.",
          captionZh: "delay() 会把每次工作的耗时加到每个周期上，误差因此累积。而以检测时刻重新装载 millis()，可把误差限制在一趟循环之内。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x0 = 58;
            var cellW = Math.min(150, (w - 100) / 3.2);
            var lane = function (y, label, colour, fill, note) {
              k.label(x0, y - 26, label, { size: 11, mono: true, color: colour });
              for (var i = 0; i < 3; i++) {
                k.box(x0 + i * (cellW + 10), y - 8, cellW, 34, { fill: fill, stroke: colour, lw: 1.6, r: 6 });
                k.label(x0 + i * (cellW + 10) + cellW / 2, y + 13, note, {
                  align: "center",
                  size: 10,
                  mono: true,
                  color: colour
                });
              }
            };
            lane(78, "delay(2000) + 5 ms of work", C.red, "#fde8e8", "2005 ms");
            lane(182, "millis() re-armed on detection", C.green, "#e7f6ef", "2000 + 1 pass");
            k.label(x0, 232, "after 100 cycles the blocking version is ~0.5 s late; the millis() version is late by at most one pass, and never more.", {
              size: 11,
              color: C.mute
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: PWM duty cycle and average voltage ───────────── */

  function initPwmStepper() {
    var host = document.getElementById("ix-pwm");
    if (!host || !window.Interactive) return;

    var C = {
      accent: "#0e7490",
      mute: "#565d75",
      amber: "#f59e0b",
      green: "#059669",
      line: "#94a3b8"
    };

    var VCC = 5;

    /* Plain line: arrow() with a zero-size head. */
    function seg(k, x1, y1, x2, y2, opts) {
      opts = opts || {};
      k.arrow(x1, y1, x2, y2, {
        color: opts.color || C.accent,
        lw: opts.lw || 2.4,
        dash: opts.dash,
        head: 0.01
      });
    }

    function drawWave(k, w, h, duty, value) {
      var x0 = 62;
      var x1 = w - 46;
      var yHigh = 74;
      var yLow = h - 78;
      var amp = yLow - yHigh;

      k.arrow(x0 - 26, yLow, x0 - 26, yHigh - 16, { color: C.line, lw: 1.2 });
      k.label(x0 - 30, yHigh - 6, "5 V", { align: "right", size: 10, mono: true, color: C.mute });
      k.label(x0 - 30, yLow + 4, "0 V", { align: "right", size: 10, mono: true, color: C.mute });

      var period = (x1 - x0) / 3;
      for (var i = 0; i < 3; i++) {
        var sx = x0 + i * period;
        var ex = sx + period;
        var hx = sx + period * duty;
        seg(k, sx, yLow, sx, yHigh);
        if (duty > 0) seg(k, sx, yHigh, hx, yHigh);
        if (duty > 0 && duty < 1) seg(k, hx, yHigh, hx, yLow);
        if (duty < 1) seg(k, hx, yLow, ex, yLow);
        if (i < 2) seg(k, ex, yLow, ex, yHigh);
      }

      var yAvg = yLow - amp * duty;
      k.arrow(x0, yAvg, x1, yAvg, { color: C.amber, lw: 1.6, dash: [6, 5] });
      k.label(x1, yAvg - 10, "average " + (VCC * duty).toFixed(2) + " V", {
        align: "right",
        size: 11,
        weight: "700",
        color: C.amber
      });

      /* one period marked on the axis */
      var tsx = x0;
      var tex = x0 + period;
      k.arrow(tsx, yLow + 26, tex, yLow + 26, { color: C.line, lw: 1.2 });
      k.arrow(tsx, yLow + 20, tsx, yLow + 32, { color: C.line, lw: 1.2 });
      k.arrow(tex, yLow + 20, tex, yLow + 32, { color: C.line, lw: 1.2 });
      k.label((tsx + tex) / 2, yLow + 22, "T = 1 / f", { align: "center", size: 10, mono: true, color: C.mute });

      /* on-time shading of the first period */
      if (duty > 0) {
        k.highlight(x0, yHigh - 6, period * duty, yLow - yHigh + 12, { color: "#f59e0b", lw: 1.2, dash: [4, 4], r: 4 });
      }

      k.label(x0, h - 30, "duty cycle D = " + Math.round(duty * 100) + " %   ·   analogWrite(pin, " + value + ")", {
        size: 12,
        weight: "700",
        color: C.accent
      });
    }

    window.Interactive.stepper("ix-pwm", {
      title: "PWM: the duty cycle sets the average voltage",
      titleZh: "PWM：占空比决定平均电压",
      subtitle: "Arduinos are digital only. The output pin switches between 0 V and 5 V, and the load sees the average.",
      subtitleZh: "Arduino 只有数字输出。输出引脚在 0 V 与 5 V 之间切换，负载感受到的是平均值。",
      height: 280,
      frames: [
        {
          title: "analogWrite(pin, 0) — 0 % duty",
          titleZh: "analogWrite(pin, 0)——占空比 0 %",
          caption: "The pin stays at 0 V, so the average is 0 V and the lamp is off. Note that this is also what digitalWrite(pin, LOW) does.",
          captionZh: "引脚恒为 0 V，平均值为 0 V，灯是灭的。注意：这与 digitalWrite(pin, LOW) 的效果完全相同。",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawWave(k, w, h, 0, 0);
          }
        },
        {
          title: "analogWrite(pin, 64) — 25 % duty",
          titleZh: "analogWrite(pin, 64)——占空比 25 %",
          caption: "A quarter of each period is spent high, so the average is a quarter of the supply: 1.25 V. The lamp glows dimly.",
          captionZh: "每个周期有四分之一的时间处于高电平，平均值为电源的四分之一：1.25 V。灯发出微弱的光。",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawWave(k, w, h, 64 / 255, 64);
          }
        },
        {
          title: "analogWrite(pin, 128) — 50 % duty",
          titleZh: "analogWrite(pin, 128)——占空比 50 %",
          caption: "The answer to the lecture's question: half the time on, half off, an average of 2.5 V, and the lamp looks half as bright.",
          captionZh: "这就是讲义中那个问题的答案：一半时间导通、一半时间断开，平均 2.5 V，灯看起来亮度减半。",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawWave(k, w, h, 128 / 255, 128);
          }
        },
        {
          title: "analogWrite(pin, 230) — 90 % duty",
          titleZh: "analogWrite(pin, 230)——占空比 90 %",
          caption: "The pin is high almost all the time. Duty cycle is a ratio, so it scales smoothly between fully off and fully on.",
          captionZh: "引脚几乎一直处于高电平。占空比是一个比例，因此可以在全关与全开之间平滑变化。",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawWave(k, w, h, 230 / 255, 230);
          }
        },
        {
          title: "analogWrite(pin, 255) — 100 % duty",
          titleZh: "analogWrite(pin, 255)——占空比 100 %",
          caption: "Always high: 5 V, full brightness, and identical to a digital write. The whole scale is 256 steps, which is why 0–255 is the range.",
          captionZh: "恒为高电平：5 V、全亮，与数字写高完全相同。整个刻度共 256 级，这正是取值范围为 0–255 的原因。",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawWave(k, w, h, 1, 255);
          }
        },
        {
          title: "Adding an RC filter turns the average into a voltage",
          titleZh: "加上 RC 滤波器，平均值就变成稳定的电压",
          caption: "A resistor and a capacitor with a cutoff far below the PWM frequency smooth the square wave into a steady level — the closest a board with no DAC gets to a real analogue output.",
          captionZh: "用一个截止频率远低于 PWM 频率的电阻电容网络，就能把方波平滑成稳定电平——这是没有 DAC 的板子最接近真正模拟输出的做法。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x0 = 62;
            var x1 = w - 46;
            var yHigh = 74;
            var yLow = h - 78;
            var amp = yLow - yHigh;
            var duty = 0.5;
            var yAvg = yLow - amp * duty;

            k.arrow(x0 - 26, yLow, x0 - 26, yHigh - 16, { color: C.line, lw: 1.2 });
            k.label(x0 - 30, yHigh - 6, "5 V", { align: "right", size: 10, mono: true, color: C.mute });
            k.label(x0 - 30, yLow + 4, "0 V", { align: "right", size: 10, mono: true, color: C.mute });

            var period = (x1 - x0) / 3;
            var tau = period / 6;          // RC time constant, much longer than the PWM period
            var level = 0.5;               // filter state, in units of the 5 V supply
            var prevY = yLow - level * amp;
            var dt = 2;                    // px per simulation step
            for (var x = x0; x <= x1; x += dt) {
              var phase = (x - x0) % period;
              var target = phase < period * duty ? 1 : 0;
              level += (target - level) * (dt / tau);
              var y = yLow - level * amp;
              seg(k, x, prevY, x + dt, y, { color: C.green, lw: 2.4 });
              prevY = y;
            }
            k.arrow(x0, yAvg, x1, yAvg, { color: C.amber, lw: 1.4, dash: [6, 5] });
            k.label(x1, yAvg - 26, "steady " + (VCC * duty).toFixed(2) + " V with a small ripple", {
              align: "right",
              size: 11,
              weight: "700",
              color: C.green
            });
            k.label(x0, h - 30, "R and C chosen so that f_c = 1 / (2πRC) ≪ f_PWM", {
              size: 12,
              weight: "700",
              color: C.green
            });
          }
        }
      ]
    });
  }
})();
