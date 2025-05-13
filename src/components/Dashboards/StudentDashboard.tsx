import React, { useEffect, useState } from "react";
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
import { Calendar, momentLocalizer, ToolbarProps, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UserProfileDetails } from "../Authentication/UserProfile";
import axios from "axios";

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
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<View>("week");
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

  const localizer = momentLocalizer(moment);

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

  

  // useEffect(() => {
  //   // Mock timetable data
  //   setTimetableEvents([
  //     {
  //       id: '1',
  //       title: 'Mathematics 101',
  //       start: moment().add(1, 'days').hour(9).minute(0).toDate(),
  //       end: moment().add(1, 'days').hour(10).minute(0).toDate(),
  //       subject: 'Mathematics 101',
  //       lecturer: 'Dr. Smith',
  //     },
  //     {
  //       id: '2',
  //       title: 'Physics 201',
  //       start: moment().add(2, 'days').hour(11).minute(0).toDate(),
  //       end: moment().add(2, 'days').hour(12).minute(0).toDate(),
  //       subject: 'Physics 201',
  //       lecturer: 'Dr. Johnson',
  //     },
  //   ]);

  //   // Mock room booking data
  //   setRoomBookings([
  //     { id: '1', roomName: 'Room A', date: '2025-05-07', time: '10:00 AM - 11:00 AM', bookedBy: 'John Doe' },
  //     { id: '2', roomName: 'Room B', date: '2025-05-08', time: '1:00 PM - 2:00 PM', bookedBy: 'Jane Smith' },
  //   ]);
  // }, []);

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

  const handleAddBookingSubmit = () => {
    const newBookingEntry = {
      id: (roomBookings.length + 1).toString(),
      ...newBooking,
    };
    setRoomBookings((prev) => [...prev, newBookingEntry]);
    handleAddBookingDialogClose();
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* General Header */}
      <Box
        bgcolor="#0c8712"
        color="white"
        p={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5">Student Dashboard</Typography>
        <UserProfileDetails userId={userId} />{" "}
        {/* Assuming this component fetches and displays user profile details */}
      </Box>

      {/* Main Content */}
      <Box display="flex" flex={1}>
        {/* Sidebar as Tabs */}
        <Box width="200px" bgcolor="#0c8712" color="white" p={2}>
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
              {/* Home Tab */}
              <Typography variant="h5" gutterBottom>
                Upcoming Classes
              </Typography>
              <Grid container spacing={3}>
                {upcomingClasses.map((event) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {moment(event.start).format("MMMM Do YYYY, h:mm a")} -{" "}
                          {moment(event.end).format("h:mm a")}
                        </Typography>
                        <Typography variant="body2">
                          Lecturer: {event.lecturer}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Typography
                variant="h5"
                gutterBottom
                style={{ marginTop: "32px" }}
              >
                Notifications
              </Typography>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="body1">
                  No new notifications at the moment.
                </Typography>
              </Paper>
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
                  onView={(view) => setCalendarView(view)}
                  onNavigate={(date) => setCurrentDate(date)} // Ensure this updates the state
                  onSelectEvent={handleEventClick}
                  // components={{
                  //   toolbar: CustomToolbar, // Use the custom toolbar
                  // }}
                />
              </Paper>
            </>
          )}

          {activeTab === 2 && (
            <>
              {/* Room Booking Tab */}
              <Typography variant="h5" gutterBottom>
                Room Booking
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginBottom: 2 }}
                onClick={handleAddBookingDialogOpen}
              >
                Add Booking
              </Button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Room Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Booked By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roomBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.roomName}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>{booking.bookedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
        <DialogTitle>Add Booking</DialogTitle>
        <DialogContent>
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
            value={newBooking.time}
            onChange={(e) =>
              setNewBooking({ ...newBooking, time: e.target.value })
            }
            fullWidth
            margin="normal"
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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentDashboard;


export const CustomToolbar: React.FC<ToolbarProps<TimetableEvent, object>> = ({ onNavigate, onView }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <ButtonGroup>
        <Button onClick={() => onNavigate('TODAY')}>Today</Button>
        <Button onClick={() => onNavigate('PREV')}>Back</Button>
        <Button onClick={() => onNavigate('NEXT')}>Next</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button onClick={() => onView('month')}>Month</Button>
        <Button onClick={() => onView('week')}>Week</Button>
        <Button onClick={() => onView('day')}>Day</Button>
      </ButtonGroup>
    </Box>
  );
};