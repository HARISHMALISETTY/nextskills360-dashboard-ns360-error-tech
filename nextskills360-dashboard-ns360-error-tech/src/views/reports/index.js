import { useState, useEffect } from 'react';
import IconCard from '../../ui-component/IconCard';
import Grid from '@mui/material/Grid';

// assets
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AddchartIcon from '@mui/icons-material/Addchart';
import { ReactComponent as StudentIcon } from 'assets/images/icons/student.svg';
import { ReactComponent as TeacherIcon } from 'assets/images/icons/teacher.svg';
import { ReactComponent as PointsIcon } from 'assets/images/icons/points.svg';
import { ReactComponent as ScansIcon } from 'assets/images/icons/scans.svg';

import LabelCountCard from '../../ui-component/lableCountCard';
import TopThree from '../../ui-component/topThree';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useTheme } from '@mui/material/styles';
import Header from 'ui-component/header';
import StudentTeacherLegends from 'ui-component/student-teacher-legends';
import { useParams } from 'react-router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getProjectDataById } from 'services/project-queries';
import { useReducer } from 'react';
import { initialData, reducer } from './reducer';
import {
    appSupportTicketsCount,
    pointsCount,
    scansCount,
    schoolsCount,
    studentsRegisteredCount,
    studentsUsedCount,
    teachersRegisteredCount,
    teachersUsedCount,
    topThreeStudents,
    topThreeTeachers
    // whatsappSupportTicketsCount
} from 'services/reports';
import AverageChartModal from './aveargeChartModal';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'store/selectors';
import { roles } from 'constants/roles';
import { UpdateWhatsappCount } from './updateWhatsappCount';

