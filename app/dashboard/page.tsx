import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>🔒 Protected Dashboard</h1>
      <p>Welcome! This page is gated and only accessible to logged-in users.</p>
      <p>Logged in as: <strong>{user.email}</strong></p>
    </div>
  );
}