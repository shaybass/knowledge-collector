import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { KnowledgeItem } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<KnowledgeItem | { error: string }>> {
  try {
    const { id } = params;

    const { data: item, error } = await supabaseAdmin
      .from('knowledge_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
