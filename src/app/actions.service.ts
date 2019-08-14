import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AsyncService } from './async.service';

import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { DbObject } from './db-object';

@Injectable()
export class ActionsService {

  private keepUpdated: Subscription = undefined;


  selectedSeatMonitor:  BehaviorSubject<any> = new  BehaviorSubject<any>(undefined);
  swapSeatMonitor:  BehaviorSubject<any> = new  BehaviorSubject<any>(undefined);
  confirmedSeatMonitor:  BehaviorSubject<any> = new  BehaviorSubject<any>(undefined);
  warningMonitor: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);


  private loggedInUser: string = undefined;

  constructor(private userService: UserService, private asyncService: AsyncService, private router: Router) { 
    this.userService.ListenForLogin().subscribe((login) => this.loggedInUser = login.user);

    // Makes sure active seat is unset when flight changes
    this.asyncService.Flight.subscribe((flight) => this.Select(undefined)); 
  }

  /* Swaps */
  // Would be nice to have some green 
  // formatting around requests made on <seta-select>

  Swap(swapSeat:any , mySeat: any) {
    let mySeatRef = this.SeatToRef(mySeat);
    let swapSeatRef = this.SeatToRef(swapSeat);

    //Assuming latest data applies
    if(!this.ContainsRequest(swapSeat, mySeatRef) && !mySeat.swapComplete) {
      console.log("Swapping seats: ");
      console.log("mySeat: " + JSON.stringify(mySeat));
      console.log("swapSeat: " + JSON.stringify(swapSeat));

      swapSeat.requests.in.push(mySeatRef);
      mySeat.requests.out.push(swapSeatRef);
     
      this.UpdateSeat(mySeat);
      this.UpdateSeat(swapSeat);

      this.swapSeatMonitor.next({'mySeat': mySeat, 'swapSeat': swapSeat});
    }
  } 

  private ContainsRequest(seat, ref): boolean {
    return seat.requests.in.find((r) => r.seatId === ref.seatId)? true: false;
  }

  Rate(swapSeat:any , mySeat: any): string {
    return 'Ok match';
  }


  /* Requests */

  Confirm(swapSeat:any , mySeat: any) {
    let swapSeatRef = this.SeatToRef(swapSeat);
    let mySeatRef = this.SeatToRef(mySeat);

    swapSeat.swapComplete = mySeatRef;
    mySeat.swapComplete = swapSeatRef;

    console.log("Swapping seats: My Seat: " +  JSON.stringify(mySeatRef) + "Their seat: " + JSON.stringify(swapSeatRef));

    this.UpdateSeat(swapSeat);
    this.UpdateSeat(mySeat);
    this.userService.Ref("stats/swaps").IncrementStat();

    this.confirmedSeatMonitor.next({'mySeat':mySeat, 'swapSeat':swapSeat});
  }

  Reject(swapSeat:any , mySeat: any) {

  }

  CountRequestsIn(seat: Seat): number {
    return seat.requests.in.length || 0;
    // return seat.requests.in.reduce((acc, ref) => {
    //   let seat = this.userService.dbValueFromRoute(`flights/${ref.date}/${ref.flightId}/seats`.split('/'))
    //   .map((seats) => seats? seats.find((seat) => seat.seatId === ref.seatId): {swapComplete: null});

    //   return seat.swapComplete? acc: acc + 1;
    // }, 0);
  }

  /* Wallet */
  Open(mySeat: any) {
    
    let date: string = mySeat.seatId.split('~')[3]; 
    let flightId: string = mySeat.seatId.split('~')[2]; 
    
    if(mySeat.swapComplete === null) {
      this.asyncService.NextFlight({
        'flightId': flightId,
        'date': date
      });
        
      this.Select(mySeat);
      this.router.navigate(['/dashboard']);
    } else {
      this.warningMonitor.next({msg: "You can only swap once"});
    }
    
  }

  /* Flights */

  Select(seat: any) {
    console.log("Selected seat: " + JSON.stringify(seat));
    let ref = this.SeatToRef(seat);
    this.selectedSeatMonitor.next(seat);
    this.MonitorSeatChanges(ref);
  }

  Remove(seat: any) {
    if(!seat.swapComplete) {
      let idArr: string[] = seat.seatId.split('~');
      let refUrl = `users/${this.loggedInUser}/seats`;
      let flightUrl = `flights/${idArr[3]}/${idArr[2]}/seats`;
      
      this.userService.Ref(flightUrl).Remove({key:'seatId', value: seat.seatId});
      this.userService.Ref(refUrl).Remove({key:'seatId', value: seat.seatId});
    }
  }

  // Ensures that any update made to selected seat is kept 
  // Deselects a seat if swapCompleted
  private MonitorSeatChanges(ref: SeatRef) {
    if(this.keepUpdated) this.keepUpdated.unsubscribe();
    
    console.log("Montoring ref: " + JSON.stringify(ref));

    this.keepUpdated = this.userService.Ref(`flights/${ref.date}/${ref.flightId}/seats`)
    .map(seats => seats.find((seat) => seat.seatId === ref.seatId))
    .subscribe((seat) => {
      console.log("Monitor swap complete ? : " + seat.swapComplete);
      seat.swapComplete? this.selectedSeatMonitor.next(undefined): this.selectedSeatMonitor.next(seat);
    });
  }

  private SeatToRef(seat) {
    let idArr: string[] = seat.seatId.split('~');

    return {
      date: idArr[3],
      flightId: idArr[2],
      seatId: seat.seatId
    }
  }

  private UpdateSeat(seat: any) {
    let idArr: string[] = seat.seatId.split('~');
    let flightUrl = `flights/${idArr[3]}/${idArr[2]}/seats`;

    console.log("Updating seat: " + seat.seatId + " with : " + JSON.stringify(seat));

    this.userService.Ref(flightUrl).Replace({key:'seatId', value: seat.seatId}, seat);
  }
} 

interface SeatRef {
  date: string,
  flightId: string,
  seatId: string
}

interface Seat {
  'seatId': string,
  'position': string,
  'swapPrefs': {
    'rows': string,
    'position': string,
    'basketId': string
  },
  'requests': {
    'out': any[], 
    'in': any[]
  },
  'swapComplete': string
}

