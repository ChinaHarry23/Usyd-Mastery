# INFO5995 — Week 6 Digest: Applied Cryptography and Secure Communications

Source pages (both read in full):
- `chapters/chapter6/web/chapter6-study.html` (725 lines) — sections: hero, sec-incident, sec-system-auth, sec-methods, sec-authz, sec-data, sec-channel, sec-availability, sec-cloud, sec-recap
- `chapters/chapter6/web/chapter6-math.html` (512 lines) — sections: sec-m-hero, sec-m-entropy, sec-m-strength, sec-m-hashing, sec-m-authmath, sec-m-hmac, sec-m-tls

Companion file `chapters/chapter6/web/chapter6-study.js` (interactive steppers whose captions are part of the study page's rendered content) was also read; facts drawn from it are marked `(JS stepper)`.

Scope warning for whoever authors questions: **neither page contains modular arithmetic, modular exponentiation, RSA key generation, Diffie–Hellman step tracing, XOR-pad drills, or a key-space brute-force drill beyond entropy/guesswork.** Grep confirmed: no `RSA` formula (only the strength-equivalence table rows "RSA modulus 1024/2048/3072/7680/15360-bit"), no `Diffie`, no `mod`, no `2048-bit modulus arithmetic`. The only XOR on either page is inside the HMAC construction. Sections 2 below lists every quantitative relationship that actually exists, so questions stay inside the source.

---

## 1. SECTION-BY-SECTION FACTS

### chapter6-study.html

#### `#hero` — Week 6: Applied Cryptography and Secure Communications
- Title line: "Week 6: Applied Cryptography and Secure Communications"; course tag "INFO5995 — Cybersecurity".
- Hero subtitle names the fitted-together set: "the TLS handshake, digital identity and authentication, **NIST digital identity guidance**, and cloud key management — read through the Harbour University case study."
- Four hero cards: "Who is actually logging in?"; "Authenticate → authorise → audit"; "Encrypt data in transit, at rest, in use"; "Identity is the cloud control plane".
- Provenance line: "Built from the Week 6 lecture deck (*Applied Cryptography and Secure Communications*) and its Harbour University running case study".
- Sidebar order is the reading order of the whole chapter: Overview, The Incident, System Authentication, Auth Methods, Authorisation, Data Security, Secure Channel, Availability, Cloud Security, Recap, then links to Foundations (`chapter6-math.html`), Mind Map, Quiz Hub, Flashcards.
- Progress widget reads "Week 6 built" at 100%.

#### `#sec-incident` — "If No Encryption Was Broken, Where Did the Attack Happen?"
- Lead: Harbour University "runs one connected system — a web portal, single sign-on, a marks database and a cloud platform — serving roughly **50,000 students and staff**."
- Exact timeline in the concept box: "At **8:03 a.m.** a staff login succeeds with a valid password. By **8:17 a.m.** **8,000 student records** — names, marks, student IDs and contact details — have been accessed." (14 minutes of bulk access, 8,000 records.)
- Deck verdict quoted verbatim: "**the data was encrypted, but the attacker logged in as an authorised user.**"
- "What did not fail": encryption in transit (HTTPS) and encryption at rest both worked; "No cipher was broken and no key was cracked"; every control on the diagram (TLS, SSO, the encrypted database) was operating.
- "What did fail": "The system could not tell *which human* was holding a valid credential"; the session was "legitimate from the application's point of view, and the application served plaintext because that is what applications must do."
- Pivot box: Weeks 4–5 authenticated a *message* or a *peer* (MAC/HMAC, digital signatures, certificates, TLS); Week 6 "moves up a layer and asks the same question about a *user and a session*". Key sentence: "**encryption can protect the channel; it cannot prove the right human is using the account.**"
- Four-layer table (Layer / What it authenticates / Week 4–5 tooling / Week 6 question):
  - Message — "That content was not altered" — Hash, MAC / HMAC — "Did the right *account* send it?"
  - Peer — "That the endpoint is who it claims" — Digital signature, certificate — "Who is the person behind that endpoint?"
  - Channel — "Confidentiality and integrity in transit" — TLS / HTTPS — "What happens after the channel ends?"
  - User and session — "That the legitimate owner is present" — (none; em dash) — "The whole of Week 6"
- Exam framing callout: the deck's four pause-and-think questions are the skeleton of an answer — *Identity* (who logged in?), *Access* (what could they reach?), *Data* (where did it travel?), *Cloud* (who owned each control?) — "Answer an incident question with those four, in that order."
- Quick-check: the correct explanation is that the credential was valid, so the session was authorised and the application returned readable records; the wrong answers are "keys were too short" (deck states explicitly that no encryption was broken) and "TLS terminated at the load balancer so the last hop was plaintext" (TLS was working and its job ends at the server).

#### `#sec-system-auth` — System-Level Authentication
- Lead: "A password demonstrates knowledge of a secret. It does not prove the legitimate owner is present — and that gap is where the Harbour University incident lives."
- Three-decision definition box (quoted): "**Identification** — who do you claim to be? … **Authentication** — can you prove the claim? … **Authorisation** — what are you permitted to do?" Concrete instance: Alice enters `alice@harbour.edu.au`; her passkey response is verified; policy allows Alice to view `/marks/1042` and not `/marks/1043`. "The order is always *claim identity → verify evidence → evaluate permission*."
- Framing of passwords: not "passwords are bad" but "**one kind of evidence is a single point of failure**"; passwords are "reusable, shareable and phishable".
- Factor table (Factor / Evidence / Deck example / Characteristic weakness):
  - Something she **knows** — "A secret held in memory" — Password — "Reusable, shareable, phishable"
  - Something she **has** — "A device or key she controls" — Registered phone — "Can be lost, stolen or exhausted by push fatigue"
  - Something she **is** — "A biometric trait" — Fingerprint — "Probabilistic match; hard to replace after compromise"
- Counting rule callout (quoted): "factors count separately *only when each is independently verified*. Password + PIN is two steps but one factor category. Two passwords, two TOTP apps on the same phone, or a password plus a push to the same device are all one category wearing two hats."
- Five principles of strong authentication (quoted list): "(1) identity is never absolute, systems build confidence from evidence not certainty; (2) passwords alone are not enough; (3) independent factors are stronger; (4) authentication is continuous, because device, location and behaviour change risk after login; (5) recovery must be secure, because a weak fallback bypasses the strongest primary method." Closing line: "Authentication is about building confidence that the right person is accessing the right system at the right time."
- Interactive `#ix-auth-journey` "The journey a login actually takes" (JS stepper, 7 frames): (1) Claim — `alice@harbour.edu.au`, "a claim, not evidence", "An unverified claim is cheap: anyone can type any address"; (2) Authenticate — "derived value == stored value", "hash + salt, never plaintext", "Reusable, shareable and phishable — one failure mode carrying the whole login"; (3) KNOWS + HAS + IS = password + registered phone + fingerprint, "Password + PIN = two steps, but one factor category"; (4) "Where MFA is recruited rather than defeated" — MFA push at 2:13 a.m., "Repeated prompts → approval fatigue → the attacker's session is approved", countermeasures "Number matching, prompt rate limits and reporting"; (5) recovery chain "HELP DESK 'I lost my phone' → WEAK CHECK name + date of birth → ACCOUNT RESET attacker takes control", "A weak fallback bypasses the strongest primary method" (principle 5); (6) Authorise — `GET /marks/1042` ALLOW, `GET /marks/1043` DENY, "Changing an ID in a URL is broken object-level authorisation, not failed authentication", "Scope should match responsibility, not status"; (7) Continuous — "9:00 a.m. known laptop Sydney campus LOWER RISK" vs "3:14 a.m. new browser unusual country HIGHER RISK", "Authentication is continuous — not a single gate at the front door."
- Quick-check: password + PIN is "Two authentication steps in one factor category, so the independent-evidence property is not met" — step count is not factor count, because both secrets come from one category (knowledge).
- Worked example `#sol-1` — explaining the breach to the Harbour University council, four moves: (1) "Separate the layers" — TLS protects data *in transit*, database encryption protects data *at rest*, neither answers "is this the legitimate Alice?"; (2) "Name the failed decision" — authentication is the decision that failed; the credential was genuine so the authentication step *succeeded* at the only question it was asked; (3) "Explain why the data was readable" — a valid session receives plaintext, "That is not a bug; it is how the stack works"; (4) "Locate the real control gap" — "Either authorisation was too broad (the session could reach 8,000 records it did not need) or detection was too slow (fourteen minutes of bulk access with no alert). Both are Week 6 answers; neither is a cryptography answer."

#### `#sec-methods` — "Choosing Authentication Methods by Threat"
- Lead rule: "choose by threat, not fashion. Each method proves something different and fails in a different way."
- Method table (Method / What it proves / Main limitation / Best use):
  - **Password** — Something you know — "Can be stolen, reused or phished" — "General compatibility; baseline authentication"
  - **Authenticator app (TOTP)** — Something you have — "Codes can still be phished in real time" — "Stronger than passwords; widely supported"
  - **Push approval** — Something you have — "Vulnerable to push fatigue if users approve unexpected requests" — "Good usability; enable number matching where available"
  - **Security key / passkey** — "Public-key credential stored on the user's device" — "Requires compatible devices and services" — "Preferred for phishing-resistant and high-risk authentication"
- Push fatigue: "Repeated prompts pressure a user into approving an attacker's session. **The attack does not defeat MFA; it recruits the user.**" Countermeasures: "number matching, rate limits on prompts, and treating an unexpected prompt as a reportable event."
- Biometrics definition box: "A sensor captures a sample and compares it against a protected template, so the result is **probabilistic rather than an exact string comparison**. **You cannot reissue a fingerprint.**" Design consequences: "liveness checks, secure hardware, retry limits, and a carefully protected fallback."
- Passkeys definition box (quoted): "The device creates and protects a private key; the portal stores only the matching *public* key — never a reusable password. The private key is not sent to the university." Result: "origin-bound authentication that resists credential stuffing and many phishing attacks, because the signature is bound to the site's origin and cannot be replayed to a look-alike domain."
- Adaptive authentication insight: "9:00 a.m. on a known laptop on the Sydney campus is lower risk; 3:14 a.m. from a new browser in an unusual country is higher risk"; it "can require stronger evidence or restrict sensitive actions when the context changes — and it needs monitoring to know that the context changed."
- Recovery callout: "**Recovery is an authentication path.**" The deck's 2:13 a.m. scenario and the help-desk path: "'I lost my phone' → weak identity check (name plus date of birth) → account reset → attacker takes control. Recovery is often the weakest authentication path in the system, which is exactly why principle 5 exists."
- Interactive `#ix-verifier` "From entered password to stored verifier" (JS stepper, 6 frames): (1) password "sent over TLS — the channel protects it in transit", "Confidentiality in transit is the channel's job — not the store's"; (2) "RANDOM SALT unique per account", "STORED OPENLY salt is not a secret", "NO SHARED HASH same password ≠ same verifier", "A salt does not slow a single guess"; (3) KDF box lists "Argon2id · scrypt · bcrypt · PBKDF2, configured to be expensive" and the stored record is "derived value + salt + algorithm parameters"; (4) login-time compare "equal → authenticated · not equal → denied", "No key to steal that would unlock every password at once"; (5) "ENCRYPTION — REVERSIBLE ciphertext → key → plaintext, steal the key → every stored password is exposed" vs "HASHING — ONE-WAY password → verifier → compare, no key exists that would reveal the original password"; (6) leaked store = "STOLEN VERIFIERS guess → derive → compare, offline, no rate limit, no lockout"; defence is layered: "unique passwords + password manager + MFA or passkeys + rate limits + monitoring"; "Slow hashing raises the cost per guess. It does not make a weak password strong."
- Attack→countermeasure matching exercise (`#ix-attacks`): **Stolen verifiers** (offline guessing against a leaked hash database) → "A slow, memory-hard password hashing function with per-account salts"; **Credential stuffing** (reused username/password pairs) → "Unique passwords plus a password manager, and MFA or passkeys that reuse cannot satisfy"; **Password spraying** (a few likely passwords across many accounts to avoid lockout) → "Rate limiting, anomaly detection and monitoring rather than per-account lockout alone"; **Phishing** (fake login page or fraudulent approval prompt) → "Origin-bound passkeys and user training that treats unexpected prompts as incidents".
- Quick-check: hash rather than encrypt because "encryption is reversible, so the decryption key becomes a single point of failure for every stored password"; hashing is one-way verification and the server "never needs to recover the original password". Distractors: hashing is faster (wrong — "a slow function is the point"), and a hash makes a weak password unguessable (wrong — "Hashing does not make weak passwords strong — it raises the cost of guessing them").

#### `#sec-authz` — "Authorisation: What May You Do?"
- Lead question pair: tutor accessing marks outside their classes; every administrator viewing student grades.
- Concept box (quoted): "**Authentication answered 'who are you?'. Authorisation asks 'what may you do?'**" The deck's five-role ladder for one system — "**student, tutor, lecturer, unit coordinator, administrator**" — "is a ladder of *scope*, not of status. The rule attached to it: **scope should match responsibility, not status**, and higher roles do not automatically inherit permission to read every record."
- Interactive `#ix-rbac-scope` "One system, five roles, increasing access scope" (JS widget; illustrative 0–5 scope scores, "A revision aid, not measured data"): Student "view own records" = 1; Tutor "assigned classes" = 2 "assigned tutorial"; Lecturer "assigned unit" = 3 "one unit"; Coordinator "unit-wide activities" = 4; Administrator "platform services" = 5 "platform-wide".
- RBAC matching exercise (`#ix-rbac`) — mandate: "RBAC assigns permissions to roles; users inherit them through role membership." Pairs: Student → "View own result"; Tutor → "Enter marks for assigned tutorial"; Lecturer → "Manage assigned unit"; Coordinator → "Approve final marks"; Administrator → "Maintain service".
- Least-privilege definition box: contrast a tutor role that can "*view all students, export all marks, change enrolments and manage users*" with one that can only "*view the assigned class and enter assigned marks, with no bulk export*". Rule: "**Grant the minimum scope, actions and duration required for the task.**" Reason: "if the tutor account is compromised, the attacker reaches fewer records and fewer actions."
- Three authorisation cards:
  - **Separation of duties** — "No single person should control the entire process. The lecturer proposes marks, the coordinator reviews and approves, the system publishes results." Purpose: "reduces the risk of fraud, mistakes and unilateral misuse."
  - **Broken object-level authorisation** — "A logged-in student with ID 1042 requests `GET /marks/1043`. The server asks whether student 1042 may view record 1043 and denies." Verdict: "Changing an ID in a URL is a broken *authorisation* control, not a failed authentication."
  - **Access follows the person** (four lifecycle verbs) — "**Join**: assign the role and minimum permissions. **Move**: remove old permissions, grant only the new role's access. **Review**: verify current permissions are still required. **Leave**: disable the account, revoke sessions, remove access."
- Layer callout: "'the IDOR let them read another student's marks' is an **authorisation** finding. 'They logged in with a stolen password' is an **authentication** finding. Scoring the wrong layer loses the marks even when the observation is correct."
- Quick-check: correct answer "Authorisation, specifically object-level authorisation — the server never checked whether this subject may access that object". Wrong options: authentication (it succeeded — that is why the case is interesting); encryption (no cipher was broken; encryption does not govern who may read a particular row).

#### `#sec-data` — "Data Security Through the Lifecycle"
- Lead: Harbour University holds "marks, student IDs, addresses, medical adjustments, research data, payroll and financial records. Not all of it has the same value, sensitivity or impact if compromised."
- Classification table (Classification / Deck example / Who may access it):
  - **Public** — Course handbook — "Approved for anyone"
  - **Internal** — Staff meeting notes — "University workforce"
  - **Confidential** — Student marks — "Authorised academic roles"
  - **Restricted** — "Payroll • medical records" — "Tightly limited, high-impact access"
- Ordering rule: "**Classify data *before* deciding who may access it**, how it is protected and how long it is retained. The three states then follow from the classification, and each state has its own controls."
- Three-state flow: (1) **In transit** — "TLS, authenticated channels, VPN where appropriate — student device to cloud portal over HTTPS"; (2) **At rest** — "Database, disk and object-storage encryption — the encrypted database behind the portal"; (3) **In use** — "Application permissions, isolation, minimisation and monitoring — **the state where the data is plaintext**."
- Case-study sentence (quoted): "the database was encrypted, the records were still exposed. Protection at rest worked; the failure was a valid login plus wrong permissions, and the application returned readable records. *Encryption protects particular data states. It does not override application authorisation.*"
- **Minimisation** card: the deck's admission form — "name, student ID and email are required; passport copy, driver licence and extra personal details are questioned." Four questions to ask before collecting: "is it required for the stated purpose, is there a less sensitive alternative, how long must it be retained, and who will be able to access it?" Justification: "Less stored data means less data to expose, misuse, retain and delete."
- **Accountability** card — "Every important action should leave evidence in **five parts**: **time (09:02:14), actor (Alice, 1042), action (viewed marks), resource (student 1042) and context (Sydney, 203.x.x.x).**" Rule: "Logs create accountability only when they are protected, monitored and reviewed — **an unread log is a cost, not a control**."
- Integrity controls card deck (`#ix-integrity`) — six cards:
  - "Hash / checksum" — "Detects change when compared with a trusted reference. A hash alone does not say who changed the value, and it is only as trustworthy as the reference you compare against." Hint: "Detects change".
  - "Digital signature / MAC" — "Provides authenticated integrity: not just that the value changed, but who produced or approved it. This is the property a bare checksum cannot give you." Hint: "Attributes change".
  - "Protected audit log" — "Records who changed what, when and from where. It is the control that answers the deck's question: if someone changes a mark, how would we know?" Hint: "Creates accountability".
  - "Confidentiality — who can see it?" — "Access control plus encryption in the appropriate data state. It says nothing about whether the value you are reading is the value that was written." Hint: "CIA: C".
  - "Integrity — can we trust it?" — "Hashes, signatures and protected logs together. A tutor's mark entry that is signed and logged is defensible; one that is merely stored is not." Hint: "CIA: I".
  - "Availability — can we access and recover it?" — "Backups, versioning, offline or immutable copies and recovery testing. Note the deck's warning: **backups support availability and recovery — they do not automatically provide confidentiality.**" Hint: "CIA: A".
- Quick-check: correct answer is that protection at rest worked as designed and the exposure came from the permissions attached to a legitimate session; distractors are "encryption at rest failed" and "minimisation failed" (minimisation is a separate control and is not the mechanism that returned these records).

#### `#sec-channel` — "The Secure Channel: TLS, Certificates and Message Authentication"
- Lead: "Everything the case study describes travels over HTTPS. TLS is the applied end of Weeks 4–5: it takes key exchange, certificates, AEAD and message authentication and makes them work on every page load."
- TLS 1.3 message table (Message / Carried in clear or encrypted? / What it establishes):
  - "**ClientHello (+ key_share, ALPN, SNI)**" — **Clear** — "Client random, supported versions, cipher suites, a guessed key share, the server name"
  - "**ServerHello (+ key_share)**" — **Clear** — "Chosen version and cipher suite, the server's key share — both sides can now derive handshake keys"
  - "**EncryptedExtensions, Certificate, CertificateVerify, Finished**" — **Encrypted** — "Server parameters, the certificate chain, a signature over the transcript proving private-key possession"
  - "**Client Finished**" — **Encrypted** — "Client's transcript check; handshake keys are then discarded"
  - "**Application data**" — **Encrypted** — "Payload under AEAD with per-record nonces and sequence numbers"
- "What the certificate chain proves": "A leaf certificate binds a public key to a name. It is valid only if an intermediate CA signed it and a root CA that the client already trusts signed the intermediate. Verification checks the signature chain, the validity window, the name, and revocation status. **Remove any link and the chain proves nothing.**"
- "What the handshake deliberately hides": "Because almost everything after ServerHello is encrypted, a network observer learns the **server name (SNI)** and the **packet sizes and timings**, and little else. That is a feature: the certificate, the negotiated extensions and the application traffic are all inside the encrypted envelope."
- Week 6 fit callout: "the handshake authenticates the *server* to the client, and optionally the client to the server by certificate. **It does not authenticate Alice the human.** A stolen password travels happily inside a perfectly valid TLS 1.3 tunnel — which is exactly why the case study's incident cannot be fixed with more encryption."
- Interactive `#ix-hmac` "HMAC-SHA-256: why the tag cannot be reused after tampering" (JS stepper, 5 frames): (1) message "**Extend deadline by 1 day**" with a secret key "known to both parties, sent over no channel" → "tag T = HMAC-SHA-256(K, M)"; (2) "HMAC(K, M) = H( (K ⊕ opad) ‖ H( (K ⊕ ipad) ‖ M ) )"; inner digest is "32 bytes for SHA-256"; message "padded to 512-bit blocks"; (3) attacker changes the message to "**Extend deadline by 7 days**" and copies the original tag — "Eve can change M. She cannot change T to match — that needs K"; (4) server recomputes HMAC(K, M′) ≠ received T → "REJECT — message discarded"; "One check gives integrity and authenticity at once"; (5) "What HMAC does not give you: replay protection" — a recorded (M, T) "verifies, because nothing about it is wrong"; fix: "Add a nonce, timestamp or sequence number."
- Interactive `#ix-tls` "TLS 1.3 handshake, message by message" (JS stepper, 6 frames): frame 1 "ClientHello — the only fully cleartext flight" carrying "client_random · cipher suites · key_share · SNI", "which is why SNI is the classic handshake privacy leak"; frame 2 ServerHello, "Shared secret established → HKDF → handshake keys. No certificate has been seen yet"; frame 3 certificate chain "leaf → intermediate → trusted root", client "validates the chain, the validity window, the name and revocation status"; frame 4 CertificateVerify + Finished, "A valid certificate without the private key cannot produce this signature"; frame 5 application keys, "Handshake keys are discarded; only application keys remain"; frame 6 "What the handshake did not authenticate" — "TLS 1.3 tunnel — confidentiality + integrity … a genuine session for whoever holds the credential … **stolen password passes through unbothered** … Encryption can protect the channel. It cannot prove the right human is using the account."
- Quick-check: an observer can read "The server name in the ClientHello and the cipher suites the client offers". Distractors: the certificate/public key (now encrypted, observer sees size and timing); the first HTTP request plaintext (AEAD-protected; observer sees record lengths and timing).

#### `#sec-availability` — "Availability: An Attacked Pillar"
- Lead: "Strong encryption and correct permissions still fail if students and staff cannot reach the service. Availability is the pillar that can be attacked without anyone reading or changing a single record."
- Failure/mechanism/control table:
  - **DoS / DDoS** — "One source, or many distributed devices, overwhelm the service together" — "Rate limiting, scrubbing and elastic capacity"
  - **Ransomware** — "Production files are encrypted or systems disrupted" — "Isolated, immutable backups and tested restores"
  - **Resource exhaustion** — "CPU, memory, APIs or storage consumed" — "Quotas, autoscaling and load balancing"
  - **Failure** — "Hardware or software stops working" — "Redundancy; no single point of failure"
  - **Human error** — "Accidental deletion or a bad change" — "Change control, versioning, protected copies"
  - **Dependency outage** — "A cloud or third-party service fails" — "Dependency mapping and graceful degradation"
- Deck distinction: "DoS and DDoS have the same goal — make the service unavailable — and **differ only in scale**. Did the attacker need to read or change data? No. Availability alone can be attacked, and availability failures are not always data breaches — **but they are still security failures.**"
- Ransomware recovery sequence (`#ix-ransomware`), five steps in order: "Production files are encrypted by ransomware" → "An isolated, versioned, immutable backup copy remains available" → "Restore the data to a safe environment and verify its integrity" → "Check dependencies and confirm the restored state is consistent" → "Resume operations and monitor for a second attempt."
- Resilience insight: "**Availability = prevent disruption + recover quickly.**" Four resilience controls — "**redundancy, load balancing, rate limiting, monitoring**" — sit in front of four recovery steps. Preparation targets "hardware failure, ransomware, human error, and regional or provider outage — and **backups are useful only when restores are tested and recovery objectives are understood**."
- Quick-check: nightly backups in the *same cloud account* as production, never test-restored → "The backup is not yet a recovery control: it is not isolated from the production account and its restore path has never been verified." Distractors: "availability is covered because backups exist"; "confidentiality is covered because the backup copy is encrypted" (the deck says backups do not provide confidentiality).

#### `#sec-cloud` — "Cloud Security and Key Management"
- Lead: "Harbour University runs its portal, records, payroll and research services in the cloud… it moves identity to the centre of the control plane."
- Opportunities (four bullets): "Remote access from anywhere"; "Elastic resources instead of fixed capacity"; "Resilient architectures across zones"; "Faster deployment, shorter procurement".
- New risks (four bullets): "Internet exposure of services that were internal"; "Shared responsibility across a moving boundary"; "Configuration mistakes with enormous blast radius"; "Identity attacks replacing network-perimeter attacks".
- Interactive hotspot diagram `#ix-cloud-map` — a layered SVG (6 rects) labelled from the top: "STUDENTS · STAFF · RESEARCHERS"; "INTERNET BOUNDARY — HTTPS / TLS"; "CLOUD IDENTITY — SSO · MFA · POLICIES"; "APPLICATIONS — learning portal · student records · payroll · research"; "STORAGE · DATABASE · LOGS · BACKUPS — encrypted at rest · versioned · isolated copies · retention rules". Six clickable markers with details:
  - Users (12,13): "Students, staff and researchers reach the same services from campus, home and overseas. Every one of them is an identity the platform must authenticate; **there is no trusted network location left to fall back on.**"
  - Internet boundary (50,29): "The service is internet-facing, so HTTPS/TLS is the minimum for data in transit… attacks arrive as ordinary requests, which is why **authentication rather than network position carries the trust**."
  - Cloud identity (50,45): "**In the cloud, identity becomes a primary control plane.** A request is evaluated by authentication, then authorisation plus context, then the application action. Identity does not replace network security, but **location alone is no longer sufficient trust**."
  - Applications (50,62): "A compromised privileged account can alter infrastructure and affect thousands of users, so use **scoped roles, temporary elevation and strong controls for privileged access. Scope should match responsibility, not status.**"
  - Storage (30,84): "**Encrypt every copy — transit, at rest and the recovery copy** — and manage the keys, the access policy and the restore procedure. **One changed storage setting can expose an entire dataset to anyone on the internet.**"
  - Monitoring (90,84): "Login from **Australia at 09:12**, login from **Germany at 09:14**, **40,000 records downloaded at 09:15** is impossible travel plus bulk export. Look for **impossible travel, large downloads, repeated failures and privilege changes**. **Collection creates evidence; monitoring creates detection.**"
- Shared-responsibility table (Responsibility / "Cloud provider — security *of* the cloud" / "Harbour University — security *in* the cloud"):
  - Physical and platform — "Buildings and physical security, hardware and storage infrastructure, core networking and hypervisor, provider-managed service components, physical hardware failures" — (dash)
  - Identity and access — (dash) — "Student and staff identities, authentication and authorisation, customer-controlled configuration"
  - Applications and data — (dash) — "Applications and data, backups, retention and recovery"
- Incident callout: "if payroll leaks, ask *which control failed* — not merely 'provider or customer?'. **The exact boundary changes across IaaS, PaaS, SaaS and the service contract**, so the useful answer names a control and an owner."
- Key-lifecycle definition box — six stages: "**generate** in a managed service or hardware module, **distribute** only to the components that need it, **use** under an access policy, **rotate** on a schedule or after an incident, **revoke** so that compromised material becomes useless, and **destroy** under dual control. **Rotation is what makes the difference between one exposed key and one exposed dataset.**"
- Quick-check: administrator changes an object-storage setting, dataset becomes internet-readable → "**The university**, because customer-controlled configuration — including storage policy — is security *in* the cloud." Distractors: provider's fault (provider secures the platform; bucket configuration is the customer's); "both parties equally, because the boundary is always shared 50/50" (shared responsibility is not shared blame; the boundary is defined per service model).

