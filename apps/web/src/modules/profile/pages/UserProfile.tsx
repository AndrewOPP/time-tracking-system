import { PageHeader } from '@components/PageHeader';
import { useUserByUsername } from '../hooks/useUserByUsername';

import { useParams } from 'react-router-dom';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  console.log(username, 'username');

  const { data, error } = useUserByUsername(username);
  console.log(data, 'data');
  console.dir(error);

  return (
    <>
      <PageHeader
        title="User Profile"
        description="Overview of manager's activities and projects."
      />
    </>
  );
}
