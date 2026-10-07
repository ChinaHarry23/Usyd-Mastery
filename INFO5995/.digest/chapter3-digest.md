# INFO5995 — Chapter 3 Digest: Mobile Security (S2 2026)

Sources walked in full, in order:

- `Usyd-Mastery/INFO5995/chapters/chapter3/web/chapter3-study.html` (880 lines; 12 `<section>` elements; 30 `id=` attributes)
- `Usyd-Mastery/INFO5995/chapters/chapter3/web/chapter3-math.html` (504 lines; 6 `<section>` elements; 14 `id=` attributes)

Both pages are built from the Week 3 lecture deck *Mobile Security* (INFO5995, S2 2026). The study page says so in the hero: "Built from the Week 3 lecture deck, *Mobile Security* (INFO5995, S2 2026)". The math page describes itself as "INFO5995 — Week 3 supplement" and carries the chip "Notation is a revision aid, not lecture notation" and "OWASP MASVS / Mobile Top 10 used as named reference anchors".

**Scope warning about chapter type.** Chapter 3 is a *systems/mobile* chapter, not a cryptography chapter. Neither page contains modular arithmetic, XOR, RSA, Diffie–Hellman, hash sizes, birthday bounds or key-strength tables. The only quantitative content is: the 2026 OS market-share figures, the attack-surface indicator sum, the risk product `R = T × V × I`, the boundary-product compromise probability, the ordinal blast-radius scores, and the client-side-secret search-space/expected-recovery-time table `E[t] = 2^(H−1)/r`. Everything numeric in the digest below is taken from those, with the arithmetic shown.

---

## 1. SECTION-BY-SECTION FACTS

### chapter3-study.html

---

#### `#hero` — Week 3 overview (no `sec-` prefix)

- Title: "Week 3: Mobile Security"; course line "INFO5995 — Cybersecurity"; sidebar `<h2>Week 3</h2>`.
- Hero subtitle (quoted): "The mobile threat landscape, how Android isolates applications behind a layered stack of guards, how to read an APK and its manifest, and where deep links and automated agents widen the attack surface."
- Four hero cards, each a one-line thesis: "Android is the gatekeeper"; "Sandbox, intents, permissions"; "An APK is a ZIP you can read"; "Agents extend the attack surface".
- Sidebar declares the section order used all week: Overview, Platform Landscape, Layered Defence, Threat Classification, Inside an APK, Decompilation, App Components, Intents, Manifest & Filtering, Deep Links, UI Tree & Agents, Recap — then "Foundations" (`chapter3-math.html`), "Mind Map", "Quiz Hub", "Flashcards".
- The hero's "Foundations →" button is the only forward link to the math page; there is no numeric content here.

---

#### `#sec-platform` — "Mobile Security in the Age of AI"

- Section lead (quoted): "The deck opens with a warning against complacency: AI does not replace mobile security, it creates *new actors* that can interact with mobile systems. The valuable data has not moved — it is still on the phone."
- Concept box, the organising question for the week (quoted): "what crosses each boundary in a mobile platform, and who should be allowed through?"
- Definition box "Selected smartphone operating systems (2026)": **Android ~70%** — "used by Samsung, Xiaomi, Oppo, Vivo, Google Pixel and others; an open-source core (the Android Open Source Project, AOSP) with many vendor variants"; **iOS ~30%** — "used only on iPhones"; **Everything else <1%** — "HarmonyOS (Huawei), KaiOS, and Linux-based experimental systems such as Sailfish OS and Ubuntu Touch". Sources cited as gs.statcounter.com and appmagic.rocks "as cited in the deck".
- Callout "Why the split matters for defence" (quoted): "the deck makes Android the focus because of its market share and because its architecture is open enough to inspect. Market share sets where attacker effort goes; architecture sets which controls you can actually reason about."
- 4-row table (Platform / Share (2026) / Ecosystem shape / Security consequence): Android ~70% — "Vendor customisation adds code and channels that the AOSP security model does not cover by itself"; iOS ~30% — "A smaller, more uniform surface — but the same class of risk for the data an app already holds"; HarmonyOS, KaiOS <1% — "Fewer eyes, shorter support windows, and update paths that are harder to audit"; Sailfish OS, Ubuntu Touch <1% — "Useful for study because their permission and packaging models are visible, not because they are widely attacked".
- `#ix-share` interactive chart, title "Reported mobile OS share, 2026", `max: 70`, subtitle: "Read the bar length as where attacker attention goes, not as a measure of how secure a platform is." Rows: Android value 70 display "~70%"; iOS value 30 display "~30%"; HarmonyOS value 0.5 display "<1%"; KaiOS value 0.2 display "<1%"; Sailfish OS / Ubuntu Touch value 0.1 display "<1%". (The 0.5/0.2/0.1 are bar-length values; every display string is "<1%".)
- Sub-heading "Why Android is not entirely open source" (quoted): "AOSP is the open core. A shipping phone is not AOSP: vendors add proprietary hardware drivers and their own applications, and Google's own mobile services and app store are separate, licensed components." Security consequence stated in the same paragraph: "anything added above the core is code you must reason about separately, and anything that ships as a system app carries the privileges of a system app."
- `#ix-evolution` is an empty `<div>` in the HTML filled by `chapter3-study.js` with a stepper titled "Four generations of mobile attack surface" (frames: "The phone as an appliance", "The phone as a platform", "The phone as an integration point", "The phone as a target for automation"; subtitle: "Each generation added a boundary that had to be defended. The threat does not replace the previous one — it accumulates.").
- Quick-check (correct option): "Because it holds about 70% of the market and its architecture is open enough to inspect" — with the distractor feedback confirming "AOSP is an open core, but a shipping phone carries vendor drivers, vendor apps and separately licensed services."

---

#### `#sec-layers` — "Android Is the Gatekeeper"

- Section lead (quoted): "Apps are isolated by default. Your app starts isolated from every other app, and Android decides what may cross each boundary. Communication happens only through controlled mechanisms."
- The three-column SVG diagram (`arch-diagram`) is labelled: "Three columns: your app, the Android gatekeeper with sandbox, intents and permissions, and protected destinations such as other apps, system resources, camera, files and location". Column 1 "YOUR APP": "app process / starts isolated / from every other app / safe by default". Column 2 "ANDROID — THE GATEKEEPER" holds the three numbered controls: "1 SANDBOX — keeps apps separated", "2 INTENTS — controls app-to-app messages", "3 PERMISSIONS — controls resource access". Column 3 "PROTECTED DESTINATIONS": "other apps / system resources / camera · files · location / where things go wrong". Two arrows cross the two boundaries.
- Diagram caption (quoted): "Every request leaves your app through a gate that Android controls. A missing or misconfigured control is what exposes an app and its data."
- "How an app reaches the hardware" (quoted): "The app asks Android to perform an action; it never controls the device directly. A camera app calls the camera API, Android checks the permission, the framework manages the request, and a hardware abstraction layer translates it for the actual device." Bolded rule: "**Every layer controls what the layer above it can do.**"
- `#ix-guards` is a JS-mounted stepper ("What each layer controls, and what it stops"; subtitle "Every layer controls access to the layer below it. To own the phone, code must cross all four boundaries"). Frame captions name two apps with uid 10121 / uid 10134 and a blocked arrow, a PERMISSION CHECK frame ("granted? scoped? while in use?" / "deny → nothing crosses"), and the hardware path "camera app → camera API → permission check → camera hardware".
- Trust table (Layer / Trust level / What a compromise buys): **Apps — lowest** — "Whatever that single app can reach: its own files, its granted permissions, the components it can start"; **Framework services — medium** — "The ability to answer permission and intent questions on behalf of the system"; **Native services / HAL — high** — "Direct control of hardware: camera, microphone, radios, sensors"; **Kernel — highest** — "The device itself — every sandbox, every app and every control at once".
- Insight box (quoted): "**The point of layering:** to control the whole phone, malicious code must escape its sandbox *and* cross several security boundaries. No single control is the only line of defence — that is what makes the model survivable when one control fails."
- Quick-check (correct): "Because a privileged app can do more and therefore causes more harm if compromised", with feedback "Privilege is transitive in effect: code that runs higher in the stack can answer or bypass the checks that protect everything below it." One distractor is explicitly wrong: system apps do **not** "run outside the sandbox and the permission model".

---

#### `#sec-threats` — "Where Can an Android Attack Happen?"

- Section lead (quoted): "Android has several layers, so a threat can target the device, the software running on it, or the access an app is allowed to use. The deck splits that space into three bands."
- Three-band classification table (Band / Where the attack acts / Deck examples / Question that separates it):
  - **Hardware** — "Physical access and connected devices" — "Juice jacking at a compromised public USB charging station" — "Can I trust what I am plugging into?"
  - **Runtime** — "Bugs while software is executing" — "Buffer overflow, use-after-free, type confusion" — "Can crafted input make the program misbehave?"
  - **Gray zone** — "Legitimate app access that creates harm" — "Contacts, photo-library and location access that goes beyond what the feature needs" — "Was the access necessary, proportionate and used responsibly?"
- Concept box "Two ways an attack can enter" (quoted): "a *hardware attack* begins when the phone is physically connected to something untrusted — unsafe connection. A *runtime attack* begins when software fails while it is running — unsafe execution. The difference is where the attack starts, not how damaging it turns out to be."
- `#ix-entry` interactive sequence, 5 steps: (1) "Classify by where the threat enters or acts: hardware, runtime or gray zone"; (2) "Hardware path — the device or connection is untrusted, so the attack starts at physical contact"; (3) "Runtime path — software fails while executing, so crafted input can corrupt memory or state"; (4) "Gray zone — a legitimate permission is granted, so ask whether the access was necessary and proportionate"; (5) "Countermeasure — add a control at the boundary the threat crossed, and re-test the boundary".
- `#ix-attack-defence` matcher, 6 attack→control pairs: juice jacking → "use a power-only adapter or charge from your own supply"; buffer overflow → "Bounds-checking, safer languages and memory-safety hardening"; use-after-free → "Memory ownership discipline and runtime mitigations that make freed memory unusable"; type confusion → "Validate the type of an object before using it"; over-broad contact or photo permission → "Data minimisation plus just-in-time, in-context permission requests"; exported activity with no authentication check → "Require authentication before the sensitive action, and export only what must be public".
- Insight box "The gray zone is a design question, not a bug." Named apps: "WhatsApp may hold contacts access, TikTok or REDNOTE may hold photo-library access, and Google Maps may hold precise location." The deck's question: does the feature need "the *entire* address book, the *entire* album, location *all the time*?" — "The user allowed it, but the security question is also whether the access was necessary and proportionate."
- `#ix-threat-history` timeline, 4 events that each widened the surface: **Physical** ("The device as an object" — "Hardware attacks need contact: a hostile charger, a hostile dock, a stolen unlocked phone"); **Network** ("The device as a client" — "The control is transport security and careful certificate validation rather than trust in the network"); **Platform** ("The device as a platform" — "The control is the sandbox itself, the permission model, and a signed update path"); **Agentic** ("The device as a target for automation" — "Deep links, exported components and automated agents let requests arrive without a human intent behind them").
- `#sol-4` worked example — juice jacking at a public charging kiosk where the phone offers "allow access to phone data" and the attendee taps *Allow*. Five steps: (1) "Nothing has corrupted memory and no app permission is involved, so this is not a runtime attack and not the gray zone… hardware band, unsafe connection"; (2) the boundary is "the USB port was treated as a power channel but it is also a data channel"; (3) "The compromise needs the user to accept a prompt, or a platform flaw that answers it without the user"; (4) countermeasures: "Carry your own power supply or a power-only adapter; treat an unfamiliar port as a data port; keep the device locked and decline data prompts; and for managed fleets, restrict what a host connection is permitted to do by policy"; (5) "you cannot know, so the design decision must be to make trust unnecessary — charge without a data connection."
- Quick-check (correct): a link-opened transfer screen with no check that the tapper is the logged-in account holder is **"Gray zone, because legitimate access is being used to produce an unintended effect"** — not runtime ("No memory corruption is involved") and not hardware ("the request arrives over a link, not over a cable").

