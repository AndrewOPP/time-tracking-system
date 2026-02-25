import { PageHeader } from '@components/PageHeader';
import { ProjectCard } from '../components/ProjectCard';
import { useProjects } from '../hooks/useProjects';
import { ProjectCardSkeleton } from '../components/ProjectCardSkeleton';
import { Button } from '@components/ui';
import { getAppErrorMessage } from '@/shared/utils/error-handler';

export const DashboardPage = () => {
  const { data: projects, isLoading, isError, refetch, isRefetching, error } = useProjects();

  return (
    <div className="w-full">
      <PageHeader
        title="My Projects"
        description="Here are all the projects you are working on. Select the one you need to view details and log working hours."
      />

      <div className="px-4">
        {isLoading && (
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        )}
        {isError && (
          <div className="text-red-500">
            <p>{getAppErrorMessage(error.message)}</p>
            <Button
              onClick={() => refetch()}
              disabled={isRefetching}
              variant="default"
              className="mt-2 cursor-pointer hover:bg-[#646464]"
            >
              {isRefetching ? 'Retrying...' : 'Retry'}
            </Button>
          </div>
        )}

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
