{
  nodes: [
    ["w6-harbour-incident", 6, 2, "Harbour University Incident", "At 8:03 a.m. a staff login succeeds with a valid password, and by 8:17 a.m. 8,000 student records have been accessed. The deck's verdict is that the data was encrypted, but the attacker logged in as an authorised user, so the system could not tell which human was holding a valid credential.", "../chapters/chapter6/web/chapter6-study.html#sec-incident"],

    ["w6-encryption-vs-authn", 6, 1, "Encryption Is Not Authentication", "The recap's core claim: TLS protects the channel and encryption at rest protects stored data, but neither proves that the legitimate owner is present. That is the whole incident in one sentence, and it is why the breach cannot be fixed with more encryption.", "../chapters/chapter6/web/chapter6-study.html#sec-recap"],

    ["w6-identity-authn-authz", 6, 1, "Identify, Authenticate, Authorise", "Three questions, three decisions: identification asks who do you claim to be, authentication asks can you prove the claim, and authorisation asks what are you permitted to do. The order is always claim identity, verify evidence, evaluate permission.", "../chapters/chapter6/web/chapter6-study.html#sec-system-auth"],

    ["w6-auth-factors", 6, 2, "Authentication Factor Categories", "The factor categories are something she knows (a password, reusable, shareable and phishable), something she has (a device or key she controls) and something she is (a biometric trait). Factors count separately only when each is independently verified, so password plus PIN is two steps but one factor category.", "../chapters/chapter6/web/chapter6-study.html#sec-system-auth"],

    ["w6-passkeys", 6, 2, "Passkeys and Phishing Resistance", "With passkeys the device creates and protects a private key while the portal stores only the matching public key, never a reusable password. The result is origin-bound authentication: the signature is bound to the site's origin and cannot be replayed to a look-alike domain, which resists credential stuffing and many phishing attacks.", "../chapters/chapter6/web/chapter6-study.html#sec-methods"],

    ["w6-recovery-path", 6, 3, "Recovery as an Authentication Path", "Recovery is an authentication path: the help-desk sequence of a lost phone, a weak identity check such as name plus date of birth, and an account reset lets an attacker take control. Recovery is often the weakest authentication path in the system, which is why a weak fallback bypasses the strongest primary method.", "../chapters/chapter6/web/chapter6-study.html#sec-methods"],

    ["w6-rbac", 6, 2, "Role-Based Access Control", "RBAC assigns permissions to roles, and users inherit them through role membership; the deck's five-role ladder for one system is a ladder of scope, not of status. Scope should match responsibility rather than status, and higher roles do not automatically inherit permission to read every record.", "../chapters/chapter6/web/chapter6-study.html#sec-authz"],

    ["w6-least-privilege", 6, 2, "Least Privilege and Separation of Duties", "Least privilege grants the minimum scope, actions and duration required for the task, so that if the account is compromised the attacker reaches fewer records and fewer actions. Separation of duties adds that no single person should control the entire process: the lecturer proposes marks, the coordinator reviews and approves, and the system publishes results.", "../chapters/chapter6/web/chapter6-study.html#sec-authz"],

    ["w6-broken-object-authz", 6, 2, "Broken Object-Level Authorisation", "A logged-in student with ID 1042 requests GET /marks/1043, and the server must ask whether student 1042 may view record 1043 and deny. Changing an ID in a URL is a broken authorisation control, not a failed authentication: the server never checked whether this subject may act on that object.", "../chapters/chapter6/web/chapter6-study.html#sec-authz"],

    ["w6-data-states", 6, 2, "Data States: Transit, Rest and Use", "Each data state has its own controls: TLS and authenticated channels in transit, database, disk and object-storage encryption at rest, and application permissions, isolation, minimisation and monitoring in use. In use is the state where the data is plaintext, so encryption protects particular states rather than replacing application authorisation.", "../chapters/chapter6/web/chapter6-study.html#sec-data"],

    ["w6-tls13-handshake", 6, 3, "TLS 1.3 Handshake", "ClientHello and ServerHello travel in the clear so both sides can derive handshake keys, and everything after that, including EncryptedExtensions, Certificate, CertificateVerify, Finished and application data, is encrypted. Because almost everything after ServerHello is encrypted, an observer learns the server name from SNI plus the packet sizes and timings, and little else.", "../chapters/chapter6/web/chapter6-study.html#sec-channel"],

    ["w6-backup-recovery", 6, 2, "Backups, Isolation and Tested Restores", "Availability means prevent disruption plus recover quickly: isolated, versioned, immutable backups and tested restores are the recovery path against ransomware, while redundancy, load balancing, rate limiting and monitoring sit in front of it. Backups support availability and recovery, but they do not automatically provide confidentiality.", "../chapters/chapter6/web/chapter6-study.html#sec-availability"],

    ["w6-shared-responsibility", 6, 2, "Cloud Shared Responsibility", "The provider delivers security of the cloud, covering physical and platform, hardware and storage infrastructure, core networking and the hypervisor, while the customer owns security in the cloud: identities, authentication and authorisation, applications and data, backups, retention and customer-controlled configuration. The question after an incident is which control failed and who owned it, not merely provider or customer.", "../chapters/chapter6/web/chapter6-study.html#sec-cloud"]
  ],

  edges: [
    ["w6-harbour-incident", "w6-encryption-vs-authn", 9],
    ["w6-harbour-incident", "w6-identity-authn-authz", 8],
    ["w6-harbour-incident", "w6-broken-object-authz", 7],
    ["w6-tls13-handshake", "w6-encryption-vs-authn", 8],
    ["w6-identity-authn-authz", "w6-auth-factors", 8],
    ["w6-identity-authn-authz", "w6-rbac", 9],
    ["w6-auth-factors", "w6-passkeys", 7],
    ["w6-auth-factors", "w6-recovery-path", 6],
    ["w6-passkeys", "w6-recovery-path", 6],
    ["w6-rbac", "w6-least-privilege", 8],
    ["w6-least-privilege", "w6-broken-object-authz", 7],
    ["w6-data-states", "w6-tls13-handshake", 8],
    ["w6-data-states", "w6-backup-recovery", 7],
    ["w6-shared-responsibility", "w6-data-states", 6],
    ["w6-shared-responsibility", "w6-least-privilege", 6]
  ]
}