#### `#sec-recap` — "Week 6 Recap"
- Lead: "Secure systems are built in layers: **identity → permissions → data protection → secure cloud operations**. The incident is only mysterious if you expect one layer to do another layer's job."
- Six toolkit flip-cards (headline + text):
  - "**Encryption is not authentication**" — "TLS protects the channel; encryption at rest protects stored data. Neither proves that the legitimate owner is present. That is the whole incident in one sentence." (Core claim)
  - "**Identify → authenticate → authorise**" — "Three questions, three decisions: who do you claim to be, can you prove it, and what may you do? Naming the wrong layer loses the marks." (Model)
  - "**Factors are counted by category**" — "Know, have, are — and each category must be independently verified. Password + PIN is two steps and one factor." (MFA)
  - "**Least privilege and separation of duties**" — "Minimum scope, actions and duration; no single person controls the whole process. Scope should match responsibility, not status." (Authorisation)
  - "**Encrypt every state and every copy**" — "In transit, at rest, in use — and the recovery copy too. Then manage the keys, the access policy and the restore procedure." (Data)
  - "**Identity is the modern control plane**" — "In the cloud, requests are evaluated by identity and context rather than by network location. Configuration and monitoring decide how much damage one account can do." (Cloud)
- "Check yourself" card: "Can you explain the breach without using the word 'encryption' as a cause? Can you name the five principles of strong authentication and the five of data, cloud and lifecycle security in the deck?" — accuracy note: the study page enumerates the **five principles of strong authentication** explicitly (`#sec-system-auth`), but it never prints a numbered list of "five principles of data, cloud and lifecycle security"; the closest printed list is the five-part cloud answer in `#sol-2` step 5 ("identity first, secure configuration with drift detection, least privilege, continuous monitoring, and recovery and resilience") plus the four audit headings of `#sol-2`. Do not assert a numbered "five principles of data security" as if the page stated it verbatim.
- Worked example `#sol-2` — auditing a cloud migration against the deck's four headings, each with owner and evidence: (1) **Authentication** — "Password only, or password plus MFA, or passkeys?"; the decision that matters is "whether the strongest available method is required for privileged roles"; owner: identity team; evidence: "enrolment rate for phishing-resistant factors, and the proportion of privileged accounts covered". (2) **Authorisation** — "Are roles defined, is least privilege applied, and is privileged access time-boxed?"; question: "whether a compromised privileged account can alter infrastructure affecting thousands of users"; owner: application and platform owners; evidence: "an access review record showing each role's permissions still match its responsibilities". (3) **Data** — "Is every dataset classified, is every copy encrypted, and is retention justified?"; owner: data owners per classification; evidence: "a register that maps each dataset to a class, an encryption state and a retention period — including the backup copy". (4) **Operations** — "Is monitoring alerting on impossible travel, bulk download, repeated failures and privilege changes? Are backups isolated and tested?"; owner: cloud operations; evidence: "an alert that fired in a game-day exercise, plus a dated restore test with a measured recovery time". (5) The answer that earns the marks: "'**Cloud security is continuous, not a one-time configuration: identity first, secure configuration with drift detection, least privilege, continuous monitoring, and recovery and resilience.**' Name the five principles, then attach an owner and a piece of evidence to each."
- Worked example `#sol-3` — rating an authentication design for a student portal. Proposal: "passwords for everyone, TOTP for staff, push approval for administrators, and a help desk that resets any account after confirming the caller's name and date of birth." Assessment: (1) "Match method to threat, not to fashion. Passwords for all **50,000 users** buys compatibility and nothing else. TOTP for staff is a genuine second category and a real improvement, but codes can be phished in real time." (2) "**Look for the category error.** Push approval for administrators is the highest-privilege role on the weakest second factor: push fatigue targets exactly the population with the most to lose. The deck's answer is a **security key or passkey** for high-risk authentication, with number matching at minimum." (3) "**Attack the recovery path.** Name plus date of birth is weak identity evidence — both are widely known. As written, this help-desk path bypasses every stronger method above it, which is **principle 5 in the negative**. Replace it with out-of-band verification against enrolment records, and log every reset as a security event." (4) "Add continuity… a new browser at **3:14 a.m.** from an unusual country should require stronger evidence or restrict sensitive actions. That requires monitoring, which the proposal does not mention." (5) "Verdict and fix order. The design is a reasonable first step and a poor finished state. **Fix order: (1) close the recovery hole, (2) move administrators to phishing-resistant credentials, (3) add adaptive risk checks and monitoring, (4) reduce reliance on passwords for everyone else.**"
- Final framing callout: "identity → permissions → data protection → secure cloud operations. **Week 6 is the week where cryptography stops being the answer and becomes one control among several.**"

