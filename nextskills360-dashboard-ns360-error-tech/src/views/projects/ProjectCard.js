/* eslint-disable react/no-unknown-property */
import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ReactComponent as TeacherIcon } from 'assets/images/icons/teacher.svg';
import { formatNumber } from 'utils/formatNumber';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { ReactComponent as StudentIcon } from 'assets/images/icons/student.svg';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router';
import CountUp from 'react-countup';
import config from 'config';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    maxWidth: 300,
    // height: '100%',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        top: -140,
        right: -70,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

const ProjectCard = ({
    isLoading,
    projectId,
    status,
    updateProjectStatus,
    projectName = 'Asifabad - Full District',
    studentCount = 3022,
    teacherCount = 24
}) => {
    // Initializing required variables and states
    const theme = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [projectStatus, setProjectStatus] = useState(status);

    // Handle project status update on value change
    const handleStatusChange = (event) => {
        setProjectStatus(event.target.value);
    };

    // Open the modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Close the modal after project status update
    const updateStatus = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
            updateProjectStatus(projectId, projectStatus);
        }
    };

    // Close the modal without updating project status
    const closeStatusModal = (event, reason) => {
        if (reason !== 'backdropClick') {
            setProjectStatus(status);
            setOpen(false);
        }
    };

    return (
        <>
            {/* <ProjectReports projectId={projectId} /> */}
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.mediumAvatar,
                                                backgroundColor: theme.palette.primary.dark,
                                                color: theme.palette.primary[200],
                                                zIndex: 1
                                            }}
                                            aria-controls="menu-earning-card"
                                            aria-haspopup="true"
                                        >
                                            <CloudDownloadIcon fontSize="inherit" sx={{ color: 'white' }} />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item onClick={() => navigate(`/reports/${projectId}`)}>
                                <Grid container aligndata="center">
                                    <Grid item>
                                        <Tooltip title={projectName}>
                                            <Typography
                                                noWrap
                                                sx={{
                                                    fontSize: '1.125rem',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    width: '16.5rem',
                                                    fontWeight: 500,
                                                    mr: 1,
                                                    mt: 1.75,
                                                    mb: 0.75,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {projectName}
                                            </Typography>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.5 }}>
                                <Grid container direction="row" justifyContent="space-between" aligndata="center">
                                    <Grid item>
                                        <Grid container alignItems="center" spacing={1} sx={{ mt: 1 }}>
                                            <Grid item>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        ...theme.typography.commonAvatar,
                                                        color: theme.palette.primary[200],
                                                        backgroundColor: theme.palette.primary[800]
                                                    }}
                                                >
                                                    <StudentIcon height={23} fill="#fff" />
                                                    {/* fill={theme.palette.primary[200]} */}
                                                </Avatar>
                                            </Grid>

                                            <Grid item>
                                                <Typography
                                                    sx={{
                                                        fontSize: '1.2rem',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    <CountUp
                                                        start={0}
                                                        end={studentCount}
                                                        duration={config.countUpAnimationDuration}
                                                        formattingFn={formatNumber}
                                                    />
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid container alignItems="center" spacing={1} sx={{ mt: 1 }}>
                                            <Grid item>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        ...theme.typography.commonAvatar,
                                                        color: theme.palette.primary[200],
                                                        backgroundColor: theme.palette.primary[800]
                                                    }}
                                                >
                                                    <TeacherIcon height={24} fill="#fff" width={25} />
                                                </Avatar>
                                            </Grid>

                                            <Grid item>
                                                <Typography
                                                    sx={{
                                                        fontSize: '1.2rem',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    <CountUp
                                                        start={0}
                                                        end={teacherCount}
                                                        duration={config.countUpAnimationDuration}
                                                        formattingFn={formatNumber}
                                                    />
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container flexDirection="row" aligndata="center">
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            {/* <Typography sx={{ fontSize: '1.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}> */}
                                            <Button>
                                                <span style={{ color: 'white', fontSize: '18px' }}>Status : {status}</span>
                                            </Button>
                                        </Grid>
                                        {/* </Typography> */}
                                        <Grid item>
                                            <IconButton onClick={handleClickOpen}>
                                                <EditIcon
                                                    sx={{
                                                        fontSize: '20px',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        verticalAlign: 'middle'
                                                    }}
                                                />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Dialog disableEscapeKeyDown open={open} onClose={closeStatusModal}>
                                        <DialogTitle>Update Project Status</DialogTitle>
                                        <DialogContent>
                                            <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                                    <InputLabel htmlFor="demo-dialog-native">Status</InputLabel>
                                                    <Select
                                                        native
                                                        value={projectStatus}
                                                        onChange={handleStatusChange}
                                                        input={<OutlinedInput label="Status" id="demo-dialog-native" />}
                                                    >
                                                        {/* <option aria-label="None" value="" /> */}
                                                        <option value="Not Started">Not Started</option>
                                                        <option value="Ongoing">Ongoing</option>
                                                        <option value="Completed">Completed</option>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={closeStatusModal}>Cancel</Button>
                                            <Button onClick={updateStatus}>Update</Button>
                                        </DialogActions>
                                    </Dialog>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

ProjectCard.propTypes = {
    isLoading: PropTypes.bool,
    projectName: PropTypes.string,
    studentCount: PropTypes.number,
    teacherCount: PropTypes.number,
    projectId: PropTypes.string,
    status: PropTypes.string,
    updateProjectStatus: PropTypes.func
};

export default ProjectCard;
