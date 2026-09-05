import { GameCommunity, CommunityEvent, Channel, EventType } from '@/types/community';

// Simple deterministic string hashing (cyrb53)
const hashString = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

// Deterministic PRNG based on hash
const seededRandom = (hash: number) => {
  return () => {
    hash ^= hash << 13;
    hash ^= hash >>> 17;
    hash ^= hash << 5;
    return (hash >>> 0) / 4294967296;
  };
};

const BASE_DATE = new Date('2024-01-01T00:00:00Z').getTime();

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #4f0000 0%, #000000 100%)',
  'linear-gradient(135deg, #001133 0%, #000000 100%)',
  'linear-gradient(135deg, #331100 0%, #000000 100%)',
  'linear-gradient(135deg, #110033 0%, #000000 100%)',
  'linear-gradient(135deg, #222222 0%, #000000 100%)',
];

export const STATIC_COMMUNITIES: Record<string, GameCommunity> = {
  'assassins-creed': {
    slug: 'assassins-creed',
    name: 'Assassins Creed',
    bannerImage: '/img/assasinscreed.jpeg',
    activePlayers: 12450,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'lore', name: 'Lore Discussion', type: 'text' },
      { id: 'spoilers', name: 'Spoilers', type: 'text', unreadCount: 5 }
    ]
  },
  'cyberpunk-2077': {
    slug: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    bannerImage: '/img/cbp.jpeg',
    activePlayers: 43200,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'builds', name: 'Builds & Chrome', type: 'text' },
      { id: 'mods', name: 'Modding', type: 'text', unreadCount: 12 }
    ]
  },
  'csgo': {
    slug: 'csgo',
    name: 'CS:GO',
    bannerImage: '/img/csgo.jpeg',
    activePlayers: 850000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'lfg', name: 'LFG Ranked', type: 'text', unreadCount: 30 },
      { id: 'tournaments', name: 'Tournaments', type: 'announcements' }
    ]
  },
  'rdr2': {
    slug: 'rdr2',
    name: 'Red Dead Redemption 2',
    bannerImage: '/img/rdr2.jpeg',
    activePlayers: 32000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'online', name: 'Red Dead Online', type: 'text' },
      { id: 'photography', name: 'Virtual Photography', type: 'text' }
    ]
  },
  'valorant': {
    slug: 'valorant',
    name: 'Valorant',
    bannerImage: '/img/valo.jpeg',
    activePlayers: 900000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'lfg-comp', name: 'LFG Competitive', type: 'text' },
      { id: 'clips', name: 'Clips & Highlights', type: 'text', unreadCount: 15 }
    ]
  },
  'elden-ring': {
    slug: 'elden-ring',
    name: 'Elden Ring',
    bannerImage: '/img/eldenring.jpeg',
    activePlayers: 450000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'builds', name: 'Builds & Lore', type: 'text' },
      { id: 'coop', name: 'Jolly Cooperation', type: 'text' }
    ]
  },
  'forbidden-west': {
    slug: 'forbidden-west',
    name: 'Horizon Forbidden West',
    bannerImage: '/img/forbiddenwest.jpeg',
    activePlayers: 80000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'photography', name: 'Photo Mode', type: 'text', unreadCount: 3 }
    ]
  },
  'forza': {
    slug: 'forza',
    name: 'Forza Horizon',
    bannerImage: '/img/forza.jpeg',
    activePlayers: 120000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'tunes', name: 'Tunes & Liveries', type: 'text' }
    ]
  },
  'gran-turismo': {
    slug: 'gran-turismo',
    name: 'Gran Turismo',
    bannerImage: '/img/gt.jpeg',
    activePlayers: 95000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'setup', name: 'Car Setups', type: 'text' }
    ]
  },
  'horizon': {
    slug: 'horizon',
    name: 'Horizon Zero Dawn',
    bannerImage: '/img/horizon.jpeg',
    activePlayers: 40000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'lore', name: 'Lore & Story', type: 'text' }
    ]
  },
  'last-of-us': {
    slug: 'last-of-us',
    name: 'The Last of Us',
    bannerImage: '/img/lastofus.jpeg',
    activePlayers: 110000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'factions', name: 'Factions MP', type: 'text', unreadCount: 8 }
    ]
  },
  'need-for-speed': {
    slug: 'need-for-speed',
    name: 'Need for Speed',
    bannerImage: '/img/nfs.jpeg',
    activePlayers: 65000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'crews', name: 'Crews', type: 'text' }
    ]
  },
  'overdrive': {
    slug: 'overdrive',
    name: 'Overdrive',
    bannerImage: '/img/od.jpeg',
    activePlayers: 12000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'lfg', name: 'LFG', type: 'text' }
    ]
  },
  'smash-karts': {
    slug: 'smash-karts',
    name: 'Smash Karts',
    bannerImage: '/img/smashkart.jpeg',
    activePlayers: 8000,
    channels: [
      { id: 'general', name: 'General', type: 'text' },
      { id: 'lobbies', name: 'Custom Lobbies', type: 'text' }
    ]
  }
};

