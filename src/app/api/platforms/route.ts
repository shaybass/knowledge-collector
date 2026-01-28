import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(): Promise<NextResponse<{ platforms: string[] }>> {
  try {
    const { data: items, error } = await supabaseAdmin
      .from('knowledge_items')
      .select('platform')
      .not('platform', 'is', null);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ platforms: [] }, { status: 500 });
    }

    // Get unique platforms
    const platformSet = new Set(items?.map(item => item.platform) || []);
    const platforms = Array.from(platformSet).sort();

    return NextResponse.json({ platforms });
  } catch (error) {
    console.error('Platforms error:', error);
    return NextResponse.json({ platforms: [] }, { status: 500 });
  }
}
