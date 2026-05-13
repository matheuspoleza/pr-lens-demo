import type { Role, PlanTier, TaskStatus } from "./types";

export const users = [
  { id: "u_iris", email: "iris@atlas.app", name: "Iris" },
  { id: "u_milo", email: "milo@atlas.app", name: "Milo" },
  { id: "u_jules", email: "jules@atlas.app", name: "Jules" },
];

export const workspaces: { id: string; slug: string; name: string; plan: PlanTier }[] = [
  { id: "w_acme", slug: "acme", name: "Acme Robotics", plan: "PRO" },
  { id: "w_lattice", slug: "lattice", name: "Lattice Studio", plan: "STARTER" },
];

export const memberships: { id: string; userId: string; workspaceId: string; role: Role }[] = [
  { id: "m_1", userId: "u_iris", workspaceId: "w_acme", role: "OWNER" },
  { id: "m_2", userId: "u_milo", workspaceId: "w_acme", role: "ADMIN" },
  { id: "m_3", userId: "u_jules", workspaceId: "w_acme", role: "MEMBER" },
  { id: "m_4", userId: "u_iris", workspaceId: "w_lattice", role: "MEMBER" },
];

export const tasks: {
  id: string;
  workspaceId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigneeId: string | null;
}[] = [
  {
    id: "t_1",
    workspaceId: "w_acme",
    title: "Ship the onboarding redesign",
    description: "Cover empty states for net-new workspaces.",
    status: "IN_PROGRESS",
    assigneeId: "u_iris",
  },
  {
    id: "t_2",
    workspaceId: "w_acme",
    title: "Audit feature-flag usage",
    description: "Find stale flags > 60 days old.",
    status: "TODO",
    assigneeId: "u_milo",
  },
  {
    id: "t_3",
    workspaceId: "w_acme",
    title: "Cut Q2 release notes",
    description: null,
    status: "DONE",
    assigneeId: "u_jules",
  },
  {
    id: "t_4",
    workspaceId: "w_lattice",
    title: "Wire up Linear sync",
    description: null,
    status: "TODO",
    assigneeId: null,
  },
];
