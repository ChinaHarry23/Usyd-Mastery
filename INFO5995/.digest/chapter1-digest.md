# INFO5995 — Chapter 1 Digest: Introduction to Cybersecurity Basics

Sources read in full (847 + 598 lines, both pages read end to end with the read tool, in chunks, including the JSON payloads of every interactive widget and the full SVG string of the NIST CSF hotspot):

- `chapters/chapter1/web/chapter1-study.html` — "Week 1: Introduction to Cybersecurity Basics" — built "from the Week 1 lecture deck (*Introduction to Cybersecurity*) and the NIST Cybersecurity Framework reference".
- `chapters/chapter1/web/chapter1-math.html` — "Foundations — Week 1" — subtitle "Foundations: the arithmetic behind security decisions"; chips: "Definitions verified against the Week 1 deck", "Formulas from standard NIST risk and detection practice", "Worked numbers you can reproduce by hand".

Everything below is drawn from those two pages. Where the page prints a rounded value that differs slightly from exact arithmetic, the page's figure is given first and the recomputation is flagged explicitly in a note.

---

## 1. SECTION-BY-SECTION FACTS

### chapter1-study.html

#### `#hero` — Overview (hero section, `data-track="hero"`)
- Course label reads **"INFO5995 — Cybersecurity"**; page title **"Week 1: Introduction to Cybersecurity Basics"**.
- Hero subtitle: "What security actually protects, the CIA triad and risk language, the threat landscape, the NIST Cybersecurity Framework, and defence in depth."
- Four hero cards, exactly: "From castles to firewalls"; "Confidentiality, integrity, availability"; "Risk = threat × vulnerability × impact"; "Layers of defence, weakest link".
- Provenance line: "Built from the Week 1 lecture deck (*Introduction to Cybersecurity*) and the NIST Cybersecurity Framework reference".
- Two onward buttons: "📐 Foundations →" (`chapter1-math.html`) and "🗺 Mind Map →" (`chapter1-mindmap.html`).
- Sidebar (`#sidebar`) lists twelve study sections (Overview, Castles to Firewalls, Defence in Depth, CIA Triad, Risk & Threat Actors, Modelling Systems, Bybit Case Study, Security Lifecycle, Security Controls, NIST CSF, Domains & Careers, Recap) plus links to Foundations, Mind Map, Quiz Hub and Flashcards; progress panel reads "Week Status" / "Lecture 1 built" at 100%.

#### `#sec-castle` — From Castles to Firewalls
- Section lead: "Week 1 opens with an analogy the rest of the unit keeps returning to: the castle. It explains both why security feels obvious and why it keeps failing."
- The old security idea, "in the deck's words": "something valuable is inside — money, data, secrets, reputation. So *keep trusted people in* and *keep attackers out*. Build higher walls and make access harder."
- Why the castle model works: "It gives you a boundary to defend, a list of things worth defending, and a simple success condition: nobody unauthorised gets in. Perimeter firewalls, network segmentation and physical access control are all direct descendants of the wall."
- Why it breaks immediately: "A perfectly closed castle is secure — and useless. People need to enter, information needs to leave, business needs to happen. **The moment we add access, we also create risk.** Every door is a control point and an attack surface at the same time."
- Mapping table (five rows, four columns):
  1. High walls → perimeter firewall, network segmentation → keeps unsolicited traffic away from internal services → misses "anything already inside, and any allowed path out".
  2. Gate and guard → authentication and access control → only identified, authorised users get in → "stolen or guessed credentials arrive as a legitimate user".
  3. The door you had to add → an exposed service, API or admin console → makes the system useful → "it is now reachable by people you have never met".
  4. Guards patrolling inside → logging, monitoring, intrusion detection → notices behaviour credentials alone cannot justify → "only useful if somebody reads and acts on the alerts".
  5. "Trusted people" → least privilege, separation of duties, insider-threat programmes → limits what any single person can do alone → "trust is an assumption; the deck asks what happens if it is wrong".
- Two questions the walls cannot answer (insight box): "*What about someone already inside?*" and "*What if we trust the wrong person?*" — "Both are failures of authorisation rather than of the perimeter — and both are exactly what the Bybit case later in this page demonstrates."
- Figure (SVG `arch-diagram`, ARIA label "A modern service path: customer device to network to service to data store to backup, with a trust boundary crossed twice"): nodes **Customer device** (phone · laptop · ATM) → **Network path** (Wi-Fi · ISP · TLS session) → **Service** (bank · shop · cloud API) → **Data store** (accounts · records · keys), with **Backup** below the data store; two red dashed **trust boundary** lines (before the network path and before the data store); caption text on the figure: "Every hop helps the system work — and every hop can be attacked". Caption below: "Today there is no single castle. Data moves through many connected systems, and each connection is simultaneously a capability and a risk. The same request crosses two trust boundaries before it reaches the data store, and the backup path is another way in — or the way back after an incident."
- Quick check (interactive `#ix-castle`): correct answer is "Adding access creates risk, so risk has to be managed rather than eliminated"; the distractor "Security means removing all access until nothing can get in" is rejected because "a system nobody can use is not a security success".

#### `#sec-depth` — Defence in Depth and the Weakest Link
- Three "why" cards: **Protect who gets in** (identity, authentication, least privilege; segmentation of networks and accounts); **Protect what matters** (encryption of data in transit and at rest; integrity checks and controlled change); **Watch what happens** (logging and monitoring; intrusion detection and response).
- The five staves / chain: **People → Devices → Networks → Software → Data**. "Security is end to end, and an attacker only needs one stave to be shorter than the rest." The animated barrel (`#ix-barrel`) visualises this.
- Layer table (Layer / representative controls / typical failure / how you would notice):
  - **People**: awareness training, phishing-resistant MFA, least privilege, separation of duties, verification procedures | social engineering, a rushed approval, an insider abusing trusted access | "behaviour that is legal for the account but wrong for the task".
  - **Devices**: patching, endpoint protection, disk encryption, secure boot, mobile device management | an unpatched or lost device becoming the entry point | asset inventory drift; missing patches; unexpected outbound traffic.
  - **Networks**: segmentation, firewall rules, TLS everywhere, intrusion detection and prevention | "flat networks where one compromised host reaches everything" | lateral movement and unusual connection patterns in flow logs.
  - **Software**: secure coding practice, code review, static and dynamic analysis, fuzzing (Week 2) | injection, broken access control, unvalidated input | findings from scanning and testing before release, not after.
  - **Data**: access control, encryption at rest, backups, retention limits, integrity monitoring | exfiltration; silent modification; ransomware with no usable backup | volume anomalies, integrity-check failures, restore tests that fail.
- "Two rules to memorise": "*No single control protects the whole system* — so use layers. *A system is only as secure as its weakest point* — so spend effort on the shortest board, not on the boards that already look tall." Plus "the deck's fourth take-away: security involves trade-offs, because more security can affect usability and convenience."
- Quick check: strong network monitoring, hardened servers and full-disk encryption but a help desk that resets passwords after an unverified phone call → the correct statement is "The weakest link sets the practical security level, so the reset process is the priority".

#### `#sec-cia` — The CIA Triad: What Are We Protecting?
- Section lead: "Week 1 reduces 'what are we trying to protect?' to three properties and one question each. Every control you meet for the rest of the unit serves at least one of them."
- The three property cards and their exact questions:
  - **Confidentiality** — "Keep secrets secret. Only an authorised user can see a particular piece of data or use a particular service." Asks: "Who is allowed to see this?"
  - **Integrity** — "Keep information correct and trustworthy. No one can change it without permission." Asks: "Has the information been changed?"
  - **Availability** — "Keep systems working. The service is there when you need it." Asks: "Can I access it when I need it?"
- Definition box (quoted in full): "**The CIA triad** is the standard vocabulary for security objectives: **confidentiality** (only authorised parties can read or use something), **integrity** (information stays correct and trustworthy, and changes are authorised and detectable) and **availability** (systems and information are accessible when needed). The mirror image used for attacks is the **DAD triad**: disclosure, alteration, destruction."
- Property table (Property / question / attacked by DAD / representative controls / Week 1 example):
  - Confidentiality | Who is allowed to see this? | Disclosure | access control, encryption in transit and at rest, need-to-know, key management | "Card details read by a skimmer; an unencrypted database dump".
  - Integrity | Has the information been changed? | Alteration | digital signatures and MACs, checksums, append-only logs, dual control, independent verification | "A withdrawal amount altered in flight; audit records edited afterwards".
  - Availability | Can I access it when I need it? | Destruction / denial | redundancy, tested backups, rate limiting, denial-of-service protection, capacity planning | "Ransomware encrypting a server; flooding the public site".
- Insight box: "confidentiality, integrity and availability are necessary but not sufficient. Security also cares about *authenticity* (is this really from who it claims?), *non-repudiation* (can the action be denied later?) and, increasingly, *privacy* and *safety*." Also the trade-off: "the three properties pull against each other — aggressive availability (open, replicated access) usually costs confidentiality."
- Quick check: Bybit attackers never read the cold wallet's secrets; the correct answer is "Integrity: the approval and the transaction details were falsified" — reading secrets would be the disclosure case.

#### `#sec-risk` — Risk: Threat, Vulnerability, Impact
- Section lead: "Security is not a binary. Week 1 gives you the vocabulary to say *how much* risk a system carries, and then to argue about which risk to treat first."
- Definition box, "The words that must be exact": "**Asset** — something worth protecting (data, money, reputation, a service people depend on). **Threat** — a circumstance or actor with the potential to cause harm. **Threat actor** — the person or group behind it. **Vulnerability** — a weakness that a threat can exploit. **Impact** — how much harm results if it succeeds. **Risk** — the combination of how likely that is and how bad it would be."
- The working formula (theorem box): `Risk = Threat × Vulnerability × Impact`. "Read it as a product, not a sum: if any factor is zero the risk collapses. No threat means nothing to fear; no vulnerability means nothing to exploit; no impact means nothing at stake. Standards such as NIST SP 800-30 express the same idea as a function of likelihood and impact; the Foundations page works the arithmetic, including annualised loss and the cost of a control."
- Risk chart (`#ix-race-risk`, "Illustrative risk scores: threat × vulnerability × impact", "Teaching values for comparison and argument — not measured data", max 60):
  - Unpatched internet-facing service — "3 × 4 × 5 = 60"
  - Phishing a help-desk credential — "4 × 3 × 4 = 48"
  - Falsified approval request (Bybit pattern) — "2 × 4 × 5 = 40"
  - Lost unencrypted laptop — "3 × 3 × 3 = 27"
  - Physical skimmer on a card reader — "2 × 3 × 4 = 24"
  - Denial of service on the public site — "3 × 2 × 3 = 18"
- Threat-actor table (Threat actor / what they want / what they can do / where Week 1 meets them):
  - **Skimmer** | money and card data | physical access to the ATM or its card reader | ATM modelling, Step 5: know your attacker.
  - **Shoulder surfer** | a PIN or a password | observe a user at the machine or on camera | ATM modelling; the case for privacy shields and PIN hygiene.
  - **Insider** | money, account access, revenge, or simply an easier path | abuse trusted access, change logs, act after hours | "What about someone already inside?"
  - **Remote hacker** | account access, disruption, resale value | intercept network traffic, exploit exposed software, reuse leaked credentials | ATM Step 3: what if the request is changed in flight?
  - **Social engineer** | whatever the person in front of them can authorise | create convincing screens, calls and personas; exploit trust and time pressure | the Bybit case: a fake approval screen, clicked without independent verification.
  - **Organised crime and nation-state groups** | scale: revenue, espionage, disruption | funded tooling, patience, supply-chain access, zero-day capability | the same modelling steps, with more capable assumptions.
