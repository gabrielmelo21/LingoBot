import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabelTowerComponent } from './babel-tower.component';

describe('BabelTowerComponent', () => {
  let component: BabelTowerComponent;
  let fixture: ComponentFixture<BabelTowerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BabelTowerComponent]
    });
    fixture = TestBed.createComponent(BabelTowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
