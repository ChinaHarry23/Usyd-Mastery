# INFO5995 Chapter 2 — AI-Assisted Vulnerability Discovery — Source Digest

**Sources read in full (both files, every line):**

| File | Lines | Bytes | Role |
|---|---|---|---|
| `chapters/chapter2/web/chapter2-study.html` | 697 | 52,423 | Week 2 study guide ("Week 2: AI-Assisted Vulnerability Discovery") |
| `chapters/chapter2/web/chapter2-math.html` | 453 | 38,016 | Week 2 "Foundations" supplement (quantitative page) |

Both pages are built from the Week 2 lecture deck (INFO5995, *AI-Assisted Vulnerability Discovery & Mobile Security*). The math page states its own provenance in `sec-m-hero`: "Definitions verified against the lecture deck", "Screening and coverage maths is standard detection theory", "Cost figures are illustrative, not lecture numbers". The math page also states in `sec-m-notation` that its symbols are "a *revision aid* introduced on this page … they are not lecture notation and should not be quoted as such."

**Chapter scope:** why AI is used for vulnerability discovery; how LLMs predict tokens and hallucinate; reasoning models and tool-using agents; prompt/context design; failure modes of lazy, hallucinating, blind-spot models; human verification discipline; and the supporting arithmetic (token budget, slicing, screening precision/recall, coverage, cost per confirmed finding).

> **Note on the cryptography drill list:** the task template asks for modular arithmetic, XOR, key-space/brute-force, birthday bounds, RSA, Diffie–Hellman, hash sizes and key-strength tables *for cryptography chapters*. Chapter 2 is not a cryptography chapter — neither page contains a single modular-arithmetic, XOR, RSA, Diffie–Hellman, hash-size or key-strength expression. Nothing of that kind is reported below or invented. The chapter's own quantitative content (token budgets, slicing, precision/recall, verification cost, coverage, saturating discovery curves, cost per confirmed finding) is drilled instead in Part 2.

---

# PART 1 — SECTION-BY-SECTION FACTS

## A. `chapter2-study.html` (study guide, in document order)

### 1. `#hero` — Overview / hero block
- Page title: **"Week 2: AI-Assisted Vulnerability Discovery"**; course line "INFO5995 — Cybersecurity".
- Subtitle (verbatim): "Using static analysis, fuzzing and large language models to find vulnerabilities — and why a human still has to verify every finding."
- Four hero cards, i.e. the four claims the page is organised around: (1) "Modern software is too large to read line by line"; (2) "Text → tokens → patterns → prediction"; (3) "Agents call real tools: grep, static analysis, fuzzers"; (4) "Prediction is not proof — verify every finding".
- Provenance line: "Built from the Week 2 lecture deck (INFO5995, *AI-Assisted Vulnerability Discovery & Mobile Security*)".
- Navigation links out to `chapter2-math.html` ("Foundations"), `chapter2-mindmap.html` ("Mind Map"), the Quiz Hub and Flashcards; sidebar labels the week's status as "Lecture 2 built".
- The page's own `<meta name="description">` names the topics: why AI is used for vulnerability discovery, how LLMs predict tokens and hallucinate, how reasoning models and tool-using agents change the workflow, prompt and context design, the failure modes of lazy/hallucinating/blind-spot models, and the human verification discipline every finding requires.

### 2. `#sec-why` — Why AI Is on the Security Agenda
- Opening constraint quoted as the thing that "forces the whole topic": *"modern software is too large to inspect manually, line by line"*.
- Opening claim: "the volume of code, dependencies and artefacts in a real system already exceeds what a human review team can read exhaustively — so the practical question is not 'can AI find bugs?' but 'where in the workflow can a pattern-matching assistant add evidence, and where must a human take over?'"
- **What the assistant is genuinely good at** (list, verbatim): reading text cheaply and at volume — source, diffs, logs, traces; recognising shapes it has seen before in training data; driving the text-based tools that already exist; summarising an investigation so a human can audit the reasoning.
- **What it cannot supply** (list, verbatim): ground truth ("it does not know whether its answer is true"); authorisation ("it cannot decide what it is allowed to touch"); proof ("a plausible finding is not a demonstrated one"); judgement about impact, scope and disclosure.
- Framing to keep for the whole week: "the goal is not to ask AI 'find the vulnerabilities'. The goal is to *investigate with AI* — give it context, give it evidence, give it boundaries, and never trust a finding until you have verified it."
- Four-row wrong-question/right-question table:
  - Capability — wrong "Can the AI find a vulnerability here?" → right "What evidence would prove one exists?"
  - Authority — wrong "Can the AI do it?" → right "Is the AI *authorised* to act?"
  - Scope — wrong "Point it at the repository." → right "Which targets, which techniques, which limits?"
  - Outcome — wrong "It produced a list of bugs." → right "What did we learn about the system?"

### 3. `#sec-llm` — How an LLM Responds
- Minimum model required by the lecture: "a prompt goes in, a response comes out, and the response is a prediction over patterns learned during training."
- **Key takeaway 1 — LLMs predict patterns:** "LLMs can *appear* intelligent, but they generate responses by predicting likely patterns. They do **not** automatically know whether an answer is true or correct." The security consequence: "many vulnerabilities also follow recognisable patterns" — which is why AI can help identify suspicious code, and why "every finding still needs evidence and verification".
- Five-stage pipeline in `#ix-llm-loop`, titled "The minimal model of an LLM interaction" with subtitle "Every capability and every failure mode in this week comes out of these five stages":
  1. **System prompt** — "Sets instructions, role and behavioural boundaries before the user interacts with the model."
  2. **User prompt** — "The request: a question, a file, a diff, a hypothesis to test."
  3. **Tokenise & predict** — "Text becomes tokens; the model predicts the most likely continuation from learned patterns."
  4. **Response** — "Fluent output that is not automatically true — the model does not check its own answer against reality."
  5. **Conversation context** — "Earlier prompts and responses are fed back in, so each new response can be shaped by what came before."
- **Three demonstrated behaviours** (cards): (a) *Sampling is not deterministic* — "The same prompt does not always produce exactly the same response. Two identical requests can return two different findings, which is a feature for coverage and a problem for reproducibility — so record the prompt, the model and the settings alongside every finding." (b) *Context changes the response* — "'What are we working on today?' answered with 'It's Sunday' produces a different reply than the same question asked cold… a stale or contaminated conversation degrades an investigation." (c) *The system prompt is a control layer* — change "you are a friendly assistant" to "you are a security reviewer reporting evidence only" and "the same user prompt produces a materially different analysis."
- Callout: boundaries are "part of the design, not an afterthought"; when a request carries harmful intent the model should recognise it and respond within its safety boundaries; in a security investigation "the agent's permitted targets, tools and actions are defined *before* the work starts, not negotiated while it runs."
- Quick check (`#sec-llm`): identical prompt run twice yielding two lists → correct reading is "Output is not deterministic, so the run conditions must be recorded and repeated runs are a coverage technique". Rejected: "the model learned from the first response and changed its mind" (a different answer is not evidence of learning within one conversation, and sampling alone makes identical prompts diverge) and "the second list is the accurate one because it had more time to reason" (neither list is verified yet).

### 4. `#sec-tokens` — Key Takeaway 2: Code Is Data Too
- Core chain (flow diagram, four nodes): **Text → Tokens → Patterns → Prediction**. "Code, execution traces and other technical artefacts are also text, so they can be analysed the same way — within limits the deck makes explicit."
- Difficulty table by artefact:
  - **Mainstream source code (Python, Java, C, JavaScript)** — signal: "Huge volume of natural-language-like signal plus clean paired examples of code and explanation"; difficulty "Lowest — the patterns are well represented".
  - **An obscure language with no syntax provided** — "The model lacks token boundaries, keywords, structure and grammar hints"; it "must first *guess*: is this functional or object oriented? What is a function declaration? How are variables defined?" and "may hallucinate structure from other languages and default to something that looks like C, Python or Java style."
  - **Decompilation from machine code** — "Less natural-language signal, less structured high-level patterns, fewer clean paired examples; machine code is low level and ambiguous"; "Much harder — requires reasoning about *semantics*, not just syntax".
  - **Cryptographic and consensus proofs** — "Not even verifiable by inspection of text alone; may require humans to validate manually"; "The hardest type of security question".
- **Hallucination definition (verbatim):** "Hallucination means the model produces something that sounds correct but is not grounded in reality." In vulnerability discovery it takes the shape of "a reported weakness with no path through the code that reaches it — a plausible narrative supported by nothing." The lecture's reaction "is not to abandon the tool but to *pause, think*, and reduce the room for invention."
- Consequences callout: "supply the syntax (or the language, the build files and a representative module) before asking for analysis; prefer artefacts with high signal; and treat an analysis of decompiled or proof-level material as a hypothesis generator, never as a conclusion."
- Quick check: reviewing decompiled output versus original C source → the deck's reason is "less natural-language and structural signal, fewer clean paired examples, and the code is low-level and ambiguous", requiring "reasoning about semantics rather than just syntax". Rejected: "the decompiled file is usually much larger" (volume makes a task expensive, not fundamentally harder) and "decompilers cannot recover enough code to analyse at all" (the argument is about signal available to the model, not tooling quality).

### 5. `#sec-reasoning` — Reasoning Models: The Aha Moment for Security
- Definition-by-behaviour: "A reasoning model does more internal processing before producing its answer." The lecture's example is the **OpenAI o-series family**, described by **four observable properties** (metric cards):
  1. **Internal scratchpad** — "Some internal working happens before the model speaks."
  2. **That work can be long** — "Hundreds or thousands of tokens of internal reasoning."
  3. **A visible indicator** — "You may see a 'thinking' indicator while it works."
  4. **Controllable effort** — "Effort is often selectable — low, medium, high in some variants."
