# INFO5995 — Chapter 7 Digest: Secure Network, TCP/UDP, TLS and HTTPS

**Sources read in full (861 + 747 lines):**

- `Usyd-Mastery/INFO5995/chapters/chapter7/web/chapter7-study.html` — Week 7 study guide ("Secure Network, TCP/UDP, TLS and HTTPS")
- `Usyd-Mastery/INFO5995/chapters/chapter7/web/chapter7-math.html` — Week 7 Foundations page ("the arithmetic of a connection that has to be trusted")

**Standards named by the pages:** RFC 8446 (TLS 1.3), RFC 6797 (HSTS), RFC 5280 (X.509 PKI path validation), NIST SP 800-52 Rev 2 (TLS deployment policy), RFC 8996 (deprecation of TLS 1.0/1.1), RFC 9293 (TCP), RFC 6298 (RTO estimation), RFC 5869 (HKDF), NIST SP 800-57 Part 1 Rev 5 (key-strength equivalence), CA/Browser Forum (398-day certificate lifetime), BCP 38 (ingress/egress filtering).

**Where the numbers come from (math page, verbatim framing):** "Header and record sizes from RFC 8446 / RFC 9293", "Key sizes from NIST SP 800-57 Part 1 Rev 5", "RTT budgets and overheads worked numerically". The math page adds: "Where the deck writes in prose, the symbols here are a revision aid, not lecture notation."

---

## 1. SECTION-BY-SECTION FACTS

### A. `chapter7-study.html`