- Four risk treatments (callout): "**mitigate** it with a control, **transfer** it (insurance), **avoid** it by not doing the activity, or **accept** it knowingly. Choosing between them is a business decision informed by the numbers on the Foundations page — not a purely technical one."
- Quick check: clinic with low vulnerability (prompt patching), high impact and high threat → "Risk is material, so prevention must be paired with detection, tested backups and recovery"; the rejected options are "risk is low because vulnerability is low" and "risk is negligible because all three factors must be high at the same time".

#### `#sec-model` — Modelling the System: Think Like Both Sides
- Section lead: "Before you can defend anything you have to say what it is. The deck's five-step ATM exercise is the template for the whole unit's threat modelling."
- Think like an attacker: "**What do they want?** Money, data, disruption"; "**What can they do?** Steal a password, trick a user, exploit software, act as an insider"; "**Which assumption breaks?** Attackers look for assumptions they can break".
- Think like a defender: "**What are we protecting?** People, systems, data"; "**What can we do?** Prevent → Detect → Recover"; "**What is assumed?** Every security model starts with assumptions — what if one is wrong?"
- The five steps, in the order the ordering widget (`#ix-model-seq`) requires:
  1. "Model the system: components, actors, environment and trust assumptions"
  2. "Model how the system is supposed to work, before, during and after the transaction"
  3. "Think like an attacker: at each stage, what could go wrong?"
  4. "Define what must be protected: confidentiality, integrity and availability"
  5. "Know your attacker: who they are, what they can do and what they want"
- ATM table highlights (Step / what the exercise produces / the question that earns marks):
  - Step 1 components: ATM, card reader, keypad, cash dispenser, network, bank server, account database; actors: customer, bank, maintenance and cash-replenishment staff; environment: public location, bank network; trust assumptions: server secure, network protected, software correct.
  - Step 2 intended behaviour: before — "the card is checked and the PIN verified securely"; during — "the bank approves the withdrawal and the correct amount is released"; after — "the transaction is recorded and the session ends safely".
  - Step 3 attacker view: before — fake or stolen card, stolen PIN; during — the withdrawal request is changed, or too much cash is released; after — logs are changed or deleted, or the previous session stays open.
  - Step 4 protected properties: confidentiality = PIN and card details; integrity = transaction amounts and account balances; availability = the ATM is there when customers need it.
  - Step 5 attacker list: skimmer, shoulder surfer, insider, remote hacker — "with different capabilities (physical access, observation, trusted access, network interception) and different goals (money, card data, account access, disruption)".
- Worked example (`#sol-1`, university results portal with SSO and a staff grade-entry console): components student browser, identity provider, portal application, grade database, staff console, nightly backup; actors students, teaching staff, professional staff, identity team, outsourced hosting provider; trust assumptions include "the identity provider authenticates correctly; only the unit coordinator can enter grades for that unit; the hosting provider's administrators cannot read the database". Attack ideas named: phishing a coordinator's credentials, an insecure direct object reference, a grade changed with the audit trail edited, a console session left open, the backup read by someone who should not have it. Attacker set: curious student (low capability, high motivation, inside the trust boundary as a legitimate user), credential thief (medium capability, targets staff), insider with console access (high capability, low detectability), opportunist scanning for exposed services (low effort, broad reach).
- Quick check: the correct reason for modelling the system before attacks is "Because attacks are only meaningful against a stated set of components, actors and trust assumptions".

#### `#sec-bybit` — Case Study: The $1.4 Billion Mistake
- Section lead: "In 2025, thieves took roughly US$1.4 billion from Bybit in a matter of minutes. No cryptography was broken. A screen was falsified and a human approved it."
- Timeline widget (`#ix-bybit-timeline`, "How the Bybit loss unfolded — the deck's walkthrough of the approval chain, stage by stage"):
  1. **Request** — "A routine-looking request": the approval interface shows an ordinary transfer — "the deck's example is 'send 10 USD to Alice'" — and asks a member of staff to approve it.
  2. **Fake screen** — "The screen is not what it claims": "the attackers present a falsified interface. What the staff see is not the transaction that will actually be signed and executed."
  3. **Approve** — "Staff click approve": "Admins relied on the user interface and did not independently re-check the underlying message, so the malicious request is authorised."
  4. **Sign** — "The cold wallet signs without re-displaying": "System 2 — the cold wallet with its aggregate-signature process — did not check again and display what it was signing. This is the missing second layer of validation."
  5. **Transfer** — "Funds move in minutes": "the deck's headline figure is US$1.4 billion, given on the loss slide as US$1,500,000,000."
  6. **Aftermath** — "What the case shows": "Even the biggest companies can make mistakes, and people can be tricked. Security therefore means protecting both the technology and the people who use it."
- System model ("the deck's Case Study 2"): assets — cold-wallet funds, worth billions of dollars; components — System 1, the UI for transaction approval, and System 2, the cold wallet with an aggregate-signature process; actors — Bybit staff approving requests and the cold-wallet system processing signatures; assumptions — "the UI shows accurate, verified details; signatures are only given for valid requests; staff follow verification procedures".
- Threat model: adversary type — "a social engineer who knows Bybit's processes"; capabilities — create fake approval screens, convince staff to approve malicious transactions; goals — obtain cold-wallet access and transfer the funds; attack vector — "fake UI request → staff click approve → the cold wallet signs without independent verification"; what it exploits — "human trust, plus the missing second-layer validation".
- Insight box, "The three assumptions that failed": "The UI was assumed to show the truth; the signer was assumed to verify what it signed; the staff were assumed to follow a procedure that included an independent check." Also: "the attack did not break any cryptography at all. The technical countermeasure has a name you will meet again in Weeks 5 and 6: *what you see is what you sign*, with the signed payload displayed by the component that actually signs, and a second, independent approver for high-value actions."
- Worked answer (`#sol-2`) step 3: the failure in CIA terms is "Not confidentiality and not availability: the property that failed is *integrity* — specifically the authenticity of the approval."
- Worked answer step 4, the four defensive layers: "(i) The signing component displays the decoded payload it is about to sign … what you see is what you sign. (ii) High-value transfers require two independent approvers who see the same decoded payload through separate channels. (iii) A destination allow-list and velocity limits bound the loss even when an approval is wrong. (iv) Immutable, out-of-band alerting turns a silent approval into a visible event within seconds."
- Closing lesson: "Every one of the four layers above is ordinary defensive engineering, and each one alone would have changed the outcome. … no single control protects the whole system, and the layer that was missing was a human-protecting control, not a cryptographic one."
- Quick check: the control that would most directly have defeated the attack is "Displaying and independently validating the decoded payload at the signing step"; stronger encryption is rejected because "the attack travelled through an authorised workflow", and a longer admin password is rejected because "the attackers used the approval process legitimately, with the credentials and roles it required".

#### `#sec-lifecycle` — Security Is a Lifecycle, Not a Launch
- Section lead: "The deck's second big idea: security does not end when a system is launched. It runs before deployment, after deployment, and after the incident — and then it starts again."
- The six-stage pipeline (`#ix-lifecycle-pipe`, "Six stages. Each one has its own activities, and the last one feeds the first"):
  - **Define** — "Set the goals and the security properties: what are we protecting, and what does 'secure' mean here?"
  - **Build** — "Best coding and implementation practice, plus a manual audit that covers human factors as well as code."
  - **Test** — "Search for weaknesses before release with static analysis, dynamic analysis and pattern-matching oracles."
  - **Monitor** — "Intrusion detection and prevention; vulnerability search against the running system, mostly by dynamic analysis."
  - **Respond** — "Contain the damage, recover services and investigate what happened — including tracing, freezing and legal steps."
  - **Learn** — "Post-mortem, disaster recovery and insurance: fix the weakness and feed the lesson into the next cycle."
- Phase table (Phase / activities in the deck / "Take away 2"):
  - **Before code deployment**: "Define the goals and security properties; follow best coding and implementation practice; run a manual audit that covers human factors, not only the code; search for vulnerabilities by pattern matching (an oracle), with static and dynamic analysis" → "*Build securely:* understand what matters → identify threats → test for weaknesses".
  - **After code deployment**: "Monitoring with intrusion detection and prevention; vulnerability search by pattern matching against the live system, mostly dynamic analysis; white-hat hacking that includes decompilation, fuzzing and AI-assisted search" → "*Watch and protect:* monitor the system → detect suspicious activity → patch and improve".
  - **After an incident**: "Post-mortem: reflect on what happened and how to prevent it next time. Disaster recovery: freezing money, tracing, insurance, legal steps" → "*Respond, then learn:* contain the damage → recover services → investigate → fix and feed the lesson back".
- Closing line quoted in a callout: "'Security is never finished. We build, watch, respond, learn and improve.' In a written answer, name the phase you are talking about — static analysis belongs before deployment, intrusion detection after it, and a post-mortem after the incident. Marks are lost by listing every technique in one undifferentiated paragraph."
- Quick check: static analysis before each release is pre-deployment; fuzzing and decompilation against the live production service are post-deployment.

#### `#sec-controls` — Security Controls: Prevent, Detect, Recover
- Section lead: "The defender's answer to 'what can we do?' is a control. Controls are classified twice: by what they do, and by what kind of thing they are."
- Definition box: "A **security control** (or countermeasure) is anything that reduces risk by preventing, detecting, correcting or recovering from an unwanted event. The deck's defender question is the shorthand: **Prevent → Detect → Recover**. Standards add two more functions — *deterrent* controls that discourage an attempt, and *compensating* controls that substitute for a control you cannot apply."
- Function table (Function / what it does / example / failure mode if it is the only control):
  - **Preventive** | stops the event happening | firewall rule, MFA, access control, input validation, disk encryption | "one bypass and there is nothing left to notice it".
  - **Detective** | notices that it happened, or is happening | IDS/IPS alerts, audit logs, integrity monitoring, alert triage | "you learn about the incident from a third party".
  - **Corrective** | limits or reverses the damage | account lockout, session revocation, patch deployment, quarantine | "containment becomes a manual scramble".
  - **Recovery** | restores service and data | tested backups, failover, disaster-recovery plan, tracing and fund freezing | "downtime and loss become permanent".
  - **Deterrent** | discourages an attempt | visible cameras, warning banners, legal agreements, prosecution | "deterrence is only as good as its credibility".
  - **Compensating** | substitutes for a control you cannot apply | extra monitoring where a legacy system cannot be patched | "risk is accepted with eyes open, not removed".
- By category: **Technical (logical)** — "implemented in hardware or software: firewalls, encryption, authentication, logging"; **Administrative (operational)** — "policy and people: training, procedures, separation of duties, risk assessment, incident plans"; **Physical** — "the built environment: locks, guards, privacy shields, cable protection, visitor escorts".
- Choosing a control: "A control is only a control if it is attached to a risk. Name the asset, the threat, the vulnerability it addresses and the property (C, I or A) it serves — then say what it costs in usability, money and attention."
- Matcher pairs (`#ix-control-match`), exact classifications:
  - "Firewall rule blocking inbound SMB traffic" → "Preventive · technical"
  - "Intrusion detection system" → "Detective · technical"
  - "Tested offline backups with a restore drill" → "Recovery · operational"
  - "Security awareness training" → "Preventive · administrative"
  - "PIN-pad privacy shield on an ATM" → "Preventive · physical"
  - "Cyber-insurance policy" → "Risk transfer · administrative"
  - "Displaying the decoded payload before signing" → "Preventive · technical and procedural"
  - "Incident post-mortem with tracked actions" → "Corrective · administrative"
