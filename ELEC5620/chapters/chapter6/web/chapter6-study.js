(function () {
  "use strict";

  /* ELEC5620 — Week 6 page behaviour.
   *
   * The declarative widgets (pipeline, deck, hotspot, matcher, sequence,
   * timeline, race) are mounted by shared/interactive.js from the JSON config
   * blocks in the page. This file owns the four animated canvas steppers that
   * build a UML diagram element by element, plus the re-binding that a language
   * swap requires.
   */

  var ACCENT = "#4f46e5";
  var ACCENT_SOFT = "#eef2ff";
  var INK = "#312e81";
  var GREEN = "#059669";
  var GREEN_SOFT = "#ecfdf5";
  var AMBER = "#f59e0b";
  var AMBER_SOFT = "#fff7ed";
  var RED = "#dc2626";
  var SLATE = "#475569";
  var LINE = "#cbd5e1";

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initRtcStepper();
    initActivityStepper();
    initSequenceStepper();
    initStateStepper();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every widget and
   * every quick-check inside a translated section is a brand-new node. Re-mount
   * the declarative widgets and rebuild the canvas steppers; the sidebar toggle
   * lives outside any section, so its old listener is dropped first. */
  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    initRtcStepper();
    initActivityStepper();
    initSequenceStepper();
    initStateStepper();
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
        window.console.error("[ELEC5620 chapter 6] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared drawing helpers ─────────────────────────────────── */

  /* Round-cornered rectangle with centred text: a UML action. */
  function action(k, cx, cy, bw, bh, text, opts) {
    opts = opts || {};
    k.box(cx - bw / 2, cy - bh / 2, bw, bh, {
      fill: opts.fill || ACCENT_SOFT,
      stroke: opts.stroke || ACCENT,
      lw: opts.lw || 2,
      r: 14,
    });
    k.label(cx, cy, text, {
      align: "center",
      size: opts.size || 12.5,
      color: opts.color || INK,
    });
  }

  /* Plain rectangle, optionally split by a state compartment: an object node. */
  function objectNode(k, cx, cy, bw, bh, name, state) {
    k.box(cx - bw / 2, cy - bh / 2, bw, bh, {
      fill: GREEN_SOFT,
      stroke: GREEN,
      lw: 2,
      r: 2,
    });
    if (state) {
      k.box(cx - bw / 2, cy - 1, bw, 2, { fill: GREEN });
      k.label(cx, cy - bh / 4 - 1, name, { align: "center", size: 12, color: "#065f46" });
      k.label(cx, cy + bh / 4, state, { align: "center", size: 11, mono: true, color: "#047857" });
    } else {
      k.label(cx, cy, name, { align: "center", size: 12, color: "#065f46" });
    }
  }

  /* Label above an arrow, centred between its endpoints. */
  function arrowLabel(k, x1, x2, y, text, color) {
    k.label((x1 + x2) / 2, y, text, {
      align: "center",
      size: 11,
      mono: true,
      color: color || SLATE,
    });
  }

  function dottedLine(k, x, y0, y1, color) {
    k.arrow(x, y0, x, y1, { color: color || LINE, lw: 1.6, dash: [6, 6], head: 0 });
  }

  function lifeline(k, x, yTop, yBottom, label) {
    k.box(x - 55, yTop, 110, 34, { fill: "#ffffff", stroke: ACCENT, lw: 2, r: 6 });
    k.label(x, yTop + 17, label, { align: "center", size: 12, mono: true, color: INK });
    dottedLine(k, x, yTop + 34, yBottom, LINE);
  }

  function frameTag(k, x, y, label) {
    k.box(x, y, 46, 20, { fill: "#ffffff", stroke: ACCENT, lw: 1.6, r: 3 });
    k.label(x + 23, y + 10, label, { align: "center", size: 11, mono: true, color: ACCENT });
  }

  /* ── Stepper 1: active objects, RTC and priority ─────────────── */

  function initRtcStepper() {
    var host = document.getElementById("ix-rtc");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-rtc", {
      title: "Active objects, message queues and run-to-completion",
      titleZh: "活动对象、消息队列与运行至完成",
      subtitle: "The deck's scheduling story: who decides when an object is ready to receive.",
      subtitleZh: "讲义中的调度逻辑：由谁决定一个对象何时准备好接收消息。",
      height: 280,
      frames: [
        {
          title: "Passive object — invocations arrive whenever they are called",
          titleZh: "被动对象——随时可能被调用",
          caption: "A passive object responds whenever one of its operations is invoked, so two callers can be inside it at the same time. That is where conflicts come from.",
          captionZh: "被动对象在其操作被调用时立即响应，因此两个调用者可能同时位于其中，这正是冲突的来源。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var ox = w - 300;
            if (ox < 260) ox = 240;
            k.box(30, 34, 150, 50, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 2, r: 10 });
            k.label(105, 59, "a1: A", { align: "center", size: 12, mono: true, color: INK });
            k.box(30, 186, 150, 50, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 2, r: 10 });
            k.label(105, 211, "a2: A", { align: "center", size: 12, mono: true, color: INK });

            k.box(ox, 82, 240, 108, { fill: "#ffffff", stroke: SLATE, lw: 2, r: 8 });
            k.label(ox + 120, 108, "obj:C  (passive)", { align: "center", size: 12, mono: true, color: "#334155" });
            k.box(ox + 10, 124, 220, 1.5, { fill: LINE });
            k.label(ox + 120, 146, "setA(a: Integer)", { align: "center", size: 11.5, mono: true, color: SLATE });
            k.label(ox + 120, 170, "getA() : Integer", { align: "center", size: 11.5, mono: true, color: SLATE });

            k.arrow(182, 59, ox, 122, { color: RED, lw: 2 });
            k.label(ox - 60, 74, "setA(1)", { size: 11, mono: true, color: "#b91c1c" });
            k.arrow(182, 211, ox, 158, { color: RED, lw: 2 });
            k.label(ox - 60, 206, "getA()", { size: 11, mono: true, color: "#b91c1c" });

            k.label(w / 2, h - 22, "concurrent invocations inside one object — conflicts possible", {
              align: "center",
              size: 12,
              color: "#b91c1c",
            });
          },
        },
        {
          title: "Active object — a message queue in front of the receive action",
          titleZh: "活动对象——接收动作之前的消息队列",
          caption: "An active object runs concurrently and responds only when it executes a receive action. Which queued event is taken is decided by the chosen scheduling policy.",
          captionZh: "活动对象并发运行，仅在自己执行接收动作时才作出响应。取走队列中哪个事件，由所选调度策略决定。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(60, 74, 260, 140, { fill: GREEN_SOFT, stroke: GREEN, lw: 2, r: 8 });
            k.box(72, 84, 5, 120, { fill: GREEN });
            k.box(84, 84, 5, 120, { fill: GREEN });
            k.label(210, 106, "active: A", { align: "center", size: 13, mono: true, color: "#065f46" });
            k.box(112, 132, 190, 62, { fill: "#ffffff", stroke: GREEN, lw: 1.6, r: 6 });
            k.label(207, 152, "receive", { align: "center", size: 12, mono: true, color: GREEN });
            k.label(207, 174, "one event at a time", { align: "center", size: 11, color: SLATE });

            var qx = w - 240;
            if (qx < 400) qx = 400;
            ["reqC", "reqB", "reqA"].forEach(function (name, i) {
              k.box(qx, 62 + i * 44, 120, 34, { fill: AMBER_SOFT, stroke: AMBER, lw: 1.6, r: 6 });
              k.label(qx + 60, 79 + i * 44, name, { align: "center", size: 12, mono: true, color: "#b45309" });
              k.arrow(qx, 79 + i * 44, 326, 150, { color: AMBER, lw: 1.4, dash: [4, 4] });
            });
            k.label(qx + 60, 40, "message queue", { align: "center", size: 11, mono: true, color: "#b45309" });
            k.label(w / 2, h - 20, "event selection happens at the receive action, not on arrival", {
              align: "center",
              size: 12,
              color: SLATE,
            });
          },
        },
        {
          title: "Run-to-completion — messages arriving mid-step wait",
          titleZh: "运行至完成——步进途中到达的消息需要等待",
          caption: "Any messages arriving between successive receive actions are queued and only considered for handling on the next receive action: a simple one-thing-at-a-time approach.",
          captionZh: "在相邻两次接收动作之间到达的消息会进入队列，只在下一个接收动作时才会被考虑处理：一种简单的“一次只做一件事”的做法。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h * 0.58;
            var x0 = 50;
            var x1 = w - 50;
            k.arrow(x0, y, x1, y, { color: SLATE, lw: 2 });

            var receives = [0.24, 0.5, 0.76];
            receives.forEach(function (f) {
              var x = x0 + (x1 - x0) * f;
              k.dot(x, y, 9, { fill: "#ffffff", stroke: ACCENT, lw: 2.4 });
              k.label(x, y + 28, "receive", { align: "center", size: 11, mono: true, color: ACCENT });
            });

            ["reqA", "reqB", "reqC"].forEach(function (name, i) {
              var x = x0 + (x1 - x0) * [0.1, 0.37, 0.63][i];
              k.box(x - 44, 42, 88, 32, { fill: AMBER_SOFT, stroke: AMBER, lw: 1.6, r: 6 });
              k.label(x, 58, name, { align: "center", size: 12, mono: true, color: "#b45309" });
              k.arrow(x, 74, x, y - 14, { color: AMBER, lw: 1.4, dash: [4, 4] });
              k.label(x + 50, 58, "queued", { size: 10.5, mono: true, color: "#b45309" });
            });

            k.highlight(x0 + (x1 - x0) * 0.24, y - 44, (x1 - x0) * 0.26, 88, { color: ACCENT, dash: [5, 4] });
            k.label(w / 2, h - 20, "handling one event, then the next — the queue absorbs the difference", {
              align: "center",
              size: 12,
              color: SLATE,
            });
          },
        },
        {
          title: "The problem with RTC — priority inversion",
          titleZh: "RTC 的问题——优先级反转",
          caption: "A high-priority message has to wait for a low-priority message that is already being handled. RTC is susceptible to this, but only where both events are handled by the same object.",
          captionZh: "高优先级消息不得不等待正在处理的低优先级消息。RTC 容易发生这种情况，但仅限两类事件由同一对象处理时。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x0 = 60;
            var x1 = w - 60;
            var y1 = h * 0.34;
            var y2 = h * 0.72;

            k.label(x0, 26, "Active1", { size: 12, mono: true, color: GREEN });
            k.arrow(x0, y1, x1, y1, { color: SLATE, lw: 2 });
            k.box(x0 + 26, y1 - 16, (x1 - x0) * 0.52, 32, { fill: GREEN_SOFT, stroke: GREEN, lw: 1.8, r: 6 });
            k.label(x0 + 26 + (x1 - x0) * 0.26, y1, "handling lo", { align: "center", size: 12, mono: true, color: "#065f46" });

            k.label(x0, 152, "Active2", { size: 12, mono: true, color: ACCENT });
            k.arrow(x0, y2, x1, y2, { color: SLATE, lw: 2 });
            k.box(x0 + (x1 - x0) * 0.3, y2 - 64, 96, 32, { fill: AMBER_SOFT, stroke: AMBER, lw: 1.8, r: 6 });
            k.label(x0 + (x1 - x0) * 0.3 + 48, y2 - 48, "hi", { align: "center", size: 12, mono: true, color: "#b45309" });
            k.arrow(x0 + (x1 - x0) * 0.62, y2 - 48, x0 + (x1 - x0) * 0.62, y1 + 20, {
              color: AMBER,
              lw: 1.8,
              dash: [5, 4],
            });
            k.label(x0 + (x1 - x0) * 0.62 + 8, y1 + 34, "hi (queued)", { size: 11, mono: true, color: "#b45309" });
            k.label((x0 + x1) / 2, h - 18, "the high-priority event waits for a low-priority one — but only inside this object", {
              align: "center",
              size: 12,
              color: "#b91c1c",
            });
          },
        },
        {
          title: "RTC semantics — priority across active objects",
          titleZh: "RTC 语义——跨活动对象的优先级",
          caption: "If a high-priority event arrives for an object that is ready to receive it, the processing of low-priority events by other active objects can be interrupted.",
          captionZh: "若高优先级事件到达一个已准备好接收它的对象，其他活动对象对低优先级事件的处理可以被中断。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x0 = 60;
            var x1 = w - 60;
            var y1 = h * 0.34;
            var y2 = h * 0.72;
            var mid = x0 + (x1 - x0) * 0.44;

            k.label(x0, 26, "Active1", { size: 12, mono: true, color: GREEN });
            k.arrow(x0, y1, x1, y1, { color: SLATE, lw: 2 });
            k.box(x0 + 20, y1 - 16, mid - x0 - 20, 32, { fill: GREEN_SOFT, stroke: GREEN, lw: 1.8, r: 6 });
            k.label(x0 + 20 + (mid - x0 - 20) / 2, y1, "handling lo", {
              align: "center",
              size: 12,
              mono: true,
              color: "#065f46",
            });
            k.label(mid + 16, y1, "suspended", { size: 11.5, mono: true, color: "#b45309" });
            k.highlight(mid, y1 - 30, x1 - mid, 60, { color: AMBER, dash: [5, 4] });

            k.label(x0, 152, "Active2", { size: 12, mono: true, color: ACCENT });
            k.arrow(x0, y2, x1, y2, { color: SLATE, lw: 2 });
            k.box(mid - 120, y2 - 16, 120, 32, { fill: AMBER_SOFT, stroke: AMBER, lw: 1.8, r: 6 });
            k.label(mid - 60, y2, "hi", { align: "center", size: 12, mono: true, color: "#b45309" });
            k.arrow(mid - 100, y2 - 18, mid - 100, y1 + 22, { color: AMBER, lw: 1.8 });
            k.label((x0 + x1) / 2, h - 18, "the queued high-priority event can commence at this point", {
              align: "center",
              size: 12,
              color: SLATE,
            });
          },
        },
      ],
    });
  }

  /* ── Stepper 2: build an activity graph element by element ───── */

  function initActivityStepper() {
    var host = document.getElementById("ix-activity");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-activity", {
      title: "Building the order-processing activity, one element at a time",
      titleZh: "逐步构建订单处理活动图",
      subtitle: "The deck's activity graph, assembled in the order a modeller would draw it.",
      subtitleZh: "按建模者的实际绘制顺序，组装讲义中的活动图。",
      height: 290,
      frames: [
        {
          title: "Start with the initial node and the first action",
          titleZh: "从初始节点与第一个动作开始",
          caption: "A token is placed on the initial node when the activity starts; the first action is a round-cornered rectangle.",
          captionZh: "活动开始时，令牌被放置在初始节点上；第一个动作画成圆角矩形。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h * 0.3;
            k.dot(w * 0.04, y, 11, { fill: "#1f2937" });
            k.arrow(w * 0.07, y, w * 0.09, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.17, y, Math.max(110, w * 0.16), 52, "Receive order");
            k.label(w * 0.04, y + 30, "initial", { align: "center", size: 10.5, mono: true, color: SLATE });
          },
        },
        {
          title: "Connect the next action with a control flow",
          titleZh: "用控制流连接下一个动作",
          caption: "Activity nodes are connected by activity edges: when one action finishes, the next is enabled. This is control flow.",
          captionZh: "活动节点由活动边连接：一个动作完成后，下一个动作被使能。这就是控制流。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h * 0.3;
            k.dot(w * 0.04, y, 11, { fill: "#1f2937" });
            k.arrow(w * 0.07, y, w * 0.09, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.17, y, Math.max(110, w * 0.16), 52, "Receive order");
            k.arrow(w * 0.25, y, w * 0.28, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.36, y, Math.max(110, w * 0.16), 52, "Fill order");
            k.label(w * 0.265, y - 20, "control flow", { align: "center", size: 10.5, mono: true, color: SLATE });
          },
        },
        {
          title: "Carry the object, not just the control",
          titleZh: "传递对象，而不只是控制",
          caption: "An object node carries a value between actions and may name the state it is in. The deck's graph labels this one [filled] between filling and shipping.",
          captionZh: "对象节点在动作之间传递值，并可标注其所处状态。讲义中的活动图在“填写”与“发货”之间把它标为 [filled]。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h * 0.3;
            k.dot(w * 0.04, y, 11, { fill: "#1f2937" });
            k.arrow(w * 0.07, y, w * 0.09, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.17, y, Math.max(110, w * 0.16), 52, "Receive order");
            k.arrow(w * 0.25, y, w * 0.28, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.36, y, Math.max(110, w * 0.16), 52, "Fill order");
            k.arrow(w * 0.44, y, w * 0.57, y, { color: ACCENT, lw: 2 });
            objectNode(k, w * 0.65, y, Math.max(100, w * 0.15), 64, "Order", "[filled]");
            k.label(w * 0.505, y - 22, "object flow", { align: "center", size: 10.5, mono: true, color: GREEN });
          },
        },
        {
          title: "Name the alternatives with a choice",
          titleZh: "用选择节点命名分支",
          caption: "A choice diamond splits the flow on guards. [in stock] continues to shipping; [else] sends the order down the backorder path.",
          captionZh: "菱形选择节点按守卫条件分流。[in stock] 继续走向发货；[else] 让订单进入缺货补货路径。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h * 0.28;
            k.dot(w * 0.04, y, 11, { fill: "#1f2937" });
            k.arrow(w * 0.07, y, w * 0.09, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.17, y, Math.max(106, w * 0.15), 50, "Receive order");
            k.arrow(w * 0.245, y, w * 0.275, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.36, y, Math.max(106, w * 0.15), 50, "Fill order");
            k.arrow(w * 0.435, y, w * 0.465, y, { color: ACCENT, lw: 2 });

            var cx = w * 0.5;
            var hw = Math.max(30, w * 0.035);
            var hh = 30;
            k.box(cx - hw, y - hh, hw * 2, hh * 2, { fill: AMBER_SOFT, stroke: AMBER, lw: 2, r: 4 });
            k.label(cx, y - 62, "[in stock]", { align: "center", size: 10.5, mono: true, color: "#b45309" });
            k.label(cx + 6, y + 52, "[else]", { size: 10.5, mono: true, color: "#b45309" });
            k.arrow(cx, y + hh, cx, y + 82, { color: ACCENT, lw: 2 });
          },
        },
        {
          title: "End one path with a flow final",
          titleZh: "用流终止节点结束一条路径",
          caption: "A flow final ends this path only; the rest of the activity carries on. Use it for branches that simply finish.",
          captionZh: "流终止节点只结束这一条路径，活动的其余部分继续执行。用于那些单纯结束的分支。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h * 0.28;
            k.dot(w * 0.04, y, 11, { fill: "#1f2937" });
            k.arrow(w * 0.07, y, w * 0.09, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.17, y, Math.max(106, w * 0.15), 50, "Receive order");
            k.arrow(w * 0.245, y, w * 0.275, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.36, y, Math.max(106, w * 0.15), 50, "Fill order");
            k.arrow(w * 0.435, y, w * 0.465, y, { color: ACCENT, lw: 2 });
            var cx = w * 0.5;
            k.box(cx - 30, y - 30, 60, 60, { fill: AMBER_SOFT, stroke: AMBER, lw: 2, r: 4 });
            k.label(cx, y - 62, "[in stock]", { align: "center", size: 10.5, mono: true, color: "#b45309" });
            k.label(cx + 6, y + 52, "[else]", { size: 10.5, mono: true, color: "#b45309" });
            k.arrow(cx, y + 30, cx, y + 62, { color: ACCENT, lw: 2 });
            action(k, cx, y + 96, Math.max(110, w * 0.16), 50, "Backorder");
            k.arrow(cx, y + 122, cx, y + 150, { color: ACCENT, lw: 2 });
            k.dot(cx, y + 166, 14, { fill: "#ffffff", stroke: ACCENT, lw: 2.4 });
            k.arrow(cx - 8, y + 158, cx + 8, y + 174, { color: ACCENT, lw: 2.4, head: 0 });
            k.arrow(cx + 8, y + 158, cx - 8, y + 174, { color: ACCENT, lw: 2.4, head: 0 });
            k.label(cx + 24, y + 166, "flow final", { size: 10.5, mono: true, color: ACCENT });
          },
        },
        {
          title: "Close the activity with an activity final",
          titleZh: "用活动终止节点结束整个活动",
          caption: "The bullseye stops the whole activity and consumes every remaining token. The object node now carries the finished order into Ship order.",
          captionZh: "牛眼符号终止整个活动并消耗所有剩余令牌。此时对象节点把已完成的订单送入“发货”。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h * 0.3;
            k.dot(w * 0.035, y, 10, { fill: "#1f2937" });
            k.arrow(w * 0.06, y, w * 0.075, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.145, y, Math.max(96, w * 0.13), 48, "Receive order", { size: 11.5 });
            k.arrow(w * 0.21, y, w * 0.235, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.305, y, Math.max(96, w * 0.13), 48, "Fill order", { size: 11.5 });
            k.arrow(w * 0.37, y, w * 0.4, y, { color: ACCENT, lw: 2 });
            objectNode(k, w * 0.465, y, Math.max(88, w * 0.12), 58, "Order", "[filled]");
            k.arrow(w * 0.53, y, w * 0.575, y, { color: ACCENT, lw: 2 });
            action(k, w * 0.665, y, Math.max(96, w * 0.13), 48, "Ship order", { size: 11.5 });
            k.arrow(w * 0.735, y, w * 0.795, y, { color: ACCENT, lw: 2 });
            k.dot(w * 0.84, y, 14, { fill: "none", stroke: "#1f2937", lw: 2.6 });
            k.dot(w * 0.84, y, 7, { fill: "#1f2937" });
            k.label(w * 0.84, y + 30, "activity final", { align: "center", size: 10.5, mono: true, color: SLATE });
            k.label(w * 0.665, y + 44, "«postcondition» order complete", {
              align: "center",
              size: 10.5,
              mono: true,
              color: SLATE,
            });
          },
        },
      ],
    });
  }

  /* ── Stepper 3: build a sequence diagram message by message ──── */

  function initSequenceStepper() {
    var host = document.getElementById("ix-seq");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-seq", {
      title: "The ATM transaction, built message by message",
      titleZh: "逐条消息构建 ATM 交易顺序图",
      subtitle: "Lifelines first, then messages, then the fragments that carry the alternatives.",
      subtitleZh: "先画生命线，再画消息，最后加上承载分支的组合片段。",
      height: 300,
      frames: [
        {
          title: "Lifelines inside the interaction frame",
          titleZh: "交互框内的生命线",
          caption: "The interaction frame is named sd ATM-transaction and declares its lifelines: client, atm and dbase. Each lifeline is one object or one part.",
          captionZh: "交互框命名为 sd ATM-transaction，并声明其生命线：client、atm 与 dbase。每条生命线是一个对象或一个部件。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(14, 12, w - 28, h - 24, { stroke: LINE, lw: 1.6, r: 8 });
            frameTag(k, 16, 14, "sd");
            k.label(72, 24, "ATM-transaction", { size: 11.5, mono: true, color: ACCENT });
            lifeline(k, w * 0.17, 46, h - 22, "client:");
            lifeline(k, w * 0.5, 46, h - 22, "atm:");
            lifeline(k, w * 0.83, 46, h - 22, "dbase:");
          },
        },
        {
          title: "The first message: insertCard",
          titleZh: "第一条消息：insertCard",
          caption: "A message is a communication action. Its position on the lifeline encodes time: the higher the arrow, the earlier the message.",
          captionZh: "消息是一种通信动作。它在生命线上的位置编码了时间：箭头越靠上，消息越早发生。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(14, 12, w - 28, h - 24, { stroke: LINE, lw: 1.6, r: 8 });
            frameTag(k, 16, 14, "sd");
            k.label(72, 24, "ATM-transaction", { size: 11.5, mono: true, color: ACCENT });
            lifeline(k, w * 0.17, 46, h - 22, "client:");
            lifeline(k, w * 0.5, 46, h - 22, "atm:");
            lifeline(k, w * 0.83, 46, h - 22, "dbase:");
            var y = h * 0.42;
            k.arrow(w * 0.17, y, w * 0.5, y, { color: ACCENT, lw: 2 });
            arrowLabel(k, w * 0.17, w * 0.5, y - 14, "insertCard", ACCENT);
            k.label(w * 0.5 + 10, y + 18, "message", { size: 10.5, mono: true, color: SLATE });
          },
        },
        {
          title: "Reuse instead of redraw: ref CheckPin",
          titleZh: "复用而非重画：ref CheckPin",
          caption: "An interaction occurrence (ref) reuses another interaction at this point. The detail of sd CheckPin lives in its own frame.",
          captionZh: "交互使用（ref）在此处复用另一个交互。sd CheckPin 的细节放在它自己的框里。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(14, 12, w - 28, h - 24, { stroke: LINE, lw: 1.6, r: 8 });
            frameTag(k, 16, 14, "sd");
            k.label(72, 24, "ATM-transaction", { size: 11.5, mono: true, color: ACCENT });
            lifeline(k, w * 0.17, 46, h - 22, "client:");
            lifeline(k, w * 0.5, 46, h - 22, "atm:");
            lifeline(k, w * 0.83, 46, h - 22, "dbase:");
            var y = h * 0.34;
            k.arrow(w * 0.17, y, w * 0.5, y, { color: ACCENT, lw: 2 });
            arrowLabel(k, w * 0.17, w * 0.5, y - 14, "insertCard", ACCENT);
            k.box(w * 0.1, y + 26, w * 0.8, 54, { fill: "#ffffff", stroke: ACCENT, lw: 2, r: 6 });
            frameTag(k, w * 0.1, y + 26, "ref");
            k.label(w * 0.5, y + 63, "CheckPin", { align: "center", size: 13, mono: true, color: INK });
          },
        },
        {
          title: "Inside sd CheckPin, and the replies that come back",
          titleZh: "sd CheckPin 内部，以及返回的应答",
          caption: "Replies are drawn dashed: result(chk) travels back up the same lifeline pair that carried the call. The caller cannot continue until it arrives.",
          captionZh: "应答用虚线表示：result(chk) 沿着承载调用的同一对生命线返回。调用方在它到达之前无法继续。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(14, 12, w - 28, h - 24, { stroke: LINE, lw: 1.6, r: 8 });
            frameTag(k, 16, 14, "sd");
            k.label(72, 24, "CheckPin", { size: 11.5, mono: true, color: ACCENT });
            lifeline(k, w * 0.17, 46, h - 22, "client:");
            lifeline(k, w * 0.5, 46, h - 22, "atm:");
            lifeline(k, w * 0.83, 46, h - 22, "dbase:");

            var rows = [
              [0.5, 0.17, "askForPIN", ACCENT, false],
              [0.17, 0.5, "data(PIN)", ACCENT, false],
              [0.5, 0.83, "check(PIN)", ACCENT, false],
              [0.83, 0.5, "result(chk)", SLATE, true],
              [0.5, 0.17, "result(chk)", SLATE, true],
            ];
            rows.forEach(function (row, i) {
              var y = h * 0.3 + i * 40;
              k.arrow(w * row[0], y, w * row[1], y, {
                color: row[3],
                lw: 2,
                dash: row[4] ? [6, 5] : null,
              });
              arrowLabel(k, w * row[0], w * row[1], y - 13, row[2], row[3]);
            });
          },
        },
        {
          title: "The alternative: alt [chk = OK] / [else]",
          titleZh: "分支：alt [chk = OK] / [else]",
          caption: "A combined in-line fragment carries the control structure. [chk = OK] references sd DoTransaction; the [else] branch reports error(\"badPIN\").",
          captionZh: "组合内联片段承载控制结构。[chk = OK] 分支引用 sd DoTransaction；[else] 分支报告 error(\"badPIN\")。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(14, 12, w - 28, h - 24, { stroke: LINE, lw: 1.6, r: 8 });
            frameTag(k, 16, 14, "sd");
            k.label(72, 24, "ATM-transaction", { size: 11.5, mono: true, color: ACCENT });
            lifeline(k, w * 0.17, 46, h - 22, "client:");
            lifeline(k, w * 0.5, 46, h - 22, "atm:");
            lifeline(k, w * 0.83, 46, h - 22, "dbase:");

            var top = h * 0.2;
            var bottom = h - 30;
            var left = w * 0.1;
            var width = w * 0.8;
            k.box(left, top, width, bottom - top, { stroke: ACCENT, lw: 2, r: 6 });
            frameTag(k, left, top, "alt");
            k.label(left + 56, top + 12, "[chk = OK]", { size: 11, mono: true, color: ACCENT });

            k.box(left, top + 34, width, 50, { fill: "#ffffff", stroke: ACCENT, lw: 1.6, r: 4 });
            frameTag(k, left, top + 34, "ref");
            k.label(left + width / 2, top + 68, "DoTransaction", { align: "center", size: 12.5, mono: true, color: INK });

            var divY = top + 106;
            k.box(left, divY, width, 1.6, { fill: ACCENT });
            k.label(left + 56, divY + 14, "[else]", { size: 11, mono: true, color: ACCENT });
            var my = divY + 56;
            k.arrow(w * 0.5, my, w * 0.17, my, { color: RED, lw: 2 });
            arrowLabel(k, w * 0.17, w * 0.5, my - 13, "error(\"badPIN\")", RED);
          },
        },
      ],
    });
  }

  /* ── Stepper 4: build a state machine element by element ─────── */

  function initStateStepper() {
    var host = document.getElementById("ix-state");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-state", {
      title: "Building the lamp state machine",
      titleZh: "构建台灯状态机",
      subtitle: "Initial pseudostate, state, transition, compartments, trigger with effect, then a self-transition.",
      subtitleZh: "依次添加初始伪状态、状态、迁移、分区，带效果的触发器，最后是自迁移。",
      height: 280,
      frames: [
        {
          title: "The initial pseudostate",
          titleZh: "初始伪状态",
          caption: "A state machine starts at exactly one place: the filled circle is a pseudostate, not a state you can be in for any length of time.",
          captionZh: "状态机只有一个起点：实心圆是一个伪状态，而不是可以停留的状态。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.dot(w * 0.12, h * 0.5, 12, { fill: "#1f2937" });
            k.label(w * 0.12, h * 0.5 + 34, "initial pseudostate", { align: "center", size: 11, mono: true, color: SLATE });
          },
        },
        {
          title: "Add the first state",
          titleZh: "添加第一个状态",
          caption: "A state is a rounded rectangle with the state name. During its lifetime the object satisfies whatever the state asserts.",
          captionZh: "状态画成带状态名的圆角矩形。在该状态存续期间，对象满足这个状态所断言的内容。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.dot(w * 0.12, h * 0.5, 12, { fill: "#1f2937" });
            k.box(w * 0.26, h * 0.32, w * 0.28, h * 0.36, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 2, r: 14 });
            k.label(w * 0.4, h * 0.5, "LampOn", { align: "center", size: 14, color: INK });
          },
        },
        {
          title: "The transition out of the initial pseudostate",
          titleZh: "从初始伪状态出发的迁移",
          caption: "This transition carries no trigger: it is taken as soon as the machine starts. A written trigger would be wrong here.",
          captionZh: "这条迁移没有触发器：状态机一开始就会走这条迁移。此处若写触发器反而是错的。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.dot(w * 0.12, h * 0.5, 12, { fill: "#1f2937" });
            k.arrow(w * 0.14, h * 0.5, w * 0.24, h * 0.5, { color: ACCENT, lw: 2 });
            k.box(w * 0.26, h * 0.32, w * 0.28, h * 0.36, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 2, r: 14 });
            k.label(w * 0.4, h * 0.5, "LampOn", { align: "center", size: 14, color: INK });
            k.label(w * 0.19, h * 0.5 - 18, "no trigger", { align: "center", size: 10.5, mono: true, color: SLATE });
          },
        },
        {
          title: "Entry and exit actions are a dynamic assertion mechanism",
          titleZh: "进入与退出动作是一种动态断言机制",
          caption: "entry/ lamp.on() guarantees the world matches the state on the way in; exit/ lamp.off() restores it on the way out, whatever transition caused the exit.",
          captionZh: "entry/ lamp.on() 在进入时保证外部世界与状态一致；exit/ lamp.off() 在离开时恢复它，无论是由哪条迁移引起。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.dot(w * 0.12, h * 0.5, 12, { fill: "#1f2937" });
            k.arrow(w * 0.14, h * 0.5, w * 0.24, h * 0.5, { color: ACCENT, lw: 2 });
            k.box(w * 0.26, h * 0.26, w * 0.3, h * 0.48, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 2, r: 14 });
            k.box(w * 0.26, h * 0.42, w * 0.3, 1.6, { fill: ACCENT });
            k.label(w * 0.41, h * 0.34, "LampOn", { align: "center", size: 13.5, color: INK });
            k.label(w * 0.29, h * 0.5, "entry/ lamp.on();", { size: 11, mono: true, color: SLATE });
            k.label(w * 0.29, h * 0.62, "exit/ lamp.off();", { size: 11, mono: true, color: SLATE });
          },
        },
        {
          title: "A trigger with an effect between two states",
          titleZh: "两个状态之间带效果的触发器",
          caption: "The whole transition reads off / printf(\"to off\"). Exit actions prefix the transition action, entry actions postfix it: exiting, to off, lamp.off().",
          captionZh: "整条迁移读作 off / printf(\"to off\")。退出动作前缀于迁移动作，进入动作后缀于它：exiting、to off、lamp.off()。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.dot(w * 0.06, h * 0.5, 11, { fill: "#1f2937" });
            k.arrow(w * 0.08, h * 0.5, w * 0.135, h * 0.5, { color: ACCENT, lw: 2 });
            k.box(w * 0.15, h * 0.28, w * 0.26, h * 0.44, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 2, r: 14 });
            k.box(w * 0.15, h * 0.43, w * 0.26, 1.6, { fill: ACCENT });
            k.label(w * 0.28, h * 0.35, "LampOn", { align: "center", size: 13, color: INK });
            k.label(w * 0.17, h * 0.52, "entry/ lamp.on();", { size: 10.5, mono: true, color: SLATE });
            k.label(w * 0.17, h * 0.63, "exit/ printf(\"exiting\");", { size: 10.5, mono: true, color: SLATE });

            k.box(w * 0.6, h * 0.28, w * 0.26, h * 0.44, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 2, r: 14 });
            k.box(w * 0.6, h * 0.43, w * 0.26, 1.6, { fill: ACCENT });
            k.label(w * 0.73, h * 0.35, "LampOff", { align: "center", size: 13, color: INK });
            k.label(w * 0.62, h * 0.52, "entry/ lamp.off();", { size: 10.5, mono: true, color: SLATE });
            k.label(w * 0.62, h * 0.63, "exit/ printf(\"exiting\");", { size: 10.5, mono: true, color: SLATE });

            k.arrow(w * 0.41, h * 0.5, w * 0.6, h * 0.5, { color: ACCENT, lw: 2 });
            arrowLabel(k, w * 0.41, w * 0.6, h * 0.5 - 16, "off / printf(\"to off\")", ACCENT);
          },
        },
        {
          title: "A self-transition still exits and re-enters",
          titleZh: "自迁移仍会退出并重新进入",
          caption: "off / printf(\"needless\") on LampOff runs printf(\"exiting\"), then printf(\"needless\"), then lamp.off(). The state never changed, but it was left and entered again.",
          captionZh: "LampOff 上的 off / printf(\"needless\") 依次执行 printf(\"exiting\")、printf(\"needless\")、lamp.off()。状态并未改变，但它确实被退出并重新进入。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.dot(w * 0.06, h * 0.5, 11, { fill: "#1f2937" });
            k.arrow(w * 0.08, h * 0.5, w * 0.135, h * 0.5, { color: ACCENT, lw: 2 });
            k.box(w * 0.15, h * 0.3, w * 0.26, h * 0.42, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 2, r: 14 });
            k.box(w * 0.15, h * 0.45, w * 0.26, 1.6, { fill: ACCENT });
            k.label(w * 0.28, h * 0.37, "LampOn", { align: "center", size: 13, color: INK });
            k.label(w * 0.17, h * 0.54, "entry/ lamp.on();", { size: 10.5, mono: true, color: SLATE });
            k.label(w * 0.17, h * 0.65, "exit/ printf(\"exiting\");", { size: 10.5, mono: true, color: SLATE });

            k.box(w * 0.6, h * 0.3, w * 0.26, h * 0.42, { fill: ACCENT_SOFT, stroke: ACCENT, lw: 2, r: 14 });
            k.box(w * 0.6, h * 0.45, w * 0.26, 1.6, { fill: ACCENT });
            k.label(w * 0.73, h * 0.37, "LampOff", { align: "center", size: 13, color: INK });
            k.label(w * 0.62, h * 0.54, "entry/ lamp.off();", { size: 10.5, mono: true, color: SLATE });
            k.label(w * 0.62, h * 0.65, "exit/ printf(\"exiting\");", { size: 10.5, mono: true, color: SLATE });
            k.arrow(w * 0.41, h * 0.5, w * 0.6, h * 0.5, { color: ACCENT, lw: 2 });

            k.arrow(w * 0.84, h * 0.3, w * 0.84, h * 0.12, { color: RED, lw: 2 });
            k.arrow(w * 0.84, h * 0.12, w * 0.62, h * 0.12, { color: RED, lw: 2 });
            k.arrow(w * 0.62, h * 0.12, w * 0.62, h * 0.28, { color: RED, lw: 2 });
            k.label(w * 0.73, h * 0.12 - 14, "off / printf(\"needless\")", { align: "center", size: 10.5, mono: true, color: RED });
          },
        },
      ],
    });
  }
})();
