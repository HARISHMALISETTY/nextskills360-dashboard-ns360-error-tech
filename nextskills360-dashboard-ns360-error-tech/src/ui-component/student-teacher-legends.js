import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { ReactComponent as StudentIcon } from 'assets/images/icons/student.svg';
import { ReactComponent as TeacherIcon } from 'assets/images/icons/teacher.svg';

const StudentTeacherLegends = ({ hideTeacherLegend, hideStudentLegend }) => {
    const theme = useTheme();
    return (
        <Grid container alignItems="center" spacing={1}>
            <Grid item>
                {!hideStudentLegend && (
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <StudentIcon height={20} width={20} fill={theme.palette.grey[600]} />
                            </div>
                        </Grid>
                        <Grid item>
                            <Typography sx={{ mt: 0.5 }}>Student</Typography>
                        </Grid>
                    </Grid>
                )}
            </Grid>
            <Grid item>
                {!hideTeacherLegend && (
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <TeacherIcon style={{ marginTop: '8px' }} height={24} width={25} fill={theme.palette.grey[600]} />
                            </div>
                        </Grid>
                        <Grid item>
                            <Typography sx={{ mt: 0.5 }}>Teacher</Typography>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
};

StudentTeacherLegends.propTypes = {
    hideStudentLegend: PropTypes.bool,
    hideTeacherLegend: PropTypes.bool
};
StudentTeacherLegends.defaultProps = {
    hideStudentLegend: false,
    hideTeacherLegend: false
};

export default StudentTeacherLegends;
