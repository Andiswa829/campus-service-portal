import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Calendar, momentLocalizer, View, ToolbarProps } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Define the type for your calendar events
interface TimetableEvent {
  day: string;
  time: string;
  subject: string;
  lecturer: string;
  id: number;
  title: string;
  start: Date;
  end: Date;
}

const TimetableViewer: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date for the calendar
  const [calendarView, setCalendarView] = useState<View>('month'); // Current view mode for the calendar
  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(null); // Selected event for details
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state for event details

  // Sample timetable data
  const timetableData = [
    { day: 'Monday', time: '9:00 AM - 10:00 AM', subject: 'Mathematics', lecturer: 'Dr. Smith' },
    { day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'Physics', lecturer: 'Dr. Johnson' },
    { day: 'Tuesday', time: '9:00 AM - 10:00 AM', subject: 'Chemistry', lecturer: 'Dr. Lee' },
    { day: 'Wednesday', time: '11:00 AM - 12:00 PM', subject: 'Biology', lecturer: 'Dr. Brown' },
    { day: 'Thursday', time: '1:00 PM - 2:00 PM', subject: 'History', lecturer: 'Dr. Wilson' },
    { day: 'Friday', time: '2:00 PM - 3:00 PM', subject: 'Computer Science', lecturer: 'Dr. Taylor' },
  ];

  // Convert timetable data to calendar events
  const localizer = momentLocalizer(moment);
  const calendarEvents: TimetableEvent[] = timetableData.map((entry, index) => {
    const [startTime, endTime] = entry.time.split(' - ');
    const startDate = moment().day(entry.day).hour(moment(startTime, 'h:mm A').hour()).minute(moment(startTime, 'h:mm A').minute()).toDate();
    const endDate = moment().day(entry.day).hour(moment(endTime, 'h:mm A').hour()).minute(moment(endTime, 'h:mm A').minute()).toDate();

    return {
      id: index,
      title: `${entry.subject} (${entry.lecturer})`,
      start: startDate,
      end: endDate,
      ...entry, // Include all entry details for easy access
    };
  });

  const handleNavigate = (action: 'TODAY' | 'PREV' | 'NEXT') => {
    const newDate = moment(currentDate);
    if (action === 'TODAY') {
      setCurrentDate(new Date());
    } else if (action === 'PREV') {
      setCurrentDate(newDate.subtract(1, calendarView === 'month' ? 'months' : 'weeks').toDate());
    } else if (action === 'NEXT') {
      setCurrentDate(newDate.add(1, calendarView === 'month' ? 'months' : 'weeks').toDate());
    }
  };

  const handleViewModeChange = (view: View) => {
    setCalendarView(view);
  };

  const handleEventClick = (event: TimetableEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  // Custom Toolbar Component
  const CustomToolbar: React.FC<ToolbarProps<TimetableEvent, object>> = ({ onNavigate, onView }) => {
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

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Timetable Viewer
      </Typography>

      <Box sx={{ mt: 3, p: 2 }}>
        <Calendar<TimetableEvent>
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          view={calendarView}
          onNavigate={(date) => setCurrentDate(date)}
          onView={(view) => setCalendarView(view)}
          onSelectEvent={handleEventClick}
          style={{ height: 500 }}
          components={{
            toolbar: CustomToolbar, // Use the custom toolbar
          }}
        />
      </Box>

      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography variant="subtitle1"><strong>Subject:</strong> {selectedEvent.subject}</Typography>
              <Typography variant="subtitle1"><strong>Lecturer:</strong> {selectedEvent.lecturer}</Typography>
              <Typography variant="subtitle1"><strong>Day:</strong> {selectedEvent.day}</Typography>
              <Typography variant="subtitle1"><strong>Time:</strong> {selectedEvent.time}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TimetableViewer;