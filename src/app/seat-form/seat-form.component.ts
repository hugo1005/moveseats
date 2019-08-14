import { Component, OnInit, OnChanges, Input, EventEmitter, Output } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  FormControl, FormGroup, Validators, AbstractControl, ValidationErrors
} from '@angular/forms';

import { UserService } from '../user.service';
import { AsyncService } from '../async.service';
import { ActionsService } from '../actions.service';
import { SubscriptionService } from '../subscription.service';
import { DateDayPipe } from '../date-day.pipe';
import { ViewFilter } from '../view-filter';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-seat-form',
  templateUrl: './seat-form.component.html',
  styleUrls: ['./seat-form.component.css', '../main.css'],
  providers: [ DateDayPipe ]
})
export class SeatFormComponent implements OnInit {

  months = 
  [
    "January", 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  buttonStyle = {
    'btn-alt': true,
    'inactive': false
  }
  
  state = { 
    monthYear: this.months[new Date(Date.now()).getUTCMonth()] + " " + new Date(Date.now()).getUTCFullYear(),
    seatPositions: [
      {label:'Aisle', value:'aisle'},
      {label:'Middle', value:'middle'},
      {label:'Window', value:'window'}
    ],
    seatForm: new FormGroup(
      {
        flightId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]{2}\s{0,2}\d{1,4}$/)], this.ValidFlightId.bind(this)),
        days: new FormControl('', Validators.required),
        seatId: new FormControl('', [Validators.required, Validators.pattern(/^\d{1,2}[a-zA-z]$/)]),
        position: new FormControl('', Validators.required)
      }, this.SeatExists.bind(this), this.ExceededLimit.bind(this)
    ),
    filters: {
      flights:  new ViewFilter([],'flightFilter'),
      swaps: new ViewFilter([],'swapsFilter'),
    },
    loggedInUser: undefined,
    dayOfFlight: undefined,
    activeAirline: undefined,
    activeSeats: [],
    userSeats: this.asyncService.SeatRefs,
    selectedSeat: undefined
  };

  @Output()
  flightChanges: EventEmitter<any> = new EventEmitter<any>();

  /*
  TODO: Add custom validation for flight & seat
  TODO: Add error msgs and styling
  */

  constructor(
    private userService: UserService, 
    private dateDayPipe: DateDayPipe,
    private http: HttpClient, 
    private asyncService: AsyncService,
    private subscription: SubscriptionService,
    private actionsService: ActionsService
  ) {
    this.userService.ListenForLogin().subscribe((login) => 
      this.state.loggedInUser=login.user);

    let date = (d?) => {
      let date = new Date(Date.now());
      if(d) date.setDate(d);

      return date.getUTCDate();
    }; // UTC
    let today: number = date();
    let tmw: number = date(today+1);
    let next: number = date(today+2);

    this.state.dayOfFlight = [ 
      {label:this.TransformDay(today), value: today},
      {label:this.TransformDay(tmw), value: tmw},
      {label:this.TransformDay(next), value: next}
      //TODO Database cleanup of out of date flights
    ];

    this.state.filters = this.asyncService.state.filters;
  }

  ngOnInit() {
    this.state.seatForm.statusChanges.subscribe(()=>{

      let cl = this.Clean;

      console.log("Errors: " + JSON.stringify(this.state.seatForm.errors));

      this.flightId.valid && this.daysLeft.valid ? this.flightChanges.emit({
        'flightId': cl(this.flightId.value),
        'date': this.daysLeft.value
      }): ()=>{};

      this.GetFlight(this.flightId.value).subscribe(data => {
        this.state.activeAirline = data? data.airline || undefined: undefined;
        
        if(this.state.activeAirline) {
          try {
            this.userService.Ref(`flights/${this.daysLeft.value}/${cl(this.flightId.value)}/seats`).subscribe((value) => {
              this.state.activeSeats = value || [];
            })
          } catch(e) {
            console.log("Error occurred");
            this.state.activeSeats = [];
          }
        } 
      });

      this.buttonStyle = this.ButtonStyle();
    });

    this.actionsService.selectedSeatMonitor.subscribe((seat) => this.state.selectedSeat = seat);
  } 

  TransformDay(day: any) {
    return this.dateDayPipe.transform(day);
  }

  get flightId(): any {
    return this.state.seatForm.get('flightId');
  }

  get daysLeft(): any {
    return this.state.seatForm.get('days');
  }

  get seatId(): any {
    return this.state.seatForm.get('seatId');
  }

  get position(): any {
    return this.state.seatForm.get('position');
  }

  CanShow(): boolean {
    return this.flightId.valid && this.daysLeft.valid;
  }

  /* Validators */

  ValidFlightId(ctrl: AbstractControl): Observable<ValidationErrors|null> {
    return this.GetFlight(ctrl.value).map(res => res.status === 200? null: { noFlight: { expected: 'Please enter a valid flight code'}});
  } 

  GetFlight(flightId): Observable<FlightResponse> {
    let url = `api/validate/${this.Clean(flightId)}`;
    
    console.log("Sending req: " + url);

    return this.http.get<FlightResponse>(url); 
  }

  SeatExists(ctrl: FormGroup) {
    let formValues = ctrl.controls;
    let cl = this.Clean;

    let url = `flights/${formValues['days'].value}/${cl(formValues['flightId'].value)}/seats`;

    let seatId = `${cl(formValues['seatId'].value)}~1~${cl(formValues['flightId'].value)}~${formValues['days'].value}`;

    console.log("Url: " + url);
    console.log("Seat id: " + seatId);
    // return Observable.from([{testError: {expected: "test"}}]);

    try {
      let seats = this.userService.dbValueFromRoute(url.split('/'));
      console.log("Match seats: " + JSON.stringify(seats));

      let match = seats.findIndex(seat => seat.seatId === seatId) > -1;

      console.log("Match found: " + match);

      return match ? { seatExists: { expected: 'This seat already exists'}} : null;
    } catch (e) {
      console.log("Error:" + e);
      return null;
    }
  } 

  ExceededLimit(ctrl: FormGroup): Observable<ValidationErrors|null> {
    return new Observable((observer) => {

      if(!this.state || !this.state.loggedInUser) {
        observer.next(null);
        observer.complete();

        return;
      }

      // console.log("State: " + JSON.stringify(this.state));

      // Subscription
      let limit: number = this.subscription.SeatLimit;

      let url = `users/${this.state.loggedInUser}`;
      let formValues = ctrl.controls;

      // Number of seats
      let user = this.userService.dbValueFromRoute(url.split('/'));
      
      let seats = user.seats.filter((seat) => seat.flightId === this.Clean(formValues.flightId.value)).filter((seat) => seat.date === formValues.days.value);

      let returnValue = seats.length >= limit? { limitReached: { limit: `Your plan only permits ${this.subscription.SeatLimit} seats per flight`}}: null;

      console.log("Return validator: " + JSON.stringify(returnValue));

      observer.next(returnValue);
      observer.complete();
    });
  }
    
  // New line
  /* Submit */

  Clean(val: any) {
    return typeof(val) === "string"? val.replace(/\s*/g,'').toUpperCase(): val;
  }

  AddSeat() {
    if(this.state.seatForm.invalid || this.state.loggedInUser === undefined) {
      console.log("Make sure forms is valid!");
      return;
    }

    let cl = this.Clean;

    let formVal = this.state.seatForm.value;

    let seat = {
        'seatId': `${cl(formVal.seatId)}~1~${cl(formVal.flightId)}~${formVal.days}`,
        'position': formVal.position,
        'swapPrefs': {
          'rows': null,
          'position': null,
          'basketId': null
        },
        'requests': {
          'out': [],
          'in': []
        },
        'swapComplete': null //Seat Id
    };

    let seatRef = {
      'date':formVal.days,
      'flightId':cl(formVal.flightId),
      'seatId':cl(seat.seatId)
    };

    // To Flight
    let postToFlight: string = `flights/${formVal.days}/${cl(formVal.flightId)}/seats`;

    let fS = this.userService.New('SEAT', seat, postToFlight);

    // To User
    let postToUser: string = `users/${this.state.loggedInUser}/seats`;

    let uS = this.userService.New('SEAT-REF', seatRef, postToUser);

    this.flightChanges.emit({
        'flightId': cl(this.flightId.value),
        'date': this.daysLeft.value
    });  

    this.state.seatForm.controls.seatId.reset();
    this.state.seatForm.controls.position.reset();

    // New
    this.actionsService.Select(seat);
  }

  ButtonStyle() {
    return {
      'btn-alt': true,
      'inactive': this.state.seatForm.invalid
    }
  }

}

interface FlightResponse {
    status: number;
    detail: string;
    airline: string;
}