import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';

import { UserService } from '../user.service';
import { AsyncService } from '../async.service';
import { ActionsService } from '../actions.service';

import { Observable, BehaviorSubject } from 'rxjs';
import { DbObject } from '../db-object';
import { ViewFilter } from '../view-filter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../main.css']
})
export class HomeComponent implements OnInit {

  state = {
    user: {
      loggedIn: undefined,
      seats: undefined,
      flightSeats: undefined,
      selectedSeat: undefined
    },
    filters: {
      flights:  new ViewFilter([],'flightFilter'),
      swaps: new ViewFilter([],'swapsFilter')
    },
    active: {
      flight: undefined,
      swaps: undefined,
      requests: undefined
    },
    monitors: {
      activeFlight: new BehaviorSubject<any>(undefined)
    },
    stats: {
      swaps: undefined, 
      flights: undefined
    }
  };

  constructor(private userService: UserService, private asyncService: AsyncService, private actionsService: ActionsService) {

    // Stats 
    this.userService.ListenForSocketLoaded().subscribe((loaded) => {
      if(loaded) {
        this.userService.Ref("stats/swaps").subscribe((swaps) => {
          this.state.stats.swaps = swaps;
         
        });
        this.userService.Ref("stats/flights").subscribe((flights) => {
          this.state.stats.flights = flights;
         
        });
      }
    });
    
    this.state.filters = this.asyncService.state.filters;

    // Ensures user seats is always defined as a stream
    this.UserSeats = asyncService.SeatRefs;
    this.UserFlightSeats = asyncService.SeatsOnFlight;
    // this.asyncService.SeatsOnFlight.subscribe((val) => console.log("UserFlightSeats: " + JSON.stringify(val)));

    this.actionsService.selectedSeatMonitor.subscribe((val)=>this.state.user.selectedSeat=val);

    // Ensures user seats is always defined as a stream
    this.ActiveSwaps = this.asyncService.Swaps;
    this.Requests = this.asyncService.Requests;

    // Initialises filter / login details
    this.userService.ListenForLogin().subscribe((login) => this.LoggedInUser=login.user);
  }

  get Requests() {
    return this.state.active.requests;
  }

  set Requests(val) {
    this.state.active.requests = val;
  }

  // Displays seats available for swapping
  set ActiveSwaps(val) {
    this.state.active.swaps = val;
  }

  get ActiveSwaps() {
    return this.state.active.swaps;
  }

  // sets users current selected flight
  set ActiveFlight(flight: any) {
    this.asyncService.NextFlight(flight);
  };

  get ActiveFlight() {
    return this.asyncService.Flight;
  }

  // Displays the current users seats for active flight
  set UserSeats(seats) {
    this.state.user.seats = seats;
  }

  get UserFlightSeats(): Observable<any[]> {
    return this.state.user.flightSeats;
  }

  set UserFlightSeats(val: Observable<any[]>) {
    this.state.user.flightSeats = val;
  }

  get UserSeats() {
    return this.state.user.seats;
  }

  set LoggedInUser(user) {
    this.state.user.loggedIn = user;
  }

  get LoggedInUser() {
    return this.state.user.loggedIn;
  }

  ngOnInit() {

  }
}