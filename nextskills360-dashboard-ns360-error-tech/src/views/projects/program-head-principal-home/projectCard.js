import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Tooltip, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets

import { useNavigate } from 'react-router';
import { roles } from 'constants/roles';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    maxWidth: 300,
    // height: '100%',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative'
    // '&:before': {
    //     content: '""',
    //     position: 'absolute',
    //     width: 150,
    //     height: 150,
    //     background: theme.palette.secondary[200],
    //     borderRadius: '50%',
    //     top: -40,
    //     right: -90,
    //     opacity: 0.5,
    //     [theme.breakpoints.down('sm')]: {
    //         top: -155,
    //         right: -70
    //     }
    // }
}));

const ProjectCard = ({ isLoading, projectId, status, referralCode, schoolName, projectName = 'Asifabad - Full District', role }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const roleWiseColors = {
        program_head: theme.palette.primary.main,
        principal: theme.palette.secondary.main,
        guest_program_head: theme.palette.orange.dark,
        guest_principal: theme.palette.orange.dark
    };

    const handleNavigation = () => {
        if ([roles.GUEST_PROGRAM_HEAD, roles.PROGRAM_HEAD].includes(role)) {
            navigate(`/reports/${projectId}`);
        }

        if ([roles.TEACHER, roles.STUDENT, roles.GUEST_PRINCIPAL, roles.PRINCIPAL].includes(role)) {
            navigate(`/reports/${projectId}/school-details/${referralCode}`);
        }
    };

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper
                    border={false}
                    content={false}
                    sx={{ cursor: 'pointer', background: roleWiseColors[role] }}
                    onClick={handleNavigation}
                >
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container alignItems="center">
                                    {schoolName && (
                                        <Grid item>
                                            <Tooltip title={projectName}>
                                                <Typography
                                                    noWrap
                                                    sx={{
                                                        fontSize: '1.125rem',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        width: '17rem',
                                                        fontWeight: 500,
                                                        mr: 1,
                                                        mt: 1.75,
                                                        mb: 0.75
                                                    }}
                                                >
                                                    Project Name : {projectName}
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                    )}
                                    <Grid item>
                                        <Tooltip title={schoolName ? schoolName : projectName}>
                                            <Typography
                                                noWrap
                                                sx={{
                                                    fontSize: '1.125rem',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    width: '17rem',
                                                    fontWeight: 500,
                                                    mr: 1,
                                                    mt: 1.75,
                                                    mb: 0.75
                                                }}
                                            >
                                                {schoolName ? `School Name : ${schoolName}` : projectName}
                                            </Typography>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container flexDirection="row" alignItems="center">
                                <Grid item>
                                    <Typography sx={{ fontSize: '1.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                        Status : {status}
                                    </Typography>
                                </Grid>
                                {/* <Grid item>
                                    <Typography sx={{ fontSize: '1.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                        Role : {role.startsWith('guest') ? 'Guest User' : formatFieldName(role)}
                                    </Typography>
                                </Grid> */}
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

ProjectCard.propTypes = {
    isLoading: PropTypes.bool,
    projectName: PropTypes.string,
    role: PropTypes.string,
    studentCount: PropTypes.number,
    teacherCount: PropTypes.number,
    projectId: PropTypes.string,
    status: PropTypes.string,
    schoolName: PropTypes.string,
    referralCode: PropTypes.string
};

export default ProjectCard;