- Caveat stated explicitly: "more reasoning can improve performance, but it does *not* guarantee a correct answer. Reasoning reduces the rate of shallow answers; it does not create ground truth."
- **The aha moment for security:** after **o3-class and R1-class** reasoning models, "security has completely changed"; "things that did not work before are now starting to work"; and "we start to find real vulnerabilities on a large scale". Read it as "a shift in the **economics of investigation** — deep multi-step analysis became cheap enough to run across many targets — not as a claim that the output is verified."
- Before/with comparison: *before* — "Single-pass pattern matching: the model answers immediately from the surface of the prompt. Useful for triage and for explaining a snippet you already suspect, weak at following a data flow across several files." *With* — the model "can hold an intermediate chain of steps — trace a value from input to sink, hold several hypotheses at once, notice that hypothesis two contradicts the code it read in step one. The hidden reasoning is effort you can scale, and it is also a step you cannot audit directly."
- `#ix-reasoning` is an empty mount `<div>` for an interactive widget; the surrounding static content (the four metric cards, the caveat, the aha-moment box and the before/with comparison) is what the page itself asserts.

### 6. `#sec-agents` — Terminal AI Agents: Tools, Evidence and Boundaries
- Opening step: "**reasoning is not enough**. Code repositories can be huge — thousands of files, projects that depend on each other — while the context window is small."
- **Three facts that force a new architecture:** repositories are enormous and interdependent; the context window cannot hold them; "LLMs handle text in a relatively 'cheap' way — that is their advantage".
- **What already exists to be driven:** basic terminal tools `grep`, `ls`, `cd`, `cat`, `top`; networking tools; static analysis and dynamic analysis programs.
- **Definition — an AI agent (verbatim):** "An AI agent can decide whether to answer directly or **use a tool to gather more evidence**. It emits a tool-call instruction, receives the tool result, and uses that result to decide what to do next or what to answer. The tool gathers evidence; the AI reasons over it."
- **Figure — the agent investigation loop** (`#ix-agent-loop` mount + hand-drawn SVG with `aria-label` "Diagram of an agent investigation loop: system prompt, user prompt, LLM, tool call, tool executor, tool result, then verification and report"). Boxes and their sub-labels: *System prompt* — role, scope, boundaries; *User prompt* — question, evidence, target; *LLM* — reasoning (hidden); *Tool executor* — grep, cat, analyzer; *Tool result* — raw evidence, not a verdict; *Human check* — reproduce, then report. Arrows: user prompt → LLM; system prompt → LLM; LLM → tool executor; tool executor → tool result; tool result → back to LLM (dashed — "the part that makes an agent useful and dangerous at once — it decides its own next tool call"); LLM → human check, labelled "candidate finding". Caption: "The evidence loop: a tool call returns facts, the model reasons over those facts, and only a human closes the loop by reproducing the finding."
- Insight box: "the first question is not 'can the AI do it?' but **'is the AI authorised to act?'**"; an agent with terminal access "is executing commands against real systems"; the security boundary — "which targets, which tools, which actions, what it may never touch — has to be enforced somewhere deliberate, and the deck's point is that this is a design decision, not a default."
- **Four-layer boundary table** (Layer / What belongs there / Failure if it is missing):
  - **Authority** — "Written scope: in-scope systems, permitted techniques, time window, escalation path" → "The agent acts outside authorisation — a legal and ethical problem, not just a technical one".
  - **Boundary enforcement** — "Sandbox, read-only mounts, allow-listed commands, credential isolation" → "A prompt injection or a wrong command reaches production".
  - **Evidence trail** — "Every tool call, result and reasoning step retained for review" → "You cannot reproduce or defend a finding".
  - **Capability tiering** — "More cyber capability is granted only with more trust in the operator" → "Access to the most powerful tooling becomes the weakest link".
- Quick check: an agent asked "what files are in this folder?" emits a tool call, receives three file names, then answers → correct reading: "The agent decides to gather evidence with a tool, then reasons over the returned result" (the tool supplies the facts, the model supplies the decision). Rejected: the tool call was decorative; the agent has "verified" anything (running a command is an action, not verification).

### 7. `#sec-prompt` — Using AI to Find Vulnerabilities: Context, Evidence, Boundaries
- Operating rules: "AI is powerful but it is not careful by default; you must give it *context, evidence and boundaries*; and never trust a finding until you verify it."
- **Context** — "Bad prompts produce shallow answers; partial code produces shallow analysis. Supply the language, the build files, the module boundary, the framework in use, and the contract the code is supposed to satisfy."
- **Evidence** — "Ask for the tool output, the file and line, the execution trace, the minimal reproducible case. A claim with no artefact attached is a hypothesis, not a finding."
- **Boundaries** — "State what the agent may read, run and change, and what it must never touch. Define the definition of done before the investigation starts."
- **Weak-prompt table** (Weak prompt / Why it fails / Stronger framing), verbatim framings:
  - "Find the vulnerabilities." → "No artefact, no scope, no output contract; invites a confident list with no proof" → "Review *this module* for untrusted input reaching a query. For each candidate, give file, line, the data path and the input that would trigger it. Report 'none found' if the path does not exist."
  - "Is this code secure?" → "A yes/no question answers itself; you get a verdict instead of an analysis" → "List the assumptions this code makes about its inputs, then say which of those assumptions the caller violates."
  - "Here are 40 000 lines. Find bugs." → "The context window cannot hold it; the model samples the surface and stops" → "Start by listing the entry points, then analyse one entry point at a time and record what has already been checked."
  - "You are a helpful assistant." → "No role boundaries, so the model optimises for a satisfying answer" → "You are a security reviewer. Report only what the evidence supports; state explicitly when a claim is unverified."
- **Ordered workflow, `#ix-workflow`** ("Order an AI-assisted review workflow", 8 steps, in the order the page implies):
  1. Define the target, the scope and the authority in writing
  2. Give the model the context it needs: language, build files, module boundary, expected contract
  3. Enumerate the attack surface — entry points, trust boundaries, data flows
  4. Run this week's toolbox: static analysis, fuzzing, manual review, LLM reading
  5. Ask for concrete proof of each candidate finding, not a list
  6. Run the review again with different phrasing, models and effort settings
  7. Reproduce the finding yourself and trace the exact data path
  8. Write up the evidence, the impact and the fix — and record what was checked and found clean
- **Technique-fit table** (Technique / What it contributes / Where AI fits):
  - **Manual review** — "Judgement about intent, contracts and design; notices the logic flaw no pattern covers" → AI "prepares context, summarises a module, drafts the questions to ask of the code".
  - **Static analysis** — "Whole-codebase coverage, deterministic rules, reproducible results with file and line" → AI "runs the analyser, triages and clusters its output, explains a rule's reasoning, proposes whether a warning is reachable".
  - **Fuzzing** — "Dynamic evidence: an input that actually crashes or misbehaves is proof, not a prediction" → AI "writes and mutates harnesses and seed corpora, reads the crash dump, proposes the minimal case".
  - **LLM code review** — "Pattern recognition at volume, across languages and unfamiliar code, with no rule to write first" → "The reading itself — with the caveat that its output is a hypothesis until a human confirms it".
- Quick check: best fix for a shallow analysis of a partial listing → "supply the missing context: the language, the framework, the surrounding module and the contract the code must satisfy". Rejected: asking for confidence levels ("an ungrounded answer can be stated with high confidence"); raising reasoning effort on the same partial listing ("effort cannot supply information the prompt never provided").

### 8. `#sec-failures` — Failure Modes and How to Counter Them
- Framing: "Three named failure modes each come with the deck's own countermeasures. Learn them as problem-and-response pairs: that is how they appear in an exam question." (Four cards appear, plus a sixth row in the matcher.)
- **Models can be lazy** — Problem: "the model stops at the first obvious issue. If it works for too long it is not user friendly — models were trained not to work for too long." Countermeasures: summarise what has already been checked, in a file or a table; explicitly ask for new and different issues; ask for edge cases; ask for non-obvious logic flaws.
- **Models can hallucinate** — Problem: "it reports fake vulnerabilities." Countermeasures: ask for concrete proof; ask for a minimal reproducible example; ask for the exact execution trace; ask it to generate a PoC (*then verify that PoC yourself*).
- **Models can miss things** — Problem: "it overlooks vulnerabilities." Countermeasures: run multiple times; change the phrasing; use different models; use different temperatures; ask the model to critique its own answer.
- **Models are sensitive to framing and short on context** — Problem: "bad prompts give shallow answers; partial code gives shallow analysis." Countermeasures: rewrite the prompt around the artefact and the contract; give the module, not the fragment; ask a narrower question with a defined output format; split a large target into units you can actually supply.
- **Matcher `#ix-fail-match`** ("Match the failure mode to the countermeasure", six pairs): Lazy — stops at the first obvious issue → summarise what has been checked, then ask explicitly for new, different, edge-case and non-obvious logic flaws. Hallucinating — reports fake vulnerabilities → demand concrete proof: a minimal reproducible example and the exact execution trace. Missing things — overlooks vulnerabilities → run multiple times, change the phrasing, use different models and temperatures, ask for self-critique. Framing-sensitive — shallow answers → rewrite the prompt around the artefact, the contract and a defined output format. Context-starved — shallow analysis of partial code → supply the whole module, the language, the build files and the framework in use. Non-deterministic — two runs, two answers → record the prompt, model, temperature and effort with every finding so it can be reproduced.
- Section-summarising callout: "the countermeasures are not about making the model smarter — they are about making the *claim* checkable. Every technique above either forces the model to attach evidence, or forces the search to cover ground a single run would have skipped."
- `#ix-failure` is an empty mount `<div>` for an interactive widget in this section.

