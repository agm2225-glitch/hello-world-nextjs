"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full border border-[#2E4260] px-4 py-1.5 text-sm text-[#C7D6E8] hover:border-[#FF5C8A] hover:text-[#FF5C8A] transition-colors"
    >
      Sign out
    </button>
  );
}