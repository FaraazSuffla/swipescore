import React from 'react';
import type { StoryItem } from '../types';
import { Code, Box } from 'lucide-react';

interface SidebarProps {
  item: StoryItem | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ item }) => {
  if (!item) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900 border-l border-slate-800 p-8">
        <Box size={48} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">Select a story to view raw data</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900 border-l border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Code size={20} className="text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-200 tracking-tight">Source Data</h2>
      </div>
      <div className="flex-1 overflow-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <pre className="text-xs font-mono text-indigo-200/80 leading-relaxed">
          <code>{JSON.stringify(item.source, null, 2)}</code>
        </pre>
        {item.qa.issues.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
               QA Issues
            </h3>
            <ul className="list-disc pl-4 space-y-2">
              {item.qa.issues.map((issue, idx) => (
                <li key={idx} className="text-sm text-red-300/80">{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
