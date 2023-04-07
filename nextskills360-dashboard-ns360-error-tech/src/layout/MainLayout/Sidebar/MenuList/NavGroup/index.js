import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, List, Typography } from '@mui/material';
import { IconSchool, IconChartInfographic, IconPhoto, IconSettings } from '@tabler/icons';

// project imports
import NavItem from '../NavItem';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getCurrentUser } from 'store/selectors';
import { roles } from 'constants/roles';

const icons = { IconSchool, IconChartInfographic, IconPhoto, IconSettings };

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = () => {
    const theme = useTheme();

    const { projectId, schoolId } = useParams();

    const user = useSelector(getCurrentUser);
    const isReportsFlow = location.pathname.includes('reports');
    const encodedProjectId = encodeURI(projectId);
    const encodedSchoolId = encodeURI(schoolId);
    return (
        <>
            <List
                subheader={
                    <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
                        Dashboard
                    </Typography>
                }
            >
                {![roles.TEACHER, roles.STUDENT].includes(user.dashboard_role) && (
                    <NavItem
                        item={{
                            id: 'projects',
                            title: 'Projects',
                            type: 'item',
                            url: '/',
                            icon: icons.IconSchool,
                            breadcrumbs: false
                        }}
                        level={1}
                    />
                )}

                {isReportsFlow && [roles.ADMIN, roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD].includes(user.dashboard_role) && (
                    <NavItem
                        item={{
                            id: 'reports',
                            title: 'Reports',
                            type: 'item',
                            url: `/reports/${encodedProjectId}`,
                            icon: icons.IconChartInfographic,
                            breadcrumbs: false
                        }}
                        level={1}
                    />
                )}

                {isReportsFlow && [roles.PRINCIPAL, roles.GUEST_PRINCIPAL].includes(user.dashboard_role) && (
                    <NavItem
                        item={{
                            id: 'reports',
                            title: 'Reports',
                            type: 'item',
                            url: `/reports/${encodedProjectId}/school-details/${encodedSchoolId}`,
                            icon: icons.IconChartInfographic,
                            breadcrumbs: false
                        }}
                        level={1}
                    />
                )}

                {[roles.TEACHER, roles.STUDENT].includes(user.dashboard_role) && (
                    <NavItem
                        item={{
                            id: 'reports',
                            title: 'Reports',
                            type: 'item',
                            url: `/`,
                            icon: icons.IconChartInfographic,
                            breadcrumbs: false
                        }}
                        level={1}
                    />
                )}

                {isReportsFlow && [roles.ADMIN, roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD].includes(user.dashboard_role) && (
                    <NavItem
                        item={{
                            id: 'worldGallery',
                            title: 'World Gallery',
                            type: 'item',
                            url: `/reports/${encodedProjectId}/world-gallery`,
                            icon: icons.IconPhoto,
                            breadcrumbs: false
                        }}
                        level={1}
                    />
                )}

                {!isReportsFlow && ![roles.TEACHER, roles.STUDENT].includes(user.dashboard_role) && (
                    <NavItem
                        item={{
                            id: 'worldGallery',
                            title: 'World Gallery',
                            type: 'item',
                            url: `/world-gallery`,
                            icon: icons.IconPhoto,
                            breadcrumbs: false
                        }}
                        level={1}
                    />
                )}

                {isReportsFlow && [roles.PRINCIPAL, roles.GUEST_PRINCIPAL].includes(user.dashboard_role) && (
                    <NavItem
                        item={{
                            id: 'worldGallery',
                            title: 'World Gallery',
                            type: 'item',
                            url: `/reports/${encodedProjectId}/school-details/${encodedSchoolId}/world-gallery`,
                            icon: icons.IconPhoto,
                            breadcrumbs: false
                        }}
                        level={1}
                    />
                )}

                {!isReportsFlow && [roles.TEACHER, roles.STUDENT].includes(user.dashboard_role) && (
                    <NavItem
                        item={{
                            id: 'worldGallery',
                            title: 'World Gallery',
                            type: 'item',
                            url: `/world-gallery/${encodeURI(user?.project_id)}`,
                            icon: icons.IconPhoto,
                            breadcrumbs: false
                        }}
                        level={1}
                    />
                )}

                {user.dashboard_role === roles.ADMIN && isReportsFlow && (
                    <NavItem
                        item={{
                            id: 'settings',
                            title: 'Settings',
                            type: 'item',
                            url: `/reports/${encodedProjectId}/settings`,
                            icon: icons.IconSettings,
                            breadcrumbs: false
                        }}
                        level={1}
                    />
                )}
            </List>

            {/* group divider */}
            <Divider sx={{ mt: 0.25, mb: 1.25 }} />
        </>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object
};

export default NavGroup;
