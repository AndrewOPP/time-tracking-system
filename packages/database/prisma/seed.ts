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
  ProjectDomain,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { CONFIG, TECHNOLOGIES } from './constants';

const prisma = new PrismaClient();

function createUserData(userRole: UserRole) {
  return {
    email: faker.internet.email(),
    realName: faker.person.fullName(),
    username: faker.internet.username(),
    systemRole: userRole === UserRole.EMPLOYEE ? UserRole.EMPLOYEE : UserRole.MANAGER,
    isActive: true,
    avatarUrl: faker.image.avatar(),
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
  await prisma.timeLog.deleteMany();
  await prisma.userProject.deleteMany();
  await prisma.userTechnology.deleteMany();

  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.user.deleteMany();
}

async function createUsers(count: number, userRole: UserRole) {
  const usersData = Array.from({ length: count }).map(() => createUserData(userRole));

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

  const colors = [
    '64748B', // Slate
    '4E916B', // Muted Emerald
    '6366F1', // Soft Indigo
    'D97706', // Warm Amber
    'BE185D', // Dusty Rose
    '84A59D', // Sage
    'A44A3F', // Terracotta
  ];

  for (let i = 0; i < count; i++) {
    const manager = i < CONFIG.PM_PROJECTS_COUNT ? faker.helpers.arrayElement(managers) : null;
    const projectName = faker.company.name();

    const randomColor = faker.helpers.arrayElement(colors);

    projectsData.push({
      name: projectName,
      emoji: faker.internet.emoji(),
      status: faker.helpers.arrayElement(Object.values(ProjectStatus)),
      domain: faker.helpers.arrayElement(Object.values(ProjectDomain)),
      startDate: faker.date.past(),
      description: faker.lorem.paragraphs(2),
      endDate: faker.date.future(),

      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        projectName
      )}&background=${randomColor}&color=fff&size=32&bold=true`,
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

async function createTimeLogs() {
  const userProjects = await prisma.userProject.findMany();

  const userProjectsMap = new Map<string, string[]>();
  for (const up of userProjects) {
    if (!userProjectsMap.has(up.userId)) {
      userProjectsMap.set(up.userId, []);
    }
    userProjectsMap.get(up.userId)!.push(up.projectId);
  }

  const userIds = Array.from(userProjectsMap.keys());

  const halfUsersCount = Math.floor(userIds.length * 0.5);
  const selectedUsers = faker.helpers.arrayElements(userIds, halfUsersCount);

  const timeLogsData = [];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  for (const userId of selectedUsers) {
    const userProjectIds = userProjectsMap.get(userId)!;
    const numLogs = faker.number.int({ min: 6, max: 15 });

    const usedDates = new Set<string>();

    for (let i = 0; i < numLogs; i++) {
      const projectId = faker.helpers.arrayElement(userProjectIds);

      let logDate = faker.date.between({ from: startOfMonth, to: endOfMonth });
      let dateString = logDate.toISOString().split('T')[0];

      while (usedDates.has(`${projectId}-${dateString}`)) {
        logDate = faker.date.between({ from: startOfMonth, to: endOfMonth });
        dateString = logDate.toISOString().split('T')[0];
      }

      usedDates.add(`${projectId}-${dateString}`);

      timeLogsData.push({
        userId,
        projectId,
        date: logDate,
        hours: faker.number.float({ min: 12, max: 24, fractionDigits: 1 }),
        description: faker.lorem.sentence(),
      });
    }
  }

  await prisma.timeLog.createMany({
    data: timeLogsData,
    skipDuplicates: true,
  });

  return timeLogsData.length;
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

  const managers = await createUsers(CONFIG.MANAGERS_COUNT, UserRole.MANAGER);

  const users = await createUsers(CONFIG.USERS_COUNT, UserRole.EMPLOYEE);

  const technologies = await createTechnologies();

  const projects = await createProject(CONFIG.PROJECTS_COUNT, managers);

  const activeUsersSet = await addUsersToProjects(projects, users);

  await createUserTechs(users, technologies);

  await addTechnologiesToProjects(projects, technologies);

  const totalLogsCreated = await createTimeLogs();

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
    'TimeLogs Created': totalLogsCreated,
  });

  console.log('\n✨ Seeding completed!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
