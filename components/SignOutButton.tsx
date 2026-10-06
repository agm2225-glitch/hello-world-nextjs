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
      className="rounded-sm border border-[#2C3E50] px-3 py-1.5 text-sm text-[#2C3E50] hover:bg-[#2C3E50] hover:text-[#F4F4F0] transition-colors"
    >
      Clock Out
    </button>
  );
}