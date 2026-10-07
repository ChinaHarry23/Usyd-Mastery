# Chapter 4 Digest — INFO5995 Week 4: Cryptography Basics Part 1

**Sources (both read completely, in chunks):**
- `chapters/chapter4/web/chapter4-study.html` — 1022 lines, 69,709 bytes. Title: "Week 4: Cryptography Basics Part 1 — INFO5995".
- `chapters/chapter4/web/chapter4-math.html` — 585 lines, 50,569 bytes. Title: "Foundations — Week 4: Cryptography Basics Part 1".

Both pages state they are "Built from the Week 4 lecture deck (INFO5995, *Crypto Basics*)". The study page subtitle: "Confidentiality from first principles: what a primitive guarantees, why the algorithm is public and the key is secret, how AES works inside, how block cipher modes change what a system reveals, and where hash functions fit."

A note on evidence quality: two of the interactive widgets on these pages are explicitly labelled as illustrative rather than measured. The `ix-guarantee-map` JSON says "Illustrative 0–3 coverage scores read off the Week 4 goal table. Encryption, MAC and signature differ in what they promise; **this is a revision aid, not measured data**." The `ix-m-hash-race` JSON says "Birthday-bound work 2^(n/2), plotted on a log scale. **Illustrative magnitudes from the formula, not measured attack costs**." The math page's security-level table says "Read the table as an engineering aid, not as lecture content". Any question built on these must respect that framing.

---

## 1. SECTION-BY-SECTION FACTS

### 1.1 `chapter4-study.html`

#### `#hero` — "Week 4: Cryptography Basics Part 1" (`id="hero"`)
- Hero subtitle names the whole arc: "Confidentiality from first principles: what a primitive guarantees, why the algorithm is public and the key is secret, how AES works inside, how block cipher modes change what a system reveals, and where hash functions fit."
- Four hero cards state the page's slogans: "Match the primitive to the goal"; "Public algorithm, secret key"; "AES: 128-bit blocks, 10+ rounds"; "Length is not entropy".
- Chip list of topics: "What cryptography guarantees", "Kerckhoffs's principle", "Symmetric encryption & the one-time pad", "Stream vs block ciphers, AES internals", "Modes of operation & AEAD", "Key strength, entropy & lifecycle", "Hash functions".
- Provenance line: "Built from the Week 4 lecture deck (INFO5995, *Crypto Basics*) — Confidentiality, AES, key management and hashing".
- Sidebar progress label: "Lecture 4 — Cryptography Basics Part 1". In-page nav order is: Overview, Goals & Guarantees, Kerckhoffs's Principle, Symmetric Encryption, One-Time Pad, Stream vs Block, AES Internals, Modes of Operation, Choosing a Construction, Key Strength, Hash Functions, Recap.
- The page links forward to `chapter4-math.html` ("📐 Foundations") and `chapter4-mindmap.html` ("🗺 Mind Map"). No `sec-` anchor is used inside `#hero` other than `hero` itself.

#### `#sec-goals` — "What Cryptography Actually Guarantees" (`id="sec-goals"`)
- Lead sentence refuses the word "secure": "The deck's opening move is to refuse the word 'secure'. Cryptography is a set of mathematical techniques that protect information and communication even when the network or the system cannot be fully trusted — and each technique delivers one specific guarantee under one defined threat model."
- "The chain to memorise:" information → *cryptographic primitive* (algorithm + parameters + key, when required) → *security guarantee*. "A primitive is never 'strong' in the abstract; it is strong *for a stated goal against a stated attacker*."
- Column 1 "Trust the algorithm, not the channel": the first lecture's warning was "don't trust anyone"; cryptography builds trust "out of mathematics instead of out of the network".
- Column 2 "Crypto is everywhere": cryptography protects data from being read "or changed". Remove it and "online banking stops working, card payments stop being safe, passwords become readable by anyone on the network, software updates can be replaced by attackers, and messaging can be intercepted."
- The five-goal table (goal → question → primary tools) is the chapter's spine:
  - **Confidentiality** — "Can outsiders read the data?" — Encryption • authenticated encryption (AEAD).
  - **Integrity** — "Has the data been changed?" — Hash\* • MAC • AEAD • digital signature.
  - **Authentication** — "Who created or sent it?" — MAC • digital signature • certificate binding.
  - **Non-repudiation** — "Can a signer later deny it?" — Digital signature + identity and audit context.
  - **Key establishment** — "How do peers obtain a shared secret?" — Diffie–Hellman • key encapsulation mechanism (KEM).
- "The asterisk is examinable." A bare hash is only a fingerprint: "an attacker who can modify the data can replace the message *and* its hash. Integrity against an active attacker requires a MAC, a digital signature or an AEAD construction — not a hash on its own."
- Matcher widget `ix-goal-matcher` pairs each goal with its tool; the integrity pair explicitly reads "MAC, AEAD or digital signature (a bare hash is only a fingerprint)".
- Race widget `ix-guarantee-map` (illustrative 0–3 scores, max 3): Symmetric encryption (AES-CBC) = 3, "confidentiality only"; AEAD (AES-GCM) = 3, "confidentiality + integrity"; MAC (HMAC) = 2, "integrity + origin"; Bare hash (SHA-256) = 1, "change detection only"; Digital signature = 3, "integrity + origin + non-repudiation".
- Quick check: publishing a file and its SHA-256 on the same server delivers "Detection of accidental corruption only — an active attacker replaces both the file and its hash". The reasoning given: "An attacker who can edit the file on that server can edit the published hash in the same request. Nothing about the hash being long prevents this."

#### `#sec-kerckhoffs` — "Kerckhoffs's Principle: Public Algorithm, Secret Key" (`id="sec-kerckhoffs"`)
- Framing question: "*is hiding the best way to keep something safe?* — and answers it with a nineteenth-century principle that still governs every modern standard."
- Definition box, verbatim: "The security of a system should depend on its **key**, not on its design remaining obscure. Auguste Kerckhoffs, a Dutch cryptographer writing in the 19th century, framed it as 'the enemy knows the system'."
- "Security by obscurity": "The natural instinct: a good secret is your best defence, so keep the mechanism hidden. The deck's line is that even dogs bury bones — hiding is the obvious move, and it is the one that fails first, because the mechanism leaks."
- "Security by transparency": "True security comes from openness. The algorithm is published, reviewed and attacked by everyone; the only thing protected is the key. This is what modern cryptography does: *public algorithm + secret key*."
- Why openness is stronger: "**Public review and trust** — thousands of cryptanalysts have tested AES; nobody has tested your home-grown scheme." and "**Scalability** — changing a key is cheap; redesigning an algorithm is not."
- "What the principle does *not* say": "It does not say keys may be public. The key is the one secret, and it must stay secret." and "It does not say implementations may leak. Padding oracles and timing leaks attack the key, not the published design."
- Diagram `algo-box`: AES ("public algorithm") + key ("secret, generated by a CSPRNG") → ciphertext ("safe to publish"). Caption: "AES(key, plaintext) → ciphertext. Everyone may know that you used AES; nobody may know the key."
- Insight box: because the algorithm is public, "we can standardise it (FIPS 197), analyse it in the open, accelerate it in hardware, and reason about security in terms of key length." Everything that follows — "search space, entropy, lifecycle — is about protecting one short secret instead of one large design."
- Quick check: a vendor's proprietary, undocumented scrambling routine "rests on obscurity, so it will fail as soon as the design leaks — and public review, which is how AES earned trust, never happened." Two distractors are wrong because "Undocumented is not the same as strong" and because Kerckhoffs's principle does *not* mean that publishing source code is the fix.

#### `#sec-symmetric` — "Symmetric Encryption: One Shared Secret" (`id="sec-symmetric"`)
- Lead: "Encryption changes *who can understand* the data. The simplest key model is one secret that both sides already hold: Alice and Bob must each possess the same key K."
- Definition box, verbatim: "A single shared secret key drives both directions: \(C = \mathrm{Enc}(K, M)\) and \(M = \mathrm{Dec}(K, C)\). High throughput, small overhead and suitability for large data come from the fact that the same short key protects an arbitrarily long message."
- Pipeline widget `ix-sym-pipeline` has five nodes: "Plaintext M" (readable message that must not cross the network in the clear) → "Enc(K, M)" (public algorithm combines message with shared secret key K) → "Ciphertext C" (what an observer sees; under a good cipher reveals nothing about M without K) → "Dec(K, C)" (receiver applies inverse transformation with the same key K) → "Plaintext M" (recovered; held only on the two endpoints, never by the network).
- Worked diagram: `HELLO CLASS` (plaintext) → KEY (shared secret K) → `9F A2 71 …` (ciphertext) → `HELLO CLASS` (decrypt with the same K). Caption: "The algorithm may be public. Security depends on controlling the key."
- Why it is useful: high throughput; small overhead; "Ideal for bulk data: files, disks and network traffic".
- What can go wrong: "Key leakage", "Unsafe sharing of the secret", "Nonce or IV mistakes".
- Insight box: "if K is exposed, anyone holding K can decrypt the data. There is no second factor and no recovery — which is exactly why the second half of this week is about protecting K, and why Week 5 exists at all."
- Symmetric vs asymmetric table: Keys — "One shared secret key" vs "A public and a private key"; Strength — "Fast enough for files, disks and network traffic" vs "Useful when the parties do not already share a secret"; Challenge — "How do both sides get the secret?" vs "Slower and more complex"; In practice (spanning both) — "Most real protocols use both: a short asymmetric setup to establish trust or keys, then a long symmetric session for bulk data."
- Quick check: WhatsApp's server forwards messages it cannot read because "Key material is created on the two phones, a shared secret is derived rather than transmitted, and message keys rotate — the server carries ciphertext it cannot read". The route is visible; the meaning is not.

