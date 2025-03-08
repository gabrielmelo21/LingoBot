import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrilhaDeEstudosComponent } from './trilha-de-estudos.component';

describe('TrilhaDeEstudosComponent', () => {
  let component: TrilhaDeEstudosComponent;
  let fixture: ComponentFixture<TrilhaDeEstudosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrilhaDeEstudosComponent]
    });
    fixture = TestBed.createComponent(TrilhaDeEstudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
