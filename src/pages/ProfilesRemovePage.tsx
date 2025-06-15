import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface ProfilesRemovePageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const ProfilesRemovePage: React.FC<ProfilesRemovePageProps> = (props) => {
  return (
    <div>
      <p>Profiles Remove Page Content</p>
    </div>
  );
};

export default ProfilesRemovePage;
