{
  nodes: [
    ["m8-cia-software", 8, 1, "CIA triad at the software layer", "Week 1's CIA triad applied to software the organisation wrote or assembled: confidentiality prevents unauthorised disclosure of the data the system stores, moves or logs; integrity prevents unauthorised change to data, to configuration and to the code path that processes them; availability sustains dependable access for authorised workloads.", "../chapters/chapter8/web/chapter8-study.html#sec-software"],
    ["m8-security-terms", 8, 1, "Vulnerability, exploit, threat, control", "A vulnerability is a weakness that can be used to violate a security property; an exploit is the means of using it; a threat is the actor or event that would do so; and a control is anything that reduces the chance of success or the impact. The weakness lives in the application, so the fix usually does too.", "../chapters/chapter8/web/chapter8-math.html#sec-m-defs"],
    ["m8-risk-model", 8, 2, "Risk as a product of three factors", "Risk is written as R = T x V x I, where T is the likelihood that a threat acts, V the likelihood that a vulnerability is exploitable and I the impact. The product form is the examinable part: driving any one factor to zero removes that path, and reducing one factor without the others gives the attacker an easy substitute.", "../chapters/chapter8/web/chapter8-math.html#sec-m-defs"],
    ["m8-residual-risk", 8, 3, "Residual risk and layer independence", "With n independent controls each failing with probability p_i, the chance that all of them fail is R_res = I x product of p_i - three layers each failing with p = 0.3 give 0.027. The product assumes independence, so when one vulnerable library appears in several layers the residual risk is bounded below by the weakest shared dependency, which is why patch and dependency management are security controls.", "../chapters/chapter8/web/chapter8-math.html#sec-m-defs"],
    ["m8-exposure-window", 8, 2, "Exposure window W", "The exposure window runs from the moment exploitation becomes possible to the moment the fix is deployed in production, W = t_exploit - t_patch, and with a daily compromise probability q the chance an exposed host is compromised is P = 1 - (1 - q)^W. Risk rises monotonically with the window, so time to remediate is a security parameter.", "../chapters/chapter8/web/chapter8-math.html#sec-m-exposure"],
    ["m8-detection-precision", 8, 3, "Detector precision and the base rate", "TPR is the fraction of real attacks detected and FPR the fraction of benign events flagged, but the question an analyst asks is P(attack | alert) = TPR x pi / (TPR x pi + FPR x (1 - pi)). When the base rate pi is tiny the false positives swamp the true positives, which is why a 99% accurate detector can be wrong almost every time and why alert volume must be bounded by analyst capacity.", "../chapters/chapter8/web/chapter8-math.html#sec-m-detection"],
    ["m8-anonymity-set", 8, 2, "Anonymity set and entropy", "If the subject of a yes/no answer is one of k indistinguishable people then P(identify) is about 1/k, and each independent answer halves the field, so roughly log2 k answers isolate one individual. Entropy H(X) = -sum of p_i log2 p_i is the currency of this leakage because signals add, and a release rule needs k_effective >= 1/P_max after every published signal is considered.", "../chapters/chapter8/web/chapter8-math.html#sec-m-privacy"],
    ["m8-brute-force-cost", 8, 2, "Cost of guessing a secret", "For a secret of length L drawn from an alphabet of size A, the search space is N = A^L and the expected time to find it at r guesses per second is T50 = A^L / 2r, with entropy L log2 A bits. The model assumes a uniformly random secret, which is why rate limiting, lockout and MFA bound the online case while credential stuffing walks past per-account lockout.", "../chapters/chapter8/web/chapter8-math.html#sec-m-privacy"]
  ],
  edges: [
    ["m8-security-terms", "m8-risk-model", 8],
    ["m8-risk-model", "m8-residual-risk", 8],
    ["m8-cia-software", "m8-risk-model", 5],
    ["m8-security-terms", "m8-cia-software", 6],
    ["m8-risk-model", "m8-exposure-window", 7],
    ["m8-residual-risk", "m8-exposure-window", 6],
    ["m8-residual-risk", "m8-detection-precision", 5],
    ["m8-exposure-window", "m8-detection-precision", 6],
    ["m8-brute-force-cost", "m8-anonymity-set", 6],
    ["m8-cia-software", "m8-anonymity-set", 5]
  ]
}
