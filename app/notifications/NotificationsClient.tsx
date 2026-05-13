"use client";

import { useEffect, useState } from "react";

interface NotificationItem {
  id: string;
  userId: string;
  taskId: string;
  kind: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

const CURRENT_USER_ID = "u_iris";

export function NotificationsClient() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/notifications?userId=${CURRENT_USER_ID}`)
      .then((res) => res.json())
      .then((payload: { data: NotificationItem[] }) => {
        setItems(payload.data);
        setLoading(false);
      });
  }, []);

  async function unwatch(taskId: string) {
    await fetch(`/api/v1/tasks/${taskId}/watchers?userId=${CURRENT_USER_ID}`, {
      method: "DELETE",
    });
    setItems((prev) => prev.filter((n) => n.taskId !== taskId));
  }

  if (loading) {
    return <p className="text-sm text-stone-500">Loading…</p>;
  }
  if (items.length === 0) {
    return <p className="text-sm text-stone-500">No notifications yet.</p>;
  }
  return (
    <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium">{item.body}</p>
            <p className="text-xs text-stone-500">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
          <button
            type="button"
            onClick={() => unwatch(item.taskId)}
            className="rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-600 hover:bg-stone-50"
          >
            Unwatch
          </button>
        </li>
      ))}
    </ul>
  );
}
