import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

interface User {
  id: string; // Changed from number to string for UUID
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Fetch user profile from backend API
 * @param userId - Supabase auth user ID (UUID)
 * @param accessToken - JWT access token from Supabase
 */
async function fetchProfile(userId: string, accessToken: string): Promise<User> {
  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  const data = await response.json();
  return data.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Get current session from Supabase
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          return;
        }

        if (currentSession) {
          setSession(currentSession);

          // Fetch user profile from backend
          try {
            const profile = await fetchProfile(
              currentSession.user.id,
              currentSession.access_token
            );
            setUser(profile);
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            // Clear session if profile fetch fails
            setSession(null);
            setUser(null);
          }
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state change:', event);

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          queryClient.clear();
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession) {
            setSession(newSession);

            // Fetch updated profile from backend
            try {
              const profile = await fetchProfile(
                newSession.user.id,
                newSession.access_token
              );
              setUser(profile);
            } catch (profileError) {
              console.error('Error fetching profile after auth change:', profileError);
            }
          }
        } else if (event === 'USER_UPDATED') {
          if (newSession) {
            setSession(newSession);
          }
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.session) {
        throw new Error('No session returned from login');
      }

      // Store session
      setSession(data.session);

      // Fetch user profile from backend
      const profile = await fetchProfile(
        data.session.user.id,
        data.session.access_token
      );
      setUser(profile);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase logout error:', error);
      }

      // Clear local state
      setSession(null);
      setUser(null);

      // Clear React Query cache
      queryClient.clear();
    } catch (error) {
      console.error('Logout error:', error);

      // Clear local state even if Supabase logout fails
      setSession(null);
      setUser(null);
      queryClient.clear();

      throw error;
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{
      user,
      session,
      setUser,
      login,
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
