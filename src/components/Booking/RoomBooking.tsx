import React, { useState, useEffect } from 'react';
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
import { fetchAllRooms } from '../../api/booking';

export interface Room {
  roomId: number;
  roomName: string;
  capacity: number;
  location: string;
  availabilityStatusId: number;
}

interface RoomBookingProps {
  userId: number;
}

const RoomBooking :React.FC<RoomBookingProps> = ({ userId }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number>();
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch available rooms from the API
    const fetchRooms = async () => {
      const roomsData = await fetchAllRooms();
      setRooms(roomsData);
    };
    fetchRooms();
  }, []);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRoom || !startDateTime || !endDateTime) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/bookRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: selectedRoom,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          userId: userId
        }),
      });

      if (response.ok) {
        setMessage('Room booked successfully!');
        // Optionally reset the form
        setSelectedRoom(selectedRoom);
        setStartDateTime('');
        setEndDateTime('');
      } else {
        setMessage('Failed to book room. Please try again.');
      }
    } catch (error) {
      console.error('Error booking room:', error);
      setMessage('An error occurred. Please try again later.');
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
              <MenuItem key={room.roomId} value={room.roomName}>
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Book Room
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