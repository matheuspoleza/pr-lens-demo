import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const userId: string | undefined = body.userId;
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  const watcher = await prisma.taskWatcher.upsert({
    where: { taskId_userId: { taskId: id, userId } },
    update: {},
    create: { taskId: id, userId },
  });
  return NextResponse.json(watcher, { status: 201 });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  await prisma.taskWatcher.deleteMany({ where: { taskId: id, userId } });
  return new NextResponse(null, { status: 204 });
}
