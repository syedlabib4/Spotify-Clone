import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FolderPlus, Music, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateAlbum() {
  const [title, setTitle] = useState('');
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSongs, setFetchingSongs] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await api.get('/music/');
      setAllSongs(res.data.musics || []);
    } catch {
      toast.error('Failed to load your songs');
    } finally {
      setFetchingSongs(false);
    }
  };

  const toggleSong = (songId) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter(id => id !== songId));
    } else {
      setSelectedSongs([...selectedSongs, songId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) { toast.error('Album title is required'); return; }
    if (selectedSongs.length === 0) { toast.error('Please select at least one song'); return; }
    
    setLoading(true);
    try {
      await api.post('/music/album', { title, musics: selectedSongs });
      toast.success('Album created successfully! 💿');
      navigate('/albums');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold">Create Album</h1>
        <p className="text-spotify-text mt-1">Group your tracks into a new album</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-spotify-card/50 rounded-2xl p-8 border border-white/5 space-y-8">
        <div>
          <label className="block text-sm font-semibold mb-2 text-spotify-text">Album Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter album title" className="input-field text-lg font-semibold py-4" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3 text-spotify-text">Select Tracks ({selectedSongs.length} selected)</label>
          
          {fetchingSongs ? (
            <div className="py-8 text-center"><div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : allSongs.length === 0 ? (
            <div className="bg-black/20 rounded-xl p-8 text-center border border-white/5">
              <Music size={32} className="text-spotify-text mx-auto mb-3" />
              <p className="text-spotify-text">You haven't uploaded any songs yet.</p>
            </div>
          ) : (
            <div className="bg-black/20 rounded-xl max-h-[400px] overflow-y-auto border border-white/5">
              {allSongs.map((song) => {
                const isSelected = selectedSongs.includes(song._id);
                return (
                  <div key={song._id} onClick={() => toggleSong(song._id)}
                    className={`flex items-center gap-4 p-4 border-b border-white/5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-spotify-green/10 hover:bg-spotify-green/20' : 'hover:bg-white/5'
                    }`}>
                    <div className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'border-spotify-green bg-spotify-green text-black' : 'border-spotify-text text-transparent'
                    }`}>
                      <Check size={16} />
                    </div>
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-spotify-green/20 to-emerald-900/40 flex items-center justify-center flex-shrink-0">
                      <Music size={16} className="text-spotify-green" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium truncate ${isSelected ? 'text-spotify-green' : 'text-white'}`}>{song.title}</p>
                      <p className="text-xs text-spotify-text truncate">{song.artist?.username || 'Unknown'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading || fetchingSongs || allSongs.length === 0}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100">
          {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><FolderPlus size={18} /> Create Album</>}
        </button>
      </form>
    </div>
  );
}
