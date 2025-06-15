import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface ProfilesChangePageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const ProfilesChangePage: React.FC<ProfilesChangePageProps> = (props) => {
  return (
    <div>
      <p>Profiles Change Page Content</p>
    </div>
  );
};

export default ProfilesChangePage;
