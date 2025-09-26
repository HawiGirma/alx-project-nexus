"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type User, type AuthState, authService } from "@/lib/auth";

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (
    email: string,
    password: string,
    name: string,
    username: string
  ) => Promise<User>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Initialize auth state
    const user = authService.getCurrentUser();
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    });

    // Subscribe to auth changes
    const unsubscribe = authService.subscribe((user) => {
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.signIn(email, password);
      return user;
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    username: string
  ) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.signUp(email, password, name, username);
      return user;
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.signOut();
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.updateProfile(updates);
      return user;
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
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
