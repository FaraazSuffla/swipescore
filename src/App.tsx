import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { StoryItem } from './types';
import { Feed } from './components/Feed';
import { Sidebar } from './components/Sidebar';
import { Inbox, AlertTriangle, Filter, Loader2, RefreshCw, Search } from 'lucide-react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 font-sans text-slate-200">
          <AlertTriangle size={64} className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-slate-400">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [data, setData] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<StoryItem | null>(null);
  const [showIssuesOnly, setShowIssuesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(() => {
    setRefreshing(true);
    fetch('/data/stories.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.text();
      })
      .then((text: string) => {
        const trimmed = text.trim();
        const json: StoryItem[] = trimmed ? JSON.parse(trimmed) : [];
        setData(json);
        setError(null);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = useMemo(() => {
    let result = data;
    if (showIssuesOnly) {
      result = result.filter(item => item.qa.status !== 'pass');
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.source.homeTeam.toLowerCase().includes(q) ||
        item.source.awayTeam.toLowerCase().includes(q)
      );
    }
    return result;
  }, [data, showIssuesOnly, searchQuery]);

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

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl text-sm bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 w-48 transition-colors"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowIssuesOnly(!showIssuesOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border
                ${showIssuesOnly
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-inner'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'}
              `}
            >
              <Filter size={16} />
              <span className="hidden md:inline">QA Issues Only</span>
            </button>

            {/* Refresh button */}
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
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

      {/* Desktop Sidebar */}
      <div className="w-[400px] hidden xl:block z-20 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.5)]">
        <Sidebar item={activeItem} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {activeItem && (
        <div className="xl:hidden fixed inset-0 z-30 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveItem(null)} />
          <div className="relative w-full max-w-md h-full">
            <Sidebar item={activeItem} onClose={() => setActiveItem(null)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Root() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
