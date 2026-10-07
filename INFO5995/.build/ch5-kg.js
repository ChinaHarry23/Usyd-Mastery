{
  nodes: [
    ["w5-beyond-confidentiality", 5, 1, "Beyond confidentiality", "Encryption gives confidentiality: it hides the content, but it does not prove that a message is unchanged (integrity) or new (freshness), and it does not prove who sent it (authenticity).", "../chapters/chapter5/web/chapter5-study.html#sec-why"],
    ["w5-hash-function", 5, 1, "Cryptographic hash function", "A function that maps an input of any practical length to a fixed-length digest: deterministic, fixed-length, one-way, efficient, and showing the avalanche effect. Hashing is not encryption \u2014 there is no key and no decryption.", "../chapters/chapter5/web/chapter5-study.html#sec-hash"],
    ["w5-collision-resistance", 5, 3, "Collision resistance", "Finding any pair x \u2260 y with h(x) = h(y) costs about 2^(n/2) work for an n-bit digest because of the birthday effect, which makes collisions the cheapest attack and the property that signatures and certificates depend on.", "../chapters/chapter5/web/chapter5-math.html#sec-m-hash"],
    ["w5-mac-hmac", 5, 2, "MAC and HMAC", "A keyed tag over a message: KeyGen produces a shared key K, Tag(K, M) produces the tag, and Verify accepts only when the recomputed tag matches. HMAC is the standardised hash-based construction (NIST FIPS 198-1) and gives integrity and sender authenticity only between key holders.", "../chapters/chapter5/web/chapter5-study.html#sec-mac"],
    ["w5-digital-signature", 5, 2, "Digital signature", "One private signing key SK_A and many public verification keys PK_A: only the owner can sign, while anyone with the public key can verify. That gives integrity, origin authentication and public verifiability \u2014 but no confidentiality.", "../chapters/chapter5/web/chapter5-study.html#sec-signatures"],
    ["w5-non-repudiation", 5, 3, "Non-repudiation support", "Signatures support non-repudiation only when identity, key ownership and audit evidence are established \u2014 the signature alone is not a legal conclusion.", "../chapters/chapter5/web/chapter5-study.html#sec-signatures"],
    ["w5-public-key-crypto", 5, 2, "Public-key (asymmetric) cryptography", "A key pair whose two halves are mathematically linked: a public key that may be shared widely and a private key that must remain with its owner. The pair performs three jobs \u2014 encrypt, sign and agree.", "../chapters/chapter5/web/chapter5-study.html#sec-pubkey"],
    ["w5-rsa", 5, 3, "RSA key generation", "Choose primes p and q, compute n = p\u00b7q and \u03c6(n) = (p\u22121)(q\u22121), then choose e coprime to \u03c6(n) and compute d \u2261 e\u207b\u00b9 (mod \u03c6(n)); publish (n, e) and keep (n, d) secret. NIST FIPS 186-5 requires a modulus of at least 2048 bits.", "../chapters/chapter5/web/chapter5-math.html#sec-m-rsa"],
    ["w5-hybrid-encryption", 5, 2, "Hybrid encryption", "Because modular exponentiation with a 2048-bit modulus is far slower than AES, public-key cryptography protects only a short secret \u2014 a session key encrypted with RSA-OAEP or agreed with Diffie-Hellman \u2014 while AES-GCM or ChaCha20-Poly1305 protects the bulk data.", "../chapters/chapter5/web/chapter5-study.html#sec-pubkey"],
    ["w5-diffie-hellman", 5, 2, "Diffie-Hellman key agreement", "Two parties who have never met derive the same shared secret while an observer sees every value they exchange; it solves key establishment, not bulk encryption, and by itself says nothing about who is on the other end.", "../chapters/chapter5/web/chapter5-study.html#sec-dh"],
    ["w5-certificates-pki", 5, 2, "Certificates, CAs and PKI", "A certificate is a CA's signature over a public key for a domain or organisation, so a client trusts a small set of roots rather than every key it meets. The binding of a key to an identity is a trust problem, not a mathematics problem.", "../chapters/chapter5/web/chapter5-study.html#sec-trust"],
    ["w5-chain-validation", 5, 3, "Certificate chain validation", "Build a chain from the server certificate to a locally trusted root, verify each signature up the chain, check that every certificate is inside its validity window, check the requested name in the subject or SANs, and check revocation and key usage.", "../chapters/chapter5/web/chapter5-study.html#sec-trust"],
    ["w5-primitive-selection", 5, 2, "Choosing a primitive by guarantee", "Hash = fingerprint, MAC = shared-key authenticity, signature = public verification, AEAD = encryption and integrity together. Ask first which guarantee is missing, then choose the primitive that provides exactly that guarantee.", "../chapters/chapter5/web/chapter5-study.html#sec-tools"]
  ],
  edges: [
    ["w5-beyond-confidentiality", "w5-hash-function", 8],
    ["w5-hash-function", "w5-collision-resistance", 9],
    ["w5-hash-function", "w5-mac-hmac", 8],
    ["w5-hash-function", "w5-digital-signature", 8],
    ["w5-mac-hmac", "w5-digital-signature", 8],
    ["w5-public-key-crypto", "w5-digital-signature", 9],
    ["w5-digital-signature", "w5-non-repudiation", 8],
    ["w5-public-key-crypto", "w5-rsa", 9],
    ["w5-public-key-crypto", "w5-diffie-hellman", 8],
    ["w5-rsa", "w5-hybrid-encryption", 8],
    ["w5-digital-signature", "w5-certificates-pki", 8],
    ["w5-diffie-hellman", "w5-certificates-pki", 7],
    ["w5-certificates-pki", "w5-chain-validation", 9],
    ["w5-collision-resistance", "w5-digital-signature", 7],
    ["w5-beyond-confidentiality", "w5-primitive-selection", 8],
    ["w5-mac-hmac", "w5-primitive-selection", 6]
  ]
}
