import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { DbObject } from '../db-object';
import { AsyncService } from '../async.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css', '../main.css']
})
export class DebugComponent implements OnInit {

  constructor(private userService: UserService, private asyncService: AsyncService) { }

  state = {
    dbTests: {
      flights: undefined,
      users: undefined
    },
    admin: {
      loggedInUser: undefined,
      users: undefined
    }
  }

  ngOnInit() {
    this.state.dbTests['flights'] = this.userService.Ref('flights');
    
    this.asyncService.onLogin(true).subscribe((login) => {
      this.state.admin['loggedInUser'] = login.user;
      this.state.dbTests['users'] = this.userService.Ref(`users`);  
    });
  }

  DebugToggleLogin(userId: string) {
    this.state.admin['loggedInUser']===userId?this.userService.Logout():this.userService.Login(userId);
  }

  ResetDb() {
    this.userService.Ref('users').Update({});
    this.userService.Ref('flights').Update({});
    this.userService.Ref('stats').Update({
        "flights": 0,
        "seats": 0,
        "swaps": 0,
        "users": 0
    });
  }
}
