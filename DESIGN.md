# DESIGN.md: Architecture & Design System

## 1. Core Philosophy: "Blueprint Brutalism"
This project strictly adheres to a "Blueprint Brutalism" aesthetic. It is designed to look like a highly functional engineering workbench, a terminal, or an architectural blueprint. It must visually communicate structural competence, backend logic, and zero marketing fluff.

**MANDATORY DIRECTIVES:**
* **Function over Form:** If a UI element does not serve a strict informational or structural purpose, remove it.
* **Absolute Flatness:** The design exists strictly in a 2D plane (with the exception of the React Three Fiber canvas). 
* **High Contrast:** Rely on stark black-and-white contrast for hierarchy, not opacity or shades of gray.

## 2. Prohibited Elements (FORBIDDEN)
Under NO circumstances may you use any of the following CSS or Tailwind properties. Generating these will be considered a failure:
* `shadow-*` (No drop shadows, box shadows, or text shadows).
* `bg-gradient-*` or `text-transparent bg-clip-text` (No gradients of any kind).
* `backdrop-blur-*` or `bg-opacity-*` (No glassmorphism).
* `rounded-md`, `rounded-lg`, `rounded-full` (Corners must be sharp. `rounded-sm` or `rounded-none` ONLY).
* `ring-*` (Use solid 1px borders for focus states instead).

## 3. Color Palette
Use hard-coded standard Tailwind colors to maintain absolute consistency.

* **Background (Global):** Pure Black (`bg-black`, `#000000`).
* **Grid Lines & Borders:** Dark Slate/Zinc (`bg-zinc-800`, `border-zinc-800`).
* **Primary Text:** Stark White (`text-white`, `#FFFFFF`).
* **Secondary Text (Metadata/Dates):** Muted Gray (`text-zinc-500`).
* **Accent Color (Use Sparingly):** Analog Teal (`text-teal-500`) OR Burnt Orange (`text-orange-500`). Use this ONLY for active states, small status dots, or hyper-specific data highlights.

## 4. Typography
The typographic hierarchy relies on a strict contrast between geometric sans-serif (for reading) and monospace (for data).

* **Primary Font (Sans-serif):** `font-sans` (configured to Geist, Inter, or Space Grotesk). Used for H1, H2, body paragraphs, and summaries.
    * *Styling:* Keep letter spacing tight (`tracking-tight`) for large headers.
* **Secondary Font (Monospace):** `font-mono` (configured to Geist Mono or JetBrains Mono). Used for technical tags, dates, metadata, navigation links, and small labels.
    * *Styling:* Keep letter spacing wide (`tracking-widest`), usually `text-xs` and `uppercase`.

## 5. Layout & Grid System
The core layout relies on a Bento Grid, executed using the "1px gap hack" to create perfect blueprint lines without double borders.

* **The Container:**
    ```html
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-zinc-800 border border-zinc-800">
        <div className="bg-black p-6 hover:bg-white hover:text-black transition-colors duration-200">...</div>
    </div>
    ```
* **Spacing:** Use consistent, mathematical padding. `p-6` or `p-8` for Bento blocks. Do not mix and match arbitrary padding values.

## 6. Interaction & Animations
Animations must feel mechanical, instant, or native.

* **Hover States:** Do not scale (`hover:scale-105`) or elevate elements. Instead, invert the colors (e.g., `hover:bg-white hover:text-black`) or change a border color.
* **Page Transitions:** Rely purely on the Next.js 16 native View Transitions API (`startTransition`). DO NOT use Framer Motion or heavy CSS keyframe libraries for routing.
* **3D Canvas:** The `@react-three/fiber` canvas should have a continuous, slow, mathematical rotation using the `useFrame` hook. No erratic mouse-follow physics.

## 7. Component Specifications

### 7.1. Buttons & Links
* Must be inline text or rigid boxes.
* *External Links:* Always append the `↗` arrow.
* *Internal Links:* Use brackets for navigation elements (e.g., `[ ABOUT ]`, `[ EXPERIENCE ]`).

### 7.2. Tech Stack Tags
* Do not use pill-shaped tags.
* Use raw monospace text separated by slashes or strict square borders.
* *Example:* `<span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-1">Next.js 16</span>`

### 7.3. The 3D Engine (Procedural Network)
* **Material:** `MeshBasicMaterial` only. No lighting calculations (`MeshStandardMaterial`), no specular highlights.
* **Geometry:** `BufferGeometry` mapped to `LineSegments`.
* **Color:** The 3D lines must be `color="#27272a"` (zinc-800) to blend subtly into the black background, acting as a structural watermark rather than a glowing focal point.