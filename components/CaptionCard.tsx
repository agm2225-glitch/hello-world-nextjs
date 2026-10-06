"use client";

import { useTransition } from "react";
import { castVote } from "@/app/actions/vote";

type Props = {
  id: string;
  imageUrl: string;
  captionText: string;
  upvotes: number;
  downvotes: number;
  isLoggedIn: boolean;
  rotate?: number;
};

export default function CaptionCard({
  id,
  imageUrl,
  captionText,
  upvotes,
  downvotes,
  isLoggedIn,
  rotate = -1.5,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleVote = (voteType: "up" | "down") => {
    if (!isLoggedIn) {
      alert("Please clock in to vote.");
      return;
    }
    startTransition(() => {
      castVote(id, voteType);
    });
  };

  return (
    <div
      className="group relative bg-[#F4F4F0] border border-[#D8D2C2] p-4 pb-5 shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-transform hover:rotate-0"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="absolute -top-2 left-6 h-5 w-14 bg-[#FFE135] rotate-[-4deg] opacity-90" />

      <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-2">
        Exhibit {id.slice(0, 4)}
      </p>

      <div className="overflow-hidden border border-[#D8D2C2]">
        <img src={imageUrl} alt="" className="w-full aspect-square object-cover grayscale-[15%]" />
      </div>

      <p className="mt-4 text-[#2C3E50] text-xl font-[family-name:var(--font-handwritten)] leading-snug">
        {captionText}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => handleVote("up")}
          disabled={isPending}
          className="border-2 border-[#2E7D32] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#2E7D32] rotate-[-2deg] hover:bg-[#2E7D32] hover:text-[#F4F4F0] transition-colors disabled:opacity-50"
        >
          Approved ({upvotes})
        </button>
        <button
          onClick={() => handleVote("down")}
          disabled={isPending}
          className="border-2 border-[#C0392B] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#C0392B] rotate-[2deg] hover:bg-[#C0392B] hover:text-[#F4F4F0] transition-colors disabled:opacity-50"
        >
          Rejected ({downvotes})
        </button>
      </div>
    </div>
  );
}