'use client';
import { useRouter, usePathname } from 'next/navigation';
import { LOCALES, type Locale } from '@/config/site';
import { switchLocalePath } from '@/lib/localePath';
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
    // as-needed 라우팅: ko는 접두사 없음, 나머지는 /en, /ja, /zh
    const newPath = switchLocalePath(pathname, lang, LOCALES);
    trackEvent('language_change', { from_lang: current, to_lang: lang });
    // 언어 선택 쿠키 갱신 (1년)
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; samesite=lax`;
    router.push(newPath);
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