- Worked example (`#sol-3`, small clinic with one server, a booking web app and a shared front-desk account): assets/properties — patient records (confidentiality, high), appointment and prescription data (integrity, high), the booking service itself (availability, high, "a clinic that cannot see its schedule still has to treat people"), plus reputation and legal obligations under privacy law; threats — ransomware crews targeting health providers, shared front-desk account destroying accountability, unpatched booking app, phishable staff; preventive layer — per-user accounts with MFA, patching, firewall limited to the ports the app needs, disk encryption, input validation and parameterised queries; detective/corrective layer — central logging with alerts on bulk record reads and after-hours logins, integrity monitoring, account lockout and session revocation, tested offline backups with one copy ransomware cannot reach from the network, plus a written one-page recovery procedure. Step 5: "A full security-operations centre is not proportionate for one clinic … This is the risk-treatment decision — and being able to state the trade-off is what separates a security argument from a shopping list of products."
- Quick check: a hospital that cannot patch a legacy imaging server isolates it on its own segment and adds monitoring → "A compensating control, supported by detective monitoring, with residual risk accepted".

#### `#sec-csf` — The NIST Cybersecurity Framework
- Section lead: "Week 1's lifecycle says what happens when. The NIST Cybersecurity Framework says what an organisation should be able to do at each point — and gives you a vocabulary for arguing about it."
- Hotspot diagram (`#ix-csf-hotspot`, "The six functions of NIST CSF 2.0"; subtitle "Govern sits at the centre of the 2024 revision; the five original functions form the cycle around it"). The injected SVG's own footer text reads: "NIST CSF 2.0 (2024) — six functions; CSF 1.1 (2018) had five, without Govern". Box labels in the SVG: IDENTIFY — "know what you have"; PROTECT — "reduce the chance of success"; DETECT — "shorten the time to notice"; RESPOND — "contain and communicate"; RECOVER — "restore and improve"; GOVERN (centre circle) — "strategy · roles · policy" and "supply chain"; arrows form the cycle Identify → Protect → Detect → Respond → Recover → Identify.
- The six functions with their hotspot detail and marker coordinates (x, y as % of the SVG):
  - **Identify** (50.0, 19.6) — "Know what you have and what matters: asset management, business context, risk assessment and risk strategy. Without an inventory and a system model you cannot tell what is exposed — this is the deck's Step 1 at organisational scale."
  - **Protect** (83.3, 43.7) — "Reduce the chance of success: identity management and access control, awareness training, data security, platform hardening, maintenance. The deck's 'protect who gets in' and 'protect what matters'."
  - **Detect** (70.6, 82.4) — "Shorten the time to notice: continuous monitoring, log and event analysis, intrusion detection, anomaly analysis. The deck's 'watch what happens'; the Foundations page shows why the precision of those alerts decides whether anyone acts on them."
  - **Respond** (29.4, 82.4) — "Contain and communicate: incident response planning, analysis, mitigation, reporting and coordination."
  - **Recover** (16.8, 43.7) — "Restore and improve: recovery planning, backups and restoration testing, plus the improvements that come out of the post-mortem. The deck's disaster-recovery list (freezing funds, tracing, insurance, legal) belongs here."
  - **Govern** (50.0, 54.3) — "Decide and oversee: risk management strategy, roles and responsibilities, policy, and supply-chain risk. Added in CSF 2.0 (2024) to make explicit what CSF 1.1 left implicit — that the human, organisational and regulatory layer is where the other five functions are funded and prioritised."
- Table (Function / question / example outcomes / Week 1 link): Govern — "How is risk decided, owned and overseen?" — risk strategy, roles, policy, supply-chain risk management — risk treatment decisions; Identify — "What do we have, and what matters?" — asset inventory, business context, risk assessment — Step 1; Protect — "How do we make success less likely?" — access control, training, data security, hardening — defence in depth, CIA; Detect — "How quickly would we know?" — continuous monitoring, detection processes, event analysis — "watch what happens"; Respond — "What do we do when it happens?" — response plan, analysis, mitigation, communication — contain, recover, investigate; Recover — "How do we get back, and get better?" — recovery planning, improvements, restoration testing — post-mortem and disaster recovery.
- Callout, "How to use the framework without over-claiming it": "The CSF is voluntary and outcome-based: it describes *what* an organisation should be able to do, not which product to buy, and it maps onto control catalogues such as NIST SP 800-53. It also defines *profiles* (a current profile and a target profile — useful for gap analysis) and *tiers* (1 Partial, 2 Risk Informed, 3 Repeatable, 4 Adaptive) that describe how rigorous and repeatable the risk practice is. Say that, rather than pretending it is a certification."

#### `#sec-careers` — Where This Leads: Domains, Roles and Responsible Practice
- Section lead: "Week 1 is the map for the rest of the unit. The deck's weekly topics are the domains; the roles below are where those domains are practised."
- Role cards (`#ix-careers-deck`, "Roles in the security lifecycle"), front → back + hint:
  - "Security operations analyst (SOC tiers 1–3)" → "Watches and triages alerts from monitoring and intrusion detection, decides what is a real incident, and escalates. The base-rate arithmetic on the Foundations page is the daily reality of this role." | hint "Detect · respond".
  - "Incident responder" → "Owns containment, recovery and investigation during an incident, then writes the post-mortem that changes the next cycle. Legal, insurance and tracing work sits alongside the technical response." | "Respond · recover".
  - "Penetration tester / red teamer" → "Authorised, scoped attempts to break a system using the same techniques an attacker would — reconnaissance, fuzzing, decompilation, AI-assisted discovery — followed by a report on what would have worked and why." | "Test, with written authorisation".
  - "Security engineer / architect" → "Designs the layered controls: identity, segmentation, key management, logging and detection coverage. Decides where another layer is worth its cost in money and usability." | "Protect".
  - "Application security engineer" → "Threat-models features before they are built, reviews code, and runs the static analysis and fuzzing pipeline that finds weaknesses before release rather than after." | "Build securely".
  - "Cryptographer / crypto engineer" → "Chooses and implements the primitives: AES modes, RSA and Diffie-Hellman parameters, TLS configuration, key rotation and PKI. This is Weeks 4 to 6 of the unit." | "Confidentiality · integrity".
  - "Governance, risk and compliance analyst" → "Turns frameworks such as the NIST CSF into controls, evidence and a risk register, and owns the human, organisational and regulatory layer…" | "Govern".
  - "Mobile and cloud security specialist" → "Applies the same model to a new attack surface: app sandboxes and permissions on mobile, and identity, key management and shared-responsibility boundaries in the cloud." | "Same model, new surface".
- Domain table (Domain / what it covers / where the deck introduces it): Foundations and threat modelling (CIA, risk, system and threat models, the lifecycle) — Week 1; AI-assisted vulnerability discovery (static analysis, fuzzing, LLM code review, human verification) — Week 2; Mobile security (attack surface, sandboxes, permissions, app analysis, responsible disclosure) — Weeks 2–3; Cryptography (symmetric and public-key primitives, hashes, signatures, PKI) — Weeks 4–5; Authentication, data and cloud security (digital identity, key management, cloud responsibility boundaries) — Week 6; Network, protocol and web security (TCP/UDP exposure, TLS, HTTPS deployment, denial of service) — Week 7; Software and system security (secure development, static and dynamic analysis, intrusion detection and prevention) — Week 8; Blockchain and DeFi security (smart-contract risk, front-running, custody) — Week 9; AI for security and security for AI (detection at scale, and the new attack surface of models) — Week 10; Human, organisational and regulatory (policy, compliance, ethics, disclosure and the law) — Week 11; Operating system, IoT and robotics security (the remaining domains, and where research is published) — Week 12.
- "Practice responsibly": "Every technique in this unit — fuzzing, decompilation, AI-assisted discovery, traffic interception — is a defensive tool in the right hands and an offence in the wrong ones. The working rule is authorisation: test only systems you own or have explicit written permission to test, keep within the agreed scope, and report what you find through a responsible-disclosure process rather than publishing it." The deck covers responsible disclosure in Week 3; "Nothing in these pages is exploit code or a target list, deliberately: the examinable skill is the model, the risk argument and the control selection."

#### `#sec-recap` — Week 1 Recap
- Four toolkit cards: "The castle became a network" (walls and gates assumed one boundary; modern systems have many connections, and every connection is both a capability and a risk); "Layers, and the shortest board" (no single control protects the whole system, and a system is only as secure as its weakest point: People, Devices, Networks, Software, Data); "CIA, and risk as a product" (confidentiality, integrity, availability; risk = threat × vulnerability × impact; threat actors differ in goal and capability); "Model, then cycle" (model the system before the attack, model intended behaviour before the failure, then build, watch, respond, learn — and map it to the NIST CSF functions).
- Check-yourself prompt: "Can you state the CIA questions, write the risk formula, run the five modelling steps on a system of your own, place six controls against the lifecycle, and name the six CSF functions?"
- Workshop preparation: "Bring one system you actually use — a share-house NAS, a club's booking site, a tutor's spreadsheet — and a one-page system and threat model for it. Specific components, actors and assumptions beat general themes."
- Next: "the Foundations page turns this week's vocabulary into definitions, the risk and detection arithmetic, an entropy primer and a modelling checklist. Then attempt the Quiz Hub and the Flashcards for Week 1."

### chapter1-math.html

#### `#sec-m-hero` — Foundations hero
- Tag "INFO5995 — Week 1 supplement"; title "Foundations: the arithmetic behind security decisions".
- Hero description: "Week 1 is mostly vocabulary, but every claim in it can be made quantitative: risk as a product, loss as an annualised expectation, password strength as entropy, detection as conditional probability, and defence in depth as a product over layers. This page pins down the definitions that must be exact, then works the numbers you can be asked to reproduce. The formulas are standard security and NIST material, not lecture notation — the deck argues in prose, and these equations are the revision aid that makes the argument checkable."
- Three chips: "Definitions verified against the Week 1 deck"; "Formulas from standard NIST risk and detection practice"; "Worked numbers you can reproduce by hand".
- TOC sidebar groups: Vocabulary (Definitions and notation; The CIA triad, stated precisely), Quantities (Risk arithmetic; Entropy, keyspace and guessing cost; Detection arithmetic & layer probability), Practice (Attacks & countermeasures; The modelling checklist).

#### `#sec-m-defs` — Definitions and notation
- Section lead: "Marks are lost on definitions more often than on ideas. Each of these should be writable in one sentence with the consequence included."
- Definition box (asset/threat/vulnerability/impact/risk): "An **asset** is something with value that needs protection. A **threat** is a circumstance or actor with the potential to cause harm; a **threat actor** is the agent behind it. A **vulnerability** is a weakness a threat can exploit. **Impact** is how much harm results if it does. **Risk** is the combination of how likely that is with how bad it would be."
- Definition box (exposure/attack surface/control): "**Exposure** is the state of being open to a threat (an internet-facing service is exposed; a patched, segmented one is less so). The **attack surface** is the sum of the ways an attacker can interact with the system — every port, account, input field, API, human process and supply chain. A **control** (countermeasure) is anything that reduces risk: preventive, detective, corrective, recovery, deterrent or compensating. The deck's shorthand is *Prevent → Detect → Recover*."
- Definition box, "Why 'risk = threat × vulnerability × impact' is a product": "Each factor is a gate. No threat means nothing to fear; no vulnerability means nothing to exploit; no impact means nothing at stake. That is why multiplying is the right shape for the qualitative model, and why a single zero should stop you writing a risk report."
- Term table (Term / must contain / common wrong answer):
  - Vulnerability | "A weakness that a threat can exploit" | "Confusing it with the threat itself, or with the impact of exploitation".
  - Risk | "Likelihood combined with impact, for a named asset" | "'A vulnerability' — risk is about the asset and the consequence, not the flaw alone".
  - Threat actor | "Goal plus capability" | "Assuming all attackers are equally capable, so all threats are equal".
  - Control | "Something that reduces a named risk, with a stated cost" | "Listing products instead of naming the risk each one reduces".
  - Defence in depth | "Multiple independent layers, assuming any one can fail" | "Claiming layers are additive when they actually fail together".
  - Attack surface | "Everything an attacker can interact with" | "Counting only the network ports and forgetting people and suppliers".
