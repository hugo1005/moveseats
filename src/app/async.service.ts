import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Router, NavigationEnd, NavigationStart } from '@angular/router';

import { DbObject } from './db-object';
import { ViewFilter } from './view-filter';

import { UserService } from './user.service';

@Injectable()
export class AsyncService {

  state = {
    filters: {
      flights:  new ViewFilter([],'flightFilter'),
      swaps: new ViewFilter([],'swapsFilter')
    },
    monitors: {
      activeFlight: new BehaviorSubject<any>(undefined),
      router: this.router.events
    }
  }

  constructor(private userService: UserService, private router: Router) {
    this.onLogin(true).subscribe((login) => {
      if(login.user) {
        console.log("UPDATING SWAPS FILTER");
        this.state.filters.swaps.UpdateProp('excludeUser', login.user);
        this.state.filters.swaps.UpdateProp('swapComplete', null);
      }
    });
  }

  get OnNavigationStart() {
    return this.OnNavigation.filter((evt) => evt instanceof NavigationStart).skip(1);
  }

  get OnNavigationEnd() {
    return this.OnNavigation.filter((evt) => evt instanceof NavigationEnd).skip(1);
  }

  /* Navigation */
  get OnNavigation(): Observable<any> {
    return this.state.monitors.router;
  }

  /* Swaps */

  get Swaps(): Observable<any[]> {
    return Observable.combineLatest(this.onFlightSeats(), this.SeatRefs, this.userService.ListenForSocketLoaded(), (s1, e1, socket)=> this.FilterCompleted(this.NotUserSeats(s1,e1)));
  }

  private NotUserSeats(flight: any[], user: any[]): any[] {
    return flight.filter((f) => user.find((u) => (u.seatId === f.seatId)) === undefined);
  }

  onFlightSeats() : Observable<any[]> {
    return this.Flight.switchMap((flight) => 
      this.userService.Ref(`flights/${flight.date}/${flight.flightId}/seats`)
    )
  }

  /* Active Flight */

  NextFlight(flight: any) {
    try { 
      console.log("Updating active flight: " + JSON.stringify(flight));
      this.userService.Ref(`flights/${flight.date}/${flight.flightId}/seats`)
      
      this.state.filters.flights.UpdateProp('flightId', flight.flightId);
      this.state.filters.flights.UpdateProp('date', flight.date);
      
      // New : Removes completed swaps
      this.state.filters.flights.UpdateProp('swapComplete', null);

      this.state.monitors.activeFlight.next(flight);
    } catch(e) {
      console.log(e);
    }
  }

  get Flight(): Observable<any>  {
    return this.state.monitors.activeFlight.filter((flight) => flight!==undefined);
  }

  /* Requests */
  get Requests(): Observable<any[]> {
    return this.Seats.map((seats) => this.FilterCompleted(seats));
  }

  private FilterCompleted(seats: any[]): any[] {
    return seats.filter((s)=>s.swapComplete===null);
  }

  /* Seats */

  // Not being used ~ Buggy (doesnt seem todo live update right)

  get SeatsOnFlight(): Observable<any[]> {
    return this.GetSeatsFromRefs(this.SeatRefsOnFlight());
  }

  private SeatRefsOnFlight(): Observable<any[]> {
    return Observable.combineLatest(this.SeatRefs, this.Flight, (refs, flight) => {
      return refs.filter((ref) => (ref.flightId === flight.flightId) && (ref.date === flight.date));
    });
  }

  // END unused

  /* Seats from SeatRefs (Base) */ 

  get Seats(): Observable<any[]> {
    return this.GetSeatsInlcudingSwaps(this.GetSeatsFromRefs(this.SeatRefs));
  }

  private GetSeatsInlcudingSwaps(seats: Observable<any[]>): Observable<any[]> {
    return seats.switchMap((s1) => Observable.from(s1))
    .switchMap((seat: any) => {
      return seat.swapComplete? this.GetSeatFromRef(seat.swapComplete): Observable.of(seat);
    })
    .buffer(seats.auditTime(10));
  }

  private GetSeatsFromRefs(seatRefs: Observable<any[]>): Observable<any[]> {
    return seatRefs.switchMap((refs) => Observable.from(refs))
    .switchMap((ref) => this.GetSeatFromRef(ref))
    .buffer(this.SeatRefs.auditTime(10));
  }

  GetSeatFromRef(ref: any): Observable<any> {
    return this.userService
      .Ref(`flights/${ref.date}/${ref.flightId}/seats`)
      .map((s1) => s1.find((s)=> s.seatId === ref.seatId) || {})
      // .first(); // This may be the issue [ Fig.1 ]
  }

  /* BASE FUNCTIONS */

  get SeatRefs():Observable<any[]> {
    return Observable.combineLatest(this.onLogin(true), this.userService.ListenForSocketLoaded(),
      (login, socket) => login
    ).switchMap((login) => this.UserSeats(login.user));
  }

  private UserSeats(user: string):Observable<any[]> {
    return this.userService.Ref(`users/${user}/seats`);
  }

  onLogin(onlyUser: boolean):Observable<any> {
    let login: Observable<any> = this.userService.ListenForLogin();
    let onUserLogin: Observable<any> = login.filter((login) => login.user !== undefined);

    return onlyUser? onUserLogin: login;
  }
}
