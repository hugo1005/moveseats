import { Directive } from '@angular/core';
import { AsyncService } from './async.service';

@Directive({
  selector: 'app-dropout-item-toggle',
  exportAs: 'itemToggle'
})
export class DropoutItemToggleDirective {

  _lastOpened = "";
  // testCont="Tester";

  get lastOpened() {
    return this._lastOpened;
  }

  set lastOpened(evt: any) {
    console.log("writing: " + evt.title);
    if(evt.open) this._lastOpened = evt.title;
    else this._lastOpened="";
  }

  constructor(private asyncService: AsyncService) {
    this.asyncService.OnNavigationStart.subscribe((evt) => {
      console.log("Navigation start:");
      this.lastOpened = {open: true, title: "Navigated!"};
    });
    this.asyncService.OnNavigationEnd.delay(100).subscribe((evt) => {
      this.lastOpened = {open: true, title: ""};
      console.log("Navigation end:");
    });
  }

  // CloseTabs(evt) {
  //   console.log("Tab interact 1");
  //   if(evt.open) this.lastOpened = evt.title;
  // }
}
