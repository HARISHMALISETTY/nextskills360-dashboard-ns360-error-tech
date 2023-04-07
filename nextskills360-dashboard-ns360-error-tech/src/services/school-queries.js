import { db } from 'firebase_setup/firebase';
import { doc, query, where, collection, getCountFromServer, getDocs, orderBy, startAfter, limit } from 'firebase/firestore';
import { firestoreCollections } from 'constants/collectionNames';
import { formatFieldName } from 'utils/formatFieldName';

export const getAllSchools = (projectId) =>
    query(collection(db, firestoreCollections.schools), where('project_id', '==', projectId), orderBy('institution_name'));

export const getSchoolsPaginated = async (projectId, isFirstPage, lastRef, limitTo = 10) => {
    const first = query(
        collection(db, firestoreCollections.schools),
        where('project_id', '==', projectId),
        orderBy('institution_name'),
        limit(limitTo)
    );

    let next = '';

    if (!isFirstPage) {
        next = query(
            collection(db, firestoreCollections.schools),
            where('project_id', '==', projectId),
            orderBy('institution_name'),
            startAfter(lastRef),
            limit(limitTo)
        );
    }

    const paginateQuery = isFirstPage ? first : next;

    const querySnapshot = await getDocs(paginateQuery);

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    let schoolsList = [];

    querySnapshot.forEach((snapshot) => schoolsList.push(snapshot.data()));

    return [schoolsList, lastVisible];
};

export const getSchoolDataById = (schoolId) => doc(db, firestoreCollections.schools, schoolId);

export const scansCountForSchool = async (projectId, schoolId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId)
    );
    const users = await getDocs(q);
    let total = 0;
    users.forEach((snapshot) => {
        total += snapshot.data().online_scans_occurred + snapshot.data().offline_scans_occurred;
    });
    return total;
};

export const pointsCount = async (projectId, schoolId) => {
    const q = query(
        collection(db, firestoreCollections.userPoints),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId)
    );
    const points = await getDocs(q);
    let total = 0;
    points.forEach((snapshot) => {
        total += snapshot.data().alltime_points;
    });
    return total;
};

