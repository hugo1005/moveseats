import { Component, OnInit, Input } from '@angular/core';
import { ActionsService } from '../actions.service';

@Component({
  selector: 'app-seat-select',
  templateUrl: './seat-select.component.html',
  styleUrls: ['./seat-select.component.css', '../main.css']
})
export class SeatSelectComponent implements OnInit {

  @Input()
  seat = {
    'seatId': 'SEAT~VERSION~FLIGHT~DATE',
    'position': 'NONE',
    'swapPrefs': {
      'rows': 'ROWS',
      'position': 'POSITION',
      'basketId': undefined
    },
    'requests': {
      'out': [], //'12C' '14K' etc
      'in': []
    },
    'swapComplete': undefined //Seat Id
  }

  @Input()
  lightTheme: boolean = true;

  @Input() 
  displayType = "";

  displayMeta: boolean = true;

  state = {
    displayOptions: false
  }

  GetStyles(elem: string) {
    let styles = {};
    
    switch(elem) {
      case 'DROPDOWN':
        styles = {
          'seat-opts-visible': this.state.displayOptions,
          'seat-opts-invisible': !this.state.displayOptions,
          'dark': !this.lightTheme,
          'light': this.lightTheme
        };
        break;
    }

    return styles;
  }

  ToggleOptions() {
    this.state.displayOptions = !this.state.displayOptions;
  } 

  ToggleOptionsWithin() {
    if(this.displayType !== 'MULTI') {
      this.state.displayOptions = !this.state.displayOptions;
    }
  } 
  
  get FlightId(): string {
    let idArr: string[] = this.seat.seatId? this.seat.seatId.split('~'): ['FLIGHTID'];
    return idArr[idArr.length-2];
  }

  get FlightDate(): string {
    let idArr: string[] = this.seat.seatId? this.seat.seatId.split('~'): ['FLIGHTID'];
    return idArr[idArr.length-1];
  }

  constructor(private actionsService: ActionsService) { }

  ngOnInit() {
    this.displayMeta = this.displayType !== "REQUESTS";
    //console.log("SEAT STATE: " + JSON.stringify(this.seat));
  }

  SeatIdPure(seat): string {
    return seat.seatId.split('~')[0];
  }

  NumberRequests(seat: any): number {
    return this.actionsService.CountRequestsIn(seat);
  }

}
