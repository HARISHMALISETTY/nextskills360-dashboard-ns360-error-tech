import { useState, useEffect } from 'react';
import IconCard from 'ui-component/IconCard';
import LabelCountCard from 'ui-component/lableCountCard';
import TopThree from 'ui-component/topThree';
import Grid from '@mui/material/Grid';

// assets
import AddchartIcon from '@mui/icons-material/Addchart';
import { ReactComponent as PointsIcon } from 'assets/images/icons/points.svg';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { ReactComponent as TeacherIcon } from 'assets/images/icons/teacher.svg';
import { ReactComponent as ScansIcon } from 'assets/images/icons/scans.svg';

//import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';
import ClassTable from './class-table';
import { useTheme } from '@mui/material/styles';
import Header from 'ui-component/header';
//import Header from '../Header/index';
import { useNavigate, useParams } from 'react-router';
import { useReducer } from 'react';

import {
    getSchoolDataById,
    scansCountForSchool,
    pointsCount,
    topThreeStudents,
    topThreeTeachers,
    teachersUsedCount,
    teachersRegisteredCount,
    studentsUsedCount,
    studentsRegisteredCount,
    ClassWiseStudentTeacherCount
} from 'services/school-queries';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { initialData, reducer } from './reducer';
import { useSelector } from 'react-redux';
import { roles } from 'constants/roles';
import { getCurrentUser } from 'store/selectors';
import { getProjectDataById } from 'services/project-queries';
import { dataToExcel } from 'services/school-reports.js';

