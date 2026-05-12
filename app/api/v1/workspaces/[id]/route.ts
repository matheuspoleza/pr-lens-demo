import { NextResponse } from "next/server";
import { workspaces } from "@/lib/seed";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const workspace = workspaces.find((w) => w.id === id || w.slug === id);
  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }
  return NextResponse.json(workspace);
}
