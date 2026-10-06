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
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#FFD23F] -rotate-2">
          Sign in
        </h1>
        <p className="mt-3 text-sm text-[#C7D6E8]">
          Use your Google account to upload photos and vote on captions.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="mt-8 w-full rounded-full bg-[#FF5C8A] px-6 py-3 text-sm font-semibold text-[#0F1B2D] hover:bg-[#ff7a9e] transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}