window.INFO5995_SITE = {
  courseCode: "INFO5995",
  courseName: "Cybersecurity",
  courseNameZh: "网络安全",
  term: "S2 2026",
  subtitle: "Security fundamentals, AI-assisted vulnerability discovery, mobile security, cryptography from AES to PKI, secure communications, and software and system security — built from the S2 2026 decks and NIST references.",
  subtitleZh: "安全基础、AI 辅助漏洞发现、移动安全、从 AES 到 PKI 的密码学、安全通信，以及软件与系统安全——基于 2026 年第二学期讲义与 NIST 参考资料构建。",
  chapters: [
    {
      number: 1,
      week: 1,
      slug: "chapter1",
      title: "Week 1: Introduction to Cybersecurity Basics",
      titleZh: "网络安全基础导论",
      shortTitle: "Cybersecurity Basics",
      summary: "What security actually protects, the CIA triad and risk language, the threat landscape, the NIST Cybersecurity Framework, and defence in depth.",
      summaryZh: "安全究竟在保护什么、CIA 三要素与风险语言、威胁态势、NIST 网络安全框架，以及纵深防御。",
      status: "Week 1 built from lecture material",
      concepts: ["CIA triad","risk = threat x vulnerability x impact","threat actors","NIST CSF","defence in depth","security controls","security careers"],
      conceptsZh: ["CIA 三要素","风险 = 威胁 × 脆弱性 × 影响","威胁行为者","NIST CSF","纵深防御","安全控制措施","网络安全职业方向"],
      materials: [
        { label: "Week1-Introduction-Cybersecurity-Basics", file: "Week1-Introduction-Cybersecurity-Basics.pdf" }
      ]
    },
    {
      number: 2,
      week: 2,
      slug: "chapter2",
      title: "Week 2: AI-Assisted Vulnerability Discovery",
      titleZh: "AI 辅助漏洞发现",
      shortTitle: "AI-Assisted Discovery",
      summary: "Using static analysis, fuzzing and large language models to find vulnerabilities — and why a human still has to verify every finding.",
      summaryZh: "利用静态分析、模糊测试与大语言模型来发现漏洞——以及为什么每一条发现仍必须由人工验证。",
      status: "Week 2 built from lecture material",
      concepts: ["static analysis","fuzzing","LLM code review","prompt design","false positives","human validation","responsible AI use"],
      conceptsZh: ["静态分析","模糊测试","LLM 代码审查","提示词设计","误报","人工验证","负责任地使用 AI"],
      materials: [
        { label: "Week2-AI-Assisted-Vulnerability-Discovery", file: "Week2-AI-Assisted-Vulnerability-Discovery.pdf" }
      ]
    },
    {
      number: 3,
      week: 3,
      slug: "chapter3",
      title: "Week 3: Mobile Security",
      titleZh: "移动安全",
      shortTitle: "Mobile Security",
      summary: "The mobile threat landscape, how Android and iOS isolate applications, app analysis and reverse engineering, and where mobile data leaks.",
      summaryZh: "移动威胁态势、Android 与 iOS 如何隔离应用、应用分析与逆向工程，以及移动数据在哪些环节泄露。",
      status: "Week 3 built from lecture material",
      concepts: ["mobile attack surface","app sandbox","permissions","app stores","APK reverse engineering","secure storage","mobile malware"],
      conceptsZh: ["移动攻击面","应用沙箱","权限","应用商店","APK 逆向工程","安全存储","移动恶意软件"],
      materials: [
        { label: "Week3-Mobile-Security", file: "Week3-Mobile-Security.pdf" }
      ]
    },
    {
      number: 4,
      week: 4,
      slug: "chapter4",
      title: "Week 4: Cryptography Basics Part 1",
      titleZh: "密码学基础（上）",
      shortTitle: "Cryptography Part 1",
      summary: "Confidentiality from first principles: symmetric encryption, AES internals, block cipher modes, key distribution and cryptographic hash functions.",
      summaryZh: "从基本原理理解机密性：对称加密、AES 内部结构、分组密码工作模式、密钥分发与密码学哈希函数。",
      status: "Week 4 built from lecture material",
      concepts: ["confidentiality","symmetric encryption","AES","block cipher modes","IVs & nonces","key distribution","hash functions"],
      conceptsZh: ["机密性","对称加密","AES","分组密码工作模式","IV 与 nonce","密钥分发","哈希函数"],
      materials: [
        { label: "Week4-Cryptography-Basics-Part1", file: "Week4-Cryptography-Basics-Part1.pdf" }
      ]
    },
    {
      number: 5,
      week: 5,
      slug: "chapter5",
      title: "Week 5: Cryptography Basics Part 2",
      titleZh: "密码学基础（下）",
      shortTitle: "Cryptography Part 2",
      summary: "Public-key cryptography: RSA and Diffie-Hellman, digital signatures, certificates and PKI, and message authentication with HMAC.",
      summaryZh: "公钥密码学：RSA 与 Diffie-Hellman、数字签名、证书与 PKI，以及使用 HMAC 进行消息认证。",
      status: "Week 5 built from lecture material",
      concepts: ["public-key cryptography","RSA","Diffie-Hellman","digital signatures","X.509 certificates","PKI","HMAC"],
      conceptsZh: ["公钥密码学","RSA","Diffie-Hellman","数字签名","X.509 证书","PKI","HMAC"],
      materials: [
        { label: "Week5-Cryptography-Basics-Part2", file: "Week5-Cryptography-Basics-Part2.pdf" }
      ]
    },
    {
      number: 6,
      week: 6,
      slug: "chapter6",
      title: "Week 6: Applied Cryptography and Secure Communications",
      titleZh: "应用密码学与安全通信",
      shortTitle: "Applied Cryptography",
      summary: "Putting primitives to work: the TLS handshake, digital identity and authentication, NIST digital identity guidance, and cloud key management.",
      summaryZh: "把密码原语投入实用：TLS 握手、数字身份与身份认证、NIST 数字身份指南，以及云密钥管理。",
      status: "Week 6 built from lecture material",
      concepts: ["TLS handshake","certificate chains","digital identity","authentication & MFA","NIST SP 800-63","cloud security pillar","key lifecycle"],
      conceptsZh: ["TLS 握手","证书链","数字身份","身份认证与 MFA","NIST SP 800-63","云安全支柱","密钥生命周期"],
      materials: [
        { label: "Week6-Applied-Cryptography-and-Secure-Communications", file: "Week6-Applied-Cryptography-and-Secure-Communications.pdf" }
      ]
    },
    {
      number: 7,
      week: 7,
      slug: "chapter7",
      title: "Week 7: Secure Network, TCP/UDP, TLS and HTTPS",
      titleZh: "安全网络、TCP/UDP、TLS 与 HTTPS",
      shortTitle: "Secure Networking",
      summary: "Protocol-level security: what TCP and UDP expose, how TLS 1.3 closes the gaps, deploying HTTPS correctly, and the anatomy of a man-in-the-middle.",
      summaryZh: "协议层安全：TCP 与 UDP 暴露了哪些风险、TLS 1.3 如何弥补这些缺口、如何正确部署 HTTPS，以及中间人攻击的完整剖析。",
      status: "Week 7 built from lecture material",
      concepts: ["TCP & UDP security","TLS 1.3","HTTPS & HSTS","man-in-the-middle","certificate validation","network segmentation","protocol downgrade"],
      conceptsZh: ["TCP 与 UDP 安全","TLS 1.3","HTTPS 与 HSTS","中间人攻击","证书校验","网络分段","协议降级"],
      materials: [
        { label: "Week7-Secure-Network-UDP-TCP-TLS-HTTPS", file: "Week7-Secure-Network-UDP-TCP-TLS-HTTPS.pdf" }
      ]
    },
    {
      number: 8,
      week: 8,
      slug: "chapter8",
      title: "Week 8: Software and System Security",
      titleZh: "软件与系统安全",
      shortTitle: "Software & System Security",
      summary: "Building and running software securely: the secure development lifecycle, the OWASP Top 10, secure coding, hardening and incident response.",
      summaryZh: "安全地构建与运行软件：安全开发生命周期、OWASP Top 10、安全编码、系统加固与事件响应。",
      status: "Week 8 built from lecture material",
      concepts: ["secure SDLC","OWASP Top 10","secure coding","input validation","system hardening","vulnerability management","incident response"],
      conceptsZh: ["安全 SDLC","OWASP Top 10","安全编码","输入验证","系统加固","漏洞管理","事件响应"],
      materials: [
        { label: "Week8-Software-and-System-Security", file: "Week8-Software-and-System-Security.pdf" }
      ]
    }
  ]
};
