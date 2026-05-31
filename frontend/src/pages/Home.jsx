import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Music, TrendingUp, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await api.get('/music/');
      setSongs(res.data.musics || []);
    } catch (err) {
      toast.error('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSong = async (songId) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;
    try {
      await api.delete(`/music/${songId}`);
      toast.success('Song deleted successfully!');
      setSongs(songs.filter(s => s._id !== songId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete song');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const isCurrentlyPlaying = (song) =>
    currentTrack?._id === song._id && isPlaying;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin" />
          <p className="text-spotify-text text-sm">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-spotify-green/20 via-emerald-900/30 to-spotify-black p-8 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-spotify-green/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <p className="text-spotify-text text-sm font-medium mb-1">
            {getGreeting()}
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">
            {user?.username} 👋
          </h1>
          <p className="text-spotify-text text-lg">
            {songs.length} songs available · Ready to play
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-spotify-green/10 blur-3xl" />
        <div className="absolute -right-5 -bottom-10 w-32 h-32 rounded-full bg-emerald-600/10 blur-2xl" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-spotify-card/50 rounded-xl p-5 border border-white/5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-spotify-green/10 flex items-center justify-center">
            <Music size={22} className="text-spotify-green" />
          </div>
          <div>
            <p className="text-2xl font-bold">{songs.length}</p>
            <p className="text-sm text-spotify-text">Total Songs</p>
          </div>
        </div>
        <div className="bg-spotify-card/50 rounded-xl p-5 border border-white/5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <TrendingUp size={22} className="text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {[...new Set(songs.map(s => s.artist?._id))].length}
            </p>
            <p className="text-sm text-spotify-text">Artists</p>
          </div>
        </div>
        <div className="bg-spotify-card/50 rounded-xl p-5 border border-white/5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Clock size={22} className="text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold capitalize">{user?.role}</p>
            <p className="text-sm text-spotify-text">Your Role</p>
          </div>
        </div>
      </div>

      {/* All Songs */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">All Songs</h2>
          <span className="text-sm text-spotify-text">{songs.length} tracks</span>
        </div>

        {songs.length === 0 ? (
          <div className="bg-spotify-card/30 rounded-2xl p-12 text-center border border-white/5">
            <Music size={48} className="text-spotify-text mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">No songs yet</h3>
            <p className="text-spotify-text text-sm">
              {user?.role === 'artist'
                ? 'Upload your first track to get started!'
                : 'Check back later for new music.'}
            </p>
          </div>
        ) : (
          <div className="bg-spotify-card/30 rounded-xl overflow-hidden border border-white/5">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[40px_1fr_1fr_60px_60px] gap-4 px-5 py-3 text-xs font-semibold text-spotify-text uppercase tracking-wider border-b border-white/5">
              <span>#</span>
              <span>Title</span>
              <span>Artist</span>
              <span></span>
              <span></span>
            </div>

            {/* Mobile Header */}
            <div className="sm:hidden grid grid-cols-[40px_1fr_60px_60px] gap-2 px-3 py-3 text-xs font-semibold text-spotify-text uppercase tracking-wider border-b border-white/5">
              <span>#</span>
              <span>Title</span>
              <span></span>
              <span></span>
            </div>

            {/* Songs list */}
            {songs.map((song, index) => (
              <div
                key={song._id}
                onClick={() => playTrack(song, songs, index)}
                className={`group hidden sm:grid grid-cols-[40px_1fr_1fr_60px_60px] gap-4 px-5 py-3 items-center cursor-pointer transition-all duration-150 hover:bg-white/5 ${
                  currentTrack?._id === song._id ? 'bg-white/5' : ''
                }`}
              >
                <div className="flex items-center justify-center">
                  {isCurrentlyPlaying(song) ? (
                    <div className="flex items-end gap-[2px] h-4">
                      <span className="equalizer-bar" />
                      <span className="equalizer-bar" />
                      <span className="equalizer-bar" />
                    </div>
                  ) : (
                    <>
                      <span className="text-sm text-spotify-text group-hover:hidden">
                        {index + 1}
                      </span>
                      <Play
                        size={14}
                        className="hidden group-hover:block text-white"
                        fill="white"
                      />
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-spotify-green/20 to-emerald-900/40 flex items-center justify-center flex-shrink-0">
                    <Music size={16} className="text-spotify-green" />
                  </div>
                  <span
                    className={`text-sm font-medium truncate ${
                      currentTrack?._id === song._id
                        ? 'text-spotify-green'
                        : 'text-white'
                    }`}
                  >
                    {song.title}
                  </span>
                </div>

                <span className="text-sm text-spotify-text truncate">
                  {song.artist?.username || 'Unknown'}
                </span>

                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTrack(song, songs, index);
                    }}
                    className="w-8 h-8 rounded-full bg-spotify-green/0 hover:bg-spotify-green flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                    {isCurrentlyPlaying(song) ? (
                      <Pause size={14} className="text-black" fill="black" />
                    ) : (
                      <Play size={14} className="text-black ml-0.5" fill="black" />
                    )}
                  </button>
                </div>

                {user?.role === 'artist' && user?._id === song.artist?._id && (
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSong(song._id);
                      }}
                      className="w-8 h-8 rounded-full hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Song List */}
            {songs.map((song, index) => (
              <div
                key={song._id}
                onClick={() => playTrack(song, songs, index)}
                className={`group sm:hidden grid grid-cols-[40px_1fr_60px_60px] gap-2 px-3 py-3 items-center cursor-pointer transition-all duration-150 hover:bg-white/5 border-b border-white/5 last:border-b-0 ${
                  currentTrack?._id === song._id ? 'bg-white/5' : ''
                }`}
              >
                <div className="flex items-center justify-center">
                  {isCurrentlyPlaying(song) ? (
                    <div className="flex items-end gap-[2px] h-3">
                      <span className="equalizer-bar" />
                      <span className="equalizer-bar" />
                      <span className="equalizer-bar" />
                    </div>
                  ) : (
                    <span className="text-xs text-spotify-text font-semibold">{index + 1}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded bg-gradient-to-br from-spotify-green/20 to-emerald-900/40 flex items-center justify-center flex-shrink-0">
                    <Music size={12} className="text-spotify-green" />
                  </div>
                  <div className="min-w-0">
                    <span className={`text-xs font-medium truncate block ${
                      currentTrack?._id === song._id ? 'text-spotify-green' : 'text-white'
                    }`}>
                      {song.title}
                    </span>
                    <span className="text-xs text-spotify-text truncate">
                      {song.artist?.username || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTrack(song, songs, index);
                    }}
                    className="w-7 h-7 rounded-full bg-spotify-green/20 hover:bg-spotify-green flex items-center justify-center transition-all"
                  >
                    {isCurrentlyPlaying(song) ? (
                      <Pause size={12} className="text-black" fill="black" />
                    ) : (
                      <Play size={12} className="text-black ml-0.5" fill="black" />
                    )}
                  </button>
                </div>

                {user?.role === 'artist' && user?._id === song.artist?._id && (
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSong(song._id);
                      }}
                      className="w-7 h-7 rounded-full hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-all hover:text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}