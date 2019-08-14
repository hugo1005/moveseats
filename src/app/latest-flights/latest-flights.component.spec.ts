import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestFlightsComponent } from './latest-flights.component';

describe('LatestFlightsComponent', () => {
  let component: LatestFlightsComponent;
  let fixture: ComponentFixture<LatestFlightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestFlightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
