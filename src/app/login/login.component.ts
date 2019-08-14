import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../main.css']
})
export class LoginComponent implements OnInit {

  @Input('altStyle')
  alt: boolean = true;

  styles = {
    'btn-alt': this.alt,
    'btn-std': !this.alt
  }

  isLoggedIn: boolean = false;
  msgStates: string[] = ["Login / Sign Up", "Logout"];
  msg: string = "Login / Sign Up";

  constructor(private authService: AuthService, private userService: UserService) { 
    this.userService.ListenForLogin().subscribe((login) => {
        this.msg = login.user ? this.msgStates[1] : this.msgStates[0];
        this.isLoggedIn = login.user ? true: false;
      });
  }

  ngOnInit() {
    this.styles = {
      'btn-alt': this.alt,
      'btn-std': !this.alt
    };

    this.msg = this.alt? "Login / Sign Up": "Login";
    this.msgStates[0] = this.msg;
  }

  ToggleLogin() {
    this.isLoggedIn? this.authService.logout() : this.authService.login();
  }
}
