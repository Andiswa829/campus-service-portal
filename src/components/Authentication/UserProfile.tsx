import React, { useEffect, useState } from "react";
import {
  IconButton,
  Avatar,
  Menu,
  Box,
  Typography,
  Divider,
  MenuItem,
  Grid,
  Paper,
  Button,
  Drawer,
} from "@mui/material";
import { fetchUserById } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

interface UserProfileProps {
  userId: number;
}

export const UserProfileDetails: React.FC<UserProfileProps> = ({ userId }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userData, setUserData] = useState<any>(null); // Replace 'any' with the appropriate type for user data
  const [error, setError] = useState<string | null>(null); // State to hold error messages
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to toggle the drawer
  const navigate = useNavigate();
  
  const getInitials = () => {
    if (userData && userData.name && userData.surname) {
      return `${userData.name[0]}${userData.surname[0]}`.toUpperCase();
    }
    return ""; // Default initials
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserById(userId);
        setUserData(data);
        console.log("Data:", data); // Log the data for debugging
      } catch (err) {
        setError("Could not fetch user data");
      }
    };

    fetchData();
  }, [userId]);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleViewProfile = () => {
    setIsDrawerOpen(true); // Open the side navigation bar
    handleMenuClose();
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false); // Close the side navigation bar
  };

  const handleSignOut = () => {
    // Add sign-out logic here
    logout(); // Call the logout function to clear session data
    navigate("/"); // Redirect to the login page
    handleMenuClose();
  };

  return (
    <>
      <IconButton
        sx={{ position: "absolute", top: "16px", right: "16px" }}
        onClick={handleMenuOpen}
      >
        <Avatar src="/assets/avatar-placeholder.png" sx={{ marginRight: 2 }}>
          {getInitials()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
      >
        <Box sx={{ padding: "16px", display: "flex", alignItems: "center" }}>
          <Avatar
            src="/assets/avatar-placeholder.png"
            sx={{ marginRight: 2 }}
          >
            {getInitials()}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {userData
                ? `${userData.name} ${userData.surname}`
                : "Loading..."}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {userData ? userData.email : "Loading..."}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleViewProfile}>
          <Typography variant="body2">View Account</Typography>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <Typography variant="body2">Sign Out</Typography>
        </MenuItem>
      </Menu>

      {/* Drawer for User Profile */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        sx={{ width: 300 }}
      >
        <Box
          sx={{
            width: 300,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <Box>
            {userData ? (
              <UserDetailsView user={userData} />
            ) : (
              <Typography variant="body1" color="error">
                {error || "Loading user data..."}
              </Typography>
            )}
          </Box>
          <Button
            variant="outlined"
            onClick={handleCloseDrawer}
            sx={{ alignSelf: "center", marginBottom: 2 }}
          >
            Close
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

interface Role {
  roleId: number;
  roleName: string;
  description: string;
}

interface UserData {
  userId: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string | null;
  profilePicture: string | null;
  role: Role;
}

export const UserDetailsView: React.FC<{ user: UserData }> = ({ user }) => {
  const getInitials = () => {
    return `${user.name[0]}${user.surname[0]}`.toUpperCase();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
        <Avatar
          src={user.profilePicture || undefined}
          alt={getInitials()}
          sx={{ width: 64, height: 64, marginRight: 2 }}
        >
          {getInitials()}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {user.name} {user.surname}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
      <Grid size={{xs:12}}>
          <Typography variant="body1">
            <strong>Role:</strong> {user.role.roleName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user.role.description}
          </Typography>
        </Grid>
        <Grid size={{xs:12}}>
          <Typography variant="body1">
            <strong>Phone Number:</strong> {user.phoneNumber || "Not Provided"}
          </Typography>
        </Grid>
        <Grid size={{xs:12}}>
          <Typography variant="body1">
            <strong>User ID:</strong> {user.userId}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};