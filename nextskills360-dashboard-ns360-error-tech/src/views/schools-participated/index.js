import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';

// assets
import SchoolCard from './schoolCard';

import { useParams } from 'react-router';
import Header from 'ui-component/header';
import StudentTeacherLegends from 'ui-component/student-teacher-legends';
import { getSchoolsPaginated } from 'services/school-queries';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRef } from 'react';
import { getProjectDataById } from 'services/project-queries';
import { useDocumentData } from 'react-firebase-hooks/firestore';
const ParticipatedSchools = () => {
    const { projectId, schoolsCount } = useParams();
    const [projectData] = useDocumentData(getProjectDataById(projectId));
    const [isLoading, setLoading] = useState(true);
    const [schools, setSchools] = useState([]);

    const [hasMore, setHasMore] = useState(true);

    const lastDocRef = useRef();

    const getSchools = async (isFirstPage = false, limit = 15) => {
        const [data, ref] = await getSchoolsPaginated(projectId, isFirstPage, lastDocRef.current, limit);
        lastDocRef.current = ref;
        setSchools((prev) => [...prev, ...data]);
    };

    useEffect(() => {
        setLoading(false);
        getSchools(true, 30);
    }, []);

    useEffect(() => {
        setHasMore(schools.length !== Number(schoolsCount));
    }, [schools.length, schoolsCount]);

    return (
        <div style={{ height: '100%' }}>
            <Header
                subTitle="Schools Participated"
                title={`${projectData?.project_name || ''}`}
                rightComponent={<StudentTeacherLegends />}
            />

            <InfiniteScroll
                dataLength={schools.length}
                next={getSchools}
                hasMore={hasMore}
                loader={
                    <p style={{ textAlign: 'center' }}>
                        <b>Loading...</b>
                    </p>
                }
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <Grid
                            container
                            wrap="wrap"
                            sx={{ mt: 1.25, mb: 1.25 }}
                            justifyContent="center"
                            alignItems="stretch"
                            spacing={1}
                            maxWidth={900}
                        >
                            {schools.map((school) => (
                                <Grid key={school.referral_code} item>
                                    <SchoolCard
                                        isLoading={isLoading}
                                        schoolName={school.institution_name}
                                        studentCount={school.total_students}
                                        schoolId={school.referral_code}
                                        teacherCount={school.total_teachers}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </InfiniteScroll>
        </div>
    );
};

export default ParticipatedSchools;
