import { create } from 'zustand';

interface FilterStore {
  selectedIdols: string[];
  selectedCategories: string[];
  searchKeyword: string;
  setSelectedIdols: (idols: string[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSearchKeyword: (keyword: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedIdols: [],
  selectedCategories: [],
  searchKeyword: '',
  setSelectedIdols: (idols) => set({ selectedIdols: idols }),
  setSelectedCategories: (categories) =>
    set({ selectedCategories: categories }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  resetFilters: () =>
    set({ selectedIdols: [], selectedCategories: [], searchKeyword: '' }),
}));
