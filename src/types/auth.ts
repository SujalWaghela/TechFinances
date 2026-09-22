export type RiskProfile = "conservative" | "moderate" | "aggressive";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  riskProfile: RiskProfile;
  investmentGoal: string;
  createdAt: string;
}

export interface StoredUser extends UserProfile {
  passwordHash: string;
}

export interface AuthSession {
  userId: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ProfileUpdateInput {
  name: string;
  phone: string;
  riskProfile: RiskProfile;
  investmentGoal: string;
}
