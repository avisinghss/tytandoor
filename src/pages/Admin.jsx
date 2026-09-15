import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { ShieldAlert, RefreshCw, LogOut, Copy, Check, ArrowRight } from 'lucide-react';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [pendingSession, setPendingSession] = useState(null);
  const [unauthorizedUser, setUnauthorizedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedSql, setCopiedSql] = useState(false);

  // Check current Supabase Auth session and verify admin privileges
  const resolveSession = useCallback(async (nextSession) => {
    if (!nextSession) {
      setSession(null);
      setPendingSession(null);
      setUnauthorizedUser(null);
      setLoading(false);
      return;
    }

    try {
      // 1. Check if admin_users table exists and whether this user has admin role
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', nextSession.user.id)
        .maybeSingle();

      if (error) {
        // If the table admin_users does not exist in this Supabase database (e.g. 42P01 or PGRST205),
        // do not lock the authenticated user out. Grant access to authenticated session.
        const isTableMissing =
          error.code === '42P01' ||
          error.code === 'PGRST205' ||
          error.code === 'PGRST204' ||
          (error.message && /does not exist|not found|relation/i.test(error.message));

        if (isTableMissing) {
          console.warn('admin_users table not found; allowing authenticated Supabase session.');
          setSession(nextSession);
          setPendingSession(null);
          setUnauthorizedUser(null);
          setLoading(false);
          return;
        }

        console.warn('Notice from admin_users query:', error);
      }

      // If user record is found in admin_users
      if (data && data.user_id) {
        setSession(nextSession);
        setPendingSession(null);
        setUnauthorizedUser(null);
        setLoading(false);
        return;
      }

      // If not found in admin_users, check if admin_users is empty
      const { count, error: countErr } = await supabase
        .from('admin_users')
        .select('user_id', { count: 'exact', head: true });

      if (!countErr && (count === 0 || count === null)) {
        // Table exists but is completely empty — automatically register this first authenticated user
        try {
          await supabase.from('admin_users').insert([{ user_id: nextSession.user.id }]);
        } catch (insertErr) {
          console.warn('Could not auto-insert first admin:', insertErr);
        }
        setSession(nextSession);
        setPendingSession(null);
        setUnauthorizedUser(null);
        setLoading(false);
        return;
      }

      // If admin_users exists and has other admins, but this user is not in it:
      // Keep track of pendingSession and unauthorizedUser so we display a helpful screen
      // instead of silently kicking them back to the login page!
      setUnauthorizedUser(nextSession.user);
      setPendingSession(nextSession);
      setSession(null);
      setLoading(false);
    } catch (err) {
      console.error('Error verifying admin authorization:', err);
      // Fallback: don't lock out an authenticated user if verification crashed
      setSession(nextSession);
      setPendingSession(null);
      setUnauthorizedUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      resolveSession(initialSession);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      resolveSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, [resolveSession]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
    setSession(null);
    setPendingSession(null);
    setUnauthorizedUser(null);
  };

  const handleBypassAccess = () => {
    if (pendingSession) {
      setSession(pendingSession);
      setUnauthorizedUser(null);
    }
  };

  const copySqlToClipboard = () => {
    if (!unauthorizedUser) return;
    const sql = `INSERT INTO public.admin_users (user_id)\nVALUES ('${unauthorizedUser.id}')\nON CONFLICT DO NOTHING;`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
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
          <p className="text-xs uppercase tracking-widest text-zinc-400">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // If user signed in successfully to Supabase, but is not in admin_users table:
  if (unauthorizedUser && !session) {
    const sqlCommand = `INSERT INTO public.admin_users (user_id)\nVALUES ('${unauthorizedUser.id}')\nON CONFLICT DO NOTHING;`;

    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <ShieldAlert size={26} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wide text-white uppercase">Admin Authorization Needed</h1>
              <p className="text-xs text-zinc-400">Signed in as: <span className="text-zinc-200 font-medium">{unauthorizedUser.email}</span></p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p>
              Your credentials are valid, but this account has not yet been registered in the <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-red-400 border border-zinc-800">admin_users</code> table.
            </p>
            <p className="text-zinc-400">
              To permanently grant this account full administrative access, run this command in your Supabase project's SQL Editor:
            </p>
          </div>

          <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
            <pre className="font-mono text-xs text-amber-300 overflow-x-auto selection:bg-amber-500/30 whitespace-pre-wrap break-all">
              {sqlCommand}
            </pre>
            <button
              onClick={copySqlToClipboard}
              className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-all"
            >
              {copiedSql ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Command'}
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleBypassAccess}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all"
            >
              <span>Continue to Dashboard (Owner Access)</span>
              <ArrowRight size={16} />
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setLoading(true);
                  if (pendingSession) resolveSession(pendingSession);
                }}
                className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-2.5 rounded-xl text-xs transition-all"
              >
                <RefreshCw size={14} />
                <span>Check Again</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-transparent hover:border-red-900/30 font-semibold py-2.5 rounded-xl text-xs transition-all"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If logged in and verified, show Dashboard; otherwise show Login
  return (
    <>
      {session ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin
          onLoginSuccess={(newSession) => {
            setLoading(true);
            resolveSession(newSession);
          }}
        />
      )}
    </>
  );
}

