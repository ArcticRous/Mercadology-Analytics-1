import { TestBed } from '@angular/core/testing';

import { PeticionGuard } from './peticion.guard';

describe('PeticionGuard', () => {
  let guard: PeticionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PeticionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
