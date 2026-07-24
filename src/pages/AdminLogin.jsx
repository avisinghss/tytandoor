import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Lock, Mail, KeyRound } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@tytandoor.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'first_time' | 'forgot'
  const [message, setMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email.toLowerCase() !== 'admin@tytandoor.com') {
      setMessage({ type: 'error', text: 'Access restricted to admin@tytandoor.com' });
      return;
    }

    setLoading(true);
    setMessage(null);

    if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        onLoginSuccess(data.session);
      }
    } else if (mode === 'first_time') {
      // Create admin account in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: 'Admin password created successfully! Please login now.' });
        setMode('login');
      }
    } else if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin',
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: 'Password reset link sent to admin@tytandoor.com' });
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black tracking-wider uppercase text-red-600">
            Tytan Door Admin
          </h1>
          <p className="text-xs text-zinc-400">
            {mode === 'login' && 'Sign in to management portal'}
            {mode === 'first_time' && 'First Visit: Create Admin Password'}
            {mode === 'forgot' && 'Reset Admin Password'}
          </p>
        </div>

        {/* Feedback Message */}
        {message && (
          <div className={`p-3 rounded-xl text-xs font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-400">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-zinc-500" size={18} />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl pl-10 pr-4 py-2.5 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-400">
                {mode === 'first_time' ? 'Set New Password' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-zinc-500" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'first_time' ? 'Create Admin Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* Navigation Modes */}
        <div className="flex flex-col gap-2 pt-2 text-center text-xs text-zinc-400 border-t border-zinc-800">
          {mode === 'login' && (
            <>
              <button onClick={() => setMode('first_time')} className="hover:text-white transition">
                First visit? Create Admin Password
              </button>
              <button onClick={() => setMode('forgot')} className="hover:text-white transition">
                Forgot Password?
              </button>
            </>
          )}

          {mode !== 'login' && (
            <button onClick={() => setMode('login')} className="hover:text-white transition">
              ← Back to Sign In
            </button>
          )}
        </div>

      </div>
    </div>
  );
}