---

#### `#sec-apk` — "An APK Is the App on Disk"

- Section lead (quoted): "Android apps are installed as APK files — the installable package that carries code, resources and settings from the developer to the device. The developer builds it; the device installs and runs it."
- Two-column contrast: **User-installed apps** — "WhatsApp, Spotify, and the app your team builds. Installed from a store or a file, running under an ordinary app user ID, limited to what it is granted." **System apps** — "Settings, Phone, and vendor applications. Shipped with the platform, often holding privileges an ordinary app cannot obtain — which is why a flaw there matters more."
- Flow diagram: `SafeCampus.apk` ("your app") → "App bundle" ("code + resources + settings") → "Android device" ("installs and runs it"). SafeCampus is the running example throughout the week.
- Definition box "Four parts to inspect first" (quoted): "An APK behaves like a ZIP archive. For security analysis, start with `AndroidManifest.xml` (components, permissions and security configuration), `classes.dex` (compiled application code), `res/` and `assets/` (screens, images and packaged files), and `META-INF/` (signing and certificate information)."
- `#ix-apk-map` hotspot figure "SafeCampus.apk — the analysis surface" (aria-label: "An APK drawn as an open ZIP container with entries for the manifest, compiled bytecode, resources and signing information"). The container is drawn as rows: `AndroidManifest.xml` — "components, permissions, config"; `classes.dex` — "compiled application code"; `res/layout/` — "app screens and UI"; `res/raw/` — "packaged data used by the app"; `res/xml/` — "network security and preferences"; `META-INF/` — "APK signing and certificates". Footer band: "security analysis reads configuration and code together".
- The five hotspot tooltips: `AndroidManifest.xml` = "The app's identity card and security map: which components exist, which one starts first, which permissions are requested, and which components other apps are allowed to reach"; `classes.dex` = "Compiled application code. Decompile it to read source-like logic — remember that the result approximates, and never exactly reproduces, the original source"; `res/layout/` = "The XML that describes each screen. Compare it with the activity code to see what the user is shown versus what the code actually does"; `res/raw/` and `res/xml/` = "Packaged data and configuration. This is where network-security settings, hard-coded endpoints and bundled assets appear — a common place to find secrets that should have stayed on a server"; `META-INF/` = "Signing and certificate information: who built and signed this package, and whether the signature still covers what you are reading."
- Callout (quoted): "**Security analysis focuses on both configuration and code.** A manifest that exports a component is not a vulnerability on its own, and neither is code that computes a price. The finding appears where a configuration decision and a code path meet."
- Quick-check (correct): with one hour and an unfamiliar APK, start "In AndroidManifest.xml, to establish what exists and what is exposed" — "The deck's assignment rule is to open the manifest before the Java code."

---

#### `#sec-decompile` — "Decompiling classes.dex"

- Section lead (quoted): "Developers write readable Java or Kotlin; an APK carries compiled bytecode for Android to run. To understand that bytecode, you decompile it back into readable, source-like code."
- Flow diagram: "Source code" (readable Java / Kotlin) → "Compiler" (converts the code) → "classes.dex" (compiled bytecode) → "Decompiler" (makes it readable again).
- The one command shown: `jadx -d decompiled/ SafeCampus.apk`. Named tool: **JADX**. "JADX reads the APK's bytecode and writes a folder of readable source-like files."
- Three-row fidelity table (Artefact / Who produced it / What it preserves / What it loses):
  - **Original source** — the developer — "Names, comments, structure, intent" — loses nothing.
  - **`classes.dex`** — the compiler — "Executable behaviour" — "Comments, formatting, and any name the compiler chose to strip or shorten".
  - **Decompiled output** — the decompiler — "Readable control flow and most names" — "Exact fidelity: optimised or obfuscated code can be reconstructed differently, or not at all".
- Insight box, the deck's own three steps (quoted): "if code is delivered to a user's device, assume that someone can inspect it. Mobile apps can be reverse engineered; compiled code is not secret; and you should never store sensitive secrets in the client app. Protect secrets on trusted servers — not inside the APK."
- `#ix-decompile` is an empty `<div>` in the HTML; note that it is also **not** referenced anywhere in `chapter3-study.js`, so it renders as an empty container.
- Quick-check (correct): a key split across three string constants is still recoverable — "If code is delivered to the device, assume it can be inspected. Any secret that ships in the APK is recoverable, so the fix is architectural: keep the secret on a trusted server." Distractor feedback: an APK signature "proves who built the package and that it was not modified. It does not hide anything inside it from the person who installed it."

---

#### `#sec-components` — "The Four App Components"

- Section lead (quoted): "Every Android app is assembled from four kinds of component, each with a different job. The lecture concentrates on activities, because a screen is where user intent and attacker intent meet."
- Four-component table (Component / Job / Deck example / What is at risk if it is reachable):
  - **Activities** — "Screens the user interacts with" — "Login, home, settings" — "A screen that performs a sensitive action on open, without checking who opened it".
  - **Services** — "Work in the background" — "Music playback" — "Unbounded background work: battery, data, and actions taken without a visible screen".
  - **Broadcast receivers** — "Respond to system events" — "Low-battery alert" — "A forged or replayed event triggering a response the developer assumed was system-originated".
  - **Content providers** — "Share data between apps" — "Contacts or calendar" — "Bulk data exposure: one misconfigured provider can leak a whole dataset, not one record".
- Concept box "Focus: activities" (quoted): "An activity combines a screen layout with the code that controls it. `activity_login.xml` says what the screen looks like; `Login.java` says what the screen does; `AndroidManifest.xml` tells Android which activities the app can start. In SafeCampus those are `MainActivity`, `Login` and `Profile`."
- SafeCampus activity table: `MainActivity` — "Launcher entry point" — "Establishes what Android starts first and how the rest of the app is reached"; `Login` — "Collects username and password" — "Where credentials are handled: check for storage, logging and transport mistakes"; `Profile` — "Shows account details" — "A sensitive screen: decide whether it requires an authenticated session before it will render".
- Quick-check (correct): "An activity is a screen layout plus the code that controls it, declared in the manifest" — security "depends on who can start it and what the code checks". Distractor feedback: sharing data between apps is the job of a **content provider**, not an activity.

---

#### `#sec-intents` — "Intents: One Tap Can Leave Your App"

- Section lead (quoted): "An intent is the message Android delivers to another screen or app. It is the request, not the destination — and that distinction is where the security questions start."
- Definition box "Mental model" (quoted): "**app → intent → destination.** Tapping 'share photo' in your app builds an intent with an action (`SHARE`) and data (`photo.jpg`). Android, not your app, finds a destination: the camera, photos, email, WhatsApp or Instagram."
- **Explicit intent** — "One exact destination. Your code names the activity directly — for example, the login button starting `LoginActivity`. There is no ambiguity about who receives the message."
- **Implicit intent** — "Your code describes the action, not the app. Android offers the choices — a chooser for Gmail, Photos or a share target. The receiver is decided by the system at runtime."
- Insight box, the deck's own question and its precise answer (quoted): "neither intent type is dangerous by itself. Security depends on *who can start the activity* and on whether the activity checks authentication. An activity with no lock is the real danger, whichever kind of intent reaches it."
- Two flow diagrams. **Unsafe path**: "other app → intent → sensitive activity" → "No auth check — screen renders and acts" → "Access granted — to whoever asked". **Protected path**: "any caller → intent" → "Login / session check — is this user authorised?" → "Activity — acts on behalf of that user".
- `#sol-1` worked example — SafeCampus has a `Profile` activity and a `ResetPassword` activity "that takes the new password from the intent". Steps: (1) read the manifest for `exported` and intent filters, "An explicit intent from inside the app is not the only route in"; (2) "`Profile` should confirm there is a valid session and that the session owns the record being requested. Rendering a screen is not the same as authorising the data behind it"; (3) "A password supplied by an intent is attacker-controlled input, so it must never be accepted as proof of identity"; (4) verdict — "`Profile` is safe only if it authenticates and authorises before rendering. `ResetPassword` is unsafe by construction: because possession of an intent is not proof of anything"; (5) countermeasure — "Export only what must be public; authenticate before acting; validate anything that crossed a boundary. The intent type never had to change."
- This section has **no** `quick-check`.

---

#### `#sec-manifest` — "The Manifest: Identity Card and Security Map"

- Section lead (quoted): "`AndroidManifest.xml` tells Android what exists, what starts first, and what outsiders can reach. The deck's instruction is blunt: **open the manifest before reading the Java code.**"
- Four-question table (Question / Where the answer lives / What you are looking for):
  1. "What exists?" → `<activity>`, `<service>`, `<receiver>`, `<provider>` → "The full inventory of components the app can be made to run".
  2. "What starts first?" → "The launcher activity" → "The entry point a user reaches, and the route everything else hangs from".
  3. "What is requested?" → `<uses-permission>` → "Camera, location, storage, network and the rest of the capability list".
  4. "What is exposed?" → `exported` and intent filters → "Which components another app can start — the part of the app that is genuinely public".
