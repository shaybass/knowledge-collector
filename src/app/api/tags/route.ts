import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(): Promise<NextResponse<{ tags: string[] }>> {
  try {
    const { data: items, error } = await supabaseAdmin
      .from('knowledge_items')
      .select('tags');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ tags: [] }, { status: 500 });
    }

    // Flatten and dedupe tags
    const allTags = items?.flatMap(item => item.tags || []) || [];
    const uniqueTags = [...new Set(allTags)].sort();

    return NextResponse.json({ tags: uniqueTags });
  } catch (error) {
    console.error('Tags error:', error);
    return NextResponse.json({ tags: [] }, { status: 500 });
  }
}
