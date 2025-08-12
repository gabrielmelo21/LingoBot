import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorsSecretListeningComponent } from './doors-secret-listening.component';

describe('DoorsSecretListeningComponent', () => {
  let component: DoorsSecretListeningComponent;
  let fixture: ComponentFixture<DoorsSecretListeningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoorsSecretListeningComponent]
    });
    fixture = TestBed.createComponent(DoorsSecretListeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
