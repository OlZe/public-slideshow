"use client";

import { useRef, useState } from "react";

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Upload fehlgeschlagen ❌ Bitte erneut versuchen.");
    } finally {
      setUploading(false);

      // reset file input so same files can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function resetUI() {
    setSuccess(false);
    setError("");
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 gap-8">
      <h1 className="text-4xl font-bold text-center">
        📸 Fotos hochladen
      </h1>

      {/* SUCCESS STATE */}
      {success ? (
        <div className="flex flex-col items-center gap-6">
          <p className="text-xl text-center">
            🎉 Upload erfolgreich!
          </p>

          <button
            onClick={resetUI}
            className="px-6 py-4 bg-white text-black rounded-xl text-lg font-semibold active:scale-95 transition"
          >
            Weitere Fotos hochladen...
          </button>
        </div>
      ) : (
        /* UPLOAD STATE */
        <label className="w-full max-w-md border-2 border-dashed border-white/40 rounded-2xl p-10 text-center cursor-pointer active:scale-95 transition">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />

          <div className="space-y-3">
            <p className="text-xl font-semibold">
              Tippe hier, um Fotos auszuwählen
            </p>
            <p className="text-sm text-white/70">
              Mehrere Bilder gleichzeitig möglich
            </p>

            {uploading && (
              <p className="text-white/80">
                Upload läuft...
              </p>
            )}
          </div>
        </label>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-400 text-center max-w-md">
          {error}
        </p>
      )}
    </main>
  );
}