#### `#hero` — Overview (week framing)
- Title: "Week 7: Secure Network, TCP/UDP, TLS and HTTPS". Subtitle: "Your login may already be verified — but your data still has to travel."
- Hero cards (the week in four claims): "Untrusted path: read, change, pretend, block"; "IP best effort → UDP datagrams → TCP byte stream"; "TLS 1.3: confidentiality, integrity, authenticated identity"; "HTTPS, HSTS and deployment mistakes".
- Provenance line: "Built from the Week 7 lecture deck (*Secure Network, TCP/UDP, TLS and HTTPS*) and the standards behind it: RFC 8446 (TLS 1.3), RFC 6797 (HSTS), RFC 5280 (X.509 PKI) and NIST SP 800-52 Rev 2."
- Sidebar section order (the page's own table of contents): Overview (`#hero`), Packets on the Wire (`#sec-travel`), IP, UDP & TCP (`#sec-transport`), Network Attacks (`#sec-attacks`), Man-in-the-Middle (`#sec-mitm`), Reliability vs Security (`#sec-gaps`), TLS 1.3 (`#sec-tls`), Certificates & Trust (`#sec-certs`), HTTPS in Practice (`#sec-https`), Implementation Failures (`#sec-impl`), Recap (`#sec-recap`).
- Sidebar also links out to the Foundations page (`chapter7-math.html`), the mind map, the Quiz Hub and Flashcards. Progress bar is at 100% with the caption "Week 7 built from lecture material".
- Meta description (the page's own summary): "what IP, UDP and TCP do and do not guarantee, port scanning, SYN floods and spoofing, the man-in-the-middle model, and how TLS 1.3 and correctly deployed HTTPS close the gaps."

#### `#sec-travel` — Packets on an Untrusted Path
- Framing claim from the deck, quoted: "network security protects data while it moves across untrusted networks." Everything else in the week (IP, UDP, TCP, TLS, HTTPS) "is machinery for doing that in a place where every hop is somebody else's equipment."
- The lecture traces one email laptop → mailbox to make the path concrete, and the page states nothing about it is email-specific: "the same six steps describe an HTTP request, a bank transfer or a DNS lookup."
- Interactive `#ix-journey` — "What actually happens when you press Send", "Six steps from the Week 7 deck. The message never travels as one object, and no single party can see the whole path": (1) Compose and send — device hands the message to the Wi-Fi router, "the application layer has finished its job"; (2) Split into packets — "Size is bounded by the link MTU"; (3) Cross many networks — "Your router, your ISP, other ISPs and many routers along the way. Packets can take different routes"; (4) Reach the destination — recipient's mail server, "collected from wherever each one travelled"; (5) Reassemble — "Order is restored here, not on the wire"; (6) The recipient reads it — "The message is now in a mailbox on a device that also belongs to somebody else."
- Four-things table — attacker action / deck wording / property at risk / where Week 7 answers it:
  - **Read** — "Eavesdrop on private data" — **Confidentiality** — "TLS record encryption".
  - **Change** — "Modify transactions in transit" — **Integrity** — "AEAD authentication tag on every record".
  - **Pretend** — "Impersonate a server or a user" — **Authenticity / trust** — "Certificates, signatures and hostname validation".
  - **Block** — "Disrupt the connection" — **Availability** — "Segmentation, rate limiting, upstream scrubbing".
- Terminology definition, quoted: "**Unprotected data** is data that is readable or modifiable by any device on the path." The deck's mental model is "a chain of custody: your device, your router, your ISP, other networks, the destination network, the destination host — each one a place where a copy or an edit can happen."
- Scope limit, quoted: "**Data in transit** is the only thing this week's controls protect; data at rest and application logic are separate problems."
- Exam framing: "'the internet is untrusted' is not an argument, it is a premise. The markable version names the four capabilities (read, change, pretend, block), maps each to a property, and then says which layer supplies the property."

#### `#sec-transport` — IP, UDP and TCP: What Each Layer Promises
- IP: "Every packet carries a destination IP address and is forwarded hop by hop." Packets can be "**lost**, **late**, **out of order** or **duplicated**." "IP does not promise delivery, order or uniqueness — which is exactly why UDP and TCP sit above it."
- UDP: "UDP sends independent packets with almost no overhead: no connection setup, no retransmission, no ordering guarantee. The application decides what to do about loss." It is right "when *late data is less valuable than fresh data* — voice calls, online games, and DNS queries."
- Layer table (unit of transfer / ordering / delivery / per-connection state / security):
  - **IP** — Packet — None — Best effort — None — None.
  - **UDP** — Datagram — None — Best effort — None (no setup) — None.
  - **TCP** — Byte stream — In order — Acknowledged and retransmitted — "Yes: sequence numbers, windows, timers" — **None**.
  - **TLS** — Record — Delegated to TCP — Delegated to TCP — "Yes: session keys and sequence numbers" — "Confidentiality, integrity, server identity".
- Three ideas that make TCP work (definition box): "**Sequence numbers** label every byte so the receiver can rebuild the stream and notice gaps. **Cumulative acknowledgements** tell the sender which byte is expected next — the deck's example is an `ACK 131` that means 'everything up to byte 130 arrived'. **Windows** let the receiver control how much data may be in flight, which is how TCP adapts to a slow or congested path."
- Handshake diagram (`.algo-diagram`): `SYN → SYN-ACK → ACK → ESTABLISHED`, which the deck calls "connection state before application data starts moving". Both endpoints agree to start, synchronise sequence numbers, then begin reliable transfer.
- Loss behaviour: "the receiver keeps acknowledging the byte it still expects, no progress is made, and the sender retransmits the missing range." And: "**TCP does not replace IP**: it detects problems above IP and recovers from them."
- The pivot line: "TCP makes delivery reliable, and it is *still not secure*. It offers no secrecy and no server identity. Order, acknowledgement and retransmission answer 'did it arrive?'; they say nothing about who is on the other end or who else is reading."
- Worked example `#sol-1` — read the trace, then name the guarantee (4 steps):
  1. `SYN → SYN-ACK → ACK`: **Established** — "both endpoints exist, are reachable, and have synchronised initial sequence numbers; the server has allocated connection state." **Not established** — "anything about identity. The handshake proves an address responded, not which organisation or service it belongs to."
  2. `Seq 1–40, 41–70, 71–100, 101–130` then `ACK 131`: **Established** — the receiver rebuilt an ordered byte stream "from packets that may have arrived in any order." **Not established** — "that the bytes mean what they appear to mean. Reordering is repaired; tampering is not detected."
  3. `Seq 41–70` missing, receiver keeps sending `ACK 41`: **Established** — "the sender will retransmit, because no progress triggers recovery." **Not established** — confidentiality: "Every one of those bytes crossed the path in the clear."
  4. The mark-earning sentence, quoted: "TCP answers the delivery question — order, acknowledgement and retransmission — and leaves the security questions open: whether the content was private, whether it was changed, and whether the endpoint is the server it claims to be."
- Quick-check (`#sec-transport`): a voice call drops packets and keeps going, a download stalls and recovers → correct answer: "UDP leaves loss to the application; TCP acknowledges and retransmits to deliver a complete ordered stream." Distractors rejected: encryption is not the difference ("Neither protocol is encrypted, and encryption would not change whether a lost packet is retransmitted"); and "UDP guarantees ordering and TCP does not" is simply inverted/irrelevant ("the stall is caused by retransmission on a reliable stream, not by ordering alone").

#### `#sec-attacks` — Network Attacks: Reconnaissance, Availability and Forged Identity
- "Three attack families from the deck set the agenda for the rest of the week, and each one attacks a different part of the stack."
- **1. Port scanning:** "Which network services are reachable? A scan walks a range of ports and notes which ones answer — through a completed handshake, a half-open handshake, or the way a closed port refuses." Key idea: "An open port reveals a reachable service; the risk depends on *what is running and how it is configured*. **Reconnaissance does not equal compromise** — it identifies possible entry points."
- Port table (port / service / what an attacker learns / defensive question):
  - **22** — SSH, remote login — "A remote administration surface exists and is reachable" — "Is it restricted to a management network, and is password login disabled?"
  - **80** — HTTP, web — "Plaintext web traffic is being served" — "Should it do anything except redirect to HTTPS?"
  - **443** — HTTPS, secure web — "A TLS service is reachable; the version and suites are enumerable" — "Is the minimum version enforced and the certificate chain correct?"
  - **3306** — MySQL, database — "A database is exposed beyond the application tier" — "Why is it reachable from outside the application's segment at all?"
  - **53** — DNS, name resolution — "Recursive or authoritative service, often unauthenticated" — "Is it rate limited and, where it matters, signed?"
- **2. SYN flood:** "The attacker repeats only the beginning of the handshake. The server allocates state and answers each SYN, and because no final ACK ever arrives, those entries stay in the backlog until the server gives up on them. The service may still be running, but legitimate clients struggle to connect: this is a denial-of-service attack against **availability**."
- Interactive `#ix-syn-flood` — reconstruct the flood in order: (1) "The attacker sends many SYNs, often with forged source addresses"; (2) "The server allocates state for each connection and replies with SYN-ACK"; (3) "The final ACK never arrives from the claimed client"; (4) "Each half-open entry occupies the backlog until the server gives up on it"; (5) "The backlog fills, so new legitimate SYNs are dropped"; (6) "The service is still running, but users cannot reach it".
- Why state is the vulnerability, quoted: "TCP was designed to keep connection state, and a SYN is a request to create it. The attack asks the server to make a promise — and to keep paying for it — on the word of an address that was never verified. The standard mitigation, **SYN cookies**, removes the promise: the server encodes the connection parameters into its own sequence number and allocates nothing until the ACK actually arrives."
- **3. Spoofing** — "ARP spoofing and IP spoofing operate at different layers, but both falsify addressing information so that traffic goes somewhere it should not, or appears to come from somewhere it did not."
- ARP vs IP spoofing contrast table:
  - **Scope** — "One local network segment" vs "Any network the forged packet can reach".
  - **What is forged** — "An IP-to-MAC mapping: another host's IP address appears to map to the attacker's MAC address" vs "The source IP address inside the packet header".
  - **Immediate effect** — "Traffic can be redirected through the attacker" vs "Source identity can be forged, so replies go elsewhere or nowhere".
  - **Typical use** — "Becoming the path between a victim and the gateway" vs "Reflection and amplification, and hiding the true origin of a packet".
  - **Representative controls** — "Dynamic ARP inspection with DHCP snooping, port security, 802.1X, static entries for critical hosts" vs "Ingress and egress filtering (BCP 38) and reverse-path forwarding at the network edge".
- Callout: "**Context determines the impact.** The deck's wording is careful: spoofing can enable redirection, impersonation or other attacks. The same forged address is a nuisance on a guest network and a catastrophe in front of a database segment — which is why **network segmentation** is treated as a control in its own right. Segmentation does not encrypt anything; it limits what a single foothold can reach."
- Quick-check: a SYN flood against a server still serving cached pages to existing sessions → "Availability: the backlog fills with half-open connections, so legitimate clients cannot connect." Rejected distractors: "The attacker is not reading or altering traffic — the forged SYNs never complete"; "Nothing is being replayed: the attacker never completes the handshake, so there is no captured exchange to reuse."

#### `#sec-mitm` — Man-in-the-Middle: Becoming the Path
- Definition, quoted: "A **man-in-the-middle (MITM) attack** is an *active* attack in which the adversary inserts itself between two endpoints and relays their traffic, so that each side believes it is talking directly to the other. The deck's three phases: **get in the path**, **impersonate or relay**, and **stay unnoticed**."
- Three-phase table:
  - **1. Get in the path** — "Rogue Wi-Fi, ARP spoofing, a compromised network device, a hijacked route or a poisoned name resolution" — works because "Traffic follows addressing and routing information, and neither is authenticated at the internet layer".
  - **2. Impersonate or relay** — "Terminate the connection on both sides, or forward it unchanged and copy what passes" — works because "Each endpoint authenticates a connection to its immediate peer, not an end-to-end path".
  - **3. Stay unnoticed** — "Keep latency and behaviour plausible; strip or downgrade protection where possible" — works because "Without an authenticated channel, endpoints have no independent way to compare notes".
- Interactive `#ix-path` — "Where an attacker can sit on one request's path" (SVG sketch: CLIENT "browser session / bank.example" → ROGUE AP "or ARP spoof" → ATTACKER "in the path" with **Channel 1** and **Channel 2** → internet → SERVER "certificate + key / TLS listener"; footer: "The only thing that turns interception into a detected failure: `validate the certificate AND the hostname`"). Marker details:
  - **Client** — "The endpoint that has to decide whether it is talking to the real server. Nothing on the network can make that decision for it."
  - **Local network entry point** — "Rogue Wi-Fi or a forged ARP mapping is the cheapest way into the path, because the local segment trusts address resolution."
  - **Attacker in the path** — "Now every byte crosses the adversary. Reading requires no cryptography at all if the traffic is plaintext."
  - **Untrusted internet** — "Many hops, none of them yours."
  - **Server** — "Holds the private key and presents a certificate. The server cannot tell that its peer is relaying traffic."
  - **The check that matters** — "TLS only defeats a MITM when the client validates the chain and matches the hostname. A client that ignores the warning has handed the attacker a valid session."
- What the attacker gains, mapped: **Read** → confidentiality; **Change** → integrity; **Redirect** → "trust: traffic is sent somewhere else entirely"; **Block** → availability.
- Why TCP is not the answer: "TCP will happily deliver the attacker's bytes in perfect order and retransmit anything that goes missing. Reliability is not authenticity: an ordered, acknowledged byte stream can be entirely false." The deck's transition line, quoted: "*reliable delivery is not enough; security comes from authentication plus encryption*."
- Worked example `#sol-2` — free airport Wi-Fi, certificate warning for the bank, user clicks through (5 steps):
  1. Phase: rogue access point → "this is phase 1 of the MITM model. No exploit was needed: the client chose the attacker as its gateway."
  2. What TLS did: "The attacker cannot present a certificate for the bank's name that chains to a trusted root, so the client received a name or issuer mismatch — an integrity and authentication failure, correctly detected."
  3. Where it broke: "The decision to continue. Once the user accepts the warning, the attacker is a legitimate endpoint of *that* session: read, change, redirect and block all become available, and the padlock icon afterwards means only that a TLS session exists, not that it reaches the bank."
  4. Countermeasures, in order of effect: "HSTS with `includeSubDomains` and preload removes the click-through for a known site; a certificate-pinning or policy-enforcing client refuses the connection outright; managed devices can require a trusted profile instead of a self-signed interception proxy. The network-side controls (dynamic ARP inspection, 802.1X, avoiding rogue access points) make phase 1 harder but cannot be relied on alone."
  5. Mark-earning sentence: "An active attacker on the path turns confidentiality, integrity, trust and availability into a single decision made by the client: whether to validate the server's certificate and hostname."
- Quick-check: attacker relays every byte, terminating TLS separately on each side with a certificate the client rejects → "The relay worked, but certificate validation failed, which is exactly how TLS is meant to defeat a MITM." Rejected: "TCP failed, because the relay broke the byte stream" (TCP delivered everything correctly — the failure is authentication, not delivery); "TLS was not in use" (the client had a TLS session with the attacker; what was missing was a valid binding between the server's name and the key).

#### `#sec-gaps` — Reliability Answers "Did It Arrive?" — Security Asks More
- Question → property → what answers it → what defeats it:
  - "Did the bytes arrive, in order, exactly once?" — **Reliability** — "TCP: sequence numbers, acknowledgements, retransmission, windows" — "Loss, congestion — recovered automatically".
  - "Was it private?" — **Confidentiality** — "TLS: authenticated encryption of every record" — "Plaintext protocols, a client that accepts an impostor".
  - "Was it unchanged?" — **Integrity** — "TLS: an authentication tag over each record's content and metadata" — "Applications that act on unverified data".
  - "Is the endpoint who it claims to be?" — **Authenticity** — "TLS: certificate chain, signature, hostname match" — "Skipped validation, ignored warnings, a coerced trust store".
  - "Can legitimate users still get through?" — **Availability** — "Segmentation, rate limiting, capacity and upstream filtering" — "SYN floods and other resource-exhaustion attacks".
- Stack summary, quoted: "the application produces the message, TLS protects it, TCP delivers it in order, and IP moves it. *TLS sits between the application and TCP: TCP moves the bytes; TLS makes them trustworthy.*"
- Interactive `#ix-attack-counter` — match attack to control (8 pairs):
  - Port scanning (reconnaissance) → "Inventory the services you expose, close what is unused, and restrict the rest with firewalls and segmentation".
  - SYN flood (availability) → "SYN cookies so no state is allocated before the ACK, plus backlog tuning, rate limiting and upstream scrubbing".
  - ARP spoofing (local segment) → "Dynamic ARP inspection with DHCP snooping, port security, 802.1X and static entries for critical hosts".
  - IP spoofing (forged source address) → "Ingress and egress filtering at the network edge (BCP 38) and reverse-path forwarding".
  - Man-in-the-middle interception → "TLS with certificate chain and hostname validation on the client, and no click-through on warnings".
  - Downgrade from HTTPS to HTTP → "HSTS with includeSubDomains and preload, plus a minimum TLS version policy on the server".
  - Implementation bug such as Heartbleed → "Bounds-checked input handling, rapid patching, key rotation and invalidation of exposed sessions".
  - Exposed database port 3306 → "Network segmentation: allow the application tier and nothing else, and require TLS to the database".
- Exam framing: "do not answer an attack question with a product. Answer it with the property under attack, the mechanism that supplies the property, and the failure mode that remains. 'Use TLS' is a control only if the client validates the certificate and the server enforces a minimum version."
- Quick-check: TLS enabled but minimum version TLS 1.0 and clients may ignore certificate errors → "Authenticity: with a weak minimum version and ignored certificate errors, an attacker on the path can impersonate the server" (and "taking confidentiality and integrity with it"). Rejected: reliability is TCP's job and unaffected; nothing described is a resource-exhaustion attack.

#### `#sec-tls` — TLS 1.3: Four Moves, One Secure Channel
- "Transport Layer Security protects application data before it crosses the network. The deck describes the handshake as four moves; the wire protocol implements them as a short, strictly ordered message flow."
- Layer/property table: **Application** — "Defines the message — an HTTP request or response" — "Meaning and semantics"; **TLS** — "Encrypts, authenticates and verifies the server before data crosses the network" — "Confidentiality, integrity, authentication"; **TCP** — "Delivers a reliable, ordered byte stream" — "Reliability"; **IP** — "Forwards packets across networks" — "Reachability (best effort)".
- The deck's four moves (`.flow-grid`): "1. Hello — agree version + algorithms"; "2. Certificate — server proves identity"; "3. Key exchange — create session keys"; "4. Finished — switch to protected traffic".
- What changed in TLS 1.3 (RFC 8446), quoted: "TLS 1.3 is a redesign, not a tweak. It removed RSA key transport, static Diffie-Hellman, CBC-mode cipher suites, RC4, 3DES, renegotiation and compression. Everything that remains is an **AEAD** cipher suite with an ephemeral key exchange, so **forward secrecy is mandatory**: the session key is derived from a Diffie-Hellman secret that is never transmitted, which is why a later compromise of the server's long-term key does not decrypt recorded sessions. The cipher suite now names only the record protection and the hash; authentication is negotiated separately."
- Cipher-suite table (record protection / hash for the key schedule / note):
  - `TLS_AES_128_GCM_SHA256` — AES-128-GCM — SHA-256 — "The required baseline suite".
  - `TLS_AES_256_GCM_SHA384` — AES-256-GCM — SHA-384 — "Larger key and hash for higher assurance margins".
  - `TLS_CHACHA20_POLY1305_SHA256` — ChaCha20-Poly1305 — SHA-256 — "Preferred where AES hardware is unavailable or timing side channels matter".
- The record protocol: "Application data is **fragmented** into records, each record is **encrypted** so its content stays confidential, and an **authentication tag** is added so tampering is detected before anything is released to the application. The deck's one-line summary: application data → TLS record → protected bytes on the network."
- Two precise properties: "**Integrity covers metadata, not just content**: the tag is computed over the sequence number and content type as well as the payload, so records cannot be silently reordered, dropped or replayed. **Authentication happens once, at the start**: after the handshake, the session keys do the work, and the certificate is not re-checked per record."
- Quick-check: why a later compromise of the long-term key does not decrypt recorded sessions → "Because session keys come from an ephemeral key exchange whose secret was never transmitted; the long-term key only signs the handshake" (forward secrecy). Rejected: recorded traffic is not re-encrypted after rotation; "the certificate is encrypted, so the long-term key was never sent" confuses handshake confidentiality with forward secrecy.

#### `#sec-certs` — Certificates: Which Key Do You Trust?
- Bridge statement, quoted: "a certificate *binds a server name to a public key*, and a digital signature lets the browser verify that binding. A trusted **certificate authority** signs the server certificate; the browser checks the CA's signature and the website name, trusts the server's key, and only then uses it to create session keys."
- Chain diagram (`.diagram-flow`): "Root CA — in the trust store" → "Intermediate — signs the leaf" → "Leaf certificate — name + public key" → "Session keys — after validation".
- Interactive `#ix-cert-steps` — order the browser's validation (7 steps): (1) "Receive the server's certificate chain during the handshake"; (2) "Build a path from the leaf certificate to a trust anchor in the local store"; (3) "Verify each signature in the path using the issuer's public key"; (4) "Check the validity window, including that the leaf has not expired"; (5) "Match the requested hostname against the certificate's subject alternative names"; (6) "Check key usage, revocation status and transparency receipts"; (7) "Only then use the certified key to authenticate the key exchange". Subtitle: "The chain is only useful if every one of these checks passes."
- Check table (check / what it prevents / typical failure message):
  - **Chain to a trusted root** — "Self-signed or attacker-issued certificates" — "Not issued by a trusted authority".
  - **Signature verification** — "A forged certificate body or a swapped public key" — "Chain building fails".
  - **Validity window** — "Reuse of a certificate after its period of authorisation" — "Certificate has expired".
  - **Hostname match** — "A valid certificate for a different site being used here" — "Certificate is for a different name".
  - **Key usage and constraints** — "A certificate used for a purpose it was not issued for" — "Handshake rejected by policy".
  - **Revocation and transparency** — "Continued use of a certificate that was withdrawn or never logged" — "Revocation or CT policy failure".
- Why the hostname check is not optional, quoted: "a certificate proves that *some* name is bound to *some* key. Only the hostname check proves that the name is *yours*. An attacker in the path can always obtain a valid certificate for a domain they control; the check is what makes that certificate useless against your bank."
- Standards anchor: "the validation procedure above is the practical form of RFC 5280 path validation. In deployment, NIST SP 800-52 Rev 2 adds the policy layer: a minimum protocol version, approved cipher suites, and a documented certificate and key-management process."
- Quick-check: `paypa1-secure.example.net` presenting a genuine, currently valid certificate for that exact name → "All the technical checks pass for a name the attacker legitimately controls; PKI proves name ownership, not intent." Rejected: it is not self-signed and the chain verifies; TLS was not downgraded — "the deception is in the domain name, which TLS cannot judge for the user."

#### `#sec-https` — HTTPS in Practice: Same Request, Protected
- Definition/framing: "HTTPS is HTTP inside TLS. The request does not change; what changes is that it is protected before it crosses the network — and that is only true if the deployment does not hand the protection back."
- HTTP vs HTTPS table:
  - **Port and framing** — "Port 80, plaintext" vs "Port 443, HTTP protected by TLS".
  - **Can be read** — "Yes, by anything on the path" vs "No — records are encrypted".
  - **Can be modified** — "Yes, silently" vs "Tampering is detected by the record tag".
  - **Server identity** — "Not established" vs "Verified by certificate and hostname check".
  - **MITM risk** — "Inherent" vs "Reduced to a validation decision the client must get right".
- What HTTPS protects: "**Confidentiality** — attackers cannot read the content in transit"; "**Integrity** — silent changes to traffic are detected"; "**Authentication** — the browser verifies the server's certificate".
- What HTTPS does not fix: "**Weak passwords** — users can still be phished"; "**Malware** — the device may already be compromised"; "**Server-side breaches** — the website may still be vulnerable".
- Interactive `#ix-protocol-timeline` — "How the protocol got here" (each generation removed a class of failure the previous one could not fix):
  - **1995 — SSL 2.0** — "The first widely deployed version, quickly replaced after design flaws were found. Never use it."
  - **1996 — SSL 3.0** — "The design that TLS was built from. The POODLE attack in 2014 ended its useful life; it is now prohibited."
  - **1999 — TLS 1.0** — "Standardised by the IETF. MAC-then-encrypt with CBC mode led to a long series of padding-oracle attacks."
  - **2006 — TLS 1.1** — "Added an explicit initialisation vector to close the worst CBC predictability problem."
  - **2008 — TLS 1.2** — "Introduced AEAD cipher suites such as AES-GCM and modern hash functions. The full handshake still costs two round trips."
  - **2012 — HSTS (RFC 6797)** — "A policy header that lets a site instruct the browser to refuse plaintext for a period — removing the downgrade window for repeat visitors."
  - **2018 — TLS 1.3 (RFC 8446)** — "One round trip, AEAD-only, forward secrecy mandatory, certificate encrypted, legacy algorithms and renegotiation removed."
  - **Today — TLS 1.0 and 1.1 deprecated** — "RFC 8996 deprecates them formally. NIST SP 800-52 Rev 2 expects TLS 1.2 or 1.3 with approved suites and a documented configuration."
- HSTS definition, quoted: "**HTTP Strict Transport Security** is a response header, typically `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. Once a browser has seen it, that host is treated as HTTPS-only: plaintext requests are upgraded before they leave the device, and certificate errors become non-bypassable. With `includeSubDomains` the policy covers every subdomain, and `preload` submits the host to the browser vendors' built-in list so even the *first* visit has no plaintext window."
- Deployment-mistakes table (mistake / what the attacker does / fix):
  - "Plain HTTP remains reachable and no HSTS is set" — "SSL stripping: rewrite the links so the session continues in the clear" — "Redirect on the same host, then send HSTS with a long max-age".
  - "Weak minimum version or legacy suites enabled" — "Protocol downgrade to a version with known weaknesses" — "Require TLS 1.2 or 1.3; disable CBC-only and RC4 suites".
  - "Pages load some resources over HTTP" — "Mixed content: an unauthenticated script rewrites the protected page" — "Serve every subresource over HTTPS and set a content security policy".
  - "Certificate about to expire" — "Nothing needs to be attacked — users are trained to click through warnings" — "Automate issuance and renewal, and monitor expiry".
  - "Cookies without the Secure attribute" — "A downgraded request leaks the session cookie" — "Set Secure, HttpOnly and an appropriate SameSite policy".
- Worked example `#sol-3` — audit `http://shop.example` → `https://www.shop.example`, no HSTS, images from `http://cdn.example`:
  1. "The redirect crosses from `shop.example` to `www.shop.example`. The first plaintext request is fully exposed and can be answered by an attacker before the redirect ever reaches the real server — a cross-host redirect is not a substitute for HSTS."
  2. "No HSTS header means the plaintext window reopens on every new browser profile, cleared cache, or first visit. Adding `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` on the HTTPS response removes it for subsequent visits and, once preloaded, for the first one too."
  3. "Images over `http://cdn.example` are mixed content. Even with a valid TLS session on the main page, an attacker on the path can substitute an image, and for active content such as scripts the browser may block it or the page may silently lose its integrity guarantee."
  4. "The main page is protected by TLS on 443, and the server identity is verified by certificate and hostname check. The remaining risk is entirely about *keeping* the session protected rather than *starting* it."
  5. Mark-earning sentence: "HTTPS protects data in transit; HSTS protects the *decision* to use it. Without a same-host redirect, a long-lived HSTS policy and no mixed content, the attacker no longer needs to break TLS — they only need to be there before it starts."
- Quick-check: HTTPS served correctly but no HSTS header → "SSL stripping on the first visit, to an attacker already in the path" ("the certificate never gets a chance to fail"). Rejected: forward secrecy is a property of the TLS 1.3 key exchange, unaffected by a missing header; record encryption is unaffected because the gap is before the encrypted session exists.

#### `#sec-impl` — When the Implementation Breaks the Promise
- "TLS can be well designed and still leak everything, because a protocol is only as good as the code that parses its messages. Heartbleed is the deck's case study."
- Heartbeat and the bug, quoted: "**Heartbeat** was a keep-alive: one side sends a small payload with a declared length, and the peer echoes those bytes back, so both sides know the other is still responsive without renegotiating the session. **Heartbleed** was the implementation failing to check that the length the client *claimed* matched the payload it actually *sent*. A request that said 'here is 1 byte' but asked for 64 KB made the server return up to 64 KB of whatever was next to that buffer in memory."
- Interactive `#ix-impl-cards` — six cards:
  - "Normal heartbeat" — "A peer sends a small payload and a length; the other echoes exactly those bytes back. Cheap proof that the session is still alive."
  - "Heartbleed" — "The implementation echoed the length claimed by the client instead of the length actually sent, so a short request returned up to 64 KB of adjacent process memory."
  - "What could leak" — "Private keys (impersonation and decryption of future sessions), passwords, session cookies (session hijacking), and any other sensitive data recently handled in memory."
  - "Defence mindset" — "Patch quickly, rotate exposed keys, invalidate sessions, and monitor for abuse. Assume anything that was in memory is now public."
  - "The general lesson" — "A length field is untrusted input. Protocol security also depends on careful implementation and input validation — the design was fine, the bounds check was missing."
  - "Why TLS 1.3 is not the whole answer" — "TLS 1.3 removes the heartbeat extension, but the class of bug — trusting a claimed length — recurs in every parser. Version upgrades reduce surface; they do not replace input validation."
- Interactive `#ix-incident` — incident response for a memory-disclosure bug, with the subtitle "Order matters: rotating keys before patching just re-exposes the new keys": (1) **Contain** — "Patch or disable the vulnerable service so no further memory can be read"; (2) **Revoke and reissue** — "Treat the certificate's private key as compromised: reissue with a new key pair"; (3) **Invalidate sessions** — "Expire session cookies and force re-authentication; reset credentials if they may have been read"; (4) **Verify exposure** — "Work out the window of exposure and what was in memory during it"; (5) **Monitor** — "Watch for impersonation and for reuse of anything that leaked"; (6) **Prevent recurrence** — "Add bounds-checked parsing, fuzzing and dependency-update practice to the lifecycle".
- Transferable pattern: "Heartbleed is not really a story about TLS. It is a story about a parser that trusted a number supplied by the other side. The same shape appears in length-prefixed file formats, in decompression, in deserialisation and in protocol gateways — which is why the deck pairs the case with the reminder that protocol security depends on careful implementation and input validation."

#### `#sec-recap` — Week 7 Recap
- Toolkit cards: "**The path is untrusted, so the endpoints must do the work** — Read, change, pretend, block. Network security protects data *while it moves*; nothing on the path can be asked to enforce that for you." | "**IP best effort, UDP datagrams, TCP byte stream** — IP promises nothing; UDP adds speed and no state; TCP adds order, acknowledgements and retransmission. None of them adds secrecy or identity." | "**TLS 1.3 is one round trip of AEAD and authentication** — Hello, certificate, key exchange, Finished — with ephemeral key agreement, an encrypted handshake and a tagged record for every message after it." | "**Trust is a client-side decision** — A certificate binds a name to a key. The chain, the validity window and the hostname match are what turn a MITM from an interception into a detected failure."
- "Today's answer, in four steps": IP — "moves packets" → TCP — "delivers reliably" → TLS — "protects the channel" → HTTPS — "puts TLS to work".
- Exam question patterns and skeleton answers:
  - "Why is TCP not enough for secure communication?" → "TCP answers delivery (order, acknowledgement, retransmission) and leaves confidentiality, integrity and server identity open; TLS is layered above it and below the application."
  - "Explain how TLS defeats a man-in-the-middle." → "The attacker can only complete a handshake by presenting a certificate; a validating client checks the chain and the hostname, so the attacker's certificate fails and the connection stops."
  - "Classify this attack and name a control." → "Name the property under attack, the mechanism exploited, and the control with its limitation — then say what remains exposed."
  - "A site has HTTPS. Is it secure?" → "HTTPS protects data in transit. Ask about HSTS, minimum version, mixed content, certificate lifecycle, and everything HTTPS explicitly does not fix."
- Glance cards: "**Check yourself** — Can you state the four things an on-path attacker can do, map them to properties, and name the layer that answers each one?" | "**Before the exam** — Be able to draw the TLS 1.3 message flow from memory, and to explain why the client's certificate check — not the cipher suite — is what stops an impostor."
- "Where to go next": the Foundations page "turns this week into arithmetic — encapsulation overhead, sequence and window maths, round-trip budgets, the TLS 1.3 key schedule, key-size and security-strength tables, and the HSTS window."

---

### B. `chapter7-math.html` (Foundations)

#### `#sec-m-hero` — Foundations hero
- Title: "Foundations: the arithmetic of a connection that has to be trusted". Tag: "INFO5995 — Week 7 supplement".
- Scope statement: "Week 7 is a protocol week, so the numbers are the ones a practitioner actually reasons with: how many bytes the headers cost, how sequence numbers and windows bound throughput, how many round trips a handshake consumes, how the TLS 1.3 key schedule derives traffic secrets, which key sizes are equivalent, and how long an HSTS policy or a certificate really protects you. Every formula below is tied to a figure from the deck or a named standard."
- Provenance chips: "Header and record sizes from RFC 8446 / RFC 9293"; "Key sizes from NIST SP 800-57 Part 1 Rev 5"; "RTT budgets and overheads worked numerically".
- TOC groups: "Layer arithmetic" (`#sec-m-layers`, `#sec-m-tcp`), "Cryptographic arithmetic" (`#sec-m-tls`, `#sec-m-certs`), "Operations" (`#sec-m-https`, `#sec-m-checklist`).

#### `#sec-m-layers` — Encapsulation and the cost of protection
- Framing: "Every layer adds a header, and every byte of header is a byte not carrying application data. This is the arithmetic that tells you what TLS costs in practice — and it is small, which is worth knowing before anyone argues that encryption is too expensive."
- Symbol table (all of it is testable): \(P\) payload = "Application data bytes carried in one record"; \(L_{\text{eth}}\) = "Ethernet II header: 14 bytes (destination, source, type)"; \(L_{\text{ip}}\) = "IPv4 header without options: 20 bytes"; \(L_{\text{tcp}}\) = "TCP header without options: 20 bytes"; \(L_{\text{tls}}\) = "5-byte record header + 1-byte inner content type + 16-byte AEAD tag = 22 bytes"; \(\eta\) = "Fraction of the bytes on the wire that are application data, \(P / L_{\text{wire}}\)"; \(W\) = "Bytes the receiver will accept before it must acknowledge"; \(\mathrm{RTT}\) = "Time for a signal to reach the peer and for the reply to return"; \(C\) = "Path bandwidth in bits per second"; \(Z\) = "The Diffie-Hellman value \(g^{ab} \bmod p\), never transmitted"; \(\mathrm{TH}\) = "Hash of every handshake message so far".
- Theorem 1 — wire length: \(L_{\text{wire}} = L_{\text{eth}} + L_{\text{ip}} + L_{\text{tcp}} + L_{\text{tls}} + P = 14 + 20 + 20 + 22 + P = 76 + P\). "The MTU is 1500 bytes, so the IP packet can carry at most \(1500 - 20 - 20 = 1460\) bytes of TCP payload. Because the TLS record overhead sits *inside* that TCP payload, the application bytes per full-size record are \(1460 - 22 = 1438\)."
- Theorem 2 — efficiency: \(\eta = P/L_{\text{wire}}\). "With TLS: \(\eta = 1438/1514 = 0.9498\). Without TLS: \(\eta = 1460/1514 = 0.9643\). The protection therefore costs about **1.5 percentage points** of payload efficiency — 22 bytes per 1460, or roughly \(1.5\%\) of a full-size TCP segment."
- Interactive `#ix-record` — a five-frame stepper, "Building one TLS 1.3 record: Every protected byte is fragmented, sealed and tagged before TCP ever sees it":
  - Frame 1 "Application data" — "The HTTP request is just bytes. At this point nothing on the path is prevented from reading or editing them." (drawn as `GET /index.html HTTP/1.1`, highlighted red as "readable and modifiable by anything on the path").
  - Frame 2 "Fragment into records" — "The plaintext is split so that no record exceeds 2^14 = 16384 bytes. Each fragment becomes the inner plaintext of one record." Also: "smaller fragments cost more overhead; larger ones add latency".
  - Frame 3 "Seal with AEAD" — "The traffic key encrypts the fragment and authenticates it together with the sequence number and content type. The nonce is the static IV XOR the record counter." Diagram: plaintext → AEAD (key, nonce, aad) → ciphertext; caption "nonce = iv XOR seq — the counter never repeats under one key".
  - Frame 4 "Header and tag: 22 bytes of overhead" — "A 5-byte record header (type, legacy version, length), a 1-byte inner content type and a 16-byte AEAD tag are added. The receiver verifies the tag before releasing anything." Bar: `hdr 5 | type 1 | ciphertext | tag 16` = "22 bytes of protection per record".
  - Frame 5 "Count the cost" — "At a 1500-byte MTU the TCP payload is 1460 bytes, so a full-size record carries 1438 application bytes: about 1.5% overhead, and about 95% efficiency for the whole Ethernet frame." Bar segments by fraction: eth 14, ip 20, tcp 20, tls 22, payload 1438 of 1514; "one 1514-byte frame: 76 header bytes, 1438 application bytes"; "efficiency = 1438 / 1514 = 0.95".
- Insight — "Record size is a trade-off, not a constant. Larger records amortise the 22-byte overhead better but add latency for interactive traffic, because the receiver cannot process a record until it has all of it. The TLS 1.3 maximum plaintext of \(2^{14} = 16384\) bytes is a compromise; a request/response workload typically uses records of a few hundred bytes and pays proportionally more overhead."
- Interactive `#ix-primitive-property` — match mechanism to property (7 pairs): "Sequence number and cumulative ACK" → "Reliability: the receiver can rebuild an ordered stream and name the byte it expects next"; "Sliding window and window scaling" → "Flow control: bounds how many bytes may be in flight before an acknowledgement"; "AEAD record encryption in TLS" → "Confidentiality plus integrity: content is hidden and every tagged record is checked before release"; "Certificate chain and hostname match" → "Authenticity: binds a name to a public key and proves the peer controls the matching private key"; "Ephemeral (EC)DHE key exchange" → "Forward secrecy: past sessions stay confidential even if the long-term key later leaks"; "SYN cookies" → "Availability: no connection state is allocated until the handshake actually completes"; "HSTS with preload" → "Downgrade resistance: the browser refuses plaintext before the first request is sent".
- Quick-check: full-size TLS 1.3 record carries 1438 application bytes → "About 95%" ("1438 application bytes out of a 1514-byte Ethernet frame is 0.9498 … the 20-byte IP and TCP headers dominate the overhead, not TLS"). Rejected: "About 1.5%" is "the fraction lost to the TLS record overhead alone (22/1460 ≈ 1.5%)"; "About 50%" is impossible because all four headers total 76 bytes against 1438 of payload.

#### `#sec-m-tcp` — Sequence numbers, windows and round-trip budgets
- "TCP reliability looks like magic until you write it as modular arithmetic and a timing budget. Both are examinable."
- Theorem 1 — sequence space: "Sequence numbers are 32-bit counters, so they are defined modulo \(2^{32}\)": \(seq_{n+1} = (seq_n + \mathrm{len}_n) \bmod 2^{32}\), \(seq \in [0, 2^{32})\). "A cumulative acknowledgement names the next byte the receiver expects, not the last byte it received": \(ACK = seq_{\text{first}} + \text{bytes received contiguously}\). "The deck's example numbers this directly: segments \(1\!-\!40\), \(41\!-\!70\), \(71\!-\!100\), \(101\!-\!130\) produce \(ACK = 131\), meaning 'all bytes up to 130 arrived'. If the segment \(41\!-\!70\) is lost, the receiver keeps answering \(ACK = 41\), and after a retransmission timeout the sender resends that range."
- Theorem 2 — window as bandwidth-delay product: \(\text{throughput} \le W/\mathrm{RTT}\), \(W_{\min} = C \times \mathrm{RTT}\). "The window field is 16 bits, so \(W \le 65535\) bytes unless the window-scaling option multiplies it by \(2^{k}\)."
- Worked calculation (4 steps, verbatim numbers):
  1. "A path has \(C = 100\ \mathrm{Mbit/s}\) and \(\mathrm{RTT} = 50\ \mathrm{ms}\). The bandwidth-delay product is \(100 \times 10^{6} \times 0.05 = 5 \times 10^{6}\) bits \(= 625{,}000\) bytes."
  2. "\(W = 65535\) bytes gives at most \(65535 / 0.05 = 1.31\ \mathrm{MB/s} \approx 10.5\ \mathrm{Mbit/s}\) — about a tenth of the available capacity."
  3. "We need \(65535 \times 2^{k} \ge 625{,}000\), so \(2^{k} \ge 9.54\), giving \(k = 4\). The advertised window becomes \(65535 \times 16 = 1{,}048{,}560\) bytes, comfortably above the bandwidth-delay product."
  4. "Throughput on a long, fast path is limited by \(W / \mathrm{RTT}\), not by link speed. This is the same arithmetic that makes a one-round-trip handshake worth redesigning a protocol for."
- Theorem 3 — RTO (RFC 6298): \(SRTT \leftarrow (1-\alpha)SRTT + \alpha R\); \(RTTVAR \leftarrow (1-\beta)RTTVAR + \beta |SRTT - R|\); \(RTO = SRTT + 4 \cdot RTTVAR\), with \(\alpha = 1/8\) and \(\beta = 1/4\). "Example: \(SRTT = 400\ \mathrm{ms}\) and \(RTTVAR = 100\ \mathrm{ms}\) give \(RTO = 400 + 400 = 800\ \mathrm{ms}\). RFC 6298 also requires a floor of one second; production stacks lower it, which is why a loss on a fast path can be repaired in tens of milliseconds rather than a second."
- Interactive `#ix-race-rtt` — "Round trips before the first HTTP byte" (max 3): "TCP three-way handshake — 1 RTT"; "TLS 1.3 full handshake (on top of TCP) — 1 RTT"; "TLS 1.2 full handshake (on top of TCP) — 2 RTT"; "TLS 1.3 with PSK resumption — 0 RTT (early data)".
- Latency statement: "At \(\mathrm{RTT} = 50\ \mathrm{ms}\), a TLS 1.3 connection reaches the first request byte after about \(2 \times 50 = 100\ \mathrm{ms}\), against roughly \(150\ \mathrm{ms}\) for TLS 1.2. Resumption with a pre-shared key can send early data immediately, at the price of **replay risk**: the server processes the first flight before it has proved the client is live, so 0-RTT data must be restricted to requests that are safe to repeat."
- Theorem 4 — half-open state as a resource equation: \(N_{\text{half-open}} \approx \lambda \times T\). "With the classic SYN-ACK retransmission schedule \(1+2+4+8+16+32 = 63\) seconds and \(\lambda = 1000\) SYNs per second, the attacker demands about \(63{,}000\) simultaneous entries; a backlog of \(1024\) overflows in roughly one second. SYN cookies change the equation to \(N_{\text{half-open}} = 0\) by moving the state into the server's own sequence number until the ACK proves the client is real."
- Worked example `#sol-m1` — reading a loss trace numerically (segments 1–40, 41–70, 71–100, 101–130; capture shows three `ACK 41`s; later the sender retransmits 41–70 and the next acknowledgement is `ACK 131`):
  1. "By the definition above, \(ACK = seq_{first} + \text{contiguous bytes}\). The receiver has byte 1 onward, so the highest contiguous byte is 40 and every subsequent segment leaves the expected byte at 41."
  2. "It does buffer \(71\!-\!130\), but a cumulative acknowledgement cannot say so. Duplicate ACKs are the signal that data is missing without a timeout having to expire."
  3. "Once \(41\!-\!70\) arrives, the contiguous prefix extends from byte 1 to byte 130, so the next expected byte is 131 — and the buffered data is released upward as one ordered stream."
  4. "Real TCP does not start at 1: it picks a random initial sequence number \(ISN\) and every value above is \((ISN + k) \bmod 2^{32}\). The deck's 1–130 numbering is the same arithmetic with \(ISN = 1\)."
- Quick-check: 200 Mbit/s capacity, 100 ms RTT → "2.5 MB, so window scaling is mandatory" ("200 × 10^6 × 0.1 = 2 × 10^7 bits = 2.5 MB, far beyond the 65535-byte window field"). Rejected: "200,000,000 bytes" is the capacity figure, not the amount that must be in flight; "65,535 bytes, which is always sufficient" yields only about 5 Mbit/s at 100 ms RTT, "a fortieth of the capacity".

#### `#sec-m-tls` — The TLS 1.3 key schedule and key sizes
- "TLS 1.3 derives every key from a hash-based key schedule, and its security reduces to two hardness assumptions plus one counting argument. This section is the one to reproduce from memory."
- Theorem 1 — HKDF (RFC 5869) with the handshake hash SHA-256 or SHA-384: \(\mathrm{PRK} = \mathrm{HMAC}(salt, \mathrm{IKM})\), \(\mathrm{OKM} = \mathrm{HKDF\text{-}Expand}(\mathrm{PRK}, info, L)\). "Extract concentrates whatever entropy the input has into a fixed-size pseudorandom key; expand stretches it into as many output bytes as the cipher needs, binding the result to a label \(info\)."
- Theorem 2 — three secrets, two derivations (each stage mixes the previous secret with a new input "using a fixed label so that two stages never share key material"):
  - \(\text{Early} = \mathrm{HKDF\text{-}Extract}(0, \mathrm{PSK})\)
  - \(\text{Handshake} = \mathrm{HKDF\text{-}Extract}(\mathrm{DeriveSecret}(\text{Early}, \text{"derived"}), \mathrm{ECDHE})\)
  - \(\text{Master} = \mathrm{HKDF\text{-}Extract}(\mathrm{DeriveSecret}(\text{Handshake}, \text{"derived"}), 0)\)
  - \(\mathrm{DeriveSecret}(S, label) = \mathrm{HKDF\text{-}Expand\text{-}Label}(S, label, H(\text{""}))\)
  - \(key = \mathrm{HKDF\text{-}Expand\text{-}Label}(secret, \text{"key"}, \text{""}, K)\), \(iv = \mathrm{HKDF\text{-}Expand\text{-}Label}(secret, \text{"iv"}, \text{""}, 12)\)
  - \(\text{Finished} = \mathrm{HMAC}(finished\_key, \mathrm{TH})\), \(\mathrm{TH} = H(\text{ClientHello} \| \text{ServerHello} \| \cdots)\)
  - "Because \(\mathrm{TH}\) covers every message in order, a modified handshake produces a different Finished value — that is the integrity guarantee for the negotiation itself."
- Theorem 3 — ephemeral Diffie-Hellman and forward secrecy: \(A = g^{a} \bmod p\), \(B = g^{b} \bmod p\), \(Z = B^{a} = A^{b} = g^{ab} \bmod p\). "Recovering \(a\) from \(A\) is the discrete-logarithm problem; recovering \(Z\) from \(A\) and \(B\) is the computational Diffie-Hellman problem. \(Z\) is fed into the key schedule as the \(\mathrm{ECDHE}\) input and is **never transmitted**. If the server's long-term signing key leaks later, an attacker who recorded the session can recompute neither \(a\), nor \(b\), nor \(Z\), so the session keys stay unknown — that is forward secrecy. TLS 1.3 makes this mandatory by removing RSA key transport and static DH entirely."
- Theorem 4 — AEAD nonce discipline: \((C, T) = \mathrm{AEAD.Encrypt}(key, nonce, aad, P)\), \(nonce = iv \oplus \mathrm{seq}\). "The forgery probability for a random 128-bit tag is \(2^{-128}\) per attempt. Reusing a nonce under the same key is catastrophic for GCM, so TLS 1.3 uses a counter rather than randomness: \(\mathrm{seq}\) increments for every record, and RFC 8446 sets per-key usage limits plus a `KeyUpdate` message to rekey before the counter can wrap."
- Birthday bound for random nonces: \(p \approx 1 - e^{-q(q-1)/2^{n+1}} \approx q^{2}/2^{\,n+1}\). "For \(n = 96\) and \(q = 2^{32}\), \(p \approx 2^{64}/2^{97} = 2^{-33} \approx 1.2 \times 10^{-10}\) — small, but not zero, which is exactly why the counter form is used."
- Key-size equivalence table (symmetric equivalent / finite-field DH & DSA / RSA modulus / elliptic curve / hash / security strength) — "Comparable security strengths, after NIST SP 800-57 Part 1 Rev 5":
  - 2TDEA — \(L=1024, N=160\) — RSA 1024 — EC 160–223 — SHA-1 — **80 bits**
  - 3TDEA — \(L=2048, N=224\) — RSA 2048 — EC 224–255 — SHA-224 — **112 bits**
  - **AES-128** — \(L=3072, N=256\) — RSA 3072 — EC 256–383 — SHA-256 — **128 bits**
  - **AES-192** — \(L=7680, N=384\) — RSA 7680 — EC 384–511 — SHA-384 — **192 bits**
  - **AES-256** — \(L=15360, N=512\) — RSA 15360 — EC 512+ — SHA-512 — **256 bits**
  - Note below the table: "The table is the reason a 2048-bit RSA key is described as roughly 112-bit security, and why a cipher suite's name tells you the symmetric strength but not the strength of the authentication."
- Interactive `#ix-race-strength` — "Security strength in bits, not bytes. NIST-equivalent strengths. A longer key is not automatically stronger — what matters is the strength of the best known attack." Rows: RSA-2048 (signature or key transport) 112-bit; AES-128-GCM session key 128-bit; ECDHE with X25519 or P-256 128-bit; SHA-256 collision resistance 128-bit; RSA-3072 128-bit; AES-256-GCM session key 256-bit (max 256).
- Theorem 5 — entropy of a key versus a password: for a uniformly random \(k\)-bit key, \(H = \log_2 2^{k} = k\ \text{bits}\), \(\Pr[\text{guess}] = 2^{-k}\). "A password is not uniformly random over its alphabet. For length \(L\) over an alphabet of size \(N\) the upper bound is \(H_{\max} = L \log_2 N\), so an eight-character lowercase password has at most \(8 \log_2 26 \approx 37.6\) bits — less than a third of the weakest TLS 1.3 session key, and far less in practice because human choices are not uniform. This is the arithmetic behind the deck's insistence that HTTPS does not fix weak passwords."
- Worked example `#sol-m2` — which part of the handshake protects what (ClientHello offers `TLS_AES_128_GCM_SHA256` and an X25519 key share; ServerHello selects the same suite; then encrypted handshake messages; then application records):
  1. "\(128\) is the AEAD key length and \(256\) is the hash used by HKDF. It says nothing about the strength of the server's signature, which is negotiated separately through the signature-algorithm extension."
  2. "The key share is \(g^{a}\) in an elliptic-curve group with about 128-bit security. The matching secret \(a\) stays on the client, so the record keys derived from \(Z\) are ephemeral by construction."
  3. "Once both hellos have been exchanged, each side can compute the handshake secret. The certificate, CertificateVerify and Finished messages therefore travel under the handshake traffic keys, which is why a passive observer cannot even see which certificate was presented."
  4. "CertificateVerify contains a signature over the transcript hash, made with the private key matching the certificate's public key. That is the step that converts an anonymous key exchange into an authenticated one; without it, X25519 would agree a key with anybody, including an attacker."
  5. "Numerical summary: 1 RTT of handshake, 128-bit AEAD key, 128-bit ephemeral group, 128-bit collision-resistant hash, and one 16-byte tag per record: about \(2^{-128}\) forgery probability per attempt and no single long-term secret whose later compromise decrypts the session."
- Quick-check: "AES-256, therefore 256-bit security" → incomplete because "The overall strength is bounded by the weakest component — for example a 112-bit RSA-2048 signature — and by correct nonce handling." Rejected: AES-256 does provide 256-bit strength against key search; and symmetric key size does determine the strength of the cipher itself.

#### `#sec-m-certs` — Certificate validation as a decision procedure
- Framing: "Path validation is a conjunction of predicates. If any one of them is false the connection must stop, which is why the hostname check deserves the same emphasis as the signature check."
- Theorem 1 — a signature is a trapdoor computation: \(s \equiv m^{d} \pmod n\), \(m' \equiv s^{e} \pmod n\), \(m = \mathrm{EMSA\text{-}PSS\text{-}Encode}(H(\text{TBS}))\). "Verification succeeds only if \(m' = m\), so the encoded hash — and therefore the certificate body — is bound to the signer. The padding is not decoration: textbook RSA is malleable, and schemes such as PSS exist so that a signature cannot be turned into a different valid signature. Elliptic-curve schemes (ECDSA, EdDSA) provide the same guarantee from a different hardness assumption, which is why TLS 1.3 negotiates the signature algorithm separately from the cipher suite."
- Theorem 2 — chain validity is a logical AND: \(\mathrm{Valid} = \bigwedge_{i=0}^{m-2} \mathrm{Sig}(C_i, pk(C_{i+1})) \wedge \bigwedge_{i=0}^{m-1} \mathrm{Time}(C_i) \wedge \mathrm{Name}(C_0, host) \wedge \mathrm{Usage}(C_i) \wedge \neg\,\mathrm{Revoked}(C_i)\). "Read it as a checklist rather than a formula: **signature**, **time**, **name**, **usage**, **revocation**. A single false term makes the whole conjunction false, and the browser is required to refuse the connection — not to warn and continue."
- Theorem 3 — time, lifetime and renewal: \(t_{\text{notBefore}} \le t_{\text{now}} \le t_{\text{notAfter}}\), \(t_{\text{notAfter}} - t_{\text{notBefore}} \le 398\ \text{days}\). "The 398-day ceiling is the CA/Browser Forum limit that applies to publicly trusted TLS server certificates. Short lifetimes reduce the exposure from a stolen key, but they turn issuance into a continuously operating system: with a lifetime \(L\) and an issuance lead time \(\ell\), renewal must begin at \(t_{\text{notAfter}} - \ell\) with \(\ell\) comfortably larger than the worst-case issuance delay, or the service fails closed at the moment of expiry."
- Theorem 4 — name matching is exact, not approximate: "A certificate may list several subject alternative names (SANs). A wildcard matches exactly one label": \(\texttt{*.example.com}\) matches \(\texttt{www.example.com}\), but not \(\texttt{a.b.example.com}\), nor \(\texttt{example.com}\). "Formally, if the pattern is \(*.\ell_1.\ell_2\ldots\ell_j\) and the presented name is \(x_1.x_2.\ldots x_{j+1}\), the match requires \(j+1\) labels with \(x_2 = \ell_1, \ldots, x_{j+1} = \ell_j\). This is also why a certificate for \(example.net\) can never be presented for \(example.com\): the names differ in a label that the pattern must compare exactly."
- Theorem 5 — transparency logs are Merkle trees: "Certificate Transparency records every issued certificate in an append-only log whose root is a hash of all entries. Proving that one certificate is included costs only a logarithmic number of sibling hashes": \(|\text{proof}| = \lceil \log_2 n \rceil\) hashes. "For a log with \(n = 10^{9}\) certificates that is 30 hashes — a few hundred bytes — which is why an inclusion proof can be stapled to a handshake. Tamper-evidence follows from the hash chain: changing one leaf changes every subsequent root."
- Interactive `#ix-m-validate` — order the verification, then say what each step rules out ("cheap structural checks first, expensive network checks last"): (1) "Check that the certificate is inside its validity window"; (2) "Link the chain from the leaf through intermediates to a trusted root"; (3) "Verify each signature with the issuer's public key"; (4) "Match the requested hostname against the subject alternative names"; (5) "Check key usage, basic constraints and name constraints"; (6) "Check revocation and transparency receipts"; (7) "Derive and confirm the handshake keys only after every check passes".
- Worked example `#sol-m3` — evaluate the conjunction (three-certificate chain; leaf SAN = `DNS:*.shop.example, DNS:shop.example`; user typed `https://checkout.shop.example`):
  1. "The leaf must be signed by the intermediate's public key, and the intermediate by the root's. If either link fails, the conjunction is false and no later check matters."
  2. "Both the leaf and each intermediate must satisfy \(t_{\text{notBefore}} \le t_{\text{now}} \le t_{\text{notAfter}}\). Expiry of an *intermediate* breaks the chain just as surely as expiry of the leaf."
  3. "The SAN list contains `*.shop.example` and `shop.example`. The requested host `checkout.shop.example` has exactly one label in the wildcard position, so it matches; a request to `a.checkout.shop.example` would not, because the wildcard covers exactly one label."
  4. "The leaf must assert `serverAuth` extended key usage, and each issuer must be a CA with the appropriate basic constraints. Revocation status must be checked or at least stapled and validated; absence of a status response is a policy decision the operator has to make explicitly."
  5. "Every predicate is true, so the client uses the certified public key to authenticate the key exchange. Had any single term been false, the correct behaviour is to terminate — which is the difference between TLS as a control and TLS as a padlock icon."
- Quick-check: certificate for `*.example.com` presented for `login.eu.example.com` → "Reject it: the wildcard matches one label, not two" ("this is a name-check failure, not a signature failure"). Rejected: the wildcard does not cover every subdomain; and validity-window compliance elsewhere "does not make this match succeed".

#### `#sec-m-https` — HSTS, downgrade and operational arithmetic
- Framing: "The last mile of HTTPS is not cryptography; it is policy with numbers attached."
- Theorem 1 — an HSTS policy is a time window: `Strict-Transport-Security: max-age=Δ`, \(\Delta \ge 31{,}536{,}000\ \text{s}\). "The threshold is one year (365 days) and is a preload-list requirement, not a browser requirement; a two-year value \(\Delta = 63{,}072{,}000\) s is the common production choice. The protection is a state machine: before the first response arrives the browser has no policy, so the *first* request for a host is downgradeable unless the host is on the built-in preload list, which requires a long max-age, `includeSubDomains` and the `preload` token."
- Theorem 2 — every redirect and every handshake is a round trip: \(T_{\text{first byte}} \approx (1 + r) \times \mathrm{RTT} + T_{\text{handshake}}\). "For \(r = 1\) and \(\mathrm{RTT} = 50\ \mathrm{ms}\), the redirect alone costs about \(50\ \mathrm{ms}\) — and, worse, that round trip is in plaintext, which is precisely the window an attacker needs. HSTS removes the redirect by having the browser rewrite the URL to `https` before anything is sent."
- Theorem 3 — downgrade protection is a sentinel value: \(\text{ServerHello.random}[24..32) = \texttt{44 4F 57 4E 47 52 44 01}\) ("DOWNGRD\01"). "The client compares the received bytes and aborts the handshake if a downgrade is being signalled. This is the protocol-level defence; HSTS is the deployment-level one, and a minimum-version policy on the server is the third: an attacker who cannot negotiate an old version has nothing to downgrade to."
- Theorem 4 — small probabilities that decide designs: \(\Pr[\text{tag forgery}] = 2^{-t}\), \(\Pr[\text{nonce collision}] \approx q^{2}/2^{\,n+1}\). "With a 128-bit tag, a blind forgery attempt succeeds with probability \(2^{-128}\) per attempt — so integrity failures are engineered, not guessed. With random \(n\)-bit nonces, the second expression is why AES-GCM nonces are counters: the failure mode is not a rare collision but a catastrophic key-recovery event, and no probability that grows with traffic volume is acceptable for it."
- Operational numbers table (quantity / value / why it matters):
  - "HSTS preload minimum `max-age`" — \(31{,}536{,}000\) s (1 year) — "Below it, a host is not accepted onto the preload list".
  - "Common production `max-age`" — \(63{,}072{,}000\) s (2 years) — "Long enough that a policy mistake is expensive, which is the point".
  - "Maximum public TLS certificate lifetime" — "398 days" — "Sets the renewal cadence and the monitoring requirement".
  - "TLS 1.3 maximum plaintext record" — \(2^{14} = 16{,}384\) bytes — "Bounds per-record latency and amortises the 22-byte overhead".
  - "TLS record overhead" — "22 bytes" — "About 1.5% of a full-size TCP segment".
  - "TLS 1.3 nonce size" — "96 bits (12 bytes)" — "Counter-based, so the birthday bound never applies".
- Quick-check: `Strict-Transport-Security: max-age=86400` without `includeSubDomains` or `preload` → "The browser enforces HTTPS for one day on that host only; the protection expires quickly and the first-visit window stays open." Rejected: "Browsers ignore the header entirely because it is too short" — "It is the preload list that refuses values below one year, not the browser"; and HSTS "does not replace certificate validation. It removes the ability to bypass a validation failure; it does not perform any check itself."

#### `#sec-m-checklist` — Exam checklist
- "Week 7 questions are almost always of one of five shapes. Recognise the shape and the structure of the answer follows."
- Five shapes / what to compute or state / where marks are lost:
  1. "What does layer *X* guarantee?" — "Unit of transfer, ordering, delivery, state, and the security property it does or does not provide" — "Crediting TCP with confidentiality or identity".
  2. "Quantify the cost of *Y*." — "Bytes per header or record, \(\eta = P/L_{\text{wire}}\), or round trips before the first byte" — "Forgetting that the TLS record sits inside the TCP payload".
  3. "Classify this attack." — "Property targeted (confidentiality, integrity, authenticity, availability), mechanism, control, remaining exposure" — "Naming a product instead of a mechanism".
  4. "How does TLS defeat a MITM?" — "Certificate chain, signature, hostname match, and the observation that the client's validation is the control" — "Claiming encryption alone is sufficient".
  5. "Is this deployment secure?" — "Minimum version, suite policy, HSTS with preload, mixed content, certificate lifecycle, and what HTTPS explicitly does not fix" — "Treating a padlock as a complete answer".
- Interactive `#ix-m-formulas` — a 10-card self-test, "formulas and figures to recall": (1) "Wire length of a TLS-protected payload — L = 14 + 20 + 20 + 22 + P = 76 + P bytes on an Ethernet path, with a 1460-byte TCP payload limit at a 1500-byte MTU"; (2) "Cumulative acknowledgement — ACK = seq_first + contiguous bytes received, read modulo 2^32. ACK 131 means bytes 1–130 arrived"; (3) "Window needed to fill a path — W ≥ C × RTT. 100 Mbit/s at 50 ms needs 625 kB, so window scaling is required beyond the 65535-byte field"; (4) "Retransmission timeout — RTO = SRTT + 4 × RTTVAR, after RFC 6298, with α = 1/8 and β = 1/4"; (5) "Handshake round trips — TCP 1 RTT, TLS 1.3 a further 1 RTT (2 total), TLS 1.2 a further 2 RTT (3 total); PSK resumption allows 0-RTT early data with replay risk"; (6) "HKDF key schedule — PRK = HMAC(salt, IKM); Early → Handshake → Master secrets, each derived with a labelled HKDF-Expand and the ECDHE input"; (7) "Diffie-Hellman shared secret — Z = g^(ab) mod p, computed as B^a or A^b. It is never transmitted, which is what gives forward secrecy"; (8) "Key-size equivalence — AES-128 ↔ RSA/DH-3072 ↔ P-256 ↔ SHA-256, all about 128-bit security; RSA-2048 is about 112-bit"; (9) "Nonce collision probability — p ≈ q²/2^(n+1) for q records with random n-bit nonces — the reason TLS 1.3 uses a counter-based nonce instead"; (10) "Certificate lifetime and HSTS window — Public TLS certificates: at most 398 days. HSTS preload: max-age ≥ 31,536,000 s with includeSubDomains and preload".
- One-sentence synthesis, quoted: "IP moves packets without promises, TCP adds order and retransmission, TLS adds confidentiality, integrity and authenticated identity with a one-round-trip handshake whose keys are ephemeral, and HTTPS deployment is what keeps those properties instead of trading them away for convenience."
- Closing callout: "the study guide carries the attack and protocol narrative; this page carries the arithmetic. Finish with the Quiz Hub and the Week 7 flashcards, then redraw the TLS 1.3 message flow from memory."

---

## 2. FORMULAS AND NUMERIC DRILLS

Everything below is quoted or directly derived from the two pages; arithmetic is shown step by step.

**F1. Wire length (encapsulation overhead) — `#sec-m-layers`**
Quoted: \(L_{\text{wire}} = L_{\text{eth}} + L_{\text{ip}} + L_{\text{tcp}} + L_{\text{tls}} + P = 14 + 20 + 20 + 22 + P = 76 + P\).
- 14 (Ethernet II: destination, source, type) + 20 (IPv4 header without options) + 20 (TCP header without options) + 22 (TLS record: 5-byte record header + 1-byte inner content type + 16-byte AEAD tag) = **76 bytes** of header before any application byte.
- MTU 1500 → TCP payload limit = 1500 − 20 − 20 = **1460 bytes**.
- Application bytes per full-size record = 1460 − 22 = **1438 bytes**.
- Check: 76 + 1438 = **1514 bytes** = one full-size Ethernet frame (14 + 1500).

**F2. Efficiency — `#sec-m-layers`**
Quoted: \(\eta = P / L_{\text{wire}}\).
- With TLS: η = 1438 / 1514 = **0.9498** (≈95%).
- Without TLS: η = 1460 / 1514 = **0.9643**.
- Cost of protection = 0.9643 − 0.9498 = **0.0145 ≈ 1.5 percentage points**; per-segment cost = 22 / 1460 = **0.01507 ≈ 1.5%**.
- Record-size rule: TLS 1.3 max plaintext = 2^14 = **16,384 bytes**; "a request/response workload typically uses records of a few hundred bytes and pays proportionally more overhead."

**F3. TCP sequence arithmetic and cumulative ACK — `#sec-m-tcp`**
Quoted: \(seq_{n+1} = (seq_n + \mathrm{len}_n) \bmod 2^{32}\), \(seq \in [0, 2^{32})\); \(ACK = seq_{\text{first}} + \text{bytes received contiguously}\).
- Sequence space = 2^32 = **4,294,967,296** byte values; random ISN, every value \((ISN + k) \bmod 2^{32}\).
- Deck example: segments 1–40, 41–70, 71–100, 101–130 → contiguous bytes = **130**, so ACK = 1 + 130 = **131** ("all bytes up to 130 arrived").
- Loss of 41–70 → receiver keeps sending **ACK 41** (highest contiguous byte = 40, next expected = 41); after the RTO the sender retransmits 41–70; when it arrives the contiguous prefix is 1…130 and the next ACK is **131**.

**F4. Window, bandwidth-delay product, throughput — `#sec-m-tcp`**
Quoted: \(\text{throughput} \le W / \mathrm{RTT}\), \(W_{\min} = C \times \mathrm{RTT}\).
- Worked example: C = 100 Mbit/s, RTT = 50 ms → 100 × 10^6 × 0.05 = 5 × 10^6 bits = **625,000 bytes**.
- Unscaled window: 65535 B / 0.05 s = 1,310,700 B/s = **1.31 MB/s ≈ 10.5 Mbit/s**, about **one tenth** of the 100 Mbit/s path.
- Scaling: need 65535 × 2^k ≥ 625,000 → 2^k ≥ **9.54** → k = **4** → 65535 × 16 = **1,048,560 bytes**.
- Window field is **16 bits**, so W ≤ **65,535 bytes** without the window-scaling option.
- Second drill (page quick-check): C = 200 Mbit/s, RTT = 100 ms → 200 × 10^6 × 0.1 = 2 × 10^7 bits = **2.5 MB**; 65535 B / 0.1 s = 655,350 B/s ≈ **5.2 Mbit/s**, about a fortieth of capacity → window scaling mandatory.

**F5. Retransmission timeout (RFC 6298) — `#sec-m-tcp`**
Quoted: \(SRTT \leftarrow (1-\alpha)SRTT + \alpha R\); \(RTTVAR \leftarrow (1-\beta)RTTVAR + \beta |SRTT - R|\); \(RTO = SRTT + 4 \cdot RTTVAR\), with α = **1/8**, β = **1/4**.
- Page example: SRTT = 400 ms, RTTVAR = 100 ms → RTO = 400 + 4(100) = 400 + 400 = **800 ms**.
- RFC 6298 requires a **floor of one second**; production stacks lower it ("a loss on a fast path can be repaired in tens of milliseconds rather than a second").

**F6. Round-trip budget — `#sec-m-tcp`**
Quoted rows: TCP three-way handshake = **1 RTT**; TLS 1.3 full handshake = **1 RTT**; TLS 1.2 full handshake = **2 RTT**; TLS 1.3 with PSK resumption = **0 RTT (early data)**.
- At RTT = 50 ms: TCP + TLS 1.3 = 1 + 1 = 2 × 50 = **100 ms** to first request byte; TCP + TLS 1.2 = 1 + 2 = 3 × 50 = **150 ms**.
- 0-RTT early data carries **replay risk**: "the server processes the first flight before it has proved the client is live, so 0-RTT data must be restricted to requests that are safe to repeat."

**F7. Half-open state / SYN flood resource equation — `#sec-m-tcp`**
Quoted: \(N_{\text{half-open}} \approx \lambda \times T\).
- SYN-ACK retransmission schedule: 1 + 2 + 4 + 8 + 16 + 32 = **63 seconds**.
- λ = 1000 SYNs/s → N ≈ 1000 × 63 = **63,000 simultaneous entries**; backlog of 1024 overflows in ≈ 1024/1000 = **1.02 s, "roughly one second"**.
- With SYN cookies: **N_half-open = 0**.

**F8. HKDF key schedule — `#sec-m-tls`**
Quoted: \(\mathrm{PRK} = \mathrm{HMAC}(salt, \mathrm{IKM})\), \(\mathrm{OKM} = \mathrm{HKDF\text{-}Expand}(\mathrm{PRK}, info, L)\).
- Chain: Early = HKDF-Extract(0, PSK) → Handshake = HKDF-Extract(DeriveSecret(Early, "derived"), ECDHE) → Master = HKDF-Extract(DeriveSecret(Handshake, "derived"), 0).
- Outputs: key = HKDF-Expand-Label(secret, "key", "", K); iv = HKDF-Expand-Label(secret, "iv", "", **12**) → 12-byte / **96-bit** nonce; Finished = HMAC(finished_key, TH) where TH = H(ClientHello ‖ ServerHello ‖ ⋯).
- Hash choice comes from the suite: SHA-256 for `TLS_AES_128_GCM_SHA256` and `TLS_CHACHA20_POLY1305_SHA256`, SHA-384 for `TLS_AES_256_GCM_SHA384`.

**F9. Diffie-Hellman / ephemeral key exchange — `#sec-m-tls`**
Quoted: \(A = g^{a} \bmod p\), \(B = g^{b} \bmod p\), \(Z = B^{a} = A^{b} = g^{ab} \bmod p\).
- Hardness: recovering \(a\) from \(A\) = discrete-logarithm problem; recovering \(Z\) from \(A\) and \(B\) = computational Diffie-Hellman problem. **Z is never transmitted** → forward secrecy.
- Step trace in the page's loss-free form: (1) both sides pick secret exponents a and b; (2) exchange A and B; (3) each computes Z = B^a = A^b = g^(ab) mod p; (4) Z is the ECDHE input to the key schedule; (5) the long-term key only signs the transcript (CertificateVerify), so a later leak of it recovers neither a, nor b, nor Z.
- X25519 contributes "about 128-bit security"; the secret \(a\) "stays on the client".

**F10. AEAD nonce and forgery probabilities — `#sec-m-tls`, `#sec-m-https`**
Quoted: \((C, T) = \mathrm{AEAD.Encrypt}(key, nonce, aad, P)\), \(nonce = iv \oplus \mathrm{seq}\); \(\Pr[\text{tag forgery}] = 2^{-t}\); \(\Pr[\text{nonce collision}] \approx q^{2}/2^{\,n+1}\).
- 128-bit tag → blind forgery probability = 2^−128 per attempt ("integrity failures are engineered, not guessed").
- Birthday bound, exactly as worked: n = 96, q = 2^32 → q² = 2^64; 2^(n+1) = 2^97; p ≈ 2^64 / 2^97 = **2^−33 ≈ 1.2 × 10^−10** (compute: 2^33 = 8,589,934,592 → 1/2^33 = 1.164 × 10^−10).
- Why counters: nonce reuse under one key is "catastrophic for GCM"; RFC 8446 sets per-key usage limits plus a `KeyUpdate` message "to rekey before the counter can wrap". Table: TLS 1.3 nonce size = **96 bits (12 bytes)**, "Counter-based, so the birthday bound never applies".

**F11. Key-size / security-strength equivalence (NIST SP 800-57 Part 1 Rev 5) — `#sec-m-tls`**
| Symmetric | FF-DH / DSA | RSA modulus | Elliptic curve | Hash | Strength |
|---|---|---|---|---|---|
| 2TDEA | L=1024, N=160 | 1024 | 160–223 | SHA-1 | 80 bits |
| 3TDEA | L=2048, N=224 | 2048 | 224–255 | SHA-224 | 112 bits |
| AES-128 | L=3072, N=256 | 3072 | 256–383 | SHA-256 | 128 bits |
| AES-192 | L=7680, N=384 | 7680 | 384–511 | SHA-384 | 192 bits |
| AES-256 | L=15360, N=512 | 15360 | 512+ | SHA-512 | 256 bits |
- Derived rule: RSA-2048 ≈ **112-bit** security; RSA/DH-3072 ≈ AES-128 ≈ P-256 ≈ SHA-256 ≈ **128-bit**; SHA-256 collision resistance = 128 bits (half the digest length); AES-256-GCM session key = 256-bit.
- Reading rule from the page: "a cipher suite's name tells you the symmetric strength but not the strength of the authentication."

**F12. Entropy: key versus password — `#sec-m-tls`**
Quoted: \(H = \log_2 2^{k} = k\ \text{bits}\), \(\Pr[\text{guess}] = 2^{-k}\), \(H_{\max} = L \log_2 N\).
- 8-character lowercase password: log2 26 = 4.7004; 8 × 4.7004 = **37.6 bits** (2^37.6 ≈ 2.1 × 10^11 guesses). That is 37.6/128 = **29% — less than a third** of the weakest TLS 1.3 session key (AES-128 at 128 bits).
- A k-bit uniform key: H = k and Pr[guess] = 2^−k; e.g. a 128-bit key gives 2^−128 per guess attempt.

**F13. RSA signature and verification (certificate signatures) — `#sec-m-certs`**
Quoted: \(s \equiv m^{d} \pmod n\), \(m' \equiv s^{e} \pmod n\), \(m = \mathrm{EMSA\text{-}PSS\text{-}Encode}(H(\text{TBS}))\).
- Verification succeeds only if \(m' = m\). RSA-2048 with e = 65537 in practice (page states the modulus/strength equivalence, not e); padding (PSS) prevents "a signature [being] turned into a different valid signature" and textbook RSA is malleable. ECDSA/EdDSA give the same guarantee under a different hardness assumption.

**F14. Certificate validity as a boolean conjunction — `#sec-m-certs`**
Quoted: \(\mathrm{Valid} = \bigwedge \mathrm{Sig}(C_i, pk(C_{i+1})) \wedge \bigwedge \mathrm{Time}(C_i) \wedge \mathrm{Name}(C_0, host) \wedge \mathrm{Usage}(C_i) \wedge \neg\,\mathrm{Revoked}(C_i)\).
- Checklist: **signature, time, name, usage, revocation**. One false term → whole conjunction false → "the browser is required to refuse the connection — not to warn and continue."
- Lifetime: \(t_{\text{notBefore}} \le t_{\text{now}} \le t_{\text{notAfter}}\), \(t_{\text{notAfter}} - t_{\text{notBefore}} \le\) **398 days**; renewal must begin at \(t_{\text{notAfter}} - \ell\) with lead time ℓ comfortably larger than the worst-case issuance delay.

**F15. Wildcard name matching — `#sec-m-certs`**
- `*.example.com` matches `www.example.com`; does **not** match `a.b.example.com` (two labels) and does **not** match `example.com` (zero labels).
- Formal rule: pattern \(*.\ell_1 \ldots \ell_j\) matches \(x_1 \ldots x_{j+1}\) iff there are exactly j+1 labels with x2 = ℓ1, …, x_{j+1} = ℓj.
- Applied: SAN `DNS:*.shop.example, DNS:shop.example` accepts `checkout.shop.example` (one label in the wildcard position) but rejects `a.checkout.shop.example`.
- `example.net` can never be presented for `example.com`.

**F16. Certificate Transparency proof size — `#sec-m-certs`**
Quoted: \(|\text{proof}| = \lceil \log_2 n \rceil\) hashes.
- n = 10^9: log2(10^9) = 29.897 → ⌈29.897⌉ = **30 hashes** ("a few hundred bytes"; with 32-byte SHA-256 hashes, 30 × 32 = 960 bytes).
- Check against powers of two: 2^29 = 536,870,912 < 10^9 ≤ 2^30 = 1,073,741,824.

**F17. HSTS window and redirect latency — `#sec-m-https`**
Quoted: `Strict-Transport-Security: max-age=Δ`, Δ ≥ **31,536,000 s**; \(T_{\text{first byte}} \approx (1+r) \times \mathrm{RTT} + T_{\text{handshake}}\).
- 31,536,000 s = 365 × 86,400 = **1 year** (preload minimum); 63,072,000 s = 730 × 86,400 = **2 years** (common production value); the page's own example header is `max-age=63072000; includeSubDomains; preload`.
- Redirect cost: r = 1, RTT = 50 ms → redirect alone ≈ (1) × 50 = **50 ms**, and it is in plaintext.
- Certificate lifetime ceiling: **398 days** (CA/Browser Forum, publicly trusted TLS server certificates).
- Rule of thumb: a short policy such as max-age = 86,400 s (1 day) is still enforced by the browser, but "the protection expires quickly and the first-visit window stays open"; the preload list (not the browser) refuses values below one year.

**F18. TLS 1.3 downgrade sentinel — `#sec-m-https`**
- ServerHello.random[24..32) = `44 4F 57 4E 47 52 44 01` = ASCII "DOWNGRD" + 0x01 (8 bytes = 32 bits at offsets 24–31 of the 32-byte random). A client that offered TLS 1.3 and sees this from a server negotiating TLS 1.2 or below aborts the handshake.
- Three layers of downgrade defence named by the page: protocol sentinel, HSTS (deployment), server minimum-version policy.

---

## 3. PITFALLS

1. **"TCP is secure because it is reliable" is wrong because reliability and authenticity are different questions; the page says** "TCP will happily deliver the attacker's bytes in perfect order and retransmit anything that goes missing. Reliability is not authenticity: an ordered, acknowledged byte stream can be entirely false" (`#sec-mitm`), and "TCP makes delivery reliable, and it is *still not secure*. It offers no secrecy and no server identity" (`#sec-transport`).
2. **"Encryption alone — or a padlock, or a technically valid certificate — proves I reached the right server" is wrong because encryption without validated identity just builds a private channel to the attacker, and validation proves a name, not an intent; the page says** "TLS only defeats a MITM when the client validates the chain and matches the hostname. A client that ignores the warning has handed the attacker a valid session" (`#sec-mitm`); "the padlock icon afterwards means only that a TLS session exists, not that it reaches the bank" (`#sec-mitm`); and for `paypa1-secure.example.net`, "All the technical checks pass for a name the attacker legitimately controls; PKI proves name ownership, not intent" (`#sec-certs`).
3. **"A wildcard certificate covers every subdomain" is wrong because a wildcard matches exactly one label; the page says** `*.example.com` matches `www.example.com`, "but not `a.b.example.com`, nor `example.com`" (`#sec-m-certs`), and a correct client "must reject the connection — this is a name-check failure, not a signature failure".
4. **"Port scanning is already a compromise" is wrong because reconnaissance only identifies possible entry points; the page says** "An open port reveals a reachable service; the risk depends on *what is running and how it is configured*. **Reconnaissance does not equal compromise**" (`#sec-attacks`).
5. **"A SYN flood takes the server down" (as if the process crashed), or "it is a confidentiality attack", is wrong because the resource — not the process — is exhausted and no data is read or altered; the page says** "The service may still be running, but legitimate clients struggle to connect", "The backlog fills, so new legitimate SYNs are dropped", and the quick-check answer is "Availability: the backlog fills with half-open connections, so legitimate clients cannot connect" (`#sec-attacks`).
6. **"Ingress filtering (BCP 38) is the control for ARP spoofing" is wrong because the two spoofing families live at different layers; the page says** BCP 38 with reverse-path forwarding is the representative control for **IP spoofing** ("the source IP address inside the packet header"), while ARP spoofing ("an IP-to-MAC mapping: another host's IP address appears to map to the attacker's MAC address") is answered by "Dynamic ARP inspection with DHCP snooping, port security, 802.1X, static entries for critical hosts" and is scoped to "one local network segment" (`#sec-attacks`).
7. **"Segmentation is an encryption control" is wrong because it limits reachability, not readability; the page says** "Segmentation does not encrypt anything; it limits what a single foothold can reach" (`#sec-attacks`), and in the matcher it is the control for the exposed database port 3306 (`#sec-gaps`).
8. **"Any HTTPS redirect is as good as HSTS" is wrong because the first plaintext request still leaves the device; the page says** "The first plaintext request is fully exposed and can be answered by an attacker before the redirect ever reaches the real server — a cross-host redirect is not a substitute for HSTS", and "Without HSTS the first plaintext request is still available to an attacker on the path, who can strip TLS before it is negotiated — the certificate never gets a chance to fail" (`#sec-https`).
9. **"A cumulative ACK reports the last byte received" is wrong because it names the next byte expected; the page says** "A cumulative acknowledgement names the next byte the receiver expects, not the last byte it received: \(ACK = seq_{\text{first}} + \text{bytes received contiguously}\)", which is why the deck's \(1-130\) segments produce "\(ACK = 131\), meaning 'all bytes up to 130 arrived'" and why the loss of 41–70 produces repeated \(ACK = 41\) (`#sec-m-tcp`).
10. **"A longer key guarantees a stronger system" is wrong because the system is bounded by its weakest component; the page says** "The overall strength is bounded by the weakest component — for example a 112-bit RSA-2048 signature — and by correct nonce handling" (`#sec-m-tls`), and "A longer key is not automatically stronger — what matters is the strength of the best known attack" (`#ix-race-strength`).
11. **"Heartbleed was a protocol design flaw, fixed by upgrading to TLS 1.3, and keys can be rotated before patching" is wrong on all three counts; the page says** "the design was fine, the bounds check was missing"; "TLS 1.3 removes the heartbeat extension, but the class of bug — trusting a claimed length — recurs in every parser. Version upgrades reduce surface; they do not replace input validation"; and the incident pipeline warns "Order matters: rotating keys before patching just re-exposes the new keys", with Contain ("Patch or disable the vulnerable service so no further memory can be read") as step 1 (`#sec-impl`).
12. **"TLS record overhead is the 16-byte tag and it sits outside the TCP payload" is wrong on both counts; the page says** the overhead is "5-byte record header + 1-byte inner content type + 16-byte AEAD tag = 22 bytes" and "Because the TLS record overhead sits *inside* that TCP payload, the application bytes per full-size record are \(1460 - 22 = 1438\)" (`#sec-m-layers`), with the exam checklist naming "Forgetting that the TLS record sits inside the TCP payload" as where marks are lost (`#sec-m-checklist`).


---

## 4. TESTABLE CLAIMS

1. "Network security protects data while it moves across untrusted networks" is the week's framing claim: the four attacker capabilities are read (confidentiality), change (integrity), pretend (authenticity/trust) and block (availability), and only data in transit is in scope. — `chapter7-study.html#sec-travel`
2. IP is best-effort — packets can be lost, late, out of order or duplicated, and IP promises neither delivery, order nor uniqueness — while UDP sends independent datagrams with no connection setup, no retransmission and no ordering guarantee, which suits voice calls, online games and DNS queries where late data is less valuable than fresh data. — `chapter7-study.html#sec-transport`
3. TCP provides a byte stream in order with acknowledged and retransmitted delivery and per-connection state (sequence numbers, windows, timers), and supplies **no** secrecy or identity. — `chapter7-study.html#sec-transport`
4. A cumulative acknowledgement names the next byte expected: `ACK 131` means everything up to byte 130 arrived, and if 41–70 is lost the receiver keeps sending `ACK 41` until the sender retransmits. — `chapter7-study.html#sec-transport` / `chapter7-math.html#sec-m-tcp`
5. The three-way handshake (`SYN → SYN-ACK → ACK`) proves both endpoints exist, are reachable and have synchronised initial sequence numbers — and proves nothing about identity. — `chapter7-study.html#sec-transport`
6. Reconnaissance is not compromise: an open port reveals a reachable service and the risk depends on what is running and how it is configured. — `chapter7-study.html#sec-attacks`
7. A SYN flood attacks availability by consuming backlog state with half-open connections, and SYN cookies remove the state commitment by encoding connection parameters into the server's own sequence number so nothing is allocated before the ACK. — `chapter7-study.html#sec-attacks`
8. ARP spoofing forges an IP-to-MAC mapping and is scoped to one local segment (dynamic ARP inspection with DHCP snooping, port security, 802.1X, static entries), whereas IP spoofing forges the source address in the packet header and is answered by ingress/egress filtering (BCP 38) and reverse-path forwarding; segmentation "does not encrypt anything; it limits what a single foothold can reach". — `chapter7-study.html#sec-attacks`
9. A man-in-the-middle attack is an active attack in which the adversary inserts itself between two endpoints and relays their traffic so each side believes it is talking directly to the other; the three phases are get in the path, impersonate or relay, and stay unnoticed. — `chapter7-study.html#sec-mitm`
10. TLS converts interception into a detected failure only because the client validates the certificate chain and matches the hostname; a user who accepts the warning "has handed the attacker a valid session", and the padlock afterwards means only that a TLS session exists. — `chapter7-study.html#sec-mitm`
11. TLS 1.3 (RFC 8446) removed RSA key transport, static Diffie-Hellman, CBC-mode suites, RC4, 3DES, renegotiation and compression, so every remaining suite is AEAD with an ephemeral key exchange and forward secrecy is mandatory. — `chapter7-study.html#sec-tls`
12. In TLS 1.3 the authentication tag covers the sequence number and content type as well as the payload, so records cannot be silently reordered, dropped or replayed — and authentication happens once, at the start, because "the certificate is not re-checked per record". — `chapter7-study.html#sec-tls`
13. A certificate binds a server name to a public key signed by a trusted CA, and a certificate is valid only if signature ∧ time ∧ name ∧ usage ∧ ¬revoked all hold, its lifetime is at most 398 days (CA/Browser Forum) and `*.example.com` matches exactly one label — while only the hostname check proves the name is *yours* (`paypa1-secure.example.net` passes every technical check). — `chapter7-study.html#sec-certs` / `chapter7-math.html#sec-m-certs`
14. HTTPS is HTTP inside TLS on port 443 and protects confidentiality, integrity and authentication, but it does not fix weak passwords, malware on the device or server-side breaches. — `chapter7-study.html#sec-https`
15. HSTS (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`) makes a host HTTPS-only, upgrades plaintext requests before they leave the device, makes certificate errors non-bypassable and, with `preload`, closes even the first-visit window; the preload minimum is 31,536,000 s (1 year) and 63,072,000 s (2 years) is the common production value. — `chapter7-study.html#sec-https` / `chapter7-math.html#sec-m-https`
16. Heartbleed was a missing bounds check — the implementation echoed the length the client claimed rather than the length it sent, returning up to 64 KB of adjacent process memory — which is why "a length field is untrusted input". — `chapter7-study.html#sec-impl`
17. Wire overhead on an Ethernet path is `L_wire = 14 + 20 + 20 + 22 + P = 76 + P`; at a 1500-byte MTU the TCP payload is 1460 bytes and a full-size TLS record carries 1438 application bytes, giving η = 1438/1514 = 0.9498 versus 0.9643 without TLS. — `chapter7-math.html#sec-m-layers`
18. Throughput is bounded by `W / RTT` and `W_min = C × RTT`: 100 Mbit/s at 50 ms needs 625,000 bytes in flight, so the 16-bit window field (max 65,535 bytes) must be scaled by `2^k`, where k = 4 gives 1,048,560 bytes. — `chapter7-math.html#sec-m-tcp`
19. `RTO = SRTT + 4 × RTTVAR`, with `SRTT ← (1−α)SRTT + αR` and `RTTVAR ← (1−β)RTTVAR + β|SRTT − R|`, α = 1/8 and β = 1/4 (RFC 6298); the page's example gives 400 + 4(100) = 800 ms, and RFC 6298 imposes a one-second floor that production stacks lower. — `chapter7-math.html#sec-m-tcp`
20. Key-size equivalence (NIST SP 800-57 Part 1 Rev 5) puts AES-128, RSA/DH-3072, EC 256–383, SHA-256 and 128-bit security in one row and describes RSA-2048 as about 112-bit; "a cipher suite's name tells you the symmetric strength but not the strength of the authentication". — `chapter7-math.html#sec-m-tls`

---


## 5. ANCHOR INDEX

**chapter7-study.html**

```
chapter7-study.html#sidebar - sidebar navigation (section links, progress)
chapter7-study.html#sidebarToggle - sidebar toggle button
chapter7-study.html#mainContent - main content wrapper
chapter7-study.html#hero - Overview / week framing and standards provenance
chapter7-study.html#sec-travel - Packets on an Untrusted Path
chapter7-study.html#ix-journey - interactive: the six steps from Send to read
chapter7-study.html#sec-transport - IP, UDP and TCP: What Each Layer Promises
chapter7-study.html#ix-tcp - interactive host: TCP handshake / connection view
chapter7-study.html#sol-1 - worked example: read the trace, then name the guarantee
chapter7-study.html#sec-attacks - Network Attacks: Reconnaissance, Availability and Forged Identity
chapter7-study.html#ix-syn-flood - interactive: reconstruct the SYN flood
chapter7-study.html#sec-mitm - Man-in-the-Middle: Becoming the Path
chapter7-study.html#ix-path - interactive diagram: where an attacker can sit on one request's path
chapter7-study.html#ix-mitm - interactive host: MITM channel view
chapter7-study.html#sol-2 - worked example: classify the rogue-Wi-Fi scenario
chapter7-study.html#sec-gaps - Reliability Answers "Did It Arrive?" — Security Asks More
chapter7-study.html#ix-attack-counter - interactive matcher: attacks to controls
chapter7-study.html#sec-tls - TLS 1.3: Four Moves, One Secure Channel
chapter7-study.html#ix-tls - interactive host: TLS handshake view
chapter7-study.html#sec-certs - Certificates: Which Key Do You Trust?
chapter7-study.html#ix-cert-steps - interactive: order the browser's certificate validation
chapter7-study.html#sec-https - HTTPS in Practice: Same Request, Protected
chapter7-study.html#ix-protocol-timeline - interactive: SSL/TLS/HSTS timeline 1995 to today
chapter7-study.html#sol-3 - worked example: audit an HTTPS deployment
chapter7-study.html#sec-impl - When the Implementation Breaks the Promise (Heartbleed)
chapter7-study.html#ix-impl-cards - interactive flashcards: the Heartbleed case
chapter7-study.html#ix-incident - interactive: incident response pipeline for memory disclosure
chapter7-study.html#sec-recap - Week 7 Recap
```

**chapter7-math.html**

```
chapter7-math.html#mainContent - math page content wrapper
chapter7-math.html#sec-m-hero - Foundations hero: scope and standards provenance
chapter7-math.html#sec-m-layers - Encapsulation and the cost of protection
chapter7-math.html#ix-record - interactive stepper: building one TLS 1.3 record
chapter7-math.html#ix-primitive-property - matcher: mechanism to property it supplies
chapter7-math.html#sec-m-tcp - Sequence numbers, windows and round-trip budgets
chapter7-math.html#ix-race-rtt - bar chart: round trips before the first HTTP byte
chapter7-math.html#sol-m1 - worked example: reading a loss trace numerically
chapter7-math.html#sec-m-tls - The TLS 1.3 key schedule and key sizes
chapter7-math.html#ix-race-strength - bar chart: security strength in bits
chapter7-math.html#sol-m2 - worked example: which part of the handshake protects what
chapter7-math.html#sec-m-certs - Certificate validation as a decision procedure
chapter7-math.html#ix-m-validate - sequence: order the verification, then say what it rules out
chapter7-math.html#sol-m3 - worked example: evaluate the validation conjunction
chapter7-math.html#sec-m-https - HSTS, downgrade and operational arithmetic
chapter7-math.html#sec-m-checklist - Exam checklist
chapter7-math.html#ix-m-formulas - flashcard deck: formulas and figures to recall
```

---

## 6. GRAPH SEEDS

### Study page (16 nodes)

| id suggestion | label | one-sentence definition (from the page) | anchor |
|---|---|---|---|
| `data-in-transit` | Data in transit | "Data in transit is the only thing this week's controls protect; data at rest and application logic are separate problems." | `#sec-travel` |
| `four-capabilities` | Read, change, pretend, block | The four things an attacker on the untrusted path can do, mapped to confidentiality, integrity, authenticity/trust and availability respectively. | `#sec-travel` |
| `ip-best-effort` | IP best-effort delivery | "IP does not promise delivery, order or uniqueness" — packets can be lost, late, out of order or duplicated. | `#sec-transport` |
| `udp-datagram` | UDP datagram service | "UDP sends independent packets with almost no overhead: no connection setup, no retransmission, no ordering guarantee." | `#sec-transport` |
| `tcp-byte-stream` | TCP byte stream | TCP delivers an ordered, acknowledged, retransmitted byte stream with per-connection state — and no secrecy or identity. | `#sec-transport` |
| `three-way-handshake` | Three-way handshake | `SYN → SYN-ACK → ACK` establishes "connection state before application data starts moving" and proves an address responded, not who it is. | `#sec-transport` |
| `syn-flood` | SYN flood | An availability attack that repeats only the start of the handshake so half-open entries fill the backlog until legitimate clients cannot connect. | `#sec-attacks` |
| `syn-cookies` | SYN cookies | "The server encodes the connection parameters into its own sequence number and allocates nothing until the ACK actually arrives." | `#sec-attacks` |
| `arp-vs-ip-spoofing` | ARP spoofing vs IP spoofing | ARP spoofing forges an IP-to-MAC mapping on one local segment; IP spoofing forges the source IP in the packet header and is countered by BCP 38 filtering and reverse-path forwarding. | `#sec-attacks` |
| `mitm-attack` | Man-in-the-middle attack | "An *active* attack in which the adversary inserts itself between two endpoints and relays their traffic, so that each side believes it is talking directly to the other." | `#sec-mitm` |
| `forward-secrecy` | Forward secrecy (TLS 1.3) | "The session key is derived from a Diffie-Hellman secret that is never transmitted, which is why a later compromise of the server's long-term key does not decrypt recorded sessions." | `#sec-tls` |
| `aead-record` | AEAD record protection | Application data is fragmented into records, each encrypted, with "an authentication tag over each record's content and metadata" so tampering is detected before release. | `#sec-tls` |
| `cert-chain` | Certificate chain of trust | Root CA (trust store) → intermediate (signs the leaf) → leaf certificate (name + public key) → session keys only after validation. | `#sec-certs` |
| `hostname-validation` | Hostname validation | "A certificate proves that *some* name is bound to *some* key. Only the hostname check proves that the name is *yours*." | `#sec-certs` |
| `hsts-policy` | HSTS | A response header that makes the browser treat a host as HTTPS-only, upgrade plaintext requests before they leave the device, and treat certificate errors as non-bypassable. | `#sec-https` |
| `heartbleed` | Heartbleed | The heartbeat implementation "echoed the length claimed by the client instead of the length actually sent, so a short request returned up to 64 KB of adjacent process memory". | `#sec-impl` |

*(16 study nodes. Port scanning and the five exposed ports — 22/80/443/3306/53 — are deliberately left out of the graph seeds and remain in the section notes, key facts and testable claims.)*

### Foundations page (10 nodes)

| id suggestion | label | one-sentence definition (from the page) | anchor |
|---|---|---|---|
| `m-wire-overhead` | Wire length and encapsulation overhead | \(L_{\text{wire}} = 14 + 20 + 20 + 22 + P = 76 + P\), and at a 1500-byte MTU a full-size record carries \(1460 - 22 = 1438\) application bytes. | `#sec-m-layers` |
| `m-efficiency` | Efficiency \(\eta\) | \(\eta = P / L_{\text{wire}}\), so TLS costs 1438/1514 = 0.9498 versus 0.9643 without it — about 1.5 percentage points. | `#sec-m-layers` |
| `m-seq-ack` | Sequence numbers and cumulative ACK | \(seq_{n+1} = (seq_n + len_n) \bmod 2^{32}\) and \(ACK = seq_{first} + \text{contiguous bytes}\), so segments 1–130 produce ACK 131. | `#sec-m-tcp` |
| `m-bdp-window` | Bandwidth-delay product and window | \(W_{\min} = C \times \mathrm{RTT}\) with throughput \(\le W/\mathrm{RTT}\); 100 Mbit/s at 50 ms needs 625,000 bytes, beyond the 65,535-byte window field. | `#sec-m-tcp` |
| `m-rto` | Retransmission timeout | \(RTO = SRTT + 4 \cdot RTTVAR\) after RFC 6298 with α = 1/8 and β = 1/4, floored at one second by the standard. | `#sec-m-tcp` |
| `m-half-open` | Half-open state equation | \(N_{\text{half-open}} \approx \lambda \times T\): 1000 SYNs/s over the 63-second SYN-ACK schedule demands about 63,000 entries, and SYN cookies make it zero. | `#sec-m-tcp` |
| `m-hkdf` | HKDF key schedule | \(\mathrm{PRK} = \mathrm{HMAC}(salt, \mathrm{IKM})\) then labelled HKDF-Expand derives Early → Handshake → Master secrets down to the record key and 12-byte IV. | `#sec-m-tls` |
| `m-dh` | Ephemeral Diffie-Hellman | \(Z = B^{a} = A^{b} = g^{ab} \bmod p\) is never transmitted, which is what makes forward secrecy possible. | `#sec-m-tls` |
| `m-key-strength` | Key-size equivalence | AES-128 ↔ RSA/DH-3072 ↔ P-256 ↔ SHA-256 at about 128-bit security, while RSA-2048 is about 112-bit (NIST SP 800-57 Part 1 Rev 5). | `#sec-m-tls` |
| `m-cert-conjunction` | Certificate validity conjunction | \(\mathrm{Valid} =\) signature ∧ time ∧ name ∧ usage ∧ ¬revoked, where a single false term means the browser must refuse the connection. | `#sec-m-certs` |

---

## 7. FLASHCARD SEEDS

**Card 1 — Front:** What four things can an attacker on the path do, and which security property does each put at risk?
**Back:** Read → confidentiality (TLS record encryption); change → integrity (AEAD authentication tag on every record); pretend → authenticity/trust (certificates, signatures, hostname validation); block → availability (segmentation, rate limiting, upstream scrubbing). Anchor: `chapter7-study.html#sec-travel`.

**Card 2 — Front:** What does TCP guarantee, and what does it leave open?
**Back:** TCP answers delivery — order (sequence numbers), acknowledgement (cumulative ACKs) and retransmission, with windows for flow control — and leaves confidentiality, integrity and server identity open. "Reliability is not authenticity: an ordered, acknowledged byte stream can be entirely false." Anchor: `chapter7-study.html#sec-transport`, `#sec-mitm`.

**Card 3 — Front:** What did TLS 1.3 remove, and why does that make forward secrecy mandatory?
**Back:** It removed RSA key transport, static Diffie-Hellman, CBC-mode cipher suites, RC4, 3DES, renegotiation and compression. Everything left is an AEAD suite with an ephemeral key exchange, so the session key comes from a Diffie-Hellman secret that is never transmitted; a later compromise of the long-term key does not decrypt recorded sessions. Anchor: `chapter7-study.html#sec-tls`.

**Card 4 — Front:** Why is the hostname check not optional?
**Back:** A certificate proves that *some* name is bound to *some* key; only the hostname check proves the name is *yours*. An attacker in the path can always obtain a valid certificate for a domain they control — so PKI proves name ownership, not the user's intent. Anchor: `chapter7-study.html#sec-certs`.

**Card 5 — Front:** How many bytes does TLS add to a full-size Ethernet frame, and what is the resulting efficiency?
**Back:** `L_wire = 14 + 20 + 20 + 22 + P = 76 + P`. At a 1500-byte MTU the TCP payload is 1460 bytes and the 22-byte TLS record overhead (5 header + 1 inner content type + 16 AEAD tag) sits inside it, so a full-size record carries 1438 application bytes: η = 1438/1514 = 0.9498 versus 0.9643 without TLS. Anchor: `chapter7-math.html#sec-m-layers`.

**Card 6 — Front:** What is the bandwidth-delay product and when is window scaling required?
**Back:** \(W_{\min} = C \times \mathrm{RTT}\) is the data that must be in flight to keep the pipe full, and throughput \(\le W/\mathrm{RTT}\). 100 Mbit/s at 50 ms needs 625,000 bytes, far above the 65,535-byte (16-bit) window field, so the window-scaling option must multiply it by \(2^k\) (k = 4 gives 1,048,560 bytes). Anchor: `chapter7-math.html#sec-m-tcp`.

**Card 7 — Front:** Why did Heartbleed leak memory, and what is the transferable lesson?
**Back:** The heartbeat implementation echoed the length the client *claimed* instead of the length it actually *sent*, so a request that said "here is 1 byte" but asked for 64 KB returned up to 64 KB of adjacent process memory — potentially private keys, passwords and session cookies. A length field is untrusted input: the design was fine, the bounds check was missing. Anchor: `chapter7-study.html#sec-impl`.
