export interface Website {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  lastUpdated: string;
  category: '학업' | '취미' | '활동';
}