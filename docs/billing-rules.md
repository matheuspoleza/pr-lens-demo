# Atlas billing — pricing & policy rules

This document is the source of truth for how Atlas charges for AI usage. The runtime gate and the pricing page both read from `lib/billing.ts`; this document explains *why* the rules are what they are.

## 1. Plan tiers and included AI credit pools

Every workspace is on exactly one of three plan tiers. The plan determines the monthly included pool of AI credits.

| Tier | Monthly price | Included AI credits | Overage rate | Allows overage |
|---|---|---|---|---|
| Free | $0 | 50 | n/a | No (hard cap) |
| Starter | $12 | 500 | $0.03 / credit | Yes |
| Pro | $48 | 2,500 | $0.02 / credit | Yes |

Credits do not roll over between months.

## 2. What consumes a credit

Each successful AI action consumes credits, billed at the time of consumption:

| Feature | Credits per call |
|---|---|
| Task draft | 1 |
| Weekly digest | 1 |
| Priority suggestion | 1 |

If a credit-consuming call fails (LLM error, validation error), no credit is consumed.

## 3. Soft-warning threshold

At **80% of the included pool**, the workspace owner receives an in-product banner indicating the period limit is approaching. The runtime gate (`evaluateAIGate` in `lib/billing.ts`) returns `{ allowed: true, warning: "approaching_cap" }` from this point on.

## 4. Hard-cap behavior on Free

Free workspaces cannot exceed their included pool. Once `unitsUsedThisPeriod >= includedAICredits`:

- The gate returns `{ allowed: false, reason: "cap_reached" }`
- The UI shows an upgrade prompt
- No usage events are recorded for refused calls

## 5. Overage behavior on Starter and Pro

Starter and Pro workspaces continue serving AI calls past their included pool. Overage units are summed for the billing period and invoiced at the end-of-period close:

```
overageUnits     = max(0, unitsUsedThisPeriod - includedAICredits)
overageCostCents = overageUnits × overageRateCents
```

The current overage cost is visible in real time on `/workspaces/[slug]/settings#billing` and via the `GET /api/v1/workspaces/{id}/usage` endpoint.

## 6. Refunds and credits

Out of scope for this iteration. A future doc will cover support-issued credits and proration on plan changes mid-period.
