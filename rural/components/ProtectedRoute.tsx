import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserType } from '../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedUserTypes: UserType[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedUserTypes }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth?.currentUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!auth.userType || !allowedUserTypes.includes(auth.userType)) {
    // User is logged in but does not have the correct role, redirect to home
    alert(`Access Denied: You must be a ${allowedUserTypes.join(' or ')} to view this page.`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
