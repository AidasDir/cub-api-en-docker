import React from 'react';
import AccessCodePage from './AccessCodePage'; // This page might wrap AccessCodePage

interface DeviceAddPageProps {
  userEmail: string | null;
  token: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
}

const DeviceAddPage: React.FC<DeviceAddPageProps> = (props) => {
  // This component will likely use or wrap AccessCodePage
  // and pass the necessary props to it.
  return (
    <AccessCodePage
      userEmail={props.userEmail}
      setToken={props.setToken}
      setProfile={props.setProfile}
      token={props.token}
    />
  );
};

export default DeviceAddPage;
