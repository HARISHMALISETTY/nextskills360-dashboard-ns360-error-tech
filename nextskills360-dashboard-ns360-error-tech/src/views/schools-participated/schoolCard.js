import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

import { ReactComponent as StudentIcon } from 'assets/images/icons/student.svg';
import { ReactComponent as TeacherIcon } from 'assets/images/icons/teacher.svg';
import { useNavigate } from 'react-router';
import CountUp from 'react-countup';
import { formatNumber } from 'utils/formatNumber';
import config from 'config';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    maxWidth: 210,
    maxHeight: 300,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative'
}));

const SchoolCard = ({ isLoading, schoolName = 'AHS (B) ASIFABAD', studentCount = '', teacherCount = '', schoolId }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper
                    border={false}
                    content={false}
                    onClick={() => navigate(`../school-details/${schoolId}`)}
                    sx={{ cursor: 'pointer', height: '100%' }}
                >
                    <Box sx={{ p: 2.25, height: '100%' }}>
                        <Grid container direction="column" justifyContent="space-between" alignItems="center" sx={{ height: '100%' }}>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Grid container justifyContent="center" alignItems="center">
                                    <Grid item>
                                        <Typography
                                            sx={{
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                color: 'white',
                                                textAlign: 'center',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                maxHeight: '60px',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                width: '11rem'
                                            }}
                                        >
                                            {/* {schoolName} */}

                                            {schoolName
                                                .replace(/(\w)(\w*)/g, function (g0, g1, g2) {
                                                    return g1.toUpperCase() + g2.toLowerCase();
                                                })
                                                .replace(/\s+/g, ' ')
                                                .replace(/[^a-zA-Z0-9]/g, ' ')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container justifyContent="space-between" spacing={2}>
                                    <Grid item>
                                        <Grid container direction="column" justifyContent="center" alignItems="center">
                                            <Grid item sx={{ mb: 1.25 }}>
                                                <StudentIcon height={23} width={25} fill="#fff" />
                                            </Grid>
                                            <Grid item>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        ...theme.typography.commonAvatar,
                                                        color: 'blue',
                                                        backgroundColor: theme.palette.secondary.light,
                                                        height: '2rem',
                                                        width: 'auto',
                                                        minWidth: '4rem',
                                                        pl: 1,
                                                        pr: 1
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '1.2rem',
                                                            fontWeight: 500,
                                                            color: 'blue'
                                                        }}
                                                    >
                                                        <CountUp
                                                            start={0}
                                                            end={studentCount}
                                                            formattingFn={formatNumber}
                                                            duration={config.countUpAnimationDuration}
                                                        />
                                                    </Typography>
                                                </Avatar>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container direction="column" justifyContent="center" alignItems="center">
                                            <Grid item sx={{ mb: 0.9 }}>
                                                <TeacherIcon height={26} width={25} fill="#fff" />
                                            </Grid>
                                            <Grid item>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        ...theme.typography.commonAvatar,
                                                        color: 'blue',
                                                        backgroundColor: theme.palette.secondary.light,
                                                        height: '2rem',
                                                        width: 'auto',
                                                        minWidth: '4rem',
                                                        pl: 1,
                                                        pr: 1
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '1.2rem',
                                                            fontWeight: 500,
                                                            color: 'blue'
                                                        }}
                                                    >
                                                        <CountUp
                                                            start={0}
                                                            end={teacherCount}
                                                            duration={config.countUpAnimationDuration}
                                                            formattingFn={formatNumber}
                                                        />
                                                    </Typography>
                                                </Avatar>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

SchoolCard.propTypes = {
    isLoading: PropTypes.bool,
    schoolName: PropTypes.string,
    studentCount: PropTypes.number,
    teacherCount: PropTypes.number,
    navigateTo: PropTypes.string,
    schoolId: PropTypes.string
};

export default SchoolCard;
