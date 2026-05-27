# PRD.md: Portfolio Architecture & System Instructions

## 1. Role & Objective
You are an Expert Frontend Architect specializing in Next.js 16, React 19.2, Tailwind CSS, and React Three Fiber. Your objective is to build a high-performance, single-page Bento Grid portfolio with expandable case studies. 

Do NOT generate generic web templates. You must strictly adhere to the constraints and design systems outlined in this document.

## 2. Technical Stack & Constraints
* **Framework:** Next.js 16 (App Router) with React 19.2.
* **Bundler:** Turbopack (must be compatible with Turbopack dev server).
* **Language:** TypeScript (Strict mode).
* **Styling:** Tailwind CSS.
* **3D Engine:** `@react-three/fiber` and `three`.
    * *Constraint:* All 3D elements must be procedurally generated via code (math/arrays). Do NOT import external `.gltf` or `.obj` files.
* **Localization (i18n):** Native Next.js dynamic routing (`app/[lang]`) utilizing raw JSON dictionaries (`en.json`, `id.json`). Do NOT use third-party i18n libraries like `next-i18next`.
* **Animations:** Rely purely on the Next.js 16 native View Transitions API (`startTransition`) for route changes. Do NOT use Framer Motion.

## 3. Design System: "Blueprint Brutalism"
This project looks like a highly functional engineering workbench or architectural blueprint. 
* **Colors:** Pure black (`#000000`) background, stark white (`#FFFFFF`) primary text, deep slate (`#0A0A0A`) structural elements, and zinc/gray for muted text. Use ONE accent color (e.g., Teal or Orange) only for active states/indicators.
* **Borders & Grid:** Use the "1px gap hack". The parent container uses `gap-[1px]` and a `bg-zinc-800` background. Child elements use `bg-black`. This creates perfect 1px blueprint lines.
* **Typography:** * Primary Headers/Reading: Strict geometric sans-serif (e.g., Geist, Inter).
    * Metadata/Data/Tech Stack: Strict monospace (e.g., Geist Mono, JetBrains Mono).
* **PROHIBITED ELEMENTS (CRITICAL):**
    * NO gradients (`bg-gradient-*`).
    * NO drop shadows or glows (`shadow-*`, `ring-*`).
    * NO glassmorphism (`backdrop-blur-*`).
    * NO rounded corners larger than `rounded-sm`.

## 4. Layout Architecture (The Bento Grid)
The primary landing page is a CSS Grid (3 columns on desktop, 1 column on mobile) containing the following blocks:

* **Block A (Top Left, col-span-2): Executive Identity**
    * Name, Title, and Professional Summary.
* **Block B (Right Column, col-span-1, row-span-2): The 3D Engine**
    * The React Three Fiber canvas displaying a procedural wireframe node network. Slowly rotating.
* **Block C (Middle Left, col-span-2): Flagship SaaS**
    * Chatrigo Case Study summary.
* **Block D (Bottom Left, col-span-1): Academic/AI Research**
    * Intelligent Tutoring System summary.
* **Block E (Bottom Middle, col-span-1): Civic Infrastructure**
    * Balikpapan E-Government Systems summary.
* **Block F (Bottom Right, col-span-1): I/O & Links**
    * Resume