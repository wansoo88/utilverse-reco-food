'use client';

import { useState, useEffect, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface UsageSummary {
  total: number;
  byProvider: Record<string, number>;
  byModel: Record<string, number>;
  byEndpoint: Record<string, number>;
  totalEstimatedTokens: number;
  recentRecords: Array<{
    ts: number;
    provider: string;
    model: string;
    endpoint: string;
    estimatedTokens: number;
  }>;
  lastUpdated: number;
}

interface DbStatus {
  counts: Record<string, number>;
  preview: {
    kpopIdols: Array<{ name: string; group: string; emoji: string }>;
    cookMenus: Array<{ name: string; reason: string; emoji: string }>;
    orderMenus: Array<{ name: string; reason: string; emoji: string }>;
    chefs: Array<{ name: string; specialty: string; emoji: string }>;
    foodTrivia: Array<{ question: string; answer: string; emoji: string }>;
  };
}

interface TrendEntry {
  id: string;
  name: string;
  category: string;
  reason: string;
  addedAt: number;
  source: 'manual' | 'ai';
}

// ── Auth helpers ───────────────────────────────────────────────────────────────

async function adminFetch(url: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    credentials: 'include',
  });
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-1">
      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
      <span className="text-2xl font-bold text-gray-800">{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
      {children}
    </h2>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'usage' | 'db' | 'trends'>('usage');

  // Usage
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];
  const [usageFrom, setUsageFrom] = useState(todayStr);
  const [usageTo, setUsageTo] = useState(todayStr);

  // DB
  const [db, setDb] = useState<DbStatus | null>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbSearch, setDbSearch] = useState('');

  // Trends
  const [trends, setTrends] = useState<TrendEntry[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [aiRefreshing, setAiRefreshing] = useState(false);
  const [newTrend, setNewTrend] = useState({ name: '', category: '', reason: '' });

  // ── Auth ───────────────────────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: loginId, pw: loginPw }),
      credentials: 'include',
    });
    if (res.ok) {
      setAuthed(true);
      setLoginError('');
    } else {
      const data = await res.json() as { error?: string };
      setLoginError(data.error ?? '로그인 실패');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE', credentials: 'include' });
    setAuthed(false);
  }

  // ── Usage ──────────────────────────────────────────────────────────────────

  const fetchUsage = useCallback(async (from = usageFrom, to = usageTo) => {
    setUsageLoading(true);
    const params = new URLSearchParams();
    if (from) params.set('from', String(new Date(from).getTime()));
    if (to) params.set('to', String(new Date(to + 'T23:59:59').getTime()));
    const qs = params.toString();
    const res = await adminFetch(`/api/admin/usage${qs ? `?${qs}` : ''}`);
    if (res.ok) setUsage(await res.json() as UsageSummary);
    setUsageLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usageFrom, usageTo]);

  async function clearUsage() {
    if (!confirm('사용량 기록을 초기화하시겠습니까?')) return;
    await adminFetch('/api/admin/usage', { method: 'DELETE' });
    await fetchUsage();
  }

  // ── DB ────────────────────────────────────────────────────────────────────

  const fetchDb = useCallback(async (q = '') => {
    setDbLoading(true);
    const res = await adminFetch(`/api/admin/db-status${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    if (res.ok) setDb(await res.json() as DbStatus);
    setDbLoading(false);
  }, []);

  // ── Trends ────────────────────────────────────────────────────────────────

  const fetchTrends = useCallback(async () => {
    setTrendsLoading(true);
    const res = await adminFetch('/api/admin/trends');
    if (res.ok) {
      const data = await res.json() as { trends: TrendEntry[] };
      setTrends(data.trends);
    }
    setTrendsLoading(false);
  }, []);

  async function addTrend() {
    if (!newTrend.name.trim()) return;
    const res = await adminFetch('/api/admin/trends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', entry: { ...newTrend, source: 'manual' } }),
    });
    if (res.ok) {
      setNewTrend({ name: '', category: '', reason: '' });
      await fetchTrends();
    }
  }

  async function removeTrend(id: string) {
    await adminFetch('/api/admin/trends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remove', id }),
    });
    setTrends((prev) => prev.filter((t) => t.id !== id));
  }

  async function aiRefresh() {
    if (!confirm('AI로 트렌드 메뉴를 갱신하시겠습니까? (Gemini API 호출)')) return;
    setAiRefreshing(true);
    const res = await adminFetch('/api/admin/trends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ai-refresh' }),
    });
    if (res.ok) {
      const data = await res.json() as { trends: TrendEntry[] };
      setTrends(data.trends);
    }
    setAiRefreshing(false);
  }

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!authed) return;
    if (activeTab === 'usage') fetchUsage();
    if (activeTab === 'db') fetchDb();
    if (activeTab === 'trends') fetchTrends();
  }, [authed, activeTab, fetchUsage, fetchDb, fetchTrends]);

  // ── Login Screen ───────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-4"
        >
          <div className="text-center mb-2">
            <span className="text-4xl">🍽️</span>
            <h1 className="text-xl font-bold text-gray-800 mt-2">오늘뭐먹지 Admin</h1>
            <p className="text-xs text-gray-400 mt-1">관리자만 접근 가능합니다</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">아이디</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="아이디 입력"
                autoComplete="username"
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">비밀번호</label>
              <input
                type="password"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                placeholder="비밀번호 입력"
                autoComplete="current-password"
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
          {loginError && (
            <p className="text-red-500 text-xs text-center bg-red-50 py-2 px-3 rounded-lg">
              {loginError}
            </p>
          )}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2 transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">🍽️ 오늘뭐먹지 Admin</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          로그아웃
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-6">
        {(['usage', 'db', 'trends'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'usage' && '📊 토큰 사용량'}
            {tab === 'db' && '🗄️ DB 현황'}
            {tab === 'trends' && '🔥 트렌드 관리'}
          </button>
        ))}
      </div>

      <main className="max-w-5xl mx-auto px-6 py-6">

        {/* ── Usage Tab ─────────────────────────────────────────────────────── */}
        {activeTab === 'usage' && (
          <div className="flex flex-col gap-6">
            {/* /tmp 초기화 경고 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 flex items-start gap-2">
              <span className="text-base shrink-0">⚠️</span>
              <span>사용량 데이터는 서버 <strong>/tmp</strong> 에 저장됩니다. 서버 재기동·재배포 시 자동으로 초기화됩니다.</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
              <SectionTitle>API 토큰 사용량</SectionTitle>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchUsage()}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  새로고침
                </button>
                <button
                  onClick={clearUsage}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg transition-colors"
                >
                  초기화
                </button>
              </div>
            </div>

            {/* 날짜 범위 필터 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">시작 날짜</label>
                <input
                  type="date"
                  value={usageFrom}
                  onChange={(e) => setUsageFrom(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">종료 날짜</label>
                <input
                  type="date"
                  value={usageTo}
                  onChange={(e) => setUsageTo(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <button
                onClick={() => fetchUsage(usageFrom, usageTo)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                조회
              </button>
              <button
                onClick={() => { setUsageFrom(todayStr); setUsageTo(todayStr); fetchUsage(todayStr, todayStr); }}
                className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1.5"
              >
                오늘
              </button>
              <button
                onClick={() => { setUsageFrom(''); setUsageTo(''); fetchUsage('', ''); }}
                className="text-sm text-gray-400 hover:text-gray-600 px-2 py-1.5"
              >
                전체
              </button>
            </div>

            {usageLoading && <p className="text-gray-500 text-sm">로딩 중...</p>}

            {usage && (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard label="총 호출" value={usage.total} />
                  <StatCard label="추정 토큰" value={usage.totalEstimatedTokens.toLocaleString()} />
                  <StatCard
                    label="Gemini"
                    value={usage.byProvider['gemini'] ?? 0}
                    sub={`Flash: ${(usage.byModel['gemini-2.0-flash'] ?? 0) + (usage.byModel['gemini-2.0-flash-lite'] ?? 0)}`}
                  />
                  <StatCard
                    label="GPT / Local"
                    value={`${usage.byProvider['gpt'] ?? 0} / ${usage.byProvider['local'] ?? 0}`}
                    sub="gpt-4o-mini / 로컬폴백"
                  />
                </div>

                {/* By endpoint */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">엔드포인트별 호출</h3>
                  <div className="flex flex-col gap-2">
                    {Object.entries(usage.byEndpoint).map(([ep, count]) => (
                      <div key={ep} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-36">{ep}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-orange-400 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (count / usage.total) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-8 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent records */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 overflow-x-auto">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">최근 20건</h3>
                  <table className="w-full text-xs text-gray-600">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-100">
                        <th className="pb-2 pr-4">시간</th>
                        <th className="pb-2 pr-4">Provider</th>
                        <th className="pb-2 pr-4">Model</th>
                        <th className="pb-2 pr-4">Endpoint</th>
                        <th className="pb-2">토큰(추정)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usage.recentRecords.map((r, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-1.5 pr-4 whitespace-nowrap">
                            {new Date(r.ts).toLocaleTimeString('ko-KR')}
                          </td>
                          <td className="pr-4">
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                r.provider === 'gemini'
                                  ? 'bg-blue-100 text-blue-700'
                                  : r.provider === 'gpt'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {r.provider}
                            </span>
                          </td>
                          <td className="pr-4">{r.model}</td>
                          <td className="pr-4">{r.endpoint}</td>
                          <td>{r.estimatedTokens}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-400 mt-2">
                    마지막 업데이트: {new Date(usage.lastUpdated).toLocaleString('ko-KR')}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── DB Tab ────────────────────────────────────────────────────────── */}
        {activeTab === 'db' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <SectionTitle>로컬 DB 현황</SectionTitle>
            </div>

            {/* Search */}
            <div className="flex gap-2">
              <input
                type="text"
                value={dbSearch}
                onChange={(e) => setDbSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchDb(dbSearch)}
                placeholder="메뉴명, 아이돌명 검색..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={() => fetchDb(dbSearch)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                검색
              </button>
              {dbSearch && (
                <button
                  onClick={() => { setDbSearch(''); fetchDb(''); }}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  초기화
                </button>
              )}
            </div>

            {dbLoading && <p className="text-gray-500 text-sm">로딩 중...</p>}

            {db && (
              <>
                {/* Counts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard label="K-pop 아이돌" value={db.counts.kpopIdols} sub={`${db.counts.kpopGroups}개 그룹`} />
                  <StatCard label="해먹기 메뉴" value={db.counts.cookMenus} />
                  <StatCard label="시켜먹기 메뉴" value={db.counts.orderMenus} />
                  <StatCard label="셰프" value={db.counts.chefs} sub={`퀴즈 ${db.counts.foodTrivia}개`} />
                </div>

                {/* Preview sections */}
                <DbSection title="🎤 K-pop 아이돌" items={db.preview.kpopIdols} renderItem={(item) => (
                  <span>{item.emoji} {item.name} <span className="text-gray-400">({item.group})</span></span>
                )} />
                <DbSection title="🍳 해먹기 메뉴" items={db.preview.cookMenus} renderItem={(item) => (
                  <span>{item.emoji} {item.name} <span className="text-gray-400 text-xs">— {item.reason}</span></span>
                )} />
                <DbSection title="🛵 시켜먹기 메뉴" items={db.preview.orderMenus} renderItem={(item) => (
                  <span>{item.emoji} {item.name} <span className="text-gray-400 text-xs">— {item.reason}</span></span>
                )} />
                <DbSection title="👨‍🍳 흑백요리사 셰프" items={db.preview.chefs} renderItem={(item) => (
                  <span>{item.emoji} {item.name} <span className="text-gray-400">({item.specialty})</span></span>
                )} />
                <DbSection title="🎯 음식 퀴즈" items={db.preview.foodTrivia} renderItem={(item) => (
                  <span>{item.emoji} {item.question}</span>
                )} />
              </>
            )}
          </div>
        )}

        {/* ── Trends Tab ────────────────────────────────────────────────────── */}
        {activeTab === 'trends' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <SectionTitle>🔥 트렌드 메뉴 관리</SectionTitle>
              <button
                onClick={aiRefresh}
                disabled={aiRefreshing}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
              >
                {aiRefreshing ? '⏳ AI 분석 중...' : '✨ AI 트렌드 갱신'}
              </button>
            </div>

            {/* Manual add */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">수동 추가</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newTrend.name}
                  onChange={(e) => setNewTrend((p) => ({ ...p, name: e.target.value }))}
                  placeholder="메뉴명*"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  value={newTrend.category}
                  onChange={(e) => setNewTrend((p) => ({ ...p, category: e.target.value }))}
                  placeholder="카테고리"
                  className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="text"
                  value={newTrend.reason}
                  onChange={(e) => setNewTrend((p) => ({ ...p, reason: e.target.value }))}
                  placeholder="트렌딩 이유"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  onClick={addTrend}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                  추가
                </button>
              </div>
            </div>

            {trendsLoading && <p className="text-gray-500 text-sm">로딩 중...</p>}

            {/* Trends list */}
            {trends.length === 0 && !trendsLoading && (
              <div className="text-center py-12 text-gray-400">
                <p>트렌드 데이터가 없습니다.</p>
                <p className="text-sm mt-1">AI 갱신 또는 수동 추가로 데이터를 추가하세요.</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {trends.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800">{t.name}</span>
                      {t.category && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          {t.category}
                        </span>
                      )}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          t.source === 'ai'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {t.source === 'ai' ? '🤖 AI' : '✍️ 수동'}
                      </span>
                    </div>
                    {t.reason && (
                      <p className="text-sm text-gray-500 mt-1 truncate">{t.reason}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(t.addedAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeTrend(t.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none flex-shrink-0"
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Helper component ───────────────────────────────────────────────────────────

function DbSection<T>({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const visible = open ? items : items.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {visible.map((item, i) => (
          <li key={i} className="text-sm text-gray-700">
            {renderItem(item)}
          </li>
        ))}
      </ul>
      {items.length > 5 && (
        <button
          onClick={() => setOpen((p) => !p)}
          className="mt-2 text-xs text-orange-500 hover:text-orange-600 transition-colors"
        >
          {open ? '접기 ▲' : `더 보기 (${items.length - 5}개 더) ▼`}
        </button>
      )}
      {items.length === 0 && (
        <p className="text-sm text-gray-400">검색 결과가 없습니다.</p>
      )}
    </div>
  );
}
