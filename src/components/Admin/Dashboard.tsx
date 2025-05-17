import React, { useEffect, useState } from "react";
import { fetchProtectedData } from "../services/authService";
import LecturerDashboard from "../Dashboards/LecturerDashboard";
import StudentDashboard from "../Dashboards/StudentDashboard";
import { UserProfile } from "../../api/userApi";
import AdminDashboard from "../Dashboards/AdminDashboard";
import GeneralDashboard from "../Dashboards/GeneralDashboard";
import Login from "../Authentication/Login";

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
        <AdminDashboard userId={userId}/>
      ) : userRole === "Lecturer" ? (
        <div>
         <LecturerDashboard userId={userId} />
        </div>
      ) : userRole === "Student" ? (
        <StudentDashboard userId={userId} />
      ) : (
       <Login/>
      )}
    </>
  );
};

export default Dashboard;