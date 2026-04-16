/** basePath 없음 — food-ai.utilverse.info 도메인 루트 배포 */
export const BASE_PATH = '';

/** API 경로 반환 (basePath 제거됨, 호환성 유지) */
export const apiUrl = (path: string): string => path;
