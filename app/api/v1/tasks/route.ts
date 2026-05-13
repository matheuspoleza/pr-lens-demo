import { NextResponse } from "next/server";
import { listAllTasks, listTasksForWorkspace } from "@/lib/data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const workspaceId = url.searchParams.get("workspaceId");
  const data = workspaceId
    ? await listTasksForWorkspace(workspaceId)
    : await listAllTasks();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      id: `t_${Math.random().toString(36).slice(2, 8)}`,
      workspaceId: body.workspaceId,
      title: body.title,
      description: body.description ?? null,
      status: "TODO",
      assigneeId: body.assigneeId ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { status: 201 },
  );
}
