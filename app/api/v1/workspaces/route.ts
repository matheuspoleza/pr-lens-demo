import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.workspace.findMany();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const workspace = await prisma.workspace.create({
    data: {
      slug: body.slug,
      name: body.name,
      plan: "FREE",
    },
  });
  return NextResponse.json(workspace, { status: 201 });
}
