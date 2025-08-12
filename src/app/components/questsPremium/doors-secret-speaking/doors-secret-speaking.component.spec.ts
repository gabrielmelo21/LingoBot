import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorsSecretSpeakingComponent } from './doors-secret-speaking.component';

describe('DoorsSecretSpeakingComponent', () => {
  let component: DoorsSecretSpeakingComponent;
  let fixture: ComponentFixture<DoorsSecretSpeakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoorsSecretSpeakingComponent]
    });
    fixture = TestBed.createComponent(DoorsSecretSpeakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
