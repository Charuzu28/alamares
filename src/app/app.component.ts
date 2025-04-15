import { Component, OnInit } from '@angular/core';
import { AuthService } from './authentication/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'it_elec_6a';
  userIsAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit(){  
    this.authService.autoAuthUser();  
  }  
}
