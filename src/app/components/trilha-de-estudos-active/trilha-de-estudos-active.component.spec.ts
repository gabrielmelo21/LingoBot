import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrilhaDeEstudosActiveComponent } from './trilha-de-estudos-active.component';

describe('TrilhaDeEstudosActiveComponent', () => {
  let component: TrilhaDeEstudosActiveComponent;
  let fixture: ComponentFixture<TrilhaDeEstudosActiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrilhaDeEstudosActiveComponent]
    });
    fixture = TestBed.createComponent(TrilhaDeEstudosActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
