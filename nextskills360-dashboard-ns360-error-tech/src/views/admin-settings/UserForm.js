import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Autocomplete, Button, Grid, MenuItem, Select, TextField, useMediaQuery } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { IconEdit } from '@tabler/icons';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { isValidName, isValidMobileNumber } from 'utils/form-validations';
import { getUserDataByPhoneNumber } from 'services/users';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'store/selectors';
import { roles } from 'constants/roles';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import SchoolIcon from '@mui/icons-material/School';

const initialData = {
    name: '',
    mobileNo: '',
    role: 'program_head',
    accessLevel: 'project',
    school: '',
    referralCode: null
};

const initialDisabledData = { name: true, role: true, accessLevel: true };

export const UserForm = ({
    addNewUser,
    initialFormData = initialData,
    isUpdateData,
    updateUserData,
    hideModal,
    schools,
    schoolsLoading
}) => {
    // In this line of code, the `useTheme` Hook from Material-UI library is being used to access the current theme configuration.
    const theme = useTheme();

    // The `useMediaQuery` Hook from Material-UI is being used to check whether the screen size matches a breakpoint defined in the current theme.
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));

    // In this line of code, the `useState` Hook allows the component to store its state and manage it over time. The `initialFormData` object will be the initial state value of the `formData` variable.
    const [formData, setFormData] = useState(initialFormData);

    // The `useSelector` Hook from the Redux library is being used to select data from the Redux store. Specifically, it's selecting the current user's data.
    const currentUser = useSelector(getCurrentUser);

    // These next few lines of code are initializing stateful variables using the `useState` Hook: `loading`, `searchingUser`, `fieldsDisabled`, `enableAddNewUserButton`. Each variable is initially set to false or `initialDisabledData` which is an object that contains `true` values for each field user cannot modify.
    const [loading, setLoading] = useState(false);

    const [searchingUser, setSearchingUser] = useState(false);

    const [fieldsDisabled, setFieldsDisabled] = useState(initialDisabledData);

    const [enableAddNewUserButton, setEnableAddNewUserButton] = useState(false);

    // These three constants below check whether the name, mobile number and school, comply with certain rules or not,
    // so they can be marked as invalid if they don't meet the requirements.
    const isNameInvalid = !isValidName(formData.name);

    const isMobileNumberInvalid = formData.mobileNo.length > 0 && !isValidMobileNumber(formData.mobileNo);

    const schoolNameValid = formData.accessLevel === 'school' ? formData.school.length > 0 : true;

    // This constant checks if any of the user fields is updated or if the user has program head and guest program head roles.
    const canAnyFieldUpdated =
        Object.values(fieldsDisabled).every(Boolean) && [roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD].includes(formData.role);

    // Form validation rule based on certain conditions
    // It checks whether the input meets the required conditions to enable the Add New User Button.
    // If any condition is found falsy which means the field is not meeting the requirements then we won't allow the button to be enabled.
    const newUserConditions = !(
        formData.mobileNo.length === 10 &&
        formData.name.length > 3 &&
        !isNameInvalid &&
        !isMobileNumberInvalid &&
        schoolNameValid &&
        !canAnyFieldUpdated
    );

    // Check if we can engage the 'enableAddNewUserButton'. This condition uses short-circuiting logic inside the ternary operator.
    // If `enableAddNewUserButton` is already true, getting an invert boolean result of `true` makes variable equals to false due to left-hand operator error else assign it to `newUserConditions`
    let canEnableAddNewUserButton = enableAddNewUserButton ? !enableAddNewUserButton : newUserConditions;

    // This is a function that takes an event as a parameter when it is triggered.
    const handleChange = (e) => {
        // Event target variable is assigned
        const target = e.target;

        // If the target value is equal to 'school', update the form data and set the role as 'principal'.
        if (target.value === 'school') {
            setFormData((prev) => ({ ...prev, [target.name]: target.value, role: 'principal' }));
            return;
        }

        // If the target value is equal to 'project', update the form data and set the role as 'program_head'.
        if (target.value === 'project') {
            setFormData((prev) => ({ ...prev, [target.name]: target.value, role: 'program_head' }));
            return;
        }

        // If target name is "mobileNo" then we first check if it matches with current user's mobile number
        // If it does, then show warning message.
        // Otherwise, make an API call to fetch the user associated with this mobile number and
        // Update form fields based on his access level & dashboard_role.

        if (target.name === 'mobileNo') {
            // This condition checks if the user is trying to assign himself to project/school level role
            // If he is, then a warning message pops up.

            if (currentUser.mobile_number === Number(target.value)) {
                toast.warn('You cannot assign yourself to project/school level role.');

                // If user enters valid 10 digit mobile number, then it will fetch details of user for which given mobile no belongs to.
            } else if (target.value.length === 10) {
                // Set Loading Indicator while API request is being processed.
                setSearchingUser(true);

                // Making an API Call to fetch User Data by Phone Number.
                getUserDataByPhoneNumber(Number(target.value)).then((users) => {
                    // Find User with Dashboard Role and Authentication User Based on Given Mobile No.
                    const userWithDashboardRole = users.find((user) => user?.dashboard_role);
                    const authUser = users.find((user) => user?.user_uid);

                    // If user has dashboard role, and he is Program Head or Guest Program Head,
                    // Then populate Form Fields accordingly.

                    if (userWithDashboardRole) {
                        if ([roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD].includes(userWithDashboardRole.dashboard_role)) {
                            setFormData((prev) => ({
                                ...prev,
                                role: userWithDashboardRole.dashboard_role,
                                name: userWithDashboardRole.user_name,
                                accessLevel: 'project',
                                school: '',
                                referralCode: null
                            }));
                            setEnableAddNewUserButton(true);

                            // Else if he is Principal or Guest Principal, populate Form Fields accordingly.
                        } else if ([roles.PRINCIPAL, roles.GUEST_PRINCIPAL].includes(userWithDashboardRole.dashboard_role)) {
                            setFormData((prev) => ({
                                ...prev,
                                role: userWithDashboardRole.dashboard_role,
                                name: userWithDashboardRole.user_name,
                                accessLevel: 'school',
                                school: '',
                                referralCode: null
                            }));
                            setEnableAddNewUserButton(false);
                        }

                        // Reset Field Disabled Properties to Those Initially Disabled
                        setFieldsDisabled(initialDisabledData);

                        // Else if authentication user is found, populate name field accordingly.
                    } else if (authUser) {
                        setFormData((prev) => ({
                            ...prev,
                            name: authUser.user_name
                        }));
                        setFieldsDisabled((prev) => ({ ...prev, role: false, accessLevel: false }));
                    } else {
                        // Reset Add New User Button, Name, Role & Accesslevel Fields Disabled Properties
                        setEnableAddNewUserButton(false);
                        setFieldsDisabled({ name: false, role: false, accessLevel: false });
                        setFormData((prev) => ({ ...initialData, mobileNo: prev.mobileNo }));
                    }

                    // Unset Loading Indicator Once API Request Processing is Done
                    setSearchingUser(false);
                });

                // If mobile number entered is invalid/different length, then reset disabled fields
            } else {
                setFieldsDisabled(initialDisabledData);
            }
        }

        // Update the form data with the values entered in the target field after handling all above conditions.
        setFormData((prev) => ({ ...prev, [target.name]: target.value }));
    };

    // function to handle form submission
    const handleSubmit = () => {
        setLoading(true); // Show loading status

        addNewUser(formData) // Call API function to add new user with form data object as parameter
            .then(() => {
                // If API call is successful
                setFormData(initialData); // Reset form data to its initial state
                setFieldsDisabled(initialDisabledData); // Disable form fields after submission
                setEnableAddNewUserButton(false); // Disable "add new user" button after submission
                toast.success('Added new user successfully!'); // Display success message using toast notification library
            })
            .catch((err) => toast.error(err.toString())) // If there's an error during API call, display error message using toast notification library
            .finally(() => {
                setLoading(false); // Hide loading status
            });
    };

    // This function handles the submission of user data for updating an existing user.
    const handleUpdateData = () => {
        setLoading(true); // Set loading to true indicating that an update is ongoing.

        // Calls a function to update a user's information with the new form data provided.
        updateUserData(formData)
            .then(() => {
                // If successful, hide the modal displaying the form & show a success message.
                hideModal();
                toast.success('Updated user successfully!');
            })
            .catch((err) => toast.error(err.toString())) // If error occurs, show an error message.
            .finally(() => {
                // Regardless of success or failure, set loading to false.
                setLoading(false);
            });
        return; // This line returns nothing.
    };

    // Checks if the referral code has been modified from its initial value
    const canEnableUpdateUserButton = !(formData.referralCode !== '' && initialFormData.referralCode !== formData.referralCode);

    // Defines helper text for the mobile number input, depending on validation and search status
    const mobileHelperText = isMobileNumberInvalid
        ? 'Please enter a valid mobile number'
        : searchingUser && 'Please wait, searching user...';

    // Determines spacing between label and input fields based on screen size
    const labelInputSpacing = matchDownSm ? 1 : 4;

    return (
        <Grid container direction="column" spacing={3} maxWidth={400}>
            <Grid item>
                <Grid container justifyContent="space-between" spacing={labelInputSpacing}>
                    <Grid item xs={5} sm={4}>
                        <Button
                            variant="contained"
                            startIcon={<PhoneIcon />}
                            disableElevation
                            fullWidth
                            color="secondary"
                            sx={{ cursor: 'default' }}
                        >
                            Mobile
                        </Button>
                    </Grid>
                    <Grid item xs={7} sm={8}>
                        <TextField
                            type="tel"
                            color="secondary"
                            fullWidth
                            disabled={isUpdateData}
                            name="mobileNo"
                            label="Mobile Number"
                            placeholder="Mobile Number"
                            error={isMobileNumberInvalid}
                            helperText={mobileHelperText}
                            variant="outlined"
                            inputMode="tel"
                            inputProps={{ maxLength: 10 }}
                            required
                            size="small"
                            value={formData.mobileNo}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item>
                <Grid container justifyContent="space-between" spacing={labelInputSpacing}>
                    <Grid item xs={5} sm={4}>
                        <Button
                            startIcon={<PersonIcon />}
                            variant="contained"
                            fullWidth
                            disableElevation
                            color="secondary"
                            sx={{ cursor: 'default' }}
                        >
                            Name
                        </Button>
                    </Grid>
                    <Grid item xs={7} sm={8}>
                        <TextField
                            type="text"
                            color="secondary"
                            fullWidth
                            error={isNameInvalid}
                            helperText={isNameInvalid ? 'Please enter a valid name' : ''}
                            name="name"
                            label="Enter Name"
                            placeholder="Name"
                            variant="outlined"
                            required
                            disabled={fieldsDisabled.name}
                            size="small"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item>
                <Grid container justifyContent="space-between" alignItems="center" spacing={labelInputSpacing}>
                    <Grid item xs={5} sm={4}>
                        <Button
                            startIcon={<SecurityIcon />}
                            variant="contained"
                            fullWidth
                            disableElevation
                            color="secondary"
                            sx={{ cursor: 'default' }}
                        >
                            Access
                        </Button>
                    </Grid>
                    <Grid item xs={7} sm={8}>
                        <Select
                            color="secondary"
                            name="accessLevel"
                            onChange={handleChange}
                            fullWidth
                            disabled={fieldsDisabled.accessLevel}
                            value={formData.accessLevel}
                            size="small"
                        >
                            <MenuItem value="project">Project</MenuItem>
                            <MenuItem value="school">School</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item>
                <Grid container justifyContent="space-between" alignItems="center" spacing={labelInputSpacing}>
                    <Grid item xs={5} sm={4}>
                        <Button
                            startIcon={<VerifiedIcon />}
                            variant="contained"
                            fullWidth
                            disableElevation
                            color="secondary"
                            sx={{ cursor: 'default' }}
                        >
                            Role
                        </Button>
                    </Grid>
                    <Grid item xs={7} sm={8}>
                        <Select
                            disabled={fieldsDisabled.role}
                            color="secondary"
                            name="role"
                            onChange={handleChange}
                            fullWidth
                            value={formData.role}
                            size="small"
                        >
                            {formData.accessLevel === 'project' && <MenuItem value="program_head">Program Head</MenuItem>}
                            {formData.accessLevel === 'school' && <MenuItem value="principal">Principal</MenuItem>}
                            <MenuItem value={formData.accessLevel === 'project' ? 'guest_program_head' : 'guest_principal'}>
                                Guest User
                            </MenuItem>
                        </Select>
                    </Grid>
                </Grid>
            </Grid>

            {formData.accessLevel === 'school' && (
                <Grid item>
                    <Grid container justifyContent="space-between" alignItems="center" spacing={labelInputSpacing}>
                        <Grid item xs={5} sm={4}>
                            <Button
                                startIcon={<SchoolIcon />}
                                variant="contained"
                                fullWidth
                                disableElevation
                                color="secondary"
                                sx={{ cursor: 'default' }}
                            >
                                School
                            </Button>
                        </Grid>
                        <Grid item xs={7} sm={8}>
                            <Autocomplete
                                id="combo-box-demo"
                                options={schools}
                                fullWidth
                                loading={schoolsLoading}
                                inputValue={formData.school}
                                value={formData.school}
                                isOptionEqualToValue={(option, value) => option.label === value}
                                onChange={(_event, value) => {
                                    if (value) {
                                        setFormData((prev) => ({ ...prev, school: value.label, referralCode: value.id }));
                                    } else {
                                        setFormData((prev) => ({ ...prev, school: '', referralCode: '' }));
                                    }
                                }}
                                size="small"
                                renderInput={(params) => <TextField color="secondary" required {...params} label="School Name" />}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            )}

            <Grid item>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        {isUpdateData ? (
                            <LoadingButton
                                loading={loading}
                                onClick={handleUpdateData}
                                disabled={canEnableUpdateUserButton}
                                variant="contained"
                                color="secondary"
                                startIcon={<IconEdit />}
                            >
                                Save
                            </LoadingButton>
                        ) : (
                            <LoadingButton
                                loading={loading}
                                onClick={handleSubmit}
                                variant="contained"
                                color="secondary"
                                size="large"
                                disabled={canEnableAddNewUserButton}
                                startIcon={<PersonAddAltIcon />}
                                type="submit"
                            >
                                Add new user
                            </LoadingButton>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

UserForm.propTypes = {
    addNewUser: PropTypes.func,
    initialFormData: PropTypes.object,
    isUpdateData: PropTypes.bool,
    updateUserData: PropTypes.func,
    hideModal: PropTypes.func,
    schools: PropTypes.array,
    schoolsLoading: PropTypes.bool
};
