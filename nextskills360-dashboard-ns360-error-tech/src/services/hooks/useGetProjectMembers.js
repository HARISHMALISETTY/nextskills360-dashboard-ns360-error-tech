import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getProjectMembers } from 'services/users';

export const useGetProjectMembers = (projectId, referralCode = '') => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleError = (err) => {
        setLoading(false);
        console.error(err);
        setError(JSON.stringify(err));
    };

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(
            getProjectMembers(projectId, referralCode),
            (querySnapshot) => {
                var users = [];
                querySnapshot.forEach((snapshot) => users.push(snapshot.data()));
                setUsers(users);
                setLoading(false);
            },
            handleError
        );
        return () => unsubscribe();
    }, [projectId, referralCode]);

    return [users, loading, error];
};
