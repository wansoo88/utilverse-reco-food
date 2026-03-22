'use client';

import { useEffect, useState, useCallback } from 'react';
import type { NearbyRestaurant } from '@/types/recommend';

interface NearbyRestaurantsProps {
  menuNames: string[];
  lang: string;
}

type GeoStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error';

export const NearbyRestaurants = ({ menuNames, lang }: NearbyRestaurantsProps) => {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [results, setResults] = useState<Record<string, NearbyRestaurant[]>>({});
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const labels = LABELS[lang] ?? LABELS.ko;

  // 위치 권한 요청 + 검색
  const requestAndSearch = useCallback(async () => {
    if (menuNames.length === 0) return;

    setGeoStatus('loading');
    setLoading(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5분 캐시
        });
      });

      const { latitude: lat, longitude: lng } = position.coords;
      setCoords({ lat, lng });
      setGeoStatus('granted');

      const res = await fetch('/api/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuNames, lat, lng }),
      });

      const data = await res.json() as { results: Record<string, NearbyRestaurant[]> };
      setResults(data.results ?? {});
    } catch (err) {
      if (err instanceof GeolocationPositionError && err.code === 1) {
        setGeoStatus('denied');
        // 위치 없이도 검색 시도
        try {
          const res = await fetch('/api/nearby', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ menuNames }),
          });
          const data = await res.json() as { results: Record<string, NearbyRestaurant[]> };
          setResults(data.results ?? {});
        } catch {
          setGeoStatus('error');
        }
      } else {
        setGeoStatus('error');
      }
    } finally {
      setLoading(false);
    }
  }, [menuNames]);

  useEffect(() => {
    if (menuNames.length > 0) {
      requestAndSearch();
    }
  }, [menuNames, requestAndSearch]);

  if (loading) {
    return (
      <div className="space-y-3">
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

  const hasResults = Object.values(results).some((arr) => arr.length > 0);

  if (!hasResults && geoStatus === 'denied') {
    return (
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">{labels.permission}</p>
        <button
          onClick={requestAndSearch}
          className="mt-2 text-xs text-orange-500 hover:text-orange-600 font-medium"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  if (!hasResults) return null;

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

const LABELS: Record<string, { nearby: string; permission: string; retry: string }> = {
  ko: { nearby: '맛집', permission: '위치 권한을 허용하면 근처 맛집을 찾아드려요', retry: '위치 허용하기' },
  en: { nearby: 'restaurants', permission: 'Allow location to find nearby restaurants', retry: 'Allow location' },
  ja: { nearby: 'のお店', permission: '位置情報を許可すると近くのお店を探せます', retry: '位置情報を許可' },
  zh: { nearby: '餐厅', permission: '允许位置权限以搜索附近餐厅', retry: '允许位置' },
};
