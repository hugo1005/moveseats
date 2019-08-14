import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dropout',
  templateUrl: './dropout.component.html',
  styleUrls: ['./dropout.component.css', '../main.css']
})
export class DropoutComponent implements OnInit{

  @Input('show')
  isVisible: boolean = false;

  @Input('corner')
  isCorner: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  GetStyles(elem: string) {
    let styles = {};

    switch(elem) {
      case 'DROPDOWN-CONTAINER':
        styles = {
          'dropdown': true,
          'dropdown-corner': this.isCorner,
          'dropdown-center': !this.isCorner,
          'opts-invisible': !this.isVisible,
          'opts-visible': this.isVisible,
        };
        break;
      case 'DROPDOWN-CONTAINER':
        styles = {
          'opts-invisible-ul': !this.isVisible,
        };
        break;
    }

    return styles;
  }
}
