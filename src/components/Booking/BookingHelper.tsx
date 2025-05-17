import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { BookingData } from "../../api/models";
import RoomBooking from "./RoomBooking";


interface BookingHelperProps {
  bookings: BookingData[];
  onAddBooking: (booking: BookingData) => void;
  onUpdateBooking: (booking: BookingData) => void;
  onDeleteBooking: (id: number) => void;
  userId: number;
}

const BookingHelper: React.FC<BookingHelperProps> = ({
  bookings,
  onAddBooking,
  onUpdateBooking,
  onDeleteBooking,
  userId
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBookings, setFilteredBookings] = useState<BookingData[]>(bookings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "update">("add");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [formData, setFormData] = useState<{
    roomName: string;
    date: Date | null;
    time: string;
  }>({
    roomName: "",
    date: null,
    time: "",
  });
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredBookings(
      bookings.filter(
        (booking) =>
          booking.room?.roomName.toLowerCase().includes(query) 
          //booking.startTime.toLowerCase().includes(query)
      )
    );
  };

  const handleDialogOpen = (mode: "add" | "update", booking?: BookingData) => {
    setDialogMode(mode);
    setSelectedBooking(booking || null);
  console.log("Selected Booking:", booking);
    setFormData(
      booking
        ? {
            roomName: booking.room?.roomName || "",
            date: new Date(booking.startTime), // Keep as Date
            time: new Date(booking.endTime).toTimeString().slice(0, 5), // "HH:mm"
          }
        : {
            roomName: "",
            date: null,
            time: "",
          }
    );
  
    setIsDialogOpen(true);
  };
  

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData({ roomName: "", date: new Date(), time: "" });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    if (dialogMode === "add") {
      const newBooking: BookingData = {
          bookingId: bookings.length + 1,
          roomId: "0", // Replace with appropriate roomId
          purposeId: 0, // Replace with appropriate purposeId
          startTime: new Date(`${formData.date}T${formData.time}`),
          endTime: new Date(`${formData.date}T${formData.time}`), // Adjust endTime as needed
          room: {
              roomName: formData.roomName,
              roomId: 0,
              capacity: 0,
              location: "",
              availabilityStatusId: 0
          },
          userId: "",
          statusId: 0
      };
      onAddBooking(newBooking);
    } else if (dialogMode === "update" && selectedBooking) {
      const updatedBooking = { ...selectedBooking, ...formData };
      onUpdateBooking(updatedBooking);
    }
    handleDialogClose();
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Bookings
      </Typography>
      <TextField
        label="Search by Room Name or Date"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: 2 }}
        onClick={() => handleDialogOpen("add")}
      >
        Add Booking
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Room Name</TableCell>
              <TableCell>Start Date and Time</TableCell>
              <TableCell>End Date and Time</TableCell>
             <TableCell>Booking Purpose</TableCell>
              <TableCell>Booked By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {Array.isArray(filteredBookings) &&
            filteredBookings.map((booking) => (
              <TableRow key={booking.bookingId}>
                <TableCell>{booking.bookingId}</TableCell>
                <TableCell>{booking.roomName}</TableCell>
                <TableCell>{booking.startTime.toLocaleString()}</TableCell>
                <TableCell>{booking.endTime.toLocaleString()}</TableCell>
                <TableCell>{booking.purpose}</TableCell>
                <TableCell>{booking.userEmail}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleDialogOpen("update", booking)}
                    sx={{ marginRight: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onDeleteBooking(booking.bookingId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Update Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogMode === "add" ? "Add Booking" : "Update Booking"}
        </DialogTitle>
        <RoomBooking userId={userId} bookingId={selectedBooking?.bookingId}/>
        {/* <DialogContent>
          <TextField
            label="Room Name"
            name="roomName"
            value={formData.roomName}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            {dialogMode === "add" ? "Add" : "Update"}
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default BookingHelper;