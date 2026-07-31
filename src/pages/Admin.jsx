import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current Supabase Auth session on mount
    const checkSession = async (nextSession) => {
      setSession(nextSession);
      if (!nextSession) { setIsAdmin(false); setLoading(false); return; }
      const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', nextSession.user.id).maybeSingle();
      setIsAdmin(Boolean(data));
      setLoading(false);
    };
    supabase.auth.getSession().then(({ data: { session } }) => checkSession(session));

    // 2. Listen for auth state changes (login, logout, session expiration)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      checkSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); setIsAdmin(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-zinc-400">Loading Portal...</p>
        </div>
      </div>
    );
  }

  // If logged in, show Dashboard; otherwise show Login
  return (
    <>
      {session && isAdmin ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLoginSuccess={(newSession) => setSession(newSession)} />
      )}
    </>
  );
}
