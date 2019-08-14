import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaProfileComponent } from './media-profile.component';

describe('MediaProfileComponent', () => {
  let component: MediaProfileComponent;
  let fixture: ComponentFixture<MediaProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
