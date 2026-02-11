import {
  PrismaClient,
  UserWorkFormat,
  UserStatus,
  ProjectStatus,
  UserProjectStatus,
  UserProjectPosition,
  User,
  Project,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const CONFIG = {
  USERS_COUNT: 35,
  MANAGERS_COUNT: 5,
  PROJECTS_COUNT: 20,
  PM_PROJECTS_COUNT: Math.floor(20 * 0.9),
  BENCH_VALUE: 0.05,
};

const createUserData = () => ({
  email: faker.internet.email(),
  realName: faker.person.fullName(),
  username: faker.internet.username(),
  discordId: faker.string.uuid(),
  status: UserStatus.INACTIVE,
  workFormat: faker.helpers.arrayElement([UserWorkFormat.FULL_TIME, UserWorkFormat.PART_TIME]),
});

async function cleanDatabase() {
  await prisma.userProject.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}

async function createUsers(count: number) {
  const usersData = Array.from({ length: count }).map(() => createUserData());

  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });

  return prisma.user.findMany({
    where: { email: { in: usersData.map(user => user.email) } },
  });
}

async function createProject(count: number, managers: User[]) {
  const projectsData = [];

  for (let i = 0; i < count; i++) {
    const manager = i < CONFIG.PM_PROJECTS_COUNT ? faker.helpers.arrayElement(managers) : null;

    projectsData.push({
      name: faker.company.name(),
      emoji: faker.internet.emoji(),
      status: faker.helpers.arrayElement(Object.values(ProjectStatus)),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      avatarUrl: faker.image.avatar(),
      projectManagerId: manager ? manager.id : null,
    });
  }

  await prisma.project.createMany({ data: projectsData });

  return prisma.project.findMany();
}

async function addUsersToProjects(projects: Project[], users: User[]) {
  const benchCount = Math.round(CONFIG.USERS_COUNT * CONFIG.BENCH_VALUE);
  const benchUsers = faker.helpers.arrayElements(users, benchCount);
  const activeUsers = users.filter(user => !benchUsers.includes(user));
  const activeUserIds = new Set<string>();

  const pool = [...activeUsers];

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const user = pool.pop();
    if (user) {
      await createRelation(user.id, project.id);
      activeUserIds.add(user.id);
    }

    if (i % 3 === 0) {
      const extraUser = faker.helpers.arrayElement(activeUsers);
      if (user && extraUser.id !== user.id) {
        await createRelation(extraUser.id, project.id);
        activeUserIds.add(extraUser.id);
      }
    }
  }

  for (const user of pool) {
    const randomProject = faker.helpers.arrayElement(projects);
    await createRelation(user.id, randomProject.id);
    activeUserIds.add(user.id);
  }

  return activeUserIds;
}

const createRelation = (userId: string, projectId: string) =>
  prisma.userProject.create({
    data: {
      userId,
      projectId,
      status: UserProjectStatus.ACTIVE,
      position: faker.helpers.arrayElement(
        Object.values(UserProjectPosition).filter(p => p !== UserProjectPosition.PROJECT_MANAGER)
      ),
    },
  });

async function main() {
  console.log('🌱 Seeding database...');

  await cleanDatabase();

  const managers = await createUsers(CONFIG.MANAGERS_COUNT);

  const users = await createUsers(CONFIG.USERS_COUNT);

  const projects = await createProject(CONFIG.PROJECTS_COUNT, managers);

  const activeUsersSet = await addUsersToProjects(projects, users);

  const assignedManagerIds = new Set(
    projects.map(p => p.projectManagerId).filter(Boolean) as string[]
  );

  const allToActivate = new Set([...activeUsersSet, ...assignedManagerIds]);

  await prisma.user.updateMany({
    where: { id: { in: Array.from(allToActivate) } },
    data: { status: UserStatus.ACTIVE },
  });

  console.table({
    'Total Users': CONFIG.USERS_COUNT,
    'Total Managers': CONFIG.MANAGERS_COUNT,
    'Inactive (Bench)': CONFIG.USERS_COUNT + CONFIG.MANAGERS_COUNT - allToActivate.size,
    'Projects Created': projects.length,
  });

  console.log('\n✨ Seeding completed!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
