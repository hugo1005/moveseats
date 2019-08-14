import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropout-item',
  templateUrl: './dropout-item.component.html',
  styleUrls: ['./dropout-item.component.css', '../main.css']
})
export class DropoutItemComponent implements OnInit {

  @Input()
  title: string = "Dropout item";

  @Input('show')
  isVisible: boolean = false;

  @Input()
  activeItem: string = "";

  @Input() 
  openInner = false;

  @Input()
  fullOpacity = false;

  @Output()
  activeItemChange: EventEmitter<Object> = new EventEmitter();

  state = {
    innerVisble: false,
    fullOpacity: false
  };

  constructor() { }

  ngOnInit() {
    //this.activeItemChange.subscribe(()=>{console.log("Toggle occ")});
    this.openInner? this.ToggleInner(): ()=>{};
  }

  ngOnChanges() {
    // console.log("Active item: " + this.activeItem);

    let activeNotBlank = this.activeItem !== "";
    let activeNotItem = this.activeItem !== this.title;
    let isFocused = activeNotBlank && activeNotItem;

    if((isFocused && this.state.innerVisble) || (this.state.innerVisble && !this.isVisible)) this.ToggleInner();

    //full opacity when active is blank || full opacity when is selected
    // therefore: less opacity when activeNotBlank && activeNOtItem
    this.state.fullOpacity = this.fullOpacity? true: !(activeNotBlank && activeNotItem);
    // console.log("Focus:" + isFocused);

    if(!activeNotItem && !this.state.innerVisble) this.state.innerVisble = true;
  }

  ToggleInner() {
    this.state.innerVisble = !this.state.innerVisble;
    
    this.activeItemChange.emit({
      title: this.title,
      open: this.state.innerVisble
    });
  }

  GetStyles(elem: string) {
    let styles = {};

    switch(elem) {
      case 'DROPDOWN-LI':
        styles = {
          'li-unfocused': !this.state.fullOpacity,
          'li-focused': this.state.fullOpacity,
          'opts-invisible': !this.isVisible,
          'opts-visible': this.isVisible,
          'opts-animate': true
        };
        break;
      case 'INNER-CONTENT':
        styles = {
          'opts-invisible-li': !this.state.innerVisble,
          'opts-visible': this.state.innerVisble,
          'opts-animate': true
        }
        break;
    }

    return styles;
  }

}
