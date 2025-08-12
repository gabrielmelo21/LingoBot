import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GemasWarningComponent } from './gemas-warning.component';

describe('GemasWarningComponent', () => {
  let component: GemasWarningComponent;
  let fixture: ComponentFixture<GemasWarningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GemasWarningComponent]
    });
    fixture = TestBed.createComponent(GemasWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
