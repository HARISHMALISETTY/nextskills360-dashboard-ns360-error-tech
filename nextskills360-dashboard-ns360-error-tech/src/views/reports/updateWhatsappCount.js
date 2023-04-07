import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { useState } from 'react';
import { updateStatusByField } from 'services/project-queries';
import { isValidMobileNumber } from 'utils/form-validations';

export const UpdateWhatsappCount = ({ defaultCount = 0, projectId, open, handleClose }) => {
    const [count, setCount] = useState(Number(defaultCount));

    const handleChange = (e) => {
        setCount(e.target.value);
    };

    const updateCount = (event, reason) => {
        if (reason !== 'backdropClick') {
            handleClose(false);
            if (defaultCount !== count) {
                updateStatusByField(projectId, 'whatsapp_support_requests_count', Number(count));
            }
        }
    };

    const closeModal = (event, reason) => {
        if (reason !== 'backdropClick') {
            handleClose(false);
        }
    };

    const isMobileNumberInvalid = count.length > 0 && !isValidMobileNumber(count);
    const mobileHelperText = isMobileNumberInvalid ? 'Please enter a number' : '';
    const canEnableUpdateButton = isMobileNumberInvalid;
    return (
        <Grid item>
            <Dialog disableEscapeKeyDown open={open}>
                <DialogTitle variant="h4">Update Whatsapp Support Tickets Count</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                        <TextField
                            type="tel"
                            color="secondary"
                            fullWidth
                            name="whatsapp support ticket"
                            label="Count"
                            placeholder="Whatsapp Support Tickets Count"
                            error={isMobileNumberInvalid}
                            helperText={mobileHelperText}
                            variant="outlined"
                            inputMode="tel"
                            inputProps={{ maxLength: 10 }}
                            required
                            size="small"
                            value={count}
                            onChange={handleChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button onClick={updateCount} disabled={canEnableUpdateButton}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

UpdateWhatsappCount.propTypes = {
    defaultCount: PropTypes.number,
    projectId: PropTypes.string.isRequired,
    open: PropTypes.bool,
    handleClose: PropTypes.func
};
