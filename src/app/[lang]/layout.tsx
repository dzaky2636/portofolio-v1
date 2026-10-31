import type { Metadata } from 'next';
import SetHtmlLang from '@/components/SetHtmlLang';
import { getDictionary, isLocale } from '@/lib/getDictionary';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${isLocale(lang) ? lang : 'en'}`,
      languages: {
        en: '/en',
        id: '/id',
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${isLocale(lang) ? lang : 'en'}`,
      siteName: "Dzaky's Corner",
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <SetHtmlLang lang={lang} />
      {children}
    </>
  );
}
