/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessError } from '../shared/errors/business-errors';

describe('ClaseService', () => {
  let service: ClaseService;

  const mockClaseRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
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
  });

  it('debería lanzar excepción al crear una clase con código inválido (caso negativo)', async () => {
    const clase = {
      nombre: 'Matemáticas',
      codigo: 'INVALID',
    } as ClaseEntity;

    await expect(service.crearClase(clase)).rejects.toHaveProperty(
      'message',
      'The codigo must be exactly 10 characters long',
    );
    await expect(service.crearClase(clase)).rejects.toHaveProperty(
      'type',
      BusinessError.PRECONDITION_FAILED,
    );
  });

  it('debería crear una clase correctamente (caso positivo)', async () => {
    const clase = {
      nombre: 'Historia',
      codigo: '1234567890',
    } as ClaseEntity;

    mockClaseRepository.save.mockResolvedValue(clase);

    const result = await service.crearClase(clase);
    expect(result).toEqual(clase);
    expect(mockClaseRepository.save).toHaveBeenCalledWith(clase);
  });

  it('debería lanzar excepción al buscar una clase por ID inexistente (caso negativo)', async () => {
    mockClaseRepository.findOne.mockResolvedValue(null);

    await expect(service.findClaseById(1)).rejects.toHaveProperty(
      'message',
      'The clase with the given id was not found',
    );
    await expect(service.findClaseById(1)).rejects.toHaveProperty(
      'type',
      BusinessError.NOT_FOUND,
    );
  });

  it('debería retornar una clase correctamente por ID (caso positivo)', async () => {
    const clase = {
      id: 1,
      nombre: 'Física',
      codigo: '0987654321',
    } as ClaseEntity;

    mockClaseRepository.findOne.mockResolvedValue(clase);

    const result = await service.findClaseById(1);
    expect(result).toEqual(clase);
    expect(mockClaseRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
