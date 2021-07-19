import { TestBed } from '@angular/core/testing';

import { HeadpatService } from './headpat.service';

describe('HeadpatService', () => {
  let service: HeadpatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeadpatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
