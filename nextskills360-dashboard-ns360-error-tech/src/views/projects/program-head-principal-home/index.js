import { Accordion, AccordionSummary, AccordionDetails, ImageList, ImageListItem, Typography } from '@mui/material';
import ProjectCard from './projectCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import Header from 'ui-component/header';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAllProjectsUserAssigned } from 'services/users';
import { getCurrentUser } from 'store/selectors';

const HomeScreen = () => {
    const currentUser = useSelector(getCurrentUser);

    const [projects, loading, error] = useCollectionData(getAllProjectsUserAssigned(currentUser.mobile_number));

    if (error) {
        toast.error(error.toString());
        return;
    }
    const yearWiseProjects = {};

    if (!loading)
        projects.forEach((project) => {
            if (yearWiseProjects[project.project_academic_year]) {
                yearWiseProjects[project.project_academic_year].push(project);
            } else {
                yearWiseProjects[project.project_academic_year] = [project];
            }
        });

    return (
        <div style={{ marginTop: '5px' }}>
            <Header showBackButton={false} title="Projects" />
            {!loading &&
                Object.keys(yearWiseProjects).map((academicYear) => {
                    return (
                        <Accordion defaultExpanded={true} key={academicYear}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="2023" sx={{ mb: 0 }}>
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 500, mr: 1, mt: 1.75 }}>
                                    ACADEMIC YEAR : {academicYear}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ImageList
                                    sx={{
                                        gridAutoFlow: 'column',
                                        gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr)) !important',
                                        gridAutoColumns: 'minmax(300px, 1fr) !important',
                                        mt: 0
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
                                                    referralCode={item?.referral_code}
                                                    schoolName={item?.institution_name}
                                                    role={currentUser.dashboard_role}
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

export default HomeScreen;
