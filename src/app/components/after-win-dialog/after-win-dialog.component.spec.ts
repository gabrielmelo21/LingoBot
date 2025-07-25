import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterWinDialogComponent } from './after-win-dialog.component';

describe('AfterWinDialogComponent', () => {
  let component: AfterWinDialogComponent;
  let fixture: ComponentFixture<AfterWinDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfterWinDialogComponent]
    });
    fixture = TestBed.createComponent(AfterWinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
