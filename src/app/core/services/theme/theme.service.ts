import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;
  private readonly THEME_KEY = 'user-theme-preference';

  constructor() {
    // Check for saved preference
    const savedMode = localStorage.getItem(this.THEME_KEY);
    if (savedMode !== null) {
      this.darkMode = savedMode === 'true';
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem(this.THEME_KEY, this.darkMode.toString());
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }
}