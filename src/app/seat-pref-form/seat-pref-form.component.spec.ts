import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatPrefFormComponent } from './seat-pref-form.component';

describe('SeatPrefFormComponent', () => {
  let component: SeatPrefFormComponent;
  let fixture: ComponentFixture<SeatPrefFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatPrefFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatPrefFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
