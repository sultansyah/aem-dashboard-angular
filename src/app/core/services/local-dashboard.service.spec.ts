import { TestBed } from '@angular/core/testing';

import { LocalDashboardService } from './local-dashboard.service';

describe('LocalDashboardService', () => {
  let service: LocalDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
