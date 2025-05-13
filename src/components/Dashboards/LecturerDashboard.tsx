import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { fetchLecturerSubjects } from "../../api/api";
import { UserProfileDetails } from "../Authentication/UserProfile";
import { Events, NotificationType } from "../../api/models";
//import { Notifications } from '@mui/icons-material';
import {
  createNotifcation,
  getNotificationTypes,
  NotificationDto,
} from "../../api/notification";
import { NotificationAdd } from "@mui/icons-material";

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
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com" },
    { id: 2, name: "Bob Smith", email: "bob.smith@example.com" },
  ]);
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "1",
      subjectName: "Mathematics",
      description: "Math basics",
      subjectCode: "MATH101",
    },
    {
      id: "2",
      subjectName: "Physics",
      description: "Physics fundamentals",
      subjectCode: "PHYS201",
    },
  ]);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: 0,
    subject: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<NotificationType[]>([]);
  const [selectedType, setSelectedType] = useState<number | null>(null); // Variable to store the selected type

  const handleNotificationTypeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setSelectedType(Number(value)); // Update the selected type
    setNotificationForm((prev) => ({ ...prev, type: Number(value) })); // Update the notification form
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotificationTypes();
        setTypes(data.$values);
        // // Update filteredUsers with the fetched data
        console.log("Users:", data.$values); // Log the data for debugging
      } catch (err) {
        // setFilteredUsers(data.$values);
        setError("Could not fetch users");
      }
    };

    fetchData();
  }, [userId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleNotificationDialogOpen = () => {
    setIsNotificationDialogOpen(true);
  };

  const handleNotificationDialogClose = () => {
    setIsNotificationDialogOpen(false);
    setNotificationForm({
      title: "",
      message: "",
      type: 0,
      subject: "",
    });
  };

  const handleNotificationFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNotificationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendNotification = async () => {
    const newNotification: NotificationDto = {
      // notificationId: notifications.length + 1, // Temporary ID for frontend
      userId: userId, // Lecturer's user ID
      title: notificationForm.title, // Include the title property
      message: notificationForm.message,
      typeId: notificationForm.type,
      createdDate: new Date().toISOString(),
      subjectId: subjects.find(
        (subject) => subject.subjectName === notificationForm.subject
      )?.id
        ? Number(
            subjects.find(
              (subject) => subject.subjectName === notificationForm.subject
            )?.id
          )
        : null,
      subject: notificationForm.subject || null,
    };

    try {
      // Send the notification to the backend API
      const response = await createNotifcation(newNotification); // Assuming createNotifcation is a function that sends the notification to the backend
      // const response = await fetch('https://your-api-endpoint/api/notifications', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newNotification),
      // });

      if (response.ok) {
        const savedNotification = await response.json();
        setNotifications((prev) => [...prev, savedNotification]); // Update the local state with the saved notification
        handleNotificationDialogClose();
      } else {
        console.error("Failed to send notification:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "32px 0",
        backgroundColor: "#f5f5f5",
      }}
    >
      <UserProfileDetails userId={userId} />
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Lecturer Dashboard
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Manage your students, notifications, and more.
        </Typography>

        {/* Tab Menu */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
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
        {activeTab === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Notifications
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginBottom: 2 }}
              onClick={handleNotificationDialogOpen}
            >
              Send Notification
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Subject</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.notificationId}>
                      <TableCell>{notification.notificationId}</TableCell>
                      <TableCell>{notification.title}</TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell>{notification.typeId}</TableCell>
                      <TableCell>{notification.createdDate}</TableCell>
                      <TableCell>{notification.subject || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Notification Dialog */}
            <Dialog
              open={isNotificationDialogOpen}
              onClose={handleNotificationDialogClose}
            >
              <DialogTitle>Send Notification</DialogTitle>
              <DialogContent>
                <TextField
                  label="Title"
                  name="title"
                  value={notificationForm.title}
                  onChange={handleNotificationFormChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Message"
                  name="message"
                  value={notificationForm.message}
                  onChange={handleNotificationFormChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                />
                <TextField
                  label="Notification Type"
                  name="notificationType"
                  select
                  value={selectedType || notificationForm.type} // Use the selected type or the form's type
                  onChange={handleNotificationTypeChange} // Use the new handler
                  fullWidth
                  margin="normal"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select Notification Type</option>{" "}
                  {/* Default option */}
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Subject"
                  name="subject"
                  select
                  value={notificationForm.subject}
                  onChange={handleNotificationFormChange}
                  fullWidth
                  margin="normal"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">None</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.subjectName}>
                      {subject.subjectName}
                    </option>
                  ))}
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleNotificationDialogClose}
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button onClick={handleSendNotification} color="primary">
                  Send
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default LecturerDashboard;
