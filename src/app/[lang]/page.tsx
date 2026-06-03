import RetroCanvas from '@/components/RetroCanvas';
import ProjectSection from '@/components/ProjectSection';
import ExperienceAccordion from '@/components/ExperienceAccordion';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import GlitchText from '@/components/GlitchText';
import LanguageToggle from '@/components/LanguageToggle';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaInstagram } from 'react-icons/fa';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const quotes = [
    "WHEN CODING SUCKS, I WANT TO BE AN ANIMAL INSTEAD",
    "youtu.be/iik25wqIuFo?si=InD3NtRqOl4Y8sMr",
    ".-.- - . -... .-.- .-.. ..-- -... .-.. ..--",
    "WHAT DO YOU CALL A 7 THAT HAS A FLU?",
    "I HAVE TWO MICROSOFT OUTLOOKS AND NEITHER ONE OF THOSE ARE WORKING",
    "WHAT IS THIS? ..DIORITE?",
    "BUFFALO BUFFALO BUFFALO BUFFALO BUFFALO BUFFALO BUFFALO BUFFALO",
    "SCIENCE COMPELS US TO EXPLODE THE SUN",
    "WE MAY NOT HAVE MUCH IN COMMON, YOU AND I. STILL, I CONSIDER YOU AS A FRIEND",
    "THIS SONG IS NEW TO ME, BUT I AM HONORED TO BE PART OF IT",
    "OF ALL THE LIFE FORMS THAT WILL PERISH IN THE ONCOMING DEATH OF THE UNIVERSE, WE WILL MISS THE ANGLERFISH THE LEAST",
    "I LOVE THE WORLD AND EVERYTHING IN IT",
    "IF EVERY PORKCHOP WERE PERFECT, WE WOULDN'T HAVE HOTDOGS",
    "I JUST TURNED ALL MY FINGERS INTO CATS!",
    "WHAT AN INCREDIBLE POWER -- THE ABILITY TO.. GROW UP"
  ];

  const experience = [
    {
      role: "Chief Technology Officer (CTO) & Lead Fullstack Engineer",
      company: "PT Rigo Inovasi Digital",
      duration: "2026 — NOW",
      details:
        "Lead the technological vision and engineering architecture for a comprehensive omnichannel AI chatbot SaaS platform, centralizing customer interactions across WhatsApp, Telegram, and social commerce. Manage and mentor the technical division (including full-stack developer interns), establishing code quality standards, SDLC guidelines, and remote engineering operational efficiency.",
    },
    {
      role: "Fullstack Web & Mobile Developer",
      company: "Diskominfo Balikpapan",
      duration: "2025",
      details:
        "Designed and developed Flutter-based web and mobile applications to enhance public services in communications and informatics for the citizens of Balikpapan. Implemented new features and resolved system bugs to ensure optimal performance, maintainability, and a seamless user experience.",
    },
    {
      role: "Website Coordinator",
      company: "UNITY UMN",
      duration: "2025",
      details:
        "Spearheaded the development and maintenance of the UNITY UMN English competition website, ensuring content accuracy and optimal functionality. Coordinated with cross-functional teams to integrate organizational requirements into the system, such as event registration and content publication pipelines.",
    },
    {
      role: "Laboratory Assistant",
      company: "UMN Informatics",
      duration: "2022 — 2026",
      details:
        "Instructed courses including Machine Learning, Algorithms & Data Structures, Web Programming, and Introduction to Internet Technology. Developed comprehensive examination materials utilized for official university assessments. Evaluated and mentored approximately 200+ students across various laboratory sessions.",
    },
    {
      role: "Teaching Assistant",
      company: "Boarding School Multimedia Training Program (UMN x LPDP)",
      duration: "2023",
      details:
        "Selected by university faculty to instruct 25 boarding school students on building dynamic and responsive websites. Developed and managed daily course materials focused on modern Web Development principles.",
    },
    {
      role: "Web Developer Intern",
      company: "Department of Land and Spatial Planning, Balikpapan",
      duration: "2021",
      details:
        "Completed a three-month internship focusing on web application maintenance and infrastructure. Utilized PHP, HTML, and SQL to support fundamental data operations and UI/UX design updates.",
    },
  ];

  return (
    <main className="relative z-10 min-h-screen text-[#0C0C0C] font-serif selection:bg-[#2945FF] selection:text-white pointer-events-none">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 bg-[#F4F3ED] border-b-4 border-black pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div
            data-twitch
            className="font-mono uppercase tracking-widest text-xs font-bold border-2 border-black px-2 py-1 bg-white shadow-[4px_4px_0px_#0C0C0C] animate-flicker"
          >
            {'DZAKY\'S CORNER'}
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: '#profile', label: '[PROFILE]' },
              { href: '#inventory', label: '[INVENTORY]' },
              { href: '#realms', label: '[REALMS]' },
              { href: '#logs', label: '[LOGS]' },
              { href: '#contact', label: '[TRANSMIT]' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative font-mono uppercase tracking-widest text-xs hover:text-[#2945FF] transition-colors duration-75 hover-jam pointer-events-auto"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pointer-events-auto">
            <LanguageToggle currentLang={lang} />
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
            <span className="block animate-hydraulic" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
              DZAKY
            </span>
            <span className="block animate-hydraulic" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              FATUR
            </span>
            <span className="block animate-hydraulic" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
              RAHMAN
            </span>
          </h1>
          <div
            className="font-mono uppercase tracking-widest text-xs bg-[#0C0C0C] text-white inline-block px-3 py-2 border-2 border-white shadow-[4px_4px_0px_#2945FF] animate-stamp"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            Fullstack Engineer & AI Builder
          </div>
          <p
            data-packet
            className="text-xl md:text-2xl font-serif leading-relaxed max-w-xl animate-drawer"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            Recent Informatics graduate who loves building full-stack apps, playing around with AI/ML, and designing solid web architecture. Been leading teams, shipping features from scratch, and figuring out tech directions for a while now. This portofolio is a work in progress.
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Picture Container */}
          <div
            className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-3 max-w-md mx-auto lg:mr-0 lg:ml-auto animate-eject pointer-events-auto"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <div className="w-full aspect-square bg-[#0C0C0C] overflow-hidden">
                <img
                  src="/images/profile-pic.jpg"
                  alt="Dzaky Fatur Rahman"
                  className="w-full h-full object-cover"
                />
              </div>
          </div>

          {/* 3D Canvas */}
          <div
            className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-4 max-w-md mx-auto lg:mr-0 lg:ml-auto animate-boot"
            style={{ animationDelay: '0.45s', animationFillMode: 'both' }}
          >
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
            SHORT PROFILE
          </h2>
          <div className="font-mono uppercase tracking-widest text-xs mt-3">
            {'/// EDUCATION & SPECIFICATIONS'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Education */}
          <AnimateOnScroll
            animation="animate-rack-in"
            delay="0.05s"
            className="lg:col-span-5"
          >
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] hover:scale-y-[0.98] active:scale-y-[0.96] transition-all duration-75 rounded-none pointer-events-auto">
              <div className="font-mono uppercase tracking-widest text-xs border-b-2 border-black pb-2 mb-4 flex justify-between">
                <span>EDUCATION RECORD</span>
                <span>[OK]</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                Universitas Multimedia Nusantara
              </h3>
              <p className="font-serif text-lg">Informatics major</p>
              <p className="font-serif text-lg mt-1">Grade A accredited program</p>
              <div className="mt-4 inline-block font-mono uppercase tracking-widest text-xs bg-[#FFD700] text-[#0C0C0C] px-3 py-2 border-2 border-black">
                GPA: 3.71/4.00
              </div>
              <p className="font-serif text-sm mt-3 italic">
                Thesis: built an AI tutoring system with gamification that adapts to how you learn
              </p>
              <p className="font-serif text-sm mt-1">
                Award: Merit scholarship for ranking in the top 20% GPA of my batch
              </p>
            </div>
          </AnimateOnScroll>

          {/* Certifications */}
          <AnimateOnScroll
            animation="animate-rack-in"
            delay="0.15s"
            className="lg:col-span-4"
          >
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] hover:scale-y-[0.98] active:scale-y-[0.96] transition-all duration-75 rounded-none pointer-events-auto">
              <div className="font-mono uppercase tracking-widest text-xs border-b-2 border-black pb-2 mb-4 flex justify-between">
                <span>CERTIFICATIONS</span>
                <span>[VERIFIED]</span>
              </div>
              <ul className="space-y-3 font-serif text-lg">
                <li className="flex justify-between items-end border-b border-dashed border-black pb-2">
                  <span>TOEIC</span>
                  <span className="font-mono text-xs uppercase">960/990</span>
                </li>
                <li className="flex justify-between items-end border-b border-dashed border-black pb-2">
                  <span>Duolingo English Test</span>
                  <span className="font-mono text-xs uppercase">145/160</span>
                </li>
                <li className="flex justify-between items-end border-b border-dashed border-black pb-2">
                  <span>Huawei HCIA-AI</span>
                  <span className="font-mono text-xs uppercase">[PASS]</span>
                </li>
                <li className="flex justify-between items-end border-b border-dashed border-black pb-2">
                  <span>Python Intermediate Course</span>
                  <span className="font-mono text-xs uppercase">[PASS]</span>
                </li>
                <li className="flex justify-between items-end border-b border-dashed border-black pb-2">
                  <span>Laboratory Assistant Certification</span>
                  <span className="font-mono text-xs uppercase">[PASS]</span>
                </li>
                <li className="flex justify-between items-end border-b border-dashed border-black pb-2">
                  <span>UTOPIA Speech</span>
                  <span className="font-mono text-xs uppercase">[PASS]</span>
                </li>
                <li className="flex justify-between items-end">
                  <span>Data Science Fundamentals (DQLab)</span>
                  <span className="font-mono text-xs uppercase">[PASS]</span>
                </li>
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Tech Stack */}
          <AnimateOnScroll
            animation="animate-rack-in"
            delay="0.25s"
            className="lg:col-span-3"
          >
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] hover:scale-y-[0.98] active:scale-y-[0.96] transition-all duration-75 rounded-none pointer-events-auto">
              <div className="font-mono uppercase tracking-widest text-xs border-b-2 border-black pb-2 mb-4 flex justify-between">
                <span>MY TECH STACKS</span>
                <span>[LOADED]</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Next.js 15",
                  "React 19",
                  "TypeScript",
                  "HTML",
                  "JavaScript",
                  "CSS",
                  "Tailwind CSS",
                  "Bootstrap",
                  "Jetpack Compose",
                  "Figma",
                  "Laravel",
                  "Kotlin",
                  "Node.js",
                  "Express",
                  "Python",
                  "Django",
                  "Flask",
                  "Java",
                  "C/C++",
                  "PostgreSQL",
                  "Prisma ORM",
                  "Supabase",
                  "LLM Engineering",
                  "Prompt Engineering",
                  "RAG",
                  "OpenRouter API",
                  "Jira",
                  "Git & GitHub",
                  "Leadership"
                ].map((tech) => (
                  <span
                    key={tech}
                    className="relative font-mono uppercase tracking-widest text-[10px] border-2 border-black px-2 py-1 bg-[#F4F3ED] shadow-[2px_2px_0px_#0C0C0C] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] active:translate-y-[3px] active:shadow-[0px_0px_0px_#0C0C0C] transition-all duration-75 cursor-default select-none"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Status */}
          <AnimateOnScroll
            animation="animate-rack-in"
            delay="0.35s"
            className="lg:col-span-12"
          >
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#0C0C0C] p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#0C0C0C] hover:border-[#2945FF] hover:scale-y-[0.98] active:scale-y-[0.96] transition-all duration-75 rounded-none pointer-events-auto">
              <div className="font-mono uppercase tracking-widest text-xs border-b-2 border-black pb-2 mb-4 flex justify-between">
                <span>CURRENT BUSY-NESS</span>
                <span className="text-[#2945FF]">[ACTIVE]</span>
              </div>
              <p data-packet className="font-serif text-xl md:text-2xl">
                Currently CTO & Lead Fullstack Engineer at PT Rigo Inovasi Digital. UMN Alumni (GPA 3.71/4.00).
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 5. PROJECTS (THE REALMS) */}
      <ProjectSection />

      {/* 6. EXPERIENCE */}
      <section
        id="logs"
        className="max-w-7xl mx-auto px-4 py-16 lg:py-24 border-t-4 border-black"
      >
        <div className="mb-10">
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            EXPERIENCE
          </h2>
          <div className="font-mono uppercase tracking-widest text-xs mt-3">
            {'/// CLICK ON EACH FOR DETAILS'}
          </div>
        </div>

        <ExperienceAccordion experiences={experience} />
      </section>

      {/* 7. CONTACT */}
      <section
        id="contact"
        className="border-t-4 border-black bg-[#0C0C0C] text-white py-24 lg:py-32 px-4"
      >
        <div className="max-w-4xl mx-auto text-center space-y-10">
          {/* <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight animate-siren">
            CONTACT
          </h2> */}
          <p
            data-packet
            className="font-serif text-xl md:text-2xl text-[#F4F3ED] max-w-2xl mx-auto leading-relaxed"
          >
            Want to collaborate? Click on the button below or contact me on my socials, they are on the bottom right.
          </p>
          <a
            href="mailto:dzaky2636@gmail.com"
            className="inline-block bg-white text-[#0C0C0C] border-4 border-white font-mono uppercase tracking-widest text-lg md:text-xl px-12 py-6 shadow-[8px_8px_0px_#2945FF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#2945FF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#2945FF] active:scale-[0.98] transition-all duration-75 rounded-none select-none pointer-events-auto"
          >
            [ SEND EMAIL ]
          </a>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t-4 border-black bg-[#F4F3ED] py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="space-y-4">
            <div
              data-twitch
              className="font-mono uppercase tracking-widest text-xs font-bold border-2 border-black px-2 py-1 bg-white shadow-[4px_4px_0px_#0C0C0C] inline-block"
            >
              {'DZAKY\'S CORNER'}
            </div>
            <p className="font-serif text-xl">Built With:</p>
            <div className="flex gap-2">
              <div
                className="bg-[#2945FF] text-white font-mono uppercase tracking-widest text-[10px] px-2 py-1 border-2 border-black animate-led-blink"
                style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
              >
                NEXTJS
              </div>
              <div
                className="bg-[#FFD700] text-[#0C0C0C] font-mono uppercase tracking-widest text-[10px] px-2 py-1 border-2 border-black animate-led-blink"
                style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
              >
                A LOT OF ANIMATIONS
              </div>
              <div
                className="bg-[#0C0C0C] text-white font-mono uppercase tracking-widest text-[10px] px-2 py-1 border-2 border-white animate-led-blink"
                style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
              >
                UHHH.. AND LOVE
              </div>
            </div>
          </div>

          <div className="space-y-4 md:text-right">
            <div className="font-mono uppercase tracking-widest text-xs">
              [ CONNECT ]
            </div>
            <div className="flex gap-3 md:justify-end">
              <a
                href="https://github.com/dzaky2636"
                aria-label="GitHub"
                className="bg-white border-2 border-black shadow-[4px_4px_0px_#0C0C0C] p-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] hover:border-[#2945FF] hover:text-[#2945FF] transition-all duration-75 pointer-events-auto"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/dzakyfaturr/"
                aria-label="LinkedIn"
                className="bg-white border-2 border-black shadow-[4px_4px_0px_#0C0C0C] p-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] hover:border-[#2945FF] hover:text-[#2945FF] transition-all duration-75 pointer-events-auto"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:dzaky2636@gmail.com"
                aria-label="Email"
                className="bg-white border-2 border-black shadow-[4px_4px_0px_#0C0C0C] p-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] hover:border-[#2945FF] hover:text-[#2945FF] transition-all duration-75 pointer-events-auto"
              >
                <FaEnvelope className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/6281377752644"
                aria-label="WhatsApp"
                className="bg-white border-2 border-black shadow-[4px_4px_0px_#0C0C0C] p-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] hover:border-[#2945FF] hover:text-[#2945FF] transition-all duration-75 pointer-events-auto"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/dzakyfaturr"
                aria-label="Instagram"
                className="bg-white border-2 border-black shadow-[4px_4px_0px_#0C0C0C] p-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_#0C0C0C] hover:border-[#2945FF] hover:text-[#2945FF] transition-all duration-75 pointer-events-auto"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-4 border-t-2 border-black flex flex-col sm:flex-row justify-between items-center gap-2 font-mono uppercase tracking-widest text-[10px]">
          <span> dzaky2636@gmail.com</span>
          <span data-twitch>PORTOFOLIO V1</span>
        </div>

        <div className="max-w-7xl mx-auto mt-8 flex justify-center">
          <p className="font-mono uppercase tracking-widest text-xs border-2 border-dashed border-black p-3 text-center">
            <GlitchText
              text={quotes[0]}
              texts={quotes}
              trigger="interval"
              intervalMs={5000}
            />
          </p>
        </div>
      </footer>
    </main>
  );
}
