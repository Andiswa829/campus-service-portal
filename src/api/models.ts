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
    roomId: string;
    date: string;
    timeSlot: string;
    userId: string; // Add other fields as required
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