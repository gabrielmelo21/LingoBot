import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheosRoomListeningComponent } from './theos-room-listening.component';

describe('TheosRoomListeningComponent', () => {
  let component: TheosRoomListeningComponent;
  let fixture: ComponentFixture<TheosRoomListeningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheosRoomListeningComponent]
    });
    fixture = TestBed.createComponent(TheosRoomListeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
