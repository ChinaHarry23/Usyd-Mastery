{
  nodes: [
    ["w7-untrusted-path", 7, 1, "Untrusted path and data in transit", "Network security protects data while it moves across untrusted networks, and the mental model is a chain of custody \u2014 your device, your router, your ISP, other networks, the destination network, the destination host \u2014 where a copy or an edit can happen at every hop. Data in transit is the only thing this week's controls protect; data at rest and application logic are separate problems.", "../chapters/chapter7/web/chapter7-study.html#sec-travel"],
    ["w7-ip-best-effort", 7, 1, "IP best-effort delivery", "IP forwards every packet hop by hop using a destination IP address and promises nothing about delivery, order or uniqueness: packets can be lost, late, out of order or duplicated. That is exactly why UDP and TCP sit above it.", "../chapters/chapter7/web/chapter7-study.html#sec-transport"],
    ["w7-udp-datagram", 7, 1, "UDP datagrams", "UDP sends independent packets with almost no overhead: no connection setup, no retransmission and no ordering guarantee, so the application decides what to do about loss. It is the right choice when late data is less valuable than fresh data, such as voice calls, online games and DNS queries.", "../chapters/chapter7/web/chapter7-study.html#sec-transport"],
    ["w7-tcp-stream", 7, 2, "TCP reliable byte stream", "TCP delivers a byte stream in order, acknowledged and retransmitted, and keeps per-connection state: sequence numbers, windows and timers. It does not replace IP \u2014 it detects problems above IP and recovers from them.", "../chapters/chapter7/web/chapter7-study.html#sec-transport"],
    ["w7-tcp-handshake", 7, 2, "TCP three-way handshake", "SYN, SYN-ACK and ACK are the connection state established before application data starts moving: both endpoints agree to start, synchronise initial sequence numbers, and the server allocates connection state. The handshake proves that an address responded, not which organisation or service it belongs to.", "../chapters/chapter7/web/chapter7-study.html#sec-transport"],
    ["w7-reliability-not-security", 7, 2, "Reliability is not security", "TCP answers the delivery question \u2014 order, acknowledgement and retransmission \u2014 and leaves the security questions open: whether the content was private, whether it was changed, and whether the endpoint is the server it claims to be. TLS sits between the application and TCP: TCP moves the bytes, TLS makes them trustworthy.", "../chapters/chapter7/web/chapter7-study.html#sec-gaps"],
    ["w7-syn-flood", 7, 2, "SYN flood", "The attacker repeats only the beginning of the handshake, so the server allocates state and answers each SYN while the final ACK never arrives, and half-open entries fill the backlog until legitimate clients cannot connect: a denial-of-service attack against availability. SYN cookies remove the promise by encoding the connection parameters into the server's own sequence number and allocating nothing until the ACK actually arrives.", "../chapters/chapter7/web/chapter7-study.html#sec-attacks"],
    ["w7-spoofing", 7, 2, "ARP and IP spoofing", "ARP spoofing forges an IP-to-MAC mapping so that another host's address appears to map to the attacker's MAC address on one local segment, while IP spoofing forges the source IP address inside the packet header so that replies go elsewhere or nowhere and the true origin is hidden.", "../chapters/chapter7/web/chapter7-study.html#sec-attacks"],
    ["w7-mitm", 7, 2, "Man-in-the-middle attack", "An active attack in which the adversary inserts itself between two endpoints and relays their traffic so that each side believes it is talking directly to the other; the deck's three phases are get in the path, impersonate or relay, and stay unnoticed. TLS only defeats a MITM when the client validates the chain and matches the hostname \u2014 a client that ignores the warning has handed the attacker a valid session.", "../chapters/chapter7/web/chapter7-study.html#sec-mitm"],
    ["w7-tls13-handshake", 7, 3, "TLS 1.3 handshake", "The deck's four moves are Hello (agree version and algorithms), Certificate (server proves identity), Key exchange (create session keys) and Finished (switch to protected traffic). TLS 1.3 implements them as one round trip that is AEAD-only, with the certificate encrypted and RSA key transport, static Diffie-Hellman, CBC-mode cipher suites, renegotiation and compression removed.", "../chapters/chapter7/web/chapter7-study.html#sec-tls"],
    ["w7-forward-secrecy", 7, 3, "Forward secrecy", "The session key is derived from a Diffie-Hellman secret that is never transmitted, which is why a later compromise of the server's long-term key does not decrypt recorded sessions. TLS 1.3 makes forward secrecy mandatory by removing RSA key transport and static Diffie-Hellman, so every cipher suite that remains uses an ephemeral key exchange.", "../chapters/chapter7/web/chapter7-study.html#sec-tls"],
    ["w7-cert-validation", 7, 3, "Certificate chain validation", "A certificate binds a server name to a public key, and a trusted certificate authority signs that binding: the browser checks the CA's signature and the website name, trusts the server's key, and only then uses it to create session keys. The chain, the validity window and the hostname match are what turn a MITM from an interception into a detected failure, and only the hostname check proves the name is yours.", "../chapters/chapter7/web/chapter7-study.html#sec-certs"],
    ["w7-https-hsts", 7, 2, "HTTPS and HSTS", "HTTPS is HTTP protected by TLS on port 443, so records are encrypted, tampering is detected by the record tag, and the server identity is verified by certificate and hostname check. HTTP Strict Transport Security is a response header that makes the host HTTPS-only: plaintext requests are upgraded before they leave the device and certificate errors become non-bypassable.", "../chapters/chapter7/web/chapter7-study.html#sec-https"]
  ],
  edges: [
    ["w7-untrusted-path", "w7-ip-best-effort", 7],
    ["w7-ip-best-effort", "w7-udp-datagram", 8],
    ["w7-ip-best-effort", "w7-tcp-stream", 8],
    ["w7-udp-datagram", "w7-tcp-stream", 5],
    ["w7-tcp-stream", "w7-tcp-handshake", 8],
    ["w7-tcp-stream", "w7-reliability-not-security", 8],
    ["w7-tcp-handshake", "w7-syn-flood", 8],
    ["w7-untrusted-path", "w7-spoofing", 6],
    ["w7-spoofing", "w7-mitm", 7],
    ["w7-reliability-not-security", "w7-mitm", 6],
    ["w7-reliability-not-security", "w7-tls13-handshake", 7],
    ["w7-mitm", "w7-tls13-handshake", 8],
    ["w7-tls13-handshake", "w7-forward-secrecy", 9],
    ["w7-tls13-handshake", "w7-cert-validation", 8],
    ["w7-mitm", "w7-cert-validation", 7],
    ["w7-cert-validation", "w7-https-hsts", 8]
  ]
}
