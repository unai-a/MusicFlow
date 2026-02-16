'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';

export function YouTubePlayer() {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const { 
    currentSong, 
    isPlaying, 
    volume,
    setProgress,
    setDuration,
    setIsPlaying,
    playNext
  } = usePlayerStore();

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize player when song changes
  useEffect(() => {
    if (!currentSong || !containerRef.current) return;

    let isCancelled = false;

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player(containerRef.current!, {
        videoId: currentSong.videoId,
        playerVars: {
          autoplay: 0, // Don't auto-play, respect isPlaying state
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event) => {
            if (!isCancelled) {
              event.target.setVolume(volume * 100);
              setPlayerReady(true);
            }
            // Don't auto-play - let the isPlaying effect handle it
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playNext();
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      isCancelled = true;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      setPlayerReady(false);
    };
  }, [currentSong?.videoId]);

  // Handle play/pause when player is ready
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch {
      console.log('Player not ready');
    }
  }, [isPlaying, playerReady]);

  // Handle volume change
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;

    try {
      playerRef.current.setVolume(volume * 100);
    } catch {
      console.log('Player not ready');
    }
  }, [volume, playerReady]);

  // Update progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!playerRef.current || !playerReady || !isPlaying) return;

      try {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        
        if (typeof currentTime === 'number' && typeof duration === 'number') {
          setProgress(currentTime);
          setDuration(duration);
        }
      } catch {
        // Player not ready
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, playerReady, setProgress, setDuration]);

  // Handle seeking
  const handleSeek = useCallback((time: number) => {
    if (!playerRef.current || !playerReady) return;
    
    try {
      playerRef.current.seekTo(time, true);
      setProgress(time);
    } catch {
      console.log('Player not ready');
    }
  }, [setProgress, playerReady]);

  // Expose seek function globally
  useEffect(() => {
    (window as unknown as { seekTo: (time: number) => void }).seekTo = handleSeek;
    return () => {
      delete (window as unknown as { seekTo?: (time: number) => void }).seekTo;
    };
  }, [handleSeek]);

  if (!currentSong) return null;

  return (
    <div className="hidden">
      <div ref={containerRef} id="youtube-player" />
    </div>
  );
}
