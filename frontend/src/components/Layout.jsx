import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from './Player';
import { usePlayer } from '../context/PlayerContext';

export default function Layout() {
  const { currentTrack } = usePlayer();

  return (
    <div className="min-h-screen bg-spotify-black">
      <Sidebar />
      <main className={`ml-64 ${currentTrack ? 'pb-24' : 'pb-6'} min-h-screen`}>
        <div className="p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Player />
    </div>
  );
}
