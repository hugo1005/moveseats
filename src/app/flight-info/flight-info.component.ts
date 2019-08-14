import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AsyncService } from '../async.service';
import { ActionsService } from '../actions.service';

@Component({
  selector: 'app-flight-info',
  templateUrl: './flight-info.component.html',
  styleUrls: ['./flight-info.component.css', '../main.css']
})
export class FlightInfoComponent implements OnInit {

  flight = { airline: "Airline", id: "Select Flight"};
  seat = { id: "A12", msg: "My seat"};
  seats = { count: 0, msg: "New Flight!"};

  constructor(
    private asyncService: AsyncService,
    private actionsService: ActionsService,
    private http: HttpClient
  ) { 

    // Getting selected seat from service
    this.actionsService.selectedSeatMonitor.subscribe((seat) => {
      this.InitSeat(seat);
    });

    // Getting active flight from service
    this.asyncService.Flight.subscribe((flight) => {
      this.InitFlight(flight);
    });

    // Getting active swaps from service
    this.asyncService.Swaps.subscribe((seats) => {
      this.InitSwaps(seats);
    });
  }

  InitSeat(seat) {
    let id = seat? seat.seatId.split('~')[0] : "Any";
    this.seat = seat? {id, msg: 'My Seat'}: {id , msg: 'Select seat'}; 
  }

  InitFlight(flight) {
      this.flight.id = flight.flightId;
      this.InitAirline(this.flight); 
  }

  InitSwaps(seats) {
    // Getting the avialable swaps for active flight 
    this.seats.count = seats? seats.length : 0;
    this.seats.msg = this.seats.count > 0 ? "Available": "New flight!";
  }
  
  InitAirline(flight) {
    // Getting the airline name from backend
    let url = `api/validate/${flight.id}`;
    
    this.http.get<FlightResponse>(url)
    .subscribe(res => this.flight.airline = res.airline);
  }

  ngOnInit() {
  }

}

interface FlightResponse {
    status: number;
    detail: string;
    airline: string;
}