(function () {
  "use strict";

  /* INFO5995 — Week 6 page behaviour.
   *
   * The declarative widgets (matcher, hotspot, deck, sequence) are mounted by
   * shared/interactive.js from the JSON config blocks in the page. This file
   * owns the animated canvas steppers — the authentication journey, the
   * password-verifier pipeline, the TLS 1.3 handshake and the HMAC computation —
   * plus the privilege-scope race and the re-binding a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initAuthJourney();
    initVerifierStepper();
    initTlsStepper();
    initHmacStepper();
    initCloudRace();
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
    initAuthJourney();
    initVerifierStepper();
    initTlsStepper();
    initHmacStepper();
    initCloudRace();
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
        window.console.error("[INFO5995 chapter 6] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* Every init below is called twice: once on DOMContentLoaded and again on
   * `langchange`. Interactive.stepper() will not rebuild an element it has
   * already mounted, so tear the previous instance down first — otherwise the
   * stepper keeps rendering its English chrome after a language change. */
  function forceRemount(host) {
    if (host && window.Interactive && window.Interactive.destroy) {
      window.Interactive.destroy(host);
    }
  }

  /* ── Shared palette ─────────────────────────────────────────── */

  var GREEN = "#059669";
  var GREEN_DARK = "#047857";
  var BLUE = "#2563eb";
  var PURPLE = "#7c3aed";
  var AMBER = "#f59e0b";
  var RED = "#dc2626";
  var SLATE = "#94a3b8";
  var MUTED = "#565d75";
  var CARD = "#ffffff";
  var TINT = "#e6f5f0";

  /* ── Stepper 1: Alice's authentication journey ──────────────── */

  function initAuthJourney() {
    var host = document.getElementById("ix-auth-journey");
    if (!host || !window.Interactive) return;
    forceRemount(host);

    window.Interactive.stepper("ix-auth-journey", {
      title: "The journey a login actually takes",
      subtitle: "The deck follows Alice from a claim of identity to an authorised session — and asks at every stage where an attacker could enter.",
      height: 300,
      frames: [
        {
          title: "Claim: the portal learns which account is being used",
          caption: "Alice enters alice@harbour.edu.au. Identification makes a claim. Nothing has been proven yet — the portal only knows which record to test against.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 132;
            k.box(w / 2 - 130, cy - 42, 260, 84, { fill: TINT, stroke: GREEN, lw: 2, r: 12 });
            k.label(w / 2, cy - 14, "IDENTIFICATION", { align: "center", size: 12, mono: true, color: GREEN_DARK });
            k.label(w / 2, cy + 12, "alice@harbour.edu.au", { align: "center", size: 13, color: MUTED });
            k.label(w / 2, cy + 34, "a claim, not evidence", { align: "center", size: 11, color: SLATE });
            k.label(w / 2, cy + 76, "Who do you claim to be?", { align: "center", size: 14, weight: "700", color: GREEN_DARK });
            k.label(w / 2, h - 16, "An unverified claim is cheap: anyone can type any address.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "Authenticate: password — something she knows",
          caption: "The portal derives a candidate verifier from the submitted password and compares it with the stored value. A match proves knowledge of a secret. It does not prove the legitimate owner is present.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 140;
            k.box(24, cy - 40, 180, 80, { fill: CARD, stroke: BLUE, lw: 2, r: 10 });
            k.label(114, cy - 12, "PASSWORD", { align: "center", size: 12, mono: true, color: BLUE });
            k.label(114, cy + 12, "something she knows", { align: "center", size: 10.5, color: MUTED });

            k.arrow(212, cy, 284, cy, { color: SLATE, lw: 1.8 });

            k.box(w - 224, cy - 40, 200, 80, { fill: TINT, stroke: GREEN, lw: 2, r: 10 });
            k.label(w - 124, cy - 12, "STORED VERIFIER", { align: "center", size: 12, mono: true, color: GREEN_DARK });
            k.label(w - 124, cy + 12, "hash + salt, never plaintext", { align: "center", size: 10.5, color: MUTED });

            k.label(w / 2, cy + 62, "derived value  ==  stored value", { align: "center", size: 12, mono: true, color: GREEN_DARK });
            k.highlight(24, 56, w - 48, 96, { color: BLUE, dash: [5, 5] });
            k.label(w / 2, h - 16, "Reusable, shareable and phishable — one failure mode carrying the whole login.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "Add a second, independent category",
          caption: "Password + registered phone + fingerprint. Factors count separately only when each is independently verified — password + PIN would be two steps in one category.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 130;
            var xs = [0.2, 0.5, 0.8];
            var titles = ["KNOWS", "HAS", "IS"];
            var bodies = ["password", "registered phone", "fingerprint"];
            xs.forEach(function (f, i) {
              var x = w * f;
              k.box(x - 82, cy - 44, 164, 88, { fill: CARD, stroke: [BLUE, GREEN, PURPLE][i], lw: 2, r: 10 });
              k.label(x, cy - 16, titles[i], { align: "center", size: 12, mono: true, color: [BLUE, GREEN, PURPLE][i] });
              k.label(x, cy + 8, bodies[i], { align: "center", size: 11.5, color: MUTED });
              if (i < 2) {
                k.label(x + (w * (xs[i + 1] - f)) / 2, cy, "+", { align: "center", size: 22, weight: "700", color: SLATE });
              }
            });
            k.label(w / 2, cy + 74, "independently verified  \u2192  stronger authentication", { align: "center", size: 12, mono: true, color: GREEN_DARK });
            k.label(w / 2, h - 16, "Password + PIN = two steps, but one factor category.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "Where MFA is recruited rather than defeated",
          caption: "At 2:13 a.m. the phone keeps asking. Push fatigue pressures the user into approving the attacker's session. MFA reduces risk; it does not make phishing impossible.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 118;
            k.box(w / 2 - 170, cy - 52, 340, 104, { fill: "#fff7ed", stroke: AMBER, lw: 2, r: 12 });
            k.label(w / 2, cy - 24, "MFA PUSH", { align: "center", size: 12, mono: true, color: "#b45309" });
            k.label(w / 2, cy + 2, "Approve sign-in?", { align: "center", size: 14, weight: "700", color: "#b45309" });
            k.label(w / 2, cy + 28, "DENY   or   APPROVE", { align: "center", size: 12, mono: true, color: MUTED });
            k.label(w / 2, cy + 80, "Repeated prompts \u2192 approval fatigue \u2192 the attacker's session is approved", { align: "center", size: 11, color: MUTED });
            k.label(w / 2, h - 16, "Number matching, prompt rate limits and reporting are the countermeasures.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "The strongest login can be bypassed by recovery",
          caption: "“I lost my phone” → help desk → name plus date of birth → account reset → the attacker takes control. Recovery is an authentication path and often the weakest one.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 128;
            var cols = [
              { t: "HELP DESK", b: "“I lost my phone”" },
              { t: "WEAK CHECK", b: "name + date of birth" },
              { t: "ACCOUNT RESET", b: "attacker takes control" }
            ];
            var pad = 24;
            var gap = 30;
            var bw = (w - pad * 2 - gap * 2) / 3;
            cols.forEach(function (c, i) {
              var x = pad + i * (bw + gap);
              var tone = i === 2 ? RED : i === 1 ? AMBER : BLUE;
              k.box(x, cy - 42, bw, 84, { fill: CARD, stroke: tone, lw: 2, r: 10 });
              k.label(x + bw / 2, cy - 16, c.t, { align: "center", size: 11.5, mono: true, color: tone });
              k.label(x + bw / 2, cy + 12, c.b, { align: "center", size: 10.5, color: MUTED });
              if (i < 2) {
                k.arrow(x + bw + 4, cy, x + bw + gap - 4, cy, { color: SLATE, lw: 1.8 });
              }
            });
            k.label(w / 2, cy + 72, "A weak fallback bypasses the strongest primary method.", { align: "center", size: 12, color: RED });
            k.label(w / 2, h - 16, "Principle 5 of the deck's five principles of strong authentication.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "Authorise: what may this session do?",
          caption: "Authentication answered “who are you?”. Authorisation asks “what may you do?”. Alice may view /marks/1042 and not /marks/1043 — the decision the case study's attacker exploited.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 118;
            var rows = [
              { q: "GET /marks/1042  (Alice's own record)", ok: true },
              { q: "GET /marks/1043  (another student)", ok: false }
            ];
            rows.forEach(function (r, i) {
              var y = cy + i * 64;
              k.box(24, y - 26, w - 160, 52, { fill: CARD, stroke: r.ok ? GREEN : RED, lw: 1.8, r: 9 });
              k.label(40, y, r.q, { size: 12, mono: true, color: MUTED });
              k.label(w - 96, y, r.ok ? "ALLOW" : "DENY", { align: "center", size: 13, weight: "700", mono: true, color: r.ok ? GREEN_DARK : RED });
            });
            k.label(w / 2, cy + 158, "Changing an ID in a URL is broken object-level authorisation, not failed authentication.", { align: "center", size: 11, color: MUTED });
            k.label(w / 2, h - 16, "Scope should match responsibility, not status.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "Continuous: the same login carries different risk",
          caption: "9:00 a.m. on a known laptop on the Sydney campus is lower risk than 3:14 a.m. from a new browser in an unusual country. Adaptive authentication can demand stronger evidence or restrict sensitive actions.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 132;
            var cards = [
              { t: "9:00 a.m.", l1: "known laptop", l2: "Sydney campus", tag: "LOWER RISK", tone: GREEN, fill: TINT },
              { t: "3:14 a.m.", l1: "new browser", l2: "unusual country", tag: "HIGHER RISK", tone: AMBER, fill: "#fff7ed" }
            ];
            cards.forEach(function (c, i) {
              var x = i === 0 ? 24 : w / 2 + 12;
              var bw = w / 2 - 36;
              k.box(x, cy - 56, bw, 112, { fill: c.fill, stroke: c.tone, lw: 2, r: 12 });
              k.label(x + bw / 2, cy - 30, c.t, { align: "center", size: 15, weight: "700", color: c.tone });
              k.label(x + bw / 2, cy - 4, c.l1, { align: "center", size: 11.5, color: MUTED });
              k.label(x + bw / 2, cy + 16, c.l2, { align: "center", size: 11.5, color: MUTED });
              k.label(x + bw / 2, cy + 40, c.tag, { align: "center", size: 12, mono: true, color: c.tone });
            });
            k.label(w / 2, cy + 82, "Device, location and behaviour change risk after login.", { align: "center", size: 11.5, color: MUTED });
            k.label(w / 2, h - 16, "Authentication is continuous — not a single gate at the front door.", { align: "center", size: 11, color: MUTED });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: from password to stored verifier ────────────── */

  function initVerifierStepper() {
    var host = document.getElementById("ix-verifier");
    if (!host || !window.Interactive) return;
    forceRemount(host);

    window.Interactive.stepper("ix-verifier", {
      title: "From entered password to stored verifier",
      subtitle: "Why the portal hashes instead of encrypting — and what an attacker gets if the store leaks anyway.",
      height: 265,
      frames: [
        {
          title: "Alice types her password",
          caption: "The password is an authentication secret, not application data. The server should never need to recover the original.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 20;
            k.box(24, cy - 44, 220, 88, { fill: CARD, stroke: BLUE, lw: 2, r: 10 });
            k.label(134, cy - 16, "PASSWORD", { align: "center", size: 12, mono: true, color: BLUE });
            k.label(134, cy + 10, "entered by Alice", { align: "center", size: 11, color: MUTED });
            k.arrow(252, cy, 320, cy, { color: SLATE, lw: 1.8 });
            k.box(w - 300, cy - 44, 276, 88, { fill: "#f8fafc", stroke: SLATE, lw: 1.8, r: 10 });
            k.label(w - 162, cy - 16, "SENT OVER TLS", { align: "center", size: 12, mono: true, color: MUTED });
            k.label(w - 162, cy + 10, "the channel protects it in transit", { align: "center", size: 10.5, color: MUTED });
            k.label(w / 2, cy + 76, "Confidentiality in transit is the channel's job — not the store's.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "A unique random salt per account",
          caption: "The salt is random, unique per account, and stored openly beside the verifier. Its job is to make precomputation useless and to stop two users with the same password from sharing a verifier.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 24;
            var items = [
              { t: "RANDOM SALT", b: "unique per account", tone: PURPLE },
              { t: "STORED OPENLY", b: "salt is not a secret", tone: PURPLE },
              { t: "NO SHARED HASH", b: "same password \u2260 same verifier", tone: GREEN }
            ];
            var pad = 24, gap = 18;
            var bw = (w - pad * 2 - gap * 2) / 3;
            items.forEach(function (it, i) {
              var x = pad + i * (bw + gap);
              k.box(x, cy - 40, bw, 80, { fill: CARD, stroke: it.tone, lw: 1.8, r: 10 });
              k.label(x + bw / 2, cy - 14, it.t, { align: "center", size: 11, mono: true, color: it.tone });
              k.label(x + bw / 2, cy + 12, it.b, { align: "center", size: 10.5, color: MUTED });
            });
            k.label(w / 2, cy + 66, "salt  \u2192  attacker cannot reuse one precomputed table against every account", { align: "center", size: 11, color: MUTED });
            k.label(w / 2, h - 16, "A salt does not slow a single guess. It removes the shortcut across accounts.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "A deliberately costly password-hashing function",
          caption: "Argon2id, scrypt, bcrypt or PBKDF2, configured to be expensive. Hashing does not make weak passwords strong; it raises the cost of guessing them.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 26;
            k.box(24, cy - 52, 190, 104, { fill: CARD, stroke: BLUE, lw: 1.8, r: 10 });
            k.label(119, cy - 26, "PASSWORD", { align: "center", size: 11, mono: true, color: BLUE });
            k.label(119, cy, "+ SALT", { align: "center", size: 11, mono: true, color: PURPLE });
            k.arrow(222, cy, 288, cy, { color: SLATE, lw: 1.8 });

            k.box(w / 2 - 84, cy - 52, 168, 104, { fill: TINT, stroke: GREEN, lw: 2, r: 12 });
            k.label(w / 2, cy - 26, "KDF", { align: "center", size: 14, weight: "700", mono: true, color: GREEN_DARK });
            k.label(w / 2, cy, "Argon2id \u00b7 scrypt", { align: "center", size: 10.5, color: MUTED });
            k.label(w / 2, cy + 20, "bcrypt \u00b7 PBKDF2", { align: "center", size: 10.5, color: MUTED });
            k.arrow(w / 2 + 88, cy, w / 2 + 152, cy, { color: SLATE, lw: 1.8 });

            k.box(w - 214, cy - 52, 190, 104, { fill: CARD, stroke: GREEN, lw: 1.8, r: 10 });
            k.label(w - 119, cy - 26, "STORED VERIFIER", { align: "center", size: 11, mono: true, color: GREEN_DARK });
            k.label(w - 119, cy + 2, "derived value + salt", { align: "center", size: 10.5, color: MUTED });
            k.label(w - 119, cy + 24, "+ algorithm parameters", { align: "center", size: 10.5, color: MUTED });

            k.label(w / 2, cy + 78, "Parameter choices are what make the function expensive — see the Foundations page.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "Login: derive a candidate and compare",
          caption: "The server derives a new candidate verifier using the same salt and parameters, then compares. It never decrypts anything, because there is nothing to decrypt.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 34;
            k.label(w / 2, cy - 26, "LOGIN TIME", { align: "center", size: 11, mono: true, color: GREEN_DARK });
            k.box(24, cy, w / 2 - 44, 54, { fill: CARD, stroke: BLUE, lw: 1.8, r: 9 });
            k.label(38, cy + 27, "submitted password + stored salt", { size: 11, mono: true, color: MUTED });
            k.box(w / 2 + 20, cy, w / 2 - 44, 54, { fill: TINT, stroke: GREEN, lw: 1.8, r: 9 });
            k.label(w / 2 + 34, cy + 27, "stored verifier", { size: 11, mono: true, color: GREEN_DARK });
            k.label(w / 2, cy + 82, "compare", { align: "center", size: 12, mono: true, color: MUTED });
            k.arrow(w / 2, cy + 62, w / 2, cy + 72, { color: SLATE, lw: 1.6 });
            k.box(w / 2 - 130, cy + 92, 260, 46, { fill: "#f8fafc", stroke: SLATE, lw: 1.6, r: 9 });
            k.label(w / 2, cy + 115, "equal \u2192 authenticated  \u00b7  not equal \u2192 denied", { align: "center", size: 11, mono: true, color: MUTED });
            k.label(w / 2, h - 14, "No key to steal that would unlock every password at once.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "Encryption versus hashing, side by side",
          caption: "Encryption is reversible: if the key is stolen, every stored password may be exposed. Hashing is one-way verification: the server checks whether the submitted password derives the same verifier.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 24;
            var bw = w / 2 - 34;
            k.box(22, cy - 60, bw, 120, { fill: "#fef2f2", stroke: RED, lw: 2, r: 12 });
            k.label(22 + bw / 2, cy - 34, "ENCRYPTION — REVERSIBLE", { align: "center", size: 11.5, mono: true, color: RED });
            k.label(22 + bw / 2, cy - 6, "ciphertext \u2192 key \u2192 plaintext", { align: "center", size: 10.5, color: MUTED });
            k.label(22 + bw / 2, cy + 20, "steal the key \u2192 every", { align: "center", size: 10.5, color: MUTED });
            k.label(22 + bw / 2, cy + 40, "stored password is exposed", { align: "center", size: 10.5, color: MUTED });

            k.box(w / 2 + 12, cy - 60, bw, 120, { fill: TINT, stroke: GREEN, lw: 2, r: 12 });
            k.label(w / 2 + 12 + bw / 2, cy - 34, "HASHING — ONE-WAY", { align: "center", size: 11.5, mono: true, color: GREEN_DARK });
            k.label(w / 2 + 12 + bw / 2, cy - 6, "password \u2192 verifier \u2192 compare", { align: "center", size: 10.5, color: MUTED });
            k.label(w / 2 + 12 + bw / 2, cy + 20, "no key exists that would", { align: "center", size: 10.5, color: MUTED });
            k.label(w / 2 + 12 + bw / 2, cy + 40, "reveal the original password", { align: "center", size: 10.5, color: MUTED });

            k.label(w / 2, cy + 84, "Passwords are authentication secrets, not application data that must be recovered.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "If the store leaks anyway: offline guessing",
          caption: "Stolen verifiers let an attacker test guesses without contacting the login server. A slow, memory-hard function is exactly what makes that offline loop expensive — so the defence is layered.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 34;
            k.box(w / 2 - 150, cy - 48, 300, 96, { fill: "#fff7ed", stroke: AMBER, lw: 2, r: 12 });
            k.label(w / 2, cy - 20, "STOLEN VERIFIERS", { align: "center", size: 12, mono: true, color: "#b45309" });
            k.label(w / 2, cy + 6, "guess  \u2192  derive  \u2192  compare", { align: "center", size: 11.5, mono: true, color: MUTED });
            k.label(w / 2, cy + 30, "offline, no rate limit, no lockout", { align: "center", size: 10.5, color: MUTED });
            k.label(w / 2, cy + 76, "Defence is layered: unique passwords + password manager + MFA or passkeys + rate limits + monitoring.", { align: "center", size: 11, color: MUTED });
            k.label(w / 2, h - 14, "Slow hashing raises the cost per guess. It does not make a weak password strong.", { align: "center", size: 11, color: MUTED });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: TLS 1.3 handshake ───────────────────────────── */

  function initTlsStepper() {
    var host = document.getElementById("ix-tls");
    if (!host || !window.Interactive) return;
    forceRemount(host);

    window.Interactive.stepper("ix-tls", {
      title: "TLS 1.3 handshake, message by message",
      subtitle: "Left column is the client, right column the server, time flows downward. The bar at the top shows what each message is protected by.",
      height: 300,
      frames: [
        {
          title: "1. ClientHello — the only fully cleartext flight",
          caption: "client_random, supported versions, cipher suite list, SNI (the server name) and a key_share. A network observer sees all of it, which is why SNI is the classic handshake privacy leak.",
          draw: function (ctx, w, h, k) {
            seqBase(k, w, h, 1);
            msg(k, w, h, 1, {
              from: "c", label: "ClientHello",
              items: "client_random \u00b7 cipher suites \u00b7 key_share \u00b7 SNI",
              tone: AMBER
            });
            k.label(w / 2, h - 16, "Cleartext: an on-path observer learns the server name and the offered suites.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "2. ServerHello — parameters chosen, keys derived",
          caption: "The server picks the version and cipher suite and returns its own key_share. Both sides now run the key schedule and derive handshake keys — from here on, everything is encrypted.",
          draw: function (ctx, w, h, k) {
            seqBase(k, w, h, 2);
            msg(k, w, h, 1, { from: "c", label: "ClientHello", items: "client_random \u00b7 key_share", tone: AMBER });
            msg(k, w, h, 2, { from: "s", label: "ServerHello", items: "cipher suite \u00b7 server key_share", tone: GREEN });
            k.label(w / 2, h - 16, "Shared secret established \u2192 HKDF \u2192 handshake keys. No certificate has been seen yet.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "3. Encrypted extensions and the certificate chain",
          caption: "Everything after ServerHello travels under handshake keys: leaf certificate, intermediate CA certificate, root reachable through the client's trust store. The chain proves the public key belongs to the name.",
          draw: function (ctx, w, h, k) {
            seqBase(k, w, h, 3);
            msg(k, w, h, 1, { from: "c", label: "ClientHello", items: "key_share \u00b7 SNI", tone: AMBER });
            msg(k, w, h, 2, { from: "s", label: "ServerHello", items: "chosen suite \u00b7 key_share", tone: GREEN });
            msg(k, w, h, 3, { from: "s", label: "EncryptedExtensions + Certificate", items: "leaf \u2192 intermediate \u2192 trusted root", tone: BLUE });
            k.label(w / 2, h - 16, "The client validates the chain, the validity window, the name and revocation status.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "4. CertificateVerify and Finished — proof of possession",
          caption: "The server signs a hash of the handshake transcript with the certificate's private key, then sends Finished containing a MAC over the transcript. Possession of the private key — not merely a valid certificate — is what is being proven.",
          draw: function (ctx, w, h, k) {
            seqBase(k, w, h, 4);
            msg(k, w, h, 1, { from: "c", label: "ClientHello", items: "key_share \u00b7 SNI", tone: AMBER });
            msg(k, w, h, 2, { from: "s", label: "ServerHello", items: "chosen suite \u00b7 key_share", tone: GREEN });
            msg(k, w, h, 3, { from: "s", label: "Certificate chain", items: "encrypted", tone: BLUE });
            msg(k, w, h, 4, { from: "s", label: "CertificateVerify + Finished", items: "signature over transcript \u00b7 transcript MAC", tone: PURPLE });
            k.label(w / 2, h - 16, "A valid certificate without the private key cannot produce this signature.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "5. Application keys and AEAD records",
          caption: "Both sides derive application traffic secrets from the handshake. Payload is protected by AEAD with per-record nonces and sequence numbers, so reordering, replay and truncation are detected as well as tampering.",
          draw: function (ctx, w, h, k) {
            seqBase(k, w, h, 5);
            msg(k, w, h, 1, { from: "c", label: "ClientHello", items: "key_share \u00b7 SNI", tone: AMBER });
            msg(k, w, h, 2, { from: "s", label: "ServerHello + Finished", items: "encrypted flight", tone: GREEN });
            msg(k, w, h, 3, { from: "c", label: "Finished", items: "transcript check per direction", tone: BLUE });
            msg(k, w, h, 4, { from: "both", label: "Application data", items: "AEAD \u00b7 nonce \u00b7 sequence number", tone: GREEN_DARK });
            k.label(w / 2, h - 16, "Handshake keys are discarded; only application keys remain.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "6. What the handshake did not authenticate",
          caption: "TLS authenticated the server to the client, and the tunnel is genuinely secure. But a stolen password travels happily inside it. The human on the other end is Week 6's problem, and the case study is the proof.",
          draw: function (ctx, w, h, k) {
            seqBase(k, w, h, 1);
            k.box(24, h * 0.36, w - 48, 74, { fill: TINT, stroke: GREEN, lw: 2, r: 12 });
            k.label(w / 2, h * 0.36 + 24, "TLS 1.3 tunnel — confidentiality + integrity", { align: "center", size: 12, mono: true, color: GREEN_DARK });
            k.label(w / 2, h * 0.36 + 50, "a genuine session for whoever holds the credential", { align: "center", size: 11, color: MUTED });
            k.box(w / 2 - 150, h * 0.62, 300, 56, { fill: "#fef2f2", stroke: RED, lw: 2, r: 10 });
            k.label(w / 2, h * 0.62 + 28, "stolen password passes through unbothered", { align: "center", size: 11.5, mono: true, color: RED });
            k.label(w / 2, h - 16, "Encryption can protect the channel. It cannot prove the right human is using the account.", { align: "center", size: 11.5, color: GREEN_DARK });
          }
        }
      ]
    });
  }

  /* Sequence-diagram scaffolding shared by the TLS frames. */
  function seqBase(k, w, h, protectedUpTo) {
    k.clear();
    var top = 46;
    var left = Math.max(56, w * 0.16);
    var right = Math.min(w - 56, w * 0.84);

    k.box(left - 52, 14, 104, 26, { fill: CARD, stroke: BLUE, lw: 1.8, r: 8 });
    k.label(left, 27, "CLIENT", { align: "center", size: 11, mono: true, color: BLUE });
    k.box(right - 52, 14, 104, 26, { fill: CARD, stroke: GREEN, lw: 1.8, r: 8 });
    k.label(right, 27, "SERVER", { align: "center", size: 11, mono: true, color: GREEN_DARK });

    k.arrow(left, top, left, h - 40, { color: SLATE, lw: 1.2, dash: [4, 5] });
    k.arrow(right, top, right, h - 40, { color: SLATE, lw: 1.2, dash: [4, 5] });

    var bar = [[AMBER, "cleartext"], [GREEN, "handshake keys"], [BLUE, "handshake keys"], [PURPLE, "handshake keys"], [GREEN_DARK, "application keys"]];
    var seg = (w - 48) / bar.length;
    bar.forEach(function (b, i) {
      var on = i < protectedUpTo;
      k.box(24 + i * seg, 4, seg - 3, 5, { fill: on ? b[0] : "#e2e8f0", r: 3 });
    });
  }

  /* One numbered message arrow in a TLS sequence frame. */
  function msg(k, w, h, index, cfg) {
    var left = Math.max(56, w * 0.16);
    var right = Math.min(w - 56, w * 0.84);
    var y = 92 + (index - 1) * 40;
    if (y > h - 62) return;

    var from = cfg.from === "c" ? left : right;
    var to = cfg.from === "s" ? left : right;
    var color = cfg.tone || SLATE;

    k.label(from + (cfg.from === "c" ? 14 : -14), y - 12, String(index) + ". " + cfg.label, {
      align: cfg.from === "c" ? "left" : "right",
      size: 11.5,
      mono: true,
      color: color
    });

    if (cfg.from === "both") {
      k.arrow(left, y + 10, right, y + 10, { color: color, lw: 2 });
      k.arrow(right, y + 22, left, y + 22, { color: color, lw: 2 });
      k.label(w / 2, y + 40, cfg.items, { align: "center", size: 10, color: MUTED });
      return;
    }

    k.arrow(from, y + 10, to, y + 10, { color: color, lw: 2 });
    k.label(w / 2, y + 24, cfg.items, { align: "center", size: 10, color: MUTED });
  }

  /* ── Stepper 4: HMAC over a tampered message ────────────────── */

  function initHmacStepper() {
    var host = document.getElementById("ix-hmac");
    if (!host || !window.Interactive) return;
    forceRemount(host);

    window.Interactive.stepper("ix-hmac", {
      title: "HMAC-SHA-256: why the tag cannot be reused after tampering",
      subtitle: "The Week 5 construction that TLS, cookies and API signatures all rely on — traced over the deck's own example.",
      height: 285,
      frames: [
        {
          title: "1. The original message and its tag",
          caption: "Message “Extend deadline by 1 day” with a key shared by exactly two parties. The tag is a function of both the message and the key, so neither can be changed alone.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(24, 42, w - 48, 62, { fill: CARD, stroke: BLUE, lw: 1.8, r: 10 });
            k.label(40, 62, "message", { size: 11, mono: true, color: BLUE });
            k.label(40, 86, "\u201cExtend deadline by 1 day\u201d", { size: 13, color: MUTED });

            k.box(24, 120, w - 48, 62, { fill: TINT, stroke: GREEN, lw: 1.8, r: 10 });
            k.label(40, 140, "secret key", { size: 11, mono: true, color: GREEN_DARK });
            k.label(40, 164, "known to both parties, sent over no channel", { size: 12, color: MUTED });

            k.arrow(w / 2, 186, w / 2, 206, { color: SLATE, lw: 1.8 });
            k.box(w / 2 - 170, 210, 340, 46, { fill: "#eef2ff", stroke: PURPLE, lw: 1.8, r: 10 });
            k.label(w / 2, 233, "tag T = HMAC-SHA-256(K, M)", { align: "center", size: 12, mono: true, color: PURPLE });
            k.label(w / 2, h - 12, "Both parties can compute T. Nobody else can, because nobody else has K.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "2. Inside HMAC: two nested hashes",
          caption: "HMAC(K, M) = H( (K ⊕ opad) ‖ H( (K ⊕ ipad) ‖ M ) ). The inner hash compresses the key and message; the outer hash binds that result to the key again.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y1 = 58;
            k.box(24, y1, 200, 52, { fill: CARD, stroke: PURPLE, lw: 1.6, r: 9 });
            k.label(124, y1 + 18, "K \u2295 ipad", { align: "center", size: 11.5, mono: true, color: PURPLE });
            k.label(124, y1 + 38, "inner key block", { align: "center", size: 10, color: MUTED });
            k.box(244, y1, 200, 52, { fill: CARD, stroke: BLUE, lw: 1.6, r: 9 });
            k.label(344, y1 + 18, "message blocks", { align: "center", size: 11.5, mono: true, color: BLUE });
            k.label(344, y1 + 38, "padded to 512-bit blocks", { align: "center", size: 10, color: MUTED });
            k.arrow(228, y1 + 26, 240, y1 + 26, { color: SLATE, lw: 1.6 });
            k.label(w - 30, y1 + 26, "H", { align: "center", size: 26, weight: "700", mono: true, color: GREEN_DARK });

            k.arrow(344, y1 + 56, 344, y1 + 84, { color: SLATE, lw: 1.6 });
            k.box(244, y1 + 88, 200, 52, { fill: TINT, stroke: GREEN, lw: 1.6, r: 9 });
            k.label(344, y1 + 106, "inner digest", { align: "center", size: 11.5, mono: true, color: GREEN_DARK });
            k.label(344, y1 + 126, "32 bytes for SHA-256", { align: "center", size: 10, color: MUTED });
            k.box(24, y1 + 88, 200, 52, { fill: CARD, stroke: PURPLE, lw: 1.6, r: 9 });
            k.label(124, y1 + 106, "K \u2295 opad", { align: "center", size: 11.5, mono: true, color: PURPLE });
            k.label(124, y1 + 126, "outer key block", { align: "center", size: 10, color: MUTED });
            k.arrow(228, y1 + 114, 240, y1 + 114, { color: SLATE, lw: 1.6 });
            k.label(w - 30, y1 + 114, "H", { align: "center", size: 26, weight: "700", mono: true, color: GREEN_DARK });
            k.label(w / 2, h - 14, "Nesting is what blocks the length-extension tricks that break a naive H(K ‖ M).", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "3. The attacker tampers: 1 day becomes 7 days",
          caption: "Without the key, the attacker can edit the message but cannot produce a matching tag. The original tag no longer describes the altered message.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(24, 44, w - 48, 58, { fill: "#fef2f2", stroke: RED, lw: 1.8, r: 10 });
            k.label(40, 64, "tampered message", { size: 11, mono: true, color: RED });
            k.label(40, 88, "\u201cExtend deadline by 7 days\u201d", { size: 13, color: MUTED });

            k.box(24, 118, w - 48, 58, { fill: "#f8fafc", stroke: SLATE, lw: 1.8, r: 10 });
            k.label(40, 138, "tag unchanged", { size: 11, mono: true, color: MUTED });
            k.label(40, 162, "the original T, copied from the intercepted message", { size: 12, color: MUTED });

            k.label(w / 2, 204, "Eve can change M. She cannot change T to match \u2014 that needs K.", { align: "center", size: 12, color: RED });
            k.label(w / 2, h - 14, "Hashing alone would not stop this; the secret is what makes the check unforgeable.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "4. Verification fails: the tag is not authentic",
          caption: "The server recomputes HMAC(K, M′), compares it with the received tag, and the comparison fails. Integrity and authenticity are both enforced by one check.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = 62;
            k.box(24, y, w / 2 - 40, 60, { fill: CARD, stroke: GREEN, lw: 1.6, r: 9 });
            k.label(24 + (w / 2 - 40) / 2, y + 20, "recomputed HMAC(K, M\u2032)", { align: "center", size: 11, mono: true, color: GREEN_DARK });
            k.label(24 + (w / 2 - 40) / 2, y + 42, "the value the server derives", { align: "center", size: 10, color: MUTED });
            k.box(w / 2 + 16, y, w / 2 - 40, 60, { fill: CARD, stroke: RED, lw: 1.6, r: 9 });
            k.label(w / 2 + 16 + (w / 2 - 40) / 2, y + 20, "received tag T", { align: "center", size: 11, mono: true, color: RED });
            k.label(w / 2 + 16 + (w / 2 - 40) / 2, y + 42, "the value attached to M\u2032", { align: "center", size: 10, color: MUTED });
            k.label(w / 2, y + 84, "\u2260", { align: "center", size: 22, weight: "700", color: RED });
            k.box(w / 2 - 130, y + 104, 260, 48, { fill: "#fef2f2", stroke: RED, lw: 1.8, r: 10 });
            k.label(w / 2, y + 128, "REJECT — message discarded", { align: "center", size: 12, mono: true, color: RED });
            k.label(w / 2, h - 14, "One check gives integrity and authenticity at once — the two properties AEAD then combines with encryption.", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "5. What HMAC does not give you: replay protection",
          caption: "An attacker who records a complete valid (M, T) pair can send it again later and the tag will verify. HMAC detects tampering; replay needs a nonce, timestamp or sequence number — the same mechanism TLS records use.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = 54;
            k.box(24, y, w - 48, 56, { fill: TINT, stroke: GREEN, lw: 1.6, r: 10 });
            k.label(40, y + 18, "captured earlier", { size: 11, mono: true, color: GREEN_DARK });
            k.label(40, y + 40, "M + T, both genuine, both unmodified", { size: 12, color: MUTED });
            k.arrow(w / 2, y + 60, w / 2, y + 82, { color: SLATE, lw: 1.8 });
            k.box(24, y + 86, w - 48, 56, { fill: "#fff7ed", stroke: AMBER, lw: 1.6, r: 10 });
            k.label(40, y + 104, "replayed later", { size: 11, mono: true, color: "#b45309" });
            k.label(40, y + 126, "the tag verifies, because nothing about it is wrong", { size: 12, color: MUTED });
            k.label(w / 2, h - 14, "Add a nonce, timestamp or sequence number so the same message is only fresh once.", { align: "center", size: 11.5, color: MUTED });
          }
        }
      ]
    });
  }

  /* ── Privilege scope race ───────────────────────────────────── */

  function initCloudRace() {
    var host = document.getElementById("ix-rbac-scope");
    if (!host || !window.Interactive) return;
    forceRemount(host);

    window.Interactive.race("ix-rbac-scope", {
      title: "One system, five roles, increasing access scope",
      subtitle: "Illustrative 0–5 scope scores built from the deck's role ladder and its least-privilege example. A revision aid, not measured data.",
      max: 5,
      rows: [
        { name: "Student — view own records", value: 1, display: "own records only" },
        { name: "Tutor — assigned classes", value: 2, display: "assigned tutorial" },
        { name: "Lecturer — assigned unit", value: 3, display: "one unit" },
        { name: "Coordinator — unit-wide activities", value: 4, display: "unit-wide" },
        { name: "Administrator — platform services", value: 5, display: "platform-wide" }
      ]
    });
  }
})();
