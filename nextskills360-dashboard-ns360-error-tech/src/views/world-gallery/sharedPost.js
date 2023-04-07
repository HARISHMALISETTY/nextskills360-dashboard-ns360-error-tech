import { Grid } from '@mui/material';
import { commonErrorMessages } from 'constants/errorMessages';
import { roles } from 'constants/roles';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { getPostById } from 'services/world-gallery';
import { getCurrentUser } from 'store/selectors';
import AccessDenied from 'ui-component/AccessDenied';
import ProductPlaceholder from 'ui-component/cards/Skeleton/ProductPlaceholder';
import MediaCard from './media-card';

const SharedPost = () => {
    const { postId } = useParams();
    const user = useSelector(getCurrentUser);
    const [post, loading, error] = useDocumentData(getPostById(postId));

    if (error) {
        toast.error(commonErrorMessages.unknown);
    }

    if (!loading && roles.ADMIN !== user.dashboard_role) {
        if (post?.status && post?.status !== 'approved') {
            return <AccessDenied />;
        }
    }

    return (
        <Grid container justifyContent="center">
            <Grid item>
                {loading ? (
                    <ProductPlaceholder />
                ) : (
                    <MediaCard
                        isImage={post.file_type === 'images'}
                        src={post.download_url}
                        isLoading={loading}
                        uid={postId}
                        status={post?.status}
                        totalLikes={post.total_likes}
                        isLiked={post?.liked_by?.includes(user?.user_uid)}
                        userUID={user?.user_uid}
                        userName={user?.user_name}
                        totalComments={post?.total_comments}
                        postedAt={post?.upload_time}
                        postedBy={post?.user_name}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default SharedPost;
