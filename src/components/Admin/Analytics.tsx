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
  Cell,
  Pie,
  PieChart,
} from "recharts";
import axios from "axios";
import { getBookingStatusCount } from "../../api/booking";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { fetchIssuesReported } from "../../api/issueReporting";

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

  // const [chartData, setChartData] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [totalBookings, setTotalBookings] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [reportedIssuesData, setReportedIssuesData] = useState<
    { name: string; value: number }[]
  >([]);

  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  console.log("totalBookings", totalBookings); // Log the total bookings for debugging

  useEffect(() => {
    const fetchReportedIssues = async () => {
      try {
        const response = await fetchIssuesReported();
        setReportedIssuesData(response.$values);

        // Group issues by status
        const groupedIssues = response.$values.reduce(
          (acc: any, issue: any) => {
            acc[issue.status] = (acc[issue.status] || 0) + 1;
            return acc;
          },
          {}
        );

        // Transform data for the pie chart
        const chartData = Object.keys(groupedIssues).map((status) => ({
          name: status,
          value: groupedIssues[status],
        }));

        setReportedIssuesData(chartData);
      } catch (error) {
        console.error("Error fetching reported issues:", error);
      }
    };

    fetchReportedIssues();
  }, []);

  const handleExport = () => {
    const csvData = [
      ["Category", "Count"],
      ["Approved Bookings", approvedCount],
      ["Pending Bookings", pendingCount],
      ["Cancelled/Rejected Bookings", rejectedCount],
      ["Total Bookings", totalBookings],
      ["", ""], // Add an empty row for separation
      ["Reported Issues", "Count"],
      ...reportedIssuesData.map((issue) => [issue.name, issue.value]), // Add reported issues data
    ];
  
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "dashboard_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    // Fetch booking status counts from the API
    const fetchBookingStatus = async () => {
      try {
        const response = await getBookingStatusCount();
        console.log("Booking Counts:", response); // Log the response for debugging
        const data = response;
        setTotalBookings(
          data.approvedCount + data.pendingCount + data.rejectedCount
        );
        setApprovedCount(data.approvedCount);
        setPendingCount(data.pendingCount);
        setRejectedCount(data.rejectedCount);

        setChartData([
          { name: "Approved", value: data.approvedCount },
          { name: "Pending", value: data.pendingCount },
          { name: "Rejected", value: data.rejectedCount },
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
        <Button variant="contained" onClick={handleExport}>
          Export
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 2 }}>
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography>Approved Bookings</Typography>
            <CircularProgressbar
              value={(approvedCount / totalBookings) * 100}
              maxValue={100}
              styles={buildStyles({
                textColor: "#4caf50",
                pathColor: "#4caf50",
                trailColor: "#d6d6d6",
              })}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 2 }}>
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography>Pending Bookings</Typography>
            <CircularProgressbar
              value={(pendingCount / totalBookings) * 100}
              maxValue={100}
              styles={buildStyles({
                textColor: "#ff9800",
                pathColor: "#ff9800",
                trailColor: "#d6d6d6",
              })}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 2 }}>
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography>Cancelled/Rejected</Typography>
            <CircularProgressbar
              value={(rejectedCount / totalBookings) * 100}
              maxValue={100}
              styles={buildStyles({
                textColor: "#f44336",
                pathColor: "#f44336",
                trailColor: "#d6d6d6",
              })}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box mt={5} >
        <Typography variant="h6" gutterBottom>
          Reported Issues 
        </Typography>
        {reportedIssuesData.length > 0 ? (
          <PieChart width={400} height={400}>
            <Pie
              data={reportedIssuesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {reportedIssuesData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={
                    index === 0
                      ? "#ff9800" // Resolved
                      : index ===  1 
                      ? "#4caf50" 
                      : index === 2
                     // In Progress
                      ? "#8884d8" // Open
                      : "#f44336" // Default color
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <Typography color="error">
            No data available for reported issues.
          </Typography>
        )}
      </Box>

      {/* Table */}
      <Box mt={5}>
        <Typography variant="h6">Pending Bookings</Typography>
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