- Notation box: "The lecture is written in prose. The symbols below are a *revision aid* introduced here … they are not lecture notation and should not be quoted as such. Where a symbol clashes with a CIA initial, the context makes it clear."
- Symbol grid (13 rows): `A` asset value ("What the asset is worth, in money or in consequence (AV in classic risk analysis)"); `T` threat ("Threat level for this asset: how motivated and capable the relevant actors are (1–5 in the qualitative model)"); `V` vulnerability ("How easily the threat can succeed against this asset"); `I` impact ("Harm if the event occurs; also *I* for information in the CIA discussion, distinguished by context"); `R` risk ("The product T × V × I qualitatively, or a function of likelihood and impact"); `EF` exposure factor ("Fraction of the asset's value lost in one event, 0 ≤ EF ≤ 1"); `SLE` single loss expectancy ("Expected loss from one event: AV × EF"); `ARO` annualised rate of occurrence ("Expected number of events per year"); `ALE` annualised loss expectancy ("ARO × SLE, the yearly expected loss"); `H` entropy ("Uncertainty in bits; also the work factor of a guessing attack"); `π` base rate ("Prior probability that a given event is a genuine attack"); `Se, Sp` sensitivity, specificity ("True-positive and true-negative rates of a detector"); `PPV` precision ("Probability that a raised alert is real: Pr(attack | alert)"); `p_i, q_i` layer failure and success ("p_i is the probability layer i is bypassed; q_i = 1 − p_i is the probability it stops the attack").

#### `#sec-m-cia` — The CIA triad, stated precisely
- Section lead: "The deck gives each property a question. For a written answer, add the condition that makes the property testable."
- **Confidentiality is an authorisation property of reads**: `read(s,o) ⇒ auth(s,o)` — "A subject s may read an object o only if it is authorised for that object". Commentary: "Encryption is how you keep the property while the data is in transit or at rest; access control is how you keep it while the system is running."
- **Integrity is a property of writes**: `o → o′ ⇒ authorised(o → o′) ∧ logged(o → o′, who, when)`. Two consequences: "integrity is not only about preventing changes: it requires being able to *detect* them, which is what signatures, MACs and append-only logs provide (Weeks 4–5)"; and "'authorised' has to mean the authoriser saw what they were authorising — the what-you-see-is-what-you-sign requirement."
- **Availability is a ratio of uptime to total time**: `A = MTBF / (MTBF + MTTR)`. Worked example: MTBF = 2000 h and MTTR = 4 h give A = 2000/2004 = 0.9980, i.e. **99.80%** availability, "about 17.5 hours of downtime a year (0.002 × 8760)". "Halving the repair time to 2 hours raises availability to 99.90% and halves the downtime — which is why detection and response speed are availability controls, not just security theatre."
- Property table (formal statement / violated by DAD / detected by): Confidentiality — "Reads imply authorisation" — Disclosure — "Access logs, data-loss prevention, egress monitoring"; Integrity — "Writes imply authorisation and attribution" — Alteration — "Signatures and MACs, checksums, integrity monitoring, append-only logs"; Availability — "A = MTBF/(MTBF+MTTR) stays above target" — Destruction / denial — "Uptime monitoring, capacity alerts, restore drills".
- Insight box: "**Do not add the three properties into a single score and call it security.** A weighted sum S = w_C·C + w_I·I + w_A·A is a decision aid for comparing options, and the weights have to come from a risk assessment for a named asset. Two systems with the same S can have completely different failure modes — one leaks, one silently corrupts — and averages hide exactly the property that matters."
- Quick check: a system logs every change to a medical record but a clinician can edit without approval → "Integrity is only partly satisfied: changes are attributable but not authorised". The formal condition has two halves: authorised and attributable.

#### `#sec-m-risk` — Risk arithmetic
- Section lead: "Two models, one idea: risk is a quantity you can compare, budget against and reduce. The qualitative model ranks; the quantitative model prices."
- Qualitative model: `R = T × V × I, T, V, I ∈ {1, …, 5}`. "Standards such as NIST SP 800-30 write risk as a function of the likelihood of the event and its impact, R = f(L, I), with L itself driven by threat and vulnerability. The three-factor form is the practical version used in workshops: score each factor, multiply, sort the list, argue about the top of the list."
- Quantitative model: `SLE = AV × EF`, `ALE = ARO × SLE`. "ALE is the number a budget conversation needs. It is also a place to be honest about uncertainty: ARO is an estimate, and events are rarely independent."
- Worked example, "is the control worth buying?": "A clinic's records system has AV = $50,000 (hardware, records reconstruction, notification cost and lost appointments). Ransomware would destroy or lock about 40% of that in one event, and the clinic estimates 0.5 events per year at current defences." → `SLE = 50,000 × 0.4 = $20,000`, `ALE = 0.5 × 20,000 = $10,000 per year`. "A backup and recovery programme costing $3,000 per year reduces the exposure factor to 0.1" → `ALE_after = 0.5 × (50,000 × 0.1) = $2,500`, `saving = 10,000 − 2,500 = $7,500 > 3,000`. "The control is justified on the numbers alone, and the residual ALE of $2,500 is the risk the clinic still carries. If the same control had saved only $2,000 a year, the arithmetic would say no — and a regulatory obligation or a reputational argument would then have to be made explicitly rather than smuggled in as 'best practice'."
- Likelihood × impact matrix (3 × 3): High likelihood/Low impact = "Medium — monitor"; High/Medium = "High — mitigate this cycle"; High/High = "Critical — mitigate now, or avoid the activity"; Medium/Low = "Low — accept"; Medium/Medium = "Medium — mitigate when funded"; Medium/High = "High — mitigate with detective controls first"; Low/Low = "Low — accept, review annually"; Low/Medium = "Low — accept with monitoring"; Low/High = "Medium — transfer (insurance) and monitor".
- Callout, the four treatments applied to the same number: "Mitigate: spend $3,000 to cut ALE by $7,500 (the example above). Transfer: pay an insurer to carry the tail risk — which is the deck's insurance line in the post-incident phase. Avoid: stop holding the data at all, which is often the cheapest control available. Accept: record the number and the reason, so the decision is auditable. Every one of these is a governance decision, which is why *Govern* sits at the centre of the NIST CSF."
- Quick check: asset worth $80,000 losing 25% of value, succeeding 0.2 times a year → "SLE = 80,000 × 0.25 = $20,000, and ALE = 0.2 × 20,000 = $4,000 per year". Distractors are $20,000 (SLE only) and $16,000 (AV × rate, ignoring EF).
- Worked answer (`#sol-m1`), three-line risk register for a student club's WordPress site on shared hosting (member names, emails and dietary requirements; payments through a payment provider): avatar values — member contact data (personal information, privacy obligations, low direct cash value), payment integrity (provider holds the cards; club exposure is fraud disputes and chargebacks, "say AV = $10,000"), the site itself (availability matters during the enrolment window). Scores: (a) automated scanning and exploitation of an out-of-date plugin, T = 4, V = 4, I = 3 ⇒ 48; (b) phishing a committee member's admin login, T = 4, V = 3, I = 4 ⇒ 48; (c) shared-hosting neighbour compromise, T = 2, V = 2, I = 3 ⇒ 12. Prices: (a) EF = 0.3 of a $10,000 exposure → SLE = $3,000, ARO = 0.4 → ALE = $1,200; (b) SLE = $4,000, ARO = 0.3 → ALE = $1,200. Controls: automatic plugin updates plus a staging check (about 4 hours of volunteer time, "call it $400") cutting each ALE by 40% → "a saving near $960 for $400 spent"; two-factor authentication on the admin account (free, one hour to configure) "attacks (b) directly and is the highest value per dollar on the list". Residual: "roughly $1,000 a year of expected loss remains. The club accepts it, records the number, and reviews it if the site starts holding payment data directly."

#### `#sec-m-entropy` — Entropy, keyspace and guessing cost
- Section lead: "Confidentiality eventually rests on a secret that cannot be guessed. This is the one piece of mathematics that underpins every credential, key and token in the unit…"
- **Shannon entropy**: `H(X) = −Σ_{i=1..n} p_i log₂ p_i`. "If the value is uniform over N equally likely possibilities the sum collapses to H = log₂ N: one bit per halving of the search space, so a 4-digit PIN carries log₂ 10⁴ ≈ 13.3 bits."
- **Keyspace**: `H = L log₂ N (only if every character is independent and uniform)`. "Human-chosen passwords are neither uniform nor independent, which is why breach lists, dictionary rules and pattern masks beat the L log₂ N bound by orders of magnitude. A randomly generated password or passphrase does meet the assumption."
- Secret table (Secret / keyspace / entropy / exhaustive search at 10⁹ guesses/s):
  - 4-digit PIN | 10⁴ | 13.3 | microseconds
  - 8 lowercase letters | 26⁸ ≈ 2.1 × 10¹¹ | 37.6 | about 2 minutes
  - 8 characters, mixed case and digits | 62⁸ ≈ 2.2 × 10¹⁴ | 47.6 | about 2.5 days
  - 12 characters, mixed case and digits | 62¹² ≈ 3.2 × 10²¹ | 71.5 | about 100 000 years
  - 6 diceware words from 7776 | 7776⁶ ≈ 2.2 × 10²³ | 77.5 | about 7 million years
  - AES-128 key | 2¹²⁸ | 128 | not feasible
  - RSA-2048 modulus | "factoring, not enumeration" | "≈ 112-bit equivalent security" | "not feasible with known algorithms"
- **Guessing cost**: `t_worst = 2^H / r`, `t_expected ≈ 2^(H−1) / r`. "Doubling the length of a random password squares the keyspace and therefore *doubles* H; adding one character class multiplies the alphabet by a much smaller factor. That is why a 12-character random password beats an 8-character one with symbols." Two defences change r rather than H: "rate limiting and account lockout reduce attempts per second, and a deliberately slow password hash (bcrypt, scrypt, Argon2) multiplies the real cost of each guess. The unit returns to hashes and key sizes in Weeks 4 and 5."
- Callout, "Reading the last table honestly": "The RSA and AES rows are a forward reference, not Week 1 content: a symmetric key of n bits gives about n bits of security against exhaustive search, an RSA modulus of 2048 bits gives roughly 112 bits of security because the best known attack is factoring rather than enumeration, and a hash function with an n-bit output gives only about n/2 bits against collisions by the birthday bound. Those equivalences are how NIST SP 800-57 compares algorithms, and they are why 'longer key' and 'stronger algorithm' are different claims."
- Quick check: (a) random 10-character password from a 62-character alphabet versus (b) random 4-word passphrase from a 7776-word list → "about 59.5 bits versus 51.7 bits. The passphrase becomes competitive at five or six words (77.5 bits at six), which is the point — entropy comes from the size of the space, not from how unreadable the secret looks."
- Worked answer (`#sol-m2`), "is the help desk's reset policy strong enough?": temporary passwords of 8 random lowercase letters, valid 24 hours, no rate limit on the login page; assume 10⁹ guesses/s against a stolen hash and 10 guesses/s against the live login form.
  1. Entropy: `H = 8 log₂ 26 = 37.6` bits, space about 2.1 × 10¹¹ candidates.
  2. Against the live form at r = 10: expected search `2^36.6/10 ≈ 1.0 × 10¹⁰ seconds — about 320 years`. "The live login is not the weak point, and the 24-hour validity makes the attack hopeless."
  3. Against a stolen hash at r = 10⁹: `2^36.6/10⁹ ≈ 100 seconds`. "The password policy is fine only while the hash stays secret — which is not an assumption a security argument may rest on."
  4. Fix: "Raise H (12 characters, or a five-word passphrase at about 64.6 bits) *and* raise the per-guess cost with a slow hash and a rate limit… Then add the policy layers: one-time use, forced change on first login, and no reuse of the previous password."
  5. "Entropy addresses offline cracking; rate limiting addresses online guessing; expiry limits the value of any single credential that leaks; MFA makes a guessed password insufficient on its own. Four controls, four different risks."

