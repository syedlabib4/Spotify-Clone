import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Upload as UploadIcon, Music, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadSong() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('audio/')) setFile(dropped);
    else toast.error('Please drop an audio file');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) { toast.error('Title and file are required'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('music', file);
      await api.post('/music/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Song uploaded successfully! 🎵');
      navigate('/');
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold">Upload Song</h1>
        <p className="text-spotify-text mt-1">Share your music with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-spotify-card/50 rounded-2xl p-8 border border-white/5 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-spotify-text">Song Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-spotify-text">Audio File</label>
          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
              dragOver ? 'border-spotify-green bg-spotify-green/5' : file ? 'border-spotify-green/50 bg-spotify-green/5' : 'border-white/10 hover:border-white/30'
            }`}
            onClick={() => document.getElementById('fileInput').click()}>
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle size={40} className="text-spotify-green" />
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-spotify-text">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <UploadIcon size={40} className="text-spotify-text" />
                <p className="text-sm font-medium">Drop audio file here or click to browse</p>
                <p className="text-xs text-spotify-text">Supports MP3, WAV, OGG, FLAC</p>
              </div>
            )}
            <input id="fileInput" type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100">
          {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><UploadIcon size={18} /> Upload Song</>}
        </button>
      </form>
    </div>
  );
}
