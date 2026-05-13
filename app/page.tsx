import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Atlas — demo SaaS
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          A project tool for teams that ship.
        </h1>
        <p className="text-neutral-600">
          This repository powers the PR Lens reference scenario. The product is
          intentionally lightweight: workspaces, tasks, memberships, and a
          forthcoming billing module. Browse the surface to get a feel for the
          shape of the system, then look at the open pull requests to see how
          PR Lens classifies real changes.
        </p>
      </header>

      <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/workspaces"
          className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-300"
        >
          <p className="text-sm font-semibold">Workspaces</p>
          <p className="text-sm text-neutral-600">
            See workspaces and their members.
          </p>
        </Link>
        <Link
          href="/tasks"
          className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-300"
        >
          <p className="text-sm font-semibold">Tasks</p>
          <p className="text-sm text-neutral-600">
            The unit of work in Atlas.
          </p>
        </Link>
      </nav>
    </main>
  );
}
