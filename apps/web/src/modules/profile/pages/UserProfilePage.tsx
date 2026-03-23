import { useParams } from 'react-router-dom';
import { PageHeader } from '@components/PageHeader';
import { useUserByUsername } from '../hooks/useUserByUsername';
import { ProfileHero } from '../components/ProfileHero';
import { ProfileDetails } from '../components/ProfileDetails';
import { ProfileStatsCards } from '../components/ProfileStatsCards';
import { SkillsRadarChart } from '../components/SkillsRadarChart';
import { getThemeForUser } from '../utils/getUserTheme';
import { UserProfileSkeleton } from '../components/UserProfileSkeleton'; // не забудь проверить путь

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data, error, isLoading } = useUserByUsername(username);

  const userTheme = getThemeForUser(username || '');
  console.log(data, 'data');

  if (isLoading) return <UserProfileSkeleton />;
  if (error || !data) return <div className="p-6 text-center text-red-500">User not found</div>;

  return (
    <div className="flex flex-col w-full animate-in fade-in zoom-in-[0.98] duration-500 ease-out">
      <PageHeader
        title="Employee Profile"
        description={`Overview of ${data.fullName}'s activities and projects.`}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-6 pt-0">
        <div className="xl:col-span-4 flex flex-col gap-6">
          <ProfileHero user={data} theme={userTheme} />
          <ProfileStatsCards user={data} theme={userTheme} />
        </div>
        <div className="xl:col-span-8 flex flex-col gap-6">
          <SkillsRadarChart theme={userTheme} />
          <ProfileDetails user={data} theme={userTheme} />
        </div>
      </div>
    </div>
  );
}
