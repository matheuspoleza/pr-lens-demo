import { prisma } from "@/lib/prisma";
import { WatchButton } from "./WatchButton";

const CURRENT_USER_ID = "u_iris";

export default async function TasksIndexPage() {
  const tasks = await prisma.task.findMany({
    include: {
      workspace: true,
      watchers: { where: { userId: CURRENT_USER_ID }, select: { userId: true } },
    },
  });
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Tasks</h1>
      <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">{task.title}</p>
              <p className="text-xs text-neutral-500">
                {task.workspace.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs uppercase tracking-wide text-neutral-600">
                {task.status.toLowerCase()}
              </span>
              <WatchButton
                taskId={task.id}
                userId={CURRENT_USER_ID}
                watching={task.watchers.length > 0}
              />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
