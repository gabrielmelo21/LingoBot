import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3FreeComponent } from './step3-free.component';

describe('Step3FreeComponent', () => {
  let component: Step3FreeComponent;
  let fixture: ComponentFixture<Step3FreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Step3FreeComponent]
    });
    fixture = TestBed.createComponent(Step3FreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
