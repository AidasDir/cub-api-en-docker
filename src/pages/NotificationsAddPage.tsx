import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface NotificationsAddPageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const NotificationsAddPage: React.FC<NotificationsAddPageProps> = (props) => {
  return (
    <div>
      <p>Notifications Add Page Content</p>
    </div>
  );
};

export default NotificationsAddPage;
