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
    isActive?: boolean; // Optional field for active status
    isRead?: boolean; // Optional field for read status
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

export const getNotificationByUserId = async (userId:number) => {
    console.log("Fetching Notifications by UserID:", userId); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get(`/Notification/user/${userId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const deleteNotification = async (userId:number,notificationId:number) => {
    try {
        const response = await apiClient.delete(`/Notification/delete/userId/${userId}/id/${notificationId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const updateNotification = async (notificationId:number,notification:NotificationDto) => {
    try {
        const response = await apiClient.put(`/Notification/update/${notificationId}`, notification);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};
export const getNotificationBySubjectId = async (subjectId:number) => {
    console.log("Fetching Notifications by SubjectID:", subjectId); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get(`/Notification/subject/${subjectId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const getNotificationBySubjectIds = async (ids:number[]) => {
    try {
        const response = await apiClient.post(`/Notification/subjectIds`, ids);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};