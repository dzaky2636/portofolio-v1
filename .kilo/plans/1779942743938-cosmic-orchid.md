# Animation & Interactivity Strategy Plan

## Objective
Map out a comprehensive, aggressive, and physically-grounded animation strategy for the Corporate Weirdcore portfolio. This is a planning document only — no code implementation.

## Aesthetic Constraints
- **Vibe:** Heavy mechanical switches, glitching analog hardware, heavy rubber, spring-loaded tension, 1998 software instability.
- **Forbidden:** Smooth, floaty, elegant, or modern web transitions. No changes to background colors, text colors, borders, or cursor on hover.
- **Goal:** Make the website feel "aggressively alive, highly physical, and slightly unstable."

---

## 1. Header & Navigation

### 1.1 `DZAKY_SYS // V1.0` Badge
- **Concept A: CRT Power-On Flicker.** On initial page load, the badge violently flickers between visible and invisible 4–5 times in rapid succession (like a CRT monitor receiving power), then snaps solid. No opacity fade — instant toggling.
- **Concept B: Thermal Printer Feed.** The badge text appears character-by-character with a jittery, uneven rhythm, as if being printed by a malfunctioning dot-matrix printer. Occasional double-strikes or misaligned characters.
- **Concept C: Stuck Relay.** The badge hovers in place, but every 8–10 seconds it twitches 1px to the left and snaps back, like a stuck electrical relay arcing.

### 1.2 Nav Links (`[PROFILE]`, `[INVENTORY]`, etc.)
- **Concept A: Typewriter Jam.** On hover, the link violently shakes side-to-side (±3px, 4–5 rapid oscillations) as if a typewriter hammer struck two keys at once, then snaps to the accent color.
- **Concept B: Kinetic Shift.** The link physically depresses down and right by 2px (matching window physics) while the bracket characters `[` and `]` momentarily expand outward like a spring releasing tension.
- **Concept C: Scanline Glitch.** On hover, a single horizontal "scanline" (a 1px height colored strip) rapidly scrubs down through the text once, and the text shifts 1px left then snaps back.

### 1.3 EN/ID Language Toggle
- **Concept A: Mechanical Lever.** Clicking the inactive language triggers a heavy, spring-loaded snap. The active background color block doesn't fade — it violently slides across (translateX) with an elastic overshoot, bouncing back 1px before settling.
- **Concept B: Circuit Breaker Flip.** The switch acts like a breaker. Clicking it causes a micro-blackout: the entire header dims to 80% opacity for 50ms, then snaps back, while the language block instantly inverts.
- **Concept C: Punch Card Toggle.** On click, the inactive side physically rises (translateY -2px) while the active side sinks (translateY +1px), creating a seesaw mechanical feel. The text itself glitches for one frame into random ASCII characters before resolving.

---

## 2. Hero Section

### 2.1 Massive Serif Typography (`DZAKY FATUR RAHMAN`)
- **Concept A: Hydraulic Press Descent.** On load, each line of text drops from 20px above its final position, overshooting by 5px, bouncing back up 3px, then settling. Like a heavy hydraulic press slamming down and bouncing off rubber dampers.
- **Concept B: Stuttering Teletype.** Lines appear one at a time with a heavy, uneven `steps()` animation. Each letter is revealed in chunks of 3–4 characters at once, with visible horizontal jitter between chunks.
- **Concept C: Magnetic Lock.** Text starts 1px blurry (not CSS blur, but offset duplicated text layer) and violently snaps into sharp focus with a high-frequency horizontal shimmer that decays over 200ms.

### 2.2 Role Badge (`Lead Fullstack Engineer...`)
- **Concept A: Label Gun Stamp.** The badge appears to be "stamped" onto the page. It scales up violently from 1.1x to 1.0x with a slight rotation wobble (±1deg), as if a label gun impacted the surface.
- **Concept B: Thermal Receipt Print-Out.** The badge height animates from 0 to full with a slightly uneven speed, mimicking a receipt printer slowly exposing the text. The shadow lags behind by 50ms.
- **Concept C: Warning Light Strobe.** The yellow shadow behind the badge flashes intensely for 3 cycles on load, as if an amber warning light is reflecting off the badge surface.

