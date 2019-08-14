import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyTabsComponent } from './key-tabs.component';

describe('KeyTabsComponent', () => {
  let component: KeyTabsComponent;
  let fixture: ComponentFixture<KeyTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