### 9. `#sec-verify` — Human Verification: From Finding to Evidence
- Lead: "The point the deck returns to twice: *never trust a finding until you verify it*. Verification is a procedure, not a feeling of confidence."
- **Verification pipeline, `#ix-verify-pipe`** ("The verification pipeline for a single candidate finding"; subtitle: "A candidate is not a vulnerability until it survives every gate in this chain"), 7 stages:
  1. **Candidate** — "The model's claim: a weakness, a location and a reason."
  2. **Locate** — "Open the file at the stated line. Confirm the code is what the model said it was."
  3. **Trace the data path** — "Follow the value from its source to the sink by hand. Every hop must exist in the code, not in the narrative."
  4. **Test the trigger** — "Construct the input in an authorised environment. A crash or observed misbehaviour is evidence; a description of one is not."
  5. **Minimise** — "Reduce to the smallest case that still demonstrates the issue, so someone else can reproduce it."
  6. **Assess impact** — "What does an attacker gain, under which preconditions, with what reachability? State the limits of your evidence."
  7. **Report** — "Finding, evidence, reproduction steps, impact, fix — plus what was checked and found clean."
- **Verdict table** (Verdict / What you have / What you do next):
  - **Confirmed** — "A reachable path and a demonstrated effect" → "Minimise, assess impact, report with evidence and a proposed fix".
  - **Refuted** — "The path does not reach the sink, or the input cannot be attacker-controlled" → "Record it as refuted with the reason — a refuted candidate is a result, and it prevents the same false lead being chased twice".
  - **Unresolved** — "The code is ambiguous, the dependency is unavailable, or you lack authorisation to test" → "State the limit explicitly and hand it to a human with the context needed to decide".
- Insight box "The AI solved it — but did we learn anything?": "an investigation has value beyond its answer"; what you want in the transcript is the process: "**failures → adaptation → partial success → verification**", because that visible chain "is what makes the result auditable, teachable and repeatable — and it is also what distinguishes investigation from asking a machine for a lucky guess."
- **Responsible use** (def-box): "Every example in this unit is conceptual and standards-based. Analysis stays inside systems you are authorised to test, findings are reported through the agreed channel, and no third-party system is ever targeted. Capability and trust are matched: the more powerful the tooling, the more explicit the authorisation must be."
- **`#sol-1` — Worked example: designing an investigation, not making a request.** Scenario: a small web service, authorised lab environment. Six steps: (1) *Set the boundaries first* — written scope "this service, in this lab, read-only for the agent, no outbound network"; that answers "is the AI authorised to act?" and is decided before any prompt is written. (2) *Build the context package* — language and framework, build files, module map, routes accepting untrusted input, contract the code must satisfy; "the unit of work is one entry point with its callees — not the whole repository". (3) *Combine the techniques* — static analysis gives deterministic coverage and file-and-line output; the LLM triages/clusters and explains which warnings are reachable; manual review judges intent and design; fuzzing supplies dynamic proof for reachable candidates; "no single technique is asked to do the whole job". (4) *Prompt for evidence, not verdicts* — "For each candidate give file, line, the data path from source to sink, and the input that would trigger it. If the path does not exist, say so." (5) *Cover the gaps a single run leaves* — re-run with different phrasing, a different model and a different temperature; ask for edge cases and non-obvious logic flaws after summarising what was checked; "non-determinism is turned from a defect into a coverage technique". (6) *Verify by hand, then report* — open each file, trace the path yourself, construct the trigger in the lab, minimise it, state impact and preconditions, record what was refuted; "the report is the evidence chain, not the model's list".
- **`#sol-2` — Worked example: triaging one AI report.** Model output: "Critical SQL injection in the user search function; user input is concatenated into the query string." Six steps: (1) *Locate* — "If the code there is a parameterised query built with bound placeholders, the finding is already refuted — record the reason and move on. **Most false positives die at this step.**" (2) *Trace the data path* — follow the value back "through validation, encoding, the framework's own escaping and the caller. A path that breaks anywhere in that chain refutes the candidate." (3) *Test the trigger* — "A returned error, a changed result set or a crash is evidence. A description of what 'would' happen is not." (4) *Minimise* — smallest input that still shows the behaviour; "also the test of whether you understood the mechanism rather than the symptom". (5) *Check the inverse* — "ask the model to argue why the finding is *wrong*: 'give the strongest reason this input cannot reach the sink.'" A model asked to critique its own answer "often finds the framework control it missed the first time — and sometimes fails to, which raises your confidence in the confirmed case." (6) *Write the verdict* — confirmed (evidence, impact, fix), refuted (the reason, so nobody re-chases it) or unresolved (the precise limit, handed to a human); "Any of the three is a professional result; only an unverified claim is not."
- **`#sol-3` — Tutorial exercise: working backwards from an artefact you did not build.** The lecture's mobile pipeline: "**Kotlin / Java** human-readable code is built and compiled into an **APK**, which is what you receive; you then install and run it." Task: understand, investigate, verify. Six steps: (1) *Name what you have and what you lost* — "You hold the compiled package, not the source: symbol names may be stripped or obfuscated, and the manifest, resources and native libraries are part of the artefact." (2) *Set the boundary before touching it* — authorised assessment, isolated environment, "no interaction with the app's live backend"; same authorisation question as for any agent with tools. (3) *Choose the right technique for each layer* — "Manifest and permission review is structural and deterministic, so it is read directly. Decompiled bytecode is where AI-assisted reading is weakest … so treat any AI claim about decompiled code as a hypothesis to be checked against the code itself." (4) *Ask for structure, then for suspicion* — first "list the entry points, exported components and the trust boundary between app and backend"; only then "which of these handle untrusted data, and what would a data path from input to a sensitive sink look like?" (5) *Verify dynamically* — observe the app in the isolated environment, "let behaviour — not the narrative — decide"; the investigation log pattern is "failures → adaptation → partial success → verification". (6) *Report the process as well as the finding* — show what was tried, what failed, what the tool reported, and which step a human confirmed.

## B. `chapter2-math.html` (Foundations supplement, in document order)

### 10. `#sec-m-hero` — Foundations: the arithmetic behind AI-assisted discovery
- Tag: "INFO5995 — Week 2 supplement". Framing: "Week 2 is a workflow week, not a theorem week — so this page does the equivalent job."
- Stated purpose: pin down the definitions the lecture relies on, give "a compact notation for an investigation", then quantify the four things that decide whether AI-assisted discovery works: "the token budget, the screening arithmetic of an unverified finding list, the coverage of a fuzzing campaign, and the cost of verifying a claim before you act on it."
- Three provenance chips: "Definitions verified against the lecture deck"; "Screening and coverage maths is standard detection theory"; "**Cost figures are illustrative, not lecture numbers**".
- Sidebar table of contents groups: *Vocabulary* (`#sec-m-defs`, `#sec-m-notation`), *Quantities* (`#sec-m-tokens`, `#sec-m-screening`, `#sec-m-coverage`), *Practice* (`#sec-m-checklist`).

### 11. `#sec-m-defs` — Definitions that must be exact
- Lead: "These five terms carry the whole week. Write each one in a single sentence, with the consequence included."
1. **Hallucination** — "The model produces something that sounds correct but is **not grounded in reality**. In this unit: a reported vulnerability with no reachable path through the code — fluent, specific, and unverifiable."
2. **Static analysis** — "Examining code *without executing it* — parsing it into a representation and applying rules or queries to that representation." It gives "deterministic, reproducible, whole-codebase coverage with file-and-line output"; "it cannot observe runtime behaviour, and a warning is not a reachable vulnerability."
3. **Fuzzing** — "Supplying generated or mutated inputs to a running program and observing the result." Unlike a static warning or an AI claim, "a fuzzing crash is **dynamic evidence**: it demonstrates that the input actually reaches the fault."
4. **Reasoning model** — "A model that performs additional internal processing — an internal scratchpad, often hundreds or thousands of tokens, exposed only as a 'thinking' indicator and an effort setting — before producing its answer." Caveat: "more reasoning can improve performance, but it does **not** guarantee a correct answer."
5. **AI agent (security context)** — "A model that can decide whether to answer directly or **call a tool to gather evidence**, then reason over the tool's result. The tool supplies facts; the model supplies the decision about what to do next. Authority and boundaries are a separate design decision from capability."
- **Term / must contain / common wrong answer table:**
  - Hallucination — must contain "Sounds correct *and* is ungrounded"; wrong answer: "'The model made a typo' — that is an error, not a hallucination".
  - Static analysis — "No execution; rule or query over a parsed representation"; wrong: "Confusing it with a linter's style warnings, or claiming its output is proof of exploitability".
  - Fuzzing — "Generated inputs against a running target"; wrong: "Calling any automated testing 'fuzzing' — the defining feature is input generation and observation".
  - Reasoning model — "Extra internal processing before the answer"; wrong: "'A model that is always right' — the deck explicitly denies the guarantee".
  - AI agent — "Decides whether to call a tool, and acts on the result"; wrong: "Saying it is 'just a chatbot with a bigger context window'; the tool call is the defining behaviour".
