-- CreateTable
CREATE TABLE "LegacyApiToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LegacyApiToken_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LegacyApiToken_token_key" ON "LegacyApiToken"("token");

-- CreateIndex
CREATE INDEX "LegacyApiToken_workspaceId_idx" ON "LegacyApiToken"("workspaceId");
