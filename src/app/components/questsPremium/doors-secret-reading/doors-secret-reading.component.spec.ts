import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorsSecretReadingComponent } from './doors-secret-reading.component';

describe('DoorsSecretReadingComponent', () => {
  let component: DoorsSecretReadingComponent;
  let fixture: ComponentFixture<DoorsSecretReadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoorsSecretReadingComponent]
    });
    fixture = TestBed.createComponent(DoorsSecretReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
