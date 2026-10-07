(function () {
  "use strict";

  /* COMP5047 — Week 5 page behaviour.
   *
   * The declarative widgets (hotspot, matcher, race, pipeline, sequence,
   * timeline, deck) are mounted by shared/interactive.js from the JSON config
   * blocks in the page. This file owns the two animated canvas steppers — the
   * prototype-fidelity ladder and the laser-cutter file-to-part walkthrough —
   * plus the re-binding that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initFidelityStepper();
    initLaserStepper();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every widget and
   * every quick-check inside a translated section is a brand-new node. Re-mount
   * the declarative widgets, re-init the steppers, and re-run the chrome
   * bindings; the sidebar toggle lives outside any section, so its old listener
   * is dropped first to avoid double-binding. */
  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    initFidelityStepper();
    initLaserStepper();
    rebindChrome();
  });

  var lastChromeLang = null;

  function currentLang() {
    return typeof window.getLang === "function" ? window.getLang() : "en";
  }

  function isZh() {
    return currentLang() === "zh";
  }

  /* Pick the string for the active language. The steppers are configured in
   * code rather than in a JSON block, so frame titles and captions have to be
   * selected by hand; Interactive's own pick() only covers titleZh/subtitleZh. */
  function L(en, zh) {
    return isZh() ? zh : en;
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
        window.console.error("[COMP5047 chapter 5] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Stepper 1: the prototype fidelity ladder ───────────────── */

  function initFidelityStepper() {
    var host = document.getElementById("ix-fidelity");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-fidelity", {
      title: L("The fidelity ladder", "保真度阶梯"),
      titleZh: "保真度阶梯",
      subtitle: L(
        "Every rung answers a different question and costs about ten times the one below it. Climb only as far as the question requires.",
        "每一级回答不同的问题，成本约是下一级的十倍。只爬到问题所需的层级。"
      ),
      subtitleZh: "每一级回答不同的问题，成本约是下一级的十倍。只爬到问题所需的层级。",
      height: 300,
      frames: [
        {
          title: L("Start from the question, not the machine", "从问题出发，而不是从机器出发"),
          caption: L(
            "The deck's instruction: consider what you want to learn with your prototype. Functionality (works-like) or look and feel (looks-like)? The answer decides the process.",
            "课件的要旨：先想清楚要用原型学到什么。是功能（works-like），还是外观与手感（looks-like）？答案决定工艺。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var gap = 24;
            var bw = Math.min(240, (w - gap * 3) / 2);
            var bx = (w - (bw * 2 + gap)) / 2;
            var by = h / 2 - 54;

            k.label(w / 2, 26, L("WHAT MUST THIS PROTOTYPE TEACH ME?", "这个原型要教我什么？"), {
              align: "center",
              size: 12,
              mono: true,
              color: "#0e7490"
            });

            k.box(bx, by, bw, 108, { fill: "#e6f2f5", stroke: "#0e7490", lw: 2, r: 12 });
            k.label(bx + 16, by + 26, L("LOOKS LIKE", "LOOKS LIKE"), { size: 12, mono: true, color: "#0e7490" });
            k.label(bx + 16, by + 52, L("visual semantics", "视觉语义"), { size: 11, color: "#565d75" });
            k.label(bx + 16, by + 72, L("proportions and shape", "比例与形态"), { size: 11, color: "#565d75" });
            k.label(bx + 16, by + 92, L("placement in context", "在情境中的摆放"), { size: 11, color: "#565d75" });

            k.box(bx + bw + gap, by, bw, 108, { fill: "#e9f7f1", stroke: "#059669", lw: 2, r: 12 });
            k.label(bx + bw + gap + 16, by + 26, L("WORKS LIKE", "WORKS LIKE"), { size: 12, mono: true, color: "#059669" });
            k.label(bx + bw + gap + 16, by + 52, L("mechanism and feel", "机构与手感"), { size: 11, color: "#565d75" });
            k.label(bx + bw + gap + 16, by + 72, L("weight of the device", "设备的重量"), { size: 11, color: "#565d75" });
            k.label(bx + bw + gap + 16, by + 92, L("electronics and behaviour", "电子与行为"), { size: 11, color: "#565d75" });

            k.label(w / 2, by + 136, L("one prototype rarely answers both", "一个原型很少能同时回答两者"), {
              align: "center",
              size: 11,
              color: "#7b829a"
            });
          }
        },
        {
          title: L("Rung 1 — sketch and paper: hours", "第 1 级——草图与纸张：数小时"),
          caption: L(
            "Sketch, paper template, 2D design. Almost free, and it already removes the worst ideas. Both case studies in the lecture start here.",
            "草图、纸样、二维设计。几乎零成本，却已能淘汰最差的想法。讲座中的两个案例都从这里开始。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var pw = Math.min(300, w * 0.46);
            var ph = 150;
            var px = w * 0.12;
            var py = h / 2 - ph / 2;
            k.box(px, py, pw, ph, { fill: "#ffffff", stroke: "#94a3b8", lw: 1.8, r: 6 });
            k.box(px + 18, py + 22, pw * 0.5, 46, { stroke: "#0e7490", lw: 1.6, r: 8 });
            k.label(px + 18 + pw * 0.25, py + 45, L("grip?", "握持？"), {
              align: "center",
              size: 11,
              color: "#0e7490"
            });
            k.arrow(px + 18, py + 92, px + pw - 22, py + 92, { color: "#94a3b8", lw: 1.4 });
            k.label(px + 18, py + 112, L("paper template", "纸样"), { size: 11, color: "#565d75" });
            k.label(px + 18, py + 132, L("scale 1:1, cut by hand", "1:1 比例，手工裁切"), { size: 11, color: "#565d75" });

            var cx = w * 0.62;
            k.label(cx, h / 2 - 30, L("cost", "成本"), { size: 11, mono: true, color: "#7b829a" });
            k.bar(cx, h / 2 - 16, Math.min(200, w * 0.28), 10, 1, { max: 100, fill: "#0891b2" });
            k.label(cx, h / 2 + 12, L("hours of your time", "数小时的投入"), { size: 11, color: "#565d75" });
            k.label(cx, h / 2 + 42, L("answers: is it worth building?", "回答：值不值得做？"), { size: 11, color: "#565d75" });
          }
        },
        {
          title: L("Rung 2 — foam core, cardboard, XPS: days", "第 2 级——泡沫板、纸板、XPS：数天"),
          caption: L(
            "Full-size looks-like models cut with a T-square, knife and cutting mat. Kurio explored in foam core and Styrofoam; Duo in polyurethane foam.",
            "用丁字尺、美工刀和切割垫做出的全尺寸 looks-like 模型。Kurio 用泡沫板与泡沫塑料探索，Duo 用聚氨酯泡沫。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = Math.min(280, w * 0.42);
            var bh = 130;
            var bx = w * 0.1;
            var by = h / 2 - bh / 2 + 4;

            /* Foam-core box in a rough 3/4 view. */
            k.box(bx, by, bw, bh, { fill: "#f8fafc", stroke: "#0e7490", lw: 2, r: 6 });
            k.box(bx + 26, by - 22, bw, 34, { fill: "#eef2f7", stroke: "#0e7490", lw: 1.6, r: 6 });
            k.arrow(bx + 26, by - 22, bx, by, { color: "#94a3b8", dash: [4, 4], lw: 1.4 });
            k.arrow(bx + 26 + bw, by - 22, bx + bw, by, { color: "#94a3b8", dash: [4, 4], lw: 1.4 });
            k.label(bx + 12, by + 24, L("foam core shell, full size", "全尺寸泡沫板外壳"), {
              size: 11,
              color: "#0e7490"
            });
            k.label(bx + 12, by + 46, L("hot glue · white glue · pins", "热熔胶 · 白胶 · 图钉"), {
              size: 11,
              color: "#565d75"
            });

            var tx = w * 0.6;
            k.label(tx, h / 2 - 44, L("bench kit", "工作台工具"), { size: 11, mono: true, color: "#7b829a" });
            k.box(tx, h / 2 - 32, 74, 12, { fill: "#dbeafe", stroke: "#2563eb", lw: 1.4, r: 3 });
            k.label(tx + 84, h / 2 - 26, L("metal ruler", "金属直尺"), { size: 11, color: "#565d75" });
            k.box(tx, h / 2 - 10, 74, 12, { fill: "#fef3c7", stroke: "#f59e0b", lw: 1.4, r: 3 });
            k.label(tx + 84, h / 2 - 4, L("T-square", "丁字尺"), { size: 11, color: "#565d75" });
            k.box(tx, h / 2 + 12, 74, 12, { fill: "#e2e8f0", stroke: "#94a3b8", lw: 1.4, r: 3 });
            k.label(tx + 84, h / 2 + 18, L("X-Acto / box cutter", "美工刀 / 裁刀"), { size: 11, color: "#565d75" });
            k.box(tx, h / 2 + 34, 74, 12, { fill: "#dcfce7", stroke: "#059669", lw: 1.4, r: 3 });
            k.label(tx + 84, h / 2 + 40, L("cutting mat", "切割垫"), { size: 11, color: "#565d75" });
          }
        },
        {
          title: L("Rung 3 — 3D printed enclosure + PCBs: weeks", "第 3 级——3D 打印外壳 + 电路板：数周"),
          caption: L(
            "The two chains merge. The works-like electronics and the looks-like shell meet in a functional prototype that can be taken into the field and tested.",
            "两条链在此汇合。works-like 的电子部分与 looks-like 的外壳合成可带出现场测试的功能原型。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var bx = w / 2 - 110;
            var by = h / 2 - 62;

            /* Printed enclosure with visible layer lines. */
            k.box(bx, by, 220, 124, { fill: "#e6f2f5", stroke: "#0e7490", lw: 2, r: 8 });
            for (var i = 1; i < 7; i++) {
              k.arrow(bx + 6, by + i * 17, bx + 214, by + i * 17, {
                color: "rgba(14,116,144,0.22)",
                lw: 1
              });
            }
            k.box(bx + 46, by + 34, 128, 56, { fill: "#d1fae5", stroke: "#059669", lw: 1.8, r: 6 });
            k.label(bx + 110, by + 54, "PCB", { align: "center", size: 12, mono: true, color: "#059669" });
            k.label(bx + 110, by + 74, L("board + tolerance", "电路板 + 公差"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
            k.label(w / 2, by + 146, L("layer lines · supports · sanding", "层纹 · 支撑 · 打磨"), {
              align: "center",
              size: 11,
              color: "#7b829a"
            });
          }
        },
        {
          title: L("Rung 4 — cast and moulded: the production tool", "第 4 级——浇注与成型：量产工具"),
          caption: L(
            "A sanded master, a silicone mould, cured resin — small runs of identical parts. Injection moulding is the same idea at industrial volume: high tooling cost, low cost per part.",
            "打磨好的母模、硅胶模具、固化树脂——小批量的一致零件。注塑是同一思路的工业版本：模具成本高，单件成本低。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 - 6;

            /* Mould halves with a cavity and a fill port. */
            k.box(cx - 96, cy - 62, 192, 44, { fill: "#fef3c7", stroke: "#f59e0b", lw: 2, r: 6 });
            k.box(cx - 96, cy + 18, 192, 44, { fill: "#fef3c7", stroke: "#f59e0b", lw: 2, r: 6 });
            k.box(cx - 48, cy - 18, 96, 36, { fill: "#fde68a", stroke: "#f59e0b", lw: 1.8, r: 4 });
            k.label(cx, cy, L("cavity = the part", "型腔 = 零件"), { align: "center", size: 11, color: "#b45309" });
            k.box(cx - 10, cy - 96, 20, 34, { fill: "#fef3c7", stroke: "#f59e0b", lw: 1.6, r: 3 });
            k.label(cx + 18, cy - 84, L("fill port", "浇口"), { size: 11, color: "#565d75" });
            k.arrow(cx + 70, cy - 90, cx + 70, cy - 40, { color: "#0891b2", lw: 1.6 });
            k.label(cx + 80, cy - 66, L("vent", "排气孔"), { size: 11, color: "#565d75" });
            k.label(cx, cy + 82, L("one master → many identical parts", "一个母模 → 许多一致的零件"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: from an Illustrator file to an assembled part ── */

  function initLaserStepper() {
    var host = document.getElementById("ix-laser");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-laser", {
      title: L("From file to assembled part", "从文件到装配完成的零件"),
      titleZh: "从文件到装配完成的零件",
      subtitle: L(
        "Four things decide whether a laser-cut enclosure goes together: the layers in the file, the kerf, the machine's limits, and the order you cut and fit in.",
        "决定激光切割外壳能否装起来的四件事：文件中的图层、割缝、机器的限制，以及切割与试装的顺序。"
      ),
      subtitleZh:
        "决定激光切割外壳能否装起来的四件事：文件中的图层、割缝、机器的限制，以及切割与试装的顺序。",
      height: 300,
      frames: [
        {
          title: L("1 — one file, five kinds of line", "1——一个文件，五类线"),
          caption: L(
            "Units in mm, colour mode RGB, and a layer for each goal: annotations, exterior cuts, interior cuts, vector engraving, bitmap engraving (single colour, diffusion dither).",
            "单位设为 mm，色彩模式设为 RGB，每个目标一个图层：标注、外轮廓切割、内轮廓切割、矢量雕刻、位图雕刻（单色、扩散抖动）。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var pw = Math.min(260, w * 0.4);
            var ph = 160;
            var px = w * 0.08;
            var py = h / 2 - ph / 2;

            k.box(px, py, pw, ph, { fill: "#ffffff", stroke: "#0e7490", lw: 2, r: 8 });
            k.box(px + 14, py + 14, pw - 28, ph - 28, { stroke: "#dc2626", lw: 2.4, r: 6 });
            k.dot(px + 56, py + 62, 12, { fill: "#ffffff", stroke: "#2563eb", lw: 2 });
            k.dot(px + 106, py + 62, 12, { fill: "#ffffff", stroke: "#2563eb", lw: 2 });
            k.label(px + 56, py + 92, L("vent slots", "散热槽"), { align: "center", size: 9, color: "#2563eb" });
            k.arrow(px + 150, py + 46, px + 150, py + 84, { color: "#059669", lw: 2 });
            k.label(px + 160, py + 66, L("engrave", "雕刻"), { size: 10, color: "#059669" });
            k.label(px + 14, py + ph - 26, L("sketch: outline note", "草图：轮廓备注"), {
              size: 10,
              color: "#94a3b8"
            });
            k.arrow(px + 30, py + ph - 40, px + 120, py + ph - 40, { color: "#94a3b8", lw: 1.2, dash: [4, 4] });

            var lx = px + pw + 34;
            k.label(lx, py + 8, L("layer → operation", "图层 → 加工"), { size: 11, mono: true, color: "#0e7490" });
            var rows = [
              ["#dc2626", L("exterior cuts", "外轮廓切割")],
              ["#2563eb", L("interior cuts", "内轮廓切割")],
              ["#059669", L("vector engraving", "矢量雕刻")],
              ["#7c3aed", L("bitmap engraving", "位图雕刻")],
              ["#94a3b8", L("annotations (not cut)", "标注（不切割）")]
            ];
            rows.forEach(function (row, i) {
              var y = py + 34 + i * 24;
              k.box(lx, y - 6, 16, 12, { fill: row[0], r: 3 });
              k.label(lx + 26, y, row[1], { size: 11, color: "#565d75" });
            });
            k.label(lx, py + 176, L("0.01 pt single-path outlines — check with Ctrl+Y", "0.01 pt 单一路径轮廓——用 Ctrl+Y 检查"), {
              size: 10.5,
              color: "#b45309"
            });
          }
        },
        {
          title: L("2 — the beam removes material: kerf", "2——光束会去掉材料：割缝"),
          caption: L(
            "Nominal 3 mm acrylic is not 3.000 mm, and every path loses a kerf of material. The slot has to be designed from the measured thickness, so the joint is a fit problem, not a geometry problem.",
            "标称 3 mm 的亚克力并不是 3.000 mm，而且每条路径都会损失一个割缝宽度。凹槽必须按实测厚度设计，因此接头是配合问题，而不是几何问题。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var y = h / 2 - 10;

            k.box(cx - 170, y, 150, 46, { fill: "#e6f2f5", stroke: "#0e7490", lw: 1.8, r: 4 });
            k.label(cx - 95, y + 23, L("wall panel", "侧板"), { align: "center", size: 11, color: "#0e7490" });
            k.box(cx - 170 + 44, y + 46, 30, 40, { stroke: "#0e7490", lw: 1.6, r: 3, fill: "rgba(8,145,178,0.08)" });
            k.label(cx - 155, y + 108, L("slot width = measured thickness", "槽宽 = 实测厚度"), {
              size: 11,
              color: "#565d75"
            });

            k.arrow(cx - 60, y + 23, cx + 10, y + 23, { color: "#0891b2", lw: 1.8 });
            k.label(cx - 25, y - 4, L("kerf k", "割缝 k"), { align: "center", size: 11, mono: true, color: "#0891b2" });

            k.box(cx + 30, y, 150, 46, { fill: "#f8fafc", stroke: "#94a3b8", lw: 1.6, r: 4 });
            k.label(cx + 105, y + 23, L("mating tab", "配合凸榫"), { align: "center", size: 11, color: "#565d75" });
            k.box(cx + 30 + 60, y + 46, 30, 40, { stroke: "#94a3b8", lw: 1.6, r: 3, fill: "rgba(148,163,184,0.12)" });
            k.label(cx + 105, y + 108, L("test the fit in cardboard first", "先用纸板试配合"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });

            k.label(cx, 26, L("cut dimension = designed dimension − kerf", "切割尺寸 = 设计尺寸 − 割缝"), {
              align: "center",
              size: 12,
              mono: true,
              color: "#0e7490"
            });
          }
        },
        {
          title: L("3 — know the machine's limits", "3——了解机器的限制"),
          caption: L(
            "Bed 600 × 900 mm and a maximum thickness around 3 cm on the machine named in the deck. PVC, leather and carbon fibre may emit dangerous gases and dusts — check the material before it goes on the bed.",
            "课件所述机型的幅面为 600 × 900 mm，最大厚度约 3 cm。PVC、皮革与碳纤维可能释放有害气体与粉尘——上机前先确认材料。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var bx = w * 0.08;
            var by = h / 2 - 74;
            var bw = Math.min(300, w * 0.42);
            var bh = bw * 0.62;

            k.box(bx, by, bw, bh, { fill: "#f8fafc", stroke: "#0e7490", lw: 2, r: 8 });
            k.label(bx + 10, by + 20, L("bed 600 × 900 mm", "幅面 600 × 900 mm"), {
              size: 11,
              mono: true,
              color: "#0e7490"
            });
            k.box(bx + 26, by + 40, bw * 0.34, bh * 0.42, { fill: "#dbeafe", stroke: "#2563eb", lw: 1.6, r: 4 });
            k.label(bx + 26 + bw * 0.17, by + 62, L("part 1", "零件 1"), { align: "center", size: 10, color: "#2563eb" });
            k.box(bx + 26 + bw * 0.42, by + 40, bw * 0.34, bh * 0.42, { fill: "#dbeafe", stroke: "#2563eb", lw: 1.6, r: 4 });
            k.label(bx + 26 + bw * 0.59, by + 62, L("part 2", "零件 2"), { align: "center", size: 10, color: "#2563eb" });
            k.label(bx + 10, by + bh - 14, L("nest with margin — a shifted sheet ruins neighbours", "排版留边——板材移位会毁掉相邻零件"), {
              size: 10.5,
              color: "#565d75"
            });

            var tx = bx + bw + 40;
            k.label(tx, by + 6, L("check before cutting", "切割前检查"), { size: 11, mono: true, color: "#b45309" });
            var warns = [
              L("PVC, leather, carbon fibre: dangerous gases and dusts", "PVC、皮革、碳纤维：有害气体与粉尘"),
              L("maximum material thickness ≈ 3 cm", "最大材料厚度约 3 cm"),
              L("engraving is a separate pass from cutting", "雕刻与切割是不同的加工过程"),
              L("material shifting on the bed ruins the job", "板材在台面上移位会毁掉整个任务"),
              L("test on cardboard or plywood before acrylic", "先用纸板或胶合板试切，再用亚克力")
            ];
            warns.forEach(function (text, i) {
              var y = by + 34 + i * 30;
              k.dot(tx + 5, y, 4, { fill: "#f59e0b" });
              k.label(tx + 18, y, text, { size: 11, color: "#565d75" });
            });
          }
        },
        {
          title: L("4 — cut order, dry-fit, then glue", "4——先切内轮廓、试装、最后粘接"),
          caption: L(
            "Cut interiors before exteriors so the part does not move once it is free. Dry-fit everything with no adhesive, adjust the file, and only then commit — acrylic cement is flagged “caution!” in the deck.",
            "先切内部再切外轮廓，零件脱落时才不会移位。全部先无胶试装，修改文件后再最终固定——课件对亚克力胶标注了“注意！”。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;

            k.box(cx - 190, h / 2 - 60, 150, 110, { fill: "#ffffff", stroke: "#0e7490", lw: 1.8, r: 8 });
            k.label(cx - 115, h / 2 - 42, L("one sheet", "一张板材"), { align: "center", size: 11, color: "#0e7490" });
            k.dot(cx - 150, h / 2 - 4, 14, { fill: "#dbeafe", stroke: "#2563eb", lw: 1.6 });
            k.dot(cx - 90, h / 2 - 4, 14, { fill: "#dbeafe", stroke: "#2563eb", lw: 1.6 });
            k.label(cx - 150, h / 2 - 4, "1", { align: "center", size: 12, mono: true, color: "#2563eb" });
            k.label(cx - 90, h / 2 - 4, "1", { align: "center", size: 12, mono: true, color: "#2563eb" });
            k.label(cx - 115, h / 2 + 34, L("2 = exterior outline", "2 = 外轮廓"), {
              align: "center",
              size: 11,
              color: "#dc2626"
            });

            k.arrow(cx - 30, h / 2 - 6, cx + 30, h / 2 - 6, { color: "#94a3b8", lw: 1.8 });

            k.box(cx + 50, h / 2 - 60, 150, 46, { fill: "#e6f2f5", stroke: "#0e7490", lw: 1.8, r: 4 });
            k.box(cx + 50, h / 2 - 6, 40, 56, { fill: "#f8fafc", stroke: "#94a3b8", lw: 1.6, r: 4 });
            k.box(cx + 160, h / 2 - 6, 40, 56, { fill: "#f8fafc", stroke: "#94a3b8", lw: 1.6, r: 4 });
            k.label(cx + 125, h / 2 + 66, L("dry-fit: no glue yet", "试装：先不上胶"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });

            k.label(cx, 26, L("interiors → exteriors → dry-fit → glue", "内轮廓 → 外轮廓 → 试装 → 粘接"), {
              align: "center",
              size: 12,
              mono: true,
              color: "#0e7490"
            });
          }
        }
      ]
    });
  }
})();
