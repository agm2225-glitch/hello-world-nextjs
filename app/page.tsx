import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface RecordItem {
  id: number;
  title: string;
  description: string;
}

export default async function Home() {
  const supabase = await createClient();

  // Check if a user is currently logged in
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, redirect straight to the login page
  if (!user) {
    redirect('/login');
  }

  // Querying the 'Facts' table
  const { data: items, error } = await supabase
    .from('Facts')
    .select('id, title, description');

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8 flex justify-center items-center">
        <div className="max-w-md w-full rounded-xl bg-red-950/60 border border-red-500/30 p-6">
          <h1 className="text-lg font-semibold text-red-400 mb-1">Error Loading Data</h1>
          <p className="text-sm text-red-200">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Bizarre World Records
          </h1>
          <p className="text-slate-400 text-sm">
            Live dataset fetched from Supabase • Logged in as {user.email}
          </p>
        </header>

        <div className="grid gap-4">
          {items && items.length > 0 ? (
            items.map((item: RecordItem) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm hover:border-slate-700 transition"
              >
                <h2 className="text-lg font-bold text-slate-100 mb-1">
                  {item.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No records found in database.</p>
          )}
        </div>
      </div>
    </main>
  );
}