import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Legacy v0 endpoint. Token-authenticated, read-only. Slated for removal —
 * see /developers/legacy for the deprecation window.
 */
export async function GET(request: Request) {
  const token = request.headers.get("x-api-token");
  if (!token) {
    return NextResponse.json({ error: "Missing x-api-token" }, { status: 401 });
  }
  const apiToken = await prisma.legacyApiToken.findUnique({ where: { token } });
  if (!apiToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const tasks = await prisma.task.findMany({
    where: { workspaceId: apiToken.workspaceId },
    select: {
      id: true,
      workspaceId: true,
      title: true,
      status: true,
      assigneeId: true,
    },
  });
  return NextResponse.json(tasks);
}
