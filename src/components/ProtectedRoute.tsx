import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Permission } from '../utils/permissions';
import authService from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermissions }) => {
  const location = useLocation();
  const token = authService.getToken();
  const permissions = authService.getCurrentPermissions();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermissions && permissions) {
    const hasPermission = requiredPermissions.every(permission => 
      (permissions.permissions & permission) === permission
    );

    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 