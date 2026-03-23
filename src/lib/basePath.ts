/** Next.js basePath — /menu-ai
 * 클라이언트 fetch 호출에서 API URL에 basePath를 명시적으로 붙여야 합니다.
 * (next/link는 자동 처리되지만 raw fetch는 수동으로 prefix 필요)
 */
export const BASE_PATH = '/menu-ai';

/** API 경로에 basePath 붙이기 */
export const apiUrl = (path: string): string => `${BASE_PATH}${path}`;
