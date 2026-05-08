'use client';
import { create } from 'zustand';
import { ALL_MODELS, ALL_PROVIDERS, Capability, ModelInfo, ProviderInfo } from '@/lib/providers';

interface ModelsPageState {
  providers: ProviderInfo[];
  models: ModelInfo[];
  filteredModels: ModelInfo[];
  selectedProviders: string[];
  selectedCapabilities: Capability[];
  contextRange: [number, number];
  priceRange: [number, number];
  searchQuery: string;
  viewMode: 'grid' | 'list';
  expandedModel: string | null;
  compareList: string[];
  isFilterOpen: boolean;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'context' | 'provider';
  configModalProvider: string | null;

  applyFilters: () => void;
  setSearchQuery: (q: string) => void;
  toggleProvider: (id: string) => void;
  toggleCapability: (c: Capability) => void;
  setContextRange: (r: [number, number]) => void;
  setPriceRange: (r: [number, number]) => void;
  setSortBy: (s: ModelsPageState['sortBy']) => void;
  setViewMode: (m: 'grid' | 'list') => void;
  setExpandedModel: (id: string | null) => void;
  toggleCompare: (id: string) => void;
  resetFilters: () => void;
  setIsFilterOpen: (v: boolean) => void;
  setConfigModalProvider: (id: string | null) => void;
}

export const useModelsPageStore = create<ModelsPageState>((set, get) => ({
  providers: ALL_PROVIDERS,
  models: ALL_MODELS,
  filteredModels: ALL_MODELS,
  selectedProviders: [],
  selectedCapabilities: [],
  contextRange: [0, 10000000],
  priceRange: [0, 100],
  searchQuery: '',
  viewMode: 'grid',
  expandedModel: null,
  compareList: [],
  isFilterOpen: false,
  sortBy: 'name',
  configModalProvider: null,

  applyFilters: () => {
    const s = get();
    let list = [...s.models];
    if (s.selectedProviders.length > 0) list = list.filter(m => s.selectedProviders.includes(m.providerId));
    if (s.selectedCapabilities.length > 0) list = list.filter(m => s.selectedCapabilities.some(c => m.capabilities.includes(c)));
    list = list.filter(m => m.context >= s.contextRange[0] && m.context <= s.contextRange[1]);
    list = list.filter(m => {
      const p = m.inputPrice ?? 0;
      return p >= s.priceRange[0] && p <= s.priceRange[1];
    });
    if (s.searchQuery.trim()) {
      const q = s.searchQuery.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.providerId.toLowerCase().includes(q));
    }
    switch (s.sortBy) {
      case 'price-asc': list.sort((a, b) => (a.inputPrice ?? 0) - (b.inputPrice ?? 0)); break;
      case 'price-desc': list.sort((a, b) => (b.inputPrice ?? 0) - (a.inputPrice ?? 0)); break;
      case 'context': list.sort((a, b) => b.context - a.context); break;
      case 'provider': list.sort((a, b) => a.providerId.localeCompare(b.providerId)); break;
      default: list.sort((a, b) => a.name.localeCompare(b.name));
    }
    set({ filteredModels: list });
  },

  setSearchQuery: (q) => { set({ searchQuery: q }); get().applyFilters(); },
  toggleProvider: (id) => {
    set(s => ({ selectedProviders: s.selectedProviders.includes(id) ? s.selectedProviders.filter(p => p !== id) : [...s.selectedProviders, id] }));
    get().applyFilters();
  },
  toggleCapability: (c) => {
    set(s => ({ selectedCapabilities: s.selectedCapabilities.includes(c) ? s.selectedCapabilities.filter(x => x !== c) : [...s.selectedCapabilities, c] }));
    get().applyFilters();
  },
  setContextRange: (r) => { set({ contextRange: r }); get().applyFilters(); },
  setPriceRange: (r) => { set({ priceRange: r }); get().applyFilters(); },
  setSortBy: (s) => { set({ sortBy: s }); get().applyFilters(); },
  setViewMode: (m) => set({ viewMode: m }),
  setExpandedModel: (id) => set({ expandedModel: id }),
  toggleCompare: (id) => set(s => ({
    compareList: s.compareList.includes(id)
      ? s.compareList.filter(x => x !== id)
      : s.compareList.length < 4 ? [...s.compareList, id] : s.compareList
  })),
  resetFilters: () => {
    set({ selectedProviders: [], selectedCapabilities: [], contextRange: [0, 10000000], priceRange: [0, 100], searchQuery: '' });
    get().applyFilters();
  },
  setIsFilterOpen: (v) => set({ isFilterOpen: v }),
  setConfigModalProvider: (id) => set({ configModalProvider: id }),
}));
