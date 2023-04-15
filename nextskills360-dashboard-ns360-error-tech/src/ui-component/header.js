import PropTypes from 'prop-types';

// material-ui
import { Card, Grid, Typography } from '@mui/material';
// assets
import { useNavigate } from 'react-router';

const Header = ({ title, subTitle = '', leftComponent, rightComponent, downloadIcon = false }) => {
    const navigate = useNavigate();

    return (
        <>
            <Card sx={{ p: 1, mt: 1, mb: 1 }}>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item sx={{ width: '100%', maxWidth: '900px' }}>
                        <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
                            <Grid item xs={6} lg={2}></Grid>
                            <Grid item xs={6} lg={1}>
                                <Grid container justifyContent={{ sm: 'flex-end', xs: 'flex-end', lg: 'flex-start' }} alignItems="center">
                                    <Grid item>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {leftComponent}
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Typography sx={{ textAlign: 'center' }} variant="h3">
                                    {title}
                                </Typography>
                                <Typography sx={{ color: 'gray' }} textAlign="center" variant="h4">
                                    {subTitle}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} lg={3}>
                                <Grid container justifyContent={{ xs: downloadIcon ? 'flex-end' : 'center', lg: 'flex-end' }}>
                                    <Grid item>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {rightComponent}
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </>
    );
};

Header.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    leftComponent: PropTypes.node,
    rightComponent: PropTypes.node,
    downloadIcon: PropTypes.bool
};

Header.defaultProps = {
    title: 'Title',
    leftComponent: <div></div>,
    rightComponent: <div></div>
};

export default Header;
