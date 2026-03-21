'use client';

import { useEffect, useState } from 'react';
import type { RecipeItem } from '@/app/api/recipes/route';

interface RecipeSuggestionsProps {
  foodName: string;
  lang: string;
  labelRecipe: string;
  labelYoutube: string;
  labelLoading: string;
}

export const RecipeSuggestions = ({
  foodName,
  lang,
  labelRecipe,
  labelYoutube,
  labelLoading,
}: RecipeSuggestionsProps) => {
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!foodName) return;
    setLoading(true);
    setRecipes([]);

    fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodName, lang }),
    })
      .then((r) => r.json())
      .then((json: { recipes: RecipeItem[] }) => {
        setRecipes(json.recipes ?? []);
      })
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, [foodName, lang]);

  if (loading) {
    return (
      <div className="mt-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-xl bg-gray-100" />
        ))}
        <p className="text-center text-xs text-gray-400">{labelLoading}</p>
      </div>
    );
  }

  if (!recipes.length) return null;

  return (
    <div className="mt-4 space-y-2">
      {recipes.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm transition-colors hover:border-orange-200 hover:bg-orange-50"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">
              {item.platform === 'youtube' ? '▶️' : '📖'}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-gray-800 truncate">{item.title}</p>
              <p className="text-xs text-gray-400 truncate">{item.creator}</p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
              item.platform === 'youtube'
                ? 'bg-red-100 text-red-600'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {item.platform === 'youtube' ? labelYoutube : labelRecipe}
          </span>
        </a>
      ))}
    </div>
  );
};
