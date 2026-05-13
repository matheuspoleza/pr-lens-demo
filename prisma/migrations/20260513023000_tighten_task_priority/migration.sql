-- Data migration: uppercase existing priority values and backfill NULLs.
UPDATE "Task" SET "priority" = UPPER("priority") WHERE "priority" IS NOT NULL;
UPDATE "Task" SET "priority" = 'NONE' WHERE "priority" IS NULL;

-- Tighten column: drop nullability, switch default to 'NONE'. SQLite
-- requires a table rebuild for this kind of constraint change.
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT NOT NULL DEFAULT 'NONE',
    "assigneeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "new_Task" ("id", "workspaceId", "title", "description", "status", "priority", "assigneeId", "createdAt", "updatedAt")
SELECT "id", "workspaceId", "title", "description", "status", "priority", "assigneeId", "createdAt", "updatedAt" FROM "Task";

DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";

CREATE INDEX "Task_workspaceId_status_idx" ON "Task"("workspaceId", "status");
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");

PRAGMA foreign_keys=ON;
