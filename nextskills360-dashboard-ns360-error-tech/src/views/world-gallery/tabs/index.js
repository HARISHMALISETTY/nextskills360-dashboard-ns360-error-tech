import PropTypes from 'prop-types';
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { AllTabPanel } from './panels/all';
import { ProGameInActionTabPanel } from './panels/progameInAction';
import { ProGameActivitiesTabPanel } from './panels/progameActivities';
import { UnapprovedTabPanel } from './panels/unapproved';
import { DisapprovedTabPanel } from './panels/disapproved';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'store/selectors';
import { roles } from 'constants/roles';
import { FeaturedTabPanel } from './panels/featured';
import { ProjectsAutoComplete } from '../projectsAutocomplete';
import { Grid, useTheme } from '@mui/material';

function a11yProps(index) {
    return {
        id: `world-gallery-tab-${index}`,
        'aria-controls': `world-gallery-tabpanel-${index}`
    };
}

const WorldGalleryTabs = ({ projectId = '', projectsList, autoCompleteProps }) => {
    const { dashboard_role } = useSelector(getCurrentUser);
    const [tabIndex, setTabIndex] = useState(0);
    const theme = useTheme();
    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Grid
                    container
                    alignItems="center"
                    sx={{
                        [theme.breakpoints.down('sm')]: {
                            flexDirection: 'column-reverse'
                        }
                    }}
                >
                    <Grid item md={9} sm={8} xs={12}>
                        <Tabs
                            value={tabIndex}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            aria-label="World Gallery Tabs"
                        >
                            <Tab label="All" {...a11yProps(0)} />
                            <Tab label="Featured" {...a11yProps(1)} />
                            <Tab label="ProGame-In-Action" {...a11yProps(2)} />
                            <Tab label="ProGame Activities" {...a11yProps(3)} />
                            {dashboard_role === roles.ADMIN && <Tab label="UnApproved" {...a11yProps(4)} />}
                            {dashboard_role === roles.ADMIN && <Tab label="Disapproved" {...a11yProps(5)} />}
                        </Tabs>
                    </Grid>
                    <Grid
                        item
                        md={3}
                        sm={4}
                        xs={12}
                        sx={{
                            [theme.breakpoints.down('sm')]: {
                                width: '100%'
                            }
                        }}
                    >
                        <ProjectsAutoComplete {...autoCompleteProps} />
                    </Grid>
                </Grid>
            </Box>

            <AllTabPanel projectId={projectId} projectsList={projectsList} index={0} value={tabIndex} />
            <FeaturedTabPanel projectId={projectId} projectsList={projectsList} index={1} value={tabIndex} />
            <ProGameInActionTabPanel projectId={projectId} projectsList={projectsList} index={2} value={tabIndex} />
            <ProGameActivitiesTabPanel projectId={projectId} projectsList={projectsList} index={3} value={tabIndex} />
            {dashboard_role === roles.ADMIN && <UnapprovedTabPanel projectId={projectId} index={4} value={tabIndex} />}
            {dashboard_role === roles.ADMIN && <DisapprovedTabPanel projectId={projectId} index={5} value={tabIndex} />}
        </>
    );
};

WorldGalleryTabs.propTypes = {
    projectId: PropTypes.string,
    projectsList: PropTypes.array.isRequired,
    autoCompleteProps: PropTypes.object.isRequired
};

export default WorldGalleryTabs;
