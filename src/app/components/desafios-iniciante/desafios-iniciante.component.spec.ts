import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesafiosInicianteComponent } from './desafios-iniciante.component';

describe('DesafiosInicianteComponent', () => {
  let component: DesafiosInicianteComponent;
  let fixture: ComponentFixture<DesafiosInicianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesafiosInicianteComponent]
    });
    fixture = TestBed.createComponent(DesafiosInicianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
