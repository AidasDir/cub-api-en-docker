import React from 'react';
import ApiEndpointDoc from '../components/ApiEndpointDoc';

interface TimelineAllPageProps {
  token: string;
  profile: string;
  setToken: (token: string) => void;
  setProfile: (profile: string) => void;
  generateAndSetCustomToken: () => Promise<void>;
}

const TimelineAllPage: React.FC<TimelineAllPageProps> = (props) => {
  return (
    <div>
      <p>Timeline All Page Content</p>
    </div>
  );
};

export default TimelineAllPage;
