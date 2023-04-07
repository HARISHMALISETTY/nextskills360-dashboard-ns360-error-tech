import { useState } from 'react';
import moment from 'moment';
import { Avatar, Box, Grid, Typography, Paper, useTheme, Tooltip } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAllComments } from 'services/world-gallery';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    border: 'none',
    outline: 'none',
    p: 4
};

const CommentsModal = ({ open, onClose, handlePostComment, uid, postingComment }) => {
    const [comment, setComment] = useState('');

    const [comments, loading, error] = useCollectionData(getAllComments(uid));
    const theme = useTheme();

    if (error) {
        toast.error(error.toString());
        return;
    }

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="Comments" aria-describedby="world-gallery">
            <Box sx={style}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Grid item>
                        <Typography variant="h3">Comments</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton
                            sx={{ color: (theme) => theme.palette.grey[500] }}
                            onClick={onClose}
                            aria-label="close chart modal"
                            component="label"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </Grid>

                <Grid container justifyContent="center" alignItems="center" sx={{ mb: 5 }}>
                    <Grid item position="relative">
                        <textarea
                            style={{
                                borderColor: theme.palette.secondary.dark,
                                borderRadius: '10px',
                                padding: '10px 5px 25px 5px',
                                resize: 'none',
                                fontSize: '16px',
                                display: 'block',
                                fontFamily: 'inherit',
                                outline: theme.palette.primary.main
                            }}
                            maxLength={250}
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                            placeholder="Add comment..."
                            rows={5}
                            cols={30}
                        ></textarea>
                        <LoadingButton
                            sx={{
                                position: 'absolute',
                                transform: 'translateY(-50%)',
                                right: 15,
                                ':disabled': {
                                    backgroundColor: theme.palette.secondary.main,
                                    color: theme.palette.background.default
                                }
                            }}
                            loading={postingComment}
                            onClick={() => handlePostComment(comment).then(() => setComment(''))}
                            variant="contained"
                            color="secondary"
                            size="medium"
                            disabled={comment.trim().length === 0 || postingComment}
                            endIcon={<SendIcon />}
                            loadingPosition="end"
                        >
                            post
                        </LoadingButton>
                    </Grid>
                </Grid>

                <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 300px)', overflowX: 'hidden' }}>
                    {!loading &&
                        comments.map((comment) => {
                            return (
                                <Paper key={comment.comment_uid} style={{ padding: '10px 0', marginTop: 5 }}>
                                    <Grid container wrap="nowrap" spacing={2}>
                                        <Grid item>
                                            <Avatar>{comment.user_name[0].toUpperCase()}</Avatar>
                                        </Grid>
                                        <Grid justifyContent="left" item xs zeroMinWidth>
                                            <h4 style={{ margin: 0, textAlign: 'left' }}>{comment.user_name}</h4>
                                            <p style={{ textAlign: 'left' }}>{comment.comment}</p>
                                            <Tooltip
                                                title={comment.created_at?.toDate().toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })}
                                            >
                                                <p style={{ textAlign: 'left', color: 'gray' }}>
                                                    posted{' '}
                                                    {moment(
                                                        comment.created_at?.toDate().toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })
                                                    ).fromNow()}
                                                </p>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            );
                        })}
                </PerfectScrollbar>
            </Box>
        </Modal>
    );
};

CommentsModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    handlePostComment: PropTypes.func,
    uid: PropTypes.string,
    postingComment: PropTypes.bool
};

export default CommentsModal;
