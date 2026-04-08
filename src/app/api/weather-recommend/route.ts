import { NextRequest, NextResponse } from 'next/server';
import { trackUsage, estimateTokens } from '@/lib/usageTracker';

// WMO 날씨 코드 → 조건 분류
function classifyWeather(code: number): { condition: string; emoji: string; isRainy: boolean; isCold: boolean } {
  if (code === 0) return { condition: '맑음', emoji: '☀️', isRainy: false, isCold: false };
  if (code <= 3) return { condition: '구름 많음', emoji: '⛅', isRainy: false, isCold: false };
  if (code <= 48) return { condition: '안개', emoji: '🌫️', isRainy: false, isCold: false };
  if (code <= 67 || (code >= 80 && code <= 82)) return { condition: '비', emoji: '🌧️', isRainy: true, isCold: false };
  if (code <= 77 || (code >= 85 && code <= 86)) return { condition: '눈', emoji: '🌨️', isRainy: true, isCold: true };
  return { condition: '천둥번개', emoji: '⛈️', isRainy: true, isCold: false };
}

// 날씨/시간대 기반 로컬 폴백 메뉴
function localWeatherMenu(
  isRainy: boolean,
  isCold: boolean,
  temp: number,
  hour: number,
): { name: string; reason: string; emoji: string } {
  if (isRainy || isCold) {
    const rainyMenus = [
      { name: '부대찌개', reason: '비 오는 날 더 맛있는 진한 국물', emoji: '🍲' },
      { name: '라면', reason: '빗소리와 함께하는 최고의 조합', emoji: '🍜' },
      { name: '순두부찌개', reason: '추운 날 속 따뜻하게 데워주는 찌개', emoji: '🥘' },
      { name: '삼겹살', reason: '비 오는 날 생각나는 고기파티', emoji: '🥓' },
      { name: '감자탕', reason: '날씨 추울 때 뼈 국물로 체온 회복', emoji: '🍲' },
    ];
    return rainyMenus[Math.floor(Math.random() * rainyMenus.length)];
  }
  if (temp >= 28) {
    const hotMenus = [
      { name: '냉면', reason: '더운 날 최고의 선택, 시원한 국물', emoji: '🍜' },
      { name: '콩국수', reason: '고소하고 시원한 여름 별미', emoji: '🍝' },
      { name: '비빔밥', reason: '신선한 야채로 더위 이기는 한 그릇', emoji: '🥗' },
      { name: '물냉면', reason: '얼음 동동 시원한 여름 필수 메뉴', emoji: '🍜' },
    ];
    return hotMenus[Math.floor(Math.random() * hotMenus.length)];
  }
  // 맑은 날, 시간대별
  if (hour >= 6 && hour < 10) {
    return { name: '토스트', reason: '맑은 아침에 가볍고 든든하게', emoji: '🍞' };
  }
  if (hour >= 10 && hour < 15) {
    return { name: '비빔밥', reason: '쾌청한 날 점심은 건강하게', emoji: '🥗' };
  }
  if (hour >= 15 && hour < 18) {
    return { name: '떡볶이', reason: '맑은 오후 간식으로 딱', emoji: '🌶️' };
  }
  if (hour >= 18 && hour < 22) {
    return { name: '삼겹살', reason: '좋은 날씨에 고기 한 판', emoji: '🥓' };
  }
  return { name: '라면', reason: '야식으로 완벽한 선택', emoji: '🍜' };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { lat: number; lng: number; lang?: string };
    const { lat, lng, lang = 'ko' } = body;

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ error: 'lat/lng required' }, { status: 400 });
    }

    // 1. Open-Meteo 날씨 데이터 (무료, 키 불필요)
    let temp = 20;
    let weatherCode = 0;
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=auto&forecast_days=1`,
        { signal: AbortSignal.timeout(4000) },
      );
      if (weatherRes.ok) {
        const wd = await weatherRes.json() as { current?: { temperature_2m?: number; weather_code?: number } };
        temp = wd.current?.temperature_2m ?? 20;
        weatherCode = wd.current?.weather_code ?? 0;
      }
    } catch {
      // 날씨 API 실패 시 기본값 사용
    }

    const { condition, emoji: weatherEmoji, isRainy, isCold } = classifyWeather(weatherCode);
    const hour = new Date().getHours();
    const timeSlot = hour < 10 ? '아침' : hour < 15 ? '점심' : hour < 18 ? '오후' : hour < 22 ? '저녁' : '야식';

    // 2. Gemini로 날씨 맞춤 추천
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const langInstr = lang === 'en' ? 'Respond in English.' : lang === 'ja' ? '日本語で答えてください。' : lang === 'zh' ? '请用中文回答。' : '한국어로 답하세요.';
        const prompt = `현재 날씨: ${condition} ${weatherEmoji}, 기온: ${Math.round(temp)}°C, 시간대: ${timeSlot}. 지금 이 날씨에 딱 맞는 음식 하나를 JSON으로 추천해주세요. ${langInstr}
형식: {"name":"메뉴명","reason":"날씨와 연결된 이유(20자 이내)","emoji":"이모지"}
JSON만 출력하세요.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(text) as { name: string; reason: string; emoji: string };
        trackUsage({ ts: Date.now(), provider: 'gemini', model: 'gemini-2.5-flash', endpoint: 'recommend', estimatedTokens: estimateTokens(prompt + text) });

        return NextResponse.json({ ...parsed, weather: `${condition} ${weatherEmoji}`, temp: Math.round(temp) });
      } catch {
        // Gemini 실패 → 로컬 폴백
      }
    }

    // 3. 로컬 폴백
    const local = localWeatherMenu(isRainy, isCold, temp, hour);
    trackUsage({ ts: Date.now(), provider: 'local', model: 'local', endpoint: 'recommend', estimatedTokens: 0 });
    return NextResponse.json({ ...local, weather: `${condition} ${weatherEmoji}`, temp: Math.round(temp) });
  } catch {
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
