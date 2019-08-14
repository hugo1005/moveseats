import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './main.css']
})
export class AppComponent {
  title = 'app';

  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }
}
