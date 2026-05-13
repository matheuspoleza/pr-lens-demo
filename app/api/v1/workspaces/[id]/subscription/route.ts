import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLAN_RULES } from "@/lib/billing";

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

  let subscription = await prisma.subscription.findUnique({
    where: { workspaceId: workspace.id },
  });

  if (!subscription) {
    const rules = PLAN_RULES[workspace.plan as keyof typeof PLAN_RULES] ?? PLAN_RULES.FREE;
    subscription = await prisma.subscription.create({
      data: {
        workspaceId: workspace.id,
        status: "ACTIVE",
        includedAICredits: rules.includedAICredits,
        overageRateCents: rules.overageRateCents,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600_000),
      },
    });
  }

  return NextResponse.json(subscription);
}
