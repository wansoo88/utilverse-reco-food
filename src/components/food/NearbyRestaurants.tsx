'use client';

import { useEffect, useState, useCallback } from 'react'; // useCallback: searchRestaurants memoization
import type { NearbyRestaurant } from '@/types/recommend';
import { apiUrl } from '@/lib/basePath';

interface NearbyRestaurantsProps {
  menuNames: string[];
  lang: string;
}

type GeoStatus = 'prompt' | 'loading' | 'granted' | 'denied' | 'error' | 'searching';

const LABELS: Record<string, {
  nearby: string;
  permission: string;
  allow: string;
  skip: string;
  denied: string;
  retry: string;
  searching: string;
  empty: string;
}> = {
  ko: {
    nearby: '맛집',
    permission: '시켜먹기 맛집을 찾으려면 위치 정보가 필요해요',
    allow: '📍 위치 허용하고 맛집 찾기',
    skip: '위치 없이 검색',
    denied: '위치 권한이 거부되었어요',
    retry: '다시 시도',
    searching: '주변 맛집을 찾고 있어요...',
    empty: '검색된 맛집이 없어요',
  },
  en: {
    nearby: 'restaurants',
    permission: 'Location is needed to find nearby restaurants',
    allow: '📍 Allow location & find restaurants',
    skip: 'Search without location',
    denied: 'Location permission denied',
    retry: 'Retry',
    searching: 'Finding nearby restaurants...',
    empty: 'No restaurants found',
  },
  ja: {
    nearby: 'のお店',
    permission: '近くのお店を探すには位置情報が必要です',
    allow: '📍 位置情報を許可してお店を探す',
    skip: '位置情報なしで検索',
    denied: '位置情報の許可が拒否されました',
    retry: '再試行',
    searching: '近くのお店を探しています...',
    empty: 'お店が見つかりませんでした',
  },
  zh: {
    nearby: '餐厅',
    permission: '需要位置信息来查找附近餐厅',
    allow: '📍 允许位置并查找餐厅',
    skip: '不使用位置搜索',
    denied: '位置权限被拒绝',
    retry: '重试',
    searching: '正在搜索附近餐厅...',
    empty: '未找到餐厅',
  },
};

export const NearbyRestaurants = ({ menuNames, lang }: NearbyRestaurantsProps) => {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('loading');
  const [results, setResults] = useState<Record<string, NearbyRestaurant[]>>({});
  const labels = LABELS[lang] ?? LABELS.ko;

  // 맛집 검색 (좌표 유무 상관없이)
  const searchRestaurants = useCallback(async (lat?: number, lng?: number) => {
    if (menuNames.length === 0) return;
    setGeoStatus('searching');

    try {
      const body: Record<string, unknown> = { menuNames };
      if (lat !== undefined && lng !== undefined) {
        body.lat = lat;
        body.lng = lng;
      }

      const res = await fetch(apiUrl('/api/nearby'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json() as { results: Record<string, NearbyRestaurant[]> };
      setResults(data.results ?? {});
      setGeoStatus('granted');
    } catch {
      setGeoStatus('error');
    }
  }, [menuNames]);

  // 마운트 시 즉시 위치 요청 → 브라우저 권한 다이얼로그 자동 표시
  useEffect(() => {
    if (!navigator.geolocation) {
      // geolocation 미지원 → 위치 없이 검색
      searchRestaurants();
      return;
    }

    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        searchRestaurants(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        if (err.code === 1) {
          // 거부 → 위치 없이 검색 (결과는 보여주되 거리 정보 없음)
          searchRestaurants();
        } else {
          // timeout/기타 → 마찬가지로 위치 없이 검색
          searchRestaurants();
        }
      },
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 600000 },
    );
  // menuNames 변경 시 재검색하지 않음 (최초 1회만)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 로딩 ──
  if (geoStatus === 'loading' || geoStatus === 'searching') {
    return (
      <div className="space-y-3 py-2">
        <p className="text-xs text-center text-gray-400">{labels.searching}</p>
        {menuNames.map((name) => (
          <div key={name} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
            <div className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── 위치 거부됨 ──
  if (geoStatus === 'denied') {
    return (
      <div className="text-center py-4 space-y-2">
        <p className="text-xs text-gray-400">{labels.denied}</p>
        <p className="text-xs text-gray-400">브라우저 설정에서 위치 권한을 허용해 주세요</p>
      </div>
    );
  }

  // ── 에러 ──
  if (geoStatus === 'error') {
    return (
      <div className="text-center py-4">
        <button
          type="button"
          onClick={() => searchRestaurants()}
          className="text-xs text-blue-500 hover:text-blue-600 font-medium"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  // ── 결과 ──
  const hasResults = Object.values(results).some((arr) => arr.length > 0);

  if (!hasResults) {
    return <p className="text-xs text-center text-gray-400 py-3">{labels.empty}</p>;
  }

  return (
    <div className="space-y-4">
      {menuNames.map((menuName) => {
        const restaurants = results[menuName] ?? [];
        if (restaurants.length === 0) return null;

        return (
          <div key={menuName}>
            <p className="text-xs font-semibold text-blue-600 mb-2">
              📍 {menuName} {labels.nearby}
            </p>
            <div className="space-y-1.5">
              {restaurants.map((r, i) => (
                <a
                  key={i}
                  href={r.naverMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 transition-colors hover:border-blue-200 hover:bg-blue-50"
                >
                  <span className="text-lg shrink-0">🏪</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {r.category && <span>{r.category} · </span>}
                      {r.address}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {r.distance > 0 && (
                      <span className="text-xs font-medium text-blue-500">
                        {r.distance < 1000 ? `${r.distance}m` : `${(r.distance / 1000).toFixed(1)}km`}
                      </span>
                    )}
                    {r.telephone && (
                      <p className="text-xs text-gray-400">{r.telephone}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
