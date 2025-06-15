import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface ProfilesAllPageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const ProfilesAllPage: React.FC<ProfilesAllPageProps> = (props) => {
  return (
    <div>
      <p>Profiles All Page Content</p>
    </div>
  );
};

export default ProfilesAllPage;