- Algorithm card "Decode an intent filter with three questions": **1. What action?** `<action android:name="…" />` — "MAIN, VIEW, SEND, DIAL and so on. The action says what the sender wants done." **2. How is it used?** `<category android:name="…" />` — "LAUNCHER, DEFAULT, BROWSABLE. The category says how the component should be treated." **3. What data?** `<data … />` — "a URL scheme, a file type, a phone number. The data says which inputs will match."
- Fact pills: "MAIN = starting action"; "LAUNCHER = appears in the app launcher"; `exported="true" = public app entry point`.
- Callout "The rule that follows" (quoted): "look for MAIN + LAUNCHER first, then check whether the exported access is expected and safe. A public entry point is normal for a launcher activity and abnormal for a screen that moves money."
- `#ix-triage` pipeline, 6 nodes in order: "Open the manifest" (inventory components, find the launcher activity, list requested permissions) → "Map exposure" (decide whether exported access is expected; "Anything public that should not be is the first finding") → "Decode intent filters" (read action, category and data; "ask which inputs an outside caller controls") → "Read the code behind exposed components" ("what does it trust, what does it check, what does it act on?") → "Check data at rest and in transit" ("secrets in the package, unvalidated endpoints, and anything sensitive written to storage or logs") → "Write the finding with its countermeasure" ("Each finding pairs one boundary with one control: export less, authenticate first, validate input, move the secret to a server").
- `#sol-2` worked example — a manifest exports a `TransferActivity` with a filter carrying `MAIN`, `LAUNCHER` and a custom `myapp://transfer` data scheme; the code reads an `amount` and a `toAccount` from the intent. Key lines: "a custom `myapp://` scheme means any app — or any web page that can trigger the scheme — can reach it"; "the values must be validated against an expected form, and the caller must be an authenticated session permitted to move that money"; "A deep link that opens a transfer screen must not send money merely because the screen opened"; countermeasures in order of strength — "Do not export a component that need not be public. If it must be public, require an authenticated and authorised session before the screen renders. Validate every parameter. And require explicit user confirmation for the sensitive action itself."
- Quick-check (correct): exported + `MAIN` + `LAUNCHER` is "the app's public starting point: expected for a launcher activity, but still worth checking what it does on open". Distractor feedback: "Exported plus a launcher filter is the normal pattern for an app entry point, not evidence of a defect", and the manifest does not tell you the activity requests no dangerous permissions.

---

#### `#sec-deeplinks` — "Deep Links Are Untrusted Input"

- Section lead (quoted): "A deep link is a URL that opens a specific screen inside an app; Android matches it using intent filters. The useful framing for security is not 'convenience feature' but 'an input channel that anyone can write to'."
- Flow diagram: "1 tap coupon link — `myapp://discount?code=…`" → "Android matches the intent filter — scheme + host + path" → "2 the matching screen opens — shopping app → discount screen".
- Definition box "The rule the deck states plainly" (quoted): "**Treat every deep link as untrusted input.** Parameters can be changed by anyone. A link may open a sensitive screen, but it must never bypass the security checks that screen depends on."
- Three-check table (Check / Question to answer / What failing it looks like):
  1. **Validate** — "Is the URL and the input in it what the app expects?" — "A parameter whose value the developer never imagined reaches business logic directly".
  2. **Authenticate** — "Is the user logged in, and are they authorised for this action?" — "A sensitive screen renders for whoever followed the link".
  3. **Confirm** — "For a sensitive action, has the user agreed to this specific action?" — "The screen opening *is* the action — a transfer happens because a link was tapped".
- Insight box (quoted): "validate input + check session + confirm sensitive actions. Skipping any one of the three converts a feature that saves a tap into a way to act as the user."
- Quick-check (correct): a password-reset screen whose new password arrives as a URL parameter violates "Session and confirmation — the link is being treated as authorisation for a sensitive account action"; feedback adds "Parameters are not identity." Distractor feedback: "Even a perfectly registered deep link is still attacker-writable input."

---

#### `#sec-uiautomation` — "The UI Tree and Mobile Agents"

- Section lead (quoted): "A mobile agent is AI that observes and interacts with a mobile app automatically. It repeats one simple loop, and the loop is what makes it useful — and what makes it part of the attack surface."
- Definition box "UI tree" (quoted): "A machine-readable map of the screen's elements and their properties. Each element becomes structured data: `TEXT` (Gmail), `TYPE` (button or image), `CLICKABLE` (true or false), `BOUNDS` (screen location). The agent then knows what is visible, what is clickable, and where to act."
- `#ix-agent` is a JS-mounted stepper (UI TREE panel with rows "TEXT Gmail / TYPE Button / CLICKABLE true / BOUNDS screen location" beside an AGENT LOOP panel "OBSERVE / DECIDE / ACT / REPEAT"; caption line "structure becomes actionable data").
- Four-stage loop table (Loop stage / What the agent does / What it needs from the app / Security question):
  - **Observe** — "Reads the screen and its UI elements" — "An accessible UI tree with labelled elements" — "Does the exposed metadata reveal anything the screen did not intend to show?"
  - **Decide** — "Chooses the next action" — "Element roles and state that make the choice unambiguous" — "Can a label be crafted so the agent chooses the wrong action?"
  - **Act** — "Taps, types, swipes or opens" — "A target that is genuinely the element it appears to be" — "Is the action authorised for this user, at this moment?"
  - **Repeat** — "Observes the result and continues" — "A stable, honest screen state after each action" — "Can the loop be driven somewhere the user never agreed to go?"
- Insight box (quoted): "automation can inspect and operate the UI at scale, and UI structure may expose sensitive labels or state. Treat UI metadata and automated actions as part of the app's attack surface — a screen that is safe for a human to look at is not automatically safe for a machine to enumerate."
- Two-column "why grid". **What agents make easier to defend**: "Consistent labelling and accessibility metadata, because automation needs to find elements reliably"; "Explicit confirmation steps, because a machine can repeat an action far faster than a person"; "Server-side authorisation, because the agent can reach every screen the UI tree exposes". **What agents make easier to attack**: "Volume: an automated actor tries every reachable screen, not the two a user would find"; "Metadata leakage: labels and state can carry information the visible screen hides"; "Intent confusion: an action taken without a human behind it is hard to distinguish from one the user meant".
- `#sol-3` worked example — a university app exposes labelled buttons for *Enrol*, *Drop unit* and *Pay fees*; a student builds an agent that completes enrolment automatically. Steps: (1) "Everything the UI tree exposes. The tree is the attack surface"; (2) "Separate reversible from irreversible actions… classify before defending"; (3) "**Move authorisation off the screen.** A UI check is a usability aid, not a security control. The server must re-check the session, the student's eligibility and the deadline for every request"; (4) "Require explicit confirmation for the sensitive step only. Confirming everything trains people to confirm blindly"; (5) "Review the metadata you publish. Every label, content description and state in the UI tree is data."
- Quick-check (correct): "Because the tree is machine-readable: anything in it can be read and acted on at scale, and it may reveal labels or state the screen hides". Distractor feedback: "Metadata does not change the app's permissions."

---

#### `#sec-recap` — "Week 3 Recap"

- Six toolkit cards, each a one-line summary: **"Android is the gatekeeper"** — "Apps start isolated. Android decides what crosses each boundary through three controls: the sandbox, intents and permissions. Safe by default — until a control is missing or misconfigured."; **"Classify by entry, not by damage"** — "Hardware (unsafe connection), runtime (unsafe execution), gray zone (legitimate access that creates harm)."; **"An APK is readable"** — "Manifest, dex, resources, signing information. Decompile the dex to inspect logic — and assume that anyone can"; **"Intent type is not the risk"** — "Explicit or implicit, the question is who can start the component and whether it checks authentication. The manifest tells you who; the code tells you whether."; **"Deep links are untrusted input"** — "Validate input, check the session, confirm sensitive actions."; **"Agents widen the surface"** — "The UI tree turns a screen into structured data."
- `#ix-recap-deck` flashcards, 6 cards:
  1. "Why can a shipping Android phone never be fully open source?" → "AOSP is the open core, but a device adds proprietary drivers, vendor applications, and separately licensed services. Anything added above the core is code that must be reasoned about on its own."
  2. "What are the three bands of the mobile threat classification?" → "Hardware — physical access and connected devices. Runtime — bugs while software is executing. Gray zone — legitimate app access that creates harm."
  3. "Name the four parts of an APK an analyst inspects first." → "AndroidManifest.xml for components, permissions and configuration; classes.dex for compiled code; res/ and assets/ for screens and packaged files; META-INF/ for signing and certificates."
  4. "What does decompiling classes.dex give you, and what does it not give you?" → "Readable, source-like code for inspecting the app's logic. It does not recreate the exact original source — optimised or obfuscated code can be reconstructed differently or not at all."
  5. "Which intent type is more dangerous?" → "Neither. Security depends on who can start the target component and whether that component checks authentication."
  6. "State the deep-link security rule in three checks." → "Validate the input, check that the user is logged in and authorised, and confirm explicitly before any sensitive action."
- Quick-check (correct): "A privileged component sits higher in the stack, so compromising it has greater consequences". Wrong pairs named explicitly: "The app sandbox prevents reverse engineering, which is why dex code is secret"; "A deep link is safe when its scheme is registered with the platform".
- Closing glance cards: "Can you draw the three columns of the gatekeeper model, name the four APK parts, and state the three deep-link checks without looking?"; "Take any Android app you use and predict its manifest: what exists, what starts first, what is requested, what is exposed. The prediction is the exam skill."

---

### chapter3-math.html

---

#### `#sec-m-hero` — Foundations hero

- Hero tag "INFO5995 — Week 3 supplement"; `<h1>` "Foundations: the mobile security model, written precisely".
- Hero description (quoted): "Week 3 is a systems week, so this page does the equivalent of a formula sheet: it fixes the threat-model vocabulary, writes the sandbox and permission model as relationships you can reason about, turns 'where does this data live?' into a table of named storage classes with their exposure, and ends with the artefact-to-finding workflow that turns an APK into defensible findings."
- Three chips: "Every definition traced to the Week 3 deck"; "Notation is a revision aid, not lecture notation"; "OWASP MASVS / Mobile Top 10 used as named reference anchors".
- Table of contents groups the page as **Model** (Threat model & attack surface; Sandbox & permission model), **Decisions** (Storage, secrets & proportionality; Artefact → finding workflow), **Practice** (Risk, hardening & self-test).

---

#### `#sec-m-model` — "Threat model & attack surface"

