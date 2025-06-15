import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface UsersGetPageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const UsersGetPage: React.FC<UsersGetPageProps> = (props) => {
  return (
    <div>
      <p>Users Get Page Content</p>
    </div>
  );
};

export default UsersGetPage;
