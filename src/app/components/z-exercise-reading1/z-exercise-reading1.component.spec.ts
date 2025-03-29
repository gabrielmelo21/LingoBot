import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZExerciseReading1Component } from './z-exercise-reading1.component';

describe('ZExerciseReading1Component', () => {
  let component: ZExerciseReading1Component;
  let fixture: ComponentFixture<ZExerciseReading1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZExerciseReading1Component]
    });
    fixture = TestBed.createComponent(ZExerciseReading1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
