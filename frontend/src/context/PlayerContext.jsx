import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (queueIndex < queue.length - 1) {
        playNext();
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [queueIndex, queue.length]);

  const playTrack = useCallback((track, trackList = [], index = 0) => {
    const audio = audioRef.current;
    if (currentTrack?._id === track._id && audio.src) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }
    audio.src = track.uri;
    audio.play();
    setCurrentTrack(track);
    setIsPlaying(true);
    if (trackList.length > 0) {
      setQueue(trackList);
      setQueueIndex(index);
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [currentTrack, isPlaying]);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const changeVolume = useCallback((vol) => {
    audioRef.current.volume = vol;
    setVolume(vol);
  }, []);

  const playNext = useCallback(() => {
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      const nextTrack = queue[nextIndex];
      audioRef.current.src = nextTrack.uri;
      audioRef.current.play();
      setCurrentTrack(nextTrack);
      setQueueIndex(nextIndex);
      setIsPlaying(true);
    }
  }, [queue, queueIndex]);

  const playPrev = useCallback(() => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      const prevTrack = queue[prevIndex];
      audioRef.current.src = prevTrack.uri;
      audioRef.current.play();
      setCurrentTrack(prevTrack);
      setQueueIndex(prevIndex);
      setIsPlaying(true);
    }
  }, [queue, queueIndex, currentTime]);

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, duration, currentTime, volume, queue, queueIndex,
      playTrack, togglePlay, seek, changeVolume, playNext, playPrev
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
}