export const generateDeterministicCommunity = (slug: string): GameCommunity => {
  const hash = hashString(slug);
  const rand = seededRandom(hash);
  
  const name = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const activePlayers = Math.floor(rand() * 50000) + 1000;
  const gradientIndex = Math.floor(rand() * FALLBACK_GRADIENTS.length);
  const fallbackGradient = FALLBACK_GRADIENTS[gradientIndex];

  // Dynamic channel generation based on slug heuristics
  const channels: Channel[] = [
    { id: 'general', name: 'General', type: 'text' }
  ];

  if (slug.includes('rpg') || slug.includes('souls') || slug.includes('ring') || slug.includes('witcher')) {
    channels.push({ id: 'builds', name: 'Builds & Loadouts', type: 'text' });
    channels.push({ id: 'bosses', name: 'Boss Strategies', type: 'text' });
    channels.push({ id: 'lore', name: 'Lore & Discussion', type: 'text' });
  } else if (slug.includes('strike') || slug.includes('duty') || slug.includes('valorant') || slug.includes('fps')) {
    channels.push({ id: 'lfg', name: 'LFG & Ranked', type: 'text' });
    channels.push({ id: 'loadouts', name: 'Loadouts', type: 'text' });
    channels.push({ id: 'highlights', name: 'Highlights', type: 'text' });
  } else if (slug.includes('racing') || slug.includes('auto') || slug.includes('speed') || slug.includes('forza')) {
    channels.push({ id: 'laptimes', name: 'Lap Times', type: 'text' });
    channels.push({ id: 'setups', name: 'Setups & Tuning', type: 'text' });
    channels.push({ id: 'league', name: 'Racing League', type: 'text' });
  } else if (slug.includes('fighter') || slug.includes('kombat') || slug.includes('smash') || slug.includes('tekken')) {
    channels.push({ id: 'combos', name: 'Combos & Tech', type: 'text' });
    channels.push({ id: 'ranked', name: 'Ranked', type: 'text' });
    channels.push({ id: 'matchups', name: 'Matchups', type: 'text' });
  } else {
    channels.push({ id: 'discussion', name: 'Discussion', type: 'text' });
    channels.push({ id: 'highlights', name: 'Highlights', type: 'text' });
    channels.push({ id: 'lfg', name: 'LFG', type: 'text' });
  }

  // Add some unread counts deterministically
  channels.forEach((channel, idx) => {
    if (rand() > 0.6) {
      channel.unreadCount = Math.floor(rand() * 20) + 1;
    }
  });

  return {
    slug,
    name,
    fallbackGradient,
    activePlayers,
    channels
  };
};

export const getCommunity = async (slug: string): Promise<GameCommunity> => {
  // 1. In the future, check MongoDB here
  // 2. Or check RAWG/IGDB metadata

  // 3. Fallback to known static config
  if (STATIC_COMMUNITIES[slug]) {
    return STATIC_COMMUNITIES[slug];
  }

  // 4. Fallback to deterministic generation
  return generateDeterministicCommunity(slug);
};

export const generateDeterministicEvents = (slug: string, channelId: string): CommunityEvent[] => {
  const hash = hashString(`${slug}-${channelId}`);
  const rand = seededRandom(hash);

  const numEvents = Math.floor(rand() * 10) + 5; // 5 to 15 events
  const events: CommunityEvent[] = [];

  const baseAuthors = [
    { name: 'VaderSlaps', role: 'user' as const, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vader' },
    { name: 'JediKnight', role: 'user' as const, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jedi' },
    { name: 'SithLord', role: 'user' as const, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sith' },
    { name: 'BountyHunter', role: 'user' as const, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bounty' },
    { name: 'Community Manager', role: 'moderator' as const, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mod' },
    { name: 'AutoMod', role: 'system' as const }
  ];

  const genericMessages = [
    'Anyone want to queue up?',
    'Did you guys see the new update?',
    'This game is so good right now.',
    'I just hit the highest rank!',
    'Can someone help me with this boss?',
    'Looking for a group for the weekend tournament.',
    'What is the best build currently?',
    'The servers are acting up for me.'
  ];

  for (let i = 0; i < numEvents; i++) {
    const author = baseAuthors[Math.floor(rand() * baseAuthors.length)];
    let type: EventType = 'message';
    let content = genericMessages[Math.floor(rand() * genericMessages.length)];

    if (author.role === 'system') {
      type = rand() > 0.5 ? 'system' : 'warning';
      content = type === 'system' ? 'Server maintenance scheduled for tomorrow.' : 'User was temporarily muted for spamming.';
    } else if (author.role === 'moderator') {
      type = rand() > 0.8 ? 'tournament' : 'message';
      if (type === 'tournament') {
        content = 'Weekend Brawl tournament registrations are now OPEN!';
      }
    }

    // Deterministic timestamp scaling backwards from BASE_DATE
    const offsetMs = Math.floor(rand() * 1000 * 60 * 60 * 24 * 7); // within last 7 days from base
    const timestamp = new Date(BASE_DATE - offsetMs).toISOString();

    events.push({
      id: `${hash}-${i}`,
      type,
      channelId,
      timestamp,
      content,
      author: author.role === 'system' ? { name: author.name, role: author.role } : author
    });
  }

  // Sort chronological
  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};
