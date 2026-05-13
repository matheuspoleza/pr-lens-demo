# Watchers and notifications

## Rules

- **A user becomes a watcher by calling `POST /api/v1/tasks/{id}/watchers`**
  with their `userId` in the body. The pair `(taskId, userId)` is unique —
  a second POST is a no-op.
- **Watchers receive a `status_changed` notification when the assignee
  moves the task between statuses.** The status fan-out runs synchronously
  on every `PATCH /api/v1/tasks/{id}` call that updates `status`, writing
  one row to the `Notification` table per active watcher.
- **Notification delivery channels per user come from `User.notificationPrefs`**
  (JSON: `{ inApp: boolean, email: boolean }`). The `/notifications` page
  reads the in-app channel via `GET /api/v1/notifications?userId=…`. Email
  delivery is out of scope for this change and will land in a follow-up.
- **The actor (the user who triggered the change) is also notified** when
  they are themselves a watcher, so the `/notifications` page reflects
  their own moves consistently with a webhook subscriber's view.