export const appSupportTicketsCount = async (projectId, schoolId) => {
    const q = query(
        collection(db, firestoreCollections.appSupportTickets),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const whatsappSupportTicketsCount = async (projectId, schoolId) => {
    const q = query(
        collection(db, firestoreCollections.whatsappSupportTickets),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const studentsRegisteredCount = async (projectId, schoolId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student'])
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const studentsUsedCount = async (projectId, schoolId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
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

export const teachersRegisteredCount = async (projectId, schoolId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher'])
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
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
    const teacherRegisteredCount = await getEachClassTeacherRegisterdCount(projectId, schoolId, classList);
    const studentRegisteredCount = await getEachClassStudentRegisterdCount(projectId, schoolId, classList);

    const finalClassWiseData = {};
    classList.map((classId) => {
        finalClassWiseData[classId] = {
            studentsRegistered: studentRegisteredCount[classId],
            studentsParticipated: studentsParticipated[classId],
            teachersRegistered: teacherRegisteredCount[classId]
        };
    });
    return finalClassWiseData;
};

export const teachersUsedCount = async (projectId, schoolId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
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

export const topThreeStudents = async (projectId, schoolId) => {
    const q = query(
        collection(db, firestoreCollections.userPoints),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student'])
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

export const topThreeTeachers = async (projectId, schoolId) => {
    const q = query(
        collection(db, firestoreCollections.userPoints),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher'])
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

/**
 * Calculates school average marks for a specific category type.
 * @param {string} projectId - The ID of the project to get the assessments results for.
 * @param {string} schoolId - The referral code of the school to filter the results by.
 * @param {string} categoryType - The type of assessment to get (default: 'baseline').
 * @returns {Object} An object containing the total marks and average marks of the school in the category type.
 */
export const schoolAverageMarksByCategory = async (projectId, schoolId, categoryType = 'baseline') => {
    // Query to get the assessment results for the specified project, school and category type
    const q = query(
        collection(db, firestoreCollections.assessmentsResults),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('assessment_type', '==', categoryType)
    );

    // Get the documents that match the query from the database
    const resultsDocs = await getDocs(q);

    // Calculate the total marks obtained by the school in the category type
    let totalMarks = 0;

    resultsDocs.forEach((snapshot) => {
        totalMarks += snapshot.data().total_marks;
    });

    // Calculate the average marks obtained by the school in the category type
    const averageMarks = totalMarks / resultsDocs.size;

    // Return an object containing the total marks and average marks
    return { totalMarks, averageMarks };
};

// A function that returns the class marks of students in a particular category, which includes overall total marks, average marks, skill-wise total marks and individual student marks.

export const classMarksByCategory = async (projectId, schoolId, classId, categoryType = 'baseline') => {
    // FireStore Query to get all results based on provided criteria
    const q = query(
        collection(db, firestoreCollections.assessmentsResults),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('student_class', '==', classId),
        where('assessment_type', '==', categoryType)
    );

    // Collects students' marks details
    const resultsDocs = await getDocs(q);

    // Initializes variables for total marks, skill-based marks and individual student marks
    let totalMarks = 0;
    let skillWiseTotalMarks = {};
    let studentsMarks = {};

    // Summarizes information for each screenshot for total marks, skillwise marks & individual student marks
    resultsDocs.forEach(async (snapshot) => {
        // Check if total marks are present and calculates total marks
        totalMarks += snapshot.data().total_marks || 0;

        // Aggregates skill-wise marks from each screenshot
        if (snapshot.data()?.skill_based_marks) {
            Object.keys(snapshot.data().skill_based_marks).map((key) => {
                skillWiseTotalMarks[key] = (skillWiseTotalMarks[key] || 0) + Number(snapshot.data().skill_based_marks[key] || 0);
            });
        }

        // save marks of each student
        studentsMarks[snapshot.data().student_id] = {
            studentId: snapshot.data().student_id,
            marks: snapshot.data().total_marks
        };
    });

    // Calculates the average of the all students' marks
    const averageMarks = totalMarks / resultsDocs.size;

    // Calculate the averages for skill wise marks.
    let averageSkillWiseMarks = {};

    // Loops through all skill-wise totals and takes the average
    Object.keys(skillWiseTotalMarks).map((key) => {
        averageSkillWiseMarks[key] = skillWiseTotalMarks[key] / resultsDocs.size;
    });

    // Returns an object with combined information of the student's class performance
    if (resultsDocs.size === 0) {
        return { totalMarks: 0, averageMarks: 0, averageSkillWiseMarks, studentsMarks };
    }
    return { totalMarks, averageMarks, averageSkillWiseMarks, studentsMarks };
};

// Define a function calculatePercentageIncreased with two parameters, 'newValue' and 'originalValue'
const calculatePercentageIncreased = (newValue, originalValue) => {
    // If the values of newValue and originalValue are equal then the percentageIncreased should be zero.
    if (newValue === originalValue) {
        return 0;
    }
    /*
  Calculate the percentage increased by subtracting the original value from the new value, 
  divide that result by the original value that results in fraction, multiply it by hundred to get 
  the percentage increased.
  */
    const percentageIncreased = ((newValue - originalValue) / originalValue) * 100;
    // Return the value of variable percentageIncreased
    return percentageIncreased;
};

// The function returns a promise that resolves with school average marks data for a given project and school.
export const getSchoolAverageChartMarks = async (projectId, schoolId) => {
    // Returns a promise that resolves to the average marks of the baseline category for the given school in a given project.
    const baselineMarksPromise = schoolAverageMarksByCategory(projectId, schoolId);

    // Returns a promise that resolves to the average marks of the endline category for the given school in a given project.
    const endlineMarksPromise = schoolAverageMarksByCategory(projectId, schoolId, 'endline');

    // Resolves both promises at once to get the results of the two categories and store them in an array named [baselineMarks, endlineMarks].
    const [baselineMarks, endlineMarks] = await Promise.all([baselineMarksPromise, endlineMarksPromise]);

    // Calculate the percentage increased by calling the helper function calculatePercentageIncreased which takes the original value and the new value.
    const percentageIncreased = calculatePercentageIncreased(endlineMarks.totalMarks, baselineMarks.totalMarks);

    // Construct the data object to be returned with averageMarks and percentageIncreased
    const data = {
        averageMarks: [baselineMarks.averageMarks, endlineMarks.averageMarks],
        percentageIncreased: [percentageIncreased]
    };

    return data;
};

export const getClassStudentsData = async (projectId, schoolId, classId) => {
    // Firestore query to get students from the given project, school and class
    const q = query(
        collection(db, firestoreCollections.students),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('student_class', '==', classId)
    );

    // Getting all the documents for students using the above query
    const resultsDocs = await getDocs(q);

    // Object to store students data
    const studentsData = {};

    // Iterating over each document to get student's data and add it in the studentsData object
    resultsDocs.forEach((snapshot) => {
        const data = snapshot.data();
        studentsData[data.student_id] = data;
    });

    return studentsData; // Returning object containing data of all the students found
};

export const getClassMarks = async (projectId, schoolId, classId) => {
    return new Promise(async (resolve) => {
        // get students basic data from firestore collection
        const studentsDataPromise = getClassStudentsData(projectId, schoolId, classId);

        // fetch the average marks and skill wise total marks for baseline assessment
        const baselineMarksPromise = classMarksByCategory(projectId, schoolId, classId);

        //fetch the average marks and skill wise total marks for endline assessment
        const endlineMarksPromise = classMarksByCategory(projectId, schoolId, classId, 'endline');

        const [studentsData, baselineMarks, endlineMarks] = await Promise.all([
            studentsDataPromise,
            baselineMarksPromise,
            endlineMarksPromise
        ]);

        //calculate percent increase in the marks for both baseline and endline assessment.
        const percentageIncreased = calculatePercentageIncreased(endlineMarks.totalMarks, baselineMarks.totalMarks);

        //sort categories
        const categories = Object.keys(baselineMarks.averageSkillWiseMarks).sort();

        //initialize arrays
        const skillsCategoryNames = [];
        const skillsBaselineMarks = [];
        const skillsEndlineMarks = [];

        // fetch the skill category names, baseline  and endline marks for each of the skill i.e ith skill mark corresponds to the same index array element.
        categories.forEach((category) => {
            skillsCategoryNames.push(formatFieldName(category));
            skillsBaselineMarks.push(baselineMarks.averageSkillWiseMarks[category] || 0);
            skillsEndlineMarks.push(endlineMarks.averageSkillWiseMarks[category] || 0);
        });

        // initialize arrays
        const studentIds = Object.keys(studentsData);
        const studentsNames = [];
        const studentsBaselineMarks = [];
        const studentEndlineMarks = [];

        // loop through each student record and push their name, baseline and endline marks into respective arrays.
        studentIds.forEach((studentId) => {
            studentsNames.push(studentsData[studentId].student_name);
            studentsBaselineMarks.push(baselineMarks.studentsMarks[studentId].marks || 0);
            studentEndlineMarks.push(endlineMarks.studentsMarks[studentId].marks || 0);
        });

        //prepare final object that needs to return with required fields
        const data = {
            classId,
            averageMarks: [baselineMarks.averageMarks, endlineMarks.averageMarks],
            percentageIncreased: [percentageIncreased],
            skills: {
                baseline: skillsBaselineMarks,
                endline: skillsEndlineMarks,
                categories: skillsCategoryNames
            },
            studentsMarks: {
                baseline: studentsBaselineMarks,
                endline: studentEndlineMarks,
                categories: studentsNames
            }
        };
        resolve(data);
    });
};