- Quick check: correct statement about static analysis is "It examines code without executing it and produces reproducible, file-and-line results". Rejected: running the program on crafted inputs (= dynamic analysis); "a warning it produces proves the vulnerability is exploitable" (a warning shows a rule matched; reachability needs a data path or a dynamic test).

### 12. `#sec-m-notation` — Notation for an investigation
- Explicit disclaimer: "The lecture is written in prose and diagrams. The symbols below are a *revision aid* introduced on this page so you can write about the week's relationships compactly; they are not lecture notation and should not be quoted as such."
- **Symbol table (11 symbols):** \(T\) tokens — "The unit an LLM actually processes; text, code and traces are all converted into token sequences". \(W\) context window — "The maximum number of tokens visible to the model at once, prompt and response together". \(L\) codebase size — "Total tokens of the target; in a real repository \(L \gg W\)". \(\ell\) review unit — "The slice you actually supply: one entry point with its callees, not the whole tree". \(c\) cost per token — "Price of input plus output tokens; the reason a workflow is designed around slices". \(P\) precision — "Fraction of reported findings that are real; the inverse of the false-positive problem". \(R\) recall — "Fraction of the real vulnerabilities present that were found". \(\mathrm{FPR}\) false-positive rate — "\(1-P\): the share of the report you must dismiss by hand". \(C_v\) verification cost — "Human minutes spent confirming or refuting one candidate finding". \(E\) evidence — "The artefact that makes a claim checkable: file and line, data path, trace, minimal reproducer". \(A\) authority — "Written scope: which targets, which tools, which actions are permitted".
- **"The one relationship to remember"** (theorem box): "A candidate finding is a **claim**, and a claim is only as useful as the evidence attached to it." Formally a finding is the triple \(F = \langle \text{location},\ \text{mechanism},\ E \rangle\), where \(E\) is the evidence. "If \(E = \varnothing\) the triple describes a hypothesis, not a vulnerability — regardless of how fluent the prose around it is. All of this week's countermeasures exist to force \(E \neq \varnothing\)."
- **Matcher `#ix-m-terms`** ("Match the symbol to what it measures", seven pairs): \(W\) → "The maximum number of tokens the model can see at once"; \(L \gg W\) → "Why a whole repository cannot be reviewed in one prompt"; \(\ell\) → "The review unit: one entry point with its callees"; \(P = 1 - \mathrm{FPR}\) → "The share of reported findings that turn out to be real"; \(R\) → "The share of real vulnerabilities that were actually found"; \(C_v\) → "The human minutes needed to confirm or refute one candidate"; \(E = \varnothing\) → "A hypothesis rather than a vulnerability".

### 13. `#sec-m-tokens` — Tokens, context and the cost of looking
- Framing: "The deck's three constraints are all quantities: repositories are huge, the context window is small, and text is processed in a relatively 'cheap' way. Put numbers on them and the workflow design follows."
- **1. The context budget:** \(T_{\text{system}} + T_{\text{history}} + T_{\text{context}} + T_{\text{output}} \le W\). Consequence: "a long investigation fills its own window. Every tool result and every earlier exchange competes with the code you still want to show — which is why the deck prescribes summarising what has already been checked into a file or a table instead of carrying the whole transcript."
- **2. Slicing a codebase that does not fit:** \(n = \lceil L/\ell \rceil\). Worked page figure: \(L = 400{,}000\) tokens ("a mid-sized repository") and \(\ell = 8{,}000\) tokens → \(n = 50\) units. Stated limitation: "a unit boundary cuts call chains, so cross-module data paths are exactly the ones a slice-and-prompt workflow is most likely to miss."
- **3. The cost of one pass** (ignoring the history term for a single-pass run): \(\text{cost} \approx c \cdot n \cdot (\ell + \overline{T}_{\text{out}})\). Two stated consequences: "Cost is linear in the number of units, so **coverage is bought in slices**"; and the deck's countermeasure to missed findings "multiplies this expression by the number of passes \(m\). Re-running for coverage is a deliberate cost, not a free retry."
- **Workflow-choice table** (choice / effect on the model / cost consequence):
  - Supply syntax, language and build files with an obscure-language listing → "Removes the need to *guess* token boundaries, keywords, structure and grammar — reduces hallucinated structure borrowed from C, Python or Java style" → "A few hundred extra input tokens per call, against a large reduction in wasted output".
  - Ask one narrow question with a defined output format → "Shortens \(T_{\text{out}}\) and makes the answer checkable" → "Falls directly".
  - Ask "review everything" on a large artefact → "The model samples the surface and stops at the first obvious issue" → "Cheap per call, and the expensive part is the human time spent on shallow findings".
  - Escalate to a reasoning model at high effort → "Hidden internal tokens are spent before the answer" → "\(T_{\text{out}}\) grows substantially; you pay for thinking you cannot audit directly".
  - Let an agent drive tools instead of pasting files → "The tool returns only the relevant evidence, so the window is spent on facts rather than on whole files" → "Shifts cost from tokens to tool calls and execution time".
