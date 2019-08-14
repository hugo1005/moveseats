import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'day'
})
export class DayPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let fmt: string = "";
    let day: string = value+'';

    switch(day) {
      case '1':
        fmt = day + 'st';
        break;
      case '2':
        fmt = day + 'nd';
        break;
      case '3':
        fmt = day + 'rd';
        break;
      default:
        fmt = day + 'th';
    }
    

    return fmt;
  }

}
