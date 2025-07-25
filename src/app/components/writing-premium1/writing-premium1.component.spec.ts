import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingPremium1Component } from './writing-premium1.component';

describe('WritingPremium1Component', () => {
  let component: WritingPremium1Component;
  let fixture: ComponentFixture<WritingPremium1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WritingPremium1Component]
    });
    fixture = TestBed.createComponent(WritingPremium1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
