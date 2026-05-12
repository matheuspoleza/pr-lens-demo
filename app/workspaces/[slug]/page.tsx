import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug, listTasksForWorkspace } from "@/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkspaceOverviewPage({ params }: PageProps) {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);
  if (!workspace) notFound();
  const tasks = await listTasksForWorkspace(workspace.id);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <header className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {workspace.name}
        </h1>
        <Link
          href={`/workspaces/${workspace.slug}/settings`}
          className="text-xs text-neutral-500 hover:text-neutral-700"
        >
          Settings →
        </Link>
      </header>
      <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-4">
            <span className="text-sm">{task.title}</span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs uppercase tracking-wide text-neutral-600">
              {task.status.toLowerCase()}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
