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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { fetchLecturerSubjects } from "../../api/api";
import { UserProfileDetails } from "../Authentication/UserProfile";
import { Events, NotificationType } from "../../api/models";
//import { Notifications } from '@mui/icons-material';
import {
  createNotifcation,
  deleteNotification,
  getNotificationByUserId,
  getNotificationTypes,
  NotificationDto,
  updateNotification,
} from "../../api/notification";
import { NotificationAdd } from "@mui/icons-material";
import IssueReportingFooter from "../Maintenance/IssueReportingFooter";

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

export interface NotificationDao {
  $id: string;
  createdDate: string;
  isActive: boolean;
  isRead: boolean;
  message: string;
  notificationId: number;
  subjectId: number | null;
  subjectName: string | null;
  title: string;
  type: string;
  typeId: number;
  userId: number;
  username: string;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com" },
    { id: 2, name: "Bob Smith", email: "bob.smith@example.com" },
  ]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [notifications, setNotifications] = useState<NotificationDao[]>([]);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [notificationForm, setNotificationForm] = useState<{
    title: string;
    message: string;
    type: number;
    subject: string;
    isActive: boolean;
    subjectId: number | null; // Update type to number | null
  }>({
    title: "",
    message: "",
    type: 0,
    subject: "",
    isActive: true,
    subjectId: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<NotificationType[]>([]);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null); /// Variable to store the selected type
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationDao | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<
    number | null
  >(null);

  const handleNotificationTypeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setSelectedType(Number(value)); // Update the selected type
    setNotificationForm((prev) => ({ ...prev, type: Number(value) })); // Update the notification form
  };

  const handleSubjectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    console.log("Selected Subject ID:", value); // Log the selected subject ID for debugging
    const selectedSubjectValue = subjects.find(
      (subject) => subject.subjectName === value
    );

    console.log("Selected Subject:", selectedSubjectValue); // Log the selected subject for debugging
    setSelectedSubject(
      selectedSubjectValue ? Number(selectedSubjectValue?.id) : null
    ); // Update the selected subject ID
    setNotificationForm((prev) => ({
      ...prev,
      subjectId: selectedSubjectValue ? Number(selectedSubjectValue.id) : null, //value ? Number(value) : null, // Convert subjectId to a number or null
      subject: selectedSubjectValue ? selectedSubjectValue.subjectName : "",
      // subjects.find((subject) => subject.id === value)?.subjectName || "", // Update the subject name
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotificationTypes();
        const subjectData = await fetchLecturerSubjects(userId);
        console.log("Subject Data:", subjectData); // Log the subject data for debugging
        setSubjects(subjectData.$values);
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

  const handleUpdateClick = (notification: NotificationDao) => {
    setSelectedNotification(notification);
    setNotificationForm({
      title: notification.title,
      message: notification.message,
      type: notification.typeId,
      subject: notification.subjectName || "",
      isActive: notification.isActive,
      subjectId: notification.subjectId || null, // Set the subjectId for the selected notification
    });
    setIsUpdateMode(true);
    setIsNotificationDialogOpen(true);
  };

  const handleDeleteClick = (notificationId: number) => {
    setNotificationToDelete(notificationId); // Set the notification to be deleted
    setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
  };
  const confirmDeleteNotification = async () => {
    if (notificationToDelete !== null) {
      try {
        await deleteNotification(userId, notificationToDelete); // Call the API to delete the notification
        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              notification.notificationId !== notificationToDelete
          )
        );
        setIsDeleteDialogOpen(false); // Close the confirmation dialog
        setNotificationToDelete(null); // Reset the notification to delete
      } catch (error) {
        console.error("Error deleting notification:", error);
        alert(
          "An error occurred while deleting the notification. Please try again."
        );
      }
    }
  };
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
      isActive: true,
      subjectId: null,
    });
  };

  const handleNotificationFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setNotificationForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox changes
      ...(name === "subject" && { subjectId: Number(value) }), // Save subjectId when subject is selected
    }));
  };

  const handleSendNotification = async () => {
    // Log the notification form data for debugging
    console.log("Sending Notification___111:", selectedNotification);
    const updatedNotification: NotificationDto = {
      notificationId: selectedNotification
        ? selectedNotification.notificationId
        : undefined,
      userId: userId,
      title: notificationForm.title,
      message: notificationForm.message,
      typeId: notificationForm.type,
      createdDate: new Date().toISOString(),
      subjectId: notificationForm.subjectId || null, // Use subjectId from the form
      subject: notificationForm.subject || null,
      isActive: notificationForm.isActive,
    };
    // console.log("Sending Notification:", updateNotification);
    try {
      if (isUpdateMode && selectedNotification) {
        const response = await updateNotification(
          selectedNotification.notificationId,
          updatedNotification
        );
        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === selectedNotification.notificationId
              ? response
              : n
          )
        );
      } else {
        const response = await createNotifcation(updatedNotification);
        setNotifications((prev) => [...prev, response]);
      }
      handleNotificationDialogClose();
    } catch (error) {
      console.error("Error saving notification:", error);
      alert(
        "An error occurred while saving the notification. Please try again."
      );
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotificationByUserId(userId);
        // const data = await response.json();
        console.log("Notification Data:", response); // Log the notification data for debugging
        setNotifications(response.$values);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  const lecturer = {
    name: "Dr. Jane Doe",
    department: "Computer Science",
    profilePicture: "https://via.placeholder.com/100",
  };

  const todaySchedule = [
    { course: "Data Structures", time: "09:00 - 10:30", room: "Room 101" },
    { course: "Algorithms", time: "13:00 - 14:30", room: "Room 202" },
  ];

  const announcements = [
    "Faculty meeting on Friday at 10 AM.",
    "Submit final grades by next Monday.",
    "New projector installed in Room 101.",
  ];

  const recentBookings = [
    {
      room: "Room 101",
      date: "2025-05-15",
      time: "09:00 - 10:30",
      status: "Approved",
    },
    {
      room: "Room 202",
      date: "2025-05-16",
      time: "13:00 - 14:30",
      status: "Pending",
    },
  ];

  const quickActions = [
    "Book a Room",
    "Submit Maintenance Request",
    "Post Announcement",
    "View Class Roster",
  ];

  return (
    <>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        {/* General Header */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          bgcolor="#808000"
          color="white"
          p={3}
        >
          {/* Dashboard Title */}
          <Grid>
            <Typography variant="h5" noWrap>
              Lecturer Dashboard
            </Typography>
          </Grid>
          <UserProfileDetails userId={userId} />
        </Grid>

        {/* Tab Menu */}
        <Box display="flex" flex={1}>
          {/* Sidebar as Tabs */}
          <Box width="200px" bgcolor="#808000" color="white" p={2}>
            <Tabs
              orientation="vertical"
              value={activeTab}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
              TabIndicatorProps={{ style: { left: 0 } }}
            >
              <Tab label="Home" sx={{ alignItems: "flex-start" }} />
              <Tab label="Students" sx={{ alignItems: "flex-start" }} />
              <Tab label="Notifications" sx={{ alignItems: "flex-start" }} />
              <Tab label="My Subjects" sx={{ alignItems: "flex-start" }} />
            </Tabs>
          </Box>
          <Box flex={1} p={3}>
            {/* Tab Content */}
            {activeTab === 0 && (
              <>
                {/* Profile Summary */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid>
                        <img
                          src={lecturer.profilePicture}
                          alt="Profile"
                          style={{ width: 80, borderRadius: "50%" }}
                        />
                      </Grid>
                      <Grid>
                        <Typography variant="h6">{lecturer.name}</Typography>
                        <Typography variant="body2">
                          {lecturer.department}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Today's Schedule */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6">Today's Schedule</Typography>
                  <List>
                    {todaySchedule.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${item.course} (${item.time})`}
                          secondary={`Room: ${item.room}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>

                {/* Quick Actions */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6">Quick Actions</Typography>
                  <Grid container spacing={2} mt={1}>
                    {quickActions.map((action, index) => (
                      <Grid>
                        <Button variant="contained">{action}</Button>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>

                {/* Announcements and Bookings */}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6">Announcements</Typography>
                      <List>
                        {announcements.map((note, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={note} />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6">Recent Bookings</Typography>
                      <List>
                        {recentBookings.map((booking, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={`${booking.room} on ${booking.date}`}
                              secondary={`Time: ${booking.time} | Status: ${booking.status}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </>
            )}
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
                  Create Notification
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
                        <TableCell>Actions</TableCell>
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
                          <TableCell>
                            {notification.subjectName || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() => handleUpdateClick(notification)}
                              sx={{ marginRight: 1 }}
                            >
                              Update
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() =>
                                handleDeleteClick(notification.notificationId)
                              }
                            >
                              Delete
                            </Button>
                          </TableCell>
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
                      value={notificationForm.subject || ""} // Convert subjectId to a string or use an empty string
                      onChange={handleSubjectChange}
                      fullWidth
                      margin="normal"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">None</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {" "}
                          {/* Use subject.id as the value */}
                          {subject.subjectName}
                        </option>
                      ))}
                    </TextField>
                    <Box display="flex" alignItems="center" mt={2}>
                      <Typography variant="body1" sx={{ marginRight: 2 }}>
                        Is Active
                      </Typography>
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={notificationForm.isActive}
                        onChange={handleNotificationFormChange}
                      />
                    </Box>
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
          </Box>
        </Box>
      </Box>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this notification?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={confirmDeleteNotification} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <IssueReportingFooter userId={userId} />
    </>
  );
};

export default LecturerDashboard;
