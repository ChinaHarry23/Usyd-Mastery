(function () {
  "use strict";

  /* INFO5995 — Week 1 page behaviour.
   *
   * The declarative widgets (sequence, matcher, timeline, hotspot, deck, race,
   * pipeline) are mounted by shared/interactive.js from the JSON config blocks
   * in the page. This file owns the chapter chrome binding and the two animated
   * canvas steppers: the castle-to-network argument, and the wooden barrel.
   *
   * Both steppers carry `titleZh` / `captionZh` variants, which the shared
   * stepper picks up on the `langchange` event; canvas labels are localised by
   * the small L() helper below.
   */

  var ZH = false;

  function L(en, zh) {
    return ZH ? zh : en;
  }

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    ZH = currentLang() === "zh";
    initCastleStepper();
    initBarrelStepper();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every widget and
   * every quick-check inside a translated section is a brand-new node. Re-mount
   * the widgets and re-run the chrome bindings; the sidebar toggle lives outside
   * any section, so its old listener is dropped first to avoid double-binding. */
  window.addEventListener("langchange", function () {
    ZH = currentLang() === "zh";
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    initCastleStepper();
    initBarrelStepper();
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
        window.console.error("[INFO5995 chapter 1] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── shared drawing helper: the castle shell ─────────────────── */

  function castleShell(k, w, h) {
    var cx = w / 2;
    var base = h - 40;
    var half = Math.min(214, w / 2 - 26);
    k.box(20, base, w - 40, 6, { fill: "#e2e8f0", r: 3 });
    k.box(cx - half, base - 172, half * 2, 172, { fill: "#f8fafc", stroke: "#94a3b8", lw: 2, r: 10 });
    var n = Math.max(5, Math.round(half / 26));
    var step = (half * 2 - 12) / n;
    for (var i = 0; i < n; i++) {
      k.box(cx - half + 6 + i * step, base - 186, Math.max(10, step - 10), 16, {
        fill: "#f1f5f9",
        stroke: "#94a3b8",
        lw: 1.4,
        r: 3,
      });
    }
    k.box(cx - 88, base - 164, 176, 60, { fill: "#ecfdf5", stroke: "#059669", lw: 2, r: 8 });
    k.label(cx, base - 144, "VALUABLE", { align: "center", size: 12, mono: true, color: "#047857" });
    k.label(cx, base - 124, L("money · data · secrets · reputation", "金钱 · 数据 · 机密 · 声誉"), {
      align: "center",
      size: 10.5,
      color: "#565d75",
    });
    return { cx: cx, base: base, half: half };
  }

  /* ── Stepper 1: from the castle to the network ──────────────── */

  function initCastleStepper() {
    var host = document.getElementById("ix-castle");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-castle", {
      title: "From castles to firewalls",
      titleZh: "从城堡到防火墙",
      subtitle: "The Week 1 argument, one frame at a time: a closed castle, the door you had to add, and the network that replaced the wall.",
      subtitleZh: "第 1 周的核心论证：封闭的城堡、不得不开的那扇门，以及取代城墙的网络。",
      height: 290,
      frames: [
        {
          title: "A closed castle — secure and useless",
          titleZh: "封闭的城堡——安全却无用",
          caption:
            "Something valuable is inside: money, data, secrets, reputation. Keep trusted people in, keep attackers out, build higher walls. But nothing enters, nothing leaves, and no business happens.",
          captionZh:
            "里面是贵重之物：金钱、数据、机密、声誉。把可信的人留在里面，把攻击者挡在外面，把墙筑得更高。但这样一来，什么都进不来、出不去，业务也无法发生。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = castleShell(k, w, h);
            k.box(g.cx - 30, g.base - 62, 60, 62, { fill: "#e2e8f0", stroke: "#64748b", lw: 2, r: 4 });
            k.label(g.cx, g.base - 31, L("sealed", "封死"), { align: "center", size: 10, mono: true, color: "#475569" });
            k.dot(56, g.base - 24, 9, { fill: "#ffffff", stroke: "#059669", lw: 2 });
            k.label(56, g.base - 46, L("trusted", "可信者"), { align: "center", size: 10, color: "#047857" });
            k.dot(w - 56, g.base - 24, 9, { fill: "#ffffff", stroke: "#dc2626", lw: 2 });
            k.label(w - 56, g.base - 46, L("attacker", "攻击者"), { align: "center", size: 10, color: "#b91c1c" });
            k.label(g.cx, 24, L("Secure — and useless", "安全——但毫无用处"), {
              align: "center",
              size: 15,
              weight: "700",
              color: "#0f172a",
            });
            k.label(g.cx, 48, L("no people in, no information out, no business", "人进不来、信息出不去、业务无法开展"), {
              align: "center",
              size: 11,
              color: "#565d75",
            });
          },
        },
        {
          title: "We need a door",
          titleZh: "我们需要一扇门",
          caption:
            "People need to enter, information needs to leave, business needs to happen. The moment we add access, we also create risk — the door is a control point and an attack surface at once.",
          captionZh:
            "人需要进来，信息需要出去，业务必须发生。可一旦开放访问，我们同时也就制造了风险——那扇门既是控制点，也是攻击面。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = castleShell(k, w, h);
            k.box(g.cx - 32, g.base - 62, 64, 62, { fill: "#fef3c7", stroke: "#f59e0b", lw: 2, r: 4 });
            k.label(g.cx, g.base - 31, L("DOOR", "门"), { align: "center", size: 11, mono: true, color: "#b45309" });
            k.box(g.cx - 64, g.base - 96, 128, 24, { fill: "#fee2e2", stroke: "#dc2626", lw: 1.5, r: 12 });
            k.label(g.cx, g.base - 84, L("access = risk", "访问 = 风险"), {
              align: "center",
              size: 10,
              mono: true,
              color: "#b91c1c",
            });
            k.arrow(62, g.base - 88, g.cx - 38, g.base - 36, { color: "#059669", lw: 2 });
            k.label(66, g.base - 106, L("people enter", "人员进入"), { size: 11, color: "#047857" });
            k.arrow(g.cx + 38, g.base - 36, w - 62, g.base - 88, { color: "#2563eb", lw: 2 });
            k.label(w - 66, g.base - 106, L("information leaves", "信息流出"), { align: "right", size: 11, color: "#1d4ed8" });
            k.label(g.cx, 24, L("The moment we add access, we create risk", "一旦开放访问，就产生了风险"), {
              align: "center",
              size: 14,
              weight: "700",
              color: "#0f172a",
            });
          },
        },
        {
          title: "Two questions the walls cannot answer",
          titleZh: "城墙回答不了的两个问题",
          caption:
            "Adding layers of defence helps, but the perimeter model has two blind spots: someone who is already inside, and someone we trusted who should not have been.",
          captionZh:
            "增加防御层次确有帮助，但边界模型有两个盲区：已经身处内部的人，以及我们信错的人。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = castleShell(k, w, h);
            k.box(g.cx - 32, g.base - 62, 64, 62, { fill: "#fef3c7", stroke: "#f59e0b", lw: 2, r: 4 });
            k.dot(g.cx, g.base - 30, 9, { fill: "#ffffff", stroke: "#f59e0b", lw: 2 });
            k.highlight(g.cx - 36, g.base - 62, 72, 62, { color: "#f59e0b" });
            k.label(g.cx + 46, g.base - 30, "2", { size: 12, weight: "700", color: "#b45309" });
            k.dot(g.cx - 46, g.base - 134, 9, { fill: "#ffffff", stroke: "#dc2626", lw: 2 });
            k.highlight(g.cx - 62, g.base - 150, 32, 32, { color: "#dc2626" });
            k.label(g.cx - 24, g.base - 140, "1", { size: 12, weight: "700", color: "#b91c1c" });
            k.label(g.cx, 20, L("Layers help — but the walls answer neither question", "分层有帮助——但城墙回答不了这两个问题"), {
              align: "center",
              size: 14,
              weight: "700",
              color: "#0f172a",
            });
            k.label(g.cx, 40, L("1 — what about someone already inside?", "① 已经在里面的人怎么办？"), {
              align: "center",
              size: 11,
              color: "#b91c1c",
            });
            k.label(g.cx, 58, L("2 — what if we trust the wrong person?", "② 如果信错了人呢？"), {
              align: "center",
              size: 11,
              color: "#b45309",
            });
          },
        },
        {
          title: "Today there is no single castle",
          titleZh: "今天已没有单一城堡",
          caption:
            "Data moves through many connected systems. Every connection helps the system work, and every connection can also create risk — so each one needs its own controls.",
          captionZh:
            "数据流经众多互联系统。每一条连接都让系统得以运转，也可能带来风险——因此每一条连接都需要自己的控制措施。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var gap = 22;
            var bw = Math.max(48, (w - 60 - gap * 3) / 4);
            var y = h / 2 - 34;
            var labels = [
              [L("device", "设备"), L("phone · ATM", "手机 · ATM")],
              [L("network", "网络"), L("Wi-Fi · ISP", "Wi-Fi · 运营商")],
              [L("service", "服务"), L("bank · cloud", "银行 · 云")],
              [L("data", "数据"), L("records · keys", "记录 · 密钥")],
            ];
            for (var i = 0; i < 4; i++) {
              var x = 30 + i * (bw + gap);
              var last = i === 3;
              k.box(x, y, bw, 68, {
                fill: last ? "#ecfdf5" : "#eff6ff",
                stroke: last ? "#059669" : "#2563eb",
                lw: 1.8,
                r: 10,
              });
              k.label(x + bw / 2, y + 26, labels[i][0], {
                align: "center",
                size: 12,
                mono: true,
                color: last ? "#047857" : "#1d4ed8",
              });
              k.label(x + bw / 2, y + 48, labels[i][1], { align: "center", size: 10, color: "#565d75" });
              if (i < 3) {
                k.arrow(x + bw + 3, y + 34, x + bw + gap - 3, y + 34, { color: "#64748b", lw: 1.8 });
                k.dot(x + bw + gap / 2, y - 14, 4, { fill: "#dc2626" });
                k.label(x + bw + gap / 2, y - 30, L("risk", "风险"), { align: "center", size: 9, color: "#b91c1c" });
              }
            }
            k.label(w / 2, 24, L("No single castle: data moves through many systems", "没有单一城堡：数据流经众多系统"), {
              align: "center",
              size: 14,
              weight: "700",
              color: "#0f172a",
            });
            k.label(w / 2, h - 24, L("every connection helps the system work — and can create risk", "每条连接都支撑系统运转——也都可能带来风险"), {
              align: "center",
              size: 11,
              color: "#565d75",
            });
          },
        },
        {
          title: "No single control protects the whole system",
          titleZh: "没有任何单一控制能保护整个系统",
          caption:
            "So modern systems are protected at multiple points: who gets in, what matters, and what is happening. The remaining weeks of the unit fill in each of these three columns.",
          captionZh:
            "因此现代系统在多个点上受到保护：谁能进来、什么最重要、正在发生什么。本单元后续各周逐项填充这三列。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var gap = 18;
            var colW = Math.max(70, (w - 60 - gap * 2) / 3);
            var titles = [
              L("Protect who gets in", "管住谁能进来"),
              L("Protect what matters", "保护重要资产"),
              L("Watch what happens", "监视一切动静"),
            ];
            var items = [
              [L("identity", "身份"), L("authentication", "认证"), L("least privilege", "最小权限")],
              [L("encryption", "加密"), L("integrity checks", "完整性校验"), L("change control", "变更控制")],
              [L("logging", "日志"), L("detection", "检测"), L("response", "响应")],
            ];
            for (var i = 0; i < 3; i++) {
              var x = 30 + i * (colW + gap);
              k.box(x, 66, colW, h - 146, { fill: "#f8fafc", stroke: "#94a3b8", lw: 1.6, r: 12 });
              k.label(x + colW / 2, 92, titles[i], { align: "center", size: 12, weight: "700", color: "#0f172a" });
              for (var j = 0; j < items[i].length; j++) {
                k.label(x + colW / 2, 122 + j * 24, items[i][j], { align: "center", size: 10.5, color: "#565d75" });
              }
            }
            k.box(30, h - 62, w - 60, 34, { fill: "#ecfdf5", stroke: "#059669", lw: 1.8, r: 12 });
            k.label(w / 2, h - 45, L("no single control protects the whole system — we need layers of defence", "没有单一控制能保护整个系统——我们需要纵深防御"), {
              align: "center",
              size: 11,
              mono: true,
              color: "#047857",
            });
          },
        },
      ],
    });
  }

  /* ── Stepper 2: the wooden barrel ───────────────────────────── */

  function initBarrelStepper() {
    var host = document.getElementById("ix-barrel");
    if (!host || !window.Interactive) return;

    var names = ["PEOPLE", "DEVICES", "NETWORKS", "SOFTWARE", "DATA"];
    var namesZh = ["人", "设备", "网络", "软件", "数据"];

    window.Interactive.stepper("ix-barrel", {
      title: "The wooden barrel: the weakest board sets the level",
      titleZh: "木桶理论：最短板决定水位",
      subtitle: "The deck's second model of defence in depth — People, Devices, Networks, Software, Data — and the arithmetic behind it.",
      subtitleZh: "讲义中纵深防御的第二个模型——人、设备、网络、软件、数据——以及背后的算术。",
      height: 280,
      frames: [
        {
          title: "Five boards, level water",
          titleZh: "五块木板，水位齐平",
          caption:
            "When every layer is equally strong the barrel holds its level. This is the picture people have in mind when they say the system is secure.",
          captionZh:
            "当每一层都一样坚固时，木桶能维持水位。人们说“系统是安全的”时，脑中想的正是这幅图。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = barrelFrame(k, w, h, [1, 1, 1, 1, 1], names, namesZh, 1);
            k.label(g.cx, 22, L("Every board the same height", "所有木板一样高"), {
              align: "center",
              size: 14,
              weight: "700",
              color: "#0f172a",
            });
            levelMark(k, g, L("security level", "安全水位"), "#047857");
          },
        },
        {
          title: "One board is short",
          titleZh: "有一块木板很短",
          caption:
            "A single weak layer — an untrained team, an unpatched device, a flat network — drops the level for everything else. The water does not care how tall the other four boards are.",
          captionZh:
            "只要有一层薄弱——未受培训的团队、未打补丁的设备、扁平的内部网络——整体水位就会下降。水并不在意另外四块木板有多高。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var levels = [0.42, 1, 1, 1, 1];
            var g = barrelFrame(k, w, h, levels, names, namesZh, 0);
            k.highlight(g.x[0] - 4, g.top[0] - 6, g.sw + 8, g.base - g.top[0] + 8, { color: "#dc2626" });
            k.label(g.x[0] + g.sw / 2, g.top[0] - 22, L("one weak layer", "薄弱的一层"), {
              align: "center",
              size: 10,
              color: "#b91c1c",
            });
            k.label(g.cx, 22, L("A system is only as secure as its weakest point", "系统的安全性取决于最薄弱的一环"), {
              align: "center",
              size: 14,
              weight: "700",
              color: "#0f172a",
            });
            levelMark(k, g, L("level = shortest board", "水位 = 最短板"), "#b91c1c");
          },
        },
        {
          title: "Attackers look for the shortest board",
          titleZh: "攻击者寻找最短的木板",
          caption:
            "An attacker does not fight the strongest control. They take the easiest path in, which is why hardening everything except the weakest layer changes very little.",
          captionZh:
            "攻击者不会去硬碰最强的控制，而是走最容易的那条路。因此，除了最薄弱层之外处处加固，几乎不会改变结果。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var levels = [0.42, 1, 1, 1, 1];
            var g = barrelFrame(k, w, h, levels, names, namesZh, 0);
            k.arrow(24, g.base - 30, g.x[0] - 6, g.base - 30, { color: "#dc2626", lw: 2.4 });
            k.label(24, g.base - 52, L("attack path", "攻击路径"), { size: 10.5, color: "#b91c1c" });
            k.highlight(g.x[0] - 4, g.top[0] - 6, g.sw + 8, g.base - g.top[0] + 8, { color: "#dc2626" });
            k.label(g.cx + 40, g.top[0] + 6, L("already strong — irrelevant", "已经很强——但无关紧要"), {
              size: 10.5,
              color: "#64748b",
            });
            k.label(g.cx, 22, L("Attackers look for the shortest board", "攻击者寻找最短的木板"), {
              align: "center",
              size: 14,
              weight: "700",
              color: "#0f172a",
            });
            levelMark(k, g, L("level = shortest board", "水位 = 最短板"), "#b91c1c");
          },
        },
        {
          title: "Raising any other board does nothing",
          titleZh: "加高其他木板毫无作用",
          caption:
            "Formally: if the attacker only needs one way in, the chance of success is max pᵢ over the layers, so only a reduction of the largest pᵢ moves the number. If every layer must be defeated and they fail independently, it becomes the product Π pᵢ instead — and that assumption has to be argued, not assumed.",
          captionZh:
            "严格地说：如果攻击者只需找到一条路径，成功概率就是各层 pᵢ 的最大值，因此只有降低最大的 pᵢ 才会改变结果。若攻击者必须突破每一层且各层独立失效，则改为乘积 Π pᵢ——而这一独立性假设必须论证，不能默认。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var levels = [0.42, 1, 1, 1, 1];
            var g = barrelFrame(k, w, h, levels, names, namesZh, 2);
            k.highlight(g.x[2] - 4, g.top[2] - 6, g.sw + 8, g.base - g.top[2] + 8, { color: "#059669" });
            k.arrow(g.x[2] + g.sw / 2, g.top[2] - 30, g.x[2] + g.sw / 2, g.top[2] - 8, { color: "#059669", lw: 2 });
            k.label(g.x[2] + g.sw / 2, g.top[2] - 44, L("raised — no effect", "加高了——没有效果"), {
              align: "center",
              size: 10.5,
              color: "#047857",
            });
            k.highlight(g.x[0] - 4, g.top[0] - 6, g.sw + 8, g.base - g.top[0] + 8, { color: "#dc2626" });
            k.label(g.cx, 22, L("Only the shortest board moves the level", "只有最短板能改变水位"), {
              align: "center",
              size: 14,
              weight: "700",
              color: "#0f172a",
            });
            k.label(g.cx, h - 20, L("weakest path: P(success) = max pᵢ   ·   all layers: P(success) = Π pᵢ", "最弱路径：P(成功) = max pᵢ   ·   全部层次：P(成功) = Π pᵢ"), {
              align: "center",
              size: 10.5,
              mono: true,
              color: "#565d75",
            });
          },
        },
        {
          title: "And the boards shrink over time",
          titleZh: "而且木板会随时间变矮",
          caption:
            "New vulnerabilities, staff turnover, new services and changed assumptions erode the layers that were strong at launch. This is why security is a lifecycle: the barrel has to be re-measured, not just built once.",
          captionZh:
            "新漏洞、人员流动、新上线的服务与改变的假设，会不断侵蚀上线时坚固的层次。这正是安全是生命周期而非一次性工程的原因：木桶需要反复测量，而不是建好就完事。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var levels = [0.42, 0.72, 0.86, 0.66, 0.9];
            var g = barrelFrame(k, w, h, levels, names, namesZh, -1);
            var notes = [
              L("untrained staff", "人员未培训"),
              L("new CVE", "新漏洞"),
              L("new service", "新服务"),
              L("staff change", "人员变动"),
              L("new data", "新数据"),
            ];
            for (var i = 0; i < 5; i++) {
              k.label(g.x[i] + g.sw / 2, g.top[i] - 14, notes[i], { align: "center", size: 9, color: "#64748b" });
            }
            k.label(g.cx, 22, L("Security does not end when a system is launched", "系统上线并不代表安全工作的结束"), {
              align: "center",
              size: 14,
              weight: "700",
              color: "#0f172a",
            });
            levelMark(k, g, L("re-measure, then repair", "重新测量，再行修补"), "#b45309");
          },
        },
      ],
    });
  }

  function barrelFrame(k, w, h, levels, names, namesZh, highlightIndex) {
    var cx = w / 2;
    var base = h - 46;
    var half = Math.min(196, w / 2 - 26);
    var gap = 6;
    var sw = (half * 2 - gap * 4) / 5;
    var maxH = base - 58;
    var xs = [];
    var tops = [];

    for (var i = 0; i < 5; i++) {
      var x = cx - half + i * (sw + gap);
      var top = base - maxH * levels[i];
      xs.push(x);
      tops.push(top);
      var weak = highlightIndex === i;
      k.box(x, top, sw, base - top, {
        fill: weak ? "#fee2e2" : "#eff6ff",
        stroke: weak ? "#dc2626" : "#2563eb",
        lw: 1.6,
        r: 6,
      });
      k.label(x + sw / 2, base + 16, L(names[i], namesZh[i]), {
        align: "center",
        size: 9,
        mono: true,
        color: weak ? "#b91c1c" : "#475569",
      });
    }

    var level = Math.min.apply(Math, tops);
    k.box(cx - half - 6, level, half * 2 + 12, base - level, {
      fill: "rgba(5,150,105,0.14)",
      r: 8,
    });

    return { cx: cx, base: base, half: half, sw: sw, x: xs, top: tops, level: level };
  }

  function levelMark(k, g, text, color) {
    k.highlight(g.cx - g.half - 4, g.level - 3, g.half * 2 + 8, 6, { color: color, lw: 1.4, dash: [6, 4], r: 3 });
    k.label(g.cx + g.half - 4, g.level - 16, text, { align: "right", size: 10.5, color: color });
  }
})();
