(function () {
  "use strict";

  /* COMP5047 — Week 6 page behaviour.
   *
   * The declarative widgets (timeline, hotspot, matcher, deck, race, pipeline,
   * sequence) are mounted by shared/interactive.js from the JSON config blocks
   * in the pages. This file owns the animated canvas steppers and the
   * re-binding that a language swap requires.
   *
   * It is loaded by chapter6-study.html AND by chapter6-math.html, so every
   * initialiser must be idempotent: the language toggle replaces whole section
   * innerHTML and then fires `langchange`, at which point the old canvas is
   * gone and a fresh one has to be built from the translated JSON config.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initSteppers();
    initChrome();
    lastChromeLang = currentLang();
  });

  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    /* The declarative widgets are re-mounted from the translated config; the
     * imperative canvases have to be rebuilt by hand. */
    mountChapter6MathWidgets();
    initSteppers();
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
        window.console.error("[COMP5047 chapter 6] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Stepper bookkeeping ────────────────────────────────────────
   * `Interactive.stepper` appends its own markup, so a rebuild must first
   * empty the host. The language guard keeps the six initialisers from
   * duplicating each other on the pages where several hosts coexist.
   */

  function buildStepper(id, cfg) {
    var host = document.getElementById(id);
    if (!host || !window.Interactive || !window.Interactive.stepper) return;

    var lang = currentLang();
    if (host.dataset.ixBuilt === lang) return;

    while (host.firstChild) host.removeChild(host.firstChild);
    host.dataset.ixBuilt = lang;
    window.Interactive.stepper(id, cfg);
  }

  function initSteppers() {
    buildStepper("ix-touch-problems", touchProblemsCfg());
    buildStepper("ix-mocap-choice", mocapChoiceCfg());
    buildStepper("ix-recognition-pipeline", recognitionCfg());
    buildStepper("ix-guessability", guessabilityCfg());
    buildStepper("ix-gesture-cost", gestureCostCfg());
  }

  /* ── Stepper 1: direct input and its geometric failure modes ─── */

  function touchProblemsCfg() {
    var zh = currentLang() === "zh";
    function s(en, cn) {
      return zh ? cn : en;
    }

    return {
      title: s("Self-occlusion: why the hand is a hard input device", "自我遮挡：为什么手是一种难对付的输入设备"),
      subtitle: s(
        "The same finger, seen by the sensor and seen by the eye.",
        "同一根手指，在传感器眼中与在眼睛眼中。"
      ),
      height: 260,
      frames: [
        {
          title: s("A contact region, not a coordinate", "接触是一个区域，而不是一个坐标"),
          caption: s(
            "The fingertip covers a patch of the display, so the reported point is the centre of an area the user never specified. Enlarging the target and snapping to the nearest selectable item are the two responses that do not require better hardware.",
            "指尖覆盖了显示屏的一小块区域，因此被报告的点只是这个区域的中心，而用户从未指定过它。放大目标与吸附到最近的可选对象，是两种不需要更好硬件的应对方式。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = w * 0.3;
            var y = h * 0.62;
            k.box(x - 150, y - 40, 300, 80, { fill: "#eef2f7", stroke: "#cbd5e1", lw: 1.4, r: 10 });
            k.label(x, y - 62, s("display", "显示屏"), { size: 11, mono: true, color: "#565d75" });
            k.label(x - 150, y, s("target", "目标"), { size: 10, color: "#565d75" });
            k.box(x - 26, y - 26, 52, 52, { fill: "rgba(8,145,178,0.10)", stroke: "#0e7490", lw: 2, r: 8 });
            k.label(x, y - 12, s("item", "选项"), { align: "center", size: 10, color: "#0e7490" });
            k.dot(x + 34, y, 40, { fill: "rgba(245,158,11,0.22)", stroke: "#f59e0b", lw: 1.6 });
            k.dot(x + 34, y, 4, { fill: "#f59e0b" });
            k.label(x + 78, y - 44, s("reported point", "报告点"), { size: 10, color: "#b45309" });
            k.arrow(x + 34, y + 42, x, y + 26, { color: "#f59e0b", lw: 1.6 });
            k.label(x + 40, y + 56, s("snap to nearest item", "吸附到最近选项"), { size: 10, color: "#565d75" });
            k.label(x - 150, h - 18, s("the uncertainty is geometric, not electrical", "这种不确定性是几何性的，而非电气性的"), {
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("Occlusion: the hand hides its own target", "遮挡：手挡住了它自己的目标"),
          caption: s(
            "Finger and target occupy the same pixels. Moving the feedback above the point of contact, or moving the control surface away from the display, restores the missing visual information.",
            "手指与目标占据同一批像素。把反馈移到接触点上方，或让控制面离开显示屏，就能恢复缺失的视觉信息。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = w * 0.5;
            var y = h * 0.5;
            k.box(x - 130, y - 46, 260, 92, { fill: "#eef2f7", stroke: "#cbd5e1", lw: 1.4, r: 10 });
            k.label(x, y, s("hidden content", "被遮住的内容"), { align: "center", size: 11, color: "#94a3b8" });
            k.dot(x, y + 6, 46, { fill: "rgba(220,38,38,0.16)", stroke: "#dc2626", lw: 1.8 });
            k.label(x, y + 72, s("the finger occupies the target", "手指占据了目标"), { align: "center", size: 11, color: "#b91c1c" });
            k.box(x - 110, y - 108, 220, 34, { fill: "#ffffff", stroke: "#0e7490", lw: 1.8, r: 8 });
            k.label(x, y - 91, s("feedback displaced above", "反馈被上移显示"), { align: "center", size: 11, color: "#0e7490" });
            k.arrow(x, y - 72, x, y - 42, { color: "#0e7490", lw: 1.6, dash: [5, 4] });
            k.label(x - 130, h - 18, s("also fixed by separating the control surface from the display", "也可以通过把控制面与显示屏分离来解决"), {
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("Points of contact: blobs merge and split", "接触点：斑块会合并与分裂"),
          caption: s(
            "Two fingers close together are reported as one point; one large contact — a thumb, a palm edge, a forearm — is reported as two. The sensor is not faulty: a blob has no identity, so identity has to come from tracking across frames.",
            "靠得近的两根手指被报告为一点；一个大面积接触——拇指、掌缘、前臂——被报告为两点。传感器并没有坏：斑块本身没有身份，身份必须来自跨帧跟踪。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h * 0.52;
            var left = w * 0.26;
            var right = w * 0.72;

            k.box(left - 62, y - 56, 124, 112, { fill: "rgba(8,145,178,0.06)", stroke: "#0e7490", lw: 1.6, r: 10 });
            k.dot(left - 16, y, 24, { fill: "rgba(8,145,178,0.25)", stroke: "#0e7490", lw: 1.6 });
            k.dot(left + 16, y, 24, { fill: "rgba(8,145,178,0.25)", stroke: "#0e7490", lw: 1.6 });
            k.label(left, y - 76, s("two fingers → one point", "两指 → 一点"), { align: "center", size: 11, color: "#0e7490" });
            k.label(left, y + 82, s("merge", "合并"), { align: "center", size: 10, mono: true, color: "#565d75" });

            k.box(right - 62, y - 56, 124, 112, { fill: "rgba(245,158,11,0.07)", stroke: "#f59e0b", lw: 1.6, r: 10 });
            k.dot(right, y, 42, { fill: "rgba(245,158,11,0.22)", stroke: "#b45309", lw: 1.8 });
            k.dot(right - 12, y - 8, 4, { fill: "#b45309" });
            k.dot(right + 12, y + 8, 4, { fill: "#b45309" });
            k.label(right, y - 76, s("one palm → two points", "一个手掌 → 两点"), { align: "center", size: 11, color: "#b45309" });
            k.label(right, y + 82, s("split", "分裂"), { align: "center", size: 10, mono: true, color: "#565d75" });

            k.label(w / 2, h - 18, s("both are resolved by temporal tracking, not by a better sensor", "两者都要靠时序跟踪解决，而不是靠更好的传感器"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("Bimanual skill: two hands, two jobs", "双手技能：两只手，两种职责"),
          caption: s(
            "Human hands are asymmetric. The non-dominant hand holds, orients and frames; the dominant hand acts. Treating the second hand as a second pointer throws away the skill it already has.",
            "人的双手并不对称。非惯用手负责持握、定向与取景；惯用手负责操作。把第二只手当作第二个指针，等于丢弃了它本就具备的技能。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h * 0.56;
            var lx = w * 0.28;
            var rx = w * 0.72;

            k.box(lx - 58, y - 74, 116, 148, { stroke: "#0e7490", lw: 2, r: 10 });
            k.label(lx, y - 56, s("non-dominant", "非惯用手"), { align: "center", size: 10, mono: true, color: "#0e7490" });
            k.box(lx - 30, y - 22, 60, 44, { fill: "rgba(8,145,178,0.12)", stroke: "#0e7490", lw: 1.6, r: 6 });
            k.label(lx, y, s("holds / frames", "持握／取景"), { align: "center", size: 10, color: "#0e7490" });
            k.label(lx, y + 46, s("continuous", "连续"), { align: "center", size: 10, color: "#565d75" });

            k.arrow(lx + 66, y, rx - 66, y, { color: "#94a3b8", lw: 1.6, dash: [5, 4] });

            k.box(rx - 58, y - 74, 116, 148, { stroke: "#7c3aed", lw: 2, r: 10 });
            k.label(rx, y - 56, s("dominant", "惯用手"), { align: "center", size: 10, mono: true, color: "#7c3aed" });
            k.box(rx - 30, y - 22, 60, 44, { fill: "rgba(124,58,237,0.12)", stroke: "#7c3aed", lw: 1.6, r: 6 });
            k.label(rx, y, s("acts", "操作"), { align: "center", size: 10, color: "#7c3aed" });
            k.label(rx, y + 46, s("discrete + continuous", "离散 + 连续"), { align: "center", size: 10, color: "#565d75" });

            k.label(w / 2, h - 18, s("design the asymmetry in; do not average it away", "把这种不对称设计进去，而不是把它平均掉"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        }
      ]
    };
  }

  /* ── Stepper 2: extrinsic vs intrinsic tracking ─────────────── */

  function mocapChoiceCfg() {
    var zh = currentLang() === "zh";
    function s(en, cn) {
      return zh ? cn : en;
    }

    return {
      title: s("Extrinsic or intrinsic: where the sensors live", "外部还是自身：传感器放在哪里"),
      subtitle: s(
        "One decision — who carries the sensor — settles most of the trade-offs.",
        "一个决定——由谁携带传感器——就解决了大部分权衡。"
      ),
      height: 260,
      frames: [
        {
          title: s("Extrinsic: sensors in the environment", "外部感知：传感器置于环境中"),
          caption: s(
            "Cameras observe the body. Nothing is worn, and the estimate has an absolute reference, so it never drifts — but the person must stay inside the capture volume, and the body can occlude itself.",
            "摄像头观测身体。人不需要穿戴任何东西，而且估计值有绝对参考，因此永不漂移——但人必须留在捕捉体积之内，而且身体会遮挡自己。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w * 0.62;
            var cy = h * 0.54;
            k.box(24, h * 0.22, 74, 62, { fill: "#e6f2f5", stroke: "#0e7490", lw: 2, r: 8 });
            k.label(61, h * 0.22 + 20, s("camera", "摄像头"), { align: "center", size: 10, mono: true, color: "#0e7490" });
            k.label(61, h * 0.22 + 40, s("+ IR", "＋红外"), { align: "center", size: 10, mono: true, color: "#0e7490" });
            k.dot(cx, cy, 62, { stroke: "#0e7490", lw: 1.8, dash: [6, 5], fill: "rgba(8,145,178,0.06)" });
            k.label(cx, cy - 78, s("tracking volume", "跟踪体积"), { align: "center", size: 10, mono: true, color: "#0e7490" });
            k.arrow(104, h * 0.22 + 30, cx - 50, cy - 20, { color: "#0891b2", lw: 1.4, dash: [5, 4] });
            k.arrow(104, h * 0.22 + 40, cx - 46, cy + 18, { color: "#0891b2", lw: 1.4, dash: [5, 4] });
            k.dot(cx, cy - 22, 13, { fill: "#ffffff", stroke: "#0e7490", lw: 2 });
            k.arrow(cx, cy - 8, cx, cy + 22, { color: "#0e7490", lw: 2 });
            k.arrow(cx, cy - 4, cx - 34, cy - 30, { color: "#0e7490", lw: 2 });
            k.arrow(cx, cy - 4, cx + 34, cy - 30, { color: "#0e7490", lw: 2 });
            k.label(cx, cy + 42, s("no worn hardware", "无需穿戴硬件"), { align: "center", size: 11, color: "#565d75" });
            k.label(w / 2, h - 16, s("absolute reference · bounded volume · self-occlusion", "绝对参考 · 体积有界 · 自遮挡"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("Intrinsic: sensors on the body", "自身感知：传感器置于身体上"),
          caption: s(
            "An inertial measurement unit travels with the person: accelerometer for acceleration, gyroscope for angular rate, magnetometer as a compass. No camera can lose it, and millimetre finger motion is measurable at the source — the reason microgestures are practical.",
            "惯性测量单元随人移动：加速度计测加速度，陀螺仪测角速率，磁力计充当罗盘。没有摄像头能把它跟丢，而毫米级的手指动作可以在信号源头被测量——这正是微手势得以实用的原因。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w * 0.5;
            var cy = h * 0.54;
            k.dot(cx, cy - 30, 15, { fill: "#ffffff", stroke: "#7c3aed", lw: 2.2 });
            k.arrow(cx, cy - 14, cx, cy + 34, { color: "#7c3aed", lw: 2.4 });
            k.arrow(cx, cy - 12, cx - 44, cy + 14, { color: "#7c3aed", lw: 2.4 });
            k.arrow(cx, cy - 12, cx + 44, cy + 14, { color: "#7c3aed", lw: 2.4 });
            k.arrow(cx, cy + 34, cx - 22, cy + 74, { color: "#7c3aed", lw: 2.4 });
            k.arrow(cx, cy + 34, cx + 22, cy + 74, { color: "#7c3aed", lw: 2.4 });

            [[cx, cy - 30, s("head", "头部")], [cx, cy + 6, s("torso", "躯干")],
             [cx + 44, cy + 14, s("wrist", "腕部")], [cx - 44, cy + 14, s("wrist", "腕部")]].forEach(function (p) {
              k.box(p[0] - 17, p[1] - 10, 34, 20, { fill: "rgba(124,58,237,0.16)", stroke: "#7c3aed", lw: 1.6, r: 5 });
              k.label(p[0], p[1] + 24, p[2], { align: "center", size: 9, mono: true, color: "#565d75" });
            });

            k.label(w / 2, h - 16, s("mobility · microgesture resolution · drift and encumbrance", "可移动 · 微手势分辨率 · 漂移与穿戴负担"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("The axis that decides: amount of information", "决定性的判据：信息量"),
          caption: s(
            "Presence, 2D position, 3D position, orientation, body configuration, hand configuration, facial expressions, microgestures. Name the ones the interaction actually needs; that axis cannot be traded away, and every other axis is a cost you accept to obtain it.",
            "在场、二维位置、三维位置、姿态、身体构型、手部构型、面部表情、微手势。先说清这次交互真正需要哪几项；这条判据无法被交易掉，而其余每条判据都是为获得它而付出的代价。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var items = [
              [s("presence", "在场"), 0.15],
              [s("2D / 3D position", "二维／三维位置"), 0.42],
              [s("orientation", "姿态"), 0.6],
              [s("body config", "身体构型"), 0.75],
              [s("hand config", "手部构型"), 0.85],
              [s("microgesture", "微手势"), 1.0]
            ];
            var barW = w - 260;
            items.forEach(function (it, i) {
              var y = 34 + i * 32;
              k.label(24, y, it[0], { size: 11.5, color: "#565d75" });
              k.bar(210, y - 8, barW, 16, it[1], { max: 1, fill: i > 3 ? "#7c3aed" : "#0891b2" });
              k.label(210 + barW + 12, y, i > 3 ? s("intrinsic", "自身") : s("either", "皆可"), {
                size: 10,
                mono: true,
                color: i > 3 ? "#7c3aed" : "#0e7490"
              });
            });
            k.label(w / 2, h - 14, s("the right-hand column is where the sensing family is forced", "右侧一列，就是感知方式被强制决定的地方"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        }
      ]
    };
  }

  /* ── Stepper 3: the recognition pipeline ───────────────────── */

  function recognitionCfg() {
    var zh = currentLang() === "zh";
    function s(en, cn) {
      return zh ? cn : en;
    }

    return {
      title: s("One gesture through the pipeline", "一次手势穿过流水线"),
      subtitle: s(
        "Six stages, and every one of them can only remove information.",
        "六个阶段，而每一个阶段都只会减少信息。"
      ),
      height: 250,
      frames: [
        {
          title: s("1. Raw frames", "1. 原始帧"),
          caption: s(
            "A stream of samples at a fixed rate: touch blobs, joint positions, or IMU rates. Nothing here is a gesture yet — it is only evidence.",
            "以固定帧率到来的采样流：触摸斑块、关节位置，或 IMU 角速率。此时还没有任何东西是手势——它只是证据。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var n = 14;
            var bw = (w - 80) / n;
            for (var i = 0; i < n; i++) {
              var active = i === 6 || i === 7 || i === 8 || i === 9;
              k.box(40 + i * bw, h / 2 - 26, bw - 4, 52, {
                fill: active ? "rgba(8,145,178,0.22)" : "#eef2f7",
                stroke: active ? "#0e7490" : "#cbd5e1",
                lw: 1.4,
                r: 4
              });
            }
            k.label(w / 2, h / 2 - 52, s("samples s₁ … sₙ", "采样 s₁ … sₙ"), { align: "center", size: 11, mono: true, color: "#565d75" });
            k.label(w / 2, h / 2 + 54, s("the shaded run is the gesture the segmenter has to find", "阴影部分是分割器必须找出的那次手势"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("2. Segmentation", "2. 分割"),
          caption: s(
            "The window W = ⟨sᵢ … sⱼ⟩ is chosen. This is the deck's first challenge — determining when a gesture starts and stops — and every later stage inherits its mistakes.",
            "选定窗口 W = ⟨sᵢ … sⱼ⟩。这是讲义列出的第一项挑战——确定手势从何时开始、到何时结束——而后续每个阶段都会继承它的错误。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var n = 14;
            var bw = (w - 80) / n;
            for (var i = 0; i < n; i++) {
              var active = i >= 6 && i <= 9;
              k.box(40 + i * bw, h / 2 - 26, bw - 4, 52, {
                fill: active ? "rgba(8,145,178,0.22)" : "#eef2f7",
                stroke: active ? "#0e7490" : "#cbd5e1",
                lw: 1.4,
                r: 4
              });
            }
            k.highlight(40 + 6 * bw - 4, h / 2 - 36, 4 * bw + 4, 72, {});
            k.label(40 + 6 * bw, h / 2 - 58, "i", { size: 11, mono: true, color: "#0e7490" });
            k.label(40 + 10 * bw - 8, h / 2 - 58, "j", { size: 11, mono: true, color: "#0e7490", align: "right" });
            k.label(w / 2, h / 2 + 62, s("too wide includes the previous gesture; too narrow loses the onset", "过宽会把上一个手势包含进来；过窄会丢失起始段"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("3. Features", "3. 特征"),
          caption: s(
            "The window becomes a description φ(W): joint angles, a velocity profile, contact geometry. Good features separate the whole gesture set; poor features make an easy problem hard.",
            "窗口变成一种描述 φ(W)：关节角度、速度曲线、接触几何。好的特征能区分整个手势集合；差的特征会把简单问题变难。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var x0 = 70;
            var y0 = h / 2 + 40;
            var bw = (w - 140) / 20;
            var vals = [0.1, 0.14, 0.3, 0.62, 0.86, 0.74, 0.44, 0.2, 0.12, 0.1, 0.1, 0.14, 0.5, 0.9, 0.98, 0.7, 0.32, 0.16, 0.1, 0.1];
            vals.forEach(function (v, i) {
              k.box(x0 + i * bw, y0 - v * 90, bw - 3, v * 90, { fill: "rgba(124,58,237,0.22)", stroke: "#7c3aed", lw: 1.2, r: 3 });
            });
            k.arrow(x0 - 16, y0, x0 + 20 * bw, y0, { color: "#cbd5e1", lw: 1.4 });
            k.label(x0, y0 + 26, s("time →", "时间 →"), { size: 10, mono: true, color: "#565d75" });
            k.label(w / 2, 30, "φ(W) ∈ ℝᵈ", { align: "center", size: 13, mono: true, color: "#7c3aed" });
            k.label(w / 2, y0 + 50, s("a template is compared against this curve, not against the raw frames", "与模板比较的是这条曲线，而不是原始帧"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("4. Classification, with a reject option", "4. 分类，并带拒绝选项"),
          caption: s(
            "The classifier returns a label and a confidence. If the confidence is below the threshold τ the system abstains. A recogniser with no abstain option maps every unintended movement onto the nearest label — the standard reason gesture interfaces feel haunted.",
            "分类器返回标签与置信度。若置信度低于阈值 τ，系统弃权。没有弃权选项的识别器会把每一次无意的动作映射到最近的标签——这正是手势界面“闹鬼”的常见原因。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var rows = [
              [s("wave", "挥手"), 0.31],
              [s("swipe", "滑动"), 0.86],
              [s("pinch", "捏合"), 0.12],
              [s("point", "指向"), 0.08]
            ];
            var barW = w - 260;
            rows.forEach(function (r, i) {
              var y = 42 + i * 38;
              k.label(24, y, r[0], { size: 11.5, color: r[1] >= 0.5 ? "#0e7490" : "#565d75" });
              k.bar(170, y - 9, barW, 18, r[1], { max: 1, fill: r[1] >= 0.5 ? "#0891b2" : "#cbd5e1" });
              k.label(170 + barW + 12, y, r[1].toFixed(2), { size: 10.5, mono: true, color: "#565d75" });
            });
            var tauX = 170 + barW * 0.5;
            k.arrow(tauX, 20, tauX, h - 34, { color: "#dc2626", lw: 1.6, dash: [5, 4] });
            k.label(tauX + 8, 20, "τ = 0.50", { size: 10.5, mono: true, color: "#dc2626" });
            k.label(w / 2, h - 14, s("act if and only if P(ĝ | φ(W)) ≥ τ", "当且仅当 P(ĝ | φ(W)) ≥ τ 时行动"), {
              align: "center",
              size: 11,
              mono: true,
              color: "#565d75"
            });
          }
        },
        {
          title: s("5. Feedback", "5. 反馈"),
          caption: s(
            "The user is told the gesture was seen, before the action lands. Without it, a correctly recognised gesture and a missed one look identical — which is exactly the deck's question: how can we make sure the gesture is correct?",
            "在动作生效之前，先告诉用户手势已被看到。没有它，被正确识别的手势与被漏掉的手势看起来完全一样——这正是讲义的那个问题：我们如何确保手势是正确的？"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            k.box(cx - 150, cy - 40, 300, 80, { fill: "#eef2f7", stroke: "#cbd5e1", lw: 1.4, r: 10 });
            k.dot(cx - 96, cy, 22, { fill: "rgba(5,150,105,0.18)", stroke: "#059669", lw: 2 });
            k.label(cx - 96, cy, "✓", { align: "center", size: 18, color: "#059669" });
            k.label(cx - 62, cy - 10, s("recognised: swipe", "已识别：滑动"), { size: 12, color: "#0e7490" });
            k.label(cx - 62, cy + 12, s("action commits in 200 ms", "动作将在 200 ms 后生效"), { size: 10.5, color: "#565d75" });
            k.arrow(cx - 96, cy + 34, cx + 110, cy + 34, { color: "#94a3b8", lw: 1.4, dash: [5, 4] });
            k.label(cx, cy + 58, s("a visible window between recognition and action", "在识别与动作之间保留一个可见的窗口"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        }
      ]
    };
  }

  /* ── Stepper 4: elicitation and agreement ─────────────────── */

  function guessabilityCfg() {
    var zh = currentLang() === "zh";
    function s(en, cn) {
      return zh ? cn : en;
    }

    return {
      title: s("Guessability: measuring which gesture users invent", "可猜性：测量用户会发明出哪个手势"),
      subtitle: s(
        "Show the effect, collect the proposals, count the agreement.",
        "展示效果、收集提议、统计一致性。"
      ),
      height: 250,
      frames: [
        {
          title: s("Before: show the effect, not the gesture", "研究之前：展示效果，而不是手势"),
          caption: s(
            "Each command is described by what it does — \"move to the next track\". Participants are not shown a candidate gesture, because showing one would measure imitation rather than intuition.",
            "每条命令都用它做什么来描述——“切到下一首”。参与者不会看到任何候选手势，因为一旦展示就变成了测量模仿，而不是测量直觉。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 - 6;
            k.box(cx - 170, cy - 44, 340, 88, { fill: "#eef2f7", stroke: "#cbd5e1", lw: 1.4, r: 10 });
            k.label(cx, cy - 20, s('command: "next track"', "命令：“下一首”"), { align: "center", size: 12, color: "#0e7490" });
            k.label(cx, cy + 6, s("effect shown; gesture withheld", "只展示效果；不展示手势"), { align: "center", size: 11, color: "#565d75" });
            k.dot(cx - 140, cy, 12, { fill: "rgba(245,158,11,0.25)", stroke: "#b45309", lw: 1.6 });
            k.label(cx - 140, cy, "?", { align: "center", size: 12, color: "#b45309" });
            k.label(cx, h - 18, s("the participant supplies the mapping", "映射由参与者提供"), { align: "center", size: 11, color: "#565d75" });
          }
        },
        {
          title: s("After: pool every proposal", "研究之后：汇总每一个提议"),
          caption: s(
            "Twenty participants each produce one gesture for the same command. What matters is not any single answer but how the answers are distributed.",
            "二十位参与者为同一条命令各做出一个手势。重要的不是任何单独答案，而是答案的分布。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 + 4;
            for (var i = 0; i < 20; i++) {
              var angle = (i / 20) * Math.PI * 2;
              var x = cx + Math.cos(angle) * Math.min(w * 0.3, 150);
              var y = cy + Math.sin(angle) * 74;
              k.dot(x, y, 9, { fill: "rgba(8,145,178,0.2)", stroke: "#0e7490", lw: 1.4 });
              k.label(x, y, String(i + 1), { align: "center", size: 8.5, mono: true, color: "#0e7490" });
            }
            k.box(cx - 56, cy - 22, 112, 44, { fill: "#ffffff", stroke: "#0e7490", lw: 1.8, r: 8 });
            k.label(cx, cy, s("one command", "一条命令"), { align: "center", size: 11, color: "#0e7490" });
            k.label(cx, h - 16, s("20 participants, 20 proposals — now count them", "20 位参与者，20 个提议——现在去统计它们"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("High agreement: keep the gesture", "一致性高：保留该手势"),
          caption: s(
            "When most participants converge on the same movement, that movement is the intuitive gesture for the command. It is also the one users are most likely to remember without being taught.",
            "当多数参与者收敛到同一个动作时，这个动作就是该命令的直觉手势。它也是用户最可能在不被教授的情况下记住的那一个。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var barW = w - 280;
            var rows = [
              [s("same gesture", "同一个手势"), 0.75],
              [s("variant", "变体"), 0.15],
              [s("other", "其他"), 0.1]
            ];
            rows.forEach(function (r, i) {
              var y = 60 + i * 46;
              k.label(24, y, r[0], { size: 11.5, color: "#565d75" });
              k.bar(190, y - 11, barW, 22, r[1], { max: 1, fill: i === 0 ? "#059669" : "#cbd5e1" });
              k.label(190 + barW + 12, y, Math.round(r[1] * 100) + "%", { size: 10.5, mono: true, color: "#565d75" });
            });
            k.label(w / 2, 30, s("agreement is high", "一致性高"), { align: "center", size: 13, color: "#059669" });
            k.label(w / 2, h - 16, s("candidate gesture for this command", "该命令的候选手势"), { align: "center", size: 11, color: "#565d75" });
          }
        },
        {
          title: s("Low agreement: give the command a control", "一致性低：给这条命令一个控件"),
          caption: s(
            "Eleven different proposals from twenty participants is not a failure of the study — it is the study's finding. The command has no intuitive gesture, so it needs a visible affordance or an explicitly taught shortcut.",
            "二十位参与者给出十一种不同提议，并不是研究失败——这正是研究的发现。这条命令没有直觉手势，因此它需要一个可见的操作入口，或一条被明确教授的快捷方式。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var barW = w - 280;
            var rows = [
              [s("gesture A", "手势 A"), 0.2],
              [s("gesture B", "手势 B"), 0.18],
              [s("gesture C", "手势 C"), 0.15],
              [s("other eight", "另外八种"), 0.47]
            ];
            rows.forEach(function (r, i) {
              var y = 42 + i * 38;
              k.label(24, y, r[0], { size: 11.5, color: "#565d75" });
              k.bar(190, y - 9, barW, 18, r[1], { max: 1, fill: "#f59e0b" });
              k.label(190 + barW + 12, y, Math.round(r[1] * 100) + "%", { size: 10.5, mono: true, color: "#565d75" });
            });
            k.arrow(190 + barW * 0.5, 22, 190 + barW * 0.5, h - 34, { color: "#dc2626", lw: 1.6, dash: [5, 4] });
            k.label(w / 2, h - 14, s("no winner: fall back to a visible control", "没有胜出者：退回可见控件"), {
              align: "center",
              size: 11,
              color: "#b45309"
            });
          }
        }
      ]
    };
  }

  /* ── Stepper 5: the costs that end deployments ────────────── */

  function gestureCostCfg() {
    var zh = currentLang() === "zh";
    function s(en, cn) {
      return zh ? cn : en;
    }

    return {
      title: s("Why gesture systems get abandoned", "手势系统为什么会被弃用"),
      subtitle: s(
        "Technical success is not the same as continued use.",
        "技术上的成功并不等于被持续使用。"
      ),
      height: 240,
      frames: [
        {
          title: s("Gorilla arms", "大猩猩手臂"),
          caption: s(
            "Mid-air gestures are performed against gravity. The cost is invisible in a single demonstration and decisive after the fiftieth repetition, which is why the fatigue budget belongs in the gesture set, not in the usability test.",
            "空中手势要抗重力完成。这种代价在单次演示中看不见，却会在第五十次重复后起决定作用——因此疲劳预算应当写进手势集合的设计里，而不是留给可用性测试去发现。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var y0 = h * 0.72;
            var levels = [
              [s("shoulder height", "肩高"), 0.9, "#dc2626"],
              [s("elbow height", "肘高"), 0.55, "#f59e0b"],
              [s("wrist, at rest", "腕部，放松"), 0.2, "#059669"]
            ];
            levels.forEach(function (lv, i) {
              var x = 60 + i * ((w - 140) / 3);
              k.box(x, y0 - lv[1] * 110, 64, lv[1] * 110, { fill: "rgba(8,145,178,0.10)", stroke: lv[2], lw: 1.8, r: 8 });
              k.label(x + 32, y0 - lv[1] * 110 - 16, lv[0], { align: "center", size: 10.5, color: "#565d75" });
            });
            k.arrow(40, y0, w - 40, y0, { color: "#cbd5e1", lw: 1.4 });
            k.label(46, y0 + 20, s("arm elevation — and therefore how long the gesture can be repeated", "抬臂高度——也就是该手势能被重复多久"), {
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("Encumbrance", "穿戴负担"),
          caption: s(
            "Intrinsic tracking means wearing something, and worn sensors have to be charged, donned, tolerated and remembered. Every worn unit is a reason the system is left at home.",
            "自身感知意味着必须穿戴东西，而可穿戴传感器需要充电、穿戴、被接受并被记住。每多一个佩戴单元，就多一个把系统留在家里的理由。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2;
            var units = [
              [s("headset", "头戴"), 0.25],
              [s("chest strap", "胸带"), 0.5],
              [s("two wristbands", "两只腕带"), 0.72],
              [s("phone in pocket", "口袋里已有的手机"), 0.94]
            ];
            units.forEach(function (u, i) {
              var y = 46 + i * 40;
              k.label(24, y, u[0], { size: 11.5, color: "#565d75" });
              k.bar(210, y - 9, w - 320, 18, u[1], { max: 1, fill: u[1] > 0.8 ? "#059669" : "#f59e0b" });
              k.label(210 + (w - 320) + 12, y, u[1] > 0.8 ? s("already carried", "本就随身") : s("added burden", "新增负担"), {
                size: 10,
                mono: true,
                color: u[1] > 0.8 ? "#059669" : "#b45309"
              });
            });
            k.label(w / 2, h - 14, s("the best wearable is the one the user was carrying anyway", "最好的可穿戴设备，是用户本来就在携带的那一个"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("Social acceptability", "社会可接受性"),
          caption: s(
            "A gesture is visible to everyone nearby while its meaning is visible only to the user. What is comfortable in a living room can be unacceptable on a train — the same interaction, a different audience.",
            "手势对周围所有人都可见，而它的含义只对用户可见。在客厅里舒服的手势，在火车上可能无法接受——同样的交互，不同的观众。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2;
            k.box(26, cy - 70, w * 0.36, 140, { fill: "rgba(5,150,105,0.07)", stroke: "#059669", lw: 1.8, r: 10 });
            k.label(26 + w * 0.18, cy - 50, s("at home", "在家"), { align: "center", size: 11.5, color: "#059669" });
            k.label(26 + w * 0.18, cy - 20, s("large, expressive gestures", "幅度大、表现力强的手势"), { align: "center", size: 11, color: "#565d75" });
            k.label(26 + w * 0.18, cy + 6, s("audience: people who know you", "观众：认识你的人"), { align: "center", size: 10.5, color: "#565d75" });

            k.box(w * 0.5, cy - 70, w * 0.44, 140, { fill: "rgba(220,38,38,0.06)", stroke: "#dc2626", lw: 1.8, r: 10 });
            k.label(w * 0.72, cy - 50, s("in public", "在公共场合"), { align: "center", size: 11.5, color: "#b91c1c" });
            k.label(w * 0.72, cy - 20, s("small, quiet, low gestures", "幅度小、安静、低位的手势"), { align: "center", size: 11, color: "#565d75" });
            k.label(w * 0.72, cy + 6, s("audience: strangers, no context", "观众：陌生人，没有语境"), { align: "center", size: 10.5, color: "#565d75" });

            k.label(w / 2, h - 16, s("the same gesture set cannot serve both without a low-effort variant", "同一套手势若没有低代价的变体，就无法同时服务这两种场合"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: s("The user-side list, in one frame", "把用户一侧的清单放在一帧里"),
          caption: s(
            "Discoverability, learnability, ambiguity, feedback, fatigue, encumbrance and social acceptability. A system can track perfectly, classify perfectly, and still be put down within a week.",
            "可发现性、可学习性、歧义、反馈、疲劳、穿戴负担与社会可接受性。一个系统可以跟踪完美、分类完美，却依然在一周内被放下。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(24, 24, w - 48, h - 48, { stroke: "#0e7490", lw: 1.8, r: 12 });
            var items = [
              s("discoverability", "可发现性"),
              s("learnability", "可学习性"),
              s("ambiguity", "歧义"),
              s("feedback", "反馈"),
              s("fatigue", "疲劳"),
              s("encumbrance", "穿戴负担"),
              s("social acceptability", "社会可接受性")
            ];
            items.forEach(function (label, i) {
              var col = i % 2;
              var row = Math.floor(i / 2);
              var x = 56 + col * ((w - 120) / 2);
              var y = 60 + row * 44;
              k.box(x, y - 15, (w - 140) / 2, 30, { fill: "rgba(245,158,11,0.10)", stroke: "#f59e0b", lw: 1.4, r: 6 });
              k.label(x + 12, y, label, { size: 11.5, color: "#b45309" });
            });
            k.label(w / 2, h - 34, s("none of these is fixed by a better classifier", "这些问题没有一个能靠更好的分类器解决"), {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        }
      ]
    };
  }

  /* ── Foundations page: race + drift stepper ─────────────────── */

  function mountChapter6MathWidgets() {
    var mocap = document.getElementById("ix-mocap-race");
    if (mocap && window.Interactive && window.Interactive.race && mocap.dataset.ixBuilt !== currentLang()) {
      while (mocap.firstChild) mocap.removeChild(mocap.firstChild);
      mocap.dataset.ixBuilt = currentLang();
      window.Interactive.race("ix-mocap-race", mocapRaceCfg());
    }
    buildStepper("ix-drift", driftCfg());
  }

  function mocapRaceCfg() {
    var zh = currentLang() === "zh";
    function s(en, cn) {
      return zh ? cn : en;
    }
    return {
      title: s(
        "What each sensing family is good at",
        "两种感知方式各自擅长什么"
      ),
      subtitle: s(
        "Illustrative 0–5 capability scores derived from the deck's list of mocap criteria. A revision aid, not measured data.",
        "依据讲义动捕判据清单给出的 0–5 示意性能力评分。仅作复习辅助，并非实测数据。"
      ),
      max: 5,
      rows: [
        { name: s("Body configuration", "身体构型"), value: 5, display: s("extrinsic 5 · intrinsic 2", "外部 5 · 自身 2") },
        { name: s("Hand configuration", "手部构型"), value: 4, display: s("extrinsic 4 · intrinsic 3", "外部 4 · 自身 3") },
        { name: s("Orientation", "姿态"), value: 4, display: s("extrinsic 4 · intrinsic 5", "外部 4 · 自身 5") },
        { name: s("Microgesture resolution", "微手势分辨率"), value: 5, display: s("extrinsic 1 · intrinsic 5", "外部 1 · 自身 5") },
        { name: s("Absolute position (no drift)", "绝对位置（无漂移）"), value: 5, display: s("extrinsic 5 · intrinsic 1", "外部 5 · 自身 1") },
        { name: s("Mobility / unbounded volume", "可移动性／体积无限"), value: 5, display: s("extrinsic 1 · intrinsic 5", "外部 1 · 自身 5") },
        { name: s("No worn hardware", "无需穿戴硬件"), value: 5, display: s("extrinsic 5 · intrinsic 1", "外部 5 · 自身 1") },
        { name: s("Setup and calibration cost (inverted)", "布置与标定成本（已反向计分）"), value: 3, display: s("extrinsic 2 · intrinsic 3", "外部 2 · 自身 3") }
      ]
    };
  }

  function driftCfg() {
    var zh = currentLang() === "zh";
    function s(en, cn) {
      return zh ? cn : en;
    }

    return {
      title: s("Drift: acceleration survives, position does not", "漂移：加速度活下来，位置不行"),
      subtitle: s(
        "A constant accelerometer bias b, integrated once and twice.",
        "一个恒定的加速度计偏置 b，被积分一次与两次。"
      ),
      height: 250,
      frames: [
        {
          title: s("The bias itself", "偏置本身"),
          caption: s(
            "The accelerometer reports the true acceleration plus a small constant bias. At this stage the error does not grow at all — it is simply an offset.",
            "加速度计报告真实加速度加上一个微小恒定偏置。在这一阶段误差完全不增长——它只是一个偏移。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var y0 = h / 2 + 30;
            k.arrow(50, y0, w - 30, y0, { color: "#cbd5e1", lw: 1.4 });
            k.arrow(50, y0, 50, 36, { color: "#cbd5e1", lw: 1.4 });
            k.label(56, 30, "a", { size: 12, mono: true, color: "#565d75" });
            k.label(w - 34, y0 + 20, "t", { size: 12, mono: true, color: "#565d75" });
            var path = [];
            for (var i = 0; i <= 40; i++) path.push([50 + i * ((w - 90) / 40), y0 - 40]);
            path.forEach(function (p, i) {
              if (i === 0) return;
              k.arrow(path[i - 1][0], path[i - 1][1], p[0], p[1], { color: "#0891b2", lw: 2 });
            });
            k.label(w / 2, 56, s("a = a* + b  →  constant offset", "a = a* + b  →  恒定偏移"), { align: "center", size: 12, mono: true, color: "#0e7490" });
            k.label(w / 2, h - 16, s("error growth: none", "误差增长：无"), { align: "center", size: 11, color: "#565d75" });
          }
        },
        {
          title: s("Integrated once: velocity", "积分一次：速度"),
          caption: s(
            "εᵥ(t) ≈ b·t. The bias becomes a ramp, so an accelerometer that is wrong by a tiny constant is wrong by an ever-growing amount once you ask it for velocity.",
            "εᵥ(t) ≈ b·t。偏置变成一条斜坡，因此一个只有极小恒定误差的加速度计，一旦被要求给出速度，就会以不断增长的幅度出错。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var y0 = h / 2 + 40;
            k.arrow(50, y0, w - 30, y0, { color: "#cbd5e1", lw: 1.4 });
            k.arrow(50, y0, 50, 36, { color: "#cbd5e1", lw: 1.4 });
            k.label(56, 30, "v", { size: 12, mono: true, color: "#565d75" });
            k.label(w - 34, y0 + 20, "t", { size: 12, mono: true, color: "#565d75" });
            var steps = 40;
            for (var i = 1; i <= steps; i++) {
              var x1 = 50 + (i - 1) * ((w - 90) / steps);
              var x2 = 50 + i * ((w - 90) / steps);
              var y1 = y0 - ((i - 1) / steps) * (h * 0.55);
              var y2 = y0 - (i / steps) * (h * 0.55);
              k.arrow(x1, y1, x2, y2, { color: "#f59e0b", lw: 2 });
            }
            k.label(w / 2, 52, "εᵥ(t) ≈ b · t", { align: "center", size: 13, mono: true, color: "#b45309" });
            k.label(w / 2, h - 16, s("error growth: linear", "误差增长：线性"), { align: "center", size: 11, color: "#565d75" });
          }
        },
        {
          title: s("Integrated twice: position", "积分两次：位置"),
          caption: s(
            "ε_p(t) ≈ ½·b·t². This is the quantity the deck's drift diagram marks most heavily, and the reason an inertial system cannot hold an absolute position for long — a millimetre-scale bias becomes metres within minutes.",
            "ε_p(t) ≈ ½·b·t²。这正是讲义漂移示意图中标注最重的量，也是惯性系统无法长时间维持绝对位置的原因——毫米级偏置在几分钟内就会变成米级误差。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var y0 = h / 2 + 44;
            k.arrow(50, y0, w - 30, y0, { color: "#cbd5e1", lw: 1.4 });
            k.arrow(50, y0, 50, 30, { color: "#cbd5e1", lw: 1.4 });
            k.label(56, 24, "p", { size: 12, mono: true, color: "#565d75" });
            k.label(w - 34, y0 + 20, "t", { size: 12, mono: true, color: "#565d75" });
            var steps = 40;
            for (var i = 1; i <= steps; i++) {
              var f1 = Math.pow((i - 1) / steps, 2);
              var f2 = Math.pow(i / steps, 2);
              var x1 = 50 + (i - 1) * ((w - 90) / steps);
              var x2 = 50 + i * ((w - 90) / steps);
              k.arrow(x1, y0 - f1 * (h * 0.62), x2, y0 - f2 * (h * 0.62), { color: "#dc2626", lw: 2.2 });
            }
            k.label(w / 2, 46, "ε_p(t) ≈ ½ · b · t²", { align: "center", size: 13, mono: true, color: "#b91c1c" });
            k.label(w / 2, h - 16, s("error growth: quadratic", "误差增长：二次"), { align: "center", size: 11, color: "#565d75" });
          }
        },
        {
          title: s("The same bias, three fates", "同一个偏置，三种命运"),
          caption: s(
            "Acceleration carries a constant offset, velocity a linear ramp, position a parabola. A gesture window of a few hundred milliseconds is short enough that all three are negligible; an hour-long interaction is long enough that only acceleration is still usable.",
            "加速度承担恒定偏移，速度承担线性斜坡，位置承担抛物线。几百毫秒的手势窗口短到三者都可忽略；而长达一小时的交互则长到只有加速度仍然可用。"
          ),
          draw: function (ctx, w, h, k) {
            k.clear();
            var y0 = h - 52;
            var x0 = 56;
            var spanX = w - 110;
            var spanY = h - 110;
            k.arrow(x0, y0, x0 + spanX, y0, { color: "#cbd5e1", lw: 1.4 });
            k.arrow(x0, y0, x0, 34, { color: "#cbd5e1", lw: 1.4 });
            k.label(x0 + 6, 28, s("error ε", "误差 ε"), { size: 11, mono: true, color: "#565d75" });
            k.label(x0 + spanX - 6, y0 + 20, "t", { size: 11, mono: true, color: "#565d75", align: "right" });

            var steps = 36;
            for (var i = 1; i <= steps; i++) {
              var x1 = x0 + ((i - 1) / steps) * spanX;
              var x2 = x0 + (i / steps) * spanX;
              var t1 = (i - 1) / steps;
              var t2 = i / steps;
              k.arrow(x1, y0 - 0.10 * spanY, x2, y0 - 0.10 * spanY, { color: "#059669", lw: 2 });
              k.arrow(x1, y0 - t1 * 0.42 * spanY, x2, y0 - t2 * 0.42 * spanY, { color: "#f59e0b", lw: 2 });
              k.arrow(x1, y0 - t1 * t1 * 0.95 * spanY, x2, y0 - t2 * t2 * 0.95 * spanY, { color: "#dc2626", lw: 2 });
            }
            k.label(x0 + spanX * 0.62, y0 - 0.10 * spanY - 14, s("a (constant)", "a（恒定）"), { size: 11, color: "#059669" });
            k.label(x0 + spanX * 0.62, y0 - 0.42 * spanY * 0.72 - 12, s("v (linear)", "v（线性）"), { size: 11, color: "#b45309" });
            k.label(x0 + spanX * 0.34, y0 - 0.95 * spanY * 0.32 - 12, s("p (quadratic)", "p（二次）"), { size: 11, color: "#b91c1c" });
          }
        }
      ]
    };
  }

  /* Expose the imperative entry points for the foundations page. */
  window.initChapter6Steppers = initSteppers;
  window.mountChapter6MathWidgets = mountChapter6MathWidgets;
})();
