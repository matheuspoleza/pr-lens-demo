import { workspaces, tasks, memberships, users } from "./seed";
import type { Role, PlanTier, TaskStatus } from "./types";

export interface Workspace {
  id: string;
  slug: string;
  name: string;
  plan: PlanTier;
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigneeId: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface Membership {
  id: string;
  role: Role;
  user: User;
}

export async function listWorkspaces(): Promise<Workspace[]> {
  return workspaces;
}

export async function getWorkspaceBySlug(slug: string): Promise<Workspace | null> {
  return workspaces.find((w) => w.slug === slug) ?? null;
}

export async function listTasksForWorkspace(workspaceId: string): Promise<Task[]> {
  return tasks.filter((t) => t.workspaceId === workspaceId);
}

export async function listAllTasks(): Promise<(Task & { workspace: Workspace })[]> {
  return tasks.map((task) => ({
    ...task,
    workspace: workspaces.find((w) => w.id === task.workspaceId)!,
  }));
}

export async function listMembersForWorkspace(
  workspaceId: string,
): Promise<Membership[]> {
  return memberships
    .filter((m) => m.workspaceId === workspaceId)
    .map((m) => ({
      id: m.id,
      role: m.role,
      user: users.find((u) => u.id === m.userId)!,
    }));
}
