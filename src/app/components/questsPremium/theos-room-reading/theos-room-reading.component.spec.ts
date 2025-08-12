import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheosRoomReadingComponent } from './theos-room-reading.component';

describe('TheosRoomReadingComponent', () => {
  let component: TheosRoomReadingComponent;
  let fixture: ComponentFixture<TheosRoomReadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheosRoomReadingComponent]
    });
    fixture = TestBed.createComponent(TheosRoomReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
