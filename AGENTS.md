<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md: AI Engineering Workflow & Model Delegation

## 1. The Context Protocol (Prime Directive)
Before issuing ANY command to ANY model in Kilo Code, the context window MUST be primed. 
* **The Rule:** You must attach or paste both `PRD.md` (for architecture/content) and `DESIGN.md` (for visual rules) into the initial prompt of a new chat session.
* **The Warning:** Never assume a model "remembers" the aesthetic. If a model starts generating gradients or rounded corners, nuke the chat and start a new session with the context files.

## 2. Model Roles & Authorization

### Agent Alpha: The Architects (Qwen3.7 Max | DeepSeek V4 Pro)
**Role:** Deep reasoning, complex logic, and mathematical architecture.
**Authorized Tasks:**
* Generating the initial Next.js 16 App Router architecture and `middleware.ts`.
* Writing the procedural math, `Float32Array` buffers, and geometry logic for the `@react-three/fiber` canvas.
* Debugging complex hydration errors or server/client component boundary issues.
* Architecting the i18n JSON dictionary routing.
**Prohibited Tasks:** Scaffolding basic Tailwind UI (too slow/expensive).

### Agent Beta: The Sprinter (DeepSeek V4 Flash)
**Role:** High-speed code generation and repetitive boilerplate execution.
**Authorized Tasks:**
* Translating `DESIGN.md` rules into specific Tailwind CSS classes.
* Building isolated, single-file UI components (e.g., `Button.tsx`, `LangSwitcher.tsx`, `TechTag.tsx`).
* Writing standard TypeScript interfaces and types for the JSON dictionaries.
**Prohibited Tasks:** Designing complex multi-file architectures or writing Three.js coordinate math.

### Agent Gamma: The Assembler (Kimi K2.6)
**Role:** Context mastery and large-scale UI orchestration.
**Authorized Tasks:**
* Assembling the final 6-block Bento Grid layout in `page.tsx` using the `gap-[1px]` hack.
* Ingesting the large `PRD.md` Content Dictionary and perfectly translating it into the `en.json` and `id.json` files without hallucinating or dropping facts.
* Refactoring across multiple UI files simultaneously while holding the strict "Blueprint Brutalism" rules in context.
**Prohibited Tasks:** Core system architecture or heavy algorithmic logic.

## 3. The Vibe-Coding Pipeline

To execute a feature flawlessly, follow this model handoff sequence:

* **Step 1 (Architecture):** Ping **Qwen3.7 Max**. Give it the PRD and ask it to write the empty component shells, define the TypeScript interfaces, and establish the data flow.
* **Step 2 (Content):** Ping **Kimi K2.6**. Give it the PRD Content Dictionary and ask it to generate the raw data structures or JSON files.
* **Step 3 (Assembly):** Ping **DeepSeek V4 Flash**. Give it the component shells from Step 1, the data from Step 2, and the `DESIGN.md` file. Instruct it to write the Tailwind CSS and finish the UI.

## 4. Anti-Hallucination Directives
If any agent invents work experience, adds marketing fluff (e.g., "Synergized paradigms"), or uses prohibited design elements (e.g., glassmorphism, drop shadows), you must immediately reply with:
> "CRITICAL HALT. You have violated the PRD.md / DESIGN.md constraints. Revert the last change and strictly apply the authorized formatting/data."