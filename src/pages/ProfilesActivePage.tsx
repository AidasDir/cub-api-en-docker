import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface ProfilesActivePageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const ProfilesActivePage: React.FC<ProfilesActivePageProps> = (props) => {
  return (
    <div>
      <p>Profiles Active Page Content</p>
    </div>
  );
};

export default ProfilesActivePage;
