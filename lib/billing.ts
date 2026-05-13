import type { PlanTier } from "./types";

/**
 * Per-workspace billing rules for Atlas AI features.
 *
 * The plan tier determines the included monthly AI credit pool. Usage past
 * the included pool is charged at a flat per-unit overage rate.
 *
 * Free workspaces cannot exceed their included pool — calls are refused
 * once the cap is hit, with a soft warning at 80% utilization.
 */

export interface PlanRules {
  tier: PlanTier;
  includedAICredits: number;
  overageRateCents: number;
  allowsOverage: boolean;
}

export const PLAN_RULES: Record<PlanTier, PlanRules> = {
  FREE: {
    tier: "FREE",
    includedAICredits: 50,
    overageRateCents: 0,
    allowsOverage: false,
  },
  STARTER: {
    tier: "STARTER",
    includedAICredits: 500,
    overageRateCents: 3,
    allowsOverage: true,
  },
  PRO: {
    tier: "PRO",
    includedAICredits: 2500,
    overageRateCents: 2,
    allowsOverage: true,
  },
};

export interface UsageState {
  tier: PlanTier;
  unitsUsedThisPeriod: number;
}

export type GateDecision =
  | { allowed: true; warning?: "approaching_cap" }
  | { allowed: false; reason: "cap_reached" };

const SOFT_WARNING_THRESHOLD = 0.8;

export function evaluateAIGate(state: UsageState): GateDecision {
  const rules = PLAN_RULES[state.tier];
  const usageRatio = state.unitsUsedThisPeriod / rules.includedAICredits;

  if (state.unitsUsedThisPeriod < rules.includedAICredits) {
    return usageRatio >= SOFT_WARNING_THRESHOLD
      ? { allowed: true, warning: "approaching_cap" }
      : { allowed: true };
  }

  if (rules.allowsOverage) {
    return { allowed: true };
  }

  return { allowed: false, reason: "cap_reached" };
}

export interface OverageEstimate {
  includedUnits: number;
  overageUnits: number;
  overageCostCents: number;
}

export function estimateOverage(state: UsageState): OverageEstimate {
  const rules = PLAN_RULES[state.tier];
  const overageUnits = Math.max(
    0,
    state.unitsUsedThisPeriod - rules.includedAICredits,
  );
  return {
    includedUnits: Math.min(state.unitsUsedThisPeriod, rules.includedAICredits),
    overageUnits,
    overageCostCents: overageUnits * rules.overageRateCents,
  };
}
