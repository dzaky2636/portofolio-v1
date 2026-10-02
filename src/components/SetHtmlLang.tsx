'use client';

import { useEffect } from 'react';
import { isLocale, type Locale } from '@/lib/getDictionary';

export default function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const locale: Locale = isLocale(lang) ? lang : 'en';
    document.documentElement.lang = locale;
  }, [lang]);

  return null;
}
