import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
      
@Component({  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  
})  
export class logincomponent{  
    Loading = false; 
    email: string = '';
    password: string = '';
    
    constructor() {}
  
    onLogin(form: NgForm){  
        console.log(form.value);  
      }  
}  