#### `#sec-m-detect` — Detection arithmetic and layer probability
- Section lead: "The deck puts monitoring and intrusion detection in the after-deployment phase. Two pieces of mathematics decide whether that monitoring is useful: the base rate on the day, and whether your layers fail independently."
- **Detector description**: `Se = Pr(alert | attack)`, `Sp = Pr(no alert | no attack)`, `FPR = 1 − Sp`. Precision: `PPV = Pr(attack | alert) = Se·π / (Se·π + (1 − Sp)(1 − π))`, "where π is the base rate: the prior probability that a given event is a genuine attack. This is Bayes' theorem, and it is the single most useful formula on this page."
- Worked example, "a good detector with a terrible queue": Se = 0.90, Sp = 0.99, π = 10⁻⁴ (one in ten thousand events is a real attack) → `PPV = (0.90 × 10⁻⁴) / (0.90 × 10⁻⁴ + 0.01 × 0.9999) = 9.0 × 10⁻⁵ / 1.009 × 10⁻² ≈ 0.0089`. "Under 1% of alerts are real: about 99.1% are false positives. At a million events a day the queue is 10⁴ false alerts plus roughly 90 true ones — about 10,090 alerts a day, or one every 8.6 seconds. This is why the deck treats monitoring as a process with people in it, and why Week 2 insists that every AI-assisted finding is verified. Alert fatigue is not a cultural problem; it is arithmetic."
- Three levers that raise precision: "(i) **Raise the base rate** by narrowing the scope — monitor authentication to internet-facing services rather than all traffic. (ii) **Raise specificity** — better rules and models, at the cost of sensitivity. (iii) **Correlate independent signals**, because the posterior of the first test becomes the prior of the second: π₂ = PPV₁, so two conditional checks can lift precision by orders of magnitude. That third lever is what a SIEM is actually for, and it is the same 'layer' idea as defence in depth."
- Layer chart (`#ix-race-layers`, "Defence in depth: probability that an attack still succeeds", "Each independent layer stops 70% of attempts against it (q = 0.7). The last row is the weakest-link model, where the attacker chooses the easiest path instead of facing every layer." max 30): 1 layer = "0.30 = 30%"; 2 independent layers = "0.3² = 9%"; 3 = "0.3³ = 2.7%"; 4 = "0.3⁴ = 0.81%"; "4 layers, but the attacker picks the weakest (q = 0.05)" = "max pᵢ = 0.95 → ≥ 95%".
- **Defence in depth is a product — if the layers are independent**: `P(success) = Π_{i=1..n} (1 − q_i) = Π p_i`. "Four layers each stopping 70% give 0.3⁴ = 0.0081, under 1%. But if the attacker only needs *one* way in — the wooden barrel in the Week 1 deck — the model becomes `P(success) = max_i p_i`, and improving every layer except the weakest changes nothing at all. The two models are not in conflict: the product applies when all layers must be traversed, the maximum applies when the attacker can choose a path. Say which one you are using, because the difference is the whole argument."
- Insight box: "**The independence assumption is where defence-in-depth arguments go wrong.** If one phishing email defeats both the awareness training and the mail filter, then P(both fail) ≠ p₁p₂; the failures are correlated and the product is far too optimistic. Practical consequence: prefer layers that fail for *different reasons* — a technical control and a procedural control, or two controls operated by different teams — and say out loud which single event could defeat several of them at once."
- Quick check: rule catches 99% of real attacks with a 2% false-positive rate, 1 event in 1000 is a real attack → "PPV = (0.99 × 0.001) / (0.99 × 0.001 + 0.02 × 0.999) ≈ 0.00099 / 0.02097 ≈ 4.7%. Even a very sensitive rule produces mostly false positives at this base rate."
- Worked answer (`#sol-m3`), "should the security team buy the new detector, or hire a second analyst?" Current state: 10⁶ events a day, π = 10⁻⁴, detector Se = 0.85, Sp = 0.995, one analyst triages about 120 alerts per shift.
  1. False positives 10⁶ × 0.005 = 5,000/day; true positives 10⁶ × 10⁻⁴ × 0.85 = 85; total 5,085 alerts a day against capacity 120 — "the queue is failed by a factor of 42, and precision is 85/5085 ≈ 1.7%".
  2. Proposed detector Se = 0.95, Sp = 0.9995: false positives 10⁶ × 0.0005 = 500/day; true positives 95; load 595 alerts; precision 16%. "Better on every axis — and still five times the analyst's capacity."
  3. Narrow the scope instead: restrict monitoring to authentication events on internet-facing services, reducing the population to 2 × 10⁴ a day while retaining 80 of the 95 true positives. Base rate rises to π = 80/20,000 = 4 × 10⁻³; false positives 2 × 10⁴ × 0.0005 = 10; precision 80/90 ≈ 89%. "Ninety alerts a day is a queue one analyst can actually work."
  4. "Scoping beats sensitivity here, because precision is dominated by the base rate rather than by Se. The cost is coverage: events outside the scope are no longer watched, so the residual risk is the attack that never touches an authentication endpoint."
  5. "The scoped detector is one layer with q ≈ 0.9 for the attacks it sees. Adding a second, differently-shaped layer — say integrity monitoring on the record store — multiplies the failure probability only if the two fail independently, and takes over exactly where the first layer is blind."

#### `#sec-m-controls` — Attacks and countermeasures
- Section lead: "Each attack from the Week 1 material maps to a control family, and most controls serve one property and one lifecycle phase. Being able to say which is which is the whole skill."
- Matcher pairs (`#ix-m-counter`, "Match the attack to its primary countermeasure"):
  - "Data disclosed in transit" → "TLS 1.3 with certificate validation (Week 7)"
  - "Transaction altered in flight" → "Message authentication with HMAC (Week 5)"
  - "Password guessing at scale" → "Rate limiting plus a deliberately slow password hash (Weeks 4–5)"
  - "Staff phished for credentials" → "Phishing-resistant MFA and an independent approval procedure"
  - "Lateral movement after one host falls" → "Network segmentation and least privilege"
  - "Ransomware encrypting a file server" → "Tested, offline, immutable backups"
  - "Falsified approval screens (Bybit pattern)" → "What-you-see-is-what-you-sign display plus dual approval"
  - "Flooding the public service" → "Rate limiting, scrubbing and capacity headroom (Week 7)"
- Control-family table (a selection from the NIST SP 800-53 catalogue):
  - **AC** — Access Control: who may do what, to which object; least privilege, per-user accounts instead of a shared login.
  - **AT** — Awareness and Training: people as a layer, not only as a risk; phishing awareness, the approval procedure staff are asked to follow.
  - **AU** — Audit and Accountability: attribution and detection of change; append-only logs of who changed a grade, and when.
  - **CM** — Configuration Management: baselines, hardening, change control; patching and removing services nobody uses.
  - **CP** — Contingency Planning: surviving and recovering; tested offline backups and a recovery drill.
  - **IA** — Identification and Authentication: proving who is acting; MFA, one-time temporary credentials.
  - **IR** — Incident Response: contain, investigate, report; the deck's post-mortem and disaster-recovery activities.
  - **RA** — Risk Assessment: finding and scoring risk; threat modelling the ATM, and the risk register arithmetic above.
  - **SC** — System and Communications Protection: protecting data in motion and boundaries; encryption in transit, key management, segmentation.
  - **SI** — System and Information Integrity: noticing flaws and corruption; monitoring, integrity checks, malicious-code protection.
  - **SR** — Supply Chain Risk Management: trusting what you did not build; the hosting provider who can read the database (the portal example).
- Callout, "How to use the catalogue": "The families above are a selection from the NIST SP 800-53 control catalogue, which is the reference most frameworks map onto — the NIST CSF says *what* outcomes to achieve and SP 800-53 supplies *which* controls achieve them. You are not expected to memorise the catalogue. You are expected to be able to say: 'this risk, on this asset, breaks this property, so I want a preventive access control plus a detective audit control, and here is the residual risk.'"

#### `#sec-m-checklist` — The modelling checklist
- Section lead: "Most Week 1 exam questions reduce to 'model this system, then say what you would do'. Run the steps in order and the justification writes itself."
- Ordering widget (`#ix-m-checklist`, "Order the modelling checklist"), the six steps in order:
  1. "Name the assets and what each is worth"
  2. "Model the system: components, actors, environment and trust assumptions"
  3. "Model intended behaviour, before, during and after the event"
  4. "Think like an attacker and break one assumption per stage"
  5. "Name the CIA property at stake and score risk with T × V × I"
  6. "Choose controls by function and category, and state the residual risk"
- Checklist table (Step / look for / marks are lost when…):
  1. Assets — "Data, money, service availability, reputation, legal exposure" — "You list technology without saying what it is worth or to whom".
  2. System model — "Components, actors, environment, and the assumptions that hold it together" — "You describe features instead of trust assumptions".
  3. Intended behaviour — "Before, during and after — and which steps are guarantees" — "You write 'the system works correctly' as if it were a control".
  4. Attacker view — "One broken assumption per stage; who benefits" — "You list attacks that do not apply to this system".
  5. Property and risk — "Confidentiality, integrity or availability; T × V × I" — "You skip the scoring, so every risk looks equally urgent".
  6. Controls and residual risk — "Function (prevent/detect/recover), category, cost, trade-off" — "You claim the design has no trade-offs and no residual risk".
- Self-test deck (`#ix-m-selftest`, "Self-test: definitions and the numbers behind them", "Say the definition, or the formula, out loud before you flip the card"), six cards:
  - **Risk** — "The combination of how likely an event is with how bad it would be, for a named asset: qualitatively T × V × I, or quantitatively a function of likelihood and impact."
  - **Vulnerability** — "A weakness that a threat can exploit. A threat without a vulnerability has nothing to act on; a vulnerability without a threat is a latent issue, not a live risk."
  - **Annualised loss expectancy** — "ALE = ARO × SLE, and SLE = AV × EF. It converts a risk into a yearly number you can compare against the annual cost of a control."
  - **Defence in depth** — "Multiple layers such that any one may fail. If all layers must be defeated and they fail independently, P(success) = Π pᵢ; if the attacker can choose a path, P(success) = max pᵢ and the weakest layer decides."
  - **Precision (PPV) of a detector** — "Pr(attack | alert) = Se·π / (Se·π + (1−Sp)(1−π)). It falls with the base rate, which is why a sensitive detector can still produce a queue of mostly false alerts."
  - **Entropy of a randomly chosen secret** — "H = log₂ N for N equally likely values, and H = L·log₂ N for L independent characters from an alphabet of size N. Human-chosen secrets do not satisfy the independence assumption."
