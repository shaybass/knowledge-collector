import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ListResponse } from '@/types';

const PAGE_SIZE = 20;

export async function GET(request: NextRequest): Promise<NextResponse<ListResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const platforms = searchParams.get('platforms')?.split(',').filter(Boolean) || [];
    const sources = searchParams.get('sources')?.split(',').filter(Boolean) || [];
    const page = parseInt(searchParams.get('page') || '1', 10);

    // Build query
    let query = supabaseAdmin
      .from('knowledge_items')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
    }

    // Apply tag filter (items containing ANY of the selected tags)
    if (tags.length > 0) {
      query = query.overlaps('tags', tags);
    }

    // Apply platform filter
    if (platforms.length > 0) {
      query = query.in('platform', platforms);
    }

    // Apply source filter
    if (sources.length > 0) {
      query = query.in('source', sources);
    }

    // Order by date and paginate
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data: items, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { items: [], hasMore: false, total: 0 },
        { status: 500 }
      );
    }

    const total = count || 0;
    const hasMore = from + PAGE_SIZE < total;

    return NextResponse.json({
      items: items || [],
      hasMore,
      nextPage: hasMore ? page + 1 : undefined,
      total,
    });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      { items: [], hasMore: false, total: 0 },
      { status: 500 }
    );
  }
}
