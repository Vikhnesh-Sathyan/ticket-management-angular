import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'currentUser';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  register(email: string, password: string, name: string): boolean {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now(),
      email: email,
      name: name
    };

    // Store user credentials (in real app, password would be hashed)
    const userCredentials = {
      email: email,
      password: password, // In production, this should be hashed
      userId: newUser.id
    };

    users.push(newUser);
    this.saveUsers(users);
    this.saveCredentials(userCredentials);

    // Don't auto-login - user needs to login manually after registration
    return true;
  }

  login(email: string, password: string): boolean {
    const credentials = this.getCredentials();
    const userCred = credentials.find(c => c.email === email && c.password === password);

    if (userCred) {
      const users = this.getUsers();
      const user = users.find(u => u.id === userCred.userId);
      
      if (user) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        this.isAuthenticatedSubject.next(true);
        return true;
      }
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.storageKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  private checkAuthStatus(): void {
    this.isAuthenticatedSubject.next(this.isLoggedIn());
  }

  private getUsers(): User[] {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  private getCredentials(): Array<{email: string, password: string, userId: number}> {
    const data = localStorage.getItem('userCredentials');
    return data ? JSON.parse(data) : [];
  }

  private saveCredentials(credential: {email: string, password: string, userId: number}): void {
    const credentials = this.getCredentials();
    credentials.push(credential);
    localStorage.setItem('userCredentials', JSON.stringify(credentials));
  }
}

