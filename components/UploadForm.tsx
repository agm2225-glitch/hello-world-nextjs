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
      className="mx-auto max-w-md border-2 border-dashed border-[#2C3E50]/40 bg-[#F4F4F0] px-6 py-8 text-center"
    >
      <p className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-3">
        Submission Form 27-B
      </p>
      <label className="block cursor-pointer">
        <span className="text-sm text-[#2C3E50]">
          {file ? file.name : "Attach photo evidence"}
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
        className="mt-5 rounded-sm bg-[#FFE135] px-6 py-2.5 text-sm font-bold text-[#2C3E50] hover:bg-[#ffe95c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing paperwork..." : "Submit for Review"}
      </button>

      {error && <p className="mt-3 text-sm text-[#C0392B]">{error}</p>}
    </form>
  );
}