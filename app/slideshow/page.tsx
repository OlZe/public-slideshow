"use client";

import { useEffect, useState } from "react";

export default function SlideshowPage() {
  const [photo, setPhoto] = useState("");

  async function loadNext() {
    const res = await fetch("/api/next-photo");
    const data = await res.json();

    setPhoto(data.photo);
  }

  useEffect(() => {
    loadNext(); // first image

    const interval = setInterval(() => {
      loadNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!photo) {
    return (
      <main className="w-screen h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="w-screen h-screen bg-black overflow-hidden">
      <img
        src={photo}
        className="w-full h-full object-contain"
        alt=""
      />
    </main>
  );
}