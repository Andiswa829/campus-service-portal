import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Container, Menu, MenuItem, IconButton, Avatar, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {UserProfileDetails} from '../Authentication/UserProfile';

interface NewsItem {
  id: string;
  title: string;
  description: string;
}

interface Subject {
  id: string;
  subjectName: string;
  subjectCode: string;
  description: string;
}

export interface Events {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface StudentDashboardProps {
  userId: number;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [events, setEvents] = useState<Events[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewProfile = () => {
    navigate('/profile'); // Navigate to the profile page
    handleMenuClose();
  };

  const handleSignOut = () => {
    // Add sign-out logic here
    handleMenuClose();
  };

  useEffect(() => {
    // Mock data fetching
    setNews([
      { id: '1', title: 'Library Hours Update', description: 'The library will now be open until 10 PM.' },
      { id: '2', title: 'New Cafeteria Menu', description: 'Check out the new healthy options in the cafeteria.' },
    ]);

    setSubjects([
      { id: '1', subjectName: 'Mathematics 101', subjectCode: 'MATH101', description: 'Basic mathematics concepts.' },
      { id: '2', subjectName: 'Physics 201', subjectCode: 'PHYS201', description: 'Intermediate physics topics.' },
    ]);

    setEvents([
      { id: '1', title: 'AI Workshop', date: 'May 10, 2025', description: 'Learn the basics of AI and machine learning.' },
      { id: '2', title: 'Cultural Fest', date: 'May 20, 2025', description: 'Celebrate diversity with music, food, and art.' },
    ]);
  }, []);

  return (
    <Box
    sx={{
        minHeight: '100vh',
        padding: '32px 0',
        backgroundColor: '#efe7e7', // Light gray background
        position: 'relative',
      }}
    >
      {/* User Profile Menu */}
      <UserProfileDetails userId={userId} />

      <Container>
        <Typography variant="h3" align="center" gutterBottom>
          Student Dashboard
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Welcome to your personalized dashboard. Stay updated with the latest news, subjects, and events.
        </Typography>

        {/* Latest News Section */}
        <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>
          Announcements
        </Typography>
        <Grid container spacing={3}>
          {news.map((item) => (
               <Grid size={{xs:12,sm:6,md:4}}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2">{item.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* My Subjects Section */}
        <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>
          My Subjects
        </Typography>
        <Grid container spacing={3}>
          {subjects.map((subject) => (
               <Grid size={{xs:12,sm:6,md:4}}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {subject.subjectName} ({subject.subjectCode})
                  </Typography>
                  <Typography variant="body2">{subject.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Upcoming Events Section */}
        <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>
          Upcoming Events
        </Typography>
        <Grid container spacing={3}>
          {events.map((event) => (
              <Grid size={{xs:12,sm:6,md:4}}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {event.date}
                  </Typography>
                  <Typography variant="body2">{event.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentDashboard;