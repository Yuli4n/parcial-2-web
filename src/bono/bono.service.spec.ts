/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { faker } from '@faker-js/faker';

describe('BonoService', () => {
  let service: BonoService;
  let repository: Repository<BonoEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let claseRepository: Repository<ClaseEntity>;
  let bonoList: BonoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonoService],
    }).compile();

    service = module.get<BonoService>(BonoService);
    repository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    claseRepository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    claseRepository.clear();
    usuarioRepository.clear();
    bonoList = [];

    const profesor = await usuarioRepository.save({
      cedula: faker.number.int(1000000),
      nombre: faker.person.firstName(),
      grupo: 'TICSW',
      extension: 12345678,
      rol: 'Profesor',
      jefe: null,
    });

    const clase = await claseRepository.save({
      id: 1,
      codigo: faker.string.alphanumeric(10),
      nombre: faker.lorem.word(),
      creditos: 3,
      usuario: profesor,
    });

    for (let i = 0; i < 3; i++) {
      const bono = await repository.save({
        monto: 1000 + i,
        calificacion: i % 2 === 0 ? 3 : 4.5,
        palabra: `bono-${i}`,
        usuario: profesor,
        clase: clase,
      });
      bonoList.push(bono);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debería crear un bono correctamente (caso positivo)', async () => {
    const profesor = await usuarioRepository.findOne({ where: { rol: 'Profesor' } });
    const clase = await claseRepository.findOne({ where: { } });

    const bono: BonoEntity = {
      monto: 2000,
      calificacion: 3.5,
      palabra: 'nuevo-bono',
      usuario: profesor,
      clase: clase,
    } as BonoEntity;

    const newBono = await service.crearBono(bono);
    expect(newBono).not.toBeNull();

    const storedBono = await repository.findOne({ where: { id: newBono.id }, relations: ['usuario', 'clase'] });
    expect(storedBono).not.toBeNull();
    expect(storedBono.monto).toEqual(bono.monto);
    expect(storedBono.calificacion).toEqual(bono.calificacion);
    expect(storedBono.palabra).toEqual(bono.palabra);
  });

  it('debería lanzar excepción al crear un bono con usuario no profesor (caso negativo)', async () => {
    const usuario: UsuarioEntity = {
        id: 1,
        cedula: 12345,
        nombre: 'Juan Perez',
        grupo: 'A',
        extension: 12345678,
        rol: 'Decana',
        jefe: null,
    } as UsuarioEntity;

    const clase: ClaseEntity = {
        id: 1,
        codigo: faker.string.alphanumeric(10),
        nombre: faker.lorem.word(),
        creditos: 3,
        usuario: usuario,
    } as ClaseEntity;

    const bono: BonoEntity = {
        id: 1,
        monto: 2000,
        calificacion: 3.5,
        palabra: 'nuevo-bono',
        usuario: usuario,
        clase: clase,
    } as BonoEntity;

    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.crearBono(bono)).rejects.toHaveProperty('message', 'The user must have the role of professor');
});
  

  it('debería eliminar un bono con calificación válida (caso positivo)', async () => {
    const bono = bonoList[0];
    await service.deleteBono(bono.id);

    const deletedBono = await repository.findOne({ where: { id: bono.id } });
    expect(deletedBono).toBeNull();
  });

  it('debería lanzar excepción al eliminar un bono con calificación mayor a 4 (caso negativo)', async () => {
    const bono = bonoList.find((b) => b.calificacion > 4);
    if (!bono) throw new Error('No se encontró un bono con calificación mayor a 4');

    await expect(service.deleteBono(bono.id)).rejects.toHaveProperty(
        'message',
        'The bono has a calification greater than 4',
    );
});

it('debería lanzar excepción al buscar un bono con código inexistente', async () => {
  await expect(service.findBonoByCodigo('inexistente')).rejects.toHaveProperty(
      'message',
      'The bono with the given class code was not found',
  );
});

});
