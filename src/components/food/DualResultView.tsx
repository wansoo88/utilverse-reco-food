'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { MenuRecommendResponse, FoodItem } from '@/types/recommend';
import { ShareButton } from '@/components/ui/ShareButton';
import { trackEvent } from '@/lib/analytics';

type GeoPermission = 'unknown' | 'prompt' | 'granted' | 'denied';

const RecipeLinks = dynamic(
  () => import('./RecipeLinks').then((m) => m.RecipeLinks),
  { loading: () => <div className="h-24 animate-pulse rounded-xl bg-gray-100" /> },
);

const NearbyRestaurants = dynamic(
  () => import('./NearbyRestaurants').then((m) => m.NearbyRestaurants),
  { loading: () => <div className="h-24 animate-pulse rounded-xl bg-gray-100" /> },
);

interface DualResultViewProps {
  data: MenuRecommendResponse;
  lang: string;
  onRetry?: () => void;
  onExclude?: (menuName: string) => void;
  onToggleFavorite?: (menuName: string, emoji: string) => void;
  isFavorite?: (menuName: string) => boolean;
  shareUrl?: string;
  labels?: {
    retry?: string;
    notThis?: string;
    shareCopied?: string;
    shareCopy?: string;
  };
}

export const DualResultView = ({
  data,
  lang,
  onRetry,
  onExclude,
  onToggleFavorite,
  isFavorite,
  shareUrl,
  labels,
}: DualResultViewProps) => {
  const [activeTab, setActiveTab] = useState<'cook' | 'order'>('cook');
  const [geoPermission, setGeoPermission] = useState<GeoPermission>('unknown');

  // 마운트 시 위치 권한 상태 확인
  useEffect(() => {
    if (!navigator.geolocation) { setGeoPermission('denied'); return; }
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((perm) => {
        setGeoPermission(perm.state as GeoPermission);
        perm.onchange = () => setGeoPermission(perm.state as GeoPermission);
      }).catch(() => setGeoPermission('prompt'));
    } else {
      setGeoPermission('prompt');
    }
  }, []);

  const handleRequestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => setGeoPermission('granted'),
      () => setGeoPermission('denied'),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 },
    );
  }, []);
  const menuNames = data.items.map((item) => item.name);
  const mainItem = data.items[0];

  const shareText = mainItem
    ? `오늘 AI가 추천한 메뉴: ${mainItem.name} 🍽️ — 오늘뭐먹지`
    : '오늘뭐먹지';

  return (
    <div className="space-y-3">
      {/* 위치 동의 배너 — 아직 허용 안 한 경우에만 탭 위에 표시 */}
      {(geoPermission === 'prompt' || geoPermission === 'unknown') && (
        <button
          onClick={handleRequestLocation}
          className="w-full flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <span>📍</span>
          <span className="flex-1 text-left">내 주변 맛집을 보려면 위치를 허용해 주세요</span>
          <span className="text-xs text-blue-400">허용 →</span>
        </button>
      )}
      {geoPermission === 'denied' && (
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-400">
          <span>📍</span>
          <span>위치 권한이 거부됨 — 브라우저 설정에서 허용해 주세요</span>
        </div>
      )}

      {/* 모바일: 탭 전환 */}
      <div className="flex gap-1 md:hidden">
        <button
          onClick={() => setActiveTab('cook')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
            activeTab === 'cook'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          🍳 해먹기
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
            activeTab === 'order'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          🛵 시켜먹기
        </button>
      </div>

      {/* 데스크탑: 좌우 반반 / 모바일: 탭별 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 해먹기 (좌측) */}
        <div className={`${activeTab !== 'cook' ? 'hidden md:block' : ''}`}>
          <CookSection
            items={data.items}
            tip={data.tip}
            lang={lang}
            onExclude={onExclude}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite}
          />
        </div>

        {/* 시켜먹기 (우측) */}
        <div className={`${activeTab !== 'order' ? 'hidden md:block' : ''}`}>
          <OrderSection
            items={data.items}
            tip={data.tip}
            lang={lang}
            menuNames={menuNames}
            onExclude={onExclude}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite}
          />
        </div>
      </div>

      {/* 액션 버튼 행 */}
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={() => {
              trackEvent('re_recommend_click', { lang });
              onRetry();
            }}
            className="flex-1 rounded-2xl border border-orange-200 bg-orange-50 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-100 transition-colors"
          >
            {labels?.retry ?? '🔄 다른 메뉴 추천받기'}
          </button>
        )}
        {shareUrl && mainItem && (
          <ShareButton
            text={shareText}
            url={shareUrl}
            lang={lang}
            labels={{ copied: labels?.shareCopied, copy: labels?.shareCopy ?? '공유' }}
          />
        )}
      </div>
    </div>
  );
};

