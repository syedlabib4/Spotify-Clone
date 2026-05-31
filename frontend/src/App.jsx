import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Albums from './pages/Albums';
import AlbumDetail from './pages/AlbumDetail';
import UploadSong from './pages/UploadSong';
import CreateAlbum from './pages/CreateAlbum';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <PlayerProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#282828',
                color: '#fff',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
              },
              success: { iconTheme: { primary: '#1DB954', secondary: '#fff' } },
            }} 
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Home />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/albums/:id" element={<AlbumDetail />} />
              <Route path="/upload" element={<UploadSong />} />
              <Route path="/create-album" element={<CreateAlbum />} />
            </Route>
          </Routes>
        </PlayerProvider>
      </AuthProvider>
    </Router>
  );
}
