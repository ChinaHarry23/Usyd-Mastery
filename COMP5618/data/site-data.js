window.COMP5618_SITE = {
  courseCode: "COMP5618",
  courseName: "Applied Cybersecurity",
  courseNameZh: "应用网络安全",
  term: "S2 2026",
  subtitle: "Offensive and defensive security practice: tooling and ethics, network layers and traversal, web application attacks, Linux privilege, and the Android security model — built from the S2 2026 decks, tutorials and assignment briefs.",
  subtitleZh: "攻防安全实战：工具与伦理、网络分层与穿越、Web 应用攻击、Linux 提权，以及 Android 安全模型——基于 2026 年第二学期的讲义、辅导课与作业说明构建。",
  chapters: [
    {
      number: 1,
      week: 1,
      slug: "chapter1",
      title: "Week 1: Security Fundamentals and Tooling",
      titleZh: "安全基础与工具链",
      shortTitle: "Fundamentals & Tooling",
      summary: "The security mindset, the CIA triad, ethics and the law around offensive work, and setting up a working Kali virtual machine with the core toolset.",
      summaryZh: "安全思维方式、CIA 三要素、攻击性工作的伦理与法律边界，以及搭建可用的 Kali 虚拟机并配置核心工具集。",
      status: "Week 1 built from lecture material",
      concepts: ["CIA triad","threat models","ethics & law","responsible disclosure","Kali Linux","virtualisation","basic recon tools"],
      conceptsZh: ["CIA 三要素","威胁模型","伦理与法律","负责任披露","Kali Linux","虚拟化","基础侦察工具"],
      materials: [
        { label: "Week1-Administrivia", file: "Week1-Administrivia.pdf" },
        { label: "Week1-Basic-Tools", file: "Week1-Basic-Tools.pdf" },
        { label: "Week1-Ethics-Rudeness-Prison", file: "Week1-Ethics-Rudeness-Prison.pdf" }
      ]
    },
    {
      number: 2,
      week: 2,
      slug: "chapter2",
      title: "Week 2: Networking Layers 1 and 2",
      titleZh: "网络第 1、2 层",
      shortTitle: "Layers 1 & 2",
      summary: "Physical and data-link layers: Ethernet framing, MAC addressing, ARP, switching behaviour, and capturing traffic with Wireshark.",
      summaryZh: "物理层与数据链路层：以太网帧封装、MAC 寻址、ARP、交换机行为，以及用 Wireshark 捕获流量。",
      status: "Week 2 built from lecture material",
      concepts: ["OSI & TCP/IP models","Ethernet frames","MAC addressing","ARP","switching","packet capture","Wireshark filters"],
      conceptsZh: ["OSI 与 TCP/IP 模型","以太网帧","MAC 寻址","ARP","交换","数据包捕获","Wireshark 过滤器"],
      materials: [
        { label: "Week2-Networking-Layers-1-and-2", file: "Week2-Networking-Layers-1-and-2.pdf" }
      ]
    },
    {
      number: 3,
      week: 3,
      slug: "chapter3",
      title: "Week 3: Networking Traversal",
      titleZh: "网络穿越",
      shortTitle: "Networking Traversal",
      summary: "Moving up the stack: IP addressing and routing, TCP and UDP behaviour, NAT, port scanning and how firewalls shape what an attacker can reach.",
      summaryZh: "沿协议栈逐层向上：IP 寻址与路由、TCP 与 UDP 的行为、NAT、端口扫描，以及防火墙如何限制攻击者能够触及的范围。",
      status: "Week 3 built from lecture material",
      concepts: ["IP addressing","routing","TCP handshake","UDP","NAT","port scanning","firewalls"],
      conceptsZh: ["IP 寻址","路由","TCP 三次握手","UDP","NAT","端口扫描","防火墙"],
      materials: [
        { label: "Week3-Networking-Traversal", file: "Week3-Networking-Traversal.pdf" }
      ]
    },
    {
      number: 4,
      week: 4,
      slug: "chapter4",
      title: "Week 4: Web Applications",
      titleZh: "Web 应用",
      shortTitle: "Web Applications",
      summary: "How web applications are built and broken: HTTP, sessions and cookies, the classic injection and scripting flaws, and intercepting proxies.",
      summaryZh: "Web 应用如何被构建与被攻破：HTTP、会话与 Cookie、经典的注入与脚本漏洞，以及拦截代理。",
      status: "Week 4 built from lecture material",
      concepts: ["HTTP","sessions & cookies","SQL injection","cross-site scripting","CSRF","same-origin policy","intercepting proxies"],
      conceptsZh: ["HTTP","会话与 Cookie","SQL 注入","跨站脚本","CSRF","同源策略","拦截代理"],
      materials: [
        { label: "Week4-Web-Application", file: "Week4-Web-Application.pdf" }
      ]
    },
    {
      number: 5,
      week: 5,
      slug: "chapter5",
      title: "Week 5: Web Application Scanners",
      titleZh: "Web 应用扫描器",
      shortTitle: "Web Scanners",
      summary: "Automated discovery of web flaws: scanner architecture, fuzzing, authenticated scanning, triaging false positives, and turning findings into a report.",
      summaryZh: "自动发现 Web 漏洞：扫描器架构、模糊测试、认证扫描、误报分流，以及把发现整理成报告。",
      status: "Week 5 built from lecture material",
      concepts: ["vulnerability scanners","fuzzing","false positives","authenticated scanning","severity scoring","remediation reporting"],
      conceptsZh: ["漏洞扫描器","模糊测试","误报","认证扫描","严重性评分","修复报告"],
      materials: [
        { label: "Week5-Web-Application-Scanners", file: "Week5-Web-Application-Scanners.pdf" }
      ]
    },
    {
      number: 6,
      week: 6,
      slug: "chapter6",
      title: "Week 6: Linux OS Introduction",
      titleZh: "Linux 操作系统入门",
      shortTitle: "Linux OS",
      summary: "The Linux security model: filesystem layout, users and permissions, setuid binaries, processes and services, and the classic privilege-escalation paths.",
      summaryZh: "Linux 安全模型：文件系统布局、用户与权限、setuid 二进制、进程与服务，以及经典的权限提升路径。",
      status: "Week 6 built from lecture material",
      concepts: ["filesystem hierarchy","file permissions","setuid & setgid","users & groups","processes and services","privilege escalation","log analysis"],
      conceptsZh: ["文件系统层次结构","文件权限","setuid 与 setgid","用户与组","进程与服务","权限提升","日志分析"],
      materials: [
        { label: "Week6-Linux-OS-Introduction", file: "Week6-Linux-OS-Introduction.pdf" }
      ]
    },
    {
      number: 7,
      week: 8,
      slug: "chapter7",
      title: "Week 8: Android Overview and Security Model",
      titleZh: "Android 概览与安全模型",
      shortTitle: "Android Security",
      summary: "The Android platform and its defences: the application sandbox, the permission model, APK structure, inter-process communication and the mobile attack surface.",
      summaryZh: "Android 平台及其防御机制：应用沙箱、权限模型、APK 结构、进程间通信，以及移动端攻击面。",
      status: "Week 8 built from lecture material",
      concepts: ["Android architecture","app sandbox","permission model","APK internals","intents & IPC","rooting","mobile attack surface"],
      conceptsZh: ["Android 架构","应用沙箱","权限模型","APK 内部结构","Intent 与 IPC","root 提权","移动攻击面"],
      materials: [
        { label: "Week8-Android-Overview-and-Security-Model-1", file: "Week8-Android-Overview-and-Security-Model-1.pdf" }
      ]
    }
  ]
};
