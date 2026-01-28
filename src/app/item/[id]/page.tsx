'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar, User, ExternalLink } from 'lucide-react';
import { useItem } from '@/hooks/useKnowledge';
import {
  Header,
  PlatformBadge,
  TagChip,
  ExternalLinkButton,
  LoadingSpinner,
  ErrorState,
} from '@/components/ui';

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: item, isLoading, error } = useItem(params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-surface-900">
        <Header title="פרטי ידע" onBack={() => router.back()} />
        <ErrorState message="לא מצאנו את הפריט הזה" />
      </div>
    );
  }

  const formattedDate = format(new Date(item.created_at), 'EEEE, d בMMMM yyyy', { locale: he });

  return (
    <div className="min-h-screen bg-surface-900">
      <Header title="פרטי ידע" onBack={() => router.back()} />

      <main className="px-4 py-6 pb-safe space-y-6">
        {/* Title & Platform */}
        <section className="fade-in-up">
          <div className="flex items-start justify-between gap-3 mb-2">
            <PlatformBadge platform={item.platform} />
          </div>
          <h1 className="font-display font-bold text-2xl text-surface-100 leading-tight">
            {item.title}
          </h1>
        </section>

        {/* Meta info */}
        <section className="flex flex-wrap gap-4 text-sm text-surface-400 fade-in-up stagger-1">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{item.source}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </section>

        {/* Tags */}
        <section className="fade-in-up stagger-2">
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="glass-card p-5 fade-in-up stagger-3">
          <h2 className="font-display font-semibold text-surface-200 mb-3">תקציר</h2>
          <p className="text-surface-300 leading-relaxed">
            {item.summary}
          </p>
        </section>

        {/* Open Source Button */}
        <section className="pt-4 fade-in-up stagger-4">
          <ExternalLinkButton url={item.url} />
        </section>

        {/* URL display */}
        <section className="fade-in-up stagger-5">
          <p className="text-xs text-surface-500 text-center truncate px-4" dir="ltr">
            {item.url}
          </p>
        </section>
      </main>
    </div>
  );
}
