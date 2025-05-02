import React, { useEffect, useState } from "react";
import { fetchProtectedData } from "../services/authService";
import LecturerDashboard from "../Dashboards/LecturerDashboard";
import StudentDashboard from "../Dashboards/StudentDashboard";
import { UserProfile } from "../../api/userApi";

const Dashboard: React.FC = () => {
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(Number);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const data: UserProfile = await fetchProtectedData();
        console.log("Data:", data); // Log the data for debugging
        setUserRole(data.role);
        setUserId(data.userId);
        setUserEmail(data.email);
        console.log("Protected data:", data);
      } catch (error) {
        console.error("Failed to fetch protected data:", error);
      }
    };

    getData();
  }, []);

  return (
    <>
      {userRole === "Admin" ? (
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome to the Smart Campus Services Portal Admin Dashboard.</p>
          <div>
            <h2>Statistics Overview</h2>
            {/* Add components or charts for displaying statistics here */}
          </div>
          <div>
            <h2>Manage Services</h2>
            {/* Add components for managing services like room bookings, announcements, etc. */}
          </div>
          <div>
            <h2>Recent Activity</h2>
            {/* Add a component to display recent activities or logs */}
          </div>
        </div>
      ) : userRole === "Lecturer" ? (
        <div>
         <LecturerDashboard userId={userId} />
        </div>
      ) : userRole === "Student" ? (
        <StudentDashboard userId={userId} />
      ) : (
        <div>
          <h1>General Dashboard</h1>
          <p>Welcome to the Smart Campus Services Portal.</p>
          <div>
            <h2>Campus News</h2>
            {/* Add components for displaying campus news */}
          </div>
          <div>
            <h2>Upcoming Events</h2>
            {/* Add components for displaying upcoming events */}
          </div>
          <div>
            <h2>Contact Support</h2>
            <p>If you need assistance, please contact campus support.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;