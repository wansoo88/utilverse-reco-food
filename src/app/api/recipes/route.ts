import { NextRequest, NextResponse } from 'next/server';

export interface RecipeItem {
  title: string;
  channel?: string;
  thumbnail?: string;
  platform: 'youtube' | 'blog';
  url: string;
  /** API 없이 생성된 검색 링크 여부 */
  isGenerated?: boolean;
}

interface RecipesResponse {
  youtube: RecipeItem[];
  blog: RecipeItem[];
}

// 언어별 검색 접미어 (foodName은 그대로 포함)
const SEARCH_SUFFIX: Record<string, { youtube: string; blog: string }> = {
  ko: { youtube: ' 레시피', blog: ' 레시피' },
  en: { youtube: ' recipe', blog: ' recipe' },
  ja: { youtube: ' レシピ', blog: ' レシピ' },
  zh: { youtube: ' 食谱', blog: ' 食谱' },
};

// 검색 URL 자동 생성 — foodName 키워드를 그대로 포함
function buildGeneratedLinks(foodName: string, lang: string): RecipesResponse {
  const suffix = SEARCH_SUFFIX[lang] ?? SEARCH_SUFFIX.ko;
  const ytQuery = foodName + suffix.youtube;
  const blogQuery = foodName + suffix.blog;

  const youtube: RecipeItem[] = [
    {
      title: ytQuery,
      platform: 'youtube',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(ytQuery)}`,
      isGenerated: true,
    },
  ];

  const blog: RecipeItem[] = [
    {
      title: blogQuery,
      platform: 'blog',
      url: lang === 'ko'
        ? `https://search.naver.com/search.naver?where=blog&query=${encodeURIComponent(blogQuery)}`
        : `https://www.google.com/search?q=${encodeURIComponent(blogQuery)}`,
      isGenerated: true,
    },
  ];

  return { youtube, blog };
}

// YouTube Data API v3 호출
async function fetchYouTube(foodName: string, lang: string, apiKey: string): Promise<RecipeItem[]> {
  const suffix = SEARCH_SUFFIX[lang] ?? SEARCH_SUFFIX.ko;
  const query = foodName + suffix.youtube;

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '3',
    relevanceLanguage: lang === 'ko' ? 'ko' : lang,
    regionCode: lang === 'ko' ? 'KR' : 'US',
    key: apiKey,
  });

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

  const data = await res.json() as {
    items: Array<{
      id: { videoId: string };
      snippet: { title: string; channelTitle: string; thumbnails: { medium: { url: string } } };
    }>;
  };

  return (data.items ?? []).map((item) => ({
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails?.medium?.url,
    platform: 'youtube' as const,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));
}

