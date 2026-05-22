"use client";

import { useEffect, useState } from "react";

export default function SlideshowPage() {
  const [photo, setPhoto] = useState("");
  const [queueLength, setQueueLength] = useState(0);

  async function loadNext() {
    const res = await fetch("/api/next-photo");
    const data = await res.json();

    setPhoto(data.photo);
  }

  async function loadQueueStatus() {
    const res = await fetch("/api/queue-status");
    const data = await res.json();

    setQueueLength(data.queueLength);
  }

  useEffect(() => {
    loadNext();
    loadQueueStatus();

    // slideshow interval
    const slideshowInterval = setInterval(() => {
      loadNext();
    }, 60000);

    // queue polling interval
    const queueInterval = setInterval(() => {
      loadQueueStatus();
    }, 1000);

    return () => {
      clearInterval(slideshowInterval);
      clearInterval(queueInterval);
    };
  }, []);

  if (!photo) {
    return (
      <main className="w-screen h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      {/* PHOTO */}
      <img
        src={photo}
        className="w-full h-full object-contain"
        alt=""
      />

      {/* QR OVERLAY */}
      <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center gap-3">
        <img
          src="/qr-code-upload.svg"
          alt="QR Code"
          className="w-40 h-40 bg-white p-2 rounded-lg"
        />

        <div className="text-center text-white max-w-[220px]">
          {queueLength === 0 ? (
            <>
              <p className="text-lg font-semibold">
                Lade ein Foto hoch!
              </p>

              <p className="text-sm text-white/80">
                Dein Bild erscheint als Nächstes auf der Leinwand 📸
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold">
                {queueLength} neue Fotos kommen als Nächstes
              </p>

              <p className="text-sm text-white/80">
                Neue Uploads werden als Nächstes angezeigt
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}