import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  // Usuarios mock para desarrollo y pruebas
  private mockUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      nombre: 'Administrador',
      rol: 'admin',
      email: 'admin@hospital.com'
    },
    {
      id: 2,
      username: 'medico1',
      password: 'medico123',
      nombre: 'Dr. Juan Pérez',
      rol: 'medico',
      email: 'jperez@hospital.com'
    },
    {
      id: 3,
      username: 'farmacia',
      password: 'farma123',
      nombre: 'María González',
      rol: 'farmaceutico',
      email: 'mgonzalez@hospital.com'
    }
  ];

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return of(this.mockUsers).pipe(
      delay(500), // Simular latencia de red
      map(users => {
        const user = users.find(
          u => u.username === loginRequest.username && u.password === loginRequest.password
        );

        if (user) {
          // No guardar la contraseña en localStorage
          const userWithoutPassword = { ...user };
          delete (userWithoutPassword as any).password;

          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          localStorage.setItem('token', 'fake-jwt-token-' + user.id);
          this.currentUserSubject.next(userWithoutPassword);

          return {
            success: true,
            user: userWithoutPassword,
            token: 'fake-jwt-token-' + user.id
          };
        } else {
          return {
            success: false,
            message: 'Usuario o contraseña incorrectos'
          };
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!localStorage.getItem('token');
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    return !!user && roles.includes(user.rol);
  }
}
