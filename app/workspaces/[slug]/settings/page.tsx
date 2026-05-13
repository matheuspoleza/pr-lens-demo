import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SECTIONS = [
  { id: "general", label: "General" },
  { id: "members", label: "Members" },
  { id: "billing", label: "Billing" },
  { id: "danger", label: "Danger zone" },
] as const;

export default async function WorkspaceSettingsPage({ params }: PageProps) {
  const { slug } = await params;
  const workspace = await prisma.workspace.findUnique({ where: { slug } });
  if (!workspace) notFound();
  const members = await prisma.membership.findMany({
    where: { workspaceId: workspace.id },
    include: { user: true },
  });

  return (
    <main className="mx-auto grid w-full max-w-5xl grid-cols-[200px_1fr] gap-8 px-6 py-12">
      <aside className="sticky top-12 self-start space-y-1 text-sm">
        <div className="mb-4 space-y-0.5">
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Workspace
          </p>
          <p className="font-medium">{workspace.name}</p>
        </div>
        <nav className="flex flex-col">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-md px-2 py-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            >
              {section.label}
            </a>
          ))}
        </nav>
        <Link
          href={`/workspaces/${workspace.slug}`}
          className="mt-6 block px-2 text-xs text-neutral-500 hover:text-neutral-700"
        >
          ← Back to overview
        </Link>
      </aside>

      <div className="space-y-10">
        <section id="general" className="space-y-4">
          <header>
            <h2 className="text-lg font-semibold tracking-tight">General</h2>
            <p className="text-sm text-neutral-500">
              Identity that other members see across Atlas.
            </p>
          </header>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200 bg-white p-6">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-neutral-500">
                Workspace name
              </span>
              <input
                defaultValue={workspace.name}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-neutral-500">
                URL slug
              </span>
              <div className="flex items-center rounded-lg border border-neutral-200 focus-within:border-neutral-900">
                <span className="px-3 text-sm text-neutral-400">atlas.app/</span>
                <input
                  defaultValue={workspace.slug}
                  className="flex-1 rounded-r-lg py-2 pr-3 text-sm focus:outline-none"
                />
              </div>
            </label>
          </div>
        </section>

        <section id="members" className="space-y-4">
          <header className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Members</h2>
              <p className="text-sm text-neutral-500">
                {members.length} {members.length === 1 ? "member" : "members"} in
                this workspace.
              </p>
            </div>
            <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800">
              Invite member
            </button>
          </header>
          <ul className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white">
            {members.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between px-6 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{m.user.name ?? m.user.email}</p>
                  <p className="text-xs text-neutral-500">{m.user.email}</p>
                </div>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                  {m.role.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="billing" className="space-y-4">
          <header>
            <h2 className="text-lg font-semibold tracking-tight">Billing</h2>
            <p className="text-sm text-neutral-500">
              Plan tier and invoicing details.
            </p>
          </header>
          <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6">
            <div>
              <p className="text-sm font-medium">
                Current plan — {workspace.plan.toLowerCase()}
              </p>
              <p className="text-xs text-neutral-500">
                Manage usage and seats on the pricing page.
              </p>
            </div>
            <Link
              href="/pricing"
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium hover:border-neutral-300"
            >
              Manage plan
            </Link>
          </div>
        </section>

        <section id="danger" className="space-y-4">
          <header>
            <h2 className="text-lg font-semibold tracking-tight text-rose-700">
              Danger zone
            </h2>
            <p className="text-sm text-neutral-500">
              Irreversible operations on this workspace.
            </p>
          </header>
          <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-6">
            <div>
              <p className="text-sm font-medium text-rose-900">
                Delete workspace
              </p>
              <p className="text-xs text-rose-700">
                Removes every task, membership, and billing record. Cannot be
                undone.
              </p>
            </div>
            <button className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100">
              Delete
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
