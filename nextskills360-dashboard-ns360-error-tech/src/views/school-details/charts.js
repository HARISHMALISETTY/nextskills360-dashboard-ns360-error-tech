import { useState, useEffect } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useNavigate, useParams } from 'react-router';
import { getClassMarks, getSchoolAverageChartMarks, getSchoolDataById } from 'services/school-queries';
import ClassWiseCharts from 'views/charts/class-wise-charts';
import SchoolAverageCharts from 'views/charts/school-average-charts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Third Party
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRef } from 'react';

const initialData = {
    schoolAverageData: [0, 0],
    schoolPercentageIncreased: [0],
    classesChartData: []
};

const SchoolCharts = () => {
    const { projectId, schoolId } = useParams();
    const navigate = useNavigate();
    const [schoolData, loading] = useDocumentData(getSchoolDataById(schoolId));
    const classesList = Object.keys(schoolData?.classes_students || {}).sort((a, b) => a - b);
    const classDataRef = useRef(0);
    const [chartData, setChartData] = useState(initialData);

    const getClassData = () => {
        if (loading) {
            return;
        }
        const nextClassId = Number(classesList[classDataRef.current]);
        getClassMarks(projectId, schoolId, nextClassId).then((res) => {
            classDataRef.current++;
            setChartData((prev) => ({ ...prev, classesChartData: [...prev.classesChartData, res] }));
        });
    };

    useEffect(() => {
        getSchoolAverageChartMarks(projectId, schoolId).then((res) => {
            setChartData((prev) => ({ ...prev, schoolAverageData: res.averageMarks, schoolPercentageIncreased: res.percentageIncreased }));
        });

        if (classesList) {
            getClassData();
        }
    }, [classesList.length]);

    return (
        <>
            <button
                style={{
                    borderColor: 'transparent',
                    cursor: 'pointer',
                    backgroundColor: 'orange',
                    borderRadius: '10px',
                    color: 'white',
                    marginBottom: '5px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onClick={() => navigate(-1)}
            >
                <ArrowBackIcon />
            </button>

            <InfiniteScroll
                dataLength={chartData.classesChartData.length}
                next={getClassData}
                hasMore={classesList.length !== chartData.classesChartData.length}
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
                <SchoolAverageCharts
                    averageData={chartData.schoolAverageData}
                    percentageIncreased={chartData.schoolPercentageIncreased}
                    schoolName={schoolData?.institution_name}
                />
                {chartData.classesChartData.map((chartData) => {
                    return (
                        <ClassWiseCharts
                            averageData={chartData?.averageMarks || [0, 0]}
                            percentageIncreased={chartData?.percentageIncreased || [0]}
                            skillsData={chartData?.skills}
                            className={`Class ${chartData?.classId} Reports`}
                            studentsMarks={chartData?.studentsMarks}
                            key={chartData?.classId}
                        />
                    );
                })}
            </InfiniteScroll>
        </>
    );
};

export default SchoolCharts;
