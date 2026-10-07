{
  nodes: [
    ["w4-crypto-goals", 4, 1, "Security Goals & Guarantees", "Cryptography protects information and communication even when the network or the system cannot be fully trusted, and a primitive is never strong in the abstract: it is strong for a stated goal against a stated attacker. The deck's table pairs five goals - confidentiality, integrity, authentication, non-repudiation and key establishment - with the tools that deliver them.", "../chapters/chapter4/web/chapter4-study.html#sec-goals"],
    ["w4-kerckhoffs", 4, 2, "Kerckhoffs's Principle", "The security of a system should depend on its key, not on its design remaining obscure: 'the enemy knows the system'. Modern cryptography therefore uses a public algorithm plus a secret key - everyone may know that you used AES, nobody may know the key.", "../chapters/chapter4/web/chapter4-study.html#sec-kerckhoffs"],
    ["w4-symmetric-encryption", 4, 1, "Symmetric Encryption", "One shared secret key drives both directions: C = Enc(K, M) and M = Dec(K, C), which gives high throughput and small overhead because the same short key protects an arbitrarily long message. If K is exposed anyone holding K can decrypt the data, and the open challenge is how both sides obtain that secret.", "../chapters/chapter4/web/chapter4-study.html#sec-symmetric"],
    ["w4-one-time-pad", 4, 2, "One-Time Pad", "Create a truly random key the same length as the message, encrypt by XORing each plaintext bit with each key bit, and decrypt by XORing the ciphertext with the same key again: C = M \u2295 K and M = C \u2295 K. When all four conditions hold - truly random, same length, kept secret, never reused - the ciphertext reveals nothing about the plaintext.", "../chapters/chapter4/web/chapter4-study.html#sec-otp"],
    ["w4-perfect-secrecy", 4, 3, "Perfect Secrecy", "With K uniform over {0,1}^n, Pr[C = c | M = m] = Pr[K = m \u2295 c] = 2^-n, which does not depend on m at all; by Bayes' rule the posterior equals the prior, so the ciphertext gives the attacker no information about the message. The four one-time pad conditions are exactly the assumptions this proof needs, so dropping any one of them breaks it.", "../chapters/chapter4/web/chapter4-math.html#sec-m-xor"],
    ["w4-key-reuse", 4, 2, "One-Time Pad Key Reuse", "Reuse the key once and the secrecy collapses: C1 \u2295 C2 = (M1 \u2295 K) \u2295 (M2 \u2295 K) = M1 \u2295 M2, because the key cancels out of the difference. The attacker then holds the XOR of two plaintexts, which is enough to recover both with ordinary language statistics, and the 'never reuse' rule survives in practice as nonce discipline.", "../chapters/chapter4/web/chapter4-study.html#sec-otp"],
    ["w4-stream-vs-block", 4, 2, "Stream vs Block Ciphers", "A stream cipher seeds a generator with the key and a nonce to produce a keystream and XORs each message bit with one keystream bit (C = M \u2295 keystream; the modern example is ChaCha20). A block cipher transforms fixed-size blocks - AES uses 128-bit blocks - so a mode of operation is needed for anything longer than one block.", "../chapters/chapter4/web/chapter4-study.html#sec-ciphers"],
    ["w4-aes-internals", 4, 2, "AES Internals", "AES is a symmetric block cipher with a 128-bit block and a key of 128, 192 or 256 bits, running 10, 12 or 14 rounds and published as FIPS 197. Every round applies SubBytes, ShiftRows, MixColumns and AddRoundKey, and AddRoundKey - the XOR with round keys produced by the key schedule - is the only step that involves the secret.", "../chapters/chapter4/web/chapter4-study.html#sec-aes"],
    ["w4-block-cipher-modes", 4, 2, "Block Cipher Modes of Operation", "The mode decides what an observer of the ciphertext can learn: ECB encrypts each block independently so identical plaintext blocks produce identical ciphertext blocks, CBC chains blocks so repeated patterns are hidden but adds no integrity, and GCM adds an authentication tag that detects tampering.", "../chapters/chapter4/web/chapter4-study.html#sec-modes"],
    ["w4-aead-construction", 4, 2, "Authenticated Encryption (AEAD)", "The deployable unit is a complete construction - cipher + mode + nonce strategy + authentication mechanism - not an algorithm name, and the modern defaults are AES-GCM and ChaCha20-Poly1305. A nonce is public but must be unique under the key: nonce reuse, encryption without integrity, weak key lifecycle and unsafe composition are the four ways strong primitives still fail.", "../chapters/chapter4/web/chapter4-study.html#sec-construct"],
    ["w4-key-strength-lifecycle", 4, 2, "Key Strength & Lifecycle", "An n-bit key has 2^n possible bit strings, but entropy is the attacker's uncertainty before the key is generated, so a key built from a guessable human pattern can leave an effective search of at most 2^16 candidates even inside a 128-bit field: LONG \u2260 STRONG. A strong key still fails through poor handling, so all five lifecycle stages - generate with a CSPRNG, store in a keystore or HSM, use with least exposure, rotate or revoke, destroy every copy - must survive.", "../chapters/chapter4/web/chapter4-study.html#sec-keys"],
    ["w4-hash-function", 4, 2, "Cryptographic Hash Function", "A public function h = H(m) maps a message of arbitrary length to a fixed-length digest, and it is one-way (preimage resistant), collision resistant, and produces a different digest for even a one-bit change in the input (the avalanche effect).", "../chapters/chapter4/web/chapter4-study.html#sec-hash"],
    ["w4-hash-limits", 4, 3, "Hash Limits & the Birthday Bound", "Finding any two messages with the same digest costs only about 2^(n/2) work for an n-bit digest (the birthday bound), which is why MD5 and SHA-1 are deprecated and SHA-256 is the standard default. A bare hash is only a fingerprint: an attacker who can modify the data can replace the message and its hash, so integrity against an active attacker needs a MAC, a signature or an AEAD.", "../chapters/chapter4/web/chapter4-study.html#sec-hash"]
  ],
  edges: [
    ["w4-crypto-goals", "w4-symmetric-encryption", 7],
    ["w4-crypto-goals", "w4-hash-function", 6],
    ["w4-kerckhoffs", "w4-symmetric-encryption", 7],
    ["w4-kerckhoffs", "w4-aes-internals", 8],
    ["w4-kerckhoffs", "w4-key-strength-lifecycle", 8],
    ["w4-symmetric-encryption", "w4-one-time-pad", 8],
    ["w4-symmetric-encryption", "w4-key-strength-lifecycle", 7],
    ["w4-one-time-pad", "w4-perfect-secrecy", 9],
    ["w4-one-time-pad", "w4-key-reuse", 8],
    ["w4-one-time-pad", "w4-stream-vs-block", 8],
    ["w4-key-reuse", "w4-aead-construction", 6],
    ["w4-stream-vs-block", "w4-aes-internals", 7],
    ["w4-aes-internals", "w4-block-cipher-modes", 9],
    ["w4-block-cipher-modes", "w4-aead-construction", 8],
    ["w4-hash-function", "w4-hash-limits", 9],
    ["w4-hash-limits", "w4-aead-construction", 7]
  ]
}
