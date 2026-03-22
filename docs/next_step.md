# Next Steps

아래는 코드 밖에서 직접 진행해야 하는 운영 작업입니다.

## 1. 프로덕션 배포

1. Vercel에 현재 GitHub 저장소를 연결합니다.
2. 환경 변수 등록:
   - `NEXT_PUBLIC_SITE_URL`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_ADSENSE_PUB_ID`
   - `NEXT_PUBLIC_GA_ID`
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
3. 실제 도메인 연결 후 배포를 다시 실행합니다.
4. 배포 후 대표 페이지 확인:
   - `/ko`
   - `/ko/about`
   - `/ko/privacy`
   - `/ko/terms`
   - `/ko/contact`
   - `/ko/eat/menu/비오는날-혼밥-추천`

## 2. Google Analytics 4

1. GA4 속성과 웹 데이터 스트림을 만듭니다.
2. 측정 ID를 `NEXT_PUBLIC_GA_ID`에 입력합니다.
3. 배포 후 실시간 리포트에서 아래 이벤트를 확인합니다.
   - `page_view`
   - `recommend_submit`
   - `recommend_success`
   - `calendar_save`
   - `calendar_update`
   - `calendar_delete`
   - `language_change`
   - `quick_topic_click`

## 3. Search Console

1. 최종 도메인을 등록합니다.
2. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`에 인증 코드를 넣습니다.
3. 배포 후 `sitemap.xml`을 제출합니다.
4. 대표 SEO 페이지 3~5개는 수동 색인 요청을 먼저 진행합니다.

## 4. AdSense

1. 사이트 등록 및 승인 신청을 진행합니다.
2. 승인 후 `NEXT_PUBLIC_ADSENSE_PUB_ID`를 실제 값으로 교체합니다.
3. `src/config/adsense.ts`의 `AD_SLOTS.footer`에 실제 슬롯 ID를 입력합니다.
4. 승인 전후 모두 본인 클릭과 유도 클릭은 금지합니다.

## 5. 성능 점검

1. `pnpm analyze` 또는 `npm run analyze`로 번들 리포트를 확인합니다.
2. Lighthouse 모바일 점검:
   - 홈
   - 대표 SEO 페이지
3. 실제 이미지 자산이 생기면 `next/image`와 WebP를 우선 적용합니다.

## 6. 운영 루틴

1. 새 키워드를 추가할 때 `src/data/seoKeywords.ts`와 관련 링크 구성을 같이 갱신합니다.
2. 배포 전 `npm run build`를 항상 통과시킵니다.
3. 승인 유지 목적상 푸터 신뢰 링크와 정책 페이지는 제거하지 않는 편이 좋습니다.
