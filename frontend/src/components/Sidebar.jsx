import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Disc3, Upload, FolderPlus, LogOut, Music2 } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-black h-full flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-9 h-9 bg-spotify-green rounded-full flex items-center justify-center">
          <Music2 size={20} className="text-black" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">Spotify</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 mt-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link ${isActive ? 'active bg-white/10' : ''}`
          }
        >
          <Home size={22} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/albums"
          className={({ isActive }) =>
            `nav-link ${isActive ? 'active bg-white/10' : ''}`
          }
        >
          <Disc3 size={22} />
          <span>Albums</span>
        </NavLink>

        {user?.role === 'artist' && (
          <>
            <div className="pt-6 pb-2 px-4">
              <p className="text-xs font-bold uppercase tracking-widest text-spotify-text">
                Artist Tools
              </p>
            </div>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active bg-white/10' : ''}`
              }
            >
              <Upload size={22} />
              <span>Upload Song</span>
            </NavLink>

            <NavLink
              to="/create-album"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active bg-white/10' : ''}`
              }
            >
              <FolderPlus size={22} />
              <span>Create Album</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-spotify-green to-emerald-700 flex items-center justify-center font-bold text-sm text-black uppercase">
            {user?.username?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.username}</p>
            <p className="text-xs text-spotify-text capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="nav-link w-full text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
