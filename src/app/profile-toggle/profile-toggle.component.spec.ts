import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileToggleComponent } from './profile-toggle.component';

describe('ProfileToggleComponent', () => {
  let component: ProfileToggleComponent;
  let fixture: ComponentFixture<ProfileToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
