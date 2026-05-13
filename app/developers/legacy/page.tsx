export const metadata = {
  title: "Legacy API · Atlas Developers",
};

export default function LegacyApiPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Legacy /api/v0/* reference</h1>
      <p className="mt-3 text-sm text-stone-600">
        The v0 public API is read-only, token-authenticated, and scheduled for
        removal. New integrations should target <code>/api/v1/*</code>.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Authentication</h2>
        <p className="mt-2 text-sm text-stone-600">
          Send your token in the <code>x-api-token</code> header. Tokens are
          scoped to a single workspace and cannot be rotated through the API —
          contact support to issue a new one.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Endpoints</h2>
        <ul className="mt-3 space-y-2 text-sm text-stone-700">
          <li>
            <code>GET /api/v0/workspaces</code> — returns the calling token&apos;s
            workspace as a single-item array.
          </li>
          <li>
            <code>GET /api/v0/tasks</code> — returns tasks in the calling
            token&apos;s workspace, status and assignee included.
          </li>
        </ul>
      </section>

      <section className="mt-8 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Deprecation: v0 will be removed in an upcoming release. Migrate to
        <code className="ml-1">/api/v1/*</code> with workspace-scoped OAuth.
      </section>
    </main>
  );
}
