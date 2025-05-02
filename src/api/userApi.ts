import axios from 'axios';
import { apiClient } from '../components/services/authService';

const API_BASE_URL = 'https://localhost:7158/api';

export interface UserProfile {  
    email: string;
    role: string;
    userId: number; 
    name: string; // Add other fields as required
    surname: string; // Add other fields as required
}

export const fetchUserById = async (userId: number) => {
    console.log("Fetching User by ID:", userId); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get(`/User/${userId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};