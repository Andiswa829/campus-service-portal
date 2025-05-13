import axios from 'axios';
import { apiClient } from '../components/services/authService';

const API_BASE_URL = 'https://localhost:7158/api';

export interface NotificationDto {
    notificationId?: number;
    userId: number; // Lecturer's user ID
    message: string;
    title: string;
    typeId: number;
    createdDate: string;
    subjectId?: number | null; // Optional field for subject ID
    subject?: string | null; // Optional field for subject name
}

export interface NotificationType {
    id: number;
    name: string;
}

export const getNotificationTypes = async () => {
    //console.log("Fetching User by ID:", userId); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get(`/Notification/types`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const createNotifcation = async (notification:NotificationDto) => {
    //console.log("Fetching User by ID:", userId); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.post(`/Notification/create`, notification);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const geAlltNotifications = async () => {
    //console.log("Fetching User by ID:", userId); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get(`/Notification`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const getNotificationByUserId = async () => {
    //console.log("Fetching User by ID:", userId); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get(`/Notification`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};