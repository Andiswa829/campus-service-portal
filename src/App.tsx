import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Authentication/Login';
import Analytics from './components/Admin/Analytics';
import Dashboard from './components/Admin/Dashboard';
import Register from './components/Authentication/Register';
//import RoleBasedAccess from './components/Authentication/RoleBasedAccess';
import AppointmentBooking from './components/Booking/AppointmentBooking';
import RoomBooking from './components/Booking/RoomBooking';
import IssueReporting from './components/Maintenance/IssueReporting';
import TimetableViewer from './components/Timetable/TimetableViewer';
import GeneralDashboard from './components/Dashboards/GeneralDashboard';

function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/role-based-access" element={<RoleBasedAccess component={SomeComponent} allowedRoles={['Admin', 'User']} />} /> */}
         {/* <Route path="/room-booking" element={<RoomBooking userId={0} />} /> */}
        <Route path="/appointment-booking" element={<AppointmentBooking />} />
        <Route path="/timetable" element={<TimetableViewer />} />
        <Route path="/issue-reporting" element={<IssueReporting />} />
        {/* {/* <Route path="/notifications" element={<NotificationCenter />} />/} */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        {/* <Route path="/" element={<GeneralDashboard />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
