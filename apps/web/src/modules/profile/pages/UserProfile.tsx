import { useParams } from 'react-router-dom';
import { PageHeader } from '@components/PageHeader';
import { useUserByUsername } from '../hooks/useUserByUsername';
import { ProfileHero } from '../components/ProfileHero';

import { ProfileDetails } from '../components/ProfileDetails';
import { ProfileStatsCards } from '../components/ProfileStatsCards';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data, error, isLoading } = useUserByUsername(username);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <span className="text-gray-500 animate-pulse">Loading profile vibes...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center text-red-500">
        <h2>Oops! User not found or something went wrong.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Employee Profile"
        description={`Overview of ${data.fullName}'s activities and projects.`}
      />

      <div className="flex flex-col gap-6 mt-4">
        <ProfileHero user={data} />

        <ProfileStatsCards user={data} />

        <ProfileDetails user={data} />
      </div>
    </div>
  );
}
