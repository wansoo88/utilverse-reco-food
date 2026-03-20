// 프롬프트 인젝션 방어 패턴 목록 (Layer 1, 2 공통 사용)
export const BLOCKED_PATTERNS = [
  /ignore\s+(previous|all)\s+instructions?/i,
  /disregard\s+(previous|all)\s+instructions?/i,
  /you\s+are\s+now/i,
  /act\s+as\s+/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /system\s+prompt/i,
  /reveal\s+instructions?/i,
  /show\s+me\s+your\s+instructions?/i,
  /dan\s+mode/i,
  /jailbreak/i,
  /bypass\s+(the\s+)?(rules?|filters?|restrictions?)/i,
  /<script[\s>]/i,
  /javascript:/i,
  /eval\s*\(/i,
  /SELECT\s+.+\s+FROM/i,
  /DROP\s+TABLE/i,
  /이전\s*지시.*무시/,
  /규칙.*무시/,
  /역할.*변경/,
];

// 음식 관련 신호 (50자 이상 입력 시 관련성 검증용)
export const FOOD_SIGNALS = [
  /먹|음식|메뉴|요리|레시피|식사|배달|맛집|반찬|국|찌개|면|밥|빵|고기|디저트|간식|식당|요리사|셰프/,
  /eat|food|cook|recipe|meal|menu|restaurant|dish|lunch|dinner|snack|breakfast|chef/i,
  /食|料理|メニュー|レシピ|食事|デリバリー|ご飯|おかず/,
];

const MAX_INPUT_LENGTH = 200;

export interface ValidationResult {
  valid: boolean;
  reason?: 'too_long' | 'injection' | 'not_food';
}

export const validateInput = (input: string): ValidationResult => {
  const trimmed = input.trim();

  if (trimmed.length > MAX_INPUT_LENGTH) {
    return { valid: false, reason: 'too_long' };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, reason: 'injection' };
    }
  }

  // 50자 이상이면 음식 관련성 검증
  if (trimmed.length >= 50) {
    const isFood = FOOD_SIGNALS.some((sig) => sig.test(trimmed));
    if (!isFood) {
      return { valid: false, reason: 'not_food' };
    }
  }

  return { valid: true };
};

// API 서버용 입력 정제 (Layer 2)
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/[<>"'&]/g, (c) => {
      const map: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '&': '&amp;',
      };
      return map[c] ?? c;
    })
    .trim()
    .slice(0, MAX_INPUT_LENGTH);
};