- Insight: **why "cheap text processing" is the whole argument for agents** — "If the model can read text economically and a repository cannot fit in the window, the only way to see the whole repository is to *act* on it — search it, count it, diff it, run an analyser over it — and read back the small result. That is precisely the step from a reasoning model to a terminal AI agent."
- Quick check: doubling the number of review passes → "Cost scales with the number of passes, and the extra passes are aimed at recall that a single run does not deliver". Rejected: recall unchanged (repeating a run is exactly the deck's countermeasure for misses); precision improves because agreement filters false positives (more passes add both real findings and false positives).

### 14. `#sec-m-screening` — Screening arithmetic: what an unverified list really costs
- Framing: "An AI report is a screening test. Standard detection arithmetic tells you exactly what is wrong with acting on one before verification — and why the false-positive problem is a budget problem, not an annoyance."
- **1. Precision, recall, FPR:** with \(TP\) real vulnerabilities correctly reported, \(FP\) fabricated or unreachable ones, \(FN\) real ones missed:
  \[ P = \frac{TP}{TP+FP}, \qquad R = \frac{TP}{TP+FN}, \qquad \mathrm{FPR} = \frac{FP}{TP+FP} = 1-P \]
  "Recall measures what you failed to see; precision measures what you will waste time on. A tool can be excellent at one and useless at the other, so **never quote a single number as 'the accuracy'**."
- **2. The verification budget:** with \(N = TP + FP\) candidates and \(C_v\) human minutes each:
  \[ T_{\text{verify}} = N \cdot C_v, \qquad T_{\text{wasted}} = FP \cdot C_v = (1-P)\cdot N \cdot C_v \]
  **Worked figure (verbatim numbers):** \(N = 200\), \(C_v = 4\) minutes → \(T_{\text{verify}} = 800\) minutes ≈ 13.3 hours. At \(P = 0.25\), "three quarters of that — 600 minutes, 10 hours — is spent refuting fabrications". At \(P = 0.10\) "the same list costs the same 13.3 hours for 20 real findings instead of 50". Conclusion quoted: "**Lower precision does not save time; it converts the same time into less result.**"
- **3. The cost of a miss:** \(C_{\text{miss}} = FN \cdot C_{\text{exp}}\), where \(C_{\text{exp}}\) is an average cost of exposure "(incident response, remediation, disclosure, downtime)". "Against hallucination you demand evidence, because every fabrication spends \(C_v\). Against misses you spend more passes and more techniques, because every miss hands \(C_{\text{exp}}\) to somebody else."
- **Chart `#ix-m-race`** — "Illustrative report composition at 200 candidates", subtitle "Three illustrative precision levels on the same list size. A revision aid for the arithmetic above, **not measured data from any tool**." Max = 200; rows: \(P = 0.50\) → "100 real · 100 to refute"; \(P = 0.25\) → "50 real · 150 to refute"; \(P = 0.10\) → "20 real · 180 to refute".
- Insight: **why the deck's countermeasures are stated as questions, not settings** — "Ask for concrete proof. Ask for a minimal reproducible example. Ask for the exact execution trace." Each request "is a filter on the right-hand side of \(P = TP/(TP+FP)\): it does not make the model more capable, it makes candidates cheap to reject. A finding that cannot produce a trace can be dismissed in seconds instead of traced by hand, and \(T_{\text{wasted}}\) collapses."
- Quick check: 200 candidates, \(P = 0.25\), \(C_v = 4\) minutes → "About 600 minutes: 150 false positives at 4 minutes each". Rejected: 800 minutes (that is \(N \cdot C_v\), the total budget); 200 minutes (that is \(TP \cdot C_v = 50 \times 4\), the time spent on real findings).

### 15. `#sec-m-coverage` — Coverage, fuzzing and the cost of finding one bug
- Framing: "Two more quantities decide whether a technique is worth running: how much of the input space it reaches, and how much effort each confirmed finding costs in total."
- **1. Coverage:** \(\text{cov} = \frac{|\text{covered}|}{|\text{reachable}|}, \quad 0 \le \text{cov} \le 1\), defined "over the observable surface of the target — basic blocks, branches, or the fraction of the input space that reaches them". Quoted warning: "Coverage is a proxy, not a verdict. High statement coverage with low *branch* coverage hides the paths that only execute under a rare guard, and those are where interesting faults live. Always ask which denominator a coverage number uses."
- **2. Saturating discovery curve:** \(B(t) = B_{\max}(1 - e^{-\lambda t})\), where \(t\) is elapsed fuzzing time and \(\lambda\) the discovery rate constant. Three consequences: "the first minutes are the most productive"; "the marginal bug gets steadily more expensive"; and "you can only tell a plateau from a slow region by *changing the seed corpus, the mutation strategy or the harness* — the same lesson as 'a single prompt run misses things'."
- **3. Cost per confirmed finding:** \(C_{\text{finding}} = \frac{C_{\text{run}} + N \cdot C_v + C_{\text{proof}}}{TP_{\text{confirmed}}}\), where \(C_{\text{run}}\) is compute and model spend, \(N\cdot C_v\) the screening cost from the previous section, \(C_{\text{proof}}\) the cost of building the minimal reproducer, and "only *confirmed* findings are counted in the denominator. This is the number to compare between techniques — not raw finding counts, and not token price."
- **Technique / what it supplies / typical blind spot / evidence quality table:** Manual review — intent, contracts, design and logic flaws; blind spot "Scale: it cannot cover a whole repository"; evidence "Strong on the paths a human actually read". Static analysis — "Deterministic whole-codebase rule coverage with locations"; blind spot "Reachability and runtime state; a match is not an exploit"; evidence "Reproducible, but indirect". Fuzzing — "Dynamic proof: an input that actually triggers the fault"; blind spot "Only reaches what the harness and corpus reach"; evidence "Direct — the crash is observed". LLM code review — "Pattern recognition at volume across unfamiliar languages"; blind spot "Hallucination, laziness and framing sensitivity; no ground truth"; evidence "None until a human verifies — \(E = \varnothing\) by default".
- **Scenario / dominant cost term / right response table:**
  - Low precision report from a broad scan → \(N \cdot C_v\), "screening dominates" → "Filter the workflow: demand traces and minimal reproducers, and prioritise reachable paths before verifying anything".
  - High precision, low recall → \(FN \cdot C_{\text{exp}}\), "misses dominate" → "More passes, different models and temperatures, a second technique, and self-critique prompts".
  - Repository far larger than the window → "\(n\) units × passes — \(L/\ell\) dominates" → "Move to an agent with tools so evidence is fetched on demand instead of pasted".
  - Decompiled or proof-level artefacts → "Effort per unit — the signal is weak" → "Treat AI output as hypothesis generation only; verify against the artefact itself".
- Quick check: "A fuzzing campaign reports 90 % statement coverage and 41 % branch coverage after two hours, with no new crashes in the last 40 minutes." Correct interpretation: "Many conditional paths are never exercised, and the flat stretch cannot be distinguished from a plateau without changing the corpus, mutation strategy or harness." Rejected: campaign essentially complete (statement coverage counts lines executed, not guards taken); "no crashes in 40 minutes proves the remaining branches contain no faults" (the curve \(B(t)\) saturates, so elapsed time never proves absence — "Absence of crashes is not evidence of absence").

### 16. `#sec-m-checklist` — Classifying an AI finding
- Framing: "Most Week 2 questions reduce to 'here is something a model said — what do you do with it?'. Run the claim through these steps in order and the answer writes itself."
- **Ordered triage checklist, `#ix-m-classify`** (7 steps): (1) "Ask what evidence is attached — location, mechanism, trace, reproducer"; (2) "Open the artefact and confirm the code at the stated location is what the claim describes"; (3) "Trace the data path by hand from source to sink and check every hop exists"; (4) "Decide whether the input is actually attacker-controlled under the stated preconditions"; (5) "Test the trigger in an authorised environment and observe the effect"; (6) "Minimise to the smallest reproducing case and state the impact with its limits"; (7) "Record the verdict — confirmed, refuted or unresolved — and what was found clean".
- **Step / look for / marks lost table:**
  1. Evidence — "\(E \neq \varnothing\): file and line, data path, execution trace, minimal reproducer"; marks lost "when you accept a fluent paragraph as proof".
  2. Location — "Does that line say what the model said it says?"; lost "when you trust the quotation without opening the file".
  3. Data path — "Every hop is present in the code, not in the narrative"; lost "when you assume a value reaches a sink because both exist somewhere in the project".
  4. Control — "Is the input attacker-controlled and is the code reachable in the deployed configuration?"; lost "when you ignore authentication, encoding or a framework control that breaks the chain".
  5. Trigger — "Observed behaviour in an authorised environment"; lost "when you describe what 'would' happen instead of what did".
  6. Minimise and assess — "Smallest reproducing case; impact stated with preconditions"; lost "when you overstate impact or leave the reproduction unrepeatable".
  7. Verdict — "Confirmed, refuted or unresolved — all three are results"; lost "when you report only the confirmed items and let the rest be re-chased".
- **Warning box "The step students skip":** "Step 4. A data path can be complete and still not be a vulnerability, because the input cannot be controlled by an attacker in the deployment that matters, or because a control upstream removes the dangerous characters. 'The path exists' and 'an attacker can walk it' are two different claims, and the second one is the one that gets reported."
- **`#sol-m1` — Worked classification** of three AI findings:
  1. *"Critical: hardcoded credentials in the configuration loader."* No file, no line, no excerpt → step 1 fails: \(E = \varnothing\). "This is the hallucination case." Cost asymmetry: "Five seconds to ask for the location; if you had sent it to an engineer instead, you would have paid \(C_v\) minutes for nothing." Verdict: "reject and re-ask with the evidence contract attached."
  2. *"User-controlled string concatenated into a query at `search.js:118`", with the data path quoted.* Steps 1–3 pass; step 4 decides: "an upstream encoder in the request pipeline neutralises the dangerous characters, so the input is not attacker-controlled at the sink." Verdict: "refuted, with the control named. This is the honest false positive, and recording the reason is what stops it being re-chased next month."
  3. *"Integer overflow in the parser's length check, reachable with a 4 GB body."* Steps 1–4 pass on paper, "but the deployment caps request bodies far below the trigger, and testing it requires a configuration the team does not run." Verdict: "unresolved — not refuted, because the code genuinely overflows; not confirmed, because the preconditions are outside your authorised environment. State the limit and hand it over."
  4. *What the triage cost:* "Suppose the first pass returned 200 candidates at \(C_v = 4\) minutes each: 800 minutes, 13.3 hours, to triage the list. Finding 1 is rejected before it reaches a human; finding 2 is refuted in about 6 minutes at the code; finding 3 is handed over. The economics of the week live in that first filter, not in the model's raw intelligence."
  5. *The sentence that earns the mark (verbatim):* "An AI finding is a hypothesis until it carries evidence: I locate the code, trace the data path by hand, check that the input is attacker-controlled under the deployed configuration, observe the effect in an authorised environment, minimise the case, and record the verdict — confirmed, refuted or unresolved — because refuted candidates and unresolved limits are results too."
- Closing callout: "Back to the week: definitions and quantities on this page, the LLM and agent mechanics plus the failure-mode countermeasures on the study guide, then the Quiz Hub and Flashcards for retrieval practice."

---

# PART 2 — FORMULAS AND NUMERIC DRILLS

Everything below is either quoted from the pages (marked **[page]**) or explicitly marked **[derived]** = my own arithmetic using the page's own formula with stated inputs. No cryptography arithmetic (modular, XOR, RSA, Diffie–Hellman, birthday, hash size, key strength) exists on either page.

## 2.1 Formulas exactly as the pages state them

| # | Formula | Page statement | Anchor |
|---|---|---|---|
| F1 | \(F = \langle \text{location},\ \text{mechanism},\ E \rangle\); if \(E = \varnothing\) it is "a hypothesis, not a vulnerability" | "All of this week's countermeasures exist to force \(E \neq \varnothing\)" | math `#sec-m-notation` |
| F2 | \(T_{\text{system}} + T_{\text{history}} + T_{\text{context}} + T_{\text{output}} \le W\) | "A prompt must fit the window, together with everything the model will generate and everything the conversation has already accumulated" | math `#sec-m-tokens` |
| F3 | \(n = \lceil L / \ell \rceil\) | "If \(L\) is the size of the target and \(\ell\) the size of one review unit, the number of units to process is…" | math `#sec-m-tokens` |
| F4 | \(\text{cost} \approx c \cdot n \cdot (\ell + \overline{T}_{\text{out}})\) | "Ignoring the conversation history term for a single-pass run"; multiplied by the number of passes \(m\) | math `#sec-m-tokens` |
| F5 | \(P = TP/(TP+FP)\) | "precision" | math `#sec-m-screening` |
| F6 | \(R = TP/(TP+FN)\) | "recall" | math `#sec-m-screening` |
| F7 | \(\mathrm{FPR} = FP/(TP+FP) = 1 - P\) | "false-positive rate … the share of the report you must dismiss by hand" | math `#sec-m-screening`, `#sec-m-notation` |
| F8 | \(T_{\text{verify}} = N \cdot C_v\) with \(N = TP + FP\) | "the screening cost" | math `#sec-m-screening` |
| F9 | \(T_{\text{wasted}} = FP \cdot C_v = (1-P)\cdot N \cdot C_v\) | wasted verification time | math `#sec-m-screening` |
| F10 | \(C_{\text{miss}} = FN \cdot C_{\text{exp}}\) | "A missed vulnerability is not free just because nothing was reported" | math `#sec-m-screening` |
| F11 | \(\text{cov} = |\text{covered}| / |\text{reachable}|,\ 0 \le \text{cov} \le 1\) | coverage over "basic blocks, branches, or the fraction of the input space that reaches them" | math `#sec-m-coverage` |
| F12 | \(B(t) = B_{\max}(1 - e^{-\lambda t})\) | cumulative unique fuzzing findings; \(t\) = elapsed fuzzing time, \(\lambda\) = discovery rate constant | math `#sec-m-coverage` |
| F13 | \(C_{\text{finding}} = (C_{\text{run}} + N \cdot C_v + C_{\text{proof}}) / TP_{\text{confirmed}}\) | "only *confirmed* findings are counted in the denominator" | math `#sec-m-coverage` |

## 2.2 Numeric drills — page-supplied numbers

**D1 — Slicing (page numbers, F3).** \(L = 400{,}000\) tokens, \(\ell = 8{,}000\) tokens.
\(n = \lceil 400{,}000 / 8{,}000 \rceil = \lceil 50 \rceil = \mathbf{50}\) units. **[page]**
Caveat attached on the page: "a unit boundary cuts call chains, so cross-module data paths are exactly the ones a slice-and-prompt workflow is most likely to miss."

**D2 — Verification budget (page numbers, F8/F9).** \(N = 200\), \(C_v = 4\) min.
\(T_{\text{verify}} = 200 \times 4 = 800\) min; \(800 / 60 = 13.333\ldots\) h ≈ **13.3 hours**. **[page]**

**D3 — Wasted share at \(P = 0.25\) (page numbers, F9).** \(FP = (1 - 0.25) \times 200 = 0.75 \times 200 = 150\).
\(T_{\text{wasted}} = 150 \times 4 = 600\) min \(= 600/60 = \mathbf{10}\) hours — "three quarters of that" 800-minute budget. **[page]**
Remaining useful share: \(TP = 0.25 \times 200 = 50\) findings; \(50 \times 4 = 200\) min \(= 3.33\) h. **[derived]**

**D4 — Same list, \(P = 0.10\) (page numbers).** \(TP = 0.10 \times 200 = 20\); \(FP = 180\).
\(T_{\text{verify}} = 800\) min \(= 13.3\) h (unchanged); \(T_{\text{wasted}} = 180 \times 4 = 720\) min \(= 12\) h. **[page for 20 real findings and the unchanged 13.3 h; the 720 min figure is derived from \(FP \times C_v\)]**
Page's conclusion, quoted: "Lower precision does not save time; it converts the same time into less result."

**D5 — Report composition at three precision levels (chart rows, page numbers).**
\(P = 0.50\): \(TP = 100\), \(FP = 100\) → "100 real · 100 to refute"; \(T_{\text{wasted}} = 100 \times 4 = 400\) min \(= 6.67\) h. **[page for 100/100; 400 min derived]**
\(P = 0.25\): \(TP = 50\), \(FP = 150\) → "50 real · 150 to refute". **[page]**
\(P = 0.10\): \(TP = 20\), \(FP = 180\) → "20 real · 180 to refute". **[page]**

**D6 — Minutes of human time per real finding on the same 800-minute budget [derived from D2/D3/D5].**
\(P = 0.50\): \(800/100 = 8\) min per real finding. \(P = 0.25\): \(800/50 = 16\) min. \(P = 0.10\): \(800/20 = 40\) min.

**D7 — Consistency check of F5/F7 [derived].** If \(TP = 50\) and \(FP = 150\): \(P = 50/(50+150) = 50/200 = 0.25\); \(\mathrm{FPR} = 150/200 = 0.75 = 1 - 0.25\). ✓ (matches the page's \(P = 0.25\) row)

**D8 — Recall example [derived].** If \(TP = 50\) and \(FN = 50\): \(R = 50/(50+50) = 0.50\). The page gives no recall figure; it only notes that "recall measures what you failed to see" and that a tool "can be excellent at one and useless at the other".

## 2.3 Numeric drills — derived with the pages' formulas (inputs stated)

**D9 — Context budget (F2).** Suppose \(T_{\text{system}} = 1{,}000\), \(T_{\text{history}} = 30{,}000\), \(T_{\text{context}} = 100{,}000\), \(T_{\text{output}} = 4{,}000\).
Sum: \(1{,}000 + 30{,}000 = 31{,}000\); \(31{,}000 + 100{,}000 = 131{,}000\); \(131{,}000 + 4{,}000 = \mathbf{135{,}000}\) tokens.
Against \(W = 128{,}000\): \(135{,}000 > 128{,}000\), over budget by \(135{,}000 - 128{,}000 = \mathbf{7{,}000}\) tokens. **[derived]**

**D10 — Cost of one pass (F4), tokens only.** \(c\) is a price per token, so set \(c = 1\) unit per token to count tokens: \(n = 50\), \(\ell = 8{,}000\), \(\overline{T}_{\text{out}} = 2{,}000\).
\(50 \times (8{,}000 + 2{,}000) = 50 \times 10{,}000 = \mathbf{500{,}000}\) tokens per pass. With \(m = 2\) passes: \(2 \times 500{,}000 = \mathbf{1{,}000{,}000}\) tokens — "re-running for coverage is a deliberate cost, not a free retry". **[derived]**

**D11 — Cost of a miss (F10).** \(FN = 3\) misses, \(C_{\text{exp}} = \$50{,}000\) average exposure cost: \(C_{\text{miss}} = 3 \times 50{,}000 = \mathbf{\$150{,}000}\). **[derived]**

**D12 — Cost per confirmed finding (F13).** \(C_{\text{run}} = 60\) min, \(N = 200\), \(C_v = 4\) min → \(N \cdot C_v = 800\) min, \(C_{\text{proof}} = 40\) min, \(TP_{\text{confirmed}} = 20\).
Numerator: \(60 + 800 + 40 = \mathbf{900}\) min. \(C_{\text{finding}} = 900 / 20 = \mathbf{45}\) min per confirmed finding. **[derived]**
Sensitivity [derived]: dividing by all 200 candidates instead gives \(900/200 = 4.5\) min (cost per candidate, not per confirmed finding); excluding \(C_{\text{run}}\) gives \((800+40)/20 = 42\) min.

**D13 — Coverage fraction (F11).** 1,180 of 2,000 reachable branches: \(\text{cov} = 1{,}180/2{,}000 = \mathbf{0.59} = 59\%\), within \(0 \le \text{cov} \le 1\). Uncovered: \(2{,}000 - 1{,}180 = 820\) branches. **[derived from the page's formula; the page's own quick-check figure is 90 % statement vs 41 % branch coverage after two hours with no new crashes in 40 minutes]**

**D14 — Saturating discovery curve (F12).** \(B_{\max} = 50\), \(\lambda = 0.35\) per hour, \(t = 4\) h.
\(\lambda t = 1.4\); \(e^{-1.4} \approx 0.246597\); \(1 - 0.246597 = 0.753403\); \(B(4) = 50 \times 0.753403 = 37.67 \approx \mathbf{38}\) unique findings. **[derived]**
Marginal productivity [derived]: at \(t = 2\) h, \(\lambda t = 0.7\), \(e^{-0.7} \approx 0.496585\), \(B(2) = 50 \times 0.503415 = 25.17 \approx 25\); so hours 2–4 add \(37.67 - 25.17 = 12.5\) findings ≈ 6.25/h, versus \(25.17/2 = 12.6\)/h in the first two hours — "the first minutes are the most productive; the marginal bug gets steadily more expensive."

## 2.4 Quantitative rules (non-formulaic numbers and thresholds on the pages)

- Repositories: "thousands of files, projects that depend on each other" while "the context window is small" (`study#sec-agents`); \(L \gg W\) in a real repository (`math#sec-m-notation`).
- Internal reasoning: "hundreds or thousands of tokens" (`study#sec-reasoning`; `math#sec-m-defs`).
- Prompt example in the weak-prompt table: "Here are 40 000 lines. Find bugs." (`study#sec-prompt`).
- Supplying syntax/build files with an obscure-language listing costs "a few hundred extra input tokens per call, against a large reduction in wasted output" (`math#sec-m-tokens`).
- Effort settings: "low, medium, high in some variants" (`study#sec-reasoning`).
- Worked triage cost: "200 candidates at \(C_v = 4\) minutes each: 800 minutes, 13.3 hours"; a refuted finding "is refuted in about 6 minutes at the code" (`math#sec-m-checklist`).
- Quick-check numbers: 90 % statement coverage / 41 % branch coverage after two hours, no new crashes in the last 40 minutes (`math#sec-m-coverage`).
- Hallucination-rejection cost asymmetry: "Five seconds to ask for the location" versus "\(C_v\) minutes" if an engineer is asked instead (`math#sec-m-checklist`).

---

# PART 3 — PITFALLS

1. **Treating a fluent AI finding as proof is wrong because nothing has been demonstrated; the page says "Prediction is not proof — verify every finding" and "A claim with no artefact attached is a hypothesis, not a finding."**
2. **Quoting one "accuracy" number for a detector is wrong because precision and recall measure different failures; the page says "A tool can be excellent at one and useless at the other, so never quote a single number as 'the accuracy'."**
3. **Claiming static analysis proves a vulnerability is wrong because it never runs the code; the page says it "cannot observe runtime behaviour, and a warning is not a reachable vulnerability", and its output is "Reproducible, but indirect."**
4. **Assuming a reasoning model's answer is correct because it thought longer is wrong because extra reasoning is not ground truth; the page says "more reasoning can improve performance, but it does *not* guarantee a correct answer" and denies the "model that is always right" reading.**
5. **Opening with "Can the AI find a vulnerability here?" is wrong because it asks about the tool rather than the standard of proof; the page's table lists it as the wrong first question and replaces it with "What evidence would prove one exists?"**
6. **Believing the second of two identical runs is the accurate one is wrong because sampling alone makes identical prompts diverge; the page says "The same prompt does not always produce exactly the same response… record the prompt, the model and the settings alongside every finding."**
7. **Reviewing decompiled or proof-level material as if it were source is wrong because the signal is weak; the page says such analysis should be treated as "a hypothesis generator, never as a conclusion" — decompilation "requires reasoning about *semantics*, not just syntax" and cryptographic/consensus proofs are "the hardest type of security question".**
8. **Acting on a complete data path without checking control is wrong because the path existing and an attacker walking it are different claims; the page says "Step 4" is "the step students skip" and "'The path exists' and 'an attacker can walk it' are two different claims, and the second one is the one that gets reported."**
9. **Reporting only confirmed findings and dropping the rest is wrong because the other verdicts are results; the page says "refuted candidates and unresolved limits are results too" and a refuted candidate recorded with its reason "prevents the same false lead being chased twice".**
10. **Calling it done because statement coverage is high is wrong because coverage is a proxy; the page says "High statement coverage with low *branch* coverage hides the paths that only execute under a rare guard" and "Always ask which denominator a coverage number uses."**
11. **Treating a quiet fuzzing stretch as proof that no bugs remain is wrong because the discovery curve saturates rather than stopping; the page says "you can only tell a plateau from a slow region by *changing the seed corpus, the mutation strategy or the harness*", and "Absence of crashes is not evidence of absence."**
12. **Thinking low precision saves effort is wrong because the same budget buys less; the page says "Lower precision does not save time; it converts the same time into less result."**
*Twelve pitfalls, each anchored in the page wording quoted inside it. Two further contrasts the pages draw — that a "typo" is an error rather than a hallucination, and that calling any automated testing "fuzzing" ignores the defining feature of input generation plus observation — are recorded in Part 1 under `chapter2-math.html#sec-m-defs`.*

---

# PART 4 — TESTABLE CLAIMS

1. `chapter2-study.html#sec-why` — The chapter's opening constraint is that modern software is too large to inspect manually, line by line, so the practical question is where a pattern-matching assistant can add evidence and where a human must take over.
2. `chapter2-study.html#sec-why` — The assistant's four listed strengths are reading text cheaply and at volume, recognising shapes seen in training data, driving existing text-based tools, and summarising an investigation for human audit; the four things it cannot supply are ground truth, authorisation, proof, and judgement about impact, scope and disclosure.
3. `chapter2-study.html#sec-llm` — An LLM response is "a prediction over patterns learned during training" produced in five stages — system prompt, user prompt, tokenise & predict, response, conversation context — and "the model does not check its own answer against reality".
4. `chapter2-study.html#sec-llm` — Because sampling is not deterministic, the prompt, model and settings must be recorded alongside every finding, and repeated runs are a coverage technique rather than a retry.
5. `chapter2-study.html#sec-llm` — The system prompt is a control layer that sets instructions, role and behavioural boundaries before the user interacts with the model, so changing the role changes the analysis materially.
6. `chapter2-study.html#sec-tokens` — The processing chain is text → tokens → patterns → prediction, and code, execution traces and other technical artefacts are also text.
7. `chapter2-study.html#sec-tokens` — Difficulty ascends from mainstream source code (lowest) to an obscure language with no syntax provided, to decompilation from machine code, to cryptographic and consensus proofs (hardest, because they are "not even verifiable by inspection of text alone").
8. `chapter2-study.html#sec-tokens` — "Hallucination means the model produces something that sounds correct but is not grounded in reality"; in this unit it is a reported weakness with no path through the code that reaches it.
9. `chapter2-study.html#sec-reasoning` — Reasoning models (exemplified by the OpenAI o-series family; the aha moment is credited to o3-class and R1-class models) show four observable properties — internal scratchpad, hundreds or thousands of internal tokens, a visible "thinking" indicator, and controllable effort — but "more reasoning can improve performance, but it does *not* guarantee a correct answer."
10. `chapter2-study.html#sec-agents` — An AI agent can decide whether to answer directly or call a tool to gather evidence, then reason over the tool's result; the tool supplies facts and the model supplies the decision about what to do next.
11. `chapter2-study.html#sec-agents` — The four boundary layers are authority (written scope: in-scope systems, permitted techniques, time window, escalation path), boundary enforcement (sandbox, read-only mounts, allow-listed commands, credential isolation), evidence trail, and capability tiering — and without enforcement "a prompt injection or a wrong command reaches production".
12. `chapter2-study.html#sec-prompt` — The three operating rules are that AI is powerful but not careful by default, that it must be given context, evidence and boundaries, and that no finding is trusted until verified; "bad prompts produce shallow answers; partial code produces shallow analysis".
13. `chapter2-study.html#sec-failures` — The countermeasures are paired to failure modes — lazy → summarise what has been checked plus ask for new, different, edge-case and non-obvious flaws; hallucinating → demand proof, a minimal reproducer and the exact trace; missing things → multiple runs, different phrasing/models/temperatures and self-critique; framing-sensitive and context-starved → rewrite around the artefact, contract and whole module — and none of them makes the model smarter, they make the claim checkable.
14. `chapter2-study.html#ix-verify-pipe` — The verification pipeline is candidate → locate → trace the data path → test the trigger → minimise → assess impact → report, and "a candidate is not a vulnerability until it survives every gate in this chain".
15. `chapter2-study.html#sec-verify` — The three verdicts are confirmed (reachable path and demonstrated effect), refuted (path does not reach the sink or input cannot be attacker-controlled) and unresolved (ambiguous code, unavailable dependency, or no authorisation to test), and all three are professional results.
16. `chapter2-math.html#sec-m-defs` — Static analysis examines code without executing it and gives deterministic, reproducible, whole-codebase file-and-line output but "cannot observe runtime behaviour"; fuzzing supplies generated or mutated inputs to a running program and its crash is dynamic evidence that the input actually reaches the fault.
17. `chapter2-math.html#sec-m-notation` — A finding is the triple F = ⟨location, mechanism, E⟩; if E = ∅ it describes a hypothesis, not a vulnerability, and every countermeasure exists to force E ≠ ∅.
18. `chapter2-math.html#sec-m-tokens` — The context budget is T_system + T_history + T_context + T_output ≤ W, and slicing a target that does not fit gives n = ⌈L/ℓ⌉ — with L = 400 000 and ℓ = 8 000, n = 50 units, at the cost of cutting the cross-module call chains such a workflow is most likely to miss.
19. `chapter2-math.html#sec-m-screening` — P = TP/(TP+FP), R = TP/(TP+FN), FPR = 1 − P, and T_wasted = FP · C_v: with N = 200 and C_v = 4 minutes, T_verify = 800 minutes ≈ 13.3 hours and at P = 0.25 the wasted share is 600 minutes (10 hours), while a miss instead costs C_miss = FN · C_exp.
20. `chapter2-math.html#sec-m-coverage` — Coverage is |covered|/|reachable| with 0 ≤ cov ≤ 1 and is "a proxy, not a verdict"; fuzzing findings follow B(t) = B_max(1 − e^(−λt)) so the first minutes are most productive and a plateau can only be confirmed by changing corpus, mutation strategy or harness; the technique comparison number is C_finding = (C_run + N·C_v + C_proof)/TP_confirmed.

---

# PART 5 — ANCHOR INDEX (every `id="..."` in both files, in document order)

```
chapter2-study.html#sidebar - fixed navigation sidebar (week nav, Foundations/Mind Map/Quiz Hub/Flashcards links, "Lecture 2 built" status)
chapter2-study.html#sidebarToggle - sidebar toggle button
chapter2-study.html#mainContent - main content wrapper
chapter2-study.html#hero - Overview hero: title, subtitle, four claim cards
chapter2-study.html#sec-why - Why AI Is on the Security Agenda
chapter2-study.html#sec-llm - How an LLM Responds (Key takeaway 1: LLMs predict patterns)
chapter2-study.html#ix-llm-loop - interactive pipeline JSON: the five-stage minimal model of an LLM interaction
chapter2-study.html#sec-tokens - Key Takeaway 2: Code Is Data Too (artefact difficulty table, hallucination definition)
chapter2-study.html#sec-reasoning - Reasoning Models: The Aha Moment for Security
chapter2-study.html#ix-reasoning - interactive mount div in the reasoning-models section
chapter2-study.html#sec-agents - Terminal AI Agents: Tools, Evidence and Boundaries
chapter2-study.html#ix-agent-loop - interactive mount div for the agent investigation loop
chapter2-study.html#ah - SVG arrowhead marker inside the agent-loop architecture diagram
chapter2-study.html#sec-prompt - Using AI to Find Vulnerabilities: Context, Evidence, Boundaries
chapter2-study.html#ix-workflow - interactive sequence JSON: the eight-step AI-assisted review workflow
chapter2-study.html#sec-failures - Failure Modes and How to Counter Them
chapter2-study.html#ix-failure - interactive mount div in the failure-modes section
chapter2-study.html#ix-fail-match - interactive matcher JSON: failure mode to countermeasure (six pairs)
chapter2-study.html#sec-verify - Human Verification: From Finding to Evidence (verdict table, responsible use)
chapter2-study.html#ix-verify-pipe - interactive pipeline JSON: the seven-stage verification pipeline
chapter2-study.html#sol-1 - worked example: designing an investigation, not making a request (six steps)
chapter2-study.html#sol-2 - worked example: triaging one AI report (SQL injection, six steps)
chapter2-study.html#sol-3 - tutorial exercise: working backwards from an APK you did not build (six steps)
chapter2-math.html#mainContent - math content wrapper (class="math-content")
chapter2-math.html#sec-m-hero - Foundations hero: purpose and provenance chips
chapter2-math.html#sec-m-defs - Definitions that must be exact (five definitions plus wrong-answer table)
chapter2-math.html#sec-m-notation - Notation for an investigation (symbol table, finding triple)
chapter2-math.html#ix-m-terms - interactive matcher JSON: symbol to quantity (seven pairs)
chapter2-math.html#sec-m-tokens - Tokens, context and the cost of looking
chapter2-math.html#sec-m-screening - Screening arithmetic: what an unverified list really costs
chapter2-math.html#ix-m-race - interactive chart JSON: illustrative report composition at 200 candidates
chapter2-math.html#sec-m-coverage - Coverage, fuzzing and the cost of finding one bug
chapter2-math.html#sec-m-checklist - Classifying an AI finding (triage checklist and worked classification)
chapter2-math.html#ix-m-classify - interactive sequence JSON: the seven-step triage checklist
chapter2-math.html#sol-m1 - worked classification of three AI findings plus triage cost
```

Anchor count: 23 in `chapter2-study.html` (including the SVG marker `#ah`) + 12 in `chapter2-math.html` = **35 ids**.

---

# PART 6 — GRAPH SEEDS

## 6.1 Study page — concept graph (16 nodes)

| id suggestion | label | definition from the page (one sentence) | anchor |
|---|---|---|---|
| `ai-vuln-discovery` | AI-Assisted Vulnerability Discovery | "Using static analysis, fuzzing and large language models to find vulnerabilities — and why a human still has to verify every finding." | `chapter2-study.html#hero` |
| `why-ai-security` | Why AI Is on the Security Agenda | The volume of code, dependencies and artefacts already exceeds what a human review team can read exhaustively, so the question is where an assistant adds evidence and where a human takes over. | `chapter2-study.html#sec-why` |
| `investigate-with-ai` | Investigate with AI | "The goal is not to ask AI 'find the vulnerabilities'. The goal is to *investigate with AI* — give it context, give it evidence, give it boundaries, and never trust a finding until you have verified it." | `chapter2-study.html#sec-why` |
| `llm-prediction` | LLMs predict patterns | LLMs can appear intelligent, but they generate responses by predicting likely patterns and do not automatically know whether an answer is true or correct. | `chapter2-study.html#sec-llm` |
| `system-prompt-control` | System prompt as control layer | The system prompt sets the model's instructions, role and behavioural boundaries before the user interacts with it. | `chapter2-study.html#sec-llm` |
| `nondeterministic-sampling` | Non-deterministic sampling | The same prompt does not always produce exactly the same response, so the prompt, model and settings must be recorded with every finding and repeats become a coverage technique. | `chapter2-study.html#sec-llm` |
| `code-is-data-too` | Code Is Data Too | Code, execution traces and other technical artefacts are also text, processed as text → tokens → patterns → prediction. | `chapter2-study.html#sec-tokens` |
| `hallucination` | Hallucination | The model produces something that sounds correct but is not grounded in reality — in vulnerability discovery, a reported weakness with no path through the code that reaches it. | `chapter2-study.html#sec-tokens` |
| `reasoning-model` | Reasoning model | A model that performs additional internal processing — an internal scratchpad, often hundreds or thousands of tokens, exposed only as a "thinking" indicator and an effort setting — before producing its answer. | `chapter2-study.html#sec-reasoning` |
| `terminal-ai-agent` | Terminal AI agent | A model that can decide whether to answer directly or use a tool to gather more evidence, then reason over the tool's result. | `chapter2-study.html#sec-agents` |
| `evidence-loop` | The evidence loop | A tool call returns facts, the model reasons over those facts, and only a human closes the loop by reproducing the finding. | `chapter2-study.html#ix-agent-loop` |
| `authorised-to-act` | Is the AI authorised to act? | The first question for an agent with terminal access, because the security boundary — targets, tools, actions, forbidden touches — is a design decision, not a default. | `chapter2-study.html#sec-agents` |
| `context-evidence-boundaries` | Context, evidence and boundaries | The three things an AI-assisted review must supply: the language/build files/module/contract, artefacts such as file-and-line and traces, and the stated limits on what the agent may read, run and change. | `chapter2-study.html#sec-prompt` |
| `failure-modes` | Failure modes and countermeasures | The named failure modes — lazy, hallucinating, missing things, framing-sensitive/context-starved, non-deterministic — each paired with a response that forces the model to attach evidence or covers ground a single run would skip. | `chapter2-study.html#sec-failures` |
| `verification-pipeline` | Verification pipeline | Candidate → locate → trace the data path → test the trigger → minimise → assess impact → report; "a candidate is not a vulnerability until it survives every gate in this chain". | `chapter2-study.html#ix-verify-pipe` |
| `triage-verdicts` | Confirmed, refuted or unresolved | The three verdicts on a candidate finding, all of which are results: confirmed with evidence and a fix, refuted with the reason, unresolved with the precise limit handed to a human. | `chapter2-study.html#sec-verify` |

## 6.2 Math page — foundations graph (10 nodes)

| id suggestion | label | definition from the page (one sentence) | anchor |
|---|---|---|---|
| `m-exact-definitions` | Definitions that must be exact | The five terms that carry the week — hallucination, static analysis, fuzzing, reasoning model, AI agent — each to be written in one sentence with the consequence included. | `chapter2-math.html#sec-m-defs` |
| `m-static-analysis` | Static analysis | "Examining code *without executing it* — parsing it into a representation and applying rules or queries to that representation", giving deterministic file-and-line coverage but never observability of runtime behaviour. | `chapter2-math.html#sec-m-defs` |
| `m-fuzzing` | Fuzzing | "Supplying generated or mutated inputs to a running program and observing the result", whose crash is dynamic evidence that the input actually reaches the fault. | `chapter2-math.html#sec-m-defs` |
| `m-finding-triple` | The finding triple F = ⟨location, mechanism, E⟩ | A candidate finding is a claim whose usefulness is bounded by its evidence; if E = ∅ the triple describes a hypothesis, not a vulnerability. | `chapter2-math.html#sec-m-notation` |
| `m-context-budget` | Context budget | T_system + T_history + T_context + T_output ≤ W, which is why a long investigation fills its own window and checked work is summarised instead of carried. | `chapter2-math.html#sec-m-tokens` |
| `m-slicing` | Slicing n = ⌈L/ℓ⌉ | The number of review units a codebase splits into, with the caveat that unit boundaries cut call chains and cross-module data paths are the most likely to be missed. | `chapter2-math.html#sec-m-tokens` |
| `m-precision-recall` | Precision, recall and FPR | P = TP/(TP+FP), R = TP/(TP+FN), FPR = 1 − P — recall measures what you failed to see, precision measures what you will waste time on. | `chapter2-math.html#sec-m-screening` |
| `m-verification-budget` | Verification budget | T_verify = N·C_v and T_wasted = FP·C_v = (1−P)·N·C_v, the arithmetic that makes low precision a budget problem rather than an annoyance. | `chapter2-math.html#sec-m-screening` |
| `m-coverage-curve` | Coverage and the saturating campaign | cov = |covered|/|reachable| with 0 ≤ cov ≤ 1 is a proxy, not a verdict, and cumulative fuzzing findings follow B(t) = B_max(1 − e^(−λt)). | `chapter2-math.html#sec-m-coverage` |
| `m-cost-per-finding` | Cost per confirmed finding | C_finding = (C_run + N·C_v + C_proof)/TP_confirmed, the number to compare between techniques rather than raw finding counts or token price. | `chapter2-math.html#sec-m-coverage` |

---

# PART 7 — FLASHCARD SEEDS

1. **Front:** What is hallucination, exactly, in this unit? **Back:** "The model produces something that sounds correct but is not grounded in reality" — in vulnerability discovery, a reported weakness with no path through the code that reaches it; fluent, specific and unverifiable. A typo is an error, not a hallucination. (`chapter2-study.html#sec-tokens`, `chapter2-math.html#sec-m-defs`)
2. **Front:** How does an LLM produce a response, and what follows for security work? **Back:** It predicts likely patterns learned during training and does not check its own answer against reality — but many vulnerabilities also follow recognisable patterns, which is why AI can flag suspicious code and why every finding still needs evidence and verification. (`chapter2-study.html#sec-llm`)
3. **Front:** Static analysis vs fuzzing — what does each supply? **Back:** Static analysis examines code *without executing it* and gives deterministic, reproducible file-and-line coverage, but "a warning is not a reachable vulnerability"; fuzzing supplies generated or mutated inputs to a running program and its crash is dynamic evidence that the input actually reaches the fault. (`chapter2-math.html#sec-m-defs`)
4. **Front:** Name the countermeasures for a model that misses things. **Back:** Run multiple times; change the phrasing; use different models; use different temperatures; ask the model to critique its own answer. (`chapter2-study.html#sec-failures`)
5. **Front:** What three things must you give an AI, and what must you never do? **Back:** Context, evidence and boundaries — "AI is powerful but it is not careful by default" — and never trust a finding until you verify it. (`chapter2-study.html#sec-prompt`)
6. **Front:** What does F = ⟨location, mechanism, E⟩ mean when E = ∅? **Back:** It describes a hypothesis, not a vulnerability, "regardless of how fluent the prose around it is" — all of the week's countermeasures exist to force E ≠ ∅. (`chapter2-math.html#sec-m-notation`)
7. **Front:** What are the three verdicts on an AI finding, and why is each one acceptable? **Back:** Confirmed (reachable path and demonstrated effect → minimise, assess impact, report with evidence and a fix), refuted (the path does not reach the sink or the input cannot be attacker-controlled → record the reason so nobody re-chases it), unresolved (ambiguous code, unavailable dependency or no authorisation to test → state the limit and hand it to a human); "only an unverified claim is not" a professional result. (`chapter2-study.html#sec-verify`)
