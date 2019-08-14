import { Component, Input, forwardRef, OnInit } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ]
})
export class RadioComponent implements ControlValueAccessor {

  @Input()
  opts = [
    {label:'Aisle', value:null},
    {label:'Middle', value:null},
    {label:'Window', value:null}
  ];

  @Input()
  radioName = "radioName";

  innerValue: any = undefined;
  onChange: any = () => {};
  onTouched: any = () => {};

  get value() {
    return this.innerValue;
  }

  set value(val) {
    // console.log("Setting value:" + val + " Previous: " + this.innerValue);
    this.innerValue = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor() { }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value) {
    // console.log("writing value");
    this.value = value;
  }

  RadioInteraction(event: any) {
    let val = event.target.value;
    if(val) {
      this.value = val;
    }
  }
  
  IsChecked(optVal) {
    let condition = (this.innerValue!==null)&&(this.AsString(optVal)===this.AsString(this.innerValue));
    
    return condition;
  }

  AsString(content): string {
    return content + "";
  } 
}
