import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeningPremium1Component } from './listening-premium1.component';

describe('ListeningPremium1Component', () => {
  let component: ListeningPremium1Component;
  let fixture: ComponentFixture<ListeningPremium1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeningPremium1Component]
    });
    fixture = TestBed.createComponent(ListeningPremium1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
