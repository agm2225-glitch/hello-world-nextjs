import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UploadForm from "@/components/UploadForm";
import CaptionCard from "@/components/CaptionCard";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: captions } = await supabase
    .from("captions")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: votes } = await supabase.from("votes").select("*");

  const captionsWithVotes = (captions ?? []).map((c) => {
    const relatedVotes = (votes ?? []).filter((v) => v.caption_id === c.id);
    return {
      ...c,
      upvotes: relatedVotes.filter((v) => v.vote_type === "up").length,
      downvotes: relatedVotes.filter((v) => v.vote_type === "down").length,
    };
  });

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-2">
          Interoffice Memo &middot; To: All Staff
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#2C3E50]">
          The Daily Caption
        </h1>
        <p className="mt-3 max-w-md mx-auto text-[#6B7280]">
          Submit a photo from around the office. Management&apos;s AI will generate a caption.
          Vote accordingly.
        </p>

        {!user && (
          <Link
            href="/login"
            className="mt-6 inline-block rounded-sm bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-[#F4F4F0] hover:bg-[#1f2d3a] transition-colors"
          >
            Clock in to participate
          </Link>
        )}
      </header>

      {user && <UploadForm />}

      {captionsWithVotes.length === 0 ? (
        <p className="text-center text-[#6B7280] mt-16">
          This conference room is empty. No submissions yet.
        </p>
      ) : (
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {captionsWithVotes.map((c, i) => (
            <CaptionCard
              key={c.id}
              id={c.id}
              imageUrl={c.image_url}
              captionText={c.caption_text}
              upvotes={c.upvotes}
              downvotes={c.downvotes}
              isLoggedIn={!!user}
              rotate={i % 2 === 0 ? -1.5 : 1.5}
            />
          ))}
        </div>
      )}
    </main>
  );
}