import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';

// assets
import TeacherPointCard from './teacher-points-card';
import Header from 'ui-component/header';
import StudentTeacherLegends from 'ui-component/student-teacher-legends';
import { useParams } from 'react-router';
import { getTeachersPointsByClass } from 'services/class-queries';

const TeachersList = () => {
    const [isLoading, setLoading] = useState(true);
    const { projectId, schoolId, classId } = useParams();

    const [teachersPoints, setTeachersPoints] = useState([]);
    // const [studentsPoints, loading, error] = useCollectionData(getStudentsPoints(projectId, schoolId, classId));
    const getUsersPoints = async () => {
        const points = await getTeachersPointsByClass(projectId, schoolId, classId);
        setTeachersPoints(points);
    };

    useEffect(() => {
        getUsersPoints();
        setLoading(false);
    }, []);

    return (
        <>
            <Header title={`Class - ${classId}`} rightComponent={<StudentTeacherLegends hideStudentLegend={true} />} />
            <Grid container justifyContent="center">
                <Grid container sx={{ mt: 1.25, mb: 1.25 }} spacing={1} maxWidth={900} justifyContent="center">
                    {teachersPoints &&
                        teachersPoints.map((teacher, index) => (
                            <Grid item key={index}>
                                <TeacherPointCard name={teacher.user_name} count={teacher?.alltime_points || 0} isLoading={isLoading} />
                            </Grid>
                        ))}
                </Grid>
            </Grid>
        </>
    );
};

export default TeachersList;
