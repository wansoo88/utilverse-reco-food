import type { Metadata } from 'next';
import { PRIVACY_CONTENT } from '@/lib/legalContent';
import { LOCALES, SITE_NAME, type Locale } from '@/config/site';
import { SiteFooter } from '@/components/ui/SiteFooter';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { localePath } from '@/lib/localePath';

interface Props {
  params: Promise<{ lang: string }>;
}

const getLocale = (lang: string): Locale => (
  (LOCALES as readonly string[]).includes(lang) ? (lang as Locale) : 'ko'
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocale(lang);
  const content = PRIVACY_CONTENT[locale];
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: localePath(locale, '/privacy'),
      languages: Object.fromEntries(LOCALES.map((l) => [l, localePath(l, '/privacy')])),
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  if (!(LOCALES as readonly string[]).includes(lang)) notFound();
  const locale = lang as Locale;
  const content = PRIVACY_CONTENT[locale];
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-4xl px-4 py-10">
        <section className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">{SITE_NAME}</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">{content.title}</h1>
          <p className="mt-4 text-base leading-7 text-gray-600">{content.description}</p>
        </section>
        <div className="mt-8 space-y-6">
          {content.sections.map((section) => (
            <section key={section.heading} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">{section.heading}</h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-gray-600">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter lang={locale} copyright={t('footer.copyright')} description={t('footer.description')} />
    </div>
  );
}
