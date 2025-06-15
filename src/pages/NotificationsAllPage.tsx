import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface NotificationsAllPageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const NotificationsAllPage: React.FC<NotificationsAllPageProps> = (props) => {
  return (
    <div>
      <p>Notifications All Page Content</p>
    </div>
  );
};

export default NotificationsAllPage;
