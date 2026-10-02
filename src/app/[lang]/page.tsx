import Image from 'next/image';
import RetroCanvas from '@/components/RetroCanvas';
import ProjectSection from '@/components/ProjectSection';
import ExperienceAccordion from '@/components/ExperienceAccordion';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import GlitchText from '@/components/GlitchText';
import SiteHeader from '@/components/SiteHeader';
import SkipToContent from '@/components/SkipToContent';
import Window from '@/components/Window';
import TechStackTags from '@/components/TechStackTags';
import FooterSocial from '@/components/FooterSocial';
import CopyEmailButton from '@/components/CopyEmailButton';
import BootSequenceOverlay from '@/components/BootSequenceOverlay';
import KonamiCheatListener from '@/components/KonamiCheatListener';
import { CopyEmailProvider, PORTFOLIO_EMAIL } from '@/components/CopyEmailProvider';
import { getDictionary } from '@/lib/getDictionary';
import { konamiQuoteIndex } from '@/lib/konamiQuoteIndex';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const navLinks = [
    { href: '#profile', label: dict.nav.profile },
    { href: '#inventory', label: dict.nav.inventory },
    { href: '#realms', label: dict.nav.realms },
    { href: '#logs', label: dict.nav.logs },
    { href: '#contact', label: dict.nav.contact },
  ];

  const konamiQuote =
    dict.footer.quotes[konamiQuoteIndex(lang, dict.footer.quotes.length)] ??
    dict.footer.quotes[0];

  return (
    <CopyEmailProvider copiedMessage={dict.contact.emailCopied}>
      <BootSequenceOverlay lines={dict.boot.lines} />
      <KonamiCheatListener
        content={{
          title: dict.easterEgg.konamiTitle,
          subtitle: dict.easterEgg.konamiSubtitle,
          dismissHint: dict.easterEgg.konamiDismiss,
          quote: konamiQuote,
        }}
      />
      <SkipToContent label={dict.nav.skipToContent} targetId="profile" />
      <SiteHeader
        navLinks={navLinks}
        currentLang={lang}
        menuOpen={dict.nav.menuOpen}
        menuClose={dict.nav.menuClose}
        scrollBufferLabel={dict.nav.scrollBuffer}
        bsod={{
          title: dict.easterEgg.bsodTitle,
          rebootHint: dict.easterEgg.bsodReboot,
          lines: dict.easterEgg.bsodLines,
        }}
      />

      <main className="relative z-10 min-h-screen text-[#0C0C0C] font-serif selection:bg-[#2945FF] selection:text-white pointer-events-none">
      {/* 2. HERO */}
      <section
        id="profile"
        tabIndex={-1}
        className="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center overflow-x-hidden outline-none"
      >
        <div className="space-y-8">
          <h1 className="text-6xl md:text-8xl lg:text-8xl font-serif font-bold leading-[0.85] tracking-tight">
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
            className="max-w-md mx-auto lg:mr-0 lg:ml-auto animate-eject"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <Window
              title={dict.hero.profileFrameTitle}
              status={dict.hero.profileFrameStatus}
              bodyClassName="p-3"
            >
              <div className="group relative w-full aspect-square bg-[#0C0C0C] overflow-hidden border-2 border-black">
                <Image
                  src="/images/profile-pic.jpg"
                  alt="Dzaky Fatur Rahman"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 448px"
                  className="object-cover grayscale contrast-125 transition-none group-hover:grayscale-0 group-hover:contrast-100"
                />
              </div>
            </Window>
          </div>

          <div
            className="max-w-md mx-auto lg:mr-0 lg:ml-auto animate-boot"
            style={{ animationDelay: '0.45s', animationFillMode: 'both' }}
          >
            <Window
              title={dict.hero.renderViewTitle}
              status={dict.hero.renderViewStatus}
              bodyClassName="p-4"
            >
              <RetroCanvas />
            </Window>
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
            className="lg:col-span-4"
          >
            <Window
              title={dict.inventory.education.title}
              status={dict.inventory.education.status}
            >
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
            </Window>
          </AnimateOnScroll>

          {/* Certifications */}
          <AnimateOnScroll
            animation="animate-rack-in"
            delay="0.15s"
            className="lg:col-span-5"
          >
            <Window
              title={dict.inventory.certifications.title}
              status={dict.inventory.certifications.status}
            >
              <ul className="space-y-3 font-serif text-lg">
                {dict.inventory.certifications.items.map((item, index) => {
                  const isLast = index === dict.inventory.certifications.items.length - 1;
                  return (
                    <li
                      key={item.name}
                      className={`flex justify-between items-end ${isLast ? '' : 'border-b border-dashed border-black pb-2'}`}
                    >
                      <span>{item.name}</span>
                      <span className="font-mono text-xs uppercase">{item.score}</span>
                    </li>
                  );
                })}
              </ul>
            </Window>
          </AnimateOnScroll>

          {/* Tech Stack */}
          <AnimateOnScroll
            animation="animate-rack-in"
            delay="0.25s"
            className="lg:col-span-3"
          >
            <Window
              title={dict.inventory.techStack.title}
              status={dict.inventory.techStack.status}
            >
              <TechStackTags
                tags={dict.inventory.techStack.tags}
                showMoreLabel={dict.inventory.techStack.showMore}
              />
            </Window>
          </AnimateOnScroll>

          {/* Status */}
          <AnimateOnScroll
            animation="animate-rack-in"
            delay="0.35s"
            className="lg:col-span-12"
          >
            <Window
              title={dict.inventory.status.title}
              status={dict.inventory.status.active}
              statusAccent
            >
              <p data-packet className="font-serif text-xl md:text-2xl">
                {dict.inventory.status.text}
              </p>
            </Window>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 5. PROJECTS (THE REALMS) */}
      <ProjectSection
        title={dict.projects.title}
        clickPrompt={dict.projects.clickPrompt}
        openViewer={dict.projects.openViewer}
        imagesLabel={dict.projects.imagesLabel}
        noImages={dict.projects.noImages}
        moreRealms={dict.projects.moreRealms}
        lessRealms={dict.projects.lessRealms}
        modalTitlePrefix={dict.projects.modalTitlePrefix}
        viewerEmpty={dict.projects.viewerEmpty}
        modalCloseAria={dict.projects.modalCloseAria}
        modalPrevAria={dict.projects.modalPrevAria}
        modalNextAria={dict.projects.modalNextAria}
        modalDialogAria={dict.projects.modalDialogAria}
        screenshotAlt={dict.projects.screenshotAlt}
        featuredLabel={dict.projects.featuredLabel}
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
          <CopyEmailButton
            className="inline-block bg-white text-[#0C0C0C] border-4 border-white font-mono uppercase tracking-widest text-lg md:text-xl px-12 py-6 shadow-[8px_8px_0px_#2945FF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#2945FF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#2945FF] active:scale-[0.98] transition-all duration-75 rounded-none select-none pointer-events-auto retro-focus"
          >
            {dict.contact.button}
          </CopyEmailButton>
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

          <FooterSocial connectLabel={dict.footer.connect} />
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-4 border-t-2 border-black flex flex-col sm:flex-row justify-between items-center gap-2 font-mono uppercase tracking-widest text-[10px]">
          <CopyEmailButton
            className="hover:text-[#2945FF] hover:underline retro-focus pointer-events-auto"
            aria-label={dict.contact.emailCopied}
          >
            {PORTFOLIO_EMAIL}
          </CopyEmailButton>
          <span data-twitch>{dict.footer.tagline}</span>
        </div>

        <div className="max-w-7xl mx-auto mt-8 flex justify-center">
          <p className="font-mono uppercase tracking-widest text-xs border-2 border-dashed border-black p-3 text-center">
            <GlitchText
              text={dict.footer.quotes[0]}
              texts={dict.footer.quotes}
              trigger="interval"
              intervalMs={5000}
            />
          </p>
        </div>
      </footer>
      </main>
    </CopyEmailProvider>
  );
}
