import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LingobotCardComponent } from './lingobot-card.component';

describe('LingobotCardComponent', () => {
  let component: LingobotCardComponent;
  let fixture: ComponentFixture<LingobotCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LingobotCardComponent]
    });
    fixture = TestBed.createComponent(LingobotCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
