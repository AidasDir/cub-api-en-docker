import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface ReactionsAddPageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const ReactionsAddPage: React.FC<ReactionsAddPageProps> = (props) => {
  return (
    <div>
      <p>Reactions Add Page Content</p>
    </div>
  );
};

export default ReactionsAddPage;
