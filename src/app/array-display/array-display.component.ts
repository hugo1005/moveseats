import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SeatSelectComponent } from '../seat-select/seat-select.component';

import { UserService } from '../user.service';
import { ActionsService } from '../actions.service'; 
import { AsyncService } from '../async.service';

import { DbObject } from '../db-object';
import { ViewFilter } from '../view-filter';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-array-display',
  templateUrl: './array-display.component.html',
  styleUrls: ['./array-display.component.css', '../main.css']
})
export class ArrayDisplayComponent implements OnInit {
  
  @Input()
  seatRefs: DbObject<any[]>; 

  @Input()
  seats: DbObject<any[]>;

  @Input()
  filter: ViewFilter;

  @Input()
  freeWidth: boolean = true;

  @Input()
  lightTheme: boolean = true;

  @Input() 
  displayType: string = "WALLET";

  @Input() 
  parent: SeatSelectComponent;

  @Output()
  onUpdate = new EventEmitter<number>();

  displayOptions: string[] = [];

  state = { 
    displayTypes: {
      'REQUESTS': [
        {'title': 'Confirm', action: this.actionsService.Confirm}, 
        //{'title': 'Reject', action: this.actionsService.Reject}
      ],
      'WALLET': [{'title': 'Open Available Swaps', action: this.actionsService.Open}],
      'FLIGHT': [
        {'title': 'Select', action:  this.actionsService.Select}, 
        // {'title': 'Remove', action:  this.actionsService.Remove}
      ],
      'SWAPS': [
        {'title': 'Make Swap', action:  this.actionsService.Swap}] 
        //{'title': 'Good Match', action:  this.actionsService.Rate}]
    },
    querySeats: undefined,
    selectedSeat: undefined
  };

  constructor(
      private userService: UserService,
      private actionsService: ActionsService,
      private asyncService: AsyncService
    ) {

      this.actionsService.selectedSeatMonitor.subscribe((val)=>this.state.selectedSeat=val);
  }

  ngOnInit() {
    // console.log("[ARD] Initialising array display w. filter: " + this.filter.name);
    // console.log("Using refs: " + this.seatRefs + " seats: " + this.seats);

    //this.filter.subscribe((filter) => console.log(this.filter.name + " updated: " + JSON.stringify(filter)));

    // Sets seat-select menu opts
    this.displayOptions = this.SeatOptions;

    this.RefreshDisplay();
  }

  Action(act:any, swapSeat:any, mySeat?: any) {
   mySeat? act.apply(this.actionsService, [swapSeat,mySeat]):act.apply(this.actionsService, [swapSeat,this.state.selectedSeat]);
  }

  get SeatOptions() {
    let opts = this.state.displayTypes[this.displayType] || [];
    return opts.slice();
  }

   /* 
      let s1 be seats, let s be a single seat
      let sr1 be seat refs, let r be a single ref
      let f be a filter
      let e1 be exclusions
      let e be an exlcusion 
  */

  RefreshDisplay() {
    let stream = this.seatRefs || this.seats;
    let listenForUpdates = Observable.combineLatest(stream, this.filter);

    listenForUpdates.subscribe((val) => this.onUpdate.emit(1));

    if(this.seatRefs) {
      console.log("[ARD] using seat refs");
      this.state['querySeats'] =
      listenForUpdates.switchMap((val) => {
        return stream
        .withLatestFrom(this.filter, (sr1,f) => ViewFilter.Filter(sr1, f))
        .switchMap((sr1) => Observable.from(sr1))
        .switchMap((r) => 
            this.GetSeatFromRef(r)
            .switchMap((s) => {
              let swapped = s.swapComplete;
              return swapped ? this.GetSeatFromRef(swapped) : Observable.of(s);
            })  
        )
        .buffer(stream.auditTime(10))
        .withLatestFrom(this.filter, (s1,f) => ViewFilter.Filter(s1, f)); // Filter again w. seat props
      });
    } else if(this.seats) {
      console.log("[ARD] using seats");


      //Fix passing in of seats for this
      this.state['querySeats'] =
      listenForUpdates.switchMap((val) => {
        return stream
        .withLatestFrom(this.filter, (s1,f) => ViewFilter.Filter(s1, f))
      });

    }
  }

  GetSeatFromRef(r: any) {
    return this.userService
      .Ref(`flights/${r.date}/${r.flightId}/seats`)
      .map((s1) => s1.find((s)=> s.seatId === r.seatId) || {})
      .first();
  }

  //To deprecate
  RequestsInObservable(seat: any) {
    //creates stream of reqs in from seat
    let idArr: string[] = seat.seatId.split('~');
    let flightUrl = `flights/${idArr[3]}/${idArr[2]}/seats`;

    return this.userService.Ref(flightUrl)
    .map((seats) => seats.find((s) => s.seatId === seat.seatId))
    .map((s) => s.requests.in);
  }

  GetStyles(elem: string): Object {
    let styles = {};

    switch(elem) {
      case "DISPLAY":
        styles = {
          'inner-adapt': this.freeWidth,
          'inner': !this.freeWidth
        }
    }

    return styles;
  }

  GetRequestsFromRefs(refs: any[]): Observable<any[]> {
    return Observable.from(refs)
    .switchMap((ref) => this.asyncService.GetSeatFromRef(ref))
    .bufferCount(refs.length, refs.length)
    .map((seats) => seats.filter((seat) => seat.swapComplete === null));
  }

}
