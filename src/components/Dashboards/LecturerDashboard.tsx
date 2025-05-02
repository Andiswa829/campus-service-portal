import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Events } from './StudentDashboard';
import { fetchLecturerSubjects } from '../../api/api';
import { UserProfileDetails } from '../Authentication/UserProfile';

interface LecturerDashboardProps {
  userId: number;
}

export interface Subject {
  id: string;
  subjectName: string;
  description: string;
  subjectCode: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com' },
  ]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'update'>('add');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [events, setEvents] = useState<Events[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLecturerSubjects(userId);
        setSubjects(data);
      } catch (err) {
        setError('Could not fetch subjects');
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    // Mock data fetching
    setEvents([
      {
        id: '1',
        title: 'AI Workshop',
        date: 'May 10, 2025',
        description: 'Learn the basics of AI and machine learning.',
      },
      {
        id: '2',
        title: 'Cultural Fest',
        date: 'May 20, 2025',
        description: 'Celebrate diversity with music, food, and art.',
      },
    ]);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDialogOpen = (mode: 'add' | 'update', student?: Student) => {
    setDialogMode(mode);
    setSelectedStudent(student || null);
    setFormData(student || { name: '', email: '' });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData({ name: '', email: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    if (dialogMode === 'add') {
      const newStudent = {
        id: students.length + 1,
        ...formData,
      };
      setStudents((prev) => [...prev, newStudent]);
    } else if (dialogMode === 'update' && selectedStudent) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id ? { ...student, ...formData } : student
        )
      );
    }
    handleDialogClose();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: '32px 0',
        backgroundColor: '#f5f5f5', // Light gray background
      }}
    >
        <UserProfileDetails userId={userId} /> {/* User Profile Menu */}
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Lecturer Dashboard
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Manage your students, notifications, and more.
        </Typography>

        {/* Tab Menu */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Lecturer Dashboard Tabs"
            centered
          >
            <Tab label="Home" />
            <Tab label="Students" />
            <Tab label="Notifications" />
            <Tab label="My Subjects" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
           <Container>
        <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>
                  Upcoming Classes
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
        )}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Students
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginBottom: 2 }}
              onClick={() => handleDialogOpen('add')}
            >
              Add Student
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleDialogOpen('update', student)}
                          sx={{ marginRight: 1 }}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Add/Update Dialog */}
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
              <DialogTitle>
                {dialogMode === 'add' ? 'Add Student' : 'Update Student'}
              </DialogTitle>
              <DialogContent>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleFormSubmit} color="primary">
                  {dialogMode === 'add' ? 'Add' : 'Update'}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
        {activeTab === 3 && (
            <Box>
                  <Grid container spacing={3}>
          {subjects.map((subject) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {subject.subjectName} ({subject.subjectCode})
                  </Typography>
                  <Typography variant="body2">{subject.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        </Box>
       )}
      </Container>
    </Box>
  );
};

export default LecturerDashboard;