---

### chapter6-math.html

#### `#sec-m-hero` — "Foundations: the numbers behind applied cryptography"
- Tag: "INFO5995 — Week 6 supplement"; H1 "Foundations: the numbers behind applied cryptography"; rendered with KaTeX 0.16.9.
- Hero description enumerates what is examinable: "how much entropy a password actually has, what '112-bit security' means across symmetric and asymmetric primitives, what a password-hashing cost parameter buys you, how two authentication factors combine, and how many bits an HMAC tag really needs."
- Four chips: "Entropy, keyspace and guesswork"; "Security-strength and equivalent key sizes"; "KDF cost parameters and offline guessing"; "HMAC and the TLS 1.3 key schedule".
- TOC groups the page: **Strength** (Entropy and guesswork, Security strength & key sizes, Password hashing cost) · **Authentication** (Factors, false accepts, lockouts) · **Protocol** (HMAC and tag length, The TLS 1.3 key schedule).

#### `#sec-m-entropy` — "Entropy and guesswork"
- Lead: "Everything in this chapter starts from one quantity: **how many equally likely secrets an attacker would have to try**. The deck's warning is that hashing raises the cost of guessing — so you need to be able to say how many guesses there are."
- **Theorem 1, Keyspace and entropy**: uniform draw from a set of size N ⇒ candidates N, entropy "H = log₂N bits, N = 2^H"; for an L-character password from an alphabet of R distinct characters "N = R^L, H = L·log₂R".
- Caveat quoted: "**Entropy measures the *choice*, not the string.** A 12-character password that a user built from their dog's name and a birth year is not a uniform draw from a 62¹² keyspace, and its effective entropy is far lower than the formula suggests."
- Characters/alphabet table (Characters available / R / log₂R / entropy of 8 characters / entropy of 12 characters):
  - Lowercase letters — 26 — 4.70 — 37.6 bits — 56.4 bits
  - + uppercase — 52 — 5.70 — 45.6 bits — 68.4 bits
  - + digits — 62 — 5.95 — 47.6 bits — 71.5 bits
  - + 33 symbols (printable ASCII) — 95 — 6.57 — 52.6 bits — 78.8 bits
  - Diceware word list — 7776 — 12.92 — "— (5 words: **64.6 bits**)" — "— (6 words: **77.5 bits**)"
- **Theorem 2, Guesswork: average versus worst case**: "G_avg ≈ N/2 = 2^(H−1), G_worst = N = 2^H"; "one bit of entropy is worth one bit of security: doubling the keyspace doubles the work, and the average case simply loses one bit to the factor of two."
- Worked example box — "how long is a 40-bit secret worth opposing?": Argon2id configured so one guess costs "W = 1 ms"; "H = 40 bits has N = 2⁴⁰ ≈ 1.10×10¹² candidates"; "expected guesses = N/2 ≈ 5.50×10¹¹"; "t = 5.50×10¹¹ × 10⁻³ s ≈ 5.50×10⁸ s ≈ **17.4 years**". Then "raise the cost by a factor of ten — W = 10 ms, still entirely acceptable at login — and the same secret takes about **174 years**. Or leave W alone and add 10 bits of entropy instead: N grows by 2¹⁰ ≈ 10³, so the time grows by the same factor. **Two independent levers, one formula.**"
- Callout — "**The two levers are not equivalent.** Raising the cost factor multiplies every guess and is bounded by how much latency a login can tolerate. Raising entropy multiplies the number of guesses and is bounded only by whether humans will accept the result. The deck's insistence on password managers and passkeys is really an argument for the second lever: let a machine generate and store the entropy."
- Quick-check: "10 characters drawn uniformly from the 62-character set" → correct "About 59.5 bits: 10 × log₂62"; distractors "about 10 bits, one for each character" (each position contributes log₂62 ≈ 5.95 bits) and "about 62 bits" (62 is R, not the keyspace; the keyspace is 62¹⁰).

#### `#sec-m-strength` — "Security strength and equivalent key sizes"
- Lead: "'**128-bit encryption**' and '**128-bit security**' are not the same claim. The brief's requirement is that you can move between security levels and key sizes across every primitive in the deck."
- **Theorem 3, Security strength**: "A primitive has security strength b bits when the best known attack needs on the order of 2^b operations." Three consequences: "b_exhaustive(k) = k"; "b_collision(n) ≈ n/2"; "b_factor(k) ≈ (64/9)^(1/3) · k^(1/3) · (log k)^(2/3)". Explanation quoted: "A k-bit symmetric key resists exhaustive search at 2^k. An n-bit hash resists *collisions* only at about 2^(n/2), by the birthday bound. And an **RSA modulus of k bits has no known attack near 2^k — the number field sieve is far cheaper, which is why RSA keys must be enormous to reach the same strength as an AES key.**"
- **Birthday bound def-box**: "In a space of n-bit outputs there are 2^n values, so after roughly √(2^n) = 2^(n/2) hashes a collision is likely. This is why a hash used for collision resistance needs an output *twice* the target strength, and why **SHA-256 is quoted as 128-bit collision resistance rather than 256-bit**."
- Strength-equivalence table (Security strength / Symmetric cipher / Hash (collision) / RSA modulus / ECDSA-ECDH curve / Status):
  - **80 bits** — 3DES (2-key) — SHA-1 (160-bit) — 1024-bit — 160-bit — Deprecated
  - **112 bits** — AES-128 (3DES 3-key) — SHA-224 — 2048-bit — 224-bit — Minimum acceptable
  - **128 bits** — AES-128 — SHA-256 — 3072-bit — 256-bit — Standard target
  - **192 bits** — AES-192 — SHA-384 — 7680-bit — 384-bit — Comfortable margin
  - **256 bits** — AES-256 — SHA-512 — 15360-bit — 521-bit — Long-lived data
  - Note (read it precisely): each row's "Hash (collision)" entry is the hash whose *collision* strength is half its output — SHA-1 (160) → 80, SHA-224 → 112, SHA-256 → 128, SHA-384 → 192, SHA-512 → 256. So in row "128 bits" the hash *name* is SHA-256 while the strength quoted is its 128-bit collision resistance. AES-128 appears in both the 112-bit row and the 128-bit row; the 112-bit row pairs it with 3DES 3-key, and the 128-bit row is the "Standard target".
- Asymmetry insight: "**Read the table as a set of equivalences, not a ladder.** AES-128, SHA-256 and a 3072-bit RSA modulus are chosen to sit at the same 128-bit strength. Notice the asymmetry: **doubling the symmetric key from 128 to 256 bits costs 16 extra key bytes, while matching that jump with RSA costs roughly a five-fold increase in modulus size and an order-of-magnitude slowdown.** That is the practical reason elliptic-curve key exchange dominates modern TLS." (15360 ÷ 3072 = 5 exactly.)
- Matching exercise (`#ix-m-strength`) pairs: "AES-128 → 128-bit strength at a 128-bit key"; "AES-256 → 256-bit strength — 32-byte key, no birthday penalty"; "SHA-256 as a collision-resistant hash → 128-bit strength, because collisions arrive at 2^(n/2)"; "RSA with a 3072-bit modulus → 128-bit strength — huge modulus, small strength"; "ECDSA with a 256-bit curve → 128-bit strength at a 32-byte public key"; "HMAC-SHA-256 with a full-length tag → Forgery resistance near 256 bits, not 128 — **MACs have no birthday bound**".
- Quick-check: "A system claims '256-bit security' because it uses SHA-256 to detect tampering with a database row." Correct: "**Collision resistance is only about 128 bits, and a bare hash cannot tell you *who* changed the value.**" Distractors: SHA-256 is practically broken (it is not); output truncated (truncation would lower strength further, but the claim is wrong even with the full 256-bit output).
- Key-selection checklist (`#ix-m-checklist`), five steps in order: "State the required security strength in bits for the data's lifetime" → "Pick the primitive family — symmetric, hash, or asymmetric" → "Convert the strength into a key or output size for that family" → "Check every protocol component at that strength, not just the cipher" → "Set a rotation and deprecation date before the strength decays."

#### `#sec-m-hashing` — "Password hashing cost and the verifier"
- Lead: "The deck lists **Argon2id, scrypt, bcrypt and PBKDF2** as the acceptable password-hashing functions, '**configured to be costly**'. This section makes that phrase quantitative."
- **Theorem 4, work per guess**: "A memory-hard KDF with m blocks of memory, t iterations and p parallel lanes does work proportional to its memory-time product: **W ∝ m · t · p**"; "For PBKDF2 the analogous quantity is the iteration count alone, W ∝ c · H(·)"; "**t_attack = f · N · W, t_attack,avg = N · W / 2**".
- Symmetry sentence quoted: "Doubling m or t doubles the defender's login cost *and* the attacker's per-guess cost. That symmetry is the whole design: **the defender pays once per login, the attacker pays once per guess.**"
- KDF table (Function / Cost parameters / Memory-hard? / Why you would choose it):
  - **Argon2id** — "memory m, iterations t, parallelism p" — Yes — "Current recommendation; hybrid data-independent and data-dependent addressing resists both side-channel and GPU attacks"
  - **scrypt** — "N (cost), r (block size), p" — Yes — "Well-established memory-hard alternative, widely deployed"
  - **bcrypt** — "cost factor c, work = 2^c" — "Partly (4 KiB working set)" — "Very mature; **every increment of the cost factor doubles the work**"
  - **PBKDF2** — "iteration count c" — No — "Legacy and FIPS-constrained environments only; cheap to accelerate on GPUs"
- "What the server stores" def-box: "The stored record is the **derived verifier plus the salt plus the algorithm parameters**. All three are needed at login, because the server must repeat exactly the same computation: **v = KDF(password, salt, m, t, p)**, and at login **KDF(candidate, salt, m, t, p) ≟ v**. Missing parameters mean an unverifiable account after a migration… rotate the parameters and you must re-derive on the next successful login, because the plaintext is not available to re-hash."
- Warning box — "What the salt does and does not do": "A unique per-account salt defeats precomputed tables and stops two users with the same password from sharing a verifier. It does **not** slow a single guess at all, and it does not help if the attacker is targeting one account rather than the whole database. **The salt removes a shortcut; the cost parameter sets the price of a direct guess.**"
- Quick-check: "A database of **50,000 verifiers** leaks. Every row has a **16-byte salt** and Argon2id parameters of **m = 64 MiB, t = 3, p = 1**." Correct: "Each guess is expensive, but the attack is offline with no rate limit, so weak passwords still fall." Distractors: "the salts make the whole database computationally infeasible to attack"; "the leak is contained as long as the salts themselves were kept secret" (the salt is stored openly by design and is not a secret in the threat model).

#### `#sec-m-authmath` — "Factors, false accepts and lockouts"
- Lead: "The deck's counting rule — factors count separately only when each is independently verified — is **a statement about probability**, and it is worth being able to write down."
- **Theorem 5, independent factors multiply**: "If factor 1 is defeated with probability p₁ and factor 2 with probability p₂, then for *independent* factors **p_bypass = p₁·p₂**." If verified through the same channel ("one phishing page that collects the password and relays the one-time code in real time"), "a single compromise defeats both and the best you can claim is the weaker of the two: **p_bypass ≈ max(p₁, p₂)**." Numbers quoted: "With **p₁ = p₂ = 0.01, independence gives 10⁻⁴ and dependence gives 10⁻²**: a hundredfold difference produced purely by how the factors are verified, not by which factors they are."
- **Theorem 6, false accepts / rejects**: "FAR(τ) = Pr[accept | impostor], FRR(τ) = Pr[reject | genuine]". "**Tighten the threshold and FAR falls while FRR rises; loosen it and the reverse happens.** The two curves cross at the **crossover error rate (CER)**, which is a convenient single-number summary of a matcher. Choosing where to sit on the curve is a policy decision about which error is worse for the use case — **unlocking a phone is not the same risk as authorising a payroll change.**"
- Worked example — "lockout as a rate limit": attacker allowed A password attempts per account per day against keyspace N, independent draws without replacement, "**p_success = 1 − (1 − 1/N)^A ≈ A/N for A ≪ N**". "With **N = 2⁴⁰ and A = 10, p_success ≈ 10 / 1.10×10¹² ≈ 9.1×10⁻¹² per account per day**." Then the same A = 10 across **U = 50,000 accounts** (password spraying, "chosen precisely because it stays under per-account lockout"); "If each account had an independent **10⁻³** chance (a weak password), the expected number of compromised accounts is **E[compromised] = U · p_success = 50,000 × 10⁻³ = 50 accounts**." Lesson: "**per-account lockout does not bound a horizontal attack. You need rate limiting and anomaly detection that measure attempts across the whole population**, which is why the deck pairs lockouts with monitoring rather than treating either as sufficient."
- Control table (Control / Quantity it bounds / Attack it does not stop):
  - "Per-account lockout" — "A attempts against one account" — "Password spraying across many accounts"
  - "Per-source rate limit" — "Attempts from one address" — "Distributed attempts from many addresses"
  - "Global anomaly detection" — "Attempts across the population" — "Slow, low-and-slow targeting of a few accounts"
  - "MFA / passkey requirement" — "Value of a correct password alone" — "Real-time phishing of a one-time code; push fatigue"
  - "Password-hashing cost W" — "Offline guesses per second after a leak" — "Guessing a genuinely low-entropy password"
