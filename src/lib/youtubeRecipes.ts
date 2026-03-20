import type { Locale } from '@/config/site';
import type { FoodItem } from '@/types/recommend';

export interface YoutubeRecipeLink {
  title: string;
  url: string;
}

const SEARCH_SUFFIX: Record<Locale, string> = {
  ko: '레시피',
  en: 'recipe',
  ja: 'レシピ',
  zh: '做法',
};

export const buildYoutubeRecipeLinks = (items: FoodItem[], locale: Locale): YoutubeRecipeLink[] => {
  const suffix = SEARCH_SUFFIX[locale];

  return items.slice(0, 5).map((item) => {
    const query = encodeURIComponent(`${item.name} ${suffix}`);
    return {
      title: `${item.name} ${suffix}`,
      url: `https://www.youtube.com/results?search_query=${query}`,
    };
  });
};
