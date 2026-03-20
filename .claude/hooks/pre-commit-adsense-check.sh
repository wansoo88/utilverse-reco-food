#!/bin/bash
# pre-commit-adsense-check.sh
# 커밋 전 에드센스 정책 위반 검사 스크립트

set -e

ERRORS=0

# 스테이징된 파일 목록
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || echo "")

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# 1. ca-pub- 하드코딩 감지 (config 파일 제외)
HARDCODED=$(echo "$STAGED_FILES" | grep -E '\.(tsx?|jsx?)$' | grep -v 'config/' | xargs grep -l 'ca-pub-' 2>/dev/null || true)
if [ -n "$HARDCODED" ]; then
  echo "❌ [에드센스 정책] ca-pub- ID가 하드코딩되어 있습니다. src/config/adsense.ts 또는 환경변수를 사용하세요:"
  echo "$HARDCODED"
  ERRORS=$((ERRORS + 1))
fi

# 2. 에러/404 페이지에서 광고 컴포넌트 import 감지
ERROR_PAGES=$(echo "$STAGED_FILES" | grep -E '(not-found|error)\.(tsx?|jsx?)$' || true)
if [ -n "$ERROR_PAGES" ]; then
  AD_IMPORTS=$(echo "$ERROR_PAGES" | xargs grep -l -E "from.*['\"].*components/ads" 2>/dev/null || true)
  if [ -n "$AD_IMPORTS" ]; then
    echo "❌ [에드센스 정책] 에러/404 페이지에서 광고 컴포넌트를 import하고 있습니다:"
    echo "$AD_IMPORTS"
    ERRORS=$((ERRORS + 1))
  fi
fi

# 3. 광고 컴포넌트에 minHeight 누락 확인
AD_FILES=$(echo "$STAGED_FILES" | grep -E 'components/ads/.*\.(tsx?|jsx?)$' || true)
if [ -n "$AD_FILES" ]; then
  MISSING_HEIGHT=$(echo "$AD_FILES" | xargs grep -L 'minHeight' 2>/dev/null || true)
  if [ -n "$MISSING_HEIGHT" ]; then
    echo "⚠️  [CLS 방지] 광고 컴포넌트에 minHeight가 설정되지 않았습니다:"
    echo "$MISSING_HEIGHT"
  fi
fi

# 4. 단일 페이지에서 AdUnit 5개 초과 사용 경고
PAGE_FILES=$(echo "$STAGED_FILES" | grep -E 'app/.*page\.(tsx?|jsx?)$' || true)
if [ -n "$PAGE_FILES" ]; then
  for f in $PAGE_FILES; do
    COUNT=$(grep -c '<AdUnit\|<HeaderAd\|<SidebarAd\|<InContentAd\|<MultiplexAd' "$f" 2>/dev/null || echo "0")
    if [ "$COUNT" -gt 5 ]; then
      echo "⚠️  [에드센스 정책] $f 에 광고가 ${COUNT}개 있습니다 (권장: 최대 5개)"
    fi
  done
fi

if [ "$ERRORS" -gt 0 ]; then
  echo ""
  echo "에드센스 정책 검사 실패: ${ERRORS}개 에러 발견"
  exit 1
fi

exit 0
