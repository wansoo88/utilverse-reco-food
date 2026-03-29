'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { searchIdols, getIdolName, type KpopIdol } from '@/data/kpopIdols';

interface KpopIdolSearchProps {
  lang: string;
  onSelect: (idol: KpopIdol) => void;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void; // Enter 키 또는 검색 트리거
}

const LABELS: Record<string, { placeholder: string; noResult: string }> = {
  ko: { placeholder: '아이돌 이름을 검색하세요', noResult: '검색 결과가 없어요' },
  en: { placeholder: 'Search idol name', noResult: 'No results found' },
  ja: { placeholder: 'アイドル名を検索', noResult: '結果が見つかりません' },
  zh: { placeholder: '搜索偶像名字', noResult: '未找到结果' },
};

export const KpopIdolSearch = ({ lang, onSelect, placeholder, value, onChange, onSearch }: KpopIdolSearchProps) => {
  const [query, setQuery] = useState(value ?? '');
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const labels = LABELS[lang] ?? LABELS.ko;
  const locale = (lang as 'ko' | 'en' | 'ja' | 'zh') || 'ko';

  // 외부 value 동기화
  useEffect(() => {
    if (value !== undefined) setQuery(value);
  }, [value]);

  const results = useMemo(() => {
    if (query.trim().length < 1) return [];
    return searchIdols(query, locale).slice(0, 8);
  }, [query, locale]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (idol: KpopIdol) => {
    const name = getIdolName(idol, lang);
    setQuery(name);
    onChange?.(name);
    setShowDropdown(false);
    onSelect(idol);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange?.(e.target.value);
          setShowDropdown(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setShowDropdown(false);
            onSearch?.();
          }
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder ?? labels.placeholder}
        maxLength={50}
        className="w-full rounded-2xl border border-gray-200 px-5 py-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
      />

      {/* 자동완성 드롭다운 */}
      {showDropdown && query.trim().length >= 1 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-xs text-gray-400">{labels.noResult}</p>
          ) : (
            results.map((idol) => (
              <button
                key={idol.id}
                onClick={() => handleSelect(idol)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-pink-50 transition-colors"
              >
                <span className="text-lg">{idol.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{getIdolName(idol, lang)}</p>
                  <p className="text-[10px] text-gray-400">{idol.groupEn}</p>
                </div>
                {idol.favoriteMenus.length > 0 && (
                  <span className="shrink-0 rounded-full bg-pink-100 px-2 py-0.5 text-[10px] text-pink-700">
                    {idol.favoriteMenus[0]}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
