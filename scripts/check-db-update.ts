#!/usr/bin/env node
/**
 * 서버 재기동 시 Local DB 최신 정보 업데이트 확인 스크립트
 * pnpm dev 실행 전에 자동 호출됨
 *
 * 사용법: npx tsx scripts/check-db-update.ts
 */

import * as readline from 'readline';

const CATEGORIES = ['kpop', 'chef', 'trend'] as const;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim().toLowerCase()));
  });
}

async function main() {
  console.log('\n🔄 ========================================');
  console.log('   Local DB Update Checker');
  console.log('   ========================================\n');
  console.log('📦 현재 데이터:');
  console.log('   - K-pop 아이돌: kpopIdols.ts');
  console.log('   - 흑백요리사: chefs.ts');
  console.log('   - 트렌드 메뉴: localMenus.ts\n');

  const answer = await ask('🔍 서버 시작 전에 최신 정보를 가져올까요? (y/n): ');

  if (answer === 'y' || answer === 'yes') {
    console.log('\n⏳ 최신 데이터를 가져오는 중...');

    const port = process.env.PORT ?? '3000';
    const secret = process.env.ADMIN_SECRET ?? 'dev-secret';

    try {
      const res = await fetch(`http://localhost:${port}/api/admin/update-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, categories: [...CATEGORIES] }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('\n✅ 업데이트 결과:');
        for (const result of data.results ?? []) {
          const icon = result.status === 'success' ? '✅' : '❌';
          console.log(`   ${icon} ${result.category}: ${result.message}`);
        }
        console.log(`\n💡 ${data.note}`);
      } else {
        console.log('\n⚠️ 서버가 아직 실행되지 않았습니다.');
        console.log('   서버 시작 후 아래 명령어로 업데이트할 수 있습니다:');
        console.log(`   curl -X POST http://localhost:${port}/api/admin/update-db -H "Content-Type: application/json" -d '{"secret":"${secret}"}'`);
      }
    } catch {
      console.log('\n⚠️ 서버가 아직 실행되지 않았습니다.');
      console.log('   서버 시작 후 /api/admin/update-db 엔드포인트를 호출하세요.');
    }
  } else {
    console.log('\n⏭️ 스킵합니다. 기존 데이터를 사용합니다.\n');
  }

  rl.close();
}

main().catch(console.error);
