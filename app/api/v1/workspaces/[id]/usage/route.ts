import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { estimateOverage } from "@/lib/billing";
import type { PlanTier } from "@/lib/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const PERIOD_PATTERN = /^\d{4}-\d{2}$/;

const periodBoundaries = (period: string): { start: Date; end: Date } => {
  const [yearStr, monthStr] = period.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  return { start, end };
};

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const workspace = await prisma.workspace.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const now = new Date();
  const period =
    url.searchParams.get("period") ??
    `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  if (!PERIOD_PATTERN.test(period)) {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  const { start, end } = periodBoundaries(period);
  const events = await prisma.aIUsageEvent.findMany({
    where: {
      workspaceId: workspace.id,
      occurredAt: { gte: start, lt: end },
    },
  });

  const unitsUsedThisPeriod = events.reduce((sum, event) => sum + event.units, 0);
  const summary = estimateOverage({
    tier: workspace.plan as PlanTier,
    unitsUsedThisPeriod,
  });

  return NextResponse.json({
    period,
    unitsUsedThisPeriod,
    ...summary,
  });
}
