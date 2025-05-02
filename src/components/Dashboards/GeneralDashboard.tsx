import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Grid, Container, Box } from '@mui/material';

const GeneralDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundImage: 'url("/assets/campus-background.jpg")', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '32px 0',
      }}
    >
      <Container>
        {/* Login Button */}
        <Button
          variant="contained"
          color="primary"
          style={{ position: 'absolute', top: '16px', right: '16px' }}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>

        <Typography variant="h3" align="center" gutterBottom style={{ color: '#fff' }}>
          Welcome to the Smart Campus Services Portal
        </Typography>
        <Typography variant="body1" align="center" paragraph style={{ color: '#fff' }}>
          Explore the latest updates and events happening on campus.
        </Typography>

        {/* Campus News Section */}
        <Typography variant="h4" gutterBottom style={{ color: '#fff' }}>
          Campus News
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{xs:12, sm:6, md:4}}>
            <Card>
              <CardContent>
                <Typography variant="h5">New Library Hours</Typography>
                <Typography variant="body2">
                  New library hours announced starting next week.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{xs:12,sm:6,md:4}}>
            <Card>
              <CardContent>
                <Typography variant="h5">Tech Seminar</Typography>
                <Typography variant="body2">
                  Campus to host a tech seminar on AI advancements.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{xs:12,sm:6,md:4}}>
            <Card>
              <CardContent>
                <Typography variant="h5">Sports Day</Typography>
                <Typography variant="body2">
                  Sports day scheduled for the 15th of this month.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Upcoming Events Section */}
        <Typography variant="h4" gutterBottom style={{ marginTop: '32px', color: '#fff' }}>
          Upcoming Events
        </Typography>
        <Grid container spacing={3}>
        <Grid size={{xs:12,sm:6,md:4}}>
            <Card>
              <CardContent>
                <Typography variant="h5">Cloud Computing Workshop</Typography>
                <Typography variant="body2">
                  May 10th: Workshop on "Introduction to Cloud Computing".
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{xs:12,sm:6,md:4}}>
            <Card>
              <CardContent>
                <Typography variant="h5">Guest Lecture</Typography>
                <Typography variant="body2">
                  May 12th: Lecture on "Future of Education".
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{xs:12,sm:6,md:4}}>
            <Card>
              <CardContent>
                <Typography variant="h5">Cultural Fest</Typography>
                <Typography variant="body2">
                  May 20th: Annual Cultural Fest.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* About the Portal Section */}
        <Typography variant="h4" gutterBottom style={{ marginTop: '32px', color: '#fff' }}>
          About the Portal
        </Typography>
        <Typography variant="body1" paragraph style={{ color: '#fff' }}>
          The Smart Campus Services Portal is your one-stop solution for managing campus activities,
          accessing resources, and staying updated with the latest news and events.
        </Typography>

        {/* Contact Support Section */}
        <Typography variant="h4" gutterBottom style={{ marginTop: '32px', color: '#fff' }}>
          Contact Support
        </Typography>
        <Typography variant="body1" style={{ color: '#fff' }}>
          If you have any questions, feel free to reach out to our support team at{' '}
          <a href="mailto:support@campusportal.com" style={{ color: '#90caf9' }}>
            support@campusportal.com
          </a>.
        </Typography>

        {/* Login or Sign Up Section */}
        <Typography variant="h4" gutterBottom style={{ marginTop: '32px', color: '#fff' }}>
          Login or Sign Up
        </Typography>
        <Typography variant="body1" style={{ color: '#fff' }}>
          <a href="/login" style={{ color: '#90caf9' }}>Log in</a> or{' '}
          <a href="/signup" style={{ color: '#90caf9' }}>Sign up</a> to access personalized features
          and services.
        </Typography>
      </Container>
    </Box>
  );
};

export default GeneralDashboard;