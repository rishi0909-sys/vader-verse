import { notFound } from 'next/navigation';
import { getCommunity } from '@/services/communityService';
import CommunityClient from '@/components/community/CommunityClient';
import ReadySignal from '@/components/loading/ReadySignal';

// Disable static generation because we want real-time resolution (and eventual DB integration)
export const dynamic = 'force-dynamic';

export default async function CommunityPage(props: { params: Promise<{ game: string }> | { game: string } }) {
  // Await params to support Next.js 15+ async params
  const resolvedParams = await Promise.resolve(props.params);
  const game = resolvedParams.game;
  
  if (!game) {
    notFound();
  }

  const community = await getCommunity(game);

  if (!community) {
    notFound();
  }

  return (
    <>
      <ReadySignal />
      <CommunityClient community={community} />
    </>
  );
}
