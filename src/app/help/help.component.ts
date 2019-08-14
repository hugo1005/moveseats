import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css', '../main.css']
})
export class HelpComponent implements OnInit {

  showHelp: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  OnToggle() {
    this.showHelp = !this.showHelp;
  }
}
