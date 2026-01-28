-- Knowledge Collector - Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create knowledge_items table
CREATE TABLE IF NOT EXISTS knowledge_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  source TEXT,
  platform TEXT DEFAULT 'other',
  content_type TEXT DEFAULT 'other',
  raw_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_items_created_at ON knowledge_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_platform ON knowledge_items(platform);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_tags ON knowledge_items USING GIN(tags);

-- Create text search index
CREATE INDEX IF NOT EXISTS idx_knowledge_items_search ON knowledge_items 
USING GIN(to_tsvector('hebrew', coalesce(title, '') || ' ' || coalesce(summary, '')));

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_knowledge_items_updated_at
  BEFORE UPDATE ON knowledge_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (for future multi-user support)
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;

-- For MVP: Allow all operations (single user)
CREATE POLICY "Allow all operations for MVP" ON knowledge_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sample data for testing (optional)
-- INSERT INTO knowledge_items (url, title, summary, tags, source, platform, content_type)
-- VALUES 
--   ('https://youtube.com/watch?v=example1', 'איך לבנות MVP בשבוע', 'מדריך מקיף לבניית מוצר מינימלי עם דגש על מהירות ותמורה מהירה מהשוק.', ARRAY['סטארטאפ', 'MVP', 'יזמות'], 'דני כהן', 'youtube', 'video'),
--   ('https://medium.com/article/example2', 'עקרונות עיצוב למובייל', 'סקירה של 10 עקרונות עיצוב חיוניים לאפליקציות מובייל מודרניות.', ARRAY['עיצוב', 'UX', 'מובייל'], 'שרה לוי', 'medium', 'article');
