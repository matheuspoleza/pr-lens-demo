import Link from "next/link";
import { PLAN_RULES } from "@/lib/billing";
import { CurrentUsage } from "./CurrentUsage";

// Demo: a real app would derive this from the signed-in user's active workspace.
const DEMO_WORKSPACE_ID = "w_acme";

const PLAN_ORDER = ["FREE", "STARTER", "PRO"] as const;

const PLAN_COPY = {
  FREE: {
    name: "Free",
    headline: "Personal workspaces",
    monthlyCents: 0,
  },
  STARTER: {
    name: "Starter",
    headline: "Small teams shipping together",
    monthlyCents: 1200,
  },
  PRO: {
    name: "Pro",
    headline: "Teams with AI-augmented workflows",
    monthlyCents: 4800,
  },
} as const;

function formatCents(cents: number): string {
  if (cents === 0) return "$0";
  return `$${(cents / 100).toFixed(2)}`;
}

export default function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <header className="mb-8 max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Pricing
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Pay for the seats and the AI.
        </h1>
        <p className="mt-3 text-neutral-600">
          Every plan includes a monthly pool of AI credits. Usage past the pool
          is metered and billed at a flat per-unit rate. Free workspaces cannot
          exceed the included pool.
        </p>
      </header>

      <div className="mb-10 max-w-2xl">
        <CurrentUsage workspaceId={DEMO_WORKSPACE_ID} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLAN_ORDER.map((tier) => {
          const rules = PLAN_RULES[tier];
          const copy = PLAN_COPY[tier];
          return (
            <article
              key={tier}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6"
            >
              <header className="mb-4 space-y-1">
                <p className="text-sm font-medium text-neutral-500">{copy.name}</p>
                <p className="text-2xl font-semibold tracking-tight">
                  {formatCents(copy.monthlyCents)}
                  <span className="text-sm font-normal text-neutral-500">
                    {copy.monthlyCents > 0 ? " / month" : ""}
                  </span>
                </p>
                <p className="text-sm text-neutral-600">{copy.headline}</p>
              </header>
              <ul className="flex-1 space-y-2 text-sm text-neutral-700">
                <li>
                  {rules.includedAICredits.toLocaleString()} included AI credits / month
                </li>
                <li>
                  {rules.allowsOverage
                    ? `Overage at $${(rules.overageRateCents / 100).toFixed(2)} per credit`
                    : "Hard cap — no overage"}
                </li>
                <li>Unlimited workspaces, tasks, and members</li>
              </ul>
              <Link
                href="/workspaces"
                className="mt-6 block rounded-lg bg-neutral-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-neutral-800"
              >
                {tier === "FREE" ? "Start free" : "Upgrade"}
              </Link>
            </article>
          );
        })}
      </div>

      <section className="mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 p-8">
        <h2 className="text-lg font-semibold tracking-tight">
          How AI credits work
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Each AI action — drafting a task, generating the weekly digest, or
          producing a priority suggestion — consumes one or more credits. We
          surface a soft warning at 80% of your included pool, and Free
          workspaces have requests refused past the cap.
        </p>
      </section>
    </main>
  );
}
