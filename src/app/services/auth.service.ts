import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private usersDataUrl = '/assets/data/users.json';

  constructor(private http: HttpClient) {
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
    return this.http.get<{ users: User[] }>(this.usersDataUrl).pipe(
      delay(500), // Simular latencia de red
      map(response => {
        const user = response.users.find(
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
