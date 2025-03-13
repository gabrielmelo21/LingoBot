import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1FreeComponent } from './step1-free.component';

describe('Step1FreeComponent', () => {
  let component: Step1FreeComponent;
  let fixture: ComponentFixture<Step1FreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Step1FreeComponent]
    });
    fixture = TestBed.createComponent(Step1FreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
