import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheosRoomWritingComponent } from './theos-room-writing.component';

describe('TheosRoomWritingComponent', () => {
  let component: TheosRoomWritingComponent;
  let fixture: ComponentFixture<TheosRoomWritingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheosRoomWritingComponent]
    });
    fixture = TestBed.createComponent(TheosRoomWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
