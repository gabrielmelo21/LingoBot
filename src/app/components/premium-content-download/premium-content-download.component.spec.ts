import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumContentDownloadComponent } from './premium-content-download.component';

describe('PremiumContentDownloadComponent', () => {
  let component: PremiumContentDownloadComponent;
  let fixture: ComponentFixture<PremiumContentDownloadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PremiumContentDownloadComponent]
    });
    fixture = TestBed.createComponent(PremiumContentDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
