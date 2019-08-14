import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css', '../main.css']
})
export class CardComponent implements OnInit {

  @Input()
  increment = '';
  @Input()
  imageSrc = "";

  // Deprecated
  @Input()
  isWide = false;

  @Input()
  size: 'MIN'|'STD'|'WIDE'|'FOOTER' = 'STD';

  @Input()
  tint: 'LIGHT'|'DARK' = 'LIGHT';

  styles = {
    'card-min': this.size === 'MIN' || this.size === 'STD', 
    'card-std': this.size === 'STD', 
    'card-wide': this.size === 'WIDE',
    'card-footer': this.size === 'FOOTER',
    'card-flex-col': true,
    'bg-std': this.tint === 'LIGHT',
    'bg-alt': this.tint === 'DARK'
  }

  constructor() { }

  ngOnInit() {
    this.size = this.isWide? 'WIDE': this.size;

    this.styles = {
      'card-min': this.size === 'MIN',
      'card-std': this.size === 'STD', 
      'card-wide': this.size === 'WIDE',
      'card-footer': this.size === 'FOOTER',
      'card-flex-col': true,
      'bg-std': this.tint === 'LIGHT',
      'bg-alt': this.tint === 'DARK'
    };
  }

}
