import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seat'
})
export class SeatPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    let formatted = "";
    
    let split = value? value.split('~'): [''];

    return split.length? split[0]: "";
  }

}
