import PropTypes from 'prop-types';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { authentication } from 'firebase_setup/firebase';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AccessDenied from 'ui-component/AccessDenied';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'store/selectors';

function ProtectedRoute({ children, roles }) {
    // Get the current location
    const location = useLocation();

    // Get the user status (logged in or not)
    const [user, loading, error] = useAuthState(authentication);

    // Get the current user information
    const currentUser = useSelector(getCurrentUser);

    // Check if the current user has the required role to access this route
    const userHasRequiredRole = user && roles.includes(currentUser.dashboard_role) ? true : false;

    // If the authentication is being checked, show a loading indicator
    if (loading) {
        return (
            <div>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        );
    }

    // If there was an error during the authentication process, show it
    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
            </div>
        );
    }

    // If the user doesn't have the required role for this route, show an access denied message
    if (user && !userHasRequiredRole) {
        return <AccessDenied />;
    }

    // If the user is logged in and has the required role, show the children components
    if (user) {
        return children;
    }

    // If the user isn't logged in, redirect them to the login page with a state indicating where they came from
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

// Set the expected prop types (children and roles)
ProtectedRoute.propTypes = {
    children: PropTypes.node,
    roles: PropTypes.array
};

// Export the ProtectedRoute component as default
export default ProtectedRoute;
