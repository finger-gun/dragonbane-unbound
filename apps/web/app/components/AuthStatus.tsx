'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { getSupabaseClient } from '../../lib/supabaseClient';

export default function AuthStatus() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session ?? null);
        setLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setLoading(false);
  };

  if (loading) {
    return <span className="pill">Checking session...</span>;
  }

  if (!session?.user) {
    return <span className="pill">Signed out</span>;
  }

  return (
    <span className="pill">
      Signed in as {session.user.email}
      <button className="auth-button" type="button" onClick={handleLogout}>
        Log out
      </button>
    </span>
  );
}
