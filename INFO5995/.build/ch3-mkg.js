{
  nodes: [
    ["m3-threat-model", 3, 1, "Threat model: four questions", "A threat model answers four questions in order: what are we building, what can go wrong, what are we going to do about it, and did we do a good enough job. Answered for a mobile app, the second question immediately becomes platform-specific, because the app is not the only thing running on the device.", "../chapters/chapter3/web/chapter3-math.html#sec-m-model"],
    ["m3-attack-surface", 3, 2, "Attack surface as a sum", "The attack surface is the set of places where data or control can cross a trust boundary: other apps, system resources such as camera, files and location, and the messages an app will accept. Written as a sum over components, a component contributes only when all three conditions hold at once — exported(c) and not auth(c) and sensitive(c) — so a finding is a question about a conjunction, not a keyword.", "../chapters/chapter3/web/chapter3-math.html#sec-m-model"],
    ["m3-risk-product", 3, 2, "Risk R = T x V x I", "Risk composes as R = T x V x I: T is who can reach the entry point (any installed app, any web page that can trigger a link, anyone with physical access), V is whether the control that should have stopped them is present, and I is what the app can do or disclose once reached. A high-impact action behind an authenticated server check has V close to 0, while the same action on an exported screen with no session check has V close to 1.", "../chapters/chapter3/web/chapter3-math.html#sec-m-model"],
    ["m3-sandbox-policy", 3, 3, "Sandbox as a file-access policy", "A sandboxed app is modelled as the tuple of its own user ID u, the data directory D_u it owns, and the permissions G_u it has been granted. File access is then the policy decision allow(a, f) = [owner(f) = u_a] or [perm(f) belongs to G_a]: the first clause is possession, the second is a decision made at the boundary, and every gate on the study page is an instance of that second clause.", "../chapters/chapter3/web/chapter3-math.html#sec-m-sandbox"],
    ["m3-permission-model", 3, 2, "Permissions: request, grant, check", "A permission protects a capability rather than a file — camera, location, files, microphone and the rest. It is requested in the manifest, granted by the user or the platform, and checked when the resource is actually used; a permission granted once is not consent for unlimited collection, so the gray-zone question of necessity and proportionality survives every grant.", "../chapters/chapter3/web/chapter3-math.html#sec-m-sandbox"],
    ["m3-storage-classes", 3, 1, "The three storage classes", "Values are placed by asking who must be able to read them: app-private internal storage is owned by the app's user ID and protected by the sandbox, external or shared storage is readable by other apps and the user so it is treated as public, and platform credential or key storage lets the app use key material without ever reading the secret. The deck's conclusion comes before the technique — never store sensitive secrets in the client app, protect them on trusted servers.", "../chapters/chapter3/web/chapter3-math.html#sec-m-storage"],
    ["m3-search-space", 3, 3, "Search space 2^H and expected time", "A secret with H bits of entropy faces a search space of 2^H candidates, so an attacker who can inspect the client and gets one guess per attempt at rate r recovers it in expected time E[t] = 2^(H-1) / r. For a 4-digit PIN that is about 50 seconds at 100 guesses per second, so a secret that ships to the client is not protected by its length but only by the attacker's patience — and the attacker sets that.", "../chapters/chapter3/web/chapter3-math.html#sec-m-storage"],
    ["m3-deeplink-predicate", 3, 2, "Deep-link decision allow(u, s, a)", "A deep link is untrusted input, so the decision is modelled explicitly rather than in prose: allow(u, s, a) = valid(u) and authenticated(s) and authorised(s, a) and (not sensitive(a) or confirmed(a)). All four conjuncts are required, which makes the common exam follow-up — which single check was missing? — answerable by naming the false conjunct.", "../chapters/chapter3/web/chapter3-math.html#sec-m-workflow"]
  ],
  edges: [
    ["m3-threat-model", "m3-attack-surface", 8],
    ["m3-threat-model", "m3-risk-product", 7],
    ["m3-attack-surface", "m3-risk-product", 8],
    ["m3-attack-surface", "m3-sandbox-policy", 7],
    ["m3-sandbox-policy", "m3-permission-model", 8],
    ["m3-sandbox-policy", "m3-storage-classes", 7],
    ["m3-permission-model", "m3-risk-product", 6],
    ["m3-risk-product", "m3-deeplink-predicate", 8],
    ["m3-attack-surface", "m3-deeplink-predicate", 7],
    ["m3-storage-classes", "m3-search-space", 7]
  ]
}
