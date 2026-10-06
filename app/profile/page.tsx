'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (data) {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setAvatarUrl(data.avatar_url || null);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const updateProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      alert('Error updating profile!');
    } else {
      alert('Profile updated successfully!');
      router.push('/');
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      alert('Error uploading avatar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-[#C7D6E8]">Loading profile...</p>
      </main>
    );
  }

  const isMissingName = !firstName.trim() || !lastName.trim();

  return (
    <main className="flex-1 max-w-md mx-auto px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#FFD23F] -rotate-2">
        Your profile
      </h1>

      {isMissingName && (
        <div className="mt-6 rounded-md border border-[#FFD23F]/40 bg-[#FFD23F]/10 px-4 py-3 text-sm text-[#FFD23F]">
          Add your first and last name to finish setting up your profile.
        </div>
      )}

      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Profile avatar"
          width={120}
          height={120}
          className="mt-6 h-28 w-28 rounded-full object-cover border-2 border-[#2E4260]"
        />
      )}

      <div className="mt-6">
        <label className="block text-sm text-[#C7D6E8] mb-2">Profile photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="text-sm text-[#C7D6E8] file:mr-4 file:rounded-full file:border-0 file:bg-[#2E4260] file:px-4 file:py-2 file:text-sm file:text-[#F5F3EE]"
        />
      </div>

      <div className="mt-5">
        <label className="block text-sm text-[#C7D6E8] mb-2">First name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full rounded-md border border-[#2E4260] bg-[#16243A] px-3 py-2 text-[#F5F3EE] focus:outline-none focus:border-[#9BCBEB]"
        />
      </div>

      <div className="mt-5">
        <label className="block text-sm text-[#C7D6E8] mb-2">Last name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full rounded-md border border-[#2E4260] bg-[#16243A] px-3 py-2 text-[#F5F3EE] focus:outline-none focus:border-[#9BCBEB]"
        />
      </div>

      <button
        onClick={updateProfile}
        className="mt-8 rounded-full bg-[#FF5C8A] px-6 py-2.5 text-sm font-semibold text-[#0F1B2D] hover:bg-[#ff7a9e] transition-colors"
      >
        Save profile
      </button>
    </main>
  );
}