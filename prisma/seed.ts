import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.taskWatcher.deleteMany();
  await prisma.legacyApiToken.deleteMany();
  await prisma.task.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        id: "u_iris",
        email: "iris@atlas.app",
        name: "Iris",
        notificationPrefs: JSON.stringify({ inApp: true, email: true }),
      },
      {
        id: "u_milo",
        email: "milo@atlas.app",
        name: "Milo",
        notificationPrefs: JSON.stringify({ inApp: true, email: false }),
      },
      {
        id: "u_jules",
        email: "jules@atlas.app",
        name: "Jules",
        notificationPrefs: JSON.stringify({ inApp: false, email: true }),
      },
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

  await prisma.legacyApiToken.createMany({
    data: [
      { id: "lat_1", token: "lat_acme_sample", workspaceId: "w_acme", label: "Acme · CI sync" },
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
        priority: "high",
        assigneeId: "u_iris",
      },
      {
        id: "t_2",
        workspaceId: "w_acme",
        title: "Audit feature-flag usage",
        description: "Find stale flags > 60 days old.",
        status: "TODO",
        priority: "medium",
        assigneeId: "u_milo",
      },
      {
        id: "t_3",
        workspaceId: "w_acme",
        title: "Cut Q2 release notes",
        description: null,
        status: "DONE",
        priority: "low",
        assigneeId: "u_jules",
      },
      {
        id: "t_4",
        workspaceId: "w_lattice",
        title: "Wire up Linear sync",
        description: null,
        status: "TODO",
        priority: "none",
        assigneeId: null,
      },
    ],
  });

  await prisma.taskWatcher.createMany({
    data: [
      { taskId: "t_1", userId: "u_iris" },
      { taskId: "t_2", userId: "u_iris" },
      { taskId: "t_1", userId: "u_milo" },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        id: "n_1",
        userId: "u_iris",
        taskId: "t_2",
        kind: "status_changed",
        body: "Milo moved 'Audit feature-flag usage' to IN_PROGRESS",
      },
      {
        id: "n_2",
        userId: "u_iris",
        taskId: "t_1",
        kind: "status_changed",
        body: "You moved 'Ship the onboarding redesign' to IN_PROGRESS",
      },
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
