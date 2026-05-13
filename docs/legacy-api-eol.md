# Legacy /api/v0/* — end of life

The token-authenticated `/api/v0/*` public API and the
`/developers/legacy` reference page are being removed in this release.

## What is going away

- `GET /api/v0/workspaces`
- `GET /api/v0/tasks`
- The `LegacyApiToken` table and the `x-api-token` header it backed
- The `/developers/legacy` documentation page

## Migration

All third-party integrations should target `/api/v1/*` with
workspace-scoped OAuth. The remaining `LegacyApiToken` rows have already
been notified and revoked; no further token rotation is offered.

## Rule retired

The previous rule **"v0 read-only public access is permitted for
token-authenticated callers"** is removed. After this release, requests
to `/api/v0/*` return 404 at the routing layer.
