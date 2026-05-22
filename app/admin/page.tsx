"use client";

import { useEffect, useState } from "react";

type State = {
  queue: string[];
};

export default function AdminPage() {
  const [state, setState] = useState<State>({ queue: [] });
  const [loading, setLoading] = useState(true);

  async function loadState() {
    const res = await fetch("/api/admin/state");
    const data = await res.json();
    setState(data);
    setLoading(false);
  }

  async function removeFromQueue(filename: string) {
    await fetch("/api/admin/remove", {
      method: "POST",
      body: JSON.stringify({ filename }),
    });

    loadState();
  }

  async function clearQueue() {
    await fetch("/api/admin/clear", {
      method: "POST",
    });

    loadState();
  }

  useEffect(() => {
    loadState();

    const interval = setInterval(loadState, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-white bg-black min-h-screen">
        Loading admin panel...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      <div className="space-y-2">
        <p>Queue: {state.queue.length} photos</p>

        <button
          onClick={clearQueue}
          className="px-4 py-2 bg-red-600 rounded"
        >
          Queue leeren
        </button>
      </div>

      <div className="space-y-3">
        {state.queue.length === 0 && (
          <p className="text-white/60">Queue ist leer</p>
        )}

        {state.queue.map((file) => (
          <div
            key={file}
            className="flex items-center justify-between bg-white/10 p-3 rounded"
          >
            <img
              src={`/api/photo/${file}`}
              className="w-20 h-20 object-cover rounded"
            />

            <span className="text-sm text-white/70">
              {file}
            </span>

            <button
              onClick={() => removeFromQueue(file)}
              className="px-3 py-1 bg-red-500 rounded"
            >
              Entfernen
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}