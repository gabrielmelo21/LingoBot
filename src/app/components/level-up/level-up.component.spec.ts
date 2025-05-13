import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelUpComponent } from './level-up.component';

describe('LevelUpComponent', () => {
  let component: LevelUpComponent;
  let fixture: ComponentFixture<LevelUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LevelUpComponent]
    });
    fixture = TestBed.createComponent(LevelUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
