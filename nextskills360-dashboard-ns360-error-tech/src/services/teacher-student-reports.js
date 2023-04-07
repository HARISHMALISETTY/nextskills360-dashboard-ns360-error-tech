import { db } from 'firebase_setup/firebase';
import { query, where, collection, getCountFromServer, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestoreCollections } from 'constants/collectionNames';

export const scansCount = async (projectId, schoolId, childClass) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student']),
        where('child_class', '==', childClass)
    );
    const users = await getDocs(q);
    let total = 0;
    users.forEach((snapshot) => {
        total += snapshot.data().online_scans_occurred + snapshot.data().offline_scans_occurred;
    });

    return total;
};

export const pointsCount = async (uid) => {
    const userPointsDocRef = doc(collection(db, firestoreCollections.userPoints), uid);

    let points = 0;

    const querySnapshot = await getDoc(userPointsDocRef);
    if (querySnapshot.exists()) {
        points = querySnapshot.data()?.alltime_points;
    }
    return points;
};

export const studentsRegisteredCount = async (projectId, schoolId, childClass) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student']),
        where('child_class', '==', childClass)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const studentsUsedCount = async (projectId, schoolId, childClass) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student']),
        where('child_class', '==', childClass)
    );
    const snapshot = await getDocs(q);

    let count = 0;
    snapshot.forEach((snapshot) => {
        let total = 0;
        total = snapshot.data().online_scans_occurred + snapshot.data().offline_scans_occurred;

        if (total > 0) {
            count++;
        }
    });
    return count;
};

export const teachersRegisteredClassWise = async (projectId, schoolId, classId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher']),
        where('child_class', '==', `Class ${classId}`)
    );
    const snapshot = await getCountFromServer(q);
    return [classId, snapshot.data().count];
};

export const getEachClassTeacherRegisterdCount = async (projectId, schoolId, classList = []) => {
    const promises = classList.map((classId) => teachersRegisteredClassWise(projectId, schoolId, classId));
    return Promise.all(promises).then((docs) => {
        let classWiseRegisteredCount = {};
        docs.forEach((doc) => {
            const [classId, data] = doc;
            classWiseRegisteredCount[classId] = data;
        });
        return classWiseRegisteredCount;
    });
};

export const studentRegisteredClassWise = async (projectId, schoolId, classId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student']),
        where('child_class', '==', `Class ${classId}`)
    );
    const snapshot = await getCountFromServer(q);
    return [classId, snapshot.data().count];
};

export const getEachClassStudentRegisterdCount = async (projectId, schoolId, classList) => {
    const promises = classList.map((classId) => studentRegisteredClassWise(projectId, schoolId, classId));
    return Promise.all(promises).then((docs) => {
        let classWiseRegisteredCount = {};
        docs.forEach((doc) => {
            const [classId, data] = doc;
            classWiseRegisteredCount[classId] = data;
        });
        return classWiseRegisteredCount;
    });
};

export const ClassWiseStudentTeacherCount = async (projectId, schoolId, studentsParticipated) => {
    const classList = Object.keys(studentsParticipated);
    // const teacherRegisteredCount = await getEachClassTeacherRegisterdCount(projectId, schoolId, classList);
    const studentRegisteredCount = await getEachClassStudentRegisterdCount(projectId, schoolId, classList);

    const finalClassWiseData = {};
    classList.map((classId) => {
        finalClassWiseData[classId] = {
            studentsRegistered: studentRegisteredCount[classId],
            studentsParticipated: studentsParticipated[classId]
            // teachersParticipated: teachersParticipated[classId],
            // teachersRegistered: teacherRegisteredCount[classId]
        };
    });
    return finalClassWiseData;
};

export const topThreeStudents = async (projectId, schoolId, childClass) => {
    const q = query(
        collection(db, firestoreCollections.userPoints),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student']),
        where('child_class', '==', childClass)
    );
    const points = await getDocs(q);

    let allUsersPoints = [];

    points.forEach((snapshot) => {
        allUsersPoints.push(snapshot.data());
    });

    allUsersPoints.sort((a, b) => b.alltime_points - a.alltime_points);

    const topThree = {};

    for (let i = 0; i < 3; i++) {
        if (allUsersPoints[i]) {
            topThree[i + 1] = {
                name: allUsersPoints[i].user_name,
                id: allUsersPoints[i].user_uid,
                points: allUsersPoints[i].alltime_points
            };
        }
    }

    return topThree;
};
