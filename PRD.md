# PRD.md: Portfolio Architecture & System Instructions

## 1. Role & Objective
You are an Expert Frontend Architect specializing in Next.js 16, React 19.2, Tailwind CSS, and React Three Fiber. Your objective is to build a highly distinctive, single-page portfolio utilizing a "Corporate Weirdcore" aesthetic. 

Do NOT generate generic, smooth web templates. You must strictly adhere to the chunky, retro OS constraints and design systems outlined in this document and `DESIGN.md`.

## 2. Technical Stack & Constraints
* **Framework:** Next.js 16 (App Router) with React 19.2.
* **Bundler:** Turbopack.
* **Language:** TypeScript (Strict mode).
* **Styling:** Tailwind CSS (extended with custom variables for hard shadows and thick borders).
* **3D Engine:** `@react-three/fiber` and `three`.
    * *Constraint:* The 3D element should mimic PS1-era low-poly graphics. Use flat shading (`MeshBasicMaterial` or `MeshToonMaterial`) and rigid rotations.
* **Localization (i18n):** Native Next.js dynamic routing (`app/[lang]`) utilizing raw JSON dictionaries (`en.json`, `id.json`). No heavy third-party i18n libraries.
* **State Management:** React `useState`/`useTransition` for the project carousel modals.

## 3. Layout Architecture (The 8-Point Flow)
The application abandons a rigid full-page grid for a sequential, narrative layout using retro OS "Windows".

1. **Header:** Clunky, bordered nav bar with a physical-feeling toggle switch for `EN / ID`.
2. **Main Profile (Hero):** Massive serif typography paired with a harshly bordered Profile Picture container. Includes the 3D `<Canvas>` rendering a low-poly geometric object.
3. **Education:** Presented as a clunky system log or "Window" block.
4. **Short Profile (The Inventory):** A cluster of small windows displaying tech stack tags (`Next.js`, `TypeScript`) and current status.
5. **Projects (The Realms):** Massive, text-heavy dialogue boxes.
    * *Interaction:* Clicking a project opens `Image_Viewer.exe` (A modal overlay with a harsh backdrop and raw `[ < ]` `[ > ]` navigation buttons to cycle through project screenshots).
6. **Experience:** An interactive accordion or zig-zag timeline. Expanding a role snaps it open instantly.
7. **Contact ("Let's Talk"):** Screen-filling section with a massive, blocky email button.
8. **Footer:** Thick top border, containing retro web badges, social links, and a dynamic randomized quote string.

## 4. Content Dictionary (The Source of Truth)
When generating UI components, use ONLY the following verified data. **Do NOT invent, hallucinate, or add marketing fluff.**

### Identity
* **Name:** Dzaky Fatur Rahman
* **Title:** Lead Fullstack Engineer & AI Integrator
* **Summary:** Architecting scalable omnichannel SaaS platforms, AI-integrated systems, and secure civic web infrastructure. Proven track record of managing the end-to-end SDLC and leading technical divisions.

### Project 1: Chatrigo (SaaS & AI Orchestration)
* **Role:** Lead Fullstack Engineer at PT Rigo Inovasi Digital
* **Stack:** Next.js 15/16, Prisma, Supabase, PostgreSQL (pgvector)
* **Details:** Led the engineering architecture for a multi-tenant B2B omnichannel AI chatbot platform centralizing interactions across WhatsApp and Telegram. Engineered an anti-hallucination AI orchestrator featuring RAG and an AI Business Advisor. Managed and mentored the technical division, establishing code quality standards.
* **Images:** (To be mapped in JSON array: `['/chatrigo-1.jpg', '/chatrigo-2.jpg']`)

### Project 2: Balikpapan E-Government Systems (Civic Tech)
* **Role:** Fullstack Web & Mobile Developer at Diskominfo Balikpapan
* **Stack:** Laravel, Tailwind CSS, Queue Processing, Flutter
* **Details:** Developed enterprise-grade municipal systems to enhance public services. Built an automated E-Signature platform (E-Sign) with background queue processing deployed across city schools. Developed a secure personnel management dashboard (E-KGB).
* **Images:** (To be mapped in JSON array: `['/egov-1.jpg', '/egov-2.jpg']`)

### Project 3: Intelligent Tutoring System (Academic/AI)
* **Role:** Informatics Graduate (GPA 3.71/4.00) at Universitas Multimedia Nusantara
* **Stack:** Python, AI Agents, LLM Engineering
* **Details:** Undergraduate thesis engineering an adaptive tutoring system utilizing Octalysis-based gamification and autonomous AI agents for real-time feedback and adaptive support. Mentored 200+ students as a Laboratory Assistant.
* **Images:** (To be mapped in JSON array: `['/thesis-1.jpg', '/thesis-2.jpg']`)

### Certifications & Specs
* **Language:** TOEIC (960/990), Duolingo English Test (145/160)
* **Tech:** Huawei HCIA-AI, Data Science Fundamentals (DQLab)