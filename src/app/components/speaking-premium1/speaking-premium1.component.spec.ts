import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakingPremium1Component } from './speaking-premium1.component';

describe('SpeakingPremium1Component', () => {
  let component: SpeakingPremium1Component;
  let fixture: ComponentFixture<SpeakingPremium1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpeakingPremium1Component]
    });
    fixture = TestBed.createComponent(SpeakingPremium1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
