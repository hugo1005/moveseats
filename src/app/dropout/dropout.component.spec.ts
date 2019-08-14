import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropoutComponent } from './dropout.component';

describe('DropoutComponent', () => {
  let component: DropoutComponent;
  let fixture: ComponentFixture<DropoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
