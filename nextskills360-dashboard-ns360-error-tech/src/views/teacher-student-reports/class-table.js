import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import GroupsIcon from '@mui/icons-material/Groups';

import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'store/selectors';
const ClassTable = ({ rowsData = {}, schoolId = '' }) => {
    const navigate = useNavigate();
    const { project_id } = useSelector(getCurrentUser);
    const data = Object.keys(rowsData);

    return (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table aria-label="class wise table">
                <TableHead>
                    <TableRow>
                        <TableCell>Classes</TableCell>
                        <TableCell align="center">Students Participated</TableCell>
                        <TableCell align="center">Students Registered</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <Typography sx={{ m: 1 }} variant="h4">
                            Loading...
                        </Typography>
                    ) : (
                        data.map((key, i) => (
                            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    Class {key}
                                </TableCell>
                                <TableCell align="center">{rowsData[key].studentsParticipated}</TableCell>
                                <TableCell align="center">
                                    <Grid container alignItems="center" spacing={gridSpacing}>
                                        <Grid item>{rowsData[key].studentsRegistered}</Grid>
                                        <Grid item>
                                            <GroupsIcon
                                                onClick={() => navigate(`reports/${project_id}/students-list/${schoolId}/class/${key}`)}
                                                stroke={1.5}
                                                size="1.3rem"
                                                color="primary"
                                                cursor="pointer"
                                            />
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

ClassTable.propTypes = {
    rowsData: PropTypes.object,
    schoolId: PropTypes.string
};

export default ClassTable;
