import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { LOCALES, type Locale } from '@/config/site';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    for (const keyword of SEO_KEYWORDS) {
      params.push({ lang: locale, slug: keyword.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const keyword = SEO_KEYWORDS.find((k) => k.slug === slug);
  if (!keyword) return {};

  const locale = (LOCALES as readonly string[]).includes(lang) ? (lang as Locale) : 'ko';
  const meta = keyword[locale];

  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function MenuSlugPage({ params }: Props) {
  const { lang, slug } = await params;
  const keyword = SEO_KEYWORDS.find((k) => k.slug === slug);

  if (!keyword) notFound();

  const locale = (LOCALES as readonly string[]).includes(lang) ? (lang as Locale) : 'ko';
  const meta = keyword[locale];

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">{meta.title}</h1>
      <p className="mt-4 text-gray-600">{meta.description}</p>
    </main>
  );
}
