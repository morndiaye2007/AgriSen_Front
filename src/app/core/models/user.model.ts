export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  region?: string;
  farmName?: string;
  profilePicture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  AGRICULTEUR = 'agriculteur',
  ACHETEUR = 'acheteur',
  COOPERATIVE = 'cooperative',
  ADMIN = 'admin'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  region?: string;
  farmName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

