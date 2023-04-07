import { roles } from 'constants/roles';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllProjects, getProjectDataById } from 'services/project-queries';
import { getAllProjectsUserAssigned } from 'services/users';
import { getCurrentUser } from 'store/selectors';

export const useGetProjectDataConditionally = (condition, projectId) => {
    const [list, SetList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleError = (err) => {
        setLoading(false);
        setError(JSON.stringify(err));
    };

    useEffect(() => {
        if (condition) {
            setLoading(true);
            const unsubscribe = onSnapshot(
                getProjectDataById(projectId),
                (querySnapshot) => {
                    const data = querySnapshot.data();
                    SetList([{ id: data.project_id, label: data.project_name }]);
                    setLoading(false);
                },
                handleError
            );
            return () => unsubscribe();
        }
    }, [condition, projectId]);

    return [list, loading, error];
};

export const useGetAllProjectNames = (orderBy = 'project_name', order = 'asc') => {
    const { dashboard_role, mobile_number, project_id } = useSelector(getCurrentUser);

    const isTeacherStudentRole = [roles.STUDENT, roles.TEACHER].includes(dashboard_role);

    const [projectData, loadingProjectData, errorInProcess] = useGetProjectDataConditionally(isTeacherStudentRole, project_id);

    const [list, SetList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleError = (err) => {
        setLoading(false);
        setError(JSON.stringify(err));
        console.error(err);
    };

    let dataQuery = null;

    if (roles.ADMIN === dashboard_role) {
        dataQuery = getAllProjects(orderBy, order);
    } else if ([roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD, roles.PRINCIPAL, roles.GUEST_PRINCIPAL].includes(dashboard_role)) {
        dataQuery = getAllProjectsUserAssigned(mobile_number, orderBy, order);
    }

    useEffect(() => {
        if (dataQuery) {
            setLoading(true);
            const unsubscribe = onSnapshot(
                dataQuery,
                (querySnapshot) => {
                    let projectsList = new Map();
                    querySnapshot.forEach((snapshot) => {
                        const data = snapshot.data();
                        projectsList.set(data.project_id, { id: data.project_id, label: data.project_name });
                    });
                    SetList(Array.from(projectsList.values()));
                    setLoading(false);
                },
                handleError
            );
            return () => unsubscribe();
        }
    }, []);

    return isTeacherStudentRole ? [projectData, loadingProjectData, errorInProcess] : [list, loading, error];
};