- Section lead (quoted): "The deck's framing question is the one to carry into every mobile assessment: *what crosses the boundary — and who should be allowed through?* A threat model is how you answer it on purpose rather than by accident."
- Threat-model definition box, "four questions, in this order" (quoted): "**1.** What are we building? **2.** What can go wrong? **3.** What are we going to do about it? **4.** Did we do a good enough job? Answer them for a mobile app and the second question immediately becomes platform-specific, because the app is not the only thing running on the device."
- Attack-surface definition box ("week 3 definition", quoted): "The set of places where data or control can cross a trust boundary. On the study page that produced exactly three lists: **other apps**, **system resources** (camera, files, location), and **the messages an app will accept** (activities, services, receivers, providers, deep links)."
- Theorem 1 "The attack surface is a sum, not a feeling": `Surface(C) = Σ_{c ∈ C} 1[exported(c) ∧ ¬auth(c) ∧ sensitive(c)]`. Commentary (quoted): "the component must be reachable from outside, must not require authorisation, *and* must do something that matters. Drop any one of the three and the term is zero — which is exactly why 'is this a finding?' is a question about a conjunction, not about a keyword."
- Theorem 2 "Risk composes the same way it does everywhere else": `R = T × V × I`. "On mobile, `T` is who can reach the entry point (any installed app, any web page that can trigger a link, anyone with physical access), `V` is whether the control that should have stopped them is present, and `I` is what the app can do or disclose once reached. A high-impact action behind an authenticated server check has `V ≈ 0` for a remote attacker; the same action on an exported screen with no session check has `V ≈ 1`."
- Theorem 3 "Privilege is transitive, so impact grows with the layer": `Pr(full compromise) = Π_{i=1}^{n} p_i`, "where `p_i` is the probability of crossing boundary `i`", plus "impact scales with the layer reached". Commentary: "Apps are the cheapest layer to reach and the least valuable to own; the kernel is the most expensive and the most valuable. That is why defence in depth is not redundancy — each boundary multiplies the attacker's cost by a factor below one."
- Model table (Band / Boundary crossed / Attacker requirement / Representative control): **Hardware** — "Physical port or accessory" — "Contact with the device, or the user's consent to a data prompt" — "Power-only charging, device lock, restricted host connections by policy"; **Runtime** — "Process memory and state" — "Crafted input that reaches a bug" — "Memory-safe code, bounds checks, input validation at the parse boundary"; **Gray zone** — "An already-granted permission" — "Nothing new — the grant exists" — "Data minimisation, scoped grants, in-context prompts, server-side limits".
- `#ix-m-defence` matcher, 6 boundary→control pairs: "App-to-app boundary" → "Sandbox with a separate user ID and no direct file access between apps"; "App-to-system-resource boundary" → "A permission checked at request time, scoped to the resource and the moment"; "App-to-app message boundary" → "A declared intent filter plus an explicit decision about what is exported"; "App-to-external-input boundary" → "Validation of every deep-link parameter, because anyone can compose the URL"; "App data-at-rest boundary" → "System-protected storage plus keys held in the platform keystore"; "Automation boundary" → "Server-side authorisation that does not trust the UI state an agent can read".
- Quick-check (correct): for a non-exported activity that performs a sensitive action only after an authenticated session check, "Both the reachability term and the authorisation term" are zero — "&'Sensitive' is about what the action does, and this activity still does something that matters.'"

---

#### `#sec-m-sandbox` — "The sandbox & permission model"

- Section lead (quoted): "Two mechanisms do most of the work on Android: apps are separated from each other, and access to protected resources is granted explicitly. Write both down and the week's analysis questions become mechanical."
- Sandbox definition box (quoted): "Apps are isolated by default: each app normally has its own user ID and its own sandbox. Android — not the app — decides what may cross each boundary, so communication between apps happens only through controlled mechanisms."
- Theorem "Sandbox as a policy on the attacker's reach": model a sandboxed app as a tuple `⟨u, D_u, G_u⟩` — "its own user ID `u`, the data directory `D_u` it owns, and the set of permissions `G_u` it has been granted". File access: `allow(a, f) = [owner(f) = u_a] ∨ [perm(f) ∈ G_a]`. Commentary: "The first clause is possession: an app can always read files it owns. The second is a decision made at the boundary. Everything the study page calls a 'gate' is an instance of this second clause — camera, location, files, microphone, and the system services that broker them."
- Theorem "Privilege tiers and blast radius": `ℓ_apps ≺ ℓ_framework ≺ ℓ_native/HAL ≺ ℓ_kernel ⟹ B(ℓ₁) ⊆ B(ℓ₂) whenever ℓ₁ ≺ ℓ₂`. Commentary: "when you rank findings, you are really ranking `ℓ`. A missing check in an app is bounded by that app's grants; the same class of mistake inside a framework service is not."
- `#ix-m-tiers` chart, title "Blast radius by layer", `max: 5`, subtitle: "Illustrative 0–5 reach scores derived from the deck's trust table, **not measured data**." Rows: Apps = 1 ("one app, one grant"); Framework services = 3 ("answers permission and intent checks"); Native services / HAL = 4 ("drives camera, radios and sensors"); Kernel = 5 ("owns every sandbox at once").
- `#ix-m-riskmap` hotspot figure (aria-label: "A chain from an outside caller, through the control gate, to what the app can disclose, with the three risk factors marked"). The SVG shows a "Caller" box ("another app, a link, physical contact") → a "Control" box ("session check, validation, permission", with the red line "missing → V = 1") → an "Impact" box ("data disclosed, action performed"), with a caption band "R = T × V × I". Three markers sit at coordinates (15.5, 49.1), (50.0, 20.0) and (84.5, 49.1): "Threat — who can reach the entry point" ("Threat alone decides nothing; it only sets how many attempts the attacker gets"); "Vulnerability — is the control present" ("The middle term is the one you can actually change"); "Impact — what the app can do or disclose" ("Impact sets the ceiling on the damage").
- Permission definition box, "what must be written in an answer" (quoted): "A permission protects a capability rather than a file: camera, location, files, microphone and the rest. It is **requested** in the manifest, **granted** by the user or the platform, and **checked** when the resource is actually used. A permission that was granted once is not consent for unlimited collection — the gray-zone question ('necessary and proportionate?') survives every grant."
- Six-row control table (Control / What it decides / Where it lives / Failure mode):
  - **Sandbox / user ID** — "Which files and processes an app can touch at all" — "Kernel, enforced per app" — "One app reads another's private data".
  - **Permission grant** — "Whether a protected resource may be used" — "Manifest declaration plus a user or platform decision" — "Silent access to camera, microphone or location".
  - **Component exposure** — "Whether another app may start a component" — "`exported` and intent filters in the manifest" — "A sensitive screen is reachable by any caller".
  - **Session / authorisation** — "Whether *this* caller may perform *this* action" — "Application code, ideally re-checked on the server" — "The screen opening is treated as permission to act".
  - **Input validation** — "Whether the values that arrived are of the expected form" — "The boundary the data crossed" — "Attacker-controlled parameters reach business logic".
  - **UI metadata** — "What an automated reader can learn and operate" — "The runtime UI tree" — "Labels and state are enumerated at scale".
- Quick-check (correct): a photo-editing app that requests photo-library access to crop one image — "The grant is legitimate, but scope still matters: the feature needs one image, so the album-wide grant is not proportionate". Distractor feedback: "This is precisely the gray zone"; and mislabelling it as a runtime attack "confuses two different bands of the threat model".

---

#### `#sec-m-storage` — "Storage, secrets & proportionality"

- Section lead (quoted): "The deck states the conclusion before the technique: *never store sensitive secrets in the client app — protect secrets on trusted servers.*"
- Definition box "The three storage classes" (quoted): "**App-private internal storage** — owned by the app's user ID, protected by the sandbox. **External or shared storage** — shared with other apps and with the user; treat it as public. **Credential or key storage** — platform key material that the app can use without ever reading the secret itself. Putting a value in the wrong class is a design defect, not a coding mistake."
- Four-row storage table (Storage class / Who can read it / Acceptable content / Never put here):
  - **App-private internal storage** — "The app's own user ID; the platform" — "Cached sessions, preferences, non-sensitive state" — "Long-lived passwords or shared secrets, if a server-side alternative exists".
  - **External / shared storage** — "Other apps and the user; increasingly also backup and sync paths" — "User-visible media the app is meant to hand over" — "Tokens, keys, personal data the app is not prepared to publish".
  - **Platform credential / key storage** — "The app may use the key; it does not get to read raw key material" — "Keys for signing, encryption and authentication" — "Anything the client fundamentally should not be able to do alone".
  - **Packaged in the APK** — "Anyone — decompilation is expected" — "Public configuration, endpoint names, feature flags" — "API keys, signing keys, credentials, anything a server should hold".
- Theorem "Why client-side secrets fail — the search space argument": `E[t] = 2^(H−1) / r`, "Suppose a secret has `H` bits of entropy and an attacker who can inspect the client gets one guess per attempt at rate `r`. The expected time to recover it is…". Commentary (quoted): "For a 4-digit PIN, `2^H = 10^4`; at `r = 100` guesses per second the expected recovery time is about `50` seconds. Raise the secret to an 8-character mixed-alphabet password and `2^H` reaches roughly `2^52`, which at the same rate is geological. The asymmetry is the whole argument: a secret that ships to the client is not protected by its length, it is protected only by the attacker's patience — and the attacker sets that." **Note:** the prose's `2^52` does not agree with the table on the same page, which gives `≈ 2^48` for that row (see §2.6).
- Four-row secret-shape table (Secret shape / Search space `2^H` / Expected time at 100 guesses/s / Verdict):
  - 4-digit PIN — `10^4` — "~50 seconds" — "Unusable as a secret that ships with the app".
  - 6-digit PIN — `10^6` — "~83 minutes" — "Still trivially recoverable offline".
  - 8 lowercase characters — `26^8 ≈ 2^37.6` — "~44 years" — "Weak against an attacker with faster hardware".
  - 8 chars, mixed case + digit — `≈ 2^48` — "~44,600 years" — "Adequate as a user password, still not a substitute for keeping keys server-side".
- Insight box "How to write this in an exam" (quoted verbatim): "'Client-side secrets are recoverable because the code is delivered to the device and can be decompiled, so the correct control is architectural rather than cryptographic. Store the secret on a trusted server, keep long-lived keys in platform key storage so the app never holds raw key material, and store nothing sensitive in the APK or in shared storage.'"
- Quick-check (correct): the key "On a trusted server that the app calls through a mediated endpoint" — "The client can still be authenticated — with a credential scoped to that user, not to the paid API." Distractors: "In the APK, obfuscated…" ("Obfuscation changes how long the search takes, not whether it succeeds"); "In a file in the app's external storage directory" ("weaker than keeping the value internal — and it still ships the secret to the device").
- `#sol-m1` worked answer "choosing storage for four values" — a campus app holding (a) a session token, (b) an API key for a paid timetable service, (c) a user's saved PDFs, (d) a signing key used to prove the app's requests came from the app. Steps: (a) "Keep it in app-private storage or in memory, scoped as narrowly as possible and expiring quickly. It is a bearer credential, so its lifetime is the control"; (b) "Not in the app at all. Put it on a server you control… no amount of obfuscation changes that"; (c) "These are the user's own documents, so they may live in app storage or a user-visible location — but decide deliberately… If they can contain personal data, keep them app-private and export on request"; (d) "Generate it in platform credential storage so the app can use it without reading it… If the client could export the key, then anyone who decompiles the app can impersonate it — which means the key was never proving anything." Closing sentence: "Each value was placed by asking who must be able to read it: only the app (private storage), nobody on the device (a server), the user themselves (shared storage), or nobody at all, not even the app (platform key storage). The APK itself holds no secrets, because decompilation is expected."