const SchoolDetails = () => {
    const { dashboard_role } = useSelector(getCurrentUser);
    const { schoolId, projectId } = useParams();
    const [schoolData, loading] = useDocumentData(getSchoolDataById(schoolId));
    const [projectData] = useDocumentData(getProjectDataById(projectId));

    const [data, dispatch] = useReducer(reducer, initialData);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    async function getScansCount() {
        const count = await scansCountForSchool(projectId, schoolId);

        dispatch({ type: 'updateCount', data: { scans: count } });
    }

    async function getPointsCount() {
        const count = await pointsCount(projectId, schoolId);
        dispatch({ type: 'updateCount', data: { points: count } });
    }

    // async function getAppSupportTicketsCount() {
    //     const count = await appSupportTicketsCount(projectId, schoolId);

    //     dispatch({ type: 'updateCount', data: { appSupportTickets: count } });
    // }

    // async function getWhatsappSupportTicketsCount() {
    //     const count = await whatsappSupportTicketsCount(projectId, schoolId);
    //     dispatch({ type: 'updateCount', data: { whatsappSupportTickets: count } });
    // }
    async function getStudentsRegisteredCount() {
        const count = await studentsRegisteredCount(projectId, schoolId);
        dispatch({ type: 'updateCount', data: { studentsRegistered: count } });
    }

    async function getStudentsUsedCount() {
        const count = await studentsUsedCount(projectId, schoolId);
        dispatch({ type: 'updateCount', data: { studentUsed: count } });
    }

    async function getTeachersRegisteredCount() {
        const count = await teachersRegisteredCount(projectId, schoolId);
        dispatch({ type: 'updateCount', data: { teachersRegistered: count } });
    }

    async function getTeachersUsedCount() {
        const count = await teachersUsedCount(projectId, schoolId);
        dispatch({ type: 'updateCount', data: { teachersUsed: count } });
    }

    async function getClassWiseTableData(studentsParticipated) {
        const data = await ClassWiseStudentTeacherCount(projectId, schoolId, studentsParticipated);
        dispatch({ type: 'updateCount', data: { classWiseData: data } });
    }

    async function getTopThreeStudents() {
        const topThree = await topThreeStudents(projectId, schoolId);

        if (Object.keys(topThree).length > 0) {
            dispatch({ type: 'updateCount', data: { topThreeStudents: topThree } });
        }
    }

    async function getTopThreeTeachers() {
        const topThree = await topThreeTeachers(projectId, schoolId);
        if (Object.keys(topThree).length > 0) {
            dispatch({ type: 'updateCount', data: { topThreeTeachers: topThree } });
        }
    }

    useEffect(() => {
        getScansCount();
        getPointsCount();
        // getAppSupportTicketsCount();
        // getWhatsappSupportTicketsCount();
        getStudentsRegisteredCount();
        getStudentsUsedCount();
        getTeachersRegisteredCount();
        getTeachersUsedCount();
        getTopThreeStudents();
        getTopThreeTeachers();
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
                leftComponent={
                    <AddchartIcon
                        onClick={() => navigate(`../../school-reports/${schoolData?.referral_code}`)}
                        stroke={1.5}
                        sx={{ fontSize: '1.8rem', color: theme.palette.primary.main, cursor: 'pointer' }}
                    />
                }
                rightComponent={
                    dashboard_role === roles.ADMIN ? (
                        <CloudDownloadIcon
                            stroke={1.5}
                            onClick={() => dataToExcel(schoolId, projectId, schoolData?.institution_name)}
                            sx={{ fontSize: '1.8rem', color: theme.palette.primary.main, cursor: 'pointer' }}
                        />
                    ) : null
                }
                downloadIcon={true}
            />
            <Grid container justifyContent="center">
                <Grid item>
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
                                        label={'Points'}
                                        customIcon={true}
                                        count={data?.points}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container justifyContent="center" spacing={4.7}>
                                <Grid item>
                                    <Grid container direction="column" justifyContent="center" sx={{ height: '100%' }}>
                                        {(dashboard_role === roles.ADMIN || projectData?.show_students_registered) && (
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
                                        {(dashboard_role === roles.ADMIN || projectData?.show_students_used) && (
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
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction="column" justifyContent="center" sx={{ height: '100%' }}>
                                        <Grid item sx={{ mb: 1.25 }}>
                                            <TopThree
                                                data={data.topThreeStudents}
                                                isLoading={isLoading}
                                                isStudentsRank
                                                label={'Top 3 Students'}
                                                count={50}
                                            />
                                        </Grid>
                                        <Grid item sx={{ mb: 1.25 }}>
                                            <TopThree
                                                data={data.topThreeTeachers}
                                                isLoading={isLoading}
                                                label={'Top 3 Teachers'}
                                                count={50}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid
                                        container
                                        direction={{ xs: 'column', sm: 'row', md: 'row', lg: 'column' }}
                                        columnSpacing={1}
                                        justifyContent="center"
                                        sx={{ height: '100%' }}
                                    >
                                        {(dashboard_role === roles.ADMIN || projectData?.show_teachers_registered) && (
                                            <Grid item sx={{ mb: 1.25 }}>
                                                <LabelCountCard
                                                    isLoading={isLoading}
                                                    Icon={TeacherIcon}
                                                    backgroundColor={theme.palette.primary.dark}
                                                    label={'Teachers Registered'}
                                                    count={data.teachersRegistered}
                                                    tooltip={'The number of teachers registered within our ProGame app'}
                                                />
                                            </Grid>
                                        )}
                                        {(dashboard_role === roles.ADMIN || projectData?.show_teachers_used) && (
                                            <Grid item sx={{ mb: 1.25 }}>
                                                <LabelCountCard
                                                    isLoading={isLoading}
                                                    Icon={TeacherIcon}
                                                    backgroundColor={theme.palette.primary.dark}
                                                    label={'Active Teachers'}
                                                    count={data.teachersUsed}
                                                    tooltip={
                                                        'Those teachers who completed a minimum number of coding activities and gained points'
                                                    }
                                                />
                                            </Grid>
                                        )}
                                        <Grid item sx={{ mb: 1.25 }}>
                                            <LabelCountCard
                                                isLoading={isLoading}
                                                Icon={TeacherIcon}
                                                backgroundColor={theme.palette.primary.dark}
                                                label={'Teachers Participated'}
                                                count={schoolData?.total_teachers}
                                                showCount={true}
                                                tooltip={'The number of teachers participated from this school'}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container justifyContent="center" columnSpacing={9.2} sx={{ height: '100%' }}>
                                        <Grid item sx={{ mb: 1.95 }}>
                                            <LabelCountCard
                                                isLoading={isLoading}
                                                backgroundColor={'#045F5F'}
                                                label={'Student Kits'}
                                                count={schoolData?.total_student_kits}
                                                showCount={true}
                                                height={90}
                                                showIcon={false}
                                                tooltip="The number of student kits distributed to students in this school."
                                            />
                                        </Grid>
                                        <Grid item sx={{ mb: 1.95 }}>
                                            <LabelCountCard
                                                isLoading={isLoading}
                                                backgroundColor={'#045F5F'}
                                                label={'Teacher Kits'}
                                                count={schoolData?.total_teacher_kits}
                                                showCount={true}
                                                showIcon={false}
                                                height={90}
                                                tooltip="The number of teacher kits distributed to teachers in this school."
                                            />
                                        </Grid>
                                        <Grid item sx={{ mb: 1.95 }}>
                                            <LabelCountCard
                                                isLoading={isLoading}
                                                backgroundColor={'#045F5F'}
                                                label={'Total Kits'}
                                                count={schoolData?.total_kits}
                                                showCount={true}
                                                showIcon={false}
                                                height={90}
                                                tooltip="The total number of student and teacher kits distributed in this school."
                                            />
                                        </Grid>
                                        <Grid item>
                                            <LabelCountCard
                                                isLoading={isLoading}
                                                backgroundColor={'#614051'}
                                                label={'Kit-Student Ratio'}
                                                ratio={`1 : ${schoolData?.students_per_kit}`}
                                                showCount={true}
                                                showIcon={false}
                                                height={90}
                                                tooltip="The number of students sharing a kit."
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {!loading && (
                                    <Grid
                                        item
                                        sx={{
                                            [theme.breakpoints.down('sm')]: {
                                                maxWidth: '300px'
                                            }
                                        }}
                                    >
                                        <ClassTable schoolId={schoolData?.referral_code} rowsData={data.classWiseData} />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default SchoolDetails;
