'use client';

import { ReactNode } from 'react';
import {
  BookOpen,
  Youtube,
  Twitter,
  Linkedin,
  FileText,
  Podcast,
  Music,
  Newspaper,
  Globe,
  ExternalLink,
  X,
  Search,
  Filter,
  ChevronLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { KnowledgeItem } from '@/types';

// Platform icon mapping
export function PlatformIcon({ platform, className = 'w-4 h-4' }: { platform: string; className?: string }) {
  const icons: Record<string, ReactNode> = {
    youtube: <Youtube className={className} />,
    twitter: <Twitter className={className} />,
    linkedin: <Linkedin className={className} />,
    medium: <FileText className={className} />,
    substack: <FileText className={className} />,
    spotify: <Music className={className} />,
    podcast: <Podcast className={className} />,
    news: <Newspaper className={className} />,
    blog: <Globe className={className} />,
  };
  return <>{icons[platform] || <BookOpen className={className} />}</>;
}

// Platform badge with color
export function PlatformBadge({ platform }: { platform: string }) {
  const platformNames: Record<string, string> = {
    youtube: 'יוטיוב',
    twitter: 'טוויטר',
    linkedin: 'לינקדאין',
    medium: 'מדיום',
    substack: 'סאבסטאק',
    spotify: 'ספוטיפי',
    podcast: 'פודקאסט',
    news: 'חדשות',
    blog: 'בלוג',
    other: 'אחר',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium badge-${platform}`}>
      <PlatformIcon platform={platform} className="w-3 h-3" />
      {platformNames[platform] || platform}
    </span>
  );
}

// Tag chip
export function TagChip({ tag, selected = false, onClick }: { tag: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 rounded-full text-sm transition-all
        ${selected 
          ? 'bg-primary-500 text-white' 
          : 'bg-surface-700/50 text-surface-300 hover:bg-surface-700'
        }
      `}
    >
      {tag}
    </button>
  );
}

// Knowledge card for library list
export function KnowledgeCard({ item, onClick }: { item: KnowledgeItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass-card w-full p-4 text-right transition-all hover:scale-[1.02] hover:border-primary-500/30 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display font-semibold text-surface-100 line-clamp-2 flex-1">
          {item.title}
        </h3>
        <PlatformBadge platform={item.platform} />
      </div>
      
      <p className="text-sm text-surface-400 line-clamp-2 mb-3">
        {item.summary}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {item.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-surface-700/50 rounded-full text-xs text-surface-400">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-surface-500">
          {format(new Date(item.created_at), 'd MMM', { locale: he })}
        </span>
      </div>
    </button>
  );
}

// Search input
export function SearchInput({ value, onChange, placeholder = 'חיפוש...' }: { 
  value: string; 
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl py-3 pr-11 pl-4 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-primary-500/50 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Header with back button
export function Header({ title, onBack, action }: { 
  title: string; 
  onBack?: () => void;
  action?: ReactNode;
}) {
  return (
    <header className="safe-top sticky top-0 z-50 bg-surface-900/80 backdrop-blur-lg border-b border-surface-800">
      <div className="flex items-center justify-between px-4 py-3">
        {onBack ? (
          <button onClick={onBack} className="p-2 -mr-2 text-surface-400 hover:text-surface-200">
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <h1 className="font-display font-bold text-lg text-surface-100">{title}</h1>
        {action || <div className="w-10" />}
      </div>
    </header>
  );
}

// Filter button
export function FilterButton({ active, count, onClick }: { active: boolean; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl transition-all
        ${active 
          ? 'bg-primary-500 text-white' 
          : 'bg-surface-800/50 border border-surface-700/50 text-surface-300 hover:border-surface-600'
        }
      `}
    >
      <Filter className="w-4 h-4" />
      <span className="text-sm font-medium">סינון</span>
      {count > 0 && (
        <span className={`px-1.5 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-primary-500 text-white'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// Loading state
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`spinner ${sizes[size]}`} />
  );
}

// Empty state
export function EmptyState({ title, description, icon }: { title: string; description: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-800 flex items-center justify-center mb-4">
        {icon || <BookOpen className="w-10 h-10 text-surface-600" />}
      </div>
      <h3 className="font-display font-semibold text-lg text-surface-300 mb-2">{title}</h3>
      <p className="text-surface-500 text-sm max-w-xs">{description}</p>
    </div>
  );
}

// Success state
export function SuccessState({ title, description, action }: { 
  title: string; 
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center fade-in-up">
      <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-primary-500" />
      </div>
      <h2 className="font-display font-bold text-xl text-surface-100 mb-2">{title}</h2>
      <p className="text-surface-400 text-sm max-w-xs mb-8">{description}</p>
      {action}
    </div>
  );
}

// Processing state
export function ProcessingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-ping" />
        <div className="relative w-24 h-24 rounded-full bg-primary-500/20 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-primary-500 animate-pulse" />
        </div>
      </div>
      <h2 className="font-display font-bold text-xl text-surface-100 mb-2">מעבד את התוכן</h2>
      <p className="text-surface-400 text-sm">AI מנתח ומחלץ את הידע...</p>
    </div>
  );
}

// Error state
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="font-display font-semibold text-lg text-surface-300 mb-2">שגיאה</h3>
      <p className="text-surface-500 text-sm max-w-xs mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-surface-800 hover:bg-surface-700 rounded-xl text-surface-200 transition-colors"
        >
          נסה שוב
        </button>
      )}
    </div>
  );
}

// Primary button
export function PrimaryButton({ children, onClick, disabled, loading }: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-700 disabled:text-surface-500 rounded-xl font-display font-semibold text-white transition-all active:scale-[0.98]"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
      ) : children}
    </button>
  );
}

// External link button
export function ExternalLinkButton({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full py-4 bg-surface-800 hover:bg-surface-700 border border-surface-700 rounded-xl font-display font-medium text-surface-200 transition-all active:scale-[0.98]"
    >
      <ExternalLink className="w-5 h-5" />
      פתח מקור
    </a>
  );
}