- Glance grid: "The six-line answer template" — "Asset and value → system model and assumptions → intended behaviour → attacker view with one broken assumption → CIA property and T × V × I → controls by function, with the residual risk and the trade-off stated." "Numbers worth memorising" — "log₂ 10⁴ ≈ 13.3; log₂ 26⁸ ≈ 37.6; log₂ 62⁸ ≈ 47.6; A = MTBF/(MTBF+MTTR); ALE = ARO × AV × EF; and Bayes for the alert queue." "Where this goes next" — "Weeks 4–5 give the primitives that make the integrity and confidentiality claims concrete: block ciphers, hash functions, RSA, Diffie-Hellman, signatures and HMAC." "Back to the week" — "Re-read the study guide's modelling and Bybit sections with this page open: the five steps become the checklist, and the Bybit failure becomes an integrity claim with a control that answers it."
- Closing callout: "**Back to the week:** definitions and numbers on this page, the castle-to-lifecycle argument on the study guide, then the Quiz Hub and Flashcards for retrieval practice."

---

## 2. FORMULAS AND NUMERIC DRILLS

Every formula and worked number on the two pages, with the arithmetic written out.

### F1. Risk as a product (qualitative)
- Formula as printed: **Risk = Threat × Vulnerability × Impact**; the Foundations page adds `R = T × V × I, T, V, I ∈ {1, …, 5}`.
- "Read it as a product, not a sum: if any factor is zero the risk collapses. No threat means nothing to fear; no vulnerability means nothing to exploit; no impact means nothing at stake."
- Alternative standard form quoted: "NIST SP 800-30 write[s] risk as a function of the likelihood of the event and its impact, R = f(L, I), with L itself driven by threat and vulnerability."
- Chart arithmetic (all verified): 3 × 4 × 5 = **60**; 4 × 3 × 4 = **48**; 2 × 4 × 5 = **40**; 3 × 3 × 3 = **27**; 2 × 3 × 4 = **24**; 3 × 2 × 3 = **18**.
- Club register arithmetic: 4 × 4 × 3 = **48**; 4 × 3 × 4 = **48**; 2 × 2 × 3 = **12**.

### F2. Single and annualised loss expectancy
- `SLE = AV × EF`, `ALE = ARO × SLE` (glance card also prints `ALE = ARO × AV × EF`).
- Constraint printed: `0 ≤ EF ≤ 1`; `ARO` = "Expected number of events per year".
- Clinic (control-purchase) drill:
  - AV = $50,000, EF = 0.4 → `SLE = 50,000 × 0.4 = $20,000`.
  - ARO = 0.5 → `ALE = 0.5 × 20,000 = $10,000 per year`.
  - Control costs $3,000/year and cuts EF to 0.1 → `SLE_after = 50,000 × 0.1 = $5,000`; `ALE_after = 0.5 × 5,000 = $2,500`.
  - Saving = 10,000 − 2,500 = **$7,500**, which is **> $3,000**, so the control is justified on the numbers alone; residual ALE = $2,500.
  - Counterfactual: "If the same control had saved only $2,000 a year, the arithmetic would say no."
- Quick-check drill: AV = $80,000, EF = 25% = 0.25, ARO = 0.2 → `SLE = 80,000 × 0.25 = $20,000`; `ALE = 0.2 × 20,000 = $4,000 per year`. Distractors: $20,000 (SLE left un-annualised) and $16,000 (80,000 × 0.2, ignoring EF).
- Club drill: (a) EF = 0.3 of $10,000 → SLE = $3,000, ARO = 0.4 → ALE = **$1,200**; (b) SLE = $4,000, ARO = 0.3 → ALE = **$1,200**; a $400 control cutting each ALE by 40% saves 0.4 × 1,200 = $480 twice = **$960**; residual stated as "roughly $1,000 a year" (exact arithmetic on the two priced risks: 2,400 − 960 = $1,440 — the page rounds to "roughly $1,000").

### F3. Availability as an uptime ratio
- `A = MTBF / (MTBF + MTTR)`, MTBF = mean time between failures, MTTR = mean time to repair.
- MTBF = 2000 h, MTTR = 4 h → `A = 2000/2004 = 0.9980` → **99.80%**; downtime = 0.002 × 8760 = **17.5 hours a year**.
- Halving repair time to 2 h → `A = 2000/2002 = 0.9990` → **99.90%**, which "halves the downtime".
- Why it matters: "detection and response speed are availability controls, not just security theatre."

### F4. Entropy and keyspace
- `H(X) = −Σ_{i=1..n} p_i log₂ p_i` (Shannon entropy in bits).
- Uniform case: `H = log₂ N`. 4-digit PIN: `log₂ 10⁴ = 13.3` bits ("one bit per halving of the search space").
- Password of length L over alphabet N: `H = L log₂ N` — "only if every character is independent and uniform". Constants used: log₂ 26 = 4.700; log₂ 62 = 5.954; log₂ 7776 = 12.925.
- Keyspace table recomputed check:
  - 26⁸ = 208,827,064,576 ≈ 2.1 × 10¹¹; 8 × log₂ 26 = 37.6 bits.
  - 62⁸ = 218,340,105,584,896 ≈ 2.2 × 10¹⁴; 8 × log₂ 62 = 47.6 bits.
  - 62¹² = 3.226 × 10²¹ ≈ 3.2 × 10²¹; 12 × log₂ 62 = 71.5 bits.
  - 7776⁶ = 2.137 × 10²³ ≈ 2.2 × 10²³; 6 × log₂ 7776 = 77.5 bits.
  - AES-128 keyspace 2¹²⁸ = 128 bits.
  - RSA-2048: "factoring, not enumeration", ≈ 112-bit equivalent security.
  - Exact search times at 10⁹ guesses/s: 26⁸ → 2.088 × 10¹¹ / 10⁹ = 209 s ≈ 3.5 minutes (page prints "about 2 minutes" — see note N1); 62⁸ → 218,340 s = 2.53 days ("about 2.5 days" ✓); 62¹² → 3.226 × 10¹² s = 102,300 years ("about 100 000 years" ✓); 7776⁶ → 2.137 × 10¹⁴ s = 6.78 million years ("about 7 million years" ✓).
- 10-character vs passphrase drill: `10 × log₂ 62 = 59.5` bits versus `4 × log₂ 7776 = 51.7` bits — a difference of ≈ 7.8 bits (the page rounds to "about 8 bits" in the distractor text); five words = 64.6 bits; six words = 77.5 bits.

### F5. Guessing cost
- `t_worst = 2^H / r`, `t_expected ≈ 2^(H−1) / r`, where r = guesses per second.
- "Doubling the length of a random password squares the keyspace and therefore doubles H; adding one character class multiplies the alphabet by a much smaller factor."
- Defences that change r rather than H: rate limiting and account lockout; deliberately slow password hashes (bcrypt, scrypt, Argon2).
- Help-desk drill (8 random lowercase letters, H = 37.6 bits ⇒ 2^36.6 ≈ 1.04 × 10¹¹ candidates):
  - Live form at r = 10 guesses/s: `2^36.6 / 10 ≈ 1.0 × 10¹⁰ s` — page says "about 320 years" (exact: 1.04 × 10¹⁰ / 3.1536 × 10⁷ = 330 years — see note N2); 24-hour validity makes the attack hopeless.
  - Stolen hash at r = 10⁹: `2^36.6 / 10⁹ ≈ 100 seconds` (exact: 104 s).
  - Fix: 12 characters (71.5 bits) or a five-word passphrase "at about 64.6 bits", plus a slow hash, a rate limit, one-time use, forced change on first login, no reuse of the previous password.

### F6. Detection: sensitivity, specificity, precision (Bayes)
- `Se = Pr(alert | attack)`, `Sp = Pr(no alert | no attack)`, `FPR = 1 − Sp`.
- `PPV = Pr(attack | alert) = Se·π / (Se·π + (1 − Sp)(1 − π))` — "the single most useful formula on this page".
- Worked example: Se = 0.90, Sp = 0.99, π = 10⁻⁴.
  - Numerator: 0.90 × 0.0001 = 9.0 × 10⁻⁵.
  - Denominator: 9.0 × 10⁻⁵ + 0.01 × 0.9999 = 9.0 × 10⁻⁵ + 9.999 × 10⁻³ = 1.00899 × 10⁻².
  - `PPV ≈ 0.0089` → **under 1%** of alerts are real, so about **99.1% are false positives**.
  - At 10⁶ events/day: FP = 10⁶ × 0.01 = 10,000; TP = 10⁶ × 10⁻⁴ × 0.90 = 90; total **10,090 alerts/day** = one every 86,400/10,090 = **8.6 seconds**.
