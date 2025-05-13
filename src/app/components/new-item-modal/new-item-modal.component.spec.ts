import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItemModalComponent } from './new-item-modal.component';

describe('NewItemModalComponent', () => {
  let component: NewItemModalComponent;
  let fixture: ComponentFixture<NewItemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewItemModalComponent]
    });
    fixture = TestBed.createComponent(NewItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
