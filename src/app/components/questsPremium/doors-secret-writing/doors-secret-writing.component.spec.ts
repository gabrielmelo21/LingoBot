import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorsSecretWritingComponent } from './doors-secret-writing.component';

describe('DoorsSecretWritingComponent', () => {
  let component: DoorsSecretWritingComponent;
  let fixture: ComponentFixture<DoorsSecretWritingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoorsSecretWritingComponent]
    });
    fixture = TestBed.createComponent(DoorsSecretWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
