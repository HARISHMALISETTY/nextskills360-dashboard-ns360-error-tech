import { useState, useEffect } from 'react';
import IconCard from 'ui-component/IconCard';
import LabelCountCard from 'ui-component/lableCountCard';
import TopThree from 'ui-component/topThree';
import Grid from '@mui/material/Grid';
import PerfectScrollbar from 'react-perfect-scrollbar';

// assets
import AddchartIcon from '@mui/icons-material/Addchart';
import { ReactComponent as PointsIcon } from 'assets/images/icons/points.svg';
import { ReactComponent as ScansIcon } from 'assets/images/icons/scans.svg';

//import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';
import ClassTable from './class-table';
import { useTheme } from '@mui/material/styles';
import Header from 'ui-component/header';
//import Header from '../Header/index';
import { useNavigate } from 'react-router';
import { useReducer } from 'react';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { initialData, reducer } from './reducer';
import { useSelector } from 'react-redux';
import { roles } from 'constants/roles';
import { getCurrentUser } from 'store/selectors';
import { getProjectDataById } from 'services/project-queries';
import {
    ClassWiseStudentTeacherCount,
    pointsCount,
    studentsRegisteredCount,
    studentsUsedCount,
    topThreeStudents
} from 'services/teacher-student-reports';
import { getSchoolDataById } from 'services/school-queries';

const TeacherReports = () => {
    const {
        dashboard_role,
        project_id: projectId,
        referral_code: schoolId,
        child_class: childClass,
        online_scans_occurred,
        offline_scans_occurred,
        user_uid
    } = useSelector(getCurrentUser);
    // const { schoolId, projectId } = useParams();
    const [schoolData, loading] = useDocumentData(getSchoolDataById(schoolId));
    const [projectData] = useDocumentData(getProjectDataById(projectId));

    const [data, dispatch] = useReducer(reducer, initialData);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    const theme = useTheme();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth) {
            }
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const isMobileView = windowWidth <= 330;

    async function getScansCount() {
        const count = online_scans_occurred + offline_scans_occurred;

        dispatch({ type: 'updateCount', data: { scans: count } });
    }

    async function getPointsCount() {
        const count = await pointsCount(user_uid);
        dispatch({ type: 'updateCount', data: { points: count } });
    }

    async function getStudentsRegisteredCount() {
        const count = await studentsRegisteredCount(projectId, schoolId, childClass);
        dispatch({ type: 'updateCount', data: { studentsRegistered: count } });
    }

    async function getStudentsUsedCount() {
        const count = await studentsUsedCount(projectId, schoolId, childClass);
        dispatch({ type: 'updateCount', data: { studentUsed: count } });
    }

    async function getClassWiseTableData() {
        const studentsParticipated = { [childClass.split(' ')[1]]: schoolData?.classes_students[childClass.split(' ')[1]] };
        const data = await ClassWiseStudentTeacherCount(projectId, schoolId, studentsParticipated);
        dispatch({ type: 'updateCount', data: { classWiseData: data } });
    }

    async function getTopThreeStudents() {
        const topThree = await topThreeStudents(projectId, schoolId, childClass);

        if (Object.keys(topThree).length > 0) {
            dispatch({ type: 'updateCount', data: { topThreeStudents: topThree } });
        }
    }

    useEffect(() => {
        getScansCount();
        getPointsCount();
        getStudentsRegisteredCount();
        getStudentsUsedCount();
        getTopThreeStudents();
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            getClassWiseTableData(schoolData?.classes_students, schoolData?.classes_students);
        }
    }, [loading]);

    return (
        <>
            <Header
                title={`${schoolData?.institution_name || ''}`}
                subTitle={`${projectData?.project_name || ''}`}
                leftComponent={
                    <AddchartIcon
                        onClick={() => navigate(`class-reports/${childClass.split(' ')[1]}`)}
                        stroke={1.5}
                        sx={{ fontSize: '1.8rem', color: theme.palette.primary.main, cursor: 'pointer' }}
                    />
                }
                showBackButton={false}
            />
            <Grid container justifyContent="center">
                <Grid container direction="column" sx={{ maxWidth: 900 }}>
                    <Grid item>
                        <Grid container justifyContent="center" spacing={1} sx={{ mt: 1.25 }}>
                            <Grid
                                item
                                sx={{
                                    mb: 1.25
                                }}
                            >
                                <IconCard
                                    isLoading={isLoading}
                                    backgroundColor={theme.palette.miscellaneous.scans}
                                    Icon={ScansIcon}
                                    label={'Scans'}
                                    customIcon={true}
                                    count={data?.scans}
                                />
                            </Grid>
                            <Grid
                                item
                                sx={{
                                    mb: 1.25
                                }}
                            >
                                <IconCard
                                    isLoading={isLoading}
                                    backgroundColor={theme.palette.miscellaneous.points}
                                    color={theme.palette.warning.light}
                                    Icon={PointsIcon}
                                    customIcon={true}
                                    label={'Points'}
                                    count={data?.points}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container justifyContent="center" spacing={1}>
                            <Grid item>
                                <Grid container direction="column" sx={{ mt: 1.25, height: '100%' }}>
                                    <Grid item sx={{ mb: 1.25 }}>
                                        <LabelCountCard
                                            isLoading={isLoading}
                                            backgroundColor={theme.palette.error.main}
                                            label={'Students Participated'}
                                            count={schoolData?.total_students}
                                            showCount={true}
                                            tooltip={'The number of students participated from this school'}
                                        />
                                    </Grid>
                                    {roles.TEACHER === dashboard_role && (
                                        <>
                                            {projectData?.show_students_registered && (
                                                <Grid item sx={{ mb: 1.25 }}>
                                                    <LabelCountCard
                                                        isLoading={isLoading}
                                                        backgroundColor={theme.palette.error.main}
                                                        label={'Students Registered'}
                                                        count={data.studentsRegistered}
                                                        tooltip={'The number of students registered within our ProGame app'}
                                                    />
                                                </Grid>
                                            )}
                                            {projectData?.show_students_used && (
                                                <Grid item sx={{ mb: 1.25 }}>
                                                    <LabelCountCard
                                                        isLoading={isLoading}
                                                        label={'Active Students'}
                                                        backgroundColor={theme.palette.error.main}
                                                        count={data.studentUsed}
                                                        tooltip={
                                                            'Those students who completed a minimum number of coding activities and gained points'
                                                        }
                                                    />
                                                </Grid>
                                            )}
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container direction="column" spacing={1} sx={{ mt: 1.25, height: '100%' }}>
                                    <Grid item sx={{ mb: 1.25 }}>
                                        <TopThree
                                            data={data.topThreeStudents}
                                            isLoading={isLoading}
                                            isStudentsRank
                                            label={`Top 3 Students from ${childClass}`}
                                            count={50}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>{' '}
                            {!loading && (
                                <Grid
                                    item
                                    sx={{
                                        mt: 0
                                    }}
                                >
                                    {!isMobileView ? (
                                        <Grid item>
                                            <ClassTable schoolId={schoolData?.referral_code} rowsData={data.classWiseData} />
                                        </Grid>
                                    ) : (
                                        <PerfectScrollbar
                                            component="div"
                                            options={{ suppressScrollX: false, suppressScrollY: true }}
                                            style={{ width: '260px', maxWidth: '280px' }}
                                        >
                                            <ClassTable schoolId={schoolData?.referral_code} rowsData={data.classWiseData} />
                                        </PerfectScrollbar>
                                    )}
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default TeacherReports;
