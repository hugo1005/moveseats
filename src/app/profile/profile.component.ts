import { Component, OnInit } from '@angular/core';
import { ViewFilter } from '../view-filter';

import { UserService } from '../user.service';
import { AsyncService } from '../async.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../main.css']
})
export class ProfileComponent implements OnInit {
  
  loggedInUser = undefined;

  constructor(private userService: UserService) {
    this.userService.ListenForLogin().subscribe(login => this.loggedInUser =login.user);
  }

  ngOnInit() {
    window.scrollTo(0,0);
  }
}
