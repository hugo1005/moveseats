import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropoutItemComponent } from './dropout-item.component';

describe('DropoutItemComponent', () => {
  let component: DropoutItemComponent;
  let fixture: ComponentFixture<DropoutItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropoutItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropoutItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
