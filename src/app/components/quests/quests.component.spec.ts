import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestsComponent } from './quests.component';

describe('QuestsComponent', () => {
  let component: QuestsComponent;
  let fixture: ComponentFixture<QuestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestsComponent]
    });
    fixture = TestBed.createComponent(QuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
