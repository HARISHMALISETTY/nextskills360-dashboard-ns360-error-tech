import { db } from 'firebase_setup/firebase';
import { query, where, collection, getCountFromServer, getDocs, orderBy } from 'firebase/firestore';
import { firestoreCollections } from 'constants/collectionNames';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { toast } from 'react-toastify';
import { replaceSpaceWithUnderScore } from 'utils/formatFieldName';
import { scansCountForUsers, getUserAllTimePoints } from './school-reports';
export const getAllSchools = async (projectId) => {
    const q = query(collection(db, firestoreCollections.schools), where('project_id', '==', projectId), orderBy('institution_name'));
    const schools = await getDocs(q);
    let schoolsData = [];
    schools.forEach((snapshot) => {
        schoolsData.push(snapshot.data());
    });
    return schoolsData;
};
export const teachersRegisteredCount = async (schoolId, projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher'])
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};
export const getAllUsers = async (projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('user_role', 'in', [
            'b2b_level1_student',
            'b2b_level2_student',
            'b2b_level3_student',
            'b2b_level1_teacher',
            'b2b_level2_teacher',
            'b2b_level3_teacher'
        ])
    );
    const schools = await getDocs(q);
    let usersData = [];
    schools.forEach((snapshot) => {
        usersData.push(snapshot.data());
    });
    return usersData;
};
export const studentsRegisteredCount = async (schoolId, projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student'])
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};
export const totalTeachersCount = async (projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher'])
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};
export const totalStudentsCount = async (projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student'])
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};
export const teacherAllTimePoints = async (schoolId, projectId) => {
    const q = query(
        collection(db, firestoreCollections.userPoints),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher'])
    );
    const points = await getDocs(q);
    let totalPoints = 0;
    points.forEach((snapshot) => {
        totalPoints += snapshot.data().alltime_points;
    });
    return totalPoints;
};
export const studentAllTimePoints = async (schoolId, projectId) => {
    const q = query(
        collection(db, firestoreCollections.userPoints),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student'])
    );
    const points = await getDocs(q);
    let totalPoints = 0;
    points.forEach((snapshot) => {
        totalPoints += snapshot.data().alltime_points;
    });
    return totalPoints;
};
export const scansCountForTeachers = async (schoolId, projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_teacher', 'b2b_level2_teacher', 'b2b_level3_teacher'])
    );
    const users = await getDocs(q);
    let total = 0;
    users.forEach((snapshot) => {
        total += snapshot.data().online_scans_occurred + snapshot.data().offline_scans_occurred;
    });
    return total;
};
export const scansCountForStudents = async (schoolId, projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
        where('user_role', 'in', ['b2b_level1_student', 'b2b_level2_student', 'b2b_level3_student'])
    );
    const users = await getDocs(q);
    let total = 0;
    users.forEach((snapshot) => {
        total += snapshot.data().online_scans_occurred + snapshot.data().offline_scans_occurred;
    });
    return total;
};
export const ProjectReports = async (projectId, projectName) => {
    const data = await getAllSchools(projectId);
    let id = 1;
    const promise1 = data.map(async (school) => {
        return new Promise(async (resolve) => {
            let countOfRegTeachersData = teachersRegisteredCount(school.referral_code, projectId);
            let teachAllTmPointsData = teacherAllTimePoints(school.referral_code, projectId);
            let stuAllTmPointsData = studentAllTimePoints(school.referral_code, projectId);
            let teacherScanCountData = scansCountForTeachers(school.referral_code, projectId);
            let studentScanCountData = scansCountForStudents(school.referral_code, projectId);
            // let totalTeachersData = totalTeachersCount(projectId);
            // let totalStudentsData = totalStudentsCount(projectId);
            let countOfRegStudentsData = studentsRegisteredCount(school.referral_code, projectId);
            const [
                // totalTeachers,
                countOfRegTeachers,
                // totalStudents,
                countOfRegStudents,
                teacherScanCount,
                studentScanCount,
                teachAllTmPoints,
                stuAllTmPoints
            ] = await Promise.all([
                // totalTeachersData,
                countOfRegTeachersData,
                // totalStudentsData,
                countOfRegStudentsData,
                teacherScanCountData,
                studentScanCountData,
                teachAllTmPointsData,
                stuAllTmPointsData
            ]);
            let item = {
                'S.No': id++,
                'School Name': school.institution_name,
                'School Code': school.referral_code,
                'No.of ProGame Licence Keys Issued for Trainers': school.total_teachers,
                'No.of ProGame Licence Keys Used by Trainers': countOfRegTeachers,
                'No.of ProGame Licence Keys Issued for Students': school.total_students,
                'No.of ProGame Licence Keys Used by Students': countOfRegStudents,
                'Total no.of programs scanned by Trainers using the ProGame App': teacherScanCount,
                'Total no.of programs scanned by Students using the ProGame App': studentScanCount,
                'Total no.of points scored by Trainers in the ProGame App after scanning the programs': teachAllTmPoints,
                'Total no.of points scored by Students in the ProGame App after scanning the programs': stuAllTmPoints
            };
            resolve(item);
        });
    });

    const projectData = await toast.promise(Promise.all(promise1), {
        pending: `Downloading ${projectName} report`,
        success: `Downloaded ${projectName} report`,
        error: 'Something went wrong, please try again.'
    });

    return projectData;
};
export const getSchoolName = (schools, referralCode) => {
    return schools.find((school) => {
        return school.referral_code === referralCode;
    })?.institution_name;
};
export const UsageReports = async (projectId) => {
    const userDet = getAllUsers(projectId);
    const schools = getAllSchools(projectId);
    const [usersData, schoolsData] = await Promise.all([userDet, schools]);

    let id = 1;
    const promise2 = usersData.map(async (data) => {
        return new Promise(async (describe) => {
            let usersScanCount = await scansCountForUsers(data.referral_code, projectId, data.user_uid);
            let userAllTimePoints = await getUserAllTimePoints(data.referral_code, projectId, data.user_uid);
            let schoolName = getSchoolName(schoolsData, data.referral_code);
            let item = {
                'S.No': id++,
                'School Name': schoolName,
                'School Code': data.referral_code,
                'User Name': data.user_name,
                'LeaderBoard DisplayName': data.user_alias,
                'User Class': data.child_class,
                'User Role': data.user_role,
                'Total no.of programs scanned using the ProGame App': usersScanCount,
                'Total no.of points scored in the ProGame App after scanning the programs': userAllTimePoints
            };
            describe(item);
        });
    });
    const projectData = await Promise.all(promise2);
    return projectData;
};

