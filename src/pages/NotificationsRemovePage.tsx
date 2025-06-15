import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface NotificationsRemovePageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const NotificationsRemovePage: React.FC<NotificationsRemovePageProps> = (props) => {
  return (
    <div>
      <p>Notifications Remove Page Content</p>
    </div>
  );
};

export default NotificationsRemovePage;
