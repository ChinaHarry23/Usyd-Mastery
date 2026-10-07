/* INFO6007 — foundations graph data.
 * node: [id, chapter, difficulty(1-3), label, definition, href]
 * edge: [fromId, toId, chapter]
 */
window.KG_CONFIG = {
  langKey: "info6007_lang",
  fromParam: "mkg",
  numChapters: 8,
  chapterColors: {"1":"#0891b2","2":"#0ea5e9","3":"#2563eb","4":"#6366f1","5":"#7c3aed","6":"#a855f7","7":"#db2777","8":"#e11d48"},
  chapterNames: {"1":"W1: Introduction to PM","2":"W2: Methodologies","3":"W3: Time Management","4":"W4: Cost Management","5":"W5: Quality Management","6":"W6: Resource Management","7":"W7: Risk Management","8":"W8: Procurement Management"},
  chapterNamesZh: {"1":"第1周","2":"第2周","3":"第3周","4":"第4周","5":"第5周","6":"第6周","7":"第7周","8":"第8周"},
  ui: {
    en: {
          "w1": "W1",
          "w2": "W2",
          "w3": "W3",
          "w4": "W4",
          "w5": "W5",
          "w6": "W6",
          "w7": "W7",
          "w8": "W8",
          "title": "Foundations Graph — INFO6007",
          "navHome": "← Home",
          "pageTitle": "Foundations Graph",
          "search": "Search foundations topics...",
          "threshold": "Threshold",
          "diff": "Sort by Difficulty",
          "chapter": "Group by Week",
          "reset": "Reset View",
          "weeks": "Weeks",
          "legendDiff": "Difficulty",
          "diffScale": "● small = easy",
          "click": "Click node → source",
          "layout": "Layout",
          "sort": "Sort by difficulty",
          "group": "Group by week",
          "both": "Combine filters.",
          "nodes": "nodes",
          "edges": "edges",
          "thresholdStats": "threshold ≥ "
    },
    zh: {
          "w1": "W1",
          "w2": "W2",
          "w3": "W3",
          "w4": "W4",
          "w5": "W5",
          "w6": "W6",
          "w7": "W7",
          "w8": "W8",
          "title": "Foundations Graph — INFO6007",
          "navHome": "← 首页",
          "pageTitle": "基础图谱",
          "search": "搜索…",
          "threshold": "阈值",
          "diff": "按难度",
          "chapter": "按周次",
          "reset": "重置",
          "weeks": "周次",
          "legendDiff": "难度",
          "diffScale": "● 小=易",
          "click": "点击跳转",
          "layout": "布局",
          "sort": "难度排序",
          "group": "周次分组",
          "both": "组合筛选",
          "nodes": "节点",
          "edges": "边",
          "thresholdStats": "阈值 ≥ "
    }
  },
  nodes: [
    /* ---- W1: the constraint system and the first numbers ---- */
    ["m1-defs", 1, 1, "Exact definitions", "Project vs operation, program vs portfolio and the success test, written so the consequence is included — marks are lost on wording more often than on arithmetic.", "../chapters/chapter1/web/chapter1-math.html#sec-m-defs"],
    ["m1-triple", 1, 1, "Triple constraint system", "Scope, time and cost as one system with quality and risk inside it: every change moves at least one of the others.", "../chapters/chapter1/web/chapter1-math.html#sec-m-triple"],
    ["m1-signs", 1, 3, "Signed change rules", "ΔS > 0 forces ΔT > 0 and/or ΔC > 0; ΔT < 0 forces cost up, scope down or efficiency up; ΔC < 0 lands on scope, time, quality or risk.", "../chapters/chapter1/web/chapter1-math.html#sec-m-triple"],
    ["m1-effort", 1, 2, "Effort roll-up", "Labour cost = rate × total effort, and duration = effort divided by real capacity: 1,640 hours at $85 is $139,400, or about 47 working days for five people at seven hours a day.", "../chapters/chapter1/web/chapter1-math.html#sec-m-quant"],
    ["m1-cpm", 1, 3, "Critical path and float", "Forward pass takes the maximum predecessor finish, backward pass the minimum successor start, and float = LS − ES marks the zero-float chain.", "../chapters/chapter1/web/chapter1-math.html#sec-m-quant"],
    ["m1-evm", 1, 2, "Earned value trio", "PV is the budgeted cost of work planned, EV of work completed and AC the real expenditure; EV = % complete × BAC and PV = % planned × BAC.", "../chapters/chapter1/web/chapter1-math.html#sec-m-quant"],
    ["m1-indices", 1, 2, "Variances and indices", "CV = EV − AC and SV = EV − PV in dollars; CPI = EV/AC and SPI = EV/PV as rates, with below 1 meaning trouble.", "../chapters/chapter1/web/chapter1-math.html#sec-m-quant"],
    ["m1-forecast", 1, 3, "Forecast chain", "EAC = BAC/CPI under current performance, ETC = EAC − AC, VAC = BAC − EAC, and TCPI = (BAC − EV)/(BAC − AC) for the efficiency still required.", "../chapters/chapter1/web/chapter1-math.html#sec-m-quant"],
    ["m1-coq", 1, 2, "Cost of quality categories", "Conformance (prevention plus appraisal) against non-conformance (internal plus external failure); external failure is the dearest category and prevention the cheapest per defect.", "../chapters/chapter1/web/chapter1-math.html#sec-m-quant"],

    /* ---- W2: documentary spine and methodology arithmetic ---- */
    ["m2-charter", 2, 1, "Project charter", "The authorising document that names the business need, measurable objectives, high-level scope, sponsor, manager, budget, milestones and sign-off.", "../chapters/chapter2/web/chapter2-study.html#sec-initiation"],
    ["m2-lifecycle", 2, 1, "Phase-to-artefact map", "Charter in defining, the management plan in planning, deliverables in execution, reports in monitoring and controlling, acceptance and lessons learned in closure.", "../chapters/chapter2/web/chapter2-study.html#sec-lifecycle"],
    ["m2-wbs", 2, 2, "Decomposition arithmetic", "Branching factor to the power of levels gives the leaf count — 3 branches over 2 levels is 9 work packages, 4 over 3 is 64 — and each leaf then carries its own estimate.", "../chapters/chapter2/web/chapter2-math.html#sec-m-wbs"],
    ["m2-cpm", 2, 3, "Critical path on a live plan", "The UniConnect WBS runs 12 weeks on 1.1→1.2→1.3.2→1.3.3→1.4.1→1.4.2, with the timetable build holding one week of float.", "../chapters/chapter2/web/chapter2-math.html#sec-m-wbs"],
    ["m2-evm", 2, 3, "Measuring a method by numbers", "At week 6 of a $180,000 plan: PV 90k, EV 81k and AC 99k give CPI 0.82, SPI 0.90, EAC $220,000 and a TCPI of 1.22.", "../chapters/chapter2/web/chapter2-math.html#sec-m-evm"],
    ["m2-scoring", 2, 3, "Weighted scorecard", "S_m = Σ w_k s_k,m with weights summing to one and scores on a common scale; weights are published before proposals are opened.", "../chapters/chapter2/web/chapter2-math.html#sec-m-selection"],
    ["m2-emv", 2, 3, "EMV of a decision", "Big-bang 0.20 × (−$120k) = −$24k against staged 0.10 × (−$60k) − $12k = −$18k, so staging wins while its overhead stays under $18k.", "../chapters/chapter2/web/chapter2-math.html#sec-m-selection"],
    ["m2-littles", 2, 3, "Little's Law", "WIP = TH × CT, so cycle time is work in progress divided by throughput — 30 items at 10 a day is three days, 20 items is two.", "../chapters/chapter2/web/chapter2-math.html#sec-m-selection"],

    /* ---- W3: schedule arithmetic ---- */
    ["m3-defs", 3, 1, "Schedule definitions", "WBS, work package, critical path, float, lead vs lag and baseline vs forecast, each with the consequence the marker looks for.", "../chapters/chapter3/web/chapter3-math.html#sec-m-defs"],
    ["m3-notation", 3, 2, "Network notation", "d, ES, EF = ES + d, LS, LF = LS + d, float = LS − ES, T = max EF, and the predecessor and successor sets.", "../chapters/chapter3/web/chapter3-math.html#sec-m-notate"],
    ["m3-cpm", 3, 3, "Worked critical path", "The ten-activity network runs 33 days on A→B→D→E→I→J, with C at 6 days, F at 5, H at 2 and G at 1 day of float.", "../chapters/chapter3/web/chapter3-math.html#sec-m-cpm"],
    ["m3-pert", 3, 3, "Three-point estimating", "E = (O + 4M + P)/6 and σ = (P − O)/6: O 3, M 6 and P 15 gives 7.0 weeks with σ = 2.0, not the plain mean of 8.0.", "../chapters/chapter3/web/chapter3-math.html#sec-m-pert"],
    ["m3-variance-sum", 3, 3, "Summing uncertainty", "Variances add along a path, σ_path² = Σσ_i², and standard deviations never do; shared causes break the independence the sum assumes.", "../chapters/chapter3/web/chapter3-math.html#sec-m-pert"],
    ["m3-deps", 3, 2, "Dependency taxonomy", "FS, SS, FF and SF relationships, mandatory or discretionary, internal or external, with lead and lag as the timing modifiers.", "../chapters/chapter3/web/chapter3-math.html#sec-m-taxonomy"],
    ["m3-techniques", 3, 2, "Estimating technique selection", "Analogous when information is thin, parametric when a rate is measurable, three-point when the tail is wide, bottom-up after full decomposition, rolling wave for the unspecified future.", "../chapters/chapter3/web/chapter3-math.html#sec-m-taxonomy"],
    ["m3-leadlag", 3, 3, "Lead and lag arithmetic", "With a start-to-start lead, ES_B = ES_A − ℓ; a positive ℓ is a lag that makes the successor wait, a negative ℓ is a lead that overlaps it.", "../chapters/chapter3/web/chapter3-math.html#sec-m-taxonomy"],
    ["m3-constraints", 3, 2, "Constraints and negative float", "Fixed dates, limited specialists and external approvals are constraints, not estimates; negative float is the network reporting that a constraint cannot be met as written.", "../chapters/chapter3/web/chapter3-math.html#sec-m-tutorial"],

    /* ---- W4: cost arithmetic ---- */
    ["m4-defs", 4, 1, "Cost definitions", "Cost baseline (approved, time-phased, including contingency), the two reserves, EV as budgeted cost of work completed, AC as real expenditure, and SV in dollars.", "../chapters/chapter4/web/chapter4-math.html#sec-m-defs"],
    ["m4-rollup", 4, 2, "Bottom-up roll-up", "C = Σ e_i r_i over work packages: the HR system case totals $109,900 at $60 and $50 an hour, before a 10% contingency.", "../chapters/chapter4/web/chapter4-math.html#sec-m-wbs"],
    ["m4-pert", 4, 2, "Three-point cost estimate", "E = (O + 4M + P)/6 with σ = (P − O)/6; O 8k, M 12k and P 20k gives $12,667 with $2,000 of one-sigma spread.", "../chapters/chapter4/web/chapter4-math.html#sec-m-estimating"],
    ["m4-parametric", 4, 2, "Parametric and benchmark rates", "Cost = driver × rate per unit, with benchmarks such as $150–$250 per user migrated and $40k–$60k for a two-week sprint.", "../chapters/chapter4/web/chapter4-math.html#sec-m-estimating"],
    ["m4-stack", 4, 2, "Budget stack", "Cost baseline = estimates + contingency; total project budget = baseline + management reserve, with reserves usually a percentage of the estimate base.", "../chapters/chapter4/web/chapter4-math.html#sec-m-baseline"],
    ["m4-pv", 4, 2, "Time-phasing creates PV", "PV_k = Σ planned cost in months 1..k, so the student portal reaches $85,000 of planned value by the end of month 3.", "../chapters/chapter4/web/chapter4-math.html#sec-m-baseline"],
    ["m4-evm", 4, 3, "The EVM chain", "EV = % complete × BAC, CV, SV, CPI and SPI, worked end to end on the student portal: 80k earned against 85k planned and 85k spent.", "../chapters/chapter4/web/chapter4-math.html#sec-m-evm"],
    ["m4-eac", 4, 3, "Three EAC formulas", "BAC/CPI when current performance continues; AC + (BAC − EV) when the variance was a one-off; AC + (BAC − EV)/(CPI × SPI) when both persist — 480k, 510k and 535,385 on the same data.", "../chapters/chapter4/web/chapter4-math.html#sec-m-evm"],
    ["m4-template", 4, 1, "EVM answer template", "Label PV, EV, AC and BAC; convert percentages with BAC; compute CV and SV with meaning; compute CPI and SPI; forecast with an assumption; recommend an action.", "../chapters/chapter4/web/chapter4-math.html#sec-m-checklist"],
    ["m4-tutorial", 4, 2, "Pricing a change", "Scope-creep requests are costed as new work packages plus contingency: $35,700 of build plus 10% is $39,270, before the $28,800 cost of two extra critical-path weeks.", "../chapters/chapter4/web/chapter4-math.html#sec-m-tutorial"],

    /* ---- W5: quality arithmetic ---- */
    ["m5-defs", 5, 1, "Quality definitions", "Quality as conformance to requirements, assurance as preventive and process-focused, control as detective and product-focused, and verification against validation.", "../chapters/chapter5/web/chapter5-math.html#sec-m-defs"],
    ["m5-symbols", 5, 2, "Quality notation", "R requirements, Q quality, m_i a metric, T_i its threshold, CoC and CoNC the two halves of quality cost, and λ the defect escape rate.", "../chapters/chapter5/web/chapter5-math.html#sec-m-symbols"],
    ["m5-coq", 5, 2, "Cost of quality formula", "CoQ = (C_p + C_a) + (C_if + C_ef): 30k and 50k of conformance against 70k and 50k of failure makes $200,000, 60% of it failure work.", "../chapters/chapter5/web/chapter5-math.html#sec-m-coq"],
    ["m5-coq-shift", 5, 3, "Rebalancing the quality spend", "Moving $20,000 into prevention at a 1.75 conversion factor cuts non-conformance by $35,000 and the total to $185,000; at $0.80 per dollar the shift destroys value.", "../chapters/chapter5/web/chapter5-math.html#sec-m-coq"],
    ["m5-metrics", 5, 3, "Acceptance criteria", "criterion = (m_i ⋈ T_i | load L, data set S): a metric, a comparator, a threshold and the conditions, because a metric with no threshold is a wish.", "../chapters/chapter5/web/chapter5-math.html#sec-m-metrics"],
    ["m5-cpm", 5, 3, "Quality work on the network", "In the release network A→B→D→E→F→G runs 21 days and only the frontend build carries one day of float, so a slip in the security review lands on the date.", "../chapters/chapter5/web/chapter5-math.html#sec-m-schedule"],
    ["m5-evm", 5, 3, "EVM on a quality problem", "BAC 200k with PV 100k, EV 80k and AC 110k gives CV −30k, SV −20k, CPI 0.73, SPI 0.80, EAC $275,000 and VAC −$75,000.", "../chapters/chapter5/web/chapter5-math.html#sec-m-evm"],
    ["m5-tcpi", 5, 3, "TCPI as a recovery test", "TCPI = (BAC − EV)/(BAC − AC): with BAC 120k, EV 50k and AC 62k the remaining work must deliver about $1.21 per dollar.", "../chapters/chapter5/web/chapter5-math.html#sec-m-evm"],

    /* ---- W6: resource arithmetic ---- */
    ["m6-defs", 6, 1, "Resource units and definitions", "Productivity as output per unit of effort, availability including leave and shared commitments, resource cost including running and licence cost, and over-allocation as a capacity statement.", "../chapters/chapter6/web/chapter6-math.html#sec-m-defs"],
    ["m6-notation", 6, 2, "Load, FTE and utilisation", "L = Σh_allocated / h_available, FTE = hours worked ÷ hours in a full-time period, D_t = Σ r_a, U_t = D_t / C and U_max = max U_t.", "../chapters/chapter6/web/chapter6-math.html#sec-m-notation"],
    ["m6-formulas", 6, 2, "Formula sheet", "The network passes and float, the PERT estimate, and the full earned-value set including EAC, ETC, VAC and TCPI in one place.", "../chapters/chapter6/web/chapter6-math.html#sec-m-notation"],
    ["m6-cpm", 6, 3, "Worked network", "The mobile release runs 14 weeks on A→B→D→E→F; the UI build carries four weeks of float and each test activity two.", "../chapters/chapter6/web/chapter6-math.html#sec-m-cpm"],
    ["m6-level", 6, 3, "Levelling arithmetic", "Delaying the regression suite by δ = 2 ≤ F = 2 turns demand from 2,4,3,0,0 into 2,2,1,2,2 and U_max from 2.00 into 1.00 with the 14-week finish intact.", "../chapters/chapter6/web/chapter6-math.html#sec-m-level"],
    ["m6-overtime", 6, 2, "Pricing the peak instead", "One tester-week is 38 hours × $80 = $3,040, and covering a two-tester peak with a 50% overtime premium costs 2 × 3,040 × 0.5 = $3,040 of avoidable premium.", "../chapters/chapter6/web/chapter6-math.html#sec-m-level"],
    ["m6-evm", 6, 3, "Resource cost performance", "PV 52k, EV 44k and AC 58k give CV −14k, SV −8k, CPI 0.759, SPI 0.846, EAC $131,818 and TCPI 1.33, with cloud capacity the line to attack.", "../chapters/chapter6/web/chapter6-math.html#sec-m-evm"],
    ["m6-select", 6, 2, "Technique selection", "Find the float before hiring, reassign or split when the over-allocation is critical, and decompose the cost variance by resource line.", "../chapters/chapter6/web/chapter6-math.html#sec-m-select"],
    ["m6-recall", 6, 1, "Exam answer templates", "Describe the process by naming input, output and an IT example; answer a numbers question with formula, substitution, unit and one sentence of interpretation.", "../chapters/chapter6/web/chapter6-math.html#sec-m-recall"],

    /* ---- W7: risk arithmetic ---- */
    ["m7-notation", 7, 2, "Risk notation", "p, I, L, S, r = L × S, EMV = p × I signed negative for opportunities, E_threat, E_opp, E_net, CR and the confidence factor z.", "../chapters/chapter7/web/chapter7-math.html#sec-m-defs"],
    ["m7-scoring", 7, 2, "Risk score and bands", "r = L × S on a 1–5 scale, banded extreme at r ≥ 15, high at 10–14, moderate at 5–9 and low below 5, with the thresholds set in the risk management plan.", "../chapters/chapter7/web/chapter7-math.html#sec-m-scoring"],
    ["m7-matrix", 7, 2, "Probability-impact grid", "The 5×5 grid is r = L × S drawn as a table, so the bands fall out as diagonal stripes that a shaded matrix and a threshold table agree on.", "../chapters/chapter7/web/chapter7-math.html#sec-m-scoring"],
    ["m7-net", 7, 3, "Net expected exposure", "E_net = E_threat − E_opp: A$240k + A$125k + A$180k of threats less A$120k of opportunity gives A$425k, the figure the contingency answers to.", "../chapters/chapter7/web/chapter7-math.html#sec-m-scoring"],
    ["m7-emv", 7, 3, "EMV and decision trees", "EMV(node) = Σ p_k V_k and the decision takes the largest (least negative) value: in-house −A$580k against outsourcing −A$620k.", "../chapters/chapter7/web/chapter7-math.html#sec-m-emv"],
    ["m7-monte", 7, 3, "Monte Carlo and confidence", "D_c ≈ μ + z_c σ with z = 1.28 at 90% and 1.65 at 95%; the reserve is the gap between the chosen percentile and the baseline.", "../chapters/chapter7/web/chapter7-math.html#sec-m-tools"],
    ["m7-cpm", 7, 3, "Schedule risk network", "The seven-package network finishes at day 23, and float is shared rather than owned: a slip on a predecessor consumes its successor's float too.", "../chapters/chapter7/web/chapter7-math.html#sec-m-cpm"],
    ["m7-sigma", 7, 3, "Summing critical variances", "Only critical activities contribute: 0.44 + 0.25 + 0.69 + 1.00 + 0.44 = 2.82 gives σ = 1.68 days and a 90% date of about 25.2 days.", "../chapters/chapter7/web/chapter7-math.html#sec-m-cpm"],
    ["m7-evm", 7, 2, "EVM as a cost-risk signal", "A ten-day A$100,000 project at day 4 with PV 40k, EV 35k and AC 40k gives CPI 0.875, EAC A$114,286 systemically or A$105,000 atypically.", "../chapters/chapter7/web/chapter7-math.html#sec-m-evm"],

    /* ---- W8: procurement arithmetic and documents ---- */
    ["m8-defs", 8, 1, "Procurement definitions", "Procurement as acquiring goods, services or results from outside the team through a contract, make-or-buy, SOW, RFP vs RFQ, the procurement schedule and governance.", "../chapters/chapter8/web/chapter8-math.html#sec-m-defs"],
    ["m8-taxonomy", 8, 2, "Document, method and contract axes", "SOW for the what, RFP for solutions, RFQ for standardised price; weighted scoring, checklist or scorecard; fixed-price, cost-reimbursable or T&M.", "../chapters/chapter8/web/chapter8-math.html#sec-m-taxonomy"],
    ["m8-breakeven", 8, 3, "Make-or-buy break-even", "Q* = F/(p − v): 180,000/(100 − 40) = 3,000 runs, so at 2,000 runs buying is cheaper by $60,000.", "../chapters/chapter8/web/chapter8-math.html#sec-m-arithmetic"],
    ["m8-scoring", 8, 3, "Weighted vendor scoring", "S_i = Σ w_j s_ij with weights summing to one and price normalised as 10 × P_min/P_i; on the lecture's weights vendor A scores 8.10 against B's 7.40.", "../chapters/chapter8/web/chapter8-math.html#sec-m-arithmetic"],
    ["m8-tco", 8, 2, "Total cost of ownership", "TCO = acquisition + running + exit: $210k against $255k, so the lower bid loses on ownership cost by $45,000.", "../chapters/chapter8/web/chapter8-math.html#sec-m-arithmetic"],
    ["m8-incentive", 8, 3, "Incentive fee and PTA", "fee = f_t + α_s(C_t − C_a) and PTA = (P_c − (C_t + f_t))/α_b + C_t: a $20k overrun pays $44,000 and the ceiling binds at $542,857.", "../chapters/chapter8/web/chapter8-math.html#sec-m-arithmetic"],
    ["m8-progress", 8, 2, "Contract progress in three curves", "PV is what the contract schedules, EV only what has been formally accepted and AC what has been invoiced, so SV and CV are contractual rather than internal.", "../chapters/chapter8/web/chapter8-math.html#sec-m-arithmetic"],
    ["m8-schedule", 8, 3, "Procurement schedule float", "The TechSolutions chain runs 20 weeks with zero float while hardware procurement holds 7 weeks, the audit 8 and data migration 5; a three-week vendor slip makes it 23.", "../chapters/chapter8/web/chapter8-math.html#sec-m-schedule"],
    ["m8-risk", 8, 2, "Risk exposure and response value", "RE = p × I summed to $188k of expected-value contingency, and ΔRE must exceed the cost of the response — $50k saved for a $30k second vendor.", "../chapters/chapter8/web/chapter8-math.html#sec-m-risk"],
    ["m8-checklist", 8, 1, "Six-step procurement checklist", "Which process, make or buy, which document, which contract type, which evaluation method, and what acceptance evidence releases payment.", "../chapters/chapter8/web/chapter8-math.html#sec-m-checklist"]
  ].map(function (n) {
    return { id: n[0], ch: n[1], diff: n[2], label: n[3], def: n[4], href: n[5] };
  }),
  edges: [
    /* W1 */
    ["m1-defs", "m1-triple", 7], ["m1-triple", "m1-signs", 8], ["m1-signs", "m1-effort", 5],
    ["m1-effort", "m1-cpm", 7], ["m1-cpm", "m1-evm", 6], ["m1-evm", "m1-indices", 9],
    ["m1-indices", "m1-forecast", 8], ["m1-defs", "m1-coq", 6], ["m1-coq", "m1-indices", 4],
    ["m1-triple", "m1-evm", 5], ["m1-forecast", "m1-defs", 4],
    /* W2 */
    ["m2-lifecycle", "m2-charter", 7], ["m2-wbs", "m2-cpm", 8], ["m2-cpm", "m2-evm", 6],
    ["m2-evm", "m2-scoring", 4], ["m2-scoring", "m2-emv", 5], ["m2-emv", "m2-littles", 4],
    ["m2-wbs", "m2-scoring", 4],
    /* W3 */
    ["m3-defs", "m3-notation", 7], ["m3-notation", "m3-cpm", 9], ["m3-cpm", "m3-variance-sum", 7],
    ["m3-pert", "m3-cpm", 8], ["m3-pert", "m3-variance-sum", 8], ["m3-deps", "m3-leadlag", 7],
    ["m3-notation", "m3-deps", 6], ["m3-techniques", "m3-pert", 7], ["m3-constraints", "m3-cpm", 6],
    ["m3-leadlag", "m3-cpm", 6],
    /* W4 */
    ["m4-defs", "m4-stack", 8], ["m4-rollup", "m4-stack", 7], ["m4-pert", "m4-rollup", 6],
    ["m4-parametric", "m4-rollup", 5], ["m4-stack", "m4-pv", 8], ["m4-pv", "m4-evm", 9],
    ["m4-evm", "m4-eac", 9], ["m4-eac", "m4-template", 7], ["m4-evm", "m4-template", 7],
    ["m4-tutorial", "m4-rollup", 5], ["m4-defs", "m4-evm", 7], ["m4-eac", "m4-tutorial", 5],
    /* W5 */
    ["m5-defs", "m5-symbols", 6], ["m5-symbols", "m5-metrics", 8], ["m5-metrics", "m5-cpm", 5],
    ["m5-defs", "m5-coq", 7], ["m5-coq", "m5-coq-shift", 8], ["m5-metrics", "m5-evm", 5],
    ["m5-evm", "m5-tcpi", 7], ["m5-cpm", "m5-evm", 6], ["m5-coq-shift", "m5-tcpi", 4],
    /* W6 */
    ["m6-defs", "m6-notation", 8], ["m6-notation", "m6-formulas", 7], ["m6-notation", "m6-level", 8],
    ["m6-cpm", "m6-level", 8], ["m6-level", "m6-overtime", 6], ["m6-formulas", "m6-evm", 8],
    ["m6-level", "m6-evm", 6], ["m6-select", "m6-level", 7], ["m6-recall", "m6-formulas", 5],
    ["m6-cpm", "m6-evm", 5],
    /* W7 */
    ["m7-notation", "m7-scoring", 8], ["m7-scoring", "m7-matrix", 7], ["m7-scoring", "m7-net", 8],
    ["m7-net", "m7-monte", 6], ["m7-notation", "m7-emv", 8], ["m7-emv", "m7-monte", 6],
    ["m7-cpm", "m7-sigma", 8], ["m7-sigma", "m7-monte", 7], ["m7-evm", "m7-net", 5],
    ["m7-matrix", "m7-emv", 5],
    /* W8 */
    ["m8-defs", "m8-taxonomy", 8], ["m8-taxonomy", "m8-breakeven", 7], ["m8-taxonomy", "m8-scoring", 8],
    ["m8-scoring", "m8-tco", 6], ["m8-taxonomy", "m8-incentive", 8], ["m8-incentive", "m8-progress", 6],
    ["m8-progress", "m8-schedule", 5], ["m8-breakeven", "m8-risk", 4], ["m8-risk", "m8-checklist", 6],
    ["m8-schedule", "m8-checklist", 6],
    /* Cross-chapter: the toolkit is one chain of dependencies */
    ["m1-triple", "m4-defs", 6], ["m1-effort", "m4-rollup", 7], ["m1-cpm", "m3-cpm", 8],
    ["m1-evm", "m4-evm", 9], ["m1-indices", "m4-evm", 8], ["m1-forecast", "m6-formulas", 7],
    ["m1-coq", "m5-coq", 8], ["m2-wbs", "m3-defs", 5], ["m2-cpm", "m3-cpm", 7],
    ["m2-evm", "m4-evm", 7], ["m2-scoring", "m8-scoring", 6], ["m2-emv", "m7-emv", 7],
    ["m3-cpm", "m5-cpm", 6], ["m3-cpm", "m6-cpm", 7], ["m3-cpm", "m7-cpm", 7],
    ["m3-cpm", "m8-schedule", 6], ["m3-pert", "m4-pert", 8], ["m3-variance-sum", "m7-sigma", 8],
    ["m3-techniques", "m4-parametric", 6], ["m3-notation", "m6-notation", 6],
    ["m4-evm", "m5-evm", 8], ["m4-evm", "m6-evm", 8], ["m4-evm", "m7-evm", 7],
    ["m4-evm", "m8-progress", 6], ["m4-stack", "m7-net", 6], ["m4-eac", "m6-formulas", 6],
    ["m4-defs", "m8-defs", 4], ["m5-metrics", "m8-taxonomy", 4], ["m6-formulas", "m7-evm", 5],
    ["m7-scoring", "m8-risk", 6], ["m7-monte", "m4-stack", 6], ["m8-risk", "m7-net", 6]
  ]
};