// Google Custom Search API 호출 (블로그)
async function fetchGoogleBlogs(foodName: string, lang: string, apiKey: string, cseId: string): Promise<RecipeItem[]> {
  const suffix = SEARCH_SUFFIX[lang] ?? SEARCH_SUFFIX.ko;
  const query = foodName + suffix.blog;

  const params = new URLSearchParams({
    key: apiKey,
    cx: cseId,
    q: query,
    num: '3',
    lr: `lang_${lang}`,
  });

  const res = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`);
  if (!res.ok) throw new Error(`Google CSE error: ${res.status}`);

  const data = await res.json() as {
    items?: Array<{ title: string; link: string; displayLink: string }>;
  };

  return (data.items ?? []).map((item) => ({
    title: item.title,
    channel: item.displayLink,
    platform: 'blog' as const,
    url: item.link,
  }));
}

// Naver 블로그 검색 API 호출
async function fetchNaverBlogs(foodName: string, clientId: string, clientSecret: string): Promise<RecipeItem[]> {
  // foodName 그대로 + 레시피 접미어
  const query = foodName.includes('레시피') ? foodName : `${foodName} 레시피`;
  const res = await fetch(
    `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(query)}&display=3&sort=sim`,
    {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    },
  );
  if (!res.ok) throw new Error(`Naver API error: ${res.status}`);

  const data = await res.json() as {
    items?: Array<{ title: string; link: string; bloggername: string }>;
  };

  return (data.items ?? []).map((item) => ({
    // Naver API는 HTML 태그 포함 — 제거
    title: item.title.replace(/<[^>]+>/g, ''),
    channel: item.bloggername,
    platform: 'blog' as const,
    url: item.link,
  }));
}

// 네이버 동영상 검색 API (YouTube 폴백용)
async function fetchNaverVideos(foodName: string, clientId: string, clientSecret: string): Promise<RecipeItem[]> {
  const query = foodName.includes('레시피') ? foodName : `${foodName} 레시피`;
  const res = await fetch(
    `https://openapi.naver.com/v1/search/video.json?query=${encodeURIComponent(query)}&display=3&sort=sim`,
    {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    },
  );
  if (!res.ok) throw new Error(`Naver Video API error: ${res.status}`);

  const data = await res.json() as {
    items?: Array<{ title: string; link: string; thumbnail: string; description: string }>;
  };

  return (data.items ?? []).map((item) => ({
    title: item.title.replace(/<[^>]+>/g, ''),
    thumbnail: item.thumbnail,
    platform: 'youtube' as const, // UI 호환을 위해 youtube로 표시
    url: item.link,
  }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { foodName?: string; lang?: string };
    const foodName = typeof body.foodName === 'string' ? body.foodName.trim() : '';
    const lang = typeof body.lang === 'string' ? body.lang : 'ko';

    if (!foodName) return NextResponse.json({ youtube: [], blog: [] });

    const youtubeKey = process.env.YOUTUBE_API_KEY;
    const googleCseKey = process.env.GOOGLE_CSE_API_KEY;
    const googleCseId = process.env.GOOGLE_CSE_ID;
    const naverClientId = process.env.NAVER_CLIENT_ID;
    const naverClientSecret = process.env.NAVER_CLIENT_SECRET;

    // 기본값: 자동 생성 검색 링크
    const result = buildGeneratedLinks(foodName, lang);

    // ── 동영상: 네이버 동영상 → YouTube API → 생성 링크 ──
    let videoFetched = false;

    // 1) 네이버 동영상 검색 우선 (한국어, 한도 25,000/일)
    if (lang === 'ko' && naverClientId && naverClientSecret) {
      try {
        const naverVideos = await fetchNaverVideos(foodName, naverClientId, naverClientSecret);
        if (naverVideos.length > 0) {
          result.youtube = naverVideos;
          videoFetched = true;
        }
      } catch { /* 네이버 실패 → YouTube 시도 */ }
    }

    // 2) YouTube API 폴백
    if (!videoFetched && youtubeKey) {
      try {
        const ytItems = await fetchYouTube(foodName, lang, youtubeKey);
        if (ytItems.length > 0) {
          result.youtube = ytItems;
          videoFetched = true;
        }
      } catch { /* YouTube 실패 → 생성 링크 유지 */ }
    }
    // 3) 둘 다 실패 → 생성 링크 유지 (이미 result에 있음)

    // ── 블로그: 네이버 블로그 → Google CSE → 생성 링크 ──
    if (lang === 'ko' && naverClientId && naverClientSecret) {
      try {
        const naverItems = await fetchNaverBlogs(foodName, naverClientId, naverClientSecret);
        if (naverItems.length > 0) result.blog = naverItems;
      } catch {
        if (googleCseKey && googleCseId) {
          try {
            const googleItems = await fetchGoogleBlogs(foodName, lang, googleCseKey, googleCseId);
            if (googleItems.length > 0) result.blog = googleItems;
          } catch { /* 생성 링크 유지 */ }
        }
      }
    } else if (naverClientId && naverClientSecret) {
      // 비한국어도 네이버 먼저 시도 (한도 여유)
      try {
        const naverItems = await fetchNaverBlogs(foodName, naverClientId, naverClientSecret);
        if (naverItems.length > 0) result.blog = naverItems;
      } catch {
        if (googleCseKey && googleCseId) {
          try {
            const googleItems = await fetchGoogleBlogs(foodName, lang, googleCseKey, googleCseId);
            if (googleItems.length > 0) result.blog = googleItems;
          } catch { /* 생성 링크 유지 */ }
        }
      }
    } else if (googleCseKey && googleCseId) {
      try {
        const googleItems = await fetchGoogleBlogs(foodName, lang, googleCseKey, googleCseId);
        if (googleItems.length > 0) result.blog = googleItems;
      } catch { /* 생성 링크 유지 */ }
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ youtube: [], blog: [] });
  }
}
