import { React, lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import ProtectedAuthRoute from './ProtectedAuthRoute';

const Login = Loadable(lazy(() => import('views/login/index')));
const AccessDenied = Loadable(lazy(() => import('ui-component/AccessDenied')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: (
        <ProtectedAuthRoute>
            <MinimalLayout />
        </ProtectedAuthRoute>
    ),
    children: [
        {
            path: 'login',
            element: <Login />
        },
        {
            path: 'access-denied',
            element: <AccessDenied />
        }
    ]
};

export default AuthenticationRoutes;
