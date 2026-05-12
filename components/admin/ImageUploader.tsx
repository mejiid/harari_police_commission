"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2, Plus } from "lucide-react";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
};

export default function ImageUploader({ value, onChange, label }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) continue;

        const data = await res.json();
        newUrls.push(data.url);
      }

      onChange([...value, ...newUrls]);
    } catch (err) {
      setError("Failed to upload some images. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    const newList = [...value];
    newList.splice(index, 1);
    onChange(newList);
  }

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-2">
          <ImageIcon className="w-3 h-3" />
          {label} (Multiple)
        </label>
      )}

      <div className="grid grid-cols-2 gap-4">
        {value.map((url, index) => (
          <div key={url} className="relative aspect-video group overflow-hidden bg-surface-container-low border border-outline-variant/30">
            <img
              src={url}
              alt={`Gallery ${index}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="bg-red-600 text-white p-2 hover:bg-red-700 transition-all shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`aspect-video border-2 border-dashed border-outline-variant/30 bg-surface-container-low flex flex-col items-center justify-center gap-2 hover:border-accent hover:bg-white transition-all group ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          ) : (
            <>
              <Plus className="w-6 h-6 text-primary group-hover:text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Add Photo</span>
            </>
          )}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        multiple
        className="hidden"
      />

      {error && (
        <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{error}</p>
      )}
    </div>
  );
}
