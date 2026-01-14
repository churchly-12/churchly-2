import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Log requests and responses
apiClient.interceptors.request.use((config) => {
  console.log(`API REQUEST: ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

apiClient.interceptors.response.use((response) => {
  console.log(`API RESPONSE: ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
  return response;
}, (error) => {
  console.log(`API ERROR: ${error.config?.method.toUpperCase()} ${error.config?.url} - ${error.response?.status || error.message}`);
  return Promise.reject(error);
});

// REQUEST: Attach token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Function to attach response interceptor with logout
export const attachAuthInterceptors = (logout) => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await logout();
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;