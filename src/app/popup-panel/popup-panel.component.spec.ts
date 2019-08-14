import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupPanelComponent } from './popup-panel.component';

describe('PopupPanelComponent', () => {
  let component: PopupPanelComponent;
  let fixture: ComponentFixture<PopupPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
