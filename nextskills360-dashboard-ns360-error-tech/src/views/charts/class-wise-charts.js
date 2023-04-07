import PropTypes from 'prop-types';
import { useEffect } from 'react';

// material-ui
import { Grid, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/project-level-chart-data';
import percentageData from './chart-data/percentage-chart-data';
import studentWiseChartData from './chart-data/student-wise-marks-chart-data';
import skillWiseChartData from './chart-data/skill-wise-chart-data';

const chartStyle = (theme) => ({
    border: '1px solid',
    borderColor: theme.palette.primary[200] + 75,
    ':hover': {
        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
    },
    borderRadius: 2,
    margin: 2
});

const ClassWiseCharts = ({ isLoading, averageData, percentageIncreased, skillsData, studentsMarks, className }) => {
    let averageChartData = {
        ...chartData,
        series: [
            {
                name: 'Average',
                data: averageData
            }
        ]
    };

    // averageChartData.options.chart.id = averagechartId;

    let percentageChartData = {
        ...percentageData,
        series: [
            {
                name: 'Percentage Increased',
                data: percentageIncreased
            }
        ]
    };

    let skillChartData = {
        ...skillWiseChartData,
        series: [
            {
                name: 'Baseline',
                data: skillsData?.baseline || []
            },
            {
                name: 'Endline',
                data: skillsData?.endline || []
            }
        ]
    };

    skillChartData.options.chart.id = className + 'skills';

    useEffect(() => {
        if (skillsData?.categories) {
            let updateCategories = {
                xaxis: {
                    categories: skillsData?.categories
                }
            };
            ApexCharts.exec(className + 'skills', 'updateOptions', updateCategories);
        }
    }, [skillsData?.categories]);

    let studentsChartData = {
        ...studentWiseChartData,
        series: [
            {
                name: 'Baseline',
                data: studentsMarks?.baseline || []
            },
            {
                name: 'Endline',
                data: studentsMarks?.endline || []
            }
        ]
    };

    studentsChartData.options.chart.id = className + 'students';

    useEffect(() => {
        if (studentsMarks?.categories) {
            let updateCategories = {
                xaxis: {
                    categories: studentsMarks?.categories
                }
            };
            ApexCharts.exec(className + 'students', 'updateOptions', updateCategories);
        }
    }, [studentsMarks?.categories]);

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard sx={{ mb: 1.25 }}>
                    <Typography color="primary" variant="h4" textAlign="center" sx={{ mb: 1 }}>
                        {className}
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
                                            <Typography variant="subtitle1">Baseline Marks and Endline Marks</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Chart {...studentsChartData} />
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
                        <Grid item md={6} xs={12}>
                            <Grid container direction="column" alignItems="center" justifyContent="center" sx={chartStyle}>
                                <Grid item>
                                    <Grid container alignItems="center" justifyContent="center">
                                        <Grid item>
                                            <Typography variant="subtitle1">Skill Wise</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Chart {...skillChartData} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

ClassWiseCharts.propTypes = {
    isLoading: PropTypes.bool,
    averageData: PropTypes.array,
    percentageIncreased: PropTypes.array,
    skillsData: PropTypes.object,
    studentsMarks: PropTypes.object,
    className: PropTypes.string
};

export default ClassWiseCharts;
