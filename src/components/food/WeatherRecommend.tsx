'use client';

import { useState } from 'react';

interface WeatherResult {
  name: string;
  reason: string;
  emoji: string;
  weather: string;
  temp: number;
}

const LABELS: Record<string, {
  title: string;
  cta: string;
  loading: string;
  denied: string;
  search: string;
}> = {
  ko: { title: '지금 날씨엔', cta: '📍 날씨 기반 메뉴 추천받기', loading: '날씨 확인 중...', denied: '위치 권한이 필요해요', search: '검색해보기' },
  en: { title: 'For today\'s weather', cta: '📍 Get weather-based recommendation', loading: 'Checking weather...', denied: 'Location permission needed', search: 'Search' },
  ja: { title: '今の天気には', cta: '📍 天気に合ったメニューを推薦', loading: '天気確認中...', denied: '位置情報が必要です', search: '検索する' },
  zh: { title: '当前天气推荐', cta: '📍 根据天气推荐菜单', loading: '正在获取天气...', denied: '需要位置权限', search: '搜索' },
};

type Status = 'idle' | 'loading' | 'done' | 'denied' | 'error';

interface Props {
  lang: string;
  onSearch: (menuName: string) => void;
}

export function WeatherRecommend({ lang, onSearch }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<WeatherResult | null>(null);
  const labels = LABELS[lang] ?? LABELS.ko;

  async function handleRequest() {
    if (!navigator.geolocation) {
      setStatus('denied');
      return;
    }

    setStatus('loading');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 6000,
          maximumAge: 600000,
        });
      });

      const { latitude: lat, longitude: lng } = position.coords;
      const res = await fetch('/api/weather-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, lang }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json() as WeatherResult;
      setResult(data);
      setStatus('done');
    } catch (err) {
      const isDenied = err instanceof GeolocationPositionError && err.code === 1;
      setStatus(isDenied ? 'denied' : 'error');
    }
  }

  // idle: CTA 버튼
  if (status === 'idle') {
    return (
      <button
        type="button"
        onClick={handleRequest}
        style={{ touchAction: 'manipulation' }}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 px-5 py-3.5 text-sm font-semibold text-blue-700 transition-colors"
      >
        {labels.cta}
      </button>
    );
  }

  // loading
  if (status === 'loading') {
    return (
      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 flex items-center gap-3">
        <span className="animate-spin text-xl">🌀</span>
        <span className="text-sm text-blue-600">{labels.loading}</span>
      </div>
    );
  }

  // denied/error
  if (status === 'denied' || status === 'error') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">{labels.denied}</span>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-xs text-blue-500 underline"
        >
          취소
        </button>
      </div>
    );
  }

  // done
  if (result) {
    return (
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 px-5 py-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-blue-500 font-medium mb-1">
            {result.weather} {result.temp}°C · {labels.title}
          </p>
          <p className="text-base font-bold text-gray-900">{result.emoji} {result.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{result.reason}</p>
        </div>
        <button
          type="button"
          onClick={() => onSearch(result.name)}
          style={{ touchAction: 'manipulation' }}
          className="shrink-0 rounded-xl bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold px-3 py-2"
        >
          {labels.search}
        </button>
      </div>
    );
  }

  return null;
}
