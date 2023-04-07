import { Autocomplete, Grid, TextField, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

export const ProjectsAutoComplete = ({ options, selectedOption, setSelectedOption, optionsLoading, defaultProject }) => {
    const theme = useTheme();
    return (
        <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} sx={{ [theme.breakpoints.up('sm')]: { width: 290 }, [theme.breakpoints.down('sm')]: { width: 170 } }}>
                <Autocomplete
                    id="search-project-wise-photos-and-videos"
                    options={options}
                    fullWidth
                    loading={optionsLoading}
                    // inputValue={selectedOption}
                    value={selectedOption}
                    defaultValue={defaultProject}
                    isOptionEqualToValue={(option, value) => option.label === value}
                    onChange={(_event, value) => {
                        if (value) {
                            setSelectedOption({ label: value.label, id: value.id });
                        } else {
                            setSelectedOption({ label: 'All Projects', id: '0' });
                        }
                    }}
                    size="small"
                    renderInput={(params) => <TextField color="secondary" {...params} label="Select Project" />}
                />
            </Grid>
        </Grid>
    );
};

ProjectsAutoComplete.propTypes = {
    options: PropTypes.array,
    selectedOption: PropTypes.string,
    setSelectedOption: PropTypes.func,
    optionsLoading: PropTypes.bool,
    defaultProject: PropTypes.string
};
