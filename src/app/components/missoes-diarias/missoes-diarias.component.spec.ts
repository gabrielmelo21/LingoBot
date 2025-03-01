import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissoesDiariasComponent } from './missoes-diarias.component';

describe('MissoesDiariasComponent', () => {
  let component: MissoesDiariasComponent;
  let fixture: ComponentFixture<MissoesDiariasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissoesDiariasComponent]
    });
    fixture = TestBed.createComponent(MissoesDiariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
