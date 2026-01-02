
export interface SpaceFact {
  title: string;
  description: string;
  category: 'galaxy' | 'planet' | 'star' | 'blackhole';
}

export enum MessageRole {
  USER = 'user',
  BOT = 'bot'
}
