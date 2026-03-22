export interface MatchSource {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  venue: string;
  homeBadge: string;
  awayBadge: string;
  league: string;
}

export interface StoryContent {
  headline: string;
  body: string;
  suggested_image_query: string;
  tags: string[];
  mood: string;
}

export interface QAStatus {
  status: 'pass' | 'warn' | 'fail';
  issues: string[];
  score: number;
}

export interface StoryItem {
  source: MatchSource;
  story: StoryContent;
  qa: QAStatus;
}
