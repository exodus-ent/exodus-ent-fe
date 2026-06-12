'use client';

import { useEffect, useState } from 'react';
import { useFilterStore } from '@/store/useFilterStore';
import { createClient } from '@/lib/supabase';

const CATEGORIES = ['전체', '방송', '콘서트', '팬싸인회', '발매'] as const;

export default function FilterBar() {
  const { selectedCategories, selectedIdols, setSelectedCategories, setSelectedIdols, resetFilters } =
    useFilterStore();
  const [idolList, setIdolList] = useState<string[]>([]);

  useEffect(() => {
    createClient()
      .from('idols')
      .select('name')
      .order('name')
      .then(({ data }) => {
        setIdolList(data?.map((r) => r.name) ?? []);
      });
  }, []);

  const toggleCategory = (cat: string) => {
    if (cat === '전체') { setSelectedCategories([]); return; }
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(next);
  };

  const toggleIdol = (idol: string) => {
    const next = selectedIdols.includes(idol)
      ? selectedIdols.filter((i) => i !== idol)
      : [...selectedIdols, idol];
    setSelectedIdols(next);
  };

  const isCategoryActive = (cat: string) =>
    cat === '전체' ? selectedCategories.length === 0 : selectedCategories.includes(cat);

  const hasActiveFilters = selectedCategories.length > 0 || selectedIdols.length > 0;

  return (
    <div className="mb-5 space-y-3 border border-white/10 bg-[#111] p-4">
      {/* 카테고리 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-14 shrink-0 text-xs font-semibold text-white/40">카테고리</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`px-3 py-1 text-sm font-medium transition-colors ${
              isCategoryActive(cat)
                ? 'bg-[#CCFF00] text-black'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 아이돌 */}
      {idolList.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-14 shrink-0 text-xs font-semibold text-white/40">아이돌</span>
          {idolList.map((idol) => (
            <button
              key={idol}
              onClick={() => toggleIdol(idol)}
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                selectedIdols.includes(idol)
                  ? 'bg-[#CCFF00] text-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {idol}
            </button>
          ))}
        </div>
      )}

      {/* 초기화 */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={resetFilters}
            className="text-xs text-white/30 underline underline-offset-2 hover:text-white/60"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
