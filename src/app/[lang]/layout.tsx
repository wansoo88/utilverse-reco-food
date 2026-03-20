import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { LOCALES, type Locale } from '@/config/site';
import { notFound } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!LOCALES.includes(lang as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
