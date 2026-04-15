import { useParams } from 'react-router-dom';
import { useProjectById } from '../hooks/useProjects';
import { ProjectSidebar } from '../components/ProjectSidebar';
import { ProjectHeader } from '../components/ProjectHeader';
import { ProjectDescription } from '../components/ProjectDescription';
import { ProjectTeam } from '../components/ProjectTeam';
import { ROUTES } from '@/shared/constants/routes';
import { statusConfig } from '@/shared/config/projectStatusConfig';
import { ProjectStatus } from '@/shared/constants/projectStatus';
import { getAppErrorMessage } from '@/shared/utils/error-handler';
import { BackButton } from '../components/BackButton';
import { ProjectDetailsSkeleton } from '../components/ProjectDetailsSkeleton';
import TrackLogsModal from '../components/TrackLogsModal/TrackLogsModal';
import { useDialogStore } from '../store/useDialogStore';

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isOpen } = useDialogStore();
  const { data: project, isError, isLoading, error } = useProjectById(id);

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (isError || !project) {
    return (
      <div className="p-8">
        <BackButton title="Back to projects" route={ROUTES.DASHBOARD} />
        <p className="text-red-500 mt-4">{getAppErrorMessage(error?.message)}</p>
      </div>
    );
  }

  const currentStatus = statusConfig[project.status] || statusConfig.NOT_STARTED;
  const isTrackingDisabled = project.status !== ProjectStatus.IN_PROGRESS;

  return (
    <div className="w-full pb-10 animate-in fade-in  duration-500 ease-out">
      <BackButton title="Back to projects" route={ROUTES.DASHBOARD} />
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <ProjectSidebar project={project} currentStatus={currentStatus} />

        <div className="flex-1 w-full flex flex-col gap-6">
          <ProjectHeader
            project={project}
            currentStatus={currentStatus}
            isTrackingDisabled={isTrackingDisabled}
          />
          <ProjectDescription description={project.description} />
          <ProjectTeam team={project.team} />
        </div>
      </div>
      {isOpen && <TrackLogsModal projectId={project.id} projectName={project.name} />}
    </div>
  );
};
