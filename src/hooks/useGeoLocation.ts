'use client';

import { useState, useEffect } from 'react';

interface GeoLocationState {
  locationName: string;
  status: 'idle' | 'loading' | 'granted' | 'denied' | 'error';
}

const LOCATION_LABELS: Record<string, Record<string, string>> = {
  ko: { loading: '위치 확인 중...', denied: '위치 꺼짐', error: '위치 오류' },
  en: { loading: 'Locating...', denied: 'Location off', error: 'Location error' },
  ja: { loading: '位置確認中...', denied: '位置オフ', error: '位置エラー' },
  zh: { loading: '定位中...', denied: '位置关闭', error: '位置错误' },
};

// Nominatim 역지오코딩으로 행정구역명 추출
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ko`,
      { headers: { 'User-Agent': 'pjt3-reco-food/1.0' }, signal: AbortSignal.timeout(3000) },
    );
    if (!res.ok) return '';
    const data = await res.json() as {
      address?: {
        suburb?: string;
        neighbourhood?: string;
        city_district?: string;
        quarter?: string;
        borough?: string;
        city?: string;
        county?: string;
      };
    };
    const district = data.address?.borough ?? data.address?.city_district ?? '';
    const sub = data.address?.suburb ?? data.address?.neighbourhood ?? data.address?.quarter ?? '';
    if (district && sub && district !== sub) return `${district} ${sub}`;
    return sub || district || data.address?.county || data.address?.city || '';
  } catch {
    return '';
  }
}

export function useGeoLocation(lang: string): GeoLocationState {
  const [state, setState] = useState<GeoLocationState>({ locationName: '', status: 'idle' });
  const labels = LOCATION_LABELS[lang] ?? LOCATION_LABELS.ko;

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setState({ locationName: '', status: 'error' });
      return;
    }

    setState({ locationName: labels.loading, status: 'loading' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const name = await reverseGeocode(latitude, longitude);
        setState({ locationName: name || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`, status: 'granted' });
      },
      (err) => {
        if (err.code === 1) {
          setState({ locationName: '', status: 'denied' });
        } else {
          setState({ locationName: '', status: 'error' });
        }
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 },
    );
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
