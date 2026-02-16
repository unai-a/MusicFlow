import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Song {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  url: string;
}

interface PlayerState {
  // Current song
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  
  // Queue
  queue: Song[];
  queueIndex: number;
  
  // Actions
  setCurrentSong: (song: Song) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  
  // Queue actions
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  playFromQueue: (index: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSong: null,
      isPlaying: false,
      volume: 0.7,
      progress: 0,
      duration: 0,
      queue: [],
      queueIndex: -1,
      
      // Actions
      setCurrentSong: (song) => {
        set({ currentSong: song, isPlaying: true, progress: 0 });
      },
      
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      
      togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      
      setProgress: (progress) => set({ progress }),
      
      setDuration: (duration) => set({ duration }),
      
      // Queue actions
      addToQueue: (song) => {
        const { queue, currentSong } = get();
        if (!currentSong) {
          // If no song is playing, play this song
          set({ 
            currentSong: song, 
            isPlaying: true, 
            queue: [song], 
            queueIndex: 0,
            progress: 0
          });
        } else {
          // Check if song already in queue
          const existingIndex = queue.findIndex(s => s.videoId === song.videoId);
          if (existingIndex === -1) {
            set({ queue: [...queue, song] });
          }
        }
      },
      
      removeFromQueue: (index) => {
        const { queue, queueIndex, currentSong } = get();
        const newQueue = queue.filter((_, i) => i !== index);
        let newQueueIndex = queueIndex;
        let newCurrentSong = currentSong;
        
        if (index < queueIndex) {
          newQueueIndex = queueIndex - 1;
        } else if (index === queueIndex) {
          // Removing currently playing song
          if (newQueue.length > 0) {
            newQueueIndex = Math.min(queueIndex, newQueue.length - 1);
            newCurrentSong = newQueue[newQueueIndex];
          } else {
            newQueueIndex = -1;
            newCurrentSong = null;
          }
        }
        
        set({ 
          queue: newQueue, 
          queueIndex: newQueueIndex,
          currentSong: newCurrentSong,
          isPlaying: newCurrentSong ? get().isPlaying : false
        });
      },
      
      clearQueue: () => set({ 
        queue: [], 
        queueIndex: -1,
        currentSong: null,
        isPlaying: false,
        progress: 0
      }),
      
      playNext: () => {
        const { queue, queueIndex } = get();
        if (queueIndex < queue.length - 1) {
          const nextIndex = queueIndex + 1;
          set({ 
            currentSong: queue[nextIndex], 
            queueIndex: nextIndex,
            isPlaying: true,
            progress: 0
          });
        }
      },
      
      playPrevious: () => {
        const { queue, queueIndex } = get();
        if (queueIndex > 0) {
          const prevIndex = queueIndex - 1;
          set({ 
            currentSong: queue[prevIndex], 
            queueIndex: prevIndex,
            isPlaying: true,
            progress: 0
          });
        }
      },
      
      playFromQueue: (index) => {
        const { queue } = get();
        if (index >= 0 && index < queue.length) {
          set({ 
            currentSong: queue[index], 
            queueIndex: index,
            isPlaying: true,
            progress: 0
          });
        }
      },
    }),
    {
      name: 'musicflow-player-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        queue: state.queue,
        queueIndex: state.queueIndex,
        currentSong: state.currentSong,
        volume: state.volume,
      }),
    }
  )
);
