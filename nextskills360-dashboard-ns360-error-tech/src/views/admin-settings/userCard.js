// Importing required modules
import PropTypes from 'prop-types';
import { IconButton, Typography, Grid, useTheme, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconEdit } from '@tabler/icons';
import { gridSpacing } from 'store/constant';
import { formatFieldName } from 'utils/formatFieldName';

// UserCard component receives props as input
const UserCard = ({ data, editUserData, deleteUser }) => {
    const theme = useTheme();

    // An object representing different colors depending on the role of user.
    const roleWiseColors = {
        program_head: theme.palette.primary.main,
        principal: theme.palette.secondary.main,
        guest_program_head: theme.palette.orange.dark,
        guest_principal: theme.palette.orange.dark
    };

    return (
        <>
            {/* A card component showing user information*/}
            <Grid container direction="column" spacing={gridSpacing} maxWidth={600}>
                <Grid item xs={12} md={8}>
                    <Grid
                        container
                        justifyContent="space-between"
                        spacing={1}
                        sx={{ p: 1, borderRadius: 2, fontWeight: 500, background: roleWiseColors[data.dashboard_role], color: 'white' }}
                    >
                        {/* Displaying name*/}
                        <Grid item md={3} xs={6}>
                            <Box mb={1}>
                                <Typography color={theme.palette.grey[300]}>Name</Typography>
                            </Box>
                            <Box mr={2}>
                                <Typography>{data.user_name}</Typography>
                            </Box>
                        </Grid>
                        {/* Displaying mobile number*/}
                        <Grid item md={3} xs={6}>
                            <Box mb={1}>
                                <Typography color={theme.palette.grey[300]}>Mobile</Typography>
                            </Box>
                            <Box mr={2}>
                                <Typography>{data.mobile_number}</Typography>
                            </Box>
                        </Grid>
                        {/* Displaying user role*/}
                        <Grid item md={3} xs={6}>
                            <Box mb={1}>
                                <Typography color={theme.palette.grey[300]}>Role</Typography>
                            </Box>
                            <Typography>
                                {data?.dashboard_role?.startsWith('guest') ? 'Guest User' : formatFieldName(data?.dashboard_role)}
                            </Typography>
                        </Grid>
                        {/* Button to edit user data */}
                        <Grid item md={1} xs={3} alignSelf="center">
                            <IconButton edge="start" aria-label="edit" onClick={() => editUserData(data)}>
                                <IconEdit color="white" />
                            </IconButton>
                        </Grid>
                        {/*Button to delete user data */}
                        <Grid item md={1} xs={3} alignSelf="center">
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => deleteUser(data)}
                                sx={{ color: theme.palette.background.paper }}
                            >
                                <DeleteIcon color={theme.palette.background.paper} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

// Specifying propTypes for UserCard component
UserCard.propTypes = {
    open: PropTypes.bool,
    handleModalClose: PropTypes.func,
    data: PropTypes.object,
    editUserData: PropTypes.func,
    deleteUser: PropTypes.func
};

// Exporting UserCard component
export default UserCard;
