import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZExerciseWriting1Component } from './z-exercise-writing1.component';

describe('ZExerciseWriting1Component', () => {
  let component: ZExerciseWriting1Component;
  let fixture: ComponentFixture<ZExerciseWriting1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZExerciseWriting1Component]
    });
    fixture = TestBed.createComponent(ZExerciseWriting1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
