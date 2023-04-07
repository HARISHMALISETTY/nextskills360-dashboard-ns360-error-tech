import { firestoreCollections } from 'constants/collectionNames';
import { roles } from 'constants/roles';
import {
    collection,
    collectionGroup,
    getCountFromServer,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
    deleteField,
    writeBatch
} from 'firebase/firestore';
import { db } from 'firebase_setup/firebase';
import { formatFieldName } from 'utils/formatFieldName';

/**
 * Retrieves user data based on their phone number
 * @param {string} mobileNumber - The user's mobile phone number
 * @returns {Promise<Array>} Array of user objects that match the provided phone number. Empty array if none found.
 */
export const getUserDataByPhoneNumber = async (mobileNumber) => {
    const q = query(collection(db, firestoreCollections.users), where('mobile_number', '==', Number(mobileNumber)));
    const querySnapshot = await getDocs(q);
    let users = [];
    querySnapshot.forEach((snapshot) => users.push(snapshot.data()));
    return users;
};
// This function receives user data as input and adds a new user to Firestore if no user with given mobile number exists or updates an existing user if one exists
export const addNewUser = async (data) => {
    // Get user data from Firestore based on input's mobile_number value
    const users = await getUserDataByPhoneNumber(data.mobile_number);

    // If there are no users that match the input's mobile_number value in Firestore, add a new user document
    if (users.length === 0) {
        // Create a reference to a user document using Firestore's doc() method with collections and document ID values as arguments
        const userRef = doc(collection(db, firestoreCollections.users), data.mobile_number.toString());
        // Set user data for the given document using Firestore's setDoc() method with document reference and input data as arguments
        await setDoc(userRef, data);
    }
    // If there is only one user that matches the input's mobile_number value in Firestore, update its dashboard_role value
    else if (users.length === 1) {
        // Check if the user has a user_role value but not a dashboard_role value
        if (users[0].user_role && !users[0].dashboard_role) {
            // Create a reference to the user document using Firestore's doc() method with collections and document ID values as arguments
            const userRef = doc(collection(db, firestoreCollections.users), users[0].user_uid);
            // Update the dashboard_role value of the user document using Firestore's updateDoc() method with document reference and object containing the new dashboard_role value as arguments
            await updateDoc(userRef, { dashboard_role: data.dashboard_role });
        }
    }
};

/**
 * A function to check if a project member can be added based on their mobile number, project ID,
 * dashboard role, and referral code.
 *
 * @param {object} args An object containing the necessary properties such as mobile number,
 * project ID, dashboard role, and referral code.
 *
 * @returns {Promise<Array>} An array with two items:
 *        - A boolean that indicates whether or not the query returned any data.
 *        - An object representing the first document returned from the query (if any).
 */
export const canAddProjectMember = async ({ mobile_number, project_id, dashboard_role, referral_code }) => {
    let q = '';

    // If the user is a program head or guest program head, query the memberships collection for members
    // where the mobile number, project_id, and dashboard_role match the provided values.
    if ([roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD].includes(dashboard_role)) {
        q = query(
            collection(db, firestoreCollections.projects, project_id, 'memberships'),
            where('mobile_number', '==', mobile_number),
            where('project_id', '==', project_id),
            where('dashboard_role', '==', dashboard_role)
        );

        // If the user is a principal or guest principal, query the memberships collection for members
        // where the mobile number, project_id, referral code, and dashboard_role match the provided values.
    } else if ([roles.PRINCIPAL, roles.GUEST_PRINCIPAL].includes(dashboard_role)) {
        q = query(
            collection(db, firestoreCollections.projects, project_id, 'memberships'),
            where('mobile_number', '==', mobile_number),
            where('project_id', '==', project_id),
            where('referral_code', '==', referral_code),
            where('dashboard_role', '==', dashboard_role)
        );
    }

    // Create an empty list variable to store query results.
    const list = [];

    // Wait for the query to finish executing and get the snapshoht of the results.
    const querySnapshot = await getDocs(q);

    // Loop through the snapshot and push each document's data into the list array.
    querySnapshot.forEach((snapshot) => list.push(snapshot.data()));

    // Return an array with two items:
    // 1. A boolean indicating whether or not the query returned any results.
    // 2. The data for the first document in the list array (if any).
    return [querySnapshot.empty, list[0]];
};

/**
 * Add a member to a project.
 *
 * @param {string} projectId - The ID of the project to add the member to.
 * @param {Object} data - The member data to add to the project.
 * @throws {Error} Throws an error if the member already exists in the project.
 */
export const addMemberToProject = async (projectId, data) => {
    // Check if the member can be added
    const [canAddMember, member] = await canAddProjectMember(data);

    if (canAddMember) {
        // Generate a new document reference for the project membership subcollection and set the member data
        const newDocRef = doc(collection(db, firestoreCollections.projects, projectId, 'memberships'));
        return await setDoc(newDocRef, { ...data, uid: newDocRef.id });
    } else {
        // If the member already exists in the project
        if ([roles.PROGRAM_HEAD, roles.GUEST_PROGRAM_HEAD].includes(data.dashboard_role)) {
            throw Error(`${member.user_name} already exists as ${formatFieldName(data.dashboard_role)} in ${data.project_name}`);
        } else if ([roles.PRINCIPAL, roles.GUEST_PRINCIPAL].includes(data.dashboard_role)) {
            throw Error(
                `${member.user_name} already exists as ${formatFieldName(data.dashboard_role)} for ${data.institution_name} in 
                ${data.project_name}`
            );
        }
    }
};

