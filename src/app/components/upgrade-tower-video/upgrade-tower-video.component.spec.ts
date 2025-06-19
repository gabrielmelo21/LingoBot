import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeTowerVideoComponent } from './upgrade-tower-video.component';

describe('UpgradeTowerVideoComponent', () => {
  let component: UpgradeTowerVideoComponent;
  let fixture: ComponentFixture<UpgradeTowerVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpgradeTowerVideoComponent]
    });
    fixture = TestBed.createComponent(UpgradeTowerVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
