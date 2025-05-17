import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import { getNotificationBySubjectIds } from "../../api/notification";

interface StudentNotificationsProps {
  studentId: number;
  enrolledSubjectIds: number[];
}

interface Notification {
  notificationId: number;
  title: string;
  message: string;
  createdDate: string;
  subjectName: string;
  type: string;
  isRead: boolean;
}

const StudentNotifications: React.FC<StudentNotificationsProps> = ({
  studentId,
  enrolledSubjectIds,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Track dialog state
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null); // Track the selected notification

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (enrolledSubjectIds.length === 0) {
          setNotifications([]);
          setUnreadCount(0);
        } else {
          const response = await getNotificationBySubjectIds(
            enrolledSubjectIds
          );
          const fetchedNotifications = response.$values; // Assuming the API returns a $values array
          setNotifications(fetchedNotifications);
          setUnreadCount(
            fetchedNotifications.filter((n: any) => !n.isRead).length
          ); // Count unread notifications
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to fetch notifications. Please try again later.");
      }
    };

    fetchNotifications();
  }, [studentId, enrolledSubjectIds]);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark the notification as read
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notification.notificationId
          ? { ...n, isRead: true }
          : n
      )
    );
    setUnreadCount((prev) => prev - (notification.isRead ? 0 : 1)); // Decrease unread count if it was unread
    setSelectedNotification(notification); // Set the selected notification
  };

  const handleNotificationModalClose = () => {
    setSelectedNotification(null); // Close the notification modal
  };

  return (
    <Box>
      {/* Notification Icon */}
      <IconButton color="inherit" onClick={handleDialogOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Notifications Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          My Notifications
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : notifications.length === 0 ? (
            <Typography align="center">No notifications available.</Typography>
          ) : (
            <Paper elevation={3} sx={{ margin: "16px", padding: "16px" }}>
              <List>
                {notifications.map((notification) => (
                  <React.Fragment key={notification.notificationId}>
                    <ListItem
                      alignItems="flex-start"
                      component="button"
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        backgroundColor: notification.isRead
                          ? "inherit"
                          : "#f0f8ff", // Highlight unread notifications
                      }}
                    >
                      <ListItemText
                        primary={`${notification.title}`}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              fontWeight="bold"
                            >
                              {notification.type}
                            </Typography>
                            <br />
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {notification.subjectName}
                            </Typography>
                            {" — "}
                            {notification.message}
                            <br />
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(
                                notification.createdDate
                              ).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </DialogContent>
      </Dialog>

      {/* Notification Details Modal */}
      <Dialog
        open={!!selectedNotification}
        onClose={handleNotificationModalClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            {selectedNotification?.type}
          </Typography>
          {selectedNotification?.title}
          <IconButton
            aria-label="close"
            onClick={handleNotificationModalClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {selectedNotification?.message}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Subject: {selectedNotification?.subjectName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date:{" "}
            {selectedNotification &&
              new Date(selectedNotification.createdDate).toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotificationModalClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentNotifications;