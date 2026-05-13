# Task priority

A task's priority is one of:

- `NONE` — default for tasks created without a priority.
- `LOW`, `MEDIUM`, `HIGH`, `URGENT` — explicit levels.

## Rules

- **Priority is required.** Tasks cannot be persisted with a null priority;
  the column is `NOT NULL` and defaults to `NONE`. The previous free-form
  lowercase form (`none|low|medium|high|urgent`) has been retired.
- **Values are canonical UPPERCASE.** Both the API request and the response
  use the uppercase form. Clients sending lowercase values receive a 400.
- **List sort order.** When `GET /api/v1/tasks` is called without an explicit
  sort, results are ordered by `(priority DESC, createdAt DESC)` so urgent
  work surfaces first. Priority ordering follows the enum order above:
  `URGENT > HIGH > MEDIUM > LOW > NONE`.
