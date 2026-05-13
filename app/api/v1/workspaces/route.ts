import { NextResponse } from "next/server";
import { listWorkspaces } from "@/lib/data";

export async function GET() {
  const data = await listWorkspaces();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      id: `w_${Math.random().toString(36).slice(2, 8)}`,
      slug: body.slug,
      name: body.name,
      plan: "FREE",
    },
    { status: 201 },
  );
}
