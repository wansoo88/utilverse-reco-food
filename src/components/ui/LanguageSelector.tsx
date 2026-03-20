'use client';
import { useRouter, usePathname } from 'next/navigation';
import { LOCALES, type Locale } from '@/config/site';
import { trackEvent } from '@/lib/analytics';

const LANG_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
};

export const LanguageSelector = ({ current }: { current: Locale }) => {
  const router = useRouter();
  const pathname = usePathname();

  const switchLang = (lang: Locale) => {
    // 현재 pathname에서 언어 세그먼트 교체
    const segments = pathname.split('/');
    segments[1] = lang;
    trackEvent('language_change', {
      from_lang: current,
      to_lang: lang,
    });
    router.push(segments.join('/'));
  };

  return (
    <div className="flex gap-1">
      {LOCALES.map((lang) => (
        <button
          key={lang}
          onClick={() => switchLang(lang)}
          className={`px-2 py-1 text-xs rounded-md transition-colors cursor-pointer ${
            current === lang
              ? 'bg-orange-500 text-white font-semibold'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {LANG_LABELS[lang]}
        </button>
      ))}
    </div>
  );
};
