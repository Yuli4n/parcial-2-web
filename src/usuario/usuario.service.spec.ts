/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessError } from '../shared/errors/business-errors';

describe('UsuarioService', () => {
  let service: UsuarioService;

  const mockUsuarioRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(UsuarioEntity),
          useValue: mockUsuarioRepository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('debería lanzar excepción al crear un usuario con grupo inválido (caso negativo)', async () => {
    const usuario = {
      cedula: 12345,
      nombre: 'Juan Perez',
      grupo: 'INVALIDO',
      extension: 12345678,
      rol: 'Profesor',
    } as UsuarioEntity;

    await expect(service.crearUsuario(usuario)).rejects.toHaveProperty(
      'message',
      'Invalid grupo de Investigación for Profesor',
    );
    await expect(service.crearUsuario(usuario)).rejects.toHaveProperty(
      'type',
      BusinessError.PRECONDITION_FAILED,
    );
  });

  it('debería crear un usuario correctamente (caso positivo)', async () => {
    const usuario = {
      cedula: 12345,
      nombre: 'Maria López',
      grupo: 'TICSW',
      extension: 12345678,
      rol: 'Profesor',
    } as UsuarioEntity;

    mockUsuarioRepository.save.mockResolvedValue(usuario);

    const result = await service.crearUsuario(usuario);
    expect(result).toEqual(usuario);
    expect(mockUsuarioRepository.save).toHaveBeenCalledWith(usuario);
  });

  it('debería lanzar excepción al buscar un usuario inexistente por ID (caso negativo)', async () => {
    mockUsuarioRepository.findOne.mockResolvedValue(null);

    await expect(service.findUsuarioById(1)).rejects.toHaveProperty(
      'message',
      'The usuario with the given id was not found',
    );
    await expect(service.findUsuarioById(1)).rejects.toHaveProperty(
      'type',
      BusinessError.NOT_FOUND,
    );
  });

  it('debería retornar un usuario correctamente por ID (caso positivo)', async () => {
    const usuario = {
      id: 1,
      cedula: 67890,
      nombre: 'Carlos Pérez',
      grupo: 'IMAGINE',
      rol: 'Profesor',
    } as UsuarioEntity;

    mockUsuarioRepository.findOne.mockResolvedValue(usuario);

    const result = await service.findUsuarioById(1);
    expect(result).toEqual(usuario);
    expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('debería lanzar excepción al eliminar un usuario con rol Decana (caso negativo)', async () => {
    const usuario = {
      id: 1,
      cedula: 11111,
      nombre: 'Diana Gómez',
      grupo: 'TICSW',
      rol: 'Decana',
      bonos: [],
    } as UsuarioEntity;

    mockUsuarioRepository.findOne.mockResolvedValue(usuario);

    await expect(service.eliminarUsuario(1)).rejects.toHaveProperty(
      'message',
      'A usuario with rol Decana cannot be deleted',
    );
    await expect(service.eliminarUsuario(1)).rejects.toHaveProperty(
      'type',
      BusinessError.PRECONDITION_FAILED,
    );
  });

  it('debería lanzar excepción al eliminar un usuario con bonos asociados (caso negativo)', async () => {
    const usuario = {
      id: 2,
      cedula: 22222,
      nombre: 'Luis Méndez',
      grupo: 'COMIT',
      rol: 'Profesor',
      bonos: [{}],
    } as UsuarioEntity;

    mockUsuarioRepository.findOne.mockResolvedValue(usuario);

    await expect(service.eliminarUsuario(2)).rejects.toHaveProperty(
      'message',
      'A usuario with associated bonos cannot be deleted',
    );
    await expect(service.eliminarUsuario(2)).rejects.toHaveProperty(
      'type',
      BusinessError.PRECONDITION_FAILED,
    );
  });

  it('debería eliminar un usuario correctamente (caso positivo)', async () => {
    const usuario = {
      id: 3,
      cedula: 33333,
      nombre: 'Ana Torres',
      grupo: 'IMAGINE',
      rol: 'Profesor',
      bonos: [],
    } as UsuarioEntity;

    mockUsuarioRepository.findOne.mockResolvedValue(usuario);

    await service.eliminarUsuario(3);

    expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({ where: { id: 3 }, relations: ['bonos'] });
    expect(mockUsuarioRepository.remove).toHaveBeenCalledWith(usuario);
  });
});
