import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, Stack, Typography, useMediaQuery } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
// import LogoSection from '../LogoSection';
// project imports
import MenuList from './MenuList';
import LogoSection from '../LogoSection';
import { drawerWidth } from 'store/constant';
import { getCurrentUser } from 'store/selectors';
import { roles } from 'constants/roles';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const { projectId } = useParams();
    const { project_id, dashboard_role } = useSelector(getCurrentUser);

    const drawer = (
        <>
            <PerfectScrollbar
                component="div"
                style={{
                    height: !matchUpMd ? 'calc(100vh)' : 'calc(100vh - 100px)',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                <div>
                    {!matchUpMd ? (
                        <Stack justifyContent="center" alignItems="center">
                            <img
                                src={require('assets/images/ProGame Logo.png')}
                                alt="ProGame"
                                style={{ marginTop: '2px' }}
                                height="auto"
                                width="100%"
                            />
                            <Typography variant="h4">Beta</Typography>
                        </Stack>
                    ) : null}
                    <MenuList />
                </div>
                {projectId ? (
                    <LogoSection projectId={projectId} />
                ) : project_id && [roles.TEACHER, roles.STUDENT].includes(dashboard_role) ? (
                    <LogoSection projectId={project_id} />
                ) : null}
            </PerfectScrollbar>
        </>
    );

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <>
            <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="mailbox folders">
                <Drawer
                    container={container}
                    variant={matchUpMd ? 'persistent' : 'temporary'}
                    anchor="left"
                    open={drawerOpen}
                    onClose={drawerToggle}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            background: theme.palette.background.default,
                            color: theme.palette.text.primary,
                            borderRight: 'none',
                            [theme.breakpoints.up('md')]: {
                                top: '100px'
                            }
                        }
                    }}
                    ModalProps={{ keepMounted: true }}
                    color="inherit"
                >
                    {drawer}
                </Drawer>
            </Box>
        </>
    );
};

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    window: PropTypes.object
};

export default Sidebar;
