{
  nodes: [
    ["w2-scale-limit", 2, 1, "Software Too Large to Read",
      "The opening constraint of Week 2: the volume of code, dependencies and artefacts in a real system already exceeds what a human review team can read exhaustively, so the practical question is not whether AI can find bugs but where in the workflow a pattern-matching assistant can add evidence and where a human must take over.",
      "../chapters/chapter2/web/chapter2-study.html#sec-why"],

    ["w2-llm-prediction", 2, 1, "LLMs Predict Patterns",
      "LLMs can appear intelligent, but they generate responses by predicting likely patterns learned during training; they do not automatically know whether an answer is true or correct, and because many vulnerabilities also follow recognisable patterns, every finding still needs evidence and verification.",
      "../chapters/chapter2/web/chapter2-study.html#sec-llm"],

    ["w2-nondeterminism", 2, 2, "Sampling Is Not Deterministic",
      "The same prompt does not always produce exactly the same response, so two identical requests can return two different findings: a feature for coverage and a problem for reproducibility, which is why the prompt, the model and the settings are recorded alongside every finding.",
      "../chapters/chapter2/web/chapter2-study.html#sec-llm"],

    ["w2-code-as-tokens", 2, 1, "Code Is Data Too",
      "An LLM processes information as tokens and patterns, following the chain text to tokens to patterns to prediction; code, execution traces and other technical artefacts are also text, so they can be analysed the same way, within the limits the deck makes explicit about weak or ambiguous artefacts.",
      "../chapters/chapter2/web/chapter2-study.html#sec-tokens"],

    ["w2-hallucination", 2, 2, "Hallucination",
      "Hallucination means the model produces something that sounds correct but is not grounded in reality; in vulnerability discovery that appears as a reported weakness with no path through the code that reaches it, a plausible narrative supported by nothing.",
      "../chapters/chapter2/web/chapter2-study.html#sec-tokens"],

    ["w2-reasoning-model", 2, 2, "Reasoning Model",
      "A reasoning model does more internal processing before producing its answer, with an internal scratchpad that can run to hundreds or thousands of tokens and is exposed only as a thinking indicator and a selectable effort setting; more reasoning can improve performance but does not guarantee a correct answer.",
      "../chapters/chapter2/web/chapter2-study.html#sec-reasoning"],

    ["w2-ai-agent", 2, 2, "AI Agent That Uses Tools",
      "An AI agent can decide whether to answer directly or use a tool to gather more evidence: it emits a tool-call instruction, receives the tool result, and uses that result to decide what to do next or what to answer. The tool gathers evidence; the AI reasons over it.",
      "../chapters/chapter2/web/chapter2-study.html#sec-agents"],

    ["w2-authority-boundary", 2, 3, "Authorisation and Boundaries",
      "An agent with terminal access is executing commands against real systems, so the first question is not whether the AI can do it but whether the AI is authorised to act; which targets, which tools and which actions are permitted has to be enforced somewhere deliberate, as a design decision rather than a default.",
      "../chapters/chapter2/web/chapter2-study.html#sec-agents"],

    ["w2-context-evidence-boundaries", 2, 2, "Context, Evidence and Boundaries",
      "The deck's operating rules: AI is powerful but it is not careful by default, so give it context (language, build files, module boundary, framework, the contract the code must satisfy), evidence (tool output, file and line, execution trace, minimal reproducible case) and boundaries (what it may read, run and change).",
      "../chapters/chapter2/web/chapter2-study.html#sec-prompt"],

    ["w2-technique-mix", 2, 2, "Techniques and Their Blind Spots",
      "Manual review contributes judgement about intent, contracts and design; static analysis contributes whole-codebase deterministic coverage with file and line; fuzzing contributes dynamic proof in the form of an input that actually crashes; LLM code review contributes pattern recognition at volume with no rule to write first, and no single technique is asked to do the whole job.",
      "../chapters/chapter2/web/chapter2-study.html#sec-prompt"],

    ["w2-lazy-model", 2, 2, "Models Can Be Lazy",
      "A failure mode in which the model stops at the first obvious issue, because models were trained not to work for too long; the countermeasures are to summarise what has already been checked in a file or table and to ask explicitly for new, different, edge-case and non-obvious logic flaws.",
      "../chapters/chapter2/web/chapter2-study.html#sec-failures"],

    ["w2-blind-spot", 2, 2, "Models Can Miss Things",
      "A failure mode in which the model overlooks vulnerabilities that are really there; the countermeasures are to run multiple times, change the phrasing, use different models and different temperatures, and ask the model to critique its own answer.",
      "../chapters/chapter2/web/chapter2-study.html#sec-failures"],

    ["w2-human-verification", 2, 3, "Human Verification",
      "Never trust a finding until you verify it: verification is a procedure, not a feeling of confidence. Locate the code at the stated line, trace the data path by hand from source to sink, test the trigger in an authorised environment, minimise the case, assess impact with its preconditions, then report finding, evidence, reproduction steps, impact and fix.",
      "../chapters/chapter2/web/chapter2-study.html#sec-verify"]
  ],
  edges: [
    ["w2-scale-limit", "w2-llm-prediction", 5],
    ["w2-scale-limit", "w2-ai-agent", 7],
    ["w2-llm-prediction", "w2-code-as-tokens", 8],
    ["w2-llm-prediction", "w2-nondeterminism", 8],
    ["w2-llm-prediction", "w2-hallucination", 9],
    ["w2-llm-prediction", "w2-reasoning-model", 7],
    ["w2-code-as-tokens", "w2-hallucination", 7],
    ["w2-reasoning-model", "w2-ai-agent", 8],
    ["w2-ai-agent", "w2-authority-boundary", 9],
    ["w2-ai-agent", "w2-technique-mix", 7],
    ["w2-hallucination", "w2-context-evidence-boundaries", 8],
    ["w2-nondeterminism", "w2-blind-spot", 7],
    ["w2-context-evidence-boundaries", "w2-human-verification", 8],
    ["w2-context-evidence-boundaries", "w2-lazy-model", 6],
    ["w2-blind-spot", "w2-technique-mix", 6],
    ["w2-lazy-model", "w2-blind-spot", 4]
  ]
}
