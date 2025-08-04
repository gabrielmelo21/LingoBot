import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMissionComponent } from './daily-mission.component';

describe('DailyMissionComponent', () => {
  let component: DailyMissionComponent;
  let fixture: ComponentFixture<DailyMissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyMissionComponent]
    });
    fixture = TestBed.createComponent(DailyMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
