import axios from 'axios';

const API_URL = 'https://localhost:7158/api'; // Replace with your actual API URL

// export const login = async (email, password) => {
//     try {
//         const response = await axios.post(`${API_URL}/auth/login`, { email, password });
//         if (response.data.token) {
//             localStorage.setItem('user', JSON.stringify(response.data));
//         }
//         return response.data;
//     } catch (error) {
//         throw error.response.data;
//     }
// };

export const apiClient = axios.create({
  baseURL: 'https://localhost:7158/api', // Replace with your API base URL
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  console.log("Token:", token); // Log the token for debugging
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const fetchProtectedData = async () => {
  try {
      const response = await apiClient.get('/User/profile');
      return response.data;
  } catch (error) {
      console.error('Error fetching protected data:', error);
      throw error;
  }
};

export const login = async (email: string, password: string): Promise<string | null> => {
  localStorage.clear();
  try {
    // Define the API endpoint
    const apiUrl = "https://localhost:7158/api/User/login"; // Update the port if necessary

    // Prepare the request payload
    const payload = {
      email: email,
      password: password,
    };

    console.log("Payload:", payload); // Log the payload for debugging  

    // Make the POST request
    const response = await axios.post(apiUrl, payload);

    // Check if the response contains the token
    if (response.data && response.data.token) {
      // Store the token in localStorage or sessionStorage
      localStorage.setItem("authToken", response.data.token);
      console.log("Login successful!");
      console.log("Token:", response.data.token);

      return response.data.token; // Return the token for further use
    } else {
      console.error("Login failed: No token received.");
      throw new Error("Invalid login credentials."); // Explicitly throw an error
    }
  } catch (error) {
    // Handle errors
    if (axios.isAxiosError(error) && error.response) {
      console.error("Login failed:", error.response.data);
      throw new Error(error.response.data.message || "Invalid login credentials."); // Return error message from server or default
    } else {
      console.error("An error occurred:", (error as Error).message);
      throw new Error("An unexpected error occurred. Please try again."); // Return a generic error message
    }
  }
};

// Define the type for userData
interface UserData {
    email: string;
    password: string;
    [key: string]: any; // Add additional fields as needed
}

export const register = async (userData: UserData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    const user = getCurrentUser();
    return user && user.token ? true : false;
};

export const useAuth = () => {
    // Mock implementation of useAuth
    return { user: { role: 'admin' } };
};