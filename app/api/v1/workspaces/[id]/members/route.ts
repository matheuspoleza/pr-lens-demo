import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const workspace = await prisma.workspace.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }
  const data = await prisma.membership.findMany({
    where: { workspaceId: workspace.id },
    include: { user: true },
  });
  return NextResponse.json({ data });
}
