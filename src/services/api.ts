import axios from "axios";
import { User, Transaction, Goal, ChatMessage, AuthResponse, GoogleAuthResponse } from "../types";
import { getToken } from "./auth";
import Constants from "expo-constants";

// Helper to determine the correct URL automatically
// Helper to determine the correct URL automatically
const getBaseUrl = () => {
  // 1. If explicit env var is set, verify if it's usable.
  // We prioritize the dynamic config unless the user REALLY wants to force it.
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    console.log("⚠️ Using API URL from .env:", process.env.EXPO_PUBLIC_API_BASE_URL);
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  // 2. Dynamic detection via Expo Constants
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];
  
  if (!localhost) {
    // Fallback for simulators if not found
    console.log("⚠️ Could not detect localhost IP, falling back to Android Emulator default: http://10.0.2.2:5010");
    return "http://10.0.2.2:5010"; 
  }
  
  // Use the IP address of the machine running the Expo server
  const dynamicUrl = `http://${localhost}:5010`;
  console.log("✅ Detected Dynamic API URL:", dynamicUrl);
  return dynamicUrl;
};

const API_BASE_URL = getBaseUrl();

console.log("🚀 API_BASE_URL initialized as:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

api.interceptors.request.use(
  async (config) => {
    console.log("🚀 API Request:", config.method?.toUpperCase(), config.url);
    
    const token = await getToken();
    if (token) {
      console.log("🔑 Attaching Token:", token.substring(0, 10) + "...");
      config.headers.Authorization = `Bearer ${token}`; // Axios 1.x supports direct assignment, but let's be explicit if needed
      // Note: In newer Axios versions, headers is an AxiosHeaders object.
      // config.headers.set('Authorization', `Bearer ${token}`); 
    } else {
      console.log("⚠️ No token found in SecureStore");
    }
    
    console.log("📨 Final Headers:", JSON.stringify(config.headers));

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        "❌ Response Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("❌ No Response - API pode estar offline ou IP incorreto");
      console.error("❌ Tentando conectar em:", API_BASE_URL);
    } else {
      console.error("❌ Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

export const createUser = async (data: {
  email: string;
  name: string;
  monthlyIncome?: number;
  fixedExpenses?: number;
}): Promise<User> => {
  const response = await api.post("/users", data);
  return response.data;
};

export const getUser = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (
  userId: string,
  data: Partial<User>
): Promise<User> => {
  const response = await api.patch(`/users/${userId}`, data);
  return response.data;
};

export const createTransaction = async (data: {
  userId: string;
  title: string;
  amount: number;
  category: string;
  type: "INCOME" | "EXPENSE";
  frequency: string;
  date?: string;
}): Promise<Transaction> => {
  const { userId, ...transactionData } = data;
  // Backend enforces UUID in body, but user ID is not UUID.
  // Sending dummy UUID to satisfy validator; backend should use Token ID.
  const payload = { ...transactionData, userId: "00000000-0000-0000-0000-000000000000" };
  const response = await api.post("/transactions", payload);
  return response.data;
};

export const getTransactions = async (
  userId: string
): Promise<Transaction[]> => {
  const response = await api.get(`/transactions?userId=${userId}`);
  return response.data;
};

export const updateTransaction = async (
  transactionId: string,
  data: Partial<Transaction>
): Promise<Transaction> => {
  const response = await api.patch(`/transactions/${transactionId}`, data);
  return response.data;
};

export const deleteTransaction = async (
  transactionId: string
): Promise<void> => {
  await api.delete(`/transactions/${transactionId}`);
};

export const createGoal = async (data: {
  userId: string;
  title: string;
  targetAmount: number;
}): Promise<Goal> => {
  const response = await api.post("/goals", data);
  return response.data;
};

export const getGoals = async (): Promise<Goal[]> => {
  const response = await api.get("/goals");
  return response.data;
};

export const sendChatMessage = async (
  data: ChatMessage
): Promise<any> => {
  const { userId, ...messageData } = data;
  // Backend enforces UUID in body, but user ID is not UUID.
  // Sending dummy UUID to satisfy validator; backend should use Token ID.
  const payload = { ...messageData, userId: "00000000-0000-0000-0000-000000000000" };
  const response = await api.post("/chat", payload);
  return response.data;
};

// Auth
export const googleLogin = async (token: string): Promise<GoogleAuthResponse> => {
  const response = await api.post("/auth/google", { token });
  return response.data;
};

export const registerUser = async (data: {
  email: string;
  name: string;
  monthlyIncome: number;
  fixedExpenses: number;
}): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export default api;
