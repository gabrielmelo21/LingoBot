import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFeedbackComponent } from './modal-feedback.component';

describe('ModalFeedbackComponent', () => {
  let component: ModalFeedbackComponent;
  let fixture: ComponentFixture<ModalFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFeedbackComponent]
    });
    fixture = TestBed.createComponent(ModalFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
