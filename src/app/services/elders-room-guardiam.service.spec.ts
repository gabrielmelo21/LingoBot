import { TestBed } from '@angular/core/testing';

import { EldersRoomGuardiamService } from './elders-room-guardiam.service';

describe('EldersRoomGuardiamService', () => {
  let service: EldersRoomGuardiamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EldersRoomGuardiamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
