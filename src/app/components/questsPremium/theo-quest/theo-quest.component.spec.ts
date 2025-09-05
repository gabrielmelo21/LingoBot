import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheoQuestComponent } from './theo-quest.component';

describe('TheoQuestComponent', () => {
  let component: TheoQuestComponent;
  let fixture: ComponentFixture<TheoQuestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheoQuestComponent]
    });
    fixture = TestBed.createComponent(TheoQuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
