'use client';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KnowledgeItem, ListResponse, SaveResponse, FilterState } from '@/types';

const API_BASE = '/api';

// Fetch items with filters
async function fetchItems(
  page: number,
  filters: Partial<FilterState>
): Promise<ListResponse> {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  
  if (filters.search) params.set('search', filters.search);
  if (filters.tags?.length) params.set('tags', filters.tags.join(','));
  if (filters.platforms?.length) params.set('platforms', filters.platforms.join(','));
  if (filters.sources?.length) params.set('sources', filters.sources.join(','));

  const response = await fetch(`${API_BASE}/items?${params}`);
  if (!response.ok) throw new Error('Failed to fetch items');
  return response.json();
}

// Hook for infinite scroll items list
export function useItems(filters: Partial<FilterState>) {
  return useInfiniteQuery({
    queryKey: ['items', filters],
    queryFn: ({ pageParam = 1 }) => fetchItems(pageParam, filters),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
}

// Hook for single item
export function useItem(id: string) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/items/${id}`);
      if (!response.ok) throw new Error('Failed to fetch item');
      return response.json() as Promise<KnowledgeItem>;
    },
    enabled: !!id,
  });
}

// Hook for saving new item
export function useSaveItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string): Promise<SaveResponse> => {
      const response = await fetch(`${API_BASE}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate items list to refetch
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
    },
  });
}

// Hook for tags
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/tags`);
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      return data.tags as string[];
    },
  });
}

// Hook for platforms
export function usePlatforms() {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/platforms`);
      if (!response.ok) throw new Error('Failed to fetch platforms');
      const data = await response.json();
      return data.platforms as string[];
    },
  });
}
