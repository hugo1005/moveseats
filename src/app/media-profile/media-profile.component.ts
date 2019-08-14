import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-media-profile',
  templateUrl: './media-profile.component.html',
  styleUrls: ['./media-profile.component.css', '../main.css']
})
export class MediaProfileComponent implements OnInit {

  @Input()
  profileName: string = "Profile";
  @Input()
  imgRef: string = "./assets/profile-default.png";
  @Input()
  bevel: boolean = true;

  stylesContainer = {
    "card-flex-row": true,
    "media-profile": true
  }

  stylesPicture = {
    "profile-bevel": this.bevel,
    "picture-container": true
  }

  constructor() { }

  ngOnInit() {
  }

}
