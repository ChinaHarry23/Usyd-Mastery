{
  nodes: [
    ["w1-castle-model", 1, 1, "Castle Model of Security",
      "The deck's opening analogy: something valuable is inside — money, data, secrets, reputation — so keep trusted people in and keep attackers out by building higher walls and making access harder. A perfectly closed castle is secure and useless, and the moment we add access we also create risk.",
      "../chapters/chapter1/web/chapter1-study.html#sec-castle"],

    ["w1-attack-surface", 1, 2, "Every Door Is an Attack Surface",
      "Walls, gates, patrolling guards and trusted people each buy something and each miss something: every door you have to add is a control point and an attack surface at the same time. There is no single castle any more — a request crosses trust boundaries from customer device to network to service to data store, and the backup path is another way in.",
      "../chapters/chapter1/web/chapter1-study.html#sec-castle"],

    ["w1-defence-in-depth", 1, 1, "Defence in Depth",
      "No single control protects the whole system, so you add layers, grouped in the deck as protect who gets in (identity, authentication, least privilege, segmentation), protect what matters (encryption in transit and at rest, integrity checks, controlled change) and watch what happens (logging, monitoring, intrusion detection and response). Security also involves trade-offs, because more security can affect usability and convenience.",
      "../chapters/chapter1/web/chapter1-study.html#sec-depth"],

    ["w1-weakest-link", 1, 2, "Weakest Link and the Barrel",
      "A system is only as secure as its weakest point, so effort belongs on the shortest board rather than on the boards that already look tall. The deck's chain is People → Devices → Networks → Software → Data, and an attacker only needs one stave to be shorter than the rest.",
      "../chapters/chapter1/web/chapter1-study.html#sec-depth"],

    ["w1-cia-triad", 1, 1, "CIA Triad",
      "The three security objectives and the question each asks: confidentiality (only authorised parties can read or use something — who is allowed to see this?), integrity (information stays correct and trustworthy, changes authorised and detectable — has the information been changed?) and availability (systems and information are accessible when needed — can I access it when I need it?). The attack mirror image is the DAD triad — disclosure, alteration, destruction — and CIA is necessary but not sufficient: authenticity, non-repudiation, privacy and safety also matter.",
      "../chapters/chapter1/web/chapter1-study.html#sec-cia"],

    ["w1-risk-formula", 1, 2, "Risk = Threat × Vulnerability × Impact",
      "Risk is the combination of how likely harm is with how bad it would be, written in Week 1 as Risk = Threat × Vulnerability × Impact, alongside exact definitions of asset, threat, threat actor, vulnerability and impact. Read it as a product, not a sum: if any factor is zero the risk collapses — no threat means nothing to fear, no vulnerability means nothing to exploit, no impact means nothing at stake.",
      "../chapters/chapter1/web/chapter1-study.html#sec-risk"],

    ["w1-threat-actors", 1, 2, "Threat Actors: Goal and Capability",
      "The person or group behind a threat, distinguished by what they want and what they can do: skimmers and shoulder surfers after card data and PINs, insiders abusing trusted access, remote hackers intercepting traffic or reusing leaked credentials, social engineers exploiting trust and time pressure, and organised crime or nation-state groups with funded tooling and supply-chain access.",
      "../chapters/chapter1/web/chapter1-study.html#sec-risk"],

    ["w1-system-model", 1, 2, "Modelling the System (Step 1)",
      "Step 1 of the deck's ATM exercise: name the components (ATM, card reader, keypad, cash dispenser, network, bank server, account database), the actors (customer, bank, maintenance and cash-replenishment staff), the environment and the trust assumptions (server secure, network protected, software correct). The question that earns marks is what have we assumed, and what changes if the assumption is false.",
      "../chapters/chapter1/web/chapter1-study.html#sec-model"],

    ["w1-threat-modelling", 1, 3, "Five-Step Threat Modelling",
      "The deck's five steps: model the system, model how it is supposed to work before, during and after the transaction, think like an attacker about what could go wrong at each stage, define what must be protected in CIA terms, and know your attacker. Defender thinking runs alongside it — what are we protecting, what can we do (Prevent → Detect → Recover), and what is assumed.",
      "../chapters/chapter1/web/chapter1-study.html#sec-model"],

    ["w1-bybit-case", 1, 2, "Bybit: A Falsified Approval Screen",
      "In 2025 roughly US$1.4 billion left Bybit in minutes with no cryptography broken: attackers presented a falsified approval interface, staff approved without independently re-checking the underlying message, and the cold wallet signed without re-displaying what it was signing. It is an integrity and authenticity failure of the approval path, answered by what-you-see-is-what-you-sign display at the component that actually signs, plus a second independent approver.",
      "../chapters/chapter1/web/chapter1-study.html#sec-bybit"],

    ["w1-security-lifecycle", 1, 2, "Security Lifecycle",
      "Security does not end at launch. Before deployment: define the goals and security properties, build securely, and audit human factors as well as code. After deployment: monitor with intrusion detection and keep searching for vulnerabilities. After an incident: contain the damage, recover services, investigate and learn — security is never finished, we build, watch, respond, learn and improve.",
      "../chapters/chapter1/web/chapter1-study.html#sec-lifecycle"],

    ["w1-security-controls", 1, 2, "Security Controls: Prevent, Detect, Recover",
      "A security control (or countermeasure) is anything that reduces risk by preventing, detecting, correcting or recovering from an unwanted event, with the deck's defender shorthand Prevent → Detect → Recover; standards add deterrent and compensating functions. Controls are also classified by category as technical (logical), administrative (operational) or physical, and a control is only a control if it is attached to a risk.",
      "../chapters/chapter1/web/chapter1-study.html#sec-controls"],

    ["w1-nist-csf", 1, 3, "NIST Cybersecurity Framework 2.0",
      "The framework's six functions: Govern at the centre of the 2024 revision — risk strategy, roles, policy and supply-chain risk — with Identify, Protect, Detect, Respond and Recover around it. It is voluntary and outcome-based, describing what an organisation should be able to do rather than which product to buy, and it defines profiles (current and target) and tiers from Partial to Adaptive.",
      "../chapters/chapter1/web/chapter1-study.html#sec-csf"]
  ],
  edges: [
    ["w1-castle-model", "w1-attack-surface", 8],
    ["w1-castle-model", "w1-defence-in-depth", 7],
    ["w1-attack-surface", "w1-threat-modelling", 7],
    ["w1-defence-in-depth", "w1-weakest-link", 8],
    ["w1-defence-in-depth", "w1-security-controls", 7],
    ["w1-weakest-link", "w1-bybit-case", 6],
    ["w1-cia-triad", "w1-risk-formula", 7],
    ["w1-cia-triad", "w1-bybit-case", 7],
    ["w1-risk-formula", "w1-threat-actors", 7],
    ["w1-risk-formula", "w1-security-controls", 6],
    ["w1-threat-actors", "w1-threat-modelling", 7],
    ["w1-system-model", "w1-threat-modelling", 9],
    ["w1-system-model", "w1-bybit-case", 7],
    ["w1-threat-modelling", "w1-bybit-case", 6],
    ["w1-security-controls", "w1-security-lifecycle", 7],
    ["w1-security-lifecycle", "w1-nist-csf", 8]
  ]
}
