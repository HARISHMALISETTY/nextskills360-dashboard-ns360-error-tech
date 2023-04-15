//import MainCard component from ui-component/cards/MainCard module
import MainCard from 'ui-component/cards/MainCard';

//import useDocumentData and getProjectDataById functions from react-firebase-hooks/firestore and services/project-queries modules respectively
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getProjectDataById, updateStatusByField } from 'services/project-queries';

//import useParams function from react-router module
import { useParams } from 'react-router';

//import toast function from react-toastify module
import { toast } from 'react-toastify';

//import addMemberToProject and addNewUser functions from services/users module
import { addMemberToProject, addNewUser } from 'services/users';

//import UsersList component, UserForm component and ReportsCountStatus component from local modules
import UsersList from './usersList';
import { UserForm } from './UserForm';
import { ReportsCountStatus } from './reportsCountStatus';

//import useGetAllSchools hook from services/hooks/useGetAllSchools module
import { useGetAllSchools } from 'services/hooks/useGetAllSchools';

//import Header component from ui-component/header module
import Header from 'ui-component/header';

//create a functional component named ReportsSettings
const ReportsSettings = () => {
    //extract projectId using useParams()
    const { projectId } = useParams();

    //use useDocumentData() to retrieve data stored in firestore
    const [projectData, loading] = useDocumentData(getProjectDataById(projectId));

    //use useGetAllSchools() hook to get all the schools associated with the project identified by projectId
    const [schools, schoolsLoading] = useGetAllSchools(projectId);

    //declare a function named handleAddNewUser. It takes an object containing name, mobileNo, role, accessLevel, school and referralCode as parameter
    const handleAddNewUser = async ({ name, mobileNo, role, accessLevel, school, referralCode }) => {
        //prepare data for both project-level and school-level
        const projectLevelData = {
            dashboard_role: role,
            user_name: name,
            mobile_number: Number(mobileNo),
            project_id: projectId,
            project_name: projectData.project_name,
            project_status: projectData.project_status,
            project_academic_year: projectData.project_academic_year
        };

        const schoolLevelData = {
            dashboard_role: role,
            user_name: name,
            mobile_number: Number(mobileNo),
            institution_name: school,
            referral_code: referralCode,
            project_id: projectId,
            project_name: projectData.project_name,
            project_status: projectData.project_status,
            project_academic_year: projectData.project_academic_year
        };

        //select data based on access level
        const data = accessLevel === 'project' ? projectLevelData : schoolLevelData;

        //add new user using addNewUser() function
        await addNewUser({
            user_name: name.trim(),
            dashboard_role: role,
            mobile_number: Number(mobileNo)
        });

        //add member to project using addMemberToProject() function
        await addMemberToProject(projectId, data);
    };

    //declare a function named updateShowCountStatus. It takes field and value as parameters
    const updateShowCountStatus = (field, value) => {
        //update status of the report identified by projectId and the given field
        updateStatusByField(projectId, field, value).then(() => toast.success('Updated Successfully!'));
    };

    /*Render the following components:
      a header component with the project name and a ReportsCountStatus component
      a MainCard component with title 'Add New User', display UserForm component and show/hide list of school names depending on the state of the schoolsLoading props
      a UsersList component showing the existing list of users */
    return (
        !loading && (
            <>
                <Header title={`${projectData?.project_name || ''}`} leftComponent={<></>} rightComponent={<></>} />
                <ReportsCountStatus projectData={projectData} updateShowCountStatus={updateShowCountStatus} />
                <MainCard title="Add New User" sx={{ mb: 1.25 }}>
                    <UserForm schools={schools} schoolsLoading={schoolsLoading} addNewUser={handleAddNewUser} />
                </MainCard>
                <UsersList
                    schools={schools}
                    schoolsLoading={schoolsLoading}
                    projectId={projectId}
                    projectName={projectData?.project_name}
                />
            </>
        )
    );
};

//export ReportsSettings component as the default export
export default ReportsSettings;
