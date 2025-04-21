import { TestBed } from '@angular/core/testing';

import { TLUService } from './tlu.service';

describe('TLUService', () => {
  let service: TLUService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TLUService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
