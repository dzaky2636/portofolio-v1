# AGENTS.md: AI Engineering Workflow & Model Delegation

## 1. The Context Protocol (Prime Directive)
Before issuing ANY command to ANY model in Kilo Code, the context window MUST be primed. 
* **The Rule:** You must attach or paste both `PRD.md` (for architecture/content) and `DESIGN.md` (for visual rules) into the initial prompt of a new chat session.
* **The Warning:** Models inherently default to modern, smooth web design (rounded corners, soft shadows). If a model starts generating generic "AI slop," nuke the chat and start a new session with the context files.

## 2. Model Roles & Authorization

### Agent Alpha: The Architects (Qwen3.7 Max | DeepSeek V4 Pro)
**Role:** Deep reasoning, complex logic, and mathematical architecture.
**Authorized Tasks:**
* Generating the core Next.js 16 App Router architecture and `middleware.ts`.
* Writing the procedural math and geometry logic for the `@react-three/fiber` canvas to achieve the PS1-style low-poly look (wobble/snapping shaders).
* Managing complex React state (`useState`, `useTransition`) for the `Image_Viewer.exe` Carousel Modal.
**Prohibited Tasks:** Scaffolding basic Tailwind UI or writing long paragraphs of content.

### Agent Beta: The Sprinter (DeepSeek V4 Flash)
**Role:** High-speed code generation and retro boilerplate execution.
**Authorized Tasks:**
* Translating `DESIGN.md` rules into specific, chunky Tailwind CSS classes.
* Building isolated, single-file retro UI components (e.g., the clunky `EN/ID` toggle switch, the `[ < ]` navigation buttons, the thick-bordered `.window` container).
* Writing standard TypeScript interfaces for the JSON dictionaries.
**Prohibited Tasks:** Designing complex multi-file architectures or writing Three.js coordinate math.

### Agent Gamma: The Assembler (Kimi K2.6)
**Role:** Context mastery and large-scale UI orchestration.
**Authorized Tasks:**
* Assembling the final 8-point narrative layout in `page.tsx` using the custom "Inventory" and "Realm" grid structures.
* Ingesting the large `PRD.md` Content Dictionary and perfectly translating it into the `en.json` and `id.json` files without hallucinating or dropping facts.
* Refactoring across multiple UI files simultaneously while holding the strict "Corporate Weirdcore" rules in context.
**Prohibited Tasks:** Core system architecture or heavy algorithmic logic.

## 3. The Vibe-Coding Pipeline

To execute a feature flawlessly, follow this model handoff sequence:

* **Step 1 (Architecture):** Ping **Qwen3.7 Max**. Give it the PRD and ask it to write the empty component shells, define the TypeScript interfaces, and establish the data flow (like the Modal state).
* **Step 2 (Content):** Ping **Kimi K2.6**. Give it the PRD Content Dictionary and ask it to generate the raw data structures or JSON files.
* **Step 3 (Assembly):** Ping **DeepSeek V4 Flash** (or Kimi for whole pages). Give it the component shells from Step 1, the data from Step 2, and the `DESIGN.md` file. Instruct it to write the harsh Tailwind CSS and finish the UI.

## 4. Anti-Hallucination Directives
If any agent invents work experience, uses modern UI trends (glassmorphism, soft shadows, rounded corners), or adds marketing fluff, you must immediately reply with:
> "CRITICAL HALT. You have violated the PRD.md / DESIGN.md constraints. Remove the modern styling. Revert to thick borders, hard shadows, and the strict authorized data."