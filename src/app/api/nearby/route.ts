import { NextRequest, NextResponse } from 'next/server';
import type { NearbyRestaurant } from '@/types/recommend';

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
        fallbackResults[name] = [{
          name: `${name} 맛집 검색`,
          category: '',
          address: '',
          roadAddress: '',
          telephone: '',
          distance: 0,
          naverMapUrl: `https://www.google.com/maps/search/${encodeURIComponent(name + ' 맛집')}`,
        }];
      }
      return NextResponse.json({ results: fallbackResults });
    }

    const results: Record<string, NearbyRestaurant[]> = {};

    // 각 메뉴명에 대해 병렬 검색
    await Promise.all(
      menuNames.map(async (menuName) => {
        try {
          const query = `${menuName} 맛집`;
          const items = await searchNaverLocal(query, clientId, clientSecret);

          results[menuName] = items.map((item) => {
            const coords = katecToWgs84(item.mapx, item.mapy);
            const distance = userLat && userLng
              ? Math.round(haversine(userLat, userLng, coords.lat, coords.lng))
              : 0;

            // 네이버 지도 URL 생성
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
          })
          // 위치 정보가 있으면 5km 이내만, 없으면 전체
          .filter((r) => !userLat || r.distance <= 5000)
          .slice(0, 5);
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
