import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getAllSchools } from 'services/school-queries';

export const useGetAllSchools = (projectId) => {
    const [list, SetList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleError = (err) => {
        setLoading(false);
        setError(JSON.stringify(err));
    };

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(
            getAllSchools(projectId),
            (querySnapshot) => {
                let returnArray = [];
                querySnapshot.forEach((snapshot) => {
                    const data = snapshot.data();
                    returnArray.push({ id: data.referral_code, label: data.institution_name });
                });
                SetList(returnArray);
                setLoading(false);
            },
            handleError
        );
        return () => unsubscribe();
    }, []);
    return [list, loading, error];
};
