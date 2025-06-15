import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface UsersFindPageProps {
  token: string;
  profile: string;
  userEmail: string | null;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const UsersFindPage: React.FC<UsersFindPageProps> = (props) => {
  return (
    <div>
      <p>Users Find Page Content</p>
    </div>
  );
};

export default UsersFindPage;
