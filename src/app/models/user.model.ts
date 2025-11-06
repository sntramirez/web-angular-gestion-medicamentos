export interface User {
  id: number;
  username: string;
  password: string;
  nombre: string;
  rol: 'admin' | 'medico' | 'farmaceutico';
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}