---

#### `#sec-m-workflow` — "Artefact → finding workflow"

- Section lead (quoted): "The deck's analysis order is configuration first, then code. Written as a workflow, that gives a repeatable table: for each artefact, one question, one evidence source, and one class of finding."
- `#ix-m-workflow` sequence, 7 steps in order: "Inventory the APK: manifest, dex, resources, signing information" → "Map what exists and what starts first, so the rest of the analysis has an entry point" → "Decide what is exposed, using exported flags and intent filters" → "Decode the intent filters: action, category and data for each" → "Decompile classes.dex and follow the code behind each exposed component" → "Check data at rest and in transit: secrets in the package, endpoints, storage choices" → "Write each finding as one boundary plus one countermeasure".
- Six-row artefact table (Artefact / Question it answers / What a finding looks like):
  - `AndroidManifest.xml` — "What exists, what starts first, what is requested, what is exposed" — "A component reachable from outside that has no reason to be public".
  - **Intent filters** — "Which actions, categories and data will match this component" — "A browsable data scheme that leads to a sensitive action with no session check".
  - `classes.dex` — "What the code does on the paths a caller can reach" — "Intent parameters used without validation; a secret assembled in the client".
  - `res/layout/`, `res/xml/` — "What the user sees, and how the app is configured to behave" — "A network configuration that weakens transport protection; a screen whose labels expose state".
  - `res/raw/`, `assets/` — "What data ships inside the package" — "Bundled data files containing personal data or credentials".
  - `META-INF/` — "Who signed the package, and whether it is intact" — "A signature that does not cover what you are reading, or an unexpected signer".
- Theorem "Deep-link validation as an explicit predicate": `allow(u, s, a) = valid(u) ∧ authenticated(s) ∧ authorised(s, a) ∧ (¬sensitive(a) ∨ confirmed(a))`. Commentary: "All four conjuncts are required. The formula is a compact way to answer the common exam follow-up — *which single check was missing?* — because a missing check is a false conjunct, and false conjuncts are visible one at a time."
- `#sol-m2` worked answer "writing a finding so it can be acted on" — observation: "an exported activity accepts a `reset` action from a deep link, reads the new password from a URL parameter, and applies it without asking for the current password". Steps: (1) "The manifest exports the component and declares a browsable filter; the code path is in the decompiled activity. Evidence exists in two artefacts, which is what makes the finding solid rather than speculative"; (2) "External input crossed into an authentication action. That is one boundary, not three"; (3) predicate test — "`valid(u)` is unchecked because the password string is used as supplied; `authenticated(s)` is missing because anyone can compose the link; `authorised(s, a)` is missing for the same reason; `confirmed(a)` is missing because opening the screen performs the action"; (4) "`T` is broad (any app, any web page that can trigger the scheme), `V` is near one (four missing conjuncts), `I` is account takeover. High risk, and the reason is the middle term — not the sensitivity of the screen"; (5) countermeasures strongest first — "Do not accept a password from a link at all; require an authenticated session and the current credential; confirm the action explicitly; validate every parameter; and stop exporting anything that need not be public."
- Quick-check (correct): exported `ViewProfile` with no session check and no other exported component — "Threat is broad, the control is missing, and impact is whatever the profile discloses — so the risk is real and the countermeasure is a session check or dropping the export". Distractor feedback: "Impact alone does not set risk"; and "No memory safety issue is involved. The band is the gray zone… not the runtime band."

---

#### `#sec-m-risk` — "Risk, hardening & self-test"

- Section lead (quoted): "The software half of a mobile finding is the analysis; the decision half is what you do about it. Both belong in the answer."
- Five-row issue→countermeasure table (class of issue in "week 3 vocabulary" / where it appears / countermeasure to name):
  - **Missing or misconfigured control at a boundary** — "Manifest configuration, exported components, permission declarations" — "Export only what must be public; check permission and session at the point of use".
  - **Missing or misconfigured controls that expose data** — "Storage choices, logging, backup and sync paths" — "Keep personal data app-private; remove sensitive values from logs and from shared storage".
  - **Insufficient input validation** — "Deep links, intent extras, exported component parameters" — "Validate the shape and range of every value that crossed a boundary".
  - **Secrets in the client** — "`classes.dex`, `res/raw/`, `res/xml/`" — "Move the secret to a trusted server; use platform key storage for key material".
  - **Automation exposure** — "The runtime UI tree, labels and state" — "Server-side authorisation for sensitive actions; publish only the metadata the screen needs".
- Theorem "The two sentences that summarise the week" (quoted): "**1.** Security modelling asks what crosses the boundary — and who should be allowed through. **2.** If code is delivered to a user's device, assume that someone can inspect it, so never store sensitive secrets in the client app." Follow-up: "Instance one is the architecture claim; instance two is the consequence. Almost every Week 3 question is a special case of one of them."
- `#ix-m-deck` self-test flashcards, 7 cards with the exact backs:
  1. **Attack surface** — "The set of places where data or control can cross a trust boundary. On Android: other apps, system resources, and the messages the app will accept." (hint: Definition)
  2. **Sandbox** — "Apps are isolated by default, each with its own user ID and data directory. Android decides what may cross each boundary, so inter-app communication goes through controlled mechanisms only." (hint: Isolation)
  3. **Permission** — "A control on a capability rather than a file — camera, location, files, microphone. Requested in the manifest, granted by the user or platform, checked when the resource is used." (hint: Access control)
  4. **Explicit vs implicit intent** — "Explicit names one destination; implicit describes an action and lets Android choose. Neither is dangerous by itself — who can start the target, and whether it authenticates, is what decides." (hint: Messaging)
  5. **Gray zone** — "Legitimate app access that creates harm. The question is not 'did the user allow it?' but whether the access was necessary and proportionate." (hint: Threat band)
  6. **Deep link** — "A URL that opens a specific screen via an intent filter. Treat it as untrusted input: validate it, check the session, and confirm sensitive actions." (hint: Input channel)
  7. **UI tree** — "A machine-readable map of screen elements and their properties — text, type, clickable, bounds. It is what lets an agent act, and it is part of the attack surface." (hint: Automation)
- Quick-check "Which statement would lose marks on a Week 3 question about reverse engineering?" — the losing statement is "Compiled bytecode hides secrets well enough that a secret can safely ship inside the APK"; feedback: "Compilation is not a confidentiality mechanism: code delivered to a device can be reverse engineered, so secrets must not depend on it."
- Symbol grid (Symbol / Reads as / Meaning), 11 rows: `B` boundary — "A trust boundary: app-to-app, app-to-resource, app-to-external-input, data-at-rest"; `C` components — "The activities, services, receivers and providers declared by an app"; `exported(c)` reachable from outside — "The component may be started by another app or by a link"; `auth(c)` authorisation is checked — "The component verifies a session and that the session may perform the action"; `u, D_u` user ID, data directory — "The sandbox identity and the storage it owns"; `G_a` grants of app `a` — "The set of permissions the app currently holds"; `ℓ` layer — "Apps ≺ framework ≺ native/HAL ≺ kernel, ordered by trust"; `B(ℓ)` blast radius — "What a compromise at layer `ℓ` can reach — monotonic in `ℓ`"; `2^H` search space — "The number of candidates an attacker must try against a secret of `H` bits"; `R = T × V × I` risk — "Threat (who can reach it) × vulnerability (is the control missing) × impact"; `allow(u,s,a)` deep-link decision — "Valid input and authenticated, authorised session, plus confirmation when the action is sensitive".
- Closing callout: "the gatekeeper model, the APK tour and the deep-link checks live on the study guide; this page supplies the notation and the decision tables behind them. Then attempt the Quiz Hub and the Flashcards for Week 3."

---

## 2. FORMULAS AND NUMERIC DRILLS

Chapter 3 contains **no** cryptography arithmetic. Explicitly absent from both pages: modular arithmetic, XOR, RSA steps, Diffie–Hellman steps, modular exponentiation, hash sizes, birthday bounds, key-strength tables, TLS record arithmetic. What follows is every quantitative item that *is* on the pages, with the arithmetic fully shown.

Constants used for time conversion below: **1 year = 365.25 × 86,400 s = 31,557,600 s**.

### 2.1 Attack surface as an indicator sum (math `#sec-m-model`)

```
Surface(C) = Σ_{c ∈ C} 1[ exported(c) ∧ ¬auth(c) ∧ sensitive(c) ]
```

Quoted reading rule: "the component must be reachable from outside, must not require authorisation, *and* must do something that matters. Drop any one of the three and the term is zero".

Worked drill. An app declares 7 components. 4 are exported. Of those 4, 3 perform a sensitive action; exactly 1 of those 3 verifies a session/authorisation. The fourth exported component is a public launcher screen with no sensitive action.

```
exported ∧ sensitive          = 3 components
of those, ¬auth               = 3 − 1 = 2
non-exported components       = 7 − 4 = 3   → term 0 each
exported but not sensitive    = 4 − 3 = 1   → term 0 (sensitive(c) false)
Surface(C)                    = 2
```

### 2.2 Risk as a product (math `#sec-m-model`)

```
R = T × V × I
```
Quoted: "`T` is who can reach the entry point …, `V` is whether the control that should have stopped them is present, and `I` is what the app can do or disclose once reached." Boundary cases quoted: "A high-impact action behind an authenticated server check has `V ≈ 0` for a remote attacker; the same action on an exported screen with no session check has `V ≈ 1`."

Worked drill. `T = 1.0`, `I = 0.8`. Before the fix `V = 0.5`; after adding a session check `V = 0.05`.
```
R_before = 1.0 × 0.5  × 0.8 = 0.40
R_after  = 1.0 × 0.05 × 0.8 = 0.04
reduction factor = 0.40 / 0.04 = 10×
```
Because risk is a product, driving `V` to ≈ 0 drives `R` to ≈ 0 regardless of how large `T` or `I` are — this is the page's claim that "the middle term is the one you can actually change".

### 2.3 Compromise probability across stacked boundaries (math `#sec-m-model`)

```
Pr(full compromise) = Π_{i=1..n} p_i     ("impact scales with the layer reached")
```
Quoted rationale: "each boundary multiplies the attacker's cost by a factor below one", which is "why defence in depth is not redundancy".