const ReportsScreen = () => {
    const { dashboard_role } = useSelector(getCurrentUser);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const { projectId } = useParams();
    const [data, dispatch] = useReducer(reducer, initialData);
    const [projectData, loading] = useDocumentData(getProjectDataById(projectId));
    const [openWhatsappModal, setOpenWhatsappModal] = useState(false);

    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);

    const [isLoading, setLoading] = useState(true);

    async function getSchoolsCount() {
        const count = await schoolsCount(projectId);
        dispatch({ type: 'updateCount', data: { schools: count } });
    }

    async function getScansCount() {
        const count = await scansCount(projectId);
        dispatch({ type: 'updateCount', data: { scans: count } });
    }

    async function getPointsCount() {
        const count = await pointsCount(projectId);
        dispatch({ type: 'updateCount', data: { points: count } });
    }

    async function getAppSupportTicketsCount() {
        const count = await appSupportTicketsCount(projectId);
        dispatch({ type: 'updateCount', data: { appSupportTickets: count } });
    }

    // async function getWhatsappSupportTicketsCount() {
    //     const count = await whatsappSupportTicketsCount(projectId);
    //     dispatch({ type: 'updateCount', data: { whatsappSupportTickets: count } });
    // }

    async function getStudentsRegisteredCount() {
        const count = await studentsRegisteredCount(projectId);
        dispatch({ type: 'updateCount', data: { studentsRegistered: count } });
    }

    async function getStudentsUsedCount() {
        const count = await studentsUsedCount(projectId);
        dispatch({ type: 'updateCount', data: { studentUsed: count } });
    }

    async function getTeachersRegisteredCount() {
        const count = await teachersRegisteredCount(projectId);
        dispatch({ type: 'updateCount', data: { teachersRegistered: count } });
    }

    async function getTeachersUsedCount() {
        const count = await teachersUsedCount(projectId);
        dispatch({ type: 'updateCount', data: { teachersUsed: count } });
    }

    async function getTopThreeStudents() {
        const topThree = await topThreeStudents(projectId);
        if (Object.keys(topThree).length > 0) {
            dispatch({ type: 'updateCount', data: { topThreeStudents: topThree } });
        }
    }

    async function getTopThreeTeachers() {
        const topThree = await topThreeTeachers(projectId);
        if (Object.keys(topThree).length > 0) {
            dispatch({ type: 'updateCount', data: { topThreeTeachers: topThree } });
        }
    }

    useEffect(() => {
        setLoading(false);
        getSchoolsCount();
        getScansCount();
        getPointsCount();
        getAppSupportTicketsCount();
        // getWhatsappSupportTicketsCount();
        getStudentsRegisteredCount();
        getStudentsUsedCount();
        getTeachersRegisteredCount();
        getTeachersUsedCount();
        getTopThreeStudents();
        getTopThreeTeachers();
    }, []);

    return (
        !loading && (
            <>
                <Header
                    title={`${projectData?.project_name || ''}`}
                    leftComponent={
                        <>
                            <AddchartIcon
                                onClick={handleModalOpen}
                                stroke={1.5}
                                sx={{ fontSize: '1.8rem', color: theme.palette.primary.main, cursor: 'pointer' }}
                            />
                        </>
                    }
                    rightComponent={<StudentTeacherLegends />}
                />
                <Grid container justifyContent="center">
                    <Grid container direction="column" sx={{ maxWidth: 900 }}>
                        <Grid item>
                            <Grid container justifyContent="center" spacing={0.7} sx={{ mt: 1.25 }}>
                                <Grid item sx={{ mb: 1.25 }}>
                                    <IconCard
                                        isLoading={isLoading}
                                        backgroundColor={theme.palette.warning.dark}
                                        Icon={AccountBalanceIcon}
                                        label={'Schools'}
                                        navigateTo={data.schools > 0 ? `/reports/${projectId}/participated-schools/${data.schools}` : ''}
                                        count={data.schools}
                                    />
                                </Grid>
                                <Grid item sx={{ mb: 1.25 }}>
                                    <IconCard
                                        isLoading={isLoading}
                                        backgroundColor={theme.palette.miscellaneous.scans}
                                        Icon={ScansIcon}
                                        customIcon={true}
                                        label={'Scans'}
                                        count={data.scans}
                                    />
                                </Grid>
                                <Grid item sx={{ mb: 1.25 }}>
                                    <IconCard
                                        isLoading={isLoading}
                                        backgroundColor={theme.palette.miscellaneous.points}
                                        color={theme.palette.warning.light}
                                        Icon={PointsIcon}
                                        customIcon={true}
                                        label={'Points'}
                                        count={data.points}
                                    />
                                </Grid>
                                <Grid item sx={{ mb: 1.25 }}>
                                    <IconCard
                                        isLoading={isLoading}
                                        backgroundColor="#FF69B4"
                                        color={theme.palette.warning.light}
                                        Icon={ConfirmationNumberIcon}
                                        label={'App Support Tickets'}
                                        count={data.appSupportTickets}
                                    />
                                </Grid>
                                <Grid item sx={{ mb: 1.25 }}>
                                    <IconCard
                                        isLoading={isLoading}
                                        backgroundColor={theme.palette.miscellaneous.whatsAppSupportTickets}
                                        color={theme.palette.warning.light}
                                        Icon={WhatsAppIcon}
                                        showEditIcon={dashboard_role === roles.ADMIN}
                                        onEdit={() => setOpenWhatsappModal(true)}
                                        label={'WhatsApp Support Tickets'}
                                        count={projectData?.whatsapp_support_requests_count || 0}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container justifyContent="center" spacing={4.7}>
                                <Grid item>
                                    <Grid container direction="column" justifyContent="center" sx={{ mt: 1.25, height: '100%' }}>
                                        {(dashboard_role === roles.ADMIN || projectData?.show_students_registered) && (
                                            <Grid item sx={{ mb: 1.25 }}>
                                                <LabelCountCard
                                                    isLoading={isLoading}
                                                    Icon={StudentIcon}
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
                                                    Icon={StudentIcon}
                                                    backgroundColor={theme.palette.error.main}
                                                    label={'Active Students'}
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
                                                Icon={StudentIcon}
                                                backgroundColor={theme.palette.error.main}
                                                label={'Students Participated'}
                                                showCount={true}
                                                count={projectData?.participating_students}
                                                tooltip={'The number of students participated in this project'}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction="column" justifyContent="center" sx={{ mt: 1, height: '100%' }}>
                                        <Grid item sx={{ mb: 1.25 }}>
                                            <TopThree
                                                isLoading={isLoading}
                                                data={data.topThreeStudents}
                                                isStudentsRank={true}
                                                label={'Top 3 Students'}
                                            />
                                        </Grid>
                                        <Grid item sx={{ mb: 1.25 }}>
                                            <TopThree
                                                isLoading={isLoading}
                                                Icon={ConfirmationNumberIcon}
                                                data={data.topThreeTeachers}
                                                label={'Top 3 Teachers'}
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
                                        sx={{ mt: 1.25, height: '100%' }}
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
                                                count={projectData?.participating_teachers}
                                                showCount={true}
                                                tooltip={'The number of teachers participated in this project'}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container justifyContent="center" columnSpacing={9.2} sx={{ mt: 1.25, height: '100%' }}>
                                <Grid item sx={{ mb: 1.95 }}>
                                    <LabelCountCard
                                        isLoading={isLoading}
                                        backgroundColor={'#045F5F'}
                                        label={'Student Kits'}
                                        count={projectData?.total_student_kits}
                                        showCount={true}
                                        height={90}
                                        showIcon={false}
                                        tooltip="The number of student kits distributed to students in this project."
                                    />
                                </Grid>
                                <Grid item sx={{ mb: 1.95 }}>
                                    <LabelCountCard
                                        isLoading={isLoading}
                                        backgroundColor={'#045F5F'}
                                        label={'Teacher Kits'}
                                        count={projectData?.total_teacher_kits}
                                        showCount={true}
                                        showIcon={false}
                                        height={90}
                                        tooltip="The number of teacher kits distributed to teachers in this project."
                                    />
                                </Grid>
                                <Grid item sx={{ mb: 1.95 }}>
                                    <LabelCountCard
                                        isLoading={isLoading}
                                        backgroundColor={'#045F5F'}
                                        label={'Total Kits'}
                                        count={projectData?.number_of_kits_distributed}
                                        showCount={true}
                                        showIcon={false}
                                        height={90}
                                        tooltip="The total number of student and teacher kits distributed in this project."
                                    />
                                </Grid>
                                <Grid item sx={{ mb: 1.95 }}>
                                    <LabelCountCard
                                        isLoading={isLoading}
                                        backgroundColor={'#614051'}
                                        label={'Kit-Student Ratio'}
                                        ratio={`1 : ${projectData?.students_per_kit || ''}`}
                                        showCount={true}
                                        showIcon={false}
                                        height={90}
                                        tooltip="The number of students sharing a kit."
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {open && (
                    <AverageChartModal
                        projectId={projectId}
                        projectName={projectData.project_name}
                        open={open}
                        handleModalClose={handleModalClose}
                    />
                )}

                {openWhatsappModal && (
                    <UpdateWhatsappCount
                        defaultCount={projectData?.whatsapp_support_requests_count || 0}
                        open={openWhatsappModal}
                        projectId={projectId}
                        handleClose={setOpenWhatsappModal}
                    />
                )}
            </>
        )
    );
};

export default ReportsScreen;
