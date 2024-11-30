/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ClaseService', () => {
  let service: ClaseService;
  //let repository: Repository<ClaseEntity>;

  const mockClaseRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaseService,
        {
          provide: getRepositoryToken(ClaseEntity),
          useValue: mockClaseRepository,
        },
      ],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    //repository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
  });

  it('debería crear una clase (caso positivo)', async () => {
    const clase = {
      nombre: 'Matemáticas',
      codigo: '1234567890',
      creditos: 3,
    } as ClaseEntity;

    mockClaseRepository.save.mockResolvedValue(clase);

    const result = await service.crearClase(clase);
    expect(result).toEqual(clase);
    expect(mockClaseRepository.save).toHaveBeenCalledWith(clase);
  });

  it('debería lanzar excepción al crear una clase con código inválido (caso negativo)', async () => {
    const clase = {
      nombre: 'Matemáticas',
      codigo: 'INVALIDO', // Código no tiene 10 caracteres
      creditos: 3,
    } as ClaseEntity;

    await expect(service.crearClase(clase)).rejects.toThrow("The codigo must be exactly 10 characters long");
  });
});
