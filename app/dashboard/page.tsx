import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="flex-1 max-w-xl mx-auto px-6 py-16 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#9BCBEB] -rotate-1">
        Dashboard
      </h1>
      <p className="mt-4 text-[#C7D6E8]">This page only loads if you&apos;re signed in.</p>
      <p className="mt-2 text-sm text-[#7E93AE]">
        Signed in as <strong className="text-[#F5F3EE]">{user.email}</strong>
      </p>
    </main>
  );
}