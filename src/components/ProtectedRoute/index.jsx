import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, redirectTo }) => {
    const { user } = useAuth();
    return user ? <Navigate to={redirectTo} /> : children;
};

export default ProtectedRoute;