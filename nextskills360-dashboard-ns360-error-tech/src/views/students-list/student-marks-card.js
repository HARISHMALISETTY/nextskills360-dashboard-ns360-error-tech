import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Tooltip, Typography } from '@mui/material';

import { ReactComponent as StudentIcon } from 'assets/images/icons/student.svg';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import { upperCaseEachFirstLetterInText } from 'utils/formatFieldName';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    width: 230,
    maxHeight: 80,
    height: 'auto',
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative'
}));

const StudentsList = ({ isLoading, name = 'Hanuman Singh', count = 0 }) => {
    const theme = useTheme();
    const userName = upperCaseEachFirstLetterInText(name);
    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container alignItems="center" justifyContent="center" spacing={1}>
                            <Grid item xs={3}>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        ...theme.typography.commonAvatar,
                                        color: theme.palette.secondary[200],
                                        backgroundColor: theme.palette.error.light
                                    }}
                                >
                                    <StudentIcon height={30} fill={theme.palette.error.dark} />
                                </Avatar>
                            </Grid>
                            <Grid item xs={9}>
                                <Grid container direction="column" justifyContent="center">
                                    <Grid item>
                                        <Typography
                                            sx={{
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                cursor: 'default',
                                                whiteSpace: 'normal',
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {userName.length > 14 ? (
                                                <Tooltip title={userName}>
                                                    <span>{userName || ''}</span>
                                                </Tooltip>
                                            ) : (
                                                <span>{userName || ''}</span>
                                            )}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            sx={{
                                                fontSize: '1rem',
                                                fontWeight: 500
                                            }}
                                        >
                                            {count}
                                        </Typography>
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

StudentsList.propTypes = {
    isLoading: PropTypes.bool,
    name: PropTypes.string,
    count: PropTypes.number
};

export default StudentsList;
