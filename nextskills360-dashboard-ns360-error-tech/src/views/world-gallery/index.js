import { commonErrorMessages } from 'constants/errorMessages'; // Importing constant for default error message
import { useState, useEffect } from 'react'; // Importing react hooks
import { useParams } from 'react-router'; // Importing hook for getting url parameters
import { toast } from 'react-toastify'; // importing a library to show notifications
import { useGetAllProjectNames } from 'services/hooks/useGetAllProjectNames'; // importing a custom hook
import WorldGalleryTabs from './tabs'; // importing component

const WorldGallery = () => {
    const { projectId } = useParams(); // get project Id from url params
    const [projects, loading, error] = useGetAllProjectNames(); // get all projects list from fireStore database
    const [projectSelected, setProjectSelected] = useState({ label: 'All Projects', id: '0' }); // initially no project is selected
    const [defaultProject, setDefaultProject] = useState('All Projects');

    useEffect(() => {
        if (projects.length > 0 && projectId) {
            const defaultValue = projects.find((project) => project.id === projectId); // find the project in projects array that matches with projectId from url param
            setDefaultProject(defaultValue.label);
            setProjectSelected(defaultValue); // set projectSelected value according to found value
        }
    }, [projects.length]);

    if (error) {
        toast.error(commonErrorMessages.unknown); // Show error message if there is any error
        return;
    }

    const selectedProjectId = projectSelected?.id === '0' ? '' : projectSelected?.id; // get the selected project id or blank if "all projects" is selected
    return (
        !loading &&
        projects.length > 0 && (
            <WorldGalleryTabs
                projectId={selectedProjectId}
                projectsList={projects.map((project) => project.id)}
                autoCompleteProps={{
                    options: [{ label: 'All Projects', id: 0 }, ...projects], // Add all the projects into the options array along with All Project (as it also works as an option)
                    selectedOption: projectSelected.label,
                    setSelectedOption: setProjectSelected,
                    optionsLoading: loading,
                    defaultProject: defaultProject
                }}
            />
        )
    );
};

export default WorldGallery;
