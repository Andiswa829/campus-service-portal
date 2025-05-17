import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface AddBookingDto {
  userId: number;
  roomId: number;
  startTime: string;
  endTime: string;
  purposeId: number;
  statusId: number;
}

interface AddBookingViewProps {
  userId: number; // Assuming you have a userId prop
}

export const AddBookingView: React.FC<AddBookingViewProps> = ({ userId }) => {
  const [formData, setFormData] = useState<AddBookingDto>({
    userId: userId,
    roomId: 0,
    startTime: "",
    endTime: "",
    purposeId: 0,
    statusId: 1, // Default to "Pending" or similar
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Id") ? parseInt(value) : value,
    }));
  };

  const handleSubmit = () => {
    console.log("Submitting booking:", formData);
    // TODO: Replace with API call
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 600, margin: "auto", marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add New Booking
      </Typography>

      <TextField
        label="User ID"
        name="userId"
        value={formData.userId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />

      <TextField
        label="Room ID"
        name="roomId"
        value={formData.roomId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />

      <TextField
        label="Start Time"
        name="startTime"
        type="datetime-local"
        value={formData.startTime}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="End Time"
        name="endTime"
        type="datetime-local"
        value={formData.endTime}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="Purpose ID"
        name="purposeId"
        value={formData.purposeId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />

      <TextField
        label="Status"
        name="statusId"
        value={formData.statusId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
      >
        <MenuItem value={1}>Pending</MenuItem>
        <MenuItem value={2}>Approved</MenuItem>
        <MenuItem value={3}>Rejected</MenuItem>
      </TextField>

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Booking
        </Button>
      </Box>
    </Paper>
  );
};

export interface ShowBookingDto {
  bookingId: number;
  userName: string;
  roomName?: string;
  startTime: Date;
  endTime: Date;
  purpose?: string;
  status?: string;
  userEmail?: string;
  roomLocation?: string;
}

interface ViewBookingsProps {
  // userId: number;
  bookings: ShowBookingDto[];
}

export const ViewBookings: React.FC<ViewBookingsProps> = ({ bookings }) => {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room Name</TableCell>
              <TableCell>Start Date and Time</TableCell>
              <TableCell>End Date and Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.bookingId}>
                <TableCell>{booking.roomName}</TableCell>
                <TableCell>{booking.startTime?.toString()}</TableCell>
                <TableCell>{booking.endTime?.toString()}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                   // onClick={() => handleDialogOpen("update", user)}
                    sx={{ marginRight: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    //onClick={() => handleDeleteUser(user.userId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
