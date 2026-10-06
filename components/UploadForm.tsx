"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/generate-caption", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Try again.");
      return;
    }

    setFile(null);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md rounded-lg border-2 border-dashed border-[#2E4260] bg-[#16243A]/60 px-6 py-8 text-center"
    >
      <label className="block cursor-pointer">
        <span className="text-sm text-[#C7D6E8]">
          {file ? file.name : "Drop a photo, or click to choose one"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>

      <button
        type="submit"
        disabled={!file || loading}
        className="mt-5 rounded-full bg-[#FFD23F] px-6 py-2.5 text-sm font-semibold text-[#0F1B2D] hover:bg-[#ffdb63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Writing a caption..." : "Upload & Caption"}
      </button>

      {error && <p className="mt-3 text-sm text-[#FF8FA3]">{error}</p>}
    </form>
  );
}