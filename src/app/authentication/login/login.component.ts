import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AuthService} from '../auth.service';  
      
@Component({  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  
})  
export class logincomponent{  
    Loading = false; 
    email: string = '';
    password: string = '';
    
    constructor(public authservice: AuthService) {}
  
    onLogin(form: NgForm){  
      if(form.invalid){  
        return;  
      }  
      this.Loading = true;
      this.authservice.loginUser(form.value.email, form.value.password);  
    }  
}  