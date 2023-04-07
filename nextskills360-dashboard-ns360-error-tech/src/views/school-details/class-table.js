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

const ClassTable = ({ rowsData = {}, schoolId = '' }) => {
    const navigate = useNavigate();
    const data = Object.keys(rowsData);

    return (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table aria-label="class wise table">
                <TableHead>
                    <TableRow>
                        <TableCell>Classes</TableCell>
                        <TableCell align="right">Students Participated</TableCell>
                        <TableCell align="center">Students Registered</TableCell>
                        {/* <TableCell align="center">Teachers Participated</TableCell> */}
                        <TableCell align="center">Teachers Registered</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((key, i) => (
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
                                            onClick={() => navigate(`../../students-list/${schoolId}/class/${key}`)}
                                            stroke={1.5}
                                            size="1.3rem"
                                            color="primary"
                                            cursor="pointer"
                                        />
                                    </Grid>
                                </Grid>
                            </TableCell>
                            {/* <TableCell align="center">{rowsData[key].teachersParticipated}</TableCell> */}
                            <TableCell align="center">
                                <Grid container alignItems="center" spacing={gridSpacing}>
                                    <Grid item alignItems="center">
                                        {rowsData[key].teachersRegistered}
                                    </Grid>
                                    <Grid item>
                                        <GroupsIcon
                                            onClick={() => navigate(`../../teachers-list/${schoolId}/class/${key}`)}
                                            stroke={1.5}
                                            size="1.3rem"
                                            color="primary"
                                            cursor="pointer"
                                        />
                                    </Grid>
                                </Grid>
                            </TableCell>
                        </TableRow>
                    ))}
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
