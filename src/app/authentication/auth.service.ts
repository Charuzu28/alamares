import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthData } from './auth.data.model';
import { Subject } from "rxjs"; 
import { Router } from "@angular/router";  

@Injectable({ providedIn: "root" })
export class AuthService {
    private token: string | null = '';
    private authStatusListener = new Subject<boolean>();  
    private isAuthenticated = false;
    private tokenTimer: any;
    private userId: string = ''; 

    constructor(private http: HttpClient, private router: Router) {} 

  getAuthStatusListener() {  
    return this.authStatusListener.asObservable();  
  }  

  // Signup method
  CreateUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  // Login method with token handling
  loginUser(email: string, password: string) {
    const authData: AuthData = { email, password };
  
    this.http
      .post<{ token: string, expiresIn: number, userId: string }>(
        "http://localhost:3000/api/user/login",
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.userId = response.userId; 
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
  
          // ✅ Save token, expiration, and userId
          this.saveAuthData(token, expirationDate, this.userId);  
          localStorage.setItem("userId", response.userId);  // ✅ This line
          this.router.navigate(['/']);
        }
        console.log("Token received:", this.token);
      });
  }
  

  getIsAuth() {  
    return this.isAuthenticated; 
  }
  getUserId(){  
    return this.userId;  
  }  

  logout() {  
    this.token = null;  
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    this.clearAuthData();  
    this.userId = ''; 
    clearTimeout(this.tokenTimer);   
  }   
  // Optional: Expose token to other services
  getToken() {
    return this.token;
  }
  autoAuthUser() {  
    const authInformation = this.getAuthData();    
    if (!authInformation) {
      return;
    }
    const now = new Date();   
    const expiresInDuration = authInformation.expirationDate.getTime() - now.getTime();  
    if(expiresInDuration > 0){  
      this.token = authInformation.token;  
      this.isAuthenticated = true;
      this.userId = authInformation.userId || '';
      this.setAuthTimer(expiresInDuration / 1000);      
      this.authStatusListener.next(true);  
    }  
  }
  
  private setAuthTimer(duration: number) {  
    this.tokenTimer=setTimeout(()=>{  
      this.logout();  
    }, duration*1000);  
  }

  private getAuthData() {  
    const token = localStorage.getItem("token");  
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");  
    if(!token|| !expirationDate){  
      return;  
    }  
    return{  
      token: token,  
      expirationDate: new Date(expirationDate),
      userId: userId   
    }    
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }  
  
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem("userId");  
  }
  
}
