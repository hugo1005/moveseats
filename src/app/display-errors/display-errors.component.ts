import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-display-errors',
  templateUrl: './display-errors.component.html',
  styleUrls: ['./display-errors.component.css', '../main.css']
})
export class DisplayErrorsComponent implements OnInit {

  @Input('ctrl')
  formControl: FormControl | FormGroup;

  @Input()
  errors: {type: string, msg: string}[];

  constructor() { }

  ngOnInit() {
  }

}
