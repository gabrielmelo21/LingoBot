import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargedComponent } from './charged.component';

describe('ChargedComponent', () => {
  let component: ChargedComponent;
  let fixture: ComponentFixture<ChargedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChargedComponent]
    });
    fixture = TestBed.createComponent(ChargedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
