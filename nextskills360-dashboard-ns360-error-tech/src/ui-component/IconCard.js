import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Avatar, IconButton, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EditIcon from '@mui/icons-material/Edit';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useNavigate } from 'react-router';
import { formatNumber } from 'utils/formatNumber';
import CountUp from 'react-countup';
import config from 'config';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    maxWidth: 200,
    minWidth: 150,
    maxHeight: 300,
    width: 175,

    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        // background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

const IconCard = ({
    isLoading,
    showEditIcon = false,
    onEdit,
    Icon = ApartmentIcon,
    backgroundColor,
    label = 'No of Schools',
    count = 25,
    customIcon = false,
    navigateTo
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const opacity = count === 0 ? 0.4 : 1;
    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper
                    border={false}
                    content={false}
                    onClick={() => navigateTo && navigate(navigateTo)}
                    sx={{ backgroundColor: backgroundColor, cursor: navigateTo ? 'pointer' : '', opacity: `${opacity}` }}
                >
                    <Box sx={{ p: 2.25, width: 175, height: 190 }}>
                        <Grid
                            container
                            wrap="nowrap"
                            direction="column"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ height: '100%' }}
                        >
                            <Grid item>
                                <Grid container justifyContent="center" alignItems="center">
                                    {/* <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            color: color,
                                            // backgroundColor: color,
                                            height: '5rem',
                                            width: '5rem'
                                        }}
                                    > */}
                                    {customIcon ? (
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                color: theme.palette.secondary.light,
                                                backgroundColor: backgroundColor,
                                                height: '6rem',
                                                width: '8rem'
                                            }}
                                        >
                                            <Icon fill={theme.palette.secondary.light} />
                                        </Avatar>
                                    ) : (
                                        <Icon stroke={1.5} size="4rem" sx={{ fontSize: '5rem' }} />
                                    )}
                                    {/* </Avatar> */}
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container direction="column" justifyContent="center" alignItems="center">
                                    <Grid item sx={{ mr: showEditIcon ? -0.8 : 0 }}>
                                        <Grid container justifyContent="center" alignItems="center">
                                            <Grid item>
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
                                            </Grid>
                                            {showEditIcon && (
                                                <Grid item>
                                                    <IconButton onClick={onEdit}>
                                                        <EditIcon
                                                            sx={{
                                                                fontSize: '18px',
                                                                color: 'white',
                                                                cursor: 'pointer'
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container justifyContent="center" alignItems="center" spacing={2}>
                                            <Grid item>
                                                <Typography
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: 500,
                                                        // color: theme.palette.secondary[200],
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {label}
                                                </Typography>
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

IconCard.propTypes = {
    isLoading: PropTypes.bool,
    Icon: PropTypes.object,
    label: PropTypes.string,
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    navigateTo: PropTypes.string,
    backgroundColor: PropTypes.string,
    showEditIcon: PropTypes.bool,
    onEdit: PropTypes.func,
    customIcon: PropTypes.bool
};

export default IconCard;
