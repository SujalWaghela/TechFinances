import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  LoginInput,
  ProfileUpdateInput,
  RegisterInput,
  UserProfile,
} from "../types/auth";
import {
  findUserByEmail,
  getCurrentUser,
  hashPassword,
  saveUser,
  setSession,
  toPublicUser,
} from "../utils/authStorage";

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  register: (input: RegisterInput) => Promise<string | null>;
  login: (input: LoginInput) => Promise<string | null>;
  logout: () => void;
  updateProfile: (input: ProfileUpdateInput) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(() => getCurrentUser());

  const register = useCallback(async (input: RegisterInput) => {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    if (!name || !email || !password) {
      return "Please fill in all fields.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (findUserByEmail(email)) {
      return "An account with this email already exists.";
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: "",
      riskProfile: "moderate" as const,
      investmentGoal: "",
      createdAt: new Date().toISOString(),
      passwordHash,
    };

    saveUser(newUser);
    setSession(newUser.id);
    setUser(toPublicUser(newUser));
    return null;
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    if (!email || !password) {
      return "Please enter your email and password.";
    }

    const existing = findUserByEmail(email);
    if (!existing) {
      return "Invalid email or password.";
    }

    const passwordHash = await hashPassword(password);
    if (passwordHash !== existing.passwordHash) {
      return "Invalid email or password.";
    }

    setSession(existing.id);
    setUser(toPublicUser(existing));
    return null;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (input: ProfileUpdateInput) => {
      if (!user) {
        return "You must be logged in to update your profile.";
      }

      const name = input.name.trim();
      if (!name) {
        return "Name is required.";
      }

      const existing = findUserByEmail(user.email);
      if (!existing) {
        return "User account not found.";
      }

      const updated = {
        ...existing,
        name,
        phone: input.phone.trim(),
        riskProfile: input.riskProfile,
        investmentGoal: input.investmentGoal.trim(),
      };

      saveUser(updated);
      setUser(toPublicUser(updated));
      return null;
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      register,
      login,
      logout,
      updateProfile,
    }),
    [user, register, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
