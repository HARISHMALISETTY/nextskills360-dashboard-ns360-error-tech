// Import necessary dependencies and components from respective libraries
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { Autocomplete, Grid, TextField, useTheme } from '@mui/material';

// Import constant file with grid spacing value
import { gridSpacing } from 'store/constant';

// Import child components
import UserCard from './userCard';
import MainCard from 'ui-component/cards/MainCard';
import UpdateUserModal from './updateUserModal';
import DeleteUserModal from './deleteUserModal';

// Import custom hooks
import { useGetProjectMembers } from 'services/hooks/useGetProjectMembers';
import { deleteMember } from 'services/users';

// Import toast notification
import { toast } from 'react-toastify';

// Create a functional component called SchoolsAutoComplete which provides autocomplete search functionality using MUI Autocomplete component
const SchoolsAutoComplete = ({ schools, schoolSelected, setSchoolSelected, schoolsLoading }) => {
    const theme = useTheme();
    return (
        // Create a grid container with space between elements and center aligned vertically
        <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} sx={{ [theme.breakpoints.up('sm')]: { width: 290 }, [theme.breakpoints.down('sm')]: { width: 170 } }}>
                <Autocomplete
                    // Set unique ID for component
                    id="search school wise roles"
                    // Pass options as array of objects to be displayed in the suggestions list
                    options={schools}
                    // Automatically stretches the input to fill the available space
                    fullWidth
                    // Display loading indicator while data is being fetched
                    loading={schoolsLoading}
                    // Control the value of the input field
                    inputValue={schoolSelected}
                    // Handle change when an option is selected
                    onChange={(_event, value) => {
                        if (value) {
                            // If a valid option is selected, set the selected value as an object containing label and id
                            setSchoolSelected({ label: value.label, id: value.id });
                        } else {
                            // Clear selection if no valid option is selected
                            setSchoolSelected({ label: '', id: '' });
                        }
                    }}
                    // Set size of input field
                    size="small"
                    // Set style of input field
                    renderInput={(params) => <TextField color="secondary" {...params} label="Search school wise" />}
                />
            </Grid>
        </Grid>
    );
};

// Define propTypes for props passed to SchoolsAutoComplete component
SchoolsAutoComplete.propTypes = {
    schools: PropTypes.array,
    schoolSelected: PropTypes.string,
    setSchoolSelected: PropTypes.func,
    schoolsLoading: PropTypes.bool
};

// The following function component is named UsersList and takes in the following prop items: projectId, projectName, schools and schoolsLoading
const UsersList = ({ projectId, projectName, schools, schoolsLoading }) => {
    // State declarations using destructuring syntax. schoolSelected starts as an object with two empty fields
    const [schoolSelected, setSchoolSelected] = useState({ label: '', id: '' });

    // useGetProjectMembers() is a hook to fetch users with projectId and schoolSelected.id updates triggering a re-fetch..
    const [users, loading] = useGetProjectMembers(projectId, schoolSelected.id);

    // sets user data for editing/updating and initializes Modal state variables, 1 for updating user details and another for deleting a user account
    const [updateUserData, setUpdateUserData] = useState({});
    const [openUpdateUserModal, SetOpenUpdateUserModal] = useState(false);
    const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);

    // modifies user data to reflect editting active states
    const editUserData = (data) => {
        setUpdateUserData(data);
        SetOpenUpdateUserModal(true);
    };

    // modifies user data to reflect deleting active states
    const handleDeleteUser = (data) => {
        setUpdateUserData({ ...data, project_name: projectName });
        setOpenDeleteUserModal(true);
    };

    // useCallback prevents functions that uses this hook from refreshng unless its dependencies are modified
    const deleteUser = useCallback(
        (uid, mobileNumber) => {
            deleteMember(uid, mobileNumber, projectId)
                .then(() => toast.success('Deleted user successfully!'))
                .catch((err) => toast.error(err.toString())); // toast notification of deletion failure in the event of an error
            setOpenDeleteUserModal(false);
        },
        [projectId]
    );

    // monitors events other than the clicking outside the modal window.
    const handleModalClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            SetOpenUpdateUserModal(false);
        }
    };

    // handles similar event monitoring as handleModalClose for the DeleteUserModal window
    const handleDeleteUserModalClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpenDeleteUserModal(false);
        }
    };

    // displays users in a card format especially whilst fetching members list.
    const List = () => {
        if (loading) {
            return (
                <p style={{ textAlign: 'center' }}>
                    <b>Searching...</b>
                </p>
            );
        }

        if (users.length === 0) {
            return (
                <p style={{ textAlign: 'center' }}>
                    <b>No users found</b>
                </p>
            );
        }

        return (
            <Grid container direction="column" spacing={gridSpacing} maxWidth={600}>
                {users.map((user) => (
                    <Grid item key={user.mobile_number}>
                        <UserCard data={user} deleteUser={handleDeleteUser} editUserData={editUserData} />
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
        <>
            <MainCard
                title="Manage Users"
                secondary={
                    <SchoolsAutoComplete
                        schools={schools}
                        schoolsLoading={schoolsLoading}
                        schoolSelected={schoolSelected.label}
                        setSchoolSelected={setSchoolSelected}
                    />
                }
            >
                <List />
            </MainCard>
            {openUpdateUserModal && (
                <UpdateUserModal
                    open={openUpdateUserModal}
                    projectId={projectId}
                    schools={schools}
                    projectName={projectName}
                    data={updateUserData}
                    handleModalClose={handleModalClose}
                />
            )}
            {openDeleteUserModal && (
                <DeleteUserModal
                    open={openDeleteUserModal}
                    handleDeleteUser={deleteUser}
                    data={updateUserData}
                    projectName={projectName}
                    handleModalClose={handleDeleteUserModalClose}
                />
            )}
        </>
    ); // end of the function component rendering
};

UsersList.propTypes = {
    open: PropTypes.bool,
    handleModalClose: PropTypes.func,
    projectId: PropTypes.string,
    schools: PropTypes.array,
    schoolsLoading: PropTypes.bool,
    projectName: PropTypes.string
};

export default UsersList; // exporting this defined component
