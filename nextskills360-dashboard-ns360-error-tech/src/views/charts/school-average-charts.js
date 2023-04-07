import PropTypes from 'prop-types';
// material-ui
import { Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/project-level-chart-data';
import percentageData from './chart-data/percentage-chart-data';

const chartStyle = (theme) => ({
    border: '1px solid',
    borderColor: theme.palette.primary[200] + 75,
    ':hover': {
        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
    },
    borderRadius: 2,
    margin: 2
});

const SchoolAverageCharts = ({ isLoading, averageData, percentageIncreased, schoolName }) => {
    let averageChartData = {
        ...chartData,
        series: [
            {
                name: 'Average',
                data: averageData
            }
        ]
    };

    let percentageChartData = {
        ...percentageData,
        series: [
            {
                name: 'Percentage Increased',
                data: percentageIncreased
            }
        ]
    };

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <>
                    <MainCard sx={{ mb: 1.25 }}>
                        <Typography color="primary" variant="h4" textAlign="center" sx={{ mb: 1.25 }}>
                            {schoolName} - Reports
                        </Typography>
                        <Grid container spacing={gridSpacing}>
                            <Grid item md={6} xs={12}>
                                <Grid container direction="column" alignItems="center" justifyContent="center" sx={chartStyle}>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item>
                                                <Typography variant="subtitle1">Baseline-Marks Vs Endline-Marks</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Chart {...averageChartData} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Grid container direction="column" alignItems="center" justifyContent="center" sx={chartStyle}>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item>
                                                <Typography variant="subtitle1">Percentage Increased</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Chart {...percentageChartData} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </MainCard>
                </>
            )}
        </>
    );
};

SchoolAverageCharts.propTypes = {
    isLoading: PropTypes.bool,
    averageData: PropTypes.array,
    percentageIncreased: PropTypes.array,
    schoolAveragechartId: PropTypes.string,
    schoolPercentagechartId: PropTypes.string,
    schoolName: PropTypes.string
};

export default SchoolAverageCharts;
