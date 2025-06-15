import React from 'react';
import AddDevicePage from './AddDevicePage'; // Existing component

interface ClientAddDevicePageProps {
  // Define any specific props this wrapper might need or pass through
}

const ClientAddDevicePage: React.FC<ClientAddDevicePageProps> = (props) => {
  return (
    <AddDevicePage {...props} />
  );
};

export default ClientAddDevicePage;
