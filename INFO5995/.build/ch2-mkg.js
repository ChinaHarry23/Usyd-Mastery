{
  nodes: [
    ["m2-hallucination", 2, 1, "Hallucination, Exactly Defined",
      "The model produces something that sounds correct but is not grounded in reality; in this unit, a reported vulnerability with no reachable path through the code, fluent, specific and unverifiable.",
      "../chapters/chapter2/web/chapter2-math.html#sec-m-defs"],

    ["m2-static-analysis", 2, 2, "Static Analysis",
      "Examining code without executing it, parsing it into a representation and applying rules or queries to that representation; it gives deterministic, reproducible, whole-codebase coverage with file-and-line output, but it cannot observe runtime behaviour and a warning is not a reachable vulnerability.",
      "../chapters/chapter2/web/chapter2-math.html#sec-m-defs"],

    ["m2-fuzzing", 2, 2, "Fuzzing",
      "Supplying generated or mutated inputs to a running program and observing the result; unlike a static warning or an AI claim, a fuzzing crash is dynamic evidence that the input actually reaches the fault.",
      "../chapters/chapter2/web/chapter2-math.html#sec-m-defs"],

    ["m2-finding-triple", 2, 2, "The Finding Triple and Evidence",
      "A candidate finding is a claim, and a finding is the triple F = <location, mechanism, E> where E is the evidence; if E is empty the triple describes a hypothesis rather than a vulnerability, and every countermeasure in the week exists to force E to be non-empty.",
      "../chapters/chapter2/web/chapter2-math.html#sec-m-notation"],

    ["m2-context-budget", 2, 2, "Context Window Budget",
      "A prompt must fit the window together with everything the model will generate and everything the conversation has already accumulated: T_system + T_history + T_context + T_output <= W. A long investigation fills its own window, so checked work is summarised into a file or a table instead of carrying the whole transcript.",
      "../chapters/chapter2/web/chapter2-math.html#sec-m-tokens"],

    ["m2-precision-recall", 2, 3, "Precision, Recall and FPR",
      "With TP the real vulnerabilities correctly reported, FP the fabricated or unreachable ones and FN the real ones missed: P = TP/(TP+FP), R = TP/(TP+FN) and FPR = 1 - P. Recall measures what you failed to see and precision measures what you will waste time on, so a single number is never quoted as the accuracy.",
      "../chapters/chapter2/web/chapter2-math.html#sec-m-screening"],

    ["m2-verification-budget", 2, 2, "Verification Budget",
      "If a report contains N = TP + FP candidates and each candidate costs C_v human minutes to confirm or refute, the screening cost is T_verify = N * C_v and the wasted share is T_wasted = (1 - P) * N * C_v; lower precision does not save time, it converts the same time into less result.",
      "../chapters/chapter2/web/chapter2-math.html#sec-m-screening"],

    ["m2-coverage", 2, 2, "Coverage and the Fuzzing Curve",
      "For a fuzzing campaign, coverage over the observable surface of the target is cov = |covered| / |reachable| with 0 <= cov <= 1: a proxy, not a verdict, because high statement coverage with low branch coverage hides the paths that only execute under a rare guard, and cumulative unique findings follow a saturating curve B(t) = B_max (1 - e^(-lambda t)).",
      "../chapters/chapter2/web/chapter2-math.html#sec-m-coverage"]
  ],
  edges: [
    ["m2-fuzzing", "m2-coverage", 9],
    ["m2-fuzzing", "m2-finding-triple", 8],
    ["m2-static-analysis", "m2-finding-triple", 7],
    ["m2-static-analysis", "m2-coverage", 6],
    ["m2-hallucination", "m2-precision-recall", 8],
    ["m2-precision-recall", "m2-verification-budget", 9],
    ["m2-finding-triple", "m2-verification-budget", 8],
    ["m2-context-budget", "m2-hallucination", 6],
    ["m2-coverage", "m2-precision-recall", 5],
    ["m2-context-budget", "m2-finding-triple", 5]
  ]
}
