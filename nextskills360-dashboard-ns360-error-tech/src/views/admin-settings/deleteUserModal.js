//Importing external dependencies
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { List, ListItem, ListItemText, useTheme } from '@mui/material';
import { formatFieldName } from 'utils/formatFieldName';

//Functional component for rendering user details listed in an unordered list.
export const UserDetailsList = ({ data }) => {
    return (
        <List>
            <ListItem>
                <ListItemText primary="Name" secondary={data.user_name} />
            </ListItem>
            <ListItem>
                <ListItemText primary="Mobile" secondary={data.mobile_number} />
            </ListItem>
            <ListItem>
                <ListItemText primary="Project Name" secondary={data.project_name} />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Role"
                    //Conditional rendering of the secondary field based on dashboard_role value.
                    secondary={data?.dashboard_role?.startsWith('guest') ? 'Guest User' : formatFieldName(data?.dashboard_role)}
                />
            </ListItem>
            {/* Conditional rendering of the List Item element based on existence of institution_name*/}
            {data?.institution_name && (
                <ListItem>
                    <ListItemText primary="School Name" secondary={data.institution_name} />
                </ListItem>
            )}
        </List>
    );
};

//Prop validation for userDetailsList.
UserDetailsList.propTypes = {
    data: PropTypes.object
};

/* Functional component that renders a modal containing a dialog box with user details list and 
  corresponding options to delete or cancel deletion*/
const DeleteUserModal = ({ open, handleModalClose, handleDeleteUser, data }) => {
    const theme = useTheme();
    return (
        <>
            <Dialog open={open} onClose={handleModalClose} aria-labelledby="delete-user-dialog" aria-describedby="delete-user-dialog">
                <DialogTitle id="delete-user" variant="h4">
                    Are you sure you want to delete this user?
                </DialogTitle>
                <DialogContent>
                    {/*Rendering UserDetailsList component  */}
                    <UserDetailsList data={data} />
                    {/* Dialog Content Text*/}
                    <DialogContentText id="delete-user-description">
                        This action cannot be undone. Please ensure that you have selected the correct user before proceeding.
                    </DialogContentText>
                </DialogContent>
                {/* Dialog actions containing two Buttons(Cancel and Delete)*/}
                <DialogActions>
                    <Button variant="contained" onClick={handleModalClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.error.main,
                            '&:hover': {
                                backgroundColor: theme.palette.error.dark
                            }
                        }}
                        onClick={() => handleDeleteUser(data.uid, data.mobile_number)}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
//Prop types validation for DeleteUserModal component.
DeleteUserModal.propTypes = {
    open: PropTypes.bool,
    handleModalClose: PropTypes.func,
    handleDeleteUser: PropTypes.func,
    data: PropTypes.object
};
//Default export of DeleteUserModal component.
export default DeleteUserModal;
