export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  albumArt?: string;
  category?: string;
  audioUrl?: string;
  streamUrl?: string;
  youtubeId?: string;
  thematicFocus?: string;
  lyricsSnippet?: string;
  isJhowOfficial?: boolean;
  scriptureRef?: string;
  [key: string]: any;
}

export interface KingdomMedia {
  id: string;
  title: string;
  series?: string;
  speakerOrMinistry?: string;
  speaker?: string;
  channel?: string;
  category?: string;
  duration?: string;
  youtubeId?: string;
  scriptureRefs?: string[];
  scriptureRef?: string;
  thematicFocus?: string;
  description?: string;
  isJhowOfficial?: boolean;
  thumbnailUrl?: string;
  [key: string]: any;
}

export type VideoMediaItem = KingdomMedia;

export * from './scripture';
export * from './lesson';
