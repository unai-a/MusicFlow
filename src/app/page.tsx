'use client';

import { useState, useCallback, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { SongCard } from '@/components/SongCard';
import { MusicPlayer } from '@/components/MusicPlayer';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { usePlayerStore, Song } from '@/store/playerStore';
import { Music, Sparkles, Disc3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { currentSong } = usePlayerStore();
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Debug: log state changes
  useEffect(() => {
    console.log('State updated:', { searchResults: searchResults.length, isSearching, searchQuery });
  }, [searchResults, isSearching, searchQuery]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    console.log('Page: Starting search for:', query);
    setIsSearching(true);
    setSearchQuery(query);
    setSearchResults([]);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      console.log('Page: Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Page: Search response data:', data);
      
      if (data.results && Array.isArray(data.results)) {
        console.log('Page: Setting results:', data.results.length, 'items');
        setSearchResults(data.results);
      } else {
        console.log('Page: No results in response');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Page: Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      console.log('Page: Search complete');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-orange-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-12 pb-8 px-4">
          <div className="container mx-auto text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-500/30">
                  <Disc3 className="w-9 h-9 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="text-white">Music</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Flow</span>
              </h1>
            </div>
            
            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
              Search and play your favorite music from YouTube. Create your perfect playlist.
            </p>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} isSearching={isSearching} />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="container mx-auto px-4 pb-32">
          {/* Initial State - No search yet */}
          {!searchQuery && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
                <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                  <Music className="w-16 h-16 text-zinc-600" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Discover Your Music
              </h2>
              <p className="text-zinc-500 max-w-md">
                Search for your favorite songs, artists, or albums to start listening
              </p>
              
              {/* Feature cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-3xl">
                {[
                  { icon: '🎵', title: 'Millions of Songs', desc: 'Access the entire YouTube music library' },
                  { icon: '🎧', title: 'High Quality', desc: 'Stream music in the best quality' },
                  { icon: '📱', title: 'Any Device', desc: 'Works on all your devices' },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-zinc-500">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-purple-400" />
              </div>
              <p className="text-zinc-400 mt-4">Searching for music...</p>
            </div>
          )}

          {/* Search Results */}
          {!isSearching && searchResults.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Search Results
                  {searchQuery && (
                    <span className="text-zinc-500 text-lg font-normal ml-2">
                      for &quot;{searchQuery}&quot;
                    </span>
                  )}
                </h2>
                <span className="text-zinc-500 text-sm">
                  {searchResults.length} songs found
                </span>
              </div>
              
              <div className="grid gap-3">
                {searchResults.map((song, index) => (
                  <SongCard key={song.videoId} song={song} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* No Results State */}
          {!isSearching && searchQuery && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <Music className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No results found
              </h3>
              <p className="text-zinc-500">
                Try searching for something else
              </p>
            </div>
          )}
        </main>
      </div>

      {/* YouTube Player (hidden) */}
      <YouTubePlayer />

      {/* Music Player Bar */}
      <MusicPlayer />
    </div>
  );
}
