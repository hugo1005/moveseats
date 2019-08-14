import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css', '../main.css']
})
export class StatComponent implements OnInit {

  @Input()
  display: 'STD'|'HIGHLIGHT'|'LIGHT';

  @Input() 
  key: string = "";

  @Input() 
  sub: string = "";

  styles = {
    std: this.display === 'STD',
    highlight: this.display === 'HIGHLIGHT',
    light: this.display === 'LIGHT'
  }
    
  constructor() { }

  ngOnInit() {
    this.styles = this.UpdateStyles();
  }

  UpdateStyles() {
    return {
      std: this.display === 'STD',
      highlight: this.display === 'HIGHLIGHT',
      light: this.display === 'LIGHT'
    }
  }
}
