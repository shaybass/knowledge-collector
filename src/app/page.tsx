'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useInView } from '@/hooks/useInView';
import { BookOpen, Plus } from 'lucide-react';
import { useItems, useTags, usePlatforms } from '@/hooks/useKnowledge';
import {
  Header,
  SearchInput,
  FilterButton,
  KnowledgeCard,
  EmptyState,
  LoadingSpinner,
} from '@/components/ui';
import { FilterState } from '@/types';
import FilterOverlay from '@/components/FilterOverlay';

export default function LibraryPage() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tags: [],
    platforms: [],
    sources: [],
  });

  const { ref: loadMoreRef, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useItems(filters);

  const { data: allTags } = useTags();
  const { data: allPlatforms } = usePlatforms();

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Count active filters
  const activeFilterCount = filters.tags.length + filters.platforms.length + filters.sources.length;

  // All items flattened
  const items = data?.pages.flatMap((page) => page.items) || [];
  const total = data?.pages[0]?.total || 0;

  const handleItemClick = (id: string) => {
    router.push(`/item/${id}`);
  };

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  return (
    <div className="min-h-screen bg-surface-900">
      <Header 
        title="הספריה שלי" 
        action={
          <button 
            onClick={() => router.push('/share')}
            className="p-2 -ml-2 text-primary-500"
          >
            <Plus className="w-6 h-6" />
          </button>
        }
      />

      <main className="px-4 py-4 pb-safe">
        {/* Search & Filter */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <SearchInput
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="חיפוש בידע שלי..."
            />
          </div>
          <FilterButton
            active={activeFilterCount > 0}
            count={activeFilterCount}
            onClick={() => setShowFilter(true)}
          />
        </div>

        {/* Results count */}
        {!isLoading && total > 0 && (
          <p className="text-surface-500 text-sm mb-4">
            {total} פריטי ידע
          </p>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <EmptyState
            title="שגיאה בטעינה"
            description="לא הצלחנו לטעון את הספריה"
            icon={<BookOpen className="w-10 h-10 text-red-500" />}
          />
        ) : items.length === 0 ? (
          <EmptyState
            title={filters.search || activeFilterCount > 0 ? 'לא נמצאו תוצאות' : 'הספריה ריקה'}
            description={
              filters.search || activeFilterCount > 0
                ? 'נסה לשנות את החיפוש או הסינון'
                : 'שתף לינק מכל אפליקציה כדי להתחיל לאסוף ידע'
            }
          />
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="fade-in-up"
                style={{ animationDelay: `${(index % 10) * 0.05}s` }}
              >
                <KnowledgeCard
                  item={item}
                  onClick={() => handleItemClick(item.id)}
                />
              </div>
            ))}

            {/* Load more trigger */}
            <div ref={loadMoreRef} className="py-4 flex justify-center">
              {isFetchingNextPage && <LoadingSpinner size="sm" />}
            </div>
          </div>
        )}
      </main>

      {/* Filter Overlay */}
      <FilterOverlay
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onFiltersChange={setFilters}
        availableTags={allTags || []}
        availablePlatforms={allPlatforms || []}
      />
    </div>
  );
}
