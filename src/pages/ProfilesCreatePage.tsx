import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface ProfilesCreatePageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const ProfilesCreatePage: React.FC<ProfilesCreatePageProps> = (props) => {
  return (
    <div>
      <p>Profiles Create Page Content</p>
    </div>
  );
};

export default ProfilesCreatePage;
