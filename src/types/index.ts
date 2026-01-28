// Knowledge Item - the core data model
export interface KnowledgeItem {
  id: string;
  url: string;
  title: string;
  summary: string;
  tags: string[];
  source: string;
  platform: string;
  content_type: 'article' | 'video' | 'audio' | 'post' | 'other';
  created_at: string;
  raw_content?: string;
}

// API Response types
export interface SaveResponse {
  success: boolean;
  item?: KnowledgeItem;
  error?: string;
}

export interface ListResponse {
  items: KnowledgeItem[];
  hasMore: boolean;
  nextPage?: number;
  total: number;
}

// Filter state
export interface FilterState {
  search: string;
  tags: string[];
  platforms: string[];
  sources: string[];
}

// AI Processing result
export interface AIProcessingResult {
  title: string;
  summary: string;
  tags: string[];
  source: string;
  platform: string;
  content_type: 'article' | 'video' | 'audio' | 'post' | 'other';
}

// Platform detection
export type PlatformType = 
  | 'youtube'
  | 'twitter'
  | 'linkedin'
  | 'medium'
  | 'substack'
  | 'spotify'
  | 'podcast'
  | 'news'
  | 'blog'
  | 'other';
