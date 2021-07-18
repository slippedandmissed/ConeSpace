import { TestBed } from '@angular/core/testing';

import { GhostsService } from './ghosts.service';

describe('GhostsService', () => {
  let service: GhostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GhostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
