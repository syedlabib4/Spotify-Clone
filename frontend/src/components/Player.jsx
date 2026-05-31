import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function Player() {
  const {
    currentTrack, isPlaying, duration, currentTime, volume,
    togglePlay, seek, changeVolume, playNext, playPrev
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-64 right-0 h-20 bg-gradient-to-r from-[#181818] via-[#1a1a1a] to-[#181818] border-t border-white/5 z-40 flex items-center px-4 animate-slide-up">
      {/* Track Info */}
      <div className="flex items-center gap-3 w-64 min-w-0">
        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-spotify-green/30 to-emerald-900/50 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Music size={20} className="text-spotify-green" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{currentTrack.title}</p>
          <p className="text-xs text-spotify-text truncate">
            {currentTrack.artist?.username || 'Unknown Artist'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-1 max-w-xl mx-auto">
        <div className="flex items-center gap-5">
          <button
            onClick={playPrev}
            className="text-spotify-text hover:text-white transition-colors"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
          >
            {isPlaying ? (
              <Pause size={18} className="text-black" fill="black" />
            ) : (
              <Play size={18} className="text-black ml-0.5" fill="black" />
            )}
          </button>

          <button
            onClick={playNext}
            className="text-spotify-text hover:text-white transition-colors"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <span className="text-[11px] text-spotify-text w-10 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1 h-1"
          />
          <span className="text-[11px] text-spotify-text w-10 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-40 justify-end">
        <button
          onClick={() => changeVolume(volume > 0 ? 0 : 0.7)}
          className="text-spotify-text hover:text-white transition-colors"
        >
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          className="w-24 h-1"
        />
      </div>
    </div>
  );
}
