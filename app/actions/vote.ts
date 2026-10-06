"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function castVote(captionId: string, voteType: "up" | "down") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to vote.");
  }

  const { error } = await supabase
    .from("votes")
    .upsert(
      { caption_id: captionId, user_id: user.id, vote_type: voteType },
      { onConflict: "caption_id,user_id" }
    );

  if (error) throw new Error(error.message);

  revalidatePath("/");
}