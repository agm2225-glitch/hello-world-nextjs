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
      <div className="w-full max-w-sm text-center border border-[#D8D2C2] bg-[#F4F4F0] p-8">
        <p className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-2">HR Department</p>
        <h1 className="text-3xl font-bold text-[#2C3E50]">Employee Sign-In</h1>
        <p className="mt-3 text-sm text-[#6B7280]">
          Use your Google account to badge in and access the break room.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="mt-8 w-full rounded-sm bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-[#F4F4F0] hover:bg-[#1f2d3a] transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}