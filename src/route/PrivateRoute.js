import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';


const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center space-x-2 h-[70vh]">
                <div className="w-4 h-4 rounded-full animate-pulse bg-gray-500"></div>
                <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500"></div>
                <div className="w-4 h-4 rounded-full animate-pulse bg-amber-500"></div>
            </div>
        );
    }

    if (user) {
        return children;
    }

    return <Navigate to='/login'></Navigate>
};

export default PrivateRoute;