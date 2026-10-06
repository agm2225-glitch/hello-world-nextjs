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
        <p className="text-[#6B7280]">Loading personnel file...</p>
      </main>
    );
  }

  const isMissingName = !firstName.trim() || !lastName.trim();

  return (
    <main className="flex-1 max-w-md mx-auto px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-2">Human Resources</p>
      <h1 className="text-3xl font-bold text-[#2C3E50]">Personnel File</h1>

      {isMissingName && (
        <div className="mt-6 border-l-4 border-[#FFE135] bg-[#FFE135]/20 px-4 py-3 text-sm text-[#2C3E50]">
          Please complete your first and last name for HR records.
        </div>
      )}

      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Profile avatar"
          width={120}
          height={120}
          className="mt-6 h-28 w-28 object-cover border-2 border-[#2C3E50] grayscale-[10%]"
        />
      )}

      <div className="mt-6">
        <label className="block text-sm text-[#6B7280] mb-2">Employee Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="text-sm text-[#6B7280] file:mr-4 file:rounded-sm file:border file:border-[#2C3E50] file:bg-[#F4F4F0] file:px-4 file:py-2 file:text-sm file:text-[#2C3E50]"
        />
      </div>

      <div className="mt-5">
        <label className="block text-sm text-[#6B7280] mb-2">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border border-[#D8D2C2] bg-[#F4F4F0] px-3 py-2 text-[#2C3E50] focus:outline-none focus:border-[#2C3E50]"
        />
      </div>

      <div className="mt-5">
        <label className="block text-sm text-[#6B7280] mb-2">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border border-[#D8D2C2] bg-[#F4F4F0] px-3 py-2 text-[#2C3E50] focus:outline-none focus:border-[#2C3E50]"
        />
      </div>

      <button
        onClick={updateProfile}
        className="mt-8 rounded-sm bg-[#2C3E50] px-6 py-2.5 text-sm font-semibold text-[#F4F4F0] hover:bg-[#1f2d3a] transition-colors"
      >
        File Update
      </button>
    </main>
  );
}