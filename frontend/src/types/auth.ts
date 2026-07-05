export type RoleType = 'IT_HEAD' | 'IT_EXECUTIVE' | 'DEPARTMENT_LEAD' | 'AUDITOR';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: RoleType;
  avatarUrl?: string;
  phone?: string;
  department?: string | null;
  isOnline?: boolean;
  lastLoginAt?: string;
  skillTags?: string[];
  workloadScore?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
