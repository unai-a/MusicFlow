'use client';

import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Volume1,
  ListMusic,
  ChevronUp,
  ChevronDown,
  X,
  Heart,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePlayerStore } from '@/store/playerStore';
import { cn } from '@/lib/utils';
import { useState, useCallback, useEffect } from 'react';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    duration,
    queue,
    queueIndex,
    togglePlayPause,
    setVolume,
    playNext,
    playPrevious,
    playFromQueue,
    removeFromQueue,
    clearQueue,
  } = usePlayerStore();

  const [showQueue, setShowQueue] = useState(false);
  const [liked, setLiked] = useState(false);

  // Reset liked state when song changes
  useEffect(() => {
    setLiked(false);
  }, [currentSong?.videoId]);

  const handleProgressChange = useCallback((values: number[]) => {
    const seekTo = (window as unknown as { seekTo?: (time: number) => void }).seekTo;
    if (seekTo) {
      seekTo(values[0]);
    }
  }, []);

  const handleVolumeChange = useCallback((values: number[]) => {
    setVolume(values[0]);
  }, [setVolume]);

  const toggleMute = useCallback(() => {
    setVolume(volume === 0 ? 0.7 : 0);
  }, [volume, setVolume]);

  if (!currentSong) return null;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <>
      {/* Main Player Bar */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-gradient-to-t from-black via-zinc-900/98 to-zinc-900/95",
        "border-t border-white/10 backdrop-blur-xl",
        "shadow-2xl shadow-black/50"
      )}>
        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-3">
            {/* Song Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-center pb-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-1 bg-white rounded-full animate-pulse"
                          style={{
                            height: `${8 + Math.random() * 8}px`,
                            animationDelay: `${i * 100}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-white truncate text-sm md:text-base">
                  {currentSong.title}
                </h4>
                <p className="text-xs md:text-sm text-zinc-400 truncate">
                  {currentSong.channel}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLiked(!liked)}
                className={cn(
                  "ml-2 hidden md:flex",
                  liked ? "text-pink-500" : "text-zinc-400 hover:text-white"
                )}
              >
                <Heart className={cn("w-5 h-5", liked && "fill-current")} />
              </Button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={playPrevious}
                disabled={queueIndex <= 0}
                className="text-zinc-400 hover:text-white disabled:opacity-30"
              >
                <SkipBack className="w-5 h-5" fill="currentColor" />
              </Button>
              
              <Button
                onClick={togglePlayPause}
                className={cn(
                  "w-12 h-12 rounded-full",
                  "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
                  "text-white shadow-lg shadow-purple-500/30",
                  "transition-all duration-300 hover:scale-105"
                )}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={playNext}
                disabled={queueIndex >= queue.length - 1}
                className="text-zinc-400 hover:text-white disabled:opacity-30"
              >
                <SkipForward className="w-5 h-5" fill="currentColor" />
              </Button>
            </div>

            {/* Progress & Volume */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
              {/* Time display */}
              <div className="text-xs text-zinc-400 w-24 text-right">
                {formatTime(progress)} / {formatTime(duration)}
              </div>
              
              {/* Progress slider */}
              <div className="w-40 group">
                <Slider
                  value={[progress]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="cursor-pointer"
                />
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 group">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-zinc-400 hover:text-white"
                >
                  <VolumeIcon className="w-5 h-5" />
                </Button>
                <div className="w-24">
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Queue toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQueue(!showQueue)}
                className={cn(
                  "text-zinc-400 hover:text-white",
                  showQueue && "text-purple-400"
                )}
              >
                <ListMusic className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <div className={cn(
          "fixed right-0 bottom-[88px] w-80 max-h-96 z-40",
          "bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-l-2xl",
          "shadow-2xl shadow-black/50 overflow-hidden",
          "animate-in slide-in-from-right duration-300"
        )}>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-semibold text-white">Queue ({queue.length})</h3>
            <div className="flex items-center gap-2">
              {queue.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => clearQueue()}
                  className="text-zinc-400 hover:text-red-400 h-8 w-8"
                  title="Clear queue"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQueue(false)}
                className="text-zinc-400 hover:text-white h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-80">
            {queue.length === 0 ? (
              <div className="p-4 text-center text-zinc-500">
                <ListMusic className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Queue is empty</p>
                <p className="text-sm">Search and add songs to play</p>
              </div>
            ) : (
              <div className="p-2">
                {queue.map((song, index) => (
                  <div
                    key={`${song.videoId}-${index}`}
                    className={cn(
                      "group flex items-center gap-3 p-2 rounded-lg cursor-pointer",
                      "hover:bg-white/5 transition-colors",
                      index === queueIndex && "bg-purple-500/20"
                    )}
                    onClick={() => playFromQueue(index)}
                  >
                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        index === queueIndex ? "text-purple-400" : "text-white"
                      )}>
                        {song.title}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{song.channel}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(index);
                      }}
                      className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* Spacer for main content */}
      <div className="h-24" />
    </>
  );
}
