import { Accordion, AccordionSummary, AccordionDetails, ImageList, ImageListItem, Typography } from '@mui/material';
import ProjectCard from './ProjectCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import Header from 'ui-component/header';
import StudentTeacherLegends from 'ui-component/student-teacher-legends';
import { toast } from 'react-toastify';
import { getAllProjects, updateProjectStatus } from 'services/project-queries';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'store/selectors';

import ProgramHeadPrincipalHomeScreen from './program-head-principal-home';
import { roles } from 'constants/roles';
import TeacherStudentReports from 'views/teacher-student-reports';

const HomeScreen = () => {
    // Use the hook 'useCollectionData' to retrieve all projects
    const [projects, loading, error] = useCollectionData(getAllProjects());

    //If there's an error while retrieving the data, show an error message to the user
    if (error) {
        toast.error(error);
        return;
    }

    //Store projects based on their academic year in a new object: yearWiseProjects
    const yearWiseProjects = {};

    // Loop over all fetched projects and organize them based on their academic year
    if (!loading)
        projects.forEach((project) => {
            if (yearWiseProjects[project.project_academic_year]) {
                yearWiseProjects[project.project_academic_year].push(project);
            } else {
                yearWiseProjects[project.project_academic_year] = [project];
            }
        });

    //Function to set project status by calling the 'updateProjectStatus' function and passing in the project id and its new status
    const setProjectStatus = (id, status) => {
        //Call 'updateProjectStatus' function to update project status
        updateProjectStatus(id, status);
    };

    return (
        <div style={{ marginTop: '5px' }}>
            <Header showBackButton={false} title="Projects" rightComponent={<StudentTeacherLegends />} />
            {!loading &&
                Object.keys(yearWiseProjects).map((academicYear) => {
                    return (
                        <Accordion defaultExpanded={true} key={academicYear}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="2023" sx={{ mb: 0 }}>
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0 }}>
                                    ACADEMIC YEAR : {academicYear}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ImageList
                                    sx={{
                                        gridAutoFlow: 'column',
                                        gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr)) !important',
                                        gridAutoColumns: 'minmax(300px, 1fr) !important'
                                    }}
                                >
                                    {!loading &&
                                        yearWiseProjects[academicYear].map((item) => (
                                            <ImageListItem key={item.project_name} sx={{ mb: 1.25, mt: 0 }}>
                                                <ProjectCard
                                                    isLoading={loading}
                                                    projectId={item.project_id}
                                                    status={item.project_status}
                                                    projectName={item.project_name}
                                                    studentCount={Number(item.participating_students)}
                                                    teacherCount={Number(item.participating_teachers)}
                                                    updateProjectStatus={setProjectStatus}
                                                />
                                            </ImageListItem>
                                        ))}
                                </ImageList>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
        </div>
    );
};
// This functional component returns a different screen according to the user role.
const RoleWiseHomeScreen = () => {
    // Get the user object stored in the Redux store using useSelector.
    const user = useSelector(getCurrentUser);

    // If the role is ADMIN, return the HomeScreen component.
    if (user.dashboard_role === roles.ADMIN) {
        return <HomeScreen />;
    }

    // If the role is PROGRAM_HEAD, GUEST_PROGRAM_HEAD, PRINCIPAL, or GUEST_PRINCIPAL,
    // return the ProgramHeadPrincipalHomeScreen component.
    if ([roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD, roles.PRINCIPAL, roles.GUEST_PRINCIPAL].includes(user.dashboard_role)) {
        return <ProgramHeadPrincipalHomeScreen />;
    }

    // If the role is TEACHER or STUDENT, return the TeacherStudentReports component.
    if ([roles.TEACHER, roles.STUDENT].includes(user.dashboard_role)) {
        return <TeacherStudentReports />;
    }
};

// Export the RoleWiseHomeScreen component.
export default RoleWiseHomeScreen;
