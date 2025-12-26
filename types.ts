export interface Website {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  lastUpdated: string;
  category: '학업' | '취미' | '활동';
  path: string;
}

export interface VocabularyWord {
  id: number;
  word: string;
  partOfSpeech: string;
  definition: string;
  koreanMeaning: string;
}

export enum View {
  SetSelection = 'SET_SELECTION',
  Learning = 'LEARNING',
  Testing = 'TESTING',
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export enum MoleType {
  NORMAL = 'NORMAL',
  GOLDEN = 'GOLDEN'
}

export interface GameState {
  score: number;
  timeLeft: number;
  status: GameStatus;
  combo: number;
}
