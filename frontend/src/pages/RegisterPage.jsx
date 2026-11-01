import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await register(fullName, email, password, confirmPassword);
      navigate('/closet', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message;
      if (typeof msg === 'string' && msg.trim()) {
        setError(msg);
      } else {
        setError('Unable to complete registration. Please check your information and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/closet', { replace: true });
    } catch (err) {
      setError('Google sign up failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Symbols disappear cleanly as soon as the user focuses or types
  const showNameSymbol = !fullName && !nameFocused;
  const showEmailSymbol = !email && !emailFocused;
  const showPasswordSymbol = !password && !passwordFocused;
  const showConfirmSymbol = !confirmPassword && !confirmFocused;

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex items-center justify-center px-4 py-6 sm:py-10">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#E6E4DF] shadow-card w-full max-w-[560px] space-y-5">
        <div className="text-center space-y-1.5">
          <span className="font-extrabold text-2xl tracking-tighter text-[#1C1C1C]">MyWardrobe</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">Create your digital closet</h2>
          <p className="text-xs text-[#757471]">Organize your clothes and discover bespoke styling combinations</p>
        </div>

        {error && (
          <div className="p-3 bg-[#FBEBEB] text-[#C45151] rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Premium Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || submitting}
          className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white border border-[#E6E4DF] hover:border-[#1C1C1C] rounded-xl font-medium text-xs sm:text-sm text-[#1C1C1C] shadow-subtle hover:shadow transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{googleLoading ? 'Connecting to Google...' : 'Sign up with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E6E4DF] w-full"></div>
          <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-[#9E9C98] font-medium absolute">
            or with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Row 1: Full Name + Email — side by side on sm+, stacked on xs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Full Name</label>
              <div className="relative">
                {showNameSymbol && (
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#9E9C98]">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  placeholder={showNameSymbol}
                  className={`fashion-input ${showNameSymbol ? 'pl-10' : 'pl-4'} transition-all`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Email Address</label>
              <div className="relative">
                {showEmailSymbol && (
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#9E9C98]">
                    <Mail className="w-4 h-4" />
                  </div>
                )}
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder={showEmailSymbol}
                  className={`fashion-input ${showEmailSymbol ? 'pl-10' : 'pl-4'} transition-all`}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Password + Confirm — side by side on sm+, stacked on xs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Password</label>
              <div className="relative">
                {showPasswordSymbol && (
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#9E9C98]">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder={showPasswordSymbol}
                  className={`fashion-input ${showPasswordSymbol ? 'pl-10' : 'pl-4'} transition-all`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Confirm Password</label>
              <div className="relative">
                {showConfirmSymbol && (
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#9E9C98]">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                  placeholder={showConfirmSymbol}
                  className={`fashion-input ${showConfirmSymbol ? 'pl-10' : 'pl-4'} transition-all`}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || googleLoading}
            className="w-full fashion-button-primary py-3 mt-2 text-sm font-semibold flex items-center justify-center"
          >
            {submitting ? 'Creating Closet...' : 'Get Started'} <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#E6E4DF] text-xs text-[#757471]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#1C1C1C] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
