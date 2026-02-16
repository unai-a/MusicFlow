'use client';

import { Play, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerStore, Song } from '@/store/playerStore';
import { cn } from '@/lib/utils';

interface SongCardProps {
  song: Song;
  index: number;
}

export function SongCard({ song, index }: SongCardProps) {
  const { currentSong, addToQueue, setCurrentSong, queue } = usePlayerStore();
  
  const isCurrentSong = currentSong?.videoId === song.videoId;
  const isInQueue = queue.some(s => s.videoId === song.videoId);

  const handlePlay = () => {
    setCurrentSong(song);
    // Also add to queue if not already there
    if (!isInQueue) {
      addToQueue(song);
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInQueue) {
      addToQueue(song);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300",
        "hover:bg-white/5 cursor-pointer",
        isCurrentSong && "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
      )}
      onClick={handlePlay}
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.5s ease-out forwards',
        opacity: 0,
      }}
    >
      {/* Thumbnail with play overlay */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={cn(
          "absolute inset-0 bg-black/60 flex items-center justify-center",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isCurrentSong && "opacity-100"
        )}>
          <div className={cn(
            "w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500",
            "flex items-center justify-center shadow-lg shadow-purple-500/50",
            "transform scale-90 group-hover:scale-100 transition-transform duration-300"
          )}>
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </div>
        </div>
        {isCurrentSong && (
          <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        )}
      </div>

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-semibold truncate text-white",
          isCurrentSong && "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
        )}>
          {song.title}
        </h3>
        <p className="text-sm text-zinc-400 truncate mt-1">
          {song.channel}
        </p>
        {song.duration && (
          <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
            <Clock className="w-3 h-3" />
            <span>{song.duration}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAddToQueue}
          disabled={isInQueue}
          className={cn(
            "w-9 h-9 rounded-full",
            "text-zinc-400 hover:text-white hover:bg-white/10",
            isInQueue && "text-green-500 hover:text-green-400"
          )}
        >
          <Plus className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlay}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30"
        >
          <Play className="w-5 h-5 ml-0.5" fill="white" />
        </Button>
      </div>
    </div>
  );
}
