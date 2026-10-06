import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL_NAME = "gemini-3.5-flash-lite";

/**
 * Executes a Gemini request with retry logic for 503/UNAVAILABLE errors.
 */
async function generateWithRetry(params: any, retries = 3, delayMs = 2000) {
  let lastError: any = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await genAI.models.generateContent(params);
    } catch (err: any) {
      lastError = err;

      const status = err?.status || err?.statusCode || err?.error?.code;
      const statusString = err?.error?.status;

      const isOverloaded =
        status === 503 ||
        statusString === "UNAVAILABLE" ||
        err?.message?.includes("UNAVAILABLE") ||
        err?.message?.includes("high demand");

      if (isOverloaded && attempt < retries) {
        console.warn(
          `[Gemini 503 Overloaded] Retrying in ${delayMs}ms (attempt ${attempt}/${retries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2; // Exponential backoff
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate User
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    // 2. Validate File Input
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;
    const arrayBuffer = await file.arrayBuffer();

    // 3. Upload Image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("caption-images")
      .upload(filePath, arrayBuffer, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("caption-images").getPublicUrl(filePath);

    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // 4a. First LLM call: describe the image
    const descriptionResponse = await generateWithRetry({
      model: MODEL_NAME,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Describe what is happening in this image in one or two plain sentences.",
            },
            { inlineData: { mimeType: file.type, data: base64Image } },
          ],
        },
      ],
    });
    const description = descriptionResponse?.text?.trim() ?? "";

    // 4b. Second LLM call: write a funny caption FROM the description (the prompt chain)
    const captionResponse = await generateWithRetry({
      model: MODEL_NAME,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Here is a description of an image: "${description}". Write one short, funny caption for this image, in the style of a meme caption. Just return the caption text, nothing else.`,
            },
          ],
        },
      ],
    });
    const captionText = captionResponse?.text?.trim() ?? "Caption unavailable";

    // 5. Save Record in Database
    const { data: insertData, error: insertError } = await supabase
      .from("captions")
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        image_description: description,
        caption_text: captionText,
      })
      .select();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: insertData });
  } catch (err: any) {
    console.error("Unhandled API Error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}