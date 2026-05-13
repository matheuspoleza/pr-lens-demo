-- AlterTable
ALTER TABLE "Task" ADD COLUMN "priority" TEXT NOT NULL DEFAULT 'NONE';

-- CreateIndex
CREATE INDEX "Task_workspaceId_priority_idx" ON "Task"("workspaceId", "priority");
