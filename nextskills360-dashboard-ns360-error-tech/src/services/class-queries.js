import { db } from 'firebase_setup/firebase';
import { query, where, collection, getDocs } from 'firebase/firestore';
import { firestoreCollections } from 'constants/collectionNames';

export const getStudentsPointsByClass = async (projectId, schoolId, classId) => {
    const pointQuery = query(
        collection(db, firestoreCollections.userPoints),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student']),
        where('child_class', '==', `Class ${classId}`)
    );
    const usersQuery = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student']),
        where('child_class', '==', `Class ${classId}`)
    );

    const [pointsQuerySnapshot, usersQuerySnapshot] = await Promise.all([getDocs(pointQuery), getDocs(usersQuery)]);

    const usersPoints = new Map();

    usersQuerySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        usersPoints.set(data.user_uid, data);
    });

    pointsQuerySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        usersPoints.set(data.user_uid, data);
    });

    return Array.from(usersPoints.values());
};

export const getTeachersPointsByClass = async (projectId, schoolId, classId) => {
    const pointQuery = query(
        collection(db, firestoreCollections.userPoints),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher']),
        where('child_class', '==', `Class ${classId}`)
    );
    const usersQuery = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher']),
        where('child_class', '==', `Class ${classId}`)
    );

    const [pointsQuerySnapshot, usersQuerySnapshot] = await Promise.all([getDocs(pointQuery), getDocs(usersQuery)]);

    const usersPoints = new Map();

    usersQuerySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        usersPoints.set(data.user_uid, data);
    });

    pointsQuerySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        usersPoints.set(data.user_uid, data);
    });

    return Array.from(usersPoints.values());
};
