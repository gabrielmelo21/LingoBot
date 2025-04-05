import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MugTranslateComponent } from './mug-translate.component';

describe('MugTranslateComponent', () => {
  let component: MugTranslateComponent;
  let fixture: ComponentFixture<MugTranslateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MugTranslateComponent]
    });
    fixture = TestBed.createComponent(MugTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
