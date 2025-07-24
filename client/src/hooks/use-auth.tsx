import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", "/api/auth/me");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      setUser(null);
      queryClient.clear();
    } catch (error) {
      console.error("Logout error:", error);
      // Clear local state even if server logout fails
      setUser(null);
      queryClient.clear();
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      logout, 
      isLoading, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
