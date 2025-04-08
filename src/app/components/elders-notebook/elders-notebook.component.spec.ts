import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EldersNotebookComponent } from './elders-notebook.component';

describe('EldersNotebookComponent', () => {
  let component: EldersNotebookComponent;
  let fixture: ComponentFixture<EldersNotebookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EldersNotebookComponent]
    });
    fixture = TestBed.createComponent(EldersNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
