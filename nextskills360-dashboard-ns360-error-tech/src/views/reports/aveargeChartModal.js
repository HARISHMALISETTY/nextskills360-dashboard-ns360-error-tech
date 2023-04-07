import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ProjectLevelChart from 'views/charts/project-level-chart';
import { Grid, IconButton, Typography } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { getProjectAverageChartData } from 'services/reports';

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

const AverageChartModal = ({ open, handleModalClose, projectName, projectId }) => {
    const [chartData, setChartData] = useState([0, 0]);

    useEffect(() => {
        getProjectAverageChartData(projectId).then((marks) => setChartData(marks));
    }, []);

    const chartId = 'project-level-average-chart';

    return (
        <div>
            <Modal
                open={open}
                onClose={handleModalClose}
                aria-labelledby="project-average-chart"
                aria-describedby="baseline vs endline marks"
            >
                <Box sx={style}>
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Grid item>
                            <Typography variant="subtitle1">{projectName}</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                sx={{ color: (theme) => theme.palette.grey[500] }}
                                onClick={handleModalClose}
                                aria-label="close chart modal"
                                component="label"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>

                    <ProjectLevelChart chartId={chartId} data={chartData} />
                </Box>
            </Modal>
        </div>
    );
};

AverageChartModal.propTypes = {
    open: PropTypes.bool,
    handleModalClose: PropTypes.func,
    projectName: PropTypes.string,
    projectId: PropTypes.string
};

export default AverageChartModal;
