import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkspaceSettingsPage({ params }: PageProps) {
  const { slug } = await params;
  const workspace = await prisma.workspace.findUnique({ where: { slug } });
  if (!workspace) notFound();
  const members = await prisma.membership.findMany({
    where: { workspaceId: workspace.id },
    include: { user: true },
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        {workspace.name} settings
      </h1>
      <p className="mb-8 text-sm text-neutral-500">
        Manage the basics of this workspace.
      </p>

      <section className="mb-8 space-y-3 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          General
        </h2>
        <div>
          <label className="text-xs text-neutral-500">Workspace name</label>
          <input
            defaultValue={workspace.name}
            className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500">Slug</label>
          <input
            defaultValue={workspace.slug}
            className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="space-y-2 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Members
        </h2>
        <ul className="divide-y divide-neutral-100">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-2 text-sm">
              <span>{m.user.email}</span>
              <span className="text-xs text-neutral-500">{m.role.toLowerCase()}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
