import { TestBed } from '@angular/core/testing';

import { MufasService } from './mufas.service';

describe('MufasService', () => {
  let service: MufasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MufasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
