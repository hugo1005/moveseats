import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-profile-toggle',
  templateUrl: './profile-toggle.component.html',
  styleUrls: ['./profile-toggle.component.css', '../main.css']
})
export class ProfileToggleComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) {}

  toggles = {
    other: {
      msg: "Open Full Profile",
      route: ['/profile']
    },
    profile: {
      msg: "Return to dashboard",
      route: ['/dashboard']
    }
  }

  active = {
      route: ['/profile'],
      msg: "Open Full Profile"
  }

  loggedInUser = undefined;

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.UpdateState();
      }
    });

    this.userService.ListenForLogin().subscribe((login) => this.loggedInUser=login.user);
  }

  OnToggle() {
    this.router.navigate(this.active.route);
  }

  UpdateState() {
    this.active = this.router.url === '/profile'? this.toggles.profile : this.toggles.other;
  }

}
