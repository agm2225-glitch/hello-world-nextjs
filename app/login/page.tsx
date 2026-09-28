'use client';

import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Sign In</h1>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '6px',
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}