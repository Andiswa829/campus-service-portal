import axios from 'axios';
import { apiClient } from '../components/services/authService';
import { BookingData } from './models';

const API_BASE_URL = 'https://localhost:7158/api';



export const fetchAllRooms = async () => {
    console.log("Fetching All Rooms"); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get('/Room');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const fetchAllBookings = async () => {
    console.log("Fetching All Rooms"); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get('/Booking');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const fetchBookingById = async (bookingId: number) => {
    console.log("Fetching Booking by ID:", bookingId); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get(`/Booking/${bookingId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export interface BookingDataDto {
    userId: number;
    roomId: number;
    startDateTime: Date;
    endDateTime: Date;
    purposeId: number;
    bookingStatus?: string;
}

export const createBooking = async (booking:BookingDataDto) => {
    console.log("Fetching All Bookings"); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.post('/Booking/create',booking);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const getBookingPurposes = async () => {
    console.log("Fetching All Booking purposes"); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get('/Booking');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const getBookingStatusCount = async () => {
    console.log("Fetching All Bookings"); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get('/Booking/status-counts');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const fetchAllBookingsByUserId = async (userId:number) => {
    console.log("Fetching All Rooms"); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get(`/Booking/user/${userId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};
