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
      <header className="mb-12 flex flex-col items-center text-center">
        <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl text-[#FFD23F] -rotate-2 leading-none">
          Caption Rater
        </h1>
        <p className="mt-4 max-w-md text-[#C7D6E8]">
          Upload a photo from campus. An AI writes a caption. You decide if it&apos;s actually funny.
        </p>

        {!user && (
          <Link
            href="/login"
            className="mt-6 inline-block rounded-full bg-[#FF5C8A] px-6 py-3 text-sm font-semibold text-[#0F1B2D] hover:bg-[#ff7a9e] transition-colors"
          >
            Sign in with Google to upload
          </Link>
        )}
      </header>

      {user && <UploadForm />}

      {captionsWithVotes.length === 0 ? (
        <p className="text-center text-[#7E93AE] mt-16">
          No captions yet. Be the first to upload a photo.
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
              rotate={i % 2 === 0 ? -2 : 2}
            />
          ))}
        </div>
      )}
    </main>
  );
}