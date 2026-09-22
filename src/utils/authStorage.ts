import type { AuthSession, StoredUser, UserProfile } from "../types/auth";

const USERS_KEY = "techfinance_users";
const SESSION_KEY = "techfinance_session";

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as AuthSession;
    return parsed?.userId ? parsed : null;
  } catch {
    return null;
  }
}

function writeSession(session: AuthSession | null): void {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function toPublicUser(user: StoredUser): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    riskProfile: user.riskProfile,
    investmentGoal: user.investmentGoal,
    createdAt: user.createdAt,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getAllUsers(): StoredUser[] {
  return readUsers();
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  return readUsers().find((user) => user.email === normalized);
}

export function findUserById(id: string): StoredUser | undefined {
  return readUsers().find((user) => user.id === id);
}

export function saveUser(user: StoredUser): void {
  const users = readUsers();
  const index = users.findIndex((item) => item.id === user.id);

  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }

  writeUsers(users);
}

export function getSession(): AuthSession | null {
  return readSession();
}

export function setSession(userId: string | null): void {
  writeSession(userId ? { userId } : null);
}

export function getCurrentUser(): UserProfile | null {
  const session = readSession();
  if (!session) {
    return null;
  }

  const user = findUserById(session.userId);
  return user ? toPublicUser(user) : null;
}