export const getProjectMembers = (projectId, referralCode = '') => {
    if (referralCode.length > 0) {
        return query(
            collection(db, firestoreCollections.projects, projectId, 'memberships'),
            where('referral_code', '==', referralCode),
            where('dashboard_role', 'in', ['principal', 'guest_principal'])
        );
    }

    return query(
        collection(db, firestoreCollections.projects, projectId, 'memberships'),
        where('dashboard_role', 'in', ['program_head', 'guest_program_head'])
    );
};

/**
 * Updates the project member's data in the firestore database.
 *
 * @param {string} projectId - Id of the project where the member is added.
 * @param {string} uid - Unique id of the member to be updated.
 * @param {Object} data - Data to be updated about the member.
 * @returns {Promise}
 *    Resolves with void on successful update or
 *    Rejects with an error message if the member already exists as the specified role.
 */
export const updateProjectMember = async (projectId, uid, data) => {
    /**
     * Check if the new role and mobile number combination are allowed to add as project member.
     * Returns [canAddMember:boolean, member:object]
     * where canAddMember - true if member can be added else false,
     * member - object containing member details if already present.
     */
    const [canAddMember, member] = await canAddProjectMember(data);

    if (canAddMember) {
        //Create a reference to the project membership collection for the given user
        const userRef = doc(collection(db, firestoreCollections.projects, projectId, 'memberships'), uid);
        return await updateDoc(userRef, data); //Update the document with new data
    } else {
        if ([roles.PRINCIPAL, roles.GUEST_PRINCIPAL].includes(data.dashboard_role)) {
            throw Error(`${member.user_name} already exists as ${formatFieldName(data.dashboard_role)} for ${data.institution_name}`);
        }
    }
};

/* This function returns the count of projects that have been assigned to a user */

export const getCountOfProjectsAssignedToUser = async (mobileNumber) => {
    /* Query to get project memberships where mobile number matches */
    const q = query(collectionGroup(db, 'memberships'), where('mobile_number', '==', mobileNumber));

    /* Get the snapshot from server*/
    const snapshot = await getCountFromServer(q);

    /* Get the count value from the document in snapshot */
    return snapshot.data().count;
};

/* This function deletes a member of a project and cleans up. */

export const deleteMember = async (uid, mobileNumber, projectId) => {
    const batch = writeBatch(db);
    /* Get number of projects assigned to user and user data from firebase database by their phone number */
    const projectsAssignedPromise = getCountOfProjectsAssignedToUser(mobileNumber);
    const userDataPromise = getUserDataByPhoneNumber(mobileNumber);
    const [projectsAssigned, userData] = await Promise.all([projectsAssignedPromise, userDataPromise]);

    /* If user only has one project assignation, then see if we have to clean anything up */
    if (projectsAssigned === 1) {
        let deleteUserId = '';
        let updateUserId = '';

        userData.forEach((item) => {
            /* If this is the item to delete */
            if (item?.dashboard_role && !item?.user_role) {
                deleteUserId = item?.user_uid || mobileNumber.toString();
            } else if (item?.dashboard_role) {
                updateUserId = item.user_uid;
            }
        });

        /* Delete or update user data based on role */
        if (deleteUserId) {
            batch.delete(doc(collection(db, firestoreCollections.users), deleteUserId));
        } else if (updateUserId) {
            batch.update(doc(collection(db, firestoreCollections.users), updateUserId), { dashboard_role: deleteField() });
        }
    }

    /* Remove the user from the specified project */
    const userRef = doc(collection(db, firestoreCollections.projects, projectId, 'memberships'), uid);
    batch.delete(userRef);

    /* Commit changes as batch */
    await batch.commit();
};

/* This function returns query to retrieve all the projects that have been assigned to a user */

export const getAllProjectsUserAssigned = (mobileNumber, orderByFieldPath = 'project_academic_year', order = 'desc') => {
    /* Query to get project memberships where mobile number matches and then sort them */
    return query(collectionGroup(db, 'memberships'), where('mobile_number', '==', mobileNumber), orderBy(orderByFieldPath, order));
};

// This code exports a function that takes in three parameters: uid, mobileNumber and countryCallingCode
export const handleUserLogin = async (uid, mobileNumber, countryCallingCode) => {
    try {
        // Firebase Firestore references of the authenticated user and the temporary user (to be deleted after insertion into the authenticated user)
        const authUserRef = doc(collection(db, firestoreCollections.users), uid);
        const tempUserRef = doc(collection(db, firestoreCollections.users), mobileNumber);

        // Getting data from the Firestore documents of both the authenticated user and the temporary user
        const authUser = await getDoc(authUserRef);
        const authUserData = authUser.data();
        const tempUser = await getDoc(tempUserRef);
        const tempUserData = tempUser.data();

        // If both the authenticated user and the temporary user exist, update the data of the authenticated user using the dashboard_role of the temporary user
        if (authUser.exists() && tempUser.exists()) {
            const updatedData = await updateDoc(authUserRef, { dashboard_role: tempUserData.dashboard_role });
            // Deleting the temporary user as it has been now merged
            await deleteDoc(tempUserRef);
            return updatedData;
        }
        // If only the temporary user exists, create a new user with the data of the temporary user and add additional data (country calling code and user_uid) to it. Then delete the temporary user.
        else if (tempUser.exists() && !authUser.exists()) {
            const data = { ...tempUserData, country_code: '+' + countryCallingCode, user_uid: uid };
            await setDoc(authUserRef, data);
            // Deleting the temporary user
            await deleteDoc(tempUserRef);
            return data;
        }
        // If only the authenticated user exists, return their data
        else if (authUser.exists() && !tempUser.exists()) {
            return authUserData;
        }
        // If neither the authenticated nor the temporary user exist, return an empty object
        else {
            return {};
        }
    } catch (err) {
        // Throwing any errors that occur during execution
        throw new Error(err);
    }
};
