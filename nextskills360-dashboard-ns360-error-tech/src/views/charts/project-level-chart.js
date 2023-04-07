import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';

// chart data
import chartData from './chart-data/project-level-chart-data';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const ProjectLevelChart = ({ isLoading, data, chartId }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const { navType } = customization;
    const { primary } = theme.palette.text;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;

    useEffect(() => {
        const newChartData = {
            ...chartData.options,
            colors: [secondaryMain, primaryDark],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary]
                    }
                },
                decimalsInFloat: 1
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                },
                decimalsInFloat: 1
            },
            grid: {
                borderColor: grey200
            },
            tooltip: {
                theme: 'light'
            },
            legend: {
                labels: {
                    colors: grey500
                }
            },
            series: [
                {
                    name: 'Average',
                    data: data
                }
            ]
        };

        // do not load chart when loading
        if (!isLoading) {
            ApexCharts.exec(chartId, 'updateOptions', newChartData);
        }
    }, [navType, secondaryMain, primary, grey200, isLoading, grey500, data]);
    let averageChartData = { ...chartData };
    averageChartData.options.chart.id = chartId;
    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container direction="column" alignItems="center">
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="center">
                                <Grid item>
                                    <Typography variant="subtitle1">Baseline-Marks Vs Endline-Marks</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart {...averageChartData} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

ProjectLevelChart.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.array,
    chartId: PropTypes.string
};

export default ProjectLevelChart;
