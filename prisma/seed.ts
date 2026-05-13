import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      { id: "u_iris", email: "iris@atlas.app", name: "Iris" },
      { id: "u_milo", email: "milo@atlas.app", name: "Milo" },
      { id: "u_jules", email: "jules@atlas.app", name: "Jules" },
    ],
  });

  await prisma.workspace.createMany({
    data: [
      { id: "w_acme", slug: "acme", name: "Acme Robotics", plan: "PRO" },
      { id: "w_lattice", slug: "lattice", name: "Lattice Studio", plan: "STARTER" },
    ],
  });

  await prisma.membership.createMany({
    data: [
      { id: "m_1", userId: "u_iris", workspaceId: "w_acme", role: "OWNER" },
      { id: "m_2", userId: "u_milo", workspaceId: "w_acme", role: "ADMIN" },
      { id: "m_3", userId: "u_jules", workspaceId: "w_acme", role: "MEMBER" },
      { id: "m_4", userId: "u_iris", workspaceId: "w_lattice", role: "MEMBER" },
    ],
  });

  await prisma.task.createMany({
    data: [
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
    ],
  });

  await prisma.activityEvent.deleteMany();
  await prisma.activityEvent.createMany({
    data: [
      { id: "a_1", workspaceId: "w_acme", type: "task.created", actorId: "u_iris", subjectId: "t_1" },
      { id: "a_2", workspaceId: "w_acme", type: "member.added", actorId: "u_iris", subjectId: "u_milo" },
      { id: "a_3", workspaceId: "w_acme", type: "task.status_changed", actorId: "u_milo", subjectId: "t_1" },
      { id: "a_4", workspaceId: "w_lattice", type: "task.created", actorId: "u_iris", subjectId: "t_4" },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
