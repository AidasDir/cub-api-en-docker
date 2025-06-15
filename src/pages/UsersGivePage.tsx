import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface UsersGivePageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const UsersGivePage: React.FC<UsersGivePageProps> = (props) => {
  return (
    <div>
      <p>Users Give Page Content</p>
    </div>
  );
};

export default UsersGivePage;
