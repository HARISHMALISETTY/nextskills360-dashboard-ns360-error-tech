import { db } from 'firebase_setup/firebase';
import {
    doc,
    query,
    where,
    collection,
    updateDoc,
    increment,
    collectionGroup,
    arrayRemove,
    Timestamp,
    setDoc,
    arrayUnion,
    orderBy
} from 'firebase/firestore';
import { firestoreCollections } from 'constants/collectionNames';
import { roles } from 'constants/roles';

export const getAllPhotosAndVideos = (projectId, role, projectsList = []) => {
    if (roles.ADMIN === role) {
        if (projectId) {
            return query(
                collection(db, firestoreCollections.photosAndVideos),
                where('project_id', '==', projectId),
                orderBy('upload_time', 'desc')
            );
        }
        return query(collection(db, firestoreCollections.photosAndVideos), orderBy('upload_time', 'desc'));
    }

    if (projectId) {
        return query(
            collection(db, firestoreCollections.photosAndVideos),
            where('project_id', '==', projectId),
            where('status', '==', 'approved'),
            orderBy('upload_time', 'desc')
        );
    } else {
        return query(
            collection(db, firestoreCollections.photosAndVideos),
            where('project_id', 'in', projectsList),
            where('status', '==', 'approved'),
            orderBy('upload_time', 'desc')
        );
    }
};

export const getPostById = (uid) => query(doc(collection(db, firestoreCollections.photosAndVideos), uid));

export const getAllPhotosAndVideosByCategory = (projectId, status, role, category = '', projectsList = []) => {
    if (roles.ADMIN === role) {
        if (projectId) {
            if (category.length > 0) {
                return query(
                    collection(db, firestoreCollections.photosAndVideos),
                    where('project_id', '==', projectId),
                    where('status', '==', status),
                    where('category', '==', category),
                    orderBy('upload_time', 'desc')
                );
            } else {
                return query(
                    collection(db, firestoreCollections.photosAndVideos),
                    where('project_id', '==', projectId),
                    where('status', '==', status),
                    orderBy('upload_time', 'desc')
                );
            }
        } else {
            if (category.length > 0) {
                return query(
                    collection(db, firestoreCollections.photosAndVideos),
                    where('status', '==', status),
                    where('category', '==', category),
                    orderBy('upload_time', 'desc')
                );
            } else {
                return query(
                    collection(db, firestoreCollections.photosAndVideos),
                    where('status', '==', status),
                    orderBy('upload_time', 'desc')
                );
            }
        }
    }

    if (projectId) {
        return query(
            collection(db, firestoreCollections.photosAndVideos),
            where('project_id', '==', projectId),
            where('status', '==', 'approved'),
            where('category', '==', category),
            orderBy('upload_time', 'desc')
        );
    } else {
        return query(
            collection(db, firestoreCollections.photosAndVideos),
            where('project_id', 'in', projectsList),
            where('status', '==', 'approved'),
            where('category', '==', category),
            orderBy('upload_time', 'desc')
        );
    }
    // } else {
    //     return query(
    //         collection(db, firestoreCollections.photosAndVideos),
    //         where('project_id', '==', projectId),
    //         where('status', '==', 'approved')
    //     );
    // }
};

export const updateMediaStatus = (uid, mediaStatus) => {
    updateDoc(doc(db, firestoreCollections.photosAndVideos, uid), { status: mediaStatus });
};

export const updateMediaStatusWithCategory = (uid, mediaStatus, categoryName = '') => {
    updateDoc(doc(db, firestoreCollections.photosAndVideos, uid), { status: mediaStatus, category: categoryName });
};

export const addLikeToPost = async (uid, userId, isLike = true) => {
    const newDocRef = doc(collection(db, firestoreCollections.photosAndVideos), uid);
    if (isLike) {
        await updateDoc(newDocRef, { liked_by: arrayUnion(userId), total_likes: increment(1) });
    } else {
        await updateDoc(newDocRef, { liked_by: arrayRemove(userId), total_likes: increment(-1) });
    }
};

export const addComment = async (uid, data) => {
    const photoAndVideosRef = doc(collection(db, firestoreCollections.photosAndVideos), uid);
    const commentsRef = doc(collection(db, firestoreCollections.photosAndVideos, uid, 'comments'));
    await updateDoc(photoAndVideosRef, { total_comments: increment(1) });
    await setDoc(commentsRef, { ...data, comment_uid: commentsRef.id, created_at: Timestamp.now() });
};

export const getAllComments = (uid) => {
    return query(collectionGroup(db, 'comments'), where('post_uid', '==', uid), orderBy('created_at', 'desc'));
};
