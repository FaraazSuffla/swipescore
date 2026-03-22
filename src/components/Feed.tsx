import React from 'react';
import type { StoryItem } from '../types';
import { StoryCard } from './StoryCard';

interface FeedProps {
  items: StoryItem[];
  activeItem: StoryItem | null;
  onSelect: (item: StoryItem) => void;
}

export const Feed: React.FC<FeedProps> = React.memo(({ items, activeItem, onSelect }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        {items.map((item, index) => (
          <StoryCard 
            key={`${item.source.homeTeam}-${item.source.date}-${index}`} 
            item={item} 
            isActive={activeItem === item}
            onClick={() => onSelect(item)}
          />
        ))}
      </div>
    </div>
  );
})
