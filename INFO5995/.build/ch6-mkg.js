{
  nodes: [
    ["m6-cia-properties", 6, 1, "CIA Properties and What Each Control Answers", "Confidentiality asks who can see it, answered by access control plus encryption in the appropriate data state; integrity asks whether we can trust the value, answered by hashes, signatures and protected logs together; availability asks whether we can access and recover it, answered by backups, versioning, offline or immutable copies and recovery testing. A hash alone detects change but does not say who changed the value, and backups support availability and recovery without automatically providing confidentiality.", "../chapters/chapter6/web/chapter6-study.html#sec-data"],

    ["m6-entropy", 6, 2, "Entropy and Guesswork", "If a secret is chosen uniformly from a set of size N, the number of candidates is N and the entropy is H = log2 N bits, so an L-character password drawn from an alphabet of R characters has N = R^L and H = L log2 R; entropy measures the choice, not the string. An attacker who works through a keyspace without repetition expects to find a uniformly random secret about halfway through: average about N/2 = 2^(H-1), worst case N = 2^H, so one bit of entropy is worth one bit of security.", "../chapters/chapter6/web/chapter6-math.html#sec-m-entropy"],

    ["m6-security-strength", 6, 2, "Security Strength and Equivalent Key Sizes", "A primitive has security strength b bits when the best known attack needs on the order of 2^b operations: a k-bit symmetric key resists exhaustive search at 2^k, an n-bit hash resists collisions only at about 2^(n/2), and an RSA modulus of k bits has no known attack near 2^k, which is why RSA keys must be enormous to reach the same strength as an AES key. The table reads as a set of equivalences: AES-128, SHA-256, a 3072-bit RSA modulus and a 256-bit elliptic curve all sit at 128-bit strength.", "../chapters/chapter6/web/chapter6-math.html#sec-m-strength"],

    ["m6-birthday-bound", 6, 3, "Birthday Bound and Collision Resistance", "In a space of n-bit outputs there are 2^n values, so after roughly sqrt(2^n) = 2^(n/2) hashes a collision is likely. A hash used for collision resistance therefore needs an output twice the target strength, which is why SHA-256 is quoted as 128-bit collision resistance rather than 256-bit.", "../chapters/chapter6/web/chapter6-math.html#sec-m-strength"],

    ["m6-kdf-work-factor", 6, 2, "Password-Hashing Work Factor and the Stored Verifier", "A memory-hard KDF with m blocks of memory, t iterations and p parallel lanes does work proportional to its memory-time product (W proportional to m*t*p), and the time to exhaust a fraction f of a keyspace of size N is f*N*W. The stored record is the derived verifier plus the salt plus the algorithm parameters, because the server must repeat exactly the same computation at login; the salt defeats precomputed tables but does not slow a single guess, and the cost parameter sets the price of a direct guess.", "../chapters/chapter6/web/chapter6-math.html#sec-m-hashing"],

    ["m6-factor-independence", 6, 2, "Independent Factors and Bypass Probability", "If factor 1 is defeated with probability p1 and factor 2 with probability p2, then for independent factors the bypass probability is p1*p2. If the two are verified through the same channel, such as one phishing page that collects the password and relays the one-time code in real time, a single compromise defeats both and the best you can claim is max(p1, p2): with p1 = p2 = 0.01 independence gives 10^-4 and dependence gives 10^-2.", "../chapters/chapter6/web/chapter6-math.html#sec-m-authmath"],

    ["m6-hmac-construction", 6, 2, "HMAC Construction and Tag Length", "With a hash H, block size B bytes and a key K padded to B bytes, HMAC(K, M) = H((K XOR opad) || H((K XOR ipad) || M)); the nested form binds the inner digest to the key again, so the length-extension property of H(K || M) cannot be exploited to forge a tag. For a MAC with an n-bit output and an n-bit key, forgery resistance is about min(n, n_key) with no birthday advantage, which is why a 128-bit truncated HMAC-SHA-256 tag is a sound choice while truncating below about 96 bits is where online forgery attempts start to matter.", "../chapters/chapter6/web/chapter6-math.html#sec-m-hmac"],

    ["m6-tls-key-schedule", 6, 3, "TLS 1.3 Key Schedule and Record Protection", "TLS 1.3 uses HKDF, a two-step extract-then-expand construction, so PRK = HMAC(salt, IKM) and OKM = HKDF-Expand(PRK, info, L) produce a separate secret per epoch and within each epoch a separate key per direction and purpose. That gives compartmentalisation, because compromising one traffic secret does not reveal another, and forward secrecy, because handshake keys are discarded once application keys exist; each record is then sealed with AEAD using a per-record nonce and an implicit sequence number, so a reordered, replayed or truncated record fails verification.", "../chapters/chapter6/web/chapter6-math.html#sec-m-tls"]
  ],

  edges: [
    ["m6-entropy", "m6-kdf-work-factor", 8],
    ["m6-entropy", "m6-security-strength", 7],
    ["m6-security-strength", "m6-birthday-bound", 9],
    ["m6-security-strength", "m6-tls-key-schedule", 6],
    ["m6-birthday-bound", "m6-hmac-construction", 7],
    ["m6-hmac-construction", "m6-tls-key-schedule", 8],
    ["m6-cia-properties", "m6-hmac-construction", 6],
    ["m6-cia-properties", "m6-tls-key-schedule", 5],
    ["m6-kdf-work-factor", "m6-factor-independence", 6]
  ]
}