Worked drill. Four boundaries with `p₁ = 0.5`, `p₂ = 0.4`, `p₃ = 0.25`, `p₄ = 0.2`:
```
0.5 × 0.4  = 0.20
0.20 × 0.25 = 0.05
0.05 × 0.2  = 0.01   → Pr(full compromise) = 1%
```
(For contrast, the sum of the four probabilities is 1.35, which is not a probability at all — the page's point is that the composition is multiplicative, "Risk is a product, not a sum", per the `#ix-m-riskmap` subtitle.)

### 2.4 Sandbox file-access policy (math `#sec-m-sandbox`)

```
allow(a, f) = [ owner(f) = u_a ] ∨ [ perm(f) ∈ G_a ]
```

Worked drill. App `A` runs as `u_A = 10121` and holds grants `G_A = {CAMERA}`. File `f` is owned by `u_A`. File `g` is owned by `u_B = 10134` and is labelled with the protection tag `LOCATION`.
```
allow(A, f) = [10121 = 10121] ∨ [LOCATION ∈ {CAMERA}] = true  ∨ false = true
allow(A, g) = [10134 = 10121] ∨ [LOCATION ∈ {CAMERA}] = false ∨ false = false
```
So `A` reads only `f`. The first clause is "possession"; the second is "a decision made at the boundary" — and each of camera / location / files / microphone is an instance of the second clause.

### 2.5 Privilege ordering and blast radius (math `#sec-m-sandbox`)

```
ℓ_apps ≺ ℓ_framework ≺ ℓ_native/HAL ≺ ℓ_kernel
ℓ₁ ≺ ℓ₂  ⟹  B(ℓ₁) ⊆ B(ℓ₂)          (blast radius is monotonic)
```
The page's illustrative (explicitly "not measured data") 0–5 reach scores, chart `max = 5`:

| Layer | Score | Display string |
|---|---|---|
| Apps | 1 | "one app, one grant" |
| Framework services | 3 | "answers permission and intent checks" |
| Native services / HAL | 4 | "drives camera, radios and sensors" |
| Kernel | 5 | "owns every sandbox at once" |

2.5b Trust ladder from the study page (`#sec-layers`) that the scores are derived from: Apps = lowest, Framework services = medium, Native services / HAL = high, Kernel = highest.

### 2.6 Client-side secret search space and recovery time (math `#sec-m-storage`)

**Stated formula (quoted):**
```
E[t] = 2^(H−1) / r
```
"Suppose a secret has `H` bits of entropy and an attacker who can inspect the client gets one guess per attempt at rate `r`."

**Stated table (quoted exactly):**

| Secret shape | Search space 2^H | Expected time at 100 guesses/s | Verdict |
|---|---|---|---|
| 4-digit PIN | `10^4` | ~50 seconds | Unusable as a secret that ships with the app |
| 6-digit PIN | `10^6` | ~83 minutes | Still trivially recoverable offline |
| 8 lowercase characters | `26^8 ≈ 2^37.6` | ~44 years | Weak against an attacker with faster hardware |
| 8 chars, mixed case + digit | `≈ 2^48` | ~44,600 years | Adequate as a user password, still not a substitute for keeping keys server-side |

**Independent recomputation of every number (r = 100 guesses/s; 1 year = 31,557,600 s):**

- 4-digit PIN. `10^4 = 10,000`. `2^(H−1) = 10,000 / 2 = 5,000`. `E[t] = 5,000 / 100 = 50 s`. **Matches the page's "~50 seconds" exactly.**
- 6-digit PIN. `10^6 = 1,000,000`. `2^(H−1) = 500,000`. `E[t] = 500,000 / 100 = 5,000 s`. `5,000 / 60 = 83.33 min`. **Matches the page's "~83 minutes" exactly.**
- 8 lowercase characters. `26^2 = 676`; `26^4 = 676² = 456,976`; `26^8 = 456,976² = 208,827,064,576`. `log₂(208,827,064,576) = 37.6035`, so `26^8 ≈ 2^37.6`. **The page's search-space figure is confirmed.**
  Under the stated formula: `E[t] = 208,827,064,576 / 2 / 100 = 1,044,135,322.88 s = 1,044,135,322.88 / 31,557,600 = 33.09 years`.
  The page's quoted `~44 years` equals `2^37 / 100 = 1,374,389,534.72 s = 1,374,389,534.72 / 31,557,600 = 43.55 years` — i.e. the table's time column was computed as `2^(integer bit-length) / r` rather than `2^(H−1) / r`. **The stated formula does not reproduce the "~44 years" figure; it gives ≈33 years.**
- 8 chars, mixed case + digit (62 symbols: 26 + 26 + 10). `62^2 = 3,844`; `62^4 = 3,844² = 14,776,336`; `62^8 = 14,776,336² = 218,340,105,584,896`. `log₂ = 47.6336`, so `62^8 ≈ 2^47.6`, which the page rounds to `≈ 2^48`. **Search-space figure confirmed as a round-up.**
  Under the stated formula: `E[t] = 218,340,105,584,896 / 2 / 100 = 1,091,700,527,924.48 s = 34,593.9 years`.
  The page's quoted `~44,600 years` equals `2^47 / 100 = 1,407,374,883,553.28 s = 44,597.0 years`. **Again the stated formula gives a different number (≈34,594 years); the table's figure corresponds to `2^47 / r`.**
- Prose vs table inconsistency on the same page: the commentary says an 8-character mixed-alphabet password reaches "roughly `2^52`", but the table row for that secret says `≈ 2^48`. `2^52 = 4,503,599,627,370,496`. To reach `2^52` in 8 characters you need an alphabet of about 90 symbols, since `90^8 = 4,304,672,100,000,000 ≈ 2^51.93`. `62^8 = 2^47.6`. **Use the table value (≈2^48) for 8 chars of mixed case + digit.**
- Useful reference points computed the same way, for distinguishing distractors: `52^8 = 53,459,728,531,456 ≈ 2^45.6` (mixed-case letters, no digits); `10^8 = 100,000,000 ≈ 2^26.6` (digits only); `8^26 = 2^78`.
- Comparison rules the table yields: 4-digit PIN ≈ 50 s ≪ 6-digit PIN ≈ 83 min ≪ 8 lowercase ≈ 44 y (page) ≪ 8 mixed+digit ≈ 44,600 y (page); the verdict column refuses even the largest value as "a substitute for keeping keys server-side".

### 2.7 Deep-link decision predicate (math `#sec-m-workflow`)

```
allow(u, s, a) = valid(u) ∧ authenticated(s) ∧ authorised(s, a) ∧ (¬sensitive(a) ∨ confirmed(a))
```
"All four conjuncts are required… a missing check is a false conjunct, and false conjuncts are visible one at a time."

Worked drill (the page's own `#sol-m2` scenario: an exported activity takes a `reset` action from a deep link and reads the new password from a URL parameter):

```
valid(u)            = false   (the password string is used as supplied, unvalidated)
authenticated(s)    = false   (anyone can compose the link)
authorised(s, a)    = false   (for the same reason — no session owns the action)
confirmed(a)        = false   (opening the screen performs the action)
allow(u, s, a)      = false ∧ false ∧ false ∧ (¬true ∨ false) = false
```
`T` broad, `V` near 1 (four missing conjuncts), `I` = account takeover → high risk "and the reason is the middle term — not the sensitivity of the screen".

### 2.8 Ordinal severity ordering

The math page's `#ix-m-tiers` chart is explicitly "Illustrative 0–5 reach scores … not measured data", so it supports only ordering (1 < 3 < 4 < 5) and the monotonicity of `B(ℓ)`, never a ratio.

### 2.9 Market-share figures (study `#sec-platform`)

- Android `~70%`; iOS `~30%`; everything else `<1%`. `70 + 30 = 100`, so the two named platforms account for essentially the whole market at the quoted precision; the three "<1%" entries are rounded, not additive.
- Chart internals: `max = 70`; bar values Android 70, iOS 30, HarmonyOS 0.5, KaiOS 0.2, Sailfish OS / Ubuntu Touch 0.1 — but every display label for the last three is the string `"<1%"` (the decimals exist only to size the bars).
- The page's own reading instruction, quoted: "Read the bar length as where attacker attention goes, not as a measure of how secure a platform is."

### 2.10 Named lists with exact membership (countable, easy to test)

- Three gatekeeper controls, in order: **1 Sandbox** (keeps apps separated), **2 Intents** (controls app-to-app messages), **3 Permissions** (controls resource access).
- Three threat bands: **Hardware** (unsafe connection), **Runtime** (unsafe execution), **Gray zone** (legitimate access that creates harm).
- Four APK parts to inspect first: `AndroidManifest.xml`, `classes.dex`, `res/` + `assets/`, `META-INF/`.
- Four app components: Activities, Services, Broadcast receivers, Content providers.
- Four generation labels in the widening timeline: Physical, Network, Platform, Agentic.
- Four threat-model questions, in order: 1 What are we building? 2 What can go wrong? 3 What are we going to do about it? 4 Did we do a good enough job?
- Three deep-link checks: Validate, Authenticate, Confirm.
- Four agent-loop stages: Observe, Decide, Act, Repeat.
- Three storage classes: app-private internal, external/shared, credential/key storage (plus a fourth table row, "packaged in the APK", treated as public).
- Three intent-filter questions: action, category, data.
- Four manifest questions: what exists, what starts first, what is requested, what is exposed.
- Four trust layers: apps (lowest) ≺ framework services (medium) ≺ native services/HAL (high) ≺ kernel (highest).

---

## 3. PITFALLS

1. **Concluding that the deck's Android focus means iOS is safer. It is wrong because the page assigns iOS ~30% and still warns of exposure; the page says the iOS row is "A smaller, more uniform surface — but the same class of risk for the data an app already holds", and the quick-check feedback adds that "iOS is roughly 30% and is still a high-value target."**
2. **Describing a shipping Android phone as fully open source and therefore fully auditable. It is wrong because only the core is open; the page says "AOSP is the open core. A shipping phone is not AOSP: vendors add proprietary hardware drivers and their own applications, and Google's own mobile services and app store are separate, licensed components."**
3. **Answering "which intent type is more dangerous?" with "implicit". It is wrong because the page says "neither intent type is dangerous by itself. Security depends on *who can start the activity* and on whether the activity checks authentication. An activity with no lock is the real danger, whichever kind of intent reaches it."**
4. **Treating any exported component — or exported + `MAIN`/`LAUNCHER` — as automatically a vulnerability. It is wrong because the page says "A public entry point is normal for a launcher activity and abnormal for a screen that moves money", and the quick-check feedback says "Exported plus a launcher filter is the normal pattern for an app entry point, not evidence of a defect."**
5. **Reporting a manifest export, or a suspicious code path, as a finding by itself. It is wrong because the page says "A manifest that exports a component is not a vulnerability on its own, and neither is code that computes a price. The finding appears where a configuration decision and a code path meet" — and `#sol-m2` adds that evidence in "two artefacts … is what makes the finding solid rather than speculative".**
6. **Assuming a decompiler reproduces the original source. It is wrong because the page's fidelity table says decompiled output loses "Exact fidelity: optimised or obfuscated code can be reconstructed differently, or not at all", and the hotspot tooltip says the result "approximates, and never exactly reproduces, the original source".**
7. **Believing a secret is safe in the client because it is obfuscated, split across string constants, or protected by the APK signature. It is wrong because the page says "compiled code is not secret" and the signature "does not hide anything inside it from the person who installed it"; the fix is architectural — "Protect secrets on trusted servers — not inside the APK", and no amount of obfuscation changes that.**
8. **Treating a permission the user granted as consent for unlimited collection. It is wrong because the page says "A permission that was granted once is not consent for unlimited collection — the gray-zone question ('necessary and proportionate?') survives every grant", and the photo-editing quick-check concludes the album-wide grant for a one-image crop is not proportionate.**
9. **Classifying an unauthenticated screen-open as a runtime attack because "the software is executing". It is wrong because the page's quick-check on the banking link says "No memory corruption is involved. The program does exactly what it was written to do — the missing control is an authorization check", making it the gray zone.**
10. **Treating a correctly registered deep-link scheme as a trust signal. It is wrong because the page says "Treat every deep link as untrusted input. Parameters can be changed by anyone", and the feedback adds "Even a perfectly registered deep link is still attacker-writable input."**
11. **Relying on a client-side/UI check as the authorisation control. It is wrong because `#sol-3` says "A UI check is a usability aid, not a security control. The server must re-check the session, the student's eligibility and the deadline for every request, because a client — human or agent — can be scripted."**
12. **Quoting the `E[t] = 2^(H−1)/r` formula and the table's character-row times as if they came from the same arithmetic, or quoting the prose's `2^52` for that row. It is wrong because the page's own numbers do not reproduce: `10^4 → 5,000/100 = 50 s` and `10^6 → 500,000/100 = 83.3 min` follow the formula exactly, but `26^8 ≈ 2^37.6 → ~44 years` and `62^8 ≈ 2^48 → ~44,600 years` correspond to `2^37/100 = 43.55 y` and `2^47/100 = 44,597 y`, while the formula gives ≈33.09 y and ≈34,594 y; and the table row for "8 chars, mixed case + digit" is `≈ 2^48` even though the commentary on the same page says "roughly `2^52`" (`62^8 = 2^47.6`, whereas `2^52` would need an alphabet of about 90 symbols, `90^8 ≈ 2^51.93`).**

---

## 4. TESTABLE CLAIMS (each tagged with its anchor)

1. Android holds about 70% of the 2026 smartphone OS market, iOS about 30% and everything else under 1%, and the deck justifies its Android focus on market share plus an architecture open enough to inspect — never on the other platforms being safe. — `chapter3-study.html#sec-platform`
2. AOSP is only the open core; a shipping phone adds proprietary vendor drivers, vendor apps, and separately licensed Google services and app store, so anything above the core is code that must be reasoned about separately. — `chapter3-study.html#sec-platform`
3. The three Android gatekeeper controls are the sandbox (keeps apps separated), intents (controls app-to-app messages) and permissions (controls resource access). — `chapter3-study.html#sec-layers`
4. Trust order runs apps (lowest) ≺ framework services (medium) ≺ native services/HAL (high) ≺ kernel (highest), and because blast radius is monotonic in the layer, the same class of mistake inside a framework service is worse than inside an app. — `chapter3-study.html#sec-layers`; `chapter3-math.html#sec-m-sandbox`
5. The three threat bands are hardware (unsafe connection), runtime (unsafe execution) and gray zone (legitimate app access that creates harm). — `chapter3-study.html#sec-threats`
6. The gray zone's separating question is "Was the access necessary, proportionate and used responsibly?" — a design question, not a bug. — `chapter3-study.html#sec-threats`
7. An APK is a ZIP-like container whose four first-look parts are `AndroidManifest.xml` (components, permissions, config), `classes.dex` (compiled code), `res/` + `assets/` (screens and packaged files) and `META-INF/` (signing and certificates). — `chapter3-study.html#sec-apk`
8. JADX (`jadx -d decompiled/ SafeCampus.apk`) turns `classes.dex` into readable, source-like files, but the output only approximates the original source; and because code is delivered to the device, compiled code is not secret and sensitive secrets belong on trusted servers. — `chapter3-study.html#sec-decompile`
9. The four Android app components are activities (screens), services (background work), broadcast receivers (system events) and content providers (data sharing), and a misconfigured provider can leak a whole dataset rather than one record. — `chapter3-study.html#sec-components`
10. Explicit intents name one destination and implicit intents describe an action; neither is dangerous in itself, because risk depends on who can start the target component and whether it authenticates. — `chapter3-study.html#sec-intents`
11. Read the manifest before the Java code: it answers what exists, what starts first, what is requested and what is exposed; intent filters are decoded by action (`MAIN`, `VIEW`, `SEND`, `DIAL`), category (`LAUNCHER`, `DEFAULT`, `BROWSABLE`) and data (scheme, file type, phone number), with `MAIN` = starting action, `LAUNCHER` = appears in the launcher, `exported="true"` = public app entry point. — `chapter3-study.html#sec-manifest`
12. Every deep link is untrusted input, so the three checks are validate the input, authenticate/authorise the session, and confirm the specific sensitive action — formalised as `valid(u) ∧ authenticated(s) ∧ authorised(s,a) ∧ (¬sensitive(a) ∨ confirmed(a))`, where a missing check is a false conjunct. — `chapter3-study.html#sec-deeplinks`; `chapter3-math.html#sec-m-workflow`
13. A UI tree exposes `TEXT`, `TYPE`, `CLICKABLE` and `BOUNDS` for each element, which is why UI metadata and automated actions are part of the attack surface. — `chapter3-study.html#sec-uiautomation`
14. The attack surface is the set of places where data or control can cross a trust boundary — other apps, system resources, and the messages the app will accept — and a component contributes only when it is exported AND lacks authorisation AND is sensitive, so dropping any one term makes the contribution zero. — `chapter3-math.html#sec-m-model`
15. Risk is a product `R = T × V × I`, so a missing control (`V ≈ 1`) with a broad threat is what makes an exposure a real finding, and a present session check (`V ≈ 0`) collapses it. — `chapter3-math.html#sec-m-model`
16. Full compromise requires crossing every boundary, so its probability is the product `Π pᵢ` of the per-boundary probabilities — defence in depth is not redundancy. — `chapter3-math.html#sec-m-model`
17. The sandbox is a tuple `⟨u, D_u, G_u⟩` and file access is allowed when the app owns the file OR holds the required permission — possession or a boundary decision. — `chapter3-math.html#sec-m-sandbox`
18. Client-side secrets fail by search-space arithmetic: `E[t] = 2^(H−1)/r`, giving about 50 seconds for a 4-digit PIN (10^4, r = 100 guesses/s) and about 83 minutes for a 6-digit PIN (10^6), so the fix is architectural rather than cryptographic. — `chapter3-math.html#sec-m-storage`
19. Storage classes are chosen by asking who must be able to read the value: only the app (private internal), nobody on the device (a server), the user themselves (shared storage), or nobody at all including the app (platform key storage). — `chapter3-math.html#sec-m-storage`
20. The analysis workflow is configuration first and then code, and every finding is written as one boundary plus one countermeasure. — `chapter3-math.html#sec-m-workflow`

---

## 5. ANCHOR INDEX

Complete list of every `id="…"` attribute in both files, in file order.

**chapter3-study.html (30 ids)**

```
chapter3-study.html#sidebar - sidebar navigation panel
chapter3-study.html#sidebarToggle - sidebar toggle button
chapter3-study.html#mainContent - main content container
chapter3-study.html#hero - Week 3 overview hero (title, subtitle, four thesis cards)
chapter3-study.html#sec-platform - Mobile Security in the Age of AI (2026 OS share ~70/~30/<1, AOSP vs shipping phone)
chapter3-study.html#ix-share - interactive race chart "Reported mobile OS share, 2026" (JSON config)
chapter3-study.html#ix-evolution - JS-mounted stepper "Four generations of mobile attack surface"
chapter3-study.html#sec-layers - Android Is the Gatekeeper (sandbox, intents, permissions; trust ladder)
chapter3-study.html#ix-guards - JS-mounted stepper "What each layer controls, and what it stops"
chapter3-study.html#sec-threats - Where Can an Android Attack Happen? (hardware, runtime, gray zone)
chapter3-study.html#ix-entry - interactive sequence "Rebuild the threat classification"
chapter3-study.html#ix-attack-defence - interactive matcher "Match the attack pattern to its countermeasure"
chapter3-study.html#ix-threat-history - interactive timeline "How the mobile attack surface kept widening"
chapter3-study.html#sol-4 - worked example: juice-jacking incident through the classification
chapter3-study.html#sec-apk - An APK Is the App on Disk (four parts to inspect first)
chapter3-study.html#ix-apk-map - interactive hotspot "SafeCampus.apk — the analysis surface"
chapter3-study.html#sec-decompile - Decompiling classes.dex (JADX, fidelity table)
chapter3-study.html#ix-decompile - empty interactive container (no content defined in the HTML or chapter3-study.js)
chapter3-study.html#sec-components - The Four App Components (activities, services, receivers, providers)
chapter3-study.html#sec-intents - Intents: One Tap Can Leave Your App (explicit vs implicit)
chapter3-study.html#sol-1 - worked example: deciding whether an intent design is safe
chapter3-study.html#sec-manifest - The Manifest: Identity Card and Security Map (four questions, intent filters)
chapter3-study.html#ix-triage - interactive pipeline "APK triage: the order the deck uses"
chapter3-study.html#sol-2 - worked example: triaging an exported TransferActivity
chapter3-study.html#sec-deeplinks - Deep Links Are Untrusted Input (validate, authenticate, confirm)
chapter3-study.html#sec-uiautomation - The UI Tree and Mobile Agents (observe, decide, act, repeat)
chapter3-study.html#ix-agent - JS-mounted stepper: UI tree beside the agent loop
chapter3-study.html#sol-3 - worked example: hardening an app for automated clients
chapter3-study.html#sec-recap - Week 3 Recap (six toolkit cards, rapid-fire deck)
chapter3-study.html#ix-recap-deck - interactive flashcards "Rapid fire: say the answer before you flip"
```

**chapter3-math.html (14 ids)**

```
chapter3-math.html#mainContent - math content container
chapter3-math.html#sec-m-hero - Foundations hero (page framing and three chips)
chapter3-math.html#sec-m-model - Threat model & attack surface (surface sum, R = T x V x I, boundary product)
chapter3-math.html#ix-m-defence - interactive matcher "Match the boundary to the control that guards it"
chapter3-math.html#sec-m-sandbox - The sandbox & permission model (tuple, allow policy, blast radius, control table)
chapter3-math.html#ix-m-tiers - interactive race chart "Blast radius by layer" (scores 1/3/4/5, max 5)
chapter3-math.html#ix-m-riskmap - interactive hotspot "Where risk actually comes from" (Caller -> Control -> Impact)
chapter3-math.html#sec-m-storage - Storage, secrets & proportionality (storage classes, E[t] = 2^(H-1)/r table)
chapter3-math.html#sol-m1 - worked answer: choosing storage for four values
chapter3-math.html#sec-m-workflow - Artefact -> finding workflow (artefact table, deep-link predicate)
chapter3-math.html#ix-m-workflow - interactive sequence "Order the mobile analysis workflow"
chapter3-math.html#sol-m2 - worked answer: writing a deep-link finding so it can be acted on
chapter3-math.html#sec-m-risk - Risk, hardening & self-test (issue table, two summary sentences, symbol grid)
chapter3-math.html#ix-m-deck - interactive flashcards "Self-test: the model, one term at a time"
```

---

## 6. GRAPH SEEDS

### 6.1 Concept graph — study page (16 nodes)

1. `android-platform-share` — **Android ~70% market share (2026)** — "Android ~70% — used by Samsung, Xiaomi, Oppo, Vivo, Google Pixel and others; an open-source core (the Android Open Source Project, AOSP) with many vendor variants." — `chapter3-study.html#sec-platform`
2. `gatekeeper` — **Android is the gatekeeper** — "Apps are isolated by default… Android decides what may cross each boundary. Communication happens only through controlled mechanisms." — `chapter3-study.html#sec-layers`
3. `sandbox` — **Sandbox** — The gatekeeper control that "keeps apps separated", giving each app its own user ID and data directory. — `chapter3-study.html#sec-layers`
4. `permission` — **Permission** — The gatekeeper control that "controls resource access": a capability (camera, location, files, microphone) requested in the manifest, granted by user or platform, and checked when the resource is used. — `chapter3-study.html#sec-layers`
5. `trust-layer` — **Trust layer** — Apps (lowest) ≺ framework services (medium) ≺ native services/HAL (high) ≺ kernel (highest); "to control the whole phone, malicious code must escape its sandbox and cross several security boundaries." — `chapter3-study.html#sec-layers`
6. `hardware-band` — **Hardware band** — Threats that act through "physical access and connected devices", such as juice jacking at a compromised public USB charging station; the separating question is "Can I trust what I am plugging into?" — `chapter3-study.html#sec-threats`
7. `runtime-band` — **Runtime band** — Threats that act through "bugs while software is executing" — buffer overflow, use-after-free, type confusion; the separating question is "Can crafted input make the program misbehave?" — `chapter3-study.html#sec-threats`
8. `gray-zone` — **Gray zone** — "Legitimate app access that creates harm" — contacts, photo-library and location access beyond what the feature needs; the question is whether access was "necessary, proportionate and used responsibly". — `chapter3-study.html#sec-threats`
9. `apk` — **APK** — "The installable package that carries code, resources and settings from the developer to the device"; it behaves like a ZIP archive. — `chapter3-study.html#sec-apk`
10. `manifest` — **AndroidManifest.xml** — "The app's identity card and security map: which components exist, which one starts first, which permissions are requested, and which components other apps are allowed to reach." — `chapter3-study.html#sec-manifest`
11. `dex-decompile` — **Decompilation of classes.dex** — Turning "compiled bytecode" back into "readable, source-like code" with JADX, remembering that the output approximates and never exactly reproduces the original source. — `chapter3-study.html#sec-decompile`
12. `activity` — **Activity** — "A screen layout plus the code that controls it, declared in the manifest"; the deck concentrates on activities because "a screen is where user intent and attacker intent meet". — `chapter3-study.html#sec-components`
13. `intent` — **Intent** — "The message Android delivers to another screen or app. It is the request, not the destination" — explicit names one destination, implicit describes an action and lets Android choose. — `chapter3-study.html#sec-intents`
14. `deep-link` — **Deep link** — "A URL that opens a specific screen inside an app; Android matches it using intent filters" — an input channel anyone can write to, so it must be validated, session-checked and confirmed. — `chapter3-study.html#sec-deeplinks`
15. `ui-tree` — **UI tree** — "A machine-readable map of the screen's elements and their properties" — `TEXT`, `TYPE`, `CLICKABLE`, `BOUNDS` — which an agent reads to act and which is therefore part of the attack surface. — `chapter3-study.html#sec-uiautomation`
16. `mobile-agent` — **Mobile agent** — "AI that observes and interacts with a mobile app automatically", repeating Observe → Decide → Act → Repeat; automation "can inspect and operate the UI at scale". — `chapter3-study.html#sec-uiautomation`

*(Exactly 16 nodes. Two further page-supported concepts that were deliberately folded into the nodes above rather than listed separately: the intent filter — action/category/data, inside `manifest` — and the four-component set (activities, services, broadcast receivers, content providers), inside `activity`.)*

### 6.2 Foundations graph — math page (10 nodes)

1. `threat-model-4q` — **Threat model (four questions, in this order)** — "1. What are we building? 2. What can go wrong? 3. What are we going to do about it? 4. Did we do a good enough job?" — `chapter3-math.html#sec-m-model`
2. `attack-surface-sum` — **Attack surface as an indicator sum** — `Surface(C) = Σ_{c∈C} 1[exported(c) ∧ ¬auth(c) ∧ sensitive(c)]`; "Drop any one of the three and the term is zero." — `chapter3-math.html#sec-m-model`
3. `risk-product` — **Risk** — `R = T × V × I`, where `T` is who can reach the entry point, `V` is whether the control is present, and `I` is what the app can do or disclose. — `chapter3-math.html#sec-m-model`
4. `boundary-product` — **Compromise across boundaries** — `Pr(full compromise) = Π_{i=1..n} p_i`, with impact scaling by layer; "each boundary multiplies the attacker's cost by a factor below one". — `chapter3-math.html#sec-m-model`
5. `sandbox-tuple` — **Sandbox tuple** — A sandboxed app modelled as `⟨u, D_u, G_u⟩`: its user ID, the data directory it owns, and the permissions it has been granted. — `chapter3-math.html#sec-m-sandbox`
6. `allow-policy` — **File-access policy** — `allow(a, f) = [owner(f) = u_a] ∨ [perm(f) ∈ G_a]` — "possession" or "a decision made at the boundary". — `chapter3-math.html#sec-m-sandbox`
7. `blast-radius` — **Blast radius** — `B(ℓ)` is monotonic in trust layer (`apps ≺ framework ≺ native/HAL ≺ kernel`), so ranking findings means ranking `ℓ`. — `chapter3-math.html#sec-m-sandbox`
8. `storage-classes` — **Storage classes and proportionality** — App-private internal (only the app), external/shared (other apps and the user — treat as public), platform credential/key storage (use without reading), and "packaged in the APK" (anyone — decompilation is expected). — `chapter3-math.html#sec-m-storage`
9. `secret-search-space` — **Search space of a client-side secret** — `E[t] = 2^(H−1)/r`; a 4-digit PIN (`10^4`) falls in about 50 s at 100 guesses/s while an 8-char mixed-case-plus-digit secret (`≈2^48`) takes "~44,600 years". — `chapter3-math.html#sec-m-storage`
10. `deep-link-predicate` — **Deep-link decision predicate** — `allow(u,s,a) = valid(u) ∧ authenticated(s) ∧ authorised(s,a) ∧ (¬sensitive(a) ∨ confirmed(a))`; a missing check is a false conjunct. — `chapter3-math.html#sec-m-workflow`

---

## 7. FLASHCARD SEEDS

1. **Front:** What is the organising question for Week 3, and what are the three Android gatekeeper controls?
   **Back:** The organising question is "what crosses each boundary in a mobile platform, and who should be allowed through?" The three controls are 1 Sandbox — keeps apps separated (each app its own user ID and sandbox); 2 Intents — controls app-to-app messages; 3 Permissions — controls resource access (camera, location, files, microphone). Apps start isolated, "safe by default — until a control is missing or misconfigured". — `chapter3-study.html#sec-platform`, `chapter3-study.html#sec-layers`

2. **Front:** A phone is plugged into a free public charging kiosk that also presents a data prompt, and the user taps Allow. Which threat band is this, and why?
   **Back:** The hardware band — "unsafe connection". "Nothing has corrupted memory and no app permission is involved, so this is not a runtime attack and not the gray zone. The attack begins at physical contact with an untrusted device." Countermeasure: carry your own supply or a power-only adapter; "make trust unnecessary — charge without a data connection". — `chapter3-study.html#sec-threats`

3. **Front:** Which four parts of an APK does an analyst inspect first, and what does each tell you?
   **Back:** `AndroidManifest.xml` — components, permissions and security configuration. `classes.dex` — compiled application code. `res/` and `assets/` — screens, images and packaged files. `META-INF/` — signing and certificate information. — `chapter3-study.html#sec-apk`

4. **Front:** Which intent type is more dangerous — explicit or implicit?
   **Back:** Neither. "Security depends on *who can start the activity* and on whether the activity checks authentication. An activity with no lock is the real danger, whichever kind of intent reaches it." A password supplied by an intent "must never be accepted as proof of identity". — `chapter3-study.html#sec-intents`

5. **Front:** A deep link opens a password-reset screen and takes the new password as a URL parameter. Which checks are missing?
   **Back:** Session and confirmation. The predicate is `valid(u) ∧ authenticated(s) ∧ authorised(s,a) ∧ (¬sensitive(a) ∨ confirmed(a))` — all four conjuncts are required. Here `authenticated(s)`, `authorised(s,a)` and `confirmed(a)` are all false, so "the link is being treated as authorisation for a sensitive account action", and "parameters are not identity". — `chapter3-study.html#sec-deeplinks`, `chapter3-math.html#sec-m-workflow`

6. **Front:** Where should a paid third-party API key live, and why is obfuscation not the answer?
   **Back:** On a trusted server that the app calls through a mediated endpoint — "not in the app at all". Client-side secrets are recoverable because the code is delivered to the device and can be decompiled, so the control is architectural, not cryptographic: `E[t] = 2^(H−1)/r` means a 4-digit PIN (`10^4`) falls in about 50 s at 100 guesses/s. Obfuscation "changes how long the search takes, not whether it succeeds". — `chapter3-math.html#sec-m-storage`

7. **Front:** Why is the UI tree part of the app's attack surface?
   **Back:** It is "a machine-readable map of screen elements and their properties" (`TEXT`, `TYPE`, `CLICKABLE`, `BOUNDS`), so "anything in it can be read and acted on at scale, and it may reveal labels or state the screen hides". Automation adds volume, metadata leakage and intent confusion — and "a UI check is a usability aid, not a security control". — `chapter3-study.html#sec-uiautomation`
