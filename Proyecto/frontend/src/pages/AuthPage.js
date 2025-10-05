import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  LogIn, 
  UserPlus,
  Eye,
  EyeOff,
  Chrome,
  Briefcase,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const userType = new URLSearchParams(location.search).get('type') || 'worker';

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: userType
  });

  const skipPath = userType === 'company' ? '/shop-dashboard' : '/jobs';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      let result;
      if (isLogin) {
        // Login
        result = await login(formData.email, formData.password);
      } else {
        // Register
        result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.userType,
        });
      }

      if (result.success) {
        // Navegar según el tipo de usuario
        const path = formData.userType === 'shop' ? '/shop-dashboard' : '/dashboard';
        navigate(path);
      } else {
        setErrorMessage(result.error || 'Authentication failed');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // In a real app, this would trigger Google OAuth
    alert('Google Authentication coming soon!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5AB9EA] via-[#4A9FD8] to-[#6B8CCC] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Solvit</h1>
          <p className="text-white/80 text-lg">Your Next Opportunity Awaits</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-2xl p-8">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 bg-white/10 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                isLogin 
                  ? 'bg-[#2EC4BC] text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                !isLogin 
                  ? 'bg-[#2EC4BC] text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          {/* Mensaje de error */}
          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg mb-4">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type Selection (Sign Up Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 'worker' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.userType === 'worker'
                        ? 'border-[#2EC4BC] bg-[#2EC4BC]/20'
                        : 'border-white/30 bg-white/10 hover:border-white/50'
                    }`}
                  >
                    <User className="w-8 h-8 mx-auto mb-2 text-white" />
                    <p className="text-white font-semibold text-sm">Worker</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 'shop' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.userType === 'shop'
                        ? 'border-[#2EC4BC] bg-[#2EC4BC]/20'
                        : 'border-white/30 bg-white/10 hover:border-white/50'
                    }`}
                  >
                    <Briefcase className="w-8 h-8 mx-auto mb-2 text-white" />
                    <p className="text-white font-semibold text-sm">Shop</p>
                  </button>
                </div>
              </div>
            )}

            {/* Name Field (Sign Up Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required={!isLogin}
                    className="w-full pl-11 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#2EC4BC] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#2EC4BC] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#2EC4BC] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password (Login Only) */}
            {isLogin && (
              <div className="text-right">
                <Link to="#" className="text-sm text-white/80 hover:text-white transition">
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2EC4BC] hover:bg-[#24A09A] text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Loading...'
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/10 text-white/70 rounded-full">Or continue with</span>
            </div>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-3"
          >
            <Chrome className="w-5 h-5" />
            Google
            <span className="ml-2 text-xs bg-yellow-500/80 px-2 py-0.5 rounded-full">Coming Soon</span>
          </button>

          {/* Skip Link */}
          <div className="mt-6 text-center">
            <Link 
              to={skipPath} 
              className="text-white/80 hover:text-white transition flex items-center justify-center gap-2 text-sm"
            >
              Skip for now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Terms & Privacy */}
        <p className="text-center text-white/60 text-xs mt-6">
          By continuing, you agree to Solvit's{' '}
          <Link to="#" className="text-white/80 hover:text-white underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="#" className="text-white/80 hover:text-white underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;