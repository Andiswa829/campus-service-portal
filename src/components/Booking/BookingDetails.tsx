import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
} from "@mui/material";


interface BookingDetailsProps {
    booking: BookingDto | null;
}

export interface BookingDto {
    bookingId: number;
    userId: number;
    user: User;
    roomId: number;
    room: Room;
    startTime: string; // ISO string format for DateTime
    endTime: string;
    purposeId?: number;
    purpose?: BookingPurpose;
    statusId?: number;
    status?: BookingStatus;
  }
  
  // Supporting interfaces (simplified for context)
  export interface User {
    userId: number;
    name: string;
    surname: string;
    email: string;
    // Add other relevant fields as needed
  }
  
  export interface Room {
    roomId: number;
    roomName: string;
    // Add other relevant fields as needed
  }
  
  export interface BookingPurpose {
    purposeId: number;
    name: string;
  }
  
  export interface BookingStatus {
    statusId: number;
    name: string;
  }
  

const BookingDetails :React.FC<BookingDetailsProps> = ({ booking }) => {
  if (!booking) return null;

  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom>
        Booking #{booking.bookingId}
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />

      <Grid container spacing={2}>
        <Grid size={{xs:12,sm:6}}>
          <Typography><strong>User:</strong> {booking.user?.name} {booking.user?.surname}</Typography>
          <Typography><strong>Email:</strong> {booking.user?.email}</Typography>
        </Grid>

        <Grid size={{xs:12,sm:6}}>
          <Typography><strong>Room:</strong> {booking.room?.roomName}</Typography>
          <Typography><strong>Purpose:</strong> {booking.purpose?.name}</Typography>
        </Grid>

        <Grid size={{xs:12,sm:6}}>
          <Typography><strong>Start Time:</strong> {new Date(booking.startTime).toLocaleString()}</Typography>
          <Typography><strong>End Time:</strong> {new Date(booking.endTime).toLocaleString()}</Typography>
        </Grid>

        <Grid size={{xs:12,sm:6}}>
          <Typography><strong>Status:</strong> {booking.status?.name}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookingDetails;
