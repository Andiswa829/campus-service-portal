import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { fetchLecturerSubjects } from "../../api/api";
import { fetchAllUsers } from "../../api/userApi";
import { UserProfileDetails } from "../Authentication/UserProfile";
// Removed incorrect import of 'data' from 'react-router-dom'
import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Line } from "recharts";
import { fetchAllBookings } from "../../api/booking";
import { BookingData } from "../../api/models";
import BookingHelper from "../Booking/BookingHelper";
import Analytics from "../Admin/Analytics";
import IssueReporting from "../Maintenance/IssueReporting";
import IssueReportingDashboard from "../Admin/IssueReporting";
import IssueReportingFooter from "../Maintenance/IssueReportingFooter";

interface User {
  userId: number;
  name: string;
  email: string;
  role?: { roleName: string };
  roleId: number; // Optional field for roleId
  courseId?: string; // Optional field for courseId
  facultyId?: string; // Optional field for facultyId
  departmentId?: string; // Optional field for departmentId
  // Optional field for role with roleName property
}

interface AdminDashboardProps {
  userId: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState(0); // Default to Home tab
  const [users, setUsers] = useState<User[]>([]);
  //     { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com" },
  //     { id: 2, name: "Bob Smith", email: "bob.smith@example.com" },
  //   ]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "update">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleId: 0,
    courseId: "",
    facultyId: "",
    departmentId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data.$values);
        setFilteredUsers(data.$values); // Update filteredUsers with the fetched data
        console.log("Users:", data.$values); // Log the data for debugging
      } catch (err) {
        setError("Could not fetch users");
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllBookings();
        setBookings(data.$values);
        // setFilteredUsers(data); // Update filteredUsers with the fetched data
        console.log("Bookings:", data); // Log the data for debugging
      } catch (err) {
        setError("Could not fetch bookings");
      }
    };

    fetchData();
  }, []);

  const handleAddBooking = (booking: BookingData) => {
    setBookings((prev) => [...prev, booking]);
  };

  const handleUpdateBooking = (updatedBooking: BookingData) => {
    console.log("Updated Booking:", updatedBooking);
    setBookings((prev) =>
      prev.map((booking) =>
        booking.bookingId === updatedBooking.bookingId
          ? updatedBooking
          : booking
      )
    );
  };

  const handleDeleteBooking = (id: number) => {
    setBookings((prev) => prev.filter((booking) => booking.bookingId !== id));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role?.roleName.toLowerCase().includes(query)
      )
    );
  };

  const handleDialogOpen = (mode: "add" | "update", user?: User) => {
    setDialogMode(mode);
    setSelectedUser(user || null);

    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        courseId: user.courseId || "",
        facultyId: user.facultyId || "",
        departmentId: user.departmentId || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        roleId: 0,
        courseId: "",
        facultyId: "",
        departmentId: "",
      });
    }

    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData({
      name: "",
      email: "",
      roleId: 0,
      courseId: "",
      facultyId: "",
      departmentId: "",
    });
  };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "roleId" || name.includes("Id") ? parseInt(value) : value,
    }));
  };

  const handleFormSubmit = () => {
    if (dialogMode === "add") {
      const newUser = {
        userId: users.length + 1, // Use userId for consistency
        ...formData,
      };
      setUsers((prev) => [...prev, newUser]);
      setFilteredUsers((prev) => [...prev, newUser]);
    } else if (dialogMode === "update" && selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.userId === selectedUser.userId ? { ...user, ...formData } : user
        )
      );
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.userId === selectedUser.userId ? { ...user, ...formData } : user
        )
      );
    }
    handleDialogClose();
  };

  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.userId !== id));
    setFilteredUsers((prev) => prev.filter((user) => user.userId !== id));
  };

  return (
    <>
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* General Header */}
      <Box
        bgcolor="#1e3a8a"
        color="white"
        p={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5">Admin Dashboard</Typography>
        <UserProfileDetails userId={userId} /> {/* User Profile Menu */}
      </Box>

      {/* Main Content */}
      <Box display="flex" flex={1}>
        {/* Sidebar as Tabs */}
        <Box width="200px" bgcolor="#1e3a8a" color="white" p={2}>
          <Tabs
            orientation="vertical"
            value={activeTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="primary"
          >
            <Tab label="Home" sx={{ alignItems: "flex-start" }} />
            <Tab label="Users" sx={{ alignItems: "flex-start" }} />
            <Tab label="Bookings" sx={{ alignItems: "flex-start" }} />
            <Tab label="Issues Reported" sx={{ alignItems: "flex-start" }} />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box flex={1} p={3}>
          {activeTab === 0 && <Analytics />}
          {activeTab === 1 && (
            <>
              <Typography variant="h5" gutterBottom>
                Users
              </Typography>
              <TextField
                label="Search by Name or Email or Role"
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
                Add User
              </Button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(filteredUsers) &&
                      filteredUsers.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell>{user.userId}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.role ? user.role.roleName : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() => handleDialogOpen("update", user)}
                              sx={{ marginRight: 1 }}
                            >
                              Update
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDeleteUser(user.userId)}
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
                  {dialogMode === "add" ? "Add User" : "Update User"}
                </DialogTitle>
                <DialogContent>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    fullWidth
                    margin="normal"
                  />

                  <FormControl fullWidth margin="normal">
                      <InputLabel id="role-label">Role</InputLabel> {" "}
                    <Select
                      labelId="role-label"
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleFormChange}
                      label="Role"
                    >
                          <MenuItem value={1}>Admin</MenuItem>
                          <MenuItem value={2}>Student</MenuItem>
                          <MenuItem value={3}>Lecturer</MenuItem> {" "}
                    </Select>
                  </FormControl>

                  {(formData.roleId === 2 || formData.roleId === 3) && (
                    <>
                         {" "}
                      <TextField
                        label="Course ID"
                        name="courseId"
                        value={formData.courseId || ""}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                      />
                         {" "}
                      <TextField
                        label="Faculty ID"
                        name="facultyId"
                        value={formData.facultyId || ""}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                      />
                         {" "}
                      <TextField
                        label="Department ID"
                        name="departmentId"
                        value={formData.departmentId || ""}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                      />
                       {" "}
                    </>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDialogClose} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={handleFormSubmit} color="primary">
                    {dialogMode === "add" ? "Add" : "Update"}
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
          {activeTab === 2 && (
            <BookingHelper
              bookings={bookings}
              onAddBooking={handleAddBooking}
              onUpdateBooking={handleUpdateBooking}
              onDeleteBooking={handleDeleteBooking}
              userId={userId}
            />
          )}
          {activeTab === 3 && (
            <Box>
              <IssueReportingDashboard />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
    <IssueReportingFooter userId={userId} />
    </>
  );
};

export default AdminDashboard;
