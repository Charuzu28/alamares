import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '../core/services/theme/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs!: Subscription;
  public userIsAuthenticated = false; 
  isDarkMode = false;

  // Single constructor with all dependencies
  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();  
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {  
        this.userIsAuthenticated = isAuthenticated;  
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {  
    this.authService.logout();  
  }
}