import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeBarComponent } from './life-bar.component';

describe('LifeBarComponent', () => {
  let component: LifeBarComponent;
  let fixture: ComponentFixture<LifeBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LifeBarComponent]
    });
    fixture = TestBed.createComponent(LifeBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
