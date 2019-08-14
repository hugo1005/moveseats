import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css', '../main.css']
})
export class InputComponent implements OnInit {

  @Input('group')
  formGroup: FormGroup;

  // Required
  @Input()
  controlName: string;
  @Input('ctrl')
  ctrl: FormControl | FormGroup;
  @Input()
  uid: string;

  // Optional
  @Input('lbl')
  label: string;
  @Input('place')
  placeholder: string = "";
  @Input()
  opts: any[];
  @Input()
  errors: {type: string, msg: string}[];
  
  constructor() { }

  ngOnInit() {
  }

}
