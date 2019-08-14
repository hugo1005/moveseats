import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-popup-panel',
  templateUrl: './popup-panel.component.html',
  styleUrls: ['./popup-panel.component.css', '../main.css']
})
export class PopupPanelComponent implements OnInit {

  state = {
    visibility : {
      marker: document.getElementById('popup-marker'),
      popup: document.getElementById('search-options'),
      window: window.innerHeight,
      offset: 200,
      isVisible: false
    }
  }

  constructor() { }

  ngOnInit() {
    this.state.visibility.popup = document.getElementById('search-options');
    this.state.visibility.marker = document.getElementById('popup-marker');
  }

  @HostListener('window:scroll', ['$event'])
  UpdateScrollState() {
    
    let deltaY = this.state.visibility.marker.getBoundingClientRect().top + this.state.visibility.offset;

    this.state.visibility.isVisible = (deltaY < this.state.visibility.window);
  }

  GetStyles() {
    let styles = {
      'popup': true,
      'popup-transition': true,
      'popup-invisible': !this.state.visibility.isVisible,
      'popup-visible': this.state.visibility.isVisible,
    }

    return styles;
  }

}
