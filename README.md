# pr-lens-demo

This repository is the **reference scenario** for [PR Lens](https://github.com/matheuspoleza/otto). PR Lens turns a GitHub pull request into a navigable, non-engineer-readable summary by exercising four deterministic pillars — **UI**, **API**, **Data**, **Business** — over a controlled stack.

This repo provides that controlled stack: a small SaaS project-management app called **Atlas**, written with the conventions PR Lens expects. The point isn't a real product. The point is that every pull request opened here can be analyzed end-to-end without the PR Lens pipeline guessing at the shape of the codebase.

## What's in here

| Pillar | What PR Lens reads | Where it lives |
|---|---|---|
| UI | Vercel preview deployments at `prlens.config.json` routes, captured by Playwright | `app/**/page.tsx` |
| API | A committed OpenAPI 3.1 spec | `openapi.yaml` |
| Data | A Prisma schema + numbered migrations | `prisma/schema.prisma`, `prisma/migrations/` |
| Business | TypeScript modules exporting plain functions and constants | `lib/**/*.ts` |

The required `prlens.config.json` at the repo root declares the preview routes and the paths to the OpenAPI and Prisma sources, so the pipeline never has to guess.

## Domain — Atlas

Atlas is a stripped-down project-management SaaS: workspaces, members, tasks, plan tiers. It deliberately resembles Linear with a billing seam to make the four pillars natural rather than contrived.

| Surface | Description |
|---|---|
| `/` | Landing |
| `/workspaces` | List of workspaces |
| `/workspaces/[slug]` | Workspace overview + tasks |
| `/workspaces/[slug]/settings` | General settings + members |
| `/tasks` | All tasks across workspaces |
| `/api/v1/workspaces` | Workspace REST |
| `/api/v1/workspaces/[id]/members` | Workspace membership REST |
| `/api/v1/tasks` | Tasks REST |

## Demo pull requests

Four pull requests exercise the pipeline end-to-end. Each is intentionally scoped to a single pillar — except the last, which exercises all four.

| # | Title | Pillars | What it demonstrates |
|---|---|---|---|
| 1 | Add priority field to tasks | Data | Prisma migration parsing, new enum + nullable column |
| 2 | Add `GET /api/v1/workspaces/[id]/activity` endpoint | API | `oasdiff` integration, additive non-breaking API change |
| 3 | Redesign workspace settings page | UI | Visual diff via Playwright, component swap |
| 4 | Add usage-based billing for AI features | UI + API + Data + Business | The combo PR — the shareable demo |

## Stack

- Next.js 16, React 19, TypeScript
- Prisma 6 (PostgreSQL)
- Tailwind CSS 4
- Vercel for hosting and preview deployments

## Local development

```bash
bun install
bun dev
```

Then [http://localhost:3000](http://localhost:3000). The app reads from in-memory seed data (`lib/seed.ts`) so it runs without a database. The Prisma schema and migrations exist solely for the PR Lens Data pillar to consume.

## A note on intentional minimalism

This repository is not trying to be a good SaaS. It is trying to be a **predictable test surface** for the PR Lens pipeline:

- The OpenAPI spec is hand-written, not generated, so it diffs cleanly.
- The Prisma migrations are flat SQL, not abstracted behind a wrapper.
- The UI is intentionally low-design so visual diffs are stable.

If you're here to evaluate PR Lens, the interesting thing is in the **pull requests**, not the code on `main`.
