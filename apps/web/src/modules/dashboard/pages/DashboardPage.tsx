import { PageHeader } from '@components/PageHeader';
import { ProjectCard } from '../components/ProjectCard';
import { useProjects } from '../hooks/useProjects';

export const DashboardPage = () => {
  const { data: projects, isLoading, isError } = useProjects();

  return (
    <div className="w-full">
      <PageHeader
        title="My Projects"
        description="Here are all the projects you are working on. Select the one you need to view details and log working hours."
      />

      <div className="px-4">
        {isLoading && <p>Loading projects...</p>}

        {isError && <p className="text-red-500">Failed to load projects. Please try again.</p>}

        {!isLoading && !isError && projects?.length === 0 && (
          <div className="text-center text-slate-500 mt-10">You have no projects yet.</div>
        )}

        {!isLoading && !isError && projects && projects.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
