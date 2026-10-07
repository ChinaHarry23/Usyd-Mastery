(function () {
  "use strict";

  /* INFO5995 — Week 5 (chapter 5) page behaviour.
   *
   * The declarative widgets (sequence, matcher, timeline, race, pipeline, deck)
   * are mounted by shared/interactive.js from the JSON config blocks in the
   * page. This file owns the three animated canvas steppers — HMAC, RSA key
   * generation and the Diffie-Hellman exchange — plus the re-binding that a
   * language swap requires.
   */

  var ACCENT = "#059669";
  var ACCENT_DARK = "#047857";
  var BLUE = "#2563eb";
  var PURPLE = "#7c3aed";
  var AMBER = "#f59e0b";
  var RED = "#dc2626";
  var INK = "#141826";
  var MUTED = "#565d75";
  var LINE = "#cbd5e1";

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initWidgets();
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
    initWidgets();
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
        window.console.error("[INFO5995 chapter 5] chapter chrome failed to initialise:", err);
      }
    }
  }

  function initWidgets() {
    initHmacStepper();
    initRsaStepper();
    initDhStepper();
  }

  /* ── Shared canvas helpers ──────────────────────────────────── */

  function panel(k, x, y, w, h, opts) {
    opts = opts || {};
    k.box(x, y, w, h, {
      fill: opts.fill || "#f7fafc",
      stroke: opts.stroke || LINE,
      lw: opts.lw || 1.4,
      r: opts.r == null ? 10 : opts.r
    });
  }

  function party(k, x, y, w, h, name, tone) {
    var stroke = tone || ACCENT;
    panel(k, x, y, w, h, { fill: "#f2fbf7", stroke: stroke, lw: 2 });
    k.label(x + w / 2, y + 20, name, { align: "center", size: 13, mono: true, color: ACCENT_DARK });
  }

  /* ── Stepper 1: HMAC computation (FIPS 198-1) ───────────────── */

  function initHmacStepper() {
    var host = document.getElementById("ix-hmac");
    if (!host || !window.Interactive) return;

    var rows = [
      "K            shared secret key",
      "K0 = pad(K)  to B = 64 bytes (SHA-256)",
      "inner = H( (K0 \u2295 ipad) \u2016 M )",
      "tag = H( (K0 \u2295 opad) \u2016 inner )",
      "Verify(K, M, tag) \u2192 1 accept / 0 reject"
    ];

    function hmacFrame(active, detail, note) {
      return function (ctx, w, h, k) {
        k.clear();
        var top = 54;
        var rh = 36;
        var gap = 7;
        var bw = Math.min(w - 40, 660);
        var x = (w - bw) / 2;

        k.label(w / 2, 24, detail, { align: "center", size: 12.5, color: INK });

        rows.forEach(function (row, i) {
          var y = top + i * (rh + gap);
          var live = i === active;
          var done = i < active;
          panel(k, x, y, bw, rh, {
            fill: live ? "#e8f5ef" : done ? "#f4f8f6" : "#fbfcfe",
            stroke: live ? ACCENT : done ? "#a7d8c4" : LINE,
            lw: live ? 2.2 : 1.2
          });
          k.label(x + 14, y + rh / 2, row, {
            size: 12,
            mono: true,
            color: live ? ACCENT_DARK : done ? MUTED : "#8a90a6"
          });
        });

        var by = top + rows.length * (rh + gap) + 6;
        panel(k, x, by, bw, 44, { fill: "#fef7e8", stroke: "#f2d08a", lw: 1.4 });
        k.label(x + 14, by + 15, note, { size: 11.5, color: "#92400e" });
        k.label(x + 14, by + 32, "ipad = 0x36 \u00d7 64   \u2022   opad = 0x5c \u00d7 64", {
          size: 11,
          mono: true,
          color: "#92400e"
        });
      };
    }

    window.Interactive.stepper("ix-hmac", {
      title: "Inside an HMAC computation",
      subtitle: "The key is padded, mixed with the inner pad, hashed with the message, mixed with the outer pad, and hashed again.",
      height: 330,
      frames: [
        {
          title: "Preprocess the key into a block-sized key",
          caption: "A key shorter than the hash block size B is zero-padded to exactly B bytes; a key longer than B is hashed first and then padded. Everything downstream works on K0.",
          draw: hmacFrame(1, "Step 1 \u2014 turn the shared key into K0", "Padding is what lets HMAC use any key length with any approved hash function.")
        },
        {
          title: "Mix the key with the inner pad",
          caption: "ipad is the byte 0x36 repeated B times. XORing K0 with ipad produces the inner key block, so the key never appears directly in the hash input.",
          draw: hmacFrame(2, "Step 2 \u2014 K0 \u2295 ipad (0x36 repeated 64 times)", "XOR is its own inverse: Verifier and signer derive the same block from the same key.")
        },
        {
          title: "Hash the inner block with the message",
          caption: "The inner hash H((K0 \u2295 ipad) \u2016 M) already depends on both the key and every byte of the message. For SHA-256 it produces a 32-byte inner digest.",
          draw: hmacFrame(2, "Step 3 \u2014 inner digest = H( (K0 \u2295 ipad) \u2016 M )", "Change one byte of M and the inner digest changes completely \u2014 the avalanche effect in action.")
        },
        {
          title: "Mix the key with the outer pad",
          caption: "opad is the byte 0x5c repeated B times. The outer block is derived from the same key but is never combined with the message directly.",
          draw: hmacFrame(3, "Step 4 \u2014 K0 \u2295 opad (0x5c repeated 64 times)", "The nested construction is what separates HMAC from a naive keyed hash such as H(K \u2016 M).")
        },
        {
          title: "Hash once more to produce the tag",
          caption: "HMAC(K, m) = H((K0 \u2295 opad) \u2016 H((K0 \u2295 ipad) \u2016 m)). The result is a fixed-length tag: 32 bytes for HMAC-SHA-256, 64 for HMAC-SHA-512.",
          draw: hmacFrame(3, "Step 5 \u2014 tag = H( (K0 \u2295 opad) \u2016 inner )", "The tag travels with the message. It is not encryption: the message stays readable.")
        },
        {
          title: "Verify, and remember what a MAC cannot do",
          caption: "The verifier recomputes Tag(K, M) and compares. A changed message or a forged tag fails; a genuine message-and-tag pair replayed tomorrow still passes, so freshness needs a nonce, timestamp or sequence number.",
          draw: hmacFrame(4, "Step 6 \u2014 recompute and compare, then decide", "Anyone holding K can produce a valid tag \u2014 which is why public verification needs signatures.")
        }
      ]
    });
  }

  /* ── Stepper 2: RSA key generation and use ──────────────────── */

  function initRsaStepper() {
    var host = document.getElementById("ix-rsa");
    if (!host || !window.Interactive) return;

    var rows = [
      "p = 61        q = 53        two large primes",
      "n = p \u00d7 q   = 3233        modulus (the key size)",
      "\u03c6(n) = (p\u22121)(q\u22121) = 3120   keep this secret",
      "e = 17        gcd(e, \u03c6(n)) = 1   public exponent",
      "d = 2753      17 \u00d7 2753 = 15 \u00d7 3120 + 1",
      "public (n, e)  private (n, d)"
    ];

    function rsaFrame(active, detail, note) {
      return function (ctx, w, h, k) {
        k.clear();
        var top = 54;
        var rh = 31;
        var gap = 6;
        var bw = Math.min(w - 40, 660);
        var x = (w - bw) / 2;

        k.label(w / 2, 24, detail, { align: "center", size: 12.5, color: INK });

        rows.forEach(function (row, i) {
          var y = top + i * (rh + gap);
          var live = i === active;
          var done = i < active;
          panel(k, x, y, bw, rh, {
            fill: live ? "#eef4ff" : done ? "#f4f8f6" : "#fbfcfe",
            stroke: live ? BLUE : done ? "#a7d8c4" : LINE,
            lw: live ? 2.2 : 1.2,
            r: 8
          });
          k.label(x + 14, y + rh / 2, row, {
            size: 11.5,
            mono: true,
            color: live ? "#1d4ed8" : done ? MUTED : "#8a90a6"
          });
        });

        var by = top + rows.length * (rh + gap) + 6;
        panel(k, x, by, bw, 46, { fill: "#f6f2fe", stroke: "#d6c8f7", lw: 1.4 });
        k.label(x + 14, by + 16, note, { size: 11.5, color: "#5b21b6" });
        k.label(x + 14, by + 34, "NIST FIPS 186-5: modulus \u2265 2048 bits, p and q of equal length, 2\u00b9\u2076 < e < 2\u00b2\u2075\u2076", {
          size: 10.5,
          mono: true,
          color: "#5b21b6"
        });
      };
    }

    window.Interactive.stepper("ix-rsa", {
      title: "RSA: from two primes to a working key pair",
      subtitle: "Toy parameters are used so every value can be checked by hand; the structure is identical at 2048 bits.",
      height: 330,
      frames: [
        {
          title: "Choose two primes (and keep them)",
          caption: "The security of RSA rests on how hard it is to factor the product of two large primes. That means p and q are secret material, and so is anything that reveals them.",
          draw: rsaFrame(0, "Step 1 \u2014 pick two random primes of equal bit length", "p = 61 and q = 53 here. Real keys use two 1024-bit primes for a 2048-bit modulus.")
        },
        {
          title: "Multiply them to get the modulus",
          caption: "n = p \u00d7 q. The bit length of n is what people mean by the RSA key size, and n itself is published \u2014 its security comes from the difficulty of factoring it back into p and q.",
          draw: rsaFrame(1, "Step 2 \u2014 compute the modulus n = p \u00d7 q", "n = 61 \u00d7 53 = 3233. Factoring 3233 is trivial; factoring a 2048-bit n is not.")
        },
        {
          title: "Compute the totient \u2014 and never publish it",
          caption: "\u03c6(n) = (p \u2212 1)(q \u2212 1) counts the integers below n that are coprime to n, and it is the value that ties e and d together. Anyone who learns it can compute the private key.",
          draw: rsaFrame(2, "Step 3 \u2014 \u03c6(n) = (p \u2212 1)(q \u2212 1) = 60 \u00d7 52 = 3120", "\u03c6(n) is as sensitive as the primes: publishing it would hand over the private exponent.")
        },
        {
          title: "Choose a public exponent coprime to the totient",
          caption: "e must satisfy 1 < e < \u03c6(n) and gcd(e, \u03c6(n)) = 1, so that it has a multiplicative inverse. The standard also constrains the range of e, and 65537 is the usual choice.",
          draw: rsaFrame(3, "Step 4 \u2014 e = 17, and gcd(17, 3120) = 1", "e is public: it is what anyone uses to encrypt a message or verify a signature.")
        },
        {
          title: "Compute the private exponent",
          caption: "d is the modular inverse of e modulo \u03c6(n), found with the extended Euclidean algorithm. e \u00b7 d \u2261 1 (mod \u03c6(n)) is the relationship that makes decryption undo encryption.",
          draw: rsaFrame(4, "Step 5 \u2014 d \u2261 e\u207b\u00b9 (mod \u03c6(n)) = 2753", "Check: 17 \u00d7 2753 = 46801 = 15 \u00d7 3120 + 1, so the remainder is exactly 1.")
        },
        {
          title: "Two keys, two different jobs",
          caption: "The public key (n, e) can be published anywhere. The private key (n, d) never leaves its owner. That split is what lets anyone encrypt or verify while only one party can decrypt or sign.",
          draw: rsaFrame(5, "Step 6 \u2014 publish (n, e), protect (n, d)", "NIST also requires that a signature key pair is not reused for encryption or key establishment.")
        },
        {
          title: "Encrypt, decrypt, sign, verify",
          caption: "Encryption is c = m\u1d49 mod n and decryption is m = c\u1d48 mod n \u2014 modular exponentiation in both directions. Signing swaps the roles: s = H(m)\u1d48 mod n, verified by s\u1d49 mod n = H(m).",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 10;
            var bw = Math.min((w - 90) / 3, 190);
            var gap = (w - 40 - bw * 3) / 2;
            var xs = [20, 20 + bw + gap, 20 + 2 * (bw + gap)];

            k.label(w / 2, 26, "m = 65  \u2192  c = m\u1d49 mod n = 65\u00b9\u2077 mod 3233 = 2790  \u2192  m = c\u1d48 mod n = 65", {
              align: "center",
              size: 12,
              mono: true,
              color: INK
            });

            var titles = ["plaintext m", "ciphertext c", "plaintext m"];
            var subs = ["anyone can encrypt", "travels in public", "only d can recover"];
            xs.forEach(function (x, i) {
              party(k, x, cy - 34, bw, 82, titles[i], i === 1 ? BLUE : ACCENT);
              k.label(x + bw / 2, cy + 30, subs[i], { align: "center", size: 10.5, color: MUTED });
              if (i < 2) {
                k.arrow(x + bw + 4, cy + 6, x + bw + gap - 4, cy + 6, { color: MUTED, lw: 1.8 });
              }
            });

            k.box(20, cy + 82, w - 40, 34, { fill: "#f6f2fe", stroke: "#d6c8f7", lw: 1.4, r: 8 });
            k.label(w / 2, cy + 99, "Real use: RSA protects a short session key; AES-GCM or ChaCha20-Poly1305 protects the data.", {
              align: "center",
              size: 11,
              color: "#5b21b6"
            });
          }
        },
        {
          title: "Why the toy numbers are only a teaching device",
          caption: "A 12-bit modulus can be factored by hand. The same equations with a 2048-bit modulus are what real systems run, and even then RSA is only used for the short asymmetric step of a hybrid scheme.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var top = 56;
            var rows2 = [
              ["toy modulus", "n = 3233  (12 bits)", "breakable by hand"],
              ["minimum today", "n \u2265 2048 bits", "assessed at about 112-bit security"],
              ["common choice", "n = 3072 bits", "assessed at about 128-bit security"],
              ["speed", "modular exponentiation", "orders of magnitude slower than AES"],
              ["therefore", "hybrid encryption", "RSA-OAEP wraps a random AES key"]
            ];
            var bw = Math.min(w - 40, 660);
            var x = (w - bw) / 2;
            rows2.forEach(function (row, i) {
              var y = top + i * 42;
              panel(k, x, y, bw, 36, { fill: i === 0 ? "#fef7e8" : "#f7fafc", stroke: i === 0 ? "#f2d08a" : LINE, lw: 1.2, r: 8 });
              k.label(x + 14, y + 18, row[0], { size: 11.5, mono: true, color: i === 0 ? "#92400e" : ACCENT_DARK });
              k.label(x + bw * 0.34, y + 18, row[1], { size: 11.5, mono: true, color: INK });
              k.label(x + bw * 0.68, y + 18, row[2], { size: 11, color: MUTED });
            });
            k.label(w / 2, h - 16, "Publish y, not x \u2014 and publish n and e, never p, q, \u03c6(n) or d.", {
              align: "center",
              size: 11.5,
              color: MUTED
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: Diffie-Hellman exchange ─────────────────────── */

  function initDhStepper() {
    var host = document.getElementById("ix-dh");
    if (!host || !window.Interactive) return;

    function scene(k, w, h, opts) {
      opts = opts || {};
      var pad = 18;
      var by = 66;
      var bh = 118;
      var bw = Math.max(84, Math.min(160, w * 0.26));
      var lx = pad;
      var rx = w - pad - bw;
      var cx = w / 2;

      party(k, lx, by, bw, bh, "Alice", opts.aliceTone || ACCENT);
      party(k, rx, by, bw, bh, "Bob", opts.bobTone || ACCENT);

      if (opts.aliceLines) {
        opts.aliceLines.forEach(function (line, i) {
          k.label(lx + bw / 2, by + 46 + i * 20, line, {
            align: "center",
            size: 11.5,
            mono: true,
            color: i === 0 ? ACCENT_DARK : MUTED
          });
        });
      }
      if (opts.bobLines) {
        opts.bobLines.forEach(function (line, i) {
          k.label(rx + bw / 2, by + 46 + i * 20, line, {
            align: "center",
            size: 11.5,
            mono: true,
            color: i === 0 ? ACCENT_DARK : MUTED
          });
        });
      }

      k.arrow(lx + bw + 6, by + 44, rx - 6, by + 44, opts.rightArrow || { color: LINE, lw: 1.6, dash: [5, 4] });
      k.arrow(rx - 6, by + 78, lx + bw + 6, by + 78, opts.leftArrow || { color: LINE, lw: 1.6, dash: [5, 4] });

      if (opts.rightLabel) {
        k.label(cx, by + 32, opts.rightLabel, { align: "center", size: 11.5, mono: true, color: opts.rightLabelColor || MUTED });
      }
      if (opts.leftLabel) {
        k.label(cx, by + 94, opts.leftLabel, { align: "center", size: 11.5, mono: true, color: opts.leftLabelColor || MUTED });
      }

      if (opts.eve) {
        k.arrow(cx, by + 130, cx, h - 62, { color: "#e0b878", lw: 1.4, dash: [4, 4] });
        panel(k, cx - Math.min(150, w * 0.34), h - 56, Math.min(300, w * 0.68), 42, {
          fill: "#fef7e8",
          stroke: "#f2d08a",
          lw: 1.5
        });
        k.label(cx, h - 35, opts.eve, { align: "center", size: 11.5, color: "#92400e" });
      }
    }

    window.Interactive.stepper("ix-dh", {
      title: "The Diffie-Hellman exchange",
      subtitle: "Toy group p = 23, g = 5 so that every value can be checked by hand — the mechanism is what matters, not the size.",
      height: 330,
      frames: [
        {
          title: "Public parameters on an open channel",
          caption: "Alice and Bob agree on a large prime p and a generator g. Both values are public, and Eve can read every message that follows.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(w / 2, 26, "public:  p = 23  (a large prime)   and   g = 5  (a generator)", {
              align: "center",
              size: 12.5,
              mono: true,
              color: INK
            });
            scene(k, w, h, {
              aliceLines: ["a not chosen yet"],
              bobLines: ["b not chosen yet"],
              rightLabel: "\u2190 public values \u2192",
              eve: "Eve sees p, g and every value that is sent"
            });
          }
        },
        {
          title: "Alice picks a secret and publishes only A",
          caption: "Alice chooses a private exponent a and computes A = g\u1d43 mod p with repeated squaring. She sends A; a itself never leaves her machine.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(w / 2, 26, "A = g\u1d43 mod p = 5\u2076 mod 23 = 8", { align: "center", size: 12.5, mono: true, color: INK });
            scene(k, w, h, {
              aliceLines: ["a = 6  (secret)", "A = 8  (public)"],
              bobLines: ["b not chosen yet"],
              rightLabel: "A = 8  \u2192",
              rightLabelColor: ACCENT_DARK,
              rightArrow: { color: ACCENT, lw: 2 },
              eve: "Eve learns A = 8, but not a = 6"
            });
          }
        },
        {
          title: "Bob picks a secret and publishes only B",
          caption: "Bob does the same with his own exponent b. Now Alice has B, Bob has A, and Eve has both public values.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(w / 2, 26, "B = g\u1d47 mod p = 5\u00b9\u2075 mod 23 = 19", { align: "center", size: 12.5, mono: true, color: INK });
            scene(k, w, h, {
              aliceLines: ["a = 6  (secret)", "A = 8  (public)"],
              bobLines: ["b = 15  (secret)", "B = 19  (public)"],
              rightLabel: "A = 8  \u2192",
              rightLabelColor: ACCENT_DARK,
              rightArrow: { color: ACCENT, lw: 2 },
              leftLabel: "\u2190  B = 19",
              leftLabelColor: BLUE
            });
          }
        },
        {
          title: "Both sides derive the same shared secret",
          caption: "Alice raises Bob's value to her own exponent; Bob raises Alice's value to his. Both arrive at g^(ab) mod p without ever transmitting it.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(w / 2, 26, "K = B\u1d43 mod p = 19\u2076 mod 23 = 2      and      K = A\u1d47 mod p = 8\u00b9\u2075 mod 23 = 2", {
              align: "center",
              size: 12,
              mono: true,
              color: INK
            });
            scene(k, w, h, {
              aliceLines: ["a = 6", "K = B\u1d43 = 2"],
              bobLines: ["b = 15", "K = A\u1d47 = 2"],
              rightLabel: "A = 8  \u2192",
              rightLabelColor: ACCENT_DARK,
              rightArrow: { color: ACCENT, lw: 2 },
              leftLabel: "\u2190  B = 19",
              leftLabelColor: BLUE,
              aliceTone: ACCENT_DARK,
              bobTone: BLUE
            });
            panel(k, w / 2 - 110, h - 54, 220, 40, { fill: "#e8f5ef", stroke: ACCENT, lw: 1.8 });
            k.label(w / 2, h - 34, "shared secret K = 2  (never transmitted)", { align: "center", size: 11.5, mono: true, color: ACCENT_DARK });
          }
        },
        {
          title: "What Eve would have to solve",
          caption: "Eve holds p, g, A and B. Recovering a or b means solving a discrete logarithm. In this toy group there are 22 candidates; with real parameters the search space is astronomically larger.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(w / 2, 26, "Eve has:  p = 23,  g = 5,  A = 8,  B = 19", { align: "center", size: 12.5, mono: true, color: INK });
            scene(k, w, h, {
              aliceLines: ["a = 6  (hidden)", "A = 8"],
              bobLines: ["b = 15  (hidden)", "B = 19"],
              rightLabel: "A = 8  \u2192",
              rightLabelColor: MUTED,
              leftLabel: "\u2190  B = 19",
              leftLabelColor: MUTED,
              eve: "find a such that 5\u1d43 mod 23 = 8  \u2192  22 candidates here, about 2\u00b2\u2075\u2076 in a real group"
            });
          }
        },
        {
          title: "Agreement is one layer, not the whole protocol",
          caption: "Diffie-Hellman alone authenticates nobody: Eve can run two separate exchanges and sit in the middle. A certificate or signature binds the public values to a verified identity before the derived keys are used.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var steps = ["1. Authenticate", "2. Agree (ECDHE)", "3. Derive (KDF)", "4. Protect (AEAD)"];
            var bw = Math.min((w - 70) / 4, 170);
            var gap = (w - 40 - bw * 4) / 3;
            var y = h / 2 - 62;
            steps.forEach(function (label, i) {
              var x = 20 + i * (bw + gap);
              panel(k, x, y, bw, 60, { fill: i === 1 ? "#eef4ff" : "#f2fbf7", stroke: i === 1 ? BLUE : ACCENT, lw: 1.8 });
              k.label(x + bw / 2, y + 30, label, { align: "center", size: 11.5, color: i === 1 ? "#1d4ed8" : ACCENT_DARK });
              if (i < 3) {
                k.arrow(x + bw + 3, y + 30, x + bw + gap - 3, y + 30, { color: MUTED, lw: 1.6 });
              }
            });
            k.label(w / 2, y + 96, "A certificate verifies the peer \u2014 Diffie-Hellman only proves that a value was computed.", {
              align: "center",
              size: 12,
              color: MUTED
            });
            k.label(w / 2, y + 122, "ECDHE uses a fresh exponent per session, so a later key compromise does not expose past traffic.", {
              align: "center",
              size: 11.5,
              color: MUTED
            });
            k.label(w / 2, y + 148, "Validate the group parameters: bad primes or unchecked public values leak the private exponent.", {
              align: "center",
              size: 11.5,
              color: RED
            });
          }
        }
      ]
    });
  }
})();
