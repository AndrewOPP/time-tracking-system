import { useParams } from 'react-router-dom';
import { PageHeader } from '@components/PageHeader';
import { useUserByUsername } from '../hooks/useUserByUsername';
import { ProfileHero } from '../components/ProfileHero';
import { ProfileDetails } from '../components/ProfileDetails';
import { ProfileStatsCards } from '../components/ProfileStatsCards';
import { SkillsRadarChart } from '../components/SkillsRadarChart';
import { getThemeForUser } from '../utils/getUserTheme';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data, error, isLoading } = useUserByUsername(username);

  const userTheme = getThemeForUser(username || '');

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (error || !data) return <div className="p-6 text-center text-red-500">User not found</div>;

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Employee Profile"
        description={`Overview of ${data.fullName}'s activities and projects.`}
      />

      <div className="flex flex-col gap-8 mt-4">
        {/* Прокидываем theme везде */}
        <ProfileHero user={data} theme={userTheme} />

        <div className="w-full">
          <ProfileStatsCards user={data} theme={userTheme} />
        </div>

        <SkillsRadarChart theme={userTheme} />

        <ProfileDetails user={data} theme={userTheme} />
      </div>
    </div>
  );
}
