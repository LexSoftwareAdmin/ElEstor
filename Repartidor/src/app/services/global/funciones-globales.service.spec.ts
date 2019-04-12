import { TestBed } from '@angular/core/testing';

import { FuncionesGlobalesService } from './funciones-globales.service';

describe('FuncionesGlobalesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FuncionesGlobalesService = TestBed.get(FuncionesGlobalesService);
    expect(service).toBeTruthy();
  });
});
