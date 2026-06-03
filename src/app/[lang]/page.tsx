import RetroCanvas from '@/components/RetroCanvas';
import ProjectSection from '@/components/ProjectSection';
import ExperienceAccordion from '@/components/ExperienceAccordion';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import GlitchText from '@/components/GlitchText';
import LanguageToggle from '@/components/LanguageToggle';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaInstagram } from 'react-icons/fa';

interface Dict {
  nav: { profile: string; inventory: string; realms: string; logs: string; contact: string };
  hero: { title: string; summary: string };
  inventory: {
    title: string;
    subtitle: string;
    education: { title: string; status: string; school: string; major: string; accreditation: string; gpa: string; thesis: string; award: string };
    certifications: { title: string; status: string };
    techStack: { title: string; status: string; tags: string[] };
    status: { title: string; active: string; text: string };
  };
  projects: {
    title: string;
    clickPrompt: string;
    openViewer: string;
    imagesLabel: string;
    items: { id: string; name: string; realm: string; org: string; description: string; stack: string[]; images: string[] }[];
  };
  experience: {
    title: string;
    subtitle: string;
    items: { role: string; company: string; duration: string; details: string }[];
  };
  contact: { title: string; description: string; button: string };
  footer: { builtWith: string; connect: string; tagline: string; badges: string[] };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict: Dict = (await import(`@/dictionaries/${lang}.json`)).default;

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

  const navLinks = [
    { href: '#profile', label: dict.nav.profile },
    { href: '#inventory', label: dict.nav.inventory },
    { href: '#realms', label: dict.nav.realms },
    { href: '#logs', label: dict.nav.logs },
    { href: '#contact', label: dict.nav.contact },
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
            {"DZAKY'S CORNER"}
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
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
            {dict.hero.title}
          </div>
          <p
            data-packet
            className="text-xl md:text-2xl font-serif leading-relaxed max-w-xl animate-drawer"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            {dict.hero.summary}
          </p>
        </div>

        <div className="space-y-8">
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
            {dict.inventory.title}
          </h2>
          <div className="font-mono uppercase tracking-widest text-xs mt-3">
            {dict.inventory.subtitle}
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
                <span>{dict.inventory.education.title}</span>
                <span>{dict.inventory.education.status}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                {dict.inventory.education.school}
              </h3>
              <p className="font-serif text-lg">{dict.inventory.education.major}</p>
              <p className="font-serif text-lg mt-1">{dict.inventory.education.accreditation}</p>
              <div className="mt-4 inline-block font-mono uppercase tracking-widest text-xs bg-[#FFD700] text-[#0C0C0C] px-3 py-2 border-2 border-black">
                {dict.inventory.education.gpa}
              </div>
              <p className="font-serif text-sm mt-3 italic">
                {dict.inventory.education.thesis}
              </p>
              <p className="font-serif text-sm mt-1">
                {dict.inventory.education.award}
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
                <span>{dict.inventory.certifications.title}</span>
                <span>{dict.inventory.certifications.status}</span>
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
                  <span>Laboratory Assistant Certification</span>
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
                <span>{dict.inventory.techStack.title}</span>
                <span>{dict.inventory.techStack.status}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {dict.inventory.techStack.tags.map((tech) => (
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
                <span>{dict.inventory.status.title}</span>
                <span className="text-[#2945FF]">{dict.inventory.status.active}</span>
              </div>
              <p data-packet className="font-serif text-xl md:text-2xl">
                {dict.inventory.status.text}
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 5. PROJECTS (THE REALMS) */}
      <ProjectSection
        title={dict.projects.title}
        clickPrompt={dict.projects.clickPrompt}
        openViewer={dict.projects.openViewer}
        imagesLabel={dict.projects.imagesLabel}
        projects={dict.projects.items}
      />

      {/* 6. EXPERIENCE */}
      <section
        id="logs"
        className="max-w-7xl mx-auto px-4 py-16 lg:py-24 border-t-4 border-black"
      >
        <div className="mb-10">
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            {dict.experience.title}
          </h2>
          <div className="font-mono uppercase tracking-widest text-xs mt-3">
            {dict.experience.subtitle}
          </div>
        </div>

        <ExperienceAccordion experiences={dict.experience.items} />
      </section>

      {/* 7. CONTACT */}
      <section
        id="contact"
        className="border-t-4 border-black bg-[#0C0C0C] text-white py-24 lg:py-32 px-4"
      >
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight animate-siren">
            {dict.contact.title}
          </h2>
          <p
            data-packet
            className="font-serif text-xl md:text-2xl text-[#F4F3ED] max-w-2xl mx-auto leading-relaxed"
          >
            {dict.contact.description}
          </p>
          <a
            href="mailto:dzaky2636@gmail.com"
            className="inline-block bg-white text-[#0C0C0C] border-4 border-white font-mono uppercase tracking-widest text-lg md:text-xl px-12 py-6 shadow-[8px_8px_0px_#2945FF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#2945FF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#2945FF] active:scale-[0.98] transition-all duration-75 rounded-none select-none pointer-events-auto"
          >
            {dict.contact.button}
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
              {"DZAKY'S CORNER"}
            </div>
            <p className="font-serif text-xl">{dict.footer.builtWith}</p>
            <div className="flex gap-2">
              <div
                className="bg-[#2945FF] text-white font-mono uppercase tracking-widest text-[10px] px-2 py-1 border-2 border-black animate-led-blink"
                style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
              >
                {dict.footer.badges[0]}
              </div>
              <div
                className="bg-[#FFD700] text-[#0C0C0C] font-mono uppercase tracking-widest text-[10px] px-2 py-1 border-2 border-black animate-led-blink"
                style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
              >
                {dict.footer.badges[1]}
              </div>
              <div
                className="bg-[#0C0C0C] text-white font-mono uppercase tracking-widest text-[10px] px-2 py-1 border-2 border-white animate-led-blink"
                style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
              >
                {dict.footer.badges[2]}
              </div>
            </div>
          </div>

          <div className="space-y-4 md:text-right">
            <div className="font-mono uppercase tracking-widest text-xs">
              {dict.footer.connect}
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
          <span data-twitch>{dict.footer.tagline}</span>
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
