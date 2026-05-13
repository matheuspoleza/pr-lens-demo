import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const workspaceId = url.searchParams.get("workspaceId");
  const data = workspaceId
    ? await prisma.task.findMany({ where: { workspaceId } })
    : await prisma.task.findMany({ include: { workspace: true } });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const task = await prisma.task.create({
    data: {
      workspaceId: body.workspaceId,
      title: body.title,
      description: body.description ?? null,
      status: "TODO",
      priority: body.priority ?? "none",
      assigneeId: body.assigneeId ?? null,
    },
  });
  return NextResponse.json(task, { status: 201 });
}