#### `#sec-otp` — "The One-Time Pad: Perfect Secrecy, and Why It Stays in the Textbook" (`id="sec-otp"`)
- Lead: "Before practical ciphers, the deck proves what is theoretically possible. A random key exactly as long as the message, XORed into the plaintext, gives a ciphertext that reveals nothing about the message."
- Definition box, verbatim: "Create a random key the same length as the message. Encrypt by combining each bit of plaintext with each bit of key using XOR, and decrypt by XORing the ciphertext with the same key again: \(C = M \oplus K\) and \(M = C \oplus K\)."
- Worked 8-bit code block (the page's own numbers): PLAINTEXT (M) `10110010`; ONE-TIME KEY (K) `01011001`; XOR → CIPHERTEXT (C) `11101011`; `DECRYPT: C ⊕ K = 11101011 ⊕ 01011001 = 10110010 = M`.
- Four conditions, each as a glance card: "**Truly random** — No predictable pattern. Generated by a cryptographic random-bit generator, not by a human or a formula."; "**Same length** — One key bit for every message bit. A 1 GB message needs a fresh 1 GB key."; "**Kept secret** — Known only to sender and receiver, and shared in advance through a channel nobody else can read."; "**Never reused** — A fresh key for every message. This is the condition that fails first in practice."
- Callout: "**When all four conditions hold, the ciphertext reveals nothing about the plaintext.** Not 'very little' — nothing. This is the strongest confidentiality statement in the whole week."
- Cost and reuse failure (theorem box): "Key length equals message length, the key must be distributed securely in advance, message-sized secret material has to be stored, and the key must be destroyed so it can never be reused." Reuse identity displayed: \(C_1 \oplus C_2 = (M_1 \oplus K) \oplus (M_2 \oplus K) = M_1 \oplus M_2\). "The key cancels out. The attacker now holds the XOR of two plaintexts, which is enough to recover both with ordinary language statistics. **Key reuse destroys perfect secrecy**."
- Worked solution `sol-1` (5 steps): (1) state the ideal — perfect secrecy with a truly random one-use key at message length; (2) cost it — "protecting a 1 GB file needs a 1 GB key", every message needs its own key delivered in advance over a channel that is already secure, "the problem you were trying to solve"; (3) show reuse failure — two ciphertexts under one key XOR to \(M_1 \oplus M_2\), "the attacker's problem no longer involves the secret at all"; (4) name the replacement — "a stream cipher expands a short key and a unique nonce into a keystream, and a block cipher transforms fixed-size blocks under a mode of operation"; (5) close with surviving discipline — "the one-time pad's 'never reuse' rule does not go away. It reappears as *nonce discipline*: a nonce must never repeat under the same AEAD key."
- Quick check: an engineer XORs each message with the next non-repeating slice of a long random key file — "It is still a one-time pad — it is secure only as long as no slice is ever reused and the randomness is genuine, which is exactly the condition that is hard to guarantee operationally" (hard parts named: "generating enough true randomness and guaranteeing that no slice is ever reused across restarts, backups or retransmissions").

#### `#sec-ciphers` — "Stream Ciphers and Block Ciphers" (`id="sec-ciphers"`)
- Lead: practical ciphers answer the OTP's question — "*how can a short key protect a long stream of data?*" — in one of two ways. "The distinction describes how the cipher handles input, not how strong the algorithm is."
- Stream cipher: "Protects a flowing sequence. The key and a nonce seed a generator that produces a keystream, and each message bit is XORed with one keystream bit: \(C = M \oplus \mathrm{keystream}\). Natural for continuous data. The deck's modern example is **ChaCha20**."
- Block cipher: "Transforms fixed-size blocks. The message is split into blocks \(M_1, M_2, M_3, M_4\) and the cipher maps each block to a same-size block. **AES uses 128-bit blocks**; a mode of operation safely handles messages longer than one block."
- Diagram: message blocks `M1 M2 M3 M4` → block cipher ("128-bit block") → ciphertext blocks `C1 C2 C3 C4`. Caption: "A block cipher alone handles exactly one block. Everything longer is the mode's job."
- Insight box: "Modern protocols normally use authenticated encryption — not a raw cipher by itself. A stream cipher or a block cipher is a component. The deployable unit is a complete construction: cipher + mode + nonce strategy + authentication mechanism."
- Comparison table:
  - Input model — stream: "A flowing sequence, one unit at a time"; block: "Fixed-size blocks, padded to a multiple of the block size".
  - Core operation — stream: \(C = M \oplus \mathrm{keystream}\); block: "A keyed permutation of a 128-bit block".
  - Needs a mode? — stream: "No mode, but it does need a unique nonce"; block: "Yes — the mode defines how blocks are chained or counted".
  - Modern example — stream: ChaCha20; block: "AES, in GCM or CBC mode".
  - Typical failure — stream: "Nonce reuse makes two messages XOR together"; block: "Wrong mode choice: ECB reveals patterns, CBC alone adds no integrity".
- Quick check: "A developer says 'I used AES, so the data is safe'. What is missing?" — "The mode of operation, the nonce or IV strategy, and the authentication mechanism — a cipher name alone does not define the construction". The key-length distractor is wrong because "Even AES-256 in ECB mode leaks repeated plaintext patterns."

#### `#sec-aes` — "Inside AES: A Public, Repeatable Round Function" (`id="sec-aes"`)
- Lead: "AES is the week's worked example of Kerckhoffs's principle in hardware: a fully public specification, adopted as FIPS 197, whose entire secrecy lives in the key schedule."
- Definition box, verbatim: "A symmetric block cipher with a **128-bit block** and a key of 128, 192 or 256 bits. Its round count grows with the key: **10 rounds** for AES-128, **12** for AES-192 and **14** for AES-256. Widely accelerated in hardware, which is why it is the default in modern protocols."
- Round-step table (Step / What it does / Why the design needs it):
  - **SubBytes** — "Each state byte is replaced by its entry in a fixed public 16×16 substitution box (S-box)" — "Supplies non-linearity. Without it the cipher would be a solvable system of linear equations".
  - **ShiftRows** — "Row *r* of the 4×4 state is rotated left by *r* bytes" — "Spreads bytes across columns so a change in one byte affects several columns".
  - **MixColumns** — "Each column is multiplied by a fixed polynomial over GF(2^8)" — "Diffuses change within a column; combined with ShiftRows it diffuses across the whole state".
  - **AddRoundKey** — "The state is XORed with a round key derived from the key schedule" — "The only step that involves the secret. Everything else is public and key-independent".
- Fact pills: "Block size: 128 bits"; "Key sizes: 128 / 192 / 256 bits"; "Rounds: 10 / 12 / 14"; "Public specification: FIPS 197"; "Hardware accelerated".
- Structure: "a substitution–permutation network… Every round applies the same four steps in the same order, under a different round key. The final round omits MixColumns. Because the structure is public and identical for every user, an attacker knows exactly what the cipher is doing — and still cannot invert it without the key."
- Why diffusion is the point: "Confusion hides the relationship between key and ciphertext; diffusion spreads one plaintext bit across the whole state. After enough rounds, changing a single plaintext bit changes roughly half of the output bits — the avalanche property you will measure on the Foundations page."
- Callout ("Exam framing"): "never describe AES as 'a secret algorithm'. It is the opposite — a published standard whose security depends entirely on the key."
- Quick check: the only round step involving the secret key is "AddRoundKey, which XORs the round keys produced by the key schedule". The S-box distractor is wrong because "The S-box is a fixed public table in the specification"; the ShiftRows distractor is wrong because "ShiftRows is a fixed byte rotation that depends only on the row index."

#### `#sec-modes` — "Modes of Operation: The Same AES Reveals Different Things" (`id="sec-modes"`)
- Lead: "The same AES primitive can be used in very different ways. The mode decides what an observer of the ciphertext can learn, and whether tampering can be detected at all."
- Mode table (Mode / How blocks relate / Repeated plaintext / Patterns / Integrity):
  - **ECB — electronic codebook** — "Each block is encrypted independently" — "Repeated plaintext → repeated ciphertext" — "Patterns remain visible" — "None".
  - **CBC — cipher block chaining** — "Each block depends on the previous ciphertext block" — "Repeated plaintext gives different ciphertext" — "Hides repeated patterns" — "Confidentiality only; authentication is separate".
  - **GCM — Galois/counter mode** — "Counter-based encryption plus an authentication tag" — "Determined by the nonce, never by the plaintext" — "Hides content" — "Detects tampering".
- Code block "WHY ECB FAILS — encrypt two identical blocks under one key": PLAINTEXT `[ ATTACK ][ AT DAWN ][ ATTACK ][ AT DAWN ]` becomes ECB `[ 4F 1C ][ 9A 03 ][ 4F 1C ][ 9A 03 ]` with carets under the two identical ciphertext blocks: "identical plaintext blocks produce identical ciphertext blocks, so the structure of the message is visible without any key."
- Insight box: "**ECB is the classic exam answer for 'what not to do'.** It is not that AES is weak; it is that encrypting each block independently publishes any repetition in the plaintext. CBC fixes the repetition by chaining, but it still provides confidentiality only — authentication must be designed separately, and doing that wrongly is a well-known source of padding-oracle attacks. GCM does both."
- Deck widget `ix-modes-deck`, "Six mode facts worth flipping through": ECB one-liner ("Every block is encrypted independently, so identical plaintext blocks produce identical ciphertext blocks and the pattern of the message survives encryption", hint "Legacy"); CBC one-liner ("Each ciphertext block is XORed into the next plaintext block before encryption, so identical blocks encrypt differently and repeated patterns are hidden. It provides confidentiality only.", hint "Legacy"); "What CBC still needs" ("A separate, correctly designed authentication mechanism. Confidentiality without integrity leaves controlled modification possible."); GCM one-liner ("Counter-based encryption plus a keyed authentication tag: one pass produces ciphertext and tag, so the receiver releases plaintext only when the tag verifies."); "AES-GCM inputs" ("A key K, a unique nonce N and the plaintext M. It returns the pair (C, T) = Enc(K, N, M): ciphertext plus tag."); "What happens when C or T changes" ("Verification fails and the plaintext is rejected. Tampering is detected rather than silently decrypted.").
- GCM diagram: inputs KEY K ("secret"), UNIQUE NONCE N ("public, never repeated under K"), PLAINTEXT M ("the bulk data") → AES-GCM ("encrypt + authenticate") → CIPHERTEXT C ("plus TAG T"). Caption: "(C, T) = Enc(K, N, M). If C or T changes, verification fails and the plaintext is rejected."
- Quick check: a 4 MB file encrypted in ECB visibly contains the same 16-byte pattern at four offsets — "The mode, not the cipher: ECB encrypts blocks independently, so identical plaintext blocks become identical ciphertext blocks". Distractors are wrong because "A 128-bit block and a 128-bit key are both standard and are not the cause" and because key reuse would still show the same repetition.

#### `#sec-construct` — "Choose Complete Constructions, Not Algorithm Names" (`id="sec-construct"`)
- Lead: "Selection question to ask: *what security property does the complete construction guarantee?* A cipher, a mode, a nonce strategy and an authentication mechanism together form the usable thing."
- Modern defaults: "**AES-GCM** — AES block cipher plus GCM authenticated mode; widely accelerated in hardware"; "**ChaCha20-Poly1305** — stream cipher plus authenticator; strong software performance".
- Legacy — "learn, do not choose": "**AES-CBC** — can provide confidentiality, but needs a separate secure authentication design"; "**DES, 3DES, RC4** — obsolete or prohibited in modern designs; retained only for history and migration discussions".
- Symmetric / asymmetric / hybrid table:
  - Best for — "Protecting lots of data" / "Establishing trust or keys" / "Building a complete protocol".
  - Key model — "One shared secret" / "Public / private pair" / "Short asymmetric setup + long symmetric session".
  - Examples — "AES-GCM, ChaCha20-Poly1305" / "X25519, RSA-OAEP, RSA-PSS, EdDSA" / "TLS, envelope encryption".
  - What still needs care — "Key sharing + nonce discipline" / "Identity binding + private-key custody" / "Composition + lifecycle".
- "Four ways strong primitives still fail in weak systems": (1) "**Nonce reuse** — repeating a nonce under one AEAD key can reveal relationships or worse."; (2) "**No authentication** — encryption without integrity can permit controlled modification."; (3) "**Weak key lifecycle** — keys leak through logs, backups, memory, access control or poor rotation."; (4) "**Unsafe composition** — ECB, home-grown protocols and error oracles defeat good primitives."
- Failure-to-fix matcher `ix-failure-matcher`: nonce reuse → "Generate a fresh unique nonce per message and enforce it in the API"; encryption without integrity → "Use an AEAD construction, or add a MAC over the ciphertext"; keys leaking through logs and backups → "Keep keys in a keystore or HSM, never log them, and restrict access"; home-grown protocol on top of AES → "Choose a vetted construction such as AES-GCM or ChaCha20-Poly1305"; obsolete cipher kept for compatibility → "Plan a migration to a modern AEAD instead of extending DES, 3DES or RC4".
- Takeaway: "choose a proven AEAD, design the protocol, *then* engineer the key lifecycle. In that order — because the choice of primitive determines what the protocol can promise, and the lifecycle determines whether the promise survives contact with operations."
- Worked solution `sol-2` reviews: "AES-128 in ECB mode, the key is stored in the application config file, and we hand the same key to every customer install." Six steps and verdict: (1) Mode — ECB encrypts each 128-bit block independently so structured files (spreadsheets, database pages, images) keep their layout visible; replace with AES-GCM or ChaCha20-Poly1305. (2) Integrity — ECB provides none; "An attacker who flips a ciphertext bit flips the corresponding plaintext bit with no detection"; an AEAD returns a tag and the receiver rejects when it does not verify. (3) Nonce — "GCM requires a unique nonce per encryption under the same key", so a file-encryption design must guarantee the nonce is "generated fresh — not derived from a filename or a counter that restarts". (4) Key custody — "A key in a plain config file is readable by anyone with filesystem access, and it leaks through backups and support bundles"; move to keystore or HSM. (5) Key per install — one shared key means "one compromise breaks every customer, and rotation becomes a mass migration"; use "a per-install data key wrapped by a key-encryption key — envelope encryption — so rotation is a re-wrap rather than a re-encrypt of all data". (6) Verdict: "'AES is the right primitive, but the construction is wrong in four independent ways: the mode leaks patterns, there is no integrity, the nonce strategy is undefined, and the key is neither protected nor scoped.'"

#### `#sec-keys` — "What Makes a Key Strong: Length, Entropy, Lifecycle" (`id="sec-keys"`)
- Lead: "A key is valuable because it is difficult to predict — and carefully controlled. Three separate properties are in play, and conflating them is the most common Week 4 mistake."
- Key-role table: **Symmetric secret** — "Shared by the authorised parties" — "Encrypt + decrypt bulk data"; **Private key** — "Kept by one owner" — "Decrypt • sign • derive secrets"; **Public key** — "Designed for distribution" — "Encrypt • verify • establish keys".
- Callout labelled "Four slogans worth memorising": "public ≠ unprotected • private ≠ shared • secret ≠ memorable." (The page's own label says four; the callout displays three slogans.) Followed by: "The role of a key determines who may possess it and what operation it enables — nothing more and nothing less."
- Key length box: "An *n*-bit key has \(2^n\) possible bit strings — *if every string can really occur*." Displayed arithmetic: \(\text{search space} = 2^{n} \qquad 2^{4} = 16 \qquad 2^{128} \approx 3.4 \times 10^{38}\). "Four bits are small enough to enumerate by hand; 128 bits are a vast candidate space. Length helps only when generation and implementation preserve the full search space."
- "Length is not entropy": "Entropy is the attacker's uncertainty *before* the key is generated — not the number of characters the key occupies." Code block contrasts "HUMAN PATTERN / INFO5995-INFO5995! / Long, but built from a guessable rule" with "CSPRNG OUTPUT / 7f2a19c0b6e3d84a / 915cf207ab469d31 / Generated from a cryptographic random-bit generator". Rule: "If only 16 bits vary, the effective search is at most \(2^{16}\) candidates — even inside a 128-bit field. **LONG ≠ STRONG.**"
- Five-stage lifecycle table (Stage / What good looks like / Failure it prevents): 1. Generate — "OS CSPRNG, secure entropy source" — "Predictable keys from human patterns or weak seeding"; 2. Store — "Keystore or HSM, restricted access" — "Leakage through config files, backups and logs"; 3. Use — "Least exposure, never log the key" — "Key material in logs, crash dumps and memory dumps"; 4. Rotate / revoke — "Policy plus a response plan to compromise" — "One leaked key staying valid forever"; 5. Destroy — "Remove active and backup copies" — "A retired key still decrypting old data".
- Summary formula (insight box): "*strong cryptography = strong primitive + unpredictable key + disciplined lifecycle*. Every one of the four failure modes in the previous section is a failure of the second or third term."
- Quick check: a service derives its AES key with `sha256("GoldenRetriever2019")`, 256 bits long. Answer: "Far weaker than 256 bits: the effective search space is the guessing space of the phrase, not the output length of the hash." Note the page's own explanation uses a caret-free rendering "2^256" in the study page's `data-good` text: "the effective search space is far smaller than 2^256".

#### `#sec-hash` — "Cryptographic Hash Functions: A Fixed-Length Fingerprint" (`id="sec-hash"`)
- Lead: "A hash function maps an input of any length to a short fixed-length digest. It is the second primitive family in the week's toolkit, and it is also the one most often misused."
- Definition box, verbatim: "A public function \(h = H(m)\) that maps a message of arbitrary length to a fixed-length digest. It is **one-way** (preimage resistant), **collision resistant** and produces a different digest for even a one-bit change in the input (the avalanche effect)." Note: the widget `ix-hash` is the interactive companion.
- Property table (Property / What it means / What it is used for):
  - **Preimage resistance** — "Given a digest, finding any message that produces it costs about \(2^{n}\) work for an *n*-bit digest" — "Integrity by fingerprint; password verification with a salt and a slow KDF".
  - **Second preimage resistance** — "Given a message, finding a different message with the same digest is infeasible" — "Detecting substitution as well as corruption".
  - **Collision resistance** — "Finding *any* two messages with the same digest costs about \(2^{n/2}\) work (the birthday bound)" — "Choosing digest length; why MD5 and SHA-1 are deprecated".
  - **Avalanche** — "Changing one input bit changes about half the output bits" — "Detecting modification at all, even a single flipped bit".
- Algorithm table (Algorithm / Digest / Status): **MD5** — 128 bits — "Broken — practical collisions; unsuitable for any security purpose"; **SHA-1** — 160 bits — "Deprecated — collisions demonstrated; retained only for legacy data"; **SHA-256** — 256 bits — "Standard default digest (SHA-2 family)"; **SHA-512** — 512 bits — "Standard, larger margin on the birthday bound"; **SHA-3** — 224–512 bits — "Standard alternative with a different internal design (sponge construction)".
- Callout "What a hash does not do": "A bare hash is only a fingerprint: an attacker who can modify the data can replace both the message and its hash. It also provides no confidentiality — the digest is not encryption, and it cannot be reversed to recover the message. For integrity against an active attacker, use a MAC, a signature or an AEAD."
- Where hashes earn their place: "Software update manifests and release checksums"; "Content addressing and integrity checks in storage systems"; "Key derivation (HKDF) and password hashing with a salt and a deliberately slow function"; "Building blocks inside MACs, signatures and certificate fingerprints".
- Where they are misused: "As a substitute for a MAC over data an attacker can edit"; "As a way to 'encrypt' data — hashing is not encryption"; "As a password store without a salt and a slow KDF"; "With a deprecated digest (MD5, SHA-1) in a new design".
- Worked solution `sol-3` chooses primitives for three requirements: (a) a 2 GB backup on disk — "confidentiality plus integrity over a lot of data, so the requirement is symmetric and authenticated: AES-GCM or ChaCha20-Poly1305 with a per-backup unique nonce, and a per-install data key wrapped by a key-encryption key. ECB is excluded because it leaks structure; CBC alone is excluded because it supplies no integrity." (b) firmware verification against an attacker who can modify the download — a bare SHA-256 on the same site "does not answer it, because the attacker edits both"; use "a *digital signature* over the image from a key the device already trusts, or a MAC when the verifier already shares a secret with the publisher". (c) a signed invoice — non-repudiation, "Only a digital signature over a hash of the document, bound to an identity through a certificate, gives that — a MAC cannot, because both parties hold the same key and either could have produced the tag." (4) The pattern: "Name the goal first (confidentiality, integrity, non-repudiation), then the attacker's capability, then the primitive, then the key model and lifecycle. Choosing 'the strongest algorithm' before naming the goal is the mistake the deck warns about."
- Quick check: a downloads page publishes `SHA-256: 8f14e4…` next to the installer — it protects against "Accidental corruption and download errors — not an attacker who controls the download page, who can replace both the installer and its published digest".

#### `#sec-recap` — "Week 4 Recap" (`id="sec-recap"`)
- Six toolkit cards: (1) "Match the primitive to the goal" — five goals, "a bare hash is only a fingerprint"; (2) "Public algorithm, secret key" — "Kerckhoffs's principle: the enemy knows the system. Security must rest on the key, which is why openness, review and standardisation are strengths rather than risks."; (3) "Perfect secrecy is not deployable" — "a random key as long as the message, used once. Key length equals message length, and reuse collapses the secrecy to M1 ⊕ M2."; (4) "AES is a component, not a construction" — "128-bit blocks, 10/12/14 rounds, public specification. The mode decides what the ciphertext reveals: ECB leaks patterns, CBC hides them but adds no integrity, GCM does both."; (5) "Length is not entropy" — "Search space is 2^n only if every bit can vary… LONG ≠ STRONG."; (6) "Strong crypto = primitive + key + lifecycle" — "Generate with a CSPRNG, store in a keystore or HSM, use with least exposure, rotate on policy, destroy every copy."
- Flow grid (the page's decision order): "Name the goal → Name the attacker → Choose the primitive → Design the key lifecycle".
- "Three ideas to leave with": "(1) *Public algorithms, protected secrets* — security should depend on strong keys, not on hiding how the system works. (2) *Encryption is only one part* — a secure channel also needs integrity, authentication and safe key establishment. (3) *Strong primitives must be composed correctly* — good algorithms still fail through weak protocols, poor randomness or mishandled keys."
- "Where Week 5 picks up": "Symmetric encryption left one difficult question open: Alice and Bob want the speed of symmetric encryption, but how does K reach both sides? Sending K across the network lets an observer copy it. Agreeing on K without sending K is the job of Diffie–Hellman — and once agreement exists, authentication is needed to stop a man in the middle from substituting both public values."
- Check-yourself glance cards: "Can you state the five security goals and their tools, explain Kerckhoffs's principle in one sentence, and say why the one-time pad is not deployed?" and "Search space \(2^n\), the reuse identity \(C_1 \oplus C_2 = M_1 \oplus M_2\), AES's block and key sizes, and the birthday bound \(2^{n/2}\) on the Foundations page."

---

### 1.2 `chapter4-math.html`

#### `#sec-m-hero` — "Foundations: the arithmetic behind Week 4's confidentiality" (`id="sec-m-hero"`)
- Hero tag: "INFO5995 — Week 4 supplement". Hero description: "Week 4 is the most quantitative week of the unit: a cipher is a function, key strength is a number of bits, and every failure mode has a formula behind it. This page writes those formulas down, works them on the deck's own numbers, and ends with the checklist that turns 'use AES' into a defensible construction."
- Chips: "Every formula derived from the Week 4 deck"; "KaTeX: \(C = M \oplus K\), \(2^{n}\), \(2^{n/2}\)"; "Worked arithmetic for key sizes and entropy"; "Checklist for choosing a construction".
- Sidebar TOC groups: "Confidentiality by the numbers" (XOR/OTP/perfect secrecy; modular arithmetic and search spaces; key length, entropy and security levels); "Inside the primitives" (the AES round as a diffusion argument; hash properties and the birthday bound); "Exam technique" (construct-selection checklist).
- The `math-content` div carrying `id="mainContent"` wraps the whole page body.

#### `#sec-m-xor` — "XOR, the One-Time Pad and Perfect Secrecy" (`id="sec-m-xor"`)
- Lead: "Everything the one-time pad can do follows from four properties of the XOR operation. Nothing else in this week's confidentiality material is as cheap to prove or as easy to get wrong."
- Theorem 1 — "XOR is its own inverse": "Bitwise exclusive-OR, written \(\oplus\), returns 1 exactly when its two inputs differ. The identity that makes the one-time pad work is that any value XORed with itself cancels": \(x \oplus x = 0, \qquad x \oplus 0 = x\). Therefore "encryption and decryption are the *same* operation applied with the same key": \(C = M \oplus K\) and \(C \oplus K = (M \oplus K) \oplus K = M\).
- Theorem 2 — "The ciphertext of a one-time pad is independent of the plaintext": "Fix a ciphertext value \(c\) and a candidate message \(m\). There is exactly one key that produces \(c\) from \(m\), namely \(k = m \oplus c\)." With uniform \(K\), \(\Pr[C = c \mid M = m] = \Pr[K = m \oplus c] = 2^{-n}\), "which does not depend on \(m\) at all. By Bayes' rule the posterior equals the prior, \(\Pr[M = m \mid C = c] = \Pr[M = m]\): the ciphertext gives the attacker *no* information about the message. That is perfect secrecy."
- Theorem 3 — "The four conditions are the proof's assumptions": drop any one and the argument fails. Table (Condition / Formal statement / What breaks without it):
  - Truly random — \(K\) uniform on \(\{0,1\}^{n}\) — "\(\Pr[K = k]\) is not \(2^{-n}\), so the posterior no longer equals the prior".
  - Same length — \(|K| = |M| = n\) bits — "A short key must repeat, and repetition is reuse".
  - Kept secret — "Only sender and receiver know \(K\)" — "The attacker can compute \(M = C \oplus K\) directly".
  - Never reused — \(K_i \neq K_j\) for \(i \neq j\) — "The key cancels out of \(C_1 \oplus C_2\)".
- Theorem 4 — "Key reuse collapses the secrecy to \(M_1 \oplus M_2\)": \(C_1 \oplus C_2 = (M_1 \oplus K) \oplus (M_2 \oplus K) = M_1 \oplus M_2\). "What remains is the XOR of two plaintexts — a classical cryptogram that falls to frequency analysis and crib dragging, because English text XORed with English text leaks letter-position structure. **Key reuse destroys perfect secrecy**, and this is the identity to quote whenever an exam question asks why the one-time pad is impractical."
- Code block "WORKED XOR — the deck's eight-bit example": M `1 0 1 1 0 0 1 0`; K `0 1 0 1 1 0 0 1`; C `1 1 1 0 1 0 1 1`; CHECK: C ⊕ K = `1 1 1 0 1 0 1 1` ⊕ `0 1 0 1 1 0 0 1` = `1 0 1 1 0 0 1 0` = M ✓. Then "KEY LENGTH = MESSAGE LENGTH: a 1 GB message needs a fresh 1 GB key."
- Quick check: attacker computes \(C_1 \oplus C_2\) on two 8-bit messages under the same pad and sees readable English fragments — "The XOR of the two plaintexts, \(M_1 \oplus M_2\) — the key cancels out of the difference". Distractors rejected: "The key is present in both ciphertexts, so XORing them cancels it — the attacker learns nothing about K and does not need it" and "Perfect secrecy fails at the moment of reuse, not gradually. A single reuse already yields M₁ ⊕ M₂".

#### `#sec-m-modular` — "Modular Arithmetic and Search Spaces" (`id="sec-m-modular"`)
- Lead frames the week split: "Symmetric ciphers hide the message with the key. Public-key cryptography, which arrives in Week 5, hides the *key* behind a hard mathematical problem instead — and that problem is stated in modular arithmetic. The deck plants the seed with Diffie–Hellman's one-way gap, so it belongs on this page as a preview."
- Notation definition box, verbatim: "\(a \bmod n\) is the remainder of \(a\) on division by \(n\), always in \(\{0, 1, \dots, n-1\}\). The set of remainders is written \(\mathbb{Z}_n\). Two integers are **congruent** modulo \(n\), written \(a \equiv b \pmod{n}\), when \(n\) divides \(a - b\)."
- Modular exponentiation box: Diffie–Hellman works in \(\mathbb{Z}_p^{*}\) for a large prime \(p\) and a generator \(g\); each side picks a private exponent and publishes \(y = g^{x} \bmod p\). "**Easy forward.** Given \(g\), \(p\) and \(x\), computing \(y\) costs about \(\log_2 x\) modular squarings and multiplications by repeated squaring — a few hundred operations for a 256-bit exponent, not \(2^{256}\)." "**Hard backward.** Given \(g\), \(p\) and \(y\), recovering \(x\) is the discrete-logarithm problem, for which no efficient classical method is known for suitable large parameters. Publishing \(y\) therefore does not reveal \(x\), and this one-way gap is what makes key agreement possible."
- Insight box: "Week 4 needs only the *shape* of the argument: a published public value plus a hidden private value. The full construction, the man-in-the-middle substitution attack and the countermeasure — binding the public values to a verified identity — are Week 5."
- Search-space box: "The size of the key space grows exponentially in the key length, which is why adding bits to a key is so much more effective than lengthening a password": \(|\{0,1\}^{n}| = 2^{n}\). "The deck's comparison of a 4-bit key with a 128-bit key is a comparison of \(2^{4} = 16\) with \(2^{128} \approx 3.4 \times 10^{38}\)." Mental-arithmetic rules: \(2^{n+1} = 2 \cdot 2^{n}\) and \(2^{10} \approx 10^{3}\). Consequences quoted verbatim: "each extra key bit doubles the work for a brute-force attacker, and every ten bits multiplies it by roughly a thousand. A 56-bit key (DES) is \(2^{56} \approx 7.2 \times 10^{16}\) candidates; a 112-bit effective key (3DES) is \(2^{112} \approx 5.2 \times 10^{33}\) — about \(2^{56}\) times larger."
- Symbol grid (Symbol / Reads as / Meaning in Week 4): \(M\) "message" — "The plaintext, in bits or in 128-bit blocks"; \(C\) "ciphertext" — "The output of encryption; safe to publish"; \(K\) "key" — "The shared secret; the only thing Kerckhoffs's principle protects"; \(\mathrm{Enc}(K, M)\) "encryption" — "The public algorithm applied under K; \(\mathrm{Dec}(K, C) = M\)"; \(\oplus\) "XOR" — "Bitwise addition without carry; its own inverse"; \(n\) "key length in bits" — "Sets the maximum search space \(2^{n}\)"; \(H(m)\) "hash" — "Fixed-length digest of an arbitrary-length message"; \(N\) "nonce" — "Public, unique per encryption under one AEAD key; never secret, never repeated"; \(T\) "authentication tag" — "The AEAD output that must verify before plaintext is released"; \(\mathbb{Z}_{p}^{*}\) "multiplicative group mod p" — "Where Diffie–Hellman computes \(g^{x} \bmod p\)"; \(g^{ab} \bmod p\) "shared secret" — "Both sides reach the same value from different exponents".
- Quick check: upgrade from a 64-bit to a 72-bit session key — "By a factor of \(2^{8} = 256\)". Rejected distractors: "That is the additive view, and it is the classic error. Search space is 2^n, not n" and "The exponential identity works in your favour here."

#### `#sec-m-keysize` — "Key Length, Entropy and Security Levels" (`id="sec-m-keysize"`)
- Lead: "Two numbers are constantly confused. Key *length* is how many bits the field occupies; *entropy* is how many bits an attacker actually has to guess. Only the second one measures strength."
- Theorem 1 — entropy bounds effective work: "Let \(H\) be the Shannon entropy of the key-generation process, in bits, and \(n\) the number of bits in the key field. Then \(W \le 2^{H} \le 2^{n}\)." "A perfectly uniform \(n\)-bit key has \(H = n\) and the two bounds meet." Worked example: "the deck's `INFO5995-INFO5995!` occupies 18 characters but is generated by a guessable rule, so if only about 16 bits vary, \(W \le 2^{16} = 65{,}536\) — even inside a 128-bit field. **LONG ≠ STRONG.**"
- Theorem 2 — passphrase entropy estimate: "For a phrase drawn from a known structure, entropy is (number of free choices) × (bits per choice). Approximating a common English word as one of about \(2^{11}\) plausible words and a random digit as \(2^{3.3}\)": \(H \approx 11 \cdot w + 3.3 \cdot d + 5 \cdot s\), "where \(w\) is the number of independently chosen words, \(d\) the number of random digits and \(s\) the number of random symbols. Three well-chosen words and two symbols gives \(33 + 10 \approx 43\) bits — respectable for a password, hopeless for a cipher key. Cipher keys are generated, never composed: use the operating system CSPRNG."
- Theorem 3 — "Key sizes are not comparable across families": "'Bigger is stronger' only holds within one family. A 256-bit RSA modulus is trivially factorable; a 256-bit AES key is not attackable. The comparison is made at a stated **security level** — the classical work factor of the best known attack — not at the bit length of the key." Table (Security level / Symmetric / Hash digest (collision) / RSA / DH modulus):
  - \(\approx 2^{80}\) — — — — 1024-bit — historical only.
  - \(\approx 2^{112}\) — 3DES (2-key) — — — 2048-bit — minimum in current guidance.
  - \(\approx 2^{128}\) — AES-128 — SHA-256 (birthday gives \(2^{128}\)) — 3072-bit.
  - \(\approx 2^{192}\) — AES-192 — SHA-384 — 7680-bit.
  - \(\approx 2^{256}\) — AES-256 — SHA-512 — 15360-bit.
  Caveat quoted: "Read the table as an engineering aid, not as lecture content: the deck's own worked numbers are \(2^{4} = 16\) and \(2^{128}\), and its point is that a 128-bit symmetric key and a 3072-bit RSA key sit at the same security level. Quote the levels, not the raw lengths, when you compare families."
- Theorem 4 — lifecycle as a coverage checklist: five stages written "as a product of indicators, each of which must be 1 for the key to survive": \(S_{\text{key}} = G \cdot St \cdot U \cdot R \cdot D\). "Generate with a CSPRNG, store in a keystore or HSM, use with least exposure, rotate or revoke on policy and on suspicion, destroy every active and backup copy. A zero anywhere makes the product zero… a perfectly generated key that is written to a log has no security at all."
- Quick check 1: `AES-256 key = SHA-256("correct horse battery staple")` — "It is much weaker than 256-bit AES should be, because the entropy of the input phrase is far below 256 bits." Distractors rejected: "SHA-256 is not broken and its digest really is 256 bits wide. The problem is the entropy of the input"; "Length is not entropy."
- Quick check 2: (A) AES-128-GCM with a fresh nonce per message vs (B) AES-256-ECB with a fixed nonce — "Proposal A: AES-128 already reaches the 128-bit security level, while ECB leaks patterns and adds no integrity, and a fixed nonce breaks the AEAD requirement." Rejected: "This is the 'bigger numbers win' error"; "Nonce secrecy is not the requirement. A nonce is public; the requirement is that it never repeats under the same AEAD key."
- This section carries the `ix-birthday` interactive (a widget hook placed between theorem 2 and theorem 3).

#### `#sec-m-aes` — "The AES Round as a Diffusion Argument" (`id="sec-m-aes"`)
- Lead: "AES's rounds are not decoration. Each step exists to defeat one specific kind of attack, and the arithmetic of the round tells you which."
- State/S-box/round key box: "The 128-bit block is arranged as a 4×4 matrix of bytes, \(s_{r,c}\) for row \(r\) and column \(c\), filled column by column." Order: \(\text{SubBytes} \to \text{ShiftRows} \to \text{MixColumns} \to \text{AddRoundKey}\).
  - "**SubBytes** replaces each byte with its entry in a fixed 16×16 S-box. Formally it is the affine transformation of the multiplicative inverse in \(\mathrm{GF}(2^{8})\), which is where the non-linearity comes from: without a non-linear step the whole cipher would be a system of linear equations over bits and would fall to linear algebra."
  - "**ShiftRows** rotates row \(r\) left by \(r\) bytes, so row 0 is unchanged and row 3 moves by three."
  - "**MixColumns** multiplies each column by a fixed polynomial modulo \(x^{4}+1\) over \(\mathrm{GF}(2^{8})\)."
  - "**AddRoundKey** XORs the state with the round key from the key schedule — the only key-dependent step."
- Why order matters (Step / Goal served / Effect on the state / Attack it defeats):
  - SubBytes — Confusion — "Non-linear per-byte substitution" — "Linear and differential cryptanalysis over the byte structure".
  - ShiftRows — Diffusion — "Moves bytes between columns without changing them" — "Attacks that treat each column as an independent 32-bit cipher".
  - MixColumns — Diffusion — "One byte in a column changes all four bytes of that column" — "Keeping a plaintext difference confined to a single byte".
  - AddRoundKey — Key injection — "XOR with a round key; no non-linearity" — "Recovering the key from plaintext–ciphertext pairs without the schedule".
- Round-count rationale quoted: "ShiftRows alone spreads a byte across columns; MixColumns alone spreads it within a column. Applied together over several rounds, a change in *one* input bit reaches *every* byte of the state. That is the diffusion argument, and it is why the round count is 10 for AES-128, 12 for AES-192 and 14 for AES-256: longer keys need more rounds to keep the same margin against the best known attacks."
- Avalanche measurement: "Encrypt two plaintexts that differ in exactly one bit under the same key and count the differing output bits": \(D = \frac{1}{128}\sum_{i=1}^{128} [\, C_i \neq C'_i \,]\). "A well-designed cipher drives the expected value of \(D\) towards \(\tfrac{1}{2}\). Measured over many random input pairs, AES's result is statistically indistinguishable from that figure… The same property, applied to a hash function, is what makes a digest detect a single altered bit."
- Code block "THE FOUR STEPS ON A 4 × 4 STATE (rows = words of the state)": SUB-BYTES "every byte replaced by S[byte] — non-linear"; SHIFT-ROWS "row 0 → 0, row 1 → 1, row 2 → 2, row 3 → 3 — diffuse"; MIX-COLUMNS "each column × fixed polynomial in GF(2^8) — diffuse"; ADD-ROUND-KEY "state ⊕ round key — key only"; "ROUND COUNT 10 (AES-128) | 12 (AES-192) | 14 (AES-256)"; "FINAL ROUND omits MixColumns".
- Pipeline widget `ix-m-aes-pipe`, "One full AES encryption, end to end" — "The key schedule runs once; the round function runs once per round": (1) "Key schedule — Expand the 128-bit key into **11 round keys** using the S-box and round constants."; (2) "Initial AddRoundKey — XOR the plaintext state with round key 0 — the whitening step before round 1."; (3) "Rounds 1 to 9 — SubBytes → ShiftRows → MixColumns → AddRoundKey, each under its own round key."; (4) "Round 10 (final) — The same sequence without MixColumns; the last round needs no further diffusion."; (5) "Ciphertext block — 128 bits out. The mode of operation then decides how this block relates to the rest of the message."
- Worked solution `sol-m1` answers "Explain why AES uses both ShiftRows and MixColumns, when MixColumns already changes four bytes for every one that changes": (1) MixColumns spreads one changed byte across the four bytes "of its own column" only; ShiftRows moves bytes "between columns" but does not change any byte value on its own. (2) "With MixColumns and no ShiftRows, a difference that starts in one column stays in that column forever: the state decomposes into four independent 32-bit ciphers… With ShiftRows and no MixColumns, a changed byte moves around but never multiplies, so the number of active bytes grows far too slowly to defeat differential cryptanalysis in 10 rounds." (3) Combined, "Two rounds are enough for a single-byte difference to reach every byte of the state". (4) Pay-off: full diffusion is what makes avalanche come out near one half and why the round count is "fixed at 10, 12 or 14 rather than chosen per message. The argument is structural: it does not depend on the key."

#### `#sec-m-hash` — "Hash Properties and the Birthday Bound" (`id="sec-m-hash"`)
- Lead: "Hash functions are the one primitive this week whose security margin is *half* what its output size suggests. The reason is a counting argument, and it decides which digests are still acceptable."
- Theorem 1 — three properties, three work factors: "For a hash function with an \(n\)-bit output": \(\text{preimage: } 2^{n} \qquad \text{second preimage: } 2^{n} \qquad \text{collision: } 2^{n/2}\). "**Preimage resistance** — given a digest, find a message mapping to it. The only known generic method is brute force, so the cost is about \(2^{n}\). **Second preimage resistance** — given one message, find a different one with the same digest — also \(2^{n}\). **Collision resistance** — find *any* two messages with the same digest — is the odd one out, and the birthday bound is why."
- Theorem 2 — the birthday bound: "Generate \(q\) digests at random from a space of \(N = 2^{n}\) values. The probability that at least two of them match is, to a very good approximation, \(P(\text{collision}) \approx 1 - e^{-q(q-1)/(2N)} \approx 1 - e^{-q^{2}/(2N)}\)." "Setting the exponent to about 1 gives the collision threshold: \(q \approx \sqrt{2N} = \sqrt{2 \cdot 2^{n}} \approx 2^{n/2}\)." Consequences: "a collision becomes likely after only about \(2^{n/2}\) messages — not \(2^{n}\). For SHA-256 with \(n = 256\), that is \(2^{128}\) work, which is still out of reach and equal to the AES-128 security level. For MD5 with \(n = 128\), it is \(2^{64}\): achievable on ordinary hardware, and the reason MD5 is unusable for any security purpose. For SHA-1 with \(n = 160\), the bound is \(2^{80}\), and practical collisions have been demonstrated — which is why SHA-1 is deprecated rather than merely discouraged."
- Race widget `ix-m-hash-race`, "Collision work factor by digest size" (max 128, illustrative): MD5 (128-bit) = 64, "2^64 — broken in practice"; SHA-1 (160-bit) = 80, "2^80 — collisions demonstrated"; SHA-256 (256-bit) = 128, "2^128 — out of reach"; SHA-512 (512-bit) = 256, "2^256 — far out of reach"; "AES-128 key search (for comparison)" = 128, "2^128 — the 128-bit level".
- Theorem 3 — "Why a digest length must be twice the intended security level": "If a system needs a 128-bit security level from a hash — to match AES-128, say — then it needs a digest whose birthday bound is \(2^{128}\), which means \(n/2 = 128\), which means \(n = 256\) bits. A 128-bit digest can never deliver 128-bit collision resistance, no matter how good the hash function is, because the counting argument applies to any function with a 128-bit output." "This is why the modern default is SHA-256 or larger, and why a design that says 'we hash with MD5 for speed and the output is 128 bits' is off by \(2^{64}\)."
- Theorem 4 — "What the properties do *not* give you": "None of the three properties is integrity against an active attacker. Formally, a hash is unkeyed: anyone can compute \(H(m')\) for a modified message \(m'\). Given a message–digest pair \((m, H(m))\) from an untrusted channel, an attacker who can modify the message simply supplies \((m', H(m'))\)." Keyed alternatives: \(\text{MAC: } \mathrm{tag} = F(K, m)\) and \(\text{signature: } \sigma = \mathrm{Sign}(sk, H(m))\). "In both cases the attacker lacks the key. The hash inside a signature is there to compress an arbitrary-length message to a fixed size that the signature scheme can handle — not to provide the security. In an AEAD construction the tag \(T\) does the same job for a ciphertext. This is precisely the deck's asterisk on the word 'hash' in the goal table, and it is the most commonly examined distinction of the week."
- Worked solution `sol-m2` — "A system needs to protect 1 GB backups, verify firmware images and sign invoices, all at a 128-bit security level. Choose the primitives and justify the sizes.": (1) Backups — "A symmetric AEAD at the 128-bit level: AES-128-GCM. Key length 128 bits gives a search space of \(2^{128}\)… The nonce must be unique per encryption under the key: reuse breaks GCM's confidentiality and authentication together." (2) Firmware — "A hash alone is not enough: the attacker who replaces the image replaces the published digest too. Use a digital signature, or a MAC when the device already shares a secret with the publisher. The digest inside the signature should be SHA-256, because the signature's collision resistance is limited by the hash's birthday bound \(2^{n/2} = 2^{128}\)." (3) Invoices — non-repudiation: "A MAC cannot give it, because both parties hold the same key and either could have produced the tag. Only a signature with a private key held by one owner can. At the 128-bit level the recommended key size is RSA-3072 (or an equivalent elliptic-curve key, which is far shorter for the same level), with SHA-256 as the digest." (4) "State the levels, not the lengths": "'All three sit at the 128-bit security level: AES-128 for the bulk data, SHA-256 as the digest, and RSA-3072 or an equivalent elliptic-curve key for the signature — because key sizes are only comparable within a family, and a hash's collision resistance is capped at half its digest length.'"
- Quick check: SHA-1 to fingerprint a 1 GB release with the argument "the attacker would need \(2^{160}\) work" — "Collision resistance costs about \(2^{80}\), not \(2^{160}\), because of the birthday bound — and SHA-1 collisions have been demonstrated in practice". Distractors rejected: "SHA-1's digest really is 160 bits. The problem is which property that 160 bits buys"; "This reverses the requirement. Larger digests increase the cost of finding a collision."

#### `#sec-m-checklist` — "Construct-Selection Checklist" (`id="sec-m-checklist"`)
- Lead: "Most Week 4 exam questions reduce to 'is this construction fit for the stated goal?'. Run the six steps in order and the justification writes itself."
- Sequence widget `ix-m-checklist-seq`, "Order the construct-selection checklist": (1) "Name the security goal: confidentiality, integrity, authentication, non-repudiation or key establishment"; (2) "Name the attacker's capability: passive observer, active modifier, or holder of a compromised key"; (3) "Choose the primitive family that can deliver that goal against that attacker"; (4) "Choose the complete construction: cipher, mode, nonce or IV strategy and authentication mechanism"; (5) "Check the key: length, generation source, entropy and custody"; (6) "Check the lifecycle: storage, least exposure, rotation, revocation and destruction".
- Marks table (Step / Look for / Marks are lost when…): 1. Goal — "One of the five goals from the deck's table" — "You answer 'which algorithm is strongest?' instead"; 2. Attacker — "Passive, active, or in possession of the key" — "You claim a bare hash gives integrity against an active attacker"; 3. Primitive family — "Symmetric for bulk, asymmetric for trust, hybrid for a protocol" — "You propose public-key encryption for bulk data"; 4. Construction — "Cipher + mode + nonce strategy + authentication" — "You name AES and stop, without saying which mode"; 5. Key — "\(2^{n}\) search space and \(H\) bits of real entropy" — "You equate key length with entropy"; 6. Lifecycle — "Five stages, each with an owner" — "You say 'the key is stored securely' and stop there".
- Mode matcher `ix-m-mode-matcher`, "Match the construction to what it guarantees": "AES in ECB mode" → "Confidentiality only, and repeated plaintext blocks remain visible"; "AES in CBC mode" → "Confidentiality that hides repeated patterns, with authentication still to be designed"; "AES in GCM mode" → "Confidentiality and integrity in one pass, verified by an authentication tag"; "SHA-256 digest alone" → "A fingerprint that detects accidental corruption, not an active attacker"; "HMAC-SHA-256" → "Integrity and origin for parties who already share a key"; "RSA-PSS signature" → "Integrity, origin and non-repudiation through a private key".
- Self-test deck `ix-m-self-test`, "Self-test: say the number before you flip" (7 cards): "AES block size" → "128 bits — 16 bytes. Every mode of operation works in units of this block (or of the counter block for GCM)."; "AES round count" → "10 rounds for a 128-bit key, 12 for 192 bits and 14 for 256 bits; the final round omits MixColumns."; "Search space of an n-bit key" → "2^n candidates — but only if every string can really occur, so the effective work is bounded by 2^H where H is the entropy."; "Collision work for an n-bit digest" → "About 2^(n/2) by the birthday bound, which is why a digest must be twice as long as the security level it must support."; "Key reuse identity" → "C1 ⊕ C2 = (M1 ⊕ K) ⊕ (M2 ⊕ K) = M1 ⊕ M2 — the key cancels and the attacker holds the XOR of two plaintexts."; "Modern AEAD defaults" → "AES-GCM where AES is hardware accelerated, ChaCha20-Poly1305 where strong software performance is needed. Both return ciphertext plus a tag."; "The deck's closing formula" → "Strong cryptography = strong primitive + unpredictable key + disciplined lifecycle. A zero in any term makes the whole product zero."
- Worked solution `sol-m3` reviews: "we encrypt user documents with AES-256 in CBC mode using a fixed IV, hash each document with MD5 to prove it has not been changed, and store the key in the database next to the data." Seven steps: (1) Goal — two goals (confidentiality + proof of no change), "so one primitive will not cover both". (2) Attacker — "Documents live in a database alongside their keys, so the relevant attacker is someone who reaches the database — an active attacker with the ciphertext and the key. That is the strongest realistic case here, and it defeats both choices." (3) Primitive family — symmetric is correct for bulk document data. (4) Construction — "Two faults. A fixed IV in CBC means the first block of every document encrypts identically, so two documents with the same opening reveal that fact. And MD5 is collision-broken: at \(n = 128\) the birthday bound is \(2^{64}\), and practical collisions exist, so it cannot support a claim of integrity. In any case an unkeyed hash cannot prove integrity against an attacker who can also edit the stored hash. *Replace with* AES-GCM (or ChaCha20-Poly1305) under a unique per-document nonce." (5) Key — "AES-256 gives a \(2^{256}\) search space, which is more than enough — but it is the wrong thing to worry about, because the key is stored in the same database as the ciphertext. No key length survives that." (6) Lifecycle — "Storage fails stage 2 and stage 3 of the five-stage lifecycle. *Replace with* envelope encryption: a per-document data key wrapped by a key-encryption key held in a keystore or HSM, with access restricted, key material never logged, and a rotation plan that re-wraps the data keys rather than re-encrypting every document." (7) Verdict: "'The primitive is fine and everything around it is wrong: a fixed IV leaks equality of first blocks, MD5 cannot support an integrity claim at \(2^{64}\) collision work and is unkeyed anyway, and a key stored beside its own ciphertext has no protection regardless of its length. Move to AES-GCM with a unique nonce per document and put the key in a keystore under envelope encryption.'"
- Closing callout: "the study guide carries the guarantees table, the AES round picture and the key lifecycle; this page carries the arithmetic behind them. Finish with the Quiz Hub and the Flashcards, then preview Week 5 — Diffie–Hellman, RSA, signatures and PKI, which is where the key-distribution question left open at the end of this page is finally answered."

---

## 2. FORMULAS AND NUMERIC DRILLS

### 2.1 XOR algebra (`chapter4-math.html#sec-m-xor`, `chapter4-study.html#sec-otp`)
- Identity: `x ⊕ x = 0`, `x ⊕ 0 = x`. XOR "returns 1 exactly when its two inputs differ". Also described in the symbol grid as "Bitwise addition without carry; its own inverse".
- Encryption/decryption identity: `C = M ⊕ K` and `C ⊕ K = (M ⊕ K) ⊕ K = M` — "encryption and decryption are the *same* operation applied with the same key".
- **Worked drill (the deck's own numbers, verified):** M = 1011 0010 (0xB2, 178); K = 0101 1001 (0x59, 89).
  - C = M ⊕ K = 1110 1011 (0xEB, 235).
  - Decrypt check: C ⊕ K = 1110 1011 ⊕ 0101 1001 = 1011 0010 = M ✓.
  - Bit-by-bit: b7 1⊕0=1; b6 0⊕1=1; b5 1⊕0=1; b4 1⊕1=0; b3 0⊕1=1; b2 0⊕0=0; b1 1⊕0=1; b0 0⊕1=1 → 11101011.
- Key-length rule: "KEY LENGTH = MESSAGE LENGTH: a 1 GB message needs a fresh 1 GB key." Also "One key bit for every message bit."

### 2.2 Perfect secrecy and key reuse (`chapter4-math.html#sec-m-xor`, `chapter4-study.html#sec-otp`)
- Exactly one key maps a candidate message to a fixed ciphertext: `k = m ⊕ c`.
- Uniform-key probability: `Pr[C = c | M = m] = Pr[K = m ⊕ c] = 2^{-n}`, independent of `m`.
- Bayes consequence: `Pr[M = m | C = c] = Pr[M = m]` — "the ciphertext gives the attacker *no* information about the message".
- Reuse identity, quoted in both pages: `C₁ ⊕ C₂ = (M₁ ⊕ K) ⊕ (M₂ ⊕ K) = M₁ ⊕ M₂`. "The key has vanished."
- Four conditions and the formal statement each protects: `K` uniform on `{0,1}^n`; `|K| = |M| = n` bits; only sender and receiver know `K`; `K_i ≠ K_j` for `i ≠ j`.

### 2.3 Modular arithmetic (`chapter4-math.html#sec-m-modular`)
- `a mod n` is "the remainder of a on division by n, always in {0, 1, …, n−1}"; the remainder set is `Z_n`; `a ≡ b (mod n)` exactly "when n divides a − b".
- Modular exponentiation and the one-way gap: `y = g^x mod p`, computed in `Z_p*` for a large prime `p` and generator `g`.
  - Forward cost: "about log₂ x modular squarings and multiplications by repeated squaring — a few hundred operations for a 256-bit exponent, not 2^256." (log₂ 2^256 = 256, i.e. ≈256 squarings plus up to 256 multiplications → a few hundred operations.)
  - Backward: the discrete-logarithm problem; "no efficient classical method is known for suitable large parameters".
- Shared-secret symbol: `g^{ab} mod p` — "Both sides reach the same value from different exponents".
- **Toy step-trace drill (textbook illustration, not a real key; figures recomputed):** with p = 23, g = 5, private exponents a = 6 and b = 15:
  - Alice publishes y_A = 5⁶ mod 23. Repeated squaring: 5² = 25 ≡ 2; 5⁴ ≡ 2² = 4; 5⁶ = 5⁴·5² ≡ 4·2 = **8** (≡ 100 − 4·23 = 8 ✓).
  - Bob publishes y_B = 5¹⁵ mod 23 = **19** (5¹² ≡ 18, 5¹⁵ = 5¹²·5³ ≡ 18·10 = 180 ≡ 180 − 7·23 = 19 ✓).
  - Shared secret: y_B^a = 19⁶ mod 23 = **2**; independently y_A^b = 8¹⁵ mod 23 = **2**; and g^{ab} = 5^{90} mod 23 = **2** — all three agree ✓.

### 2.4 Search spaces and key-length arithmetic (`chapter4-math.html#sec-m-modular`, `chapter4-study.html#sec-keys`)
- Search space: `|{0,1}^n| = 2^n`. Study page: "An *n*-bit key has 2^n possible bit strings — *if every string can really occur*."
- Deck's comparison: `2^4 = 16` versus `2^128 ≈ 3.4 × 10^38` (exact: 340,282,366,920,938,463,463,374,607,431,768,211,456 ≈ 3.4028 × 10^38 ✓).
- Doubling rule: `2^{n+1} = 2 · 2^n`; "each extra key bit doubles the work for a brute-force attacker".
- Thousands rule: `2^10 ≈ 10^3`; "every ten bits multiplies it by roughly a thousand".
- DES: 56-bit key → `2^56 ≈ 7.2 × 10^16` candidates (exact 72,057,594,037,927,936 ≈ 7.2058 × 10^16 ✓).
- 3DES: 112-bit effective key → `2^112 ≈ 5.2 × 10^33` candidates (exact 5,192,296,858,534,827,628,530,496,329,220,096 ≈ 5.1923 × 10^33 ✓).
- Ratio drill: `2^112 / 2^56 = 2^56 ≈ 7.2 × 10^16` — the page says the 3DES space is "about 2^56 times larger".
- **Quick-check drill (page's own):** 64-bit → 72-bit key: `2^72 / 2^64 = 2^8 = 256`. Answer: factor of 256 (equivalently 8 bits ⇒ 8 doublings ⇒ 2^8).
- **Applied wall-clock drill (arithmetic shown; rate is a stated assumption, not page data):** at 2^40 keys/second, exhausting a 2^56 key space takes `2^56 / 2^40 = 2^16 = 65,536` seconds = 65,536 / 3,600 ≈ **18.2 hours** (≈0.76 days). Halving the rate doubles the time; the page's rule "each extra key bit doubles the work" is the same fact.

### 2.5 Entropy arithmetic (`chapter4-math.html#sec-m-keysize`)
- Bound: `W ≤ 2^H ≤ 2^n`, where `H` is "the Shannon entropy of the key-generation process, in bits" and `n` is the key-field width. "A perfectly uniform n-bit key has H = n and the two bounds meet."
- Study page's worked illustration: `INFO5995-INFO5995!` (string length verified: 18 characters) with only ~16 bits of variation → `W ≤ 2^16 = 65,536` candidates "even inside a 128-bit field". **LONG ≠ STRONG.**
- Passphrase estimate: `H ≈ 11 · w + 3.3 · d + 5 · s`, from "a common English word as one of about 2^11 plausible words" (2^11 = 2,048) and "a random digit as 2^3.3" (2^3.3 ≈ 9.85 ≈ 10 digits).
  - Page's own example: 3 words + 2 symbols = `11·3 + 5·2 = 33 + 10 = 43` bits — "respectable for a password, hopeless for a cipher key".
  - **Variant drill (recomputed):** 4 words + 1 digit = `11·4 + 3.3·1 = 44 + 3.3 = 47.3 ≈ 47` bits. (For comparison, 4 words + 2 digits = 44 + 6.6 = 50.6 ≈ 51 bits.)
  - Study page's own variant: a key = `sha256("GoldenRetriever2019")` is 256 bits long but the effective search space is "the guessing space of the phrase, not the output length of the hash".

### 2.6 Security-level table (`chapter4-math.html#sec-m-keysize`)
| Security level | Symmetric | Hash digest (collision) | RSA / DH modulus |
|---|---|---|---|
| ≈ 2^80 | — | — | 1024-bit — historical only |
| ≈ 2^112 | 3DES (2-key) | — | 2048-bit — minimum in current guidance |
| ≈ 2^128 | AES-128 | SHA-256 (birthday gives 2^128) | 3072-bit |
| ≈ 2^192 | AES-192 | SHA-384 | 7680-bit |
| ≈ 2^256 | AES-256 | SHA-512 | 15360-bit |
Rule: "Quote the levels, not the raw lengths, when you compare families." Page caveat: "Read the table as an engineering aid, not as lecture content."

### 2.7 Lifecycle product (`chapter4-math.html#sec-m-keysize`, `chapter4-study.html#sec-keys`)
- `S_key = G · St · U · R · D` — Generate, Store, Use, Rotate/revoke, Destroy. "A zero anywhere makes the product zero."
- Study-page summary formula: `strong cryptography = strong primitive + unpredictable key + disciplined lifecycle`.
- Five lifecycle stages and the failure each prevents (study page): Generate — "OS CSPRNG, secure entropy source" — predictable keys; Store — "Keystore or HSM, restricted access" — leakage through config files, backups, logs; Use — "Least exposure, never log the key" — key material in logs, crash dumps, memory dumps; Rotate/revoke — "Policy plus a response plan to compromise" — one leaked key valid forever; Destroy — "Remove active and backup copies" — a retired key still decrypting old data.

### 2.8 AES numbers (`chapter4-study.html#sec-aes`, `chapter4-math.html#sec-m-aes`)
- Block size 128 bits = 16 bytes; key sizes 128 / 192 / 256 bits; round counts **10 / 12 / 14**.
- State: "a 4×4 matrix of bytes, `s_{r,c}` … filled column by column" → 4 × 4 = 16 bytes = 128 bits ✓.
- Round order: SubBytes → ShiftRows → MixColumns → AddRoundKey. ShiftRows "rotates row r left by r bytes, so row 0 is unchanged and row 3 moves by three" (rotations 0, 1, 2, 3).
- Final round omits MixColumns.
- Key schedule for AES-128: "Expand the 128-bit key into **11 round keys**".
- **Round-key/AddRoundKey counting drill (derived):** one initial AddRoundKey (with round key 0, "the whitening step before round 1") + AddRoundKey in each of rounds 1–10 (round 10 is "the same sequence without MixColumns" — AddRoundKey is retained) = **11 applications of AddRoundKey**, matching the 11 round keys for AES-128.
- Avalanche metric: `D = (1/128) Σ_{i=1..128} [C_i ≠ C'_i]`; expectation driven "towards ½"; with 128 output bits, half is 64 bits changed.
- AES-128 key search for comparison: 2^128 — "the 128-bit level".

### 2.9 Hash sizes and the birthday bound (`chapter4-study.html#sec-hash`, `chapter4-math.html#sec-m-hash`)
- Work factors for an n-bit digest: `preimage: 2^n`, `second preimage: 2^n`, `collision: 2^{n/2}`.
- Birthday approximation: `P(collision) ≈ 1 − e^{−q(q−1)/(2N)} ≈ 1 − e^{−q²/(2N)}`, with `N = 2^n`.
- Threshold: `q ≈ √(2N) = √(2·2^n) ≈ 2^{n/2}`.
- Table of collision work (recomputed n/2 for each digest):
  - MD5, n = 128 → 2^64 ≈ 1.8 × 10^19 (exact 18,446,744,073,709,551,616). "Achievable on ordinary hardware, and the reason MD5 is unusable for any security purpose."
  - SHA-1, n = 160 → 2^80 ≈ 1.2 × 10^24 (exact 1,208,925,819,614,629,174,706,176). "Practical collisions have been demonstrated."
  - SHA-256, n = 256 → 2^128 ≈ 3.4 × 10^38 — "still out of reach and equal to the AES-128 security level".
  - SHA-512, n = 512 → 2^256. "Far out of reach."
- Digest-length rule: "a digest length must be twice the intended security level" — for a 128-bit level you need `n/2 = 128`, i.e. `n = 256` bits. "A 128-bit digest can never deliver 128-bit collision resistance." The MD5-for-speed design "is off by 2^64".
- Hash algorithms and digests: MD5 = 128 bits (broken); SHA-1 = 160 bits (deprecated); SHA-256 = 256 bits (standard default, SHA-2 family); SHA-512 = 512 bits; SHA-3 = 224–512 bits (sponge construction).
- Keyed replacements: `MAC: tag = F(K, m)`; `signature: σ = Sign(sk, H(m))`. "In both cases the attacker lacks the key." The hash inside a signature "compress[es] an arbitrary-length message to a fixed size that the signature scheme can handle — not to provide the security."
- Efficiency arithmetic: "a few hundred operations for a 256-bit exponent, not 2^256" — i.e. square-and-multiply is O(log x), so the forward direction is 256-ish steps versus 2^256 ≈ 1.16 × 10^77 for exhaustive search.

---

## 3. PITFALLS

1. **Treating a bare hash as integrity is wrong because a hash is unkeyed; the page says** "an attacker who can modify the data can replace the message *and* its hash", and the deck's rule is that "integrity against an active attacker requires a MAC, a digital signature or an AEAD construction — not a hash on its own." The math page repeats it formally: "Given a message–digest pair (m, H(m)) from an untrusted channel, an attacker who can modify the message simply supplies (m', H(m'))."
2. **Saying "I used AES, so the data is safe" is wrong because a cipher name is not a construction; the page says** the missing pieces are "the mode of operation, the nonce or IV strategy, and the authentication mechanism — a cipher name alone does not define the construction", and warns that "Even AES-256 in ECB mode leaks repeated plaintext patterns."
3. **Blaming AES for ECB's leak is wrong because the fault is the mode; the page says** "It is not that AES is weak; it is that encrypting each block independently publishes any repetition in the plaintext" — the 4 MB quick check answers "The mode, not the cipher".
4. **Reading a key's length as its strength is wrong because length is not entropy; the page says** "Entropy is the attacker's uncertainty *before* the key is generated — not the number of characters the key occupies", and "If only 16 bits vary, the effective search is at most 2^16 candidates — even inside a 128-bit field. **LONG ≠ STRONG.**"
5. **Believing one-time pads are obsolete (rather than impractical) is wrong because the reuse condition, not the mathematics, is the failure; the page says** "Nothing about modern practice changes the mathematics. A key stream slice used once is a one-time pad; the difficulty is operational, not theoretical", and the hard parts are "generating enough true randomness and guaranteeing that no slice is ever reused across restarts, backups or retransmissions."
6. **Claiming a nonce must be secret is wrong because a nonce is public; the page says** the nonce is "Public, unique per encryption under one AEAD key; never secret, never repeated", and the quick check says "Nonce secrecy is not the requirement. A nonce is public; the requirement is that it never repeats under the same AEAD key."
7. **Comparing key sizes across families by bit length is wrong because "bigger is stronger" only holds within a family; the page says** "A 256-bit RSA modulus is trivially factorable; a 256-bit AES key is not attackable", and comparison must be made "at a stated security level — the classical work factor of the best known attack — not at the bit length of the key."
8. **Quoting 2^n as the collision cost of a hash is wrong because the birthday bound halves the exponent; the page says** collision "costs about 2^{n/2} work (the birthday bound)", so "A 128-bit digest can never deliver 128-bit collision resistance, no matter how good the hash function is."
9. **Expecting a MAC to give non-repudiation is wrong because both parties hold the same key; the page says** "a MAC cannot, because both parties hold the same key and either could have produced the tag" — only "a digital signature over a hash of the document, bound to an identity through a certificate" does.
10. **Applying Kerckhoffs's principle as "publish everything, keys included" is wrong because the key is the one secret; the page says** "It does not say keys may be public. The key is the one secret, and it must stay secret. It does not say implementations may leak. Padding oracles and timing leaks attack the key, not the published design."
11. **Using a fixed IV or a restarting counter is wrong because GCM requires uniqueness under the key; the page says** "GCM requires a unique nonce per encryption under the same key… must therefore guarantee that the nonce is generated fresh — not derived from a filename or a counter that restarts", and on the math page "reuse breaks GCM's confidentiality and authentication together." In CBC, "A fixed IV in CBC means the first block of every document encrypts identically."
12. **Answering "which algorithm is strongest?" is wrong because the goal comes first; the page says** "Name the goal first (confidentiality, integrity, non-repudiation), then the attacker's capability, then the primitive, then the key model and lifecycle. Choosing 'the strongest algorithm' before naming the goal is the mistake the deck warns about", and marks are lost when "You name AES and stop, without saying which mode" or "You say 'the key is stored securely' and stop there."
13. **Assuming a long key survives storage beside its ciphertext is wrong because lifecycle failure zeroes the product; the page says** "No key length survives that, and the effective entropy of the key is irrelevant once the attacker simply reads it", and "A zero anywhere makes the product zero."

(13 items listed; the required 8–12 are the strongest twelve — items 1–12 — with item 13 as a supporting variant of 12.)

---

## 4. TESTABLE CLAIMS (each tagged with its anchor)

1. Cryptography is defined as "a set of mathematical techniques that protect information and communication even when the network or the system cannot be fully trusted — and each technique delivers one specific guarantee under one defined threat model." — `chapter4-study.html#sec-goals`
2. The five security goals are confidentiality, integrity, authentication, non-repudiation and key establishment, with primary tools encryption/AEAD, hash\*/MAC/AEAD/signature, MAC/signature/certificate binding, digital signature + identity and audit context, and Diffie–Hellman/KEM respectively. — `chapter4-study.html#sec-goals`
3. A bare hash is "only a fingerprint" because an attacker who can modify the data can replace the message and its hash; integrity against an active attacker needs a MAC, a signature or an AEAD. — `chapter4-study.html#sec-goals`
4. Kerckhoffs's principle: "The security of a system should depend on its **key**, not on its design remaining obscure", framed by the Dutch 19th-century cryptographer Auguste Kerckhoffs as "the enemy knows the system". — `chapter4-study.html#sec-kerckhoffs`
5. Symmetric encryption uses "a single shared secret key" driving both directions, `C = Enc(K, M)` and `M = Dec(K, C)`; if K is exposed, anyone holding K can decrypt, with no second factor and no recovery. — `chapter4-study.html#sec-symmetric`
6. The one-time pad needs four conditions — truly random, same length as the message, kept secret, never reused — and when all four hold "the ciphertext reveals nothing about the plaintext. Not 'very little' — nothing." — `chapter4-study.html#sec-otp`
7. Key reuse in a one-time pad gives `C₁ ⊕ C₂ = M₁ ⊕ M₂` — the key cancels out — which is why reuse destroys perfect secrecy and why the never-reuse rule survives as nonce discipline. — `chapter4-study.html#sec-otp`
8. A stream cipher XORs data with a keystream (`C = M ⊕ keystream`, modern example ChaCha20); a block cipher transforms fixed-size blocks and AES uses 128-bit blocks, so "a block cipher alone handles exactly one block. Everything longer is the mode's job." — `chapter4-study.html#sec-ciphers`
9. AES is a symmetric block cipher with a 128-bit block and 128/192/256-bit keys, with 10/12/14 rounds respectively, standardised as FIPS 197 and hardware accelerated. — `chapter4-study.html#sec-aes`
10. Of AES's four round steps, AddRoundKey is "the only step that involves the secret"; SubBytes supplies non-linearity through a fixed public 16×16 S-box, ShiftRows rotates row r left by r bytes, MixColumns multiplies each column by a fixed polynomial over GF(2^8), and the final round omits MixColumns. — `chapter4-study.html#sec-aes`
11. ECB encrypts each block independently so "Repeated plaintext → repeated ciphertext" and patterns remain visible; CBC chains blocks so repeated plaintext gives different ciphertext but provides "Confidentiality only; authentication is separate"; GCM is "Counter-based encryption plus an authentication tag" and detects tampering. — `chapter4-study.html#sec-modes`
12. AES-GCM takes a key K, a unique nonce N and plaintext M and returns `(C, T) = Enc(K, N, M)`; if C or T changes, verification fails and the plaintext is rejected. — `chapter4-study.html#sec-modes`
13. Modern defaults are AES-GCM and ChaCha20-Poly1305; AES-CBC is legacy needing separate authentication; DES, 3DES and RC4 are "obsolete or prohibited in modern designs"; asymmetric examples are X25519, RSA-OAEP, RSA-PSS and EdDSA; hybrid examples are TLS and envelope encryption. — `chapter4-study.html#sec-construct`
14. The four ways strong primitives fail in weak systems are nonce reuse, no authentication, weak key lifecycle and unsafe composition. — `chapter4-study.html#sec-construct`
15. An n-bit key has `2^n` possible bit strings "if every string can really occur": `2^4 = 16` and `2^128 ≈ 3.4 × 10^38`, and "length helps only when generation and implementation preserve the full search space." — `chapter4-study.html#sec-keys`
16. The five-stage key lifecycle is Generate (OS CSPRNG), Store (keystore or HSM), Use (least exposure, never log), Rotate/revoke (policy plus compromise response) and Destroy (remove active and backup copies). — `chapter4-study.html#sec-keys`
17. A cryptographic hash is `h = H(m)`, "one-way (preimage resistant), collision resistant and produces a different digest for even a one-bit change in the input (the avalanche effect)"; preimage and second preimage cost about 2^n while collisions cost about 2^{n/2}. — `chapter4-study.html#sec-hash`
18. MD5 (128-bit) is broken with practical collisions and "unsuitable for any security purpose"; SHA-1 (160-bit) is deprecated with demonstrated collisions; SHA-256 (256-bit) is the standard default of the SHA-2 family; SHA-3 (224–512 bits) uses a sponge construction. — `chapter4-study.html#sec-hash`
19. Modular notation: `a mod n` is "the remainder of a on division by n, always in {0, 1, …, n−1}"; the remainder set is `Z_n`; `a ≡ b (mod n)` when "n divides a − b". — `chapter4-math.html#sec-m-modular`
20. Diffie–Hellman publishes `y = g^x mod p`; forward computation costs "about log₂ x modular squarings and multiplications … a few hundred operations for a 256-bit exponent, not 2^256", while recovering x is the discrete-logarithm problem with no known efficient classical method. — `chapter4-math.html#sec-m-modular`
21. Search space grows exponentially: `2^{n+1} = 2 · 2^n` and `2^10 ≈ 10^3`, so each extra key bit doubles brute-force work and every ten bits multiplies it by roughly a thousand; DES 2^56 ≈ 7.2 × 10^16 and 3DES 2^112 ≈ 5.2 × 10^33, about 2^56 times larger. — `chapter4-math.html#sec-m-modular`
22. Effective work is bounded by entropy: `W ≤ 2^H ≤ 2^n`; a passphrase built from a guessable rule can leave only ~16 bits varying, so `W ≤ 2^16 = 65,536` even in a 128-bit field, and the estimate `H ≈ 11w + 3.3d + 5s` gives 3 words + 2 symbols ≈ 43 bits. — `chapter4-math.html#sec-m-keysize`
23. Key sizes are comparable only at a stated security level: AES-128, SHA-256 (collision) and a 3072-bit RSA/DH modulus all sit at ≈2^128, whereas AES-256, SHA-512 and 15360-bit RSA sit at ≈2^256. — `chapter4-math.html#sec-m-keysize`
24. The birthday bound makes collision work about `2^{n/2}`: MD5 2^64, SHA-1 2^80 (collisions demonstrated), SHA-256 2^128; therefore a digest must be twice as long as the intended security level. — `chapter4-math.html#sec-m-hash`
25. The construct-selection checklist order is: name the security goal → name the attacker's capability → choose the primitive family → choose the complete construction → check the key (length, generation source, entropy, custody) → check the lifecycle. — `chapter4-math.html#sec-m-checklist`

---

## 5. ANCHOR INDEX

Every `id="…"` in both files, in file order.

```
chapter4-study.html#sidebar - page navigation sidebar (nav id="sidebar")
chapter4-study.html#sidebarToggle - mobile sidebar toggle button
chapter4-study.html#mainContent - main content wrapper (main id="mainContent")
chapter4-study.html#hero - Week 4 hero: title, four slogan cards, topic chips
chapter4-study.html#sec-goals - What Cryptography Actually Guarantees (five-goal table, hash asterisk)
chapter4-study.html#ix-goal-matcher - interactive matcher: goal → tool
chapter4-study.html#ix-guarantee-map - interactive race chart: primitive → property coverage (illustrative)
chapter4-study.html#sec-kerckhoffs - Kerckhoffs's Principle: Public Algorithm, Secret Key
chapter4-study.html#sec-symmetric - Symmetric Encryption: One Shared Secret
chapter4-study.html#ix-sym-pipeline - interactive pipeline: plaintext → Enc(K,M) → C → Dec(K,C) → plaintext
chapter4-study.html#sec-otp - The One-Time Pad: Perfect Secrecy, and Why It Stays in the Textbook
chapter4-study.html#ix-otp - interactive widget: one-time pad
chapter4-study.html#sol-1 - worked solution: from the ideal (OTP) to the deployable cipher
chapter4-study.html#sec-ciphers - Stream Ciphers and Block Ciphers
chapter4-study.html#ix-stream-vs-block - interactive widget: stream vs block comparison
chapter4-study.html#sec-aes - Inside AES: A Public, Repeatable Round Function
chapter4-study.html#ix-aes-round - interactive widget: the AES round
chapter4-study.html#sec-modes - Modes of Operation: The Same AES Reveals Different Things
chapter4-study.html#ix-modes - interactive widget: modes of operation
chapter4-study.html#ix-modes-deck - flashcard deck: six mode facts (ECB/CBC/GCM, AES-GCM inputs, tag failure)
chapter4-study.html#sec-construct - Choose Complete Constructions, Not Algorithm Names
chapter4-study.html#ix-failure-matcher - interactive matcher: failure → fix
chapter4-study.html#sol-2 - worked solution: reviewing a file-encryption design (ECB, config-file key, one key for all)
chapter4-study.html#sec-keys - What Makes a Key Strong: Length, Entropy, Lifecycle
chapter4-study.html#ix-key-space - interactive widget: key space and search space
chapter4-study.html#sec-hash - Cryptographic Hash Functions: A Fixed-Length Fingerprint
chapter4-study.html#ix-hash - interactive widget: hash properties
chapter4-study.html#sol-3 - worked solution: choosing primitives for backup, firmware and signed invoice
chapter4-study.html#sec-recap - Week 4 Recap (toolkit cards, flow grid, three ideas, Week 5 preview)
chapter4-math.html#mainContent - math page content wrapper (div id="mainContent")
chapter4-math.html#sec-m-hero - Foundations hero: the arithmetic behind Week 4's confidentiality
chapter4-math.html#sec-m-xor - XOR, the One-Time Pad and Perfect Secrecy
chapter4-math.html#sec-m-modular - Modular Arithmetic and Search Spaces
chapter4-math.html#sec-m-keysize - Key Length, Entropy and Security Levels
chapter4-math.html#ix-birthday - interactive widget hook: birthday bound (placed inside key-size section)
chapter4-math.html#sec-m-aes - The AES Round as a Diffusion Argument
chapter4-math.html#ix-avalanche - interactive widget hook: avalanche measurement
chapter4-math.html#ix-m-aes-pipe - interactive pipeline: one full AES encryption, end to end
chapter4-math.html#sol-m1 - worked answer: why AES uses both ShiftRows and MixColumns
chapter4-math.html#sec-m-hash - Hash Properties and the Birthday Bound
chapter4-math.html#ix-m-hash-race - interactive race chart: collision work factor by digest size
chapter4-math.html#sol-m2 - worked answer: sizes and levels for backups, firmware, invoices at 128-bit level
chapter4-math.html#sec-m-checklist - Construct-Selection Checklist
chapter4-math.html#ix-m-checklist-seq - interactive sequence: order the six checklist steps
chapter4-math.html#ix-m-mode-matcher - interactive matcher: construction → guarantee
chapter4-math.html#ix-m-self-test - flashcard deck: seven numbers and rules to recall
chapter4-math.html#sol-m3 - worked answer: full six-step review of a CBC + MD5 + co-located key design
```

Counts: 29 ids in `chapter4-study.html`, 18 ids in `chapter4-math.html`, 47 total. All in-page `href="#…"` links resolve to one of these ids; no other anchor targets exist.

---

## 6. GRAPH SEEDS

### 6.1 Concept graph — study page (16 nodes)

| id suggestion | label | definition (from the page) | anchor |
|---|---|---|---|
| `crypto-primitive` | Cryptographic primitive | "algorithm + parameters + key, when required" — the middle link in the chain information → primitive → security guarantee; "a primitive is never 'strong' in the abstract". | `chapter4-study.html#sec-goals` |
| `security-goals` | Five security goals | Confidentiality, integrity, authentication, non-repudiation and key establishment, each answering a different question ("Can outsiders read the data?", "Has the data been changed?", "Who created or sent it?", "Can a signer later deny it?", "How do peers obtain a shared secret?"). | `chapter4-study.html#sec-goals` |
| `hash-asterisk` | The hash asterisk | "A bare hash is only a fingerprint: an attacker who can modify the data can replace the message *and* its hash", so integrity against an active attacker needs a MAC, signature or AEAD. | `chapter4-study.html#sec-goals` |
| `kerckhoffs-principle` | Kerckhoffs's principle | "The security of a system should depend on its key, not on its design remaining obscure" — the enemy knows the system; public algorithm + secret key. | `chapter4-study.html#sec-kerckhoffs` |
| `security-by-obscurity` | Security by obscurity | Hiding the mechanism, which "fails first, because the mechanism leaks" — contrasted with security by transparency. | `chapter4-study.html#sec-kerckhoffs` |
| `symmetric-encryption` | Symmetric encryption | "A single shared secret key drives both directions: C = Enc(K, M) and M = Dec(K, C)", giving high throughput and small overhead for bulk data. | `chapter4-study.html#sec-symmetric` |
| `one-time-pad` | One-time pad | A random key the same length as the message, XORed into the plaintext: "C = M ⊕ K and M = C ⊕ K", with perfect secrecy when all four conditions hold. | `chapter4-study.html#sec-otp` |
| `otp-reuse-failure` | OTP key reuse | `C₁ ⊕ C₂ = (M₁ ⊕ K) ⊕ (M₂ ⊕ K) = M₁ ⊕ M₂` — "Key reuse destroys perfect secrecy"; the rule survives as nonce discipline. | `chapter4-study.html#sec-otp` |
| `stream-cipher` | Stream cipher | "Protects a flowing sequence… each message bit is XORed with one keystream bit: C = M ⊕ keystream"; modern example ChaCha20; needs a unique nonce, not a mode. | `chapter4-study.html#sec-ciphers` |
| `block-cipher` | Block cipher | "Transforms fixed-size blocks… AES uses 128-bit blocks"; a keyed permutation of one block, with a mode needed for anything longer. | `chapter4-study.html#sec-ciphers` |
| `aes` | AES (Advanced Encryption Standard) | "A symmetric block cipher with a 128-bit block and a key of 128, 192 or 256 bits", with 10/12/14 rounds, published as FIPS 197. | `chapter4-study.html#sec-aes` |
| `aes-round-steps` | AES round steps | SubBytes (non-linearity from a fixed public 16×16 S-box), ShiftRows (rotate row r left by r bytes), MixColumns (fixed polynomial over GF(2^8)), AddRoundKey ("the only step that involves the secret"); the final round omits MixColumns. | `chapter4-study.html#sec-aes` |
| `modes-of-operation` | Modes of operation | "The mode decides what an observer of the ciphertext can learn, and whether tampering can be detected at all": ECB leaks patterns with no integrity, CBC hides patterns but is confidentiality only, GCM encrypts and authenticates. | `chapter4-study.html#sec-modes` |
| `aead-gcm` | AEAD / AES-GCM | `(C, T) = Enc(K, N, M)` — counter-based encryption plus an authentication tag; "If C or T changes, verification fails and the plaintext is rejected"; nonce must be unique under K. | `chapter4-study.html#sec-modes` |
| `key-lifecycle` | Key lifecycle | Five stages — Generate (OS CSPRNG), Store (keystore/HSM), Use (least exposure), Rotate/revoke (policy), Destroy (all copies) — summarised as "strong cryptography = strong primitive + unpredictable key + disciplined lifecycle". | `chapter4-study.html#sec-keys` |
| `hash-function` | Cryptographic hash function | "A public function h = H(m) that maps a message of arbitrary length to a fixed-length digest", one-way, collision resistant, with the avalanche effect; collisions cost about 2^{n/2}. | `chapter4-study.html#sec-hash` |

### 6.2 Foundations graph — math page (9 nodes)

| id suggestion | label | definition (from the page) | anchor |
|---|---|---|---|
| `xor-algebra` | XOR algebra | `x ⊕ x = 0` and `x ⊕ 0 = x`; "encryption and decryption are the same operation applied with the same key": `C = M ⊕ K`, `C ⊕ K = M`; XOR is "bitwise addition without carry; its own inverse". | `chapter4-math.html#sec-m-xor` |
| `perfect-secrecy` | Perfect secrecy | `Pr[C = c | M = m] = Pr[K = m ⊕ c] = 2^{−n}`, independent of m, so "by Bayes' rule the posterior equals the prior" and the ciphertext gives the attacker no information. | `chapter4-math.html#sec-m-xor` |
| `modular-arithmetic` | Modular arithmetic | `a mod n` is "the remainder of a on division by n, always in {0, 1, …, n−1}"; the remainder set is `Z_n`; `a ≡ b (mod n)` when "n divides a − b". | `chapter4-math.html#sec-m-modular` |
| `modular-exponentiation` | Modular exponentiation / one-way gap | `y = g^x mod p` in `Z_p*`: forward costs "about log₂ x modular squarings and multiplications … not 2^256", backward is the discrete-logarithm problem — no efficient classical method is known. | `chapter4-math.html#sec-m-modular` |
| `search-space` | Search space | `|{0,1}^n| = 2^n`, with `2^{n+1} = 2 · 2^n` and `2^10 ≈ 10^3`: each extra bit doubles brute-force work and every ten bits multiplies it by about a thousand. | `chapter4-math.html#sec-m-modular` |
| `entropy-bound` | Entropy bound on effective work | `W ≤ 2^H ≤ 2^n` — "a perfectly uniform n-bit key has H = n and the two bounds meet"; a guessable rule leaving ~16 bits varying caps `W` at `2^16 = 65,536` even in a 128-bit field (LONG ≠ STRONG). | `chapter4-math.html#sec-m-keysize` |
| `security-level` | Security level | "The classical work factor of the best known attack" — the only valid way to compare key sizes across families; ≈2^128 pairs AES-128, SHA-256 (collision) and a 3072-bit RSA/DH modulus. | `chapter4-math.html#sec-m-keysize` |
| `aes-diffusion` | AES diffusion argument | SubBytes gives confusion, ShiftRows and MixColumns give diffusion ("a change in one input bit reaches every byte of the state"), which is why the round count is 10/12/14; measured as `D = (1/128) Σ [C_i ≠ C'_i] → ½`. | `chapter4-math.html#sec-m-aes` |
| `birthday-bound` | Birthday bound | `P ≈ 1 − e^{−q²/(2N)}` with `N = 2^n` gives threshold `q ≈ √(2N) ≈ 2^{n/2}`, so "a digest length must be twice the intended security level": MD5 2^64, SHA-1 2^80, SHA-256 2^128. | `chapter4-math.html#sec-m-hash` |

---

## 7. FLASHCARD SEEDS

1. **Front:** What is the one-line statement of Kerckhoffs's principle, and who framed it?
   **Back:** "The security of a system should depend on its key, not on its design remaining obscure" — Auguste Kerckhoffs, a Dutch 19th-century cryptographer, framed as "the enemy knows the system". Modern cryptography is therefore *public algorithm + secret key*. (`chapter4-study.html#sec-kerckhoffs`)

2. **Front:** Name the four conditions of a one-time pad, and what happens if one fails.
   **Back:** Truly random; same length as the message; kept secret; never reused. Reuse is the condition that fails first in practice: `C₁ ⊕ C₂ = (M₁ ⊕ K) ⊕ (M₂ ⊕ K) = M₁ ⊕ M₂`, the key cancels, and the attacker holds the XOR of two plaintexts. (`chapter4-study.html#sec-otp`)

3. **Front:** Give AES's block size, its key sizes and its round counts.
   **Back:** 128-bit block (16 bytes); keys of 128, 192 or 256 bits; 10 rounds for AES-128, 12 for AES-192, 14 for AES-256. The final round omits MixColumns, and the public specification is FIPS 197. (`chapter4-study.html#sec-aes`)

4. **Front:** Which AES round step touches the secret key, and what do the other three do?
   **Back:** AddRoundKey — "the only step that involves the secret"; it XORs the state with round keys from the key schedule. SubBytes gives non-linearity via a fixed public 16×16 S-box, ShiftRows rotates row *r* left by *r* bytes, MixColumns multiplies each column by a fixed polynomial over GF(2^8). (`chapter4-study.html#sec-aes`)

5. **Front:** Contrast ECB, CBC and GCM on repeated plaintext, patterns and integrity.
   **Back:** ECB encrypts each block independently → repeated plaintext gives repeated ciphertext, patterns remain visible, no integrity. CBC chains each block to the previous ciphertext → repeated plaintext gives different ciphertext, patterns hidden, but "confidentiality only; authentication is separate". GCM is counter-based encryption plus an authentication tag → content hidden, tampering detected. (`chapter4-study.html#sec-modes`)

6. **Front:** What is the birthday bound, and what collision work does it imply for MD5, SHA-1 and SHA-256?
   **Back:** For an *n*-bit digest, collision work is about `2^{n/2}` (threshold `q ≈ √(2N) ≈ 2^{n/2}` where `N = 2^n`), not `2^n`. So MD5 (128-bit) ≈ 2^64 — achievable and broken; SHA-1 (160-bit) ≈ 2^80 — collisions demonstrated, deprecated; SHA-256 (256-bit) ≈ 2^128 — out of reach and equal to the AES-128 level. A digest must be twice as long as the security level it supports. (`chapter4-math.html#sec-m-hash`)

7. **Front:** Why is a bare hash not integrity, and what replaces it?
   **Back:** A hash is unkeyed: "anyone can compute H(m′) for a modified message m′", so an attacker who can edit the data supplies `(m′, H(m′))` and the fingerprint matches. Integrity against that attacker needs a value they cannot recompute — `tag = F(K, m)` (MAC), `σ = Sign(sk, H(m))` (signature) or an AEAD tag `T`. A MAC cannot give non-repudiation because both parties hold the same key. (`chapter4-math.html#sec-m-hash`)

---

*Digest compiled from complete reads of both chapter 4 web pages (1022 + 585 lines). All numeric values above were recomputed independently: the 8-bit XOR (0xB2 ⊕ 0x59 = 0xEB), 2^4 = 16, 2^128 = 3.402823669209385 × 10^38, 2^56 = 7.205759403792794 × 10^16, 2^112 = 5.192296858534828 × 10^33, 2^16 = 65,536 = 18.2 hours at 2^40 keys/s, 2^72/2^64 = 256, 11·4 + 3.3 = 47.3, 11·3 + 5·2 = 43, 5^6 mod 23 = 8, 19^6 mod 23 = 8^15 mod 23 = 5^90 mod 23 = 2, and the string length of `INFO5995-INFO5995!` = 18.*
