import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await register(username, email, password, role);
      toast.success('Account created! Welcome to Spotify 🎵');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-spotify-black flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-spotify-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-spotify-green/20">
            <Music2 size={32} className="text-black" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Sign up for Spotify</h1>
        </div>

        {/* Form Card */}
        <div className="bg-spotify-card/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-spotify-text">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="input-field"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-spotify-text">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="labib@gmail.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-spotify-text">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="input-field pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-spotify-text hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-spotify-text">
                What describes you best?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                    role === 'user'
                      ? 'border-spotify-green bg-spotify-green/10 text-spotify-green'
                      : 'border-white/10 text-spotify-text hover:border-white/30'
                  }`}
                >
                  🎧 Listener
                </button>
                <button
                  type="button"
                  onClick={() => setRole('artist')}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                    role === 'artist'
                      ? 'border-spotify-green bg-spotify-green/10 text-spotify-green'
                      : 'border-white/10 text-spotify-text hover:border-white/30'
                  }`}
                >
                  🎤 Artist
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-spotify-text text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-white font-semibold hover:text-spotify-green transition-colors underline underline-offset-4"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
