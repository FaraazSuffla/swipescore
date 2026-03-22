import React, { useEffect, useState } from 'react';
import type { StoryItem } from './types';
import { Feed } from './components/Feed';
import { Sidebar } from './components/Sidebar';
import { Inbox, AlertTriangle, Filter, Loader2 } from 'lucide-react';

function App() {
  const [data, setData] = useState<StoryItem[]>([]);
  const [filteredData, setFilteredData] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<StoryItem | null>(null);
  
  // Filters
  const [showIssuesOnly, setShowIssuesOnly] = useState(false);

  useEffect(() => {
    fetch('/data/stories.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.text();
      })
      .then((text: string) => {
        const trimmed = text.trim();
        const json: StoryItem[] = trimmed ? JSON.parse(trimmed) : [];
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (showIssuesOnly) {
      setFilteredData(data.filter(item => item.qa.status !== 'pass'));
    } else {
      setFilteredData(data);
    }
  }, [showIssuesOnly, data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans">
         <Loader2 className="animate-spin text-indigo-500 shadow-indigo-500/50" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 font-sans text-slate-200">
         <AlertTriangle size={64} className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
         <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
         <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30">
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 relative">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

        <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-sky-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Inbox size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                SwipeScore
              </h1>
              <p className="text-xs text-slate-400 font-medium">Auto-generated Story Pipeline</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-xs text-slate-500 font-medium font-mono">
              Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
            
            <button 
              onClick={() => setShowIssuesOnly(!showIssuesOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border
                ${showIssuesOnly 
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-inner' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'}
              `}
            >
              <Filter size={16} />
              QA Issues Only
            </button>
          </div>
        </header>

        {filteredData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 mt-[-10vh]">
            <Inbox size={64} className="mb-6 opacity-20" />
            <p className="text-lg font-medium">No stories found matching criteria.</p>
          </div>
        ) : (
          <Feed items={filteredData} activeItem={activeItem} onSelect={setActiveItem} />
        )}
      </div>

      {/* Sidebar for Raw Source Data */}
      <div className="w-[400px] hidden xl:block z-20 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.5)]">
        <Sidebar item={activeItem} />
      </div>
    </div>
  );
}

export default App;
