import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheosRoomSpeakingComponent } from './theos-room-speaking.component';

describe('TheosRoomSpeakingComponent', () => {
  let component: TheosRoomSpeakingComponent;
  let fixture: ComponentFixture<TheosRoomSpeakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheosRoomSpeakingComponent]
    });
    fixture = TestBed.createComponent(TheosRoomSpeakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
