import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2FreeComponent } from './step2-free.component';

describe('Step2FreeComponent', () => {
  let component: Step2FreeComponent;
  let fixture: ComponentFixture<Step2FreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Step2FreeComponent]
    });
    fixture = TestBed.createComponent(Step2FreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
