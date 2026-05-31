import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Disc3, ChevronRight, Plus, X, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const gradients = [
  'from-violet-600/40 to-indigo-900/40',
  'from-rose-600/40 to-pink-900/40',
  'from-amber-600/40 to-orange-900/40',
  'from-emerald-600/40 to-teal-900/40',
  'from-sky-600/40 to-cyan-900/40',
  'from-fuchsia-600/40 to-purple-900/40',
];

export default function Albums() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [addingSongs, setAddingSongs] = useState(false);

  useEffect(() => { fetchAlbums(); }, []);

  const fetchAlbums = async () => {
    try {
      const res = await api.get('/music/albums');
      setAlbums(res.data.albums || []);
    } catch { toast.error('Failed to load albums'); }
    finally { setLoading(false); }
  };

  const fetchAvailableSongs = async (album) => {
    try {
      const res = await api.get('/music/');
      const currentSongIds = album.musics?.map(s => s._id) || [];
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
      await api.post(`/music/album/${selectedAlbum._id}/add-songs`, { songIds: selectedSongs });
      toast.success('Songs added to album!');
      setShowModal(false);
      setSelectedSongs([]);
      setSelectedAlbum(null);
      fetchAlbums();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add songs');
    } finally {
      setAddingSongs(false);
    }
  };

  const openModal = (e, album) => {
    e.preventDefault();
    setSelectedAlbum(album);
    fetchAvailableSongs(album);
    setShowModal(true);
  };

  const handleDeleteAlbum = async (e, albumId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this album?')) return;
    try {
      await api.delete(`/music/album/${albumId}`);
      toast.success('Album deleted successfully!');
      setAlbums(albums.filter(a => a._id !== albumId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete album');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">Albums</h1>
        <p className="text-spotify-text mt-1 text-sm sm:text-base">{albums.length} albums</p>
      </div>
      {albums.length === 0 ? (
        <div className="bg-spotify-card/30 rounded-lg sm:rounded-2xl p-8 sm:p-16 text-center border border-white/5">
          <Disc3 size={40} className="sm:w-14 sm:h-14 text-spotify-text mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No albums yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {albums.map((album, i) => (
            <div key={album._id} className="relative group">
              <Link to={`/albums/${album._id}`}
                className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block">
                <div className={`aspect-square rounded-lg sm:rounded-lg mb-3 sm:mb-4 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center relative overflow-hidden shadow-lg`}>
                  <Disc3 size={36} className="sm:w-12 sm:h-12 text-white/30 group-hover:animate-spin" style={{animationDuration:'3s'}} />
                  <div className="absolute bottom-2 right-2 w-8 h-8 sm:w-10 sm:h-10 bg-spotify-green rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                    <ChevronRight size={16} className="sm:w-5 sm:h-5 text-black" />
                  </div>
                </div>
                <h3 className="font-bold text-xs sm:text-sm truncate mb-1">{album.title}</h3>
                <p className="text-xs text-spotify-text truncate">{album.artist?.username || 'Unknown'}</p>
              </Link>
              {user?.role === 'artist' && user?._id === album.artist?._id && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => openModal(e, album)}
                    className="bg-spotify-green rounded-full p-1.5 sm:p-2 shadow-lg hover:scale-110 transition-transform"
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4 text-black" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteAlbum(e, album._id)}
                    className="bg-red-500 rounded-full p-1.5 sm:p-2 shadow-lg hover:scale-110 hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={14} className="sm:w-4 sm:h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Songs Modal */}
      {showModal && selectedAlbum && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-spotify-card rounded-xl sm:rounded-2xl border border-white/10 w-full max-w-sm max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold pr-2 truncate">Add Songs</h2>
              <button onClick={() => { setShowModal(false); setSelectedAlbum(null); setSelectedSongs([]); }} className="hover:bg-white/10 p-2 rounded-lg flex-shrink-0">
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
                onClick={() => { setShowModal(false); setSelectedAlbum(null); setSelectedSongs([]); }}
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSongs}
                disabled={addingSongs || selectedSongs.length === 0}
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-spotify-green text-black font-semibold hover:scale-105 transition-all disabled:opacity-50 text-xs sm:text-sm"
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
