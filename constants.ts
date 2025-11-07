import { Website } from './types';

export const initialWebsites: Website[] = [
  {
    id: 'website-1',
    name: 'E-commerce Platform',
    description: 'A modern online store for selling digital goods.',
    thumbnailUrl: 'https://picsum.photos/seed/ecom/500/300',
    lastUpdated: 'August 16, 2024',
    category: '활동',
  },
  {
    id: 'website-2',
    name: 'Personal Portfolio',
    description: 'Showcasing my latest design and development work.',
    thumbnailUrl: 'https://picsum.photos/seed/portfolio/500/300',
    lastUpdated: 'July 28, 2024',
    category: '학업',
  },
  {
    id: 'website-3',
    name: 'Travel Blog',
    description: 'Documenting adventures from around the world.',
    thumbnailUrl: 'https://picsum.photos/seed/travel/500/300',
    lastUpdated: 'August 5, 2024',
    category: '취미',
  },
];