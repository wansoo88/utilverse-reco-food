'use client';
import { useState, useEffect, useCallback } from 'react';
import { FOOD_TRIVIA } from '@/data/foodTrivia';
import { COOK_MENUS, ORDER_MENUS } from '@/data/localMenus';
import { trackEvent } from '@/lib/analytics';

interface RateLimitContentProps {
  onMenuClick: (menuName: string) => void;
  lang?: string;
}

type ContentType = 'trivia' | 'popular';

export const RateLimitContent = ({ onMenuClick, lang = 'ko' }: RateLimitContentProps) => {
  const [contentType, setContentType] = useState<ContentType>('trivia');
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [popularMenus, setPopularMenus] = useState<typeof COOK_MENUS>([]);

  // 랜덤 퀴즈 인덱스 초기화
  useEffect(() => {
    setTriviaIdx(Math.floor(Math.random() * FOOD_TRIVIA.length));
    const allMenus = [...COOK_MENUS, ...ORDER_MENUS];
    const shuffled = [...allMenus].sort(() => Math.random() - 0.5).slice(0, 5);
    setPopularMenus(shuffled);
  }, []);

  // 5초마다 콘텐츠 로테이션
  useEffect(() => {
    const interval = setInterval(() => {
      setContentType((prev) => (prev === 'trivia' ? 'popular' : 'trivia'));
      setRevealed(false);
      setTriviaIdx(Math.floor(Math.random() * FOOD_TRIVIA.length));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const trivia = FOOD_TRIVIA[triviaIdx];

  const handleMenuClick = useCallback((name: string) => {
    trackEvent('rate_limit_menu_click', { lang, menu: name });
    onMenuClick(name);
  }, [lang, onMenuClick]);

  const handleReveal = () => {
    setRevealed(true);
    trackEvent('trivia_answer_click', { lang });
  };

  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 space-y-3">
      <p className="text-xs font-semibold text-amber-700">
        🕐 잠시 기다리는 동안...
      </p>

      {contentType === 'trivia' && trivia ? (
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-2xl">{trivia.emoji}</span>
            <p className="text-sm font-medium text-gray-800">{trivia.question}</p>
          </div>
          {revealed ? (
            <div className="rounded-xl bg-white border border-amber-200 px-3 py-2 text-sm text-gray-700">
              {trivia.answer}
            </div>
          ) : (
            <button
              onClick={handleReveal}
              className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
            >
              탭하여 정답 보기 👆
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">이런 건 어때요? 클릭하면 바로 검색돼요</p>
          <div className="flex flex-wrap gap-2">
            {popularMenus.map((menu) => (
              <button
                key={menu.name}
                onClick={() => handleMenuClick(menu.name)}
                className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                {menu.emoji ?? '🍽️'} {menu.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 탭 전환 인디케이터 */}
      <div className="flex justify-center gap-1">
        {(['trivia', 'popular'] as ContentType[]).map((type) => (
          <button
            key={type}
            onClick={() => { setContentType(type); setRevealed(false); }}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              contentType === type ? 'bg-amber-500' : 'bg-amber-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
