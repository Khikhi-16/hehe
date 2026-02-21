import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useHostAuth } from '@/contexts/HostAuthContext.jsx';

const ProtectedHostRoute = ({ children }) => {
  const { isHostAuthenticated } = useHostAuth();
  const location = useLocation();

  if (!isHostAuthenticated) {
    return <Navigate to="/host-login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedHostRoute;