### 2.3 Profile Picture Container
- **Concept A: Polaroid Eject.** On load, the container shoots up from 20px below its final position with a heavy spring recoil, then settles while the internal placeholder text scrambles through 3 random character sets before resolving to `[IMG://PROFILE_PIC]`.
- **Concept B: Film Developing.** The internal black square flickers between black and dark gray 5–6 times over 1 second, like film being developed under a safelight, before stabilizing.
- **Concept C: Misaligned Feed.** The container enters from the right with a slight rotational skew (2deg), then violently snaps to 0deg alignment, causing the internal image area to "shake" within the frame.

### 2.4 3D Render Window (`RENDER_VIEW.exe`)
- **Concept A: Boot Sequence.** The window container scales from 0.95 to 1.0 with a heavy, decaying wobble. The title bar text `[ACTIVE]` flickers between `[ACTIVE]` and `[LOADING]` 3 times before locking.
- **Concept B: Overclocked Fan Vibration.** The entire window container applies a very subtle, high-frequency translateY jitter (±0.5px at 30fps) continuously, as if sitting on top of an overclocked PC fan.
- **Concept C: Screen Tearing Glitch.** Every 4–7 seconds, the canvas area within the window appears to "tear" — a duplicated half of the canvas momentarily offsets 10px to the right for 50ms, then snaps back (CSS clip-path or pseudo-element trick).

---

## 3. Inventory Section (`USER_INVENTORY.LOG`)

### 3.1 Section Header
- **Concept A: Line Printer.** The header text types out with a heavy, mechanical rhythm. A blinking block cursor follows the last character, then vanishes with a sharp snap.
- **Concept B: Log File Scroll.** The header and subtitle slide up from below, masked by an invisible overflow container, as if a log file is scrolling into view.

### 3.2 Inventory Windows (Edu, Certs, Tech Stack, Status)
- **Concept A: Relay Rack Mount.** Each window staggers in from the left with a heavy, clunky motion: translateX(-30px) → 0 with an overshoot bounce, like a server rack module being slammed into a bay.
- **Concept B: Card Dealer Flick.** Windows enter by rapidly translating from random off-screen angles, snapping into the grid with a decelerating wobble, like a dealer flicking cards onto a table.
- **Concept C: System Boot Blocks.** Windows pop in one by one with a sharp scale(0.95)→scale(1) and a simultaneous border color flash (black → blue → black), as if the system is initializing hardware blocks.

### 3.3 Window Hover States (Existing: translate + shadow shrink)
- **Concept A: Rubber Pad Compression.** On hover, the window doesn't just translate 2px — it violently squashes on the Y-axis (scaleY 0.98) while translating, as if pressing down on a heavy rubber industrial button pad. The shadow doesn't just shrink; its opacity flickers once.
- **Concept B: Relay Click Echo.** Hover triggers a high-frequency, tiny horizontal jitter (±1px, 3 oscillations) mimicking the mechanical echo of a heavy relay switch engaging. The border snap to blue is instant, no fade.
- **Concept C: Weight Shift.** The hovered window tilts 1deg toward the shadow direction (bottom-right), as if the physical weight of the window is shifting onto its foundation. The unhovered siblings subtly push away 2px (repulsion field).

### 3.4 Tech Stack Tags
- **Concept A: Keycap Press.** On hover, each tag violently depresses: translateY(3px), shadow shrinks to 0px 0px, and the border thickens from 2px to 3px instantly — exactly like a mechanical keyboard keycap bottoming out.
- **Concept B: Sticky Label.** Hover causes the tag to "peel" slightly: the top edge lifts (rotateX 5deg) revealing a sliver of "adhesive" (yellow or blue background), then snaps flat when clicked or unhovered.
- **Concept C: Circuit Short.** The tag background rapidly inverts colors (black bg, white text) for 50ms on hover, like a circuit shorting out, then snaps to the hover state.

---

## 4. Project Realms (`PROJECT_REALMS`)

### 4.1 Realm Cards (Project Section)
- **Concept A: Heavy Drawer Slide.** Cards enter by sliding up from 40px below with extreme mass. The motion is slow to start, fast in the middle, and slams into place with an audible *feel* of inertia (cubic-bezier with heavy anticipation).
- **Concept B: Flip-Dot Display.** On load, the text within each card appears to "flip" into existence, like a split-flap display at a train station. Characters cycle rapidly through random glyphs before locking.
- **Concept C: Conveyor Belt Drop.** Cards translate in from the right on an invisible conveyor, then drop down into their grid slot with a heavy bounce (spring physics with high damping).

