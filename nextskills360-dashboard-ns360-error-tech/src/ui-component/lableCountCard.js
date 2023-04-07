import PropTypes from 'prop-types';
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography, Tooltip } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import { ReactComponent as StudentIcon } from 'assets/images/icons/student.svg';
import { Info } from '@mui/icons-material';
import { formatNumber } from 'utils/formatNumber';
import CountUp from 'react-countup';
import config from 'config';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    maxWidth: 300,
    maxHeight: 300,
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

const LabelCountCard = ({
    isLoading,
    Icon = StudentIcon,
    backgroundColor,
    label = 'No of Schools',
    count = 25,
    showCount = true,
    showToolTip = true,
    tooltip,
    ratio,
    height = 130,
    width = 250,
    avaHeight = '2rem',
    avaWidth = '10rem',
    showIcon = true,
    show = true
}) => {
    const theme = useTheme();
    const opacity = showCount ? (count === 0 ? 0.4 : 1) : 1;
    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper
                    border={false}
                    content={false}
                    sx={{ backgroundColor: backgroundColor, height: '100%', opacity: `${opacity}` }}
                >
                    <Box sx={{ p: 1.25, width: width, height: height }}>
                        <Grid container direction="column" justifyContent="space-between">
                            <Grid item sx={{ mb: 1 }}>
                                <Grid container justifyContent="center" alignItems="center">
                                    {showIcon && <Icon height="40px" width="50px" fill="white" />}
                                </Grid>
                            </Grid>

                            <Grid item sx={{ mb: 1 }}>
                                <Grid container justifyContent="center" alignItems="center">
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            // color: theme.palette.secondary.light,
                                            backgroundColor: theme.palette.secondary.light,
                                            height: avaHeight,
                                            width: avaWidth
                                        }}
                                    >
                                        {ratio ? (
                                            ratio
                                        ) : showCount ? (
                                            <Typography
                                                sx={{
                                                    fontSize: '1.2rem',
                                                    fontWeight: 500,
                                                    lineHeight: '1.334em'
                                                }}
                                            >
                                                <CountUp
                                                    start={0}
                                                    end={count}
                                                    duration={config.countUpAnimationDuration}
                                                    formattingFn={formatNumber}
                                                />
                                            </Typography>
                                        ) : (
                                            ''
                                        )}
                                    </Avatar>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Grid container justifyContent="center" alignItems="center">
                                    <Grid item xs={10}>
                                        {show ? (
                                            <Typography
                                                sx={{
                                                    fontSize: '1rem',
                                                    // fontWeight: 500,
                                                    // // color: theme.palette.secondary[200],

                                                    fontWeight: 500
                                                }}
                                                textAlign="center"
                                            >
                                                {label}
                                                <sup>
                                                    {showToolTip ? (
                                                        <Tooltip title={tooltip}>
                                                            <Info sx={{ fontSize: '17px', cursor: 'pointer' }} />
                                                        </Tooltip>
                                                    ) : null}
                                                </sup>
                                            </Typography>
                                        ) : null}
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

LabelCountCard.propTypes = {
    isLoading: PropTypes.bool,
    label: PropTypes.string,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    backgroundColor: PropTypes.string,
    showCount: PropTypes.bool,
    Icon: PropTypes.object,
    tooltip: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    avaHeight: PropTypes.string,
    avaWidth: PropTypes.string,
    show: PropTypes.bool,
    showToolTip: PropTypes.bool,
    ratio: PropTypes.string,
    showIcon: PropTypes.bool
};

export default LabelCountCard;
