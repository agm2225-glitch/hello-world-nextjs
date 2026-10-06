import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="w-full bg-[#F4F4F0] border-b-4 border-[#2C3E50] px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <Link href="/" className="block text-lg font-bold tracking-tight text-[#2C3E50]">
            Caption Rater, Inc.
          </Link>
          <p className="text-xs text-[#6B7280]">Memo circulated company-wide</p>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className="text-[#2C3E50] hover:underline">
                Dashboard
              </Link>
              <Link href="/profile" className="text-[#2C3E50] hover:underline">
                Employee Profile
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-sm bg-[#2C3E50] px-4 py-1.5 text-[#F4F4F0] font-semibold hover:bg-[#1f2d3a] transition-colors"
            >
              Clock In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}