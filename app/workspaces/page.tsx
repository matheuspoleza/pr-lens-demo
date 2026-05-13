import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function WorkspacesIndexPage() {
  const workspaces = await prisma.workspace.findMany();
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Workspaces</h1>
      <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        {workspaces.map((workspace) => (
          <li key={workspace.id} className="flex items-center justify-between p-4">
            <div>
              <Link
                href={`/workspaces/${workspace.slug}`}
                className="text-sm font-medium hover:underline"
              >
                {workspace.name}
              </Link>
              <p className="text-xs text-neutral-500">
                Plan: {workspace.plan.toLowerCase()}
              </p>
            </div>
            <Link
              href={`/workspaces/${workspace.slug}/settings`}
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              Settings →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
