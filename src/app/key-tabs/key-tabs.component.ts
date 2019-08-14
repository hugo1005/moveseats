import { Component, OnInit } from '@angular/core';
import { ViewFilter } from '../view-filter';

import { UserService } from '../user.service';
import { AsyncService } from '../async.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-key-tabs',
  templateUrl: './key-tabs.component.html',
  styleUrls: ['./key-tabs.component.css', '../main.css']
})
export class KeyTabsComponent implements OnInit {

  /* 
    Will require: 
    noFilter
    loggedInUser
    Requests, User Seats
  */

  state = {
    loggedInUser: undefined,
    noFilter: new ViewFilter([], 'noFilter'),
    active: {
      requests: undefined,
      seats: undefined
    },
    debug: environment.showDebug
  }

  constructor(private userService: UserService, private asyncService: AsyncService) {
    this.UserSeats = this.asyncService.Seats;
    this.Requests = this.asyncService.Requests;

    this.userService.ListenForLogin().subscribe((login) => {
        this.LoggedInUser=login.user;
    }); 
  }

  ngOnInit() {
  }

  set LoggedInUser(user) {
    this.state.loggedInUser = user;
  }

  get LoggedInUser() {
    return this.state.loggedInUser;
  }

  get Requests() {
    return this.state.active.requests;
  }

  set Requests(val) {
    this.state.active.requests = val;
  }

  set UserSeats(seats) {
    this.state.active.seats = seats;
  }

  get UserSeats() {
    return this.state.active.seats;
  }

}
