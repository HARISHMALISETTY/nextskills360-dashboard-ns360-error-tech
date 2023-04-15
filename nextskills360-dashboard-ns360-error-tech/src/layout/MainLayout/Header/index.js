import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Stack, Typography } from '@mui/material';

// project imports
import ProfileSection from './ProfileSection';
import CloseIcon from '@mui/icons-material/Close';

// assets
import { IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();

    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <Stack justifyContent="center" alignItems="center" sx={{ height: '85px', width: '200px' }}>
                        <img
                            src={require('assets/images/ProGame Logo.png')}
                            style={{
                                height: '75px',
                                width: '100%',
                                objectFit: 'contain',
                                objectPosition: 'center'
                            }}
                            alt="ProGame"
                        />
                        <Typography variant="h4">Beta</Typography>
                    </Stack>
                </Box>
            </Box>
            <Box>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        onClick={handleLeftDrawerToggle}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>
            <Box sx={{ flexGrow: 1, textAlign: 'center', mt: 1, mb: 0 }}>
                <Typography
                    sx={{
                        color: theme.palette.secondary.dark,
                        fontSize: '2rem',
                        fontWeight: 500,
                        [theme.breakpoints.down('sm')]: { fontSize: '1.3rem' }
                    }}
                >
                    Dashboard
                </Typography>
                <Typography
                    sx={{
                        color: theme.palette.grey[500],
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        [theme.breakpoints.down('sm')]: { fontSize: '0.75rem' }
                    }}
                >
                    ProGame-coding WITHOUT Computers
                </Typography>
            </Box>
            <ProfileSection />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
