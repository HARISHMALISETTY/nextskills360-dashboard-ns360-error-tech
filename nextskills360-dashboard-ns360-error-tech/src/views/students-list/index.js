import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';

// assets
import StudentMarksCard from './student-marks-card';
import Header from 'ui-component/header';
import StudentTeacherLegends from 'ui-component/student-teacher-legends';
import { useParams } from 'react-router';
import { getStudentsPointsByClass } from 'services/class-queries';

const StudentsList = () => {
    const [isLoading, setLoading] = useState(true);
    const { projectId, schoolId, classId } = useParams();
    const [studentsPoints, setStudentsPoints] = useState([]);
    // const [studentsPoints, loading, error] = useCollectionData(getStudentsPoints(projectId, schoolId, classId));
    const getUsersPoints = async () => {
        const points = await getStudentsPointsByClass(projectId, schoolId, classId);
        setStudentsPoints(points);
    };

    useEffect(() => {
        getUsersPoints();
        setLoading(false);
    }, []);

    return (
        <>
            <Header title={`Class - ${classId}`} rightComponent={<StudentTeacherLegends hideTeacherLegend={true} />} />
            <Grid container justifyContent="center">
                <Grid
                    container
                    sx={{ mt: 1.25, mb: 1.25, width: '100%' }}
                    spacing={1}
                    maxWidth={900}
                    alignItems="stretch"
                    justifyContent="center"
                >
                    {studentsPoints &&
                        studentsPoints.map((student, index) => (
                            <Grid item key={index}>
                                <StudentMarksCard name={student.user_name} count={student?.alltime_points || 0} isLoading={isLoading} />
                            </Grid>
                        ))}
                </Grid>
            </Grid>
        </>
    );
};

export default StudentsList;
