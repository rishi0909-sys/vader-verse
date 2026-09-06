import { NextResponse } from 'next/server';
import { getCommunity } from '@/services/communityService';
import { searchGame } from '@/services/rawgService';

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+ compatibility)
    const resolvedParams = await Promise.resolve(context.params);
    const slug = resolvedParams.slug;
    
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    const community = await getCommunity(slug);

    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }
    
    // Fetch live RAWG data to theme the community
    const rawgData = await searchGame(slug);
    
    // Merge the RAWG data into the response payload
    const enrichedCommunity = {
      ...community,
      rawgData: rawgData || null
    };

    return NextResponse.json(enrichedCommunity);
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
