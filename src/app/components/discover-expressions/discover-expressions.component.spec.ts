import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverExpressionsComponent } from './discover-expressions.component';

describe('DiscoverExpressionsComponent', () => {
  let component: DiscoverExpressionsComponent;
  let fixture: ComponentFixture<DiscoverExpressionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoverExpressionsComponent]
    });
    fixture = TestBed.createComponent(DiscoverExpressionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
