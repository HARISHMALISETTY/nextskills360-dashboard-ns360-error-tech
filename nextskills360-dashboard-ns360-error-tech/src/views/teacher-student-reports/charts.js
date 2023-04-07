import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getClassMarks } from 'services/school-queries';
import ClassWiseCharts from 'views/charts/class-wise-charts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'store/selectors';

const SchoolCharts = () => {
    // const { projectId, schoolId, classId } = useParams();
    const { project_id, referral_code, child_class } = useSelector(getCurrentUser);
    const navigate = useNavigate();
    const [chartData, setChartData] = useState({});
    const classId = child_class.split(' ')[1];

    const getClassData = () => {
        getClassMarks(project_id, referral_code, Number(classId)).then((res) => {
            setChartData(res);
        });
    };

    useEffect(() => {
        getClassData();
    }, []);

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
            <ClassWiseCharts
                averageData={chartData?.averageMarks || [0, 0]}
                percentageIncreased={chartData?.percentageIncreased || [0]}
                skillsData={chartData?.skills}
                className={`Class ${classId} Reports`}
                studentsMarks={chartData?.studentsMarks}
                key={chartData?.classId}
            />
        </>
    );
};

export default SchoolCharts;
