import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const workspace = await prisma.workspace.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam) || 50, 1), 200);

  const data = await prisma.activityEvent.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { occurredAt: "desc" },
    take: limit,
  });
  return NextResponse.json({ data });
}
