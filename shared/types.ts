
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  signupDate: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}
