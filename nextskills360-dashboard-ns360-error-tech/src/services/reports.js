import { db } from 'firebase_setup/firebase';
import { query, where, collection, getCountFromServer, getDocs, orderBy } from 'firebase/firestore';
import { firestoreCollections } from 'constants/collectionNames';

export const schoolsCount = async (projectId) => {
    const q = query(collection(db, firestoreCollections.schools), where('project_id', '==', projectId));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const scansCount = async (projectId) => {
    const q = query(collection(db, firestoreCollections.users), where('project_id', '==', projectId));
    const users = await getDocs(q);
    let total = 0;
    users.forEach((snapshot) => {
        const data = snapshot.data();
        total += data.online_scans_occurred + data.offline_scans_occurred;
    });
    return total;
};

export const pointsCount = async (projectId) => {
    const q = query(collection(db, firestoreCollections.userPoints), where('project_id', '==', projectId));
    const points = await getDocs(q);
    let total = 0;
    points.forEach((snapshot) => {
        total += snapshot.data().alltime_points;
    });
    return total;
};

export const appSupportTicketsCount = async (projectId) => {
    const q = query(collection(db, firestoreCollections.appSupportTickets), where('project_id', '==', projectId));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const whatsappSupportTicketsCount = async (projectId) => {
    const q = query(collection(db, firestoreCollections.whatsappSupportTickets), where('project_id', '==', projectId));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const studentsRegisteredCount = async (projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student'])
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const studentsUsedCount = async (projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student'])
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

export const teachersRegisteredCount = async (projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher'])
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const teachersUsedCount = async (projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher'])
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

export const topThreeStudents = async (projectId) => {
    // Creates a database query to get documents from the "userPoints" collection
    // where the project_id field matches the specified projectId and the user_role
    // field matches any of the provided student role levels.
    const q = query(
        collection(db, firestoreCollections.userPoints),
        where('project_id', '==', projectId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student'])
    );
    // Executes the query and gets a snapshot of the documents
    const points = await getDocs(q);

    // Initializes an empty array to store all users' data
    let allUsersPoints = [];

    // Loops through each document snapshot and pushes its data into the
    // allUsersPoints array
    points.forEach((snapshot) => {
        allUsersPoints.push(snapshot.data());
    });

    // Sorts the array of user points in descending order by their all-time points
    allUsersPoints.sort((a, b) => b.alltime_points - a.alltime_points);

    // Initializes an empty object to store the information of the top three students
    const topThree = {};

    // Loops through the first three elements in the sorted allUsersPoints array and adds their
    // information to the topThree object
    for (let i = 0; i < 3; i++) {
        if (allUsersPoints[i]) {
            topThree[i + 1] = {
                name: allUsersPoints[i].user_name,
                id: allUsersPoints[i].user_uid,
                points: allUsersPoints[i].alltime_points
            };
        }
    }

    // Returns the object containing the top three students' information
    return topThree;
};

// The function topThreeTeachers takes a projectId as an argument and returns the details of the top three teachers based on their all-time points.
export const topThreeTeachers = async (projectId) => {
    // Querying the userPoints collection from Firestore to get the data required for calculating the points.
    const q = query(
        collection(db, firestoreCollections.userPoints),
        where('project_id', '==', projectId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher'])
    );
    // Getting the documents returned by the query in the form of a snapshot using getDocs() method.
    const points = await getDocs(q);

    // Initializing an empty array to store all the user points data.
    let allUsersPoints = [];

    // Iterating through each document returned by the query and pushing it's data to the allUsersPoints array.
    points.forEach((snapshot) => {
        allUsersPoints.push(snapshot.data());
    });

    // Sorting the allUsersPoints array in descending order based on all-time points.
    allUsersPoints.sort((a, b) => b.alltime_points - a.alltime_points);

    // Object to store the details of the top three teachers.
    const topThree = {};

    // Looping through first three elements of allUsersPoints array to get the top three teachers' details.
    for (let i = 0; i < 3; i++) {
        if (allUsersPoints[i]) {
            topThree[i + 1] = {
                name: allUsersPoints[i].user_name,
                id: allUsersPoints[i].user_uid,
                points: allUsersPoints[i].alltime_points
            };
        }
    }

    // Returning the object containing the details of the top three teachers.
    return topThree;
};

// this function returns the average marks received in a specific category of assessments for a given project id
// if categoryType is not provided, it defaults to 'baseline'
export const averageMarksByCategory = async (projectId, categoryType = 'baseline') => {
    // retrieve all results for the specified projectId and assessment type
    const q = query(
        collection(db, firestoreCollections.assessmentsResults),
        where('project_id', '==', projectId),
        where('assessment_type', '==', categoryType)
    );

    // wait for the results to be fetched
    const resultsDocs = await getDocs(q);

    let totalMarks = 0;

    // loop through each result and add its total marks to the running total
    resultsDocs.forEach((snapshot) => {
        totalMarks += snapshot.data().total_marks;
    });

    // calculate the average marks by dividing the total marks by the number of assessments
    const averageMarks = totalMarks / resultsDocs.size;

    // return the average marks
    return averageMarks;
};

/**
 * This function returns a Promise that resolves to an array of two elements,
 * representing the average marks for the "baseline" and "endline" categories respectively.
 * It takes a projectId as parameter to filter the relevant data.
 */

export const getProjectAverageChartData = async (projectId) => {
    return new Promise(async (resolve) => {
        // Get a promise that resolves to average marks for category "baseline"
        const baselineAverageMarksPromise = averageMarksByCategory(projectId);

        // Get a promise that resolves to average marks for category "endline"
        const endlineAverageMarksPromise = averageMarksByCategory(projectId, 'endline');

        // Wait for both promises to resolve, then retrieve their results
        const [baselineAverageMarks, endlineAverageMarks] = await Promise.all([baselineAverageMarksPromise, endlineAverageMarksPromise]);

        // Return array with both average marks in resolved Promise
        resolve([baselineAverageMarks, endlineAverageMarks]);
    });
};
