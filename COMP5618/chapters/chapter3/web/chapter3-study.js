(function () {
  "use strict";

  /* COMP5618 — Week 3 (chapter 3) page behaviour.
   *
   * The declarative widgets (hotspot, pipeline, matcher, deck, sequence and
   * race) are mounted by shared/interactive.js from the JSON config blocks in
   * chapter3-study.html. This file owns the two animated canvas steppers —
   * the TCP three-way handshake and an SSH pivot — plus the re-binding that a
   * language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initHandshakeStepper();
    initPivotStepper();
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
    initHandshakeStepper();
    initPivotStepper();
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
    if (!window.initCOMP5618ChapterUI) return;
    try {
      window.initCOMP5618ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[COMP5618 chapter 3] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── shared canvas helpers ──────────────────────────────────── */

  var INK = "#334155";
  var MUTED = "#64748b";
  var ROSE = "#be123c";
  var BLUE = "#2563eb";
  var GREEN = "#059669";
  var RED = "#dc2626";
  var AMBER = "#b45309";

  function host(k, x, y, w, h, title, sub, color) {
    k.box(x, y, w, h, { fill: "#ffffff", stroke: color, lw: 1.8, r: 10 });
    k.label(x + w / 2, y + (sub ? h / 2 - 9 : h / 2), title, {
      align: "center",
      size: 12,
      mono: true,
      color: color
    });
    if (sub) {
      k.label(x + w / 2, y + h / 2 + 11, sub, { align: "center", size: 10, color: MUTED });
    }
  }

  /* A hatched vertical band standing in for an ACL or a firewall rule set. */
  function wall(k, x, y, h, color) {
    k.box(x - 6, y, 12, h, { fill: "#fef2f4", stroke: color, lw: 1.5, r: 4 });
    for (var i = 0; i < h - 14; i += 12) {
      k.arrow(x - 5, y + 8 + i, x + 5, y + 18 + i, { color: color, lw: 1, head: 1 });
    }
  }

  /* ── Stepper 1: the TCP three-way handshake ─────────────────── */

  function initHandshakeStepper() {
    var mountEl = document.getElementById("ix-handshake");
    if (!mountEl || !window.Interactive) return;

    function stage(k, w, h, leftTitle, leftSub, rightTitle, rightSub) {
      k.clear();
      var ly = h / 2 + 6;
      var lx = Math.max(126, w * 0.18);
      var rx = Math.min(w - 126, w * 0.82);
      var bw = 168;
      var bh = 66;
      host(k, lx - bw / 2, ly - bh / 2, bw, bh, leftTitle, leftSub, ROSE);
      host(k, rx - bw / 2, ly - bh / 2, bw, bh, rightTitle, rightSub, BLUE);

      /* time axis on the left */
      k.arrow(34, 26, 34, h - 22, { color: "#cbd5e1", lw: 1.2 });
      k.label(34, h - 12, "t", { align: "center", size: 10, mono: true, color: MUTED });

      return { lx: lx, rx: rx, ly: ly, bw: bw, bh: bh };
    }

    window.Interactive.stepper("ix-handshake", {
      title: "TCP three-way handshake — and the three ways it ends",
      subtitle:
        "Each frame moves one segment. The answer you get back is what a port scan is really reading.",
      height: 272,
      frames: [
        {
          title: "1 · SYN — the client opens the conversation",
          titleZh: "1 · SYN——客户端发起会话",
          caption:
            "The client picks an initial sequence number x and sets only the SYN flag. No data yet: the segment establishes the sequence space for this direction of the connection.",
          captionZh:
            "客户端选择一个初始序列号 x，只置 SYN 标志位。此时还没有数据：该报文段为本方向建立序列号空间。",
          draw: function (ctx, w, h, k) {
            var g = stage(k, w, h, "client", "10.0.3.20", "server", "10.0.3.5 : 80");
            k.arrow(g.lx + g.bw / 2 + 4, g.ly - 40, g.rx - g.bw / 2 - 6, g.ly - 40, {
              color: ROSE,
              lw: 2
            });
            k.label((g.lx + g.rx) / 2, g.ly - 56, "SYN · seq = x", {
              align: "center",
              size: 11.5,
              mono: true,
              color: ROSE
            });
            k.label((g.lx + g.rx) / 2, g.ly - 26, "options: MSS, window scale, SACK permitted", {
              align: "center",
              size: 10,
              color: MUTED
            });
            k.label(w / 2, h - 16, "state: SYN_SENT  →  SYN_RECEIVED", {
              align: "center",
              size: 11,
              mono: true,
              color: INK
            });
          }
        },
        {
          title: "2 · SYN, ACK — the server answers and acknowledges",
          titleZh: "2 · SYN, ACK——服务器回应并确认",
          caption:
            "The server chooses its own sequence number y and acknowledges x + 1, because a SYN consumes one sequence number even though it carries no data.",
          captionZh:
            "服务器选择自己的序列号 y，并确认 x + 1——因为 SYN 虽然不携带数据，却会消耗一个序列号。",
          draw: function (ctx, w, h, k) {
            var g = stage(k, w, h, "client", "10.0.3.20", "server", "10.0.3.5 : 80");
            k.arrow(g.lx + g.bw / 2 + 4, g.ly - 40, g.rx - g.bw / 2 - 6, g.ly - 40, {
              color: "#e2e8f0",
              lw: 1.6,
              dash: [4, 4]
            });
            k.label((g.lx + g.rx) / 2, g.ly - 56, "SYN · seq = x", {
              align: "center",
              size: 11,
              mono: true,
              color: "#cbd5e1"
            });
            k.arrow(g.rx - g.bw / 2 - 6, g.ly + 6, g.lx + g.bw / 2 + 4, g.ly + 6, {
              color: BLUE,
              lw: 2
            });
            k.label((g.lx + g.rx) / 2, g.ly + 24, "SYN, ACK · seq = y · ack = x + 1", {
              align: "center",
              size: 11.5,
              mono: true,
              color: BLUE
            });
            k.label(w / 2, h - 16, "the port is listening — this is the reply a scanner wants", {
              align: "center",
              size: 11,
              color: GREEN
            });
          }
        },
        {
          title: "3 · ACK — the connection is established",
          titleZh: "3 · ACK——连接建立",
          caption:
            "The client acknowledges y + 1. Both directions now own an independent sequence space, and data can flow.",
          captionZh:
            "客户端确认 y + 1。此刻两个方向各自拥有独立的序列号空间，数据可以开始流动。",
          draw: function (ctx, w, h, k) {
            var g = stage(k, w, h, "client", "ESTABLISHED", "server", "ESTABLISHED");
            k.arrow(g.lx + g.bw / 2 + 4, g.ly - 40, g.rx - g.bw / 2 - 6, g.ly - 40, {
              color: "#e2e8f0",
              lw: 1.6,
              dash: [4, 4]
            });
            k.arrow(g.rx - g.bw / 2 - 6, g.ly - 6, g.lx + g.bw / 2 + 4, g.ly - 6, {
              color: "#e2e8f0",
              lw: 1.6,
              dash: [4, 4]
            });
            k.arrow(g.lx + g.bw / 2 + 4, g.ly + 40, g.rx - g.bw / 2 - 6, g.ly + 40, {
              color: GREEN,
              lw: 2
            });
            k.label((g.lx + g.rx) / 2, g.ly + 58, "ACK · seq = x + 1 · ack = y + 1", {
              align: "center",
              size: 11.5,
              mono: true,
              color: GREEN
            });
            k.highlight(g.lx - g.bw / 2 - 8, g.ly - g.bh / 2 - 8, g.bw + 16, g.bh + 16, {
              color: GREEN
            });
            k.highlight(g.rx - g.bw / 2 - 8, g.ly - g.bh / 2 - 8, g.bw + 16, g.bh + 16, {
              color: GREEN
            });
            k.label(w / 2, h - 16, "3 segments, 1 RTT of waiting — the handshake costs time", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "4 · Data — then either FIN or RST",
          titleZh: "4 · 数据传输——随后是 FIN 或 RST",
          caption:
            "Every segment after the handshake carries data and a cumulative acknowledgement. A polite close uses FIN; anything the receiver did not expect is refused with RST.",
          captionZh:
            "握手之后的每个报文段都携带数据与累积确认。正常关闭使用 FIN；接收方不期待的任何报文都会以 RST 拒绝。",
          draw: function (ctx, w, h, k) {
            var g = stage(k, w, h, "client", "seq = x + 1", "server", "seq = y + 1");
            k.arrow(g.lx + g.bw / 2 + 4, g.ly - 34, g.rx - g.bw / 2 - 6, g.ly - 34, {
              color: ROSE,
              lw: 1.8
            });
            k.label((g.lx + g.rx) / 2, g.ly - 50, "data · seq = x + 1 · len = n", {
              align: "center",
              size: 11,
              mono: true,
              color: ROSE
            });
            k.arrow(g.rx - g.bw / 2 - 6, g.ly - 2, g.lx + g.bw / 2 + 4, g.ly - 2, {
              color: BLUE,
              lw: 1.8
            });
            k.label((g.lx + g.rx) / 2, g.ly + 16, "ACK · ack = x + 1 + n", {
              align: "center",
              size: 11,
              mono: true,
              color: BLUE
            });
            k.arrow(g.lx + g.bw / 2 + 4, g.ly + 48, g.rx - g.bw / 2 - 6, g.ly + 48, {
              color: MUTED,
              lw: 1.6
            });
            k.label((g.lx + g.rx) / 2, g.ly + 64, "FIN, ACK → teardown", {
              align: "center",
              size: 11,
              mono: true,
              color: MUTED
            });
            k.label(w / 2, h - 14, "FIN and SYN each consume one sequence number", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "5 · Closed port — RST, ACK comes back",
          titleZh: "5 · 端口关闭——返回 RST, ACK",
          caption:
            "Nothing is listening on 3306, so the stack refuses the connection immediately. A closed port still answers: the host is proven to be up and the port is proven to be free.",
          captionZh:
            "3306 端口上没有监听进程，协议栈会立即拒绝连接。关闭的端口仍会回应：这证明主机在线，也证明该端口空闲。",
          draw: function (ctx, w, h, k) {
            var g = stage(k, w, h, "scanner", "no service", "target", "10.0.3.5 : 3306");
            k.arrow(g.lx + g.bw / 2 + 4, g.ly - 34, g.rx - g.bw / 2 - 6, g.ly - 34, {
              color: ROSE,
              lw: 2
            });
            k.label((g.lx + g.rx) / 2, g.ly - 50, "SYN · seq = x", {
              align: "center",
              size: 11,
              mono: true,
              color: ROSE
            });
            k.arrow(g.rx - g.bw / 2 - 6, g.ly + 6, g.lx + g.bw / 2 + 4, g.ly + 6, {
              color: RED,
              lw: 2
            });
            k.label((g.lx + g.rx) / 2, g.ly + 24, "RST, ACK · the port is closed, the host is alive", {
              align: "center",
              size: 11.5,
              mono: true,
              color: RED
            });
            k.label(w / 2, h - 16, "closed ≠ invisible — only a drop is invisible", {
              align: "center",
              size: 11.5,
              color: INK
            });
          }
        },
        {
          title: "6 · Filtered port — the SYN is dropped",
          titleZh: "6 · 端口被过滤——SYN 被丢弃",
          caption:
            "A firewall rule discards the segment between the interfaces, so no reply ever arrives. The scanner has to wait for a timeout, which is why filtered ports make a full-range scan slow and noisy.",
          captionZh:
            "防火墙规则在接口之间丢弃该报文段，因此永远不会返回回应。扫描器只能等待超时——这正是被过滤端口会让全端口扫描又慢又吵的原因。",
          draw: function (ctx, w, h, k) {
            var g = stage(k, w, h, "scanner", "developer net", "target", "server net");
            var mid = (g.lx + g.rx) / 2;
            wall(k, mid, 52, h - 108, AMBER);
            k.label(mid, 40, "ACL / firewall", {
              align: "center",
              size: 11,
              mono: true,
              color: AMBER
            });
            k.arrow(g.lx + g.bw / 2 + 4, g.ly - 30, mid - 14, g.ly - 30, { color: ROSE, lw: 2 });
            k.label((g.lx + g.bw / 2 + mid) / 2, g.ly - 46, "SYN · seq = x", {
              align: "center",
              size: 11,
              mono: true,
              color: ROSE
            });
            k.dot(mid, g.ly - 30, 7, { fill: "#ffffff", stroke: RED, lw: 2 });
            k.label(mid + 18, g.ly - 30, "drop", { size: 11, mono: true, color: RED });
            k.label(mid, g.ly + 26, "no SYN, ACK · no RST · silence", {
              align: "center",
              size: 11.5,
              mono: true,
              color: MUTED
            });
            k.label(w / 2, h - 16, "open | filtered — the scanner cannot tell them apart", {
              align: "center",
              size: 11.5,
              color: INK
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: pivoting with SSH port forwards ─────────────── */

  function initPivotStepper() {
    var mountEl = document.getElementById("ix-pivot");
    if (!mountEl || !window.Interactive) return;

    window.Interactive.stepper("ix-pivot", {
      title: "Pivoting: what an SSH port forward actually changes",
      subtitle:
        "The same segmentation problem the Week 3 tutorial builds in pfSense — developer network, server network, one permitted hop.",
      height: 268,
      frames: [
        {
          title: "1 · The direct path is denied",
          titleZh: "1 · 直连路径被拒绝",
          caption:
            "Kali is in the developer network. The router lets SSH through to the web server, but every connection aimed at the MySQL host on 3306 is dropped by the ACL.",
          captionZh:
            "Kali 位于开发网络。路由器允许 SSH 到达 Web 服务器，但任何指向 MySQL 主机 3306 端口的连接都会被 ACL 丢弃。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h / 2 - 30;
            host(k, 30, y, 150, 62, "kali", "192.168.56.10", ROSE);
            host(k, w / 2 - 84, y, 168, 62, "web-server", "server net · :22", BLUE);
            host(k, w - 180, y, 150, 62, "mysql-server", "server net · :3306", BLUE);
            wall(k, w / 2 + 106, y - 22, 106, AMBER);
            k.arrow(184, y + 20, w / 2 - 92, y + 20, { color: GREEN, lw: 1.8 });
            k.label((184 + w / 2 - 92) / 2, y + 6, "ssh :22 permitted", {
              align: "center",
              size: 10.5,
              mono: true,
              color: GREEN
            });
            k.arrow(w / 2 + 90, y + 44, w - 188, y + 44, {
              color: RED,
              lw: 1.8,
              dash: [5, 4]
            });
            k.label((w / 2 + 90 + w - 188) / 2, y + 60, "mysql :3306 denied", {
              align: "center",
              size: 10.5,
              mono: true,
              color: RED
            });
            k.label(w / 2, h - 16, "the ACL decides direction, not just reachability", {
              align: "center",
              size: 11,
              color: MUTED
            });
          }
        },
        {
          title: "2 · The permitted hop becomes the pivot",
          titleZh: "2 · 被允许的一跳成为跳板",
          caption:
            "The web server is reachable, so it is the pivot. A tunnel does not break the ACL — it makes the traffic look like the SSH session the ACL already allows.",
          captionZh:
            "Web 服务器可达，因此它就是跳板。隧道并没有突破 ACL——它只是让流量看起来像 ACL 本就允许的 SSH 会话。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h / 2 - 30;
            host(k, 30, y, 150, 62, "kali", "192.168.56.10", ROSE);
            host(k, w / 2 - 84, y, 168, 62, "web-server", "pivot host", ROSE);
            host(k, w - 180, y, 150, 62, "mysql-server", "127.0.0.1:3306", BLUE);
            k.arrow(184, y + 31, w / 2 - 92, y + 31, { color: ROSE, lw: 2.4 });
            k.label((184 + w / 2 - 92) / 2, y + 15, "one SSH session", {
              align: "center",
              size: 10.5,
              mono: true,
              color: ROSE
            });
            k.arrow(w / 2 + 90, y + 31, w - 188, y + 31, { color: GREEN, lw: 1.8 });
            k.label((w / 2 + 90 + w - 188) / 2, y + 15, "loopback only", {
              align: "center",
              size: 10.5,
              mono: true,
              color: GREEN
            });
            k.highlight(w / 2 - 92, y - 8, 184, 78, { color: ROSE });
            k.label(w / 2, y + 92, "the MySQL host never accepts a connection from the developer network", {
              align: "center",
              size: 11,
              color: INK
            });
          }
        },
        {
          title: "3 · Local forward — “bring a remote service to me”",
          titleZh: "3 · 本地转发——“把远程服务带到我这里”",
          caption:
            "A port on the SSH client’s machine is mapped to a service the SSH server can reach. The client connects to something that looks local; the server does the connecting.",
          captionZh:
            "SSH 客户端本机的一个端口被映射到 SSH 服务端能够访问的服务上。客户端连接的是一个看起来在本地的端口，真正发起连接的是服务端。",
          draw: function (ctx, w, h, k) {
            k.clear();
            host(k, 24, 30, 196, 58, "kali", "127.0.0.1:33306", ROSE);
            host(k, w / 2 - 96, 30, 192, 58, "web-server", "sshd :22", BLUE);
            host(k, w - 196, 30, 172, 58, "mysql-server", ":3306", GREEN);
            k.arrow(222, 59, w / 2 - 104, 59, { color: ROSE, lw: 2 });
            k.arrow(w / 2 + 98, 59, w - 202, 59, { color: GREEN, lw: 1.8 });
            k.box(24, 116, w - 48, 42, { fill: "#fff1f2", stroke: ROSE, lw: 1.4, r: 8 });
            k.code(40, 137, ["ssh -L 33306:mysql-server:3306 dev@web-server"], {
              size: 12.5,
              color: ROSE
            });
            k.label(24, 178, "local port 33306  →  mysql-server:3306, resolved and dialled by the SSH server", {
              size: 11,
              color: INK
            });
            k.label(24, 198, "the client only ever talks to 127.0.0.1 — that is why the ACL never sees MySQL", {
              size: 11,
              color: MUTED
            });
            k.label(24, 222, "the forward lives and dies with the SSH session", { size: 11, color: MUTED });
          }
        },
        {
          title: "4 · Reverse forward — “send the remote server to my service”",
          titleZh: "4 · 反向转发——“把远程服务器送到我的服务”",
          caption:
            "The direction of initiation flips: a port on the remote SSH server is forwarded back to a service the SSH client can reach. Useful when you cannot open a port on the remote side.",
          captionZh:
            "发起方向反转：远程 SSH 服务端上的一个端口被转发回 SSH 客户端能够访问的服务。当你无法在远端开放端口时，这一手法非常有用。",
          draw: function (ctx, w, h, k) {
            k.clear();
            host(k, 24, 30, 196, 58, "web-server", "sshd :22", BLUE);
            host(k, w / 2 - 96, 30, 192, 58, "home machine", "listens on :22222", ROSE);
            host(k, w - 196, 30, 172, 58, "local service", "reachable from client", GREEN);
            k.arrow(w / 2 - 104, 59, 222, 59, { color: ROSE, lw: 2 });
            k.arrow(w - 202, 59, w / 2 + 98, 59, { color: GREEN, lw: 1.8 });
            k.box(24, 116, w - 48, 42, { fill: "#eff6ff", stroke: BLUE, lw: 1.4, r: 8 });
            k.code(40, 137, ["ssh -R 22222:web-server:22 dev@home"], {
              size: 12.5,
              color: BLUE
            });
            k.label(24, 178, "a port on the remote server  →  a service next to the SSH client", {
              size: 11,
              color: INK
            });
            k.label(24, 198, "no inbound port had to be opened on the remote network: the connection starts outbound", {
              size: 11,
              color: MUTED
            });
            k.label(24, 222, "the tunnel is only alive while that SSH session stays open", { size: 11, color: MUTED });
          }
        },
        {
          title: "5 · A SOCKS proxy on the pivot host",
          titleZh: "5 · 在跳板主机上架设 SOCKS 代理",
          caption:
            "A SOCKS proxy is a generic intermediary for any TCP connection — and SOCKS5 can also forward UDP and require authentication. Traffic leaves as if it originated on the compromised host.",
          captionZh:
            "SOCKS 代理是任意 TCP 连接的通用中介——SOCKS5 还能转发 UDP 并要求认证。流量离开时，看起来就像源自被入侵的主机。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = h / 2 - 34;
            host(k, 30, y, 156, 66, "attacker", "any network", ROSE);
            host(k, w / 2 - 96, y, 192, 66, "pivot host", "SOCKS5 listener", AMBER);
            host(k, w - 176, y, 146, 66, "internal hosts", "the finance subnet", BLUE);
            k.arrow(190, y + 33, w / 2 - 104, y + 33, { color: ROSE, lw: 2 });
            k.label((190 + w / 2 - 104) / 2, y + 17, "one TCP session, any protocol", {
              align: "center",
              size: 10,
              mono: true,
              color: ROSE
            });
            k.arrow(w / 2 + 100, y + 33, w - 182, y + 33, { color: BLUE, lw: 1.8 });
            k.label((w / 2 + 100 + w - 182) / 2, y + 17, "looks internal", {
              align: "center",
              size: 10,
              mono: true,
              color: BLUE
            });
            k.label(w / 2, y + 96, "defensively: a workstation that suddenly opens many outbound sessions is the signal", {
              align: "center",
              size: 11,
              color: GREEN
            });
          }
        }
      ]
    });
  }
})();
