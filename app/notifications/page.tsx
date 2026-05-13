import { NotificationsClient } from "./NotificationsClient";

export const metadata = {
  title: "Notifications · Atlas",
};

export default function NotificationsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Notifications</h1>
      <p className="mb-6 text-sm text-stone-600">
        Status changes on tasks you watch.
      </p>
      <NotificationsClient />
    </main>
  );
}
