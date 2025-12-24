import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserId, saveUserId, clearUserId } from "../services/auth";

interface AuthContextData {
  userId: string | null;
  isLoading: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUserId = await getUserId();
      setUserId(storedUserId);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newUserId: string) => {
    await saveUserId(newUserId);
    setUserId(newUserId);
  };

  const logout = async () => {
    await clearUserId();
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
