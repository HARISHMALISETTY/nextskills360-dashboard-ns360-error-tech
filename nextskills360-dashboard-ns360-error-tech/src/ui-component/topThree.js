import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Tooltip, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

import { ReactComponent as StudentIcon } from 'assets/images/icons/student.svg';
import { ReactComponent as TeacherIcon } from 'assets/images/icons/teacher.svg';
import CountUp from 'react-countup';
import { formatNumber } from 'utils/formatNumber';
import config from 'config';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    // maxWidth: 200,
    // maxHeight: 300,
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative'
    // '&:before': {
    //     content: '""',
    //     position: 'absolute',
    //     width: 210,
    //     height: 210,
    //     background: theme.palette.secondary[800],
    //     borderRadius: '50%',
    //     top: -180,
    //     right: -60,
    //     opacity: 0.5,
    //     [theme.breakpoints.down('sm')]: {
    //         top: -155,
    //         right: -70
    //     }
    // }
}));

const sampleData = {
    1: {
        name: 'Hanuman Singh',
        id: 1,
        points: ''
    },
    2: {
        name: 'Rakesh Kumar',
        id: 2,
        points: ''
    },
    3: {
        name: 'Ravi Kumar',
        id: 3,
        points: ''
    }
};

const TopThree = ({ isLoading, isStudentsRank, label = 'Top 3 ______', data = sampleData }) => {
    const theme = useTheme();
    const rankOrder = [2, 1, 3];
    const isSmallScreen = theme.breakpoints.down('sm');
    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column" alignItems="center" justifyContent="center">
                            <Grid item sx={{ mb: 1.45 }}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        color: theme.palette.warning.dark,
                                        textAlign: 'center'
                                    }}
                                >
                                    {label}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Grid
                                    container
                                    justifyContent={isSmallScreen ? 'space-evenly' : 'center'}
                                    alignItems="flex-end"
                                    rowSpacing={1}
                                >
                                    {rankOrder.map((item, index) => {
                                        return (
                                            <Grid
                                                item
                                                xs={isSmallScreen && item === 1 ? 12 : 4}
                                                sm={4}
                                                key={data[item]?.name || '' + index}
                                                sx={{
                                                    [isSmallScreen]: {
                                                        order: item === 1 ? 1 : 2
                                                    },
                                                    opacity: !data[item]?.points ? 0.4 : 1
                                                }}
                                            >
                                                <Grid
                                                    container
                                                    direction="column"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    spacing={1}
                                                >
                                                    <Grid
                                                        item
                                                        sx={{
                                                            height: '7.5vh',
                                                            display: 'flex',
                                                            direction: 'column',
                                                            alignItems: 'flex-end'
                                                        }}
                                                    >
                                                        <Typography
                                                            textAlign="center"
                                                            sx={{
                                                                fontSize: '1rem',
                                                                fontWeight: 500,
                                                                width: '6rem',
                                                                cursor: 'default',
                                                                whiteSpace: 'normal',
                                                                display: '-webkit-box',
                                                                WebkitBoxOrient: 'vertical',
                                                                WebkitLineClamp: 2,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            {data[item]?.name && data[item]?.name.length > 18 ? (
                                                                <Tooltip title={data[item]?.name}>
                                                                    <span>{data[item]?.name || ''}</span>
                                                                </Tooltip>
                                                            ) : (
                                                                <span>{data[item]?.name || ''}</span>
                                                            )}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Avatar
                                                            variant="rounded"
                                                            sx={{
                                                                ...theme.typography.commonAvatar,
                                                                color: theme.palette.secondary.light,
                                                                backgroundColor: theme.palette.secondary[800],
                                                                height: item === 1 ? '7rem' : '6rem',
                                                                width: item === 1 ? '6rem' : '5rem'
                                                            }}
                                                        >
                                                            {isStudentsRank ? (
                                                                <StudentIcon height={40} fill={theme.palette.secondary.light} />
                                                            ) : (
                                                                <TeacherIcon height={45} fill={theme.palette.secondary.light} />
                                                            )}

                                                            <Typography
                                                                sx={{
                                                                    fontSize: '1rem',
                                                                    fontWeight: 500,
                                                                    textAlign: 'center',
                                                                    position: 'absolute',
                                                                    mt: '90%'
                                                                }}
                                                            >
                                                                {item}
                                                            </Typography>
                                                        </Avatar>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography
                                                            sx={{
                                                                fontSize: '1.2rem',
                                                                fontWeight: 500,
                                                                textAlign: 'center'
                                                            }}
                                                        >
                                                            <CountUp
                                                                start={0}
                                                                end={data[item]?.points || ''}
                                                                duration={config.countUpAnimationDuration}
                                                                formattingFn={formatNumber}
                                                            />
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

TopThree.propTypes = {
    isLoading: PropTypes.bool,
    label: PropTypes.string,
    data: PropTypes.object,
    isStudentsRank: PropTypes.bool,
    points: PropTypes.number
};

export default TopThree;
