{
  nodes: [
    ["m1-cia-triad", 1, 1, "CIA Triad",
      "The three security objectives and the question each asks: confidentiality (only authorised parties can read or use something — who is allowed to see this?), integrity (information stays correct and trustworthy, changes authorised and detectable — has the information been changed?) and availability (systems and information are accessible when needed — can I access it when I need it?). The attack mirror image is the DAD triad — disclosure, alteration, destruction — and CIA is necessary but not sufficient: authenticity, non-repudiation, privacy and safety also matter.",
      "../chapters/chapter1/web/chapter1-study.html#sec-cia"],

    ["m1-integrity-writes", 1, 2, "Integrity Is a Property of Writes",
      "A change taking object o to o' is permitted only if it is authorised and remains attributable: o → o' implies authorised and logged with who and when. Two consequences follow: integrity requires being able to detect changes, which is what signatures, MACs and append-only logs provide, and authorised has to mean the authoriser saw what they were authorising — the what-you-see-is-what-you-sign requirement.",
      "../chapters/chapter1/web/chapter1-math.html#sec-m-cia"],

    ["m1-risk-product", 1, 2, "Risk as a Product, T x V x I",
      "Risk is the combination of how likely an event is with how bad it would be, for a named asset: qualitatively R = T × V × I with each factor scored 1 to 5, or a function of likelihood and impact as standards such as NIST SP 800-30 write it. Each factor is a gate, which is why multiplying is the right shape and why a single zero should stop a risk report.",
      "../chapters/chapter1/web/chapter1-study.html#sec-risk"],

    ["m1-ale", 1, 3, "Annualised Loss Expectancy",
      "The quantitative model prices the risk: SLE = AV × EF and ALE = ARO × SLE, the yearly expected loss a budget conversation can compare against the annual cost of a control. Worked example: with AV = $50,000 and EF = 0.4, SLE = $20,000 and ALE = 0.5 × 20,000 = $10,000 per year; a backup programme costing $3,000 that cuts EF to 0.1 leaves ALE = $2,500, so the control is justified on the numbers.",
      "../chapters/chapter1/web/chapter1-math.html#sec-m-risk"],

    ["m1-entropy", 1, 2, "Entropy and Keyspace",
      "Entropy measures how much an attacker does not know: H(X) = -Σ p log2 p in bits, which collapses to H = log2 N for N equally likely values and H = L log2 N for L independent, uniform characters from an alphabet of size N. A 4-digit PIN carries log2 10^4 ≈ 13.3 bits, and the page's table compares a 12-character mixed password (71.5 bits) and a 6-word diceware passphrase (77.5 bits) with an AES-128 key (128 bits) and an RSA-2048 modulus (about 112-bit equivalent security).",
      "../chapters/chapter1/web/chapter1-math.html#sec-m-entropy"],

    ["m1-guessing-cost", 1, 2, "Guessing Cost and Work Factor",
      "Guessing cost turns entropy into time: a full search of a space of 2^H possibilities takes t = 2^H / r at r guesses per second, with expected cost about 2^(H-1) / r. Doubling the length of a random secret squares the keyspace and therefore doubles H, while rate limiting and account lockout, or a deliberately slow password hash such as bcrypt, scrypt or Argon2, change r instead of H.",
      "../chapters/chapter1/web/chapter1-math.html#sec-m-entropy"],

    ["m1-detector-precision", 1, 3, "Detector Precision and the Base Rate",
      "A detector is described by its sensitivity Se = Pr(alert | attack) and specificity Sp = Pr(no alert | no attack), but the number an analyst experiences is precision, PPV = Pr(attack | alert) = Se·π / (Se·π + (1-Sp)(1-π)), where π is the base rate. At Se = 0.90, Sp = 0.99 and π = 10^-4 under 1% of alerts are real — about 99.1% are false positives — so alert fatigue is arithmetic rather than culture.",
      "../chapters/chapter1/web/chapter1-math.html#sec-m-detect"],

    ["m1-layer-probability", 1, 2, "Defence in Depth as a Product",
      "If the attacker must defeat every layer and the layers fail independently, the attack succeeds only when all of them fail: P(success) = Π p, so four layers that each stop 70% give 0.3^4 = 0.0081, under 1%. If the attacker can choose a path instead the model becomes P(success) = max p and improving every layer except the weakest changes nothing at all — and the independence assumption is where defence-in-depth arguments go wrong.",
      "../chapters/chapter1/web/chapter1-math.html#sec-m-detect"]
  ],
  edges: [
    ["m1-cia-triad", "m1-integrity-writes", 8],
    ["m1-cia-triad", "m1-risk-product", 8],
    ["m1-cia-triad", "m1-entropy", 7],
    ["m1-cia-triad", "m1-layer-probability", 5],
    ["m1-risk-product", "m1-ale", 9],
    ["m1-risk-product", "m1-layer-probability", 6],
    ["m1-integrity-writes", "m1-detector-precision", 6],
    ["m1-entropy", "m1-guessing-cost", 9],
    ["m1-detector-precision", "m1-layer-probability", 7]
  ]
}
