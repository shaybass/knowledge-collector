import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { processWithAI } from '@/lib/ai';
import { SaveResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<SaveResponse>> {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Check for duplicate
    const { data: existing } = await supabaseAdmin
      .from('knowledge_items')
      .select('id')
      .eq('url', url)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'URL already exists in your library' },
        { status: 409 }
      );
    }

    // Process with AI
    const aiResult = await processWithAI(url);

    // Save to database
    const { data: item, error } = await supabaseAdmin
      .from('knowledge_items')
      .insert({
        url,
        title: aiResult.title,
        summary: aiResult.summary,
        tags: aiResult.tags,
        source: aiResult.source,
        platform: aiResult.platform,
        content_type: aiResult.content_type,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
