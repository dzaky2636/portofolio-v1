# DESIGN.md: Architecture & Design System

## 1. Core Philosophy: "Corporate Weirdcore"
This project blends professional software engineering with early-internet, surrealist RPG aesthetics (inspired by the late-90s web and ENA). It relies on thick borders, harsh contrasts, unpolished digital textures, and a deliberate juxtaposition between elegant print typography and raw terminal text. It must feel like an interactive, slightly eccentric digital dossier.

**MANDATORY DIRECTIVES:**
* **Tactile & Clunky:** UI elements should look like physical, slightly crude OS windows or dialogue boxes.
* **Harsh, Not Soft:** No smooth, floating elements. Everything is grounded with thick lines and hard, unblurred shadows.
* **Intentional Juxtaposition:** Mix high-end editorial layouts with low-res digital UI tropes.

## 2. Prohibited Elements (FORBIDDEN)
Under NO circumstances may you use any of the following CSS or Tailwind properties:
* `shadow-md`, `shadow-lg`, etc. (No soft drop shadows. Only hard, offset block shadows).
* `bg-gradient-*` (No gradients whatsoever. Solid colors only).
* `backdrop-blur-*` (No glassmorphism).
* `rounded-md`, `rounded-lg`, `rounded-full` (Corners must be absolutely sharp. NO rounded corners).
* Smooth, slow `ease-in-out` opacity fades.

## 3. Color Palette
Colors must be strictly limited, highly contrasting, and unapologetically bold.

* **Background (Global):** Warm Paper / Off-White (`#F4F3ED` or Tailwind `bg-stone-100`).
* **Ink & Architecture:** Pure, harsh black (`#0C0C0C` or Tailwind `bg-neutral-950`). Used for all borders, text, and hard shadows.
* **Accent Colors:** Digital Royal Blue (`#2945FF`) or pure Warning Yellow (`#FFD700`). Use ONLY for hover states, active links, or specific highlighted data tags.

## 4. Typography
The identity relies on the clash between classic print and raw digital output.

* **Primary Font (Display/Headers/Body):** A classic, elegant Serif (e.g., `Times New Roman`, `Playfair Display`, or `Instrument Serif`). Headers should be massive and tightly tracked.
* **Secondary Font (UI/Metadata/Tags/Nav):** A strict Terminal Monospace (e.g., `Courier New`, `JetBrains Mono`, or `VT323`). Keep it uppercase, small, and widely tracked (`tracking-widest`).

## 5. UI Components & "The Inventory" System
All content lives inside distinct "Windows" mimicking old OS dialogue boxes.

* **The "Window" Container:**
    * **Borders:** 3px or 4px solid black (`border-4 border-black`).
    * **Shadow:** A hard, unblurred black offset shadow (e.g., `box-shadow: 8px 8px 0px #0C0C0C`).
    * **Background:** Solid white (`bg-white`).
* **Hover States:**
    * When hovered, the window physically depresses: `translate-x-[2px] translate-y-[2px]`.
    * The hard shadow shrinks slightly to match the translation.
    * Borders or shadows snap to an Accent Color (e.g., Digital Blue).
* **Profile Picture Container:**
    * Must use the exact same thick border and hard shadow as the windows.
    * Optional: Apply a high-contrast or grayscale CSS filter (`grayscale contrast-125`) to match the surreal vibe.

## 6. Layout Architecture (The 8-Point Flow)
The page layout abandons the full-page Bento Grid for a flowing, narrative structure:
1. **Header:** Clunky, bordered nav bar. Toggle switch for EN/ID.
2. **Hero:** Massive serif typography. Includes the Profile Picture container.
3. **Education & 4. Short Profile:** Uses a mini-grid (The "Inventory"), featuring weird/clunky stat blocks and tech-stack tags.
5. **Projects:** Massive, text-heavy dialogue boxes acting as "Realms" or "Levels."
6. **Experience:** An interactive accordion or zig-zag timeline with harsh border UI.
7. **Contact:** Screen-filling call-to-action with a massive, pill-shaped or blocky email button.
8. **Footer:** Retro web badges, links, and a randomized quote generator.

## 7. The Modal Carousel (Image_Viewer.exe)
Clicking a project does NOT navigate to a new page. It opens a retro image viewer overlay.
* **Overlay Backdrop:** Harsh, unblurred background (e.g., `bg-black/90` or a CSS halftone dot pattern).
* **Container:** A centered `.window` element with the standard thick border and hard shadow.
* **Controls:** Navigation buttons (Next/Prev) must be rigid, interactive squares containing raw text `[ < ]` and `[ > ]`.
* **Motion:** The modal snaps into view instantly or scales harshly. No slow fades.