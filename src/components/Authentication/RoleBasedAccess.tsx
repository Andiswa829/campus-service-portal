import React, { ComponentType } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';

const RoleBasedAccess = ({ component: Component, allowedRoles, ...rest }: { component: ComponentType<any>; allowedRoles: string[]; [key: string]: any }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    if (!allowedRoles.includes(user.role)) {
        navigate('/unauthorized');
        return null;
    }

    return <Route {...rest} element={<Component />} />;
};

export default RoleBasedAccess;