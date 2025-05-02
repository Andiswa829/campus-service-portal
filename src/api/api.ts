import axios from 'axios';
import { apiClient } from '../components/services/authService';
import { BookingData, IssueData, LoginCredentials, UserRegistrationData } from './models';

const API_BASE_URL = 'https://localhost:7158/api'; // Replace with your actual API base URL

// Function to handle user login
export const loginUser = async (credentials: LoginCredentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/User/login`, credentials);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

// Function to handle user registration
// Define the type for user registration data

export const registerUser = async (userData: UserRegistrationData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

// Function to fetch room availability
export const fetchRoomAvailability = async (date: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rooms/availability`, { params: { date } });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

// Function to book a room
// Define the type for booking data
export const bookRoom = async (bookingData: BookingData) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/rooms/book`, bookingData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

// Function to report an issue


export const reportIssue = async (issueData: IssueData) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/maintenance/report`, issueData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

// Function to fetch class timetable
export const fetchTimetable = async (subjectId: string) => {
    try {
        const response = await apiClient.get(`${API_BASE_URL}/timetable/${subjectId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

// Function to fetch notifications
export const fetchNotifications = async (userId: string) => {
    try {
        const response = await apiClient.get(`${API_BASE_URL}/notifications/${userId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const fetchLecturerSubjects = async (lecturerId: number) => {
    console.log("Fetching subjects for lecturer ID:", lecturerId); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get(`/Lecturer/${lecturerId}/subjects`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};