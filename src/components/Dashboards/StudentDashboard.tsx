import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ButtonGroup,
} from "@mui/material";
import {
  Calendar,
  momentLocalizer,
  ToolbarProps,
  View,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UserProfileDetails } from "../Authentication/UserProfile";
import axios from "axios";
import StudentNotifications from "../Student/studentNotifications";
import { fetchStudentSubjects } from "../../api/subjects";
import IssueReportingFooter from "../Maintenance/IssueReportingFooter";
import BookingDetails, { BookingDto } from "../Booking/BookingDetails";
import {AddBookingView, ShowBookingDto, ViewBookings } from "../Booking/AddBooking";
import RoomBooking from "../Booking/RoomBooking";
import { apiClient } from "../services/authService";
import { fetchAllBookingsByUserId } from "../../api/booking";

interface TimetableEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  subject: string;
  lecturer: string;
}

interface RoomBooking {
  id: string;
  roomName: string;
  date: string;
  time: string;
  bookedBy: string;
}

interface StudentDashboardProps {
  userId: number;
}

interface TimetableEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  subject: string;
  lecturer: string;
  location: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState(0); // Active tab state
  const [timetableEvents, setTimetableEvents] = useState<TimetableEvent[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<TimetableEvent[]>([]);
  const [roomBookings, setRoomBookings] = useState<ShowBookingDto[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<View>("month");
  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddBookingDialogOpen, setIsAddBookingDialogOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    roomName: "",
    date: "",
    time: "",
    bookedBy: "",
  });
  const [enrolledSubjectIds, setEnrolledSubjectIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetchStudentSubjects(userId);
        console.log("Fetched Subjects:", response); // Log the response for debugging

        // Only update state if the fetched subject IDs are different
        const fetchedSubjectIds = response.$values.map(
          (subject: any) => subject.$id
        );
        console.log("Fetched Subject IDs:", fetchedSubjectIds); // Log the fetched subject IDs
        if (
          JSON.stringify(fetchedSubjectIds) !==
          JSON.stringify(enrolledSubjectIds)
        ) {
          setEnrolledSubjectIds(fetchedSubjectIds);
        }
      } catch (err) {
        console.error("Error fetching studentSubjects:", err);
        setError("Failed to fetch subjects. Please try again later.");
      }
    };

    fetchSubjects();
  }, [userId]);

  useEffect(() => {
    const fetchRoomBookings = async () => {
      try {
        const response = await fetchAllBookingsByUserId(userId);
        console.log("Fetched Room Bookings:", response.$values); // Log the response for debugging
        const data = response.$values;

        // Map API response to RoomBooking model
        const mappedBookings = data.map((item: any) => ({
          id: item.$id,
          roomName: item.roomName,
          date: moment(item.startTime).format("YYYY-MM-DD"),
          time: moment(item.startTime).format("HH:mm"),
          bookedBy: item.bookedBy,
        }));

        setRoomBookings(response.$values);
      } catch (error) {
        console.error("Error fetching room bookings:", error);
      }
    };
    fetchRoomBookings();
  }, [userId]);

  useEffect(() => {
    // Fetch timetable data from the API
    const fetchTimetable = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7158/api/Student/${userId}/timetables`
        );
        const data = response.data.$values;

        // Map API response to TimetableEvent model
        const mappedEvents = data.map((item: any) => ({
          id: item.$id,
          title: item.subjectName,
          start: new Date(item.startTime),
          end: new Date(item.endTime),
          subject: item.subjectName,
          lecturer: item.lecturerName,
          location: item.location,
        }));

        setTimetableEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching timetable data:", error);
      }
    };

    fetchTimetable();
  }, [userId]);

  useEffect(() => {
    // Filter upcoming classes based on the current date
    const upcoming = timetableEvents.filter(
      (event) => event.start > new Date()
    );
    setUpcomingClasses(upcoming);
  }, [timetableEvents]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEventClick = (event: TimetableEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleAddBookingDialogOpen = () => {
    setIsAddBookingDialogOpen(true);
  };

  const handleAddBookingDialogClose = () => {
    setIsAddBookingDialogOpen(false);
    setNewBooking({ roomName: "", date: "", time: "", bookedBy: "" });
  };

  // const handleAddBookingSubmit = () => {
  //   const newBookingEntry = {
  //     id: (roomBookings.length + 1).toString(),
  //     ...newBooking,
  //   };
  //   setRoomBookings((prev) => [...prev, newBookingEntry]);
  //   handleAddBookingDialogClose();
  // };
  const [date, setDate] = useState(new Date(currentDate));

  const onNavigate = useCallback((newDate: any) => setDate(newDate), [setDate]);

  return (
    <>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        {/* General Header */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          bgcolor="#008000"
          color="white"
          p={3}
        >
          {/* Dashboard Title */}
          <Grid>
            <Typography variant="h5" noWrap>
              Student Dashboard
            </Typography>
          </Grid>

          {/* Notification Icon and User Profile */}
          <Grid>
            <Grid container alignItems="center" spacing={8}>
              <Grid>
                <StudentNotifications
                  studentId={userId}
                  enrolledSubjectIds={enrolledSubjectIds}
                />
              </Grid>
              <Grid>
                <UserProfileDetails userId={userId} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Box display="flex" flex={1}>
          {/* Sidebar as Tabs */}
          <Box width="200px" bgcolor="#008000" color="white" p={2}>
            <Tabs
              orientation="vertical"
              value={activeTab}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
              TabIndicatorProps={{ style: { left: 0 } }}
            >
              <Tab label="Home" sx={{ alignItems: "flex-start" }} />
              <Tab label="Timetable" sx={{ alignItems: "flex-start" }} />
              <Tab label="Room Booking" sx={{ alignItems: "flex-start" }} />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box flex={1} p={3}>
            {activeTab === 0 && (
              <>
                {/* Welcome Message */}
                <Typography variant="h4" gutterBottom>
                  {`Welcome back, Student!`}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Here's a quick overview of your schedule and notifications.
                </Typography>

                {/* Summary Section */}
                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Card sx={{ flex: 1, mr: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Upcoming Classes</Typography>
                      <Typography variant="h4">
                        {upcomingClasses.length}
                      </Typography>
                      <Button
                    variant="text"
                    color="primary"
                    onClick={() => setActiveTab(1)} // Navigate to Timetable tab
                  >
                    View Timetable
                  </Button>
                    </CardContent>
                  </Card>
                  <Card sx={{ flex: 1, mr: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Unread Notifications</Typography>
                      <Typography variant="h4">
                        {/* Placeholder for unread notifications */}
                        <StudentNotifications
                          studentId={userId}
                          enrolledSubjectIds={enrolledSubjectIds}
                        />
                      </Typography>
                      {/* <Button
                    variant="text"
                    color="success"
                    onClick={() => setActiveTab(0)} // Navigate to Notifications
                  >
                    View Notifications
                  </Button>  */}
                    </CardContent>
                  </Card>
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6">Booked Bookings</Typography>
                      <Typography variant="h4">
                        {
                          roomBookings.filter(
                            (booking) =>
                              booking.startTime?.toString() //=== moment().format("YYYY-MM-DD")
                          ).length
                        }
                      </Typography>
                      <Button
                    variant="text"
                    color="secondary"
                    onClick={handleAddBookingDialogOpen} // Open Add Booking dialog
                  >
                    Add Booking
                  </Button>
                    </CardContent>
                  </Card>
                </Box>

                {/* Upcoming Classes */}
                <Typography variant="h5" gutterBottom>
                  Upcoming Classes
                </Typography>
                <Grid container spacing={3}>
                  {upcomingClasses.map((event) => (
                    <Grid size={{ xs: 12, md: 4, sm: 6 }}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {event.title}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            {moment(event.start).format("MMMM Do YYYY, h:mm a")}{" "}
                            - {moment(event.end).format("h:mm a")}
                          </Typography>
                          <Typography variant="body2">
                            Lecturer: {event.lecturer}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Quick Actions */}
                {/*</><Box display="flex" justifyContent="space-between" mt={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setActiveTab(1)} // Navigate to Timetable tab
                  >
                    View Timetable
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAddBookingDialogOpen} // Open Add Booking dialog
                  >
                    Add Room Booking
                  </Button>
                  {/* <Button
                    variant="contained"
                    color="info"
                    onClick={() => setActiveTab(0)} // Navigate to Notifications
                  >
                    View Notifications
                  </Button> 
                </Box>*/}
              </>
            )}

            {activeTab === 1 && (
              <>
                {/* Timetable Tab */}
                <Typography variant="h5" gutterBottom>
                  Timetable
                </Typography>
                <Paper sx={{ mt: 3, p: 2 }}>
                  <Calendar
                    localizer={localizer}
                    events={timetableEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    view={calendarView}
                    date={date}
                    onView={(view) => setCalendarView(view)}
                    onNavigate={onNavigate}
                    onSelectEvent={handleEventClick}
                    onSelecting={(slotInfo: any) => {
                      console.log("Selected Slot:", slotInfo); // Debugging
                      setNewBooking({
                        ...newBooking,
                        date: moment(slotInfo.start).format("YYYY-MM-DD"),
                        time: moment(slotInfo.start).format("HH:mm"),
                      });
                      setIsAddBookingDialogOpen(true); // Open the "Add Booking" dialog
                      return true; // Ensure the function returns a boolean
                    }}
                    // components={{
                    //   toolbar: CustomToolbar, // Use the custom toolbar
                    // }}
                    // components={{
                    //   toolbar: CustomToolbar,
                    // }}
                  />
                </Paper>
              </>
            )}

            {activeTab === 2 && (
              <>
                {/* Room Booking Tab */}
                <Typography variant="h5" gutterBottom>
                  My Bookings
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginBottom: 2 }}
                  onClick={handleAddBookingDialogOpen}
                >
                  Add Booking
                </Button>
               <ViewBookings bookings={roomBookings} /> 
              </>
            )}
          </Box>
        </Box>

        {/* Event Details Dialog */}
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Class Details</DialogTitle>
          <DialogContent>
            {selectedEvent && (
              <>
                <Typography variant="subtitle1">
                  <strong>Subject:</strong> {selectedEvent.subject}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Lecturer:</strong> {selectedEvent.lecturer}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Start Time:</strong>{" "}
                  {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>End Time:</strong>{" "}
                  {moment(selectedEvent.end).format("MMMM Do YYYY, h:mm a")}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Booking Dialog */}
        <Dialog
          open={isAddBookingDialogOpen}
          onClose={handleAddBookingDialogClose}
        >
          <RoomBooking userId={userId}/>
          {/* <DialogContent>
            <TextField
              label="Room Name"
              name="roomName"
              value={newBooking.roomName}
              onChange={(e) =>
                setNewBooking({ ...newBooking, roomName: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={newBooking.date}
              onChange={(e) =>
                setNewBooking({ ...newBooking, date: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              value={newBooking.time}
              onChange={(e) =>
                setNewBooking({ ...newBooking, time: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Booked By"
              name="bookedBy"
              value={newBooking.bookedBy}
              onChange={(e) =>
                setNewBooking({ ...newBooking, bookedBy: e.target.value })
              }
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddBookingDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddBookingSubmit} color="primary">
              Add
            </Button>
          </DialogActions> */}
        </Dialog>
      </Box>
      <IssueReportingFooter userId={userId} />
    </>
  );
};

export default StudentDashboard;

export const CustomToolbar: React.FC<ToolbarProps<TimetableEvent, object>> = ({
  onNavigate,
  onView,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <ButtonGroup>
        <Button onClick={() => onNavigate("TODAY")}>Today</Button>
        <Button onClick={() => onNavigate("PREV")}>Back</Button>
        <Button onClick={() => onNavigate("NEXT")}>Next</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button onClick={() => onView("month")}>Month</Button>
        <Button onClick={() => onView("week")}>Week</Button>
        <Button onClick={() => onView("day")}>Day</Button>
      </ButtonGroup>
    </Box>
  );
};
