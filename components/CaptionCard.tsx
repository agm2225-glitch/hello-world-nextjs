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
  rotate = -2,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleVote = (voteType: "up" | "down") => {
    if (!isLoggedIn) {
      alert("Sign in to vote on captions.");
      return;
    }
    startTransition(() => {
      castVote(id, voteType);
    });
  };

  return (
    <div
      className="group relative bg-[#16243A] p-3 pb-5 rounded-sm shadow-[0_10px_25px_rgba(0,0,0,0.35)] transition-transform hover:rotate-0"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-16 bg-[#FFD23F]/90 rotate-[-3deg] rounded-[2px]" />

      <div className="overflow-hidden rounded-[2px] bg-[#0F1B2D]">
        <img src={imageUrl} alt="" className="w-full aspect-square object-cover" />
      </div>

      <p className="mt-4 text-[#F5F3EE] text-[15px] leading-snug">{captionText}</p>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => handleVote("up")}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-full border border-[#2E4260] px-3 py-1.5 text-sm text-[#C7D6E8] hover:border-[#FF5C8A] hover:text-[#FF5C8A] transition-colors disabled:opacity-50"
        >
          👍 <span>{upvotes}</span>
        </button>
        <button
          onClick={() => handleVote("down")}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-full border border-[#2E4260] px-3 py-1.5 text-sm text-[#C7D6E8] hover:border-[#9BCBEB] hover:text-[#9BCBEB] transition-colors disabled:opacity-50"
        >
          👎 <span>{downvotes}</span>
        </button>
      </div>
    </div>
  );
}