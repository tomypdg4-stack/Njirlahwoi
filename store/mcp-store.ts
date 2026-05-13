'use client';

import { create } from 'zustand';
import { ALL_MCP_SERVERS, type MCPCategory, type MCPServer } from '@/lib/mcp-servers';

type SortKey = 'featured' | 'stars' | 'name' | 'newest' | 'tools';

interface MCPStoreState {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategories: MCPCategory[];
  toggleCategory: (c: MCPCategory) => void;
  showOfficialOnly: boolean;
  setShowOfficialOnly: (v: boolean) => void;
  showRemoteOnly: boolean;
  setShowRemoteOnly: (v: boolean) => void;
  sortBy: SortKey;
  setSortBy: (s: SortKey) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (v: 'grid' | 'list') => void;
  selectedServer: string | null;
  setSelectedServer: (id: string | null) => void;
  resetFilters: () => void;
}

export function getFilteredServers(state: MCPStoreState): MCPServer[] {
  const { searchQuery, selectedCategories, showOfficialOnly, showRemoteOnly, sortBy } = state;
  let results = [...ALL_MCP_SERVERS];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    results = results.filter((s: MCPServer) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.author.toLowerCase().includes(q) ||
      s.tags.some((t: string) => t.includes(q))
    );
  }
  if (selectedCategories.length > 0) {
    results = results.filter((s: MCPServer) => selectedCategories.includes(s.category));
  }
  if (showOfficialOnly) results = results.filter((s: MCPServer) => s.isOfficial);
  if (showRemoteOnly) results = results.filter((s: MCPServer) => s.isRemote);

  switch (sortBy) {
    case 'featured':
      results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.stars - a.stars);
      break;
    case 'stars':
      results.sort((a, b) => b.stars - a.stars);
      break;
    case 'name':
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.stars - a.stars);
      break;
    case 'tools':
      results.sort((a, b) => b.tools - a.tools);
      break;
  }
  return results;
}

export const useMCPStore = create<MCPStoreState>((set) => ({
  searchQuery: '',
  setSearchQuery: (q: string) => set({ searchQuery: q }),
  selectedCategories: [],
  toggleCategory: (c: MCPCategory) => set((s) => ({
    selectedCategories: s.selectedCategories.includes(c)
      ? s.selectedCategories.filter((x: MCPCategory) => x !== c)
      : [...s.selectedCategories, c],
  })),
  showOfficialOnly: false,
  setShowOfficialOnly: (v: boolean) => set({ showOfficialOnly: v }),
  showRemoteOnly: false,
  setShowRemoteOnly: (v: boolean) => set({ showRemoteOnly: v }),
  sortBy: 'featured',
  setSortBy: (s: SortKey) => set({ sortBy: s }),
  viewMode: 'grid',
  setViewMode: (v: 'grid' | 'list') => set({ viewMode: v }),
  selectedServer: null,
  setSelectedServer: (id: string | null) => set({ selectedServer: id }),
  resetFilters: () => set({
    searchQuery: '',
    selectedCategories: [],
    showOfficialOnly: false,
    showRemoteOnly: false,
    sortBy: 'featured' as SortKey,
  }),
}));
