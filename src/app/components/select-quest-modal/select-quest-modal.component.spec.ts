import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectQuestModalComponent } from './select-quest-modal.component';

describe('SelectQuestModalComponent', () => {
  let component: SelectQuestModalComponent;
  let fixture: ComponentFixture<SelectQuestModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectQuestModalComponent]
    });
    fixture = TestBed.createComponent(SelectQuestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
