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
    if (cat === '전체') {
      setSelectedCategories([]);
      return;
    }
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
    <div className="mb-5 space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* 카테고리 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-14 shrink-0 text-xs font-semibold text-gray-500">카테고리</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              isCategoryActive(cat)
                ? 'bg-[#CCFF00] text-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 아이돌 */}
      {idolList.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-14 shrink-0 text-xs font-semibold text-gray-500">아이돌</span>
          {idolList.map((idol) => (
            <button
              key={idol}
              onClick={() => toggleIdol(idol)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedIdols.includes(idol)
                  ? 'bg-[#CCFF00] text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
