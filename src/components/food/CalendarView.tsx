'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CalendarEntry } from '@/types/calendar';
import type { Locale } from '@/config/site';

interface InsightMessages {
  title: string;
  cookHeavy: string;
  orderHeavy: string;
  balanced: string;
  noData: string;
}

interface CalendarViewProps {
  entries: CalendarEntry[];
  lang: Locale;
  title: string;
  emptyLabel: string;
  cookLabel: string;
  orderLabel: string;
  weekLabel: string;
  monthLabel: string;
  deleteLabel: string;
  editLabel: string;
  saveLabel: string;
  cancelLabel: string;
  menuPlaceholder: string;
  reasonPlaceholder: string;
  insightMessages: InsightMessages;
  onDelete: (date: string) => void;
  onUpdate: (date: string, updates: Pick<CalendarEntry, 'menu' | 'reason' | 'type'>) => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 최근 N일 식단 패턴 분석
const analyzePattern = (entries: CalendarEntry[], days: number) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffKey = formatDateKey(cutoff);

  const recent = entries.filter((e) => e.date >= cutoffKey);
  const cookCount = recent.filter((e) => e.type === 'cook').length;
  const orderCount = recent.filter((e) => e.type === 'order').length;

  return { total: recent.length, cookCount, orderCount };
};

export const CalendarView = ({
  entries,
  lang,
  title,
  emptyLabel,
  cookLabel,
  orderLabel,
  weekLabel,
  monthLabel,
  deleteLabel,
  editLabel,
  saveLabel,
  cancelLabel,
  menuPlaceholder,
  reasonPlaceholder,
  insightMessages,
  onDelete,
  onUpdate,
}: CalendarViewProps) => {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const insight = useMemo(() => analyzePattern(entries, 7), [entries]);
  const [draftMenu, setDraftMenu] = useState('');
  const [draftReason, setDraftReason] = useState('');
  const today = useMemo(() => new Date(), []);
  const entryMap = useMemo(
    () => new Map(entries.map((entry) => [entry.date, entry])),
    [entries],
  );

  useEffect(() => {
    if (!editingDate) return;
    const entry = entryMap.get(editingDate);
    if (!entry) {
      setEditingDate(null);
      setDraftMenu('');
      setDraftReason('');
    }
  }, [editingDate, entryMap]);

  const days = useMemo(() => {
    if (view === 'week') {
      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today.getTime() + index * DAY_MS);
        const key = formatDateKey(date);

        return {
          key,
          label: new Intl.DateTimeFormat(lang, { weekday: 'short', month: 'numeric', day: 'numeric' }).format(date),
          entry: entryMap.get(key),
        };
      });
    }

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return Array.from({ length: lastDay.getDate() }, (_, index) => {
      const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), index + 1);
      const key = formatDateKey(date);

      return {
        key,
        label: new Intl.DateTimeFormat(lang, { month: 'numeric', day: 'numeric' }).format(date),
        entry: entryMap.get(key),
      };
    });
  }, [entryMap, lang, today, view]);

  const startEdit = (entry: CalendarEntry) => {
    setEditingDate(entry.date);
    setDraftMenu(entry.menu);
    setDraftReason(entry.reason);
  };

  const cancelEdit = () => {
    setEditingDate(null);
    setDraftMenu('');
    setDraftReason('');
  };

  const saveEdit = (entry: CalendarEntry) => {
    const menu = draftMenu.trim();
    const reason = draftReason.trim();
    if (!menu || !reason) return;

    onUpdate(entry.date, {
      menu,
      reason,
      type: entry.type,
    });
    cancelEdit();
  };

  // 인사이트 메시지 결정 — 최근 7일 패턴 기반
  const insightText = useMemo(() => {
    if (insight.total === 0) return insightMessages.noData;
    const cookRatio = insight.cookCount / insight.total;
    if (cookRatio >= 0.7) return insightMessages.cookHeavy.replace('{{count}}', String(insight.total));
    if (cookRatio <= 0.3) return insightMessages.orderHeavy.replace('{{count}}', String(insight.total));
    return insightMessages.balanced;
  }, [insight, insightMessages]);

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{emptyLabel}</p>
        </div>
        <div className="inline-flex rounded-full bg-gray-100 p-1 text-sm">
          <button
            onClick={() => setView('week')}
            className={`rounded-full px-3 py-1.5 transition-colors ${view === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            {weekLabel}
          </button>
          <button
            onClick={() => setView('month')}
            className={`rounded-full px-3 py-1.5 transition-colors ${view === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            {monthLabel}
          </button>
        </div>
      </div>
      {/* 식단 패턴 인사이트 */}
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2.5">
        <span className="text-xs font-semibold text-gray-500">{insightMessages.title}</span>
        <span className="text-xs text-gray-500">|</span>
        <p className="text-xs text-gray-600">{insightText}</p>
        {insight.total > 0 && (
          <div className="ml-auto flex shrink-0 gap-1.5">
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              🍳 {insight.cookCount}
            </span>
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
              🛵 {insight.orderCount}
            </span>
          </div>
        )}
      </div>
      <div className={`mt-4 grid gap-3 ${view === 'week' ? 'sm:grid-cols-2 xl:grid-cols-7' : 'sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7'}`}>
        {days.map((day) => {
          const entry = day.entry;

          return (
          <article key={day.key} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{day.label}</p>
              <div className="flex items-center gap-2">
                {entry && (
                  <button
                    onClick={() => startEdit(entry)}
                    className="text-xs font-medium text-gray-400 transition-colors hover:text-orange-500"
                  >
                    {editLabel}
                  </button>
                )}
                {entry && (
                  <button
                    onClick={() => onDelete(day.key)}
                    className="text-xs font-medium text-gray-400 transition-colors hover:text-red-500"
                  >
                    {deleteLabel}
                  </button>
                )}
              </div>
            </div>
            {entry && editingDate === day.key ? (
              <div className="mt-2 space-y-2">
                <input
                  value={draftMenu}
                  onChange={(event) => setDraftMenu(event.target.value)}
                  placeholder={menuPlaceholder}
                  maxLength={40}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-300"
                />
                <textarea
                  value={draftReason}
                  onChange={(event) => setDraftReason(event.target.value)}
                  placeholder={reasonPlaceholder}
                  maxLength={80}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-300"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(entry)}
                    className="flex-1 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    {saveLabel}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-gray-300"
                  >
                    {cancelLabel}
                  </button>
                </div>
              </div>
            ) : entry ? (
              <div className="mt-2 space-y-2">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${entry.type === 'cook' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                  {entry.type === 'cook' ? cookLabel : orderLabel}
                </span>
                <p className="text-sm font-semibold text-gray-900">{entry.menu}</p>
                <p className="text-xs leading-5 text-gray-500">{entry.reason}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-400">{emptyLabel}</p>
            )}
          </article>
        );
        })}
      </div>
    </section>
  );
};
