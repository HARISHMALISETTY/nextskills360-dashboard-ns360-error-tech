//Importing required dependencies and components
import PropTypes from 'prop-types';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { authentication } from 'firebase_setup/firebase';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'store/selectors';

//Creating a component ProtectedAuthRoute that receives children as props
function ProtectedAuthRoute({ children }) {
    //Getting the user's session state - loading, user and error object
    const [user, loading, error] = useAuthState(authentication);

    //Using Redux to get current user's data from the store
    const currentUser = useSelector(getCurrentUser);

    //If firebase auth is still loading, show a circular progress indicator
    if (loading) {
        return (
            <div>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        );
    }

    // If there is any error while checking the user's session state, display an error message.
    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
            </div>
        );
    }

    //Redirect the user to home page if they are already logged in.
    if (user && Object.keys(currentUser).length > 0) {
        return <Navigate to="/" replace />;
    }

    // Render the child component if session is not initialized or if the user is not loggerd in.
    return children;
}

// Validating the type of prop being passed to the component
ProtectedAuthRoute.propTypes = {
    children: PropTypes.node
};

// Exporting the component
export default ProtectedAuthRoute;
