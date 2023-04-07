import { Container, Grid } from '@mui/material';

const AccessDenied = () => {
    return (
        <Container maxWidth="sm">
            <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
                <Grid item>
                    <img src={require('assets/images/auth/access-denied.jpg')} alt="Access Denied" height="auto" width="100%" />
                </Grid>
            </Grid>
        </Container>
    );
};

export default AccessDenied;
