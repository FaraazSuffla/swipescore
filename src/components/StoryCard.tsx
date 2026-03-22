import React from 'react';
import type { StoryItem } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Tag, Hash, Activity } from 'lucide-react';

interface StoryCardProps {
  item: StoryItem;
  onClick: () => void;
  isActive: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({ item, onClick, isActive }) => {
  const { source, story, qa } = item;

  const bgClasses = {
    pass: 'bg-green-500/10 border-green-500/20 text-green-400',
    warn: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    fail: 'bg-red-500/10 border-red-500/20 text-red-400'
  };

  const QAIcons = {
    pass: <CheckCircle size={16} />,
    warn: <AlertTriangle size={16} />,
    fail: <XCircle size={16} />
  };

  return (
    <div 
      onClick={onClick}
      className={`relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden
        ${isActive ? 'border-indigo-500 ring-1 ring-indigo-500 bg-slate-800/80 shadow-lg shadow-indigo-500/10' : 'border-slate-700/50 hover:border-slate-600 bg-slate-800/40 hover:bg-slate-800/60'}
      `}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex gap-4 items-center">
          <div className="flex items-center justify-center bg-slate-900/50 p-2 rounded-xl border border-slate-700/50 shadow-inner">
             {source.homeBadge ? <img src={source.homeBadge} alt={source.homeTeam} className="w-10 h-10 object-contain drop-shadow-md" /> : <div className="w-10 h-10 border border-slate-700 rounded-lg flex justify-center items-center text-xs opacity-50">{source.homeTeam.substring(0,3)}</div>}
             <div className="px-3 font-mono font-bold text-xl tracking-tight">
               <span className="text-slate-300">{source.homeScore}</span>
               <span className="text-slate-500 mx-1">-</span>
               <span className="text-slate-300">{source.awayScore}</span>
             </div>
             {source.awayBadge ? <img src={source.awayBadge} alt={source.awayTeam} className="w-10 h-10 object-contain drop-shadow-md" /> : <div className="w-10 h-10 border border-slate-700 rounded-lg flex justify-center items-center text-xs opacity-50">{source.awayTeam.substring(0,3)}</div>}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5 hover:text-slate-300 transition-colors">
              <Activity size={12} className={story.mood === "exciting" || story.mood === "dominant" ? "text-indigo-400" : "text-slate-400"} />
              {story.mood}
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium shadow-sm whitespace-nowrap ${bgClasses[qa.status]}`}>
          {QAIcons[qa.status]}
          <span className="capitalize">{qa.status}</span>
          <span className="opacity-60 ml-1">| {qa.score}</span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-100 mb-3 leading-tight tracking-tight relative z-10">
        {story.headline}
      </h3>
      <p className="text-slate-300 leading-relaxed mb-6 line-clamp-3 relative z-10">
        {story.body}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto relative z-10">
        {story.tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-700/50 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-colors">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
