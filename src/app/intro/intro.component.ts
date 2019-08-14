import { Component, OnInit } from '@angular/core';
import { AsyncService } from '../async.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css', '../main.css']
})
export class IntroComponent implements OnInit {

  isLoggedIn = undefined;

  constructor(private asyncService: AsyncService, private authService: AuthService) { 
    this.asyncService.onLogin(false).subscribe((login) => {
      this.isLoggedIn = login.user;
    });
  }

  ngOnInit() {
  }

  BetaLogin() {
    this.authService.login();
  }

  ScrollDown() {
    
  }
}
