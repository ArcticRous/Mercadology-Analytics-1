import { TestBed } from '@angular/core/testing';

import { ComunicadoGuard } from './comunicado.guard';

describe('ComunicadoGuard', () => {
  let guard: ComunicadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ComunicadoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
