/* eslint-disable prettier/prettier */
import { Container, Button, Grid, Paper, Typography } from '@mui/material';

import React, { useState } from 'react';

import OtpInput from 'react-otp-input';

import { useLocation, useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { authentication } from 'firebase_setup/firebase';
import { toast } from 'react-toastify';

import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { authErrorCodes } from 'firebase_setup/authErrorCodes';
import { gridSpacing } from 'store/constant';
import { useDispatch } from 'react-redux';

import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'
import { useSignOut } from 'react-firebase-hooks/auth';
import { handleUserLogin } from 'services/users';
import { SET_USER } from 'store/actions';

// Function to generate a reCAPTCHA verifier instance for phone number authentication
const generateRecaptchaVerifier = () => {
    // If a verifier instance already exists, return early (use existing one to prevent duplicates)
    if (window.recaptchaVerifier) {
        return;
    }

    // Create a new invisible reCAPTCHA verifier instance for the given container and options
    window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container', // ID of the container element
        {
            size: 'invisible',
            callback: () => { }
        },
        authentication // Firebase auth instance
    );
};


const Login = () => {
    // Assigns the URL location that the user navigated to.
    const location = useLocation();

    // Navigates programmatically to a new URL
    const navigate = useNavigate();

    // Handles signing out of user accounts
    const [signOut] = useSignOut(authentication);

    // The `dispatch` function is used to send an action to the store to update the state based on the action's payload
    const dispatch = useDispatch();

    // Returns the current application theme color for further use in the code
    const theme = useTheme();

    // State variables for the user's mobile number and mobile information
    const [mobileNumber, setMobileNumber] = useState('');
    const [mobileInfo, setMobileInfo] = useState({});

    // State variable for the OTP value and if one has been sent yet.
    const [otp, setOtp] = useState('');
    const [sentOTP, setSentOTP] = useState(false);

    // State variable used for determining whether or not to redraw the 'Resend OTP' button.
    const [resendOTP, setResendOTP] = useState(false);

    // Loading state for when async operations are performed.
    const [loading, setLoading] = useState(false);

    // Function called upon form submit that generates the reCAPTCHA verifier token and sends a SMS message containing an OTP to the user. 
    const handleSubmit = () => {
        setLoading(true);
        generateRecaptchaVerifier();
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(authentication, mobileNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setSentOTP(true);
            })
            .catch((error) => {
                toast.error(JSON.stringify(error.message));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Function that verifies whether or not a valid OTP was entered by the user once they receive it by SMS.
    const verifyOTP = () => {
        // If the OTP is 6 digits
        if (otp.length === 6) {
            setLoading(true);
            const confirmationResult = window.confirmationResult;
            confirmationResult
                .confirm(otp)
                .then(async (authData) => {
                    await handleUserLogin(authData.user.uid, mobileInfo.nationalNumber, mobileInfo.countryCallingCode).then((data = {}) => {
                        // Check if user data exists
                        if (Object.keys(data).length === 0) {
                            dispatch({ type: SET_USER, data: {} });
                            signOut().then(() => navigate('/access-denied', { replace: true }));
                        } else {
                            if (!data?.dashboard_role && ['student', 'teacher'].includes(data?.user_role?.toLowerCase())) {
                                dispatch({ type: SET_USER, data: {} });
                                signOut().then(() => navigate('/access-denied', { replace: true }));
                            } else {
                                // Handle setting user roles
                                if (data?.dashboard_role) {
                                    dispatch({ type: SET_USER, data: data });
                                } else if (data?.user_role?.toLowerCase()?.includes('student')) {
                                    dispatch({ type: SET_USER, data: { ...data, dashboard_role: 'student' } });
                                } else if (data?.user_role?.toLowerCase()?.includes('teacher')) {
                                    dispatch({ type: SET_USER, data: { ...data, dashboard_role: 'teacher' } });
                                }
                            }
                        }
                    });

                    setLoading(false);

                    // Navigate to previous screen if directed from shared link, else go to dashboard
                    if (location.state?.from?.includes('shared')) {
                        navigate(location.state.from);
                        return;
                    }
                })
                .catch((error) => {
                    if (authErrorCodes.CODE_EXPIRED === error.code) {
                        setResendOTP(true);
                    }
                    toast.error(JSON.stringify(error.message));
                    setLoading(false);
                });
        }
    };

    // Reset states after going back to the mobile input number screen
    const handleGoBack = () => {
        setSentOTP(false);
        setOtp('');
        setResendOTP(false);
    };

    // Resend the OTP to phone with the same phone number
    const handleResendOTP = () => {
        setOtp('');
        handleSubmit();
    };

    // Update the mobile number local state values
    const handleMobileNumberChange = (value, info) => {
        setMobileNumber(value);
        setMobileInfo(info);
    }

    // Determine whether form can be submitted
    const canEnableSubmitButton = !matchIsValidTel(mobileNumber);

    return (
        <div style={{ background: 'linear-gradient(#68EACC 0%,#497BE8 100%)' }}>
            <Container maxWidth="sm">
                <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
                    <Paper elelvation={20} variant="outlined" sx={{ p: 2 }}>
                        <Grid container justifyContent="center" alignItems="center" direction="column" marginBottom={2}>
                            <img src={require('assets/images/nextskills360_logo.png')} alt="nextskills 360" width="90" height="109" />
                            <Typography textAlign="center" sx={{ fontSize: '1.25rem', fontWeight: 500, mt: 1.75 }}>
                                Login to Next Skills 360 Dashboard
                            </Typography>
                        </Grid>

                        {!sentOTP ? (
                            <form>
                                <Grid container direction="column" spacing={2} alignItems="center">
                                    <Grid item >
                                        <MuiTelInput
                                            autoFocus
                                            forceCallingCode
                                            defaultCountry='IN'
                                            color="secondary"
                                            focusOnSelectCountry
                                            value={mobileNumber}
                                            onChange={handleMobileNumberChange}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <LoadingButton
                                            loading={loading}
                                            onClick={handleSubmit}
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                            disabled={canEnableSubmitButton}
                                            type="submit"
                                        >
                                            Submit
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </form>
                        ) : (
                            <form>
                                <Grid container direction="column" spacing={2} alignItems="center">
                                    <Grid item>
                                        <Typography textAlign="center">
                                            Enter the 6-digit OTP sent to you at :
                                            <span style={{ color: 'steelblue', fontWeight: 'bold', fontSize: '16px', whiteSpace: 'nowrap' }}> {mobileNumber}</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <OtpInput
                                            type="number"
                                            numInputs={6}
                                            value={otp}
                                            isInputNum={true}
                                            onChange={(otp) => setOtp(otp)}
                                            inputStyle={{
                                                width: '30px',
                                                height: '30px',
                                                margin: '0 5px',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                borderRadius: '4px',
                                                border: `1px solid rgba(0, 0, 0, 0.3)`
                                            }}
                                            shouldAutoFocus={true}
                                            hasErrored={false}
                                            focusStyle={{ outline: `1px solid ${theme.palette.secondary[800]}` }}
                                            errorStyle={{ border: `2px solid ${theme.palette.error.dark}` }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <LoadingButton
                                            loading={loading}
                                            onClick={verifyOTP}
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                            type="submit"
                                            disabled={otp.trim().length !== 6}
                                        >
                                            Verify OTP
                                        </LoadingButton>
                                    </Grid>
                                    <Grid item width="100%">
                                        <Grid container justifyContent="space-between" spacing={gridSpacing}>
                                            <Grid item>
                                                <Button color="secondary" size="small" onClick={handleGoBack}>
                                                    Change Mobile Number
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                {resendOTP && (
                                                    <Button color="secondary" size="small" onClick={handleResendOTP}>
                                                        Resend OTP
                                                    </Button>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Paper>
                </Grid>
            </Container>
        </div>
    );
};
export default Login;