- Quick-check: "A portal verifies a password and then a TOTP code, both entered into the same page." Correct: "**Real MFA for password theft, but not a product of two probabilities if a single phishing page can relay both**." Distractors: "a single factor entered twice, exactly like password plus PIN" (they are two categories — knowledge and possession; the weakness is the verification channel); "fully independent, because TOTP and passwords are unrelated algorithms" (independence is a property of the verification paths).
- Worked answer `#sol-m1` — "rating a proposed login policy with the arithmetic." Proposal: "minimum 8 characters, no MFA for students, lockout after 5 failed attempts per account, and a help desk that resets any account on name plus date of birth." Steps: (1) "An 8-character human-chosen password is not 95⁸. If it is a dictionary word with substitutions, the effective keyspace is more like **10⁴–10⁶ candidates**. Assume optimistically **2³⁰**." (2) "With **W = 1 ms**, the average attack is **2²⁹ × 10⁻³ s ≈ 6.2 days per account on a single core**, and that parallelises trivially. The hashing cost is doing real work, but it cannot rescue a 30-bit secret." (3) "Five attempts per account gives **p ≈ 5/2³⁰ ≈ 4.7×10⁻⁹** per account. Across 50,000 accounts that is **2.3×10⁻⁴ expected compromises per day** from a single pass — small, but repeated daily and combined with a leaked verifier it is not the binding constraint." (4) "**Find the cheapest path, which is not cryptographic.** Name plus date of birth is not a secret; both are widely knowable… by the rule p_bypass ≈ max(pᵢ) it sets the security of the whole design." (5) "Fix order, justified by the numbers: (1) close the recovery path, because it dominates. (2) Raise the entropy floor with a password manager or passphrase, because W alone cannot fix 30 bits. (3) Add MFA for students, which multiplies rather than adds when the channel is independent. (4) Move monitoring to the population level, since per-account lockout does not bound spraying."
- Self-test card deck (`#ix-m-terms`), seven cards: "Entropy H — H = log₂N bits… It measures the choice, not the string"; "Guesswork — Average ≈ N/2 = 2^(H−1); worst case = N = 2^H"; "Security strength b — the best known attack needs about 2^b operations… a k-bit symmetric key gives b ≈ k; an n-bit hash gives about n/2 for collisions"; "KDF work factor W — W ∝ m·t·p for Argon2, or ∝ c for PBKDF2. Attack time = f·N·W for a fraction f of the keyspace"; "FAR and FRR — P[accept | impostor] and P[reject | genuine]… trade off against each other through the decision threshold"; "Bypass probability — independent factors multiply (p₁p₂); factors verified through one channel behave like the weaker one, max(p₁, p₂)"; "Tag length versus hash length — a MAC has no birthday bound against forgery, so a **truncated HMAC-SHA-256 tag of 128 bits still gives about 128-bit forgery resistance** — unlike a 256-bit hash used for collisions."

#### `#sec-m-hmac` — "HMAC and tag length"
- Lead: "Week 6 assumes the Week 5 construction. Two properties are worth having exactly: how HMAC is built, and how many bits of its output you actually need."
- **Theorem 7, the HMAC construction**: with hash H, block size B bytes and key K padded to B bytes: "**HMAC(K, M) = H( (K ⊕ opad) ‖ H( (K ⊕ ipad) ‖ M ) )**". Why quoted: "The nested form is what makes HMAC safe with a Merkle–Damgård hash: the outer hash binds the inner digest to the key again, so **the length-extension property of H(K ‖ M) cannot be exploited to forge a tag.**"
- **Theorem 8, how long should a tag be?**: for a MAC with an n-bit output and an n-bit key, "**b_mac ≈ min(n, n_key) against forgery, versus b_coll ≈ n/2 against collisions**". "This is why **a 128-bit truncated HMAC-SHA-256 tag is a sound choice**: an attacker forging a tag must find a *specific* value, not any collision, so there is no birthday advantage and the full 128 bits of work are required. **Truncating below about 96 bits is where online forgery attempts start to matter in practice.**"
- Property→primitive table (Property needed / Primitive / Strength from SHA-256 / Why):
  - "Detect accidental change" — Hash — "128-bit collision resistance" — "Birthday bound halves the exponent"
  - "Authenticate a message to a shared-key peer" — HMAC — "Up to 256-bit forgery resistance" — "No birthday bound against forgery"
  - "Prove authorship to anyone" — Digital signature — "Set by the key, not the hash" — "Verification uses a public key, so the asset is the private key"
  - "Confidentiality *and* authenticity together" — "AEAD (e.g. AES-GCM, ChaCha20-Poly1305)" — "Set by the cipher key" — "Encryption and a tag over the ciphertext and associated data in one construction"
- Callout — "**HMAC does not give freshness.** A recorded (M, T) pair still verifies when replayed, because nothing about it is wrong. Replay protection needs **a nonce, a timestamp or a sequence number** — the same mechanism that TLS records use, and the reason a captured handshake message cannot simply be re-sent."

#### `#sec-m-tls` — "The TLS 1.3 key schedule"
- Lead: "The study page walks the handshake message by message. This section states what the messages are for: **turning one shared secret into several short-lived keys, each labelled for exactly one purpose.**"
- **Theorem 9, one secret in, several labelled keys out**: "TLS 1.3 uses **HKDF, a two-step extract-then-expand construction**. The shared secret is extracted with a salt, then expanded with an `info` label into each key it needs: **PRK = HMAC(salt, IKM), OKM = HKDF-Expand(PRK, info, L)**." "The schedule produces a separate secret per **epoch — early, handshake, application** — and within each epoch a separate key per **direction and per purpose**." Two examinable properties quoted: "**Compartmentalisation.** Compromising one traffic secret does not reveal another, because each is derived under a distinct label rather than sliced out of one long key." and "**Forward secrecy.** Handshake keys are discarded once application keys exist; the ephemeral key exchange means a later compromise of the server's certificate key does not decrypt recorded sessions."
- **Theorem 10, record protection**: "Each record is sealed with authenticated encryption using a per-record nonce and an implicit sequence number: **C = AEAD-Seal(k, nonce ‖ seq, plaintext, AAD)**." "Because the sequence number is an input to the tag, **a reordered, replayed or truncated record fails verification rather than being silently accepted.** This is the practical answer to the replay gap that a bare HMAC leaves open."
- Worked example — "mapping a Week 6 control onto the schedule": "'Encrypt data in transit, at rest and in use, and manage the keys' becomes concrete once you name which key each statement touches." Table (Control / Key or secret involved / Lifetime / Failure if mishandled):
  - "TLS in transit" — "Ephemeral key-exchange share → handshake and application traffic secrets" — "One connection" — "Recorded traffic decryptable if the exchange is not ephemeral"
  - "Certificate trust" — "CA private keys and the root trust store" — "Years, with rotation" — "**A compromised intermediate can mint valid certificates for any name**"
  - "Data at rest" — "Database, disk or object-storage keys in a managed service or HSM" — "Rotated on schedule" — "One key exposes every object it wrapped"
  - "Backup copy" — "The same key hierarchy, or an independent one" — "Retention period" — "A backup in the production account shares the blast radius"
  - "Password verifiers" — "A KDF with salt and stored parameters — **no key at all**" — "Until password change" — "Nothing to steal that would unlock every password at once"
- Quick-check: why derive several separate traffic secrets? Correct: "To compartmentalise: compromising one labelled secret does not reveal the others, and handshake keys can be discarded." Distractors: performance ("deriving a few extra keys through HKDF is cheap"); "to shorten the handshake to a single round trip" (TLS 1.3 achieves that with a single round trip, but key separation is a containment property).
- Worked answer `#sol-m2` — "sizing the crypto in one page for a design review": (1) "Student records with a multi-decade retention requirement point at **128-bit strength as the floor and 192–256 bits where a long confidentiality lifetime is claimed**. Write the number down before choosing anything." (2) "**AES-128 or AES-256** for data at rest; **SHA-256 or SHA-384** for integrity, remembering that collision resistance is half the output length; **a 256-bit elliptic curve or a 3072-bit RSA modulus** for signatures and key transport." (3) "Pick W so a legitimate login stays under a tolerable latency, then quote the offline attack time for a stated entropy assumption. At **W = 1 ms, a 40-bit secret is about 17 years of average attack; state that number rather than the word 'strong'.**" (4) "Check the components that are usually missed: **certificate chain and trust store, backup encryption with an independent key, log integrity, the session token's signing key, and the recovery path's identity evidence.** Each needs a length, an owner and a rotation date." (5) "Write the weaknesses down. Any component below the target strength, every place a shared secret is stored, and **the one path most likely to be attacked — usually recovery, because it is a human process.** A design review that names its own weakest link is worth more than one that claims none exists."
- Closing callout: "these are the numbers behind the study page's story — **entropy behind password risk, key sizes behind the encryption that did *not* fail at Harbour University, KDF cost behind the verifier the attacker stole, and the key schedule behind the TLS tunnel the stolen password travelled through.**"

---

## 2. FORMULAS AND NUMERIC DRILLS

Every quantitative relationship present on the two pages, with the page's own arithmetic reproduced and independently recomputed.

**F1 — Keyspace and entropy (math, sec-m-entropy, Theorem 1)**
`H = log₂N bits`, `N = 2^H`; for L characters from an alphabet of R: `N = R^L`, `H = L·log₂R`.
Drill: R = 62, L = 10 → H = 10 × log₂62 = 10 × 5.95 = **59.5 bits** (logs: log₂26 = 4.70, log₂52 = 5.70, log₂62 = 5.95, log₂95 = 6.57, log₂7776 = 12.92).

**F2 — Alphabet → entropy table (math, sec-m-entropy)**
| R | log₂R | 8 chars | 12 chars |
|---|---|---|---|
| 26 | 4.70 | 37.6 bits | 56.4 bits |
| 52 | 5.70 | 45.6 bits | 68.4 bits |
| 62 | 5.95 | 47.6 bits | 71.5 bits |
| 95 | 6.57 | 52.6 bits | 78.8 bits |
| 7776 | 12.92 | 5 words = 64.6 bits | 6 words = 77.5 bits |
Recomputed: 8 × 4.70 = 37.6; 12 × 4.70 = 56.4; 8 × 5.70 = 45.6; 12 × 5.70 = 68.4; 8 × 5.95 = 47.6; 12 × 5.95 = 71.4 (page: 71.5); 8 × 6.57 = 52.6; 12 × 6.57 = 78.8; 5 × 12.92 = 64.6; 6 × 12.92 = 77.5.

**F3 — Guesswork average vs worst case (math, Theorem 2)**
`G_avg ≈ N/2 = 2^(H−1)`, `G_worst = N = 2^H`. One bit of entropy = one bit of security; the average case loses one bit to the factor of two.

**F4 — 40-bit secret versus KDF cost (math, worked example)**
H = 40 ⇒ N = 2⁴⁰ ≈ **1.10×10¹²** candidates. W = 1 ms ⇒ expected guesses N/2 ≈ **5.50×10¹¹**; t = 5.50×10¹¹ × 10⁻³ s = **5.50×10⁸ s ≈ 17.4 years**. Recompute: 5.498×10¹¹ ms = 5.498×10⁸ s; ÷ 3.156×10⁷ s/yr = 17.42 yr.
W = 10 ms ⇒ **≈174 years** (verified: 174.2). Adding 10 bits of entropy multiplies N by 2¹⁰ ≈ 10³ and therefore multiplies the time by ≈1000.

