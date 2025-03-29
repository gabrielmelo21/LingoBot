import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZExerciseSpeaking1Component } from './z-exercise-speaking1.component';

describe('ZExerciseSpeaking1Component', () => {
  let component: ZExerciseSpeaking1Component;
  let fixture: ComponentFixture<ZExerciseSpeaking1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZExerciseSpeaking1Component]
    });
    fixture = TestBed.createComponent(ZExerciseSpeaking1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
