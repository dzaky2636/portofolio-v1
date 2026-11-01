import type { TaskbarLabels } from "@/components/Taskbar";
import type { CaseStudy, CaseStudyLabels } from "@/lib/caseStudy";
import type { TerminalLabels } from "@/lib/terminalCommands";

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];

export interface Dictionary {
  meta: { title: string; description: string };
  nav: {
    profile: string;
    inventory: string;
    realms: string;
    logs: string;
    contact: string;
    menuOpen: string;
    menuClose: string;
    skipToContent: string;
    scrollBuffer: string;
    systemClockTz: string;
  };
  hero: {
    title: string;
    availability: string;
    summary: string;
    renderViewTitle: string;
    renderViewStatus: string;
    profileFrameTitle: string;
    profileFrameStatus: string;
    profileToggleToBoar: string;
    profileToggleToPhoto: string;
    cvLabel: string;
    cvFile: string;
  };
  inventory: {
    title: string;
    subtitle: string;
    proof: {
      title: string;
      status: string;
      dragHint: string;
      items: { value: string; label: string; detail: string }[];
    };
    siteStatus: {
      title: string;
      checking: string;
      summary: string;
      online: string;
      degraded: string;
      offline: string;
      lastPing: string;
      unavailable: string;
    };
    education: {
      title: string;
      status: string;
      school: string;
      major: string;
      accreditation: string;
      gpa: string;
      thesis: string;
      award: string;
    };
    certifications: {
      title: string;
      status: string;
      items: { name: string; score: string }[];
    };
    techStack: { title: string; status: string; tags: string[]; showMore: string };
    status: { title: string; active: string; text: string };
  };
  projects: {
    title: string;
    clickPrompt: string;
    openViewer: string;
    imagesLabel: string;
    noImages: string;
    viewerEmpty: string;
    modalTitlePrefix: string;
    moreRealms: string;
    lessRealms: string;
    featuredLabel: string;
    stackShowMore: string;
    realmFilterLabel: string;
    realmFilterAll: string;
    realmFilterSaas: string;
    realmFilterCivic: string;
    realmFilterAcademic: string;
    realmFilterPersonal: string;
    realmFilterEmpty: string;
    modalCloseAria: string;
    modalMinimizeAria: string;
    modalRestoreAria: string;
    modalFullscreenAria: string;
    modalExitFullscreenAria: string;
    modalPrevAria: string;
    modalNextAria: string;
    modalDialogAria: string;
    screenshotAlt: string;
    liveLabel: string;
    sourceLabel: string;
    caseStudyLabels: CaseStudyLabels;
    items: {
      id: string;
      name: string;
      realm: string;
      org: string;
      description: string;
      stack: string[];
      images: string[];
      featured?: boolean;
      liveUrl?: string;
      sourceUrl?: string;
      liveLabel?: string;
      metrics?: string[];
      caseStudy?: CaseStudy;
    }[];
  };
  experience: {
    title: string;
    subtitle: string;
    logViewer: {
      windowTitle: string;
      windowStatus: string;
      detailTitle: string;
      listLabel: string;
      emptyHint: string;
    };
    items: { role: string; company: string; duration: string; details: string }[];
  };
  contact: { title: string; description: string; button: string; emailCopied: string };
  boot: { lines: string[]; skipHint: string };
  windowManager: { reset: string };
  taskbar: TaskbarLabels;
  crt: { label: string; aria: string };
  music: { label: string; aria: string };
  terminal: TerminalLabels;
  mascot: {
    click: string[];
    rage: string;
    reactions: { email: string; cv: string; live: string; cousin: string };
    statLine: string;
    feedButton: string;
    fed: string;
    notHungry: string;
    levelUp: string;
  };
  footer: {
    builtWith: string;
    connect: string;
    tagline: string;
    badges: string[];
    quotes: string[];
  };
  easterEgg: {
    bsodTitle: string;
    bsodReboot: string;
    bsodLines: string[];
    konamiTitle: string;
    konamiSubtitle: string;
    konamiDismiss: string;
  };
}

export function isLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale);
}

export async function getDictionary(lang: string): Promise<Dictionary> {
  const locale = isLocale(lang) ? lang : "en";
  return (await import(`@/dictionaries/${locale}.json`)).default as Dictionary;
}
