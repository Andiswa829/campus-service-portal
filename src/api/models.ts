import { Room } from "../components/Booking/RoomBooking";

export interface Notification{
    notificationId: number;
    userId: number;
    user: UserProfile;
    message: string;
    type: NotificationType;
}

export interface NotificationType {
    id: number;
    name: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface UserProfile {
    email: string;
    role: string;
    userId: number; 
}

export interface UserProfile {  
    email: string;
    role: string;
    userId: number; 
    name: string; // Add other fields as required
    surname: string; // Add other fields as required
}

export interface IssueData {
    title: string;
    description: string;
    reportedBy: string; // Add other fields as required
}
export interface BookingData {
    bookingId: number;
    roomId: string;
    purposeId: number;
    startTime: Date;
    endTime: Date;
    userId: string; 
    statusId: number;
    room?:Room;
    roomName?:string;
   // status?:Status;
    status?:string;
    userName?:string;
    purpose?:string;
    userEmail?:string;
}

interface NewsItem {
    id: string;
    title: string;
    description: string;
  }
  
  interface Subject {
    id: string;
    subjectName: string;
    subjectCode: string;
    description: string;
  }
  
  export interface Events {
    id: string;
    title: string;
    date: string;
    description: string;
  }
  
  interface StudentDashboardProps {
    userId: number;
  }

export interface Status {
    id: number;
    name: string;
}



export interface UserRegistrationData {
    username: string;
    password: string;
    email: string; // Add other fields as required
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface UserProfile {
    email: string;
    role: string;
    userId: number; 
}