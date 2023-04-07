// In this code, we are importing some dependencies for our React component.
import PropTypes from 'prop-types';
import { Grid, Switch, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

// Here is a functional component called ReportsCountStatus that takes two props: projectData and updateShowCountStatus.
export const ReportsCountStatus = ({ projectData, updateShowCountStatus }) => {
    // This function returns the JSX, which consists of a MainCard component with some Grid components inside it that contain a Typography & a Switch components each.
    return (
        <MainCard title="UI Settings" sx={{ mb: 1.25 }}>
            <Grid container>
                {/* This grid component contains count status of teachers usage */}
                <Grid item xs={12} sm={6}>
                    <Grid item container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle1">No of Teachers used</Typography>
                        </Grid>
                        <Grid item>
                            <Switch
                                color="secondary"
                                checked={projectData?.show_teachers_used || false}
                                onChange={(e) => updateShowCountStatus('show_teachers_used', e.target.checked)}
                                name="teacherUsage"
                            />
                        </Grid>
                    </Grid>
                </Grid>
                {/* This grid component contains count status of teachers registered */}
                <Grid item xs={12} sm={6}>
                    <Grid item container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle1">No of Teachers registered</Typography>
                        </Grid>
                        <Grid item>
                            <Switch
                                color="secondary"
                                checked={projectData?.show_teachers_registered || false}
                                onChange={(e) => updateShowCountStatus('show_teachers_registered', e.target.checked)}
                                name="teacherRegister"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container>
                {/* This grid component contains count status of students usage */}
                <Grid item xs={12} sm={6}>
                    <Grid item container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle1">No of Students used</Typography>
                        </Grid>
                        <Grid item>
                            <Switch
                                color="secondary"
                                checked={projectData?.show_students_used || false}
                                onChange={(e) => updateShowCountStatus('show_students_used', e.target.checked)}
                                name="studentUsage"
                            />
                        </Grid>
                    </Grid>
                </Grid>
                {/* This grid component contains count status of students registered */}
                <Grid item xs={12} sm={6}>
                    <Grid item container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle1">No of Students registered</Typography>
                        </Grid>
                        <Grid item>
                            <Switch
                                color="secondary"
                                checked={projectData?.show_students_registered || false}
                                onChange={(e) => updateShowCountStatus('show_students_registered', e.target.checked)}
                                name="studentRegister"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
};

// propTypes declaration for type checking of our props.
ReportsCountStatus.propTypes = {
    updateShowCountStatus: PropTypes.func,
    projectData: PropTypes.object
};
