import React, { useState, useEffect, use } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { BookingDataDto, createBooking, fetchAllRooms, fetchBookingById } from '../../api/booking';

export interface Room {
  roomId: number;
  roomName: string;
  capacity: number;
  location: string;
  availabilityStatusId: number;
}

interface RoomBookingProps {
  userId: number;
  bookingId?: number;
}

const RoomBooking :React.FC<RoomBookingProps> = ({ userId,bookingId }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number>();
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [purposeId, setPurposeId] = useState<number>(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch available rooms from the API
    const fetchRooms = async () => {
      const roomsData = await fetchAllRooms();
      setRooms(roomsData.$values);
    };
    fetchRooms();
  }, []);
console.log("Booking ID:", bookingId); // Log the booking ID for debugging
  useEffect(() => {
    const fetchBookingByBookingId = async () => {
      if (bookingId) {
        try {
          const bookingData = await fetchBookingById(bookingId??0);
          if (bookingData) {
            setSelectedRoom(bookingData.roomId);
            setStartDateTime(bookingData.startTime);
            setEndDateTime(bookingData.endTime);
            setPurposeId(bookingData.purposeId || 0);
          }
        } catch (error) {
          console.error("Error fetching booking data:", error);
        }
      }
    };
    fetchBookingByBookingId();
  }
  , [bookingId]);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!selectedRoom || !startDateTime || !endDateTime || !userId || !purposeId) {
      setMessage("Please fill in all fields.");
      return;
    }
  
    try {
      const bookingData:BookingDataDto = { roomId: selectedRoom,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        userId: userId,
        purposeId: purposeId};
console.log("Booking Data:", bookingData); // Log the booking data for debugging
      await createBooking(bookingData);
  
      setMessage("Room booked successfully!");
      // Optionally reset the form
      setSelectedRoom(0);
      setStartDateTime("");
      setEndDateTime("");
    } catch (error) {
      console.error("Error booking room:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };
  

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Room Booking
      </Typography>
      <Box component="form" onSubmit={handleBooking} sx={{ mt: 3 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="room-label">Select Room</InputLabel>
          <Select
            labelId="room-label"
            id="room"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            required
          >
            <MenuItem value="">
              <em>--Select a room--</em>
            </MenuItem>
            {rooms.map((room) => (
              <MenuItem key={room.roomId} value={room.roomId}>
                {room.roomName} - {room.location} (Capacity: {room.capacity})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Start DateTime"
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End DateTime"
          type="datetime-local"
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
                label="Purpose"
                name="purposeId"
                value={purposeId}
                onChange={(e) => setPurposeId(Number(e.target.value))}
                fullWidth
                margin="normal"
                select
              >
                <MenuItem value={1}>Class</MenuItem>
                <MenuItem value={2}>Meeting</MenuItem>
                <MenuItem value={3}>Maintanence</MenuItem>
                <MenuItem value={4}>Event</MenuItem>
                <MenuItem value={5}>Study</MenuItem>
              </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Submit Booking
        </Button>
      </Box>
      {message && (
        <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Container>
  );
}
export default RoomBooking;