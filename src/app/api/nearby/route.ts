import { NextRequest, NextResponse } from 'next/server';
import type { NearbyRestaurant } from '@/types/recommend';

// 단계적 반경 확장: 1km → 3km → 5km
const RADIUS_STEPS = [1000, 3000, 5000] as const;

// Haversine 거리 계산 (미터)
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Nominatim 역지오코딩으로 행정구역명 추출 (무료, 키 불필요)
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ko`,
      { headers: { 'User-Agent': 'pjt3-reco-food/1.0' }, signal: AbortSignal.timeout(3000) },
    );
    if (!res.ok) return '';
    const data = await res.json() as { address?: { suburb?: string; neighbourhood?: string; city_district?: string; quarter?: string; borough?: string; city?: string } };
    // 구+동 조합으로 검색 정확도 향상 (예: "중구 명동")
    const district = data.address?.borough ?? data.address?.city_district ?? '';
    const sub = data.address?.suburb ?? data.address?.neighbourhood ?? data.address?.quarter ?? '';
    if (district && sub && district !== sub) return `${district} ${sub}`;
    return sub || district;
  } catch {
    return '';
  }
}

// Naver 지역 검색 API 호출
async function searchNaverLocal(
  query: string,
  clientId: string,
  clientSecret: string,
): Promise<Array<{
  title: string;
  category: string;
  address: string;
  roadAddress: string;
  telephone: string;
  mapx: string;
  mapy: string;
  link: string;
}>> {
  const params = new URLSearchParams({
    query,
    display: '5',
    sort: 'comment', // 리뷰 많은 순 (인기순)
  });

  const res = await fetch(
    `https://openapi.naver.com/v1/search/local.json?${params.toString()}`,
    {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    },
  );

  if (!res.ok) throw new Error(`Naver Local API error: ${res.status}`);

  const data = await res.json() as {
    items?: Array<{
      title: string;
      category: string;
      address: string;
      roadAddress: string;
      telephone: string;
      mapx: string;
      mapy: string;
      link: string;
    }>;
  };

  return data.items ?? [];
}

// Naver mapx/mapy를 WGS84 좌표로 변환 (카텍 → WGS84 간이 변환)
function katecToWgs84(mapx: string, mapy: string): { lat: number; lng: number } {
  const x = parseInt(mapx, 10);
  const y = parseInt(mapy, 10);
  // 간이 변환 공식 (한국 지역 한정, 오차 ~100m 이내)
  const lng = x / 10000000;
  const lat = y / 10000000;
  return { lat, lng };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      menuNames: string[];
      lat?: number;
      lng?: number;
    };

    const menuNames = Array.isArray(body.menuNames) ? body.menuNames.slice(0, 4) : [];
    const userLat = typeof body.lat === 'number' ? body.lat : null;
    const userLng = typeof body.lng === 'number' ? body.lng : null;

    if (menuNames.length === 0) {
      return NextResponse.json({ results: {} });
    }

    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    // Naver credentials 없을 때 Google Maps 검색 링크로 폴백
    if (!clientId || !clientSecret) {
      const fallbackResults: Record<string, NearbyRestaurant[]> = {};
      for (const name of menuNames) {
        const locationQuery = userLat && userLng ? `${name} 맛집 근처` : `${name} 맛집`;
        fallbackResults[name] = [{
          name: `${name} 맛집 검색`,
          category: '',
          address: '',
          roadAddress: '',
          telephone: '',
          distance: 0,
          naverMapUrl: `https://www.google.com/maps/search/${encodeURIComponent(locationQuery)}`,
        }];
      }
      return NextResponse.json({ results: fallbackResults });
    }

    // 현재 위치의 행정구역명 추출 (쿼리에 포함해 근처 결과 유도)
    const districtName = userLat && userLng ? await reverseGeocode(userLat, userLng) : '';

    const results: Record<string, NearbyRestaurant[]> = {};

    // 각 메뉴명에 대해 병렬 검색
    await Promise.all(
      menuNames.map(async (menuName) => {
        try {
          // 지역명 포함 쿼리로 근처 결과 유도
          const query = districtName ? `${districtName} ${menuName} 맛집` : `${menuName} 맛집`;
          let items = await searchNaverLocal(query, clientId, clientSecret);

          // 결과 0건이면 지역명 제외하고 재검색
          if (items.length === 0 && districtName) {
            items = await searchNaverLocal(`${menuName} 맛집`, clientId, clientSecret);
          }

          const mapped = items.map((item) => {
            const coords = katecToWgs84(item.mapx, item.mapy);
            const distance = userLat && userLng
              ? Math.round(haversine(userLat, userLng, coords.lat, coords.lng))
              : 0;

            const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(item.title.replace(/<[^>]+>/g, ''))}`;

            return {
              name: item.title.replace(/<[^>]+>/g, ''),
              category: item.category,
              address: item.roadAddress || item.address,
              roadAddress: item.roadAddress,
              telephone: item.telephone,
              distance,
              naverMapUrl: item.link || naverMapUrl,
            };
          });

          // 위치 정보 있으면 단계적 반경 확장 (1km → 3km → 5km)
          if (userLat) {
            let filtered: typeof mapped = [];
            for (const radius of RADIUS_STEPS) {
              filtered = mapped.filter((r) => r.distance <= radius);
              if (filtered.length > 0) break;
            }
            results[menuName] = filtered
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 5);
          } else {
            results[menuName] = mapped.slice(0, 5);
          }
        } catch {
          results[menuName] = [];
        }
      }),
    );

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: {} });
  }
}
