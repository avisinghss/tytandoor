import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Lock, Mail } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const normalizedEmail = email.trim().toLowerCase();

    const result = forgotPassword
      ? await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo: `${window.location.origin}/admintytandoor` })
      : await supabase.auth.signInWithPassword({ email: normalizedEmail, password });

    if (result.error) setMessage({ type: 'error', text: result.error.message });
    else if (forgotPassword) setMessage({ type: 'success', text: 'Password reset link sent. Please check your email.' });
    else onLoginSuccess(result.data.session);
    setLoading(false);
  };

  return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2"><h1 className="text-2xl font-black tracking-wider uppercase text-red-600">Tytan Door Admin</h1><p className="text-xs text-zinc-400">{forgotPassword ? 'Reset your password' : 'Sign in to the management portal'}</p></div>
      {message && <div className={`p-3 rounded-xl text-xs font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>{message.text}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Admin email<div className="relative mt-1"><Mail className="absolute left-3.5 top-3 text-zinc-500" size={18}/><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm" /></div></label>
        {!forgotPassword && <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Password<div className="relative mt-1"><Lock className="absolute left-3.5 top-3 text-zinc-500" size={18}/><input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm" /></div></label>}
        <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50">{loading ? 'Processing…' : forgotPassword ? 'Send reset link' : 'Sign in'}</button>
      </form>
      <button onClick={() => { setForgotPassword(!forgotPassword); setMessage(null); }} className="w-full text-xs text-zinc-400 hover:text-white">{forgotPassword ? '← Back to sign in' : 'Forgot password?'}</button>
    </div>
  </div>;
}
