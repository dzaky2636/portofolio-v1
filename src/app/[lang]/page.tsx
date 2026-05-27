import RetroCanvas from '@/components/RetroCanvas';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const randomQuote = "THE SYSTEM IS OPERATIONAL.";

  const experience = [
    {
      title: "Lead Fullstack Engineer",
      org: "PT Rigo Inovasi Digital",
      detail:
        "Led the engineering architecture for a multi-tenant B2B omnichannel AI chatbot platform (Chatrigo) centralizing interactions across WhatsApp and Telegram. Engineered an anti-hallucination AI orchestrator featuring RAG and an AI Business Advisor. Managed and mentored the technical division, establishing code quality standards.",
    },
    {
      title: "Fullstack Web & Mobile Developer",
      org: "Diskominfo Balikpapan",
      detail:
        "Developed enterprise-grade municipal systems to enhance public services. Built an automated E-Signature platform (E-Sign) with background queue processing deployed across city schools. Developed a secure personnel management dashboard (E-KGB).",
    },
    {
      title: "Laboratory Assistant & Researcher",
      org: "Universitas Multimedia Nusantara",
      detail:
        "Undergraduate thesis engineering an adaptive tutoring system utilizing Octalysis-based gamification and autonomous AI agents for real-time feedback and adaptive support. Mentored 200+ students as a Laboratory Assistant.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F4F3ED] text-[#0C0C0C] font-serif selection:bg-[#2945FF] selection:text-white">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 bg-[#F4F3ED] border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="font-mono uppercase tracking-widest text-xs font-bold border-2 border-black px-2 py-1 bg-white shadow-[4px_4px_0px_#0C0C0C]">
            {'DZAKY_SYS // V1.0'}
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#profile"
              className="font-mono uppercase tracking-widest text-xs hover:text-[#2945FF] transition-colors duration-75"
            >
              [PROFILE]
            </a>
            <a
              href="#inventory"
              className="font-mono uppercase tracking-widest text-xs hover:text-[#2945FF] transition-colors duration-75"
            >
              [INVENTORY]
            </a>
            <a
              href="#realms"
              className="font-mono uppercase tracking-widest text-xs hover:text-[#2945FF] transition-colors duration-75"
            >
              [REALMS]
            </a>
            <a
              href="#logs"
              className="font-mono uppercase tracking-widest text-xs hover:text-[#2945FF] transition-colors duration-75"
            >
              [LOGS]
            </a>
            <a
              href="#contact"
              className="font-mono uppercase tracking-widest text-xs hover:text-[#2945FF] transition-colors duration-75"
            >
              [TRANSMIT]
            </a>
          </nav>

          <div className="flex items-center border-2 border-black bg-white">
            <span className="px-3 py-1 font-mono uppercase tracking-widest text-xs bg-[#0C0C0C] text-white">
              EN
            </span>
            <a
              href={`/${lang === "en" ? "id" : "en"}`}
              className="px-3 py-1 font-mono uppercase tracking-widest text-xs hover:bg-[#2945FF] hover:text-white transition-colors duration-75"
            >
              ID
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO */}
      <section
        id="profile"
        className="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        <div className="space-y-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.85] tracking-tight">
            DZAKY
            <br />
            FATUR
            <br />
            RAHMAN
          </h1>
          <div className="font-mono uppercase tracking-widest text-xs bg-[#0C0C0C] text-white inline-block px-3 py-2 border-2 border-white shadow-[4px_4px_0px_#2945FF]">
            Lead Fullstack Engineer & AI Integrator
          </div>
          <p className="text-xl md:text-2xl font-serif leading-relaxed max-w-xl">
            Architecting scalable omnichannel SaaS platforms, AI-integrated
            systems, and secure civic web infrastructure. Proven track record of
            managing the end-to-end SDLC and leading technical divisions.
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Picture Container */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-3 max-w-md mx-auto lg:mr-0 lg:ml-auto">
            <div className="w-full aspect-square bg-[#0C0C0C] flex items-center justify-center">
              <span className="font-mono uppercase tracking-widest text-xs text-white">
                [IMG://PROFILE_PIC]
              </span>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-4 max-w-md mx-auto lg:mr-0 lg:ml-auto">
            <div className="font-mono uppercase tracking-widest text-xs border-b-2 border-black pb-2 mb-3 flex justify-between">
              <span>RENDER_VIEW.exe</span>
              <span>[ACTIVE]</span>
            </div>
            <RetroCanvas />
          </div>
        </div>
      </section>

      {/* 3. EDUCATION & 4. SHORT PROFILE (INVENTORY) */}
      <section
        id="inventory"
        className="max-w-7xl mx-auto px-4 py-16 lg:py-24 border-t-4 border-black"
      >
        <div className="mb-10">
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            USER_INVENTORY.LOG
          </h2>
          <div className="font-mono uppercase tracking-widest text-xs mt-3">
            {'/// EDUCATION & SPECIFICATIONS'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Education */}
          <div className="lg:col-span-5 bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 rounded-none">
            <div className="font-mono uppercase tracking-widest text-xs border-b-2 border-black pb-2 mb-4 flex justify-between">
              <span>EDU_RECORD.exe</span>
              <span>[OK]</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
              Universitas Multimedia Nusantara
            </h3>
            <p className="font-serif text-lg">Informatics Graduate</p>
            <div className="mt-4 inline-block font-mono uppercase tracking-widest text-xs bg-[#FFD700] text-[#0C0C0C] px-3 py-2 border-2 border-black">
              GPA: 3.71/4.00
            </div>
          </div>

          {/* Certifications */}
          <div className="lg:col-span-4 bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 rounded-none">
            <div className="font-mono uppercase tracking-widest text-xs border-b-2 border-black pb-2 mb-4 flex justify-between">
              <span>CERTS.dll</span>
              <span>[VERIFIED]</span>
            </div>
            <ul className="space-y-3 font-serif text-lg">
              <li className="flex justify-between items-end border-b border-dashed border-black pb-2">
                <span>TOEIC</span>
                <span className="font-mono text-xs uppercase">960/990</span>
              </li>
              <li className="flex justify-between items-end border-b border-dashed border-black pb-2">
                <span>Duolingo English</span>
                <span className="font-mono text-xs uppercase">145/160</span>
              </li>
              <li className="flex justify-between items-end border-b border-dashed border-black pb-2">
                <span>Huawei HCIA-AI</span>
                <span className="font-mono text-xs uppercase">[PASS]</span>
              </li>
              <li className="flex justify-between items-end">
                <span>Data Science (DQLab)</span>
                <span className="font-mono text-xs uppercase">[PASS]</span>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="lg:col-span-3 bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 rounded-none">
            <div className="font-mono uppercase tracking-widest text-xs border-b-2 border-black pb-2 mb-4 flex justify-between">
              <span>TECH_STACK.cfg</span>
              <span>[LOADED]</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js",
                "TypeScript",
                "Prisma",
                "Supabase",
                "PostgreSQL",
                "Laravel",
                "Tailwind CSS",
                "Flutter",
                "Python",
                "AI Agents",
                "LLM Engineering",
              ].map((tech) => (
                <span
                  key={tech}
                  className="font-mono uppercase tracking-widest text-[10px] border-2 border-black px-2 py-1 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="lg:col-span-12 bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 rounded-none">
            <div className="font-mono uppercase tracking-widest text-xs border-b-2 border-black pb-2 mb-4 flex justify-between">
              <span>STATUS.mon</span>
              <span className="text-[#2945FF]">[ACTIVE]</span>
            </div>
            <p className="font-serif text-xl md:text-2xl">
              Currently operating as Lead Fullstack Engineer & AI Integrator.
              Mentored 200+ students as a Laboratory Assistant.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PROJECTS (THE REALMS) */}
      <section
        id="realms"
        className="max-w-7xl mx-auto px-4 py-16 lg:py-24 border-t-4 border-black"
      >
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            PROJECT_REALMS
          </h2>
          <div className="font-mono uppercase tracking-widest text-xs mt-3">
            {'/// SELECT A DIALOGUE BOX TO INSPECT'}
          </div>
        </div>

        <div className="space-y-10">
          {/* Project 1 */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-8 md:p-10 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 cursor-pointer rounded-none">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 border-b-2 border-black pb-4">
              <div>
                <h3 className="text-3xl md:text-5xl font-serif font-bold">
                  CHATRIGO
                </h3>
                <p className="font-mono uppercase tracking-widest text-xs mt-2 text-[#2945FF]">
                  {'SaaS & AI Orchestration // REALM_01'}
                </p>
              </div>
              <div className="font-mono uppercase tracking-widest text-xs border-2 border-black px-3 py-2 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C] whitespace-nowrap">
                PT RIGO INOVASI DIGITAL
              </div>
            </div>
            <p className="font-serif text-lg md:text-2xl leading-relaxed mb-8 max-w-4xl">
              Led the engineering architecture for a multi-tenant B2B omnichannel
              AI chatbot platform centralizing interactions across WhatsApp and
              Telegram. Engineered an anti-hallucination AI orchestrator
              featuring RAG and an AI Business Advisor. Managed and mentored the
              technical division, establishing code quality standards.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Next.js 15/16", "Prisma", "Supabase", "PostgreSQL (pgvector)"].map(
                (t) => (
                  <span
                    key={t}
                    className="font-mono uppercase tracking-widest text-xs border-2 border-black px-3 py-1 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C]"
                  >
                    [{t}]
                  </span>
                )
              )}
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-8 md:p-10 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 cursor-pointer rounded-none">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 border-b-2 border-black pb-4">
              <div>
                <h3 className="text-3xl md:text-5xl font-serif font-bold">
                  BALIKPAPAN E-GOVERNMENT SYSTEMS
                </h3>
                <p className="font-mono uppercase tracking-widest text-xs mt-2 text-[#2945FF]">
                  {'Civic Tech // REALM_02'}
                </p>
              </div>
              <div className="font-mono uppercase tracking-widest text-xs border-2 border-black px-3 py-2 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C] whitespace-nowrap">
                DISKOMINFO BALIKPAPAN
              </div>
            </div>
            <p className="font-serif text-lg md:text-2xl leading-relaxed mb-8 max-w-4xl">
              Developed enterprise-grade municipal systems to enhance public
              services. Built an automated E-Signature platform (E-Sign) with
              background queue processing deployed across city schools. Developed
              a secure personnel management dashboard (E-KGB).
            </p>
            <div className="flex flex-wrap gap-2">
              {["Laravel", "Tailwind CSS", "Queue Processing", "Flutter"].map(
                (t) => (
                  <span
                    key={t}
                    className="font-mono uppercase tracking-widest text-xs border-2 border-black px-3 py-1 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C]"
                  >
                    [{t}]
                  </span>
                )
              )}
            </div>
          </div>

          {/* Project 3 */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-8 md:p-10 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 cursor-pointer rounded-none">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 border-b-2 border-black pb-4">
              <div>
                <h3 className="text-3xl md:text-5xl font-serif font-bold">
                  INTELLIGENT TUTORING SYSTEM
                </h3>
                <p className="font-mono uppercase tracking-widest text-xs mt-2 text-[#2945FF]">
                  {'Academic/AI // REALM_03'}
                </p>
              </div>
              <div className="font-mono uppercase tracking-widest text-xs border-2 border-black px-3 py-2 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C] whitespace-nowrap">
                UMN THESIS
              </div>
            </div>
            <p className="font-serif text-lg md:text-2xl leading-relaxed mb-8 max-w-4xl">
              Undergraduate thesis engineering an adaptive tutoring system
              utilizing Octalysis-based gamification and autonomous AI agents for
              real-time feedback and adaptive support. Mentored 200+ students as
              a Laboratory Assistant.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Python", "AI Agents", "LLM Engineering"].map((t) => (
                <span
                  key={t}
                  className="font-mono uppercase tracking-widest text-xs border-2 border-black px-3 py-1 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C]"
                >
                  [{t}]
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. EXPERIENCE */}
      <section
        id="logs"
        className="max-w-7xl mx-auto px-4 py-16 lg:py-24 border-t-4 border-black"
      >
        <div className="mb-10">
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            EXPERIENCE_LOGS
          </h2>
          <div className="font-mono uppercase tracking-widest text-xs mt-3">
            {'/// EXPAND RECORDS FOR DETAILS'}
          </div>
        </div>

        <div className="space-y-4">
          {experience.map((exp, i) => (
            <details
              key={i}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] rounded-none group open:shadow-[4px_4px_0px_#0C0C0C]"
            >
              <summary className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer list-none hover:bg-[#F4F3ED] transition-colors duration-75">
                <div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold">
                    {exp.title}
                  </h3>
                  <p className="font-mono uppercase tracking-widest text-xs mt-1">
                    {exp.org}
                  </p>
                </div>
                <div className="font-mono uppercase tracking-widest text-xs border-2 border-black px-4 py-2 bg-white shadow-[2px_2px_0px_#0C0C0C] group-open:hidden">
                  [ EXPAND ]
                </div>
                <div className="font-mono uppercase tracking-widest text-xs border-2 border-black px-4 py-2 bg-[#2945FF] text-white shadow-[2px_2px_0px_#0C0C0C] hidden group-open:block">
                  [ COLLAPSE ]
                </div>
              </summary>
              <div className="border-t-2 border-black p-6 md:p-8 bg-[#F4F3ED]">
                <p className="font-serif text-lg md:text-xl leading-relaxed max-w-4xl">
                  {exp.detail}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 7. CONTACT */}
      <section
        id="contact"
        className="border-t-4 border-black bg-[#0C0C0C] text-white py-24 lg:py-32 px-4"
      >
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight">
            INITIATE_CONTACT
          </h2>
          <p className="font-serif text-xl md:text-2xl text-[#F4F3ED] max-w-2xl mx-auto leading-relaxed">
            Ready to architect scalable platforms, integrate AI systems, or
            build secure civic infrastructure?
          </p>
          <a
            href="mailto:dzaky.fatur@email.com"
            className="inline-block bg-white text-[#0C0C0C] border-4 border-white font-mono uppercase tracking-widest text-lg md:text-xl px-12 py-6 shadow-[8px_8px_0px_#2945FF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#2945FF] transition-all duration-75 rounded-none"
          >
            [ SEND_TRANSMISSION ]
          </a>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t-4 border-black bg-[#F4F3ED] py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="space-y-4">
            <div className="font-mono uppercase tracking-widest text-xs font-bold border-2 border-black px-2 py-1 bg-white shadow-[4px_4px_0px_#0C0C0C] inline-block">
              {'DZAKY_SYS // V1.0'}
            </div>
            <p className="font-serif text-xl">Dzaky Fatur Rahman</p>
            <div className="flex gap-2">
              <div className="bg-[#2945FF] text-white font-mono uppercase tracking-widest text-[10px] px-2 py-1 border-2 border-black">
                HTML5
              </div>
              <div className="bg-[#FFD700] text-[#0C0C0C] font-mono uppercase tracking-widest text-[10px] px-2 py-1 border-2 border-black">
                REACT
              </div>
              <div className="bg-[#0C0C0C] text-white font-mono uppercase tracking-widest text-[10px] px-2 py-1 border-2 border-white">
                NEXT.JS
              </div>
            </div>
          </div>

          <div className="space-y-4 md:text-right">
            <div className="font-mono uppercase tracking-widest text-xs">
              [ CONNECT ]
            </div>
            <div className="flex gap-4 md:justify-end">
              <a
                href="#"
                className="font-mono uppercase tracking-widest text-xs border-b-2 border-black hover:text-[#2945FF] transition-colors duration-75"
              >
                GITHUB
              </a>
              <a
                href="#"
                className="font-mono uppercase tracking-widest text-xs border-b-2 border-black hover:text-[#2945FF] transition-colors duration-75"
              >
                LINKEDIN
              </a>
              <a
                href="#"
                className="font-mono uppercase tracking-widest text-xs border-b-2 border-black hover:text-[#2945FF] transition-colors duration-75"
              >
                EMAIL
              </a>
            </div>
            <p className="font-mono uppercase tracking-widest text-xs border-2 border-dashed border-black p-3 inline-block max-w-xs">
              QUOTE: {randomQuote}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-4 border-t-2 border-black flex flex-col sm:flex-row justify-between items-center gap-2 font-mono uppercase tracking-widest text-[10px]">
          <span> 2026 DZAKY FATUR RAHMAN</span>
          <span>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </footer>
    </main>
  );
}
