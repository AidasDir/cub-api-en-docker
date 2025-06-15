import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface ReactionsGetPageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const ReactionsGetPage: React.FC<ReactionsGetPageProps> = (props) => {
  return (
    <div>
      <p>Reactions Get Page Content</p>
    </div>
  );
};

export default ReactionsGetPage;
