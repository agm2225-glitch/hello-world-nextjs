import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="w-full border-b border-[#2E4260] px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg text-[#FFD23F]"
        >
          Caption Rater
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className="text-[#C7D6E8] hover:text-[#F5F3EE]">
                Dashboard
              </Link>
              <Link href="/profile" className="text-[#C7D6E8] hover:text-[#F5F3EE]">
                Profile
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-[#FF5C8A] px-4 py-1.5 text-[#0F1B2D] font-semibold hover:bg-[#ff7a9e] transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}