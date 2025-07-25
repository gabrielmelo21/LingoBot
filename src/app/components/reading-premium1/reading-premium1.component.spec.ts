import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingPremium1Component } from './reading-premium1.component';

describe('ReadingPremium1Component', () => {
  let component: ReadingPremium1Component;
  let fixture: ComponentFixture<ReadingPremium1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadingPremium1Component]
    });
    fixture = TestBed.createComponent(ReadingPremium1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
