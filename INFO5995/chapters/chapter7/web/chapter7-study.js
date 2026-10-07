(function () {
  "use strict";

  /* INFO5995 — Week 7 page behaviour.
   *
   * The declarative widgets (pipeline, sequence, matcher, hotspot, timeline,
   * deck) are mounted by shared/interactive.js from the JSON config blocks in
   * the page. This file owns the three animated canvas steppers — the TCP
   * handshake and byte stream, the man-in-the-middle path takeover, and the
   * TLS 1.3 message flow — plus the re-binding a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initTcpStepper();
    initMitmStepper();
    initTlsStepper();
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
    initTcpStepper();
    initMitmStepper();
    initTlsStepper();
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
        window.console.error("[INFO5995 chapter 7] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared drawing helpers ─────────────────────────────────── */

  var INK = "#141826";
  var DIM = "#565d75";
  var FAINT = "#7b829a";
  var GREEN = "#059669";
  var GREEN_DARK = "#047857";
  var BLUE = "#2563eb";
  var TEAL = "#0e7490";
  var AMBER = "#b45309";
  var RED = "#dc2626";
  var PURPLE = "#4f46e5";

  /* Two endpoint columns with a channel between them. */
  function endpoints(k, w, h, labels) {
    var left = labels && labels.left ? labels.left : "CLIENT";
    var right = labels && labels.right ? labels.right : "SERVER";
    k.box(24, 34, 104, h - 68, { fill: "#f8fafc", stroke: GREEN_DARK, lw: 2, r: 12 });
    k.label(76, 58, left, { align: "center", size: 11, mono: true, color: GREEN_DARK });
    k.label(76, h - 50, "state:", { align: "center", size: 10, color: FAINT });
    k.box(w - 128, 34, 104, h - 68, { fill: "#f8fafc", stroke: GREEN_DARK, lw: 2, r: 12 });
    k.label(w - 76, 58, right, { align: "center", size: 11, mono: true, color: GREEN_DARK });
    return { x1: 134, x2: w - 134, mid: w / 2 };
  }

  /* ── Stepper 1: TCP, from best-effort IP to a reliable byte stream ── */

  function initTcpStepper() {
    var host = document.getElementById("ix-tcp");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-tcp", {
      title: "TCP: handshake, byte stream, recovery",
      subtitle: "What TCP adds above a best-effort network — and what it still does not provide.",
      titleZh: "TCP：握手、字节流与恢复",
      subtitleZh: "TCP 在尽力而为的网络之上补充了什么——以及它仍然没有提供什么。",
      height: 270,
      frames: [
        {
          title: "IP has already done its best",
          caption: "Each packet is routed independently. Delivery, order and uniqueness are not guaranteed, so the transport layer has to compensate.",
          titleZh: "IP 只做到了尽力而为",
          captionZh: "每个分组独立路由。送达、顺序与唯一性都没有保证，因此必须由传输层来弥补。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 96;
            ["P1", "P2", "P3"].forEach(function (t, i) {
              k.box(24, cy - 42 + i * 32, 54, 26, { fill: "#ecfdf5", stroke: GREEN, lw: 1.6, r: 5 });
              k.label(51, cy - 29 + i * 32, t, { align: "center", size: 11, mono: true, color: GREEN_DARK });
            });
            [0, 1, 2].forEach(function (i) {
              var x = w / 2 - 130 + i * 92;
              k.box(x, cy - 18, 70, 36, { fill: "#ffffff", stroke: "#94a3b8", lw: 1.6, r: 6 });
              k.label(x + 35, cy, "R" + (i + 1), { align: "center", size: 12, mono: true, color: DIM });
              if (i < 2) k.arrow(x + 70, cy, x + 90, cy, { color: "#cbd5e1", lw: 1.4 });
            });
            k.arrow(84, cy, w / 2 - 134, cy, { color: "#94a3b8", lw: 1.5, dash: [4, 4] });
            k.box(w - 146, cy - 30, 122, 60, { fill: "#eef2ff", stroke: PURPLE, lw: 1.8, r: 8 });
            k.label(w - 85, cy - 8, "destination", { align: "center", size: 11, color: PURPLE });
            k.label(w - 85, cy + 12, "server", { align: "center", size: 11, color: DIM });
            k.arrow(w / 2 + 146, cy, w - 150, cy, { color: "#94a3b8", lw: 1.5, dash: [4, 4] });

            var words = ["lost", "late", "out of order", "duplicated"];
            var bw = (w - 80) / 4;
            words.forEach(function (t, i) {
              k.box(40 + i * bw, h - 78, bw - 14, 30, { fill: "#fef2f2", stroke: "#fca5a5", lw: 1.2, r: 6 });
              k.label(40 + i * bw + (bw - 14) / 2, h - 63, t, { align: "center", size: 11, color: RED });
            });
            k.label(w / 2, h - 26, "what can happen to a packet on the way", { align: "center", size: 11, color: DIM });
          }
        },
        {
          title: "1. SYN — can we connect?",
          caption: "The client asks to start a connection and offers an initial sequence number. No application data may be sent yet.",
          titleZh: "1. SYN——可以建立连接吗？",
          captionZh: "客户端请求开始连接并提出初始序列号。此时还不能发送任何应用数据。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var e = endpoints(k, w, h);
            var y = h / 2;
            k.arrow(e.x1, y, e.x2, y, { color: GREEN, lw: 2.4 });
            k.label(e.mid, y - 18, "SYN   seq = x", { align: "center", size: 12, mono: true, color: GREEN_DARK });
            k.label(e.mid, y + 26, "connection state: none yet", { align: "center", size: 11, color: FAINT });
            k.label(e.mid, h - 26, "the server has not allocated anything for this client", { align: "center", size: 11, color: DIM });
          }
        },
        {
          title: "2. SYN-ACK — yes, I am ready",
          caption: "The server allocates state, acknowledges the client's sequence number and offers its own.",
          titleZh: "2. SYN-ACK——我已准备好",
          captionZh: "服务器分配状态，确认客户端的序列号，并提出自己的序列号。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var e = endpoints(k, w, h);
            var y = h / 2;
            k.arrow(e.x1, y - 40, e.x2, y - 40, { color: GREEN, lw: 2.4 });
            k.label(e.mid, y - 58, "SYN   seq = x", { align: "center", size: 12, mono: true, color: GREEN_DARK });
            k.arrow(e.x2, y + 22, e.x1, y + 22, { color: BLUE, lw: 2.4 });
            k.label(e.mid, y + 4, "SYN-ACK   seq = y, ack = x + 1", { align: "center", size: 12, mono: true, color: BLUE });
            k.label(e.mid, h - 26, "the server is now holding a half-open entry", { align: "center", size: 11, color: AMBER });
          }
        },
        {
          title: "3. ACK — connection established",
          caption: "The client acknowledges the server. Both endpoints hold state, sequence numbers are synchronised, and a window is advertised.",
          titleZh: "3. ACK——连接已建立",
          captionZh: "客户端确认服务器。两端都持有状态、序列号已同步，并宣告了窗口大小。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var e = endpoints(k, w, h);
            var y = h / 2 - 10;
            k.arrow(e.x1, y - 52, e.x2, y - 52, { color: GREEN, lw: 2.4 });
            k.label(e.mid, y - 70, "SYN   seq = x", { align: "center", size: 12, mono: true, color: GREEN_DARK });
            k.arrow(e.x2, y - 6, e.x1, y - 6, { color: BLUE, lw: 2.4 });
            k.label(e.mid, y - 24, "SYN-ACK   seq = y, ack = x + 1", { align: "center", size: 12, mono: true, color: BLUE });
            k.arrow(e.x1, y + 40, e.x2, y + 40, { color: AMBER, lw: 2.4 });
            k.label(e.mid, y + 22, "ACK   ack = y + 1", { align: "center", size: 12, mono: true, color: AMBER });
            k.box(e.mid - 96, y + 62, 192, 34, { fill: "#ecfdf5", stroke: GREEN, lw: 1.8, r: 8 });
            k.label(e.mid, y + 79, "ESTABLISHED", { align: "center", size: 12, mono: true, color: GREEN_DARK });
          }
        },
        {
          title: "Sequence numbers keep the byte stream in order",
          caption: "The receiver rebuilds one stream and names the byte it expects next. ACK 131 means everything up to byte 130 arrived.",
          titleZh: "序列号让字节流保持有序",
          captionZh: "接收方重建一条流，并指出它期待的下一个字节。ACK 131 表示 130 号之前的字节都已到达。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var segs = ["Seq 1-40", "Seq 41-70", "Seq 71-100", "Seq 101-130"];
            var gap = 10;
            var bw = Math.min((w - 120 - gap * 3) / 4, 160);
            var total = bw * 4 + gap * 3;
            var x0 = (w - total) / 2;
            segs.forEach(function (t, i) {
              var x = x0 + i * (bw + gap);
              k.box(x, 62, bw, 44, { fill: "#ecfdf5", stroke: GREEN, lw: 1.6, r: 6 });
              k.label(x + bw / 2, 84, t, { align: "center", size: 11, mono: true, color: GREEN_DARK });
            });
            k.label(w / 2, 132, "sender", { align: "center", size: 11, mono: true, color: FAINT });
            k.label(w / 2, 150, "receiver checks: \u201cwhat byte do I expect next?\u201d", { align: "center", size: 12, color: DIM });
            k.arrow(x0 + total - 10, 176, x0 + 10, 176, { color: BLUE, lw: 2.4 });
            k.label(w / 2, 196, "ACK 131", { align: "center", size: 12, mono: true, color: BLUE });
            k.label(w / 2, h - 24, "all bytes up to 130 received; next expected byte is 131", { align: "center", size: 11, color: DIM });
          }
        },
        {
          title: "Loss: ACK 41 triggers retransmission",
          caption: "No progress means the sender resends the missing range. Order, acknowledgement and retransmission work together.",
          titleZh: "丢包：ACK 41 触发重传",
          captionZh: "没有进展就意味着发送方重发缺失区间。顺序、确认与重传共同发挥作用。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var segs = ["Seq 1-40", "Seq 41-70", "Seq 71-100"];
            var gap = 10;
            var bw = Math.min((w - 140 - gap * 2) / 3, 170);
            var total = bw * 3 + gap * 2;
            var x0 = (w - total) / 2;
            segs.forEach(function (t, i) {
              var x = x0 + i * (bw + gap);
              var lost = i === 1;
              k.box(x, 56, bw, 44, {
                fill: lost ? "#fef2f2" : "#ecfdf5",
                stroke: lost ? RED : GREEN,
                lw: lost ? 2.2 : 1.6,
                r: 6
              });
              k.label(x + bw / 2, 78, t, { align: "center", size: 11, mono: true, color: lost ? RED : GREEN_DARK });
              if (lost) k.label(x + bw / 2, 118, "LOST", { align: "center", size: 11, mono: true, color: RED });
            });
            k.arrow(x0 + total - 10, 150, x0 + 10, 150, { color: BLUE, lw: 2.4 });
            k.label(w / 2, 168, "ACK 41  \u2014  still expecting byte 41", { align: "center", size: 12, mono: true, color: BLUE });
            k.arrow(x0 + bw + gap + bw / 2, 208, x0 + bw + gap + bw / 2, 178, { color: AMBER, lw: 2.2, dash: [5, 4] });
            k.label(w / 2, 226, "no progress \u2192 retransmit the missing bytes", { align: "center", size: 12, color: AMBER });
          }
        },
        {
          title: "What TCP still cannot do",
          caption: "Reliability answers \u201cdid it arrive?\u201d. It says nothing about who else read the bytes, whether they changed, or who is really on the other end.",
          titleZh: "TCP 仍然做不到的事",
          captionZh: "可靠性回答的是“是否送达”。它不说别人是否读过、内容是否被改，也不说对面究竟是谁。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cols = [
              { t: "Eavesdrop", s: "read in transit", p: "confidentiality" },
              { t: "Modify", s: "change silently", p: "integrity" },
              { t: "Impersonate", s: "pretend to be the server", p: "identity" }
            ];
            var bw = (w - 80) / 3;
            cols.forEach(function (c, i) {
              var x = 40 + i * bw;
              k.box(x, 54, bw - 16, 96, { fill: "#ffffff", stroke: "#fca5a5", lw: 1.8, r: 10 });
              k.label(x + (bw - 16) / 2, 84, c.t, { align: "center", size: 12, color: RED });
              k.label(x + (bw - 16) / 2, 108, c.s, { align: "center", size: 10, color: DIM });
              k.label(x + (bw - 16) / 2, 130, "breaks " + c.p, { align: "center", size: 10, mono: true, color: FAINT });
            });
            k.box(40, h - 96, w - 80, 46, { fill: "#ecfdf5", stroke: GREEN, lw: 2, r: 10 });
            k.label(w / 2, h - 73, "security above TCP is needed: confidentiality + integrity + authenticated identity", {
              align: "center",
              size: 12,
              color: GREEN_DARK
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: man in the middle ───────────────────────────── */

  function initMitmStepper() {
    var host = document.getElementById("ix-mitm");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-mitm", {
      title: "Man in the middle: how a path becomes an interception",
      subtitle: "The deck's three phases, then what the attacker can do once inside — and what takes it away.",
      titleZh: "中间人：一条路径如何变成一次拦截",
      subtitleZh: "讲义中的三个阶段，以及进入路径之后攻击者能做什么——又是什么让它失效。",
      height: 260,
      frames: [
        {
          title: "Before: two endpoints and a channel",
          caption: "The client and the server can authenticate and protect the session with TLS. Nothing on the path can read the records or alter them undetected.",
          titleZh: "之前：两个端点与一条信道",
          captionZh: "客户端与服务器可以用 TLS 认证并保护这次会话。路径上的任何设备都无法读取记录，也无法在未被发现的情况下改动它们。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var e = endpoints(k, w, h);
            var y = h / 2;
            k.arrow(e.x1, y, e.x2, y, { color: GREEN, lw: 3 });
            k.box(e.mid - 108, y - 46, 216, 34, { fill: "#ecfdf5", stroke: GREEN, lw: 1.8, r: 8 });
            k.label(e.mid, y - 29, "TLS-protected channel", { align: "center", size: 11, mono: true, color: GREEN_DARK });
            k.label(e.mid, y + 26, "encrypted + authenticated", { align: "center", size: 11, color: DIM });
            k.label(e.mid, h - 26, "the attacker has no seat on this path", { align: "center", size: 11, color: FAINT });
          }
        },
        {
          title: "1. Get in the path",
          caption: "Rogue Wi-Fi, ARP spoofing or a compromised network device moves the traffic so that it passes through the attacker.",
          titleZh: "1. 进入路径",
          captionZh: "恶意 Wi-Fi、ARP 欺骗或被攻陷的网络设备改变流量走向，使其经过攻击者。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var e = endpoints(k, w, h);
            var y = h / 2 - 16;
            k.arrow(e.x1, y - 74, e.x2, y - 74, { color: "#cbd5e1", lw: 2, dash: [6, 5] });
            k.label(e.mid, y - 92, "the path the endpoints expect", { align: "center", size: 11, color: FAINT });

            k.box(e.mid - 92, y - 34, 184, 70, { fill: "#fef3c7", stroke: AMBER, lw: 2.2, r: 10 });
            k.label(e.mid, y - 8, "ATTACKER", { align: "center", size: 12, mono: true, color: AMBER });
            k.label(e.mid, y + 14, "rogue AP / ARP spoof", { align: "center", size: 10, color: "#92400e" });

            k.arrow(e.x1, y + 2, e.mid - 96, y + 2, { color: AMBER, lw: 2.4 });
            k.arrow(e.mid + 96, y + 2, e.x2, y + 2, { color: AMBER, lw: 2.4 });
            k.label(e.mid, h - 24, "traffic now passes through the attacker instead of going direct", { align: "center", size: 11, color: DIM });
          }
        },
        {
          title: "2. Impersonate or relay",
          caption: "The attacker terminates each side separately: channel 1 to the client, channel 2 to the server, and copies whatever passes between them.",
          titleZh: "2. 冒充或中转",
          captionZh: "攻击者对两侧分别终止连接：与客户端之间的信道 1、与服务器之间的信道 2，并复制其间传递的一切。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var e = endpoints(k, w, h);
            var y = h / 2 - 14;
            k.box(e.mid - 62, y - 50, 124, 100, { fill: "#fef3c7", stroke: AMBER, lw: 2.2, r: 10 });
            k.label(e.mid, y - 22, "ATTACKER", { align: "center", size: 12, mono: true, color: AMBER });
            k.label(e.mid, y + 2, "two TLS sessions", { align: "center", size: 10, color: "#92400e" });
            k.label(e.mid, y + 24, "one relay", { align: "center", size: 10, color: "#92400e" });

            k.arrow(e.x1, y - 24, e.mid - 66, y - 24, { color: AMBER, lw: 2.2 });
            k.label((e.x1 + e.mid - 66) / 2, y - 42, "channel 1", { align: "center", size: 10, mono: true, color: AMBER });
            k.arrow(e.mid + 66, y + 28, e.x2, y + 28, { color: AMBER, lw: 2.2 });
            k.label((e.x2 + e.mid + 66) / 2, y + 10, "channel 2", { align: "center", size: 10, mono: true, color: AMBER });

            k.label(e.mid, h - 24, "each endpoint believes it is talking directly to the other", { align: "center", size: 11, color: DIM });
          }
        },
        {
          title: "3. Stay unnoticed",
          caption: "Both endpoints may still see apparently normal communication. The one signal that something is wrong is the certificate the client is asked to accept.",
          titleZh: "3. 不被发现",
          captionZh: "两端可能仍看到看似正常的通信。唯一提示异常的信号，是客户端被要求接受的那张证书。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var e = endpoints(k, w, h);
            k.box(24, 62, w - 48, 54, { fill: "#ffffff", stroke: "#cbd5e1", lw: 1.6, r: 8 });
            k.label(w / 2, 82, "what the client sees: a working session with a certificate warning", { align: "center", size: 11, color: DIM });
            k.label(w / 2, 102, "what the server sees: a normal client", { align: "center", size: 11, color: DIM });

            k.box(e.mid - 150, 140, 300, 64, { fill: "#fef2f2", stroke: RED, lw: 2, r: 10 });
            k.label(e.mid, 164, "certificate does not chain to a trusted root", { align: "center", size: 11, color: RED });
            k.label(e.mid, 186, "for the server's name \u2014 the only visible failure", { align: "center", size: 11, color: RED });

            k.label(e.mid, h - 20, "ignore the warning and the relaying becomes a legitimate session", { align: "center", size: 11, color: AMBER });
          }
        },
        {
          title: "What the attacker can do from inside",
          caption: "Once in the path, interception becomes observation or manipulation — and each capability maps to a property.",
          titleZh: "身处路径之中能做什么",
          captionZh: "一旦进入路径，拦截就变成观察或操纵——每一种能力都对应一项安全属性。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cells = [
              { t: "READ", s: "confidentiality" },
              { t: "CHANGE", s: "integrity" },
              { t: "REDIRECT", s: "trust" },
              { t: "BLOCK", s: "availability" }
            ];
            var bw = (w - 90) / 2;
            cells.forEach(function (c, i) {
              var x = 30 + (i % 2) * (bw + 30);
              var y = 56 + Math.floor(i / 2) * 82;
              k.box(x, y, bw, 66, { fill: "#fef3c7", stroke: AMBER, lw: 1.8, r: 10 });
              k.label(x + bw / 2, y + 26, c.t, { align: "center", size: 13, mono: true, color: AMBER });
              k.label(x + bw / 2, y + 48, "breaks " + c.s, { align: "center", size: 10, color: "#92400e" });
            });
            k.label(w / 2, h - 24, "so what stops this? not reliability \u2014 authentication plus encryption", {
              align: "center",
              size: 11,
              color: DIM
            });
          }
        },
        {
          title: "What takes it away",
          caption: "TLS converts interception into a detected authentication failure — but only when the client actually validates the chain and the hostname.",
          titleZh: "是什么让它失效",
          captionZh: "TLS 把拦截变成一次可检测的认证失败——但前提是客户端确实校验了证书链与主机名。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var steps = [
              "chain to a trusted root",
              "signature verification",
              "validity window",
              "hostname match (SAN)"
            ];
            steps.forEach(function (t, i) {
              var y = 50 + i * 40;
              k.box(40, y, w - 240, 30, { fill: "#ecfdf5", stroke: GREEN, lw: 1.5, r: 6 });
              k.label(54, y + 15, "\u2713  " + t, { size: 11, mono: true, color: GREEN_DARK });
            });
            k.box(w - 180, 50, 140, 150, { fill: "#ffffff", stroke: "#fca5a5", lw: 1.8, r: 10 });
            k.label(w - 110, 88, "any failure", { align: "center", size: 11, color: RED });
            k.label(w - 110, 112, "\u2192 abort", { align: "center", size: 13, mono: true, color: RED });
            k.label(w - 110, 140, "no session", { align: "center", size: 10, color: DIM });
            k.label(w - 110, 162, "no data", { align: "center", size: 10, color: DIM });
            k.label(w / 2, h - 20, "HSTS removes the click-through; a pinned or policy-enforcing client refuses outright", {
              align: "center",
              size: 11,
              color: DIM
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: the TLS 1.3 handshake message flow ──────────── */

  function initTlsStepper() {
    var host = document.getElementById("ix-tls");
    if (!host || !window.Interactive) return;

    function columns(k, w, h) {
      k.box(18, 40, 92, h - 80, { fill: "#f8fafc", stroke: GREEN_DARK, lw: 2, r: 12 });
      k.label(64, 62, "CLIENT", { align: "center", size: 10, mono: true, color: GREEN_DARK });
      k.box(w - 110, 40, 92, h - 80, { fill: "#f8fafc", stroke: GREEN_DARK, lw: 2, r: 12 });
      k.label(w - 64, 62, "SERVER", { align: "center", size: 10, mono: true, color: GREEN_DARK });
      return { x1: 114, x2: w - 114, mid: w / 2 };
    }

    window.Interactive.stepper("ix-tls", {
      title: "TLS 1.3: four moves on the wire",
      subtitle: "One round trip, an encrypted handshake, and AEAD-protected records from the first application byte.",
      titleZh: "TLS 1.3：线上的四个动作",
      subtitleZh: "一个往返、加密的握手，以及从第一个应用字节起就受 AEAD 保护的记录。",
      height: 285,
      frames: [
        {
          title: "Before TLS: TCP is already up",
          caption: "The reliable channel exists first and has already cost one round trip. TLS then runs inside it.",
          titleZh: "TLS 之前：TCP 已建立",
          captionZh: "可靠信道首先建立，并已消耗一个往返。TLS 随后在其中运行。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var c = columns(k, w, h);
            var y = 96;
            k.arrow(c.x1, y - 24, c.x2, y - 24, { color: GREEN, lw: 2.2 });
            k.label(c.mid, y - 42, "SYN", { align: "center", size: 11, mono: true, color: GREEN_DARK });
            k.arrow(c.x2, y + 14, c.x1, y + 14, { color: BLUE, lw: 2.2 });
            k.label(c.mid, y - 4, "SYN-ACK", { align: "center", size: 11, mono: true, color: BLUE });
            k.arrow(c.x1, y + 52, c.x2, y + 52, { color: AMBER, lw: 2.2 });
            k.label(c.mid, y + 34, "ACK", { align: "center", size: 11, mono: true, color: AMBER });
            k.box(c.mid - 120, h - 76, 240, 34, { fill: "#ecfdf5", stroke: GREEN, lw: 1.8, r: 8 });
            k.label(c.mid, h - 59, "1 RTT spent, 0 bytes protected", { align: "center", size: 11, mono: true, color: GREEN_DARK });
          }
        },
        {
          title: "ClientHello",
          caption: "Random value, supported_versions = 0x0304, cipher suites, an ephemeral key share for X25519, SNI and ALPN. legacy_version is set to TLS 1.2 for middlebox compatibility.",
          titleZh: "ClientHello",
          captionZh: "随机数、supported_versions = 0x0304、密码套件、X25519 临时密钥共享、SNI 与 ALPN。为兼容中间盒，legacy_version 设为 TLS 1.2。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var c = columns(k, w, h);
            k.arrow(c.x1, 100, c.x2, 100, { color: GREEN, lw: 2.6 });
            k.label(c.mid, 82, "ClientHello", { align: "center", size: 12, mono: true, color: GREEN_DARK });
            var fields = ["random(32)", "versions: 0x0304", "key_share: X25519", "cipher suites", "SNI, ALPN"];
            fields.forEach(function (t, i) {
              var y = 136 + i * 26;
              k.box(c.mid - 150, y, 300, 22, { fill: "#ecfdf5", stroke: "#a7f3d0", lw: 1.2, r: 5 });
              k.label(c.mid - 138, y + 11, t, { size: 10, mono: true, color: GREEN_DARK });
            });
          }
        },
        {
          title: "ServerHello \u2192 the key schedule runs",
          caption: "The server selects TLS_AES_128_GCM_SHA256, returns its own key share, and both sides mix the ECDHE secret into the handshake secret. This is the deck's key-exchange move, happening inside the hellos.",
          titleZh: "ServerHello → 密钥编排启动",
          captionZh: "服务器选择 TLS_AES_128_GCM_SHA256，返回自己的密钥共享，双方把 ECDHE 秘密混入握手秘密。这正是讲义所说的密钥交换动作，发生在 Hello 消息之中。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var c = columns(k, w, h);
            k.arrow(c.x1, 84, c.x2, 84, { color: GREEN, lw: 2, dash: [5, 4] });
            k.label(c.mid, 68, "ClientHello", { align: "center", size: 10, mono: true, color: FAINT });
            k.arrow(c.x2, 126, c.x1, 126, { color: BLUE, lw: 2.6 });
            k.label(c.mid, 108, "ServerHello  \u2014  suite + key_share", { align: "center", size: 12, mono: true, color: BLUE });
            k.box(c.mid - 190, 152, 380, 86, { fill: "#eef2ff", stroke: PURPLE, lw: 1.8, r: 10 });
            k.label(c.mid, 172, "Z = g^(ab)  \u2192  Handshake Secret", { align: "center", size: 11, mono: true, color: PURPLE });
            k.label(c.mid, 196, "handshake traffic keys for each direction", { align: "center", size: 10, color: DIM });
            k.label(c.mid, 218, "forward secrecy: Z is never transmitted", { align: "center", size: 10, color: DIM });
            k.label(c.mid, h - 20, "this is the last plaintext message of the handshake", { align: "center", size: 11, color: AMBER });
          }
        },
        {
          title: "{EncryptedExtensions, Certificate, CertificateVerify, Finished}",
          caption: "From here on the handshake itself is protected. The certificate is confidential; CertificateVerify signs the transcript hash with the server's long-term key, which is what turns an anonymous exchange into an authenticated one.",
          titleZh: "{EncryptedExtensions、Certificate、CertificateVerify、Finished}",
          captionZh: "从这里开始，握手本身也受到保护。证书是机密的；CertificateVerify 用服务器长期密钥对转录哈希签名，正是它把匿名交换变成经过认证的交换。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var c = columns(k, w, h);
            k.box(c.mid - 210, 60, 420, 30, { fill: "#ecfdf5", stroke: GREEN, lw: 1.6, r: 6 });
            k.label(c.mid, 75, "\ud83d\udd12 encrypted with the handshake traffic keys", { align: "center", size: 11, mono: true, color: GREEN_DARK });
            var msgs = ["EncryptedExtensions", "Certificate", "CertificateVerify  (signature)", "Finished  (HMAC over transcript)"];
            msgs.forEach(function (t, i) {
              var y = 104 + i * 34;
              k.arrow(c.x2, y + 12, c.x1, y + 12, { color: PURPLE, lw: 2 });
              k.label(c.mid, y, t, { align: "center", size: 11, mono: true, color: PURPLE });
            });
            k.label(c.mid, h - 20, "an observer cannot even see which certificate was presented", { align: "center", size: 11, color: DIM });
          }
        },
        {
          title: "{Finished} from the client, then application data",
          caption: "The client verifies the transcript and switches to application traffic keys. One round trip after the ClientHello, HTTP requests travel as AEAD records.",
          titleZh: "客户端发送 {Finished}，随后传输应用数据",
          captionZh: "客户端校验转录并切换到应用流量密钥。ClientHello 之后仅一个往返，HTTP 请求就以 AEAD 记录传输。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var c = columns(k, w, h);
            k.arrow(c.x1, 86, c.x2, 86, { color: GREEN, lw: 2.6 });
            k.label(c.mid, 68, "{Finished}", { align: "center", size: 12, mono: true, color: GREEN_DARK });
            k.arrow(c.x1, 138, c.x2, 138, { color: TEAL, lw: 2.4 });
            k.arrow(c.x2, 168, c.x1, 168, { color: TEAL, lw: 2.4 });
            k.label(c.mid, 120, "HTTP request  \u2192  AEAD record", { align: "center", size: 11, mono: true, color: TEAL });
            k.label(c.mid, 186, "HTTP response  \u2192  AEAD record", { align: "center", size: 11, mono: true, color: TEAL });
            k.box(c.mid - 150, h - 78, 300, 34, { fill: "#ecfdf5", stroke: GREEN, lw: 1.8, r: 8 });
            k.label(c.mid, h - 61, "1 RTT total \u2014 confidentiality, integrity, identity", { align: "center", size: 11, mono: true, color: GREEN_DARK });
          }
        },
        {
          title: "What TLS 1.3 removed — and the resumption shortcut",
          caption: "RSA key transport, static DH, CBC suites, RC4, 3DES, renegotiation and compression are gone; a downgrade must be declared in ServerHello.random. Resumption with a PSK allows 0-RTT early data, which the server must treat as replayable.",
          titleZh: "TLS 1.3 移除了什么——以及恢复会话的捷径",
          captionZh: "RSA 密钥传输、静态 DH、CBC 套件、RC4、3DES、重协商与压缩都已移除；降级必须在 ServerHello.random 中声明。使用 PSK 恢复会话可发送 0-RTT 早期数据，服务器必须视其为可重放。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var removed = ["RSA key transport", "static DH", "CBC suites, RC4, 3DES", "renegotiation, compression"];
            k.label(30, 62, "removed", { size: 11, mono: true, color: RED });
            removed.forEach(function (t, i) {
              var y = 82 + i * 30;
              k.box(30, y, w / 2 - 60, 24, { fill: "#fef2f2", stroke: "#fca5a5", lw: 1.2, r: 5 });
              k.label(42, y + 12, "\u2715  " + t, { size: 10, mono: true, color: RED });
            });
            var kept = ["AEAD only", "(EC)DHE by default", "encrypted certificate", "0-RTT with replay caveats"];
            k.label(w / 2 + 30, 62, "kept or added", { size: 11, mono: true, color: GREEN_DARK });
            kept.forEach(function (t, i) {
              var y = 82 + i * 30;
              k.box(w / 2 + 30, y, w / 2 - 60, 24, { fill: "#ecfdf5", stroke: "#a7f3d0", lw: 1.2, r: 5 });
              k.label(w / 2 + 42, y + 12, "\u2713  " + t, { size: 10, mono: true, color: GREEN_DARK });
            });
            k.label(w / 2, h - 34, "downgrade sentinel: ServerHello.random ends 44 4F 57 4E 47 52 44 01", {
              align: "center",
              size: 11,
              mono: true,
              color: AMBER
            });
            k.label(w / 2, h - 14, "if a TLS 1.3-capable client is negotiated down, it aborts", { align: "center", size: 10, color: DIM });
          }
        }
      ]
    });
  }
})();
