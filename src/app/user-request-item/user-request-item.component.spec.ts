import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequestItemComponent } from './user-request-item.component';

describe('UserRequestItemComponent', () => {
  let component: UserRequestItemComponent;
  let fixture: ComponentFixture<UserRequestItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRequestItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRequestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
