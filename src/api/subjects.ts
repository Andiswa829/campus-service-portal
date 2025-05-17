import axios from 'axios';
import { apiClient } from '../components/services/authService';

const API_BASE_URL = 'https://localhost:7158/api';



export const fetchStudentSubjects = async (studentId: number) => {
    //console.log("Fetching User by ID:", userId); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get(`/Student/${studentId}/subjects`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};