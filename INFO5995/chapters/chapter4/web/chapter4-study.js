(function () {
  "use strict";

  /* INFO5995 — Week 4 (chapter 4) page behaviour.
   *
   * The declarative widgets (matcher, race, deck, pipeline) are mounted by
   * shared/interactive.js from the JSON config blocks in the page. This file
   * owns the six animated canvas steppers and the re-binding that a language
   * swap requires.
   *
   * Design note: the section innerHTML is replaced wholesale by the language
   * toggle, so every canvas host is a brand-new node after a swap. Each
   * initialiser below is therefore idempotent and re-run on `langchange`.
   */

  var STEPS = {
    otp: null,
    streamBlock: null,
    aes: null,
    modes: null,
    keyspace: null,
    hash: null,
    birthday: null
  };

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's animations from mounting. */
    mountAll();
    initChrome();
    lastChromeLang = currentLang();
  });

  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    mountAll();
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

    /* The sidebar toggle lives outside every translated section, so its old
     * listener is dropped before the chrome re-binds. */
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
        window.console.error("[INFO5995 chapter 4] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared drawing vocabulary ──────────────────────────────── */

  var C = {
    ink: "#141826",
    muted: "#565d75",
    dim: "#7b829a",
    accent: "#059669",
    accentSoft: "#e7f6f1",
    accentLine: "#047857",
    blue: "#2563eb",
    blueSoft: "#e8eefc",
    purple: "#7c3aed",
    purpleSoft: "#f1ebfe",
    green: "#10b981",
    greenSoft: "#e6f8f1",
    yellow: "#f59e0b",
    yellowSoft: "#fdf3e0",
    red: "#dc2626",
    redSoft: "#fdeaea",
    line: "#94a3b8",
    track: "#e8edf3",
    mono: "'JetBrains Mono', monospace"
  };

  function bytes(line) {
    return line.split(/\s+/);
  }

  function cells(k, x, y, w, values, opts) {
    opts = opts || {};
    var bw = w / values.length;
    var pad = opts.pad == null ? 4 : opts.pad;
    values.forEach(function (v, i) {
      k.box(x + i * bw, y, bw - pad, opts.h || 30, {
        fill: opts.fill || "#ffffff",
        stroke: opts.stroke || C.line,
        lw: opts.lw || 1.2,
        r: 4
      });
      k.label(x + i * bw + (bw - pad) / 2, y + (opts.h || 30) / 2, v, {
        align: "center",
        baseline: "middle",
        size: opts.size || 11,
        mono: true,
        color: opts.color || C.ink
      });
    });
    return bw;
  }

  /* ── 1. One-time pad: XOR in both directions ────────────────── */

  function initOtp() {
    if (!window.Interactive || !document.getElementById("ix-otp")) return;
    STEPS.otp = window.Interactive.stepper("ix-otp", {
      title: "One-time pad: encrypt by XOR, decrypt by XOR",
      subtitle: "A random key, exactly as long as the message and used only once.",
      height: 300,
      intervalMs: 2400,
      frames: [
        {
          title: "The three ingredients",
          titleZh: "三样材料",
          caption: "A plaintext message M (eight bits here), a truly random one-time key K of the same length, and the rule C = M \u2295 K.",
          captionZh: "明文 M（此处为 8 位）、长度相同的真正随机一次性密钥 K，以及规则 C = M \u2295 K。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 40;
            var bw = Math.min(w - 80, 520);
            k.label(x, 40, "PLAINTEXT (M)", { size: 11, mono: true, color: C.muted });
            cells(k, x, 50, bw, ["1", "0", "1", "1", "0", "0", "1", "0"], { fill: C.blueSoft, stroke: C.blue, color: C.blue });
            k.label(x, 112, "ONE-TIME KEY (K)", { size: 11, mono: true, color: C.muted });
            cells(k, x, 122, bw, ["0", "1", "0", "1", "1", "0", "0", "1"], { fill: C.accentSoft, stroke: C.accent, color: C.accentLine });
            k.label(x, 184, "CIPHERTEXT (C) = M \u2295 K", { size: 11, mono: true, color: C.muted });
            cells(k, x, 194, bw, ["?", "?", "?", "?", "?", "?", "?", "?"], { fill: C.track, stroke: C.line, color: C.dim });
            k.label(x, 258, "one key bit per message bit \u2014 there is no compression and no shortcut", {
              size: 11,
              color: C.muted
            });
            k.label(x, 276, "a 1 GB message needs a fresh 1 GB key", { size: 11, color: C.muted });
          }
        },
        {
          title: "Bit by bit: C = M \u2295 K",
          titleZh: "逐位运算：C = M \u2295 K",
          caption: "XOR outputs 1 when the two bits differ. 1\u22950=1, 0\u22951=1, 1\u22951=0, 0\u22950=0 \u2014 so no key bit ever survives into the ciphertext.",
          captionZh: "两位不同时 XOR 输出 1：1\u22950=1、0\u22951=1、1\u22951=0、0\u22950=0——因此没有任何密钥位会原样出现在密文中。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 40;
            var bw = Math.min(w - 80, 520);
            var m = ["1", "0", "1", "1", "0", "0", "1", "0"];
            var key = ["0", "1", "0", "1", "1", "0", "0", "1"];
            var c = ["1", "1", "1", "0", "1", "0", "1", "1"];

            k.label(x, 34, "M", { size: 11, mono: true, color: C.blue });
            cells(k, x, 42, bw, m, { fill: C.blueSoft, stroke: C.blue, color: C.blue });
            k.label(x, 96, "K", { size: 11, mono: true, color: C.accentLine });
            cells(k, x, 104, bw, key, { fill: C.accentSoft, stroke: C.accent, color: C.accentLine });
            k.label(x, 158, "C", { size: 11, mono: true, color: C.purple });
            cells(k, x, 166, bw, c, { fill: C.purpleSoft, stroke: C.purple, color: C.purple });

            var step = bw / 8;
            [0, 1, 2].forEach(function (i) {
              k.arrow(x + i * step + step / 2 - 2, 78, x + i * step + step / 2 - 2, 100, { color: C.dim, lw: 1.2 });
              k.arrow(x + i * step + step / 2 - 2, 140, x + i * step + step / 2 - 2, 162, { color: C.dim, lw: 1.2 });
            });
            k.highlight(x + 2 * step, 42, step - 4, 154, { color: C.yellow, lw: 1.6, dash: [4, 4], r: 6 });
            k.label(x + 2 * step + (step - 4) / 2, 214, "1 \u2295 0 = 1", { align: "center", size: 10, mono: true, color: C.yellow });
            k.label(x, 246, "The key bit and the plaintext bit cannot both be recovered from C alone.", { size: 11, color: C.muted });
            k.label(x, 264, "For a truly random, never-reused K the ciphertext reveals nothing about M.", { size: 11, color: C.muted });
          }
        },
        {
          title: "Decryption is the same operation",
          titleZh: "解密是同一个运算",
          caption: "C \u2295 K = (M \u2295 K) \u2295 K = M, because XORing the same value twice cancels. This is the whole cipher.",
          captionZh: "C \u2295 K = (M \u2295 K) \u2295 K = M，因为同一个值 XOR 两次会相互抵消。整个密码就是这样。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 40;
            var bw = Math.min(w - 80, 520);
            var c = ["1", "1", "1", "0", "1", "0", "1", "1"];
            var key = ["0", "1", "0", "1", "1", "0", "0", "1"];
            var m = ["1", "0", "1", "1", "0", "0", "1", "0"];

            k.label(x, 34, "CIPHERTEXT (C)", { size: 11, mono: true, color: C.purple });
            cells(k, x, 42, bw, c, { fill: C.purpleSoft, stroke: C.purple, color: C.purple });
            k.label(x, 96, "SAME KEY (K)", { size: 11, mono: true, color: C.accentLine });
            cells(k, x, 104, bw, key, { fill: C.accentSoft, stroke: C.accent, color: C.accentLine });
            k.label(x, 158, "RECOVERED M", { size: 11, mono: true, color: C.blue });
            cells(k, x, 166, bw, m, { fill: C.blueSoft, stroke: C.blue, color: C.blue });
            k.highlight(x, 104, bw - 4, 92, { color: C.accent, lw: 1.6, dash: [5, 4], r: 8 });
            k.label(x, 226, "C \u2295 K = (M \u2295 K) \u2295 K = M", { size: 12, mono: true, color: C.accentLine });
            k.label(x, 258, "Reuse the key once and two ciphertexts XOR to M\u2081 \u2295 M\u2082 \u2014 the key cancels out.", { size: 11, color: C.red });
            k.label(x, 276, "That single failure is what motivates practical stream and block ciphers.", { size: 11, color: C.muted });
          }
        }
      ]
    });
  }

  /* ── 2. Stream cipher vs block cipher ───────────────────────── */

  function initStreamBlock() {
    if (!window.Interactive || !document.getElementById("ix-stream-vs-block")) return;
    STEPS.streamBlock = window.Interactive.stepper("ix-stream-vs-block", {
      title: "Two ways to handle the input",
      subtitle: "The distinction describes how the cipher processes data \u2014 not how strong the algorithm is.",
      height: 280,
      intervalMs: 2600,
      frames: [
        {
          title: "Stream cipher: a flowing sequence",
          titleZh: "\u6d41\u5bc6\u7801\uff1a\u8fde\u7eed\u7684\u5e8f\u5217",
          caption: "A short key plus a nonce seed a keystream generator. Each message bit is XORed with one keystream bit: C = M \u2295 keystream. Natural for continuous data; the deck's modern example is ChaCha20.",
          captionZh: "\u77ed\u5bc6\u94a5\u52a0\u4e0a nonce \u4f5c\u4e3a\u5bc6\u94a5\u6d41\u751f\u6210\u5668\u7684\u79cd\u5b50\u3002\u6bcf\u4e2a\u6d88\u606f\u4f4d\u4e0e\u4e00\u4e2a\u5bc6\u94a5\u6d41\u4f4d\u76f8 XOR\uff1aC = M \u2295 keystream\u3002\u9002\u5408\u8fde\u7eed\u6570\u636e\uff1b\u8bb2\u4e49\u4e2d\u7684\u73b0\u4ee3\u4f8b\u5b50\u662f ChaCha20\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 40;
            var bw = Math.min(w - 80, 540);
            k.box(x, 30, 150, 44, { fill: C.accentSoft, stroke: C.accent, lw: 1.6, r: 8 });
            k.label(x + 75, 52, "key + nonce", { align: "center", baseline: "middle", size: 11, color: C.accentLine });
            k.label(x + 150, 96, "keystream generator", { size: 10, mono: true, color: C.muted });
            k.arrow(x + 75, 76, x + 75, 108, { color: C.accent, lw: 1.6 });

            var bits = ["1", "0", "0", "1", "1", "0", "1", "1", "0", "0"];
            var stream = ["0", "1", "1", "0", "1", "1", "0", "1", "0", "1"];
            var out = ["1", "1", "1", "1", "0", "1", "1", "0", "0", "1"];
            k.label(x, 126, "keystream", { size: 10, mono: true, color: C.muted });
            cells(k, x, 134, bw, stream, { fill: C.accentSoft, stroke: C.accent, color: C.accentLine, h: 26, size: 10 });
            k.label(x, 178, "message M", { size: 10, mono: true, color: C.muted });
            cells(k, x, 186, bw, bits, { fill: C.blueSoft, stroke: C.blue, color: C.blue, h: 26, size: 10 });
            k.label(x, 230, "ciphertext C", { size: 10, mono: true, color: C.muted });
            cells(k, x, 238, bw, out, { fill: C.purpleSoft, stroke: C.purple, color: C.purple, h: 26, size: 10 });
            k.label(x + bw - 4, 96, "no block boundaries", { align: "right", size: 10, mono: true, color: C.dim });
          }
        },
        {
          title: "Block cipher: fixed-size blocks",
          titleZh: "\u5206\u7ec4\u5bc6\u7801\uff1a\u56fa\u5b9a\u5927\u5c0f\u7684\u5206\u7ec4",
          caption: "The message is cut into fixed blocks and the cipher maps each one to a same-size block. AES uses 128-bit blocks \u2014 16 bytes at a time.",
          captionZh: "\u6d88\u606f\u88ab\u5207\u6210\u56fa\u5b9a\u957f\u5ea6\u7684\u5206\u7ec4\uff0c\u5bc6\u7801\u5c06\u6bcf\u4e00\u5206\u7ec4\u6620\u5c04\u4e3a\u540c\u7b49\u5927\u5c0f\u7684\u5206\u7ec4\u3002AES \u4f7f\u7528 128 \u4f4d\u5206\u7ec4\u2014\u2014\u6bcf\u6b21 16 \u5b57\u8282\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 40;
            var bw = Math.min(w - 80, 520);
            var bw4 = bw / 4;
            var labels = ["M1", "M2", "M3", "M4"];
            labels.forEach(function (t, i) {
              k.box(x + i * bw4, 52, bw4 - 10, 52, { fill: C.blueSoft, stroke: C.blue, lw: 1.6, r: 8 });
              k.label(x + i * bw4 + (bw4 - 10) / 2, 70, t, { align: "center", size: 12, mono: true, color: C.blue });
              k.label(x + i * bw4 + (bw4 - 10) / 2, 90, "128 bits", { align: "center", size: 9, color: C.dim });
            });
            k.arrow(x + bw / 2, 112, x + bw / 2, 146, { color: C.accent, lw: 1.8 });
            k.label(x + bw / 2 + 10, 132, "AES block cipher + mode of operation", { size: 10, mono: true, color: C.accentLine });
            labels.forEach(function (t, i) {
              k.box(x + i * bw4, 152, bw4 - 10, 52, { fill: C.purpleSoft, stroke: C.purple, lw: 1.6, r: 8 });
              k.label(x + i * bw4 + (bw4 - 10) / 2, 170, "C" + (i + 1), { align: "center", size: 12, mono: true, color: C.purple });
              k.label(x + i * bw4 + (bw4 - 10) / 2, 190, "128 bits", { align: "center", size: 9, color: C.dim });
            });
            k.label(x, 234, "A block cipher alone handles exactly one block. Everything longer is the mode's job.", { size: 11, color: C.muted });
            k.label(x, 252, "Modern protocols use authenticated encryption, not a raw cipher by itself.", { size: 11, color: C.red });
          }
        }
      ]
    });
  }

  /* ── 3. AES: the round function, byte by byte ───────────────── */

  function stateGrid(k, x, y, rows, opts) {
    opts = opts || {};
    var cs = opts.cell || 46;
    var gap = 6;
    rows.forEach(function (row, r) {
      row.forEach(function (v, c) {
        var bx = x + c * (cs + gap);
        var by = y + r * (cs + gap);
        var tint = opts.tint ? opts.tint(r, c) : null;
        k.box(bx, by, cs, cs, {
          fill: tint || "#ffffff",
          stroke: opts.stroke || C.line,
          lw: 1.3,
          r: 6
        });
        k.label(bx + cs / 2, by + cs / 2, v, {
          align: "center",
          baseline: "middle",
          size: opts.size || 11,
          mono: true,
          color: opts.color || C.ink
        });
      });
    });
    return cs + gap;
  }

  function initAes() {
    if (!window.Interactive || !document.getElementById("ix-aes-round")) return;
    var start = [
      ["19", "3d", "e3", "be"],
      ["a0", "f4", "e2", "2b"],
      ["9a", "c6", "8d", "2a"],
      ["e9", "f8", "48", "08"]
    ];
    var afterSub = [
      ["d4", "27", "11", "ae"],
      ["e0", "bf", "98", "f1"],
      ["b8", "b4", "5d", "e5"],
      ["1e", "41", "52", "30"]
    ];
    var afterShift = [
      ["d4", "27", "11", "ae"],
      ["bf", "98", "f1", "e0"],
      ["5d", "e5", "b8", "b4"],
      ["30", "1e", "41", "52"]
    ];
    var afterMix = [
      ["04", "e0", "48", "28"],
      ["66", "cb", "f8", "06"],
      ["81", "19", "d3", "26"],
      ["e5", "9a", "7a", "4c"]
    ];
    var rowKeys = [
      ["a0", "88", "23", "2a"],
      ["fa", "54", "a3", "6c"],
      ["fe", "2c", "39", "76"],
      ["17", "b1", "39", "05"]
    ];

    STEPS.aes = window.Interactive.stepper("ix-aes-round", {
      title: "Inside one AES round",
      subtitle: "Four steps, the same order in every round, under a different round key each time.",
      height: 360,
      intervalMs: 2800,
      frames: [
        {
          title: "Start: the state is XORed with the round key",
          titleZh: "\u8d77\u70b9\uff1a\u72b6\u6001\u4e0e\u8f6e\u5bc6\u94a5\u76f8 XOR",
          caption: "The 16-byte state is arranged as a 4\u00d74 matrix, column by column. AddRoundKey XORs it with the round key produced by the key schedule \u2014 the only step in the round that touches the secret.",
          captionZh: "16 \u5b57\u8282\u7684\u72b6\u6001\u6309\u5217\u6392\u5217\u4e3a 4\u00d74 \u77e9\u9635\u3002AddRoundKey \u5c06\u5b83\u4e0e\u5bc6\u94a5\u8c03\u5ea6\u7b97\u6cd5\u4ea7\u751f\u7684\u8f6e\u5bc6\u94a5\u76f8 XOR\u2014\u2014\u8fd9\u662f\u6574\u8f6e\u4e2d\u552f\u4e00\u6d89\u53ca\u79d8\u5bc6\u7684\u6b65\u9aa4\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 46;
            var y = 76;
            k.label(x, 42, "STATE (16 bytes, before AddRoundKey)", { size: 11, mono: true, color: C.muted });
            stateGrid(k, x, y, start, { size: 11 });
            var gx = x + 4 * 52 + 70;
            k.label(gx, 42, "ROUND KEY", { size: 11, mono: true, color: C.accentLine });
            stateGrid(k, gx, y, rowKeys, { size: 11, tint: function () { return C.accentSoft; }, stroke: C.accent, color: C.accentLine });
            var outX = gx + 4 * 52 + 70;
            if (outX + 4 * 52 < w) {
              k.label(outX, 42, "AFTER XOR", { size: 11, mono: true, color: C.purple });
              stateGrid(k, outX, y, [
                ["b9", "b5", "c0", "94"],
                ["5a", "a0", "41", "47"],
                ["64", "ea", "b4", "5c"],
                ["fe", "49", "71", "0d"]
              ], { size: 11, tint: function () { return C.purpleSoft; }, stroke: C.purple, color: C.purple });
            }
            k.label(x, y + 4 * 52 + 26, "AddRoundKey is plain XOR \u2014 cheap, invertible, and the only key-dependent step.", { size: 11, color: C.muted });
            k.label(x, y + 4 * 52 + 46, "SubBytes, ShiftRows and MixColumns are fixed public operations.", { size: 11, color: C.muted });
          }
        },
        {
          title: "SubBytes: a fixed public substitution box",
          titleZh: "SubBytes\uff1a\u56fa\u5b9a\u4e14\u516c\u5f00\u7684\u66ff\u6362\u8868",
          caption: "Every byte is replaced by its entry in the same 16\u00d716 S-box that every AES implementation in the world uses. This is where the cipher gets its non-linearity.",
          captionZh: "\u6bcf\u4e2a\u5b57\u8282\u90fd\u88ab\u66ff\u6362\u4e3a\u5168\u4e16\u754c\u6bcf\u4e2a AES \u5b9e\u73b0\u90fd\u4f7f\u7528\u7684\u540c\u4e00\u5f20 16\u00d716 S \u76d2\u4e2d\u7684\u6761\u76ee\u3002\u5bc6\u7801\u7684\u975e\u7ebf\u6027\u6b63\u6765\u81ea\u6b64\u5904\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 46;
            var y = 76;
            k.label(x, 42, "BEFORE", { size: 11, mono: true, color: C.muted });
            stateGrid(k, x, y, start, { size: 11 });
            k.arrow(x + 4 * 52 + 8, y + 2 * 52, x + 4 * 52 + 56, y + 2 * 52, { color: C.yellow, lw: 2 });
            var gx = x + 4 * 52 + 74;
            k.label(gx, 42, "AFTER (S-box applied byte by byte)", { size: 11, mono: true, color: C.yellow });
            stateGrid(k, gx, y, afterSub, { size: 11, tint: function () { return C.yellowSoft; }, stroke: C.yellow, color: "#9a6408" });
            k.label(x, y + 4 * 52 + 26, "The S-box contains no secret. It is printed in FIPS 197.", { size: 11, color: C.muted });
            k.label(x, y + 4 * 52 + 46, "Non-linearity is what stops AES collapsing into a solvable linear system.", { size: 11, color: C.muted });
          }
        },
        {
          title: "ShiftRows: spread bytes across columns",
          titleZh: "ShiftRows\uff1a\u5c06\u5b57\u8282\u6269\u6563\u5230\u5404\u5217",
          caption: "Row r is rotated left by r bytes. Row 0 does not move; row 3 rotates by three. The rotation amount depends only on the row index \u2014 never on the key.",
          captionZh: "\u7b2c r \u884c\u5411\u5de6\u5faa\u73af\u79fb\u4f4d r \u4e2a\u5b57\u8282\u3002\u7b2c 0 \u884c\u4e0d\u52a8\uff0c\u7b2c 3 \u884c\u79fb\u4f4d 3 \u4e2a\u5b57\u8282\u3002\u79fb\u4f4d\u91cf\u53ea\u53d6\u51b3\u4e8e\u884c\u53f7\uff0c\u4e0e\u5bc6\u94a5\u65e0\u5173\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 46;
            var y = 76;
            k.label(x, 42, "BEFORE", { size: 11, mono: true, color: C.muted });
            stateGrid(k, x, y, afterSub, { size: 11 });
            var tints = [null, C.blueSoft, C.greenSoft, C.purpleSoft];
            tints.forEach(function (t, r) {
              if (!t) return;
              k.highlight(x - 3, y + r * 52 - 3, 4 * 52 - 0, 52, { color: C.line, lw: 1.2, dash: [4, 4], r: 8 });
            });
            k.arrow(x + 4 * 52 + 8, y + 2 * 52, x + 4 * 52 + 56, y + 2 * 52, { color: C.blue, lw: 2 });
            var gx = x + 4 * 52 + 74;
            k.label(gx, 42, "AFTER (row r rotated left by r)", { size: 11, mono: true, color: C.blue });
            stateGrid(k, gx, y, afterShift, { size: 11, tint: function () { return C.blueSoft; }, stroke: C.blue, color: C.blue });
            k.label(x, y + 4 * 52 + 26, "Row 0 \u2192 0, row 1 \u2192 1, row 2 \u2192 2, row 3 \u2192 3 bytes left.", { size: 11, mono: true, color: C.muted });
            k.label(x, y + 4 * 52 + 46, "Combined with MixColumns, one byte ends up influencing a whole column set.", { size: 11, color: C.muted });
          }
        },
        {
          title: "MixColumns: diffuse within each column",
          titleZh: "MixColumns\uff1a\u5728\u6bcf\u4e00\u5217\u5185\u6269\u6563",
          caption: "Each column is treated as a polynomial and multiplied by a fixed polynomial over GF(2\u2078). One changed byte now changes four.",
          captionZh: "\u6bcf\u4e00\u5217\u88ab\u89c6\u4e3a\u4e00\u4e2a\u591a\u9879\u5f0f\uff0c\u5e76\u5728 GF(2\u2078) \u4e0a\u4e58\u4ee5\u4e00\u4e2a\u56fa\u5b9a\u591a\u9879\u5f0f\u3002\u4e8e\u662f\u4e00\u4e2a\u5b57\u8282\u7684\u6539\u53d8\u4f1a\u5f71\u54cd\u56db\u4e2a\u5b57\u8282\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 46;
            var y = 76;
            k.label(x, 42, "AFTER ShiftRows", { size: 11, mono: true, color: C.muted });
            stateGrid(k, x, y, afterShift, { size: 11 });
            k.highlight(x - 4, y - 4, 52 + 4, 4 * 52 - 2, { color: C.green, lw: 2, r: 8 });
            k.label(x + 24, y + 4 * 52 + 16, "one column", { align: "center", size: 10, mono: true, color: C.green });
            k.arrow(x + 4 * 52 + 8, y + 2 * 52, x + 4 * 52 + 56, y + 2 * 52, { color: C.green, lw: 2 });
            var gx = x + 4 * 52 + 74;
            k.label(gx, 42, "AFTER MixColumns", { size: 11, mono: true, color: C.green });
            stateGrid(k, gx, y, afterMix, { size: 11, tint: function () { return C.greenSoft; }, stroke: C.green, color: C.accentLine });
            k.label(x, y + 4 * 52 + 44, "The final round omits MixColumns. Rounds: 10 for AES-128, 12 for AES-192, 14 for AES-256.", { size: 11, color: C.muted });
            k.label(x, y + 4 * 52 + 64, "After enough rounds, one plaintext bit changes about half the ciphertext bits.", { size: 11, color: C.muted });
          }
        }
      ]
    });
  }

  /* ── 4. Modes of operation: what the ciphertext reveals ─────── */

  function blockRow(k, x, y, tints, labels, opts) {
    opts = opts || {};
    var bw = opts.bw || 92;
    var gap = 12;
    labels.forEach(function (t, i) {
      k.box(x + i * (bw + gap), y, bw, opts.h || 46, {
        fill: tints[i] || "#ffffff",
        stroke: opts.stroke || C.line,
        lw: opts.lw || 1.4,
        r: 6
      });
      k.label(x + i * (bw + gap) + bw / 2, y + (opts.h || 46) / 2, t, {
        align: "center",
        baseline: "middle",
        size: opts.size || 11,
        mono: true,
        color: opts.color || C.ink
      });
    });
    return bw + gap;
  }

  function initModes() {
    if (!window.Interactive || !document.getElementById("ix-modes")) return;
    var P = ["ATTACK", "AT DAWN", "ATTACK", "AT DAWN"];
    STEPS.modes = window.Interactive.stepper("ix-modes", {
      title: "The same AES primitive, three very different modes",
      subtitle: "The mode decides what an observer of the ciphertext can learn.",
      height: 320,
      intervalMs: 3000,
      frames: [
        {
          title: "ECB \u2014 each block encrypted independently",
          titleZh: "ECB\u2014\u2014\u6bcf\u4e2a\u5206\u7ec4\u72ec\u7acb\u52a0\u5bc6",
          caption: "Identical plaintext blocks produce identical ciphertext blocks. The pattern of the message survives encryption: no key is needed to see that blocks 1 and 3 are the same, or that 2 and 4 are the same.",
          captionZh: "\u76f8\u540c\u7684\u660e\u6587\u5206\u7ec4\u4ea7\u751f\u76f8\u540c\u7684\u5bc6\u6587\u5206\u7ec4\u3002\u6d88\u606f\u7684\u7ed3\u6784\u5728\u52a0\u5bc6\u540e\u4f9d\u7136\u53ef\u89c1\uff1a\u65e0\u9700\u4efb\u4f55\u5bc6\u94a5\uff0c\u5c31\u80fd\u770b\u51fa\u7b2c 1 \u4e0e\u7b2c 3 \u5757\u76f8\u540c\u3001\u7b2c 2 \u4e0e\u7b2c 4 \u5757\u76f8\u540c\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 44;
            var pTint = [C.blueSoft, C.yellowSoft, C.blueSoft, C.yellowSoft];
            var cTint = [C.redSoft, "#f6e2e2", C.redSoft, "#f6e2e2"];
            k.label(x, 40, "PLAINTEXT BLOCKS", { size: 11, mono: true, color: C.muted });
            blockRow(k, x, 50, pTint, P, { stroke: C.blue, color: "#1e3a8a", bw: Math.min(96, (w - 120) / 4 - 12) });
            k.arrow(x + 40, 104, x + 40, 132, { color: C.dim, lw: 1.4, dash: [4, 4] });
            k.arrow(x + 150, 104, x + 150, 132, { color: C.dim, lw: 1.4, dash: [4, 4] });
            k.arrow(x + 260, 104, x + 260, 132, { color: C.dim, lw: 1.4, dash: [4, 4] });
            k.arrow(x + 370, 104, x + 370, 132, { color: C.dim, lw: 1.4, dash: [4, 4] });
            k.label(x, 124, "AES(K, \u00b7) applied to each block on its own", { size: 10, mono: true, color: C.muted });
            k.label(x, 152, "CIPHERTEXT BLOCKS", { size: 11, mono: true, color: C.muted });
            blockRow(k, x, 162, cTint, ["4F1C", "9A03", "4F1C", "9A03"], { stroke: C.red, color: C.red, bw: Math.min(96, (w - 120) / 4 - 12) });
            k.highlight(x - 4, 158, Math.min(96, (w - 120) / 4 - 12) + 4, 54, { color: C.red, lw: 1.6, r: 8 });
            k.label(x, 244, "Repeated plaintext \u2192 repeated ciphertext. Patterns remain visible.", { size: 11, color: C.red });
            k.label(x, 264, "ECB is the classic answer to \u201cwhich mode must never be used?\u201d", { size: 11, color: C.muted });
            k.label(x, 284, "It provides confidentiality only \u2014 and very little of it on structured data.", { size: 11, color: C.muted });
          }
        },
        {
          title: "CBC \u2014 each block depends on the previous one",
          titleZh: "CBC\u2014\u2014\u6bcf\u4e2a\u5206\u7ec4\u4f9d\u8d56\u524d\u4e00\u5206\u7ec4",
          caption: "The previous ciphertext block is XORed into the next plaintext block before encryption, so identical plaintext blocks encrypt differently and repeated patterns disappear. CBC still provides confidentiality only.",
          captionZh: "\u524d\u4e00\u4e2a\u5bc6\u6587\u5206\u7ec4\u5148\u4e0e\u4e0b\u4e00\u4e2a\u660e\u6587\u5206\u7ec4\u76f8 XOR \u518d\u52a0\u5bc6\uff0c\u56e0\u6b64\u76f8\u540c\u7684\u660e\u6587\u5206\u7ec4\u4f1a\u52a0\u5bc6\u6210\u4e0d\u540c\u7684\u7ed3\u679c\uff0c\u91cd\u590d\u7684\u6a21\u5f0f\u4e5f\u5c31\u6d88\u5931\u4e86\u3002CBC \u4ecd\u7136\u53ea\u63d0\u4f9b\u673a\u5bc6\u6027\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 44;
            var bw = Math.min(96, (w - 120) / 4 - 12);
            k.label(x, 40, "PLAINTEXT BLOCKS", { size: 11, mono: true, color: C.muted });
            blockRow(k, x, 50, [C.blueSoft, C.yellowSoft, C.blueSoft, C.yellowSoft], P, { stroke: C.blue, color: "#1e3a8a", bw: bw });
            k.label(x, 116, "IV", { size: 10, mono: true, color: C.accentLine });
            k.box(x - 30, 50, 24, 46, { fill: C.accentSoft, stroke: C.accent, lw: 1.4, r: 6 });
            k.arrow(x - 30, 96, x + 40, 126, { color: C.accent, lw: 1.4, dash: [4, 4] });
            k.label(x, 140, "CIPHERTEXT BLOCKS", { size: 11, mono: true, color: C.muted });
            blockRow(k, x, 150, [C.greenSoft, "#d9f2e6", "#cdeee0", "#e2f7ee"], ["A731", "5C9E", "0B44", "D182"], { stroke: C.green, color: C.accentLine, bw: bw });
            [0, 1, 2].forEach(function (i) {
              k.arrow(x + (i + 1) * (bw + 12) - 14, 173, x + (i + 2) * (bw + 12) - 8, 173, { color: C.accent, lw: 1.6 });
            });
            k.label(x, 232, "Same plaintext, different ciphertext \u2014 repeated patterns are hidden.", { size: 11, color: C.accentLine });
            k.label(x, 252, "The IV must be unpredictable for the first block; it is not a secret.", { size: 11, color: C.muted });
            k.label(x, 272, "CBC adds no integrity: authentication must be designed separately.", { size: 11, color: C.red });
          }
        },
        {
          title: "GCM \u2014 counter-based encryption plus a tag",
          titleZh: "GCM\u2014\u2014\u8ba1\u6570\u5668\u52a0\u5bc6\u52a0\u8ba4\u8bc1\u6807\u7b7e",
          caption: "A unique nonce drives a counter, so no two blocks ever encrypt the same way. One pass yields ciphertext C and an authentication tag T; the receiver releases plaintext only when T verifies.",
          captionZh: "\u552f\u4e00\u7684 nonce \u9a71\u52a8\u8ba1\u6570\u5668\uff0c\u56e0\u6b64\u4efb\u4f55\u4e24\u4e2a\u5206\u7ec4\u90fd\u4e0d\u4f1a\u4ee5\u76f8\u540c\u65b9\u5f0f\u52a0\u5bc6\u3002\u4e00\u6b21\u8fd0\u7b97\u540c\u65f6\u5f97\u5230\u5bc6\u6587 C \u4e0e\u8ba4\u8bc1\u6807\u7b7e T\uff1b\u53ea\u6709\u5f53 T \u9a8c\u8bc1\u901a\u8fc7\u65f6\uff0c\u63a5\u6536\u65b9\u624d\u4f1a\u8f93\u51fa\u660e\u6587\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 44;
            var bw = Math.min(96, (w - 120) / 4 - 12);
            k.box(x, 36, 200, 40, { fill: C.accentSoft, stroke: C.accent, lw: 1.4, r: 8 });
            k.label(x + 100, 56, "KEY K + UNIQUE NONCE N", { align: "center", baseline: "middle", size: 10, mono: true, color: C.accentLine });
            k.arrow(x + 100, 78, x + 100, 104, { color: C.accent, lw: 1.6 });
            k.label(x, 96, "counter blocks  N\u20161  N\u20162  N\u20163  N\u20164", { size: 10, mono: true, color: C.muted });
            blockRow(k, x, 112, [C.purpleSoft, C.purpleSoft, C.purpleSoft, C.purpleSoft], ["AES", "AES", "AES", "AES"], { stroke: C.purple, color: C.purple, bw: bw, h: 40 });
            k.label(x, 176, "CIPHERTEXT C (nonce-determined, never plaintext-determined)", { size: 11, mono: true, color: C.muted });
            blockRow(k, x, 186, [C.greenSoft, "#d9f2e6", "#cdeee0", "#e2f7ee"], ["71B0", "E4A2", "3F58", "C609"], { stroke: C.green, color: C.accentLine, bw: bw, h: 40 });
            k.box(x, 244, Math.min(w - 88, 420), 40, { fill: C.yellowSoft, stroke: C.yellow, lw: 1.6, r: 8 });
            k.label(x + Math.min(w - 88, 420) / 2, 264, "TAG T = authentication over the whole message", { align: "center", baseline: "middle", size: 10, mono: true, color: "#9a6408" });
            k.label(x, 300, "If C or T changes \u2192 verification fails \u2192 plaintext is rejected.", { size: 11, color: C.red });
          }
        }
      ]
    });
  }

  /* ── 5. Key length versus effective entropy ─────────────────── */

  function initKeySpace() {
    if (!window.Interactive || !document.getElementById("ix-key-space")) return;
    STEPS.keyspace = window.Interactive.stepper("ix-key-space", {
      title: "Length is not entropy",
      subtitle: "Entropy is the attacker's uncertainty before the key is generated.",
      height: 300,
      intervalMs: 3200,
      frames: [
        {
          title: "Key length sets the maximum search space",
          titleZh: "\u5bc6\u94a5\u957f\u5ea6\u51b3\u5b9a\u6700\u5927\u641c\u7d22\u7a7a\u95f4",
          caption: "An n-bit key has 2\u207f possible bit strings \u2014 if every string can really occur. Four bits is small enough to enumerate by hand; 128 bits is a vast candidate space.",
          captionZh: "\u4e00\u4e2a n \u4f4d\u5bc6\u94a5\u6709 2\u207f \u79cd\u53ef\u80fd\u7684\u4f4d\u4e32\u2014\u2014\u524d\u63d0\u662f\u6bcf\u4e00\u79cd\u4f4d\u4e32\u90fd\u771f\u7684\u53ef\u80fd\u51fa\u73b0\u30024 \u4f4d\u53ef\u4ee5\u624b\u5de5\u679a\u4e3e\uff0c128 \u4f4d\u5219\u662f\u5e9e\u5927\u7684\u5019\u9009\u7a7a\u95f4\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 44;
            var barW = Math.min(w - 120, 520);
            k.label(x, 44, "4-bit key", { size: 12, mono: true, color: C.muted });
            k.label(x, 64, "2\u2074 = 16 possibilities \u2014 small enough to enumerate", { size: 11, color: C.muted });
            k.box(x, 76, barW, 22, { fill: C.track, stroke: C.line, lw: 1, r: 6 });
            k.box(x, 76, 12, 22, { fill: C.yellow, stroke: C.yellow, lw: 1, r: 6 });
            k.label(x + barW + 10, 88, "16", { size: 11, mono: true, color: C.yellow, baseline: "middle" });

            k.label(x, 138, "128-bit key", { size: 12, mono: true, color: C.muted });
            k.label(x, 158, "2\u00b9\u00b2\u2078 \u2248 3.4 \u00d7 10\u00b3\u2078 possibilities \u2014 a vast candidate space", { size: 11, color: C.muted });
            k.box(x, 170, barW, 22, { fill: C.track, stroke: C.line, lw: 1, r: 6 });
            k.box(x, 170, barW, 22, { fill: C.green, stroke: C.accentLine, lw: 1, r: 6 });
            k.label(x + barW + 10, 182, "2\u00b9\u00b2\u2078", { size: 11, mono: true, color: C.accentLine, baseline: "middle" });

            k.label(x, 232, "Length helps only when generation and implementation preserve the full search space.", { size: 11, color: C.muted });
            k.label(x, 252, "This is the premise the next frame breaks.", { size: 11, color: C.muted });
          }
        },
        {
          title: "A human pattern inside a 128-bit field",
          titleZh: "128 \u4f4d\u5b57\u6bb5\u91cc\u7684\u4eba\u7c7b\u6a21\u5f0f",
          caption: "INFO5995-INFO5995! looks long, but it is built from a guessable rule. If only about 16 bits actually vary, the effective search is at most 2\u00b9\u2076 candidates \u2014 even though the field is 128 bits wide.",
          captionZh: "INFO5995-INFO5995! \u770b\u4f3c\u5f88\u957f\uff0c\u5374\u662f\u7531\u53ef\u731c\u6d4b\u7684\u89c4\u5219\u6784\u6210\u7684\u3002\u5982\u679c\u771f\u6b63\u53d8\u5316\u7684\u53ea\u6709\u7ea6 16 \u4f4d\uff0c\u90a3\u4e48\u5c3d\u7ba1\u5b57\u6bb5\u5bbd 128 \u4f4d\uff0c\u6709\u6548\u641c\u7d22\u7a7a\u95f4\u4e5f\u4e0d\u8d85\u8fc7 2\u00b9\u2076\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 44;
            var barW = Math.min(w - 120, 520);
            k.label(x, 40, "HUMAN PATTERN", { size: 11, mono: true, color: C.muted });
            k.box(x, 50, 250, 34, { fill: C.redSoft, stroke: C.red, lw: 1.4, r: 6 });
            k.label(x + 125, 67, "INFO5995-INFO5995!", { align: "center", baseline: "middle", size: 12, mono: true, color: C.red });
            k.label(x + 262, 67, "18 characters, about 16 bits of variation", { size: 10, mono: true, color: C.muted, baseline: "middle" });
            k.label(x, 116, "effective search space", { size: 11, color: C.muted });
            k.box(x, 128, barW, 22, { fill: C.track, stroke: C.line, lw: 1, r: 6 });
            k.box(x, 128, 22, 22, { fill: C.red, stroke: C.red, lw: 1, r: 6 });
            k.label(x + barW + 10, 140, "2\u00b9\u2076", { size: 11, mono: true, color: C.red, baseline: "middle" });

            k.label(x, 190, "CSPRNG OUTPUT", { size: 11, mono: true, color: C.muted });
            k.box(x, 200, 250, 34, { fill: C.greenSoft, stroke: C.green, lw: 1.4, r: 6 });
            k.label(x + 125, 217, "7f2a19c0b6e3d84a", { align: "center", baseline: "middle", size: 12, mono: true, color: C.accentLine });
            k.label(x + 262, 217, "64 bits shown; the rest follows", { size: 10, mono: true, color: C.muted, baseline: "middle" });
            k.label(x, 262, "LONG \u2260 STRONG. Generate keys from the operating system CSPRNG.", { size: 12, mono: true, color: C.accentLine });
          }
        }
      ]
    });
  }

  /* ── 6. Hash functions: fixed length, avalanche, limits ─────── */

  function initHash() {
    if (!window.Interactive || !document.getElementById("ix-hash")) return;
    STEPS.hash = window.Interactive.stepper("ix-hash", {
      title: "A cryptographic hash function in three pictures",
      subtitle: "Any input length in, a fixed-length fingerprint out.",
      height: 300,
      intervalMs: 3000,
      frames: [
        {
          title: "Compression: any length to a fixed length",
          titleZh: "\u538b\u7f29\uff1a\u4efb\u610f\u957f\u5ea6\u5230\u56fa\u5b9a\u957f\u5ea6",
          caption: "H(m) maps a message of arbitrary length to a fixed-length digest. Two different inputs of very different sizes produce outputs of exactly the same size.",
          captionZh: "H(m) \u5c06\u4efb\u610f\u957f\u5ea6\u7684\u6d88\u606f\u6620\u5c04\u4e3a\u56fa\u5b9a\u957f\u5ea6\u7684\u6458\u8981\u3002\u4e24\u4e2a\u5927\u5c0f\u76f8\u5dee\u60ac\u6b8a\u7684\u8f93\u5165\uff0c\u8f93\u51fa\u957f\u5ea6\u5b8c\u5168\u76f8\u540c\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 44;
            k.box(x, 34, 180, 30, { fill: C.blueSoft, stroke: C.blue, lw: 1.4, r: 6 });
            k.label(x + 90, 49, "\u201cHi\u201d", { align: "center", baseline: "middle", size: 12, mono: true, color: C.blue });
            k.box(x, 76, 180, 30, { fill: C.blueSoft, stroke: C.blue, lw: 1.4, r: 6 });
            k.label(x + 90, 91, "a 4 GB disk image", { align: "center", baseline: "middle", size: 11, mono: true, color: C.blue });
            k.arrow(x + 184, 49, x + 240, 70, { color: C.dim, lw: 1.4 });
            k.arrow(x + 184, 91, x + 240, 74, { color: C.dim, lw: 1.4 });
            k.box(x + 246, 52, 230, 40, { fill: C.accentSoft, stroke: C.accent, lw: 1.6, r: 8 });
            k.label(x + 361, 72, "SHA-256", { align: "center", baseline: "middle", size: 12, mono: true, color: C.accentLine });
            k.arrow(x + 361, 96, x + 361, 124, { color: C.accent, lw: 1.6 });
            k.box(x, 132, 476, 30, { fill: C.purpleSoft, stroke: C.purple, lw: 1.4, r: 6 });
            k.label(x + 238, 147, "256-bit digest \u2014 64 hex characters, both times", { align: "center", baseline: "middle", size: 10, mono: true, color: C.purple });
            k.label(x, 196, "Fixed size is what makes a digest comparable, storable and signable.", { size: 11, color: C.muted });
            k.label(x, 216, "It is also what makes collisions inevitable in principle: the input space is unbounded.", { size: 11, color: C.muted });
            k.label(x, 244, "Collision resistance: finding any two colliding messages costs about 2\u207f\u141f\u00b2 work.", { size: 11, mono: true, color: C.red });
            k.label(x, 264, "That birthday bound is why MD5 (128-bit) and SHA-1 (160-bit) are deprecated.", { size: 11, color: C.muted });
          }
        },
        {
          title: "Avalanche: one flipped bit changes the digest",
          titleZh: "\u96ea\u5d29\u6548\u5e94\uff1a\u7ffb\u8f6c\u4e00\u4f4d\uff0c\u6458\u8981\u5b8c\u5168\u6539\u53d8",
          caption: "Changing a single input bit changes roughly half of the output bits. Two messages that look almost identical produce digests with no visible relationship.",
          captionZh: "\u6539\u53d8\u8f93\u5165\u4e2d\u7684\u4e00\u4f4d\uff0c\u4f1a\u6539\u53d8\u8f93\u51fa\u4e2d\u7ea6\u4e00\u534a\u7684\u4f4d\u3002\u4e24\u4e2a\u770b\u4e0a\u53bb\u51e0\u4e4e\u76f8\u540c\u7684\u6d88\u606f\uff0c\u5176\u6458\u8981\u4e4b\u95f4\u6ca1\u6709\u4efb\u4f55\u53ef\u89c1\u5173\u7cfb\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 44;
            k.label(x, 34, "MESSAGE  A", { size: 11, mono: true, color: C.muted });
            k.box(x, 44, 300, 30, { fill: C.blueSoft, stroke: C.blue, lw: 1.4, r: 6 });
            k.label(x + 150, 59, "transfer $1000 to account 42", { align: "center", baseline: "middle", size: 11, mono: true, color: C.blue });
            k.label(x, 94, "MESSAGE  B \u2014 one character changed", { size: 11, mono: true, color: C.muted });
            k.box(x, 104, 300, 30, { fill: C.yellowSoft, stroke: C.yellow, lw: 1.4, r: 6 });
            k.label(x + 150, 119, "transfer $9000 to account 42", { align: "center", baseline: "middle", size: 11, mono: true, color: "#9a6408" });
            k.highlight(x + 96, 100, 24, 38, { color: C.red, lw: 2, r: 6 });
            k.arrow(x + 316, 74, x + 360, 96, { color: C.dim, lw: 1.4 });
            k.arrow(x + 316, 119, x + 360, 104, { color: C.dim, lw: 1.4 });

            k.box(x, 156, 476, 26, { fill: C.purpleSoft, stroke: C.purple, lw: 1.2, r: 5 });
            k.label(x + 238, 169, "4a7d 1f2b 9c03 e815 \u2026", { align: "center", baseline: "middle", size: 11, mono: true, color: C.purple });
            k.box(x, 194, 476, 26, { fill: C.purpleSoft, stroke: C.purple, lw: 1.2, r: 5 });
            k.label(x + 238, 207, "e29c 8b40 77af 1d63 \u2026", { align: "center", baseline: "middle", size: 11, mono: true, color: C.purple });
            k.label(x, 246, "No visible relationship \u2014 that is what detects a single altered bit.", { size: 11, color: C.muted });
            k.label(x, 266, "A digest is a fingerprint, not a lock: it hides nothing and cannot be reversed.", { size: 11, color: C.red });
          }
        },
        {
          title: "A bare hash is not integrity against an attacker",
          titleZh: "\u88f8\u54c8\u5e0c\u4e0d\u662f\u9762\u5411\u653b\u51fb\u8005\u7684\u5b8c\u6574\u6027",
          caption: "If the attacker can modify the data they can replace the message and its hash together. Integrity against an active attacker needs a MAC, a digital signature or an AEAD construction.",
          captionZh: "\u5982\u679c\u653b\u51fb\u8005\u80fd\u4fee\u6539\u6570\u636e\uff0c\u4ed6\u5c31\u80fd\u540c\u65f6\u66ff\u6362\u6d88\u606f\u4e0e\u5176\u54c8\u5e0c\u503c\u3002\u9762\u5bf9\u4e3b\u52a8\u653b\u51fb\u8005\u7684\u5b8c\u6574\u6027\u9700\u8981 MAC\u3001\u6570\u5b57\u7b7e\u540d\u6216 AEAD \u6784\u9020\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 44;
            k.label(x, 34, "WHAT THE ATTACKER DOES", { size: 11, mono: true, color: C.red });
            k.box(x, 46, 250, 34, { fill: C.redSoft, stroke: C.red, lw: 1.4, r: 6 });
            k.label(x + 125, 63, "new message M\u2032", { align: "center", baseline: "middle", size: 11, mono: true, color: C.red });
            k.box(x, 90, 250, 34, { fill: C.redSoft, stroke: C.red, lw: 1.4, r: 6 });
            k.label(x + 125, 107, "H(M\u2032) \u2014 recomputed", { align: "center", baseline: "middle", size: 11, mono: true, color: C.red });
            k.highlight(x - 4, 42, 258, 86, { color: C.red, lw: 1.6, r: 8 });
            k.label(x + 270, 63, "Both are replaced", { size: 11, mono: true, color: C.muted });
            k.label(x + 270, 107, "in the same request.", { size: 11, mono: true, color: C.muted });

            k.label(x, 152, "WHAT ACTUALLY STOPS THEM", { size: 11, mono: true, color: C.accentLine });
            k.box(x, 164, 476, 34, { fill: C.accentSoft, stroke: C.accent, lw: 1.6, r: 6 });
            k.label(x + 238, 181, "MAC \u2022 digital signature \u2022 AEAD \u2014 keyed or identity-bound", { align: "center", baseline: "middle", size: 11, mono: true, color: C.accentLine });
            k.label(x, 224, "A MAC needs a shared secret key; a signature needs a private key and an identity.", { size: 11, color: C.muted });
            k.label(x, 244, "A hash supplies neither \u2014 which is why it is listed with an asterisk in the deck.", { size: 11, color: C.muted });
            k.label(x, 272, "Secure channel = authenticated key agreement \u2192 key derivation \u2192 AEAD.", { size: 11, mono: true, color: C.accentLine });
          }
        }
      ]
    });
  }

  /* ── 7. The birthday bound (Foundations page) ───────────────── */

  function initBirthday() {
    if (!window.Interactive || !document.getElementById("ix-birthday")) return;

    function collisionCurve(k, x, y, w, h, nBits, color) {
      var N = Math.pow(2, nBits);
      var q50 = Math.sqrt(2 * Math.LN2 * N); /* 50% collision at 2^(n/2) */
      k.box(x, y, w, h, { fill: "#ffffff", stroke: C.line, lw: 1.2, r: 6 });
      /* axes */
      k.arrow(x, y + h, x + w, y + h, { color: C.line, lw: 1.2 });
      k.arrow(x, y + h, x, y, { color: C.line, lw: 1.2 });
      /* half-probability guides: x at the mid-point of the axis, y at 50% */
      k.arrow(x + w / 2, y + h, x + w / 2, y + h / 2, { color: C.red, lw: 1.2, dash: [4, 4] });
      k.arrow(x, y + h / 2, x + w / 2, y + h / 2, { color: C.red, lw: 1.2, dash: [4, 4] });
      k.label(x + w / 2 + 5, y + h / 2 - 10, "50%", { size: 9, mono: true, color: C.red });
      /* the collision curve: x spans 0 .. 2*q50, y spans 0 .. P=1 */
      var pts = [];
      for (var f = 0; f <= 1.0001; f += 0.02) {
        var q = 2 * q50 * f;
        var p = 1 - Math.exp(-(q * q) / (2 * N));
        pts.push([x + f * w, y + h - Math.min(1, p) * h]);
      }
      for (var i = 1; i < pts.length; i++) {
        k.arrow(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], { color: color, lw: 2 });
      }
    }

    STEPS.birthday = window.Interactive.stepper("ix-birthday", {
      title: "Why collisions are cheaper than preimages",
      subtitle: "Generate q digests at random and collisions appear far sooner than intuition suggests.",
      height: 320,
      intervalMs: 3000,
      frames: [
        {
          title: "The counting argument",
          titleZh: "\u8ba1\u6570\u8bba\u8bc1",
          caption: "With q values drawn from N = 2\u207f, the number of pairs is about q\u00b2/2 and each pair matches with probability 1/N, so a collision becomes likely once q \u2248 \u221a(2N) \u2248 2^(n/2).",
          captionZh: "\u4ece N = 2\u207f \u4e2a\u53d6\u503c\u4e2d\u62bd\u53d6 q \u4e2a\u503c\u65f6\uff0c\u914d\u5bf9\u6570\u7ea6\u4e3a q\u00b2/2\uff0c\u6bcf\u5bf9\u76f8\u7b49\u7684\u6982\u7387\u4e3a 1/N\uff0c\u56e0\u6b64\u5f53 q \u2248 \u221a(2N) \u2248 2^(n/2) \u65f6\uff0c\u51b2\u7a81\u5c31\u53d8\u5f97\u5f88\u53ef\u80fd\u53d1\u751f\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 46;
            k.label(x, 40, "P(collision)  \u2248  1 \u2212 exp( \u2212 q(q\u22121) / 2N )", { size: 13, mono: true, color: C.ink });
            k.box(x, 62, Math.min(w - 92, 470), 46, { fill: C.blueSoft, stroke: C.blue, lw: 1.4, r: 8 });
            k.label(x + Math.min(w - 92, 470) / 2, 85, "set the exponent \u2248 1  \u21d2  q \u2248 \u221a(2N) = 2^(n/2)", {
              align: "center",
              baseline: "middle",
              size: 12,
              mono: true,
              color: C.blue
            });
            k.label(x, 140, "The number of pairs, not the number of values, is what matters:", { size: 11, color: C.muted });
            k.label(x, 164, "q values \u2192 q(q\u22121)/2 \u2248 q\u00b2/2 pairs \u2192 the \u201c\u221a\u201d appears.", { size: 11, mono: true, color: C.muted });
            k.label(x, 206, "Preimage: given a digest, find any message \u2192 2\u207f work.", { size: 11, mono: true, color: C.accentLine });
            k.label(x, 228, "Collision: find any two messages that agree \u2192 2^(n/2) work.", { size: 11, mono: true, color: C.red });
            k.label(x, 262, "A digest must therefore be twice as long as the security level it supports.", { size: 11, color: C.muted });
          }
        },
        {
          title: "The collision curve for a 256-bit digest",
          titleZh: "256 \u4f4d\u6458\u8981\u7684\u51b2\u7a81\u66f2\u7ebf",
          caption: "Probability of at least one collision as a function of how many digests have been generated. It reaches one half at about 2\u00b9\u00b2\u2078 for SHA-256, which is still out of reach.",
          captionZh: "\u51fa\u73b0\u81f3\u5c11\u4e00\u6b21\u51b2\u7a81\u7684\u6982\u7387\u968f\u5df2\u751f\u6210\u6458\u8981\u6570\u91cf\u7684\u53d8\u5316\u3002\u5bf9 SHA-256 \u800c\u8a00\uff0c\u5b83\u5728\u7ea6 2\u00b9\u00b2\u2078 \u5904\u8fbe\u5230\u4e00\u534a\uff0c\u8fd9\u4ecd\u7136\u9065\u4e0d\u53ef\u53ca\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 52;
            var cw = Math.min(w - 140, 430);
            var ch = Math.min(h - 130, 190);
            collisionCurve(k, x, 46, cw, ch, 256, C.accent);
            k.label(x, 34, "SHA-256: n = 256, threshold 2\u00b9\u00b2\u2078", { size: 11, mono: true, color: C.accentLine });
            k.label(x - 6, 46 + ch + 16, "0", { size: 9, mono: true, color: C.dim });
            k.label(x + cw / 2, 46 + ch + 16, "2\u00b9\u00b2\u2078", { align: "center", size: 9, mono: true, color: C.dim });
            k.label(x + cw, 46 + ch + 16, "2\u00b9\u00b2\u2079", { align: "right", size: 9, mono: true, color: C.dim });
            k.label(x + cw + 10, 46, "P = 1", { size: 9, mono: true, color: C.dim });
            k.label(x + cw + 10, 46 + ch - 6, "P = 0", { size: 9, mono: true, color: C.dim });
            k.label(x, 46 + ch + 44, "digests generated \u2192 at the mid-point, half of all trials collide", { size: 10, mono: true, color: C.muted });
            k.label(x, 46 + ch + 44, "160-bit SHA-1 crosses the same point at 2\u2078\u2070, and practical collisions exist.", { size: 11, color: C.red });
            k.label(x, 46 + ch + 64, "128-bit MD5 crosses at 2\u2076\u2074 \u2014 well inside reach of ordinary hardware.", { size: 11, color: C.red });
          }
        },
        {
          title: "Digest size decides the level",
          titleZh: "\u6458\u8981\u957f\u5ea6\u51b3\u5b9a\u5b89\u5168\u5f3a\u5ea6",
          caption: "Collision work for the common digests, next to the 128-bit level that AES-128 sets. Only the 256-bit digests reach it.",
          captionZh: "\u5e38\u89c1\u6458\u8981\u7684\u51b2\u7a81\u5de5\u4f5c\u91cf\uff0c\u4e0e AES-128 \u6240\u5bf9\u5e94\u7684 128 \u4f4d\u5f3a\u5ea6\u5e76\u5217\u3002\u53ea\u6709 256 \u4f4d\u6458\u8981\u80fd\u8fbe\u5230\u8be5\u5f3a\u5ea6\u3002",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 46;
            var rows = [
              ["MD5 (128-bit)", "2\u2076\u2074", 0.5, C.red],
              ["SHA-1 (160-bit)", "2\u2078\u2070", 0.625, C.yellow],
              ["SHA-256 (256-bit)", "2\u00b9\u00b2\u2078", 1, C.green],
              ["SHA-512 (512-bit)", "2\u00b2\u2075\u2076", 1, C.accent]
            ];
            var bw = Math.min(w - 220, 330);
            rows.forEach(function (r, i) {
              var y = 52 + i * 56;
              k.label(x, y + 10, r[0], { size: 11, mono: true, color: C.muted });
              k.box(x + 150, y, bw, 20, { fill: C.track, stroke: C.line, lw: 1, r: 5 });
              k.box(x + 150, y, Math.max(16, bw * r[2]), 20, { fill: r[3], stroke: r[3], lw: 1, r: 5 });
              k.label(x + 150 + bw + 8, y + 10, r[1], { size: 11, mono: true, color: r[3], baseline: "middle" });
            });
            k.arrow(x + 150 + bw * 0.625, 40, x + 150 + bw * 0.625, 240, { color: C.blue, lw: 1.2, dash: [4, 4] });
            k.label(x + 150 + bw * 0.625 + 6, 36, "128-bit level (AES-128)", { size: 10, mono: true, color: C.blue });
            k.label(x, 268, "A 128-bit digest can never give 128-bit collision resistance.", { size: 11, color: C.muted });
          }
        }
      ]
    });
  }

  /* ── Mount every stepper (idempotent) ───────────────────────── */

  function mountAll() {
    var steps = [initOtp, initStreamBlock, initAes, initModes, initKeySpace, initHash, initBirthday];
    steps.forEach(function (init) {
      try {
        init();
      } catch (err) {
        if (window.console && window.console.error) {
          window.console.error("[INFO5995 chapter 4] widget failed to mount:", err);
        }
      }
    });
  }
})();