**F5 — Security strength of a primitive (math, Theorem 3)**
`b_exhaustive(k) = k`; `b_collision(n) ≈ n/2`; `b_factor(k) ≈ (64/9)^(1/3) · k^(1/3) · (log k)^(2/3)`.
Consequence: an RSA modulus of k bits has **no** attack near 2^k; the number field sieve is far cheaper, so RSA moduli must be enormous.

**F6 — Birthday bound (math, def-box)**
√(2^n) = 2^(n/2) hashes ⇒ a collision is likely. A collision-resistant hash needs output **twice** the target strength; SHA-256 is quoted as **128-bit** collision resistance, not 256-bit.

**F7 — Strength-equivalence table (math, sec-m-strength)**
80 bits ↔ 3DES (2-key) / SHA-1 160-bit / RSA 1024-bit / 160-bit curve — Deprecated.
112 bits ↔ AES-128 (or 3DES 3-key) / SHA-224 / RSA 2048-bit / 224-bit curve — Minimum acceptable.
128 bits ↔ AES-128 / SHA-256 / RSA 3072-bit / 256-bit curve — Standard target.
192 bits ↔ AES-192 / SHA-384 / RSA 7680-bit / 384-bit curve — Comfortable margin.
256 bits ↔ AES-256 / SHA-512 / RSA 15360-bit / 521-bit curve — Long-lived data.
Asymmetry drill: 128 → 256 bits symmetric costs **16 extra key bytes**; the matching RSA jump 3072 → 15360 is a **five-fold modulus increase** (15360 ÷ 3072 = 5) with "an order-of-magnitude slowdown".

**F8 — KDF work factor and attack time (math, Theorem 4)**
`W ∝ m · t · p` (Argon2 family); PBKDF2: `W ∝ c · H(·)`; `t_attack = f · N · W`; `t_attack,avg = N · W / 2`.
bcrypt: work = `2^c` — every increment of the cost factor doubles the work. Doubling m or t doubles both the defender's login cost and the attacker's per-guess cost.

**F9 — Stored verifier and login comparison (math, sec-m-hashing def-box)**
`v = KDF(password, salt, m, t, p)`; login checks `KDF(candidate, salt, m, t, p) ≟ v`. Store = verifier + salt + algorithm parameters; missing parameters ⇒ unverifiable account after a migration; rotating parameters requires re-derivation at the next successful login (the plaintext is unavailable).

**F10 — Salt semantics (math, warning box; JS verifier stepper)**
Salt is unique per account and stored openly. It defeats precomputed tables and prevents two identical passwords sharing a verifier. It does **not** slow a single guess and does **not** help against a targeted single-account attack. Leak scenario given: 50,000 verifiers, 16-byte salt, Argon2id m = 64 MiB, t = 3, p = 1.

**F11 — Independent vs dependent factors (math, Theorem 5)**
Independent: `p_bypass = p₁ · p₂`. Same-channel (one phishing page relaying both): `p_bypass ≈ max(p₁, p₂)`.
Drill: p₁ = p₂ = 0.01 ⇒ independence 0.01 × 0.01 = **10⁻⁴**; dependence max(0.01, 0.01) = **10⁻²** — a **hundredfold** difference from the verification channel alone.
TOTP-in-the-same-page case: genuine MFA against password theft, but strength collapses toward the weaker factor, not the product.

**F12 — FAR / FRR and the operating point (math, Theorem 6)**
`FAR(τ) = Pr[accept | impostor]`, `FRR(τ) = Pr[reject | genuine]`. Tighten τ ⇒ FAR ↓, FRR ↑; loosen ⇒ the reverse. Curves cross at the **crossover error rate (CER)**. Threshold choice is policy: "unlocking a phone is not the same risk as authorising a payroll change."

**F13 — Lockout as a rate limit (math, worked example)**
`p_success = 1 − (1 − 1/N)^A ≈ A/N` for A ≪ N.
N = 2⁴⁰, A = 10 ⇒ p ≈ 10 / 1.10×10¹² ≈ **9.1×10⁻¹²** per account per day (recomputed 9.095×10⁻¹²).
U = 50,000 accounts with per-account p = 10⁻³ ⇒ E[compromised] = 50,000 × 10⁻³ = **50 accounts**.
(Note the contrast the page draws: the A/N figure above applies when the guess must land on one specific secret; the spraying example instead assumes a weak-password success rate of 10⁻³ per account, which is what yields 50.)
For completeness, the same A/N arithmetic with p = 9.1×10⁻¹² across 50,000 accounts gives 4.5×10⁻⁷ expected compromises — the page does not compute this, but it shows why the weak-password assumption is the dangerous one.

**F14 — Lockout policy rated against the arithmetic (math, sol-m1)**
8-character human-chosen password is **not** 95⁸; a dictionary word with substitutions gives an effective keyspace of **10⁴–10⁶** candidates; assume optimistically **2³⁰**.
Offline: W = 1 ms ⇒ average attack 2²⁹ × 10⁻³ s ≈ **6.2 days per account on a single core** (recomputed: 536,870,912 ms = 536,870.9 s = 6.21 days), trivially parallelised.
Online: A = 5 ⇒ p ≈ 5/2³⁰ ≈ **4.7×10⁻⁹** per account (recomputed 4.657×10⁻⁹); across 50,000 accounts ⇒ **2.3×10⁻⁴** expected compromises per day (recomputed 2.328×10⁻⁴).
Fix order: (1) close recovery; (2) raise the entropy floor; (3) add independent-channel MFA; (4) monitor at population level.

**F15 — HMAC construction (math, Theorem 7)**
`HMAC(K, M) = H( (K ⊕ opad) ‖ H( (K ⊕ ipad) ‖ M ) )`, K padded to B bytes. Nesting defeats the length-extension attack on `H(K ‖ M)`. JS stepper adds: SHA-256 inner digest = **32 bytes**, message padded to **512-bit blocks**.

**F16 — Tag length vs hash length (math, Theorem 8)**
`b_mac ≈ min(n, n_key)` against forgery; `b_coll ≈ n/2` against collisions.
128-bit truncated HMAC-SHA-256 tag = sound (**≈128-bit forgery resistance**, no birthday advantage because the forger must hit a specific value). Truncating **below about 96 bits** is where online forgery attempts start to matter.
Cross-check with the property table: SHA-256 as a hash ⇒ 128-bit collision resistance; HMAC-SHA-256 with a full-length tag ⇒ up to 256-bit forgery resistance.

**F17 — TLS 1.3 key schedule (math, Theorem 9)**
`PRK = HMAC(salt, IKM)`; `OKM = HKDF-Expand(PRK, info, L)`. Separate secret per epoch (early, handshake, application), and per direction and purpose within an epoch. Compartmentalisation + forward secrecy (handshake keys discarded; ephemeral exchange ⇒ later compromise of the certificate key does not decrypt recorded sessions).

