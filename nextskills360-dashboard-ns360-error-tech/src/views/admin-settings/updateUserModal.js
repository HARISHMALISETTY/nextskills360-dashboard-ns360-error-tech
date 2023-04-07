import PropTypes from 'prop-types'; // import the PropTypes library for type checking of props in React components
import React from 'react'; // import the React library to create React components
import Box from '@mui/material/Box'; // importing styling components from MUI(Material UI) design library
import Modal from '@mui/material/Modal'; // importing modal(component) from Material UI
import { IconButton, Typography, Grid } from '@mui/material'; // importing other components from Material UI

import CloseIcon from '@mui/icons-material/Close'; // importing CloseIcon from material ui icons library
import { UserForm } from './UserForm'; // importing UserForm component from current directory
import { updateProjectMember } from 'services/users'; // importing function updateProjectMember from services/users module
import { roles } from 'constants/roles'; // importing roles object from constants/roles module

const style = {
    position: 'absolute', // setting position of the modal
    top: '50%', // setting position of the modal
    left: '50%', // setting position of the modal
    transform: 'translate(-50%, -50%)', // setting position of the modal
    width: 400, // setting width of the modal
    bgcolor: 'background.paper', // setting background color of the modal box
    borderRadius: 4, // setting border radius of the modal box
    boxShadow: 24, // setting box shadow of the modal box
    border: 'none', // setting border of the modal box
    outline: 'none', // setting outline of the modal box
    p: 4 // adding padding to the content inside the box
};

// defining UpdateUserModal functional component which takes several props as parameters
const UpdateUserModal = ({ open, handleModalClose, data, projectId, schools }) => {
    const accessLevel = [roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD].includes(data.dashboard_role) ? 'project' : 'school'; // determining user access level based on user's dashboard_role
    const initialFormData = {
        name: data.user_name,
        mobileNo: data.mobile_number,
        role: data.dashboard_role,
        accessLevel: accessLevel,
        school: data?.institution_name || '',
        referralCode: data?.referral_code || ''
    }; // creating an initial form data object with existing user details to show in the form

    const handleUpdateUserData = ({ name, mobileNo, role, accessLevel, school, referralCode }) => {
        // function to handle update user data as provided by the user in the form
        const projectLevelData = {
            dashboard_role: role,
            user_name: name,
            mobile_number: Number(mobileNo),
            project_id: projectId
        };

        const schoolLevelData = {
            dashboard_role: role,
            user_name: name,
            mobile_number: Number(mobileNo),
            institution_name: school,
            referral_code: referralCode,
            project_id: projectId
        };

        const dataToUpdate = accessLevel === 'project' ? projectLevelData : schoolLevelData;

        return updateProjectMember(projectId, data.uid, dataToUpdate); // calling API function to update the user data
    };

    return (
        // returning the markup of the modal
        <div>
            <Modal
                open={open} // prop to determine if the modal should be opened or closed
                onClose={handleModalClose} // function that is called when the close button is clicked
                aria-labelledby="project-average-chart"
                aria-describedby="baseline vs endline marks"
            >
                <Box sx={style}>
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Grid item>
                            <Typography variant="subtitle1">Update User Details</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                sx={{ color: (theme) => theme.palette.grey[500] }}
                                onClick={handleModalClose}
                                aria-label="close chart modal"
                                component="label"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    {/* rendering a User Form passing necessary props */}
                    <UserForm
                        hideModal={handleModalClose}
                        updateUserData={handleUpdateUserData}
                        initialFormData={initialFormData}
                        isUpdateData
                        schools={schools}
                        id={data.user_uid}
                    />
                </Box>
            </Modal>
        </div>
    );
};

// defining the propTypes for UpdateUserModal component
UpdateUserModal.propTypes = {
    open: PropTypes.bool,
    handleModalClose: PropTypes.func,
    data: PropTypes.object,
    projectId: PropTypes.string,
    schools: PropTypes.array
};

export default UpdateUserModal; // exporting UpdateUserModal as a default component
