"use client";

import { useEffect, useState } from "react";

interface Subscription {
  status: string;
  includedAICredits: number;
  overageRateCents: number;
}

interface UsageSummary {
  period: string;
  unitsUsedThisPeriod: number;
  includedUnits: number;
  overageUnits: number;
  overageCostCents: number;
}

interface Props {
  workspaceId: string;
}

export function CurrentUsage({ workspaceId }: Props) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [subRes, usageRes] = await Promise.all([
          fetch(`/api/v1/workspaces/${workspaceId}/subscription`),
          fetch(`/api/v1/workspaces/${workspaceId}/usage`),
        ]);
        if (!subRes.ok || !usageRes.ok) throw new Error("Failed to load");
        const sub = (await subRes.json()) as Subscription;
        const u = (await usageRes.json()) as UsageSummary;
        if (cancelled) return;
        setSubscription(sub);
        setUsage(u);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  if (error) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500">
        Couldn&apos;t load current usage.
      </div>
    );
  }

  if (!subscription || !usage) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-400">
        Loading current usage…
      </div>
    );
  }

  const ratio = usage.unitsUsedThisPeriod / subscription.includedAICredits;
  const percent = Math.min(100, Math.round(ratio * 100));

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Current period — {usage.period}
          </p>
          <p className="mt-0.5 text-sm font-medium">
            {usage.unitsUsedThisPeriod} / {subscription.includedAICredits} AI credits used
          </p>
        </div>
        {usage.overageUnits > 0 && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            +{usage.overageUnits} overage
          </span>
        )}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full ${percent >= 80 ? "bg-amber-500" : "bg-neutral-900"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
