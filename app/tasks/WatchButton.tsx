"use client";

import { useState } from "react";

interface WatchButtonProps {
  taskId: string;
  userId: string;
  watching: boolean;
}

export function WatchButton({ taskId, userId, watching }: WatchButtonProps) {
  const [isWatching, setIsWatching] = useState(watching);
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    if (isWatching) {
      await fetch(`/api/v1/tasks/${taskId}/watchers?userId=${userId}`, {
        method: "DELETE",
      });
      setIsWatching(false);
    } else {
      await fetch(`/api/v1/tasks/${taskId}/watchers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setIsWatching(true);
    }
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`rounded-md border px-2 py-1 text-xs ${
        isWatching
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-stone-200 text-stone-600 hover:bg-stone-50"
      }`}
    >
      {isWatching ? "Watching" : "Watch"}
    </button>
  );
}
