'use client';

import { useState } from 'react';
import { Search, Loader2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = () => {
    const query = inputValue.trim();
    console.log('handleSearch called with:', query);
    if (query) {
      onSearch(query);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    handleSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Enter pressed');
      handleSearch();
    }
  };

  const handleQuickSearch = (artist: string) => {
    console.log('Quick search:', artist);
    setInputValue(artist);
    onSearch(artist);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
        <div className="relative flex items-center bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mr-3">
            <Music className="w-6 h-6 text-white" />
          </div>
          <input
            type="text"
            placeholder="Search for songs, artists..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex-1 bg-transparent border-0 text-white placeholder:text-zinc-500",
              "text-lg focus:outline-none focus:ring-0",
              "selection:bg-purple-500/30 py-3"
            )}
            disabled={isSearching}
          />
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !inputValue.trim()}
            className={cn(
              "px-6 h-12 rounded-xl font-semibold transition-all duration-300",
              "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            )}
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
      
      {/* Quick search suggestions */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {['Taylor Swift', 'Drake', 'Ed Sheeran', 'Billie Eilish', 'The Weeknd'].map((artist) => (
          <button
            key={artist}
            type="button"
            onClick={() => handleQuickSearch(artist)}
            disabled={isSearching}
            className="px-4 py-2 rounded-full text-sm text-zinc-400 bg-white/5 hover:bg-white/10 
                       border border-white/5 hover:border-white/10 transition-all duration-300
                       hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {artist}
          </button>
        ))}
      </div>
    </div>
  );
}