**F18 — Record protection (math, Theorem 10)**
`C = AEAD-Seal(k, nonce ‖ seq, plaintext, AAD)`. Because seq is an input to the tag, reordered / replayed / truncated records fail verification. This closes the replay gap that a bare HMAC leaves open (matching the study page's AEAD + per-record nonces and sequence numbers).

**F19 — Key-to-control mapping lifetimes (math, worked example)**
TLS traffic secrets: **one connection**. CA private keys / root trust store: **years, with rotation** (a compromised intermediate mints valid certificates for any name). Data-at-rest keys: **rotated on schedule** (one key exposes every object it wrapped). Backup copy: **retention period** (a backup in the production account shares the blast radius). Password verifiers: **until password change**, and there is **no key at all** to steal.

**F20 — TLS 1.3 message-plane arithmetic (study, sec-channel)**
Two of the five listed message rows are **clear** (ClientHello; ServerHello), three are **encrypted** (EncryptedExtensions/Certificate/CertificateVerify/Finished; Client Finished; application data). What an observer keeps: **SNI (server name), packet sizes, timings** — and nothing else of substance.
Incident arithmetic from the study page: **8:03 a.m. → 8:17 a.m. = 14 minutes**; **8,000 records**; **≈50,000 students and staff**; cloud monitoring example **09:12 Australia → 09:14 Germany → 09:15 40,000 records downloaded**.

**F21 — Cloud/design-review sizing rules (math, sol-m2)**
Student records with multi-decade retention ⇒ **128-bit strength floor**, 192–256 bits where a long confidentiality lifetime is claimed. Then AES-128/AES-256 at rest; SHA-256/SHA-384 for integrity *with collision resistance = half the output length*; a 256-bit curve or 3072-bit RSA modulus for signatures and transport; quote the offline attack time for a stated entropy assumption (W = 1 ms, 40-bit secret ≈ **17 years**).

**Not present on either page (do not author questions on these):** modular arithmetic and modular reduction; modular exponentiation; XOR-pad drills beyond the HMAC ipad/opad construction; RSA key generation or encryption steps; Diffie–Hellman step tracing; brute-force enumeration arithmetic beyond keyspace/guesswork; explicit "bits of security vs wall-clock" conversion tables beyond F4/F14.

---

## 3. PITFALLS

1. **"The breach must be a cryptographic failure"** is wrong because no cipher was broken and no key was cracked; the page says the attacker "logged in as an authorised user", and the exam framing is "the data was encrypted, but the attacker logged in as an authorised user."
2. **"TLS should have stopped the exfiltration"** is wrong because the handshake authenticates the *server* to the client and optionally the client by certificate, not the human; the page says "a stolen password travels happily inside a perfectly valid TLS 1.3 tunnel."
3. **"A password plus a PIN is two-factor authentication"** is wrong because factors count separately "only when each is independently verified"; the page says "Password + PIN is two steps but one factor category."
4. **"Passwords should be encrypted in the store"** is wrong because encryption is reversible, so the decryption key becomes a single point of failure for every stored password; the page says the server "never needs to recover the original password".
5. **"A strong hash makes a weak password safe"** is wrong because hashing "does not make weak passwords strong — it raises the cost of guessing them"; the page's own arithmetic prices a 30-bit secret at about 6.2 days of average offline attack even at W = 1 ms.
6. **"A salt protects a single guess"** is wrong because "a salt does not slow a single guess"; the page says "the salt removes a shortcut; the cost parameter sets the price of a direct guess", and a leaked store is attacked "offline, no rate limit, no lockout".
7. **"Per-account lockout stops guessing attacks"** is wrong because "per-account lockout does not bound a horizontal attack"; the page shows A = 10 across 50,000 accounts as password spraying, "chosen precisely because it stays under per-account lockout."
8. **"Changing an ID in a URL is an authentication bug"** is wrong because the credential was valid; the page says "changing an ID in a URL is a broken *authorisation* control, not a failed authentication", and "scoring the wrong layer loses the marks."
9. **"A bare hash gives integrity and authenticity"** is wrong because a hash only "detects change when compared with a trusted reference" and "does not say who changed the value"; the page says integrity needs "hashes, signatures and protected logs together", and anyone who can edit the row can recompute the digest.
10. **"SHA-256 gives 256-bit security"** is wrong because of the birthday bound; the page says collision resistance is n/2, "which is why SHA-256 is quoted as 128-bit collision resistance rather than 256-bit", and a bare hash cannot attribute the change anyway.
11. **"A 128-bit HMAC tag is half as strong as a 256-bit hash"** is wrong because "MACs have no birthday bound"; the page says the forger must find a *specific* value so "the full 128 bits of work are required" — unlike collisions, and only below about 96 bits does truncation start to matter online.
12. **"HMAC also prevents replay"** is wrong because "HMAC does not give freshness"; the page says a recorded (M, T) "still verifies when replayed, because nothing about it is wrong" — replay protection needs "a nonce, a timestamp or a sequence number."
13. **"Backups give us availability and confidentiality"** is wrong because the page warns "backups support availability and recovery — they do not automatically provide confidentiality"; also, a nightly backup in the production cloud account "is not yet a recovery control: it is not isolated from the production account and its restore path has never been verified."
14. **"The provider is responsible because the storage service is theirs"** is wrong because "customer-controlled configuration is a customer responsibility"; the page frames this as "security *in* the cloud", notes "shared responsibility is not shared blame", and says the boundary "changes across IaaS, PaaS, SaaS and the service contract."
15. **"Encryption at rest should have stopped a valid session from reading records"** is wrong because "a valid session receives plaintext because the application must use the data"; the page says "encryption protects particular data states. It does not override application authorisation."
16. **"Administrators should get push approval because it is the strongest available MFA"** is wrong because push is the weakest second factor against push fatigue and admins are the highest-value population; the page says "push approval for administrators is the highest-privilege role on the weakest second factor", and the answer is "a security key or passkey" with number matching at minimum.
17. **"Recovery can be fixed later because it is only a help-desk process"** is wrong because "recovery is an authentication path"; the page says the name-plus-date-of-birth path "bypasses every stronger method above it, which is principle 5 in the negative", and by p_bypass ≈ max(pᵢ) it "sets the security of the whole design."

---

## 4. TESTABLE CLAIMS (each tagged with its anchor)

1. `#sec-incident` — Harbour University's breach involved a valid staff login at 8:03 a.m. and 8,000 student records accessed by 8:17 a.m., with no cipher broken and no key cracked.
2. `#sec-incident` — The four pause-and-think questions that structure an incident answer are Identity (who logged in?), Access (what could they reach?), Data (where did it travel?) and Cloud (who owned each control?), answered in that order.
3. `#sec-system-auth` — The order of the three decisions is always "claim identity → verify evidence → evaluate permission": identification, authentication, authorisation.
4. `#sec-system-auth` — The three classic factor categories are something she knows (password), something she has (registered phone) and something she is (fingerprint), and factors count separately only when each is independently verified.
5. `#sec-system-auth` — Principle 5 of the deck's five principles is that recovery must be secure, "because a weak fallback bypasses the strongest primary method."
6. `#sec-methods` — A security key or passkey is the preferred method for phishing-resistant and high-risk authentication because the portal stores only the matching public key and the private key is never sent to the university.
7. `#sec-methods` — Push fatigue is an attack that "does not defeat MFA; it recruits the user", countered by number matching, prompt rate limits, and treating an unexpected prompt as a reportable event.
8. `#sec-methods` — Biometrics are probabilistic matches against a protected template and cannot be reissued, which is why liveness checks, secure hardware, retry limits and a protected fallback are required.
9. `#sec-authz` — The deck's five-role ladder is student, tutor, lecturer, unit coordinator and administrator, and it is a ladder of scope, not status: scope should match responsibility, not status.
10. `#sec-authz` — Least privilege means granting the minimum scope, actions and duration required for the task, because a compromised account then reaches fewer records and fewer actions.
11. `#sec-authz` — Separation of duties means no single person controls the whole process: the lecturer proposes marks, the coordinator reviews and approves, the system publishes results.
12. `#sec-authz` — Broken object-level authorisation is the finding when a logged-in student with ID 1042 changes a URL to `GET /marks/1043` and the server does not check whether the subject may access that object.
13. `#sec-data` — The four classifications are Public (course handbook), Internal (staff meeting notes), Confidential (student marks) and Restricted (payroll, medical records), and data must be classified before access, protection and retention are decided.
14. `#sec-data` — The five parts of accountability evidence are time (09:02:14), actor (Alice, 1042), action (viewed marks), resource (student 1042) and context (Sydney, 203.x.x.x); an unread log is a cost, not a control.
15. `#sec-channel` — In TLS 1.3 only ClientHello and ServerHello travel in the clear, carrying the client random, offered cipher suites, key shares and SNI; the certificate chain and everything after ServerHello are encrypted.
16. `#sec-channel` — A leaf certificate is valid only if an intermediate CA signed it and a root CA the client already trusts signed the intermediate; verification checks the signature chain, the validity window, the name and revocation status, and removing any link leaves the chain proving nothing.
17. `#sec-availability` — DoS and DDoS have the same goal and differ only in scale; an availability failure is still a security failure even though no data was read or changed.
18. `#sec-availability` — A backup becomes a recovery control only when it is isolated/immutable and its restore has been tested; backups support availability and recovery but do not provide confidentiality.
19. `#sec-cloud` — Shared responsibility splits "security *of* the cloud" (physical security, hardware and storage infrastructure, core networking and hypervisor, provider-managed service components) from "security *in* the cloud" (identities, authentication and authorisation, customer-controlled configuration, applications, data, backups, retention and recovery).
20. `#sec-cloud` — The cloud key lifecycle is generate, distribute, use, rotate, revoke and destroy (under dual control), and rotation is what makes the difference between one exposed key and one exposed dataset.
21. `#sec-cloud` — Monitoring turns collected logs into detection by looking for impossible travel, large downloads, repeated failures and privilege changes; "collection creates evidence; monitoring creates detection."
22. `#sec-recap` — The study page's four-layer framing is identity → permissions → data protection → secure cloud operations, and "encryption is not authentication" is the whole incident in one sentence.
23. `#sec-m-entropy` — Entropy is H = log₂N bits, for an L-character password drawn uniformly from R characters N = R^L and H = L·log₂R, and average guesswork is N/2 = 2^(H−1) against a worst case of N = 2^H.
24. `#sec-m-strength` — Security strength b means the best known attack needs about 2^b operations: a k-bit symmetric key gives b ≈ k, an n-bit hash gives about n/2 against collisions by the birthday bound, and a k-bit RSA modulus is far weaker than 2^k because the number field sieve is cheaper.
25. `#sec-m-strength` — The equivalence table pairs 112-bit strength with AES-128/SHA-224/2048-bit RSA/224-bit curves, 128-bit strength with AES-128/SHA-256/3072-bit RSA/256-bit curves, and 256-bit strength with AES-256/SHA-512/15360-bit RSA/521-bit curves.
26. `#sec-m-hashing` — Argon2id, scrypt, bcrypt and PBKDF2 are the acceptable password-hashing functions, with work W ∝ m·t·p for Argon2 and W ∝ c for PBKDF2, and bcrypt work = 2^c.
27. `#sec-m-hashing` — The stored record is the derived verifier plus the salt plus the algorithm parameters, because the server must repeat exactly the same computation at login.
28. `#sec-m-authmath` — Independent factors multiply (p_bypass = p₁p₂) while factors verified through one channel behave like the weaker one (p_bypass ≈ max(p₁, p₂)); with p₁ = p₂ = 0.01 that is 10⁻⁴ versus 10⁻².
29. `#sec-m-authmath` — FAR(τ) = Pr[accept | impostor] and FRR(τ) = Pr[reject | genuine] move in opposite directions as the threshold changes, and they cross at the crossover error rate (CER).
30. `#sec-m-authmath` — Per-account lockout bounds attempts against one account but not password spraying across many accounts; A = 10 across 50,000 accounts at 10⁻³ per account yields 50 expected compromises.
31. `#sec-m-hmac` — A 128-bit truncated HMAC-SHA-256 tag is sound because forgery requires a specific value, not any collision, so there is no birthday advantage; truncating below about 96 bits is where online forgery attempts start to matter.
32. `#sec-m-hmac` — HMAC does not give freshness: a recorded (M, T) pair still verifies on replay, so replay protection needs a nonce, a timestamp or a sequence number.
33. `#sec-m-tls` — TLS 1.3 uses HKDF extract-then-expand (PRK = HMAC(salt, IKM), OKM = HKDF-Expand(PRK, info, L)) to derive a separate secret per epoch (early, handshake, application) and per direction and purpose.
34. `#sec-m-tls` — AEAD record sealing includes the implicit sequence number in the tag input, so reordered, replayed or truncated records fail verification rather than being silently accepted.

---

## 5. ANCHOR INDEX

chapter6-study.html#hero - Week 6 overview: title, NIST digital identity guidance, four hero cards, deck provenance
chapter6-study.html#sec-incident - The Incident: Harbour University timeline, 50,000 users, 8,000 records, the four-layer table
chapter6-study.html#sec-system-auth - System Authentication: identification vs authentication vs authorisation, factor categories, five principles
chapter6-study.html#sec-methods - Auth Methods: password / TOTP / push / passkey table, push fatigue, biometrics, adaptive auth, recovery
chapter6-study.html#sec-authz - Authorisation: five-role ladder, RBAC pairs, least privilege, separation of duties, object-level authorisation
chapter6-study.html#sec-data - Data Security: classification table, in transit / at rest / in use, minimisation, accountability, integrity cards
chapter6-study.html#sec-channel - Secure Channel: TLS 1.3 message table, certificate chain, what the handshake hides, HMAC/TLS steppers
chapter6-study.html#sec-availability - Availability: DoS/DDoS, ransomware, resource exhaustion, failure, human error, dependency outage; recovery chain
chapter6-study.html#sec-cloud - Cloud Security: opportunities/risks, cloud hotspot map, shared responsibility, key lifecycle
chapter6-study.html#sec-recap - Recap: six toolkit cards, cloud-migration audit, authentication design rating, final framing
chapter6-study.html#ix-auth-journey - Interactive stepper: the journey a login actually takes (7 frames)
chapter6-study.html#ix-verifier - Interactive stepper: from entered password to stored verifier (6 frames)
chapter6-study.html#ix-tls - Interactive stepper: TLS 1.3 handshake message by message (6 frames)
chapter6-study.html#ix-hmac - Interactive stepper: HMAC-SHA-256 tag cannot be reused after tampering (5 frames)
chapter6-study.html#ix-rbac-scope - Interactive race chart: five roles, illustrative 0-5 access scope
chapter6-study.html#ix-cloud - Interactive hotspot host: where the decisions live in the Harbour University cloud
chapter6-study.html#ix-attacks - JSON data: match the password attack to its countermeasure (4 pairs)
chapter6-study.html#ix-rbac - JSON data: RBAC role-to-permission pairs (5 pairs)
chapter6-study.html#ix-integrity - JSON data: integrity-control card deck (6 cards)
chapter6-study.html#ix-cloud-map - JSON data: cloud hotspot map points (6 markers + layered SVG)
chapter6-study.html#ix-ransomware - JSON data: order the ransomware recovery chain (5 steps)
chapter6-study.html#sol-1 - Worked solution: explaining the breach to the Harbour University council (4 moves)
chapter6-study.html#sol-2 - Worked solution: auditing a cloud migration against the deck's activity (4 headings + verdict)
chapter6-study.html#sol-3 - Worked solution: rating an authentication design for a student portal (5 steps)
chapter6-math.html#sec-m-hero - Foundations hero: what the page makes quantitative, four chips
chapter6-math.html#sec-m-entropy - Entropy and guesswork: H = log₂N, keyspace table, average vs worst case, 40-bit worked example
chapter6-math.html#sec-m-strength - Security strength and equivalent key sizes: b formulas, birthday bound, strength table, key-selection checklist
chapter6-math.html#sec-m-hashing - Password hashing cost: W ∝ m·t·p, Argon2id/scrypt/bcrypt/PBKDF2 table, verifier + salt + parameters, salt limits
chapter6-math.html#sec-m-authmath - Factors, false accepts and lockouts: p_bypass, FAR/FRR/CER, lockout arithmetic, control table, policy rating
chapter6-math.html#sec-m-hmac - HMAC and tag length: nested construction, b_mac ≈ min(n, n_key), tag-truncation guidance, no freshness
chapter6-math.html#sec-m-tls - TLS 1.3 key schedule: HKDF, per-epoch/per-direction keys, AEAD-Seal with nonce and seq, key-lifetime table
chapter6-math.html#ix-m-strength - JSON data: match each primitive to its security strength (6 pairs)
chapter6-math.html#ix-m-checklist - JSON data: order the key-selection checklist (5 steps)
chapter6-math.html#ix-m-terms - JSON data: self-test card deck of quantities defined on the page (7 cards)
chapter6-math.html#sol-m1 - Worked answer: rating a proposed login policy with the arithmetic (5 steps)
chapter6-math.html#sol-m2 - Worked answer: sizing the crypto in one page for a design review (5 steps)

(Other ids present in the files but structural rather than topical: `chapter6-study.html#sidebar`, `#sidebarToggle`, `#mainContent`; `chapter6-math.html#mainContent`.)

---

## 6. GRAPH SEEDS

### Study-page concept graph (16 nodes)

| id suggestion | label | one-sentence definition from the page | anchor |
|---|---|---|---|
| `c6-harbour-incident` | Harbour University breach | At 8:03 a.m. a staff login succeeds with a valid password and by 8:17 a.m. 8,000 student records have been accessed — "the data was encrypted, but the attacker logged in as an authorised user." | `#sec-incident` |
| `c6-identification` | Identification | "Who do you claim to be?" — Alice enters `alice@harbour.edu.au` and the portal learns which account is being claimed, but nothing has been proven. | `#sec-system-auth` |
| `c6-authentication` | Authentication | "Can you prove the claim?" — the decision that failed at Harbour University, because the credential was genuine but the right person was never established. | `#sec-system-auth` |
| `c6-authorisation` | Authorisation | "What may you do?" — policy allows Alice to view `/marks/1042` and not `/marks/1043`. | `#sec-authz` |
| `c6-factor-categories` | Factor categories (know / have / are) | Three kinds of evidence — a secret in memory, a device or key she controls, a biometric trait — which "count separately only when each is independently verified." | `#sec-system-auth` |
| `c6-mfa-counting-rule` | MFA counting rule | "Password + PIN is two steps but one factor category" — two passwords, two TOTP apps on one phone, or a password plus a push to the same device are one category wearing two hats. | `#sec-system-auth` |
| `c6-strong-auth-principles` | Five principles of strong authentication | Identity is never absolute; passwords alone are not enough; independent factors are stronger; authentication is continuous; recovery must be secure. | `#sec-system-auth` |
| `c6-passkey` | Passkey / security key | The device creates and protects a private key, the portal stores only the matching public key, and the signature is origin-bound so it cannot be replayed to a look-alike domain. | `#sec-methods` |
| `c6-push-fatigue` | Push fatigue | Repeated prompts pressure a user into approving an attacker's session — "the attack does not defeat MFA; it recruits the user." | `#sec-methods` |
| `c6-recovery-path` | Recovery as an authentication path | "I lost my phone" → weak identity check (name plus date of birth) → account reset → attacker takes control; recovery is often the weakest authentication path in the system. | `#sec-methods` |
| `c6-rbac` | RBAC and the five-role ladder | RBAC assigns permissions to roles and users inherit them through role membership; student, tutor, lecturer, unit coordinator and administrator form a ladder of scope, not status. | `#sec-authz` |
| `c6-least-privilege` | Least privilege | Grant the minimum scope, actions and duration required for the task, so that if the account is compromised the attacker reaches fewer records and fewer actions. | `#sec-authz` |
| `c6-broken-object-authz` | Broken object-level authorisation | A logged-in student with ID 1042 requests `GET /marks/1043` and the server never checks whether that subject may act on that object — "an authorisation finding", not a failed authentication. | `#sec-authz` |
| `c6-data-classification` | Data classification and states | Public, Internal, Confidential and Restricted data must be classified before access, protection and retention are decided, and each state — in transit, at rest, in use — has its own controls. | `#sec-data` |
| `c6-tls13-handshake` | TLS 1.3 handshake | ClientHello and ServerHello travel in the clear to establish a shared secret and handshake keys, after which the certificate chain, CertificateVerify, Finished and all application data are encrypted. | `#sec-channel` |
| `c6-backup-recovery` | Availability and tested recovery | Availability is "prevent disruption + recover quickly": Isolated, immutable backups plus tested restores are what make a backup a recovery control, and backups do not provide confidentiality. | `#sec-availability` |
| `c6-cloud-shared-responsibility` | Cloud shared responsibility | The provider secures the cloud (physical, hardware, core networking, hypervisor) while the customer secures what is in it (identities, authorisation, customer-controlled configuration, applications, data, backups). | `#sec-cloud` |
| `c6-cloud-key-lifecycle` | Cloud key lifecycle | Every key is generated, distributed, used, rotated, revoked and destroyed under dual control, and "rotation is what makes the difference between one exposed key and one exposed dataset." | `#sec-cloud` |
| `c6-identity-control-plane` | Identity as the control plane | In the cloud "identity becomes a primary control plane" — requests are evaluated by authentication, then authorisation plus context, then the application action, because location alone is no longer sufficient trust. | `#sec-cloud` |
| `c6-monitoring-detection` | Monitoring turns logs into detection | Look for impossible travel, large downloads, repeated failures and privilege changes; "collection creates evidence; monitoring creates detection." | `#sec-cloud` |

(That table lists 20 rows; trim to 16 by merging `c6-identification`/`c6-authentication`/`c6-authorisation` into one `c6-identify-authn-authz` node or by dropping `c6-monitoring-detection` and `c6-rbac` if a smaller graph is wanted. The 16 that carry the most examinable weight: harbour-incident, identification, authentication, authorisation, factor-categories, mfa-counting-rule, strong-auth-principles, passkey, push-fatigue, recovery-path, rbac, least-privilege, broken-object-authz, data-classification, tls13-handshake, backup-recovery, cloud-shared-responsibility, cloud-key-lifecycle, identity-control-plane, monitoring-detection — any 16 of these are page-grounded.)

### Math-page foundations graph (8 nodes)

| id suggestion | label | one-sentence definition from the page | anchor |
|---|---|---|---|
| `c6-entropy` | Entropy H | "H = log₂N bits, where N is the size of the set the secret was drawn from. It measures the choice, not the string." | `#sec-m-entropy` |
| `c6-guesswork` | Guesswork | "Average ≈ N/2 = 2^(H−1); worst case = N = 2^H. One bit of entropy is one bit of average security." | `#sec-m-entropy` |
| `c6-security-strength` | Security strength b | "The best known attack needs about 2^b operations" — a k-bit symmetric key gives b ≈ k, an n-bit hash about n/2 for collisions, and a k-bit RSA modulus far less than 2^k. | `#sec-m-strength` |
| `c6-birthday-bound` | Birthday bound | After roughly √(2^n) = 2^(n/2) hashes in an n-bit output space a collision is likely, so a collision-resistant hash needs an output twice the target strength. | `#sec-m-strength` |
| `c6-kdf-work-factor` | KDF work factor W | "W ∝ m·t·p for Argon2, or ∝ c for PBKDF2. Attack time = f·N·W for a fraction f of the keyspace." | `#sec-m-hashing` |
| `c6-far-frr` | FAR and FRR | "False accept rate = P[accept \| impostor]; false reject rate = P[reject \| genuine]. They trade off against each other through the decision threshold" and cross at the crossover error rate. | `#sec-m-authmath` |
| `c6-bypass-probability` | Bypass probability | "Independent factors multiply (p₁p₂); factors verified through one channel behave like the weaker one, max(p₁, p₂)." | `#sec-m-authmath` |
| `c6-tag-vs-hash-length` | Tag length versus hash length | "A MAC has no birthday bound against forgery, so a truncated HMAC-SHA-256 tag of 128 bits still gives about 128-bit forgery resistance — unlike a 256-bit hash used for collisions." | `#sec-m-hmac` |
| `c6-hkdf-schedule` | HKDF key schedule | "PRK = HMAC(salt, IKM), OKM = HKDF-Expand(PRK, info, L)" — one shared secret expanded into separate per-epoch, per-direction, per-purpose keys. | `#sec-m-tls` |
| `c6-aead-record` | AEAD record protection | "C = AEAD-Seal(k, nonce ‖ seq, plaintext, AAD)" — including the sequence number in the tag is what makes reordering, replay and truncation fail verification. | `#sec-m-tls` |

---

## 7. FLASHCARD SEEDS

1. **Front:** What single sentence explains the Harbour University incident?
   **Back:** "Encryption can protect the channel; it cannot prove the right human is using the account." At 8:03 a.m. a staff login succeeded with a valid password and by 8:17 a.m. 8,000 student records had been read — the data was encrypted, but the attacker logged in as an authorised user. (`#sec-incident`)

2. **Front:** Identification, authentication, authorisation — what is each one asking, and in what order?
   **Back:** Identification: who do you claim to be? (`alice@harbour.edu.au`). Authentication: can you prove the claim? (verify the passkey response). Authorisation: what are you permitted to do? (policy allows `/marks/1042`, denies `/marks/1043`). The order is always claim identity → verify evidence → evaluate permission. (`#sec-system-auth`)

3. **Front:** A portal requires a password and then a memorised PIN. How many factors is that, and why?
   **Back:** One factor, two steps. Factors "count separately only when each is independently verified", and both secrets come from the knowledge category — so a single successful phishing or observation attack can compromise both. (`#sec-system-auth`)

4. **Front:** Why hash a password instead of encrypting it, and what does hashing not do?
   **Back:** Encryption is reversible, so a stolen key exposes every stored password at once; hashing is one-way verification — the server derives a candidate verifier and compares, and never needs to recover the original. Hashing does not make weak passwords strong; it raises the cost of guessing them. (`#sec-methods`, `#sec-m-hashing`)

5. **Front:** What does a TLS 1.3 handshake prove — and what does it not prove?
   **Back:** It proves the server holds the private key for a certificate chaining to a trusted root (ClientHello/ServerHello in clear establish handshake keys; CertificateVerify signs the transcript). It does not authenticate the human: "a stolen password travels happily inside a perfectly valid TLS 1.3 tunnel." (`#sec-channel`)

6. **Front:** How much entropy does a 10-character password have if drawn uniformly from 62 characters, and how many guesses does an attacker expect?
   **Back:** H = L·log₂R = 10 × log₂62 ≈ 10 × 5.95 = 59.5 bits; N = 62¹⁰ ≈ 8.4×10¹⁷ candidates, and the average attack expects N/2 = 2^(H−1) guesses. The uniform-draw assumption is doing the work — a human-chosen 10-character password has far less. (`#sec-m-entropy`)

7. **Front:** A leaked database has 50,000 salted Argon2id verifiers (m = 64 MiB, t = 3, p = 1). Were the salts the protection?
   **Back:** No. A salt removes the precomputation shortcut and stops identical passwords sharing a verifier, but it "does not slow a single guess at all". The cost parameter sets the price of a direct guess, the attack is offline with no rate limit, and weak passwords still fall — which is why the deck pairs slow hashing with unique passwords, a password manager, MFA/passkeys and monitoring. (`#sec-m-hashing`)
