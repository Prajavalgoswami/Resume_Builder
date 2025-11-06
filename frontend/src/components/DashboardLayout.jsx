import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { landingPageStyles } from '../assets/dummystyle';

const DashboardLayout = ({ activeMenu, children }) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      {user && (
        // Add top padding to account for the fixed navbar so content is not overlapped
        <div className={`container mx-auto pb-4 ${landingPageStyles.main}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
