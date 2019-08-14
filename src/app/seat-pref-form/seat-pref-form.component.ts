import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'


import {
  FormControl, FormGroup, Validators, AbstractControl, ValidationErrors
} from '@angular/forms';

@Component({
  selector: 'app-seat-pref-form',
  templateUrl: './seat-pref-form.component.html',
  styleUrls: ['./seat-pref-form.component.css', '../main.css']
})
export class SeatPrefFormComponent implements OnInit {

  state = {
    seatPositions: [
      {label:'Aisle', value:'aisle'},
      {label:'Middle', value:'middle'},
      {label:'Window', value:'window'}
    ],
    rowPositions: [
      {label:'Front', value:0},
      {label:'Centre', value:20},
      {label:'Rear', value:35} //Min row
    ],
    prefsForm: new FormGroup({
      prefPosition: new FormControl('', Validators.required),
      prefRow: new FormControl('', Validators.required)
    })
  }

  constructor(private userService: UserService) {
    
  }

  ngOnInit() {
    this.userService.ListenForLogin()
    .filter((login) => login.user !== undefined)
    .subscribe((login)=>this.LoggedInUser = login.user);

    this.state.prefsForm.statusChanges.subscribe((valid) => {
      if(valid === "VALID") {

        //TODO: Implement prefs for active seat
        //this.userService.Ref('')
      } 
    });
  }


  set LoggedInUser(user) {
    this.state['loggedInUser'] = user;
  }

  get LoggedInUser() {
    return this.state['loggedInUser']
  }
}
