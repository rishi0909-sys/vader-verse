export type ChannelType = 'text' | 'voice' | 'announcements';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  unreadCount?: number;
}

export type EventType = 'message' | 'system' | 'warning' | 'tournament';

export interface CommunityEvent {
  id: string;
  type: EventType;
  channelId: string;
  timestamp: string;
  content: string;
  author?: {
    name: string;
    avatar?: string;
    role?: 'user' | 'moderator' | 'admin' | 'system';
  };
  metadata?: any;
}

export interface GameCommunity {
  slug: string;
  name: string;
  bannerImage?: string;
  fallbackGradient?: string;
  activePlayers: number;
  channels: Channel[];
  rawgData?: any; // The enriched data from RAWG API
}
