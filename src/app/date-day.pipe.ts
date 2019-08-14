import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDay'
})
export class DateDayPipe implements PipeTransform {

  // Todo fix 31, 1, 2

  days = 
  [
    "Sun", 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'
  ];

  transform(value: any, args?: any): any {
    let fmt: string = "";
    let date: number = +value;

    let dateObj = new Date(Date.now());
    dateObj.setUTCDate(date);

    fmt = date + ' ~ ' + this.days[dateObj.getUTCDay()]

    return fmt;
  }

}