- Quick-check drill: Se = 0.99, FPR = 0.02 (Sp = 0.98), π = 0.001 → numerator 0.00099; denominator 0.00099 + 0.02 × 0.999 = 0.00099 + 0.01998 = 0.02097; `PPV ≈ 0.0472` → **about 4.7%** (page's option text: "about 5%").
- Three levers: raise the base rate by narrowing scope; raise specificity; correlate independent signals with `π₂ = PPV₁`.

### F7. Analyst-capacity drill (buy a detector or hire an analyst?)
- Baseline: 10⁶ events/day, π = 10⁻⁴, Se = 0.85, Sp = 0.995, analyst capacity 120 alerts/shift.
  - FP = 10⁶ × (1 − 0.995) = 10⁶ × 0.005 = **5,000/day**.
  - TP = 10⁶ × 10⁻⁴ × 0.85 = **85/day**.
  - Total = **5,085 alerts/day**; overshoot = 5,085 / 120 = **42.4× capacity**; precision = 85 / 5,085 = **1.7%**.
- Proposed detector: Se = 0.95, Sp = 0.9995.
  - FP = 10⁶ × 0.0005 = **500/day**; TP = 10⁶ × 10⁻⁴ × 0.95 = **95/day**; total **595 alerts/day**; precision = 95 / 595 = **16.0%**; still 595 / 120 = **5.0× capacity**.
- Scope narrowing: 2 × 10⁴ events/day, retaining 80 of the 95 true positives.
  - Base rate π = 80 / 20,000 = **4 × 10⁻³**; FP = 20,000 × 0.0005 = **10**; total = **90 alerts/day**; precision = 80 / 90 = **88.9% ≈ 89%**.
  - Coverage trade-off: "events outside the scope are no longer watched, so the residual risk is the attack that never touches an authentication endpoint."

### F8. Defence in depth: product versus weakest link
- Product model (all layers must be traversed, independent failures): `P(success) = Π_{i=1..n} (1 − q_i) = Π p_i`.
- Weakest-link model (attacker chooses one path): `P(success) = max_i p_i`.
- q = 0.7 per layer ⇒ p = 0.3: 1 layer **30%**; 2 layers 0.3² = **9%**; 3 layers 0.3³ = **2.7%**; 4 layers 0.3⁴ = **0.81%** ("under 1%").
- Weakest-link row: four layers but the attacker picks one with p = 0.95 ⇒ `max pᵢ = 0.95 → ≥ 95%`; "improving every layer except the weakest changes nothing at all."
- Independence caveat: one phishing email defeating both awareness training and the mail filter means P(both fail) ≠ p₁p₂ — "prefer layers that fail for different reasons".

### F9. Key-size equivalences (forward reference, quoted from the callout)
- "a symmetric key of n bits gives about n bits of security against exhaustive search";
- "an RSA modulus of 2048 bits gives roughly 112 bits of security because the best known attack is factoring rather than enumeration";
- "a hash function with an n-bit output gives only about n/2 bits against collisions by the birthday bound";
- these equivalences come from NIST SP 800-57, and explain why "'longer key' and 'stronger algorithm' are different claims."

### F10. Notation table (the page's own symbol list)
`A` asset value · `T` threat · `V` vulnerability · `I` impact · `R` risk · `EF` exposure factor (0 ≤ EF ≤ 1) · `SLE = AV × EF` · `ARO` events per year · `ALE = ARO × SLE` · `H` entropy/work factor · `π` base rate · `Se`/`Sp` sensitivity/specificity · `PPV = Pr(attack | alert)` · `p_i`/`q_i` layer bypass/stop probabilities with `q_i = 1 − p_i`.

### Notes on rounded values (flagged, not contradicted)
- **N1**: the secret table's "about 2 minutes" for 26⁸ at 10⁹ guesses/s is a rounded-down figure; exact = 208,827,064,576 / 10⁹ ≈ 209 s ≈ 3.5 minutes. (Every other row of that table recomputes consistently.)
- **N2**: the help-desk answer prints "about 320 years"; exact = 1.04 × 10¹⁰ s / (3.1536 × 10⁷ s/yr) ≈ 330 years. Both are the page's own rounding; the "about 100 seconds" figure recomputes to ~104 s.
- **N3**: the club answer's residual "roughly $1,000 a year" is a rounding of the two priced risks: 1,200 + 1,200 − 960 = $1,440.

---

## 3. PITFALLS

1. **Treating the CIA properties as one averaged score is wrong** because averages hide the property that matters; the page says "**Do not add the three properties into a single score and call it security** … Two systems with the same S can have completely different failure modes — one leaks, one silently corrupts."
2. **Confusing a vulnerability with the threat or with the impact is wrong** because the term table's "common wrong answer" is exactly "Confusing it with the threat itself, or with the impact of exploitation"; the page says a threat without a vulnerability has nothing to act on and a vulnerability without a threat is "a latent issue, not a live risk."
3. **Calling risk "a vulnerability" is wrong** because the page requires "Likelihood combined with impact, for a named asset" — "risk is about the asset and the consequence, not the flaw alone."
4. **Assuming all attackers are equally capable is wrong** because a threat actor must be described as "Goal plus capability"; the listed error is "Assuming all attackers are equally capable, so all threats are equal."
5. **Buying products instead of controls is wrong** because a control must be "Something that reduces a named risk, with a stated cost"; the listed error is "Listing products instead of naming the risk each one reduces."
6. **Counting only network ports as the attack surface is wrong** because the attack surface is "the sum of the ways an attacker can interact with the system — every port, account, input field, API, human process and supply chain"; the listed error is "Counting only the network ports and forgetting people and suppliers."
7. **Multiplying layer probabilities without checking independence is wrong** because "If one phishing email defeats both the awareness training and the mail filter, then P(both fail) ≠ p₁p₂; the failures are correlated and the product is far too optimistic"; the page says to prefer layers that fail for different reasons and to name the single event that could defeat several at once.
8. **Using the product model when the attacker can choose a path is wrong** because "the product applies when all layers must be traversed, the maximum applies when the attacker can choose a path"; in the weakest-link model P(success) = max pᵢ, and the chart's last row shows max pᵢ = 0.95 → ≥ 95% even with four layers.
9. **Judging a password by how unreadable it looks is wrong** because entropy comes from the size of the space: the page contrasts 8 lowercase letters (37.6 bits) with a random 10-character 62-alphabet password (59.5 bits), and says "entropy comes from the size of the space, not from how unreadable the secret looks."
10. **Relying on password policy while assuming the hash stays secret is wrong** because "The password policy is fine only while the hash stays secret — which is not an assumption a security argument may rest on"; at 10⁹ guesses/s a 37.6-bit space falls in about 100 seconds.
11. **Judging a detector by its sensitivity is wrong** because PPV is dominated by the base rate: with Se = 0.90, Sp = 0.99 and π = 10⁻⁴, "Under 1% of alerts are real: about 99.1% are false positives", and "Alert fatigue is not a cultural problem; it is arithmetic."
12. **Treating the NIST CSF as a certification or a product list is wrong** because it is "voluntary and outcome-based: it describes *what* an organisation should be able to do, not which product to buy"; the page says to speak instead of profiles (current/target) and tiers (1 Partial, 2 Risk Informed, 3 Repeatable, 4 Adaptive) — "Say that, rather than pretending it is a certification."
13. **Removing all access to make a system safe is wrong** because "A perfectly closed castle is secure — and useless"; the page rules that option out and says the risk created by necessary access has to be managed, not eliminated.
14. **Blaming broken cryptography for Bybit is wrong** because "the attack did not break any cryptography at all"; stronger encryption "would not have stopped" an attack that "travelled through an authorised workflow", and the missing layer was a human-protecting control — payload display at the signing component plus an independent second approver.

---

## 4. TESTABLE CLAIMS

1. The two questions the walls cannot answer are "What about someone already inside?" and "What if we trust the wrong person?" — both failures of authorisation rather than of the perimeter. `chapter1-study.html#sec-castle`
2. A perfectly closed castle is "secure — and useless"; adding necessary access creates risk, and every door is a control point and an attack surface at the same time. `chapter1-study.html#sec-castle`
3. The deck's five-stave chain is People → Devices → Networks → Software → Data, and an attacker only needs one stave to be shorter than the rest. `chapter1-study.html#sec-depth`
4. Two rules to memorise: no single control protects the whole system (so use layers), and a system is only as secure as its weakest point (so spend effort on the shortest board). `chapter1-study.html#sec-depth`
5. Security involves trade-offs, because the deck's fourth take-away is that more security can affect usability and convenience. `chapter1-study.html#sec-depth`
6. The CIA questions are "Who is allowed to see this?", "Has the information been changed?" and "Can I access it when I need it?" `chapter1-study.html#sec-cia`
7. The attack mirror image of CIA is the DAD triad: disclosure, alteration and destruction. `chapter1-study.html#sec-cia`
8. CIA is necessary but not sufficient: authenticity, non-repudiation and increasingly privacy and safety also matter, and aggressive availability usually costs confidentiality. `chapter1-study.html#sec-cia`
9. Risk = Threat × Vulnerability × Impact is read as a product, not a sum, so a single zero factor collapses the risk assessment. `chapter1-study.html#sec-risk`
10. The four risk treatments are mitigate with a control, transfer it (insurance), avoid the activity, or accept it knowingly — a business decision informed by numbers, not a purely technical one. `chapter1-study.html#sec-risk`
11. The five modelling steps in order are: model the system; model intended behaviour before, during and after; think like an attacker; define what must be protected (confidentiality, integrity, availability); know your attacker. `chapter1-study.html#sec-model`
12. In 2025 Bybit lost roughly US$1.4 billion — the loss slide gives US$1,500,000,000 — with no cryptography broken: staff approved a falsified interface and the cold wallet signed without re-displaying the payload. `chapter1-study.html#sec-bybit`
13. Bybit's failed assumptions were that the UI shows accurate verified details, that signatures are only given for valid requests, and that staff follow a procedure including an independent check; the countermeasure is "what you see is what you sign" with a second independent approver for high-value actions. `chapter1-study.html#sec-bybit`
14. The lifecycle places static analysis before deployment, intrusion detection and live fuzzing/decompilation/AI-assisted search after deployment, and post-mortem, disaster recovery, tracing, insurance and legal steps after an incident. `chapter1-study.html#sec-lifecycle`
15. Controls are classified by function (preventive, detective, corrective, recovery, deterrent, compensating) and by category (technical/logical, administrative/operational, physical). `chapter1-study.html#sec-controls`
16. NIST CSF 2.0 (2024) has six functions — Govern, Identify, Protect, Detect, Respond, Recover — and CSF 1.1 (2018) had five, without Govern. `chapter1-study.html#sec-csf`
17. The CSF is voluntary and outcome-based, defines current and target profiles and four tiers (1 Partial, 2 Risk Informed, 3 Repeatable, 4 Adaptive), and maps onto control catalogues such as NIST SP 800-53. `chapter1-study.html#sec-csf`
18. Authorisation is the working rule for fuzzing, decompilation, AI-assisted discovery and traffic interception: test only systems you own or have explicit written permission to test, stay within scope, and report through responsible disclosure. `chapter1-study.html#sec-careers`
19. SLE = AV × EF and ALE = ARO × SLE; ALE is the number a budget conversation needs, and both ARO and event independence are estimates that must be stated honestly. `chapter1-math.html#sec-m-risk`
20. Availability is A = MTBF/(MTBF + MTTR): MTBF = 2000 hours with MTTR = 4 hours gives 99.80%, about 17.5 hours of downtime a year. `chapter1-math.html#sec-m-cia`
21. Confidentiality is an authorisation property of reads, integrity a property of writes that are authorised and attributable, and availability a ratio that must stay above target. `chapter1-math.html#sec-m-cia`
22. A 4-digit PIN carries log₂ 10⁴ ≈ 13.3 bits; 8 lowercase letters give 37.6 bits; 12 characters of mixed case and digits give 71.5 bits; six diceware words from 7776 give 77.5 bits. `chapter1-math.html#sec-m-entropy`
23. PPV = Se·π / (Se·π + (1−Sp)(1−π)) is "the single most useful formula on this page" because precision is dominated by the base rate rather than by sensitivity. `chapter1-math.html#sec-m-detect`
24. Four independent layers each stopping 70% leave 0.3⁴ = 0.0081, but under the weakest-link model P(success) = max pᵢ improving every layer except the weakest changes nothing. `chapter1-math.html#sec-m-detect`
25. NIST SP 800-53 supplies the control catalogue the CSF maps onto, with families including AC, AT, AU, CM, CP, IA, IR, RA, SC, SI and SR. `chapter1-math.html#sec-m-controls`

---

## 5. ANCHOR INDEX

Every `id="..."` appearing in the two files, in document order.

chapter1-study.html#sidebar - Sidebar navigation panel (course home, 12 section links, progress)
chapter1-study.html#sidebarToggle - Sidebar toggle button
chapter1-study.html#mainContent - Main content wrapper
chapter1-study.html#hero - Overview / hero section (data-track="hero")
chapter1-study.html#sec-castle - From Castles to Firewalls
chapter1-study.html#ix-castle - Interactive mount point in the castle section
chapter1-study.html#castleArrow - SVG arrow marker in the castle service-path diagram
chapter1-study.html#sec-depth - Defence in Depth and the Weakest Link
chapter1-study.html#ix-barrel - Interactive mount point for the weakest-link barrel animation
chapter1-study.html#sec-cia - The CIA Triad: What Are We Protecting?
chapter1-study.html#sec-risk - Risk: Threat, Vulnerability, Impact
chapter1-study.html#ix-race-risk - Interactive risk-score bar chart (threat × vulnerability × impact)
chapter1-study.html#sec-model - Modelling the System: Think Like Both Sides
chapter1-study.html#ix-model-seq - Interactive: order the five modelling steps
chapter1-study.html#sol-1 - Worked example solution: university results portal
chapter1-study.html#sec-bybit - Case Study: The $1.4 Billion Mistake
chapter1-study.html#ix-bybit-timeline - Interactive: Bybit approval-chain timeline
chapter1-study.html#sol-2 - Worked answer: Bybit system and threat models
chapter1-study.html#sec-lifecycle - Security Is a Lifecycle, Not a Launch
chapter1-study.html#ix-lifecycle-pipe - Interactive: six-stage security lifecycle pipeline
chapter1-study.html#sec-controls - Security Controls: Prevent, Detect, Recover
chapter1-study.html#ix-control-match - Interactive: control-to-function/category matcher
chapter1-study.html#sol-3 - Worked example solution: clinic patient-records controls
chapter1-study.html#sec-csf - The NIST Cybersecurity Framework
chapter1-study.html#ix-csf-hotspot - Interactive: NIST CSF 2.0 six-function hotspot diagram
chapter1-study.html#csfArrow - SVG arrow marker id inside the injected CSF hotspot SVG string
chapter1-study.html#sec-careers - Where This Leads: Domains, Roles and Responsible Practice
chapter1-study.html#ix-careers-deck - Interactive: security role cards
chapter1-study.html#sec-recap - Week 1 Recap
chapter1-math.html#mainContent - Main content wrapper
chapter1-math.html#sec-m-hero - Foundations hero
chapter1-math.html#sec-m-defs - Definitions and notation
chapter1-math.html#sec-m-cia - The CIA triad, stated precisely
chapter1-math.html#sec-m-risk - Risk arithmetic
chapter1-math.html#sol-m1 - Worked answer: three-line risk register for a student club
chapter1-math.html#sec-m-entropy - Entropy, keyspace and guessing cost
chapter1-math.html#sol-m2 - Worked answer: help-desk reset policy
chapter1-math.html#sec-m-detect - Detection arithmetic and layer probability
chapter1-math.html#ix-race-layers - Interactive: defence-in-depth probability bar chart
chapter1-math.html#sol-m3 - Worked answer: buy a detector or hire an analyst
chapter1-math.html#sec-m-controls - Attacks and countermeasures
chapter1-math.html#ix-m-counter - Interactive: attack-to-countermeasure matcher
chapter1-math.html#sec-m-checklist - The modelling checklist
chapter1-math.html#ix-m-checklist - Interactive: order the modelling checklist
chapter1-math.html#ix-m-selftest - Interactive: definitions/formula self-test deck

---

## 6. GRAPH SEEDS

### Study page — concept graph (16 nodes)

| id suggestion | label | one-sentence definition (from the page) | anchor |
|---|---|---|---|
| `castle-model` | Castle model | "Something valuable is inside — money, data, secrets, reputation. So keep trusted people in and keep attackers out. Build higher walls and make access harder." | `chapter1-study.html#sec-castle` |
| `access-creates-risk` | Access creates risk | "A perfectly closed castle is secure — and useless … The moment we add access, we also create risk. Every door is a control point and an attack surface at the same time." | `chapter1-study.html#sec-castle` |
| `trust-boundary` | Trust boundary | The dashed line in the modern service path where one trust domain ends and another begins: the same request crosses two trust boundaries before it reaches the data store, and the backup path is another way in. | `chapter1-study.html#sec-castle` |
| `defence-in-depth` | Defence in depth | "No single control protects the whole system" — so you add layers that assume any one of them can fail. | `chapter1-study.html#sec-depth` |
| `weakest-link` | Weakest link (the barrel) | "A system is only as secure as its weakest point" — so spend effort on the shortest board, not on the boards that already look tall. | `chapter1-study.html#sec-depth` |
| `five-layer-chain` | People → Devices → Networks → Software → Data | The deck's five staves; security is end to end and an attacker only needs one stave to be shorter than the rest. | `chapter1-study.html#sec-depth` |
| `cia-triad` | CIA triad | "Confidentiality (only authorised parties can read or use something), integrity (information stays correct and trustworthy, and changes are authorised and detectable) and availability (systems and information are accessible when needed)." | `chapter1-study.html#sec-cia` |
| `dad-triad` | DAD triad | "The mirror image used for attacks … disclosure, alteration, destruction." | `chapter1-study.html#sec-cia` |
| `risk-product` | Risk = Threat × Vulnerability × Impact | Risk read as a product, not a sum: if any factor is zero the risk collapses. | `chapter1-study.html#sec-risk` |
| `risk-treatment` | Four risk treatments | Mitigate with a control, transfer it (insurance), avoid it by not doing the activity, or accept it knowingly. | `chapter1-study.html#sec-risk` |
| `threat-actor` | Threat actor | "The person or group behind it" — actors differ by goal and capability, from skimmer and shoulder surfer to organised crime and nation-state groups. | `chapter1-study.html#sec-risk` |
| `five-step-modelling` | Five-step system and threat modelling | Model the system; model intended behaviour before/during/after; think like an attacker; define what must be protected; know your attacker. | `chapter1-study.html#sec-model` |
| `bybit-wysiwys` | What you see is what you sign (Bybit) | The signed payload must be displayed by the component that actually signs, with a second independent approver for high-value actions, because Bybit's ~US$1.4 billion loss broke no cryptography. | `chapter1-study.html#sec-bybit` |
| `security-lifecycle` | Security lifecycle | Six stages — Define, Build, Test, Monitor, Respond, Learn — where the last one feeds the first: "Security is never finished." | `chapter1-study.html#sec-lifecycle` |
| `control-functions` | Control function and category | A control reduces risk by preventing, detecting, correcting or recovering, with deterrent and compensating as added standard functions; categories are technical, administrative and physical. | `chapter1-study.html#sec-controls` |
| `nist-csf-functions` | NIST CSF 2.0 functions | Govern at the centre of Identify, Protect, Detect, Respond and Recover; Govern was added in the 2024 revision, where CSF 1.1 (2018) had five functions without it. | `chapter1-study.html#sec-csf` |

### Foundations page — foundations graph (10 nodes)

| id suggestion | label | one-sentence definition (from the page) | anchor |
|---|---|---|---|
| `f-cia-formal` | CIA formal statements | "Reads imply authorisation" (confidentiality), "writes imply authorisation and attribution" (integrity), and "A = MTBF/(MTBF+MTTR) stays above target" (availability). | `chapter1-math.html#sec-m-cia` |
| `f-availability` | Availability ratio | A = MTBF/(MTBF + MTTR); 2000 hours with 4 hours gives 99.80%, about 17.5 hours of downtime a year. | `chapter1-math.html#sec-m-cia` |
| `f-ale` | SLE and ALE | SLE = AV × EF and ALE = ARO × SLE — "the number a budget conversation needs". | `chapter1-math.html#sec-m-risk` |
| `f-risk-matrix` | Likelihood × impact matrix | The 3 × 3 grid from "Low — accept, review annually" to "Critical — mitigate now, or avoid the activity". | `chapter1-math.html#sec-m-risk` |
| `f-entropy` | Entropy | H(X) = −Σ pᵢ log₂ pᵢ, which collapses to H = log₂ N for N equally likely values (a 4-digit PIN is 13.3 bits). | `chapter1-math.html#sec-m-entropy` |
| `f-keyspace` | Keyspace H = L log₂ N | Entropy of L independent uniform characters over an alphabet of size N — an assumption human-chosen passwords do not meet. | `chapter1-math.html#sec-m-entropy` |
| `f-guessing-cost` | Guessing cost | t_worst = 2^H / r and t_expected ≈ 2^(H−1) / r, where r is guesses per second. | `chapter1-math.html#sec-m-entropy` |
| `f-ppv` | Precision (PPV) | PPV = Se·π / (Se·π + (1−Sp)(1−π)), the probability that a raised alert is real; it falls with the base rate. | `chapter1-math.html#sec-m-detect` |
| `f-layer-probability` | Layer probability | P(success) = Π pᵢ when every layer must be defeated and layers fail independently; P(success) = max pᵢ when the attacker can choose the weakest path. | `chapter1-math.html#sec-m-detect` |
| `f-control-families` | NIST SP 800-53 control families | AC, AT, AU, CM, CP, IA, IR, RA, SC, SI and SR — the catalogue the outcome-based CSF maps onto. | `chapter1-math.html#sec-m-controls` |

---

## 7. FLASHCARD SEEDS

1. **Front:** Define the CIA triad and its attack mirror image.
   **Back:** "The CIA triad is the standard vocabulary for security objectives: confidentiality (only authorised parties can read or use something), integrity (information stays correct and trustworthy, and changes are authorised and detectable) and availability (systems and information are accessible when needed). The mirror image used for attacks is the DAD triad: disclosure, alteration, destruction." (`chapter1-study.html#sec-cia`)

2. **Front:** Write the Week 1 risk formula. Why is it a product rather than a sum?
   **Back:** Risk = Threat × Vulnerability × Impact. Each factor is a gate: no threat means nothing to fear, no vulnerability means nothing to exploit, no impact means nothing at stake — so a single zero factor collapses the risk. Standards such as NIST SP 800-30 express the same idea as R = f(L, I). (`chapter1-study.html#sec-risk`, `chapter1-math.html#sec-m-defs`)

3. **Front:** List the deck's five system-and-threat-modelling steps in order.
   **Back:** (1) Model the system — components, actors, environment, trust assumptions. (2) Model intended behaviour before, during and after. (3) Think like an attacker: at each stage, what could go wrong? (4) Define what must be protected: confidentiality, integrity, availability. (5) Know your attacker: who they are, what they can do, what they want. (`chapter1-study.html#sec-model`)

4. **Front:** In the Bybit case, which three assumptions failed, and what is the named countermeasure?
   **Back:** The UI was assumed to show the truth; the signer was assumed to verify what it signed; the staff were assumed to follow a procedure including an independent check. Countermeasure: *what you see is what you sign* — the signing component displays the decoded payload, plus a second independent approver for high-value actions. No cryptography was broken; the failure was integrity (authenticity of the approval). (`chapter1-study.html#sec-bybit`)

5. **Front:** Name the six functions of NIST CSF 2.0, say which is new, and list the four tiers.
   **Back:** Govern (added in CSF 2.0, 2024, at the centre), Identify, Protect, Detect, Respond, Recover. CSF 1.1 (2018) had five functions without Govern. Tiers: 1 Partial, 2 Risk Informed, 3 Repeatable, 4 Adaptive. The CSF is voluntary and outcome-based and maps onto NIST SP 800-53. (`chapter1-study.html#sec-csf`)

6. **Front:** A clinic's records system is worth $50,000; ransomware would destroy or lock 40% of that, 0.5 times a year. Price the risk, then price a $3,000-a-year backup programme that cuts the exposure factor to 0.1.
   **Back:** SLE = AV × EF = 50,000 × 0.4 = $20,000. ALE = ARO × SLE = 0.5 × 20,000 = $10,000 per year. After the control: SLE = 50,000 × 0.1 = $5,000, ALE = 0.5 × 5,000 = $2,500, saving = 10,000 − 2,500 = $7,500 > $3,000 — so it is justified on the numbers alone, with $2,500 residual ALE. (`chapter1-math.html#sec-m-risk`)

7. **Front:** A detector has Se = 0.90 and Sp = 0.99, and only 1 event in 10,000 is a real attack. What fraction of its alerts are real, and what does the alert queue look like at 10⁶ events a day?
   **Back:** PPV = Se·π / (Se·π + (1−Sp)(1−π)) = 0.90 × 10⁻⁴ / (0.90 × 10⁻⁴ + 0.01 × 0.9999) = 9.0 × 10⁻⁵ / 1.009 × 10⁻² ≈ 0.0089 — under 1% of alerts are real, about 99.1% are false positives. At 10⁶ events/day: 10⁴ false plus ~90 true = 10,090 alerts, one every 8.6 seconds. (`chapter1-math.html#sec-m-detect`)
