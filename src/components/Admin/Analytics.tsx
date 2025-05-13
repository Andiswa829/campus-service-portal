import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import axios from "axios";
import { getBookingStatusCount } from "../../api/booking";

interface BookingCounts {
  approved: number;
  pending: number;
  cancelled?: number;
  rejected: number;
  total: number;
}

const Analytics: React.FC = () => {
  const [bookingStatus, setBookingStatus] = useState<BookingCounts>({
    approved: 0,
    pending: 0,
    rejected: 0,
    total: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch booking status counts from the API
    const fetchBookingStatus = async () => {
      try {
        const response = await getBookingStatusCount();
        console.log("Booking Counts:", response); // Log the response for debugging
        const data = response;
        setChartData([
            {
              name: 'Room Activity',
              approved: data.approvedCount,
              pending: data.pendingCount,
              rejected: data.rejectedCount,
            },
          ]);
   
        setBookingStatus({
          approved: data.approvedCount,
          pending: data.pendingCount,
          rejected: data.rejectedCount,
          total: data.totalBookings,
        });

      } catch (error) {
        console.error("Error fetching booking status:", error);
      }
    };

    fetchBookingStatus();
  }, []);
  console.log("chartData", chartData); // Log the booking status for debugging
  return (
    <>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Recent Room Booking Activities</Typography>
        <Button variant="contained">Export</Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 4 }}>
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography>Approved Bookings</Typography>
            <CircularProgress
              variant="determinate"
              value={(bookingStatus.approved / bookingStatus.total) * 100}
              size={100}
            />
            <Typography>{bookingStatus.approved}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography>Pending Bookings</Typography>
            <CircularProgress
              variant="determinate"
              value={(bookingStatus.pending / bookingStatus.total) * 100}
              size={100}
            />
            <Typography>{bookingStatus.pending}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography>Cancelled/Rejected</Typography>
            <CircularProgress
              variant="determinate"
              value={(bookingStatus.rejected / bookingStatus.total) * 100}
              size={100}
            />
            <Typography>{bookingStatus.rejected}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box mt={5}>
        <Typography variant="h6">System Activities</Typography>
        <LineChart width={600} height={300} //data={chartData}  
                  data={[
                    { name: "Jan", Booked: 30, Opened: 20, Cancelled: 5 },
                    { name: "Feb", Booked: 40, Opened: 25, Cancelled: 10 },
                    { name: "Mar", Booked: 50, Opened: 30, Cancelled: 15 },
                  ]}
                  >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="approved"
            name="Successful Requests"
            stroke="#4caf50"
          />
          <Line
            type="monotone"
            dataKey="pending"
            name="Pending"
            stroke="#ff9800"
          />
          <Line
            type="monotone"
            dataKey="rejected"
            name="Cancelled/Rejected"
            stroke="#f44336"
          />
        </LineChart>
      </Box>

      {/* Table */}
      <Box mt={5}>
        <Typography variant="h6">Email Logs</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Events</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Subject</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>2025-05-06 12:07:37</TableCell>
                <TableCell>Delivered</TableCell>
                <TableCell>andiswandlovu829@gmail.com</TableCell>
                <TableCell>C# Test TurboAPI Send(email)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2025-05-06 12:03:34</TableCell>
                <TableCell>Delivered</TableCell>
                <TableCell>andiswandlovu829@gmail.com</TableCell>
                <TableCell>C# Test TurboAPI Send(email)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Analytics;
