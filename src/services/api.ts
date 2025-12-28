import axios from "axios";
import { User, Transaction, Goal, ChatMessage, ChatResponse } from "../types";

// Use o IP da sua máquina na rede local ao invés de localhost
// Para desenvolvimento local com Expo Go, precisamos usar o IP da máquina
const API_BASE_URL = "http://192.168.0.11:5010";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 segundos de timeout
});

// Adicionar interceptor para debug
api.interceptors.request.use(
  (config) => {
    console.log("🚀 API Request:", config.method?.toUpperCase(), config.url);
    console.log("🚀 Full URL:", `${config.baseURL}${config.url}`);
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
      // Servidor respondeu com erro
      console.error(
        "❌ Response Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // Requisição foi feita mas sem resposta
      console.error("❌ No Response - API pode estar offline ou IP incorreto");
      console.error("❌ Tentando conectar em:", API_BASE_URL);
    } else {
      console.error("❌ Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Users
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

// Transactions
export const createTransaction = async (data: {
  userId: string;
  title: string;
  amount: number;
  category: string;
  type: "INCOME" | "EXPENSE";
  frequency: string;
  date?: string;
}): Promise<Transaction> => {
  const response = await api.post("/transactions", data);
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

// Goals
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

// Chat
export const sendChatMessage = async (
  data: ChatMessage
): Promise<ChatResponse> => {
  const response = await api.post("/chat", data);
  return response.data;
};

export default api;
