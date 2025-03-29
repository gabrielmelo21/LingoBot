import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZExerciseListening1Component } from './z-exercise-listening1.component';

describe('ZExerciseListening1Component', () => {
  let component: ZExerciseListening1Component;
  let fixture: ComponentFixture<ZExerciseListening1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZExerciseListening1Component]
    });
    fixture = TestBed.createComponent(ZExerciseListening1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