### 4.2 Realm Card Hover
- **Concept A: Hydraulic Lift.** Hovering causes the card to physically rise (translateY -4px) while the shadow expands dramatically (12px 12px), as if a hydraulic lift is pushing the card up toward the user. On mouse leave, it slams back down.
- **Concept B: Tectonic Shift.** The card border doesn't just turn blue — it "rips" across. A blue line scans from left to right across the border at high speed, replacing black with blue in its wake, leaving the full blue border behind.
- **Concept C: Magnetic Attraction.** The entire card skews 2deg toward the cursor position (top/bottom/left/right), as if being pulled by a magnet. The internal text shifts 1px in the opposite direction, creating a parallax shear.

### 4.3 Stack Tags within Realms (`[Next.js]`, etc.)
- **Concept A: Assembly Line Stamp.** Tags appear one by one with a rapid, rhythmic stamping motion: each tag scales from 1.2 to 1.0 with a harsh `steps(3)` timing, like a factory stamp press.
- **Concept B: LED Matrix Blink.** Tags flicker into visibility at random, uneven intervals (like faulty LEDs on a server rack), then stabilize.

---

## 5. Experience Accordion (`EXPERIENCE_LOGS`)

### 5.1 Accordion Directory Tab Headers
- **Concept A: Punch Tape Reader.** On load, tabs slide in from the left with a ratcheting motion (like a punch tape advancing through a reader), advancing 10px at a time with visible stops.
- **Concept B: Server Rack Lights.** The `[ + ]` / `[ - ]` indicator toggles with a sharp, illuminated blink: it scales to 1.3x and snaps back instantly, like an LED indicator firing.
- **Concept C: Relay Bank.** The entire tab row shudders once in unison on load, as if a bank of heavy relays just engaged simultaneously.

### 5.2 Accordion Expand/Collapse
- **Concept A: Guillotine Drop.** The content panel doesn't slide smoothly — it drops down with extreme weight, overshooting its final height by 10px, then bouncing back up. The border-top snaps into existence instantly, like a blade falling.
- **Concept B: Shutter Unfold.** The content area reveals itself using a harsh `clip-path` or `height` steps animation, as if a metal shutter is being cranked open in 5 discrete jerky movements.
- **Concept C: Paper Jam Reveal.** The content appears to be "fed" out from the tab: it translatesY from -10px (hidden behind the tab) to 0, but with a stuttering, uneven rhythm, as if a printer is struggling to feed paper.

### 5.3 Active Tab State (Yellow Background)
- **Concept A: Warning Lamp Ignite.** The yellow background doesn't fade in — it snaps on, and a subtle, high-frequency opacity pulse (95% → 100%) runs for 1 second, like a sodium vapor lamp warming up.
- **Concept B: Thermal Paper Yellowing.** The background color sweeps in from left to right instantly, like a highlighter being dragged across paper at impossible speed.

---

## 6. Contact Section (`INITIATE_CONTACT`)

### 6.1 Section Typography
- **Concept A: Siren Sync.** The massive "INITIATE_CONTACT" header subtly pulses in scale (1.0 to 1.01) in a slow, heavy rhythm, like an industrial warning siren cycling.
- **Concept B: Emergency Broadcast.** The text enters with a harsh horizontal shear: each letter slides in from alternating left/right directions with a snapping deceleration, like an EAS broadcast cutting in.

### 6.2 `[ SEND_TRANSMISSION ]` Button
- **Concept A: Missile Launch Key.** Clicking the button requires a "twist" motion: on mousedown, the button rotates 3deg clockwise (like turning a key), and on mouseup it snaps back while triggering a violent screen-wide flash (white overlay at 20% opacity for 50ms).
- **Concept B: Industrial Press.** Hovering causes the button to sink deeply into the page (translateY 4px, shadow collapsing to 2px 2px) and the border thickness increases to 6px, as if the user is physically pressing a heavy industrial actuator.
- **Concept C: Teletype Send.** On click, the button text rapidly scrambles through random characters (like a teletype encoding a message), then resolves back to `[ SEND_TRANSMISSION ]` while the button emits a single, heavy bounce.

---

## 7. Footer

### 7.1 Retro Badges (HTML5, REACT, NEXT.JS)
- **Concept A: LED Blink Sequence.** Badges light up one by one in sequence with a sharp brightness pop (scale 1.05 → 1.0), like LEDs on a modem performing a handshake.
- **Concept B: Sticker Slap.** Badges appear to be slapped onto the footer: each one enters with a random rotation (-2deg to +2deg), overshoots its position by 2px, and settles with a wobble.

