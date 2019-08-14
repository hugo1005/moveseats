import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';

import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-latest-flights',
  templateUrl: './latest-flights.component.html',
  styleUrls: ['./latest-flights.component.css', '../main.css']
})
export class LatestFlightsComponent implements OnInit {

  @Input()
  show: number = 10;

  flightDisplay: Array<any> = [{flightId: "None Active", seats: 0}];
  flights: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.ListenForSocketLoaded().subscribe((loaded) => {
      if(loaded) {
        this.flights = this.userService.Ref('flights')
        .map(flightObj => {
          let dates = this.Keys(flightObj, true);
          let flightMetas: FlightMeta[] = [];

          dates = dates.sort((a: string ,b: string)=>{ return (+b) - (+a)} );

          for(let date of dates) {
            let flights = this.Keys(flightObj[date], true);

            for(let flight of flights) {
              if(flightMetas.length >= this.show) return flightMetas;

              flightMetas.push(this.FlightMeta(flightObj[date][flight]));
            }
          }
        })
        .subscribe(values => this.flightDisplay = values);
       
      }
    });
  }

  Keys(jsonObj, exludeNull: boolean): Array<string> {
    let keys = [];
    for(let key in jsonObj) {
      let invalid = !jsonObj[key] && exludeNull;
      if(!invalid) keys.push(key);
    };
    return keys;
  }

  FlightMeta(flightData): FlightMeta {
    return { flightId: flightData.flightId, seats: flightData.seats.length };
  }
}

interface FlightMeta {
  flightId: string,
  seats: number;
}