import PropTypes from 'prop-types';
// material-ui
import { Box, Grid, Typography, Paper } from '@mui/material';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    LinkedinShareButton,
    LinkedinIcon,
    TwitterIcon,
    WhatsappIcon,
    EmailShareButton,
    EmailIcon,
    FacebookMessengerShareButton,
    FacebookMessengerIcon,
    TelegramShareButton,
    TelegramIcon
} from 'react-share';

import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';

import Modal from '@mui/material/Modal';
import { memo } from 'react';

const SocialMediaShareModal = ({ openShare, handleCloseShareModal, shareURL }) => {
    return (
        <Modal
            open={openShare}
            onClose={handleCloseShareModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                className="modalBox"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: '10px',
                    height: 150
                }}
            >
                <Paper style={{ padding: '40px 25px 25px 65px' }}>
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Grid item>
                            <Typography variant="h1">Share</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                sx={{ color: (theme) => theme.palette.grey[500] }}
                                onClick={handleCloseShareModal}
                                aria-label="close chart modal"
                                component="label"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <FacebookShareButton url={shareURL}>
                                <FacebookIcon size={32} round />
                            </FacebookShareButton>
                        </Grid>
                        <Grid item xs={2}>
                            <EmailShareButton url={shareURL}>
                                <EmailIcon size={32} round />
                            </EmailShareButton>
                        </Grid>
                        <Grid item xs={2}>
                            <TwitterShareButton url={shareURL}>
                                <TwitterIcon size={32} round />
                            </TwitterShareButton>
                        </Grid>
                        <Grid item xs={2}>
                            <LinkedinShareButton url={shareURL}>
                                <LinkedinIcon size={32} round />
                            </LinkedinShareButton>
                        </Grid>
                        <Grid item xs={2}>
                            <WhatsappShareButton url={shareURL}>
                                <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                        </Grid>
                        <Grid item xs={2}>
                            <FacebookMessengerShareButton url={shareURL}>
                                <FacebookMessengerIcon size={32} round />
                            </FacebookMessengerShareButton>
                        </Grid>
                        <Grid item xs={2}>
                            <TelegramShareButton url={shareURL}>
                                <TelegramIcon size={32} round />
                            </TelegramShareButton>
                        </Grid>
                        {/* <Grid item xs={2}>
                    <PinterestShareButton url={shareURL}>
                        <PinterestIcon size={32} round />
                    </PinterestShareButton>
                </Grid> */}
                    </Grid>
                </Paper>
            </Box>
        </Modal>
    );
};

SocialMediaShareModal.propTypes = {
    openShare: PropTypes.bool,
    handleCloseShareModal: PropTypes.func,
    shareURL: PropTypes.string.isRequired
};

export default memo(SocialMediaShareModal);
