"use client";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Mock authentication service
export class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Check for stored user on initialization
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("socialfeed_user");
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
  }

  subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.currentUser));
  }

  async signUp(
    email: string,
    password: string,
    name: string,
    username: string
  ): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if username already exists (mock check)
    if (username === "admin" || username === "test") {
      throw new Error("Username already exists");
    }

    const user: User = {
      id: Date.now().toString(),
      name,
      username,
      email,
      avatar: `/placeholder.svg?height=100&width=100&query=avatar for ${name}`,
      bio: "",
      followers: 0,
      following: 0,
      posts: 0,
      createdAt: new Date().toISOString(),
    };

    this.currentUser = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("socialfeed_user", JSON.stringify(user));
    }
    this.notify();

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user for demo purposes
    const user: User = {
      id: "demo-user",
      name: "Demo User",
      username: "demouser",
      email,
      avatar: "/user-profile-illustration.png",
      bio: "Welcome to SocialFeed! This is a demo account.",
      followers: 42,
      following: 28,
      posts: 15,
      createdAt: "2024-01-01T00:00:00Z",
    };

    this.currentUser = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("socialfeed_user", JSON.stringify(user));
    }
    this.notify();

    return user;
  }

  async signOut(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    this.currentUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("socialfeed_user");
    }
    this.notify();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error("No user logged in");
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const updatedUser = { ...this.currentUser, ...updates };
    this.currentUser = updatedUser;

    if (typeof window !== "undefined") {
      localStorage.setItem("socialfeed_user", JSON.stringify(updatedUser));
    }
    this.notify();

    return updatedUser;
  }
}

export const authService = new AuthService();