export const dataToExcel = async (projectId, projectName) => {
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        day: 'numeric',
        ordinal: 'numeric'
    }).format(date);
    const ProjectReport = ProjectReports(projectId, projectName);
    const UsageReport = UsageReports(projectId, projectName);
    const [ProjectReportData, UsageReportData] = await Promise.all([ProjectReport, UsageReport]);
    const workbook = new Workbook();
    const worksheet1 = workbook.addWorksheet('Trainers Usage Report');
    const worksheet2 = workbook.addWorksheet('Students Usage Report');
    const worksheet3 = workbook.addWorksheet('Usage Report');
    worksheet1.mergeCells('A1:G1');
    worksheet2.mergeCells('A1:G1');
    worksheet3.mergeCells('A1:I1');
    const customCell1 = worksheet1.getCell('A1');
    const customCell2 = worksheet2.getCell('A1');
    const customCell3 = worksheet3.getCell('A1');
    const row1_1 = worksheet1.getRow(1);
    const row2_1 = worksheet2.getRow(1);
    const row3_1 = worksheet3.getRow(1);
    row1_1.height = 40;
    row2_1.height = 40;
    row3_1.height = 40;
    row1_1.alignment = { vertical: 'middle', horizontal: 'center' };
    row2_1.alignment = { vertical: 'middle', horizontal: 'center' };
    row3_1.alignment = { vertical: 'middle', horizontal: 'center' };
    const row1_2 = worksheet1.getRow(2);
    const row2_2 = worksheet2.getRow(2);
    const row3_2 = worksheet3.getRow(2);
    row1_2.height = 70;
    row2_2.height = 70;
    row3_2.height = 70;
    row1_2.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    row2_2.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    row3_2.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    customCell1.font = {
        size: 12,
        bold: true
    };
    customCell2.font = {
        size: 12,
        bold: true
    };
    customCell3.font = {
        size: 12,
        bold: true
    };
    customCell1.value = `${projectName} - Overall ProGame Usage Report for Trainers(As On ${formattedDate})`;
    customCell2.value = `${projectName} - Overall ProGame Usage Report for Students(As On ${formattedDate})`;
    customCell3.value = `${projectName} - Individual ProGame Usage Report for Students and Trainers(As On ${formattedDate})`;
    worksheet1.getRow(2).values = [
        'S.No',
        'School Name',
        'School Code',
        'No.of ProGame Licence Keys Issued for Trainers',
        'No.of ProGame Licence Keys Used by Trainers',
        'Total no.of programs scanned by Trainers using the ProGame App',
        'Total no.of points scored by Trainers in the ProGame App after scanning the programs'
    ];
    worksheet2.getRow(2).values = [
        'S.No',
        'School Name',
        'School Code',
        'No.of ProGame Licence Keys Issued for Students',
        'No.of ProGame Licence Keys Used by Students',
        'Total no.of programs scanned by Students using the ProGame App',
        'Total no.of points scored by Students in the ProGame App after scanning the programs'
    ];
    worksheet3.getRow(2).values = [
        'S.No',
        'School Name',
        'School Code',
        'User Name',
        'LeaderBoard DisplayName',
        'User Class',
        'User Role',
        'Total no.of programs scanned using the ProGame App',
        'Total no.of points scored in the ProGame App after scanning the programs'
    ];
    worksheet1.columns = [
        { key: 'S.No', width: 5 },
        { key: 'School Name', width: 20 },
        { key: 'School Code', width: 20 },
        { key: 'No.of ProGame Licence Keys Issued for Trainers', width: 25 },
        { key: 'No.of ProGame Licence Keys Used by Trainers', width: 25 },
        { key: 'Total no.of programs scanned by Trainers using the ProGame App', width: 25 },
        {
            key: 'Total no.of points scored by Trainers in the ProGame App after scanning the programs',
            width: 20
        }
    ];
    worksheet2.columns = [
        { key: 'S.No', width: 5 },
        { key: 'School Name', width: 20 },
        { key: 'School Code', width: 20 },
        { key: 'No.of ProGame Licence Keys Issued for Students', width: 25 },
        { key: 'No.of ProGame Licence Keys Used by Students', width: 25 },
        { key: 'Total no.of programs scanned by Students using the ProGame App', width: 25 },
        {
            key: 'Total no.of points scored by Students in the ProGame App after scanning the programs',
            width: 20
        }
    ];
    worksheet3.columns = [
        { key: 'S.No', width: 5 },
        { key: 'School Name', width: 20 },
        { key: 'School Code', width: 20 },
        { key: 'User Name', width: 20 },
        { key: 'LeaderBoard DisplayName', width: 25 },
        { key: 'User Class', width: 25 },
        { key: 'User Role', width: 25 },
        { key: 'Total no.of programs scanned using the ProGame App', width: 25 },
        {
            key: 'Total no.of points scored in the ProGame App after scanning the programs',
            width: 20
        }
    ];

    worksheet1.addRows(ProjectReportData);
    worksheet2.addRows(ProjectReportData);
    worksheet3.addRows(UsageReportData);
    workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        saveAs(blob, `${replaceSpaceWithUnderScore(projectName)}_project_report.xlsx`);
    });
};