### 7.2 Random Quote Block
- **Concept A: Dot Matrix Print.** The quote text appears character-by-character with uneven timing, accompanied by a subtle horizontal jitter of the entire container (±1px), like a dot matrix printer head vibrating.
- **Concept B: Scramble Lock.** On hover, the quote rapidly scrambles into gibberish for 200ms, then resolves to a new random quote with a hard snap, as if a cipher lock just rotated.

### 7.3 Footer Bottom Bar
- **Concept A: Status Light Pulse.** The "ALL SYSTEMS OPERATIONAL" text has a single word that pulses brightly (opacity 0.6 → 1.0) in a slow rhythm, like a heartbeat LED on server hardware.

---

## 8. Modal Carousel (`Image_Viewer.exe`)

### 8.1 Modal Open / Close
- **Concept A: CRT Tube Ignite.** The modal doesn't fade in — it expands from a 1px horizontal line to full height in 3 snapping steps, then expands width in 3 steps, like a CRT electron gun drawing the frame.
- **Concept B: Mechanical Iris.** The modal opens via a harsh `clip-path` animation: a rectangle punches outward from the center in 4 discrete stages, like an aperture opening on an old projector.
- **Concept C: Screen Flicker On.** The backdrop snaps to black, and the modal window flickers into visibility 3 times (opacity 0 → 1 → 0 → 1) before stabilizing, like a monitor receiving a new signal.

### 8.2 Navigation Buttons (`[ < ]`, `[ > ]`)
- **Concept A: Tactile Switch.** On click, the button violently depresses (translateY 3px, scale 0.95), the border inverts (white border on black bg), and it snaps back with a decaying oscillation (2 tiny bounces).
- **Concept B: Tape Rewind.** Clicking causes the button to rapidly jitter back and forth (±4px, 6 oscillations) mimicking the mechanical chatter of a tape rewind head engaging.
- **Concept C: Relay Clunk.** The button physically shifts 2px toward the center of the modal on hover, as if being magnetically drawn, and clicks back with a heavy, instant translation on press.

### 8.3 Image Transition (Next/Prev)
- **Concept A: Slide Jam.** Images don't slide smoothly — they translate in 5px increments (steps animation) as if a projector carousel is mechanically advancing but slightly jamming between frames.
- **Concept B: CRT Refresh.** The current image "rolls" upward rapidly (translateY -100%) with a visible horizontal tear line, while the new image snaps in from below. No smooth interpolation.
- **Concept C: Memory Corruption.** During transition, the outgoing image briefly duplicates and offsets 8px to the right for 100ms (like video RAM corruption), then the new image snaps cleanly into place.

---

## 9. Global / Environmental Effects

### 9.1 Page Load Sequence
- **Concept A: System POST.** The entire page loads in 3 violent phases: (1) Header slams in from top, (2) Hero elements stutter-pop in with random 50ms delays, (3) Lower sections cascade up with heavy spring bounces, like a BIOS POST completing.
- **Concept B: Conveyor Assembly.** Sections enter as if on a factory line: each section slides up from below, overshoots, and is "locked" into place with a visible deceleration wobble.

### 9.2 Scroll Behavior
- **Concept A: Inertia Scroll Lag.** The page uses a slight scroll-jacking feel where elements lag 10–20px behind the scroll position before snapping, creating a heavy, weighted paper feel.
- **Concept B: Parallax Shear.** As the user scrolls, the left column of each section moves 1.05x speed while the right column moves at 0.95x, creating a subtle horizontal shear/tension between content blocks.
- **Concept C: Scanline Follow.** A single 2px-height black horizontal line follows the scroll position with a 100ms lag, like a photocopier scanning head moving down the page.

### 9.3 Random Environmental Glitches
- **Concept A: Relay Twitch.** Every 10–15 seconds, a random element on the page twitches 1px left and snaps back, simulating a loose electrical connection.
- **Concept B: Packet Loss.** A random text block momentarily replaces 1–2 characters with Unicode replacement characters (�) for 100ms, then resolves, simulating data corruption.
- **Concept C: Fan Vibration.** The entire viewport applies an imperceptible (0.3px) high-frequency vertical jitter for 2-second bursts every 20 seconds, as if the "server room" fan just kicked on.

---

## Next Steps
Awaiting user review and selection of preferred animation concepts per element before proceeding to implementation.
