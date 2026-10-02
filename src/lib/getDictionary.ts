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
  };
  hero: {
    title: string;
    summary: string;
    renderViewTitle: string;
    renderViewStatus: string;
    profileFrameTitle: string;
    profileFrameStatus: string;
  };
  inventory: {
    title: string;
    subtitle: string;
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
    modalCloseAria: string;
    modalPrevAria: string;
    modalNextAria: string;
    modalDialogAria: string;
    screenshotAlt: string;
    items: {
      id: string;
      name: string;
      realm: string;
      org: string;
      description: string;
      stack: string[];
      images: string[];
      featured?: boolean;
    }[];
  };
  experience: {
    title: string;
    subtitle: string;
    items: { role: string; company: string; duration: string; details: string }[];
  };
  contact: { title: string; description: string; button: string };
  footer: {
    builtWith: string;
    connect: string;
    tagline: string;
    badges: string[];
    quotes: string[];
  };
}

export function isLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale);
}

export async function getDictionary(lang: string): Promise<Dictionary> {
  const locale = isLocale(lang) ? lang : "en";
  return (await import(`@/dictionaries/${locale}.json`)).default as Dictionary;
}
