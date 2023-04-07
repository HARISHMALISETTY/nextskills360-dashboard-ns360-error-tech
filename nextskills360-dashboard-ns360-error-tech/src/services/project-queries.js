import { firestoreCollections } from 'constants/collectionNames';
import { collection, doc, orderBy, query, getDocs, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from 'firebase_setup/firebase';

export const getProjectDataById = (projectId) => doc(db, firestoreCollections.projects, projectId);

export const getAllProjects = (orderByFieldPath = 'project_academic_year', order = 'desc') =>
    query(collection(db, firestoreCollections.projects), orderBy(orderByFieldPath, order));

export const updateProjectStatus = async (projectId, projectStatus) => {
    const q = query(collection(db, firestoreCollections.projects, projectId, 'memberships'));

    const batch = writeBatch(db);

    const querySnapshot = await getDocs(q);

    batch.update(doc(db, firestoreCollections.projects, projectId), { project_status: projectStatus });

    querySnapshot.forEach((doc) => batch.update(doc.ref, { project_status: projectStatus }));

    batch.commit();
};
export const updateStatusByField = (projectId, field, value) =>
    updateDoc(doc(db, firestoreCollections.projects, projectId), { [field]: value });
