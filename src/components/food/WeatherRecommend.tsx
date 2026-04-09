'use client';

import { useState, useEffect } from 'react';

interface WeatherResult {
  name: string;
  reason: string;
  emoji: string;
  weather: string;
  temp: number;
}

const LABELS: Record<string, {
  title: string;
  loading: string;
  denied: string;
  search: string;
}> = {
  ko: { title: '지금 날씨엔', loading: '날씨 확인 중...', denied: '위치 권한이 거부됐어요', search: '검색해보기' },
  en: { title: 'For today\'s weather', loading: 'Checking weather...', denied: 'Location permission denied', search: 'Search' },
  ja: { title: '今の天気には', loading: '天気確認中...', denied: '位置情報が拒否されました', search: '検索する' },
  zh: { title: '当前天气推荐', loading: '正在获取天气...', denied: '位置权限被拒绝', search: '搜索' },
};

type Status = 'loading' | 'done' | 'denied' | 'error';

interface Props {
  lang: string;
  onSearch: (menuName: string) => void;
}

export function WeatherRecommend({ lang, onSearch }: Props) {
  const [status, setStatus] = useState<Status>('loading');
  const [result, setResult] = useState<WeatherResult | null>(null);
  const labels = LABELS[lang] ?? LABELS.ko;

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        try {
          const res = await fetch('/api/weather-recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng, lang }),
          });
          if (!res.ok) throw new Error('API error');
          const data = await res.json() as WeatherResult;
          setResult(data);
          setStatus('done');
        } catch {
          setStatus('error');
        }
      },
      (err) => {
        setStatus(err.code === 1 ? 'denied' : 'error');
      },
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 600000 },
    );
  // lang이 바뀌어도 다시 호출하지 않음 (최초 1회만)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'loading') {
    return (
      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 flex items-center gap-3">
        <span className="animate-spin text-xl">🌀</span>
        <span className="text-sm text-blue-600">{labels.loading}</span>
      </div>
    );
  }

  if (status === 'denied' || status === 'error') {
    // 거부됐을 때는 조용히 렌더링 안 함 (사용자 경험 방해 최소화)
    return null;
  }

  if (status === 'done' && result) {
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
