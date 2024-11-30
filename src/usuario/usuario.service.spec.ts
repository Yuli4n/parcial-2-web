/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
//import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsuarioService', () => {
  let service: UsuarioService;
  // let repository: Repository<UsuarioEntity>;

  const mockUsuarioRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
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
    //repository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
  });

  it('debería crear un usuario (caso positivo)', async () => {
    const usuario = {
      cedula: 12345,
      nombre: 'Juan Perez',
      grupo: 'TICSW',
      extension: 12345678,
      rol: 'Profesor',
      jefe: null,
    } as UsuarioEntity;

    mockUsuarioRepository.save.mockResolvedValue(usuario);

    const result = await service.crearUsuario(usuario);
    expect(result).toEqual(usuario);
    expect(mockUsuarioRepository.save).toHaveBeenCalledWith(usuario);
  });

  it('debería lanzar excepción al crear un usuario con grupo inválido (caso negativo)', async () => {
    const usuario = {
      cedula: 12345,
      nombre: 'Juan Perez',
      grupo: 'INVALIDO',
      extension: 12345678,
      rol: 'Profesor',
      jefe: null,
    } as UsuarioEntity;

    await expect(service.crearUsuario(usuario)).rejects.toThrow('Invalid grupo de Investigación for Profesor');
  });
});
