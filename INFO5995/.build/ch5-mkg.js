{
  nodes: [
    ["m5-security-properties", 5, 1, "Security properties", "Confidentiality hides the content; integrity detects unauthorised modification; freshness proves the message is new and not stale; authenticity proves who created it.", "../chapters/chapter5/web/chapter5-study.html#sec-why"],
    ["m5-modular-arithmetic", 5, 2, "Modular arithmetic and inverses", "a mod n is the remainder of a on division by n, and two integers are congruent modulo n when n divides their difference. A value a has a multiplicative inverse modulo n exactly when it is coprime to n, and that inverse is what the extended Euclidean algorithm computes.", "../chapters/chapter5/web/chapter5-math.html#sec-m-mod"],
    ["m5-one-way-gap", 5, 3, "The one-way gap", "Raising to a power modulo n is efficient by repeated squaring at about O(log x) modular multiplications, while recovering the exponent is the discrete logarithm problem and recovering p and q from n = pq is integer factorisation. Diffie-Hellman rests on the first, RSA on the second.", "../chapters/chapter5/web/chapter5-math.html#sec-m-mod"],
    ["m5-rsa-key-generation", 5, 3, "RSA key generation and the totient", "n = p\u00b7q, \u03c6(n) = (p\u22121)(q\u22121) and e\u00b7d \u2261 1 (mod \u03c6(n)); the public key is (n, e) and the private key is (n, d), while \u03c6(n) stays secret because with e it yields d immediately.", "../chapters/chapter5/web/chapter5-math.html#sec-m-rsa"],
    ["m5-diffie-hellman-exchange", 5, 2, "Diffie-Hellman exchange", "A = g^a mod p and B = g^b mod p, and both sides compute K = B^a = A^b = g^(ab) mod p. The computational Diffie-Hellman assumption is that g^(ab) is hard to compute from g^a and g^b alone.", "../chapters/chapter5/web/chapter5-math.html#sec-m-dh"],
    ["m5-hash-collision-birthday", 5, 2, "Hash sizes and the birthday bound", "An n-bit digest gives about n bits of pre-image resistance but only about n/2 bits of collision resistance, because the expected collision work is q \u2248 1.177\u221a(2^n) \u2248 2^(n/2). That is why MD5 and SHA-1 fell first.", "../chapters/chapter5/web/chapter5-math.html#sec-m-hash"],
    ["m5-hmac-construction", 5, 2, "HMAC construction", "From NIST FIPS 198-1, HMAC(K, m) = H((K0 \u2295 opad) \u2016 H((K0 \u2295 ipad) \u2016 m)), with ipad/opad the bytes 0x36 and 0x5c repeated B times. The tag length equals the digest length, and the key is never fed to the hash directly.", "../chapters/chapter5/web/chapter5-math.html#sec-m-hash"],
    ["m5-signature-cert-chain", 5, 3, "Signatures and certificate chains", "Hash-then-sign computes s = Sign_SK(H(m)) so one signature of fixed size covers the exact message bytes, with an approved encoding such as PSS rather than raw RSA. A certificate is the CA's signature over the subject, public key, issuer, validity window and extensions, and validation walks the chain to a locally trusted root.", "../chapters/chapter5/web/chapter5-math.html#sec-m-sign"]
  ],
  edges: [
    ["m5-modular-arithmetic", "m5-one-way-gap", 9],
    ["m5-one-way-gap", "m5-rsa-key-generation", 9],
    ["m5-one-way-gap", "m5-diffie-hellman-exchange", 9],
    ["m5-modular-arithmetic", "m5-rsa-key-generation", 8],
    ["m5-modular-arithmetic", "m5-diffie-hellman-exchange", 8],
    ["m5-one-way-gap", "m5-hash-collision-birthday", 6],
    ["m5-hash-collision-birthday", "m5-hmac-construction", 8],
    ["m5-hash-collision-birthday", "m5-signature-cert-chain", 8],
    ["m5-rsa-key-generation", "m5-signature-cert-chain", 8],
    ["m5-security-properties", "m5-signature-cert-chain", 7],
    ["m5-security-properties", "m5-hmac-construction", 6]
  ]
}
