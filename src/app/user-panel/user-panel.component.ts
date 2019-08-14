import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { AsyncService } from '../async.service';
import { AuthService } from '../auth.service';

import { ViewFilter } from '../view-filter';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css', '../main.css']
})
export class UserPanelComponent implements OnInit {

  state = {
    showDropdown: false,
    loggedInUser: undefined,
    profile: undefined,
    debug: {
      enableDebug: true,
    },
    noFilter: new ViewFilter([], 'noFilter'),
    active: {
      requests: undefined,
      seats: undefined
    }
  }

  constructor(private userService: UserService, private asyncService: AsyncService, private authService: AuthService) {
    
    this.UserSeats = this.asyncService.Seats;
    this.Requests = this.asyncService.Requests;

    this.userService.ListenForLogin().subscribe((login) => {
        this.LoggedInUser=login.user;
    }); 

    this.userService.ListenForLogout().subscribe((logout) => {
      logout?this.VerifyAuth():()=>{};
    });

    this.asyncService.OnNavigationStart.subscribe((evt) => {
      console.log("Navigation start:");
      if(this.state.showDropdown) this.ToggleDropdown();
    });
  }

  ToggleDropdown() {
    this.state.showDropdown=!this.state.showDropdown;
  }

  get Requests() {
    return this.state.active.requests;
  }

  set Requests(val) {
    this.state.active.requests = val;
  }

  set LoggedInUser(user) {
    this.state.loggedInUser = user;
  }

  get LoggedInUser() {
    return this.state.loggedInUser;
  }

  set UserSeats(seats) {
    this.state.active.seats = seats;
  }

  get UserSeats() {
    return this.state.active.seats;
  }

  ngOnInit() {
    this.VerifyAuth();
  }


  VerifyAuth() {
    let exec = new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 1000);
    });

    exec.then(() => {
      let isAuthenticated = this.authService.isAuthenticated();

      console.log("Is auth: " + isAuthenticated);

      isAuthenticated ? this.UpdateUserProfile():this.CloseUserProfile();
    });
  }

  UpdateUserProfile() {
    if (this.authService.userProfile) {
      this.state.profile = this.authService.userProfile.sub;
      console.log(`User profile: ${JSON.stringify(this.state.profile)}`);
      this.userService.Login(this.state.profile.sub, this.state.profile.nickname);
    } else {
      this.authService.getProfile((err, profile) => {  
        this.state.profile = profile;
        console.log(`User profile: ${JSON.stringify(this.state.profile)}`);
        this.userService.Login(profile.sub, this.state.profile.nickname);
      });
    }
  }

  CloseUserProfile() {
    this.userService.Login(undefined);
    this.state.profile = undefined;
  }

  GetStyles(elem: string) {
    let styles = {};

    switch(elem) {
      case 'HEADER-ROW':
        styles = {
          'header-row': true,
          'header-focus': this.state.showDropdown,
          'header-unfocus': false
        };
        break;
    }

    return styles;
  }

  // Login() {
  //   this.authService.login();
  // }

  // Logout() {
  //   this.authService.logout();
  // }
}
