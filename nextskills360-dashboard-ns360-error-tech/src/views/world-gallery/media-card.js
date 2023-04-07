import PropTypes from 'prop-types';
import { useState, memo, useMemo } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, Typography, Tooltip } from '@mui/material';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ShareIcon from '@mui/icons-material/Share';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import Card from '@mui/material/Card';
import { addComment, addLikeToPost, updateMediaStatusWithCategory } from 'services/world-gallery';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'store/selectors';
import CommentsModal from './commentModal';
import { toast } from 'react-toastify';
import moment from 'moment';
import { roles } from 'constants/roles';

import MediaItem from './mediaItem';
import SocialMediaShareModal from './socialMediaShareModal';

const MediaCard = ({
    isLoading,
    isImage,
    src,
    uid,
    status,
    isLiked,
    totalLikes,
    userUID,
    userName,
    totalComments,
    postedBy = '',
    postedAt = '',
    handleStatusChange
}) => {
    // Define states and constants
    const user = useSelector(getCurrentUser);
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [liked, setLiked] = useState(isLiked);
    const [totalPeopleLiked, setTotalPeopleLiked] = useState(totalLikes || 0);
    const [totalPeopleCommented, setTotalPeopleCommented] = useState(totalComments || 0);

    const shareURL = useMemo(() => {
        return process.env.REACT_APP_postShareLink.replace(':postId', uid);
    }, [uid]);

    const [category, setCategory] = useState('featured');
    const [postStatus, setPostStatus] = useState(status);

    // Handle category change
    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    // Open category modal
    const handleOpenCategory = () => {
        setOpen(true);
    };

    // Close category modal
    const handleCloseCategory = (event, reason, isUpdate) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }

        if (isUpdate) {
            setPostStatus('approved');
            handleStatusChange && handleStatusChange(uid);
            updateMediaStatusWithCategory(uid, 'approved', category);
        }
    };

    // Open options dropdown
    const handleOpenOptions = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close options dropdown and update post status
    const handleCloseOptions = (isApprove) => {
        setAnchorEl(null);
        if (isApprove) {
            handleOpenCategory();
        } else if (isApprove !== undefined) {
            setPostStatus('disapproved');
            handleStatusChange && handleStatusChange(uid);
            updateMediaStatusWithCategory(uid, 'disapproved');
        }
    };

    // Define states for comments and shares
    const [openCommentModal, setOpenCommentModal] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const [postingComment, setPostingComment] = useState(false);

    // Open modal for commenting on post
    const openCommentsModal = () => setOpenCommentModal(true);

    // Close modal for commenting on post
    const closeCommentsModal = () => setOpenCommentModal(false);

    // Open modal for sharing post
    const handleOpenShareModal = () => setOpenShare(true);

    // Close modal for sharing post
    const handleCloseShareModal = () => setOpenShare(false);

    // Handle likes on post
    const handleLikes = (like) => {
        setLiked(like);
        const likesCount = like ? totalPeopleLiked + 1 : totalPeopleLiked - 1;
        setTotalPeopleLiked(likesCount);
        addLikeToPost(uid, userUID, !liked);
    };

    // Handle adding comment to post
    const handlePostComment = async (comment) => {
        setPostingComment(true);
        const commentData = {
            user_uid: userUID,
            comment: comment,
            user_name: userName,
            post_uid: uid
        };

        return await addComment(uid, commentData)
            .then(() => {
                setTotalPeopleCommented((prev) => prev + 1);
            })
            .catch(() => toast.error('Something went wrong.'))
            .finally(() => setPostingComment(false));
    };

    const formatPostedAt = useMemo(() => {
        return (date) => moment(new Date(date)).format('MMMM DD, yyyy');
    }, []);

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <Grid container direction="column">
                    <Grid item>
                        <Grid container justifyContent="flex-end">
                            <Card sx={{ justifyContent: 'center', width: '280px' }}>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            sx={{
                                                backgroundColor: theme.palette.secondary.dark,
                                                color: theme.palette.secondary.contrastText
                                            }}
                                            aria-label="Profile"
                                        >
                                            {postedBy && postedBy[0].toUpperCase()}
                                        </Avatar>
                                    }
                                    action={
                                        user.dashboard_role === roles.ADMIN && (
                                            <IconButton
                                                aria-label="Options"
                                                aria-haspopup="true"
                                                onClick={handleOpenOptions}
                                                aria-controls="menu-earning-card"
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        )
                                    }
                                    title={
                                        <Tooltip title={postedBy}>
                                            <Typography
                                                noWrap
                                                sx={{
                                                    fontSize: '1.125rem',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    width: '140px',
                                                    fontWeight: 500
                                                }}
                                            >
                                                {postedBy}
                                            </Typography>
                                        </Tooltip>
                                    }
                                    subheader={formatPostedAt(postedAt)}
                                />
                                <CardMedia sx={{ alignItems: 'center', valign: 'middle' }}>
                                    <MediaItem isImage={isImage} src={src} />
                                </CardMedia>
                                <CardActions sx={{ justifyContent: 'space-between' }}>
                                    <IconButton
                                        sx={{ color: liked ? 'red' : 'grey' }}
                                        aria-label="add to favorites"
                                        onClick={() => handleLikes(!liked)}
                                    >
                                        <ThumbUpOffAltIcon />
                                    </IconButton>
                                    {totalPeopleLiked}
                                    <IconButton
                                        sx={{ color: totalPeopleCommented > 0 ? 'red' : 'grey' }}
                                        aria-label="Comment"
                                        onClick={openCommentsModal}
                                    >
                                        <ModeCommentOutlinedIcon />
                                    </IconButton>
                                    {totalPeopleCommented}
                                    <Grid container justifyContent="flex-end">
                                        <IconButton aria-label="share" onClick={handleOpenShareModal}>
                                            <ShareIcon />
                                        </IconButton>
                                    </Grid>
                                </CardActions>
                            </Card>

                            <Menu
                                id="menu-earning-card"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={() => handleCloseOptions()}
                                variant="selectedMenu"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                            >
                                {[undefined, 'unapproved', 'disapproved'].includes(postStatus) && (
                                    <MenuItem onClick={() => handleCloseOptions(true)}>
                                        <CheckIcon sx={{ mr: 1.75 }} /> Approve
                                    </MenuItem>
                                )}
                                {[undefined, 'unapproved', 'approved'].includes(postStatus) && (
                                    <MenuItem onClick={() => handleCloseOptions(false)}>
                                        <ClearIcon sx={{ mr: 1.75 }} /> Disapprove
                                    </MenuItem>
                                )}
                            </Menu>
                            <Dialog disableEscapeKeyDown open={open}>
                                <DialogTitle variant="h5">Select post category</DialogTitle>
                                <DialogContent>
                                    <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                                            <InputLabel htmlFor="demo-dialog-native">category</InputLabel>
                                            <Select
                                                native
                                                value={category}
                                                onChange={handleChange}
                                                input={<OutlinedInput label="Status" id="demo-dialog-native" />}
                                            >
                                                <option value="featured">Featured</option>
                                                <option value="progame_in_action">ProGame-In-Action</option>
                                                <option value="progame_activities">ProGame Activities</option>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={(e, reason) => handleCloseCategory(e, reason, false)}>Cancel</Button>
                                    <Button onClick={(e, reason) => handleCloseCategory(e, reason, true)}>Ok</Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            {openCommentModal && (
                <CommentsModal
                    uid={uid}
                    onClose={closeCommentsModal}
                    postingComment={postingComment}
                    open={openCommentModal}
                    handlePostComment={handlePostComment}
                />
            )}
            {openShare && <SocialMediaShareModal openShare={openShare} handleCloseShareModal={handleCloseShareModal} shareURL={shareURL} />}
        </>
    );
};

MediaCard.propTypes = {
    isLoading: PropTypes.bool,
    isImage: PropTypes.bool,
    src: PropTypes.string,
    uid: PropTypes.string,
    status: PropTypes.string,
    isLiked: PropTypes.bool,
    totalLikes: PropTypes.number,
    userUID: PropTypes.string,
    userName: PropTypes.string,
    totalComments: PropTypes.number,
    postedBy: PropTypes.string,
    postedAt: PropTypes.number,
    handleStatusChange: PropTypes.func
};

export default memo(MediaCard);
