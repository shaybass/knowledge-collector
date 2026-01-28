'use client';

import { X, RotateCcw } from 'lucide-react';
import { FilterState } from '@/types';
import { TagChip, PlatformBadge } from './ui';

interface FilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableTags: string[];
  availablePlatforms: string[];
}

export default function FilterOverlay({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableTags,
  availablePlatforms,
}: FilterOverlayProps) {
  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const togglePlatform = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];
    onFiltersChange({ ...filters, platforms: newPlatforms });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: filters.search,
      tags: [],
      platforms: [],
      sources: [],
    });
  };

  const hasActiveFilters = filters.tags.length > 0 || filters.platforms.length > 0;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-surface-900 rounded-t-3xl border-t border-surface-700 animate-slide-up max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800">
          <button onClick={onClose} className="p-2 -mr-2 text-surface-400">
            <X className="w-6 h-6" />
          </button>
          <h2 className="font-display font-bold text-lg">סינון</h2>
          {hasActiveFilters ? (
            <button 
              onClick={clearFilters}
              className="p-2 -ml-2 text-primary-500 flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">נקה</span>
            </button>
          ) : (
            <div className="w-16" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 safe-bottom">
          {/* Tags Section */}
          {availableTags.length > 0 && (
            <section>
              <h3 className="font-display font-semibold text-surface-200 mb-3">תגיות</h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <TagChip
                    key={tag}
                    tag={tag}
                    selected={filters.tags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Platforms Section */}
          {availablePlatforms.length > 0 && (
            <section>
              <h3 className="font-display font-semibold text-surface-200 mb-3">פלטפורמה</h3>
              <div className="flex flex-wrap gap-2">
                {availablePlatforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`
                      px-3 py-2 rounded-xl border transition-all
                      ${filters.platforms.includes(platform)
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-surface-700 hover:border-surface-600'
                      }
                    `}
                  >
                    <PlatformBadge platform={platform} />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {availableTags.length === 0 && availablePlatforms.length === 0 && (
            <div className="text-center py-8 text-surface-500">
              אין אפשרויות סינון זמינות עדיין
            </div>
          )}
        </div>

        {/* Apply button */}
        <div className="p-5 border-t border-surface-800 safe-bottom">
          <button
            onClick={onClose}
            className="w-full py-4 bg-primary-500 hover:bg-primary-600 rounded-xl font-display font-semibold text-white transition-colors"
          >
            הצג תוצאות
          </button>
        </div>
      </div>
    </div>
  );
}
