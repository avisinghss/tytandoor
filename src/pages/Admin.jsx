import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current Supabase Auth session on mount
    const resolveSession = async (nextSession) => {
      if (!nextSession) {
        setSession(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', nextSession.user.id)
        .maybeSingle();
      setSession(!error && data ? nextSession : null);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      resolveSession(session);
    });

    // 2. Listen for auth state changes (login, logout, session expiration)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      resolveSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
    setSession(null);
  };

  useEffect(() => {
    if (!session || window.location.hostname !== 'admin.tytandoor.com') return undefined;

    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);

    let registration;
    navigator.serviceWorker?.register('/sw.js')
      .then((result) => {
        registration = result;
        return registration.update();
      })
      .catch((error) => console.error('Admin service worker registration failed:', error));

    return () => {
      manifestLink.remove();
    };
  }, [session]);

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
      {session ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLoginSuccess={(newSession) => setSession(newSession)} />
      )}
    </>
  );
}
