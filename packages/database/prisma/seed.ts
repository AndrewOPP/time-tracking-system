import {
  PrismaClient,
  UserWorkFormat,
  UserStatus,
  ProjectStatus,
  UserProjectStatus,
  UserProjectPosition,
  User,
  Project,
  Technology,
  TechnologyType,
  UserRole,
  AuthProvider,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { CONFIG, TECHNOLOGIES } from './constants';

const prisma = new PrismaClient();

function createUserData() {
  return {
    email: faker.internet.email(),
    realName: faker.person.fullName(),
    username: faker.internet.username(),
    systemRole: UserRole.EMPLOYEE,
    isActive: true,
    provider: AuthProvider.GOOGLE,
    status: UserStatus.INACTIVE,
    workFormat: faker.helpers.arrayElement([UserWorkFormat.FULL_TIME, UserWorkFormat.PART_TIME]),
  };
}

function createTechnologyData(data: Omit<Technology, 'id'>) {
  return {
    name: data.name,
    type: data.type,
    image: data.image,
  };
}

function createRelation(userId: string, projectId: string) {
  return prisma.userProject.create({
    data: {
      userId,
      projectId,
      status: UserProjectStatus.ACTIVE,
      position: faker.helpers.arrayElement(
        Object.values(UserProjectPosition).filter(p => p !== UserProjectPosition.PROJECT_MANAGER)
      ),
    },
  });
}

async function createUserTechs(users: User[], technologies: Technology[]) {
  const userTechs: {
    userId: string;
    technologyId: string;
    rating: number;
  }[] = [];

  const allUserProjects = await prisma.userProject.findMany({
    select: {
      userId: true,
      position: true,
    },
  });

  const userProjectsMap = new Map<string, UserProjectPosition[]>();

  for (const userProject of allUserProjects) {
    if (!userProjectsMap.has(userProject.userId)) {
      userProjectsMap.set(userProject.userId, []);
    }

    userProjectsMap.get(userProject.userId)!.push(userProject.position);
  }

  for (const user of users) {
    const roles = userProjectsMap.get(user.id) ?? [];

    const isDeveloper =
      roles.includes(UserProjectPosition.DEVELOPER) ||
      roles.includes(UserProjectPosition.TECH_LEAD);

    const isTechLead = roles.includes(UserProjectPosition.TECH_LEAD);
    const isDesigner = roles.includes(UserProjectPosition.DESIGNER);

    const randomTechs = faker.helpers.arrayElements(technologies, {
      min: 3,
      max: 5,
    });

    for (const tech of randomTechs) {
      let minRating = 1;
      let maxRating = 6;

      if (
        isDeveloper &&
        (
          [
            TechnologyType.BACKEND,
            TechnologyType.FRONTEND,
            TechnologyType.GENERAL,
          ] as TechnologyType[]
        ).includes(tech.type)
      ) {
        minRating = isTechLead ? 8 : 5;
        maxRating = 10;
      }

      if (isDesigner && tech.type === TechnologyType.DESIGN) {
        minRating = 7;
        maxRating = 10;
      }

      userTechs.push({
        userId: user.id,
        technologyId: tech.id,
        rating: faker.number.int({
          min: minRating,
          max: maxRating,
        }),
      });
    }
  }

  await prisma.userTechnology.createMany({
    data: userTechs,
    skipDuplicates: true,
  });
}

async function cleanDatabase() {
  await prisma.userProject.deleteMany();
  await prisma.userTechnology.deleteMany();

  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
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

async function createTechnologies() {
  const technologiesData = TECHNOLOGIES.map(technology => createTechnologyData(technology));

  await prisma.technology.createMany({
    data: technologiesData,
    skipDuplicates: true,
  });

  return prisma.technology.findMany();
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
  const projectMemberCount = new Map<string, number>();

  for (const project of projects) {
    const teamSize = faker.number.int({ min: 1, max: CONFIG.MAX_TEAM_SIZE });
    const team = faker.helpers.arrayElements(activeUsers, teamSize);

    for (const user of team as User[]) {
      await createRelation(user.id, project.id);
      activeUserIds.add(user.id);
    }

    projectMemberCount.set(project.id, team.length);
  }

  const missedUsers = activeUsers.filter(user => !activeUserIds.has(user.id));

  for (const user of missedUsers) {
    const availableProjects = projects.filter(
      project => (projectMemberCount.get(project.id) || 0) < CONFIG.MAX_TEAM_SIZE
    );
    if (availableProjects.length > 0) {
      const randomProject = faker.helpers.arrayElement(availableProjects);
      await createRelation(user.id, randomProject.id);
      activeUserIds.add(user.id);

      const currentCount = projectMemberCount.get(randomProject.id) || 0;
      projectMemberCount.set(randomProject.id, currentCount + 1);
    }
  }

  return activeUserIds;
}

async function addTechnologiesToProjects(projects: Project[], technologies: Technology[]) {
  if (!projects.length || !technologies.length) return;

  const operations = projects.map(project => {
    const techCount = faker.number.int({
      min: 3,
      max: Math.min(6, technologies.length),
    });

    const randomTechs = faker.helpers.arrayElements(technologies, techCount);

    return prisma.project.update({
      where: { id: project.id },
      data: {
        technologies: {
          connect: randomTechs.map(tech => ({
            id: tech.id,
          })),
        },
      },
    });
  });

  await Promise.all(operations);
}

async function main() {
  console.log('🌱 Seeding database...');

  await cleanDatabase();

  const managers = await createUsers(CONFIG.MANAGERS_COUNT);

  const users = await createUsers(CONFIG.USERS_COUNT);

  const technologies = await createTechnologies();

  const projects = await createProject(CONFIG.PROJECTS_COUNT, managers);

  const activeUsersSet = await addUsersToProjects(projects, users);

  await createUserTechs(users, technologies);

  await addTechnologiesToProjects(projects, technologies);

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
    'Total Technologies': technologies.length,
    'Inactive (Bench)': CONFIG.USERS_COUNT + CONFIG.MANAGERS_COUNT - allToActivate.size,
    'Projects Created': projects.length,
  });

  console.log('\n✨ Seeding completed!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
