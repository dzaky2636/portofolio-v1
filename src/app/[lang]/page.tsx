import RetroCanvasLoader from '@/components/RetroCanvasLoader';
import ProjectSection from '@/components/ProjectSection';
import ExperienceLogViewer from '@/components/ExperienceLogViewer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import GlitchText from '@/components/GlitchText';
import SiteHeader from '@/components/SiteHeader';
import Taskbar from '@/components/Taskbar';
import TerminalOverlay from '@/components/TerminalOverlay';
import SkipToContent from '@/components/SkipToContent';
import Window from '@/components/Window';
import WindowDragManager from '@/components/WindowDragManager';
import TechStackTags from '@/components/TechStackTags';
import FooterSocial from '@/components/FooterSocial';
import CopyEmailButton from '@/components/CopyEmailButton';
import CrtController from '@/components/CrtController';
import MusicController from '@/components/MusicController';
import ProfilePictureToggle from '@/components/ProfilePictureToggle';
import StatusPanel from '@/components/StatusPanel';
import BoarMascot from '@/components/BoarMascot';
import BootSequenceOverlay from '@/components/BootSequenceOverlay';
import KonamiCheatListener from '@/components/KonamiCheatListener';
import { CopyEmailProvider, PORTFOLIO_EMAIL } from '@/components/CopyEmailProvider';
import { getDictionary } from '@/lib/getDictionary';
import { konamiQuoteIndex } from '@/lib/konamiQuoteIndex';
import { SITE_URL } from '@/lib/site';
import type { TerminalData } from '@/lib/terminalCommands';

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

  const terminalData: TerminalData = {
    labels: dict.terminal,
    title: dict.hero.title,
    summary: dict.hero.summary,
    skills: dict.inventory.techStack.tags.slice(0, -1),
    projects: dict.projects.items.map((project) => ({
      id: project.id,
      name: project.name,
      realm: project.realm,
      url: project.liveUrl ?? project.sourceUrl,
    })),
    experience: dict.experience.items.map(({ role, company, duration }) => ({
      role,
      company,
      duration,
    })),
    contact: {
      email: PORTFOLIO_EMAIL,
      github: 'https://github.com/dzaky2636',
      linkedin: 'https://www.linkedin.com/in/dzakyfaturr/',
    },
  };

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Dzaky Fatur Rahman',
    url: `${SITE_URL}/${lang}`,
    image: `${SITE_URL}/images/profile-pic.jpg`,
    jobTitle: dict.hero.title,
    worksFor: { '@type': 'Organization', name: 'PT Rigo Inovasi Digital' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universitas Multimedia Nusantara' },
    sameAs: ['https://github.com/dzaky2636', 'https://www.linkedin.com/in/dzakyfaturr/'],
  };

  return (
    <CopyEmailProvider copiedMessage={dict.contact.emailCopied}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <BootSequenceOverlay lines={dict.boot.lines} skipHint={dict.boot.skipHint} />
      <BoarMascot content={dict.mascot} />
      <WindowDragManager resetLabel={dict.windowManager.reset} />
      <TerminalOverlay data={terminalData} cvFile={dict.hero.cvFile} />
      <CrtController />
      <MusicController />
      <Taskbar
        labels={dict.taskbar}
        navLinks={navLinks}
        cvFile={dict.hero.cvFile}
        timezoneLabel={dict.nav.systemClockTz}
      />
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
        crtLabel={dict.crt.label}
        crtAria={dict.crt.aria}
        musicLabel={dict.music.label}
        musicAria={dict.music.aria}
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
          <div className="flex flex-wrap items-stretch gap-3">
            <div
              data-boar-perch
              className="font-mono uppercase tracking-widest text-xs bg-[#0C0C0C] text-white inline-block px-3 py-2 border-2 border-white shadow-[4px_4px_0px_#2945FF] animate-stamp"
              style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
            >
              {dict.hero.title}
            </div>
            <div
              className="flex items-center gap-2 font-mono uppercase tracking-widest text-xs bg-white text-[#0C0C0C] px-3 py-2 border-2 border-black shadow-[4px_4px_0px_#2945FF] animate-stamp"
              style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
            >
              <span aria-hidden="true" className="block h-2 w-2 bg-[#2945FF] animate-led-blink" />
              {dict.hero.availability}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href={dict.hero.cvFile}
              download
              data-boar-react="cv"
              className="inline-block bg-[#FFD700] text-[#0C0C0C] border-4 border-black font-mono uppercase tracking-widest text-sm px-6 py-3 shadow-[6px_6px_0px_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 rounded-none select-none pointer-events-auto retro-focus animate-stamp"
              style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}
            >
              {dict.hero.cvLabel}
            </a>
            <CopyEmailButton
              className="inline-block bg-white text-[#0C0C0C] border-4 border-black font-mono uppercase tracking-widest text-sm px-6 py-3 shadow-[6px_6px_0px_#0C0C0C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#0C0C0C] hover:border-[#2945FF] transition-all duration-75 rounded-none select-none pointer-events-auto retro-focus animate-stamp"
              style={{ animationDelay: '0.7s', animationFillMode: 'backwards' }}
            >
              {dict.contact.button}
            </CopyEmailButton>
          </div>
          <p
            data-packet
            className="text-xl md:text-2xl font-serif leading-relaxed max-w-xl animate-drawer"
            style={{ animationDelay: '0.75s', animationFillMode: 'both' }}
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
              viewportHole
              interactive={false}
              bodyClassName="p-0 overflow-hidden"
            >
              <div className="border-2 border-black">
                <ProfilePictureToggle
                  alt="Dzaky Fatur Rahman"
                  toggleToBoarAria={dict.hero.profileToggleToBoar}
                  toggleToPhotoAria={dict.hero.profileToggleToPhoto}
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
              viewportHole
              interactive={false}
              bodyClassName="p-0 overflow-hidden"
            >
              <RetroCanvasLoader />
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
          {/* Proof numbers */}
          <AnimateOnScroll
            animation="animate-rack-in"
            delay="0s"
            className="md:col-span-2 lg:col-span-12"
          >
            <Window
              title={dict.inventory.proof.title}
              status={dict.inventory.proof.status}
              dragHint={dict.inventory.proof.dragHint}
              interactive={false}
              statusAccent
              bodyClassName="p-0"
            >
              <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 bg-[#0C0C0C]">
                {dict.inventory.proof.items.map((item) => (
                  <div key={item.label} className="flex flex-col bg-white p-4 md:p-5">
                    <dt className="order-2 mt-2 font-mono uppercase tracking-widest text-[10px] leading-snug">
                      {item.label}
                    </dt>
                    <dd className="order-1 font-serif font-bold text-5xl md:text-6xl leading-none tracking-tight">
                      {item.value}
                    </dd>
                    <dd className="order-3 mt-1 font-serif text-sm leading-snug">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </Window>
          </AnimateOnScroll>

          {/* Live site status */}
          <AnimateOnScroll
            animation="animate-rack-in"
            delay="0.02s"
            className="md:col-span-2 lg:col-span-12"
          >
            <StatusPanel labels={dict.inventory.siteStatus} />
          </AnimateOnScroll>

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
                      className={`flex justify-between items-end gap-3 ${isLast ? '' : 'border-b border-dashed border-black pb-2'}`}
                    >
                      <span className="min-w-0">{item.name}</span>
                      <span className="shrink-0 font-mono text-xs uppercase">{item.score}</span>
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
        modalMinimizeAria={dict.projects.modalMinimizeAria}
        modalRestoreAria={dict.projects.modalRestoreAria}
        modalFullscreenAria={dict.projects.modalFullscreenAria}
        modalExitFullscreenAria={dict.projects.modalExitFullscreenAria}
        modalPrevAria={dict.projects.modalPrevAria}
        modalNextAria={dict.projects.modalNextAria}
        modalDialogAria={dict.projects.modalDialogAria}
        screenshotAlt={dict.projects.screenshotAlt}
        featuredLabel={dict.projects.featuredLabel}
        stackShowMore={dict.projects.stackShowMore}
        realmFilterLabel={dict.projects.realmFilterLabel}
        realmFilterAll={dict.projects.realmFilterAll}
        realmFilterSaas={dict.projects.realmFilterSaas}
        realmFilterCivic={dict.projects.realmFilterCivic}
        realmFilterAcademic={dict.projects.realmFilterAcademic}
        realmFilterPersonal={dict.projects.realmFilterPersonal}
        realmFilterEmpty={dict.projects.realmFilterEmpty}
        liveLabel={dict.projects.liveLabel}
        sourceLabel={dict.projects.sourceLabel}
        caseStudyLabels={dict.projects.caseStudyLabels}
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

        <ExperienceLogViewer
          experiences={dict.experience.items}
          labels={dict.experience.logViewer}
        />
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
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <CopyEmailButton
              className="inline-block bg-white text-[#0C0C0C] border-4 border-white font-mono uppercase tracking-widest text-lg md:text-xl px-12 py-6 shadow-[8px_8px_0px_#2945FF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#2945FF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#2945FF] active:scale-[0.98] transition-all duration-75 rounded-none select-none pointer-events-auto retro-focus"
            >
              {dict.contact.button}
            </CopyEmailButton>
            <a
              href={dict.hero.cvFile}
              download
              data-boar-react="cv"
              className="inline-block bg-[#FFD700] text-[#0C0C0C] border-4 border-[#FFD700] font-mono uppercase tracking-widest text-lg md:text-xl px-12 py-6 shadow-[8px_8px_0px_#2945FF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#2945FF] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_#2945FF] active:scale-[0.98] transition-all duration-75 rounded-none select-none pointer-events-auto retro-focus"
            >
              {dict.hero.cvLabel}
            </a>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t-4 border-black bg-[#F4F3ED] pt-12 pb-24 lg:pt-16 lg:pb-28 px-4">
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
          <button
            type="button"
            data-terminal-open
            className="hover:text-[#2945FF] hover:underline retro-focus pointer-events-auto"
          >
            {dict.terminal.openButton}
          </button>
          <button
            type="button"
            data-crt-toggle
            aria-pressed="false"
            aria-label={dict.crt.aria}
            className="px-1 hover:text-[#2945FF] hover:underline retro-focus pointer-events-auto"
          >
            {dict.crt.label}
          </button>
          <button
            type="button"
            data-music-toggle
            aria-pressed="false"
            aria-label={dict.music.aria}
            className="px-1 hover:text-[#2945FF] hover:underline retro-focus pointer-events-auto"
          >
            {dict.music.label}
          </button>
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