// 해먹기: 메뉴 + 이유 + 레시피 링크
function CookSection({ items, tip, lang, onExclude, onToggleFavorite, isFavorite }: {
  items: FoodItem[];
  tip?: string;
  lang: string;
  onExclude?: (menuName: string) => void;
  onToggleFavorite?: (menuName: string, emoji: string) => void;
  isFavorite?: (menuName: string) => boolean;
}) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50/30 p-4 space-y-3">
      <p className="text-xs font-bold tracking-wide text-orange-600 uppercase">
        🍳 해먹기
      </p>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${
              i === 0
                ? 'border-orange-300 bg-white shadow-sm'
                : 'border-orange-100 bg-white/80'
            }`}
          >
            <span className="text-xl shrink-0">{item.emoji ?? '🍽️'}</span>
            <div className="min-w-0 flex-1">
              <p className={`font-bold text-gray-900 ${i === 0 ? 'text-sm' : 'text-xs'}`}>
                {item.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-5">{item.reason}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {i === 0 && (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
                  TOP
                </span>
              )}
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(item.name, item.emoji ?? '🍽️')}
                  className="text-base leading-none hover:scale-110 transition-transform"
                >
                  {isFavorite?.(item.name) ? '❤️' : '🤍'}
                </button>
              )}
              {onExclude && (
                <button
                  onClick={() => onExclude(item.name)}
                  className="flex items-center justify-center w-7 h-7 rounded-full text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {tip && <p className="text-xs text-center text-gray-400">💡 {tip}</p>}

      {/* 레시피 링크 (항상 표시) */}
      {items[0] && (
        <div className="rounded-xl border border-orange-100 bg-white p-3">
          <p className="text-xs font-semibold text-gray-500 mb-2">
            🔥 레시피 찾기 — {items[0].name}
          </p>
          <RecipeLinks foodName={items[0].name} lang={lang} />
        </div>
      )}
    </div>
  );
}

// 시켜먹기: 메뉴명만 + 근처 맛집
function OrderSection({ items, tip, lang, menuNames, onExclude, onToggleFavorite, isFavorite }: {
  items: FoodItem[];
  tip?: string;
  lang: string;
  menuNames: string[];
  onExclude?: (menuName: string) => void;
  onToggleFavorite?: (menuName: string, emoji: string) => void;
  isFavorite?: (menuName: string) => boolean;
}) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-4 space-y-3">
      <p className="text-xs font-bold tracking-wide text-blue-600 uppercase">
        🛵 시켜먹기
      </p>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
              i === 0
                ? 'border-blue-300 bg-white shadow-sm'
                : 'border-blue-100 bg-white/80'
            }`}
          >
            <span className="text-xl shrink-0">{item.emoji ?? '🍽️'}</span>
            <p className={`font-bold text-gray-900 flex-1 ${i === 0 ? 'text-sm' : 'text-xs'}`}>
              {item.name}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              {i === 0 && (
                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                  TOP
                </span>
              )}
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(item.name, item.emoji ?? '🍽️')}
                  className="text-base leading-none hover:scale-110 transition-transform"
                >
                  {isFavorite?.(item.name) ? '❤️' : '🤍'}
                </button>
              )}
              {onExclude && (
                <button
                  onClick={() => onExclude(item.name)}
                  className="flex items-center justify-center w-7 h-7 rounded-full text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {tip && <p className="text-xs text-center text-gray-400">💡 {tip}</p>}

      {/* 근처 맛집 */}
      <div className="rounded-xl border border-blue-100 bg-white p-3">
        <NearbyRestaurants menuNames={menuNames} lang={lang} />
      </div>
    </div>
  );
}
