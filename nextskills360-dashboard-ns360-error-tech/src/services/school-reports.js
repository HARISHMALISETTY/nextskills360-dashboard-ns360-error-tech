import { db } from 'firebase_setup/firebase';
import { doc, query, where, collection, getDocs, getDoc } from 'firebase/firestore';
import { firestoreCollections } from 'constants/collectionNames';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { toast } from 'react-toastify';
import { replaceSpaceWithUnderScore } from 'utils/formatFieldName';
export const getUserDetails = async (schoolId, projectId) => {
    const q = query(
        collection(db, firestoreCollections.users),
        where('project_id', '==', projectId),
        where('referral_code', '==', schoolId),
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

export const scansCountForUsers = async (schoolId, projectId, userId) => {
    const userRef = doc(collection(db, firestoreCollections.users), userId);
    const user = await getDoc(userRef);
    let total = 0;

    total = user.data().online_scans_occurred + user.data().offline_scans_occurred;
    return total;
};
export const getUserAllTimePoints = async (schoolId, projectId, userId) => {
    const userPointsRef = doc(collection(db, firestoreCollections.userPoints), userId);
    const userPoints = await getDoc(userPointsRef);

    if (userPoints.exists()) {
        return userPoints.data()?.alltime_points;
    }
    return 0;

    //return userPoints;
};

export const schoolReports = async (schoolId, projectId, schoolName) => {
    const result = await getUserDetails(schoolId, projectId);
    let id = 1;
    const promises = result.map((data) => {
        return new Promise(async (describe) => {
            let usersScanCount = await scansCountForUsers(data.referral_code, projectId, data.user_uid);
            let userAllTimePoints = await getUserAllTimePoints(data.referral_code, projectId, data.user_uid);
            let item = {
                'S.No': id++,
                'User Name': data.user_name,
                'Leader Board Displayname': data.user_alias,
                'User Class': data.child_class,
                'User Role': data.user_role,
                'Total No.of programs scanned using the ProGame App': usersScanCount,
                'Total No.of points stored in the Progame App after scanning the Programs': userAllTimePoints
            };
            describe(item);
        });
    });

    const schoolReport = await toast.promise(Promise.all(promises), {
        pending: `Downloading ${schoolName} report`,
        success: `Downloaded ${schoolName} report`,
        error: 'Something went wrong, please try again.'
    });

    return schoolReport;
};
export const dataToExcel = async (schoolId, projectId, schoolName) => {
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
    const schoolReport = await schoolReports(schoolId, projectId, schoolName);
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('School Report');
    worksheet.mergeCells('A1:G1');
    const customCell = worksheet.getCell('A1');
    const row1 = worksheet.getRow(1);
    row1.height = 40;
    row1.alignment = { vertical: 'middle', horizontal: 'center' };
    const row2 = worksheet.getRow(2);
    row2.height = 70;
    row2.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    customCell.font = {
        size: 12,
        bold: true
    };
    customCell.value = `${schoolName} - Individual ProGame Usage Report for students and trainers(As On ${formattedDate})`;
    worksheet.getRow(2).values = [
        'S.No',
        'User Name',
        'Leader Board Displayname',
        'User Class',
        'User Role',
        'Total No.of programs scanned using the ProGame App',
        'Total No.of points stored in the Progame App after scanning the Programs'
    ];
    worksheet.columns = [
        { key: 'S.No', width: 5 },
        { key: 'User Name', width: 15 },
        { key: 'Leader Board Displayname', width: 20 },
        { key: 'User Class', width: 20 },
        { key: 'User Role', width: 25 },
        { key: 'Total No.of programs scanned using the ProGame App', width: 25 },
        { key: 'Total No.of points stored in the Progame App after scanning the Programs', width: 25 }
    ];
    worksheet.addRows(schoolReport);
    workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        saveAs(blob, `${replaceSpaceWithUnderScore(schoolName)}_school_report.xlsx`);
    });
};
