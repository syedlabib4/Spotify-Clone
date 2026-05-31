import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Music, ArrowLeft, Disc3, Plus, X, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AlbumDetail() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [addingSongs, setAddingSongs] = useState(false);
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => { fetchAlbum(); }, [id]);

  const fetchAlbum = async () => {
    try {
      const res = await api.get(`/music/albums/${id}`);
      setAlbum(res.data.album);
    } catch { toast.error('Failed to load album'); }
    finally { setLoading(false); }
  };

  const fetchAvailableSongs = async () => {
    try {
      const res = await api.get('/music/');
      const currentSongIds = album.musics.map(s => s._id);
      const available = res.data.musics.filter(
        s => !currentSongIds.includes(s._id) && s.artist._id === user._id
      );
      setAvailableSongs(available);
    } catch {
      toast.error('Failed to load songs');
    }
  };

  const toggleSong = (songId) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter(id => id !== songId));
    } else {
      setSelectedSongs([...selectedSongs, songId]);
    }
  };

  const handleAddSongs = async () => {
    if (selectedSongs.length === 0) {
      toast.error('Please select songs to add');
      return;
    }
    setAddingSongs(true);
    try {
      await api.post(`/music/album/${id}/add-songs`, { songIds: selectedSongs });
      toast.success('Songs added to album!');
      setShowModal(false);
      setSelectedSongs([]);
      fetchAlbum();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add songs');
    } finally {
      setAddingSongs(false);
    }
  };

  const openModal = () => {
    fetchAvailableSongs();
    setShowModal(true);
  };

  const handleDeleteSong = async (songId) => {
    if (!window.confirm('Remove this song from the album?')) return;
    try {
      await api.delete(`/music/album/${id}/songs/${songId}`);
      toast.success('Song removed from album!');
      fetchAlbum();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove song');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!album) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold mb-2">Album not found</h2>
      <Link to="/albums" className="text-spotify-green hover:underline">Back to Albums</Link>
    </div>
  );

  const songs = album.musics || [];
  const isCurrentlyPlaying = (song) => currentTrack?._id === song._id && isPlaying;
  
  // Get artist ID properly (handle both populated object and string ID)
  const albumArtistId = typeof album.artist === 'object' ? album.artist?._id : album.artist;
  const isAlbumArtist = user?.role === 'artist' && user?._id === albumArtistId;

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in px-2 sm:px-0">
      {/* Back */}
      <Link to="/albums" className="inline-flex items-center gap-2 text-spotify-text hover:text-white transition-colors text-xs sm:text-sm font-medium">
        <ArrowLeft size={16} /> Back to Albums
      </Link>

      {/* Album Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 pb-4 sm:pb-6">
        <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-600/40 to-indigo-900/40 flex items-center justify-center shadow-xl sm:shadow-2xl flex-shrink-0">
          <Disc3 size={40} className="sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white/30" />
        </div>
        <div className="text-center sm:text-left flex-1 sm:flex-none">
          <p className="text-xs font-bold uppercase tracking-widest text-spotify-text mb-2">Album</p>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight mb-2 sm:mb-3 break-words">{album.title}</h1>
          <p className="text-xs sm:text-sm text-spotify-text">
            <span className="text-white font-semibold">{album.artist?.username || 'Unknown'}</span>
            {' · '}{songs.length} song{songs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Play All & Add Songs */}
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {songs.length > 0 && (
          <button onClick={() => playTrack(songs[0], songs, 0)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-spotify-green flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-spotify-green/30 flex-shrink-0">
            <Play size={20} className="sm:w-6 sm:h-6 text-black ml-1" fill="black" />
          </button>
        )}
        {isAlbumArtist && (
          <button onClick={openModal}
            className="flex items-center gap-2 px-3 sm:px-4 h-12 sm:h-14 rounded-full bg-white/10 border border-white/20 hover:border-white/40 hover:scale-105 transition-all font-semibold text-sm sm:text-base">
            <Plus size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Songs</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {/* Tracks */}
      {songs.length === 0 ? (
        <div className="bg-spotify-card/30 rounded-lg sm:rounded-xl p-8 sm:p-12 text-center border border-white/5">
          <Music size={32} className="sm:w-10 sm:h-10 text-spotify-text mx-auto mb-3" />
          <p className="text-sm sm:text-base text-spotify-text">No tracks in this album yet.</p>
        </div>
      ) : (
        <div className="bg-spotify-card/30 rounded-lg sm:rounded-xl overflow-hidden border border-white/5">
          {/* Desktop Header */}
          <div className="hidden sm:grid grid-cols-[40px_1fr_60px_60px] gap-4 px-4 sm:px-5 py-3 text-xs font-semibold text-spotify-text uppercase tracking-wider border-b border-white/5">
            <span>#</span><span>Title</span><span></span><span></span>
          </div>
          
          {/* Track Items */}
          {songs.map((song, index) => (
            <div key={song._id}
              className={`group flex sm:grid sm:grid-cols-[40px_1fr_60px_60px] gap-2 sm:gap-4 px-3 sm:px-5 py-3 sm:py-3 items-center cursor-pointer transition-all hover:bg-white/5 border-b border-white/5 last:border-b-0 ${currentTrack?._id === song._id ? 'bg-white/5' : ''}`}
              onClick={() => playTrack(song, songs, index)}>
              
              {/* Number/Now Playing - Desktop Only */}
              <div className="hidden sm:flex items-center justify-center">
                {isCurrentlyPlaying(song) ? (
                  <div className="flex items-end gap-[2px] h-4">
                    <span className="equalizer-bar" /><span className="equalizer-bar" /><span className="equalizer-bar" />
                  </div>
                ) : (
                  <>  
                    <span className="text-sm text-spotify-text group-hover:hidden">{index + 1}</span>
                    <Play size={14} className="hidden group-hover:block text-white" fill="white" />
                  </>
                )}
              </div>
              
              {/* Mobile Now Playing Indicator */}
              <div className="sm:hidden flex items-center">
                {isCurrentlyPlaying(song) ? (
                  <div className="flex items-end gap-[2px] h-3">
                    <span className="equalizer-bar" /><span className="equalizer-bar" /><span className="equalizer-bar" />
                  </div>
                ) : (
                  <span className="text-xs text-spotify-text font-semibold min-w-[20px]">{index + 1}</span>
                )}
              </div>
              
              {/* Song Info */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-gradient-to-br from-spotify-green/20 to-emerald-900/40 flex items-center justify-center flex-shrink-0">
                  <Music size={14} className="sm:w-4 sm:h-4 text-spotify-green" />
                </div>
                <span className={`text-xs sm:text-sm font-medium truncate ${currentTrack?._id === song._id ? 'text-spotify-green' : ''}`}>{song.title}</span>
              </div>
              
              {/* Play Button */}
              <div className="flex justify-end">
                <button onClick={(e) => { e.stopPropagation(); playTrack(song, songs, index); }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-spotify-green flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all bg-spotify-green/20 sm:bg-transparent">
                  {isCurrentlyPlaying(song) ? <Pause size={12} className="sm:w-3.5 sm:h-3.5 text-black" fill="black" /> : <Play size={12} className="sm:w-3.5 sm:h-3.5 text-black ml-0.5" fill="black" />}
                </button>
              </div>
              
              {/* Delete Button - Mobile and Desktop */}
              {isAlbumArtist && (
                <div className="flex justify-end">
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteSong(song._id); }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-red-500/20 text-red-500 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:text-red-400">
                    <Trash2 size={14} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Songs Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-spotify-card rounded-xl sm:rounded-2xl border border-white/10 w-full max-w-sm max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold pr-2">Add Songs</h2>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/10 p-2 rounded-lg flex-shrink-0">
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {availableSongs.length === 0 ? (
              <p className="text-spotify-text text-xs sm:text-sm text-center py-6 sm:py-8">No songs available to add</p>
            ) : (
              <div className="space-y-2">
                {availableSongs.map(song => (
                  <button
                    key={song._id}
                    onClick={() => toggleSong(song._id)}
                    className={`w-full p-2 sm:p-3 rounded-lg border transition-all text-left flex items-center justify-between text-sm ${  
                      selectedSongs.includes(song._id)
                        ? 'bg-spotify-green/20 border-spotify-green'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="font-medium text-xs sm:text-sm truncate">{song.title}</span>
                    {selectedSongs.includes(song._id) && <Check size={16} className="sm:w-4.5 sm:h-4.5 text-spotify-green flex-shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-4 sm:mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSongs}
                disabled={addingSongs || selectedSongs.length === 0}
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-spotify-green text-black font-semibold hover:scale-105 transition-all disabled:opacity-50 text-sm"
              >
                {addingSongs ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
