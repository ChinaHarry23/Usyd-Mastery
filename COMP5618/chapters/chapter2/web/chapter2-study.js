(function () {
  "use strict";

  /* COMP5618 — Week 2 page behaviour.
   *
   * The declarative widgets (race, deck, sequence, matcher, hotspot) are mounted
   * by shared/interactive.js from the JSON config blocks in the page. This file
   * owns the three animated canvas steppers — encapsulation, the Ethernet frame
   * field by field, and the ARP exchange — plus the re-binding a language swap
   * requires, because the toggle replaces whole section innerHTML.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initEncapStepper();
    initFrameStepper();
    initArpStepper();
    initChrome();
    lastChromeLang = currentLang();
  });

  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    initEncapStepper();
    initFrameStepper();
    initArpStepper();
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
        window.console.error("[COMP5618 chapter 2] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared drawing helpers ─────────────────────────────────── */

  var INK = "#565d75";
  var DIM = "#94a3b8";
  var LINE = "#cbd5e1";
  var RED = "#e11d48";
  var RED_SOFT = "#fde7ec";
  var BLUE = "#2563eb";
  var BLUE_SOFT = "#e8eefc";
  var GREEN = "#059669";
  var GREEN_SOFT = "#e6f7f0";
  var PURPLE = "#7c3aed";
  var PURPLE_SOFT = "#f1ecfe";
  var AMBER = "#b45309";
  var AMBER_SOFT = "#fdf3e2";

  /* Lay out a row of boxes inside [x, x + width] using relative weights.
   * spec: [{ label, sub, weight, fill, stroke }] */
  function layout(x, width, spec) {
    var total = spec.reduce(function (sum, s) {
      return sum + s.weight;
    }, 0);
    var boxes = [];
    var cursor = x;
    spec.forEach(function (s) {
      var bw = (width * s.weight) / total;
      boxes.push({ x: cursor, y: 0, w: bw, h: 0, spec: s });
      cursor += bw;
    });
    return boxes;
  }

  function drawRow(k, boxes, y, height, highlightIndexes) {
    var hot = highlightIndexes || [];
    boxes.forEach(function (b, i) {
      var s = b.spec;
      var isHot = hot.indexOf(i) !== -1;
      k.box(b.x, y, b.w, height, {
        fill: s.fill || "#ffffff",
        stroke: isHot ? RED : s.stroke || LINE,
        lw: isHot ? 2.4 : 1.4,
        r: 6
      });
      var cx = b.x + b.w / 2;
      if (b.w > 34) {
        k.label(cx, y + height / 2 - (s.sub ? 7 : 0), s.label, {
          align: "center",
          size: b.w > 90 ? 11.5 : 10,
          mono: true,
          color: isHot ? RED : INK
        });
        if (s.sub) {
          k.label(cx, y + height / 2 + 9, s.sub, {
            align: "center",
            size: 9.5,
            color: DIM
          });
        }
      } else {
        k.label(cx, y + height / 2, s.label, {
          align: "center",
          size: 8.5,
          mono: true,
          color: isHot ? RED : DIM
        });
      }
      if (isHot) k.highlight(b.x - 2, y - 2, b.w + 4, height + 4, { color: RED, lw: 1.6 });
    });
  }

  /* Seven OSI bands down the left-hand side; activeIndex is highlighted. */
  function drawBands(k, x, y, width, activeIndex) {
    var layers = [
      "7 Application",
      "6 Presentation",
      "5 Session",
      "4 Transport",
      "3 Network",
      "2 Data link",
      "1 Physical"
    ];
    var bh = 26;
    var gap = 5;
    layers.forEach(function (name, i) {
      var by = y + i * (bh + gap);
      var active = i === activeIndex;
      k.box(x, by, width, bh, {
        fill: active ? RED_SOFT : "#ffffff",
        stroke: active ? RED : LINE,
        lw: active ? 2.2 : 1.2,
        r: 7
      });
      k.label(x + 10, by + bh / 2, name, {
        size: 11,
        mono: true,
        color: active ? RED : INK
      });
    });
    return { height: layers.length * (bh + gap) - gap, step: bh + gap, band: bh };
  }

  /* ── Stepper 1: encapsulation down the stack ────────────────── */

  function initEncapStepper() {
    var host = document.getElementById("ix-encap");
    if (!host || !window.Interactive) return;

    var unitSpec = {
      data: [{ label: "HTTP", sub: "request", weight: 3, fill: BLUE_SOFT, stroke: BLUE }],
      segment: [
        { label: "TCP", sub: "ports", weight: 1.1, fill: AMBER_SOFT, stroke: AMBER },
        { label: "HTTP", sub: "request", weight: 3, fill: BLUE_SOFT, stroke: BLUE }
      ],
      packet: [
        { label: "IP", sub: "addresses", weight: 1.1, fill: GREEN_SOFT, stroke: GREEN },
        { label: "TCP", sub: "ports", weight: 1.1, fill: AMBER_SOFT, stroke: AMBER },
        { label: "HTTP", sub: "request", weight: 3, fill: BLUE_SOFT, stroke: BLUE }
      ],
      frame: [
        { label: "ETH", sub: "MACs", weight: 1.2, fill: PURPLE_SOFT, stroke: PURPLE },
        { label: "IP", sub: "addresses", weight: 1.1, fill: GREEN_SOFT, stroke: GREEN },
        { label: "TCP", sub: "ports", weight: 1.1, fill: AMBER_SOFT, stroke: AMBER },
        { label: "HTTP", sub: "request", weight: 3, fill: BLUE_SOFT, stroke: BLUE },
        { label: "FCS", sub: "", weight: 0.5, fill: "#f1f5f9", stroke: DIM }
      ]
    };

    function drawUnit(k, w, h, bandInfo, key, hot, note) {
      var x = 210;
      var width = Math.max(320, w - x - 24);
      var rowH = 52;
      var y = Math.max(24, (h - rowH) / 2 - 6);
      var boxes = layout(x, width, unitSpec[key]);
      drawRow(k, boxes, y, rowH, hot);
      if (note) {
        k.label(x, y + rowH + 30, note, { size: 11.5, color: INK });
      }
    }

    window.Interactive.stepper("ix-encap", {
      title: "Encapsulation: one request, five names",
      subtitle: "The same bytes acquire a new header at every layer on the way down, and lose one at every layer on the way up.",
      height: 300,
      intervalMs: 2100,
      frames: [
        {
          title: "Layer 7 — the application's data",
          titleZh: "第 7 层——应用数据",
          caption: "A browser asks for a page. At this point the unit is just data: an HTTP request with no ports, no addresses and no framing.",
          captionZh: "浏览器请求一个页面。此时的数据单元只是数据：一个 HTTP 请求，既没有端口，也没有地址与帧结构。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bands = drawBands(k, 24, 20, 160, 0);
            drawUnit(k, w, h, bands, "data", [], "unit name: data");
          }
        },
        {
          title: "Layer 4 — a segment: ports are added",
          titleZh: "第 4 层——报文段：加入端口",
          caption: "TCP prepends source and destination ports so the receiving host knows which application the bytes belong to. The unit is now a segment.",
          captionZh: "TCP 在前面加上源端口与目的端口，接收主机因此知道这些字节属于哪个应用。此时的单元称为报文段（segment）。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bands = drawBands(k, 24, 20, 160, 3);
            drawUnit(k, w, h, bands, "segment", [0], "unit name: segment");
          }
        },
        {
          title: "Layer 3 — a packet: IP addresses are added",
          titleZh: "第 3 层——数据包：加入 IP 地址",
          caption: "The network layer prepends the source and destination IP addresses. This is what makes the unit routable between networks; it is now a packet.",
          captionZh: "网络层在前面加上源 IP 与目的 IP 地址。正是它让数据单元可以在网络之间被路由；此时称为数据包（packet）。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bands = drawBands(k, 24, 20, 160, 4);
            drawUnit(k, w, h, bands, "packet", [0], "unit name: packet");
          }
        },
        {
          title: "Layer 2 — a frame: MAC addresses and an FCS",
          titleZh: "第 2 层——帧：加入 MAC 地址与 FCS",
          caption: "The data-link layer adds the MAC addresses that a switch reads and a frame check sequence at the end. Encapsulation is complete: this is what goes on the wire.",
          captionZh: "数据链路层加入交换机要读取的 MAC 地址，并在末尾加上帧检验序列。封装至此完成：这就是真正上线路传输的内容。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bands = drawBands(k, 24, 20, 160, 5);
            drawUnit(k, w, h, bands, "frame", [0, 4], "unit name: frame");
          }
        },
        {
          title: "Layer 1 — bits on the medium",
          titleZh: "第 1 层——介质上的比特",
          caption: "The frame is encoded as a signal: voltages on copper, light in fibre, radio in the air. Every field above is now simply a bit pattern the receiver must recover.",
          captionZh: "帧被编码为信号：铜缆上的电压、光纤中的光、空中的无线电。上面所有字段此刻都只是接收方必须还原的比特序列。",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawBands(k, 24, 20, 160, 6);
            var x = 210;
            var width = Math.max(320, w - x - 24);
            var y = h / 2;
            k.box(x, y - 46, width, 62, { fill: "#ffffff", stroke: RED, lw: 2, r: 8 });
            k.label(x + 10, y - 28, "encoded signal", { size: 11, mono: true, color: RED });
            var bits = "1 0 1 1 0 1 0 0 1 1 0 0 1 0 1 1 0 1 1 0 1 0 0 1 1 0 1 0";
            k.label(x + 10, y - 4, bits, { size: 12, mono: true, color: INK });
            k.label(x, y + 40, "the receiver locks on with the preamble, then reads fields top-down", {
              size: 11.5,
              color: INK
            });
          }
        },
        {
          title: "On the way up: strip one header per layer",
          titleZh: "向上传递：每层剥掉一个首部",
          caption: "The receiving stack reverses the order. Note what changes at a router: the frame is discarded and rebuilt for the next link, while the packet inside survives the whole journey.",
          captionZh: "接收端的协议栈按相反顺序处理。注意路由器处发生的变化：帧被丢弃并为下一段链路重建，而其中的数据包会走完全程。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 210;
            var width = Math.max(320, w - x - 24);
            var boxes = layout(x, width, unitSpec.frame);
            drawRow(k, boxes, 40, 46, []);
            k.arrow(x + width / 2, 96, x + width / 2, 128, { color: RED, lw: 1.8 });
            k.label(x + width / 2 + 12, 112, "remove ETH header and FCS", { size: 11, color: INK });
            var inner = layout(x + 20, width - 40, unitSpec.packet);
            drawRow(k, inner, 138, 44, []);
            k.arrow(x + width / 2, 190, x + width / 2, 216, { color: GREEN, lw: 1.8 });
            k.label(x + width / 2 + 12, 203, "remove IP header — hand to TCP", { size: 11, color: INK });
            k.box(x + 60, 224, width - 120, 40, { fill: BLUE_SOFT, stroke: BLUE, lw: 1.8, r: 8 });
            k.label(x + width / 2, 244, "HTTP request delivered to the web server", {
              align: "center",
              size: 11.5,
              mono: true,
              color: BLUE
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: the Ethernet frame field by field ───────────── */

  function initFrameStepper() {
    var host = document.getElementById("ix-frame");
    if (!host || !window.Interactive) return;

    var base = [
      { label: "Preamble", sub: "7 B", weight: 7, fill: "#f1f5f9", stroke: DIM },
      { label: "SFD", sub: "1 B", weight: 1, fill: "#f1f5f9", stroke: DIM },
      { label: "Destination MAC", sub: "6 B", weight: 6, fill: PURPLE_SOFT, stroke: PURPLE },
      { label: "Source MAC", sub: "6 B", weight: 6, fill: PURPLE_SOFT, stroke: PURPLE },
      { label: "Type", sub: "2 B", weight: 2, fill: GREEN_SOFT, stroke: GREEN },
      { label: "Payload", sub: "46–1500 B", weight: 46, fill: BLUE_SOFT, stroke: BLUE },
      { label: "FCS", sub: "4 B", weight: 4, fill: AMBER_SOFT, stroke: AMBER }
    ];

    var tagged = [
      { label: "Preamble", sub: "7 B", weight: 7, fill: "#f1f5f9", stroke: DIM },
      { label: "SFD", sub: "1 B", weight: 1, fill: "#f1f5f9", stroke: DIM },
      { label: "Destination MAC", sub: "6 B", weight: 6, fill: PURPLE_SOFT, stroke: PURPLE },
      { label: "Source MAC", sub: "6 B", weight: 6, fill: PURPLE_SOFT, stroke: PURPLE },
      { label: "802.1Q", sub: "4 B", weight: 4, fill: RED_SOFT, stroke: RED },
      { label: "Type", sub: "2 B", weight: 2, fill: GREEN_SOFT, stroke: GREEN },
      { label: "Payload", sub: "46–1500 B", weight: 46, fill: BLUE_SOFT, stroke: BLUE },
      { label: "FCS", sub: "4 B", weight: 4, fill: AMBER_SOFT, stroke: AMBER }
    ];

    function drawFrame(k, w, spec, hot, note, note2) {
      var x = 24;
      var width = Math.max(360, w - 48);
      var y = 70;
      var boxes = layout(x, width, spec);
      drawRow(k, boxes, y, 70, hot);
      k.label(x, 44, "bytes on the wire, left to right", { size: 11, mono: true, color: DIM });
      if (note) k.label(x, y + 100, note, { size: 11.5, color: INK });
      if (note2) k.label(x, y + 122, note2, { size: 11.5, color: INK });
      return boxes;
    }

    window.Interactive.stepper("ix-frame", {
      title: "Anatomy of an Ethernet frame",
      subtitle: "Every field exists for a reason, and every reason has a security consequence.",
      height: 300,
      intervalMs: 2200,
      frames: [
        {
          title: "The whole frame: 64 to 1518 bytes",
          titleZh: "整个帧：64 至 1518 字节",
          caption: "Eighteen bytes of header and trailer wrap 46 to 1500 bytes of payload. The preamble and SFD are consumed by the network interface and never appear in a capture.",
          captionZh: "首部与尾部共 18 字节，包裹 46 至 1500 字节的载荷。前导码与 SFD 由网卡消化，不会出现在抓包结果中。",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawFrame(k, w, base, [], "64 B minimum — 46 B of payload is the floor", "1518 B maximum — 1500 B payload (the MTU) plus 18 B of overhead");
          }
        },
        {
          title: "Destination and source MAC: who and from whom",
          titleZh: "目的与源 MAC：发给谁、来自谁",
          caption: "The switch reads the source to learn, and the destination to decide. Both are claims: nothing in the frame proves either of them.",
          captionZh: "交换机读源地址用于学习，读目的地址用于决策。两者都只是声明：帧里没有任何东西能证明它们。",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawFrame(k, w, base, [2, 3], "FF:FF:FF:FF:FF:FF as the destination means broadcast in this VLAN", "A source that belongs to another device is a spoof — port security and 802.1X are what notice");
          }
        },
        {
          title: "EtherType: what the payload actually is",
          titleZh: "EtherType：载荷究竟是什么",
          caption: "Two bytes that choose the dissector: 0x0800 is IPv4, 0x0806 is ARP, 0x86DD is IPv6 and 0x8100 announces an 802.1Q tag.",
          captionZh: "两个字节决定解析方式：0x0800 是 IPv4，0x0806 是 ARP，0x86DD 是 IPv6，0x8100 表示后面跟着 802.1Q 标签。",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawFrame(k, w, base, [4], "0x0800 IPv4   ·   0x0806 ARP   ·   0x86DD IPv6   ·   0x8100 802.1Q", "A frame whose EtherType disagrees with its contents is how filters get bypassed");
          }
        },
        {
          title: "Payload: the 46-byte floor and the 1500-byte ceiling",
          titleZh: "载荷：46 字节下限与 1500 字节上限",
          caption: "Short payloads are padded to 46 bytes so the frame reaches 64 and collision detection has time to work. Long ones are fragmented by IP above, not by Ethernet.",
          captionZh: "过短的载荷会被填充到 46 字节，使帧达到 64 字节，从而让冲突检测有时间生效。过长的载荷由上层 IP 分片，而不是以太网。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var boxes = drawFrame(k, w, base, [5], "An ARP request: 28 B of ARP inside a 46 B padded payload", "Trailing zeros in the capture are that padding, and the dissector ignores them");
            var hot = boxes[5];
            k.bar(hot.x, 168, hot.w, 12, 46, { max: 1500, fill: BLUE, track: "#e2e8f0" });
            k.label(hot.x, 196, "46 B floor", { size: 10.5, color: DIM });
            k.label(hot.x + hot.w, 196, "1500 B MTU", { align: "right", size: 10.5, color: DIM });
          }
        },
        {
          title: "FCS: error checking, not tamper detection",
          titleZh: "FCS：差错检测，而非防篡改",
          caption: "A CRC-32 over the frame. It catches corruption in transit and drops the frame; it is not a signature, so an attacker who can craft a frame can compute a valid one.",
          captionZh: "对整帧计算的 CRC-32。它能发现传输中的损坏并丢弃该帧；它不是签名，能构造帧的攻击者同样能算出合法的校验值。",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawFrame(k, w, base, [6], "Bad FCS → the frame is discarded, and the counters on the interface increment", "Good FCS ≠ authentic frame. Integrity at Layer 2 is accidental, not adversarial");
          }
        },
        {
          title: "With an 802.1Q tag: the VLAN ID travels in the frame",
          titleZh: "加入 802.1Q 标签：VLAN ID 随帧传输",
          caption: "Four bytes are inserted after the source MAC, carrying a 12-bit VLAN ID. The maximum frame grows to 1522 bytes, and a switch on a trunk link now knows which virtual switch the frame belongs to.",
          captionZh: "在源 MAC 之后插入 4 个字节，其中带有 12 位 VLAN ID。帧的最大长度增至 1522 字节，干线链路上的交换机因此知道该帧属于哪个虚拟交换机。",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawFrame(k, w, tagged, [4], "12-bit VLAN ID → 4094 usable IDs; the tag is trusted by the switch", "Double tagging abuses exactly this trust — one reason the native VLAN should be unused");
          }
        },
        {
          title: "Stripped at the receiver",
          titleZh: "在接收端被剥除",
          caption: "The interface checks the FCS, removes the preamble, header and trailer, and hands the payload up. Everything this chapter is about has just been discarded — which is also why it is so easy to overlook.",
          captionZh: "网卡校验 FCS，移除前导码、首部与尾部，把载荷交给上层。本章讨论的一切此刻都被丢弃了——这也正是它如此容易被忽视的原因。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 24;
            var width = Math.max(360, w - 48);
            var boxes = layout(x, width, base);
            drawRow(k, boxes, 60, 60, []);
            var payload = boxes[5];
            k.arrow(payload.x + payload.w / 2, 126, payload.x + payload.w / 2, 158, { color: BLUE, lw: 1.8 });
            k.box(payload.x, 162, payload.w, 46, { fill: BLUE_SOFT, stroke: BLUE, lw: 2, r: 8 });
            k.label(payload.x + payload.w / 2, 185, "IP packet handed to Layer 3", {
              align: "center",
              size: 11.5,
              mono: true,
              color: BLUE
            });
            k.label(x, 232, "the frame itself never leaves this link — a new one is built for the next hop", {
              size: 11.5,
              color: INK
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: the ARP request/reply exchange ──────────────── */

  function initArpStepper() {
    var host = document.getElementById("ix-arp");
    if (!host || !window.Interactive) return;

    function topo(k, w, h) {
      var swW = 108;
      var swH = 52;
      var sw = { x: w / 2 - swW / 2, y: h / 2 - swH / 2, w: swW, h: swH };
      var hosts = {
        a: { x: 40, y: h / 2 - 96, w: 150, h: 60 },
        c: { x: 40, y: h / 2 + 36, w: 150, h: 60 },
        b: { x: w - 190, y: h / 2 - 30, w: 150, h: 60 }
      };
      k.box(sw.x, sw.y, sw.w, sw.h, { fill: "#ffffff", stroke: RED, lw: 2.2, r: 10 });
      k.label(sw.x + sw.w / 2, sw.y + sw.h / 2, "SW1", {
        align: "center",
        size: 13,
        mono: true,
        color: RED
      });
      function link(box, fromRight) {
        var x1 = fromRight ? box.x + box.w : box.x;
        var y1 = box.y + box.h / 2;
        var x2 = fromRight ? sw.x : sw.x + sw.w;
        var y2 = sw.y + sw.h / 2;
        k.arrow(x1, y1, x2, y2, { color: LINE, lw: 2 });
      }
      link(hosts.a, true);
      link(hosts.c, true);
      link(hosts.b, false);
      return { sw: sw, hosts: hosts };
    }

    function hostBox(k, box, name, ip, mac, opts) {
      opts = opts || {};
      var stroke = opts.stroke || LINE;
      var fill = opts.fill || "#ffffff";
      k.box(box.x, box.y, box.w, box.h, { fill: fill, stroke: stroke, lw: opts.lw || 1.6, r: 9 });
      k.label(box.x + 12, box.y + 18, name, { size: 12.5, mono: true, color: opts.nameColor || INK });
      k.label(box.x + 12, box.y + 36, ip, { size: 10.5, mono: true, color: DIM });
      k.label(box.x + 12, box.y + 51, mac, { size: 10, mono: true, color: DIM });
      if (opts.note) {
        k.label(box.x + box.w - 10, box.y + 18, opts.note, {
          align: "right",
          size: 10,
          color: opts.noteColor || DIM
        });
      }
    }

    function cachePanel(k, x, y, title, rows, opts) {
      opts = opts || {};
      var wBox = 230;
      var lineH = 20;
      var hBox = 34 + rows.length * lineH;
      k.box(x, y, wBox, hBox, { fill: "#ffffff", stroke: opts.stroke || LINE, lw: 1.4, r: 8 });
      k.label(x + 10, y + 17, title, { size: 11, mono: true, color: opts.titleColor || INK });
      if (!rows.length) {
        k.label(x + 10, y + 34, "(empty)", { size: 10.5, mono: true, color: DIM });
        return;
      }
      rows.forEach(function (row, i) {
        k.label(x + 10, y + 36 + i * lineH, row, { size: 10.5, mono: true, color: INK });
      });
    }

    var MAC_A = "AA:AA:AA:00:00:0A";
    var MAC_B = "BB:BB:BB:00:00:14";
    var MAC_C = "CC:CC:CC:00:00:1E";

    window.Interactive.stepper("ix-arp", {
      title: "The ARP request and reply, frame by frame",
      subtitle: "Host A has an IP packet for 10.0.0.20. It has the address but not the hardware address that the frame needs.",
      height: 330,
      intervalMs: 2300,
      frames: [
        {
          title: "1 — A has a packet, but no MAC for it",
          titleZh: "1 —— A 有数据包，却没有对应的 MAC",
          caption: "The IP packet is ready to go. Layer 2 needs a destination MAC, and A's ARP cache has nothing for 10.0.0.20, so the packet waits.",
          captionZh: "IP 数据包已准备好发送，但第 2 层需要一个目的 MAC；A 的 ARP 缓存里没有 10.0.0.20 的记录，于是数据包只能等待。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var t = topo(k, w, h);
            hostBox(k, t.hosts.a, "Host A", "10.0.0.10", MAC_A, { stroke: BLUE, fill: BLUE_SOFT, note: "has data", noteColor: BLUE });
            hostBox(k, t.hosts.b, "Host B", "10.0.0.20", MAC_B);
            hostBox(k, t.hosts.c, "Host C", "10.0.0.30", MAC_C);
            cachePanel(k, 40, 16, "A's ARP cache", [], {});
            k.box(w - 220, 16, 190, 54, { fill: "#ffffff", stroke: BLUE, lw: 1.6, r: 8 });
            k.label(w - 210, 36, "packet waiting:", { size: 10.5, mono: true, color: DIM });
            k.label(w - 210, 54, "dst IP 10.0.0.20", { size: 11, mono: true, color: BLUE });
          }
        },
        {
          title: "2 — the question: who has 10.0.0.20?",
          titleZh: "2 —— 提问：谁拥有 10.0.0.20？",
          caption: "A builds an ARP request. It knows the IP address it is asking about but not the hardware address, so the target MAC field is left as zeros.",
          captionZh: "A 构造一个 ARP 请求。它知道要询问的 IP 地址，却不知道对应的硬件地址，因此目标 MAC 字段填零。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var t = topo(k, w, h);
            hostBox(k, t.hosts.a, "Host A", "10.0.0.10", MAC_A, { stroke: BLUE, fill: BLUE_SOFT, note: "asking", noteColor: BLUE });
            hostBox(k, t.hosts.b, "Host B", "10.0.0.20", MAC_B);
            hostBox(k, t.hosts.c, "Host C", "10.0.0.30", MAC_C);
            k.box(40, 16, 330, 52, { fill: RED_SOFT, stroke: RED, lw: 1.8, r: 8 });
            k.label(52, 34, "ARP request  ·  opcode 0x0001", { size: 11, mono: true, color: RED });
            k.label(52, 54, "\"Who has 10.0.0.20? Tell 10.0.0.10\"", { size: 10.5, mono: true, color: INK });
            k.label(w - 190, 40, "28-byte ARP message", { align: "right", size: 10.5, color: DIM });
          }
        },
        {
          title: "3 — broadcast: everyone in the VLAN must hear it",
          titleZh: "3 —— 广播：VLAN 内所有人都必须听到",
          caption: "Because A does not know who to ask, the frame goes to FF:FF:FF:FF:FF:FF with EtherType 0x0806. Only a broadcast can find an unknown owner.",
          captionZh: "由于 A 不知道该问谁，帧被发往 FF:FF:FF:FF:FF:FF，EtherType 为 0x0806。只有广播才能找到未知的拥有者。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var t = topo(k, w, h);
            hostBox(k, t.hosts.a, "Host A", "10.0.0.10", MAC_A, { stroke: BLUE, fill: BLUE_SOFT, note: "sending", noteColor: BLUE });
            hostBox(k, t.hosts.b, "Host B", "10.0.0.20", MAC_B);
            hostBox(k, t.hosts.c, "Host C", "10.0.0.30", MAC_C);
            k.arrow(t.hosts.a.x + t.hosts.a.w, t.hosts.a.y + t.hosts.a.h / 2, t.sw.x, t.sw.y + t.sw.h / 2, { color: RED, lw: 2.6 });
            k.label(w / 2 - 30, t.sw.y - 26, "dst FF:FF:FF:FF:FF:FF", { align: "center", size: 10.5, mono: true, color: RED });
            k.label(40, 20, "frame: src " + MAC_A, { size: 10.5, mono: true, color: INK });
            k.label(40, 38, "EtherType 0x0806 (ARP)", { size: 10.5, mono: true, color: DIM });
          }
        },
        {
          title: "4 — the switch floods it out of every other port",
          titleZh: "4 —— 交换机把它从其他所有端口泛洪出去",
          caption: "The switch has never seen this broadcast before, and it could not forward a broadcast to one port even if it wanted to. Every port in the VLAN gets a copy.",
          captionZh: "交换机此前从未见过这个广播，而且即使它想，也无法把广播只转发到一个端口。VLAN 内每个端口都会收到一份副本。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var t = topo(k, w, h);
            hostBox(k, t.hosts.a, "Host A", "10.0.0.10", MAC_A, { stroke: BLUE, fill: BLUE_SOFT, note: "waiting", noteColor: BLUE });
            hostBox(k, t.hosts.b, "Host B", "10.0.0.20", MAC_B, { stroke: RED, lw: 2 });
            hostBox(k, t.hosts.c, "Host C", "10.0.0.30", MAC_C, { stroke: RED, lw: 2 });
            k.arrow(t.sw.x, t.sw.y + t.sw.h / 2, t.hosts.b.x, t.hosts.b.y + t.hosts.b.h / 2, { color: RED, lw: 2.4 });
            k.arrow(t.sw.x, t.sw.y + t.sw.h / 2, t.hosts.c.x + t.hosts.c.w, t.hosts.c.y + t.hosts.c.h / 2, { color: RED, lw: 2.4 });
            k.label(t.sw.x + t.sw.w / 2, t.sw.y + t.sw.h + 24, "flood: unknown or broadcast destination", {
              align: "center",
              size: 10.5,
              color: INK
            });
          }
        },
        {
          title: "5 — C ignores it, B recognises its own address",
          titleZh: "5 —— C 忽略它，B 认出这是自己的地址",
          caption: "Every station receives the request, but only the host whose IP matches acts on it. Meanwhile B has learned something for free: A's MAC belongs to A's IP.",
          captionZh: "所有站点都收到了请求，但只有 IP 匹配的主机会作出反应。同时 B 免费获得了一条信息：A 的 MAC 对应 A 的 IP。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var t = topo(k, w, h);
            hostBox(k, t.hosts.a, "Host A", "10.0.0.10", MAC_A, { stroke: BLUE, fill: BLUE_SOFT });
            hostBox(k, t.hosts.b, "Host B", "10.0.0.20", MAC_B, { stroke: GREEN, lw: 2.4, note: "that is me", noteColor: GREEN });
            hostBox(k, t.hosts.c, "Host C", "10.0.0.30", MAC_C, { stroke: LINE, note: "not my IP", noteColor: DIM });
            cachePanel(k, w - 270, h - 84, "B's ARP cache", ["10.0.0.10 → " + MAC_A], { stroke: GREEN, titleColor: GREEN });
            k.label(40, h - 30, "the request taught B everything it needs to answer", { size: 11, color: INK });
          }
        },
        {
          title: "6 — the reply is unicast",
          titleZh: "6 —— 应答是单播",
          caption: "B already has A's hardware address from the request, so there is no reason to shout. The reply goes straight back to A with opcode 0x0002.",
          captionZh: "B 已经从请求中获得了 A 的硬件地址，因此没有必要再广播。应答以 opcode 0x0002 直接返回 A。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var t = topo(k, w, h);
            hostBox(k, t.hosts.a, "Host A", "10.0.0.10", MAC_A, { stroke: BLUE, fill: BLUE_SOFT, note: "waiting", noteColor: BLUE });
            hostBox(k, t.hosts.b, "Host B", "10.0.0.20", MAC_B, { stroke: GREEN, lw: 2.2, note: "replying", noteColor: GREEN });
            hostBox(k, t.hosts.c, "Host C", "10.0.0.30", MAC_C);
            k.arrow(t.hosts.b.x, t.hosts.b.y + t.hosts.b.h / 2, t.sw.x + t.sw.w, t.sw.y + t.sw.h / 2, { color: GREEN, lw: 2.6 });
            k.arrow(t.sw.x, t.sw.y + t.sw.h / 2, t.hosts.a.x + t.hosts.a.w, t.hosts.a.y + t.hosts.a.h / 2, { color: GREEN, lw: 2.6 });
            k.label(w / 2, t.sw.y + t.sw.h + 24, "known unicast → forwarded out of exactly one port", {
              align: "center",
              size: 10.5,
              color: GREEN
            });
            k.label(40, h - 26, "dst " + MAC_A + "   ·   10.0.0.20 is-at " + MAC_B, { size: 10.5, mono: true, color: INK });
          }
        },
        {
          title: "7 — A caches the mapping and sends the packet",
          titleZh: "7 —— A 缓存映射并发送数据包",
          caption: "The waiting packet can finally be framed. The cache entry is what makes the next exchange silent — and it is also what an unsolicited ARP reply can overwrite.",
          captionZh: "等待中的数据包终于可以成帧发送了。缓存条目让之后的数据交换无需再次询问——而它同样可以被一个未经请求的 ARP 应答覆盖。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var t = topo(k, w, h);
            hostBox(k, t.hosts.a, "Host A", "10.0.0.10", MAC_A, { stroke: BLUE, fill: BLUE_SOFT, note: "sending packet", noteColor: BLUE });
            hostBox(k, t.hosts.b, "Host B", "10.0.0.20", MAC_B, { stroke: GREEN, fill: GREEN_SOFT, note: "receiving", noteColor: GREEN });
            hostBox(k, t.hosts.c, "Host C", "10.0.0.30", MAC_C);
            k.arrow(t.hosts.a.x + t.hosts.a.w, t.hosts.a.y + t.hosts.a.h / 2, t.sw.x, t.sw.y + t.sw.h / 2, { color: BLUE, lw: 2.6 });
            k.arrow(t.sw.x + t.sw.w, t.sw.y + t.sw.h / 2, t.hosts.b.x, t.hosts.b.y + t.hosts.b.h / 2, { color: BLUE, lw: 2.6 });
            cachePanel(k, 40, h - 96, "A's ARP cache", ["10.0.0.20 → " + MAC_B], { stroke: BLUE, titleColor: BLUE });
            cachePanel(k, w - 270, h - 96, "B's ARP cache", ["10.0.0.10 → " + MAC_A], { stroke: GREEN, titleColor: GREEN });
          }
        }
      ]
    });
  }
})();
