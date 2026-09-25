import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  client_id: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  
  currentUser = signal<User | null>(null);
  
  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        if (user && typeof user === 'object') {
          this.currentUser.set(user);
        } else {
          this.logout();
        }
      } catch (e) {
        this.logout();
      }
    } else if (token || userStr) {
      // Inconsistent state (has token but no user, or vice versa)
      this.logout();
    }
  }

  login(credentials: any) {
    return this.http.post<{success: boolean, data: {token: string, user: User}}>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            this.currentUser.set(response.data.user);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
